import * as React from 'react';

import {
  initializeComponentRef,
  FocusRects,
  Async,
  KeyCodes,
  elementContains,
  getRTLSafeKeyCode,
  IRenderFunction,
  classNamesFunction,
  memoizeFunction
} from '../../Utilities';
import {
  CheckboxVisibility,
  ColumnActionsMode,
  ConstrainMode,
  DetailsListLayoutMode,
  IColumn,
  IDetailsList,
  IDetailsListProps,
  IDetailsListStyles,
  IDetailsListStyleProps,
  IDetailsGroupRenderProps,
  ColumnDragEndLocation
} from '../DetailsList/DetailsList.types';
import { DetailsHeader } from '../DetailsList/DetailsHeader';
import { IDetailsHeader, SelectAllVisibility, IDetailsHeaderProps, IColumnReorderHeaderProps } from '../DetailsList/DetailsHeader.types';
import { IDetailsFooterProps } from '../DetailsList/DetailsFooter.types';
import { DetailsRowBase } from '../DetailsList/DetailsRow.base';
import { DetailsRow } from '../DetailsList/DetailsRow';
import { IDetailsRowProps } from '../DetailsList/DetailsRow.types';
import { IFocusZone, FocusZone, FocusZoneDirection } from '../../FocusZone';
import { IObjectWithKey, ISelection, Selection, SelectionMode, SelectionZone } from '../../utilities/selection/index';

import { DragDropHelper } from '../../utilities/dragdrop/DragDropHelper';
import { IGroupedList, GroupedList, IGroupDividerProps, IGroupRenderProps } from '../../GroupedList';
import { List, IListProps, ScrollToMode } from '../../List';
import { withViewport } from '../../utilities/decorators/withViewport';
import { GetGroupCount } from '../../utilities/groupedList/GroupedListUtility';
import { DEFAULT_CELL_STYLE_PROPS } from './DetailsRow.styles';
import { CHECK_CELL_WIDTH as CHECKBOX_WIDTH } from './DetailsRowCheck.styles';
// For every group level there is a GroupSpacer added. Importing this const to have the source value in one place.
import { SPACER_WIDTH as GROUP_EXPAND_WIDTH } from '../GroupedList/GroupSpacer';
import { composeRenderFunction } from '@uifabric/utilities';

const getClassNames = classNamesFunction<IDetailsListStyleProps, IDetailsListStyles>();

export interface IDetailsListState {
  focusedItemIndex: number;
  lastWidth?: number;
  lastSelectionMode?: SelectionMode;
  adjustedColumns: IColumn[];
  isCollapsed?: boolean;
  isSizing?: boolean;
  isDropping?: boolean;
  isSomeGroupExpanded?: boolean;
  /**
   * A unique object used to force-update the List when it changes.
   */
  version: {};
}

const MIN_COLUMN_WIDTH = 100; // this is the global min width

const DEFAULT_RENDERED_WINDOWS_AHEAD = 2;
const DEFAULT_RENDERED_WINDOWS_BEHIND = 2;

@withViewport
export class DetailsListBase extends React.Component<IDetailsListProps, IDetailsListState> implements IDetailsList {
  public static defaultProps = {
    layoutMode: DetailsListLayoutMode.justified,
    selectionMode: SelectionMode.multiple,
    constrainMode: ConstrainMode.horizontalConstrained,
    checkboxVisibility: CheckboxVisibility.onHover,
    isHeaderVisible: true,
    compact: false,
    useFastIcons: true
  };

  // References
  private _async: Async;
  private _root = React.createRef<HTMLDivElement>();
  private _header = React.createRef<IDetailsHeader>();
  private _groupedList = React.createRef<IGroupedList>();
  private _list = React.createRef<List>();
  private _focusZone = React.createRef<IFocusZone>();
  private _selectionZone = React.createRef<SelectionZone>();

  private _selection: ISelection;
  private _activeRows: { [key: string]: DetailsRowBase };
  private _dragDropHelper: DragDropHelper | undefined;
  private _initialFocusedIndex: number | undefined;

  private _columnOverrides: {
    [key: string]: IColumn;
  };

  private _sumColumnWidths = memoizeFunction((columns: IColumn[]) => {
    let totalWidth: number = 0;

    columns.forEach((column: IColumn) => (totalWidth += column.calculatedWidth || column.minWidth));

    return totalWidth;
  });

  constructor(props: IDetailsListProps) {
    super(props);

    initializeComponentRef(this);
    this._async = new Async(this);

    this._activeRows = {};
    this._columnOverrides = {};

    this.state = {
      focusedItemIndex: -1,
      lastWidth: 0,
      adjustedColumns: this._getAdjustedColumns(props),
      isSizing: false,
      isDropping: false,
      isCollapsed: props.groupProps && props.groupProps.isAllGroupsCollapsed,
      isSomeGroupExpanded: props.groupProps && !props.groupProps.isAllGroupsCollapsed,
      version: {}
    };

    this._selection =
      props.selection ||
      new Selection({
        onSelectionChanged: undefined,
        getKey: props.getKey,
        selectionMode: props.selectionMode
      });

    if (!this.props.disableSelectionZone) {
      this._selection.setItems(props.items as IObjectWithKey[], false);
    }

    this._dragDropHelper = props.dragDropEvents
      ? new DragDropHelper({
          selection: this._selection,
          minimumPixelsForDrag: props.minimumPixelsForDrag
        })
      : undefined;
    this._initialFocusedIndex = props.initialFocusedIndex;
  }

  public scrollToIndex(index: number, measureItem?: (itemIndex: number) => number, scrollToMode?: ScrollToMode): void {
    this._list.current && this._list.current.scrollToIndex(index, measureItem, scrollToMode);
    this._groupedList.current && this._groupedList.current.scrollToIndex(index, measureItem, scrollToMode);
  }

  public focusIndex(
    index: number,
    forceIntoFirstElement: boolean = false,
    measureItem?: (itemIndex: number) => number,
    scrollToMode?: ScrollToMode
  ): void {
    const item = this.props.items[index];
    if (item) {
      this.scrollToIndex(index, measureItem, scrollToMode);

      const itemKey = this._getItemKey(item, index);
      const row = this._activeRows[itemKey];
      if (row) {
        this._setFocusToRow(row, forceIntoFirstElement);
      }
    }
  }

  public getStartItemIndexInView(): number {
    if (this._list && this._list.current) {
      return this._list.current.getStartItemIndexInView();
    } else if (this._groupedList && this._groupedList.current) {
      return this._groupedList.current.getStartItemIndexInView();
    }
    return 0;
  }

  public componentWillUnmount(): void {
    if (this._dragDropHelper) {
      // TODO If the DragDropHelper was passed via props, this will dispose it, which is incorrect behavior.
      this._dragDropHelper.dispose();
    }
    this._async.dispose();
  }

  public componentDidUpdate(prevProps: IDetailsListProps, prevState: IDetailsListState) {
    if (this._initialFocusedIndex !== undefined) {
      const item = this.props.items[this._initialFocusedIndex];
      if (item) {
        const itemKey = this._getItemKey(item, this._initialFocusedIndex);
        const row = this._activeRows[itemKey];
        if (row) {
          this._setFocusToRowIfPending(row);
        }
      }
    }

    if (
      this.props.items !== prevProps.items &&
      this.props.items.length > 0 &&
      this.state.focusedItemIndex !== -1 &&
      !elementContains(this._root.current, document.activeElement as HTMLElement, false)
    ) {
      // Item set has changed and previously-focused item is gone.
      // Set focus to item at index of previously-focused item if it is in range,
      // else set focus to the last item.
      const index = this.state.focusedItemIndex < this.props.items.length ? this.state.focusedItemIndex : this.props.items.length - 1;
      const item = this.props.items[index];
      const itemKey = this._getItemKey(item, this.state.focusedItemIndex);
      const row = this._activeRows[itemKey];
      if (row) {
        this._setFocusToRow(row);
      } else {
        this._initialFocusedIndex = index;
      }
    }
    if (this.props.onDidUpdate) {
      this.props.onDidUpdate(this);
    }
  }

  // tslint:disable-next-line function-name
  public UNSAFE_componentWillReceiveProps(newProps: IDetailsListProps): void {
    const {
      checkboxVisibility,
      items,
      setKey,
      selectionMode = this._selection.mode,
      columns,
      viewport,
      compact,
      dragDropEvents
    } = this.props;
    const { isAllGroupsCollapsed = undefined } = this.props.groupProps || {};
    const newViewportWidth = (newProps.viewport && newProps.viewport.width) || 0;
    const oldViewportWidth = (viewport && viewport.width) || 0;
    const shouldResetSelection = newProps.setKey !== setKey || newProps.setKey === undefined;
    let shouldForceUpdates = false;

    if (newProps.layoutMode !== this.props.layoutMode) {
      shouldForceUpdates = true;
    }

    if (shouldResetSelection) {
      this._initialFocusedIndex = newProps.initialFocusedIndex;
      // reset focusedItemIndex when setKey changes
      this.setState({
        focusedItemIndex: this._initialFocusedIndex !== undefined ? this._initialFocusedIndex : -1
      });
    }

    if (!this.props.disableSelectionZone && newProps.items !== items) {
      this._selection.setItems(newProps.items, shouldResetSelection);
    }

    if (
      newProps.checkboxVisibility !== checkboxVisibility ||
      newProps.columns !== columns ||
      newViewportWidth !== oldViewportWidth ||
      newProps.compact !== compact
    ) {
      shouldForceUpdates = true;
    }

    this._adjustColumns(newProps, true);

    if (newProps.selectionMode !== selectionMode) {
      shouldForceUpdates = true;
    }

    if (isAllGroupsCollapsed === undefined && newProps.groupProps && newProps.groupProps.isAllGroupsCollapsed !== undefined) {
      this.setState({
        isCollapsed: newProps.groupProps.isAllGroupsCollapsed,
        isSomeGroupExpanded: !newProps.groupProps.isAllGroupsCollapsed
      });
    }

    if (newProps.dragDropEvents !== dragDropEvents) {
      this._dragDropHelper && this._dragDropHelper.dispose();
      this._dragDropHelper = newProps.dragDropEvents
        ? new DragDropHelper({
            selection: this._selection,
            minimumPixelsForDrag: newProps.minimumPixelsForDrag
          })
        : undefined;
      shouldForceUpdates = true;
    }

    if (shouldForceUpdates) {
      this.setState({
        version: {}
      });
    }
  }

  public render(): JSX.Element {
    const {
      ariaLabelForListHeader,
      ariaLabelForSelectAllCheckbox,
      ariaLabelForSelectionColumn,
      className,
      checkboxVisibility,
      compact,
      constrainMode,
      dragDropEvents,
      groups,
      groupProps,
      indentWidth,
      items,
      isPlaceholderData,
      isHeaderVisible,
      layoutMode,
      onItemInvoked,
      onItemContextMenu,
      onColumnHeaderClick,
      onColumnHeaderContextMenu,
      selectionMode = this._selection.mode,
      selectionPreservedOnEmptyClick,
      selectionZoneProps,
      ariaLabel,
      ariaLabelForGrid,
      rowElementEventMap,
      shouldApplyApplicationRole = false,
      getKey,
      listProps,
      usePageCache,
      onShouldVirtualize,
      viewport,
      minimumPixelsForDrag,
      getGroupHeight,
      styles,
      theme,
      cellStyleProps = DEFAULT_CELL_STYLE_PROPS,
      onRenderCheckbox,
      useFastIcons
    } = this.props;
    const { adjustedColumns, isCollapsed, isSizing, isSomeGroupExpanded } = this.state;
    const { _selection: selection, _dragDropHelper: dragDropHelper } = this;
    const groupNestingDepth = this._getGroupNestingDepth();
    const additionalListProps: IListProps = {
      renderedWindowsAhead: isSizing ? 0 : DEFAULT_RENDERED_WINDOWS_AHEAD,
      renderedWindowsBehind: isSizing ? 0 : DEFAULT_RENDERED_WINDOWS_BEHIND,
      getKey,
      version: this.state.version,
      ...listProps
    };
    let selectAllVisibility = SelectAllVisibility.none; // for SelectionMode.none
    if (selectionMode === SelectionMode.single) {
      selectAllVisibility = SelectAllVisibility.hidden;
    }
    if (selectionMode === SelectionMode.multiple) {
      // if isCollapsedGroupSelectVisible is false, disable select all when the list has all collapsed groups
      let isCollapsedGroupSelectVisible = groupProps && groupProps.headerProps && groupProps.headerProps.isCollapsedGroupSelectVisible;
      if (isCollapsedGroupSelectVisible === undefined) {
        isCollapsedGroupSelectVisible = true;
      }
      const isSelectAllVisible = isCollapsedGroupSelectVisible || !groups || isSomeGroupExpanded;
      selectAllVisibility = isSelectAllVisible ? SelectAllVisibility.visible : SelectAllVisibility.hidden;
    }

    if (checkboxVisibility === CheckboxVisibility.hidden) {
      selectAllVisibility = SelectAllVisibility.none;
    }

    const { onRenderDetailsHeader = this._onRenderDetailsHeader, onRenderDetailsFooter = this._onRenderDetailsFooter } = this.props;

    const detailsFooterProps = this._getDetailsFooterProps();
    const columnReorderProps = this._getColumnReorderProps();

    const rowCount = (isHeaderVisible ? 1 : 0) + GetGroupCount(groups) + (items ? items.length : 0);

    const classNames = getClassNames(styles, {
      theme: theme!,
      compact,
      isFixed: layoutMode === DetailsListLayoutMode.fixedColumns,
      isHorizontalConstrained: constrainMode === ConstrainMode.horizontalConstrained,
      className
    });

    const list = groups ? (
      <GroupedList
        componentRef={this._groupedList}
        groups={groups}
        groupProps={groupProps ? this._getGroupProps(groupProps) : undefined}
        items={items}
        onRenderCell={this._onRenderCell}
        selection={selection}
        selectionMode={checkboxVisibility !== CheckboxVisibility.hidden ? selectionMode : SelectionMode.none}
        dragDropEvents={dragDropEvents}
        dragDropHelper={dragDropHelper}
        eventsToRegister={rowElementEventMap}
        listProps={additionalListProps}
        onGroupExpandStateChanged={this._onGroupExpandStateChanged}
        usePageCache={usePageCache}
        onShouldVirtualize={onShouldVirtualize}
        getGroupHeight={getGroupHeight}
        compact={compact}
      />
    ) : (
      <List
        ref={this._list}
        role="presentation"
        items={items}
        onRenderCell={this._onRenderListCell(0)}
        usePageCache={usePageCache}
        onShouldVirtualize={onShouldVirtualize}
        {...additionalListProps}
      />
    );

    return (
      // If shouldApplyApplicationRole is true, role application will be applied to make arrow keys work
      // with JAWS.
      <div
        ref={this._root}
        className={classNames.root}
        data-automationid="DetailsList"
        data-is-scrollable="false"
        aria-label={ariaLabel}
        {...(shouldApplyApplicationRole ? { role: 'application' } : {})}
      >
        <div
          role="grid"
          aria-label={ariaLabelForGrid}
          aria-rowcount={isPlaceholderData ? -1 : rowCount}
          aria-colcount={(selectAllVisibility !== SelectAllVisibility.none ? 1 : 0) + (adjustedColumns ? adjustedColumns.length : 0)}
          aria-readonly="true"
          aria-busy={isPlaceholderData}
        >
          <div onKeyDown={this._onHeaderKeyDown} role="presentation" className={classNames.headerWrapper}>
            {isHeaderVisible &&
              onRenderDetailsHeader(
                {
                  componentRef: this._header,
                  selectionMode: selectionMode,
                  layoutMode: layoutMode!,
                  selection: selection,
                  columns: adjustedColumns,
                  onColumnClick: onColumnHeaderClick,
                  onColumnContextMenu: onColumnHeaderContextMenu,
                  onColumnResized: this._onColumnResized,
                  onColumnIsSizingChanged: this._onColumnIsSizingChanged,
                  onColumnAutoResized: this._onColumnAutoResized,
                  groupNestingDepth: groupNestingDepth,
                  isAllCollapsed: isCollapsed,
                  onToggleCollapseAll: this._onToggleCollapse,
                  ariaLabel: ariaLabelForListHeader,
                  ariaLabelForSelectAllCheckbox: ariaLabelForSelectAllCheckbox,
                  ariaLabelForSelectionColumn: ariaLabelForSelectionColumn,
                  selectAllVisibility: selectAllVisibility,
                  collapseAllVisibility: groupProps && groupProps.collapseAllVisibility,
                  viewport: viewport,
                  columnReorderProps: columnReorderProps,
                  minimumPixelsForDrag: minimumPixelsForDrag,
                  cellStyleProps: cellStyleProps,
                  checkboxVisibility,
                  indentWidth,
                  onRenderDetailsCheckbox: onRenderCheckbox,
                  rowWidth: this._sumColumnWidths(this.state.adjustedColumns),
                  useFastIcons
                },
                this._onRenderDetailsHeader
              )}
          </div>
          <div onKeyDown={this._onContentKeyDown} role="presentation" className={classNames.contentWrapper}>
            <FocusZone
              componentRef={this._focusZone}
              className={classNames.focusZone}
              direction={FocusZoneDirection.vertical}
              isInnerZoneKeystroke={this.isRightArrow}
              onActiveElementChanged={this._onActiveRowChanged}
              onBlur={this._onBlur}
            >
              {!this.props.disableSelectionZone ? (
                <SelectionZone
                  ref={this._selectionZone}
                  selection={selection}
                  selectionPreservedOnEmptyClick={selectionPreservedOnEmptyClick}
                  selectionMode={selectionMode}
                  onItemInvoked={onItemInvoked}
                  onItemContextMenu={onItemContextMenu}
                  enterModalOnTouch={this.props.enterModalSelectionOnTouch}
                  {...(selectionZoneProps || {})}
                >
                  {list}
                </SelectionZone>
              ) : (
                list
              )}
            </FocusZone>
          </div>
          {onRenderDetailsFooter(
            {
              ...detailsFooterProps
            },
            this._onRenderDetailsFooter
          )}
        </div>
        <FocusRects />
      </div>
    );
  }

  public forceUpdate(): void {
    super.forceUpdate();
    this._forceListUpdates();
  }

  protected _onRenderRow = (props: IDetailsRowProps, defaultRender?: IRenderFunction<IDetailsRowProps>): JSX.Element => {
    return <DetailsRow {...props} />;
  };

  private _onRenderDetailsHeader = (
    detailsHeaderProps: IDetailsHeaderProps,
    defaultRender?: IRenderFunction<IDetailsHeaderProps>
  ): JSX.Element => {
    return <DetailsHeader {...detailsHeaderProps} />;
  };

  private _onRenderDetailsFooter = (
    detailsFooterProps: IDetailsFooterProps,
    defaultRender?: IRenderFunction<IDetailsFooterProps>
  ): JSX.Element | null => {
    return null;
  };

  private _onRenderListCell = (nestingDepth: number): ((item: any, itemIndex: number) => React.ReactNode) => {
    return (item: any, itemIndex: number): React.ReactNode => {
      return this._onRenderCell(nestingDepth, item, itemIndex);
    };
  };

  private _onRenderCell = (nestingDepth: number, item: any, index: number): React.ReactNode => {
    const {
      compact,
      dragDropEvents,
      rowElementEventMap: eventsToRegister,
      onRenderMissingItem,
      onRenderItemColumn,
      getCellValueKey,
      selectionMode = this._selection.mode,
      viewport,
      checkboxVisibility,
      getRowAriaLabel,
      getRowAriaDescribedBy,
      checkButtonAriaLabel,
      checkboxCellClassName,
      groupProps,
      useReducedRowRenderer,
      indentWidth,
      cellStyleProps = DEFAULT_CELL_STYLE_PROPS,
      onRenderCheckbox,
      enableUpdateAnimations,
      useFastIcons
    } = this.props;

    const onRenderRow = this.props.onRenderRow ? composeRenderFunction(this.props.onRenderRow, this._onRenderRow) : this._onRenderRow;

    const collapseAllVisibility = groupProps && groupProps.collapseAllVisibility;
    const selection = this._selection;
    const dragDropHelper = this._dragDropHelper;
    const { adjustedColumns: columns } = this.state;

    const rowProps: IDetailsRowProps = {
      item: item,
      itemIndex: index,
      compact: compact,
      columns: columns,
      groupNestingDepth: nestingDepth,
      selectionMode: selectionMode,
      selection: selection,
      onDidMount: this._onRowDidMount,
      onWillUnmount: this._onRowWillUnmount,
      onRenderItemColumn: onRenderItemColumn,
      getCellValueKey: getCellValueKey,
      eventsToRegister: eventsToRegister,
      dragDropEvents: dragDropEvents,
      dragDropHelper: dragDropHelper,
      viewport: viewport,
      checkboxVisibility: checkboxVisibility,
      collapseAllVisibility: collapseAllVisibility,
      getRowAriaLabel: getRowAriaLabel,
      getRowAriaDescribedBy: getRowAriaDescribedBy,
      checkButtonAriaLabel: checkButtonAriaLabel,
      checkboxCellClassName: checkboxCellClassName,
      useReducedRowRenderer: useReducedRowRenderer,
      indentWidth,
      cellStyleProps: cellStyleProps,
      onRenderDetailsCheckbox: onRenderCheckbox,
      enableUpdateAnimations,
      rowWidth: this._sumColumnWidths(columns),
      useFastIcons
    };

    if (!item) {
      if (onRenderMissingItem) {
        return onRenderMissingItem(index, rowProps);
      }

      return null;
    }

    return onRenderRow(rowProps);
  };

  private _onGroupExpandStateChanged = (isSomeGroupExpanded: boolean): void => {
    this.setState({ isSomeGroupExpanded: isSomeGroupExpanded });
  };

  private _onColumnIsSizingChanged = (column: IColumn, isSizing: boolean): void => {
    this.setState({ isSizing: isSizing });
  };

  private _onHeaderKeyDown = (ev: React.KeyboardEvent<HTMLElement>): void => {
    if (ev.which === KeyCodes.down) {
      if (this._focusZone.current && this._focusZone.current.focus()) {
        // select the first item in list after down arrow key event
        // only if nothing was selected; otherwise start with the already-selected item
        if (this._selection.getSelectedIndices().length === 0) {
          this._selection.setIndexSelected(0, true, false);
        }

        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  };

  private _onContentKeyDown = (ev: React.KeyboardEvent<HTMLElement>): void => {
    if (ev.which === KeyCodes.up && !ev.altKey) {
      if (this._header.current && this._header.current.focus()) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    }
  };

  private _getGroupNestingDepth(): number {
    const { groups } = this.props;
    let level = 0;
    let groupsInLevel = groups;

    while (groupsInLevel && groupsInLevel.length > 0) {
      level++;
      groupsInLevel = groupsInLevel[0].children;
    }

    return level;
  }

  private _onRowDidMount = (row: DetailsRowBase): void => {
    const { item, itemIndex } = row.props;
    const itemKey = this._getItemKey(item, itemIndex);
    this._activeRows[itemKey] = row; // this is used for column auto resize

    this._setFocusToRowIfPending(row);

    const { onRowDidMount } = this.props;
    if (onRowDidMount) {
      onRowDidMount(item, itemIndex);
    }
  };

  private _setFocusToRowIfPending(row: DetailsRowBase): void {
    const { itemIndex } = row.props;
    if (this._initialFocusedIndex !== undefined && itemIndex === this._initialFocusedIndex) {
      this._setFocusToRow(row);
      delete this._initialFocusedIndex;
    }
  }

  private _setFocusToRow(row: DetailsRowBase, forceIntoFirstElement: boolean = false): void {
    if (this._selectionZone.current) {
      this._selectionZone.current.ignoreNextFocus();
    }
    this._async.setTimeout((): void => {
      row.focus(forceIntoFirstElement);
    }, 0);
  }

  private _onRowWillUnmount = (row: DetailsRowBase): void => {
    const { onRowWillUnmount } = this.props;

    const { item, itemIndex } = row.props;
    const itemKey = this._getItemKey(item, itemIndex);
    delete this._activeRows[itemKey];

    if (onRowWillUnmount) {
      onRowWillUnmount(item, itemIndex);
    }
  };

  private _onToggleCollapse = (collapsed: boolean): void => {
    this.setState({
      isCollapsed: collapsed
    });
    if (this._groupedList.current) {
      this._groupedList.current.toggleCollapseAll(collapsed);
    }
  };

  private _onColumnDragEnd = (props: { dropLocation?: ColumnDragEndLocation }, event: MouseEvent): void => {
    const { columnReorderOptions } = this.props;
    let finalDropLocation: ColumnDragEndLocation = ColumnDragEndLocation.outside;
    if (columnReorderOptions && columnReorderOptions.onDragEnd) {
      if (props.dropLocation && props.dropLocation !== ColumnDragEndLocation.header) {
        finalDropLocation = props.dropLocation;
      } else if (this._root.current) {
        const clientRect = this._root.current.getBoundingClientRect();
        if (
          event.clientX > clientRect.left &&
          event.clientX < clientRect.right &&
          event.clientY > clientRect.top &&
          event.clientY < clientRect.bottom
        ) {
          finalDropLocation = ColumnDragEndLocation.surface;
        }
      }
      columnReorderOptions.onDragEnd(finalDropLocation);
    }
  };

  private _forceListUpdates(): void {
    if (this._groupedList.current) {
      this._groupedList.current.forceUpdate();
    }
    if (this._list.current) {
      this._list.current.forceUpdate();
    }
  }

  private _notifyColumnsResized(): void {
    this.state.adjustedColumns.forEach(column => {
      if (column.onColumnResize) {
        column.onColumnResize(column.currentWidth);
      }
    });
  }

  private _adjustColumns(newProps: IDetailsListProps, forceUpdate?: boolean, resizingColumnIndex?: number): void {
    const adjustedColumns = this._getAdjustedColumns(newProps, forceUpdate, resizingColumnIndex);
    const { viewport } = this.props;
    const viewportWidth = viewport && viewport.width ? viewport.width : 0;

    if (adjustedColumns) {
      this.setState(
        {
          adjustedColumns: adjustedColumns,
          lastWidth: viewportWidth
        },
        this._notifyColumnsResized
      );
    }
  }

  /** Returns adjusted columns, given the viewport size and layout mode. */
  private _getAdjustedColumns(newProps: IDetailsListProps, forceUpdate?: boolean, resizingColumnIndex?: number): IColumn[] {
    const { items: newItems, layoutMode, selectionMode, viewport } = newProps;
    const viewportWidth = viewport && viewport.width ? viewport.width : 0;
    let { columns: newColumns } = newProps;

    const columns = this.props ? this.props.columns : [];
    const lastWidth = this.state ? this.state.lastWidth : -1;
    const lastSelectionMode = this.state ? this.state.lastSelectionMode : undefined;

    if (!forceUpdate && lastWidth === viewportWidth && lastSelectionMode === selectionMode && (!columns || newColumns === columns)) {
      return [];
    }

    newColumns = newColumns || buildColumns(newItems, true);

    let adjustedColumns: IColumn[];

    if (layoutMode === DetailsListLayoutMode.fixedColumns) {
      adjustedColumns = this._getFixedColumns(newColumns);

      // Preserve adjusted column calculated widths.
      adjustedColumns.forEach(column => {
        this._rememberCalculatedWidth(column, column.calculatedWidth!);
      });
    } else {
      if (resizingColumnIndex !== undefined) {
        adjustedColumns = this._getJustifiedColumnsAfterResize(newColumns, viewportWidth, newProps, resizingColumnIndex);
      } else {
        adjustedColumns = this._getJustifiedColumns(newColumns, viewportWidth, newProps, 0);
      }

      adjustedColumns.forEach(column => {
        this._getColumnOverride(column.key).currentWidth = column.calculatedWidth;
      });
    }

    return adjustedColumns;
  }

  /** Builds a set of columns based on the given columns mixed with the current overrides. */
  private _getFixedColumns(newColumns: IColumn[]): IColumn[] {
    return newColumns.map(column => {
      const newColumn: IColumn = { ...column, ...this._columnOverrides[column.key] };

      if (!newColumn.calculatedWidth) {
        newColumn.calculatedWidth = newColumn.maxWidth || newColumn.minWidth || MIN_COLUMN_WIDTH;
      }

      return newColumn;
    });
  }

  private _getJustifiedColumnsAfterResize(
    newColumns: IColumn[],
    viewportWidth: number,
    props: IDetailsListProps,
    resizingColumnIndex: number
  ): IColumn[] {
    const fixedColumns = newColumns.slice(0, resizingColumnIndex);
    fixedColumns.forEach(column => (column.calculatedWidth = this._getColumnOverride(column.key).currentWidth));

    const fixedWidth = fixedColumns.reduce((total, column, i) => total + getPaddedWidth(column, i === 0, props), 0);

    const remainingColumns = newColumns.slice(resizingColumnIndex);
    const remainingWidth = viewportWidth - fixedWidth;

    return [...fixedColumns, ...this._getJustifiedColumns(remainingColumns, remainingWidth, props, resizingColumnIndex)];
  }

  /** Builds a set of columns to fix within the viewport width. */
  private _getJustifiedColumns(newColumns: IColumn[], viewportWidth: number, props: IDetailsListProps, firstIndex: number): IColumn[] {
    const { selectionMode = this._selection.mode, checkboxVisibility } = props;
    const rowCheckWidth = selectionMode !== SelectionMode.none && checkboxVisibility !== CheckboxVisibility.hidden ? CHECKBOX_WIDTH : 0;
    const groupExpandWidth = this._getGroupNestingDepth() * GROUP_EXPAND_WIDTH;
    let totalWidth = 0; // offset because we have one less inner padding.
    const availableWidth = viewportWidth - (rowCheckWidth + groupExpandWidth);
    const adjustedColumns: IColumn[] = newColumns.map((column, i) => {
      const newColumn = {
        ...column,
        calculatedWidth: column.minWidth || MIN_COLUMN_WIDTH,
        ...this._columnOverrides[column.key]
      };

      const isFirst = i + firstIndex === 0;
      totalWidth += getPaddedWidth(newColumn, isFirst, props);

      return newColumn;
    });

    let lastIndex = adjustedColumns.length - 1;

    // Shrink or remove collapsable columns.
    while (lastIndex > 0 && totalWidth > availableWidth) {
      const column = adjustedColumns[lastIndex];

      const minWidth = column.minWidth || MIN_COLUMN_WIDTH;
      const overflowWidth = totalWidth - availableWidth;

      // tslint:disable-next-line:deprecation
      if (column.calculatedWidth! - minWidth >= overflowWidth || !(column.isCollapsible || column.isCollapsable)) {
        const originalWidth = column.calculatedWidth!;
        column.calculatedWidth = Math.max(column.calculatedWidth! - overflowWidth, minWidth);
        totalWidth -= originalWidth - column.calculatedWidth;
      } else {
        totalWidth -= getPaddedWidth(column, false, props);
        adjustedColumns.splice(lastIndex, 1);
      }
      lastIndex--;
    }

    // Then expand columns starting at the beginning, until we've filled the width.
    for (let i = 0; i < adjustedColumns.length && totalWidth < availableWidth; i++) {
      const column = adjustedColumns[i];
      const isLast = i === adjustedColumns.length - 1;
      const overrides = this._columnOverrides[column.key];
      if (overrides && overrides.calculatedWidth && !isLast) {
        continue;
      }

      const spaceLeft = availableWidth - totalWidth;
      let increment: number;
      if (isLast) {
        increment = spaceLeft;
      } else {
        const maxWidth = column.maxWidth;
        const minWidth = column.minWidth || maxWidth || MIN_COLUMN_WIDTH;
        increment = maxWidth ? Math.min(spaceLeft, maxWidth - minWidth) : spaceLeft;
      }

      column.calculatedWidth = (column.calculatedWidth as number) + increment;
      totalWidth += increment;
    }

    return adjustedColumns;
  }

  private _onColumnResized = (resizingColumn: IColumn, newWidth: number, resizingColumnIndex: number): void => {
    const newCalculatedWidth = Math.max(resizingColumn.minWidth || MIN_COLUMN_WIDTH, newWidth);
    if (this.props.onColumnResize) {
      this.props.onColumnResize(resizingColumn, newCalculatedWidth, resizingColumnIndex);
    }

    this._rememberCalculatedWidth(resizingColumn, newCalculatedWidth);

    this._adjustColumns(this.props, true, resizingColumnIndex);

    this.setState({
      version: {}
    });
  };

  private _rememberCalculatedWidth(column: IColumn, newCalculatedWidth: number): void {
    const overrides = this._getColumnOverride(column.key);
    overrides.calculatedWidth = newCalculatedWidth;
    overrides.currentWidth = newCalculatedWidth;
  }

  private _getColumnOverride(key: string): IColumn {
    return (this._columnOverrides[key] = this._columnOverrides[key] || {});
  }

  /**
   * Callback function when double clicked on the details header column resizer
   * which will measure the column cells of all the active rows and resize the
   * column to the max cell width.
   *
   * @param column - double clicked column definition
   * @param columnIndex - double clicked column index
   * TODO: min width 100 should be changed to const value and should be consistent with the
   * value used on _onSizerMove method in DetailsHeader
   */
  private _onColumnAutoResized = (column: IColumn, columnIndex: number): void => {
    let max = 0;
    let count = 0;
    const totalCount = Object.keys(this._activeRows).length;

    for (const key in this._activeRows) {
      if (this._activeRows.hasOwnProperty(key)) {
        const currentRow = this._activeRows[key];
        currentRow.measureCell(columnIndex, (width: number) => {
          max = Math.max(max, width);
          count++;
          if (count === totalCount) {
            this._onColumnResized(column, max, columnIndex);
          }
        });
      }
    }
  };

  /**
   * Call back function when an element in FocusZone becomes active. It will translate it into item
   * and call onActiveItemChanged callback if specified.
   *
   * @param row - element that became active in Focus Zone
   * @param focus - event from Focus Zone
   */
  private _onActiveRowChanged = (el?: HTMLElement, ev?: React.FocusEvent<HTMLElement>): void => {
    const { items, onActiveItemChanged } = this.props;

    if (!el) {
      return;
    }

    // Check and assign index only if the event was raised from any DetailsRow element
    if (el.getAttribute('data-item-index')) {
      const index = Number(el.getAttribute('data-item-index'));
      if (index >= 0) {
        if (onActiveItemChanged) {
          onActiveItemChanged(items[index], index, ev);
        }
        this.setState({
          focusedItemIndex: index
        });
      }
    }
  };

  private _onBlur = (event: React.FocusEvent<HTMLElement>): void => {
    this.setState({
      focusedItemIndex: -1
    });
  };

  private _getItemKey(item: any, itemIndex: number): string | number {
    const { getKey } = this.props;

    let itemKey: string | number | undefined = undefined;
    if (item) {
      itemKey = item.key;
    }

    if (getKey) {
      itemKey = getKey(item, itemIndex);
    }

    if (!itemKey) {
      itemKey = itemIndex;
    }

    return itemKey;
  }

  private _getDetailsFooterProps(): IDetailsFooterProps {
    const { adjustedColumns: columns } = this.state;

    const {
      viewport,
      checkboxVisibility,
      indentWidth,
      cellStyleProps = DEFAULT_CELL_STYLE_PROPS,
      selectionMode = this._selection.mode
    } = this.props;

    return {
      columns: columns,
      groupNestingDepth: this._getGroupNestingDepth(),
      selection: this._selection,
      selectionMode: selectionMode,
      viewport: viewport,
      checkboxVisibility,
      indentWidth,
      cellStyleProps
    };
  }

  private _getColumnReorderProps(): IColumnReorderHeaderProps | undefined {
    const { columnReorderOptions } = this.props;
    if (columnReorderOptions) {
      return {
        ...columnReorderOptions,
        onColumnDragEnd: this._onColumnDragEnd
      };
    }
  }

  private _getGroupProps(detailsGroupProps: IDetailsGroupRenderProps): IGroupRenderProps {
    const { onRenderFooter: onRenderDetailsGroupFooter, onRenderHeader: onRenderDetailsGroupHeader } = detailsGroupProps;
    const { adjustedColumns: columns } = this.state;
    const {
      selectionMode = this._selection.mode,
      viewport,
      cellStyleProps = DEFAULT_CELL_STYLE_PROPS,
      checkboxVisibility,
      indentWidth
    } = this.props;
    const groupNestingDepth = this._getGroupNestingDepth();

    const onRenderFooter = onRenderDetailsGroupFooter
      ? (props: IGroupDividerProps, defaultRender?: IRenderFunction<IGroupDividerProps>) => {
          return onRenderDetailsGroupFooter(
            {
              ...props,
              columns: columns,
              groupNestingDepth: groupNestingDepth,
              indentWidth,
              selection: this._selection,
              selectionMode: selectionMode,
              viewport: viewport,
              checkboxVisibility,
              cellStyleProps
            },
            defaultRender
          );
        }
      : undefined;

    const onRenderHeader = onRenderDetailsGroupHeader
      ? (props: IGroupDividerProps, defaultRender?: IRenderFunction<IGroupDividerProps>) => {
          return onRenderDetailsGroupHeader(
            {
              ...props,
              columns: columns,
              groupNestingDepth: groupNestingDepth,
              indentWidth,
              selection: this._selection,
              selectionMode: selectionMode,
              viewport: viewport,
              checkboxVisibility,
              cellStyleProps
            },
            defaultRender
          );
        }
      : undefined;

    return {
      ...detailsGroupProps,
      onRenderFooter,
      onRenderHeader
    };
  }

  private isRightArrow = (event: React.KeyboardEvent<HTMLElement>) => {
    return event.which === getRTLSafeKeyCode(KeyCodes.right, this.props.theme);
  };
}

export function buildColumns(
  items: any[],
  canResizeColumns?: boolean,
  onColumnClick?: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void,
  sortedColumnKey?: string,
  isSortedDescending?: boolean,
  groupedColumnKey?: string,
  isMultiline?: boolean
) {
  const columns: IColumn[] = [];

  if (items && items.length) {
    const firstItem = items[0];

    for (const propName in firstItem) {
      if (firstItem.hasOwnProperty(propName)) {
        columns.push({
          key: propName,
          name: propName,
          fieldName: propName,
          minWidth: MIN_COLUMN_WIDTH,
          maxWidth: 300,
          isCollapsable: !!columns.length,
          isCollapsible: !!columns.length,
          isMultiline: isMultiline === undefined ? false : isMultiline,
          isSorted: sortedColumnKey === propName,
          isSortedDescending: !!isSortedDescending,
          isRowHeader: false,
          columnActionsMode: ColumnActionsMode.clickable,
          isResizable: canResizeColumns,
          onColumnClick: onColumnClick,
          isGrouped: groupedColumnKey === propName
        });
      }
    }
  }

  return columns;
}

function getPaddedWidth(column: IColumn, isFirst: boolean, props: IDetailsListProps): number {
  const { cellStyleProps = DEFAULT_CELL_STYLE_PROPS } = props;

  return (
    column.calculatedWidth! +
    cellStyleProps.cellLeftPadding +
    cellStyleProps.cellRightPadding +
    (column.isPadded ? cellStyleProps.cellExtraRightPadding : 0)
  );
}

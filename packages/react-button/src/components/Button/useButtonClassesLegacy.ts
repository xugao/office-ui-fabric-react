import { ClassDictionary } from '@fluentui/react-compose';
import { ButtonProps } from './Button.types';

import { ClassFunction } from '@fluentui/react-compose';
import { getStyles } from 'office-ui-fabric-react/lib/components/Button/DefaultButton/DefaultButton.styles';
import { mergeStyleSets, ITheme, getTheme, IButtonStyles, memoizeFunction } from 'office-ui-fabric-react';

/* eslint-disable deprecation/deprecation */
const getClassNames = memoizeFunction(
  (theme: ITheme, customStyles: IButtonStyles, primary?: boolean): ClassDictionary =>
    (mergeStyleSets(getStyles(theme, customStyles, primary)) as unknown) as ClassDictionary,
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useButtonClasses: ClassFunction = (state: ButtonProps): ClassDictionary => {
  const theme = useTheme();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classes = getClassNames(theme, (state as any).styles, state.primary);

  // TODO: map
  // ====NEW====
  // export var root = "root_7346c097";
  // export var _primary = "_primary_7346c097";
  // export var _iconOnly = "_iconOnly_7346c097";
  // export var _circular = "_circular_7346c097";
  // export var _fluid = "_fluid_7346c097";
  // export var _size_smallest = "_size_smallest_7346c097";
  // export var _size_smaller = "_size_smaller_7346c097";
  // export var _size_small = "_size_small_7346c097";
  // export var _size_large = "_size_large_7346c097";
  // export var _size_larger = "_size_larger_7346c097";
  // export var _size_largest = "_size_largest_7346c097";
  // export var _disabled = "_disabled_7346c097";
  // export var icon = "icon_7346c097";

  // ===OLD===
  // description: "description-45"
  // flexContainer: "flexContainer-44"
  // icon: "icon-47"
  // iconDisabled: "iconDisabled-42"
  // label: "label-49"
  // menuIcon: "menuIcon-48"
  // menuIconDisabled: "menuIconDisabled-43"
  // root: "root-71"
  // rootChecked: "rootChecked-75"
  // rootCheckedHovered: "rootCheckedHovered-76"
  // rootDisabled: "rootDisabled-41"
  // rootExpanded: "rootExpanded-74"
  // rootHovered: "rootHovered-72"
  // rootPressed: "rootPressed-73"
  // screenReaderText: "screenReaderText-50"
  // splitButtonContainer: "splitButtonContainer-56"
  // splitButtonContainerChecked: "splitButtonContainerChecked-66"
  // splitButtonContainerCheckedHovered: "splitButtonContainerCheckedHovered-67"
  // splitButtonContainerDisabled: "splitButtonContainerDisabled-70"
  // splitButtonContainerFocused: "splitButtonContainerFocused-68"
  // splitButtonContainerHovered: "splitButtonContainerHovered-65"
  // splitButtonDivider: "splitButtonDivider-77"
  // splitButtonDividerDisabled: "splitButtonDividerDisabled-83"
  // splitButtonFlexContainer: "splitButtonFlexContainer-69"
  // splitButtonMenuButton: "splitButtonMenuButton-78"
  // splitButtonMenuButtonChecked: "splitButtonMenuButtonChecked-79"
  // splitButtonMenuButtonDisabled: "splitButtonMenuButtonDisabled-58"
  // splitButtonMenuButtonExpanded: "splitButtonMenuButtonExpanded-80"
  // splitButtonMenuIcon: "splitButtonMenuIcon-81"
  // splitButtonMenuIconDisabled: "splitButtonMenuIconDisabled-82"
  // subComponentStyles: {}
  // textContainer: "textContainer-46"
  return {
    root: classes.root,
    disabled: `${classes.rootDisabled} ${classes.iconDisabled}`,
    icon: classes.icon,
  };
};

// TODO: button needs to work with legacy theme.
function useTheme(): ITheme {
  return getTheme();
}

import { getGlobalClassNames, HighContrastSelector } from '../../../Styling';
import { ISuggestionsItemStyleProps, ISuggestionsItemStyles } from './SuggestionsItem.types';

export const SuggestionsItemGlobalClassNames = {
  root: 'ms-Suggestions-item',
  itemButton: 'ms-Suggestions-itemButton',
  closeButton: 'ms-Suggestions-closeButton',
  isSuggested: 'is-suggested'
};

export function getStyles(props: ISuggestionsItemStyleProps): ISuggestionsItemStyles {
  const { className, theme, suggested } = props;

  const { palette, semanticColors } = theme;

  const classNames = getGlobalClassNames(SuggestionsItemGlobalClassNames, theme);

  return {
    root: [
      classNames.root,
      {
        display: 'flex',
        alignItems: 'stretch',
        boxSizing: 'border-box',
        width: '100%',
        position: 'relative',
        selectors: {
          '&:hover': {
            background: semanticColors.menuItemBackgroundHovered
          },
          '&:hover .ms-Suggestions-closeButton': {
            display: 'block'
          }
        }
      },

      className
    ],
    itemButton: [
      classNames.itemButton,
      {
        width: '100%',
        padding: 0,
        border: 'none',
        height: '100%',
        // Force the item button to be collapsible so it can always shrink
        // to accommodate the close button as a peer in its flex container.
        minWidth: 0,
        // Require for IE11 to truncate the component.
        overflow: 'hidden',
        selectors: {
          [HighContrastSelector]: {
            color: 'WindowText',
            selectors: {
              ':hover': {
                background: 'Highlight',
                color: 'HighlightText',
                MsHighContrastAdjust: 'none'
              }
            }
          },
          ':hover': {
            color: semanticColors.menuItemTextHovered
          }
        }
      },
      suggested && [
        classNames.isSuggested,
        {
          background: semanticColors.menuItemBackgroundPressed,
          selectors: {
            ':hover': {
              background: semanticColors.menuDivider
            },
            [HighContrastSelector]: {
              background: 'Highlight',
              color: 'HighlightText',
              MsHighContrastAdjust: 'none'
            }
          }
        }
      ]
    ],
    closeButton: [
      classNames.closeButton,
      {
        display: 'none',
        color: palette.neutralSecondary,
        padding: '0 4px',
        height: 'auto',
        width: 32,
        selectors: {
          ':hover, :active': {
            background: palette.neutralTertiaryAlt,
            color: palette.neutralDark
          },
          [HighContrastSelector]: {
            color: 'WindowText'
          }
        }
      },
      suggested && {
        selectors: {
          ':hover, :active': {
            background: palette.neutralTertiary,
            color: palette.neutralPrimary
          }
        }
      }
    ]
  };
}

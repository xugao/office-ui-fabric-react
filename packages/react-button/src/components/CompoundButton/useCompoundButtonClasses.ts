import { makeVariantClasses, Theme } from '@fluentui/react-theme-provider/lib/compat';
import { CompoundButtonState, CompoundButtonVariants } from './CompoundButton.types';
import { useButtonClasses } from '../Button/useButtonClasses';

const GlobalClassNames = {
  root: 'ms-CompoundButton',
  contentContainer: 'ms-CompoundButton-contentContainer',
  secondaryContent: 'ms-CompoundButton-secondaryContent',
};

const useCompoundButtonBaseClasses = makeVariantClasses<CompoundButtonState, CompoundButtonVariants>({
  name: 'CompoundButton',
  prefix: '--button',

  styles: {
    root: [
      GlobalClassNames.root,
      {
        alignItems: 'flex-start',
      },
    ],

    contentContainer: [
      GlobalClassNames.contentContainer,
      {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'left',
      },
    ],

    secondaryContent: [
      GlobalClassNames.secondaryContent,
      {
        color: 'var(--button-secondaryContentColor, var(--button-contentColor))',
        fontSize: 'var(--button-secondaryContentFontSize)',
        fontWeight: 'var(--button-secondaryContentFontWeight)',
        lineHeight: '100%',
        marginTop: 'var(--button-secondaryContentGap)',

        '@media (forced-colors: active)': {
          color: 'var(--button-highContrast-secondaryContentColor)',
        },

        [`.${GlobalClassNames.root}:hover &`]: {
          color: 'var(--button-hovered-secondaryContentColor, var(--button-secondaryContentColor))',

          '@media (forced-colors: active)': {
            color:
              'var(--button-highContrast-hovered-secondaryContentColor, ' +
              'var(--button-highContrast-secondaryContentColor))',
          },
        },

        [`.${GlobalClassNames.root}:active &`]: {
          color:
            'var(--button-pressed-secondaryContentColor, ' +
            'var(--button-hovered-secondaryContentColor, ' +
            'var(--button-secondaryContentColor)))',

          '@media (forced-colors: active)': {
            color:
              'var(--button-highContrast-pressed-secondaryContentColor, ' +
              'var(--button-highContrast-hovered-secondaryContentColor, ' +
              'var(--button-highContrast-secondaryContentColor)))',
          },
        },

        [`.${GlobalClassNames.root}[aria-disabled="true"] &`]: {
          color: 'var(--button-disabled-secondaryContentColor, var(--button-disabled-contentColor))',

          '@media (forced-colors: active)': {
            color:
              'var(--button-highContrast-disabled-secondaryContentColor, ' +
              'var(--button-highContrast-secondaryContentColor))',
          },
        },
      },
    ],
  },

  variants: (theme: Theme): CompoundButtonVariants => {
    const { fonts, palette, semanticColors, tokens } = theme;
    const brand = tokens?.color?.brand;

    return {
      root: {
        height: 'auto',
        maxWidth: '280px',
        minWidth: '72px',
        paddingBottom: '16px',
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '16px',
        iconSize: '28px',
        secondaryContentColor: palette.neutralSecondary,
        secondaryContentGap: '4px',
        secondaryContentFontSize: fonts?.small.fontSize as string,
        secondaryContentFontWeight: 'normal',

        hovered: {
          secondaryContentColor: palette.neutralDark,
        },

        pressed: {
          secondaryContentColor: semanticColors.buttonTextPressed,
        },

        disabled: {
          secondaryContentColor: semanticColors.buttonTextDisabled,
        },

        highContrast: {
          secondaryContentColor: 'WindowText',
          hovered: {
            secondaryContentColor: 'Highlight',
          },
          pressed: {
            secondaryContentColor: 'WindowText',
          },
          disabled: {
            secondaryContentColor: 'GrayText',
          },
        },
      },

      block: {
        maxWidth: '100%',
      },

      iconOnly: {
        minHeight: 'var(--button-size-regular)',
        width: 'var(--button-minHeight)',
        minWidth: '0',
        paddingBottom: '0',
        paddingTop: '0',
        paddingLeft: '0',
        paddingRight: '0',
      },

      primary: {
        secondaryContentColor: brand?.secondaryContentColor,

        focused: {
          secondaryContentColor: brand?.focused?.secondaryContentColor,
        },

        hovered: {
          secondaryContentColor: brand?.hovered?.secondaryContentColor,
        },

        pressed: {
          secondaryContentColor: brand?.pressed?.secondaryContentColor,
        },

        highContrast: {
          secondaryContentColor: 'Window',
          hovered: {
            secondaryContentColor: 'Window',
          },
          pressed: {
            secondaryContentColor: 'Window',
          },
          disabled: {
            secondaryContentColor: 'GrayText',
          },
        },
      },

      ghost: {
        secondaryContentColor: palette.neutralSecondary,
        disabled: {
          secondaryContentColor: palette.neutralTertiary,
        },
        focused: {
          secondaryContentColor: palette.neutralSecondary,
        },
        hovered: {
          secondaryContentColor: palette.neutralDark,
        },
        pressed: {
          secondaryContentColor: palette.black,
        },

        highContrast: {
          secondaryContentColor: 'WindowText',
          hovered: {
            secondaryContentColor: 'Highlight',
          },
          pressed: {
            secondaryContentColor: 'Highlight',
          },
          disabled: {
            secondaryContentColor: 'GrayText',
          },
        },
      },

      transparent: {
        hovered: {
          secondaryContentColor: palette?.themePrimary,
        },
      },
    };
  },
});

export const useCompoundButtonClasses = (state: CompoundButtonState) => {
  useButtonClasses(state);
  useCompoundButtonBaseClasses(state);
};

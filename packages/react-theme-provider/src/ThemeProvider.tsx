import * as React from 'react';
import cx from 'classnames';
import { CustomizerContext, ICustomizerContext } from '@uifabric/utilities';
import { tokensToStyleObject } from './tokensToStyleObject';
import { ThemeContext } from './ThemeContext';
import { PartialTheme, Theme, Tokens } from './types';
import { mergeThemes } from './mergeThemes';
import { useTheme } from './useTheme';
import * as classes from './ThemeProvider.scss';

function convertThemeToTokens(theme: Theme): Tokens {
  const { fonts, effects, palette, semanticColors } = theme;
  const { components, schemes, rtl, isInverted, ...passThroughTokens } = theme;
  const tokens = {
    accent: {
      background: palette.themePrimary,
      borderColor: 'transparent',
      contentColor: palette.white,
      iconColor: palette.white,

      hovered: {
        background: palette.themeDarkAlt,
        borderColor: 'transparent',
        contentColor: palette.white,
        iconColor: palette.white,
      },
    },

    button: {
      contentGap: '8px',
      padding: '0 16px',
      minWidth: '80px',
      iconSize: fonts.mediumPlus.fontSize,
      borderRadius: effects.roundedCorner2,
      focusColor: palette.neutralSecondary,
      focusInnerColor: palette.white,

      background: semanticColors.buttonBackground,
      borderColor: semanticColors.buttonBorder,
      contentColor: semanticColors.buttonText,

      hovered: {
        background: semanticColors.buttonBackgroundHovered,
        borderColor: semanticColors.buttonBorder,
        contentColor: semanticColors.buttonTextHovered,
      },

      pressed: {
        background: semanticColors.buttonBackgroundPressed,
        contentColor: semanticColors.buttonTextPressed,
      },

      disabled: {
        background: semanticColors.buttonBackgroundDisabled,
        borderColor: semanticColors.buttonBorderDisabled,
        contentColor: semanticColors.buttonTextDisabled,
      },

      primary: {
        background: semanticColors.primaryButtonBackground,
        borderColor: semanticColors.buttonBorder,
        contentColor: semanticColors.buttonText,
      },
    },
    ...passThroughTokens,
  };
  return (tokens as unknown) as Tokens;
}

function createCustomizerContext(theme: Theme): ICustomizerContext {
  return {
    customizations: {
      inCustomizerContext: true,
      settings: { theme },
      scopedSettings: theme.components || {},
    },
  };
}
/**
 * Props for the ThemeProvider component.
 */
export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Defines the theme provided by the user.
   */
  theme?: PartialTheme | Theme;
}

/**
 * ThemeProvider, used for providing css variables and registering stylesheets.
 */
export const ThemeProvider = React.forwardRef<HTMLDivElement, ThemeProviderProps>(
  (
    { theme, style, className, ...rest }: React.PropsWithChildren<ThemeProviderProps>,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    // Pull contextual theme.
    const parentTheme = useTheme();

    // Merge the theme only when parent theme or props theme mutates.
    const fullTheme = React.useMemo<Theme>(() => mergeThemes(parentTheme, theme), [parentTheme, theme]);

    // Generate the inline style object only when merged theme mutates.
    const inlineStyle = React.useMemo<React.CSSProperties>(
      () => tokensToStyleObject(convertThemeToTokens(fullTheme), undefined, { ...style }),
      [fullTheme, style],
    );

    const rootClass = cx(className, classes.root) || undefined;

    // Register stylesheets as needed.
    // TODO: useStylesheet(fullTheme.stylesheets);

    // Provide the theme in case it's required through context.
    return (
      <ThemeContext.Provider value={fullTheme}>
        <CustomizerContext.Provider value={createCustomizerContext(fullTheme)}>
          <div {...rest} ref={ref} className={rootClass} style={inlineStyle} />
        </CustomizerContext.Provider>
      </ThemeContext.Provider>
    );
  },
);

ThemeProvider.displayName = 'ThemeProvider';

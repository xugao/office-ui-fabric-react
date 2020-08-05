import * as React from 'react';
import { CustomizerContext, ICustomizerContext, getDocument } from '@uifabric/utilities';
import { useMergedRefs } from '@uifabric/react-hooks';
import { tokensToStyleObject } from './tokensToStyleObject';
import { ThemeContext } from './ThemeContext';
import { PartialTheme, Theme, Tokens } from './types';
import { mergeThemes } from './mergeThemes';
import { useTheme } from './useTheme';
import * as classes from './ThemeProvider.scss';

function convertThemeToTokens(theme: Theme): Tokens {
  const { palette } = theme;
  const { components, schemes, rtl, isInverted, ...passThroughTokens } = theme;
  const tokens: Tokens = {
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

    body: getBodyTokens(theme),

    button: getButtonTokens(theme),
  };
  return ({ ...tokens, ...passThroughTokens } as unknown) as Tokens;
}

const getBodyTokens = (theme: Theme) => {
  return {
    background: theme.semanticColors.bodyBackground,
  };
};

const getButtonTokens = (theme: Theme) => {
  const { fonts, effects, palette, semanticColors } = theme;

  return {
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
    },
  };
};
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

  applyThemeToBody?: boolean;
}

/**
 * ThemeProvider, used for providing css variables and registering stylesheets.
 */
export const ThemeProvider = React.forwardRef<HTMLDivElement, ThemeProviderProps>(
  ({ theme, style, className, applyThemeToBody, ...rest }: ThemeProviderProps, ref: React.Ref<HTMLDivElement>) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(rootRef, ref);

    // Pull contextual theme.
    const parentTheme = useTheme();

    // Merge the theme only when parent theme or props theme mutates.
    const fullTheme = React.useMemo<Theme>(() => mergeThemes(parentTheme, theme), [parentTheme, theme]);

    // Generate the inline style object only when merged theme mutates.
    const inlineStyle = React.useMemo<React.CSSProperties>(
      () => tokensToStyleObject(convertThemeToTokens(fullTheme), undefined, { ...style }),
      [fullTheme, style],
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyThemeStyle = `--body-background: ${(inlineStyle as any)['--body-background']}`;
    // TOOD: add body styles
    React.useEffect(() => {
      if (!applyThemeToBody) {
        return;
      }
      const currentDoc = getDocument(rootRef.current);
      if (currentDoc) {
        currentDoc.body.setAttribute('style', `${currentDoc.body.getAttribute('style') || ''} ${bodyThemeStyle}`);
        currentDoc.body.classList.add(classes.body);
      }

      return () => {
        if (!applyThemeToBody) {
          return;
        }

        if (currentDoc) {
          currentDoc.body.setAttribute('style', currentDoc.body.getAttribute('style')!.replace(bodyThemeStyle, ''));
          currentDoc.body.classList.remove(classes.body);
        }
      };
    }, [ref, applyThemeToBody, bodyThemeStyle]);

    // Register stylesheets as needed.
    // TODO: useStylesheet(fullTheme.stylesheets);

    // Provide the theme in case it's required through context.
    return (
      <ThemeContext.Provider value={fullTheme}>
        <CustomizerContext.Provider value={createCustomizerContext(fullTheme)}>
          <div {...rest} ref={mergedRef} className={className} style={inlineStyle} />
        </CustomizerContext.Provider>
      </ThemeContext.Provider>
    );
  },
);

ThemeProvider.displayName = 'ThemeProvider';

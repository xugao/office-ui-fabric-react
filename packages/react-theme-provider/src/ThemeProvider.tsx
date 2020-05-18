import * as React from 'react';
import cx from 'classnames';
import { useStylesheet } from '@fluentui/react-stylesheets';
import { tokensToStyleObject } from './tokensToStyleObject';
import { ThemeContext } from './ThemeContext';
import { Theme, ThemePrepared } from './types';
import { mergeThemes } from './mergeThemes';
import { useTheme } from './useTheme';
import * as classes from './ThemeProvider.scss';

/**
 * Props for the ThemeProvider component.
 */
export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Defines the theme provided by the user.
   */
  theme?: Theme;
}

let classCount = 0;

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
    const fullTheme = React.useMemo<ThemePrepared>(() => mergeThemes(parentTheme, theme), [parentTheme, theme]);

    // Generate the inline style object only when merged theme mutates.
    const inlineStyle = React.useMemo<React.CSSProperties>(
      () => tokensToStyleObject(fullTheme.tokens, undefined, { ...style }),
      [fullTheme, style],
    );

    // Register stylesheets as needed.
    useStylesheet(fullTheme.stylesheets);

    const themeScopeClass = React.useMemo<string>(() => {
      const cn = `css-${classCount}`;
      classCount++;
      return cn;
    }, [inlineStyle]);

    const themeScopeClasses = React.useMemo<string[]>(() => {
      return (parentTheme.__classes__ || []).concat([themeScopeClass]);
    }, [parentTheme.__classes__, themeScopeClass]);

    useStylesheet(fullTheme.stylesheets);

    const stylesheet = React.useMemo<string>(() => {
      const normalizedStyle = Object.entries(inlineStyle)
        .map(([key, value]) => {
          return `${key}: ${value};`;
        })
        .join('');
      return cx(themeScopeClasses.map((c: string) => `.${c}`)) + '{' + normalizedStyle + '}';
    }, [inlineStyle]);

    useStylesheet(stylesheet);

    fullTheme.__classes__ = themeScopeClasses;

    // Provide the theme in case it's required through context.
    // tslint:disable:jsx-ban-props
    return (
      <ThemeContext.Provider value={fullTheme}>
        <div {...rest} ref={ref} className={cx(className, classes.root)} />
      </ThemeContext.Provider>
    );
    // tslint:enable:jsx-ban-props
  },
);

ThemeProvider.displayName = 'ThemeProvider';

import * as React from 'react';
import { ThemeContext, useTheme } from '../../themeContext';
import { ITheme } from '../../theme.types';
import { Box } from '../Box/Box';
import { CustomizerContext } from '@uifabric/utilities';

export interface IThemeProviderProps extends React.AllHTMLAttributes<any> {
  theme?: ITheme;
  scheme?: string;
}

export const ThemeProvider = (props: React.PropsWithChildren<IThemeProviderProps>) => {
  const currentTheme = useTheme();
  const customizerContext = React.useContext(CustomizerContext);
  const { theme: themeFromProps, scheme, ...rest } = props;
  let theme = themeFromProps || currentTheme;

  if (!theme) {
    throw new Error('Use a ThemeProvider component to provide a theme.');
  }

  if (scheme !== undefined) {
    theme = theme.schemes[scheme] || theme;
  }

  const { direction = 'ltr' } = theme;

  let fullTheme: any = theme;
  if (
    customizerContext &&
    customizerContext.customizations &&
    customizerContext.customizations.settings &&
    customizerContext.customizations.settings.theme
  ) {
    fullTheme = {
      ...theme,
      legacyTheme: customizerContext.customizations.settings.theme,
    };
  }

  console.log('rendering the theme provider', customizerContext);
  return (
    <ThemeContext.Provider value={fullTheme}>
      <Box dir={direction} {...rest} />
    </ThemeContext.Provider>
  );
};

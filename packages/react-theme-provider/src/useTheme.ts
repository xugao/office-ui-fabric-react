import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Theme } from './types';
import { useCustomizationSettings } from '@uifabric/utilities';
import { ITheme } from '@uifabric/styling';

/**
 * React hook for programatically accessing the theme.
 */
export const useTheme = (): Theme => {
  const contextualTheme = useContext(ThemeContext);
  const globalTheme = useGlobalTheme();
  if (contextualTheme) {
    contextualTheme;
  }

  return globalTheme;
};

function useGlobalTheme(): ITheme {
  return useCustomizationSettings(['theme']).theme;
}

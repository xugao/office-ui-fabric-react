import { IPartialTheme, ITheme } from '../theme.types';
import { merge } from '@uifabric/utilities';

const defaultTheme: IPartialTheme = {
  colors: {
    background: 'white',
  },
  fonts: {
    // tslint:disable-next-line:max-line-length
    default: `"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`,
  },
  components: {},
};

interface IBaseTheme extends Omit<ITheme, 'schemes'> {
  schemes: {
    [key: string]: IPartialTheme;
  };
}

export function createTheme(baseTheme: IBaseTheme, ...themes: IPartialTheme[]): ITheme {
  const finalTheme = merge({}, defaultTheme);

  const allThemes = [baseTheme, ...themes];
  for (const theme of allThemes) {
    const { schemes, ...rest } = theme;

    merge(finalTheme, rest);

    finalTheme.schemes = {
      default: finalTheme,
    };

    for (const schemeName in schemes) {
      if (schemes.hasOwnProperty(schemeName)) {
        const scheme = schemes[schemeName];
        finalTheme.schemes[schemeName] = merge({}, finalTheme, scheme);
      }
    }
  }

  return finalTheme as ITheme;
}

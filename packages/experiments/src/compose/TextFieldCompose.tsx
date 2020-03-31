import { compose, ITheme } from '@uifabric/react-theming';
import { createTheme } from 'office-ui-fabric-react';
import { TextFieldBase } from './TextField/TextField.base';
import * as React from 'react';
import { getStyles } from './TextField/TextField.styles';

const legacyTokenMapper = {
  theme: (_: any, theme: ITheme) =>
    createTheme({
      semanticColors: {
        inputBackground: theme.colors.bodyText,
      },
    }),
};

const legacyStyleMapper = (styleFn: any) => {
  return ({ theme }: any) => styleFn({ theme });
};

export const MyTextField = compose(
  (props: any) => {
    return <TextFieldBase {...props} />;
  },
  {
    tokens: legacyTokenMapper,
    styles: legacyStyleMapper(getStyles),
  },
);

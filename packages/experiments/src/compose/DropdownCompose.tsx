import { compose, ITheme } from '@uifabric/react-theming';
import { createTheme } from 'office-ui-fabric-react';
import { DropdownBase } from './Dropdown/Dropdown.base';
import * as React from 'react';
import { getStyles } from './Dropdown/Dropdown.styles';

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

export const MyDropdown = compose(
  (props: any) => {
    return <DropdownBase {...props} />;
  },
  {
    tokens: legacyTokenMapper,
    styles: legacyStyleMapper(getStyles),
  },
);

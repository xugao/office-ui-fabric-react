import { compose, ITheme } from '@uifabric/react-theming';
import { createTheme } from 'office-ui-fabric-react';
import { ChoiceGroupBase } from './ChoiceGroup/ChoiceGroup.base';
import * as React from 'react';
import { getStyles } from './ChoiceGroup/ChoiceGroup.styles';

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

export const MyChoiceGroup = compose(
  (props: any) => {
    return <ChoiceGroupBase {...props} />;
  },
  {
    tokens: legacyTokenMapper,
  },
);

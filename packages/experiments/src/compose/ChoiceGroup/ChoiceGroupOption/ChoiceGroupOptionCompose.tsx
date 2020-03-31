import { compose, ITheme } from '@uifabric/react-theming';
import { createTheme } from 'office-ui-fabric-react';
import { ChoiceGroupOptionBase } from './ChoiceGroupOption.base';
import * as React from 'react';
import { getStyles } from './ChoiceGroupOption.styles';
import { mergeCssSets } from '@uifabric/merge-styles';

const legacyTokenMapper = {
  theme: (_: any, theme: ITheme) =>
    createTheme({
      semanticColors: {
        inputBackground: theme.colors.bodyText,
      },
    }),
};

const legacyStyleMapper = (styleFn: any) => {
  return ({ theme }: any) => {
    const result: any = {};
    [true, false].forEach(checked => {
      const checkedMap: any = {};
      result[checked.toString()] = checkedMap;
      [true, false].forEach(disabled => {
        const disabledMap: any = {};
        checkedMap[disabled.toString()] = disabledMap;
        [true, false].forEach(focused => {
          disabledMap[focused.toString()] = mergeCssSets([styleFn({ theme, checked, disabled, focused })]);
        });
      });
    });
    return result;
  };
};

export const MyChoiceGroupOption = compose(
  (props: any) => {
    return <ChoiceGroupOptionBase {...props} />;
  },
  {
    tokens: legacyTokenMapper,
    styles: legacyStyleMapper(getStyles),
    skipGetClasses: true,
  } as any,
);

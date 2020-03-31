import { mergeCssSets } from '@uifabric/merge-styles';
import { compose } from '@uifabric/react-theming';
import { createTheme, styled } from 'office-ui-fabric-react';
import * as React from 'react';

import { LabelBase } from './Label.base';
import { getStyles } from './Label.styles';
import { ILabelProps, ILabelStyleProps, ILabelStyles } from './Label.types';

const legacyTokenMapper = {
  theme: (_: any, theme: any) => {
    if (!theme.legacyTheme) {
      console.warn("No legacy theme. What's the deal?");
    }
    return theme.legacyTheme || createTheme({});
  },
};

const legacyStyleMapper = (styleFn: any) => {
  return ({ theme }: any) => {
    const result: any = {};
    [true, false].forEach(required => {
      const requiredMap: any = {};
      result[required.toString()] = requiredMap;
      [true, false].forEach(disabled => {
        requiredMap[disabled.toString()] = mergeCssSets([styleFn({ theme, disabled, required })]);
      });
    });
    return result;
  };
};

export const MyLabel = compose(
  (props: any) => {
    return <LabelBase {...props} />;
  },
  {
    tokens: legacyTokenMapper,
    styles: legacyStyleMapper(getStyles),
    skipGetClasses: true,
  } as any,
);

export const RealLabel: React.StatelessComponent<ILabelProps> = styled<ILabelProps, ILabelStyleProps, ILabelStyles>(
  LabelBase,
  getStyles,
  undefined,
  {
    scope: 'Label',
  },
);

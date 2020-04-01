import { MyChoiceGroup } from '@uifabric/experiments/lib/compose/ChoiceGroupCompose';
import * as React from 'react';
import { ThemeProvider, ITheme } from '@uifabric/react-theming';

const theme: ITheme = {
  direction: 'ltr',
  colors: {
    background: '#ffffff',
    bodyText: '#ffffff',
    subText: '#ffffff',
    disabledText: '#ffffff',
    brand: { values: [], index: -1 },
    accent: { values: [], index: -1 },
    neutral: { values: [], index: -1 },
    success: { values: [], index: -1 },
    warning: { values: [], index: -1 },
    danger: { values: [], index: -1 },
  },
  fonts: {
    default: '',
    mono: '',
    userContent: '',
  },
  fontSizes: {
    base: 10,
    scale: 10,
    unit: 'px',
  },
  animations: {
    fadeIn: {},
    fadeOut: {},
  },
  spacing: {
    base: 10,
    scale: 10,
    unit: 'px',
  },
  radius: {
    base: 10,
    scale: 10,
    unit: 'px',
  },
  icons: {},
  components: {},
  schemes: {},
};

export const ChoiceGroupNew = () => (
  <ThemeProvider theme={theme}>
    <MyChoiceGroup
      className="defaultChoiceGroup"
      defaultSelectedKey="B"
      options={[
        {
          key: 'A',
          text: 'Option A',
        },
        {
          key: 'B',
          text: 'Option B',
        },
        {
          key: 'C',
          text: 'Option C',
          disabled: true,
        },
        {
          key: 'D',
          text: 'Option D',
        },
      ]}
      // label="Pick one"
      required={true}
    />
  </ThemeProvider>
);

const scenario = <ChoiceGroupNew />;

export default scenario;

import { IComponentDemoPageProps } from '@uifabric/example-app-base';
import { ITheme, ThemeProvider } from '@uifabric/react-theming';
import { Label } from 'office-ui-fabric-react';
import * as React from 'react';
import { ChoiceGroup } from 'perf-test/lib/scenarios/ChoiceGroup';
import { ChoiceGroupNew } from 'perf-test/lib/scenarios/ChoiceGroupNew';

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

export const StyledLabelBasicExample: React.FunctionComponent<IComponentDemoPageProps> = props => {
  const [count, setCount] = React.useState(0);
  const onIncrement = () => setCount(count + 1);
  return (
    <ThemeProvider theme={theme}>
      <button onClick={onIncrement}>increment</button>
      <Label required>Lorem ipsum dolor sit amet {count}</Label>
    </ThemeProvider>
  );
};

export const OriginalChoiceGroupExample = ChoiceGroup;
export const ComposedChoiceGroupExample = ChoiceGroupNew;

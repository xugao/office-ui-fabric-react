import * as React from 'react';
import { ThemeProvider } from '@fluentui/react-theme-provider';
import { Button } from '@fluentui/react-button';

const ButtonExample = () => (
  <ThemeProvider>
    <Button content="Click here 2" />
  </ThemeProvider>
);

export default ButtonExample;

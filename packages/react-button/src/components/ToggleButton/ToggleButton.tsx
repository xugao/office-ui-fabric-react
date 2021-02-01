import * as React from 'react';
import { ToggleButtonProps } from './ToggleButton.types';
import { useToggleButton } from './useToggleButton';
import { renderToggleButton } from './renderToggleButton';
import { useInlineTokens } from '@fluentui/react-theme-provider/lib/compat';
import { useToggleButtonClasses } from './useToggleButtonClasses';

/**
 * Define a styled ToggleButton, using the `useToggleButton` hook.
 * {@docCategory Button}
 */
export const ToggleButton = React.forwardRef<HTMLElement, ToggleButtonProps>((props, ref) => {
  const state = useToggleButton(props, ref);

  useToggleButtonClasses(state);
  useInlineTokens(state, '--button');

  return renderToggleButton(state);
});

ToggleButton.displayName = 'ToggleButton';

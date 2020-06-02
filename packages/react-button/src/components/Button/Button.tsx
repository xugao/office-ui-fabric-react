import { ButtonBase } from './ButtonBase';
import { compose } from '@fluentui/react-compose';
import { ButtonProps } from './Button.types';
import { useButtonClasses } from './useButtonClasses';

export const Button = compose<'button', {}, {}, ButtonProps, ButtonProps>(ButtonBase, {
  classes: useButtonClasses,
  slots: {
    icon: 'div',
  },
  displayName: 'Button',
});

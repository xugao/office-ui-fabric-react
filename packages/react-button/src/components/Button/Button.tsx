import { compose } from '@fluentui/react-compose';
import { ButtonBase } from './ButtonBase';
import { ButtonProps } from './Button.types';
import { useButtonClasses } from './useButtonClassesLegacy';

export const Button = compose<'button', ButtonProps, ButtonProps, {}, {}>(ButtonBase, {
  classes: useButtonClasses, // createClassResolver(classes),
  displayName: 'Button',
});

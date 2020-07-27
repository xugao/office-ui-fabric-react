import { ClassFunction } from '@fluentui/react-compose';
import { useClasses } from '../../Utilities';
import { ICheckboxStyleProps, ICheckboxState, ICheckboxStyles } from './Checkbox.types';
import { getStyles } from './compat/Checkbox.styles';

/* eslint-disable deprecation/deprecation */

export const useCheckboxClasses: ClassFunction = (state: ICheckboxState) => {
  // console.log('state', state);
  return useClasses<ICheckboxState['styles'], ICheckboxStyleProps, ICheckboxStyles>({
    customizationScopeName: 'Checkbox',
    useStaticStyles: false,
    stylesProp: state.styles,
    styleProps: {
      className: state.className,
      disabled: state.disabled,
      indeterminate: state.indeterminate,
      checked: state.checked,
      reversed: state.boxSide === 'end',
      isUsingCustomLabelRender: !!state.onRenderLabel,
    },
    baseStyles: getStyles,
  });
};

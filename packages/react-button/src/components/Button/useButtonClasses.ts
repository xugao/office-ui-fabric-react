import { createClassResolver, ClassDictionary } from '@fluentui/react-compose';
import * as classes from './Button.scss';
import { ButtonProps, ButtonSlots } from './Button.types';

export function useButtonClasses(state: ButtonProps, slots: ButtonSlots): ClassDictionary {
  const resolveClasses = createClassResolver(classes);
  return resolveClasses({ state, slots }, [
    state.className,
    state.primary,
    state.iconOnly,
    state.circular,
    state.fluid,
    state.disabled,
    state.size,
  ]);
}

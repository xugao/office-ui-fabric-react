import { createClassResolver, ClassDictionary } from '@fluentui/react-compose';
import * as classes from './Button.scss';
import { ButtonProps, ButtonSlots } from './Button.types';

const resolveClasses = createClassResolver(classes);

export function useButtonClasses(state: ButtonProps, slots: ButtonSlots): ClassDictionary {
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

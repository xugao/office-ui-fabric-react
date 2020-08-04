import { getGlobalClassNames, GlobalClassNames } from '@uifabric/styling';
import { useTheme } from './useTheme';

// TODO: find better place for this.
export function useGlobalClassNames<T>(classNames: GlobalClassNames<T>): GlobalClassNames<T> {
  const theme = useTheme();

  return getGlobalClassNames(
    classNames,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme as any,
  );
}

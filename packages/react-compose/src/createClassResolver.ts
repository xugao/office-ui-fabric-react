import { GenericDictionary, ClassDictionary, ResolveClassesOptions } from './types';

const RETURN_VALUE = '__retval__';
const MAX_CACHE_COUNT = 50;

// tslint:disable-next-line:no-any
interface RecursiveMemoNode extends Map<any, RecursiveMemoNode> {
  // tslint:disable-next-line:no-any
  [RETURN_VALUE]?: any;
}

/**
 * `createClassResolver` is a factory function which creates a state to classmap resolver for
 * slot specific class names. It can be used in conjunction with the `compose` option `classes` to
 * inject css modules without writing cx(...) logic manually distributing classnames.
 *
 * Class names which map to slots are automatically distributed to correct slot props.
 *
 * Class names with an underscore are interpretted as enum matchable classes. For example,
 * the class "size_large" would be applied to the `root` slot when the component's state contains
 * a prop `size` with a value `large`.
 *
 * Remaining class names would be interpretted as modifiers, applied to the `root` slot when
 * the component `state` contains a truthy matching prop name.
 */
export const createClassResolver = (staticClasses: ClassDictionary) => {
  return memoize((options: ResolveClassesOptions) => {
    const { state, slots, dynamicClasses } = options;
    const classMap: GenericDictionary = {};
    const modifiers: string[] = [];

    let classesList = [staticClasses];
    if (dynamicClasses) {
      classesList = classesList.concat(dynamicClasses.map(c => (typeof c === 'function' ? c(state, slots) : c)));
    }

    // Add the default className to root
    addClassTo(classMap, 'root', state.className);

    for (const classes of classesList) {
      // Iterate through classes
      Object.keys(classes).forEach((key: string) => {
        const classValue = classes[key];

        if (classValue) {
          // If the class is named the same as a slot, add it to the slot.
          if (slots.hasOwnProperty(key)) {
            addClassTo(classMap, key, classValue);
          } else if (key.indexOf('_') >= 0) {
            // The class is an enum value. Add if the prop exists and matches.
            const parts = key.split('_');
            const enumName = parts[0];
            const enumValue = parts[1];

            state[enumName] === enumValue && modifiers.push(classValue);
          } else {
            state[key] && modifiers.push(classValue);
          }
        }
      });
    }

    // Convert the className arrays to strings.
    Object.keys(classMap).forEach((key: string) => (classMap[key] = classMap[key].concat(modifiers).join(' ')));

    return classMap;
  });
};

/**
 * Helper function to update slot arrays within a class map.
 */
function addClassTo(slotProps: GenericDictionary, slotName: string, className?: string | false) {
  if (className) {
    if (!slotProps[slotName]) {
      slotProps[slotName] = [className];
    } else {
      slotProps[slotName].push(className);
    }
  }
}

// tslint:disable-next-line:no-any
function traverseEdge(current: RecursiveMemoNode, value: any): any {
  value = normalizeValue(value);

  if (!current.has(value)) {
    current.set(value, new Map());
  }

  return current.get(value);
}

// tslint:disable-next-line:no-any
function traverseMap(current: RecursiveMemoNode, inputs: any[]): RecursiveMemoNode {
  if (inputs.length === 0) {
    current = traverseEdge(current, '__empty__');
  } else {
    for (const input of inputs) {
      current = traverseEdge(current, input);
    }
  }

  return current;
}

// tslint:disable-next-line:no-any
function normalizeValue(value: any): string {
  switch (value) {
    case undefined:
      return '__undefined__';
    case null:
      return '__null__';
    default:
      return value;
  }
}

// tslint:disable-next-line:no-any
type ClassResolver = (options: ResolveClassesOptions, deps?: any[]) => ClassDictionary;

function memoize(getValue: ClassResolver): ClassResolver {
  const cacheMap: RecursiveMemoNode = new Map();
  let cacheMissCount = 0;
  let disableCaching = false;

  // tslint:disable-next-line:no-any
  const memoizedGetValue: ClassResolver = (options: ResolveClassesOptions, deps?: any[]): any => {
    let current = cacheMap;
    if (!disableCaching && deps) {
      current = traverseMap(cacheMap, deps);
      const cacheResult = current[RETURN_VALUE];
      if (cacheResult) {
        return cacheResult;
      }
    }

    const value = getValue(options);

    if (!disableCaching && deps) {
      current[RETURN_VALUE] = value;
      cacheMissCount++;

      if (cacheMissCount > MAX_CACHE_COUNT) {
        disableCaching = true;
      }
    }

    return value;
  };

  return memoizedGetValue;
}

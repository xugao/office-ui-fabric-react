import { createClassResolver } from './createClassResolver';

describe('createClassResolver', () => {
  const classResolver = createClassResolver({
    root: 'root',
    slot1: 'slot1',
    slot2: 'slot2',
    primary: 'primary',
    size_small: 'small',
    size_medium: 'medium',
  });
  const slots = { root: null, slot1: null, slot2: null };

  it('can resolve slot classes', () => {
    expect(
      classResolver({
        state: {},
        slots,
      }),
    ).toEqual({
      root: 'root',
      slot1: 'slot1',
      slot2: 'slot2',
    });
  });

  it('can resolve modifiers', () => {
    expect(
      classResolver({
        state: { primary: true },
        slots,
      }),
    ).toEqual({
      root: 'root primary',
      slot1: 'slot1 primary',
      slot2: 'slot2 primary',
    });
  });

  it("can ignore props which don't resolve to slots or modifiers", () => {
    expect(classResolver({ state: { primary: true, secondary: true }, slots })).toEqual({
      root: 'root primary',
      slot1: 'slot1 primary',
      slot2: 'slot2 primary',
    });
  });

  it('can resolve enums', () => {
    // Can resolve
    expect(classResolver({ state: { size: 'small' }, slots })).toEqual({
      root: 'root small',
      slot1: 'slot1 small',
      slot2: 'slot2 small',
    });
  });

  it('can resolve mixed content, including a className in props', () => {
    // Can resolve
    expect(
      classResolver({
        state: { className: 'foo', primary: true, size: 'medium' },
        slots,
      }),
    ).toEqual({
      root: 'foo root primary medium',
      slot1: 'slot1 primary medium',
      slot2: 'slot2 primary medium',
    });
  });

  it('can resolve dynamic classes', () => {
    expect(
      classResolver({
        state: { primary: true },
        slots,
        dynamicClasses: [state => ({ slot2: state.primary ? 'dynamic-func' : '' }), { slot2: 'dynamic-obj' }],
      }),
    ).toEqual({
      root: 'root primary',
      slot1: 'slot1 primary',
      slot2: 'slot2 dynamic-func dynamic-obj primary',
    });
  });

  fit('return memoized results', () => {
    const expected = {
      root: 'root primary',
      slot1: 'slot1 primary',
      slot2: 'slot2 primary',
    };

    expect(
      classResolver(
        {
          state: { primary: true },
          slots,
        },
        [true, 'foo'],
      ),
    ).toEqual(expected);

    expect(
      classResolver(
        {
          state: {},
          slots: {},
        },
        [true, 'foo'],
      ),
    ).toEqual(expected);
  });
});

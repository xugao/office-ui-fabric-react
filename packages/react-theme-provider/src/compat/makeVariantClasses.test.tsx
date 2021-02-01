import * as React from 'react';
import { makeVariantClasses } from './makeVariantClasses';
import { Stylesheet, InjectionMode } from '@fluentui/merge-styles';
import { ReactWrapper } from 'enzyme';
import { MergeStylesProvider } from './styleRenderers/mergeStylesRenderer';
import { ThemeContext } from './ThemeContext';
import { safeMount } from '@fluentui/test-utilities';
import { Theme } from './types';

describe('makeVariantClasses', () => {
  const _stylesheet: Stylesheet = Stylesheet.getInstance();

  _stylesheet.setConfig({ injectionMode: InjectionMode.none });

  beforeEach(() => {
    _stylesheet.reset();
  });

  const useClasses = makeVariantClasses({
    name: 'Foo',
    prefix: '--foo',
    styles: {
      root: {
        background: 'var(--foo-background)',
        color: 'var(--foo-color)',
      },
    },

    variants: {
      root: {
        color: 'black',
        background: 'red',
      },
      primary: {
        background: 'green',
      },
    },
  });

  const Foo = (props: { className?: string; primary?: boolean }) => {
    const state = { ...props };

    useClasses(state);

    return <button className={state.className} />;
  };

  it('can render default base variant', () => {
    safeMount(
      <MergeStylesProvider>
        <Foo />
      </MergeStylesProvider>,
      (wrapper: ReactWrapper) => {
        expect(
          wrapper
            .first()
            .getDOMNode()
            .getAttribute('class'),
        ).toEqual('Foo-0');
        expect(_stylesheet.getRules()).toEqual(
          // eslint-disable-next-line @fluentui/max-len
          '.Foo-0{background:var(--foo-background);color:var(--foo-color);--foo-color:black;--foo-background:red;}.Foo--primary-1{--foo-background:green;}',
        );
      },
    );
  });

  it('can render primary variant', () => {
    safeMount(
      <MergeStylesProvider>
        <Foo primary />
      </MergeStylesProvider>,
      (wrapper: ReactWrapper) => {
        expect(
          wrapper
            .first()
            .getDOMNode()
            .getAttribute('class'),
        ).toEqual('Foo-0 Foo--primary-1');
        expect(_stylesheet.getRules()).toEqual(
          // eslint-disable-next-line @fluentui/max-len
          '.Foo-0{background:var(--foo-background);color:var(--foo-color);--foo-color:black;--foo-background:red;}.Foo--primary-1{--foo-background:green;}',
        );
      },
    );
  });

  it('can respect themed variant overrides', () => {
    const theme = ({
      components: {
        Foo: {
          variants: {
            primary: {
              background: 'purple',
            },
          },
        },
      },
    } as unknown) as Theme;

    safeMount(
      <ThemeContext.Provider value={theme}>
        <MergeStylesProvider>
          <Foo primary />
        </MergeStylesProvider>
      </ThemeContext.Provider>,
      (wrapper: ReactWrapper) => {
        expect(wrapper.getDOMNode().getAttribute('class')).toEqual('Foo-0 Foo--primary-1');
        expect(_stylesheet.getRules()).toEqual(
          // eslint-disable-next-line @fluentui/max-len
          '.Foo-0{background:var(--foo-background);color:var(--foo-color);--foo-color:black;--foo-background:red;}.Foo--primary-1{--foo-background:purple;}',
        );
      },
    );
  });
});

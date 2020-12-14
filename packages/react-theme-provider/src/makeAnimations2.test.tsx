import * as React from 'react';
import { Stylesheet, InjectionMode } from '@fluentui/merge-styles';
import { safeMount } from '@fluentui/test-utilities';
import { makeAnimations } from './makeAnimations2';

describe('makeAnimations', () => {
  const stylesheet: Stylesheet = Stylesheet.getInstance();

  beforeEach(() => {
    stylesheet.setConfig({ injectionMode: InjectionMode.none });
    stylesheet.reset();
  });

  it('can make animations', () => {
    const useAnimations = makeAnimations(theme => ({
      root: {
        animationName: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        animationDuration: '5s',
        animationTimingFunction: 'infinite',
      },
      foo: {
        animationName: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        animationDuration: '5s',
        animationTimingFunction: 'infinite',
      },
    }));

    const TestComponent = () => {
      const classes = useAnimations();

      return <div className={classes.root} />;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      // eslint-disable-next-line @fluentui/max-len
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}@keyframes css-1{from{opacity:1;}to{opacity:0;}}.root-2{animation-name:css-0;animation-duration:5s;animation-timing-function:infinite;}.foo-3{animation-name:css-1;animation-duration:5s;animation-timing-function:infinite;}',
    );
  });

  it('can make animations for style array', () => {
    const useAnimations = makeAnimations({
      root: [
        {
          animationName: [
            {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          ],
          animationDuration: '5s',
          animationTimingFunction: 'infinite',
        },
        {
          animationName: [
            {
              from: { opacity: 1 },
              to: { opacity: 0 },
            },
          ],
          animationDuration: '3s',
          animationTimingFunction: 'infinite',
        },
      ],
    });

    const TestComponent = () => {
      useAnimations();
      return null;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}@keyframes css-1{from{opacity:1;}to{opacity:0;}}.root-2{animation-name:css-1;animation-duration:3s;animation-timing-function:infinite;}',
    );
  });

  it('can handle animation-name css', () => {
    const useAnimations = makeAnimations({
      root: [
        {
          animationName: {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          animationDuration: '5s',
          animationTimingFunction: 'infinite',
        },
      ],
    });

    const TestComponent = () => {
      useAnimations();
      return null;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      // eslint-disable-next-line @fluentui/max-len
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}.root-1{animation-name:css-0;animation-duration:5s;animation-timing-function:infinite;}',
    );
  });

  it('can handle multiple animations css', () => {
    const useAnimations = makeAnimations({
      root: [
        {
          animationName: [
            {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
            {
              from: { opacity: 1 },
              to: { opacity: 0 },
            },
          ],
          animationDuration: '5s',
          animationTimingFunction: 'infinite',
        },
      ],
    });

    const TestComponent = () => {
      useAnimations();
      return null;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      // eslint-disable-next-line @fluentui/max-len
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}@keyframes css-1{from{opacity:1;}to{opacity:0;}}.root-2{animation-name:css-0,css-1;animation-duration:5s;animation-timing-function:infinite;}',
    );
  });
});

import * as React from 'react';
import { Stylesheet, InjectionMode } from '@fluentui/merge-styles';
import { safeMount } from '@fluentui/test-utilities';
import { makeAnimations } from './makeAnimations3';
import { setWarningCallback } from '@fluentui/utilities';

describe('makeAnimations', () => {
  const stylesheet: Stylesheet = Stylesheet.getInstance();
  const warn = jest.fn();
  const getLastWarning = (): string => warn.mock.calls.slice(-1)[0][0];

  beforeEach(() => {
    stylesheet.setConfig({ injectionMode: InjectionMode.none });
    stylesheet.reset();

    setWarningCallback(warn);
  });

  afterEach(() => {
    warn.mockReset();
    setWarningCallback(undefined);
  });

  it('can make animations', () => {
    const useAnimations = makeAnimations(theme => [
      {
        testAnimation: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        testAnimation2: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      {
        root: {
          animation: '$testAnimation 5s infinite',
        },
        foo: {
          animation: '$testAnimation2 5s infinite',
        },
      },
    ]);

    const TestComponent = () => {
      const classes = useAnimations();

      return <div className={classes.root} />;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      // eslint-disable-next-line @fluentui/max-len
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}@keyframes css-1{from{opacity:0;}to{opacity:1;}}.root-2{animation:css-0 5s infinite;}.foo-3{animation:css-1 5s infinite;}',
    );
  });

  it('can make animations for style array', () => {
    const useAnimations = makeAnimations([
      {
        testAnimation: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      {
        root: [
          {
            animation: '$testAnimation 5s infinite',
          },
          {
            animation: '$testAnimation 3s infinite',
          },
        ],
      },
    ]);

    const TestComponent = () => {
      useAnimations();
      return null;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}.root-1{animation:css-0 3s infinite;}',
    );
  });

  it('can handle animation-name css', () => {
    const useAnimations = makeAnimations([
      {
        testAnimation: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      {
        root: [
          {
            animationName: '$testAnimation',
            animationDuration: '5s',
            animationTimingFunction: 'infinite',
          },
        ],
      },
    ]);

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
    const useAnimations = makeAnimations([
      {
        testAnimation: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        testAnimation2: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      {
        root: [
          {
            animationName: '$testAnimation $testAnimation2',
            animationDuration: '5s',
            animationTimingFunction: 'infinite',
          },
        ],
      },
    ]);

    const TestComponent = () => {
      useAnimations();
      return null;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      // eslint-disable-next-line @fluentui/max-len
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}@keyframes css-1{from{opacity:0;}to{opacity:1;}}.root-2{animation-name:css-0 css-1;animation-duration:5s;animation-timing-function:infinite;}',
    );
  });

  it('can warn invalid reference', () => {
    const useAnimations = makeAnimations([
      {
        testAnimation: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      {
        root: [
          {
            animation: '$invalidRef 5s infinite',
          },
        ],
      },
    ]);

    const TestComponent = () => {
      const classes = useAnimations();

      return <div className={classes.root} />;
    };

    safeMount(<TestComponent />);

    expect(stylesheet.getRules()).toEqual(
      '@keyframes css-0{from{opacity:0;}to{opacity:1;}}.root-1{animation:$invalidRef 5s infinite;}',
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(getLastWarning()).toMatch('makeAnimations: referenced keyframes rule "$invalidRef" is not defined.');
  });
});

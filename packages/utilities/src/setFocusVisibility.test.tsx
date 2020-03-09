import * as React from 'react';
import { FocusRects } from './useFocusRects';
import { IsFocusHiddenClassName, IsFocusVisibleClassName, setFocusVisibility } from './setFocusVisibility';
import * as getWindow from './dom/getWindow';
import { ReactWrapper, mount } from 'enzyme';

describe('setFocusVisibility', () => {
  let focusRects: ReactWrapper;
  let classNames: string[] = [];

  // tslint:disable-next-line:no-any
  const mockWindow: { [key: string]: any } = {
    addEventListener: (name: string, callback: Function) => {
      mockWindow[name] = callback;
    },
    removeEventListener: (name: string, callback: Function) => {
      if (mockWindow[name] === callback) {
        mockWindow[name] = undefined;
      }
    },
    document: {
      body: {
        classList: {
          contains: (name: string) => classNames.indexOf(name) > -1,
          add: (name: string) => classNames.indexOf(name) < 0 && classNames.push(name),
          remove: (name: string) => classNames.indexOf(name) > -1 && classNames.splice(classNames.indexOf(name), 1),
          toggle: (name: string, val: boolean) => {
            const hasClass = classNames.indexOf(name) > -1;
            if (hasClass !== val) {
              if (hasClass) {
                classNames.splice(classNames.indexOf(name), 1);
              } else {
                classNames.push(name);
              }
            }
          }
        }
      }
    }
  };
  const mockTarget = {
    ownerDocument: {
      defaultView: mockWindow
    }
  };

  beforeEach(() => {
    spyOn(getWindow, 'getWindow').and.returnValue(mockWindow);
    classNames = [];
    focusRects = mount(<FocusRects window={mockWindow as Window} />);
  });

  afterEach(() => {
    focusRects.unmount();
  });

  it('hints to show focus', () => {
    setFocusVisibility(true);
    expect(classNames.indexOf(IsFocusHiddenClassName) > -1).toEqual(false);
    expect(classNames.indexOf(IsFocusVisibleClassName) > -1).toEqual(true);
  });

  it('hints to hide focus', () => {
    setFocusVisibility(true);
    expect(classNames.indexOf(IsFocusHiddenClassName) > -1).toEqual(false);
    expect(classNames.indexOf(IsFocusVisibleClassName) > -1).toEqual(true);
    setFocusVisibility(false);
    expect(classNames.indexOf(IsFocusHiddenClassName) > -1).toEqual(true);
    expect(classNames.indexOf(IsFocusVisibleClassName) > -1).toEqual(false);
  });

  it('hints to show focus with target specified', () => {
    setFocusVisibility(true, mockTarget as Element);
    expect(classNames.indexOf(IsFocusHiddenClassName) > -1).toEqual(false);
    expect(classNames.indexOf(IsFocusVisibleClassName) > -1).toEqual(true);
  });

  it('hints to hide focus with target specified', () => {
    setFocusVisibility(true, mockTarget as Element);
    expect(classNames.indexOf(IsFocusHiddenClassName) > -1).toEqual(false);
    expect(classNames.indexOf(IsFocusVisibleClassName) > -1).toEqual(true);
    setFocusVisibility(false, mockTarget as Element);
    expect(classNames.indexOf(IsFocusHiddenClassName) > -1).toEqual(true);
    expect(classNames.indexOf(IsFocusVisibleClassName) > -1).toEqual(false);
  });
});

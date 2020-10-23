import * as React from 'react';
import { styled } from '../../Utilities';
import { DropdownBase } from './Dropdown.base';
import { getStyles } from './Dropdown.styles';
import { IDropdownProps, IDropdownStyleProps, IDropdownStyles } from './Dropdown.types';

// test
export const Dropdown: React.FunctionComponent<IDropdownProps> = styled<
  IDropdownProps,
  IDropdownStyleProps,
  IDropdownStyles
>(DropdownBase, getStyles, undefined, {
  scope: 'Dropdown',
});
Dropdown.displayName = 'Dropdown';

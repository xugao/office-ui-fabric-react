import * as React from 'react';
import { Theme } from './types';
import { getTheme } from '@uifabric/styling';

export const ThemeContext = React.createContext<Theme>(getTheme());

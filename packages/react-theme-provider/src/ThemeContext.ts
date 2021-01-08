import * as React from 'react';
import { Theme } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ThemeContext = React.createContext<(Theme & { [key: string]: any }) | undefined>(undefined);

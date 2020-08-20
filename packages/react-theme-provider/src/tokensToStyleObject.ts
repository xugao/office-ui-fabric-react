import * as React from 'react';
import { TokenSetType } from '@fluentui/theme';

export const tokensToStyleObject = (
  tokens?: TokenSetType,
  prefix?: string,
  style: React.CSSProperties | undefined = {},
): React.CSSProperties => {
  if (tokens) {
    for (const name of Object.keys(tokens)) {
      const varName = prefix ? `${prefix}${name === 'default' ? '' : '-' + name}` : `--${name}`;
      const varValue = tokens[name];

      if (varValue && typeof varValue === 'object') {
        tokensToStyleObject(varValue as { [key: string]: TokenSetType }, varName, style);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (style as any)[varName] = varValue;
      }
    }
  }
  return style;
};

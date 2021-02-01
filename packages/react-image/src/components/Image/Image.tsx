import * as React from 'react';
import { ImageProps } from './Image.types';
import { makeClasses } from '@fluentui/react-utils';
import { useInlineTokens } from '@fluentui/react-theme-provider/lib/compat';
import * as classes from './Image.scss';
import { useImage } from './useImage';

// Create a hook to resolve classnames.
export const useImageClasses = makeClasses(classes);

export const Image = React.forwardRef<HTMLElement, ImageProps>((props, ref) => {
  const { render, state } = useImage(props, ref);

  // Apply styling.
  useImageClasses(state);
  useInlineTokens(state, '--image');

  // Render component.
  return render(state);
});

Image.displayName = 'Image';

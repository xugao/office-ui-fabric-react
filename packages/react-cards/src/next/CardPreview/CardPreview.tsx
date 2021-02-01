import * as React from 'react';
import { useInlineTokens } from '@fluentui/react-theme-provider/lib/compat';
import { useFocusRects } from '@fluentui/utilities';
import { CardSectionProps } from '../CardSection/CardSection.types';
import { useCardSection } from '../CardSection/useCardSection';
import { useCardPreviewClasses } from './useCardPreviewClasses';

export const CardPreview = React.forwardRef<HTMLElement, CardSectionProps>((props, ref) => {
  const { render, state } = useCardSection(props, ref);

  useCardPreviewClasses(state);
  useFocusRects(state.ref as any);
  useInlineTokens(state, '--cardPreview');

  return render(state);
});

CardPreview.displayName = 'CardPreview';

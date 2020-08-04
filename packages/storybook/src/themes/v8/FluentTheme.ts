import { Theme } from '@fluentui/react-theme-provider';

export const FluentTheme = ({
  tokens: {
    palette: {
      accent: '#0078D4',
    },

    body: {
      background: 'white',
      contentColor: 'black',
    },

    accent: {
      background: 'var(--palette-accent)',
      disabled: {
        background: '#FAFAFA',
      },
      hovered: {
        background: '#0072C9',
      },
      pressed: {
        background: '#0078D4',
      },
    },

    button: {
      background: '#F5F5F5',
      disabled: {
        background: '#FAFAFA',
      },
      hovered: {
        background: '#F2F2F2',
      },
      pressed: {
        background: '#F7F7F7',
      },
    },
  },
  stylesheets: [],
} as unknown) as Theme; // TODO: fix this

import { PartialTheme } from '@fluentui/react-theme-provider';

export const FluentTheme: PartialTheme = {
  tokens: {
    body: {
      background: 'white',
      contentColor: 'black',
    },

    accent: {
      background: '#0078D4',
      borderColor: 'transparent',
      contentColor: 'white',
      iconColor: 'inherit',

      disabled: {
        background: '#FAFAFA',
        borderColor: 'var(--accent-disabled-background)',
        contentColor: '#c8c6c4',
        iconColor: 'var(--accent-disabled-contentColor)',
      },
      hovered: {
        background: '#0072C9',
        borderColor: 'var(--accent-borderColor)',
        contentColor: 'var(--accent-contentColor)',
        iconColor: 'var(--accent-icon)',
      },
      pressed: {
        background: '#0078D4',
        borderColor: 'var(--accent-borderColor)',
        contentColor: 'var(--accent-contentColor)',
        iconColor: 'var(--accent-iconColor)',
      },
      focused: {
        background: '#0078D4',
        borderColor: 'var(--accent-borderColor)',
        contentColor: 'var(--accent-contentColor)',
        iconColor: 'var(--accent-iconColor)',
      },
    },

    button: {
      size: {
        smallest: '8px',
        smaller: '16px',
        small: '24px',
        regular: '32px',
        large: '40px',
        larger: '48px',
        largest: '64px',
      },
      padding: '0 16px',
      height: 'var(--button-size-regular)',
      minHeight: 'var(--button-size-regular)',
      contentGap: '10px',
      iconSize: '16px',
      borderRadius: '2px',
      borderWidth: '1px',

      fontFamily: `'Segoe UI', 'Helvetica Neue', 'Apple Color Emoji', 'Segoe UI Emoji', Helvetica, Arial, sans-serif`,
      fontSize: '14px',
      fontWeight: 'normal',

      focusColor: '#000',
      focusInnerColor: '#fff',

      background: 'white',
      borderColor: '#e1dfdd',
      contentColor: '#2c2621',
      iconColor: 'inherit',

      disabled: {
        background: '#FAFAFA',
        borderColor: 'var(--button-disabled-background)',
        contentColor: '#c8c6c4',
        iconColor: 'var(--button-disabled-contentColor)',
      },
      hovered: {
        background: 'white',
        borderColor: 'var(--button-borderColor)',
        contentColor: 'var(--button-contentColor)',
        iconColor: 'var(--button-iconColor)',
      },
      pressed: {
        background: 'white',
        borderColor: 'var(--button-borderColor)',
        contentColor: 'var(--button-contentColor)',
        iconColor: 'var(--button-iconColor)',
      },
      focused: {
        background: 'var(--button-background)',
        borderColor: 'var(--button-borderColor)',
        contentColor: 'var(--button-contentColor)',
        iconColor: 'var(--button-iconColor)',
      },
    },
  },
  stylesheets: [],
};

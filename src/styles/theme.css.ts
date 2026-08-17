import { createGlobalTheme } from '@vanilla-extract/css'

export const vars = createGlobalTheme(':root', {
  color: {
    bg: '#ffffff',
    fg: '#18181b',
    muted: '#71717a',
    accent: '#2563eb',
    border: '#e4e4e7',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  font: {
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Apple SD Gothic Neo", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  radius: {
    sm: '4px',
    md: '8px',
  },
})

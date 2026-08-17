import { style } from '@vanilla-extract/css'

import { vars } from '~/styles/theme.css'

export const layout = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  maxWidth: '720px',
  margin: '0 auto',
  padding: `0 ${vars.space.md}`,
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: `${vars.space.lg} 0`,
  borderBottom: `1px solid ${vars.color.border}`,
})

export const brand = style({
  fontFamily: vars.font.mono,
  fontWeight: 700,
})

export const nav = style({
  display: 'flex',
  gap: vars.space.md,
  marginLeft: 'auto',
  fontSize: '14px',
  color: vars.color.muted,
})

export const navLinkActive = style({
  color: vars.color.accent,
  fontWeight: 600,
})

export const main = style({
  flex: 1,
  padding: `${vars.space.xl} 0`,
})

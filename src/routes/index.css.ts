import { style } from '@vanilla-extract/css'

import { vars } from '~/styles/theme.css'

export const name = style({
  margin: 0,
  fontSize: '32px',
  lineHeight: 1.3,
})

export const tagline = style({
  margin: `${vars.space.sm} 0 0`,
  color: vars.color.muted,
})

export const intro = style({
  margin: `${vars.space.lg} 0 0`,
})

export const githubLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginTop: vars.space.xl,
  padding: `${vars.space.sm} ${vars.space.md}`,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.md,
  fontFamily: vars.font.mono,
  fontSize: '14px',
  transition: 'border-color 0.15s, color 0.15s',
  ':hover': {
    borderColor: vars.color.accent,
    color: vars.color.accent,
  },
})

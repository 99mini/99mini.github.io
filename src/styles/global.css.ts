import { globalStyle } from '@vanilla-extract/css'

import { vars } from './theme.css'

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
})

globalStyle('html, body, #root', {
  margin: 0,
  padding: 0,
  height: '100%',
})

globalStyle('body', {
  background: vars.color.bg,
  color: vars.color.fg,
  fontFamily: vars.font.body,
  lineHeight: 1.6,
  WebkitFontSmoothing: 'antialiased',
})

globalStyle('a', {
  color: 'inherit',
  textDecoration: 'none',
})

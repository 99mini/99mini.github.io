import { createRouter, type RouterHistory } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

export function buildRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

export type AppRouter = ReturnType<typeof buildRouter>

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}

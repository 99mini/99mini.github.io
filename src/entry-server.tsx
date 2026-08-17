import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { OverlayProvider } from 'overlay-kit'
import { renderToString } from 'react-dom/server'

import { buildRouter } from './router'

/** 빌드 시 정적으로 생성할 경로 목록 (동적 파라미터 라우트는 제외). */
export function getStaticPaths(): string[] {
  const router = buildRouter()

  return Object.values(router.routesById)
    .map((route) => (route as { fullPath?: string }).fullPath)
    .filter((path): path is string => Boolean(path))
    .filter((path) => !path.includes('$'))
    .map((path) => (path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path))
    .filter((path, index, all) => all.indexOf(path) === index)
    .sort()
}

export async function render(url: string): Promise<string> {
  const router = buildRouter(createMemoryHistory({ initialEntries: [url] }))
  await router.load()

  return renderToString(
    <OverlayProvider>
      <RouterProvider router={router} />
    </OverlayProvider>,
  )
}

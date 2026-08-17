import { RouterProvider } from '@tanstack/react-router'
import { OverlayProvider } from 'overlay-kit'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { buildRouter } from './router'

const router = buildRouter()

const app = (
  <StrictMode>
    <OverlayProvider>
      <RouterProvider router={router} />
    </OverlayProvider>
  </StrictMode>
)

const rootEl = document.getElementById('root')!

// 프리렌더된 마크업이 있으면 hydrate, 없으면 CSR 로 마운트한다.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}

import { fileURLToPath, URL } from 'node:url'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 유저 페이지(99mini.github.io)는 루트에 배포되므로 base 는 '/'.
  //
  // 주의: `/<top-level>` 경로는 같은 이름의 repo 에서 Pages 를 켜는 순간
  // 그 repo(`99mini.github.io/<repo>/`)에 조용히 가려진다. 라우트 이름과 겹치는 repo 에는
  // Pages 를 켜지 않는 것으로 관리한다. (`sub`, `assets` 등)
  base: '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      // `*.css.ts` (vanilla-extract) 는 라우트 파일이 아니다.
      routeFileIgnorePattern: '\\.css\\.ts$',
    }),
    react(),
    vanillaExtractPlugin(),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})

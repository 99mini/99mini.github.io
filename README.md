# 99mini.github.io

React + TanStack Router 기반 정적 사이트. 라우트마다 실제 HTML 을 프리렌더(SSG)해서 GitHub Pages 에 배포한다.

## 스택

| 영역        | 도구                                        |
| ----------- | ------------------------------------------- |
| 번들러      | Vite 8                                      |
| 프레임워크  | React 19 + TanStack Router (file-based)     |
| 언어        | TypeScript 7                                |
| 스타일      | vanilla-extract                             |
| 린트/포맷   | oxlint / oxfmt                              |
| 유틸        | es-toolkit, es-hangul, ts-pattern, date-fns |
| 오버레이    | overlay-kit                                 |
| 런타임 관리 | mise (Node 24 LTS, pnpm 11)                 |

## 시작하기

[mise](https://mise.jdx.dev) 로 Node/pnpm 버전을 관리한다. `mise.toml` 이 로컬과 CI 양쪽의 단일 소스다.

```bash
mise trust     # 최초 1회 (mise 는 신뢰하지 않은 설정 파일을 실행하지 않는다)
mise install   # mise.toml 에 적힌 node/pnpm 설치
pnpm install
```

mise 없이 쓴다면 `mise.toml` 의 버전(Node 24.19.0 / pnpm 11.22.0)을 직접 맞추면 된다.

## 스크립트

```bash
pnpm dev          # 개발 서버
pnpm build        # 클라이언트 빌드 → 타입체크 → SSR 빌드 → 프리렌더
pnpm preview      # 빌드 결과 확인
pnpm lint         # oxlint
pnpm format       # oxfmt
pnpm format:check # 포맷 검사 (CI 와 동일)
pnpm typecheck    # tsc --noEmit

mise run check    # lint + format:check + typecheck 한 번에
```

> pnpm 버전은 `mise.toml` 과 `package.json` 의 `packageManager` 두 곳에 있다. 올릴 때 같이 올릴 것.

## 라우팅 / 배포 구조

- `src/routes/**/*.tsx` 파일이 곧 라우트다. `@tanstack/router-plugin` 이 `src/routeTree.gen.ts` 를 생성한다 (git 추적 제외).
- `scripts/prerender.mjs` 가 파라미터 없는 모든 라우트를 순회하며 `dist/<path>/index.html` 을 생성한다.
- 각 경로에 실제 HTML 파일이 존재하므로 `#` 해시 라우팅이나 `404.html` 리다이렉트 트릭이 필요 없다.
  (`dist/404.html` 은 예상치 못한 경로용 안전망으로만 생성한다.)

```
dist/index.html          → /
dist/sub/index.html      → /sub
dist/assets/*            → /assets/*
dist/404.html
```

### ⚠️ 최상위 경로 shadowing 주의

유저 페이지에서 `99mini.github.io/<repo>/` 는 항상 그 repo 의 Pages 가 차지한다.
따라서 **라우트 이름과 같은 이름의 repo 에서 Pages 를 켜면 이 사이트의 해당 페이지가 조용히 가려진다.**
빌드도 CI 도 전부 통과하므로 알아채기 어렵다.

- 현재 선점 중인 이름: `sub`, `assets` (+ 앞으로 추가하는 라우트)
- 이 이름들의 repo 에는 GitHub Pages 를 켜지 않는다.

## 새 페이지 추가

```tsx
// src/routes/blog.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/blog')({
  component: () => <h1>Blog</h1>,
})
```

빌드하면 `dist/blog/index.html` 이 자동으로 생성된다. 스타일은 같은 디렉터리에 `blog.css.ts` 로 둔다
(`*.css.ts` 는 라우트 파일에서 제외되도록 설정되어 있다).

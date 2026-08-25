# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

99mini 개인 사이트. React + TanStack Router 를 라우트별 정적 HTML 로 프리렌더(SSG)해서 GitHub Pages 유저 페이지(`https://99mini.github.io/`)에 배포한다. 저장소 문서와 코드 주석은 한국어로 작성되어 있다.

## 명령어

런타임 버전은 `mise.toml` 이 단일 소스다(Node 24.19.0 / pnpm 11.22.0). CI 도 `jdx/mise-action` 으로 같은 버전을 쓴다. 최초 1회 `mise trust && mise install` 후 `pnpm install`.

```bash
pnpm dev            # 개발 서버
pnpm build          # build:client → typecheck → build:ssr → prerender (4단계 순차)
pnpm preview        # 빌드 결과 확인
pnpm lint           # oxlint
pnpm lint:fix       # oxlint --fix
pnpm format         # oxfmt .
pnpm format:check   # 포맷 검사 (CI 와 동일)
pnpm typecheck      # tsc --noEmit

mise run check      # lint + format:check + typecheck
```

테스트 러너는 아직 없다.

CI(`.github/workflows/deploy.yml`)는 `main` push 시 `lint` → `format:check` → `build` 를 돌리고 `dist` 를 Pages 에 배포한다. 로컬에서 CI 통과 여부를 미리 보려면 `mise run check` 대신 `pnpm lint && pnpm format:check && pnpm build` 를 그대로 돌리는 게 정확하다.

## 아키텍처

### 프리렌더 파이프라인

`pnpm build` 의 4단계가 서로 물려 있어서 개별 실행 시 순서를 지켜야 한다.

1. `vite build` → `dist/` (클라이언트 번들 + `dist/index.html` 템플릿)
2. `tsc --noEmit` (타입체크는 빌드 산출물과 무관하지만 배포 전 게이트)
3. `vite build --ssr src/entry-server.tsx --outDir .ssr` → `.ssr/entry-server.js`
4. `node scripts/prerender.mjs` → `.ssr/entry-server.js` 를 동적 import 해서 `dist/index.html` 템플릿의 `<div id="root"></div>` 를 렌더 결과로 치환

`scripts/prerender.mjs` 는 그 마운트 지점 문자열을 하드코딩으로 찾는다. `index.html` 에서 해당 마크업을 바꾸면 프리렌더가 예외로 죽는다.

`src/entry-server.tsx` 의 `getStaticPaths()` 가 라우터의 `routesById` 를 순회해 생성 대상 경로를 만든다. `$` 가 들어간 동적 파라미터 라우트는 자동으로 제외되므로, 파라미터 라우트를 프리렌더하려면 이 함수를 직접 확장해야 한다.

`src/main.tsx` 는 `#root` 에 자식 노드가 있으면 `hydrateRoot`, 없으면 `createRoot` 로 갈라진다(개발 서버는 CSR 경로). SSR/CSR 양쪽에서 `OverlayProvider` → `RouterProvider` 순서가 동일해야 hydration 이 어긋나지 않는다.

### 라우팅

`src/routes/**/*.tsx` 가 곧 라우트이며 `@tanstack/router-plugin` 이 `src/routeTree.gen.ts` 를 생성한다(git 추적 제외 — 클론 직후엔 없고 `pnpm dev`/`build` 가 만든다). 라우터 인스턴스 생성은 `src/router.tsx` 의 `buildRouter(history?)` 한 곳으로 모여 있다 — 클라이언트는 인자 없이, SSR 은 `createMemoryHistory` 를 주입해서 쓴다. 라우트 추가는 `src/routes/*.tsx` 파일만 만들면 되고 프리렌더 대상에 자동 포함된다.

`vite.config.ts` 의 `routeFileIgnorePattern` 때문에 `*.css.ts` 는 라우트 파일로 잡히지 않는다. 라우트별 스타일은 같은 디렉터리에 `<route>.css.ts` 로 둔다.

### 최상위 경로 shadowing (배포 구조상 함정)

유저 페이지에서 `99mini.github.io/<repo>/` 는 항상 그 이름의 repo Pages 가 가져간다. **라우트 이름과 같은 이름의 repo 에서 Pages 를 켜면 이 사이트의 해당 페이지가 조용히 가려진다** — 빌드도 CI 도 전부 통과하므로 알아채기 어렵다. 새 최상위 라우트 이름을 정할 때 기존 repo 이름과 겹치지 않는지 확인할 것. 현재 선점 중: `sub`, `assets`.

`dist/404.html` 은 예상치 못한 경로용 안전망일 뿐이고, 각 경로에 실제 HTML 이 존재하므로 해시 라우팅이나 404 리다이렉트 트릭은 쓰지 않는다(의도적으로 폐기된 방식이다).

### 스타일

vanilla-extract. `src/styles/theme.css.ts` 의 `createGlobalTheme(':root', ...)` 로 만든 `vars`(color/space/font/radius)를 통해서만 값에 접근하고, 컴포넌트 스타일에서 색·간격 리터럴을 직접 쓰지 않는다.

## 규약

- 임포트는 `~/*` → `src/*` 별칭 사용(`vite.config.ts` 와 `tsconfig.json` 양쪽에 등록).
- 포맷은 oxfmt 가 강제: 세미콜론 없음, 작은따옴표(JSX 는 큰따옴표), printWidth 100, 임포트 정렬 자동. 수동으로 맞추지 말고 `pnpm format` 을 돌린다.
- 타입 임포트는 `import type` 필수(`typescript/consistent-type-imports` + `verbatimModuleSyntax`).
- tsconfig 가 `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `erasableSyntaxOnly` 를 켜 두었다 — enum·파라미터 프로퍼티 등 런타임 코드를 만드는 TS 문법은 쓸 수 없다.
- pnpm 버전은 `mise.toml` 과 `package.json` 의 `packageManager` 두 곳에 있다. 올릴 때 같이 올린다.
- 유틸은 이미 들어와 있는 것을 먼저 쓴다: es-toolkit(일반), es-hangul(한글), ts-pattern(분기), date-fns(날짜), overlay-kit(모달/오버레이).

## 커밋

`.claude/skills/commit/SKILL.md` 의 `/commit` 스킬을 따른다. 요지: 커밋 전 `pnpm lint:fix` 를 돌리고 실패하면 커밋하지 않는다. `git add -A`/`git add .` 대신 파일을 명시적으로 추가하고, `--no-verify` 는 쓰지 않는다.

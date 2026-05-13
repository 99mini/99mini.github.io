# 002 SSG & 사전 렌더링 (Static Site Generation)

## 개요

`pnpm build`의 마지막 단계로 `scripts/prerender.ts`가 실행됩니다. 이 스크립트는 Vite가 생성한 SPA shell(`dist/index.html`)을 각 라우트별로 복사하고 SEO 메타 태그를 주입하여 GitHub Pages에 정적 배포 가능한 구조를 만듭니다.

## 배경 / 동기

- GitHub Pages는 서버사이드 렌더링이 없음 — 모든 경로에 HTML 파일이 있어야 크롤러가 메타데이터를 읽을 수 있음
- 단일 `index.html`만 배포하면 `/about`, `/post/hello-world` 등 직접 접근 시 404
- 검색엔진과 SNS 미리보기(og 태그)를 위해 각 라우트별 정적 HTML 필요

## 설계 결정

### 핵심 선택

| 선택지 | 채택 여부 | 이유 |
|--------|-----------|------|
| 커스텀 prerender 스크립트 | ✅ | 의존성 없음, 프로젝트 구조에 최적화 |
| Next.js / Remix SSG | ❌ | 오버엔지니어링, 현재 규모에 불필요 |
| Vite SSR 플러그인 | ❌ | React 컴포넌트를 서버에서 실행해야 해 복잡도 증가 |

### 트레이드오프

- **장점:** 단순하고 예측 가능, 빌드 결과물이 순수 정적 파일
- **단점:** 새 라우트 추가 시 `routes` 배열 수동 업데이트 필요 (동적 슬러그 제외)

## 구조

```
pnpm build
  1. tsc -p tsconfig.build.json     # 타입 체크
  2. vite build                     # dist/ 생성 (SPA shell)
  3. tsx scripts/prerender.ts
       ├── dist/index.html 읽기
       ├── content/posts/*.md → slug 목록 추출
       └── 각 라우트별:
             ├── dist/{route}/index.html 생성
             ├── <title> 주입
             ├── og:*, twitter:* 메타 태그 주입
             └── 특수 파일:
                   ├── dist/404.html      (GitHub Pages 404 처리)
                   └── dist/.nojekyll     (Jekyll 비활성화)
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `scripts/prerender.ts` | SSG 메인 스크립트 |
| `dist/index.html` | Vite 빌드 결과물 (입력 템플릿) |
| `dist/{route}/index.html` | 라우트별 생성 파일 |
| `dist/404.html` | GitHub Pages 404 처리용 |

## 사용 방법

빌드는 항상 3단계 전체를 실행해야 합니다:

```bash
pnpm build        # tsc + vite build + prerender 전체 실행
pnpm preview      # dist/ 로컬 서브
```

`vite build`만 단독 실행하면 SSG가 적용되지 않아 라우트별 HTML이 없는 SPA 상태로 배포됩니다.

## 확장 방법

새로운 정적 라우트를 추가하려면:

1. `src/routes/`에 라우트 파일 추가 (TanStack Router 규칙)
2. `scripts/prerender.ts`의 `routes` 배열에 경로와 메타 정보 추가

```typescript
// scripts/prerender.ts
const routes = [
  // 기존 라우트들...
  {
    path: "/new-page",
    title: "새 페이지 | 99mini",
    description: "새 페이지 설명",
  },
];
```

블로그 포스트 slug는 `content/posts/*.md`에서 자동으로 추출되므로 별도 추가 불필요.

## 주의 사항

- `vite build` 없이 `prerender.ts`만 실행하면 최신 번들이 아닌 이전 `dist/`를 기반으로 동작
- `dist/.nojekyll`이 없으면 GitHub Pages가 `_` 시작 파일(예: `_astro/`)을 무시
- 동적 라우트(`/post/$slug`)는 prerender 시 slug 목록을 직접 파싱하므로 content/posts가 비어있어도 에러 없이 완료

## 관련 문서

- [001 빌드 타임 데이터 파이프라인](./001-build-time-data-pipeline.md)
- [005 SEO 전략](./005-seo.md)
- [006 블로그 포스트 관리](./006-blog-posts.md)

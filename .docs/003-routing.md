# 003 파일 기반 라우팅 (TanStack Router)

## 개요

TanStack Router의 파일 기반 라우팅을 사용합니다. `src/routes/` 하위 파일 구조가 URL 구조로 자동 매핑되며, `@tanstack/router-vite-plugin`이 `src/routeTree.gen.ts`를 자동 생성합니다.

## 배경 / 동기

- 파일 구조 = 라우트 구조: URL을 보면 파일 위치를 알 수 있어 유지보수 용이
- 자동 생성 routeTree로 타입 안전한 링크(`<Link to="/post/$slug">`) 제공
- 로더(loader) 함수로 라우트 진입 전 데이터 준비 가능

## 설계 결정

### 파일명 규칙

| 파일명 패턴 | URL | 설명 |
|------------|-----|------|
| `__root.tsx` | 모든 라우트 | 루트 레이아웃 (Header, Footer) |
| `index.tsx` | `/` | 세그먼트의 인덱스 |
| `about.tsx` | `/about` | 정적 라우트 |
| `post/index.tsx` | `/post` | post 세그먼트 인덱스 |
| `post/$slug.tsx` | `/post/:slug` | 동적 파라미터 라우트 |
| `practice/gomoku.tsx` | `/practice/gomoku` | 중첩 정적 라우트 |

### 트레이드오프

- **장점:** 타입 안전, 코드 분할 자동화, 로더 패턴으로 데이터 페칭 정형화
- **단점:** `routeTree.gen.ts`는 편집 불가 (자동 생성), 플러그인 설정이 없으면 타입 깨짐

## 구조

```
src/routes/
├── __root.tsx              # 루트 레이아웃 (항상 렌더링)
├── index.tsx               # / (홈)
├── about.tsx               # /about
├── release.tsx             # /release
├── post/
│   ├── index.tsx           # /post (목록)
│   └── $slug.tsx           # /post/:slug (상세)
└── practice/
    ├── index.tsx           # /practice (허브)
    └── gomoku.tsx          # /practice/gomoku

src/routeTree.gen.ts        # 자동 생성 — 절대 수동 편집 금지
src/router.ts               # 라우터 인스턴스 생성
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `src/router.ts` | `createRouter({ routeTree })` 인스턴스 |
| `src/main.tsx` | `<RouterProvider>` 마운트 (SSG hydration 지원) |
| `src/routeTree.gen.ts` | 자동 생성 타입, import만 사용 |

## 사용 방법

### 데이터 로딩

```typescript
// src/routes/post/$slug.tsx
export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData(); // 타입 자동 추론
  return <article dangerouslySetInnerHTML={{ __html: post.html }} />;
}
```

### 타입 안전 링크

```typescript
import { Link } from "@tanstack/react-router";

// slug 파라미터를 빠뜨리면 TypeScript 오류
<Link to="/post/$slug" params={{ slug: post.slug }}>
  {post.title}
</Link>
```

### 404 처리

```typescript
// __root.tsx에서 notFoundComponent 등록
export const Route = createRootRoute({
  notFoundComponent: NotFound,
});
```

## 확장 방법

새 페이지를 추가하려면:

1. `src/routes/` 하위에 파일 생성 (파일명 = URL 세그먼트)
2. `createFileRoute` 호출 — dev 서버가 `routeTree.gen.ts` 자동 업데이트
3. 정적 라우트면 `scripts/prerender.ts`의 `routes` 배열에 추가

```typescript
// src/routes/new-page.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/new-page")({
  component: NewPage,
});

function NewPage() {
  return <main>새 페이지</main>;
}
```

## 주의 사항

- `src/routeTree.gen.ts`는 **절대 수동 편집 금지** — dev 서버 또는 빌드 시 덮어씌워짐
- 파일 생성 후 dev 서버를 실행 중이 아니라면 `pnpm dev`로 한 번 실행해야 `routeTree.gen.ts` 갱신
- 동적 파라미터 파일(`$slug.tsx`)에서 `params.slug`는 항상 string, 추가 검증 필요 시 loader에서 처리

## 관련 문서

- [002 SSG & 사전 렌더링](./002-ssg-prerender.md)
- [005 SEO 전략](./005-seo.md)

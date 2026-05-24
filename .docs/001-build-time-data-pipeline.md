# 001 빌드 타임 데이터 파이프라인 (Virtual Modules)

## 개요

모든 외부 데이터(마크다운 파일, GitHub API)는 **Vite 빌드 시점**에 처리되어 virtual module로 노출됩니다. 브라우저 런타임에서는 이미 가공된 데이터를 import만 합니다.

## 배경 / 동기

- `gray-matter`, `unified`, Node.js `fs` 모듈은 브라우저에서 실행 불가
- GitHub API는 CORS 제한으로 브라우저에서 직접 호출 시 인증 복잡도 증가
- 빌드 시점에 처리하면 런타임 번들 크기와 초기 로딩 시간을 줄일 수 있음

## 설계 결정

### 핵심 선택

| 선택지 | 채택 여부 | 이유 |
|--------|-----------|------|
| Vite virtual module plugin | ✅ | 빌드 파이프라인에 자연스럽게 통합, 핫리로드 지원 |
| 별도 빌드 스크립트 + JSON 파일 | ❌ | 추가 빌드 스텝 필요, 파일 관리 복잡 |
| 런타임 API 호출 | ❌ | Node.js 전용 모듈 사용 불가, 초기 로딩 지연 |

### 트레이드오프

- **장점:** 런타임에 fs/API 의존성 없음, 타입 안전한 데이터, dev 서버에서 파일 변경 시 자동 reload
- **단점:** 데이터가 바뀌면 재빌드 필요, GitHub API rate limit에 빌드가 종속

## 구조

```
vite.config.ts
  ├── virtualPostsPlugin        → virtual:posts
  │     ├── content/posts/*.md
  │     │     └── gray-matter (frontmatter) + unified (markdown→HTML) + shiki (syntax highlight)
  │     └── PostFrontmatterSchema (zod) 검증
  │
  └── githubReleasesPlugin      → virtual:releases
        ├── GitHub API /repos/99mini/99mini.github.io/pulls
        └── GithubPRSchema (zod) 검증
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `vite.config.ts` | 두 virtual module 플러그인 정의 |
| `src/virtual.d.ts` | `virtual:posts`, `virtual:releases` TypeScript 타입 선언 |
| `src/types/index.ts` | `Post`, `GithubPR` Zod 스키마 (Node.js + 브라우저 양쪽에서 import) |
| `src/lib/posts.ts` | `getAllPosts()`, `getPostBySlug()` — virtual:posts를 감싸는 헬퍼 |

## 사용 방법

```typescript
// src/ 내 어느 파일에서나 import 가능
import { posts } from "virtual:posts";
import { releases } from "virtual:releases";

// 타입은 src/virtual.d.ts에서 선언됨
// posts: Post[]
// releases: GithubPR[]
```

```typescript
// vite.config.ts — 플러그인 등록
export default defineConfig({
  plugins: [
    virtualPostsPlugin(),
    githubReleasesPlugin(),
    // ...
  ],
});
```

## 확장 방법

새로운 데이터 소스를 추가하려면:

1. `vite.config.ts`에 새 플러그인 함수 작성
2. `resolveId`에서 `"virtual:새이름"` 반환
3. `load`에서 데이터 처리 후 `export const data = ...` 형태의 JS 문자열 반환
4. `src/virtual.d.ts`에 타입 선언 추가
5. `src/types/index.ts`에 Zod 스키마 추가 (선택)

```typescript
// vite.config.ts 패턴
function myNewPlugin(): Plugin {
  return {
    name: "my-new-plugin",
    resolveId(id) {
      if (id === "virtual:mydata") return "\0virtual:mydata";
    },
    async load(id) {
      if (id === "\0virtual:mydata") {
        const data = await fetchOrProcess();
        return `export const mydata = ${JSON.stringify(data)}`;
      }
    },
  };
}
```

## 주의 사항

- `gray-matter`, `fs`, `path` 등 Node.js 전용 모듈은 반드시 `vite.config.ts` 또는 `scripts/`에서만 사용
- `src/` 파일에서 Node.js 모듈을 import하면 런타임에 번들러가 폴리필을 시도하거나 빌드가 실패
- `githubReleasesPlugin`은 빌드마다 GitHub API를 호출하므로 CI 환경에서 rate limit 주의
- dev 서버에서 `virtual:releases`는 첫 번째 요청 시 한 번만 fetch하고 캐시

## 관련 문서

- [002 SSG & 사전 렌더링](./002-ssg-prerender.md)
- [006 블로그 포스트 관리](./006-blog-posts.md)
- [007 GitHub 릴리스](./007-github-releases.md)

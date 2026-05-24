# 006 블로그 포스트 관리

## 개요

블로그 포스트는 `content/posts/*.md` 마크다운 파일로 관리됩니다. Vite 빌드 시점에 gray-matter(프론트매터 파싱) + unified(마크다운 → HTML) + Shiki(코드 하이라이팅)로 처리되어 `virtual:posts` 모듈로 노출됩니다.

## 배경 / 동기

- 콘텐츠를 코드와 분리하여 마크다운으로 관리
- 개발자에게 친숙한 Git 기반 콘텐츠 워크플로우
- 빌드 타임 처리로 런타임 마크다운 파싱 비용 없음

## 구조

```
content/posts/
  └── {slug}.md           # 파일명이 URL slug가 됨

빌드 파이프라인:
  gray-matter             # YAML 프론트매터 추출
       ↓
  PostFrontmatterSchema   # Zod 유효성 검사
       ↓
  unified
    + remark-parse        # 마크다운 파싱
    + remark-gfm          # GitHub Flavored Markdown (표, 체크리스트 등)
    + remark-rehype       # HTML AST로 변환
    + @shikijs/rehype     # 코드 블록 구문 강조 (github-dark 테마)
    + rehype-stringify    # HTML 문자열 생성
       ↓
  virtual:posts           # { posts: Post[] } 모듈로 노출
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `content/posts/*.md` | 포스트 콘텐츠 |
| `vite.config.ts` | `virtualPostsPlugin` — 마크다운 처리 파이프라인 |
| `src/types/index.ts` | `PostFrontmatterSchema`, `Post` 타입 |
| `src/lib/posts.ts` | `getAllPosts()`, `getPostBySlug()` 헬퍼 |
| `src/routes/post/index.tsx` | 포스트 목록 페이지 |
| `src/routes/post/$slug.tsx` | 포스트 상세 페이지 |

## 프론트매터 스키마

```yaml
---
title: "포스트 제목"          # 필수, string
date: "2026-05-13"           # 필수, YYYY-MM-DD 형식
summary: "한 줄 요약"         # 필수, string
tags: ["React", "TypeScript"] # 선택, string[]
thumbnail: "https://..."      # 선택, 썸네일 이미지 URL
draft: false                  # 선택, true면 빌드에서 제외
---
```

## 사용 방법

### 새 포스트 작성

1. `content/posts/{slug}.md` 파일 생성
2. 프론트매터 작성
3. 마크다운 본문 작성
4. `pnpm dev` 재시작 또는 저장 시 자동 리로드

```markdown
---
title: "나의 첫 포스트"
date: "2026-05-13"
summary: "첫 번째 블로그 포스트입니다."
tags: ["블로그"]
draft: false
---

# 나의 첫 포스트

포스트 내용...

## 코드 예시

```typescript
const hello = "world";
```

```

### 코드 하이라이팅

언어 지정 시 Shiki가 `github-dark` 테마로 자동 하이라이팅:

````markdown
```typescript
const greet = (name: string) => `Hello, ${name}!`;
```
````

지원 언어: TypeScript, JavaScript, Python, Bash, JSON, YAML 등 [Shiki 지원 언어](https://shiki.style/languages) 전체

### 포스트 목록 접근 (코드)

```typescript
import { getAllPosts, getPostBySlug } from "@/lib/posts";

// 모든 포스트 (날짜 내림차순, draft 제외)
const posts = getAllPosts();

// slug로 단일 포스트
const post = getPostBySlug("hello-world");
// post: { title, date, summary, tags, slug, html } | undefined
```

## 정렬 및 필터링

- `draft: true`인 포스트는 빌드에서 **완전히 제외** (개발 서버 포함)
- 날짜 **내림차순** 정렬 (최신 포스트가 먼저)
- `getPostBySlug`는 없는 slug에 `undefined` 반환 → 라우트 loader에서 `notFound()` throw

## 주의 사항

- `slug`는 파일명에서 `.md`를 제거한 값 (예: `hello-world.md` → `hello-world`)
- 파일명에 한글, 공백 사용 가능하지만 URL 인코딩 문제로 **영문 소문자 + 하이픈** 권장
- `date` 필드는 문자열로 저장되며 파싱 없이 표시됨 — `YYYY-MM-DD` 형식 유지 필요
- 빌드 후 `scripts/prerender.ts`가 자동으로 `/post/{slug}` 경로의 HTML을 생성하므로 별도 설정 불필요

## 관련 문서

- [001 빌드 타임 데이터 파이프라인](./001-build-time-data-pipeline.md)
- [002 SSG & 사전 렌더링](./002-ssg-prerender.md)
- [005 SEO 전략](./005-seo.md)

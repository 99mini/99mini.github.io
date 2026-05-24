# PRD: 포스트 목차 (Table of Contents)

> **상태:** Draft  
> **작성일:** 2026-05-13  
> **우선순위:** Medium

---

## 1. 개요 (Summary)

블로그 포스트 상세 페이지에서 마크다운 헤딩(`h2`, `h3`)을 자동 파싱하여 스크롤 연동 목차(TOC)를 sticky 사이드바로 제공한다.

## 2. 문제 정의 (Problem Statement)

- 긴 포스트에서 현재 읽는 위치를 파악하기 어려움
- 원하는 섹션으로 이동하려면 전체를 스크롤해야 함
- 글의 전체 구조를 한눈에 볼 수 없음

## 3. 목표 (Goals)

- [ ] 포스트 내 `h2`, `h3` 헤딩을 빌드 타임에 추출하여 목차 데이터로 제공
- [ ] 읽는 위치에 따라 현재 섹션 목차 항목을 자동 하이라이트 (Intersection Observer)
- [ ] 목차 항목 클릭 시 해당 섹션으로 부드러운 스크롤
- [ ] 모바일에서는 sticky 상단 드롭다운 또는 숨김 처리

**범위 밖 (Non-goals):**

- `h4` 이하 깊이의 헤딩 (너무 깊은 TOC는 오히려 노이즈)
- 사용자가 TOC 깊이를 설정하는 UI
- TOC 열기/닫기 애니메이션 (1차에서 단순 렌더링)

## 4. 사용자 시나리오 (User Stories)

```
As a 블로그 독자,
I want to 포스트 옆에 목차가 고정되어 있고,
So that 현재 위치를 파악하고 원하는 섹션으로 바로 이동할 수 있다.
```

```
As a 모바일 사용자,
I want to 목차가 과도한 공간을 차지하지 않고,
So that 본문 읽기에 집중할 수 있다.
```

## 5. 기능 요구사항 (Functional Requirements)

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-01 | `h2`, `h3` 헤딩에서 목차 데이터 추출 (빌드 타임) | Must |
| F-02 | 각 헤딩에 `id` 속성 자동 부여 (앵커 링크용) | Must |
| F-03 | TOC는 포스트 우측에 sticky 사이드바로 표시 | Must |
| F-04 | 스크롤 위치 기반 현재 섹션 하이라이트 | Must |
| F-05 | 클릭 시 해당 헤딩으로 `smooth` 스크롤 | Must |
| F-06 | `h3`은 `h2` 하위 들여쓰기 표시 | Should |
| F-07 | 모바일(< 1024px)에서 TOC 사이드바 숨김 | Must |
| F-08 | TOC 항목이 1개 이하면 렌더링 생략 | Should |

## 6. 비기능 요구사항 (Non-functional Requirements)

- **성능:** Intersection Observer 사용 (scroll 이벤트 리스너 지양)
- **접근성:** `<nav aria-label="목차">` 마크업, `<a>` 앵커 링크
- **SEO:** 헤딩 `id`는 빌드 타임에 삽입 → 크롤러가 앵커 구조 인식 가능

## 7. 설계 방향 (Design Direction)

### 아키텍처 결정

TOC 데이터를 **빌드 타임**에 마크다운 AST에서 추출하여 `Post` 타입에 포함시킨다. 런타임에 DOM 파싱 불필요.

| 방법 | 채택 여부 | 이유 |
|------|-----------|------|
| 빌드 타임 AST 파싱 (rehype 플러그인) | ✅ | 기존 unified 파이프라인 확장, 런타임 비용 없음 |
| 런타임 DOM querySelectorAll | ❌ | hydration 타이밍 이슈, SSG 메타데이터 활용 불가 |

### 데이터 흐름

```
빌드 타임:
  vite.config.ts (virtualPostsPlugin)
    └── unified 파이프라인에 커스텀 rehype 플러그인 추가
          └── hast(HTML AST)에서 h2, h3 노드 수집
                → id 자동 생성 (slugify: "섹션 제목" → "섹션-제목")
                → headings: { depth, text, id }[] 추출
    └── Post 타입에 headings 필드 추가
    └── virtual:posts에 포함

런타임:
  /post/$slug 페이지
    ├── TableOfContents 컴포넌트 (headings 배열 수신)
    │     └── Intersection Observer로 현재 섹션 감지
    │           → activeId 상태 업데이트
    └── 포스트 본문 (h2/h3에 id 속성 포함된 HTML)
```

### 파일 변경 예상 목록

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `vite.config.ts` | 수정 | rehype 플러그인으로 heading 추출 + id 주입 |
| `src/types/index.ts` | 수정 | `Post`에 `headings: TocItem[]` 필드 추가 |
| `src/components/TableOfContents.tsx` | 신규 | 스크롤 연동 목차 컴포넌트 |
| `src/routes/post/$slug.tsx` | 수정 | 2단 레이아웃(본문 + TOC 사이드바) 적용 |

### TocItem 타입

```typescript
type TocItem = {
  depth: 2 | 3;      // h2 or h3
  text: string;       // 헤딩 텍스트
  id: string;         // URL-safe id (앵커 링크)
};
```

## 8. UI/UX 스케치

**데스크탑 (≥ 1024px):**

```
┌──────────────────────────┬──────────────────┐
│                          │  목차             │
│  # 포스트 제목           │ ──────────────    │
│                          │ ▶ 섹션 1 (활성)   │
│  ## 섹션 1               │   └ 하위 섹션 1  │
│  본문 내용...            │   └ 하위 섹션 2  │
│                          │ · 섹션 2          │
│  ### 하위 섹션 1         │ · 섹션 3          │
│  ...                     │                   │
│                          │  [sticky top-24]  │
└──────────────────────────┴──────────────────┘
```

**현재 섹션 스타일:**

```
· 섹션 1          ← 비활성: --color-muted
▶ 섹션 2 (활성)  ← 활성: --color-accent, font-medium, left border
  └ 하위 섹션     ← h3 들여쓰기: pl-4
```

**모바일 (< 1024px):**

```
목차 사이드바 숨김 (display: none)
본문이 전체 너비 사용
```

## 9. 성공 지표 (Success Metrics)

- 포스트 페이지 진입 후 TOC 렌더 시 레이아웃 시프트(CLS) < 0.1
- 스크롤 중 활성 섹션 하이라이트 지연 < 100ms
- 목차 항목 클릭 후 해당 섹션 도달 (smooth scroll) 정상 동작

## 10. 의존성 & 위험 (Dependencies & Risks)

| 항목 | 유형 | 설명 |
|------|------|------|
| rehype-slug 패키지 | 의존성 | 헤딩 id 생성에 사용 (`pnpm add rehype-slug`) 또는 직접 구현 |
| 한국어 slug 생성 | 위험 | 한글 헤딩 제목을 URL-safe id로 변환 필요 — 한글을 그대로 id로 사용하거나 romanize 라이브러리 필요 |
| Intersection Observer 지원 | 위험 | 구형 브라우저 미지원. 필요 시 polyfill 추가 |
| 포스트 레이아웃 변경 | 위험 | 기존 full-width 레이아웃에서 2단으로 변경 시 모바일 회귀 테스트 필요 |

## 11. 마일스톤 (Milestones)

| 단계 | 내용 | 예상 기간 |
|------|------|-----------|
| M1 | rehype 플러그인으로 heading 추출 + id 주입, `Post.headings` 타입 추가 | 0.5일 |
| M2 | `TableOfContents` 정적 렌더링 (스크롤 연동 없이) | 0.5일 |
| M3 | Intersection Observer로 활성 섹션 하이라이트 | 0.5일 |
| M4 | 모바일 반응형 처리 + 접근성 마크업 | 0.5일 |

## 관련 문서

- [001 빌드 타임 데이터 파이프라인](./../001-build-time-data-pipeline.md)
- [006 블로그 포스트 관리](./../006-blog-posts.md)
- [003 파일 기반 라우팅](./../003-routing.md)

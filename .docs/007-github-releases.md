# 007 GitHub 릴리스 타임라인

## 개요

GitHub PR 데이터를 빌드 시점에 fetch하여 `virtual:releases`로 노출합니다. `/release` 페이지에서 머지된 릴리스 PR들을 타임라인 형태로 표시합니다.

## 배경 / 동기

- 배포 이력을 코드가 아닌 GitHub PR로 관리
- 별도 changelog 파일 없이 PR 제목/본문을 릴리스 노트로 활용
- 빌드 타임 fetch로 런타임 CORS 이슈 없음

## 설계 결정

### 릴리스 PR 식별 기준

GitHub API로 가져온 closed PR 중 다음 조건 중 하나를 만족하면 릴리스로 취급:

| 조건 | 설명 |
|------|------|
| 레이블 포함 | `release` 레이블이 붙은 PR |
| 제목 접두사 | 제목이 `release:`로 시작하는 PR |

### 트레이드오프

- **장점:** GitHub UI에서 릴리스를 관리하므로 별도 도구 불필요
- **단점:** 빌드마다 GitHub API 호출 (rate limit: 60회/시간 미인증), 실시간 반영 불가

## 구조

```
빌드 시:
  githubReleasesPlugin (vite.config.ts)
    └── GET /repos/99mini/99mini.github.io/pulls?state=closed&per_page=50
          ├── merged_at 있는 PR만 필터
          ├── label "release" 또는 title "release:" 접두사 필터
          ├── GithubPRSchema (zod) 검증
          └── virtual:releases 모듈로 노출

런타임:
  src/routes/release.tsx
    └── import { releases } from "virtual:releases"
          └── 타임라인 UI 렌더링
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `vite.config.ts` | `githubReleasesPlugin` 구현 |
| `src/types/index.ts` | `GithubPRSchema`, `GithubPR` 타입 |
| `src/routes/release.tsx` | 릴리스 타임라인 페이지 |
| `src/virtual.d.ts` | `virtual:releases` 타입 선언 |

## GithubPR 타입

```typescript
type GithubPR = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  closed_at: string | null;
  merged_at: string | null;
  body: string | null;
  labels: Array<{
    id: number;
    name: string;
    color: string;
  }>;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};
```

## 사용 방법

### 릴리스 PR 만들기

방법 1 — 레이블 사용:
1. GitHub에서 PR 생성
2. `release` 레이블 추가
3. PR 머지

방법 2 — 제목 접두사 사용:
1. 제목을 `release: v1.2.0 새 기능 추가` 형태로 작성
2. PR 머지

다음 `pnpm build` 시 자동으로 타임라인에 포함됩니다.

### 코드에서 접근

```typescript
import { releases } from "virtual:releases";
// releases: GithubPR[] (머지일 내림차순)
```

## 확장 방법

릴리스 식별 기준을 변경하려면 `vite.config.ts`의 `githubReleasesPlugin`에서 필터 로직 수정:

```typescript
// 현재 필터 조건
const isRelease =
  pr.merged_at &&
  (pr.labels.some((l) => l.name === "release") ||
   pr.title.startsWith("release:"));
```

API 엔드포인트나 페이지 수를 변경하려면:
```typescript
// per_page 최대값은 100
const url = "https://api.github.com/repos/99mini/99mini.github.io/pulls?state=closed&per_page=100";
```

## 주의 사항

- GitHub API 비인증 요청은 **60회/시간** rate limit — CI에서 빌드가 많으면 인증 토큰 필요
- `GITHUB_TOKEN` 환경변수가 있으면 vite.config.ts에서 Authorization 헤더에 추가 가능
- `per_page=50`이므로 릴리스 PR이 50개를 초과하면 페이지네이션 로직 추가 필요
- 빌드 시 API fetch 실패 시 빈 배열로 폴백되는지 에러 핸들링 확인 필요

## 관련 문서

- [001 빌드 타임 데이터 파이프라인](./001-build-time-data-pipeline.md)
- [002 SSG & 사전 렌더링](./002-ssg-prerender.md)

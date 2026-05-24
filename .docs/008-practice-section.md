# 008 Practice 섹션 (미니 게임 & 실험)

## 개요

`/practice` 하위 라우트는 작은 인터랙티브 실험이나 미니 게임을 모아두는 공간입니다. 현재 오목(Gomoku) 게임이 구현되어 있으며, 새로운 실험을 추가하는 패턴이 정립되어 있습니다.

## 배경 / 동기

- 포트폴리오에 인터랙티브한 요소 추가
- 알고리즘, UI 실험 등을 공개적으로 쌓아두는 공간
- 독립적인 라우트로 분리하여 다른 콘텐츠와 격리

## 구조

```
src/routes/practice/
  ├── index.tsx       # /practice — 허브 페이지 (실험 목록 링크)
  └── gomoku.tsx      # /practice/gomoku — 오목 게임

scripts/prerender.ts
  └── routes 배열에 /practice, /practice/gomoku 포함
```

## 현재 구현: 오목 (Gomoku)

### 게임 규칙

- 15×15 바둑판
- 흑/백 교대 착수
- 가로, 세로, 대각선 방향으로 5개 연속 시 승리

### 핵심 로직

```typescript
// src/routes/practice/gomoku.tsx
const BOARD_SIZE = 15;
const WIN_COUNT = 5;

// 승리 감지: 4방향(가로/세로/대각선 2개)으로 연속 돌 카운트
function checkWin(board: Board, row: number, col: number, player: Player): boolean {
  const directions = [[0,1], [1,0], [1,1], [1,-1]];
  return directions.some(([dr, dc]) => countLine(board, row, col, dr, dc, player) >= WIN_COUNT);
}
```

### 상태 관리

React `useState`로 관리:
- `board: (null | "black" | "white")[][]` — 15×15 2D 배열
- `currentPlayer: "black" | "white"` — 현재 턴
- `winner: string | null` — 승자

## 새 Practice 추가 방법

1. `src/routes/practice/{name}.tsx` 파일 생성

```typescript
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/practice/{name}")({
  component: MyExperiment,
});

function MyExperiment() {
  return <main>새 실험</main>;
}
```

2. `src/routes/practice/index.tsx`에 링크 추가

```typescript
// 실험 목록 배열에 추가
const experiments = [
  { path: "/practice/gomoku", title: "오목", description: "15×15 오목 게임" },
  { path: "/practice/{name}", title: "새 실험", description: "설명" },
];
```

3. `scripts/prerender.ts`의 `routes` 배열에 추가

```typescript
{ path: "/practice/{name}", title: "새 실험 | 99mini", description: "..." },
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `src/routes/practice/index.tsx` | Practice 허브 — 실험 링크 목록 |
| `src/routes/practice/gomoku.tsx` | 오목 게임 구현 |

## 주의 사항

- Practice 페이지는 클라이언트 사이드 인터랙션이 주목적이므로 SSG 메타 태그는 기본값으로 충분
- 게임 상태를 URL에 저장하거나 서버에 동기화하지 않음 — 새로고침 시 초기화
- 복잡한 상태가 필요하면 `useReducer`나 Zustand 도입 고려

## 관련 문서

- [003 파일 기반 라우팅](./003-routing.md)
- [002 SSG & 사전 렌더링](./002-ssg-prerender.md)

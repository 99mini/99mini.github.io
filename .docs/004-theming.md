# 004 다크/라이트 테마 시스템

## 개요

CSS custom properties + `<html>` 클래스 토글 방식으로 다크/라이트 테마를 구현합니다. React 하이드레이션 전에 인라인 스크립트가 먼저 테마를 적용하여 FOUC(Flash of Unstyled Content)를 방지합니다.

## 배경 / 동기

- SSG 환경에서 서버가 사용자의 테마 설정을 알 수 없으므로 클라이언트 사이드 처리 필요
- React가 마운트되기 전에 테마가 적용되지 않으면 흰 화면 깜빡임 발생

## 설계 결정

### 핵심 선택

| 선택지 | 채택 여부 | 이유 |
|--------|-----------|------|
| 인라인 스크립트 + CSS 변수 | ✅ | React 없이 즉시 실행, FOUC 없음 |
| CSS media query만 사용 | ❌ | 사용자 수동 전환 저장 불가 |
| Context API로 테마 상태 관리 | ❌ | 하이드레이션 전 깜빡임 문제 |

### 테마 적용 순서

1. `index.html` 인라인 `<script>` 실행 (React 이전)
   - `localStorage["theme"]` 확인
   - 없으면 `prefers-color-scheme` 시스템 설정 확인
   - `<html>`에 `.dark` 클래스 추가/제거
2. React 하이드레이션 — 이미 올바른 클래스가 적용된 DOM을 받음
3. 사용자가 토글 시 `useTheme` 훅이 클래스 변경 + localStorage 저장

## 구조

```
index.html
  └── <script> (인라인, 동기 실행)
        ├── localStorage["theme"] === "dark" → <html class="dark">
        └── matchMedia("prefers-color-scheme: dark") → <html class="dark">

src/styles/global.css
  ├── :root { --color-bg: #fff; ... }         # 라이트 모드 변수
  └── :root.dark { --color-bg: #0a0a0a; ... } # 다크 모드 변수

src/hooks/useTheme.ts
  ├── 현재 테마 읽기 (DOM class 기반)
  └── toggle() → class 토글 + localStorage 저장

src/components/Header.tsx
  └── <button onClick={toggle}> 아이콘 전환
```

## 주요 파일

| 파일 | 역할 |
|------|------|
| `index.html` | 인라인 테마 감지 스크립트 |
| `src/styles/global.css` | CSS custom properties 정의 |
| `src/hooks/useTheme.ts` | 테마 토글 훅 |
| `src/components/Header.tsx` | 테마 토글 버튼 (Sun/Moon 아이콘) |

## 사용 방법

### CSS에서 테마 변수 사용

```css
/* global.css에 정의된 변수 사용 */
.my-component {
  background-color: var(--color-bg);
  color: var(--color-text);
  border-color: var(--color-border);
}
```

### 컴포넌트에서 테마 토글

```typescript
import { useTheme } from "@/hooks/useTheme";

function ThemeButton() {
  const { isDark, toggle } = useTheme();
  return (
    <button onClick={toggle}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

## 테마 변수 목록

| 변수 | 라이트 | 다크 | 용도 |
|------|--------|------|------|
| `--color-bg` | `#ffffff` | `#0a0a0a` | 페이지 배경 |
| `--color-surface` | `#f5f5f5` | `#111111` | 카드, 패널 배경 |
| `--color-border` | `#e5e5e5` | `#222222` | 구분선, 테두리 |
| `--color-text` | `#171717` | `#e5e5e5` | 본문 텍스트 |
| `--color-muted` | `#737373` | `#737373` | 보조 텍스트 |
| `--color-accent` | `#16a34a` | `#4ade80` | 강조색 (녹색) |

### Tailwind에서 다크 모드

TailwindCSS v4는 CSS-first 설정으로 `src/styles/global.css`에서 dark variant를 선언합니다:

```css
@custom-variant dark (&:where(.dark *));
```

```html
<!-- Tailwind dark: 접두사 사용 가능 -->
<div class="bg-white dark:bg-neutral-900">...</div>
```

## 확장 방법

새로운 테마 변수를 추가하려면:

1. `src/styles/global.css`의 `:root`와 `:root.dark` 양쪽에 변수 추가
2. CSS에서 `var(--new-variable)` 또는 Tailwind 유틸리티로 참조

## 주의 사항

- `localStorage["theme"]` 키를 변경하면 기존 사용자의 설정이 초기화됨
- `useTheme`은 DOM 클래스를 직접 읽으므로 SSR 환경에서 `typeof document === "undefined"` 체크 필요
- 인라인 스크립트는 `index.html`에 있으며, Vite가 `dist/index.html`에 그대로 포함시킴

## 관련 문서

- [003 파일 기반 라우팅](./003-routing.md)

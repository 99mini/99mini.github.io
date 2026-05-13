# PRD: RSS 피드 자동 생성 (RSS Feed)

> **상태:** Draft  
> **작성일:** 2026-05-13  
> **우선순위:** Medium

---

## 1. 개요 (Summary)

`pnpm build` 시 블로그 포스트 데이터를 기반으로 표준 RSS 2.0 + Atom 형식의 `feed.xml`을 `dist/` 에 자동 생성하여, RSS 리더 사용자가 새 포스트를 구독할 수 있게 한다.

## 2. 문제 정의 (Problem Statement)

- 현재 새 포스트가 올라와도 독자가 직접 사이트를 방문해야만 알 수 있음
- RSS/Atom 피드가 없으면 Feedly, Reeder 등 RSS 리더 앱에서 구독 불가
- 기술 블로그 독자층은 RSS 구독을 선호하는 경향이 높음

## 3. 목표 (Goals)

- [ ] 빌드 시 `dist/feed.xml` (RSS 2.0) 자동 생성
- [ ] 모든 비-draft 포스트를 최신순으로 피드에 포함
- [ ] `<head>`에 `<link rel="alternate" type="application/rss+xml">` 태그 삽입
- [ ] 피드에 포스트 전문(full content) 포함

**범위 밖 (Non-goals):**

- JSON Feed 형식 (RSS만으로 충분)
- 카테고리/태그별 분리 피드
- 포스트 요약만 포함하는 partial feed (full content 제공)
- 피드 캐싱 또는 CDN 설정 (GitHub Pages 기본 캐시 사용)

## 4. 사용자 시나리오 (User Stories)

```
As a RSS 리더 사용자,
I want to 99mini 블로그를 RSS로 구독하고,
So that 새 포스트가 올라오면 리더 앱에서 바로 알 수 있다.
```

```
As a 개발자 커뮤니티 봇/서비스,
I want to RSS 피드를 파싱하여 포스트를 자동 공유하고,
So that 더 많은 독자에게 콘텐츠가 도달한다.
```

## 5. 기능 요구사항 (Functional Requirements)

| ID | 요구사항 | 우선순위 |
|----|---------|---------|
| F-01 | `pnpm build` 시 `dist/feed.xml` 생성 | Must |
| F-02 | RSS 2.0 표준 준수 (`<rss version="2.0">`) | Must |
| F-03 | 각 포스트에 `<title>`, `<link>`, `<description>`, `<pubDate>`, `<guid>` 포함 | Must |
| F-04 | `<description>`에 포스트 전문 HTML 포함 (CDATA 래핑) | Must |
| F-05 | 채널에 `<title>`, `<link>`, `<description>`, `<language>ko</language>` 포함 | Must |
| F-06 | `index.html`의 `<head>`에 RSS 자동 감지 링크 태그 삽입 | Must |
| F-07 | `prerender.ts`가 생성하는 모든 HTML에 동일한 링크 태그 포함 | Must |
| F-08 | 포스트 최대 개수 제한 없음 (전체 포스트 포함) | Should |

## 6. 비기능 요구사항 (Non-functional Requirements)

- **표준 준수:** [RSS 2.0 Specification](https://www.rssboard.org/rss-specification) 준수, W3C Feed Validator 통과
- **인코딩:** UTF-8, XML 특수문자 이스케이프
- **성능:** 빌드 타임 생성이므로 런타임 비용 없음. 생성 시간 < 1초 (포스트 100개 기준)
- **SEO:** RSS 링크 태그가 `<head>`에 있어야 크롤러와 브라우저가 자동 감지

## 7. 설계 방향 (Design Direction)

### 아키텍처 결정

기존 `scripts/prerender.ts`에 RSS 생성 로직을 추가하거나, 별도 `scripts/generate-feed.ts`로 분리한다.

| 방법 | 채택 여부 | 이유 |
|------|-----------|------|
| `prerender.ts` 확장 | ✅ 추천 | 이미 post 데이터를 다루는 컨텍스트, 빌드 스텝 추가 불필요 |
| 별도 `generate-feed.ts` | 검토 | 관심사 분리 명확하나 `package.json` scripts 수정 필요 |
| Vite 플러그인으로 구현 | ❌ | `dist/` 쓰기는 빌드 후 스크립트가 더 단순함 |

### 데이터 흐름

```
pnpm build
  └── tsx scripts/prerender.ts
        ├── (기존) content/posts/*.md 파싱 → 라우트별 HTML 생성
        └── (추가) posts 데이터 → RSS XML 빌드 → dist/feed.xml 저장
              └── index.html 및 모든 라우트 HTML에 <link rel="alternate"> 삽입
```

### RSS XML 구조

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>99mini 블로그</title>
    <link>https://99mini.github.io</link>
    <description>99mini의 개발 블로그</description>
    <language>ko</language>
    <lastBuildDate>{RFC-822 날짜}</lastBuildDate>
    <atom:link href="https://99mini.github.io/feed.xml" rel="self" type="application/rss+xml"/>

    <item>
      <title><![CDATA[포스트 제목]]></title>
      <link>https://99mini.github.io/post/{slug}</link>
      <guid isPermaLink="true">https://99mini.github.io/post/{slug}</guid>
      <pubDate>{RFC-822 날짜}</pubDate>
      <description><![CDATA[포스트 HTML 전문]]></description>
    </item>
    <!-- ... -->
  </channel>
</rss>
```

### `<head>` 링크 태그

```html
<!-- index.html 및 모든 prerender 결과물에 삽입 -->
<link rel="alternate" type="application/rss+xml"
      title="99mini 블로그 RSS"
      href="https://99mini.github.io/feed.xml">
```

### 파일 변경 예상 목록

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `scripts/prerender.ts` | 수정 | RSS XML 생성 함수 추가, 모든 HTML에 `<link>` 태그 삽입 |
| `index.html` | 수정 | `<head>`에 RSS 자동 감지 `<link>` 태그 추가 |

외부 라이브러리 추가 없이 Node.js 내장 기능만으로 구현 가능. (XML은 문자열 템플릿으로 충분)

## 8. UI/UX 스케치

RSS는 직접적인 UI가 없으나, 사용자 접점:

**브라우저 주소창 RSS 아이콘 (자동 감지):**
```
Chrome/Firefox가 <link rel="alternate"> 태그를 감지하면
일부 확장 프로그램(RSS Reader 등)이 아이콘 표시
```

**Footer 구독 링크 추가 (선택):**
```
┌────────────────────────────────────┐
│  © 2026 99mini                     │
│  GitHub  |  RSS 구독               │  ← feed.xml 링크
└────────────────────────────────────┘
```

## 9. 성공 지표 (Success Metrics)

- `dist/feed.xml` 생성 완료 및 [W3C Feed Validator](https://validator.w3.org/feed/) 통과
- RSS 리더(Feedly 등)에서 구독 URL 입력 시 포스트 목록 정상 표시
- 빌드 시간 증가 < 500ms

## 10. 의존성 & 위험 (Dependencies & Risks)

| 항목 | 유형 | 설명 |
|------|------|------|
| 외부 패키지 없음 | - | Node.js 문자열 처리만으로 구현 가능 |
| XML 특수문자 이스케이프 | 위험 | 포스트 제목에 `&`, `<`, `>` 포함 시 XML 파싱 오류 → CDATA 래핑으로 해결 |
| 절대 URL 설정 | 위험 | `feed.xml` 내 링크는 절대 URL 필요 → 사이트 base URL을 환경변수나 상수로 관리 |
| `pubDate` 형식 | 위험 | RSS 2.0은 RFC-822 날짜 형식 요구 (`Tue, 13 May 2026 00:00:00 +0900`) → `new Date(post.date).toUTCString()` 사용 |

## 11. 마일스톤 (Milestones)

| 단계 | 내용 | 예상 기간 |
|------|------|-----------|
| M1 | `scripts/prerender.ts`에 `generateRssFeed(posts)` 함수 구현 | 0.5일 |
| M2 | `dist/feed.xml` 파일 출력 확인 + W3C 검증 | 0.5일 |
| M3 | 모든 HTML에 `<link rel="alternate">` 삽입 | 0.5일 |
| M4 | Footer에 RSS 구독 링크 추가 (선택) | 0.25일 |

## 관련 문서

- [002 SSG & 사전 렌더링](./../002-ssg-prerender.md)
- [005 SEO 전략](./../005-seo.md)
- [006 블로그 포스트 관리](./../006-blog-posts.md)

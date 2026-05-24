---
title: REST API 설계 및 표준
date: 2025-02-25
summary: REST API 엔드포인트 설계 표준과 모범 사례 — 리소스 URL, HTTP 메서드, 상태 코드, 버전 관리
tags: [http, 네트워크]
---

REST(Representational State Transfer) API는 웹 서비스를 위한 아키텍처 스타일입니다.

## REST API 엔드포인트 설계 및 표준

REST API(Representational State Transfer API)는 웹 서비스 설계의 한 방식으로, HTTP 프로토콜을 기반으로 클라이언트와 서버 간의 통신을 가능하게 합니다. REST API를 설계할 때는 다음과 같은 표준 및 모범 사례를 따르는 것이 중요합니다.

### 리소스 기반 URL

엔드포인트는 리소스를 명확히 나타내야 합니다. 리소스는 명사로 표현하며, 컬렉션(복수형)으로 나타냅니다.

예: `/users`, `/posts`, `/products`

### HTTP 메서드 사용

각 HTTP 메서드는 특정한 작업을 나타냅니다.

- `GET`: 리소스 조회
- `POST`: 리소스 생성
- `PUT`: 리소스 전체 업데이트
- `PATCH`: 리소스 부분 업데이트
- `DELETE`: 리소스 삭제

### 상태 코드 사용

API 응답은 HTTP 상태 코드를 통해 요청의 성공 여부를 나타냅니다.

- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `204 No Content`: 요청 성공, 응답 본문 없음
- `400 Bad Request`: 잘못된 요청
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 오류

### 쿼리 파라미터

필터링, 정렬, 페이지네이션 등에 쿼리 파라미터를 사용합니다.

예: `/users?age=30`, `/posts?sort=desc`

### 경로 파라미터

특정 리소스를 식별하기 위해 경로 파라미터를 사용합니다.

예: `/users/{id}`, `/posts/{postId}`

### 일관된 응답 구조

API 응답은 일관된 구조로 설계되어야 하며, 일반적으로 JSON 형식을 사용합니다.

예:

```json
{
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "status": "success"
}
```

### 버전 관리

API의 변경이 있을 때는 버전 관리를 통해 호환성을 유지합니다.

예: `/v1/users`, `/v2/users`

이러한 표준을 따르면 REST API는 명확하고 일관되며, 유지보수하기 쉬운 구조로 설계될 수 있습니다. REST API 설계는 클라이언트와 서버 간의 원활한 통신을 보장하고, 다양한 플랫폼에서의 확장성을 높이는 데 기여합니다.

## 참고 문헌

- [REST API](https://restfulapi.net/rest)

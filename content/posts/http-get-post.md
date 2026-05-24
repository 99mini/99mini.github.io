---
title: HTTP - GET vs POST
date: 2025-02-24
summary: HTTP에서 GET, POST 방식의 차이와 언제 POST로 조회를 해야 하는지 가이드
tags: [http, 네트워크]
---

HTTP에서 GET, POST 방식의 차이

## HTTP

HTTP([HyperText Transfer Protocol](https://datatracker.ietf.org/doc/html/rfc7231))는 웹에서 클라이언트와 서버 간의 통신을 위한 프로토콜입니다. 이는 웹 브라우저(클라이언트)가 웹 서버와 통신할 때 사용하는 주요 방법으로, 요청(Request)과 응답(Response) 방식으로 동작합니다.

### HTTP Methods

- `GET`: 요청 노출
- `POST`: 요청 노출 및 데이터 전송
- `PUT`: 요청 노출 및 데이터 전송 및 수정
- `DELETE`: 요청 노출 및 삭제
- `PATCH`: 특정해야 하는 데이터 수정

### HTTP/1.1

HTTP/1.1은 1997년에 도입된 HTTP의 첫 번째 표준 버전입니다. 주요 특징은 다음과 같습니다

- **지속적 연결(Persistent Connection)**: 한 번의 TCP 연결로 여러 요청과 응답을 처리할 수 있습니다.
- **파이프라이닝(Pipelining)**: 응답을 기다리지 않고 여러 요청을 연속적으로 보낼 수 있습니다.
- **호스트 헤더(Host Header)**: 동일한 IP 주소에서 여러 도메인을 호스팅할 수 있게 됩니다.

하지만 HTTP/1.1에는 다음과 같은 한계가 있습니다:

- Head of Line Blocking: 요청이 순차적으로 처리되어야 하는 문제
- 헤더 중복: 매 요청마다 중복된 헤더 정보를 전송

### HTTP/2.0

HTTP/2.0은 2015년에 표준화된 버전으로, HTTP/1.1의 성능 제한을 해결하기 위해 설계되었습니다

- **멀티플렉싱(Multiplexing)**: 하나의 TCP 연결에서 여러 요청과 응답을 동시에 처리
- **서버 푸시(Server Push)**: 클라이언트의 요청 없이도 서버가 리소스를 보낼 수 있음
- **헤더 압축(HPACK)**: 헤더 정보를 압축하여 중복 전송을 방지
- **바이너리 프로토콜**: 텍스트가 아닌 바이너리 포맷으로 인코딩하여 처리 속도 향상

## REST

REST(Representational State Transfer)는 웹 서비스를 위한 아키텍처 스타일입니다.

- **리소스 중심(Resource-Oriented)**: 모든 것을 리소스로 표현
- **상태가 없는(Stateless) 통신**: 각 요청은 독립적이며 이전 요청과 무관
- **균일한 인터페이스(Uniform Interface)**: 일관된 방식으로 리소스를 조작
- **클라이언트-서버 구조**: 관심사의 명확한 분리

## GET vs POST

두 메서드는 HTTP에서 가장 많이 사용되는 메서드로, 각각 다른 목적과 특징을 가집니다.

> **멱등성 (Idempotent)**
>
> 멱등성이란 동일한 요청을 한 번 보내는 것과 여러 번 보내는 것이 같은 효과를 가지는 것을 의미합니다. 즉, 요청을 여러 번 수행해도 결과가 달라지지 않는 성질입니다.
>
> **GET 메서드와 멱등성**
>
> - GET은 멱등성을 가지는 대표적인 메서드입니다.
> - 같은 URL로 몇 번을 요청하더라도 동일한 응답을 받습니다.
> - 예시: `GET /api/users/123`을 여러 번 호출해도 항상 동일한 사용자 정보를 반환
>
> **POST 메서드와 멱등성**
>
> - POST는 멱등성을 가지지 않는 대표적인 메서드입니다.
> - 동일한 POST 요청을 여러 번 보내면 서버의 상태가 계속 변경될 수 있습니다.
> - 예시: `POST /api/orders`를 여러 번 호출하면 매번 새로운 주문이 생성됨
>
> [RFC 7231 - HTTP Semantics and Content](https://datatracker.ietf.org/doc/html/rfc7231#section-4.2.2)에서는 GET, HEAD, PUT, DELETE는 멱등성을 가지며, POST는 멱등성을 가지지 않는다고 정의하고 있습니다.

### GET

GET은 서버로부터 데이터를 **조회**하는 데 사용되는 메서드입니다.

주요 특징:

- **캐시 가능**: 응답을 캐시할 수 있어 성능 향상
- **북마크 가능**: URL에 모든 파라미터가 포함되어 있어 저장/공유 용이
- **데이터 제한**: URL 길이 제한으로 인한 데이터 크기 제약
- **보안**: URL에 데이터가 노출되어 민감한 정보 전송에 부적합

사용 예시:

```
GET /api/users?id=123
GET /api/products?category=electronics
```

### POST

POST는 서버에 데이터를 **제출**하여 새로운 리소스를 **생성**하는 데 사용되는 메서드입니다.

주요 특징:

- **데이터 전송**: 요청 본문(body)에 데이터를 포함하여 전송
- **캐시 불가능**: 기본적으로 캐시되지 않음
- **멱등성 없음**: 동일한 요청을 여러 번 보내면 여러 번의 작업이 수행됨
- **보안**: URL에 데이터가 노출되지 않아 민감한 정보 전송에 적합

사용 예시:

```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### `POST`를 이용하여 READ를 하고 싶을 때는?

일반적으로 데이터 조회는 GET 메서드를 사용하는 것이 RESTful한 방식입니다. 하지만 다음과 같은 상황에서는 POST를 사용한 조회가 더 적절할 수 있습니다:

1. **복잡한 검색 조건**
   - GET 요청의 URL 길이 제한(일반적으로 2048자)을 초과하는 경우
   - 계층적이거나 복잡한 검색 파라미터를 전송해야 하는 경우

   ```json
   POST /api/search
   {
     "filters": {
       "category": ["electronics", "computers"],
       "price": { "min": 100, "max": 1000 },
       "specifications": {
         "ram": ["8GB", "16GB"],
         "storage": ["SSD", "HDD"]
       }
     },
     "sort": { "field": "price", "order": "desc" }
   }
   ```

2. **보안 요구사항**
   - 민감한 검색 조건이 URL에 노출되지 않아야 하는 경우
   - 검색 조건에 인증 정보가 포함된 경우

3. **GraphQL과 같은 쿼리 언어**
   - GraphQL은 모든 요청을 POST로 처리
   - 쿼리 자체가 요청 본문에 포함되어야 하는 경우

하지만 POST를 사용한 조회 시 다음 사항을 고려해야 합니다:

- **캐시 불가능**: POST 요청은 기본적으로 캐시되지 않아 성능 저하 가능
- **브라우저 히스토리**: POST 요청은 브라우저 히스토리에 남지 않아 북마크나 뒤로 가기가 어려움
- **프록시 서버**: 일부 프록시 서버는 POST 요청을 다르게 처리할 수 있음

대안으로 다음과 같은 방법을 고려할 수 있습니다:

1. **검색 ID 사용**

   ```
   POST /api/searches  # 검색 조건 저장
   GET /api/searches/{search-id}  # 저장된 검색 조건으로 조회
   ```

2. **압축된 쿼리 파라미터**
   ```
   GET /api/search?q=base64_encoded_search_params
   ```

## 참고 문헌

- [RFC 2616 - HTTP/1.1](https://datatracker.ietf.org/doc/html/rfc2616)
- [RFC 7540 - HTTP/2](https://datatracker.ietf.org/doc/html/rfc7540)
- [MDN - HTTP의 진화](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
- [HTTP/2 명세](https://http2.github.io/)
- [Roy Fielding의 REST 논문](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)
- [MDN - HTTP 요청 메서드](https://developer.mozilla.org/ko/docs/Web/HTTP/Methods)
- [RFC 7231 - HTTP/1.1: Semantics - POST](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.3)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#132-post)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [URI Length Limitations](https://stackoverflow.blog/2022/03/01/best-practices-for-rest-api-design/#limits)
- [Zalando RESTful API Guidelines](https://opensource.zalando.com/restful-api-guidelines/#http-requests)

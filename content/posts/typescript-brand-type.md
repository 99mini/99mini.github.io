---
title: TypeScript의 브랜드 타입과 유니온 타입
date: 2025-10-29
summary: __brand와 type 필드로 TypeScript에서 타입 안전성과 확장성을 동시에 확보하는 방법
tags: [typescript]
---

대규모 프론트엔드 코드베이스에서 가장 흔한 문제 중 하나는 **객체 형태가 다양해지는 것**이다.
예를 들어 결제 시스템을 만든다고 생각해보자.

- 카드 결제
- 간편 결제 (토스, 카카오페이 등)
- 포인트 결제

이들은 모두 "결제 수단(PaymentMethod)"이라는 공통 개념을 공유하지만, 세부 필드는 다르다.

이럴 때 **type 필드** 또는 **\_\_brand 필드**를 이용해 **타입 안정성과 확장성**을 모두 확보할 수 있다.

---

## 1. 기본 구조 설계

```typescript
// features/payment/types.ts
interface BasePayment {
  id: string;
  amount: number;
}

export interface CardPayment extends BasePayment {
  type: 'card';
  cardNumber: string;
  cardHolder: string;
}

export interface EasyPayPayment extends BasePayment {
  type: 'easypay';
  provider: 'Toss' | 'KakaoPay' | 'NaverPay';
}

export interface PointPayment extends BasePayment {
  type: 'point';
  pointsUsed: number;
}

export type PaymentMethod = CardPayment | EasyPayPayment | PointPayment;
```

---

## 2. 판별 유니온(discriminated union) 기반 처리

`type` 필드를 기준으로 자동으로 타입이 좁혀진다.
즉, `if (payment.type === 'card')`라고 쓰면, 그 안에서는 자동으로 `CardPayment` 타입이 된다.

```typescript
// features/payment/utils/processor.ts
export function processPayment(payment: PaymentMethod) {
  switch (payment.type) {
    case 'card':
      console.log(`💳 Processing card payment: ${payment.cardNumber}`);
      break;

    case 'easypay':
      console.log(`⚡ Using ${payment.provider} for payment.`);
      break;

    case 'point':
      console.log(`🎯 Points used: ${payment.pointsUsed}`);
      break;

    default:
      // never 타입으로 확실한 exhaustiveness check 가능
      const _exhaustive: never = payment;
      throw new Error(`Unknown payment type: ${_exhaustive}`);
  }
}
```

**장점**

- TypeScript가 자동으로 타입을 좁힘
- 새로운 타입이 추가되면 switch 문에서 컴파일 에러로 바로 감지됨
  → 유지보수성이 극대화

---

## 3. `__brand`를 이용한 컴파일타임 타입 구분

`type`은 주로 "비즈니스 로직용 식별자"로 쓰이지만,
`__brand`는 "개발자만 쓰는 타입 안전용 내부 식별자"로 활용할 수 있다.

```typescript
// features/payment/types/brand.ts
type Brand<K, T> = K & { __brand: T };

// 특정 문자열을 브랜드화
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

// 사용 예시
const userId: UserId = 'user_123' as UserId;
const orderId: OrderId = 'order_456' as OrderId;

// 타입이 달라서 섞을 수 없음
function fetchOrder(id: OrderId) {
  console.log(`Fetching order ${id}`);
}

fetchOrder(userId); // ❌ 컴파일 에러!
```

**장점**

- 문자열끼리 헷갈릴 수 있는 값을 **논리적으로 구분**
- 런타임에는 사라지지만, 컴파일 시 완벽한 타입 안정성을 제공

---

## 4. `__brand` + `type` 조합 실전 예시

이제 두 개념을 합쳐서, **결제 객체 전체에 브랜드를 부여**해보자.

```typescript
type BrandedPayment<T extends string> = BasePayment & { __brand: T };

export type CardPayment = BrandedPayment<'card'> & {
  type: 'card';
  cardNumber: string;
  cardHolder: string;
};

export type EasyPayPayment = BrandedPayment<'easypay'> & {
  type: 'easypay';
  provider: 'Toss' | 'KakaoPay' | 'NaverPay';
};

export type PaymentMethod = CardPayment | EasyPayPayment | PointPayment;

function refund(payment: PaymentMethod) {
  // if (payment.type === 'card') { // 동일한 효과
  if (payment.__brand === 'card') {
    console.log('Refunding to card...');
    // 타입 안전성 확보
    console.log(`Card Number: ${payment.cardNumber}`);
    console.log(`Card Holder: ${payment.cardHolder}`);

    console.log(`Provider: ${payment.provider}`); // 타입 에러 발생
    //                               ^^^^^^^^^
    //                               Property 'provider' does not exist on type 'CardPayment'.
  } else if (payment.__brand === 'easypay') {
    console.log('Refunding through EasyPay provider...');
    // 타입 안전성 확보
    console.log(`Provider: ${payment.provider}`);

    console.log(`Card Holder: ${payment.cardHolder}`); // 타입 에러 발생
    //                                  ^^^^^^^^^^
    //                                  Property 'cardHolder' does not exist on type 'EasyPayPayment'.
  }
}
```

**장점 요약**

- `type`: 비즈니스 로직 구분 API, UI에서 활용됨
- `__brand`: 컴파일타임 타입 구분 코드 내부 안전성 강화
- `BasePayment`: 공통 속성 추상화 `id`, `amount` 등 재사용
- `PaymentMethod`: 유니온 타입 새로운 결제 수단 추가 용이

---

## 5. 새로운 결제 수단 추가 예시

이제 "간편 송금" 기능을 새로 추가한다고 가정해봅시다.

```typescript
export type TransferPayment = BrandedPayment<'transfer'> & {
  type: 'transfer';
  bank: string;
  account: string;
};

export type PaymentMethod = CardPayment | EasyPayPayment | TransferPayment;
```

이때 `processPayment()` 함수의 switch문에 `'transfer'` 처리를 추가하지 않으면?

> TypeScript가 컴파일 타임에 "모든 케이스가 처리되지 않았다"고 알려준다.
> 즉, **확장성 + 안전성**을 동시에 확보한 구조이다.

---

## 6. 실무에서의 활용 포인트

| 상황                        | 활용법                                       |
| --------------------------- | -------------------------------------------- |
| API 응답 모델링             | 서버가 주는 type 필드를 판별 유니온으로 사용 |
| ID 구분 (UserId vs OrderId) | `__brand`로 문자열 안전성 확보               |
| 복잡한 컴포넌트 렌더링      | `type`으로 렌더링 로직 안전하게 분기         |
| 내부 비즈니스 로직          | `__brand`로 의미 있는 타입 구분              |

---

## 마무리

| 속성      | 용도              | 유지 시점         |
| --------- | ----------------- | ----------------- |
| `type`    | 런타임 로직 구분  | 런타임 유지       |
| `__brand` | 컴파일타임 안전성 | 런타임에서 제거됨 |

---

**참고**

- [TypeScript Deep Dive: Branded Types](https://basarat.gitbook.io/typescript/main-1/nominaltyping)

---
title: javascript 깊은 복사 - structuredClone
date: 2025-03-04
summary: structuredClone API를 이용한 JavaScript 깊은 복사 방법과 JSON.stringify 방식과의 성능 비교
tags: [javascript]
---

javascript 깊은 복사: structuredClone API 이용하기

## javascript에서 깊은 복사하는 방법

**`JSON.stringify() and JSON.parse()`**

```javascript
const clone = (obj) => JSON.parse(JSON.stringify(obj));

const original = { a: 1, b: { c: 3 } };
// original.itself = original;
/**
 * Uncaught TypeError: Converting circular structure to JSON
 *  --> starting at object with constructor 'Object'
 *  --- property 'itself' closes the circle
 * JSON.stringify()에서 순환 참조 시 에러 발생!
 */

const cloned = clone(original);

console.log(original === cloned); // false
console.log(cloned.a === original.a); // true
```

## `structuredClone()`

[MDN](https://developer.mozilla.org/ko/docs/Web/API/Window/structuredClone)를 참고하여 작성합니다.

```javascript
structuredClone(value);
structuredClone(value, options);
```

- value: clone할 객체
- options: 옵션
  - transfer: [전송가능한 객체](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects)의 배열

### structuredClone()으로 깊은 복사하기

```javascript
const clone = (obj) => structuredClone(obj);

const original = { a: 1, b: { c: 3 } };
original.itself = original;

const cloned = clone(original);

console.log(original === cloned); // false
console.log(cloned.a === original.a); // true
console.log(cloned.itself === original); // true 순환 참조 보존
```

### 객체 복사

```javascript
const original = {
  date: new Date(),
  array: [1, 2, 3],
  object: { a: 1, b: 2 },
  map: new Map([
    ['a', 1],
    ['b', 2],
  ]),
  set: new Set([1, 2, 3]),
};

const cloned = structuredClone(original);

console.log(cloned.date); // Tue Mar 04 2025 09:51:31 GMT+0900 (한국 표준시)
console.log(cloned.date.getDate()); // 4
console.log(cloned.map); // Map(2) {'a' => 1, 'b' => 2}
console.log(cloned.set); // Set(3) {1, 2, 3}
```

```javascript
const original = {
  date: new Date(),
  array: [1, 2, 3],
  object: { a: 1, b: 2 },
  map: new Map([
    ['a', 1],
    ['b', 2],
  ]),
  set: new Set([1, 2, 3]),
};

const cloned = JSON.parse(JSON.stringify(original));

console.log(cloned.date); // 2025-03-10T08:00:00.000Z
// console.log(cloned.date.getDate()); // TypeError: cloned.date.getDate is not a function
console.log(cloned.map); // {}
console.log(cloned.set); // {}
```

### 값 전송

```javascript
// 16MB = 1024 * 1024 * 16
const uInt8Array = Uint8Array.from({ length: 1024 * 1024 * 16 }, (v, i) => i);

const transferred = structuredClone(uInt8Array, {
  transfer: [uInt8Array.buffer],
});
console.log(uInt8Array.byteLength); // 0
console.log(transferred.byteLength); // 16MB
```

객체 수에 상관없이 복제하고 해당 객체의 하위 집합을 전송할 수 있습니다.

예를 들어, 아래 코드는 전달된 값에서 arrayBuffer1은 전송하지만, arrayBuffer2는 전송하지 않습니다.

### Performance

- 작은 사이즈의 객체에서는 JSON을 이용한 방식이 더 빠르다.
- 객체의 사이즈가 커지면 JSON.stringify의 값이 길어지고, 다시 JSON.parse로 파싱하는 데 오랜 시간이 걸린다.

```javascript
/**
 * {1: 1, 2: 2, ..., 10: 10}
 */
const original = Array.from({ length: 10 }, (_, i) => i).reduce((acc, v) => {
  acc[v] = v;
  return acc;
}, {});

const startTimeJSON = performance.now();
for (let i = 0; i < 100; i++) {
  JSON.parse(JSON.stringify(original));
}
const endTimeJSON = performance.now();

const performanceJSON = endTimeJSON - startTimeJSON;

const startTimeStructured = performance.now();
for (let i = 0; i < 100; i++) {
  structuredClone(original);
}
const endTimeStructured = performance.now();

const performanceStructured = endTimeStructured - startTimeStructured;

console.log(`JSON: ${performanceJSON}ms`); // 0.29999999701976776ms
console.log(`structured: ${performanceStructured}ms`); // 0.4000000059604645ms
console.log(`JSON / structured : ${performanceJSON / performanceStructured}x`); // 0.7499999813735487x
```

```javascript
/**
 * {1: 1, 2: 2, ..., 10000000: 10000000}
 */
const original = Array.from({ length: 10_000_000 }, (_, i) => i).reduce((acc, v) => {
  acc[v] = v;
  return acc;
}, {});

const startTimeJSON = performance.now();
JSON.parse(JSON.stringify(original));
const endTimeJSON = performance.now();

const performanceJSON = endTimeJSON - startTimeJSON;

const startTimeStructured = performance.now();
structuredClone(original);
const endTimeStructured = performance.now();

const performanceStructured = endTimeStructured - startTimeStructured;

console.log(`JSON: ${performanceJSON}ms`); // 2077.2000000029802ms
console.log(`structured: ${performanceStructured}ms`); // 185.699999988079ms
console.log(`JSON / structured : ${performanceJSON / performanceStructured}x`); // 1.7518765286530018x
```

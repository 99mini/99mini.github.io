---
title: Timsort 정렬 알고리즘
date: 2025-06-19
summary: Python의 Tim Peters가 설계한 Timsort 알고리즘의 동작 원리와 JavaScript 구현 및 벤치마크
tags: [정렬, 알고리즘]
---

내장 정렬 알고리즘 (`Timsort`)

2002년 Python을 위해 Tim Peters가 설계한 정렬 알고리즘. 합병 정렬(Merge Sort) 기반이지만, 입력 데이터의 정렬된 구간(런, Run)을 적극 활용하는 적응형 정렬 알고리즘

## [Timsort](#1-timsort)

### 아이디어

1. 입력을 "런(run)"이라는 단조 증가/감소 구간으로 분해
2. 분해된 런을 스택에 저장하고, 규칙에 따라 병합
3. 부분 정렬이 많은 경우 매우 효율적

### 성능

- 최선의 경우: O(n) - 이미 정렬된 데이터
- 평균의 경우: O(n log n)
- 최악의 경우: O(n log n) - 안정적인 성능 보장

### 장점 및 의의

#### 장점

- 실제 데이터 최적화: 완전 무작위가 아닌 실제 데이터에서 뛰어난 성능
- 안정성: 동일한 값의 상대적 순서 유지
- 예측 가능한 성능: 최악의 경우에도 O(n log n) 보장

#### 의의

- 적응형 알고리즘: 데이터의 기존 정렬 상태를 활용
- 하이브리드 접근: 여러 정렬 알고리즘의 장점을 효과적으로 결합
- 메모리 효율성: 전통적인 Merge Sort보다 적은 추가 메모리 사용

## Pseudo Code

```txt
Title: "Algorithm 1: TimSort"
Input : A sequence S to sort
Result: The sequence S is sorted into a single run, which remains on the stack.

1 runs ← a run decomposition of S
2 R ← an empty stack
3 while runs 6= ∅ do                                  // main loop of TimSort
4   remove a run r from runs and push r onto R
5   merge_collapse(R)
6 if height(R) 6= 1 then                              // the height of R is its number of runs
7   merge_force_collapse(R)
```

```txt
Title: "Algorithm 2: The merge_collapse procedure"
Input : A stack of runs R
Result: The invariant of Equations (1) and (2) is established.

1 while height(R) > 1 do
2   n ← height(R) − 2
3   if (n > 0 and r3 6 r2 + r1) or (n > 1 and r4 6 r3 + r2) then
4   if r3 < r1 then
5     merge runs R[2] and R[3] on the stack
6   else merge runs R[1] and R[2] on the stack
7   else if r2 6 r1 then
8     merge runs R[1] and R[2] on the stack
9   else break
```

```txt
Title: "Algorithm 3: TimSort: translation of Algorithm 1 and Algorithm 2"
Input : A sequence to S to sort
Result: The sequence S is sorted into a single run, which remains on the stack.

1 runs ← the run decomposition of S
2 R ← an empty stack
3 while runs 6= ∅ do                                                        // main loop of TimSort
4   remove a run r from runs and push r onto R                              // #1
5   while true do
6     if h > 3 and r1 > r3 then merge the runs R2 and R3                    // #2
7     else if h > 2 and r1 > r2 then merge the runs R1 and R2               // #3
8     else if h > 3 and r1 + r2 > r3 then merge the runs R1 and R2          // #4
9     else if h > 4 and r2 + r3 > r4 then merge the runs R1 and R2          // #5
10    else break
11 while h 6= 1 do merge the runs R1 and R2
```

## JavaScript

- 언어 스펙에는 명시 없음
- V8 (Chrome) → TimSort
- SpiderMonkey (Firefox) → MergeSort
- 배열 크기·정렬된 정도에 따라 InsertionSort fallback 사용
- stable sort([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort))

### code

<details>
<summary>timSort.js</summary>

```javascript
function minRunLength(n) {
  let r = 0;
  while (n >= 32) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}

function insertionSort(arr, left, right) {
  for (let i = left + 1; i <= right; i++) {
    let key = arr[i],
      j = i - 1;
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j--];
    }
    arr[j + 1] = key;
  }
}

function merge(arr, l, m, r) {
  const left = arr.slice(l, m + 1),
    right = arr.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;
  while (i < left.length && j < right.length) {
    arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
  }
  while (i < left.length) arr[k++] = left[i++];
  while (j < right.length) arr[k++] = right[j++];
}

function timsort(arr) {
  const n = arr.length,
    minRun = minRunLength(n);
  for (let i = 0; i < n; i += minRun) {
    insertionSort(arr, i, Math.min(i + minRun - 1, n - 1));
  }
  for (let size = minRun; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) merge(arr, left, mid, right);
    }
  }
  return arr;
}
```

</details>

### benchmark

<details>
<summary>benchmark.js</summary>

```javascript
const { performance } = require('perf_hooks');

/**
 * 테스트 데이터 생성
 */
function generateData(size, type) {
  const data = [];
  switch (type) {
    case 'random':
      for (let i = 0; i < size; i++) data.push(Math.floor(Math.random() * size));
      break;
    case 'ascending':
      for (let i = 0; i < size; i++) data.push(i);
      break;
    case 'descending':
      for (let i = 0; i < size; i++) data.push(size - i);
      break;
    case 'partial':
      for (let i = 0; i < size; i++) data.push(i);
      for (let j = 0; j < size * 0.1; j++) {
        const a = Math.floor(Math.random() * size);
        const b = Math.floor(Math.random() * size);
        [data[a], data[b]] = [data[b], data[a]];
      }
      break;
    case 'equal':
      for (let i = 0; i < size; i++) data.push(42);
      break;
  }
  return data;
}

const result = [];

async function runBenchmark() {
  const sizes = [1e1, 1e2, 1e3, 1e4, 1e5];
  const types = ['random', 'ascending', 'descending', 'partial', 'equal'];
  const iterations = 100;

  console.log('Size,Type,Method,AvgTime(ms)');
  for (const size of sizes) {
    for (const type of types) {
      let totalStd = 0;
      for (let i = 0; i < iterations; i++) {
        const data = generateData(size, type);
        const start = performance.now();
        data.sort((a, b) => a - b);
        totalStd += performance.now() - start;
      }
      console.log(`${size},${type},builtin,${(totalStd / iterations).toFixed(3)}`);
      result.push({ size, type, method: 'builtin', avgTime: totalStd / iterations, numberOfTrials: iterations });

      let totalTim = 0;
      for (let i = 0; i < iterations; i++) {
        const data = generateData(size, type);
        const start = performance.now();
        timsort(data);
        totalTim += performance.now() - start;
      }
      console.log(`${size},${type},timsort,${(totalTim / iterations).toFixed(3)}`);
      result.push({ size, type, method: 'timsort', avgTime: totalTim / iterations, numberOfTrials: iterations });
    }
  }
}

runBenchmark();

console.table(result, ['size', 'type', 'method', 'avgTime', 'numberOfTrials']);
```

</details>

### 밴치마크 결과

#### 테스트 환경

- Node.js v20.16.0
- CPU: Apple M1
- 메모리: 16 GB RAM
- OS: macOS 15.0(24A335)

#### 데이터 패턴

- 랜덤(Random)
- 오름차순(Ascending)
- 내림차순(Descending)
- 부분 정렬(Partial, 10% 랜덤 섞음)
- 동일 값(Equal)

#### 측정 방법

- 배열 크기: 1e1, 1e2, 1e3, 1e4, 1e5
- 반복 횟수: 100회 평균
- 시간 측정: performance.now() API 사용

#### 결과 분석

**배열 크기에 따른 성능 비교**

1. 작은 배열(10, 100개 요소)
   - 대부분의 경우 내장 sort가 TimSort보다 약간 빠름
   - 예외적으로 내림차순 정렬에서는 TimSort가 더 효율적

2. 중간 크기 배열(1,000개 요소)부터
   - Random 데이터와 Partial 데이터에서 TimSort가 내장 sort보다 확실히 우수함
   - 1,000개 요소에서 Random 데이터 정렬 시 TimSort(0.1154ms)가 내장 sort(0.2911ms)보다 약 2.5배 빠름
   - Partial 데이터에서도 TimSort(0.0677ms)가 내장 sort(0.1941ms)보다 약 2.9배 빠름

3. 대규모 배열(10,000, 100,000개 요소)
   - Random 데이터에서 TimSort의 우위가 더욱 두드러짐
   - 100,000개 요소에서 Random 데이터 정렬 시 TimSort(23.4251ms)가 내장 sort(66.7042ms)보다 약 2.8배 빠름
   - Partial 데이터에서도 TimSort(14.7961ms)가 내장 sort(29.2475ms)보다 약 2배 빠름

**데이터 패턴별 성능 특성**

1. Random 데이터

- 배열 크기가 커질수록 TimSort의 우위가 명확해짐
- 특히 대규모 배열에서 TimSort가 압도적으로 빠름

2. Ascending(오름차순) 데이터

- 작은 배열에서는 내장 sort가 더 빠름
- 큰 배열에서는 오히려 내장 sort가 TimSort보다 약 3배 빠름

3. Descending(내림차순) 데이터

- 작은 배열에서는 TimSort가 더 빠름
- 큰 배열에서는 내장 sort가 TimSort보다 약 5배 빠름

4. Partial(부분 정렬) 데이터

- 모든 배열 크기에서 TimSort가 내장 sort보다 우수함
- 특히 배열 크기가 클수록 그 차이가 두드러짐

5. Equal(동일값) 데이터

- 작은 배열에서는 두 알고리즘이 비슷한 성능
- 큰 배열에서는 내장 sort가 TimSort보다 약 2.8배 빠름

**결론**

- TimSort는 랜덤 데이터와 부분 정렬된 데이터에서 특히 강점을 보임
- 내장 sort는 이미 정렬된 데이터(오름차순/내림차순)와 동일값 데이터에서 더 효율적

<details>
<summary>표</summary>

| 배열 크기 | 데이터 패턴 | 내장sort평균(ms) | TimSort 평균(ms) |
| --------- | ----------- | ---------------- | ---------------- |
| 10        | Random      | 0.0019           | 0.0053           |
|           | Ascending   | 0.0010           | 0.0044           |
|           | Descending  | 0.0109           | 0.0033           |
|           | Partial     | 0.0012           | 0.0013           |
|           | Equal       | 0.0010           | 0.0009           |
| 100       | Random      | 0.0192           | 0.0265           |
|           | Ascending   | 0.0032           | 0.0054           |
|           | Descending  | 0.0033           | 0.0072           |
|           | Partial     | 0.0180           | 0.0049           |
|           | Equal       | 0.0032           | 0.0031           |
| 1,000     | Random      | 0.2911           | 0.1154           |
|           | Ascending   | 0.0281           | 0.0463           |
|           | Descending  | 0.0319           | 0.1005           |
|           | Partial     | 0.1941           | 0.0677           |
|           | Equal       | 0.0275           | 0.0371           |
| 10,000    | Random      | 4.1735           | 1.7753           |
|           | Ascending   | 0.3503           | 0.7572           |
|           | Descending  | 0.3209           | 1.1390           |
|           | Partial     | 2.8297           | 1.7024           |
|           | Equal       | 0.5426           | 0.9224           |
| 100,000   | Random      | 66.7042          | 23.4251          |
|           | Ascending   | 3.3959           | 10.1161          |
|           | Descending  | 3.5873           | 18.3476          |
|           | Partial     | 29.2475          | 14.7961          |
|           | Equal       | 3.5066           | 9.6663           |

</details>

## Reference

#### 1. [Timsort](https://en.wikipedia.org/wiki/Timsort)

#### 2. [Nicolas Auger, Vincent Jugé, Cyril Nicaud, and Carine Pivoteau, "On the Worst-Case Complexity of TimSort", Université Paris-Est, LIGM (UMR 8049), UPEM, F77454 Marne-la-Vallée, France](https://arxiv.org/abs/1805.08612)

#### 3. [Python sort()](https://docs.python.org/3/library/functions.html#sorted)

#### 4. [MDN Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

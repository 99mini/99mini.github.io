---
title: zustand 라이브러리 분석
date: 2025-11-04
summary: Zustand의 vanilla.ts와 react.ts를 분석하여 클로저 기반 상태 관리와 React 통합 원리를 이해한다
tags: [typescript, react]
---

## 들어가며

Zustand의 내부를 이해하고 싶을 때 가장 먼저 살펴봐야 하는 파일이 바로 `src/vanilla.ts`와 `src/react.ts`다.
하나는 순수 자바스크립트 환경에서 동작하는 스토어 코어를, 다른 하나는 그 코어를 React 세계에 안전하게 들여오기 위한 얇은 어댑터를 제공한다.

---

## 1. 바닐라 스토어(`src/vanilla.ts`)의 구조

### 1-1. `createStore` - 클로저 하나로 완성되는 상태 컨테이너

`createStore`는 Zustand 사용자 경험의 출발점이다. 함수 시그니처는 오버로딩되어 있지만 현실적으로는 항상 `createState(set, get, api)` 형태의 초기화 함수를 받고 즉시 내부 구현(`createStoreImpl`)을 실행한다.

```ts
let state: TState;
const listeners = new Set<StateListener<TState>>();
```

이 두 변수가 스토어의 생애주기 전반을 책임진다. `state`는 현재 스냅샷을 `listeners`는 상태 변경 알림을 받을 콜백을 추적한다.
이후 `createState` 콜백을 실행하면서 초기 상태를 계산하고, 동시에 `initialState`를 따로 저장해둔다. 이때 `set`, `get`, `api`를 인자로 넘겨 주기 때문에 초기화 과정에서 다른 상태를 참조하거나 특정 구독을 걸어두는 것도 가능하다.

### 1-2. `setState`의 분기와 `replace` 옵션

`setState(partial, replace)`는 Zustand가 느슨한 불변성 전략을 택한다는 사실을 잘 보여준다.

```ts
// https://github.com/pmndrs/zustand/blob/main/src/vanilla.ts

const createStoreImpl: CreateStoreImpl = (createState) => {
  // ...

  let state: TState;
  const listeners = new Set<StateListener<TState>>();

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState = typeof partial === 'function' ? (partial as (state: TState) => TState)(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state =
        (replace ?? (typeof nextState !== 'object' || nextState === null))
          ? (nextState as TState)
          : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
};
```

- `partial`이 함수이면 `partial(state)`로 다음 상태를 계산하고, 값이면 그대로 사용한다.
- `Object.is(nextState, state)`로 변경 여부를 검사해 값이 동일하면 조용히 빠져나간다.
- 실제 변경이 필요할 때는 `replace` 플래그와 `nextState`의 타입을 함께 보고 두 가지 경로로 나뉜다.
  - `replace === true`이거나 `nextState`가 객체가 아닐 때는 **통째로 교체**.
  - 그 외에는 `Object.assign({}, state, nextState)`로 **얕은 병합**.

이렇게 만들어진 `state`는 이전 값과 함께 모든 리스너에게 전달된다. 리스너는 `(state, previousState)` 형태로 알림을 받기 때문에 필요하면 두 값을 비교해 세밀한 사이드 이펙트를 수행할 수 있다.

### 1-3. 읽기/구독 API와 `destroy`

클로저로 감싼 상태는 단 세 개의 읽기와 구독 메서드로 외부에 노출된다.

```ts
// https://github.com/pmndrs/zustand/blob/main/src/vanilla.ts

const createStoreImpl: CreateStoreImpl = (createState) => {
  // ...
  const getState: StoreApi<TState>['getState'] = () => state;

  const getInitialState: StoreApi<TState>['getInitialState'] = () => initialState;

  const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
    listeners.add(listener);
    // Unsubscribe
    return () => listeners.delete(listener);
  };

  const api = { setState, getState, getInitialState, subscribe };
  const initialState = (state = createState(setState, getState, api));
  return api as any;
};

export const createStore = ((createState) =>
  createState ? createStoreImpl(createState) : createStoreImpl) as CreateStore;
```

- `getState()`는 현재 스냅샷을 그대로 반환한다.
- `getInitialState()`는 스토어 생성 시 계산했던 초깃값을 돌려준다. 서버 렌더링이나 리셋 로직에서 유용하다.
- `subscribe(listener)`는 리스너를 `Set`에 추가하고, 해제용 함수를 반환한다.

추가로 `destroy()`도 정의되어 있지만 더 이상 필수는 아니다. 내부적으로는 `listeners.clear()`만 호출하며,
v5부터는 개발 모드 경고를 띄우고 향후 제거 예정인 deprecated API로 취급된다. 결국 cleanup은 구독 시 받은 `unsubscribe()`를 호출하는 것만으로 충분하다.

## 2. React(`src/react.ts`)와 통합

### 2-1. `create`: React 바인딩의 진입점

React 사용자에게 익숙한 `create(set => ({ ... }))` 함수는 사실 바닐라 스토어를 그대로 노출하지 않는다.
내부에서는 먼저 `createStore`로 API 객체(`api`)를 만든 다음, 그 위에 `useStore` 훅을 감싼 `useBoundStore(api, selector)` 함수를 만들어 반환한다.

```ts
// https://github.com/pmndrs/zustand/blob/main/src/react.ts#L53C1-L61C2
const createImpl = <T>(createState: StateCreator<T, [], []>) => {
  const api = createStore(createState);

  const useBoundStore: any = (selector?: any) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};
```

```ts
const useBearStore = create((set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
}));

const bears = useBearStore((state) => state.bears); // 훅처럼 사용
const bears = useBearStore.getState().bears; // 직접 상태 읽기 및 수정도 가능
```

함수 객체에 `getState`, `setState`, `subscribe` 등을 얹어 두었기 때문에 훅처럼 호출도 하고, `useBearStore.getState()`처럼 직접 상태를 읽는 것도 가능한 하이브리드 인터페이스가 완성된다.

### 2-2. `useStore`와 `useSyncExternalStore`

`useStore`는 React 18에서 도입된 `useSyncExternalStore`를 감싼 thin wrapper다.

```ts
// https://github.com/pmndrs/zustand/blob/main/src/react.ts#L26C1-L37C2

export function useStore<TState, StateSlice>(
  api: ReadonlyStoreApi<TState>,
  selector: (state: TState) => StateSlice = identity as any,
) {
  const slice = React.useSyncExternalStore(
    api.subscribe, // 구독자 등록
    React.useCallback(() => selector(api.getState()), [api, selector]), // 현재 상태 선택 (메모이제이션 필수)
    React.useCallback(() => selector(api.getInitialState()), [api, selector]), // 서버 사이드 렌더링용 초기 상태 선택 (메모이제이션 필수)
  );
  React.useDebugValue(slice);
  return slice;
}
```

이렇게 구독이 걸리면 React는 외부 스토어와 동기화하면서도 선택한 조각(slice)이 바뀔 때만 리렌더링을 트리거한다. 동시에 `useDebugValue(slice)`로 DevTools에 상태를 표시하여 디버깅 편의성도 챙긴다.

### 2-3. `selector`가 만드는 렌더링 경로

Zustand를 큰 프로젝트에서 사용할 때 성능을 좌우하는 부분은 selector를 어떻게 작성하느냐다.

- selector를 지정하지 않으면 스토어 전체 객체를 구독하게 되어 모든 변경에 반응한다.
- selector가 프리미티브나 안정적인 참조를 반환한다면 React의 기본 `Object.is` 비교만으로도 리렌더링을 최소화할 수 있다.
- selector가 매번 새로운 객체를 만든다면 참조가 항상 바뀌므로, 불필요한 렌더를 피하려면 selector 자체에서 결과를 메모이즈하거나 구조를 재설계해야 한다.

즉, React 레이어는 바닐라 스토어가 제공하는 단순한 구독 API 위에 `useSyncExternalStore` 프로토콜을 얹어 "필요한 값만, 필요할 때" 리렌더링하도록 보장한다.

## 3. 내부 설계에서 얻은 인사이트

1. **클로저 기반 상태 관리**  
   별도의 클래스나 심화된 불변성 라이브러리 없이 `state`와 `listeners`만으로 캡슐화가 끝난다.
   이는 번들 크기와 학습 비용을 모두 낮춘다.

2. **React 의존성을 철저히 분리**  
   바닐라 층은 React를 전혀 모른 채 순수 API를 노출하고,
   React 층은 `useSyncExternalStore`로만 의존한다. 덕분에 React 외 환경에서도 같은 스토어를 재사용할 수 있다.

3. **옵션형 최적화 지점**  
   selector가 어떤 값을 돌려주느냐에 따라 비용이 달라진다.
   기본값은 단순하지만, 요구사항이 복잡해질수록 선택자를 분리하거나 메모이즈하여 성능을 조절할 수 있다.

간결한 코드로 이 정도의 유연성과 최적화를 얻는 패턴은 다른 상태 관리 라이브러리를 설계할 때도 좋은 참고가 된다.
Zustand가 "작지만 강한" 도구라는 평을 듣는 이유가 바로 여기에 있다.

## References

- [Zustand GitHub Repository](https://github.com/pmndrs/zustand)
- [React `useSyncExternalStore` Documentation](https://react.dev/reference/react/useSyncExternalStore)
- [useMutableSource → useSyncExternalStore Discussion](https://github.com/reactwg/react-18/discussions/86)

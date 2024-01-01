"use client";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { atom, useRecoilState } from "recoil";

const THRESHOLD = 0;

const currentIdState = atom<string>({
  key: "CurrentId",
  default: "",
});

const useHashAnchor = <T extends HTMLElement>() => {
  const hashTargetRefList = useRef<T[]>([]);

  const [currentId, setCurrentId] = useRecoilState(currentIdState);

  const onScroll: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      hashTargetRefList.current?.forEach((current) => {
        if (current && entry.isIntersecting) {
          const targetId = current.getAttribute("id");
          if (targetId) {
            setCurrentId(targetId);
          }
        }
      });
    },
    [setCurrentId]
  );

  const registHashAnchor = (newHashAnchorRef: RefObject<T>) => {
    if (newHashAnchorRef.current && !hashTargetRefList.current.includes(newHashAnchorRef.current)) {
      hashTargetRefList.current.push(newHashAnchorRef.current);
    }
  };

  useEffect(() => {
    let observer: IntersectionObserver;

    if (hashTargetRefList.current) {
      observer = new IntersectionObserver(onScroll, { threshold: THRESHOLD, rootMargin: "0px 0px -90%" });
      hashTargetRefList.current.forEach((current) => observer.observe(current));
    }

    return () => observer && observer.disconnect();
  }, [onScroll]);

  return { currentId, registHashAnchor };
};

export default useHashAnchor;

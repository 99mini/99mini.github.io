"use client";
import { useCallback, useEffect, useRef } from "react";
import { DirectionKey, DirectionValue, ReturnType, direction } from "./types";

const useScrollAnimation = (
  _duration: number = 1,
  _delay: number = 0,
  _threshold: number = 0.3,
  _direction: DirectionKey | DirectionValue = direction.UP
): ReturnType => {
  const element = useRef<any>();

  const handleDirection = (name: DirectionKey | DirectionValue) => {
    switch (name) {
      case direction.UP:
        return "translate3d(0, 50%, 0)";
      case direction.DOWN:
        return "translate3d(0, -50%, 0)";
      case direction.LEFT:
        return "translate3d(50%, 0, 0)";
      case direction.RIGHT:
        return "translate3d(-50%, 0, 0)";
      default:
        return;
    }
  };

  const onScroll: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      const { current } = element;
      if (entry.isIntersecting) {
        current.style.transitionProperty = "all";
        current.style.transitionDuration = `${_duration}s`;
        (current.style.transitionTimingFunction = "cubic-bezier(0, 0, 0.2, 1)"),
          (current.style.transitionDelay = `${_delay}s`);
        current.style.opacity = 1;
        current.style.transform = "translate3d(0, 0, 0)";
      }
    },
    [_delay, _duration]
  );

  useEffect(() => {
    let observer: IntersectionObserver;

    if (element.current) {
      observer = new IntersectionObserver(onScroll, { threshold: _threshold });
      observer.observe(element.current);
    }

    return () => observer && observer.disconnect();
  }, [_threshold, onScroll]);

  return {
    ref: element,
    style: { opacity: 0, transform: handleDirection(_direction) },
  };
};

export default useScrollAnimation;

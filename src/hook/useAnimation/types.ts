import { MutableRefObject } from "react";

export type ReturnType = {
  ref: MutableRefObject<any>;
  style?: {
    opacity?: number;
    transform?: string | undefined;
    clipPath?: string | undefined;
  };
};

export const direction = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;

export type Direction = typeof direction;
export type DirectionKey = keyof Direction;
export type DirectionValue = (typeof direction)[DirectionKey];

export const keyCode = {
  ESC: 27,
  ENTER: 13,
} as const;

export type KeyCode = typeof keyCode;
export type KeyCodeKey = keyof KeyCode;
export type keyCodeValue = (typeof keyCode)[KeyCodeKey];

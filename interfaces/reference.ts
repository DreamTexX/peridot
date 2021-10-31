import type { ConstructorType } from "../types.ts";

export interface Reference<T = ConstructorType> {
  forwardRef: () => T;
}

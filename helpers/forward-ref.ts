import { Reference } from "../interfaces/reference.ts";

export function forwardRef<T>(ref: () => T): Reference<T> {
  return {
    forwardRef: ref,
  };
}

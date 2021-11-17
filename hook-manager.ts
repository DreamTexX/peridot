import { HookType } from "./enums/hook.enum.ts";
import {
  AnyHookFunction,
  HookFunctions,
} from "./interfaces/hook-functions.interface.ts";

export class HookManager {
  readonly #hooks: Map<HookType, Array<AnyHookFunction>>;

  get hooks(): Map<HookType, Array<AnyHookFunction>> {
    return this.#hooks;
  }

  constructor() {
    this.#hooks = new Map();
  }

  hook<T extends HookType>(type: T, fn: HookFunctions[T]): void {
    const hooks = this.#hooks.get(type) ?? [];
    hooks.push(fn);
    this.#hooks.set(type, hooks);
  }

  call<T extends HookType>(
    type: T,
    ...args: Parameters<HookFunctions[T]>
  ): void {
    const hooks = this.#hooks.get(type) ?? [];
    // @ts-ignore: IDK, deno is dumb
    hooks.forEach((fn) => fn(...args));
  }
}

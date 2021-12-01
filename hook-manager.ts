import { HookExecutionData } from './interfaces/hook-execution-data.interface.ts';
import { HookSubscriptionFilter } from './interfaces/hook-subscription-filter.interface.ts';
import { HookFunction } from './types.ts';

export class HookManager {
  readonly #hooks: Array<{ filter: HookSubscriptionFilter; fn: HookFunction }>;

  get hooks(): Array<{ filter: HookSubscriptionFilter; fn: HookFunction }> {
    return this.#hooks;
  }

  constructor() {
    this.#hooks = [];
  }

  subscribe(filter: HookSubscriptionFilter, fn: HookFunction): void {
    this.#hooks.push({ filter, fn });
  }

  execute(data: HookExecutionData): void {
    this.#hooks.filter((hook) => {
      const filters = hook.filter;
      if (filters.application && filters.application !== data.application) {
        return false;
      }
      if (filters.container && filters.container !== data.container) {
        return false;
      }
      if (
        (filters.type === 'provider' || filters.type === 'consumer') &&
        filters.type !== data.kind
      ) {
        return false;
      } else if (filters.type && filters.type !== data.type) {
        return false;
      }
      if (filters.scope && filters.scope !== data.scope) {
        return false;
      }

      return true;
    }).forEach((hook) => {
      hook.fn({
        application: data.application,
        container: data.container,
        typeData: undefined,
      });
    });
  }

  /*hook<T extends HookType>(type: T, fn: HookFunction): void {
    const hooks = this.#hooks.get(type) ?? [];
    hooks.push(fn);
    this.#hooks.set(type, hooks);
  }

  call<T extends HookType>(
    type: T,
    data: HookData,
  ): void {
    const hooks = this.#hooks.get(type) ?? [];
    hooks.forEach((hook) => {
      hook(data);
    });
  }*/
}

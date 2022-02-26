import { Logger } from './helpers/logger.ts';
import { HookData } from './interfaces/hook-data.interface.ts';
import { HookFilter } from './interfaces/hook-filter.interface.ts';
import { HookFunction } from './types.ts';

export class HookManager {
  readonly #hooks: Array<{ filter: HookFilter; fn: HookFunction }>;

  get hooks(): Array<{ filter: HookFilter; fn: HookFunction }> {
    return this.#hooks;
  }

  constructor() {
    this.#hooks = [];
  }

  subscribe(filter: HookFilter, fn: HookFunction): void {
    this.#hooks.push({ filter, fn });
  }

  execute(
    data: HookFilter & HookData & { kind?: 'provider' | 'consumer' },
  ): void {
    Logger.debug('Hook call:', data);
    this.#hooks
      .filter((hook) =>
        (hook.filter.application === '*' && data.application !== undefined) ||
        hook.filter.application === data.application
      )
      .filter((hook) =>
        (hook.filter.container === '*' && data.container !== undefined) ||
        hook.filter.container === data.container
      )
      .filter((hook) =>
        (hook.filter.scope === '*' && data.scope !== undefined) ||
        hook.filter.scope === data.scope
      )
      .filter((hook) =>
        (hook.filter.type === '*' && data.type !== undefined) ||
        hook.filter.type === data.kind || hook.filter.type === data.type
      )
      .forEach((hook) => {
        hook.fn({
          application: data.application,
          container: data.container,
          typeData: data.typeData,
        });
      });
  }
}

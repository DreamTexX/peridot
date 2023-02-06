import { HookFilter } from './hook-filter.interface.ts';

export interface ExtendedHookFilter extends Omit<HookFilter, 'container'> {
  module?: 'this';
}

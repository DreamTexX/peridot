import { ModuleOptions } from '../interfaces/module-options.ts';
import { StaticMetadata } from '../metadata.ts';
import { ConstructorType, TypedClassDecorator } from '../types.ts';

export const METADATA_KEY_MODULE = Symbol('metadata_key_module');

export function Module(
  options: ModuleOptions,
): TypedClassDecorator {
  return function (target: ConstructorType): void {
    StaticMetadata.defineMetadata(target, METADATA_KEY_MODULE, options);
  };
}

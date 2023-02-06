import { ExtendedHookFilter } from '../interfaces/mod.ts';
import { StaticMetadata } from '../metadata.ts';
import { ClassType, Indexable, TypedMethodDecorator } from '../types.ts';

export function Hook(filter: ExtendedHookFilter): TypedMethodDecorator {
  return function (
    type: ClassType,
    property: string,
    _propertyDescriptor: PropertyDescriptor,
  ): void {
    const hooks: Map<ExtendedHookFilter, Array<unknown>> =
      StaticMetadata.get('HOOKS', type) ?? new Map();
    if (!hooks.has(filter)) {
      hooks.set(filter, []);
    }
    hooks.get(filter)?.push((<Indexable<ClassType>> type)[property]);
    StaticMetadata.set('HOOKS', hooks, type);
  };
}

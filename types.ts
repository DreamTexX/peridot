import { HookData } from './interfaces/hook-data.interface.ts';

class _Dummy {}
export type ClassType = _Dummy;

export type ConstructorType<T = ClassType> = {
  // deno-lint-ignore no-explicit-any
  new (...args: any[]): T;
};

export type Indexable<T> = T & {
  [key: string]: unknown;
};

export type EmptyConstructorType<T = ClassType> = {
  new (): T;
};

export type TypedMethodDecorator = (
  type: ClassType,
  property: string,
  propertyDescriptor: PropertyDescriptor,
) => void;
export type TypedClassDecorator = (type: ConstructorType) => void;
export type TypedPropertyDecorator = (
  type: ClassType,
  property: string,
) => void;

export type HookFunction = (data?: HookData) => void | Promise<void>;

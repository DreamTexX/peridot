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

export type TypedClassDecorator = (type: ConstructorType) => void;
export type TypedPropertyDecorator = (
  type: ClassType,
  property: string,
) => void;

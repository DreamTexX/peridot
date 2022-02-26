export class Metadata {
  #metadata: Map<
    unknown,
    Map<symbol | string, Map<symbol | number | string, unknown>>
  > = new Map();

  /**
   * Stores metadata for the specified {@link type}.
   *
   * @deprecated replaced by {@link Metadata.set}
   * @param type Any class type metadata should get set on
   * @param key Metadata key
   * @param value Metadata value
   */
  public defineMetadata(
    type: unknown,
    key: symbol | number | string,
    value: unknown,
  ): void {
    this.set(key, value, type);
  }

  /**
   * Retrieves metadata for specified {@link type}
   *
   * @deprecated replaced by {@link Metadata.get}
   * @param type Any class type metadata should get set on
   * @param key Metadata key
   * @returns Metadata value if exists, else undefined
   */
  public getMetadata<T>(
    type: unknown,
    key: symbol | number | string,
  ): T | undefined {
    return this.get(key, type);
  }

  //TODO(@DreamTexX): Add tests
  public set(
    key: symbol | number | string,
    value: unknown,
    type: unknown,
  ): void;
  public set(
    key: symbol | number | string,
    value: unknown,
    type: unknown,
    propertyKey: symbol | string,
  ): void;
  public set(
    key: symbol | number | string,
    value: unknown,
    type: unknown,
    propertyKey: symbol | string = 'prototype',
  ): void {
    if (!this.#metadata.has(type)) {
      this.#metadata.set(type, new Map());
    }
    const metaForType = this.#metadata.get(type)!;
    if (!metaForType.has(propertyKey)) {
      metaForType.set(propertyKey, new Map());
    }
    const metaForPropertyKey = metaForType.get(propertyKey)!;
    metaForPropertyKey.set(key, value);
  }

  //TODO(@DreamTexX): Add tests
  public get<T>(key: symbol | number | string, type: unknown): T | undefined;
  public get<T>(
    key: symbol | number | string,
    type: unknown,
    propertyKey: symbol | string,
  ): T | undefined;
  public get<T>(
    key: symbol | number | string,
    type: unknown,
    propertyKey: symbol | string = 'prototype',
  ): T | undefined {
    return this.#metadata.get(type)?.get(propertyKey)?.get(key) as T;
  }

  public clear(): void {
    this.#metadata.clear();
  }
}

export const StaticMetadata = new Metadata();

// Add Reflect Metadata Polyfill for automatic type detection

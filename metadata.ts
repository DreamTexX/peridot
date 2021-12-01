//TODO(DreamTexX): add method to add type and property metadata:
// Metadata#defineMetadata(type, property, key, value)

export class Metadata {
  #metadata: Map<unknown, Map<symbol | number | string, unknown>> = new Map();

  public defineMetadata(
    type: unknown,
    key: symbol | number | string,
    value: unknown,
  ): void {
    const metadataForType = this.#metadata.get(type) || new Map();
    metadataForType.set(key, value);
    this.#metadata.set(type, metadataForType);
  }

  public getMetadata<T>(
    type: unknown,
    key: symbol | number | string,
  ): T | undefined {
    return this.#metadata.get(type)?.get(key) as T;
  }

  public clear(): void {
    this.#metadata.clear();
  }
}

export const StaticMetadata = new Metadata();

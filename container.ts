import {
  ClassType,
  ConstructorType,
  EmptyConstructorType,
  HookFunction,
  Indexable,
} from './types.ts';
import { Reference } from './interfaces/reference.ts';
import { InstanceProperty } from './interfaces/instance-property.ts';
import { StaticMetadata } from './metadata.ts';
import { Logger } from './helpers/logger.ts';
import { OnModuleInit } from './interfaces/on-module-init.ts';
import { TypeData } from './interfaces/type-data.ts';
import { HookManager } from './hook-manager.ts';
import { Application } from './application.ts';
import { HookFilter } from './interfaces/hook-filter.interface.ts';

export class Container {
  readonly #types: Map<string, TypeData>;
  readonly #name: string;
  readonly #resolvableLinks: Array<Container | Reference<Container>>;
  readonly #linkedContainers: Map<string, Container>;
  readonly #hookManager: HookManager;
  readonly #application?: Application;
  #isBooted: boolean;

  get isBooted(): boolean {
    return this.#isBooted;
  }

  get name(): string {
    return this.#name;
  }

  constructor(
    name?: string,
    hookManager?: HookManager,
    application?: Application,
  ) {
    this.#types = new Map();
    this.#linkedContainers = new Map();
    this.#resolvableLinks = [];
    this.#hookManager = hookManager ?? new HookManager();
    this.#isBooted = false;
    this.#application = application;
    this.#name = name ?? 'Container' + Math.random().toString(16).substr(2);
  }

  public link(container: Container | Reference<Container>): void {
    if (!this.#resolvableLinks.includes(container)) {
      this.#resolvableLinks.push(container);
    }
  }

  public provider(type: EmptyConstructorType): void {
    this.#addType(type, true);
    Logger.debug(
      `Registered object ${type.name} as provider @ container ${this.#name}`,
    );
  }

  public consumer(type: EmptyConstructorType): void {
    this.#addType(type, false);
    Logger.debug(
      `Registered object ${type.name} as consumer @ container ${this.#name}`,
    );
  }

  public hook(
    filter: HookFilter,
    fn: HookFunction,
  ): void {
    this.#hookManager.subscribe(filter, fn);
  }

  public *consumers(): IterableIterator<EmptyConstructorType> {
    for (const typeData of this.#types.values()) {
      if (!typeData.provider) {
        yield typeData.type;
      }
    }
  }

  public links(): IterableIterator<Container> {
    return this.#linkedContainers.values();
  }

  public has(type: ConstructorType | string): boolean {
    const identifier = (<ConstructorType> type).name ?? <string> type;
    return this.#types.has(identifier);
  }

  public exports(type: ConstructorType | string): boolean {
    const identifier = (<ConstructorType> type).name ?? <string> type;
    return this.#types.has(identifier) &&
      !!this.#types.get(identifier)?.exported;
  }

  public resolve<T>(type: ConstructorType<T> | string): T {
    if (!this.#isBooted) {
      throw new Error(`Container is not booted yet.`);
    }
    const identifier = (<ConstructorType> type).name ?? <string> type;
    const resolved = this.#types.get(identifier);
    if (resolved) {
      if (!resolved.provider) {
        throw new Error(
          `${identifier} is not marked as provider.`,
        );
      }
      if (!resolved.exported) {
        throw new Error(
          `${identifier} needs to be exported to be used by other containers.`,
        );
      }
      if (resolved.instance) {
        return resolved.instance as T;
      }
    }
    throw new Error(`${identifier} is not known to this container.`);
  }

  public export(type: EmptyConstructorType): void {
    if (this.#isBooted) {
      throw new Error(`Cannot export types after container is booted`);
    }
    const identifier = type.name;
    const resolved = this.#types.get(identifier);
    if (!resolved) {
      throw new Error(
        `${identifier} is not registered in this container. You need to add this type first.`,
      );
    }
    if (!resolved.provider) {
      throw new Error(`Cannot export consumer ${identifier}`);
    }
    resolved.exported = true;
  }

  public boot(): void {
    if (this.#isBooted) {
      throw new Error(`Container is already booted.`);
    }

    this.#isBooted = true;

    Logger.info(`Booting container "${this.#name}"`);
    Logger.debug(`Calling pre module init hook`);
    this.#hookManager.execute({
      application: this.#application,
      container: this,
      scope: 'pre',
    });

    Logger.debug(`Resolving links to other containers`);
    for (const containerOrReference of this.#resolvableLinks) {
      this.#resolveLinkedContainer(containerOrReference);
    }

    Logger.debug(`Creating instances for all types`);
    for (const type of this.#types.keys()) {
      this.#create(type);
    }

    Logger.info(`Booted container "${this.#name}"`);

    for (const type of this.#types.values()) {
      if (!type.instance) {
        continue;
      }
      if ((<OnModuleInit> type.instance).onModuleInit) {
        (<OnModuleInit> type.instance).onModuleInit();
      }
    }

    for (const linked of this.#linkedContainers.values()) {
      if (!linked.isBooted) {
        linked.boot();
      }
    }

    Logger.debug(`Calling post module init hook`);
    this.#hookManager.execute({
      application: this.#application,
      container: this,
      scope: 'post',
    });
  }

  #addType(type: EmptyConstructorType, provider: boolean): void {
    if (this.#isBooted) {
      throw new Error(`Cannot add type after container is booted`);
    }
    const identifier = type.name;
    if (this.#types.has(identifier)) {
      throw new Error(
        `Cannot register already registered type ${identifier}`,
      );
    }
    this.#types.set(identifier, {
      exported: false,
      props: StaticMetadata.getMetadata(type.prototype, 'PROPS') ?? [],
      provider: provider,
      type: type,
    });
  }

  #resolveLinkedContainer(
    containerOrReference: Container | Reference<Container>,
  ): void {
    let container: Container;
    if ((<Reference<Container>> containerOrReference).forwardRef) {
      container = (<Reference<Container>> containerOrReference).forwardRef();
    } else {
      container = <Container> containerOrReference;
    }

    const identifier = container.name;
    if (this.#linkedContainers.has(identifier)) {
      throw new Error(`Cannot link ${identifier} more than once.`);
    }
    this.#linkedContainers.set(identifier, container);
    /*Logger.debug(
      `Container ${this.#name} is now linked with container ${container.name}`,
    );*/
  }

  #hook(instance: ClassType): void {
    const hooks: Map<HookFilter, Array<HookFunction>> =
      StaticMetadata.getMetadata(instance, 'HOOKS') ?? new Map();
    for (const [filters, functions] of hooks.entries()) {
      for (const fn of functions) {
        //TODO(@DreamTexX): Debug logs
        //TODO(@DreamTexX): Testing!!!! (lambda call testing, is instance available as this?)
        this.#hookManager.subscribe(filters, (data) => fn.call(instance, data));
      }
    }
  }

  #create(type: EmptyConstructorType | string): void {
    const identifier = typeof type === 'string' ? type : type.name;
    const resolved = this.#types.get(identifier);
    if (!resolved || resolved.instance) {
      return;
    }

    Logger.debug(`Calling pre provider/consumer init hook`);
    this.#hookManager.execute({
      application: this.#application,
      container: this,
      kind: resolved.provider ? 'provider' : 'consumer',
      scope: 'pre',
      type: resolved.type,
      typeData: resolved,
    });

    const clazz = resolved.type;
    const instance = new clazz();

    this.#hook(instance);

    resolved.instance = instance;
    this.#inject(instance, resolved.props);

    Logger.debug(`Calling post provider/consumer init hook`);
    this.#hookManager.execute({
      application: this.#application,
      container: this,
      kind: resolved.provider ? 'provider' : 'consumer',
      scope: 'post',
      type: resolved.type,
      typeData: resolved,
    });
  }

  #resolve<T>(type: EmptyConstructorType | string): T {
    const identifier = typeof type === 'string' ? type : type.name;
    const resolved = this.#types.get(identifier);

    if (!resolved) {
      for (const container of this.#linkedContainers.values()) {
        if (!container.isBooted) {
          container.boot();
        }
        if (container.has(type)) {
          if (container.exports(type)) {
            return container.resolve<T>(type as EmptyConstructorType<T>);
          } else {
            throw new Error(
              `${container.name} does not exports ${identifier}, but it is required by ${this.name}`,
            );
          }
        }
      }

      throw new Error(
        `${identifier} could not be resolved, it was not found. Is it registered?`,
      );
    }

    if (!resolved.provider) {
      throw new Error(
        `${identifier} is not marked as provider, only providers can be resolved`,
      );
    }

    if (resolved.instance) {
      return resolved.instance as T;
    }

    /*Logger.debug(
      `Resolving injectable ${identifier} @ container ${this.#name}`,
    );*/

    this.#create(type);
    return resolved.instance! as T;
  }

  #inject(instance: ClassType, props: InstanceProperty[]): void {
    for (const prop of props) {
      let value: ConstructorType | string;
      if ((<Reference> prop.type).forwardRef) {
        value = (<Reference> prop.type).forwardRef();
      } else {
        value = prop.type as ConstructorType | string;
      }
      (<Indexable<ClassType>> instance)[prop.identifier] = this
        .#resolve(
          value,
        );
    }
  }
}

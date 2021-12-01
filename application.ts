import { Container } from './container.ts';
import { METADATA_KEY_MODULE } from './decorators/module.decorator.ts';
import { HookType } from './enums/hook.enum.ts';
import { forwardRef } from './helpers/forward-ref.ts';
import { Logger } from './helpers/logger.ts';
import { HookManager } from './hook-manager.ts';
import { HookFunctions } from './interfaces/hook-functions.interface.ts';
import { ModuleOptions } from './interfaces/module-options.ts';
import { Reference } from './interfaces/reference.ts';
import { StaticMetadata } from './metadata.ts';
import { EmptyConstructorType } from './types.ts';

//TODO(@DreamTexX): Add Test-Cases

export class Application {
  readonly #containers: Map<string, Container>;
  readonly #rootContainer: Container;
  readonly #hookManager: HookManager;

  constructor(rootModule: EmptyConstructorType) {
    this.#containers = new Map();
    this.#hookManager = new HookManager();
    this.#rootContainer = this.#resolveContainer(rootModule);
  }

  public hook<T extends HookType>(type: T, fn: HookFunctions[T]): void {
    if (!this.#rootContainer.isBooted) {
      if (type === HookType.PostApplicationInit) {
        // this.#hookManager.hook(type, fn);
      } else {
        for (const [_, container] of this.#containers.entries()) {
          container.hook(type, fn);
        }
      }
    } else {
      Logger.warning('Cannot add hooks after application is booted');
    }
  }

  public boot(): boolean {
    if (this.#rootContainer.isBooted) {
      Logger.warning('Application is already booted');
      return false;
    }
    this.#rootContainer.boot();
    // this.#hookManager.call(HookType.PostApplicationInit, this);
    return true;
  }

  #resolveContainer(type: EmptyConstructorType): Container {
    const identifier = type.name;
    return this.#containers.get(identifier) ?? this.#createContainer(type);
  }

  #createContainer(type: EmptyConstructorType): Container {
    const options: ModuleOptions =
      StaticMetadata.getMetadata<ModuleOptions>(type, METADATA_KEY_MODULE) ??
        {};
    const container = new Container(type.name);

    for (const provider of options.providers ?? []) {
      container.provider(provider);
    }

    for (const exported of options.exports ?? []) {
      container.export(exported);
    }

    for (const imported of options.imports ?? []) {
      if ((<Reference> imported).forwardRef) {
        container.link(
          forwardRef(() =>
            this.#resolveContainer((<Reference> imported).forwardRef())
          ),
        );
      } else {
        container.link(
          this.#resolveContainer(<EmptyConstructorType> imported),
        );
      }
    }
    for (const controller of options.consumers ?? []) {
      container.consumer(controller);
    }

    this.#containers.set(type.name, container);
    return container;
  }
}

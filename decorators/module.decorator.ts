import { ModuleOptions } from "../interfaces/module-options.ts";
import { StaticMetadata } from "../metadata.ts";
import { ConstructorType, TypedClassDecorator } from "../types.ts";
import { Reference } from "../interfaces/reference.ts";
import { Container } from "../container.ts";
import { forwardRef } from "../helpers/forward-ref.ts";

export function Module(
  options: ModuleOptions,
): TypedClassDecorator {
  return function (target: ConstructorType): void {
    const container = new Container(target.name);
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
            StaticMetadata.getMetadata<Container>(
              (<Reference> imported).forwardRef(),
              "CONTAINER",
            )!
          ),
        );
      } else {
        container.link(
          StaticMetadata.getMetadata<Container>(imported, "CONTAINER")!,
        );
      }
    }
    for (const controller of options.consumers ?? []) {
      container.consumer(controller);
    }

    StaticMetadata.defineMetadata(target, "CONTAINER", container);
  };
}

import { Container } from "../container.ts";
import { EmptyConstructorType } from "../types.ts";
import { StaticMetadata } from "../metadata.ts";
import { Logger } from "./logger.ts";

export function createApplication(
  type: EmptyConstructorType,
): Container | undefined {
  Logger.info("Booting Application");
  try {
    const container = StaticMetadata.getMetadata<Container>(type, "CONTAINER");
    if (!container) {
      Logger.critical(
        `${type.name} does not seem to be a module`,
        new Error(`${type.name} does not seem to be a module`),
      );
      return undefined;
    }
    container.boot();
    Logger.info("Application started");
    return container;
  } catch (err) {
    Logger.critical(err.message, err);
  }
  return undefined;
}

import { createApplication, Logger, Module } from "../mod.ts";
import { TestA } from "./test-a/test-a.module.ts";
import { TestB } from "./test-b/test-b.module.ts";

@Module({
  imports: [TestA, TestB],
})
export class AppModule {}

createApplication(AppModule);

Logger.debug("This is a debug");
Logger.info("This is a info");
Logger.warning("This is a warning");
Logger.error("This is a error");
Logger.critical("This is a critical");

import { Inject, Logger, OnModuleInit } from "../../mod.ts";
import { TestAService } from "./test-a.service.ts";

export class TestAConsumer implements OnModuleInit {
  @Inject(TestAService)
  testAService!: TestAService;

  onModuleInit(): void {
    Logger.info(`Fibonacci Number of 10 is ${this.testAService.fibonacci(10)}`);
  }
}

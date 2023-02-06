import { Inject, Logger, PostModuleInit } from '../../../mod.ts';
import { TestAService } from './test-a.service.ts';

export class TestAConsumer {
  @Inject(TestAService)
  testAService!: TestAService;

  @PostModuleInit()
  onModuleInit(): void {
    Logger.info(`Fibonacci Number of 10 is ${this.testAService.fibonacci(10)}`);
  }
}

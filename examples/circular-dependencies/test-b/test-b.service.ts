import { forwardRef, Inject, Logger, PostModuleInit } from '../../../mod.ts';
import { TestAService } from '../test-a/test-a.service.ts';

export class TestBService {
  @Inject(forwardRef(() => TestAService))
  testAService!: TestAService;

  @PostModuleInit()
  onModuleInit(): void {
    Logger.info(
      `Test B Service is up and running. Fibonacci Number of 5 is ${
        this.testAService.fibonacci(5)
      }`,
    );
  }
}

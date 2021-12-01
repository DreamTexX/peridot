import { forwardRef, Inject, Logger, OnModuleInit } from '../../mod.ts';
import { TestAService } from '../test-a/test-a.service.ts';

export class TestBService implements OnModuleInit {
  @Inject(forwardRef(() => TestAService))
  testAService!: TestAService;

  onModuleInit(): void {
    Logger.info(
      `Test B Service is up and running. Fibonacci Number of 5 is ${
        this.testAService.fibonacci(5)
      }`,
    );
  }
}

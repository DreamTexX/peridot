import {
  forwardRef,
  Hook,
  HookType,
  Inject,
  Logger,
  OnModuleInit,
} from '../../mod.ts';
import { TestBService } from '../test-b/test-b.service.ts';

export class TestAService implements OnModuleInit {
  @Inject(forwardRef(() => TestBService))
  testBService!: TestBService;

  public fibonacci(num: number): number {
    if (num === 0) {
      return 0;
    }
    if (num === 1) {
      return 1;
    }
    return this.fibonacci(num - 1) + this.fibonacci(num - 2);
  }

  @Hook(HookType.PostProviderInit)
  test(): void {
    console.log(this.testBService);
  }

  onModuleInit(): void {
    Logger.info('Test A Service is up and running');
  }
}

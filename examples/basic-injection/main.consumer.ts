import { Inject, Logger, PostModuleInit } from '../../mod.ts';
import { MathService } from './math/math.service.ts';

export class MainConsumer {
  @Inject(MathService)
  aService!: MathService;

  @PostModuleInit()
  onModuleInit(): void {
    Logger.info('5 + 10 =', this.aService.add(5, 10));
  }
}

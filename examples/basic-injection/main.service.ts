import { Inject, Logger, OnModuleInit } from '../../mod.ts';
import { MathService } from './math/math.service.ts';

export class MainService implements OnModuleInit {
  @Inject(MathService)
  aService!: MathService;

  onModuleInit(): void {
    Logger.info('5 + 10 =', this.aService.add(5, 10));
  }
}

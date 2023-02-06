import { Inject, Logger, PostModuleInit } from '../../../mod.ts';
import { MathService } from '../math/math.service.ts';

export class BConsumer {
  @Inject(MathService)
  mathService!: MathService;

  @PostModuleInit()
  public onModuleInit(): void {
    Logger.info('Now at consumer b');
    this.mathService.countUp();
    this.mathService.printCount();
  }
}

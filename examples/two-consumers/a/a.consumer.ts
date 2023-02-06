import { Inject, Logger, PostModuleInit } from '../../../mod.ts';
import { MathService } from '../math/math.service.ts';

export class AConsumer {
  @Inject(MathService)
  mathService!: MathService;

  @PostModuleInit()
  public onModuleInit(): void {
    Logger.info('Now at consumer a');
    this.mathService.countUp();
    this.mathService.printCount();
  }
}

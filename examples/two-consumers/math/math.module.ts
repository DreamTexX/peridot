import { Module } from '../../../mod.ts';
import { MathService } from './math.service.ts';

@Module({
  providers: [MathService],
  exports: [MathService],
})
export class MathModule {}

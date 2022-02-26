import { Module } from '../../../mod.ts';
import { MathModule } from '../math/math.module.ts';
import { AConsumer } from './a.consumer.ts';

@Module({
  consumers: [AConsumer],
  imports: [MathModule],
})
export class AModule {}

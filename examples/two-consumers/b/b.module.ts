import { Module } from '../../../mod.ts';
import { MathModule } from '../math/math.module.ts';
import { BConsumer } from './b.consumer.ts';

@Module({
  consumers: [BConsumer],
  imports: [MathModule],
})
export class BModule {}

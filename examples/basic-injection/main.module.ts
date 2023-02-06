import { Module } from '../../mod.ts';
import { MainConsumer } from './main.consumer.ts';
import { MathModule } from './math/math.module.ts';

@Module({
  imports: [MathModule],
  consumers: [MainConsumer],
})
export class MainModule {}

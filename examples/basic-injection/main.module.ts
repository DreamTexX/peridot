import { Module } from '../../mod.ts';
import { MainService } from './main.service.ts';
import { MathModule } from './math/math.module.ts';

@Module({
  imports: [MathModule],
  providers: [MainService],
})
export class MainModule {}

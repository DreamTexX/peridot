import { Module } from '../../mod.ts';
import { AModule } from './a/a.module.ts';
import { BModule } from './b/b.module.ts';

@Module({
  imports: [AModule, BModule],
})
export class MainModule {
}

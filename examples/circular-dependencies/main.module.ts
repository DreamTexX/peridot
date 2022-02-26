import { Module } from '../../mod.ts';
import { TestA } from './test-a/test-a.module.ts';
import { TestB } from './test-b/test-b.module.ts';

@Module({
  imports: [TestA, TestB],
})
export class MainModule {}

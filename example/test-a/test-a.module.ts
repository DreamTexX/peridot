import { forwardRef, Module } from '../../mod.ts';
import { TestAService } from './test-a.service.ts';
import { TestB } from '../test-b/test-b.module.ts';
import { TestAConsumer } from './test-a.consumer.ts';

@Module({
  providers: [TestAService],
  exports: [TestAService],
  consumers: [TestAConsumer],
  imports: [forwardRef(() => TestB)],
})
export class TestA {}

import { StaticMetadata } from '../metadata.ts';
import { Hook } from './hook.decorator.ts';
import {
  assertEquals,
  assertExists,
} from '../vendor/https/deno.land/std/testing/asserts.ts';
import { HookFilter } from '../interfaces/mod.ts';

Deno.test('hook decorator setting metadata', () => {
  StaticMetadata.clear();
  class Test {
    static filter = {
      application: '*',
      container: '*',
      scope: 'post',
      type: Test,
    } as HookFilter;

    @Hook(Test.filter)
    public onModuleInit(): void {}
  }
  const hooks = StaticMetadata.get<Map<HookFilter, Array<unknown>>>(
    'HOOKS',
    Test.prototype,
  );
  assertExists(hooks);
  assertExists(hooks.get(Test.filter));
  assertEquals(hooks.get(Test.filter)?.length, 1);
  assertEquals(hooks.get(Test.filter)?.[0], Test.prototype.onModuleInit);
});

Deno.test('hook decorator appending to existing filters', () => {
  StaticMetadata.clear();
  class Test {
    static filter = {
      application: '*',
      container: '*',
      scope: 'post',
      type: Test,
    } as HookFilter;

    @Hook(Test.filter)
    public onModuleInit1(): void {}

    @Hook(Test.filter)
    public async onModuleInit2(): Promise<void> {}
  }
  const hooks = StaticMetadata.get<Map<HookFilter, Array<unknown>>>(
    'HOOKS',
    Test.prototype,
  );
  assertExists(hooks);
  assertExists(hooks.get(Test.filter));
  assertEquals(hooks.get(Test.filter)?.length, 2);
  assertEquals(
    hooks.get(Test.filter)?.some((type) =>
      type === Test.prototype.onModuleInit1
    ),
    true,
  );
  assertEquals(
    hooks.get(Test.filter)?.some((type) =>
      type === Test.prototype.onModuleInit2
    ),
    true,
  );
});

Deno.test('hook decorator appends multiple hooks', () => {
  //TODO(@DreamTexX): Make this test
});

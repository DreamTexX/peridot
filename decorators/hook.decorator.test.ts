import { StaticMetadata } from '../metadata.ts';
import { Hook } from './hook.decorator.ts';
import {
  assertEquals,
  assertExists,
  fail,
} from '../vendor/https/deno.land/std/testing/asserts.ts';
import { HookData, HookFilter } from '../interfaces/mod.ts';
import { Application, Module } from '../mod.ts';

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
    public onTestInit(): void {}
  }
  const hooks = StaticMetadata.get<Map<HookFilter, Array<unknown>>>(
    'HOOKS',
    Test.prototype,
  );
  assertExists(hooks);
  assertExists(hooks.get(Test.filter));
  assertEquals(hooks.get(Test.filter)?.length, 1);
  assertEquals(hooks.get(Test.filter)?.[0], Test.prototype.onTestInit);
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
    public onTestInit(): void {}

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
    hooks.get(Test.filter)?.some((type) => type === Test.prototype.onTestInit),
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

Deno.test('hook decorator target functions gets called', async () => {
  let promiseResolver: (value: string) => void;
  const promise = new Promise<string>((resolver) => promiseResolver = resolver);

  class TestConsumer {
    private test: string;

    constructor() {
      this.test = 'lorem ipsum';
    }

    @Hook({
      application: '*',
      module: 'this',
      scope: 'post',
      type: TestConsumer,
    })
    public postTestInit(data: HookData): void {
      assertExists(data);
      promiseResolver(this.test);
    }
  }

  @Module({
    consumers: [TestConsumer],
  })
  class TestModule {}

  new Application(TestModule).boot();

  const t = setTimeout(fail, 1000);
  assertEquals(await promise, 'lorem ipsum');
  clearTimeout(t);
});

Deno.test('hook decorator multiple targets functions gets called', async () => {
});

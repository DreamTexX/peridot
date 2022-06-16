import {
  assertEquals
} from './vendor/https/deno.land/std/testing/asserts.ts';import { MainModule as BasicInjectionModule } from './examples/basic-injection/main.module.ts';
import { MainModule as CircularDependenciesModule } from './examples/circular-dependencies/main.module.ts';
import { MainModule as TwoConsumersModule } from './examples/two-consumers/main.module.ts';
import { Application } from './mod.ts';

Deno.bench('empty application', async () => {
  const app = new Application(class SomeModule {});
  let resolver: (value: boolean) => void;
  const promise = new Promise<boolean>(r => resolver = r);
  app.hook({application: app, scope: "post"}, () => {
    resolver(true)
  });
  app.boot();
  assertEquals(await promise, true);
});
Deno.bench('basic injections', () => {
  new Application(BasicInjectionModule).boot();
});
Deno.bench('circular dependencies', () => {
  new Application(CircularDependenciesModule).boot();
});
Deno.bench('two consumers', () => {
  new Application(TwoConsumersModule).boot();
});

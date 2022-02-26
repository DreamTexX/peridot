import {
  format,
  sync,
} from 'https://gist.githubusercontent.com/evanwashere/7ee592870e46f80405b9776dcd56e1e8/raw/1abb85cb294831b6f3a9873965a4ded65faa3852/bench.js';
import { MainModule as BasicInjectionModule } from './examples/basic-injection/main.module.ts';
import { MainModule as CircularDependenciesModule } from './examples/circular-dependencies/main.module.ts';
import { MainModule as DualConsumersModule } from './examples/dual-consumers/main.module.ts';
import { Application } from './mod.ts';

console.log(format({
  title: 'Examples Benchmarks',
  locale: 'de-de',
  results: {
    'empty application': sync(1e6, function (): void {
      new Application(class SomeModule {}).boot();
    }),
    'basic injections': sync(1e6, function (): void {
      new Application(BasicInjectionModule).boot();
    }),
    'circular dependencies': sync(1e6, function (): void {
      new Application(CircularDependenciesModule).boot();
    }),
    'dual consumers': sync(1e6, function(): void {
      new Application(DualConsumersModule).boot();
    })
  },
}));

import {
  Application,
  Container,
  HookType,
  Logger,
  Module,
  TypeData,
} from '../mod.ts';
import { TestA } from './test-a/test-a.module.ts';
import { TestB } from './test-b/test-b.module.ts';

@Module({
  imports: [TestA, TestB],
})
export class AppModule {}

const app = new Application(AppModule);
app.hook(HookType.PostConsumerInit, (container: Container, data: TypeData) => {
  console.log(
    'Consumer initiated:',
    data.instance,
    '| Current container:',
    container.name,
  );
});
app.boot();

Logger.debug('This is a debug');
Logger.info('This is a info');
Logger.warning('This is a warning');
Logger.error('This is a error');
Logger.critical('This is a critical');

const app2 = new Application(AppModule);
app2.boot();

import { Application, Logger } from '../../mod.ts';
import { MainModule } from './main.module.ts';
import { TestBService } from './test-b/test-b.service.ts';

const app = new Application(MainModule);
app.hook({ application: app, scope: 'post' }, (data) => {
  Logger.info('Application is ready!', data);
});
app.hook(
  { application: '*', scope: '*', container: '*', type: TestBService },
  (data) => {
    Logger.critical('Test A Service Action:', data);
  },
);
app.boot();

Logger.debug('This is a debug');
Logger.info('This is a info');
Logger.warning('This is a warning');
Logger.error('This is a error');
Logger.critical('This is a critical');

// const app2 = new Application(AppModule);
// app2.boot();

Logger.info(Symbol.for('design:type'));

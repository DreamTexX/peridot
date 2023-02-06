import { Application, Logger } from '../../mod.ts';
import { MainModule } from './main.module.ts';

const app = new Application(MainModule);
app.hook({ application: app, scope: 'post' }, (data) => {
  Logger.info('Application is ready!', data);
});
app.boot();
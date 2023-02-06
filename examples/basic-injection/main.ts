import { Application } from '../../mod.ts';
import { MainModule } from './main.module.ts';

const app: Application = new Application(MainModule);
app.boot();
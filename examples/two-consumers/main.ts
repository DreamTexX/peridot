import { Application } from '../../mod.ts';
import { MainModule } from './main.module.ts';

const app = new Application(MainModule);
app.boot();

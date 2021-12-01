import { Application } from '../application.ts';
import { Container } from '../container.ts';
import { TypeData } from './type-data.ts';

export interface HookData {
  application?: Application;
  container?: Container;
  typeData?: TypeData;
}

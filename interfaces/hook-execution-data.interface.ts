import { Application } from '../application.ts';
import { Container } from '../container.ts';
import { EmptyConstructorType } from '../types.ts';

export interface HookExecutionData {
  application?: Application;
  container?: Container;
  type?: EmptyConstructorType;
  kind?: 'provider' | 'consumer';
  scope: 'pre' | 'post';
}

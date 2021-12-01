import { Application } from '../application.ts';
import { Container } from '../container.ts';
import { EmptyConstructorType } from '../types.ts';

export interface HookSubscriptionFilter {
  application?: Application;
  container?: Container;
  type?: EmptyConstructorType | 'provider' | 'consumer';
  scope?: 'pre' | 'post';
}

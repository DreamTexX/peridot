/*import { Application } from '../application.ts';
import { Container } from '../container.ts';
import { HookType } from '../enums/hook.enum.ts';
import { TypeData } from './type-data.ts';

export type EmptyHookFn = () => void;
export type PreModuleInitFn = (container: Container) => void;
export type PostModuleInitFn = (container: Container) => void;
export type PreConsumerInitFn = (container: Container, data: TypeData) => void;
export type PostConsumerInitFn = (container: Container, data: TypeData) => void;
export type PreProviderInitFn = (container: Container, data: TypeData) => void;
export type PostProviderInitFn = (container: Container, data: TypeData) => void;
export type PostApplicationInitFn = (application: Application) => void;

export type AnyHookFunction =
  | PreModuleInitFn
  | PostModuleInitFn
  | PreConsumerInitFn
  | PostConsumerInitFn
  | PreProviderInitFn
  | PostProviderInitFn
  | PostApplicationInitFn;

export interface HookFunctions {
  [HookType.PreModuleInit]: PreModuleInitFn | EmptyHookFn;
  [HookType.PostModuleInit]: PostModuleInitFn | EmptyHookFn;
  [HookType.PreConsumerInit]: PreConsumerInitFn | EmptyHookFn;
  [HookType.PostConsumerInit]: PostConsumerInitFn | EmptyHookFn;
  [HookType.PreProviderInit]: PreProviderInitFn | EmptyHookFn;
  [HookType.PostProviderInit]: PostProviderInitFn | EmptyHookFn;
  [HookType.PostApplicationInit]: PostApplicationInitFn | EmptyHookFn;
}
*/

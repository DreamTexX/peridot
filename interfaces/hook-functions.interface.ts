import { Container } from "../container.ts";
import { HookType } from "../enums/hook.enum.ts";
import { TypeData } from "./type-data.ts";

export type PreModuleInitFn = (container: Container) => void;
export type PostModuleInitFn = (container: Container) => void;
export type PreConsumerInitFn = (container: Container, data: TypeData) => void;
export type PostConsumerInitFn = (container: Container, data: TypeData) => void;
export type PreProviderInitFn = (container: Container, data: TypeData) => void;
export type PostProviderInitFn = (container: Container, data: TypeData) => void;
export type PreApplicationInitFn = () => void;
export type PostApplicationInitFn = () => void;

export type AnyHookFunction =
  | PreModuleInitFn
  | PostModuleInitFn
  | PreConsumerInitFn
  | PostConsumerInitFn
  | PreProviderInitFn
  | PostProviderInitFn
  | PreApplicationInitFn
  | PostApplicationInitFn;

export interface HookFunctions {
  [HookType.PreModuleInit]: PreModuleInitFn;
  [HookType.PostModuleInit]: PostModuleInitFn;
  [HookType.PreConsumerInit]: PreConsumerInitFn;
  [HookType.PostConsumerInit]: PostConsumerInitFn;
  [HookType.PreProviderInit]: PreProviderInitFn;
  [HookType.PostProviderInit]: PostProviderInitFn;
  [HookType.PreApplicationInit]: PreApplicationInitFn;
  [HookType.PostApplicationInit]: PostApplicationInitFn;
}

import { EmptyConstructorType } from '../types.ts';
import { Reference } from './reference.ts';

export interface ModuleOptions {
  providers?: Array<EmptyConstructorType>;
  consumers?: Array<EmptyConstructorType>;
  exports?: Array<EmptyConstructorType>;
  imports?: Array<EmptyConstructorType | Reference>;
}

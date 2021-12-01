import { ClassType, EmptyConstructorType } from '../types.ts';
import { InstanceProperty } from './instance-property.ts';

export interface TypeData {
  type: EmptyConstructorType;
  instance?: ClassType;
  exported: boolean;
  provider: boolean;
  props: Array<InstanceProperty>;
}

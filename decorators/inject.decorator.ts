import {
  ClassType,
  ConstructorType,
  TypedPropertyDecorator,
} from '../types.ts';
import { StaticMetadata } from '../metadata.ts';
import { InstanceProperty } from '../interfaces/instance-property.ts';
import { Reference } from '../interfaces/reference.ts';

export function Inject(
  type: ConstructorType | string | Reference,
): TypedPropertyDecorator {
  return function (target: ClassType, property: string): void {
    const props: Array<InstanceProperty> =
      StaticMetadata.getMetadata(target, 'PROPS') || [];
    props.push({
      identifier: property,
      type: type,
    });
    StaticMetadata.defineMetadata(target, 'PROPS', props);
  };
}

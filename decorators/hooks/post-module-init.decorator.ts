import { ClassType, TypedMethodDecorator } from '../../mod.ts';
import { Hook } from '../mod.ts';

export function PostModuleInit(): TypedMethodDecorator {
  return function (
    type: ClassType,
    property: string,
    propertyDescriptor: PropertyDescriptor,
  ): void {
    Hook({
      application: '*',
      module: 'this',
      scope: 'post',
    })(type, property, propertyDescriptor);
  };
}

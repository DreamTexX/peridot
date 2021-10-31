import { ConstructorType } from "../types.ts";
import { Reference } from "./reference.ts";

export interface InstanceProperty {
  identifier: string | number;
  type: ConstructorType | string | Reference;
}

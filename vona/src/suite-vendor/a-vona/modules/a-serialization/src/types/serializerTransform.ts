import type { OmitNever, VonaContext } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

export interface ISerializerTransformRecord {}

export interface ISerializerTransform<VALUE = unknown, DATA = unknown, RESULT = VALUE> {
  transform(
    value: VALUE,
    data: DATA,
    options: IDecoratorSerializerTransformOptions,
  ): Promise<RESULT>;
}

export type TypeSerializerTransformGetter = (this: VonaContext, data: any, value: any) => any;
export type TypeSerializerTransformFilter = (
  this: VonaContext,
  value: any,
  data: any,
  options: IDecoratorSerializerTransformOptions,
) => Promise<boolean> | boolean;
export type TypeSerializerTransformCustom = (
  this: VonaContext,
  value: any,
  data: any,
  options: IDecoratorSerializerTransformOptions,
) => Promise<any> | any;

export interface IDecoratorSerializerTransformOptions {
  filter?: TypeSerializerTransformFilter;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    serializerTransform: ServiceOnion<ISerializerTransformRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    serializerTransform: OmitNever<ISerializerTransformRecord>;
  }

  export interface IBeanSceneRecord {
    serializerTransform: never;
  }
}

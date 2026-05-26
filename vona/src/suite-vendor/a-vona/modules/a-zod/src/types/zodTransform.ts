import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

export interface IZodTransformRecord {}

export interface IZodTransformExecute<T = unknown, R = T> {
  execute(value: T, options: IDecoratorZodTransformOptions): Promise<R>;
}

export interface IDecoratorZodTransformOptions {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    zodTransform: ServiceOnion<IZodTransformRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    zodTransform: OmitNever<IZodTransformRecord>;
  }

  export interface IBeanSceneRecord {
    zodTransform: never;
  }
}

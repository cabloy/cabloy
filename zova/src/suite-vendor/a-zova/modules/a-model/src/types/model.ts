import type { OmitNever } from 'zova';
import type { ServiceOnion } from 'zova-module-a-bean';

export interface IModelRecord {}

export interface IDecoratorModelOptions {
  enableSelector?: boolean;
}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    model: ServiceOnion<IDecoratorModelOptions, keyof IModelRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    model: OmitNever<IModelRecord>;
  }

  export interface IBeanSceneRecord {
    model: never;
  }
}

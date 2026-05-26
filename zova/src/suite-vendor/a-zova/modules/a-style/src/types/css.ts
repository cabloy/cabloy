import type { OmitNever } from 'zova';
import type { ServiceOnion } from 'zova-module-a-bean';

export interface ICssRecord {}

export interface IDecoratorCssOptions {}

declare module 'zova-module-a-bean' {
  export interface SysOnion {
    css: ServiceOnion<IDecoratorCssOptions, keyof ICssRecord>;
  }
}

declare module 'zova' {
  export interface ConfigOnions {
    css: OmitNever<ICssRecord>;
  }

  export interface IBeanSceneRecord {
    css: never;
  }
}

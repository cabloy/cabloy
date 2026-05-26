import type { ServiceOnion } from 'vona-module-a-onion';

export type TypeEventOff = () => void;

export interface IEventRecord {}

export interface IDecoratorEventOptions {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    event: ServiceOnion<IEventRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    // event: OmitNever<IEventRecord>;
  }

  export interface IBeanSceneRecord {
    event: never;
  }
}

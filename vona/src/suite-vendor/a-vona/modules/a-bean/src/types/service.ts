import type { ServiceOnion } from 'vona-module-a-onion';

export interface IServiceRecord {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    service: ServiceOnion<IServiceRecord>;
  }
}

declare module 'vona' {
  export interface IBeanSceneRecord {
    service: never;
  }
}

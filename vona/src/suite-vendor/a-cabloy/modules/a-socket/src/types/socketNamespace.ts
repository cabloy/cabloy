import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

export interface ISocketNamespaceRecord {
  '/': never;
}

export interface IDecoratorSocketNamespaceOptions<Events extends {} = {}> {
  namespace: keyof ISocketNamespaceRecord;
  events: Events;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    socketNamespace: ServiceOnion<ISocketNamespaceRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    socketNamespace: OmitNever<ISocketNamespaceRecord>;
  }

  export interface IBeanSceneRecord {
    socketNamespace: never;
  }
}

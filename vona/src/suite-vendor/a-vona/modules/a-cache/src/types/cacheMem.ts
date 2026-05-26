import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

export type TypeBroadcastOnSet = boolean | 'del';

export interface ICacheMemRecord {}

export interface IDecoratorCacheMemOptionsBase {
  max?: number;
  ttl?: number;
  updateAgeOnGet?: boolean;
  updateAgeOnHas?: boolean;
  broadcastOnSet?: TypeBroadcastOnSet;
  disableInstance?: boolean;
  disableTransactionCompensate?: boolean;
}
export interface IDecoratorCacheMemOptions
  extends IDecoratorCacheMemOptionsBase, TypeOnionOptionsEnableSimple {}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    cacheMem: ServiceOnion<ICacheMemRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    cacheMem: OmitNever<ICacheMemRecord>;
  }

  export interface IBeanSceneRecord {
    cacheMem: never;
  }
}

import type { OmitNever } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import type { IPayProviderRecord } from './payProvider.ts';

export interface IPaySceneRecord {}

export interface IDecoratorPaySceneOptions {
  providers?: readonly (keyof IPayProviderRecord)[];
  currencies?: readonly string[];
  captureMode?: 'automatic' | 'manual';
  sessionExpiresIn?: number;
  refund?: {
    enabled?: boolean;
    allowPartial?: boolean;
  };
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    payScene: ServiceOnion<IPaySceneRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    payScene: OmitNever<IPaySceneRecord>;
  }

  export interface IBeanSceneRecord {
    payScene: never;
  }
}

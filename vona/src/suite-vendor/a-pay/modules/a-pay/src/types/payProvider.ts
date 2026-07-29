import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { IPayProviderExecute } from './payment.ts';

export interface IPayProviderRecord {}

export interface IPayProviderClientRecord {
  default: never;
}

export interface IPayProviderClientOptions {
  environment: 'sandbox' | 'live';
  credentialRef: string;
  webhookSecretRef?: string;
  merchantReference?: string;
}

export interface IDecoratorPayProviderOptions<
  R extends IPayProviderClientRecord = IPayProviderClientRecord,
  T extends IPayProviderClientOptions = IPayProviderClientOptions,
> extends TypeOnionOptionsEnableSimple {
  base?: Partial<T>;
  clients?: { [K in keyof R]?: R[K] extends undefined ? T : R[K] };
}

export type TypePayProviderOptionsByName<N extends keyof IPayProviderRecord> =
  IPayProviderRecord[N];

export type TypePayProviderExecuteByName<N extends keyof IPayProviderRecord> =
  TypePayProviderOptionsByName<N> extends IDecoratorPayProviderOptions<any, any>
    ? IPayProviderExecute
    : never;

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    payProvider: ServiceOnion<IPayProviderRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    payProvider: OmitNever<IPayProviderRecord>;
  }

  export interface IBeanSceneRecord {
    payProvider: never;
  }
}

import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { IPayProviderExecute } from './payment.ts';

export interface IPayProviderRecord {}

export interface IPayProviderClientRecord {
  default: never;
}

export interface IPayProviderClientOptions {
  environment: 'sandbox' | 'live';
  secretCredential: unknown;
  secretWebhook?: unknown;
  merchantReference?: string;
}

export type TypePayProviderClientOptions<T> =
  T extends IDecoratorPayProviderOptions<any, infer O> ? O : never;

export type TypePayProviderClientName<T> =
  T extends IDecoratorPayProviderOptions<infer R, any> ? keyof R & string : never;

export interface IDecoratorPayProviderOptions<
  R extends IPayProviderClientRecord = IPayProviderClientRecord,
  T extends IPayProviderClientOptions = IPayProviderClientOptions,
> extends TypeOnionOptionsEnableSimple {
  base?: Partial<T>;
  clients?: { [K in keyof R]?: R[K] extends undefined ? T : R[K] };
}

export type TypePayProviderOptionsByName<N extends keyof IPayProviderRecord> =
  IPayProviderRecord[N];

export type TypePayProviderClientOptionsByName<N extends keyof IPayProviderRecord> =
  TypePayProviderOptionsByName<N> extends IDecoratorPayProviderOptions<any, any>
    ? TypePayProviderClientOptions<TypePayProviderOptionsByName<N>>
    : never;

export type TypePayProviderClientNameByName<N extends keyof IPayProviderRecord> =
  TypePayProviderOptionsByName<N> extends IDecoratorPayProviderOptions<any, any>
    ? TypePayProviderClientName<TypePayProviderOptionsByName<N>>
    : never;

export type TypePayProviderExecuteByName<N extends keyof IPayProviderRecord> =
  TypePayProviderOptionsByName<N> extends IDecoratorPayProviderOptions<any, any>
    ? IPayProviderExecute<TypePayProviderClientOptionsByName<N>>
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

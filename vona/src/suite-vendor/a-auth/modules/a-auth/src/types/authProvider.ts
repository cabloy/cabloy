import type { Constructable, OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';
import type { IAuthTokenOptions, IAuthUserProfile } from 'vona-module-a-user';

import type { EntityAuthProvider } from '../entity/authProvider.ts';
import type { StrategyBase } from '../lib/strategyBase.ts';
import type { IAuthenticateStrategyState } from './auth.ts';

export type TypeAuthProviderPick = Partial<
  Pick<EntityAuthProvider, 'id' | 'providerName' | 'clientName'>
>;

export interface IAuthProviderRecord {}

export interface IAuthProviderClientRecord {
  default: never;
}

export interface IAuthProviderClientOptions {
  confirmed?: boolean;
  mockUsername?: string;
  mockProfileId?: string;
  authTokenOptions?: IAuthTokenOptions;
}

export interface IAuthProviderOauth2ClientOptions extends IAuthProviderClientOptions {
  clientID?: string;
  clientSecret?: string;
  scope?: string;
  authorizationURL?: string;
  tokenURL?: string;
  scopeSeparator?: string;
  customHeaders?: object;
}

export type TypeStrategyOptions<T extends IAuthProviderClientOptions = IAuthProviderClientOptions> =
  T & {
    callbackURL?: string;
    state?: string;
  };

export type TypeStrategyVerifyArgs = any[];
export type TypeStrategyOauth2VerifyArgs<T = IAuthUserProfile> = [
  accessToken: string,
  refreshToken: string,
  profile: T,
];

export interface IDecoratorAuthProviderOptions<
  R extends IAuthProviderClientRecord = IAuthProviderClientRecord,
  T extends IAuthProviderClientOptions = IAuthProviderClientOptions,
> extends TypeOnionOptionsEnableSimple {
  base?: T;
  clients?: { [prop in keyof R]?: R[prop] extends undefined ? T : R[prop] }; // Record<K, T>;
  useMockForDev?: boolean;
}

export interface IAuthProviderStrategy {
  strategy(
    clientOptions: IAuthProviderClientOptions,
    options: IDecoratorAuthProviderOptions,
  ): Promise<Constructable<StrategyBase>>;
}

export interface IAuthProviderVerify {
  verify(
    args: TypeStrategyVerifyArgs,
    clientOptions: IAuthProviderClientOptions,
    options: IDecoratorAuthProviderOptions,
    state?: IAuthenticateStrategyState,
  ): Promise<IAuthUserProfile>;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    authProvider: ServiceOnion<IAuthProviderRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    authProvider: OmitNever<IAuthProviderRecord>;
  }

  export interface IBeanSceneRecord {
    authProvider: never;
  }
}

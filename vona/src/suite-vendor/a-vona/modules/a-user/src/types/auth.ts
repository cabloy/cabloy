import type { TableIdentity } from 'table-identity';
import type { IAuthProviderRecord } from 'vona-module-a-auth';
import type { IServiceRecord } from 'vona-module-a-bean';

export interface IAuthIdRecord {
  '-1': 'dev';
  '-10000': 'mock';
}

export interface IAuthProvider {
  id: number;
  providerName: keyof IAuthProviderRecord;
  clientName: string;
}

export interface IAuth {
  id: TableIdentity;
  profileId?: string;
  authProviderId?: number;
  authProvider?: IAuthProvider;
}

export type TypeAuthTokenStrategy = 'reissue' | 'refresh' | 'reuse';

export interface IAuthTokenConfig {
  stateless: boolean;
  strategy: {
    refreshAuthToken: TypeAuthTokenStrategy;
    signin: TypeAuthTokenStrategy;
  };
  ttl: number;
}

export interface ConfigUser {
  user: {
    autoActivate: boolean;
  };
  authToken: IAuthTokenConfig;
  adapter: {
    authToken: keyof IServiceRecord;
    passport: keyof IServiceRecord;
    user: keyof IServiceRecord;
    role: keyof IServiceRecord;
  };
  payloadData: {
    fields: {
      authId: string;
      userId: string;
      token: string;
    };
  };
}

export interface IAuthTokenOptions {
  stateless?: boolean;
  strategy?: TypeAuthTokenStrategy;
  ttl?: number;
}

export interface ISigninOptions {
  authToken?: IAuthTokenOptions;
}

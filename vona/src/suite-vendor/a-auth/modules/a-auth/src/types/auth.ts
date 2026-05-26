import type { IInstanceRecord, ILocaleRecord, PowerPartial } from 'vona';

import type { IAuthProviderClientOptions, IDecoratorAuthProviderOptions } from './authProvider.ts';

export type TypeAuthenticateIntention = 'register' | 'login' | 'associate' | 'migrate';

export interface IAuthenticateState {
  intention?: TypeAuthenticateIntention;
  redirect?: string;
}

export interface IAuthenticateStrategyState extends IAuthenticateState {
  accessToken?: string;
  authProviderId: number;
  instanceName: keyof IInstanceRecord;
  locale: keyof ILocaleRecord;
  tz?: string;
  clientOptions?: IAuthProviderClientOptions;
}

export interface IAuthenticateOptions<
  T extends IDecoratorAuthProviderOptions = IDecoratorAuthProviderOptions,
  K extends keyof NonNullable<T['clients']> = keyof NonNullable<T['clients']>,
> {
  state?: IAuthenticateState;
  clientName?: K;
  clientOptions?: NonNullable<T['clients']>[K] extends undefined
    ? PowerPartial<T['base']>
    : PowerPartial<NonNullable<T['clients']>[K]>;
}

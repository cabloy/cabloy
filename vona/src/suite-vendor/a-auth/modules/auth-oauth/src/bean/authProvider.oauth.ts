import type { Constructable } from 'vona';
import type {
  IAuthProviderClientRecord,
  IAuthProviderOauth2ClientOptions,
  IDecoratorAuthProviderOptions,
  StrategyBase,
} from 'vona-module-a-auth';

import StrategyGithub from 'passport-github';
import { AuthProvider, BeanAuthProviderOauth2Base } from 'vona-module-a-auth';

export interface IAuthProviderOauthClientOptionsGithub extends IAuthProviderOauthClientOptions {
  userProfileURL?: string;
  userAgent?: string;
}

export interface IAuthProviderOauthClientRecord extends IAuthProviderClientRecord {
  github: IAuthProviderOauthClientOptionsGithub;
}

export interface IAuthProviderOauthClientOptions extends IAuthProviderOauth2ClientOptions {
  Strategy?: Constructable<StrategyBase>;
}

export interface IAuthProviderOptionsOauth extends IDecoratorAuthProviderOptions<
  IAuthProviderOauthClientRecord,
  IAuthProviderOauthClientOptions
> {}

@AuthProvider<IAuthProviderOptionsOauth>({
  base: {
    confirmed: true,
    clientID: 'Shoule specify clientID',
    clientSecret: 'Shoule specify clientSecret',
  },
  clients: {
    github: {
      Strategy: StrategyGithub,
    },
  },
})
export class AuthProviderOauth extends BeanAuthProviderOauth2Base {
  async strategy(
    clientOptions: IAuthProviderOauthClientOptions,
    _options: IAuthProviderOptionsOauth,
  ): Promise<Constructable<StrategyBase>> {
    if (!clientOptions.Strategy) throw new Error('Should specify Strategy for oauth provider');
    return clientOptions.Strategy;
  }
}

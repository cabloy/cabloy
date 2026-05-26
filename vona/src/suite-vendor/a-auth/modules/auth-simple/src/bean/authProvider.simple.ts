import type { ILocaleRecord } from 'vona';
import type {
  IAuthenticateStrategyState,
  IAuthProviderClientOptions,
  IAuthProviderClientRecord,
  IAuthProviderVerify,
  IDecoratorAuthProviderOptions,
  TypeStrategyVerifyArgs,
} from 'vona-module-a-auth';
import type { IAuthUserProfile } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { AuthProvider } from 'vona-module-a-auth';

export interface IAuthProviderSimpleClientRecord extends IAuthProviderClientRecord {}

export interface IAuthProviderSimpleClientOptions extends IAuthProviderClientOptions {
  username?: string;
  password?: string;
  email?: string;
  avatar?: string;
  locale?: keyof ILocaleRecord;
}

export interface IAuthProviderOptionsSimple extends IDecoratorAuthProviderOptions<
  IAuthProviderSimpleClientRecord,
  IAuthProviderSimpleClientOptions
> {}

@AuthProvider<IAuthProviderOptionsSimple>()
export class AuthProviderSimple extends BeanBase implements IAuthProviderVerify {
  async verify(
    _args: TypeStrategyVerifyArgs,
    clientOptions: IAuthProviderSimpleClientOptions,
    _options: IAuthProviderOptionsSimple,
    state?: IAuthenticateStrategyState,
  ): Promise<IAuthUserProfile> {
    if (state?.intention === 'register') {
      if (!clientOptions.username || !clientOptions.password) return this.app.throw(403);
      // authSimple: create
      const authSimple = await this.scope.service.authSimple.create(clientOptions.password);
      // profile
      const profile: IAuthUserProfile = {
        id: authSimple.id.toString(),
        username: clientOptions.username,
      };
      if (clientOptions.email) {
        profile.emails = [{ value: clientOptions.email }];
      }
      if (clientOptions.avatar) {
        profile.photos = [{ value: clientOptions.avatar }];
      }
      if (clientOptions.locale) {
        profile.locale = clientOptions.locale;
      }
      return profile;
    } else {
      if (!clientOptions.username || !clientOptions.password) return this.app.throw(401);
      // user
      const user = await this.bean.user.findOneByName(clientOptions.username);
      if (!user) return this.app.throw(401);
      // verify
      const profileId = await this.scope.service.authSimple.verifyPassword(
        user.id,
        clientOptions.password,
      );
      if (!profileId) return this.app.throw(401);
      // profile
      const profile: IAuthUserProfile = {
        id: profileId.toString(),
      };
      return profile;
    }
  }
}

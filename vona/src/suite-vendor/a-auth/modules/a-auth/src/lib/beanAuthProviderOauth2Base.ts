import type { Constructable } from 'vona';
import type { IAuthUserProfile } from 'vona-module-a-user';

import { BeanBase } from 'vona';

import type { IAuthenticateStrategyState } from '../types/auth.ts';
import type {
  IAuthProviderOauth2ClientOptions,
  IAuthProviderStrategy,
  IAuthProviderVerify,
  IDecoratorAuthProviderOptions,
  TypeStrategyOauth2VerifyArgs,
} from '../types/authProvider.ts';
import type { StrategyBase } from './strategyBase.ts';

import { getStrategyOauth2Profile } from './utils.ts';

export class BeanAuthProviderOauth2Base
  extends BeanBase
  implements IAuthProviderStrategy, IAuthProviderVerify
{
  async strategy(
    _clientOptions: IAuthProviderOauth2ClientOptions,
    _options: IDecoratorAuthProviderOptions,
  ): Promise<Constructable<StrategyBase>> {
    throw new Error('Not Implemented');
  }

  async verify(
    args: TypeStrategyOauth2VerifyArgs,
    _clientOptions: IAuthProviderOauth2ClientOptions,
    _options: IDecoratorAuthProviderOptions,
    _state?: IAuthenticateStrategyState,
  ): Promise<IAuthUserProfile> {
    return getStrategyOauth2Profile(args);
  }
}

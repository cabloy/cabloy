import { useApp, uuidv4 } from 'vona';
import { $apiPath } from 'vona-module-a-openapiutils';

import type {
  IAuthProviderOauth2ClientOptions,
  TypeStrategyOptions,
} from '../types/authProvider.ts';

import { StrategyBase } from './strategyBase.ts';

export class StrategyMock extends StrategyBase {
  constructor(options: TypeStrategyOptions<IAuthProviderOauth2ClientOptions>, verify: Function) {
    options = options || {};
    const app = useApp();
    const callbackURLRelative = $apiPath('/auth/mock/authorize');
    const callbackURL = app.util.combineApiPath(callbackURLRelative, '', true, true);
    options.authorizationURL = options.authorizationURL || callbackURL;
    options.tokenURL = 'xxx';

    super(options, verify);

    const self = this as any;
    self.name = 'mock';

    self._oauth2.getOAuthAccessToken = function (
      code: string,
      params: unknown,
      callback: Function,
    ) {
      const accessToken = code;
      const refreshToken = uuidv4();
      callback(null, accessToken, refreshToken, params);
    };
  }

  userProfile(accessToken: string, done: Function) {
    const [username, profileId] = accessToken.split(',');
    const profile = {
      id: profileId || username,
      username: username,
      displayName: username,
    };
    done(null, profile);
  }
}

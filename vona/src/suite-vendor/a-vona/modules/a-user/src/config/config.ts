import type { VonaApplication } from 'vona';

import type { ConfigUser } from '../types/auth.ts';

import { $parseAuthTokenMode } from '../lib/auth.ts';

export function config(app: VonaApplication) {
  const configUser: ConfigUser = {
    user: {
      autoActivate: false,
    },
    authToken: {
      mode: $parseAuthTokenMode(app.meta.env.AUTH_TOKEN_MODE),
      stateless: false,
      strategy: {
        refreshAuthToken: 'refresh',
        signin: 'refresh',
      },
      ttl: 30 * 24 * 60 * 60 * 1000,
    },
    adapter: {
      authToken: 'a-user:authTokenAdapter',
      passport: 'home-user:passportAdapter',
      user: 'home-user:userAdapter',
      role: 'home-user:roleAdapter',
    },
    payloadData: {
      fields: {
        authId: 'authId',
        userId: 'userId',
        token: 'token',
      },
    },
  };
  return configUser;
}

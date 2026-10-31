import type { TableIdentity } from 'table-identity';

import type { IAuthIdRecord, IAuthTokenConfig, TypeAuthTokenMode } from '../types/auth.ts';

export function $parseAuthTokenMode(value: unknown): TypeAuthTokenMode {
  if (value === undefined) return 'auth';
  if (value === 'auth' || value === 'session') return value;
  throw new Error('AUTH_TOKEN_MODE / authToken.mode must be auth or session');
}

export function $getAuthTokenMode(config: IAuthTokenConfig): TypeAuthTokenMode {
  const mode = $parseAuthTokenMode(config.mode);
  if (mode === 'session') {
    if (config.stateless) {
      throw new Error('Session auth-token mode requires stateful authentication');
    }
    if (config.strategy.refreshAuthToken === 'reissue') {
      throw new Error('Session auth-token mode does not support the reissue refresh strategy');
    }
  }
  return mode;
}

export function $getAuthIdSystem<K extends keyof IAuthIdRecord>(
  _authName: IAuthIdRecord[K],
  authId: K,
): TableIdentity {
  return authId;
}

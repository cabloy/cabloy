import type { TableIdentity } from 'table-identity';

import type { IAuthIdRecord } from '../types/auth.ts';

export function $getAuthIdSystem<K extends keyof IAuthIdRecord>(
  _authName: IAuthIdRecord[K],
  authId: K,
): TableIdentity {
  return authId;
}

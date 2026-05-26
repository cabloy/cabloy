import type { TableIdentity } from 'table-identity';

import type { IUserIdRecord } from '../types/user.ts';

export function $getUserIdSystem<K extends keyof IUserIdRecord>(
  _userName: IUserIdRecord[K],
  userId: K,
): TableIdentity {
  return userId;
}

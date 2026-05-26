import type { IAuthUserProfile } from 'vona-module-a-user';

import type { TypeStrategyOauth2VerifyArgs } from '../types/authProvider.ts';

export function getStrategyOauth2Profile<T = IAuthUserProfile>(
  args: TypeStrategyOauth2VerifyArgs<T>,
): T {
  return args[2];
}

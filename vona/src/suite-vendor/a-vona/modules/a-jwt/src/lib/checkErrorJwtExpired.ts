import { checkErrorJwtExpired } from '@cabloy/utils';

// throw error only when ErrorMessageJwtExpired
export function checkErrorJwtExpiredAndThrow(err: Error | undefined, headers: any) {
  if (
    checkErrorJwtExpired(err) &&
    (headers['x-vona-jwt-authtoken'] === true || headers['x-vona-jwt-authtoken'] === 'true')
  ) {
    throw err;
  }
}

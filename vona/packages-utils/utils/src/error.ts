export const ErrorJwtExpiredMessage = 'jwt expired';
export const ErrorJwtExpiredName = 'TokenExpiredError';

export function checkErrorJwtExpired(err: Error | undefined) {
  return err && (err.message === ErrorJwtExpiredMessage || err.name === ErrorJwtExpiredName);
}

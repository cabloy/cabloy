import type { StringValue } from 'ms';
import type { ZovaSys } from 'zova';

import { ISsrConfig } from '../types/config.js';

export const config = (sys: ZovaSys) => {
  const ssrConfig: ISsrConfig = {
    cookieThemeDarkDefault: sys.env.SSR_COOKIE_THEMEDARK_DEFAULT === 'true',
    optimization: {
      bodyReadyObserver: sys.env.SSR_BODYREADYOBSERVER === 'true',
    },
    transferCache:
      sys.env.SSR_TRANSFERCACHE === 'false'
        ? false
        : {
            expires: _normalizeExpires(sys.env.SSR_TRANSFERCACHE_EXPIRES),
          },
  };
  return ssrConfig;
};

function _normalizeExpires(expires: string | undefined): StringValue | number {
  if (!expires) return 0;
  if (!Number.isNaN(Number(expires))) return Number(expires);
  return expires as StringValue;
}

import type { ZovaSys } from 'zova';

import type { ISsrConfig } from '../types/config.ts';

export const config = (sys: ZovaSys) => {
  const ssrConfig: ISsrConfig = {
    cookieThemeDarkDefault: sys.env.SSR_COOKIE_THEMEDARK_DEFAULT === 'true',
  };
  return ssrConfig;
};

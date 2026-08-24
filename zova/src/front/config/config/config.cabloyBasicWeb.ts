import type { ZovaConfigOptional, ZovaSys } from 'zova';

import { LocalePattern } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  // routes
  config.routes = {
    path: {
      '/home/indexadmin/dashboard': undefined,
    },
    name: {
      'home-indexweb:home': { alias: `/:locale(${LocalePattern})?` },
    },
  };

  return config;
}

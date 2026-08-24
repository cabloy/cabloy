import type { ZovaConfigOptional, ZovaSys } from 'zova';

import { LocalePattern } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  config.routes = {
    path: {
      '/home/indexadmin/dashboard': undefined,
    },
    name: {
      'commerce-catalog:catalogue': { alias: `/:locale(${LocalePattern})?` },
      'commerce-catalog:product': { alias: `/:locale(${LocalePattern})?/product/:id` },
      'home-indexweb:home': undefined,
    },
  };

  return config;
}

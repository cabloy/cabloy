import type { ZovaConfigOptional, ZovaSys } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  config.routes = {
    path: {
      '/home/indexadmin/dashboard': undefined,
    },
    name: {
      'commerce-catalog:catalogue': { alias: '/:locale(zh-cn)?' },
      'commerce-catalog:product': { alias: '/:locale(zh-cn)?/product/:id' },
      'home-indexweb:home': undefined,
    },
  };

  return config;
}

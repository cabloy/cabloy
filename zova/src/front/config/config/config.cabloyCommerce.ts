import type { ZovaConfigOptional, ZovaSys } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  config.routes = {
    name: {
      'home-indexweb:home': { alias: '/:locale(zh-cn)?' },
    },
  };

  return config;
}

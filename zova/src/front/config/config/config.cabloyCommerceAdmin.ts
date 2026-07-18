import type { ZovaConfigOptional, ZovaSys } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  config.routes = {
    path: {
      '/commerce/siteadmin/dashboard': { alias: '/' },
      '/home/indexadmin/dashboard': undefined,
    },
  };

  return config;
}

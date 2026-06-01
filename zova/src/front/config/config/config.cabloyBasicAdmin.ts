import type { ZovaConfigOptional, ZovaSys } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  // routes
  config.routes = {
    path: {
      '/home/indexadmin/dashboard': { alias: '/' },
    },
  };

  return config;
}

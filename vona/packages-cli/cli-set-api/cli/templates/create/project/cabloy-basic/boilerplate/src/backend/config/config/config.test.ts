import type { VonaApplication, VonaConfigOptional } from 'vona';

export default async function (_app: VonaApplication) {
  const config: VonaConfigOptional = {};

  // proxy
  config.proxy = {
    enable: false,
  };

  // instance
  config.instance = {
    instances: {
      '': { password: '', title: '', config: {} },
      'shareTest': { password: '', title: '' },
      'isolateTest': {
        password: '',
        title: '',
        id: 1000,
        isolate: true,
        isolateClient: 'isolateTest',
      },
    },
  };

  // redis
  config.redis = {
    clients: {},
  };

  // database
  config.database = {
    testDatabase: true,
    base: {
      pool: { min: 0, max: 1 },
    },
    clients: {},
  };

  // modules
  config.modules = {};

  // onions
  config.onions = {};

  return config;
}

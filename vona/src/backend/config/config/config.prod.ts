import type { VonaApplication, VonaConfigOptional } from 'vona';

export default async function (_app: VonaApplication) {
  const config: VonaConfigOptional = {};

  // instance
  config.instance = {
    instances: {
      '': { password: '', title: '' },
    },
  };

  // redis
  config.redis = {
    clients: {},
  };

  // database
  config.database = {
    testDatabase: false,
    base: {
      asyncStackTraces: false,
    },
    clients: {
      isolateTest: undefined,
    },
  };

  // modules
  config.modules = {};

  // onions
  config.onions = {};

  return config;
}

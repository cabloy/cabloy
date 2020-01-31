// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    cachedb: {
      global: true,
      dependencies: 'instance',
    },
    cachemem: {
      global: true,
    },
  };

  // queues
  config.queues = {
    cacheDbSet: {
      path: 'db/set',
    },
  };

  // broadcasts
  config.broadcasts = {
    memRemove: {
      path: 'broadcast/memRemove',
    },
    memClear: {
      path: 'broadcast/memClear',
    },
  };

  return config;
};

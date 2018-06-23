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

  return config;
};

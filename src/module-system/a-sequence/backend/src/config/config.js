// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    sequence: {
      global: true,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    sequence: {
      path: 'sequence/next',
    },
  };

  return config;
};

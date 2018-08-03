// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    status: {
      global: true,
      dependencies: 'instance',
    },
  };

  // queues
  config.queues = {
    statusSet: {
      path: 'status/set',
    },
  };

  return config;
};

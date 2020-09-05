// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
  };

  // queues
  config.queues = {
    statusSet: {
      path: 'status/set',
    },
  };

  return config;
};

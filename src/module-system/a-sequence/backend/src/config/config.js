// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
  };

  // queues
  config.queues = {
    sequence: {
      path: 'sequence/next',
    },
  };

  return config;
};

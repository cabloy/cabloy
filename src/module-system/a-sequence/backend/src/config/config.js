// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
  };

  // queues
  config.queues = {
    sequence: {
      bean: 'sequence',
    },
  };

  return config;
};

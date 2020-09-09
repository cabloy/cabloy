// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
  };

  // queues
  config.queues = {
    statusSet: {
      bean: 'statusSet',
    },
  };

  return config;
};

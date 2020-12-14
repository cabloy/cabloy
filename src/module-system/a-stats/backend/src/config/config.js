// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    stats: {
      bean: 'stats',
    },
  };

  return config;
};

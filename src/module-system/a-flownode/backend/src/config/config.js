// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    startEventTimer: {
      bean: 'startEventTimer',
    },
  };

  return config;
};

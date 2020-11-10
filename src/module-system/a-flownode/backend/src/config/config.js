// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    startEventTimer: {
      bean: 'startEventTimer',
    },
    flowCheck: {
      bean: 'flowCheck',
      transaction: true,
    },
  };

  return config;
};

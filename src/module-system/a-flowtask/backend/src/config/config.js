// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    flowCheck: {
      bean: 'flowCheck',
      transaction: true,
    },
  };

  return config;
};

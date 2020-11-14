// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    nodeDoneCheck: {
      bean: 'nodeDoneCheck',
      transaction: true,
    },
  };

  return config;
};

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    deploy: {
      bean: 'deploy',
    },
  };

  return config;
};

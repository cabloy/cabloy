// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    loadFlowDefs: {
      bean: 'loadFlowDefs',
      instance: true,
      debounce: true,
    },
  };

  // queues
  config.queues = {
    deploy: {
      bean: 'deploy',
    },
  };

  return config;
};

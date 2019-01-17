// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    hook: {
      global: true,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    installHooks: {
      type: 'all',
      path: 'hook/installHooks',
    },
  };

  return config;
};

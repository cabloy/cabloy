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
      path: 'hook/installHooks',
    },
  };

  return config;
};

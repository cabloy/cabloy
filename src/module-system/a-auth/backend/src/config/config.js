// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    registerPassport: {
      bean: 'registerPassport',
    },
    installAuthProviders: {
      bean: 'installAuthProviders',
      // instance: true,
    },
    cacheAuthProviders: {
      bean: 'cacheAuthProviders',
      instance: true,
    },
  };

  // broadcasts
  config.broadcasts = {
    authProviderChanged: {
      bean: 'authProviderChanged',
    },
  };

  return config;
};

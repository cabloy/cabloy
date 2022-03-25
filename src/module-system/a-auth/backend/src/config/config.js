// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // startups
  config.startups = {
    registerPassport: {
      bean: 'registerPassport',
    },
    registerRouters: {
      bean: 'registerRouters',
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

  // login
  config.login = {
    providers: [
      {
        module: 'a-authsimple',
        provider: 'authsimple',
      },
      {
        module: 'a-authsms',
        provider: 'authsms',
      },
      {
        module: 'a-authgithub',
        provider: 'authgithub',
      },
    ],
  };

  return config;
};

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // providers
  config.providers = [
    {
      module: 'a-authsimple',
      provider: 'authsimple',
    },
    {
      module: 'a-authgithub',
      provider: 'authgithub',
    },
  ];

  return config;
};

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // account
  config.account = {};

  // account.github
  config.account.github = {
    scenes: {
      default: {
        title: 'AuthDefault',
        clientID: '',
        clientSecret: '',
      },
    },
  };

  return config;
};

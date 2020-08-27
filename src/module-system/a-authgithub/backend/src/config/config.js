// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
  };

  // account
  config.account = {};

  // account.github
  config.account.github = {
    apps: {
      default: {
        clientID: '',
        clientSecret: '',
      },
    },
  };

  return config;
};

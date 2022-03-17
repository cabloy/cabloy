// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // account
  config.account = {};

  // account.github
  config.account.github = {
    scenes: {
      default: {
        title: 'Default',
        clientID: '',
        clientSecret: '',
      },
    },
  };

  return config;
};

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
    locales: {
      'zh-cn': {
        Default: '默认',
      },
    },
  };

  return config;
};

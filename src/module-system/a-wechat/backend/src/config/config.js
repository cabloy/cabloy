// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    wechat: {
      global: false,
      dependencies: 'instance',
    },
  };

  // account
  config.account = {};

  // account.public
  config.account.public = {
    appID: '',
    appSecret: '',
    token: '',
    encodingAESKey: '',
    message: {
      reply: {
        default: '',
        subscribe: '',
      },
    },
  };

  return config;
};

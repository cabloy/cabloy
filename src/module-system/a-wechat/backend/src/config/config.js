const jsApiList = require('./config/jsApiList.js');

module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    inWechat: {
      bean: 'inWechat',
      global: false,
      dependencies: 'instance',
    },
  };

  // auth
  config.auth = {
    autoActivate: true,
  };

  // account
  config.account = {};

  // account.wechat
  config.account.wechat = {
    client: 'wechat',
    scope: 'snsapi_userinfo',
    appID: '',
    appSecret: '',
    message: {
      token: appInfo.name,
      encodingAESKey: '',
      reply: {
        default: 'You are welcome!',
        subscribe: 'You are subscribed!',
      },
    },
    jssdk: {
      // debug: true,
      debug: false,
      jsApiList,
    },
  };

  // account.wechatweb
  config.account.wechatweb = {
    client: 'wechatweb',
    scope: 'snsapi_login',
    appID: '',
    appSecret: '',
  };

  // account.wechatmini
  config.account.wechatmini = {
    scope: 'snsapi_userinfo',
    scenes: {
      default: {
        title: 'AuthDefault',
        appID: '',
        appSecret: '',
        message: {
          token: appInfo.name,
          encodingAESKey: '',
        },
      },
    },
  };

  return config;
};

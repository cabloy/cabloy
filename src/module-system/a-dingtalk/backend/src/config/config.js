const jsApiList = require('./config/jsApiList.js');
const businessCallbackList = require('./config/businessCallbackList.js');

module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    contacts: {
      bean: 'contacts',
      transaction: true,
    },
  };

  // startups
  config.startups = {
    registerBusinessCallbackList: {
      bean: 'registerBusinessCallbackList',
      instance: true,
      debounce: true,
      after: true,
    },
  };

  // middlewares
  config.middlewares = {
    inDingtalk: {
      bean: 'inDingtalk',
      global: false,
      dependencies: 'instance',
    },
  };

  // sync
  config.sync = {
    department: {
      roleContainer: 'internal',
      roleTop: 'dingtalk',
    },
  };

  // auth
  config.auth = {
    autoActivate: true,
  };

  // account
  config.account = {};

  // account.dingtalk
  config.account.dingtalk = {
    corpid: '',
    ssosecret: '',
    // apps
    apps: {
      selfBuilt: {
        agentid: '',
        appkey: '',
        appsecret: '',
        jssdk: {
          type: 0,
          jsApiList,
        },
        businessCallback: {
          host: '',
          token: appInfo.name,
          encodingAESKey: '',
          list: businessCallbackList,
        },
      },
    },
    // webs
    webs: {
      default: {
        appid: '',
        appsecret: '',
      },
    },
    // minis
    minis: {
      default: {
        agentid: '',
        appkey: '',
        appsecret: '',
      },
    },
  };

  // settings
  config.settings = {
    instance: {
      groupInfo: {
        sendLinkAccountMigration: false,
      },
      groupFunction: {},
    },
  };

  return config;
};

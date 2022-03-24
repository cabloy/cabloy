const jsApiList = require('./config/jsApiList.js');

module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    contacts: {
      bean: 'contacts',
      transaction: true,
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

  // account.dingtalkadmin
  config.account.dingtalkadmin = {
    client: 'dingtalkadmin',
    corpId: '',
    ssoSecret: '',
  };
  // account.dingtalk
  config.account.dingtalk = {
    client: 'dingtalk',
    // scenes
    scenes: {
      selfBuilt: {
        title: 'AuthSelfBuiltApp',
        agentId: '',
        appKey: '',
        appSecret: '',
        message: {
          token: appInfo.name,
          encodingAESKey: '',
        },
        jssdk: {
          type: 0,
          jsApiList,
        },
      },
    },
  };

  // account.dingtalkweb
  config.account.dingtalkweb = {
    client: 'dingtalkweb',
    scope: 'snsapi_login',
    // scenes
    scenes: {
      selfBuilt: {
        title: 'AuthSelfBuiltApp',
      },
    },
  };

  // account.dingtalkmini
  config.account.dingtalkmini = {
    scenes: {
      default: {
        title: 'AuthDefault',
        agentId: '',
        appKey: '',
        appSecret: '',
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

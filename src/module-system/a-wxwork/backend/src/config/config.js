const jsApiList = require('./config/jsApiList.js');
const jsApiListAgent = require('./config/jsApiListAgent.js');

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
    inWxwork: {
      bean: 'inWxwork',
      global: false,
      dependencies: 'instance',
    },
  };

  // sync
  config.sync = {
    department: {
      roleContainer: 'internal',
      roleTop: 'wxwork',
      reverseOrder: true,
    },
  };

  // auth
  config.auth = {
    autoActivate: true,
  };

  // account
  config.account = {};

  // account.wxwork
  config.account.wxwork = {
    client: 'wxwork',
    // scenes
    scenes: {
      selfBuilt: {
        title: 'SelfBuiltApp',
        corpId: '',
        agentId: '',
        corpSecret: '',
        message: {
          token: appInfo.name,
          encodingAESKey: '',
          reply: {
            default: 'You are welcome!',
          },
        },
        jssdk: {
          debug: false,
          jsApiList,
        },
        jssdkAgent: {
          jsApiList: jsApiListAgent,
        },
      },
      contacts: {
        title: 'Contacts',
        appSecret: '',
        event: {
          token: appInfo.name,
          encodingAESKey: '',
        },
      },
    },
    locals: {
      'en-us': {
        SelfBuiltApp: 'Self Built App',
      },
      'zh-cn': {
        SelfBuiltApp: '自建应用',
        Contacts: '通讯录',
      },
    },
  };

  // account.wxworkweb
  config.account.wxworkweb = {
    client: 'wxworkweb',
    // scenes
    scenes: {
      selfBuilt: {
        title: 'SelfBuiltApp',
      },
    },
    locals: {
      'en-us': {
        SelfBuiltApp: 'Self Built App',
      },
      'zh-cn': {
        SelfBuiltApp: '自建应用',
      },
    },
  };

  // account.wxworkmini
  config.account.wxworkmini = {
    scenes: {
      default: {
        title: 'Default',
        corpSecret: '',
        appID: '',
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

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
        title: 'SelfBuilt',
        corpid: '',
        agentid: '',
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
        message: {
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
        secret: '',
        token: appInfo.name,
        encodingAESKey: '',
      },
    },
  };

  // account.wxworkweb
  config.account.wxworkweb = {
    client: 'wxworkweb',
    // scenes
    scenes: {
      selfBuilt: {
        title: 'SelfBuilt',
      },
    },
  };

  // account.wxworkmini
  config.account.wxworkmini = {
    scenes: {
      default: {
        title: 'Default',
        secret: '',
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

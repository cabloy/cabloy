const authFn = require('./config/passport/auth.js');

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioMessageProgress = require('./config/socketio/messageProgress.js')(app);
  const socketioChannelApp = require('./config/socketio/channelApp.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        authDingtalkadmin: {
          schemas: 'authDingtalkadmin',
        },
        authDingtalkSelfBuilt: {
          schemas: 'authDingtalkSelfBuilt',
        },
        authDingtalkmini: {
          schemas: 'authDingtalkmini',
        },
        settingsInstance: {
          schemas: 'settingsInstance',
        },
      },
      keywords: {},
      schemas,
    },
    settings: {
      instance: {
        validator: 'settingsInstance',
      },
    },
    event: {
      declarations: {
        dingtalkMessageGeneral: 'Dingtalk Work Message General',
      },
      implementations: {
        'a-base:loginInfo': 'loginInfo',
        'a-base:accountMigration': 'accountMigration',
      },
    },
    socketio: {
      messages: {
        progress: socketioMessageProgress,
      },
      channels: {
        app: socketioChannelApp,
      },
    },
    auth: authFn,
  };
  return meta;
};

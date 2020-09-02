const authFn = require('./passport/auth.js');

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  // socketio
  const socketioMessageProgress = require('./config/socketio/messageProgress.js')(app);
  const socketioChannelApp = require('./config/socketio/channelApp.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
        settingsInstance: {
          schemas: 'settingsInstance',
        },
      },
      keywords: {},
      schemas: {
        settingsInstance: schemas.settingsInstance,
      },
    },
    settings: {
      instance: {
        validator: 'settingsInstance',
      },
    },
    event: {
      declarations: {
      },
      implementations: {
        'a-base:loginInfo': 'loginInfo',
        'a-base:accountMigration': 'accountMigration',
      },
    },
    index: {
      indexes: {
        aDingtalkDepartment: 'createdAt,updatedAt,roleId,departmentId,departmentParentId',
        aDingtalkMember: 'createdAt,updatedAt,userId,memberId',
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

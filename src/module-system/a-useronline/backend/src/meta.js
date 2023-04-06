module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const staticDicts = require('./config/static/dicts.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        userOnline: {
          info: {
            bean: 'userOnline',
            title: 'Users Status', // 'Online Users',
            tableName: 'aUserOnline',
            language: false,
            category: false,
            tag: false,
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'layoutAtomListUserOnline',
              },
            },
          },
          actions: {
            kickOut: {
              code: 101,
              title: 'ActionKickOut',
              actionModule: moduleInfo.relativeName,
              actionComponent: 'action',
              icon: { f7: ':outline:logout-outline' },
              // enableOnOpened: true,
              stage: 'formal',
            },
          },
          validator: 'userOnline',
          search: {
            validator: 'userOnlineSearch',
          },
        },
        userOnlineHistory: {
          info: {
            bean: 'userOnlineHistory',
            title: 'LoginLog',
            tableName: 'aUserOnlineHistory',
            itemOnly: true,
            userIds: 'userId',
            dict: {
              fields: {
                isLogin: {
                  dictKey: 'a-userOnline:dictLoginType',
                },
              },
            },
          },
          actions: {},
          validator: 'userOnlineHistory',
          search: {
            validator: 'userOnlineHistorySearch',
          },
        },
      },
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
        'a-dict.dict': {
          items: staticDicts,
        },
      },
    },
    validation: {
      validators: {
        userOnline: {
          schemas: 'userOnline',
        },
        userOnlineSearch: {
          schemas: 'userOnlineSearch',
        },
        userOnlineHistory: {
          schemas: 'userOnlineHistory',
        },
        userOnlineHistorySearch: {
          schemas: 'userOnlineHistorySearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        aUserOnline: 'createdAt,updatedAt,atomId,userId,onlineTimeLast,expireTime',
        aUserOnlineHistory: 'createdAt,updatedAt,userId,onlineTime',
      },
    },
  };
  return meta;
};

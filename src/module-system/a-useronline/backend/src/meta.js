module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        userOnline: {
          info: {
            bean: 'userOnline',
            title: 'Online Users',
            tableName: 'aUserOnline',
            language: false,
            category: false,
            tag: false,
            simple: true,
            history: false,
          },
          actions: {},
          validator: 'userOnline',
          search: {
            validator: 'userOnlineSearch',
          },
        },
        userOnlineHistory: {
          info: {
            bean: 'userOnlineHistory',
            title: 'Online Users(History)',
            tableName: 'aUserOnlineHistory',
            language: false,
            category: false,
            tag: false,
            simple: true,
            history: false,
          },
          actions: {},
          validator: 'userOnlineHistory',
          search: {
            validator: 'userOnlineHistorySearch',
          },
        },
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
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
        aUserOnline: 'createdAt,updatedAt,atomId,userId,loginTimeLast,expireTime',
        aUserOnlineHistory: 'createdAt,updatedAt,atomId,userId,loginTime',
      },
    },
  };
  return meta;
};

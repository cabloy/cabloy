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
            title: 'UserOnline',
            tableName: 'aUserOnline',
            language: false,
            category: true,
            tag: true,
          },
          actions: {},
          validator: 'userOnline',
          search: {
            validator: 'userOnlineSearch',
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
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        aUserOnline: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

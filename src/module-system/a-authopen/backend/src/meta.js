const authFn = require('./config/passport/auth.js');
module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    auth: authFn,
    base: {
      atoms: {
        authOpen: {
          info: {
            bean: 'authOpen',
            title: 'AuthOpen',
            tableName: 'aAuthOpen',
            language: false,
            category: true,
            tag: true,
          },
          actions: {},
          validator: 'authOpen',
          search: {
            validator: 'authOpenSearch',
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
        authOpen: {
          schemas: 'authOpen',
        },
        authOpenSearch: {
          schemas: 'authOpenSearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        aAuthOpen: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

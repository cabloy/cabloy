module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        app: {
          info: {
            bean: 'app',
            title: 'App',
            tableName: 'aApp',
            language: false,
            category: true,
            tag: true,
          },
          actions: {},
          validator: 'app',
          search: {
            validator: 'appSearch',
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
        app: {
          schemas: 'app',
        },
        appSearch: {
          schemas: 'appSearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        aApp: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticApps = require('./config/static/apps.js')(app);
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
            tableNameModes: {
              full: 'aAppViewFull',
            },
            resource: true,
            language: false,
            category: true,
            tag: false,
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'app',
          search: {
            validator: 'appSearch',
          },
        },
      },
      statics: {
        'a-app.app': {
          items: staticApps,
        },
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

module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticApps = require('./config/static/apps.js')(app);
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
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
            inner: true,
            resource: true,
            language: false,
            category: true,
            tag: false,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'layoutAtomListApp',
              },
            },
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
        'a-baselayout.layout': {
          items: staticLayouts,
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
      indexes: { aApp: 'createdAt,updatedAt,atomId' },
    },
  };
  return meta;
};

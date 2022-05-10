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
        appMenu: {
          info: {
            bean: 'appMenu',
            title: 'AppMenu',
            tableName: 'aAppMenu',
            language: false,
            category: true,
            tag: true,
            layout: {
              config: {
                // atomList: 'layoutAtomListAppMenu',
              },
            },
          },
          actions: {},
          validator: 'appMenu',
          search: {
            validator: 'appMenuSearch',
          },
        },
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
        appMenu: {
          schemas: 'appMenu',
        },
        appMenuSearch: {
          schemas: 'appMenuSearch',
        },
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
      indexes: { aAppMenu: 'createdAt,updatedAt,atomId', aApp: 'createdAt,updatedAt,atomId' },
    },
  };
  return meta;
};

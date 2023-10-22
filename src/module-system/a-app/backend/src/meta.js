module.exports = app => {
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  // static
  const staticApps = require('./meta/static/apps.js')(app);
  const staticLayouts = require('./meta/static/layouts.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
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
      validators: {},
      keywords: {},
      schemas,
    },
    index: {
      indexes: { aApp: 'createdAt,updatedAt,atomId' },
    },
  };
  return meta;
};

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        layout: {
          info: {
            bean: 'layout',
            title: 'Layout',
            tableName: 'aLayout',
            tableNameModes: {
              full: 'aLayoutViewFull',
            },
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'layout',
          search: {
            validator: 'layoutSearch',
          },
        },
      },
      resources: {
        button: {
          title: 'Sidebar Button',
        },
        panel: {
          title: 'Sidebar Panel',
        },
      },
      statics: {
        'a-layoutpc.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        layout: {
          schemas: 'layout',
        },
        layoutSearch: {
          schemas: 'layoutSearch',
        },
      },
      keywords: {},
      schemas: {
        layout: schemas.layout,
        layoutSearch: schemas.layoutSearch,
      },
    },
  };
  return meta;
};

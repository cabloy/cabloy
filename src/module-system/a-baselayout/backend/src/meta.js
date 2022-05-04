module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticDicts = require('./config/static/dicts.js')(app);
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
            resource: true,
            dict: {
              fields: {
                layoutTypeCode: {
                  dictKey: 'a-baselayout:dictLayoutType',
                },
              },
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
      statics: {
        'a-dict.dict': {
          items: staticDicts,
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
      schemas,
    },
  };
  return meta;
};

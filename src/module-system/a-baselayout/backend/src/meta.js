module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
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
            inner: true,
            resource: true,
            comment: false,
            attachment: false,
            dict: {
              fields: {
                layoutTypeCode: {
                  dictKey: 'a-dictbooster:dictLayoutType',
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

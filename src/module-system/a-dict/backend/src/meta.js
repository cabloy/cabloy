module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        dict: {
          info: {
            bean: 'dict',
            title: 'Dict',
            tableName: 'aDict',
            tableNameModes: {
              full: 'aDictViewFull',
            },
            inner: true,
            resource: true,
            language: false,
            category: false,
            tag: false,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'layoutAtomListDict',
              },
            },
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'dict',
          search: {
            validator: 'dictSearch',
          },
        },
      },
      statics: {
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
  };
  return meta;
};

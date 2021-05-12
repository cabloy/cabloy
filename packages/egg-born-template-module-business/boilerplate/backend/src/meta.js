module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        {{atomClassName}}: {
          info: {
            bean: '{{atomClassName}}',
            title: '{{atomClassNameCapitalize}}',
            tableName: '{{providerId}}{{atomClassNameCapitalize}}',
            language: false,
            category: true,
            tag: true,
          },
          actions: {
          },
          validator: '{{atomClassName}}',
          search: {
            validator: '{{atomClassName}}Search',
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
        {{atomClassName}}: {
          schemas: '{{atomClassName}}',
        },
        {{atomClassName}}Search: {
          schemas: '{{atomClassName}}Search',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        {{providerId}}{{atomClassNameCapitalize}}: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

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
            details: ['default'],
          },
          actions: {},
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
    detail: {
      details: {
        default: {
          info: {
            bean: '{{atomClassName}}',
            title: 'Details',
            tableName: '{{providerId}}{{atomClassNameCapitalize}}Detail',
          },
          actions: {},
          validator: '{{atomClassName}}Detail',
        },
      },
    },
    validation: {
      validators: {
        // {{atomClassName}}
        {{atomClassName}}: {
          schemas: '{{atomClassName}}',
        },
        {{atomClassName}}Search: {
          schemas: '{{atomClassName}}Search',
        },
        // {{atomClassName}}Detail
        {{atomClassName}}Detail: {
          schemas: '{{atomClassName}}Detail',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        {{providerId}}{{atomClassNameCapitalize}}: 'createdAt,updatedAt,atomId',
        {{providerId}}{{atomClassNameCapitalize}}Detail: 'createdAt,updatedAt,atomId,detailId',
      },
    },
  };
  return meta;
};

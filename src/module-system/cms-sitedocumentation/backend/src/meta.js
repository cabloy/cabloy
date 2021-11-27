module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        document: {
          info: {
            bean: 'document',
            title: 'Document',
            tableName: 'cmsDocument',
            language: false,
            category: true,
            tag: true,
          },
          actions: {},
          validator: 'document',
          search: {
            validator: 'documentSearch',
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
        document: {
          schemas: 'document',
        },
        documentSearch: {
          schemas: 'documentSearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        cmsDocument: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

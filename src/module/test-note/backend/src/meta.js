module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        note: {
          info: {
            bean: 'note',
            title: 'Note',
            tableName: 'testNote',
            language: false,
            category: true,
            tag: true,
            simple: true,
          },
          actions: {},
          validator: 'note',
          search: {
            validator: 'noteSearch',
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
        note: {
          schemas: 'note',
        },
        noteSearch: {
          schemas: 'noteSearch',
        },
      },
      keywords: {},
      schemas,
    },
    index: {
      indexes: {
        testNote: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

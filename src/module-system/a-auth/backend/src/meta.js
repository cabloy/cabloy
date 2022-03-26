module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        oauth2: {
          schemas: 'oauth2',
        },
      },
      keywords: {},
      schemas,
    },
  };
  return meta;
};

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        link: {
          schemas: 'link',
        },
      },
      keywords: {},
      schemas,
    },
  };
  return meta;
};

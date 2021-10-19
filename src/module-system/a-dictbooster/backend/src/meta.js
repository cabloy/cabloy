module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticDicts = require('./config/static/dicts.js')(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-dict.dict': {
          items: staticDicts,
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

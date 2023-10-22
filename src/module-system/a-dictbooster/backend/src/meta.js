module.exports = app => {
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  // static
  const staticDicts = require('./meta/static/dicts.js')(app);
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

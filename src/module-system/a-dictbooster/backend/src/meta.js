module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  const staticDicts = require('./meta/static/dicts.js');
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

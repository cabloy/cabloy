module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
  };
  return meta;
};

const authFn = require('./meta/passport/auth.js');
module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  return {
    auth: authFn,
    validation: {
      validators: {},
      schemas,
    },
  };
};

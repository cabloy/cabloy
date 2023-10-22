const authFn = require('./meta/passport/auth.js');
module.exports = app => {
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  return {
    auth: authFn,
    validation: {
      validators: {},
      schemas,
    },
  };
};

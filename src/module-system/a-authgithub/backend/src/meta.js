const authFn = require('./config/passport/auth.js');
module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  return {
    auth: authFn,
    validation: {
      validators: {
        authGithub: {
          schemas: 'authGithub',
        },
      },
      schemas: {
        authGithub: schemas.authGithub,
      },
    },
  };
};

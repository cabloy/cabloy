module.exports = app => {
  const auth = require('./config/passport/auth.js')(app);
  const schemas = require('./config/validation/schemas.js')(app);
  return {
    auth,
    validation: {
      validators: {
        signup: {
          schemas: 'signup',
        },
        signin: {
          schemas: 'signin',
        },
        reset: {
          schemas: 'reset',
        },
      },
      schemas: {
        signup: schemas.signup,
        signin: schemas.signin,
        reset: schemas.reset,
      },
    },
    user: {
      functions: {
        resetPassword: {
          title: 'Reset password',
          actionPath: 'reset',
        },
      },
    },
  };
};

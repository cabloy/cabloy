module.exports = app => {
  // auth
  const auth = require('./config/passport/auth.js')(app);
  // keywords
  const keywords = require('./config/validation/keywords.js')(app);
  // schemas
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
      keywords: {
        'x-exists': keywords.exists,
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

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
        passwordChange: {
          schemas: 'passwordChange',
        },
        passwordFind: {
          schemas: 'passwordFind',
        },
        passwordReset: {
          schemas: 'passwordReset',
        },
        emailConfirm: {
          schemas: 'emailConfirm',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
        'x-passwordFindEmail': keywords.passwordFindEmail,
      },
      schemas: {
        signup: schemas.signup,
        signin: schemas.signin,
        passwordChange: schemas.passwordChange,
        passwordFind: schemas.passwordFind,
        passwordReset: schemas.passwordReset,
        emailConfirm: schemas.emailConfirm,
      },
    },
  };
};

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
      validators: {},
      keywords: {
        'x-exists': keywords.exists,
        'x-passwordForgotEmail': keywords.passwordForgotEmail,
      },
      schemas,
    },
    event: {
      implementations: {
        'a-base:accountMigration': 'accountMigration',
      },
    },
  };
};

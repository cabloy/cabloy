module.exports = app => {
  // auth
  const auth = require('./meta/passport/auth.js');
  const keywords = require('./meta/validation/keywords.js');
  const schemas = require('./meta/validation/schemas.js');
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

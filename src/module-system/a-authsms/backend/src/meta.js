module.exports = app => {
  // auth
  const auth = require('./meta/passport/auth.js')(app);
  const keywords = require('./meta/validation/keywords.js');
  const schemas = require('./meta/validation/schemas.js');
  // static
  const staticResources = require('./meta/static/resources.js')(app);
  // meta
  return {
    base: {
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    auth,
    validation: {
      validators: {},
      keywords: {
        'x-exists': keywords.exists,
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

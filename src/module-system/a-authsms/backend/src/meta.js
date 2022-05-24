module.exports = app => {
  // auth
  const auth = require('./config/passport/auth.js')(app);
  // keywords
  const keywords = require('./config/validation/keywords.js')(app);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
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
      validators: {
        signup: {
          schemas: 'signup',
        },
        signin: {
          schemas: 'signin',
        },
        mobileVerify: {
          schemas: 'mobileVerify',
        },
        aliyun: {
          schemas: 'aliyun',
        },
      },
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

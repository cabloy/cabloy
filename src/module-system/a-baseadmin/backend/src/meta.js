module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        auth: {
          schemas: 'auth',
        },
      },
      keywords: {},
      schemas: {
        auth: schemas.auth,
      },
    },
    settings: {
      instance: {
        actionPath: 'settings/list',
      },
    },
  };

  return meta;
};

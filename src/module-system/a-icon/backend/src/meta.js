module.exports = app => {
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  // static
  const staticResources = require('./meta/static/resources.js')(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
  };
  return meta;
};

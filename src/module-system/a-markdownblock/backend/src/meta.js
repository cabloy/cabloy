module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
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

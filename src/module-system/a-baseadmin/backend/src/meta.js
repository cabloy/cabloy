module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  // static
  const staticLayouts = require('./meta/static/layouts.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
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

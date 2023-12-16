module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  // static
  const staticDicts = require('./meta/static/dicts.js')(app);
  const staticLayouts = require('./meta/static/layouts.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-dict.dict': {
          items: staticDicts,
        },
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
    index: {
      indexes: {},
    },
  };
  return meta;
};

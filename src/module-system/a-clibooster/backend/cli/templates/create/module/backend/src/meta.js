module.exports = app => {
  // atomClasses
  const atomClasses = require('./config/atomClass/atomClasses.js')(app);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // keywords
  const keywords = require('./config/validation/keywords.js')(app);
  // static
  const staticDicts = require('./config/static/dicts.js')(app);
  const staticLayouts = require('./config/static/layouts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const meta = {
    base: {
      atoms: atomClasses,
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
      keywords,
      schemas,
    },
    index: {
      indexes: {},
    },
  };
  return meta;
};

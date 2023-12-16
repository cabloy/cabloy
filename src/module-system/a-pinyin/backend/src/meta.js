module.exports = app => {
  const atomClasses = require('./meta/atomClass/atomClasses.js');
  const schemas = require('./meta/validation/schemas.js');
  const keywords = require('./meta/validation/keywords.js');
  // static
  const staticApps = require('./meta/static/apps.js')(app);
  const staticDicts = require('./meta/static/dicts.js')(app);
  const staticLayouts = require('./meta/static/layouts.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: atomClasses,
      statics: {
        'a-app.app': {
          items: staticApps,
        },
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

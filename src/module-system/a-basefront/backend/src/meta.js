module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  // static
  const staticLayouts = require('./meta/static/layouts.js')(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    validation: {
      validators: {},
      schemas,
    },
  };
  return meta;
};

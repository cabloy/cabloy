module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const staticLayouts = require('./config/static/layouts.js')(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    sequence: {
      providers: {
        detail: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
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

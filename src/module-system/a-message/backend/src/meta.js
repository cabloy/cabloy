module.exports = app => {
  const schemas = require('./meta/validation/schemas.js')(app);
  const staticLayouts = require('./meta/static/layouts.js')(app);
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
    stats: {
      providers: {
        message: {
          user: true,
          bean: 'message',
          dependents: ['a-user:user'],
        },
      },
    },
  };
  return meta;
};

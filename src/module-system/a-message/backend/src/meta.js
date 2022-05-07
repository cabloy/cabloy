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

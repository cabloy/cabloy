module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
      functions: {},
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

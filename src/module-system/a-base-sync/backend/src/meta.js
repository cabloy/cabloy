module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // meta
  const meta = {
    sequence: {
      providers: {
        draft: {
          start: 0,
          expression({ ctx, value }) {
            return ++value;
          },
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
      },
      keywords: {},
      schemas: {
        user: schemas.user,
      },
    },
  };
  return meta;
};

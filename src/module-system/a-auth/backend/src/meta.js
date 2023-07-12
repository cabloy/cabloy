module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    settings: {
      user: {
        actionPath: '/a/user/user/authentications',
      },
    },
  };
  return meta;
};

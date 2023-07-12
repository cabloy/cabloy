module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    settings: {
      instance: {
        actionPath: 'instance/config',
      },
    },
  };
  return meta;
};

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    validation: {
      validators: {
        instance: {
          schemas: 'instance',
        },
      },
      keywords: {},
      schemas: {
        instance: schemas.instance,
      },
    },
    settings: {
      instance: {
        actionPath: 'instance/config',
      },
    },
  };
  return meta;
};

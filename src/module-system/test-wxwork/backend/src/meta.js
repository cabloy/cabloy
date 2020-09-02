module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    event: {
      implementations: {
        'a-wxwork:wxworkMessage': 'event/wxworkMessage',
        'a-base:loginInfo': 'loginInfo',
      },
    },
  };
  return meta;
};

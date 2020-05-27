module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
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
    index: {
      indexes: {
        aSocketIOMessageClass: 'createdAt,updatedAt,module+messageClassName',
        aSocketIOMessage: 'createdAt,updatedAt,messageClassId,messageFilter,sessionId',
        aSocketIOMessageSync: 'createdAt,updatedAt,messageId,userId,messageRead',
      },
    },
  };
  return meta;
};

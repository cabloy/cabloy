module.exports = app => {
  const schemas = {};
  schemas.authDingtalkmini = {
    type: 'object',
    properties: {
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Auth Info',
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        notEmpty: true,
      },
      agentId: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'agentId',
        notEmpty: true,
      },
      appKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'appKey',
        notEmpty: true,
      },
      appSecret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'appSecret',
        notEmpty: true,
      },
    },
  };
  return schemas;
};

module.exports = app => {
  const schemas = {};
  schemas.authWechatweb = {
    type: 'object',
    properties: {
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Auth Info',
      },
      appID: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'App ID',
        notEmpty: true,
      },
      appSecret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'App Secret',
        notEmpty: true,
      },
    },
  };
  return schemas;
};

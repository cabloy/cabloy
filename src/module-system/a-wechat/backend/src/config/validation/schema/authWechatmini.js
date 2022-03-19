module.exports = app => {
  const schemas = {};
  schemas.authWechatmini = {
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
      message: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Message Info',
        properties: {
          token: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'token',
            notEmpty: true,
          },
          encodingAESKey: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'encodingAESKey',
            notEmpty: true,
          },
        },
      },
    },
  };
  return schemas;
};

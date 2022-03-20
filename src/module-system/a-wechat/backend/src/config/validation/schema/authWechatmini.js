module.exports = app => {
  const schemas = {};
  schemas.authWechatmini = {
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
          __messageURL: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Message URL',
            ebParams: {
              textarea: true,
            },
            ebReadOnly: true,
          },
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
          },
        },
      },
    },
  };
  return schemas;
};

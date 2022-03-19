module.exports = app => {
  const schemas = {};
  schemas.authWechat = {
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
          __groupMessageBasicInfo: {
            ebType: 'group-flatten',
            ebTitle: 'Basic Info',
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
          reply: {
            type: 'object',
            ebType: 'group',
            ebTitle: 'Reply Info',
            properties: {
              default: {
                type: 'string',
                ebType: 'text',
                ebTitle: 'Default',
                notEmpty: true,
              },
              subscribe: {
                type: 'string',
                ebType: 'text',
                ebTitle: 'Subscribe',
                notEmpty: true,
              },
            },
          },
        },
      },
      jssdk: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'JSSDK Info',
        properties: {
          debug: {
            type: 'boolean',
            ebType: 'Toggle',
            ebTitle: 'debug',
            notEmpty: true,
          },
          jsApiList: {
            type: 'array',
            ebType: 'json',
            ebTitle: 'jsApiList',
            notEmpty: true,
          },
        },
      },
    },
  };
  return schemas;
};

module.exports = app => {
  const schemas = {};
  schemas.authWechat = {
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
      corpId: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'corpId',
        notEmpty: true,
      },
      agentId: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'agentId',
        notEmpty: true,
      },
      secret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'secret',
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

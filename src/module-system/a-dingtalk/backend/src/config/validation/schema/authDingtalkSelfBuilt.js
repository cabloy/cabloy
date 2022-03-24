module.exports = app => {
  const schemas = {};
  schemas.authDingtalkSelfBuilt = {
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
        },
      },
      jssdk: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'JSSDK Info',
        properties: {
          type: {
            type: 'number',
            ebType: 'text',
            ebTitle: 'type',
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

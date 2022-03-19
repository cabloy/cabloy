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
            notEmpty: true,
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
  schemas.signin = {
    type: 'object',
    properties: {
      auth: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your Username/Mobile/Email',
        notEmpty: true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Your Password',
        ebParams: {
          secure: true,
        },
        notEmpty: true,
        minLength: 6,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember Me',
      },
    },
  };
  return schemas;
};

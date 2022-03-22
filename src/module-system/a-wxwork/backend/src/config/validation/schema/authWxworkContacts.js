module.exports = app => {
  const schemas = {};
  schemas.authWxworkContacts = {
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
        },
      },
    },
  };
  return schemas;
};

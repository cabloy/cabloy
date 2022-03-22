module.exports = app => {
  const schemas = {};
  schemas.authWxworkmini = {
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
      secret: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'secret',
        notEmpty: true,
      },
      appID: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'appID',
        notEmpty: true,
      },
    },
  };
  return schemas;
};

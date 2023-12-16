const schemas = {};
schemas.oauth2 = {
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
    clientID: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Client ID',
      notEmpty: true,
    },
    clientSecret: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Client Secret',
      notEmpty: true,
    },
  },
};
module.exports = schemas;

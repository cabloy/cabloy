module.exports = app => {
  const schemas = {};
  schemas.authWxworkweb = {
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
    },
  };
  return schemas;
};

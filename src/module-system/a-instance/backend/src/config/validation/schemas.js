module.exports = app => {
  const schemas = {};
  // instance
  schemas.instance = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Subdomain',
        ebReadOnly: true,
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        notEmpty: true,
      },
      meta: {
        type: 'string',
        ebType: 'text',
        ebTextarea: true,
        ebTitle: 'Meta',
        notEmpty: true,
      },
    },
  };

  return schemas;
};

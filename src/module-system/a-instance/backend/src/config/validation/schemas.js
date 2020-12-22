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
      },
      config: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Config',
        ebParams: {
          target: '',
        },
        notEmpty: true,
      },
    },
  };

  return schemas;
};

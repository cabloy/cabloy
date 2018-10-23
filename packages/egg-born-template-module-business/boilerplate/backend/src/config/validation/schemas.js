module.exports = app => {
  const schemas = {};
  // {{atomClassName}}
  schemas.{{atomClassName}} = {
    type: 'object',
    meta: {
      custom: {
        // component: '{{atomClassName}}Item',
      },
    },
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  // {{atomClassName}} search
  schemas.{{atomClassName}}Search = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};

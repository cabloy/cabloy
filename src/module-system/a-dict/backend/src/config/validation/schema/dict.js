module.exports = app => {
  const schemas = {};
  // dict
  schemas.dict = {
    type: 'object',
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
      dictItems: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Dict Items',
        notEmpty: true,
      },
      dictLocales: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Dict Locales',
        notEmpty: true,
      },
    },
  };
  // dict search
  schemas.dictSearch = {
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

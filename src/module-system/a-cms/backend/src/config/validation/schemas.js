module.exports = app => {
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'What to write',
        notEmpty: true,
      },
    },
  };
  // todo search
  schemas.todoSearch = {
    type: 'object',
    properties: {

    },
  };
  return schemas;
};

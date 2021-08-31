module.exports = app => {
  const schemas = {};
  // link
  schemas.link = {
    type: 'object',
    properties: {
      link: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Link',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};

module.exports = app => {
  const schemas = {};
  // link
  schemas.link = {
    type: 'object',
    properties: {
      href: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Link',
        format: 'uri',
        notEmpty: true,
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};

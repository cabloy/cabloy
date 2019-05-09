module.exports = app => {
  const schemas = { };
  // block iframe
  schemas.blockIFrame = {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'URL',
        notEmpty: true,
      },
      width: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Width',
      },
      height: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Height',
      },
    },
  };

  return schemas;
};

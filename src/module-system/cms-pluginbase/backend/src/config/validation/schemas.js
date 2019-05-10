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
        format: 'uri',
        notEmpty: true,
        default: '',
      },
      width: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Width',
        notEmpty: true,
        default: '100%',
      },
      height: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Height',
        notEmpty: true,
        default: '300px',
      },
    },
  };

  return schemas;
};

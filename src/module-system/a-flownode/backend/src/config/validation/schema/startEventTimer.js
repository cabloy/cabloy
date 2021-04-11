module.exports = app => {
  const schemas = {};
  // startEventTimer
  schemas.startEventTimer = {
    type: 'object',
    properties: {
      repeat: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Repeat',
        notEmpty: true,
      },
      bean: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Bean',
        notEmpty: true,
      },
      parameterExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Parameter Expression',
        ebTextarea: true,
      },
    },
  };
  return schemas;
};

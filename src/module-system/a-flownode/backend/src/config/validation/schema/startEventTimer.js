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
      },
      bean: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Bean',
      },
      parameterExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Parameter Expression',
      },
    },
  };
  return schemas;
};

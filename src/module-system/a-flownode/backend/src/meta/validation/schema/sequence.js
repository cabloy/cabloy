module.exports = app => {
  const schemas = {};
  // sequence
  schemas.sequence = {
    type: 'object',
    properties: {
      conditionExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Condition Expression',
        ebParams: {
          textarea: true,
        },
      },
    },
  };
  return schemas;
};

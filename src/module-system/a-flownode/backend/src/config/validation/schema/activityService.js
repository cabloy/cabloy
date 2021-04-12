module.exports = app => {
  const schemas = {};
  // activityService
  schemas.activityService = {
    type: 'object',
    properties: {
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

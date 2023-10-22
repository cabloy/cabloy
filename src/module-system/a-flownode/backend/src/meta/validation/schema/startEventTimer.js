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
        ebType: 'component',
        ebTitle: 'Bean',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderBeanFlowService',
        },
        notEmpty: true,
      },
      parameterExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Parameter Expression',
        ebParams: {
          textarea: true,
        },
      },
    },
  };
  return schemas;
};

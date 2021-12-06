module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // activityService
  schemas.activityService = {
    type: 'object',
    properties: {
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

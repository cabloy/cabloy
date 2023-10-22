module.exports = app => {
  const schemas = {};
  schemas.aliyun = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        notEmpty: true,
      },
      accessKeyId: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'accessKeyId',
        notEmpty: true,
      },
      secretAccessKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'secretAccessKey',
        notEmpty: true,
      },
      endpoint: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'endpoint',
        notEmpty: true,
      },
      apiVersion: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'apiVersion',
        notEmpty: true,
      },
      signName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'signName',
      },
      // Templates Info
      __groupTemplatesInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Templates Info',
      },
      templates: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Templates',
      },
    },
  };
  return schemas;
};

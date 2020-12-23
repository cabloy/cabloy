module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // instance
  schemas.instance = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Subdomain',
        ebReadOnly: true,
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
      },
      config: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Config',
        ebParams: {
          target: '',
          immediate: true,
          actions: [{
            name: 'preview',
            actionModule: moduleInfo.relativeName,
            actionComponent: 'action',
            icon: { material: 'visibility' },
            navigateOptions: { target: '_self' },
          }],
        },
        // notEmpty: true,
      },
    },
  };

  return schemas;
};

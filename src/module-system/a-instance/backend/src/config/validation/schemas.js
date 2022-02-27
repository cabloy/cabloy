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
          actionSave: true,
          actionDone: true,
          actions: [
            {
              name: 'preview',
              actionModule: moduleInfo.relativeName,
              actionComponent: 'action',
              icon: { f7: '::preview' },
              navigateOptions: { target: '_self' },
            },
          ],
        },
        // notEmpty: true,
      },
    },
  };

  return schemas;
};

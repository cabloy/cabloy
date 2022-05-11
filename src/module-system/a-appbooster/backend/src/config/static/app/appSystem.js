module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {},
    },
  };
  const _app = {
    atomName: 'System',
    atomStaticKey: 'appSystem',
    atomRevision: 3,
    atomCategoryId: 'System',
    description: '',
    appIcon: '::menu',
    appIsolate: true,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 1,
  };
  return _app;
};

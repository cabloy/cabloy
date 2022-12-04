module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {},
    },
  };
  const _app = {
    atomName: 'Unclassified',
    atomStaticKey: 'appUnclassified',
    atomRevision: 1,
    atomCategoryId: 'AppCategoryManagement',
    description: '',
    appIcon: '::info-circle',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 1,
  };
  return _app;
};

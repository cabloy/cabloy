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
    atomRevision: 0,
    atomCategoryId: 'System',
    description: '',
    appIcon: '::info-circle',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 2,
  };
  return _app;
};

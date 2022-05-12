module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {},
    },
  };
  const _app = {
    atomName: 'General',
    atomStaticKey: 'appGeneral',
    atomRevision: 0,
    atomCategoryId: 'General',
    description: '',
    appIcon: '::radio-button-unchecked',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {},
    },
  };
  const _app = {
    atomName: 'Community',
    atomStaticKey: 'appCommunity',
    atomRevision: 0,
    atomCategoryId: 'General',
    description: '',
    appIcon: ':outline:article-outline',
    appIsolate: false,
    appLanguage: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};

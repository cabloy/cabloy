module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {},
      authenticated: {
        mobile: {
          menu: {
            layout: 'a-appbooster:layoutAppMenuSystem',
          },
        },
        pc: {
          menu: {
            layout: 'a-appbooster:layoutAppMenuSystem',
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'System',
    atomStaticKey: 'appSystem',
    atomRevision: 2,
    atomCategoryId: 'AppCategorySettings',
    description: '',
    appIcon: '::menu',
    appIsolate: false,
    content: JSON.stringify(content),
    resourceRoles: 'template.system',
    appSorting: 0,
  };
  return _app;
};

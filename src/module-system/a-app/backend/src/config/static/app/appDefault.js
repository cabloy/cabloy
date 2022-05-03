module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          menu: {
            layout: '',
          },
        },
        pc: {
          menu: {
            layout: '',
          },
        },
      },
      authenticated: {
        mobile: {
          menu: {
            layout: '',
          },
        },
        pc: {
          menu: {
            layout: '',
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'Default',
    atomStaticKey: 'appDefault',
    atomRevision: 1,
    description: '',
    appIcon: ':outline:apps-outline',
    appIsolate: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return _app;
};

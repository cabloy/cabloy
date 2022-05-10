module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          user: {
            render: null,
          },
        },
        pc: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          user: {
            render: null,
          },
        },
      },
      authenticated: {
        mobile: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          user: {
            render: null,
          },
        },
        pc: {
          layout: null,
          menu: {
            layout: null,
          },
          home: {
            mode: null,
            dashboard: null,
            page: null,
          },
          user: {
            render: null,
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'Base',
    atomStaticKey: 'appBase',
    atomRevision: 0,
    atomCategoryId: 0,
    description: '',
    appIcon: ':outline:apps-outline',
    appIsolate: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return _app;
};

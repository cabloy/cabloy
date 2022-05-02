module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          layout: 'a-layoutmobile:layoutMobileAnonymous',
          menu: {
            layout: '',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardDefault',
            page: null,
          },
          user: {},
        },
        pc: {
          layout: 'a-layoutpc:layoutPCAnonymous',
          menu: {
            layout: '',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardDefault',
            page: null,
          },
          user: {},
        },
      },
      authenticated: {
        mobile: {
          layout: 'a-layoutmobile:layoutMobile',
          menu: {
            layout: '',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardDefault',
            page: null,
          },
          user: {},
        },
        pc: {
          layout: 'a-layoutpc:layoutPC',
          menu: {
            layout: '',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardDefault',
            page: null,
          },
          user: {},
        },
      },
    },
  };
  const _app = {
    atomName: 'Base',
    atomStaticKey: 'appBase',
    atomRevision: 0,
    description: '',
    appIcon: null,
    appIsolate: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return _app;
};

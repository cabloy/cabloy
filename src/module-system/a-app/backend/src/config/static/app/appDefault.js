module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    presets: {
      anonymous: {
        mobile: {
          layout: 'a-layoutmobile:layoutMobileAnonymous',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardHome',
            page: null,
          },
          mine: {
            layout: 'a-app:layoutAppMineDefault',
          },
        },
        pc: {
          layout: 'a-layoutpc:layoutPCAnonymous',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardHome',
            page: null,
          },
          mine: {
            layout: 'a-app:layoutAppMineDefault',
          },
        },
      },
      authenticated: {
        mobile: {
          layout: 'a-layoutmobile:layoutMobile',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardHome',
            page: null,
          },
          mine: {
            layout: 'a-app:layoutAppMineDefault',
          },
        },
        pc: {
          layout: 'a-layoutpc:layoutPC',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardHome',
            page: null,
          },
          mine: {
            layout: 'a-app:layoutAppMineDefault',
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'Default',
    atomStaticKey: 'appDefault',
    atomRevision: 0,
    atomCategoryId: 0,
    description: '',
    appIcon: ':outline:apps-outline',
    appIsolate: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};

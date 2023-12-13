module.exports = app => {
  // const moduleInfo = module.info;
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
            dashboard: 'a-dashboard:dashboardAnonymous',
            page: null,
          },
          mine: {
            layout: true,
          },
        },
        pc: {
          layout: 'a-layoutpc:layoutPCAnonymous',
          menu: {
            layout: 'a-app:layoutAppMenuDefault',
          },
          home: {
            mode: 'dashboard', // dashboard,page
            dashboard: 'a-dashboard:dashboardAnonymous',
            page: null,
          },
          mine: {
            layout: true,
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
            layout: true,
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
            layout: true,
          },
        },
      },
    },
  };
  const _app = {
    atomName: 'Default',
    atomStaticKey: 'appDefault',
    atomRevision: 3,
    atomCategoryId: 0,
    description: '',
    appIcon: ':outline:apps-outline',
    appIsolate: true,
    appHidden: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
    appSorting: 0,
  };
  return _app;
};

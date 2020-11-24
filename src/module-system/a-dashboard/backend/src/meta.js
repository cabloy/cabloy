module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const staticDashboards = require('./config/static/dashboards.js')(app);
  const meta = {
    base: {
      atoms: {
        dashboard: {
          info: {
            bean: 'dashboard',
            title: 'Dashboard',
            tableName: 'aDashboard',
            tableNameModes: {
              full: 'aDashboardViewFull',
            },
          },
          validator: 'dashboard',
          search: {
            validator: 'dashboardSearch',
          },
        },
      },
      functions: {
        createDashboard: {
          title: 'Create Dashboard',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'dashboard',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listDashboard: {
          title: 'Dashboard List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'dashboard',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
        // widgets
        widgetAbout: {
          title: 'About',
          component: 'widgetAbout',
          menu: 3,
          public: 1,
        },
      },
      statics: {
        'a-dashboard.dashboard': {
          items: staticDashboards,
        },
      },
    },
    validation: {
      validators: {
        dashboard: {
          schemas: 'dashboard',
        },
        dashboardSearch: {
          schemas: 'dashboardSearch',
        },
      },
      keywords: {},
      schemas: {
        dashboard: schemas.dashboard,
        dashboardSearch: schemas.dashboardSearch,
      },
    },
    index: {
      indexes: {
        aDashboard: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const staticDashboards = require('./config/static/dashboards.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
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
            inner: true,
            resource: true,
            comment: false,
            attachment: false,
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'dashboard',
          search: {
            validator: 'dashboardSearch',
          },
        },
      },
      resources: {
        widget: {
          title: 'Dashboard Widget',
        },
      },
      statics: {
        'a-dashboard.dashboard': {
          items: staticDashboards,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    sequence: {
      providers: {
        dashboard: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
  };
  return meta;
};

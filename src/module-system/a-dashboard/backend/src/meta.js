module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  const staticDashboards = require('./meta/static/dashboards.js');
  const staticResources = require('./meta/static/resources.js');
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
              enableOnStatic: null,
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

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        profile: {
          info: {
            bean: 'profile',
            title: 'Dashboard Profile',
            tableName: 'aDashboardProfile',
            tableNameModes: {
              full: 'aDashboardProfileViewFull',
            },
          },
          validator: 'profile',
          search: {
            validator: 'profileSearch',
          },
        },
      },
      functions: {
        createProfile: {
          title: 'CreateDashboardProfile',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'profile',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listProfile: {
          title: 'DashboardProfileList',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'profile',
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
    },
    validation: {
      validators: {
        profile: {
          schemas: 'profile',
        },
        profileSearch: {
          schemas: 'profileSearch',
        },
      },
      keywords: {},
      schemas: {
        profile: schemas.profile,
        profileSearch: schemas.profileSearch,
      },
    },
    index: {
      indexes: {
        aDashboardProfile: 'createdAt,updatedAt,atomId',
      },
    },
  };
  return meta;
};

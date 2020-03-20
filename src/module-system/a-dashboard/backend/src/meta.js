module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
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
      },
      keywords: {},
      schemas: {
      },
    },
    index: {
      indexes: {
        aDashboardProfile: 'createdAt,updatedAt,userId,profileName',
      },
    },
  };
  return meta;
};

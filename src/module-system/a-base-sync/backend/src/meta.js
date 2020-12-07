module.exports = app => {
  // keywords
  const keywords = require('./config/validation/keywords.js')(app);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        resource: {
          info: {
            bean: 'resource',
            title: 'Resource',
            tableName: 'aResource',
            tableNameModes: {
            },
            category: true,
            tag: true,
          },
          actions: {
            enable: {
              code: 101,
              title: 'Enable',
              actionComponent: 'actionResource',
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'archive',
              icon: { material: 'play_arrow' },
            },
            disable: {
              code: 102,
              title: 'Disable',
              actionComponent: 'actionResource',
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'archive',
              icon: { material: 'stop' },
            },
          },
          validator: 'resource',
          search: {
            validator: 'resourceSearch',
          },
        },
      },
      resources: {
        function: {
          title: 'Function',
          validator: null,
        },
        menu: {
          title: 'Menu',
        },
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    sequence: {
      providers: {
        draft: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
        },
        userName: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
        category: {
          schemas: 'category',
        },
        resource: {
          schemas: 'resource',
        },
        resourceSearch: {
          schemas: 'resourceSearch',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas: {
        user: schemas.user,
        category: schemas.category,
        resource: schemas.resource,
        resourceSearch: schemas.resourceSearch,
      },
    },
    event: {
      declarations: {
        loginInfo: 'Login Info',
        userVerify: 'User Verify',
        accountMigration: 'Account Migration',
      },
    },
  };
  return meta;
};

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // keywords
  const keywords = require('./config/validation/keywords.js')(app);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticDicts = require('./config/static/dicts.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const staticRoles = require('./config/static/roles.js')(app);
  // socketio
  const socketioComment = require('./config/socketio/comment.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        resource: {
          info: {
            bean: 'resource',
            title: 'Resource',
            tableName: 'aResource',
            tableNameModes: {},
            category: true,
            tag: true,
            resource: true,
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
          },
          validator: 'resource',
          search: {
            validator: 'resourceSearch',
          },
        },
        role: {
          info: {
            bean: 'role',
            title: 'Role',
            tableName: 'aRole',
            tableNameModes: {},
            resource: true,
            simple: true,
            history: false,
            inner: true,
            fields: {
              custom: ['catalog', 'system', 'roleIdParent'],
            },
            dict: {
              fields: {
                roleTypeCode: {
                  translate: false,
                  // dictKey: 'a-base:dictRoleType',
                },
              },
            },
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
            buildBulk: {
              code: 201,
              title: 'Build',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':outline:build-circle-outline' },
              bulk: true,
              select: false,
              stage: 'formal',
            },
          },
          validator: 'role',
          search: {
            validator: 'roleSearch',
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
        mine: {
          title: 'Mine',
        },
      },
      statics: {
        'a-dict.dict': {
          items: staticDicts,
        },
        'a-base.resource': {
          items: staticResources,
        },
        'a-base.role': {
          items: staticRoles,
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
        role: {
          schemas: 'role',
        },
        roleSearch: {
          schemas: 'roleSearch',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas,
    },
    event: {
      declarations: {
        loginInfo: 'Login Info',
        userVerify: 'User Verify',
        accountMigration: 'Account Migration',
      },
    },
    stats: {
      providers: {
        drafts: {
          user: true,
          bean: 'drafts',
        },
        draftsFlowing: {
          user: true,
          bean: 'draftsFlowing',
        },
        stars: {
          user: true,
          bean: 'stars',
        },
        labels: {
          user: true,
          bean: 'labels',
        },
        starsLabels: {
          user: true,
          bean: 'starsLabels',
          dependencies: ['stars', 'labels'],
          dependents: ['a-user:user'],
        },
      },
    },
    socketio: {
      messages: {
        comment: socketioComment,
      },
    },
  };
  return meta;
};

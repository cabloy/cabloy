module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // atomClasses
  const atomClasses = require('./config/atomClass/atomClasses.js')(app);
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
      atoms: atomClasses,
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
        flowAction: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 10000,
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
        userAdmin: {
          schemas: 'userAdmin',
        },
        userAdminSearch: {
          schemas: 'userAdminSearch',
        },
        userChangeUserName: {
          schemas: 'userChangeUserName',
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
        userAdd: 'User Add',
        userVerify: 'User Verify',
        accountMigration: 'Account Migration',
      },
    },
    stats: {
      providers: {
        drafts: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          inheritNameSub: true,
          dependencies: ['a-base:draftsDrafting', 'a-base:draftsFlowing'],
        },
        draftsDrafting: {
          user: true,
          bean: 'draftsCommon',
        },
        draftsFlowing: {
          user: true,
          bean: 'draftsCommon',
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

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
            tableNameModes: {
              default: 'aResourceView',
            },
            inner: true,
            category: true,
            tag: true,
            resource: true,
            comment: false,
            attachment: false,
            layout: {
              config: {
                atomList: 'a-baseadmin:layoutAtomListResource',
              },
            },
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
            tableNameModes: {
              default: 'aRoleView',
              includes: 'aRoleIncludesView',
              userRoles: 'aRoleUserRolesView',
            },
            resource: true,
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
            dict: {
              fields: {
                roleTypeCode: {
                  translate: false,
                  // dictKey: 'a-base:dictRoleType',
                },
              },
            },
            layout: {
              config: {
                atomList: 'a-baseadmin:layoutAtomListRole',
                atomItem: 'a-baseadmin:layoutAtomItemRole',
              },
            },
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
            delete: {
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
            },
            clone: {
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
            },
            move: {
              code: 101,
              title: 'Move',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':outline:folder-transfer-outline' },
            },
            addChild: {
              code: 102,
              title: 'AddChild',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':outline:add-circle-outline' },
              enableOnStatic: true,
            },
            roleUsers: {
              code: 103,
              title: 'Users',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':outline:group-outline' },
              enableOnStatic: true,
            },
            includes: {
              code: 104,
              title: 'Includes',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':role:role' },
              enableOnStatic: true,
            },
            resourceAuthorizations: {
              code: 105,
              title: 'Resource Authorizations',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':outline:archive-lock-outline' },
              enableOnStatic: true,
            },
            atomAuthorizations: {
              code: 106,
              title: 'Atom Authorizations',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionRole',
              icon: { f7: ':outline:database-lock-outline' },
              enableOnStatic: true,
            },
            // buildBulk: {
            //   code: 201,
            //   title: 'Build',
            //   actionModule: 'a-baseadmin',
            //   actionComponent: 'actionRole',
            //   icon: { f7: ':outline:build-circle-outline' },
            //   bulk: true,
            //   select: false,
            //   stage: 'formal',
            // },
          },
          validator: 'role',
          search: {
            validator: 'roleSearch',
          },
        },
        user: {
          info: {
            bean: 'user',
            title: 'User',
            tableName: 'aUser',
            tableNameModes: {},
            resource: false,
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
            // fields: {
            //   custom: ['disabled', 'anonymous', 'activated', 'emailConfirmed', 'mobileVerified'],
            // },
            layout: {
              config: {
                atomList: 'a-baseadmin:layoutAtomListUser',
                atomItem: 'a-baseadmin:layoutAtomItemUser',
              },
            },
          },
          actions: {
            userRoles: {
              code: 101,
              title: 'Roles',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionUser',
              icon: { f7: ':role:role' },
            },
            resourceAuthorizations: {
              code: 102,
              title: 'Resource Authorizations',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionUser',
              icon: { f7: ':outline:archive-lock-outline' },
            },
            atomAuthorizations: {
              code: 103,
              title: 'Atom Authorizations',
              actionModule: 'a-baseadmin',
              actionComponent: 'actionUser',
              icon: { f7: ':outline:database-lock-outline' },
            },
          },
          validator: 'userAdmin',
          search: {
            validator: 'userAdminSearch',
          },
        },
        roleRight: {
          info: {
            bean: 'roleRight',
            title: 'Atom Right',
            tableName: 'aRoleRight',
            tableNameModes: {
              default: 'aRoleRight',
            },
            inner: true,
            itemOnly: true,
            detail: {
              atomIdMain: 'roleAtomId',
              atomClassMain: {
                module: moduleInfo.relativeName,
                atomClassName: 'role',
              },
            },
            enableRight: false,
            layout: {
              config: {},
            },
          },
          actions: {},
          // validator: 'roleRight',
          // search: {
          //   validator: 'roleRightSearch',
          // },
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

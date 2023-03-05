/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // empty
      }

      if (options.version === 2) {
        // empty
      }

      if (options.version === 3) {
        // empty
      }
    }
  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
  };
  return beans;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  'Atom Right Management': 'Data Right Management',
  AddChild: 'Add Child',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  'Basic Admin': '基础管理',
  'User Management': '用户管理',
  'Role Management': '角色管理',
  'Atom Right Management': '数据权限管理',
  'Resource Right Management': '资源权限管理',
  'Menu Right Management': '菜单权限管理',
  'Function Right Management': '功能权限管理',
  'Auth Management': '认证管理',
  'Menu Management': '菜单管理',
  'Category Management': '目录管理',
  'Tag Management': '标签管理',
  'Select Users': '选择用户',
  Users: '用户',
  Includes: '聚合',
  AddChild: '添加子项',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 386:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {},
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-baseadmin',
              name: 'roleItemLayoutBlockDefaultTitle',
            },
          },
          subnavbar: {
            component: {
              module: 'a-baseadmin',
              name: 'roleItemLayoutBlockDefaultSubnavbar',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Role',
    atomStaticKey: 'layoutAtomItemRole',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 213:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {},
    },
    layouts: {
      base: {
        blocks: {
          title: {
            component: {
              module: 'a-baseadmin',
              name: 'userItemLayoutBlockDefaultTitle',
            },
          },
          subnavbar: {
            component: {
              module: 'a-baseadmin',
              name: 'userItemLayoutBlockDefaultSubnavbar',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'User',
    atomStaticKey: 'layoutAtomItemUser',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 338:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      orders: [
        { name: 'resourceType', title: 'Resource Type', by: 'asc' },
        { name: 'resourceSorting', title: 'Resource Sorting', by: 'asc' },
      ],
    },
    layouts: {
      list: {},
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Atom Name',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                },
              },
              {
                dataIndex: 'resourceType',
                title: 'Resource Type',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record.resourceTypeLocale',
                  },
                },
              },
              {
                dataIndex: 'atomCategoryNameLocale',
                title: 'Category',
                align: 'left',
              },
              {
                dataIndex: 'appKey',
                title: 'App Key',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record.appNameLocale',
                  },
                },
              },
              {
                dataIndex: 'resourceIcon',
                title: 'Icon',
                align: 'left',
                component: {
                  module: 'a-baserender',
                  name: 'renderTableCellIcon',
                  options: {
                    props: {
                      size: 24,
                    },
                  },
                },
              },
              {
                dataIndex: 'userName',
                title: 'Creator',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellUserName',
                },
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'atomUpdatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Resource',
    atomStaticKey: 'layoutAtomListResource',
    atomRevision: 5,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 475:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'tree',
          medium: 'treeTable',
          large: 'treeTable',
        },
      },
      data: {
        adapter: {
          providers: {
            tree: {
              fields: {
                sorting: 'sorting',
              },
              dataSourceAdapter: {
                component: {
                  module: 'a-baseadmin',
                  name: 'roleListLayoutTreeDataSourceAdapter',
                },
              },
            },
          },
        },
      },
    },
    layouts: {
      tree: {},
      treeTable: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Role Name',
                align: 'left',
                width: 300,
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                },
              },
              {
                dataIndex: 'roleTypeCode',
                title: 'Role Type',
                align: 'left',
                params: {
                  computed: {
                    expression: 'record._roleTypeCodeTitleLocale',
                  },
                },
              },
              {
                dataIndex: 'sorting',
                title: 'Sorting',
                align: 'left',
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Created Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
              {
                dataIndex: 'atomUpdatedAt',
                title: 'Modification Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Role',
    atomStaticKey: 'layoutAtomListRole',
    atomRevision: 4,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 916:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      ordersBase: [
        //
        { name: 'atomCreatedAt', title: 'Join Time', by: 'desc', tableAlias: '', default: true },
        { name: 'atomName', title: 'Username', tableAlias: 'a' },
      ],
    },
    layouts: {
      base: {
        extend: {
          component: {
            module: 'a-baseadmin',
            name: 'userListLayoutExtend',
          },
        },
      },
      table: {
        blocks: {
          items: {
            columns: [
              {
                dataIndex: 'atomName',
                title: 'Username',
                align: 'left',
                component: {
                  module: 'a-baselayout',
                  name: 'listLayoutTableCellAtomName',
                  options: {
                    props: {
                      mapper: {
                        avatar: true,
                      },
                    },
                  },
                },
              },
              {
                dataIndex: 'realName',
                title: 'Realname',
                align: 'left',
              },
              {
                dataIndex: 'email',
                title: 'Email',
                align: 'left',
              },
              {
                dataIndex: 'mobile',
                title: 'Mobile',
                align: 'left',
              },
              {
                dataIndex: 'locale',
                title: 'Locale',
                align: 'left',
              },
              {
                dataIndex: 'atomCreatedAt',
                title: 'Join Time',
                align: 'center',
                params: {
                  dateFormat: {
                    lines: true,
                  },
                },
              },
            ],
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'User',
    atomStaticKey: 'layoutAtomListUser',
    atomRevision: 0,
    description: '',
    layoutTypeCode: 3,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 512:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const layoutAtomItemRole = __webpack_require__(386);
const layoutAtomListRole = __webpack_require__(475);
const layoutAtomItemUser = __webpack_require__(213);
const layoutAtomListUser = __webpack_require__(916);
const layoutAtomListResource = __webpack_require__(338);

module.exports = app => {
  const layouts = [
    layoutAtomItemRole(app), //
    layoutAtomListRole(app),
    layoutAtomItemUser(app),
    layoutAtomListUser(app),
    layoutAtomListResource(app),
  ];
  return layouts;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Role Management',
      atomStaticKey: 'roleManagement',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: 'a-base',
        atomClassName: 'role',
        atomAction: 'read',
      }),
      resourceIcon: ':role:role',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 1,
    },
    {
      atomName: 'User Management',
      atomStaticKey: 'userManagement',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: 'a-base',
        atomClassName: 'user',
        atomAction: 'read',
      }),
      resourceIcon: '::person',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 2,
    },
    // function
    // deprecated
    {
      atomName: 'User Management',
      atomStaticKey: 'user',
      atomRevision: -1,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/user/list',
      }),
      resourceRoles: 'template.system',
    },
    // deprecated
    {
      atomName: 'Role Management',
      atomStaticKey: 'role',
      atomRevision: -1,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/role/list',
      }),
      resourceRoles: 'template.system',
    },
    // deprecated
    {
      atomName: 'Atom Right Management',
      atomStaticKey: 'atomRight',
      atomRevision: -1,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/atomRight/list',
      }),
      resourceRoles: 'template.system',
    },
    // deprecated
    {
      atomName: 'Resource Right Management',
      atomStaticKey: 'resourceRight',
      atomRevision: -1,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/resourceRight/list',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'Auth Management',
      atomStaticKey: 'auth',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/auth/list',
      }),
      resourceIcon: ':role:shield-key',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 3,
    },
    {
      atomName: 'Category Management',
      atomStaticKey: 'category',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/category/management',
      }),
      resourceIcon: '::folder-open',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 4,
    },
    {
      atomName: 'Tag Management',
      atomStaticKey: 'tag',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicAdmin',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        actionPath: '/a/baseadmin/tag/management',
      }),
      resourceIcon: ':outline:label-outline',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
      resourceSorting: 5,
    },
    // deprecated
    {
      atomName: 'Select Users',
      atomStaticKey: 'selectUsers',
      atomRevision: -1,
      atomCategoryId: 'a-base:function.Basic',
      resourceType: 'a-base:function',
      resourceConfig: JSON.stringify({}),
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // // role
  // schemas.role = {
  //   type: 'object',
  //   properties: {
  //     roleName: {
  //       type: 'string',
  //       ebType: 'text',
  //       ebTitle: 'Role name',
  //       notEmpty: true,
  //     },
  //     leader: {
  //       type: 'number',
  //       ebType: 'toggle',
  //       ebTitle: 'Leader',
  //     },
  //     sorting: {
  //       type: 'number',
  //       ebType: 'text',
  //       ebTitle: 'Sorting',
  //     },
  //   },
  // };
  // // auth
  // schemas.auth = {
  //   type: 'object',
  //   properties: {
  //     clientID: {
  //       type: 'string',
  //       ebType: 'text',
  //     },
  //     clientSecret: {
  //       type: 'string',
  //       ebType: 'text',
  //     },
  //   },
  // };
  return schemas;
};


/***/ }),

/***/ 457:
/***/ ((module) => {

module.exports = app => {
  class AtomRightController extends app.Controller {
    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.atomRight.rights({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.atomRight.add({
        roleAtomId: this.ctx.request.body.key.atomId,
        atomClass: this.ctx.request.body.atomClass,
        actionCode: this.ctx.request.body.actionCode,
        scopeSelf: this.ctx.request.body.scopeSelf,
        scope: this.ctx.request.body.scope,
        areaKey: this.ctx.request.body.areaKey,
        areaScope: this.ctx.request.body.areaScope,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.atomRight.delete({
        roleAtomId: this.ctx.request.body.key.atomId,
        roleRightId: this.ctx.request.body.roleRightId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.atomRight.spreads({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return AtomRightController;
};


/***/ }),

/***/ 523:
/***/ ((module) => {

module.exports = app => {
  class AuthController extends app.Controller {
    async list() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.auth.list();
      this.ctx.success(res);
    }

    async disable() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.auth.disable({
        id: this.ctx.request.body.id,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.auth.save({
        id: this.ctx.request.body.id,
        config: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }
  }
  return AuthController;
};


/***/ }),

/***/ 406:
/***/ ((module) => {

module.exports = app => {
  class authSceneController extends app.Controller {
    async disable() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.authScene.disable({
        id: this.ctx.request.body.id,
        sceneName: this.ctx.request.body.sceneName,
        disabled: this.ctx.request.body.disabled,
      });
      this.ctx.success(res);
    }

    async save() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.authScene.save({
        id: this.ctx.request.body.id,
        sceneName: this.ctx.request.body.sceneName,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.authScene.add({
        id: this.ctx.request.body.id,
        sceneName: this.ctx.request.body.sceneName,
        data: this.ctx.request.body.data,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.authScene.delete({
        id: this.ctx.request.body.id,
        sceneName: this.ctx.request.body.sceneName,
      });
      this.ctx.success(res);
    }
  }

  return authSceneController;
};


/***/ }),

/***/ 595:
/***/ ((module) => {

module.exports = app => {
  class ResourceRightController extends app.Controller {
    async rights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.resourceRight.rights({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async add() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.resourceRight.add({
        roleAtomId: this.ctx.request.body.key.atomId,
        atomIds: this.ctx.request.body.atomIds,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.resourceRight.delete({
        roleAtomId: this.ctx.request.body.key.atomId,
        atomId: this.ctx.request.body.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async spreads() {
      const page = this.ctx.request.body.page;
      const items = await this.service.resourceRight.spreads({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return ResourceRightController;
};


/***/ }),

/***/ 479:
/***/ ((module) => {

module.exports = app => {
  class RoleController extends app.Controller {
    async childrenTop() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.childrenTop({
        roleTypes: this.ctx.request.body.roleTypes,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async children() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.children({
        roleTypes: this.ctx.request.body.roleTypes,
        roleId: this.ctx.request.body.roleId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async delete() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.delete({
        roleAtomId: this.ctx.request.body.key.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async clone() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.clone({
        roleAtomId: this.ctx.request.body.key.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async move() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.move({
        roleAtomId: this.ctx.request.body.key.atomId,
        roleIdParent: this.ctx.request.body.data.roleIdParent,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async addChild() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.addChild({
        roleAtomId: this.ctx.request.body.key.atomId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async roleUsers() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.roleUsers({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async includes() {
      const page = this.ctx.request.body.page;
      const items = await this.service.role.includes({
        roleAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addUserRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.addUserRole({
        roleAtomId: this.ctx.request.body.key.atomId,
        userId: this.ctx.request.body.userId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async deleteUserRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.deleteUserRole({
        roleAtomId: this.ctx.request.body.key.atomId,
        userId: this.ctx.request.body.userId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async addRoleInc() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.addRoleInc({
        roleAtomId: this.ctx.request.body.key.atomId,
        roleIdInc: this.ctx.request.body.roleIdInc,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async removeRoleInc() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.role.removeRoleInc({
        roleAtomId: this.ctx.request.body.key.atomId,
        roleIdInc: this.ctx.request.body.roleIdInc,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }
  return RoleController;
};


/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = app => {
  class UserController extends app.Controller {
    async select() {
      const page = this.ctx.bean.util.page(this.ctx.request.body.page);
      const items = await this.service.user.select({
        query: this.ctx.request.body.query,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async userRoles() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.userRoles({
        userAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async addUserRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.addUserRole({
        userAtomId: this.ctx.request.body.key.atomId,
        roleId: this.ctx.request.body.roleId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async deleteUserRole() {
      // check demo
      this.ctx.bean.util.checkDemo();
      const res = await this.service.user.deleteUserRole({
        userAtomId: this.ctx.request.body.key.atomId,
        roleId: this.ctx.request.body.roleId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async atomRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.atomRights({
        userAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async resourceRights() {
      const page = this.ctx.request.body.page;
      const items = await this.service.user.resourceRights({
        userAtomId: this.ctx.request.body.key.atomId,
        page,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, page.index, page.size);
    }
  }
  return UserController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const role = __webpack_require__(479);
const user = __webpack_require__(37);
const atomRight = __webpack_require__(457);
const resourceRight = __webpack_require__(595);
const auth = __webpack_require__(523);
const authScene = __webpack_require__(406);

module.exports = app => {
  const controllers = {
    role,
    user,
    atomRight,
    resourceRight,
    auth,
    authScene,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
module.exports = app => {
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  // schemas
  const schemas = __webpack_require__(232)(app);
  // static
  const staticLayouts = __webpack_require__(512)(app);
  const staticResources = __webpack_require__(429)(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas: {},
    },
  };

  return meta;
};


/***/ }),

/***/ 842:
/***/ ((module) => {

module.exports = app => {
  class AuthProvider extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAuthProvider', options: { disableDeleted: true } });
    }
  }

  return AuthProvider;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const authProvider = __webpack_require__(842);

module.exports = app => {
  const models = {
    authProvider,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // role/childrenTop
    {
      method: 'post',
      path: 'role/childrenTop',
      controller: 'role',
    },
    // role/children
    {
      method: 'post',
      path: 'role/children',
      controller: 'role',
    },
    // role/delete
    {
      method: 'post',
      path: 'role/delete',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'delete' } },
    },
    // role/clone
    {
      method: 'post',
      path: 'role/clone',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'clone' } },
    },
    // role/move
    {
      method: 'post',
      path: 'role/move',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'move' } },
    },
    // role/addChild
    {
      method: 'post',
      path: 'role/addChild',
      controller: 'role',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'addChild' } },
    },
    // role/roleUsers
    {
      method: 'post',
      path: 'role/roleUsers',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'roleUsers' } },
    },
    // role/addUserRole
    {
      method: 'post',
      path: 'role/addUserRole',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'roleUsers' } },
    },
    // role/deleteUserRole
    {
      method: 'post',
      path: 'role/deleteUserRole',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'roleUsers' } },
    },
    // role/includes
    {
      method: 'post',
      path: 'role/includes',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'includes' } },
    },
    // role/addRoleInc
    {
      method: 'post',
      path: 'role/addRoleInc',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'includes' } },
    },
    {
      method: 'post',
      path: 'role/removeRoleInc',
      controller: 'role',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'includes' } },
    },
    // resourceRight
    {
      method: 'post',
      path: 'resourceRight/rights',
      controller: 'resourceRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
    },
    {
      method: 'post',
      path: 'resourceRight/add',
      controller: 'resourceRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
    },
    {
      method: 'post',
      path: 'resourceRight/delete',
      controller: 'resourceRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
    },
    {
      method: 'post',
      path: 'resourceRight/spreads',
      controller: 'resourceRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'resourceAuthorizations' } },
    },
    // atomRight
    {
      method: 'post',
      path: 'atomRight/rights',
      controller: 'atomRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
    },
    {
      method: 'post',
      path: 'atomRight/add',
      controller: 'atomRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations', atomClassForce: false } },
    },
    {
      method: 'post',
      path: 'atomRight/delete',
      controller: 'atomRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
    },
    {
      method: 'post',
      path: 'atomRight/spreads',
      controller: 'atomRight',
      meta: { right: { type: 'atom', atomClass: 'a-base:role', action: 'atomAuthorizations' } },
    },
    // user/select
    {
      method: 'post',
      path: 'user/select',
      controller: 'user',
    },
    // user/userRoles
    {
      method: 'post',
      path: 'user/userRoles',
      controller: 'user',
      meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'userRoles' } },
    },
    // user/addUserRole
    {
      method: 'post',
      path: 'user/addUserRole',
      controller: 'user',
      meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'userRoles' } },
    },
    // role/deleteUserRole
    {
      method: 'post',
      path: 'user/deleteUserRole',
      controller: 'user',
      meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'userRoles' } },
    },
    {
      method: 'post',
      path: 'user/atomRights',
      controller: 'user',
      meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'atomAuthorizations' } },
    },
    {
      method: 'post',
      path: 'user/resourceRights',
      controller: 'user',
      meta: { right: { type: 'atom', atomClass: 'a-base:user', action: 'resourceAuthorizations' } },
    },
    // auth
    { method: 'post', path: 'auth/list', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/disable', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    { method: 'post', path: 'auth/save', controller: 'auth', meta: { right: { type: 'resource', name: 'auth' } } },
    // auth scene
    {
      method: 'post',
      path: 'authScene/disable',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
    {
      method: 'post',
      path: 'authScene/save',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
    {
      method: 'post',
      path: 'authScene/add',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
    {
      method: 'post',
      path: 'authScene/delete',
      controller: 'authScene',
      meta: { right: { type: 'resource', name: 'auth' } },
    },
  ];
  return routes;
};


/***/ }),

/***/ 580:
/***/ ((module) => {

module.exports = app => {
  class AtomRight extends app.Service {
    async rights({ roleAtomId, page, user }) {
      return await this.ctx.bean.role.roleRights({ roleAtomId, page, user });
    }

    async add({ roleAtomId, atomClass, actionCode, scopeSelf, scope, areaKey, areaScope, user }) {
      const _atomClass = await this.ctx.bean.atomClass.get(atomClass);
      if (scopeSelf) {
        scope = 0;
      }
      return await this.ctx.bean.role.addRoleRight({
        roleAtomId,
        atomClassId: _atomClass.id,
        action: actionCode,
        scope,
        areaKey,
        areaScope,
        user,
      });
    }

    async delete({ roleAtomId, roleRightId, user }) {
      return await this.ctx.bean.role.deleteRoleRight({ roleAtomId, roleRightId, user });
    }

    async spreads({ roleAtomId, page, user }) {
      return await this.ctx.bean.role.roleSpreads({ roleAtomId, page, user });
    }
  }

  return AtomRight;
};


/***/ }),

/***/ 300:
/***/ ((module) => {

module.exports = app => {
  class Auth extends app.Service {
    async list() {
      return this.ctx.bean.authProviderCache.getAuthProvidersConfigForAdmin();
    }

    async disable({ id, disabled }) {
      // update
      await this.ctx.model.authProvider.update({ id, disabled });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // changed
      await this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }

    async save({ id, config }) {
      // update
      await this.ctx.model.authProvider.update({ id, config: JSON.stringify(config) });
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // changed
      await this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }
  }

  return Auth;
};


/***/ }),

/***/ 936:
/***/ ((module) => {

module.exports = app => {
  class authScene extends app.Service {
    async disable({ id, sceneName, disabled }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // update
      const scenes = item.scenes ? JSON.parse(item.scenes) : {};
      if (!scenes[sceneName]) {
        scenes[sceneName] = {};
      }
      scenes[sceneName].disabled = disabled;
      item.scenes = JSON.stringify(scenes);
      await this.ctx.model.authProvider.update(item);
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }

    async save({ id, sceneName, data }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      const authProvider = this.ctx.bean.authProvider.getAuthProviderBase({
        module: item.module,
        providerName: item.providerName,
      });
      // validate data
      const meta = authProvider.meta;
      const metaScene = this._getMetaScene(authProvider, sceneName);
      if (metaScene.validator.validator !== 'json') {
        await this.ctx.bean.validation.validate({
          module: metaScene.validator.module,
          validator: metaScene.validator.validator,
          data,
          filterOptions: true,
        });
      }
      // update
      if (!meta.scene) {
        item.config = JSON.stringify(data);
      } else {
        const scenes = item.scenes ? JSON.parse(item.scenes) : {};
        if (!scenes[sceneName]) {
          scenes[sceneName] = {};
        }
        scenes[sceneName] = {
          ...data,
          disabled: scenes[sceneName].disabled,
        };
        item.scenes = JSON.stringify(scenes);
      }
      await this.ctx.model.authProvider.update(item);
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
      // ok
      return { data };
    }

    async add({ id, sceneName, data }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // update
      const scenes = item.scenes ? JSON.parse(item.scenes) : {};
      scenes[sceneName] = data;
      item.scenes = JSON.stringify(scenes);
      await this.ctx.model.authProvider.update(item);
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }

    async delete({ id, sceneName }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      // update
      const scenes = item.scenes ? JSON.parse(item.scenes) : {};
      delete scenes[sceneName];
      item.scenes = JSON.stringify(scenes);
      await this.ctx.model.authProvider.update(item);
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }

    _getMetaScene(item, sceneName) {
      const meta = item.meta;
      if (meta.scene) {
        const scene = item.scenes && item.scenes[sceneName];
        return (scene && scene.meta) || meta;
      }
      return meta;
    }
  }

  return authScene;
};


/***/ }),

/***/ 510:
/***/ ((module) => {

module.exports = app => {
  class ResourceRight extends app.Service {
    async rights({ roleAtomId, page, user }) {
      return await this.ctx.bean.resource.resourceRights({ roleAtomId, page, user });
    }

    async add({ roleAtomId, atomIds, user }) {
      return await this.ctx.bean.resource.addResourceRoles({ roleAtomId, atomIds, user });
    }

    async delete({ roleAtomId, atomId, user }) {
      return await this.ctx.bean.resource.deleteResourceRole({ roleAtomId, atomId, user });
    }

    async spreads({ roleAtomId, page, user }) {
      return await this.ctx.bean.resource.resourceSpreads({ roleAtomId, page, user });
    }
  }

  return ResourceRight;
};


/***/ }),

/***/ 889:
/***/ ((module) => {

module.exports = app => {
  class Role extends app.Service {
    async childrenTop({ roleTypes, page, user }) {
      return await this.ctx.bean.role.childrenTop({ roleTypes, page, user });
    }

    async children({ roleTypes, roleId, page, user }) {
      return await this.ctx.bean.role.children({ roleTypes, roleId, page, user });
    }

    async delete({ roleAtomId, user }) {
      await this.ctx.bean.role.delete({ roleAtomId, user });
      const progressId = await this._tailBuild();
      return { progressId };
    }

    async clone({ roleAtomId, user }) {
      const res = await this.ctx.bean.role.clone({ roleAtomId, user });
      const progressId = await this._tailBuild();
      return { ...res, progressId };
    }

    async move({ roleAtomId, roleIdParent, user }) {
      await this.ctx.bean.role.move({ roleAtomId, roleIdParent, user });
      const progressId = await this._tailBuild();
      return { progressId };
    }

    async addChild({ roleAtomId, user }) {
      const res = await this.ctx.bean.role.addChild({ roleAtomId, user });
      const progressId = await this._tailBuild();
      return { ...res, progressId };
    }

    async roleUsers({ roleAtomId, page, user }) {
      return await this.ctx.bean.role.roleUsers({ roleAtomId, page, user });
    }

    async addUserRole({ roleAtomId, userId, user }) {
      return await this.ctx.bean.role.addUserRole({ roleAtomId, userId, user });
    }

    async deleteUserRole({ roleAtomId, userId, user }) {
      return await this.ctx.bean.role.deleteUserRole({ roleAtomId, userId, user });
    }

    async includes({ roleAtomId, page, user }) {
      return await this.ctx.bean.role.includes({ roleAtomId, page, user });
    }

    async addRoleInc({ roleAtomId, roleIdInc, user }) {
      const res = await this.ctx.bean.role.addRoleInc({ roleAtomId, roleIdInc, user });
      const progressId = await this._tailBuild();
      return { ...res, progressId };
    }

    async removeRoleInc({ roleAtomId, roleIdInc, user }) {
      await this.ctx.bean.role.removeRoleInc({ roleAtomId, roleIdInc, user });
      const progressId = await this._tailBuild();
      return { progressId };
    }

    async _tailBuild() {
      const progressId = await this.ctx.bean.progress.create();
      // build, not await
      this.ctx.bean.role.build({ progressId });
      return progressId;
    }
  }

  return Role;
};


/***/ }),

/***/ 323:
/***/ ((module) => {

module.exports = app => {
  class User extends app.Service {
    async select({ query, page, user }) {
      return await this.ctx.bean.user.selectGeneral({ params: { query, page }, user });
    }

    async userRoles({ userAtomId, page, user }) {
      return await this.ctx.bean.role.userRoles({ userAtomId, page, user });
    }

    async addUserRole({ userAtomId, roleId, user }) {
      return await this.ctx.bean.role.addUserRole({ userAtomId, roleId, user });
    }

    async deleteUserRole({ userAtomId, roleId, user }) {
      return await this.ctx.bean.role.deleteUserRole({ userAtomId, roleId, user });
    }

    async atomRights({ userAtomId, page, user }) {
      return await this.ctx.bean.role.atomRightsOfUser({ userAtomId, page, user });
    }

    async resourceRights({ userAtomId, page, user }) {
      return await this.ctx.bean.resource.resourceRightsOfUser({ userAtomId, page, user });
    }
  }

  return User;
};


/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const role = __webpack_require__(889);
const user = __webpack_require__(323);
const atomRight = __webpack_require__(580);
const resourceRight = __webpack_require__(510);
const auth = __webpack_require__(300);
const authScene = __webpack_require__(936);

module.exports = app => {
  const services = {
    role,
    user,
    atomRight,
    resourceRight,
    auth,
    authScene,
  };
  return services;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map
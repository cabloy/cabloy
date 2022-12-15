/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ 72:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 827:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          view: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
          edit: {
            small: 'default',
            medium: 'default',
            large: 'default',
          },
        },
      },
      attachment: null, // null/true/false
      comment: null, // null/true/false
    },
    layouts: {
      base: {
        blocks: {
          caption: {
            component: {
              module: 'a-baselayout',
              name: 'itemLayoutBlockDefaultCaption',
            },
          },
        },
      },
      default: {
        title: 'LayoutInfo',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutDefault',
        },
        subnavbar: {
          policyDefault: true,
        },
      },
      content: {
        title: 'LayoutContent',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutDefault',
        },
        subnavbar: {
          policyDefault: true,
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAtomItemBase',
    atomRevision: 2,
    description: '',
    layoutTypeCode: 4,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};


/***/ }),

/***/ 922:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'table',
          large: 'table',
        },
      },
      ordersBase: [
        { name: 'atomCreatedAt', title: 'Created Time', by: 'desc', tableAlias: '' },
        { name: 'atomUpdatedAt', title: 'Modification Time', by: 'desc', tableAlias: '' },
        { name: 'atomName', title: 'Atom Name', by: 'asc', tableAlias: 'a' },
      ],
      orders: [],
      filter: {
        actionPath: '/a/baselayout/listLayoutFilter',
        tabs: {
          basic: {
            schema: {
              module: 'a-baselayout',
              schema: 'filterTabBasic',
            },
          },
          general: {
            schema: {
              module: 'a-baselayout',
              schema: 'filterTabGeneral',
            },
          },
        },
      },
      export: {
        fields: [
          { name: 'atomName', title: 'AtomName' },
          { name: 'userName', title: 'Creator' },
          { name: 'atomCreatedAt', title: 'Created Time' },
          { name: 'atomUpdatedAt', title: 'Modification Time' },
        ],
      },
    },
    layouts: {
      base: {
        blocks: {
          caption: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListCaption',
            },
          },
          title: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListTitle',
            },
          },
          subnavbar: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListSubnavbar',
            },
          },
        },
      },
      card: {
        title: 'LayoutCard',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        subnavbar: {
          policyDefault: true,
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockCardItems',
            },
          },
          item: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockCardItem',
            },
          },
          itemHeader: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListItem',
            },
            summary: false,
          },
        },
      },
      list: {
        title: 'LayoutList',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        subnavbar: {
          policyDefault: true,
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockListItems',
            },
          },
          item: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockListItem',
            },
          },
        },
      },
      table: {
        title: 'LayoutTable',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutTable',
        },
        subnavbar: {
          policyDefault: true,
        },
        blocks: {
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
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
          bottombar: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableBottombar',
            },
          },
        },
      },
      tree: {
        title: 'LayoutTree',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutTree',
        },
        subnavbar: false,
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockTreeTitle',
            },
          },
          items: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockTreeItems',
            },
          },
        },
      },
      treeTable: {
        title: 'LayoutTreeTable',
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutTreeTable',
        },
        subnavbar: false,
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockTreeTitle',
            },
          },
          items: {
            component: {
              module: 'a-baselayout',
              name: 'baseLayoutBlockTableItems',
            },
            sorter: false,
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
          bottombar: false,
        },
      },
      select: {
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        subnavbar: {
          policyDefault: true,
        },
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockSelectTitle',
            },
          },
          items: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockSelectItems',
            },
          },
        },
      },
      selecting: {
        component: {
          module: 'a-baselayout',
          name: 'baseLayoutList',
        },
        subnavbar: {
          policyDefault: true,
        },
        blocks: {
          title: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockSelectingTitle',
            },
          },
          items: {
            component: {
              module: 'a-baselayout',
              name: 'listLayoutBlockSelectingItems',
            },
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutAtomListBase',
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

const layoutAtomItemBase = __webpack_require__(827);
const layoutAtomListBase = __webpack_require__(922);

module.exports = app => {
  const layouts = [layoutAtomItemBase(app), layoutAtomListBase(app)];
  return layouts;
};


/***/ }),

/***/ 95:
/***/ ((module) => {

module.exports = app => {
  const controllers = {};
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const routes = __webpack_require__(825);
const services = __webpack_require__(214);
const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

// eslint-disable-next-line
module.exports = app => {
  // meta
  const meta = __webpack_require__(458)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  return {
    routes,
    controllers,
    services,
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
  const staticLayouts = __webpack_require__(512)(app);
  // meta
  const meta = {
    base: {
      statics: {
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = [];


/***/ }),

/***/ 214:
/***/ ((module) => {

module.exports = {};


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
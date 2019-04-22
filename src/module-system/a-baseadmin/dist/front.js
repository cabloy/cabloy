module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/list.vue?vue&type=template&id=99bcc6be&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClick(node)}}},[_vm._v(_vm._s(node.text))])}}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/role/list.vue?vue&type=template&id=99bcc6be&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/list.vue?vue&type=script&lang=js&
/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    roleIdStart: {
      type: Number
    }
  },
  data: function data() {
    var _this = this;

    return {
      treeOptions: {
        fetchData: function fetchData(node) {
          return _this.fetchChildren(node.id);
        }
      }
    };
  },
  computed: {
    tree: function tree() {
      return this.$refs.tree;
    }
  },
  methods: {
    fetchChildren: function fetchChildren(roleId) {
      var _this2 = this;

      if (roleId === 'root') roleId = this.roleIdStart;
      return this.$api.post('role/children', {
        roleId: roleId,
        page: {
          size: 0
        }
      }).then(function (data) {
        var list = data.list.map(function (item) {
          var node = {
            id: item.id,
            text: item.roleName || '[New Role]',
            data: item,
            showChildren: item.catalog === 1,
            isBatch: item.catalog === 1
          };
          return node;
        });
        return list;
      })["catch"](function (err) {
        _this2.$view.toast.show({
          text: err.message
        });
      });
    },
    onNodeClick: function onNodeClick(node) {
      this.$emit('node:click', node);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/role/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/role/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/list.vue?vue&type=template&id=09c9b8f0&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.userName,"eb-href":("user/view?userId=" + (item.id)),"swipeout":""}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.realName && item.realName!==item.userName)?_c('f7-badge',[_vm._v(_vm._s(item.realName))]):_vm._e(),_vm._v(" "),(item.mobile)?_c('f7-badge',[_vm._v(_vm._s(item.mobile))]):_vm._e(),_vm._v(" "),(item.disabled===1)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Disabled')))]):_vm._e()],1),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[(item.disabled===0)?_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDisable}},[_vm._v(_vm._s(_vm.$text('Disable')))]):_vm._e(),_vm._v(" "),(item.disabled===1)?_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformEnable}},[_vm._v(_vm._s(_vm.$text('Enable')))]):_vm._e(),_vm._v(" "),_c('div',{attrs:{"color":"yellow","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])])],1)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/user/list.vue?vue&type=template&id=09c9b8f0&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/list.vue?vue&type=script&lang=js&
/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    roleId: {
      type: Number
    }
  },
  data: function data() {
    return {
      items: [],
      query: ''
    };
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('user:disable', this.onUserDisable);
    this.$meta.eventHub.$on('user:delete', this.onUserDelete);
    this.$meta.eventHub.$on('user:addRole', this.onUserAddRole);
    this.$meta.eventHub.$on('user:removeRole', this.onUserRemoveRole);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('user:disable', this.onUserDisable);
    this.$meta.eventHub.$off('user:delete', this.onUserDelete);
    this.$meta.eventHub.$off('user:addRole', this.onUserAddRole);
    this.$meta.eventHub.$off('user:removeRole', this.onUserRemoveRole);
  },
  methods: {
    onSearch: function onSearch(query) {
      this.query = query;

      if (!this.query) {
        this.items = [];
      } else {
        this.reload(true);
      }
    },
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      var params = {
        roleId: this.roleId,
        query: this.query,
        page: {
          index: index
        }
      };
      if (!this.roleId) params.anonymous = 0;
      return this.$api.post('user/list', params).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformDisable: function onPerformDisable(event, item) {
      return this.disableUser(event, item, 1);
    },
    onPerformEnable: function onPerformEnable(event, item) {
      return this.disableUser(event, item, 0);
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post('user/delete', {
          userId: item.id
        }).then(function () {
          _this2.$meta.eventHub.$emit('user:delete', {
            userId: item.id
          });

          _this2.$meta.util.swipeoutDelete(event.target);

          return true;
        });
      });
    },
    disableUser: function disableUser(event, item, disabled) {
      var _this3 = this;

      return this.$api.post('user/disable', {
        userId: item.id,
        disabled: disabled
      }).then(function () {
        _this3.$meta.eventHub.$emit('user:disable', {
          userId: item.id,
          disabled: disabled
        });

        _this3.$meta.util.swipeoutClose(event.target);

        return true;
      });
    },
    onUserDisable: function onUserDisable(data) {
      var item = this.items.find(function (item) {
        return item.id === data.userId;
      });
      if (item) item.disabled = data.disabled;
    },
    onUserDelete: function onUserDelete(data) {
      var index = this.items.findIndex(function (item) {
        return item.id === data.userId;
      });
      if (index > -1) this.items.splice(index, 1);
    },
    onUserAddRole: function onUserAddRole(data) {
      if (data.roleId === this.roleId) this.reload();
    },
    onUserRemoveRole: function onUserRemoveRole(data) {
      if (data.roleId === this.roleId) {
        var index = this.items.findIndex(function (item) {
          return item.id === data.userId;
        });
        if (index > -1) this.items.splice(index, 1);
      }
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/user/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/user/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "09c9b8f0",
  null
  
)

/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/spreads.vue?vue&type=template&id=09f80252&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":((group.atomClassTitle) + " [" + (group.moduleTitle) + "]"),"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:((item.roleExpandId) + ":" + (item.roleRightId)),staticClass:"item",attrs:{"title":item.actionName}},[_c('div',{staticClass:"header",attrs:{"slot":"root-start"},slot:"root-start"},[_c('div'),_vm._v(" "),_c('div',[_vm._v(_vm._s(_vm.$text('from'))+": "+_vm._s(item.roleName))])]),_vm._v(" "),_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.actionCode!==1 && item.scope==='0')?_c('f7-badge',[_vm._v("Self")]):_vm._e(),_vm._v(" "),(item.scopeRoles)?_vm._l((item.scopeRoles),function(scopeRole){return _c('f7-badge',{key:scopeRole.id},[_vm._v(_vm._s(scopeRole.roleName))])}):_vm._e()],2)])})],2)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atomRight/spreads.vue?vue&type=template&id=09f80252&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/spreads.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
var ebAtomClasses = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebAtomClasses;
/* harmony default export */ var spreadsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  mixins: [ebModules, ebAtomClasses],
  props: {
    role: {
      type: Object
    },
    user: {
      type: Object
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  computed: {
    itemGroups: function itemGroups() {
      var modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      var atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];
      if (!this.items) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          var groupName = "".concat(item.module, ".").concat(item.atomClassName);

          if (!group || group.id !== groupName) {
            var module = this.getModule(item.module);
            var atomClass = this.getAtomClass(item);
            group = {
              id: groupName,
              atomClassTitle: atomClass.titleLocale,
              moduleTitle: module.titleLocale,
              items: []
            };
            groups.push(group);
          }

          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return groups;
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('atomRight:add', this.onAtomRightAdd);
    this.$meta.eventHub.$on('atomRight:delete', this.onAtomRightDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('atomRight:add', this.onAtomRightAdd);
    this.$meta.eventHub.$off('atomRight:delete', this.onAtomRightDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;

      if (this.role) {
        return this.$api.post('atomRight/spreads', {
          roleId: this.role.id,
          page: {
            index: index
          }
        }).then(function (data) {
          _this.items = _this.items.concat(data.list);
          return data;
        });
      }

      return this.$api.post('user/atomRights', {
        userId: this.user.id,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onAtomRightAdd: function onAtomRightAdd(data) {
      this.reload();
    },
    onAtomRightDelete: function onAtomRightDelete(data) {
      this.reload();
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/atomRight/spreads.vue?vue&type=script&lang=js&
 /* harmony default export */ var atomRight_spreadsvue_type_script_lang_js_ = (spreadsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/components/atomRight/spreads.vue?vue&type=style&index=0&id=09f80252&lang=less&scoped=true&
var spreadsvue_type_style_index_0_id_09f80252_lang_less_scoped_true_ = __webpack_require__(18);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/atomRight/spreads.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atomRight_spreadsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "09f80252",
  null
  
)

/* harmony default export */ var spreads = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/spreads.vue?vue&type=template&id=e560f528&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.moduleTitle,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:((item.roleExpandId) + ":" + (item.roleFunctionId)),attrs:{"title":item.titleLocale || item.title}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('div',[_vm._v(_vm._s(_vm.$text('from'))+": "+_vm._s(item.roleName))])])])})],2)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/functionRight/spreads.vue?vue&type=template&id=e560f528&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/spreads.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
/* harmony default export */ var spreadsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  mixins: [ebModules],
  props: {
    role: {
      type: Object
    },
    user: {
      type: Object
    },
    menu: {
      type: Number
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  computed: {
    itemGroups: function itemGroups() {
      var modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      if (!this.items) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          var groupName = item.module;

          if (!group || group.id !== groupName) {
            var module = this.getModule(item.module);
            group = {
              id: groupName,
              moduleTitle: module.titleLocale,
              items: []
            };
            groups.push(group);
          }

          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return groups;
    },
    apiPath: function apiPath() {
      return this.menu === 1 ? 'menuRight' : 'functionRight';
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('functionRight:add', this.onFunctionRightAdd);
    this.$meta.eventHub.$on('functionRight:delete', this.onFunctionRightDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('functionRight:add', this.onFunctionRightAdd);
    this.$meta.eventHub.$off('functionRight:delete', this.onFunctionRightDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;

      if (this.role) {
        return this.$api.post("".concat(this.apiPath, "/spreads"), {
          roleId: this.role.id,
          menu: this.menu,
          page: {
            index: index
          }
        }).then(function (data) {
          _this.items = _this.items.concat(data.list);
          return data;
        });
      }

      return this.$api.post('user/functionRights', {
        userId: this.user.id,
        menu: this.menu,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onFunctionRightAdd: function onFunctionRightAdd(data) {
      this.reload();
    },
    onFunctionRightDelete: function onFunctionRightDelete(data) {
      this.reload();
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/functionRight/spreads.vue?vue&type=script&lang=js&
 /* harmony default export */ var functionRight_spreadsvue_type_script_lang_js_ = (spreadsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/functionRight/spreads.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  functionRight_spreadsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "e560f528",
  null
  
)

/* harmony default export */ var spreads = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/rights.vue?vue&type=template&id=29a4e73c&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.moduleTitle,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"title":item.titleLocale || item.title,"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])])],1)})],2)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/functionRight/rights.vue?vue&type=template&id=29a4e73c&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/rights.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
/* harmony default export */ var rightsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  mixins: [ebModules],
  props: {
    role: {
      type: Object
    },
    menu: {
      type: Number
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  computed: {
    itemGroups: function itemGroups() {
      var modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      if (!this.items) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          var groupName = item.module;

          if (!group || group.id !== groupName) {
            var module = this.getModule(item.module);
            group = {
              id: groupName,
              moduleTitle: module.titleLocale,
              items: []
            };
            groups.push(group);
          }

          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return groups;
    },
    apiPath: function apiPath() {
      return this.menu === 1 ? 'menuRight' : 'functionRight';
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('functionRight:add', this.onFunctionRightAdd);
    this.$meta.eventHub.$on('functionRight:delete', this.onFunctionRightDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('functionRight:add', this.onFunctionRightAdd);
    this.$meta.eventHub.$off('functionRight:delete', this.onFunctionRightDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      return this.$api.post("".concat(this.apiPath, "/rights"), {
        roleId: this.role.id,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      this.$view.navigate("/a/baseadmin/functionRight/add?roleId=".concat(this.role.id, "&menu=").concat(this.menu));
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post("".concat(_this2.apiPath, "/delete"), {
          id: item.id
        }).then(function () {
          _this2.$meta.eventHub.$emit('functionRight:delete', {
            id: item.id,
            roleId: _this2.role.id
          });

          _this2.$meta.util.swipeoutDelete(event.target);

          return true;
        });
      });
    },
    onFunctionRightAdd: function onFunctionRightAdd(data) {
      this.reload();
    },
    onFunctionRightDelete: function onFunctionRightDelete(data) {
      var index = this.items.findIndex(function (item) {
        return item.id === data.id;
      });
      if (index > -1) this.items.splice(index, 1);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/functionRight/rights.vue?vue&type=script&lang=js&
 /* harmony default export */ var functionRight_rightsvue_type_script_lang_js_ = (rightsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/functionRight/rights.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  functionRight_rightsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "29a4e73c",
  null
  
)

/* harmony default export */ var rights = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/rights.vue?vue&type=template&id=93626dca&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":((group.atomClassTitle) + " [" + (group.moduleTitle) + "]"),"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"title":item.actionName,"swipeout":""}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.action!==1 && item.scope==='0')?_c('f7-badge',[_vm._v("Self")]):_vm._e(),_vm._v(" "),(item.scopeRoles)?_vm._l((item.scopeRoles),function(scopeRole){return _c('f7-badge',{key:scopeRole.id},[_vm._v(_vm._s(scopeRole.roleName))])}):_vm._e()],2),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])])],1)})],2)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atomRight/rights.vue?vue&type=template&id=93626dca&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/rights.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
var ebAtomClasses = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebAtomClasses;
/* harmony default export */ var rightsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  mixins: [ebModules, ebAtomClasses],
  props: {
    role: {
      type: Object
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  computed: {
    itemGroups: function itemGroups() {
      var modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      var atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];
      if (!this.items) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          var groupName = "".concat(item.module, ".").concat(item.atomClassName);

          if (!group || group.id !== groupName) {
            var module = this.getModule(item.module);
            var atomClass = this.getAtomClass(item);
            group = {
              id: groupName,
              atomClassTitle: atomClass.titleLocale,
              moduleTitle: module.titleLocale,
              items: []
            };
            groups.push(group);
          }

          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return groups;
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('atomRight:add', this.onAtomRightAdd);
    this.$meta.eventHub.$on('atomRight:delete', this.onAtomRightDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('atomRight:add', this.onAtomRightAdd);
    this.$meta.eventHub.$off('atomRight:delete', this.onAtomRightDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      return this.$api.post('atomRight/rights', {
        roleId: this.role.id,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      this.$view.navigate("/a/baseadmin/atomRight/add?roleId=".concat(this.role.id));
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post('atomRight/delete', {
          id: item.id
        }).then(function () {
          _this2.$meta.eventHub.$emit('atomRight:delete', {
            id: item.id,
            roleId: _this2.role.id
          });

          _this2.$meta.util.swipeoutDelete(event.target);

          return true;
        });
      });
    },
    onAtomRightAdd: function onAtomRightAdd(data) {
      this.reload();
    },
    onAtomRightDelete: function onAtomRightDelete(data) {
      var index = this.items.findIndex(function (item) {
        return item.id === data.id;
      });
      if (index > -1) this.items.splice(index, 1);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/atomRight/rights.vue?vue&type=script&lang=js&
 /* harmony default export */ var atomRight_rightsvue_type_script_lang_js_ = (rightsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/atomRight/rights.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atomRight_rightsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "93626dca",
  null
  
)

/* harmony default export */ var rights = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/roles.vue?vue&type=template&id=056c4d8a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.roleName,"eb-href":("role/edit?roleId=" + (item.roleId)),"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onRemove}},[_vm._v(_vm._s(_vm.$text('Remove')))])])])],1)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/user/roles.vue?vue&type=template&id=056c4d8a&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/roles.vue?vue&type=script&lang=js&
/* harmony default export */ var rolesvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    user: {
      type: Object
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      return this.$api.post('user/roles', {
        userId: this.user.id,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      var _this2 = this;

      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this2.$api.post('user/addRole', {
                userId: _this2.user.id,
                roleId: data.id
              }).then(function () {
                _this2.$meta.eventHub.$emit('user:addRole', {
                  userId: _this2.user.id,
                  roleId: data.id
                });

                _this2.reload();

                _this2.$view.toast.show({
                  text: _this2.$text('Operation succeeded')
                });
              });
            }
          }
        }
      });
    },
    onRemove: function onRemove(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('user/removeRole', {
          id: item.id
        }).then(function () {
          _this3.onRoleDelete({
            roleId: item.roleId
          });

          _this3.$meta.eventHub.$emit('user:removeRole', {
            userId: _this3.user.id,
            roleId: item.roleId
          });

          _this3.$meta.util.swipeoutDelete(event.target);

          return true;
        });
      });
    },
    onRoleSave: function onRoleSave(data) {
      var index = this.items.findIndex(function (item) {
        return item.roleId === data.roleId;
      });
      if (index > -1) this.reload();
    },
    onRoleDelete: function onRoleDelete(data) {
      var index = this.items.findIndex(function (item) {
        return item.roleId === data.roleId;
      });
      if (index > -1) this.items.splice(index, 1);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/user/roles.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_rolesvue_type_script_lang_js_ = (rolesvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/user/roles.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_rolesvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "056c4d8a",
  null
  
)

/* harmony default export */ var roles = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/info.vue?vue&type=template&id=096013dc&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-validate',{ref:"validate",attrs:{"auto":"","readOnly":"","data":_vm.user,"params":{module:'a-base',validator: 'user'}}})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/user/info.vue?vue&type=template&id=096013dc&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/info.vue?vue&type=script&lang=js&
/* harmony default export */ var infovue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    user: {
      type: Object
    }
  },
  data: function data() {
    return {};
  }
});
// CONCATENATED MODULE: ./front/src/components/user/info.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_infovue_type_script_lang_js_ = (infovue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/user/info.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_infovue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var info = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/info.vue?vue&type=template&id=380c46a6&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-validate',{ref:"validate",attrs:{"data":_vm.role,"params":{validator: 'role'},"onPerform":_vm.onPerformValidate}},[_c('f7-list',[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Role Name')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Role Name'),"disabled":_vm.role.system===1,"clear-button":_vm.role.system===0,"dataPath":"roleName"},model:{value:(_vm.role.roleName),callback:function ($$v) {_vm.$set(_vm.role, "roleName", $$v)},expression:"role.roleName"}})],1),_vm._v(" "),_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Sorting')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Sorting'),"clear-button":"","dataPath":"sorting"},model:{value:(_vm.role.sorting),callback:function ($$v) {_vm.$set(_vm.role, "sorting", $$v)},expression:"role.sorting"}})],1),_vm._v(" "),_c('f7-list-item',[_c('span',{staticClass:"text-color-gray"},[_vm._v(_vm._s(_vm.$text('Leader')))]),_vm._v(" "),_c('eb-toggle',{attrs:{"dataPath":"leader"},model:{value:(_vm.role.leader),callback:function ($$v) {_vm.$set(_vm.role, "leader", $$v)},expression:"role.leader"}})],1),_vm._v(" "),_c('f7-list-item',[_c('span',{staticClass:"text-color-gray"},[_vm._v(_vm._s(_vm.$text('Catalog')))]),_vm._v(" "),_c('eb-toggle',{attrs:{"value":_vm.role.catalog,"disabled":"","dataPath":"catalog"}})],1),_vm._v(" "),_c('f7-list-item',[_c('span',{staticClass:"text-color-gray"},[_vm._v(_vm._s(_vm.$text('System')))]),_vm._v(" "),_c('eb-toggle',{attrs:{"value":_vm.role.system,"disabled":"","dataPath":"system"}})],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/role/info.vue?vue&type=template&id=380c46a6&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/info.vue?vue&type=script&lang=js&
/* harmony default export */ var infovue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    role: {
      type: Object
    }
  },
  data: function data() {
    return {};
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this = this;

      return this.$api.post('role/save', {
        roleId: this.role.id,
        data: this.role
      }).then(function () {
        _this.$meta.eventHub.$emit('role:save', {
          roleId: _this.role.id,
          roleIdParent: _this.role.roleIdParent,
          role: _this.role
        });

        return true;
      });
    },
    onPerformSave: function onPerformSave() {
      return this.$refs.validate.perform();
    },
    onPerformMove: function onPerformMove() {
      var _this2 = this;

      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false,
            roleIdDisable: this.role.id,
            catalogOnly: true
          },
          callback: function callback(code, data) {
            if (code === 200) {
              var roleIdParent = data.id;

              if (_this2.role.roleIdParent !== roleIdParent) {
                _this2.$api.post('role/move', {
                  roleId: _this2.role.id,
                  roleIdParent: roleIdParent
                }).then(function (data) {
                  _this2.$meta.eventHub.$emit('role:move', {
                    roleId: _this2.role.id,
                    roleIdFrom: _this2.role.roleIdParent,
                    roleIdTo: roleIdParent
                  });

                  _this2.$meta.eventHub.$emit('role:dirty', {
                    dirty: true
                  });

                  _this2.$view.toast.show({
                    text: _this2.$text('Operation succeeded')
                  });
                });
              }
            }
          }
        }
      });
    },
    onPerformDelete: function onPerformDelete() {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('role/delete', {
          roleId: _this3.role.id
        }).then(function () {
          _this3.$meta.eventHub.$emit('role:delete', {
            roleId: _this3.role.id,
            roleIdParent: _this3.role.roleIdParent
          });

          _this3.$meta.eventHub.$emit('role:dirty', {
            dirty: true
          });

          _this3.$f7router.back();
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/role/info.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_infovue_type_script_lang_js_ = (infovue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/role/info.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_infovue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var info = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/children.vue?vue&type=template&id=20ac0a8d&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.roleName,"eb-href":("role/edit?roleId=" + (item.id))}},[_c('f7-badge',{attrs:{"slot":"media"},slot:"media"},[_vm._v(_vm._s(item.sorting))]),_vm._v(" "),_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.leader)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Leader')))]):_vm._e(),_vm._v(" "),(item.catalog)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Catalog')))]):_vm._e(),_vm._v(" "),(item.system)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('System')))]):_vm._e()],1)],1)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/role/children.vue?vue&type=template&id=20ac0a8d&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/children.vue?vue&type=script&lang=js&
/* harmony default export */ var childrenvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    role: {
      type: Object
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:add', this.onRoleAdd);
    this.$meta.eventHub.$on('role:move', this.onRoleMove);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:add', this.onRoleAdd);
    this.$meta.eventHub.$off('role:move', this.onRoleMove);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      return this.$api.post('role/children', {
        roleId: this.role.id,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      return this.addRole({
        catalog: 0
      });
    },
    onPerformAddCatalog: function onPerformAddCatalog() {
      return this.addRole({
        catalog: 1
      });
    },
    addRole: function addRole(_ref2) {
      var _this2 = this;

      var catalog = _ref2.catalog;
      return this.$api.post('role/add', {
        roleIdParent: this.role.id,
        catalog: catalog
      }).then(function (data) {
        _this2.$meta.eventHub.$emit('role:add', {
          roleIdParent: _this2.role.id,
          roleId: data
        });

        _this2.$meta.eventHub.$emit('role:dirty', {
          dirty: true
        });

        _this2.$view.navigate("/a/baseadmin/role/edit?roleId=".concat(data));
      });
    },
    onRoleSave: function onRoleSave(data) {
      if (data.roleIdParent !== this.role.id) return;
      this.reload();
    },
    onRoleAdd: function onRoleAdd(data) {
      if (data.roleIdParent !== this.role.id) return;
      this.reload();
    },
    onRoleMove: function onRoleMove(data) {
      if (data.roleIdFrom !== this.role.id && data.roleIdTo !== this.role.id) return;
      this.reload();
    },
    onRoleDelete: function onRoleDelete(data) {
      if (data.roleIdParent !== this.role.id) return;
      this.reload();
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/role/children.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_childrenvue_type_script_lang_js_ = (childrenvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/role/children.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_childrenvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "20ac0a8d",
  null
  
)

/* harmony default export */ var children = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/includes.vue?vue&type=template&id=aacc4bee&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.roleName,"eb-href":("role/edit?roleId=" + (item.roleIdInc)),"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onRemove}},[_vm._v(_vm._s(_vm.$text('Remove')))])])])],1)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/role/includes.vue?vue&type=template&id=aacc4bee&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/includes.vue?vue&type=script&lang=js&
/* harmony default export */ var includesvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    role: {
      type: Object
    }
  },
  data: function data() {
    return {
      items: []
    };
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
  },
  methods: {
    reload: function reload(force) {
      this.$refs.loadMore.reload(force);
    },
    loadMore: function loadMore() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      return this.$api.post('role/includes', {
        roleId: this.role.id,
        page: {
          index: index
        }
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      var _this2 = this;

      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: false
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this2.$api.post('role/addRoleInc', {
                roleId: _this2.role.id,
                roleIdInc: data.id
              }).then(function (data) {
                _this2.$meta.eventHub.$emit('role:dirty', {
                  dirty: true
                });

                _this2.reload();

                _this2.$view.toast.show({
                  text: _this2.$text('Operation succeeded')
                });
              });
            }
          }
        }
      });
    },
    onRemove: function onRemove(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('role/removeRoleInc', {
          id: item.id
        }).then(function () {
          _this3.onRoleDelete({
            roleId: item.roleIdInc
          });

          _this3.$meta.eventHub.$emit('role:dirty', {
            dirty: true
          });

          _this3.$meta.util.swipeoutDelete(event.target);

          return true;
        });
      });
    },
    onRoleSave: function onRoleSave(data) {
      var index = this.items.findIndex(function (item) {
        return item.roleIdInc === data.roleId;
      });
      if (index > -1) this.reload();
    },
    onRoleDelete: function onRoleDelete(data) {
      var index = this.items.findIndex(function (item) {
        return item.roleIdInc === data.roleId;
      });
      if (index > -1) this.items.splice(index, 1);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/role/includes.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_includesvue_type_script_lang_js_ = (includesvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/role/includes.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_includesvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "aacc4bee",
  null
  
)

/* harmony default export */ var includes = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__);
var Vue;


function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(16)["default"],
    store: __webpack_require__(19)["default"](Vue),
    config: __webpack_require__(20)["default"],
    locales: __webpack_require__(21)["default"],
    components: __webpack_require__(23)["default"]
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(17)("./".concat(name, ".vue"))["default"];
}

/* harmony default export */ __webpack_exports__["default"] = ([{
  path: 'role/list',
  component: load('role/list')
}, {
  path: 'role/edit',
  component: load('role/edit')
}, {
  path: 'role/select',
  component: load('role/select')
}, {
  path: 'user/list',
  component: load('user/list')
}, {
  path: 'user/view',
  component: load('user/view')
}, {
  path: 'user/search',
  component: load('user/search')
}, {
  path: 'user/rights',
  component: load('user/rights')
}, {
  path: 'atomRight/list',
  component: load('atomRight/list')
}, {
  path: 'atomRight/edit',
  component: load('atomRight/edit')
}, {
  path: 'atomRight/add',
  component: load('atomRight/add')
}, {
  path: 'menuRight/list',
  component: load('menuRight/list')
}, {
  path: 'functionRight/list',
  component: load('functionRight/list')
}, {
  path: 'functionRight/edit',
  component: load('functionRight/edit')
}, {
  path: 'functionRight/add',
  component: load('functionRight/add')
}, {
  path: 'auth/list',
  component: load('auth/list')
}, {
  path: 'auth/edit',
  component: load('auth/edit')
}]);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atomRight/add.vue": 30,
	"./atomRight/edit.vue": 28,
	"./atomRight/list.vue": 34,
	"./auth/edit.vue": 25,
	"./auth/list.vue": 26,
	"./functionRight/add.vue": 24,
	"./functionRight/edit.vue": 27,
	"./functionRight/list.vue": 29,
	"./menuRight/list.vue": 31,
	"./role/edit.vue": 33,
	"./role/list.vue": 36,
	"./role/select.vue": 38,
	"./user/list.vue": 35,
	"./user/rights.vue": 39,
	"./user/search.vue": 37,
	"./user/view.vue": 32
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 17;

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_09f80252_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_09f80252_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_09f80252_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_09f80252_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (Vue) {
  return {
    state: {},
    getters: {},
    mutations: {},
    actions: {}
  };
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(22)["default"]
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'Add Role': '添加角色',
  'Add Role Include': '添加聚合角色',
  'Atom Action': '原子指令',
  'Atom Class': '原子类型',
  'Atom Right': '原子权限',
  'Atom Right Management': '原子权限管理',
  'Auth Management': '认证管理',
  'Function Right Management': '功能权限管理',
  'Menu Right': '菜单权限',
  'Function Right': '功能权限',
  'Menu Right Management': '菜单权限管理',
  'New Atom Right': '新建原子权限',
  'New Menu Right': '新建菜单权限',
  'New Function Right': '新建功能权限',
  'New Role': '新建角色',
  'New Catalog': '新建目录',
  'Role Management': '角色管理',
  'Role Name': '角色名称',
  'Select Roles': '选择角色',
  'Search User': '搜索用户',
  'User Management': '用户管理',
  Atoms: '原子',
  Build: '构建',
  Catalog: '目录',
  Children: '子项',
  Delete: '删除',
  Disable: '禁用',
  Disabled: '已禁用',
  Edit: '编辑',
  Enable: '启用',
  Enabled: '已启用',
  from: '来自',
  Function: '功能',
  Functions: '功能',
  Includes: '聚合',
  Info: '信息',
  Leader: '负责人',
  Menu: '菜单',
  Menus: '菜单',
  Module: '模块',
  Move: '移动',
  Remove: '移除',
  Role: '角色',
  Roles: '角色',
  Rights: '权限',
  Save: '保存',
  Scope: '范围',
  Sorting: '排序',
  Spreads: '展开',
  System: '系统',
  User: '用户',
  Users: '用户'
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_role_list_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _components_role_info_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _components_role_children_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _components_role_includes_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _components_user_info_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _components_user_list_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);
/* harmony import */ var _components_user_roles_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9);
/* harmony import */ var _components_atomRight_rights_vue__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8);
/* harmony import */ var _components_atomRight_spreads_vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4);
/* harmony import */ var _components_functionRight_rights_vue__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7);
/* harmony import */ var _components_functionRight_spreads_vue__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(5);











/* harmony default export */ __webpack_exports__["default"] = ({
  roleList: _components_role_list_vue__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"],
  roleInfo: _components_role_info_vue__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"],
  roleChildren: _components_role_children_vue__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"],
  roleIncludes: _components_role_includes_vue__WEBPACK_IMPORTED_MODULE_3__[/* default */ "a"],
  userInfo: _components_user_info_vue__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"],
  userList: _components_user_list_vue__WEBPACK_IMPORTED_MODULE_5__[/* default */ "a"],
  userRoles: _components_user_roles_vue__WEBPACK_IMPORTED_MODULE_6__[/* default */ "a"],
  atomRightRights: _components_atomRight_rights_vue__WEBPACK_IMPORTED_MODULE_7__[/* default */ "a"],
  atomRightSpreads: _components_atomRight_spreads_vue__WEBPACK_IMPORTED_MODULE_8__[/* default */ "a"],
  functionRightRights: _components_functionRight_rights_vue__WEBPACK_IMPORTED_MODULE_9__[/* default */ "a"],
  functionRightSpreads: _components_functionRight_spreads_vue__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"]
});

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/add.vue?vue&type=template&id=6b750554&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text(_vm.menu===1?'New Menu Right':'New Function Right'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onSave}})],1)],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',{attrs:{"smartSelect":"","title":_vm.$text('Module'),"smartSelectParams":{openIn: 'page', closeOnSelect: true}}},[_c('eb-select',{attrs:{"name":"module","options":_vm.modules},model:{value:(_vm.module),callback:function ($$v) {_vm.module=$$v},expression:"module"}})],1),_vm._v(" "),(!!_vm.module)?_c('f7-list-item',{attrs:{"title":_vm.$text(_vm.menu===1?'Menu':'Function'),"link":"#"},on:{"click":_vm.onSelectFunction}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.func && _vm.func.title))])]):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/functionRight/add.vue?vue&type=template&id=6b750554&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/add.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
var ebFunctions = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebFunctions;
/* harmony default export */ var addvue_type_script_lang_js_ = ({
  mixins: [ebModules, ebFunctions],
  data: function data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      menu: parseInt(this.$f7route.query.menu),
      module: '',
      func: null
    };
  },
  computed: {
    modules: function modules() {
      var modulesAll = this.modulesAll;
      if (!modulesAll) return [];
      var functionsAll = this.functionsAll;
      if (!functionsAll) return [];
      var options = [{
        title: null,
        value: ''
      }];

      for (var moduleName in functionsAll) {
        var functions = functionsAll[moduleName];

        if (Object.keys(functions).length > 0) {
          var module = this.getModule(moduleName);
          options.push({
            title: module.titleLocale,
            value: moduleName
          });
        }
      }

      return options;
    },
    apiPath: function apiPath() {
      return this.menu === 1 ? 'menuRight' : 'functionRight';
    }
  },
  watch: {
    module: function module(value) {
      this.func = null;
    }
  },
  methods: {
    onSelectFunction: function onSelectFunction() {
      var _this = this;

      this.$view.navigate('/a/base/menu/selectFunction', {
        target: '_self',
        context: {
          params: {
            module: this.module,
            name: this.func ? this.func.name : null,
            menu: this.menu,
            optional: true
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this.func = data;
            }
          }
        }
      });
    },
    onSave: function onSave() {
      var _this2 = this;

      if (!this.module || !this.func) return;
      return this.$api.post("".concat(this.apiPath, "/add"), {
        roleId: this.roleId,
        module: this.module,
        name: this.func.name
      }).then(function () {
        _this2.$meta.eventHub.$emit('functionRight:add', {
          roleId: _this2.roleId
        });

        _this2.$f7router.back();
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/functionRight/add.vue?vue&type=script&lang=js&
 /* harmony default export */ var functionRight_addvue_type_script_lang_js_ = (addvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/functionRight/add.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  functionRight_addvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "6b750554",
  null
  
)

/* harmony default export */ var add = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/edit.vue?vue&type=template&id=47b62f36&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Edit'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}})],1)],1),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"json-textarea",attrs:{"type":"textarea"},domProps:{"value":_vm.content},on:{"input":_vm.onInput}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/auth/edit.vue?vue&type=template&id=47b62f36&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/edit.vue?vue&type=script&lang=js&
/* harmony default export */ var editvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      id: parseInt(this.$f7route.query.id),
      item: null,
      content: '{}'
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('auth/item', {
      id: this.id
    }).then(function (data) {
      _this.item = data;

      if (!data.config) {
        _this.content = '{}';
      } else {
        _this.content = JSON.stringify(JSON.parse(data.config), null, 2);
      }
    });
  },
  methods: {
    onSize: function onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: "".concat(size.height - 20, "px"),
        width: "".concat(size.width - 20, "px")
      });
    },
    onInput: function onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave: function onPerformSave() {
      var _this2 = this;

      return this.$api.post('auth/save', {
        id: this.id,
        data: JSON.parse(this.content)
      }).then(function () {
        _this2.$f7router.back();
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/auth/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var auth_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/auth/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  auth_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "47b62f36",
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/list.vue?vue&type=template&id=aaeae918&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Auth Management'),"eb-back-link":"Back"}}),_vm._v(" "),(_vm.ready)?_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"eb-href":("auth/edit?id=" + (item.id)),"title":item.meta.titleLocale,"swipeout":""}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.disabled===1)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Disabled')))]):_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Enabled')))])],1),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[(item.disabled===0)?_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDisable}},[_vm._v(_vm._s(_vm.$text('Disable')))]):_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformEnable}},[_vm._v(_vm._s(_vm.$text('Enable')))])])])],1)}),1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/auth/list.vue?vue&type=template&id=aaeae918&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/list.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
/* harmony default export */ var listvue_type_script_lang_js_ = ({
  mixins: [ebModules],
  data: function data() {
    return {
      items: null
    };
  },
  computed: {
    ready: function ready() {
      return this.modulesAll && this.items;
    }
  },
  created: function created() {
    var _this = this;

    return this.$api.post('auth/list').then(function (data) {
      _this.items = data;
    });
  },
  methods: {
    onPerformDisable: function onPerformDisable(event, item) {
      return this.onDisable(event, item, 1);
    },
    onPerformEnable: function onPerformEnable(event, item) {
      return this.onDisable(event, item, 0);
    },
    onDisable: function onDisable(event, item, disabled) {
      var _this2 = this;

      return this.$api.post('auth/disable', {
        id: item.id,
        disabled: disabled
      }).then(function () {
        var index = _this2.items.findIndex(function (_item) {
          return _item.id === item.id;
        });

        _this2.items[index].disabled = disabled;

        _this2.$meta.util.swipeoutClose(event.target);

        return true;
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/auth/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var auth_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/auth/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  auth_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/edit.vue?vue&type=template&id=453cf652&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.getPageTitle(),"eb-back-link":"Back"}},[_c('f7-subnavbar',[(_vm.role)?_c('f7-toolbar',{attrs:{"tabbar":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdRights),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Rights')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdSpreads)}},[_vm._v(_vm._s(_vm.$text('Spreads')))])],1):_vm._e()],1)],1),_vm._v(" "),(_vm.role)?_c('f7-tabs',[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdRights,"tab-active":""},on:{"tab:show":function($event){_vm.tabName='rights'}}},[_c('rights',{ref:"rights",attrs:{"slot":"list","role":_vm.role,"menu":_vm.menu},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdSpreads},on:{"tab:show":function($event){_vm.tabName='spreads'}}},[_c('spreads',{ref:"spreads",attrs:{"slot":"list","role":_vm.role,"menu":_vm.menu},slot:"list"})],1)],1):_vm._e(),_vm._v(" "),(_vm.tabName==='rights')?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"onPerform":_vm.onPerformRightsAdd}},[_vm._v(_vm._s(_vm.$text(_vm.menu===1?'New Menu Right':'New Function Right')))])],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/functionRight/edit.vue?vue&type=template&id=453cf652&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/functionRight/rights.vue + 4 modules
var rights = __webpack_require__(7);

// EXTERNAL MODULE: ./front/src/components/functionRight/spreads.vue + 4 modules
var spreads = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/edit.vue?vue&type=script&lang=js&



/* harmony default export */ var editvue_type_script_lang_js_ = ({
  components: {
    rights: rights["a" /* default */],
    spreads: spreads["a" /* default */]
  },
  data: function data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      menu: parseInt(this.$f7route.query.menu),
      role: null,
      tabIdRights: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdSpreads: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabName: 'rights'
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('role/item', {
      roleId: this.roleId
    }).then(function (data) {
      _this.role = data;
    });
  },
  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text(this.menu === 1 ? 'Menu Right' : 'Function Right');
      if (this.role) title = "".concat(title, ": ").concat(this.role.roleName);
      return title;
    },
    onPerformRightsAdd: function onPerformRightsAdd() {
      return this.$refs.rights.onPerformAdd();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/functionRight/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var functionRight_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/functionRight/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  functionRight_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/edit.vue?vue&type=template&id=660c4a32&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.getPageTitle(),"eb-back-link":"Back"}},[_c('f7-subnavbar',[(_vm.role)?_c('f7-toolbar',{attrs:{"tabbar":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdRights),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Rights')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdSpreads)}},[_vm._v(_vm._s(_vm.$text('Spreads')))])],1):_vm._e()],1)],1),_vm._v(" "),(_vm.role)?_c('f7-tabs',[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdRights,"tab-active":""},on:{"tab:show":function($event){_vm.tabName='rights'}}},[_c('rights',{ref:"rights",attrs:{"slot":"list","role":_vm.role},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdSpreads},on:{"tab:show":function($event){_vm.tabName='spreads'}}},[_c('spreads',{ref:"spreads",attrs:{"slot":"list","role":_vm.role},slot:"list"})],1)],1):_vm._e(),_vm._v(" "),(_vm.tabName==='rights')?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"onPerform":_vm.onPerformRightsAdd}},[_vm._v(_vm._s(_vm.$text('New Atom Right')))])],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atomRight/edit.vue?vue&type=template&id=660c4a32&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atomRight/rights.vue + 4 modules
var rights = __webpack_require__(8);

// EXTERNAL MODULE: ./front/src/components/atomRight/spreads.vue + 4 modules
var spreads = __webpack_require__(4);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/edit.vue?vue&type=script&lang=js&



/* harmony default export */ var editvue_type_script_lang_js_ = ({
  components: {
    rights: rights["a" /* default */],
    spreads: spreads["a" /* default */]
  },
  data: function data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      role: null,
      tabIdRights: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdSpreads: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabName: 'rights'
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('role/item', {
      roleId: this.roleId
    }).then(function (data) {
      _this.role = data;
    });
  },
  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('Atom Right');
      if (this.role) title = "".concat(title, ": ").concat(this.role.roleName);
      return title;
    },
    onPerformRightsAdd: function onPerformRightsAdd() {
      return this.$refs.rights.onPerformAdd();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atomRight/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var atomRight_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atomRight/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atomRight_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/list.vue?vue&type=template&id=7d8aad10&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Function Right Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/functionRight/list.vue?vue&type=template&id=7d8aad10&

// EXTERNAL MODULE: ./front/src/components/role/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  components: {
    roleList: list["a" /* default */]
  },
  data: function data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart)
    };
  },
  computed: {
    tree: function tree() {
      return this.$refs.roleList.tree;
    }
  },
  methods: {
    onNodeClick: function onNodeClick(node) {
      this.$view.navigate("/a/baseadmin/functionRight/edit?roleId=".concat(node.id, "&menu=0"));
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/functionRight/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var functionRight_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/functionRight/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  functionRight_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var functionRight_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/add.vue?vue&type=template&id=cff0bfaa&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('New Atom Right'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onSave}})],1)],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',{attrs:{"title":_vm.$text('Atom Class'),"link":"#"},on:{"click":_vm.onSelectAtomClass}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.atomClass && _vm.atomClass.title))])]),_vm._v(" "),_c('f7-list-item',{attrs:{"smartSelect":"","title":_vm.$text('Atom Action'),"smartSelectParams":{openIn: 'page', closeOnSelect: true}}},[_c('eb-select',{attrs:{"name":"actionCode","options":_vm.actions},model:{value:(_vm.actionCode),callback:function ($$v) {_vm.actionCode=$$v},expression:"actionCode"}})],1),_vm._v(" "),(_vm.scopeSelfEnable)?_c('f7-list-item',{attrs:{"title":_vm.$text('Scope')}},[_c('span',{staticClass:"text-color-gray"},[_vm._v("Self")]),_vm._v(" "),_c('eb-toggle',{model:{value:(_vm.scopeSelf),callback:function ($$v) {_vm.scopeSelf=$$v},expression:"scopeSelf"}})],1):_vm._e(),_vm._v(" "),(_vm.scopeEnable)?_c('f7-list-item',{attrs:{"title":_vm.$text('Scope'),"link":"#"},on:{"click":_vm.onSelectScope}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.scopeTitle))])]):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atomRight/add.vue?vue&type=template&id=cff0bfaa&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/add.vue?vue&type=script&lang=js&

var ebActions = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebActions;
/* harmony default export */ var addvue_type_script_lang_js_ = ({
  mixins: [ebActions],
  data: function data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      atomClass: null,
      actionCode: '',
      scopeSelf: true,
      scope: null
    };
  },
  computed: {
    actions: function actions() {
      var actions = this.getActionsOfAtomClass(this.atomClass);
      if (!actions) return null;
      var options = [{
        title: null,
        value: ''
      }];

      for (var key in actions) {
        if (actions[key].authorize) {
          options.push({
            title: key,
            value: actions[key].code
          });
        }
      }

      return options;
    },
    scopeTitle: function scopeTitle() {
      if (!this.scope) return null;
      return this.scope.map(function (item) {
        return item.roleName;
      }).join(',');
    },
    scopeSelfEnable: function scopeSelfEnable() {
      return this.actionCode && ['3', '4'].indexOf(this.actionCode) > -1;
    },
    scopeEnable: function scopeEnable() {
      if (!this.actionCode) return false;
      if (this.actionCode === '1') return false;
      if (['3', '4'].indexOf(this.actionCode) > -1 && this.scopeSelf) return false;
      return true;
    }
  },
  watch: {
    atomClass: function atomClass(value) {
      this.actionCode = '';
    }
  },
  methods: {
    onSelectAtomClass: function onSelectAtomClass() {
      var _this = this;

      this.$view.navigate('/a/base/atom/selectAtomClass', {
        target: '_self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this.atomClass = data;
            }
          }
        }
      });
    },
    onSelectScope: function onSelectScope() {
      var _this2 = this;

      this.$view.navigate('/a/baseadmin/role/select', {
        target: '_self',
        context: {
          params: {
            roleIdStart: null,
            multiple: true
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this2.scope = data;
            }
          }
        }
      });
    },
    onSave: function onSave() {
      var _this3 = this;

      if (!this.atomClass || !this.actionCode) return;
      return this.$api.post('atomRight/add', {
        roleId: this.roleId,
        atomClass: this.atomClass,
        actionCode: parseInt(this.actionCode),
        scopeSelf: this.scopeSelf,
        scope: this.scope ? this.scope.map(function (item) {
          return item.id;
        }) : []
      }).then(function () {
        _this3.$meta.eventHub.$emit('atomRight:add', {
          roleId: _this3.roleId
        });

        _this3.$f7router.back();
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atomRight/add.vue?vue&type=script&lang=js&
 /* harmony default export */ var atomRight_addvue_type_script_lang_js_ = (addvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atomRight/add.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atomRight_addvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "cff0bfaa",
  null
  
)

/* harmony default export */ var add = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menuRight/list.vue?vue&type=template&id=59a88283&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Menu Right Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menuRight/list.vue?vue&type=template&id=59a88283&

// EXTERNAL MODULE: ./front/src/components/role/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menuRight/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  components: {
    roleList: list["a" /* default */]
  },
  data: function data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart)
    };
  },
  computed: {
    tree: function tree() {
      return this.$refs.roleList.tree;
    }
  },
  methods: {
    onNodeClick: function onNodeClick(node) {
      this.$view.navigate("/a/baseadmin/functionRight/edit?roleId=".concat(node.id, "&menu=1"));
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/menuRight/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var menuRight_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menuRight/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menuRight_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var menuRight_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/view.vue?vue&type=template&id=4e561e2c&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.getPageTitle(),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"eb-href":("user/rights?userId=" + _vm.userId)}},[_vm._v(_vm._s(_vm.$text('Rights')))])],1),_vm._v(" "),_c('f7-subnavbar',[(_vm.user)?_c('f7-toolbar',{attrs:{"tabbar":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdInfo),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Info')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdRoles)}},[_vm._v(_vm._s(_vm.$text('Roles')))])],1):_vm._e()],1)],1),_vm._v(" "),(_vm.user)?_c('f7-tabs',[_c('f7-page-content',{attrs:{"id":_vm.tabIdInfo,"tab":"","tab-active":""},on:{"tab:show":function($event){_vm.tabName='info'}}},[_c('info',{ref:"info",attrs:{"user":_vm.user}})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdRoles},on:{"tab:show":function($event){_vm.tabName='roles'}}},[_c('user-roles',{ref:"roles",attrs:{"slot":"list","user":_vm.user},slot:"list"})],1)],1):_vm._e(),_vm._v(" "),(_vm.tabName==='roles')?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"onPerform":_vm.onPerformRolesAdd}},[_vm._v(_vm._s(_vm.$text('Add Role')))])],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/view.vue?vue&type=template&id=4e561e2c&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/user/info.vue + 4 modules
var info = __webpack_require__(10);

// EXTERNAL MODULE: ./front/src/components/user/roles.vue + 4 modules
var roles = __webpack_require__(9);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/view.vue?vue&type=script&lang=js&



/* harmony default export */ var viewvue_type_script_lang_js_ = ({
  components: {
    info: info["a" /* default */],
    userRoles: roles["a" /* default */]
  },
  data: function data() {
    return {
      userId: parseInt(this.$f7route.query.userId),
      user: null,
      tabIdInfo: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdRoles: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabName: 'info'
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('user/item', {
      userId: this.userId
    }).then(function (data) {
      _this.user = data;
    });
  },
  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('User');
      if (this.user) title = "".concat(title, ": ").concat(this.user.userName);
      return title;
    },
    onPerformRolesAdd: function onPerformRolesAdd() {
      return this.$refs.roles.onPerformAdd();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/view.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_viewvue_type_script_lang_js_ = (viewvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/view.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_viewvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var view = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/edit.vue?vue&type=template&id=ab23cdd4&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.getPageTitle(),"eb-back-link":"Back"}},[_c('f7-subnavbar',[(_vm.role)?_c('f7-toolbar',{attrs:{"tabbar":"","scrollable":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdInfo),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Info')))]),_vm._v(" "),(_vm.role.catalog===0)?_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdUsers)}},[_vm._v(_vm._s(_vm.$text('Users')))]):_vm._e(),_vm._v(" "),(_vm.role.catalog===1)?_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdChildren)}},[_vm._v(_vm._s(_vm.$text('Children')))]):_vm._e(),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdIncludes)}},[_vm._v(_vm._s(_vm.$text('Includes')))])],1):_vm._e()],1)],1),_vm._v(" "),(_vm.role)?_c('f7-tabs',[_c('f7-page-content',{attrs:{"id":_vm.tabIdInfo,"tab":"","tab-active":""},on:{"tab:show":function($event){_vm.tabName='info'}}},[_c('info',{ref:"info",attrs:{"role":_vm.role}})],1),_vm._v(" "),(_vm.role.catalog===0)?_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdUsers},on:{"tab:show":function($event){_vm.tabName='users'}}},[_c('role-users',{attrs:{"slot":"list","roleId":_vm.role.id},slot:"list"})],1):_vm._e(),_vm._v(" "),(_vm.role.catalog===1)?_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdChildren},on:{"tab:show":function($event){_vm.tabName='children'}}},[_c('role-children',{ref:"children",attrs:{"slot":"list","role":_vm.role},slot:"list"})],1):_vm._e(),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdIncludes},on:{"tab:show":function($event){_vm.tabName='includes'}}},[_c('role-includes',{ref:"includes",attrs:{"slot":"list","role":_vm.role},slot:"list"})],1)],1):_vm._e(),_vm._v(" "),(_vm.tabName==='info')?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"onPerform":_vm.onPerformInfoSave}},[_vm._v(_vm._s(_vm.$text('Save')))]),_vm._v(" "),(_vm.role && !_vm.role.system)?_c('eb-link',{attrs:{"onPerform":_vm.onPerformInfoMove}},[_vm._v(_vm._s(_vm.$text('Move')))]):_vm._e(),_vm._v(" "),(_vm.role && !_vm.role.system)?_c('eb-link',{attrs:{"onPerform":_vm.onPerformInfoDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))]):_vm._e()],1):_vm._e(),_vm._v(" "),(_vm.tabName==='users')?_c('f7-toolbar',{attrs:{"bottom-md":""}}):_vm._e(),_vm._v(" "),(_vm.tabName==='children')?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"onPerform":_vm.onPerformChildrenAdd}},[_vm._v(_vm._s(_vm.$text('New Role')))]),_vm._v(" "),_c('eb-link',{attrs:{"onPerform":_vm.onPerformChildrenAddCatalog}},[_vm._v(_vm._s(_vm.$text('New Catalog')))])],1):_vm._e(),_vm._v(" "),(_vm.tabName==='includes')?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"onPerform":_vm.onPerformIncludesAdd}},[_vm._v(_vm._s(_vm.$text('Add Role Include')))])],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/role/edit.vue?vue&type=template&id=ab23cdd4&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/role/info.vue + 4 modules
var info = __webpack_require__(11);

// EXTERNAL MODULE: ./front/src/components/role/children.vue + 4 modules
var children = __webpack_require__(12);

// EXTERNAL MODULE: ./front/src/components/role/includes.vue + 4 modules
var includes = __webpack_require__(13);

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var list = __webpack_require__(3);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/edit.vue?vue&type=script&lang=js&





/* harmony default export */ var editvue_type_script_lang_js_ = ({
  components: {
    info: info["a" /* default */],
    roleChildren: children["a" /* default */],
    roleIncludes: includes["a" /* default */],
    roleUsers: list["a" /* default */]
  },
  data: function data() {
    return {
      roleId: parseInt(this.$f7route.query.roleId),
      role: null,
      tabIdInfo: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdUsers: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdChildren: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdIncludes: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabName: 'info'
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('role/item', {
      roleId: this.roleId
    }).then(function (data) {
      _this.role = data;
    });
  },
  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('Role');
      if (this.role) title = "".concat(title, ": ").concat(this.role.roleName);
      return title;
    },
    onPerformInfoSave: function onPerformInfoSave() {
      return this.$refs.info.onPerformSave();
    },
    onPerformInfoMove: function onPerformInfoMove() {
      return this.$refs.info.onPerformMove();
    },
    onPerformInfoDelete: function onPerformInfoDelete() {
      return this.$refs.info.onPerformDelete();
    },
    onPerformChildrenAdd: function onPerformChildrenAdd() {
      return this.$refs.children.onPerformAdd();
    },
    onPerformChildrenAddCatalog: function onPerformChildrenAddCatalog() {
      return this.$refs.children.onPerformAddCatalog();
    },
    onPerformIncludesAdd: function onPerformIncludesAdd() {
      return this.$refs.includes.onPerformAdd();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/role/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/role/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/list.vue?vue&type=template&id=c288f61a&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Atom Right Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atomRight/list.vue?vue&type=template&id=c288f61a&

// EXTERNAL MODULE: ./front/src/components/role/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  components: {
    roleList: list["a" /* default */]
  },
  data: function data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart)
    };
  },
  computed: {
    tree: function tree() {
      return this.$refs.roleList.tree;
    }
  },
  methods: {
    onNodeClick: function onNodeClick(node) {
      this.$view.navigate("/a/baseadmin/atomRight/edit?roleId=".concat(node.id));
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atomRight/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var atomRight_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atomRight/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atomRight_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var atomRight_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/list.vue?vue&type=template&id=54032113&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('User Management'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"search","eb-target":"_self","eb-href":"user/search"}})],1)],1),_vm._v(" "),_c('users',{ref:"users"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/list.vue?vue&type=template&id=54032113&

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var list = __webpack_require__(3);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  components: {
    users: list["a" /* default */]
  },
  data: function data() {
    return {};
  },
  mounted: function mounted() {
    this.$refs.users.reload(true);
  },
  methods: {
    onRefresh: function onRefresh(event, done) {
      done();
      this.$refs.users.reload();
    },
    onInfinite: function onInfinite() {
      this.$refs.users.loadMore();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var user_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/list.vue?vue&type=template&id=74431cd3&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Role Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}}),_vm._v(" "),(_vm.roleDirty)?_c('f7-fab',{attrs:{"color":"pink"}},[_c('f7-icon',{attrs:{"material":"add"}}),_vm._v(" "),_c('f7-icon',{attrs:{"material":"close"}}),_vm._v(" "),_c('f7-fab-buttons',[_c('eb-fab-button',{attrs:{"color":"orange","onPerform":_vm.onPerformBuild}},[_vm._v(_vm._s(_vm.$text('Build')))])],1)],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/role/list.vue?vue&type=template&id=74431cd3&

// EXTERNAL MODULE: ./front/src/components/role/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  components: {
    roleList: list["a" /* default */]
  },
  data: function data() {
    return {
      roleIdStart: parseInt(this.$f7route.query.roleIdStart),
      roleDirty: false
    };
  },
  computed: {
    tree: function tree() {
      return this.$refs.roleList.tree;
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('role:save', this.onRoleSave);
    this.$meta.eventHub.$on('role:add', this.onRoleAdd);
    this.$meta.eventHub.$on('role:move', this.onRoleMove);
    this.$meta.eventHub.$on('role:delete', this.onRoleDelete);
    this.$meta.eventHub.$on('role:dirty', this.onRoleDirty);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('role:save', this.onRoleSave);
    this.$meta.eventHub.$off('role:add', this.onRoleAdd);
    this.$meta.eventHub.$off('role:move', this.onRoleMove);
    this.$meta.eventHub.$off('role:delete', this.onRoleDelete);
    this.$meta.eventHub.$off('role:dirty', this.onRoleDirty);
  },
  created: function created() {
    this.checkRoleDirty();
  },
  methods: {
    onNodeClick: function onNodeClick(node) {
      this.$view.navigate("/a/baseadmin/role/edit?roleId=".concat(node.id));
    },
    reloadChildren: function reloadChildren(node) {
      if (!node) return;
      node.isBatch = true;
      node.collapse().empty().expand();
    },
    onRoleSave: function onRoleSave(data) {
      var node = this.tree.find(function (node) {
        return node.id === data.roleIdParent;
      });
      this.reloadChildren(node && node[0]);
    },
    onRoleAdd: function onRoleAdd(data) {
      var node = this.tree.find(function (node) {
        return node.id === data.roleIdParent;
      });
      this.reloadChildren(node && node[0]);
    },
    onRoleMove: function onRoleMove(data) {
      var _this = this;

      var _loop = function _loop() {
        var roleIdParent = _arr[_i];

        var node = _this.tree.find(function (node) {
          return node.id === data[roleIdParent];
        });

        _this.reloadChildren(node && node[0]);
      };

      for (var _i = 0, _arr = ['roleIdFrom', 'roleIdTo']; _i < _arr.length; _i++) {
        _loop();
      }
    },
    onRoleDelete: function onRoleDelete(data) {
      var node = this.tree.find(function (node) {
        return node.id === data.roleId;
      });
      if (node) node.remove();
    },
    onRoleDirty: function onRoleDirty(data) {
      this.roleDirty = data.dirty;
    },
    onPerformBuild: function onPerformBuild() {
      var _this2 = this;

      return this.$api.post('role/build').then(function () {
        _this2.roleDirty = false;
        return true;
      });
    },
    checkRoleDirty: function checkRoleDirty() {
      var _this3 = this;

      this.$api.post('role/dirty').then(function (dirty) {
        _this3.roleDirty = dirty;
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/role/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/role/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var role_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/search.vue?vue&type=template&id=3b8c4c54&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-search-page',{attrs:{"title":_vm.$text('Search User')}},[_c('users',{attrs:{"slot":"list"},slot:"list"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/search.vue?vue&type=template&id=3b8c4c54&

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var list = __webpack_require__(3);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/search.vue?vue&type=script&lang=js&

/* harmony default export */ var searchvue_type_script_lang_js_ = ({
  components: {
    users: list["a" /* default */]
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/search.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/search.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_searchvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/select.vue?vue&type=template&id=7bff1078&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Roles'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"done"},on:{"click":function($event){$event.preventDefault();return _vm.onDone($event)}}})],1)],1),_vm._v(" "),_c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClick(node)}}},[(node.states._selected)?_c('f7-icon',{attrs:{"material":"check_box"}}):_vm._e(),_vm._v(_vm._s(node.text))],1)}}])})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/role/select.vue?vue&type=template&id=7bff1078&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/select.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    var _this = this;

    return {
      treeOptions: {
        fetchData: function fetchData(node) {
          return _this.fetchChildren(node.id);
        }
      }
    };
  },
  computed: {
    roleIdStart: function roleIdStart() {
      return this.contextParams.roleIdStart;
    },
    multiple: function multiple() {
      return this.contextParams.multiple;
    },
    catalogOnly: function catalogOnly() {
      return this.contextParams.catalogOnly;
    },
    roleIdDisable: function roleIdDisable() {
      return this.contextParams.roleIdDisable;
    }
  },
  methods: {
    fetchChildren: function fetchChildren(roleId) {
      var _this2 = this;

      if (roleId === 'root') roleId = this.roleIdStart;
      return this.$api.post('role/children', {
        roleId: roleId,
        page: {
          size: 0
        }
      }).then(function (data) {
        var list = data.list.map(function (item) {
          var node = {
            id: item.id,
            text: item.roleName,
            data: item,
            showChildren: item.catalog === 1,
            isBatch: item.catalog === 1
          };
          return node;
        });

        if (_this2.catalogOnly) {
          list = list.filter(function (item) {
            return item.data.catalog === 1 && (!_this2.roleIdDisable || _this2.roleIdDisable !== item.id);
          });
        }

        return list;
      })["catch"](function (err) {
        _this2.$view.toast.show({
          text: err.message
        });
      });
    },
    onDone: function onDone() {
      var selected = this.getSelected();
      if (!selected) return;
      this.contextCallback(200, selected);
      this.$f7router.back();
    },
    onNodeClick: function onNodeClick(node) {
      if (node.states._selected) {
        this.$set(node.states, '_selected', false);
      } else {
        if (this.multiple) {
          this.$set(node.states, '_selected', true);
        } else {
          this.unSelectAll();
          this.$set(node.states, '_selected', true);
        }
      }
    },
    unSelectAll: function unSelectAll() {
      var selection = this.$refs.tree.find({
        state: {
          _selected: true
        }
      }, true);

      if (selection) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = selection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            this.$set(item.states, '_selected', false);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    },
    getSelected: function getSelected() {
      var selection = this.$refs.tree.find({
        state: {
          _selected: true
        }
      }, this.multiple);
      if (!selection) return null;
      return this.multiple ? selection.map(function (node) {
        return node.data;
      }) : selection[0].data;
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/role/select.vue?vue&type=script&lang=js&
 /* harmony default export */ var role_selectvue_type_script_lang_js_ = (selectvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/role/select.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  role_selectvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var role_select = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/rights.vue?vue&type=template&id=685ed594&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.getPageTitle(),"eb-back-link":"Back"}},[_c('f7-subnavbar',[(_vm.user)?_c('f7-toolbar',{attrs:{"tabbar":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdAtoms),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Atoms')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdMenus)}},[_vm._v(_vm._s(_vm.$text('Menus')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdFunctions)}},[_vm._v(_vm._s(_vm.$text('Functions')))])],1):_vm._e()],1)],1),_vm._v(" "),(_vm.user)?_c('f7-tabs',[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdAtoms,"tab-active":""},on:{"tab:show":function($event){_vm.tabName='atoms'}}},[_c('atoms-spreads',{ref:"atoms",attrs:{"slot":"list","user":_vm.user},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdMenus},on:{"tab:show":function($event){_vm.tabName='menus'}}},[_c('functions-spreads',{ref:"menus",attrs:{"slot":"list","user":_vm.user,"menu":1},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdFunctions},on:{"tab:show":function($event){_vm.tabName='functions'}}},[_c('functions-spreads',{ref:"functions",attrs:{"slot":"list","user":_vm.user,"menu":0},slot:"list"})],1)],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/rights.vue?vue&type=template&id=685ed594&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atomRight/spreads.vue + 4 modules
var spreads = __webpack_require__(4);

// EXTERNAL MODULE: ./front/src/components/functionRight/spreads.vue + 4 modules
var functionRight_spreads = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/rights.vue?vue&type=script&lang=js&



/* harmony default export */ var rightsvue_type_script_lang_js_ = ({
  components: {
    atomsSpreads: spreads["a" /* default */],
    functionsSpreads: functionRight_spreads["a" /* default */]
  },
  data: function data() {
    return {
      userId: parseInt(this.$f7route.query.userId),
      user: null,
      tabIdAtoms: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdMenus: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdFunctions: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabName: 'atoms'
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('user/item', {
      userId: this.userId
    }).then(function (data) {
      _this.user = data;
    });
  },
  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('User');
      if (this.user) title = "".concat(title, ": ").concat(this.user.userName);
      return title;
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/rights.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_rightsvue_type_script_lang_js_ = (rightsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/rights.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_rightsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var rights = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
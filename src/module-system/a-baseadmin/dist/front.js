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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
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

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/list.vue?vue&type=template&id=09c9b8f0&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.userName,"eb-href":("user/view?userId=" + (item.id)),"swipeout":""}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.realName && item.realName!==item.userName)?_c('f7-badge',[_vm._v(_vm._s(item.realName))]):_vm._e(),_vm._v(" "),(item.mobile)?_c('f7-badge',[_vm._v(_vm._s(item.mobile))]):_vm._e(),_vm._v(" "),(item.disabled===1)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Disabled')))]):_vm._e()],1),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[(item.disabled===0)?_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDisable}},[_vm._v(_vm._s(_vm.$text('Disable')))]):_vm._e(),_vm._v(" "),(item.disabled===1)?_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformEnable}},[_vm._v(_vm._s(_vm.$text('Enable')))]):_vm._e(),_vm._v(" "),_c('div',{attrs:{"color":"yellow","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])])],1)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
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
        page: { index: index }
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
          _this2.$meta.eventHub.$emit('user:delete', { userId: item.id });
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
        _this3.$meta.eventHub.$emit('user:disable', { userId: item.id, disabled: disabled });
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
// EXTERNAL MODULE: ./front/src/components/user/list.vue?vue&type=style&index=0&id=09c9b8f0&scoped=true&lang=css&
var listvue_type_style_index_0_id_09c9b8f0_scoped_true_lang_css_ = __webpack_require__(47);

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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/spreads.vue?vue&type=template&id=7e0f23f0&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.id,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:((item.roleExpandId) + ":" + (item.roleRightId)),staticClass:"item",attrs:{"title":item.actionName}},[_c('div',{staticClass:"header",attrs:{"slot":"root-start"},slot:"root-start"},[_c('div'),_vm._v(" "),_c('div',[_vm._v(_vm._s(_vm.$text('from'))+": "+_vm._s(item.roleName))])]),_vm._v(" "),_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.actionCode!==1 && item.scope==='0')?_c('f7-badge',[_vm._v("Self")]):_vm._e(),_vm._v(" "),(item.scopeRoles)?_vm._l((item.scopeRoles),function(scopeRole){return _c('f7-badge',{key:scopeRole.id},[_vm._v(_vm._s(scopeRole.roleName))])}):_vm._e()],2)])})],2)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atomRight/spreads.vue?vue&type=template&id=7e0f23f0&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/spreads.vue?vue&type=script&lang=js&


/* harmony default export */ var spreadsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
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
      if (!this.items) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var groupName = item.module + '.' + item.atomClassName;
          if (!group || group.id !== groupName) {
            group = { id: groupName, title: groupName, items: [] };
            groups.push(group);
          }
          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
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
        return this.$api.post('atomRight/spreads', { roleId: this.role.id, page: { index: index } }).then(function (data) {
          _this.items = _this.items.concat(data.list);
          return data;
        });
      }

      return this.$api.post('user/atomRights', { userId: this.user.id, page: { index: index } }).then(function (data) {
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
// EXTERNAL MODULE: ./front/src/components/atomRight/spreads.vue?vue&type=style&index=0&id=7e0f23f0&lang=less&scoped=true&
var spreadsvue_type_style_index_0_id_7e0f23f0_lang_less_scoped_true_ = __webpack_require__(33);

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
  "7e0f23f0",
  null
  
)

component.options.__file = "spreads.vue"
/* harmony default export */ var spreads = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/spreads.vue?vue&type=template&id=14bc8c86&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.id,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:((item.roleExpandId) + ":" + (item.roleFunctionId)),attrs:{"title":item.titleLocale || item.title}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('div',[_vm._v(_vm._s(_vm.$text('from'))+": "+_vm._s(item.roleName))])])])})],2)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/functionRight/spreads.vue?vue&type=template&id=14bc8c86&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/spreads.vue?vue&type=script&lang=js&


/* harmony default export */ var spreadsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
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
            group = { id: groupName, title: groupName, items: [] };
            groups.push(group);
          }
          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
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
        return this.$api.post(this.apiPath + '/spreads', { roleId: this.role.id, menu: this.menu, page: { index: index } }).then(function (data) {
          _this.items = _this.items.concat(data.list);
          return data;
        });
      }

      return this.$api.post('user/functionRights', { userId: this.user.id, menu: this.menu, page: { index: index } }).then(function (data) {
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
// EXTERNAL MODULE: ./front/src/components/functionRight/spreads.vue?vue&type=style&index=0&id=14bc8c86&scoped=true&lang=css&
var spreadsvue_type_style_index_0_id_14bc8c86_scoped_true_lang_css_ = __webpack_require__(41);

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
  "14bc8c86",
  null
  
)

component.options.__file = "spreads.vue"
/* harmony default export */ var spreads = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var NodeContent = { name: "node-content", props: ["node"], render: function render(e) {
    var t = this,
        n = this.node,
        r = this.node.tree.vm;if (n.isEditing) {
      var i = n.text;return this.$nextTick(function (e) {
        t.$refs.editCtrl.focus();
      }), e("input", { domProps: { value: n.text, type: "text" }, class: "tree-input", on: { input: function input(e) {
            i = e.target.value;
          }, blur: function blur() {
            n.stopEditing(i);
          }, keyup: function keyup(e) {
            13 === e.keyCode && n.stopEditing(i);
          }, click: function click(e) {
            e.stopPropagation();
          } }, ref: "editCtrl" });
    }return r.$scopedSlots.default ? r.$scopedSlots.default({ node: this.node }) : e("span", { domProps: { innerHTML: n.text } });
  } };!function () {
  if ("undefined" != typeof document) {
    var e = document.head || document.getElementsByTagName("head")[0],
        t = document.createElement("style"),
        n = ' .tree-node { white-space: nowrap; display: flex; flex-direction: column; position: relative; box-sizing: border-box; } .tree-content { display: flex; align-items: center; padding: 4px; cursor: pointer; width: 100%; box-sizing: border-box; } .tree-node:not(.selected)>.tree-content:hover { background: #f6f8fb; } .tree-node.selected>.tree-content { background-color: #e7eef7; } .tree-node.disabled>.tree-content:hover { background: inherit; } .tree-arrow { flex-shrink: 0; height: 30px; cursor: pointer; margin-left: 30px; width: 0; } .tree-arrow.has-child { margin-left: 0; width: 30px; position: relative; } .tree-arrow.has-child:after { border: 1.5px solid #494646; position: absolute; border-left: 0; border-top: 0; left: 9px; top: 50%; height: 9px; width: 9px; transform: rotate(-45deg) translateY(-50%) translateX(0); transition: transform .25s; transform-origin: center; } .tree-arrow.expanded.has-child:after { transform: rotate(45deg) translateY(-50%) translateX(-5px); } .tree-checkbox { flex-shrink: 0; position: relative; width: 30px; height: 30px; box-sizing: border-box; border: 1px solid #dadada; border-radius: 2px; background: #fff; transition: border-color .25s, background-color .25s; } .tree-checkbox:after, .tree-arrow:after { position: absolute; display: block; content: ""; } .tree-checkbox.checked, .tree-checkbox.indeterminate { background-color: #3a99fc; border-color: #218eff; } .tree-checkbox.checked:after { box-sizing: content-box; border: 1.5px solid #fff; /* probably width would be rounded in most cases */ border-left: 0; border-top: 0; left: 9px; top: 3px; height: 15px; width: 8px; transform: rotate(45deg) scaleY(0); transition: transform .25s; transform-origin: center; } .tree-checkbox.checked:after { transform: rotate(45deg) scaleY(1); } .tree-checkbox.indeterminate:after { background-color: #fff; top: 50%; left: 20%; right: 20%; height: 2px; } .tree-anchor { flex-grow: 2; outline: none; display: flex; text-decoration: none; color: #343434; vertical-align: top; margin-left: 3px; line-height: 24px; padding: 3px 6px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } .tree-node.selected .tree-anchor { outline: none; } .tree-node.disabled .tree-anchor { color: #989191; background: #fff; opacity: .6; cursor: default; outline: none; } .tree-input { display: block; width: 100%; height: 24px; line-height: 24px; outline: none; border: 1px solid #3498db; padding: 0 4px; } .l-fade-enter-active, .l-fade-leave-active { transition: opacity .3s, transform .3s; transform: translateX(0); } .l-fade-enter, .l-fade-leave-to { opacity: 0; transform: translateX(-2em); } .tree--small .tree-anchor { line-height: 19px; } .tree--small .tree-checkbox { width: 23px; height: 23px; } .tree--small .tree-arrow { height: 23px; } .tree--small .tree-checkbox.checked:after { left: 7px; top: 3px; height: 11px; width: 5px; } ';t.type = "text/css", t.styleSheet ? t.styleSheet.cssText = n : t.appendChild(document.createTextNode(n)), e.appendChild(t);
  }
}();var TreeNode = { render: function render() {
    var e = this,
        t = e.$createElement,
        n = e._self._c || t;return n("li", { staticClass: "tree-node", class: e.nodeClass }, [n("div", { staticClass: "tree-content", style: { "padding-left": e.paddingLeft }, on: { click: function click(t) {
          return t.stopPropagation(), e.select(t);
        } } }, [n("i", { staticClass: "tree-arrow", class: { expanded: e.node.states.expanded, "has-child": e.node.children.length || e.node.isBatch }, on: { click: function click(t) {
          return t.stopPropagation(), e.toggleExpand(t);
        } } }), e._v(" "), e.options.checkbox ? n("i", { staticClass: "tree-checkbox", class: { checked: e.node.states.checked, indeterminate: e.node.states.indeterminate }, on: { click: function click(t) {
          return t.stopPropagation(), e.check(t);
        } } }) : e._e(), e._v(" "), n("a", { ref: "anchor", staticClass: "tree-anchor", attrs: { href: "javascript:void(0)", tabindex: "1" }, on: { focus: e.onNodeFocus, dblclick: function dblclick(t) {
          e.tree.$emit("node:dblclick", e.node);
        } } }, [n("node-content", { attrs: { node: e.node } })], 1)]), e._v(" "), n("transition", { attrs: { name: "l-fade" } }, [e.hasChildren() && e.state.expanded ? n("ul", { staticClass: "tree-children" }, e._l(e.node.children, function (t) {
      return t.visible() ? n("node", { key: t.id, attrs: { node: t, options: e.options } }) : e._e();
    })) : e._e()])], 1);
  }, staticRenderFns: [], name: "Node", inject: ["tree"], props: ["node", "options"], components: { NodeContent: NodeContent }, data: function data() {
    return this.node.vm = this, { state: this.node.states };
  }, computed: { paddingLeft: function paddingLeft() {
      return this.node.depth * this.options.paddingLeft + "px";
    }, nodeClass: function nodeClass() {
      var e = this.state,
          t = this.hasChildren(),
          n = { "has-child": t, expanded: t && e.expanded, selected: e.selected, disabled: e.disabled, matched: e.matched };return this.options.checkbox && (n.checked = e.checked, n.indeterminate = e.indeterminate), n;
    } }, methods: { onNodeFocus: function onNodeFocus() {
      this.tree.activeElement = this.node;
    }, focus: function focus() {
      this.$refs.anchor.focus(), this.node.select();
    }, check: function check() {
      this.node.checked() ? this.node.uncheck() : this.node.check();
    }, select: function select(e) {
      void 0 === e && (e = evnt);var t = e.ctrlKey,
          n = this.options,
          r = this.tree,
          i = this.node;if (!n.editing || !i.isEditing) {
        if (n.editing && i.editable()) return this.startEditing();if (n.checkbox && n.checkOnSelect) return !n.parentSelect && this.hasChildren() ? this.toggleExpand() : this.check(t);!n.parentSelect && this.hasChildren() && this.toggleExpand(), n.multiple ? i.selected() ? t ? i.unselect() : 1 != this.tree.selectedNodes.length && (r.unselectAll(), i.select()) : i.select(t) : i.selected() && t ? i.unselect() : i.select();
      }
    }, toggleExpand: function toggleExpand() {
      this.hasChildren() && this.node.toggleExpand();
    }, hasChildren: function hasChildren() {
      return this.node.hasChildren();
    }, startEditing: function startEditing() {
      this.tree._editingNode && this.tree._editingNode.stopEditing(), this.node.startEditing();
    }, stopEditing: function stopEditing() {
      this.node.stopEditing();
    } } };function recurseDown(e, t) {
  var n;return Array.isArray(e) ? e.map(function (e) {
    return recurseDown(e, t);
  }) : (!1 !== (n = t(e)) && e.hasChildren() && (n = recurseDown(e.children, t)), n);
}var $div = document.createElement("div");function finder(e) {
  return function (t) {
    return Object.keys(e).every(function (n) {
      if ("text" === n) {
        var r = e[n],
            i = t[n];return $div.innerHTML = i, i = $div.innerText, isRegExp(r) ? r.test(i) : r === i;
      }var o = e[n];return "state" === n && (n = "states"), Object.keys(o).every(function (e) {
        return t[n][e] === o[e];
      });
    });
  };
}function isRegExp(e) {
  return e instanceof RegExp;
}function getAllChildren(e) {
  var t = [];return e.forEach(function e(n) {
    t.push(n), n.children && n.children.forEach(e);
  }), t;
}function find(e, t, n) {
  if (void 0 === n && (n = !0), !e || !e.length || !t) return null;if (n && (e = getAllChildren(e)), "number" == typeof t) return e[t] || null;("string" == typeof t || t instanceof RegExp) && (t = { text: t }), "function" != typeof t && (t = finder(t));var r = e.filter(t);return r.length ? r : null;
}function s4() {
  return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
}function uuidV4() {
  return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}function nodeIterator(e, t) {
  for (var n = [], r = arguments.length - 2; r-- > 0;) {
    n[r] = arguments[r + 2];
  }e.forEach(function (e) {
    return e[t].apply(e, n);
  });
}var Selection = function (e) {
  function t(t, n) {
    var r;void 0 === n && (n = []), e.call(this), this.tree = t, (r = this).push.apply(r, n);
  }return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.remove = function () {
    return nodeIterator(this, "remove"), this;
  }, t.prototype.expand = function () {
    return nodeIterator(this, "expand"), this;
  }, t.prototype.collapse = function () {
    return nodeIterator(this, "collapse"), this;
  }, t.prototype.select = function (e) {
    return nodeIterator(this, "select", e), this;
  }, t.prototype.unselect = function () {
    return nodeIterator(this, "unselect"), this;
  }, t.prototype.check = function () {
    return this.tree.options.checkbox && nodeIterator(this, "check"), this;
  }, t.prototype.uncheck = function () {
    return this.tree.options.checkbox && nodeIterator(this, "uncheck"), this;
  }, t;
}(Array),
    Node = function Node(e, t) {
  if (!t) throw new Error("Node can not be empty");if (this.id = t.id || uuidV4(), this.states = t.state || {}, this.showChildren = !0, this.children = t.children || [], this.parent = t.parent || null, this.isBatch = t.isBatch || !1, this.isEditing = !1, this.data = Object.assign({}, { text: t.text }, t.data || {}), !e) throw new Error("Node must has a Tree context!");this.tree = e;
},
    prototypeAccessors = { depth: { configurable: !0 }, text: { configurable: !0 } };Node.prototype.$emit = function (e) {
  for (var t, n = [], r = arguments.length - 1; r-- > 0;) {
    n[r] = arguments[r + 1];
  }(t = this.tree).$emit.apply(t, ["node:" + e, this].concat(n));
}, prototypeAccessors.depth.get = function () {
  var e = 0,
      t = this.parent;if (!t || !1 === this.showChildren) return e;do {
    e++;
  } while (t = t.parent);return e;
}, prototypeAccessors.text.get = function () {
  return this.data.text;
}, prototypeAccessors.text.set = function (e) {
  var t = this.text;this.data.text = e, this.$emit("text:changed", e, t);
}, Node.prototype.state = function (e, t) {
  return void 0 === t ? this.states[e] : (this.states[e] = t, this);
}, Node.prototype.recurseUp = function (e, t) {
  if (void 0 === t && (t = this), t.parent) return !1 !== e(t.parent) ? this.recurseUp(e, t.parent) : void 0;
}, Node.prototype.recurseDown = function (e, t) {
  !0 !== t && e(this), this.hasChildren() && recurseDown(this.children, e);
}, Node.prototype.refreshIndeterminateState = function () {
  if (!this.tree.options.autoCheckChildren) return this;if (this.state("indeterminate", !1), this.hasChildren()) {
    var e = this.children.length,
        t = 0,
        n = 0,
        r = 0;this.children.forEach(function (e) {
      e.checked() && t++, e.disabled() && r++, e.indeterminate() && n++;
    }), t === e - r ? this.checked() || (this.state("checked", !0), this.tree.check(this), this.$emit("checked")) : (this.checked() && (this.state("checked", !1), this.tree.uncheck(this), this.$emit("unchecked")), this.state("indeterminate", n > 0 || t > 0 && t < e));
  }this.parent && this.parent.refreshIndeterminateState();
}, Node.prototype.indeterminate = function () {
  return this.state("indeterminate");
}, Node.prototype.editable = function () {
  return !this.state("disabled") && this.state("editable");
}, Node.prototype.selectable = function () {
  return !this.state("disabled") && this.state("selectable");
}, Node.prototype.selected = function () {
  return this.state("selected");
}, Node.prototype.select = function (e) {
  return !this.selectable() || this.selected() ? this : (this.tree.select(this, e), this.state("selected", !0), this.$emit("selected"), this);
}, Node.prototype.unselect = function () {
  return this.selectable() && this.selected() ? (this.tree.unselect(this), this.state("selected", !1), this.$emit("unselected"), this) : this;
}, Node.prototype.checked = function () {
  return this.state("checked");
}, Node.prototype.check = function () {
  var e = this;return this.checked() || this.disabled() ? this : this.indeterminate() ? this.uncheck() : (this.tree.options.autoCheckChildren ? (this.recurseDown(function (t) {
    t.state("indeterminate", !1), t.checked() || (e.tree.check(t), t.state("checked", !0), t.$emit("checked"));
  }), this.parent && this.parent.refreshIndeterminateState()) : (this.tree.check(this), this.state("checked", !0), this.$emit("checked")), this);
}, Node.prototype.uncheck = function () {
  var e = this;return !this.indeterminate() && !this.checked() || this.disabled() ? this : (this.tree.options.autoCheckChildren ? (this.recurseDown(function (t) {
    t.state("indeterminate", !1), t.checked() && (e.tree.uncheck(t), t.state("checked", !1), t.$emit("unchecked"));
  }), this.parent && this.parent.refreshIndeterminateState()) : (this.tree.uncheck(this), this.state("checked", !1), this.$emit("unchecked")), this);
}, Node.prototype.show = function () {
  return this.visible() ? this : (this.state("visible", !0), this.$emit("shown"), this);
}, Node.prototype.hide = function () {
  return this.hidden() ? this : (this.state("visible", !1), this.$emit("hidden"), this);
}, Node.prototype.visible = function () {
  return this.state("visible");
}, Node.prototype.hidden = function () {
  return !this.state("visible");
}, Node.prototype.enable = function () {
  return this.enabled() ? this : (this.recurseDown(function (e) {
    e.disabled() && (e.state("disabled", !1), e.$emit("enabled"));
  }), this);
}, Node.prototype.enabled = function () {
  return !this.state("disabled");
}, Node.prototype.disable = function () {
  return this.disabled() ? this : (this.recurseDown(function (e) {
    e.enabled() && (e.state("disabled", !0), e.$emit("disabled"));
  }), this);
}, Node.prototype.disabled = function () {
  return this.state("disabled");
}, Node.prototype.expandTop = function (e) {
  var t = this;this.recurseUp(function (n) {
    n.state("expanded", !0), !0 !== e && t.$emit("expanded", n);
  });
}, Node.prototype.expand = function () {
  var e = this;return !this.hasChildren() || this.expanded() || this.disabled() ? this : (this.isBatch ? this.tree.loadChildren(this).then(function (t) {
    e.state("expanded", !0), e.$emit("expanded");
  }) : (this.state("expanded", !0), this.$emit("expanded")), this);
}, Node.prototype.expanded = function () {
  return this.state("expanded");
}, Node.prototype.collapse = function () {
  return !this.hasChildren() || this.collapsed() || this.disabled() ? this : (this.state("expanded", !1), this.$emit("collapsed"), this);
}, Node.prototype.collapsed = function () {
  return !this.state("expanded");
}, Node.prototype.toggleExpand = function () {
  return this._toggleOpenedState();
}, Node.prototype.toggleCollapse = function () {
  return this._toggleOpenedState();
}, Node.prototype._toggleOpenedState = function () {
  return this.disabled() || !this.hasChildren() ? this : this.expanded() ? this.collapse() : this.expand();
}, Node.prototype.startEditing = function () {
  if (this.disabled()) return !1;this.isEditing || (this.tree._editingNode = this, this.tree.activeElement = this, this.isEditing = !0, this.$emit("editing:start"));
}, Node.prototype.stopEditing = function (e) {
  this.isEditing && (this.isEditing = !1, this.tree._editingNode = null, this.tree.activeElement = null, e && !1 !== e && this.text !== e && (this.text = e), this.$emit("editing:stop", this.text === e));
}, Node.prototype.index = function (e) {
  return this.tree.index(this, e);
}, Node.prototype.first = function () {
  return this.hasChildren() ? this.children[0] : null;
}, Node.prototype.last = function () {
  return this.hasChildren() ? this.children[this.children.length - 1] : null;
}, Node.prototype.next = function () {
  return this.tree.nextNode(this);
}, Node.prototype.prev = function () {
  return this.tree.prevNode(this);
}, Node.prototype.insertAt = function (e, t) {
  var n = this;if (void 0 === t && (t = this.children.length), e) return e = this.tree.objectToNode(e), Array.isArray(e) ? (e.reverse().map(function (e) {
    return n.insertAt(e, t);
  }), new Selection(this.tree, [].concat(e))) : (e.parent = this, this.children.splice(t, 0, e), e.disabled() && e.hasChildren() && e.recurseDown(function (e) {
    e.state("disabled", !0);
  }), this.isBatch || this.$emit("added", e), e);
}, Node.prototype.addChild = function (e) {
  return this.insertAt(e);
}, Node.prototype.append = function (e) {
  return this.addChild(e);
}, Node.prototype.prepend = function (e) {
  return this.insertAt(e, 0);
}, Node.prototype.before = function (e) {
  return this.tree.before(this, e);
}, Node.prototype.after = function (e) {
  return this.tree.after(this, e);
}, Node.prototype.empty = function () {
  for (var e; e = this.children.pop();) {
    e.remove();
  }return this;
}, Node.prototype.remove = function () {
  return this.tree.removeNode(this);
}, Node.prototype.removeChild = function (e) {
  var t = this.find(e);return t ? this.tree.removeNode(t) : null;
}, Node.prototype.find = function (e, t) {
  return e instanceof Node ? e : find(this.children, e, t);
}, Node.prototype.focus = function () {
  this.vm && this.vm.focus();
}, Node.prototype.hasChildren = function () {
  return this.showChildren && this.isBatch || this.children.length > 0;
}, Node.prototype.isRoot = function () {
  return null === this.parent;
}, Node.prototype.toJSON = function () {
  return { text: this.text, data: this.data, state: this.states, children: this.children };
}, Object.defineProperties(Node.prototype, prototypeAccessors);var nodeStates = { selected: !1, selectable: !0, checked: !1, expanded: !1, disabled: !1, visible: !0, indeterminate: !1, matched: !1, editable: !0 };function merge(e) {
  return void 0 === e && (e = {}), Object.assign({}, nodeStates, e);
}function objectToNode(e, t) {
  var n = null;if (t instanceof Node) return t;if ("string" == typeof t) n = new Node(e, { text: t, state: merge(), id: uuidV4() });else {
    if (Array.isArray(t)) return t.map(function (t) {
      return objectToNode(e, t);
    });(n = new Node(e, t)).states = merge(n.states), n.id || (n.id = uuidV4()), n.children.length && (n.children = n.children.map(function (t) {
      return (t = objectToNode(e, t)).parent = n, t;
    }));
  }return n;
}var List = function (e) {
  function t() {
    e.apply(this, arguments);
  }return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.empty = function () {
    return this.splice(0, this.length), this;
  }, t.prototype.add = function () {
    for (var e, t = [], n = arguments.length; n--;) {
      t[n] = arguments[n];
    }return (e = this).push.apply(e, t), this;
  }, t.prototype.remove = function (e) {
    var t = this.indexOf(e);return -1 === t ? this : (this.splice(t, 1), this);
  }, t.prototype.removeAll = function (e) {
    for (; this.includes(e);) {
      this.remove(e);
    }return this;
  }, t.prototype.top = function () {
    return this[this.length - 1];
  }, t;
}(Array),
    defaultPropertyNames = { id: "id", text: "text", children: "children", state: "state", data: "data", isBatch: "isBatch" };function convertNames(e, t) {
  return { id: e[t.id], text: e[t.text], children: e[t.children], state: e[t.state], data: e[t.data], isBatch: e[t.isBatch] };
}var TreeParser = { parse: function parse(e, t, n) {
    void 0 === n && (n = {}), "string" == typeof e && (e = JSON.parse(e)), Array.isArray(e) || (e = [e]);var r = Object.assign({}, defaultPropertyNames, n);return e.map(function e(t) {
      var n = convertNames(t, r);return n.children && !Array.isArray(n.children) && (n.children = [n.children]), n.children && (n.children = n.children.map(e)), n;
    }).map(function (e) {
      return objectToNode(t, e);
    });
  } };function request(e) {
  return new Promise(function (t, n) {
    var r = new XMLHttpRequest();r.open("GET", e), r.setRequestHeader("Content-Type", "application/json"), r.addEventListener("load", function (e) {
      try {
        var i = JSON.parse(r.response);t(i);
      } catch (e) {
        n(e);
      }
    }), r.send(null);
  });
}function get(e) {
  return request(e);
}function createTemplate(e) {
  return function (t) {
    for (var n, r = /{([^}]+)}/, i = e; n = r.exec(i);) {
      i = i.replace(n[0], t[n[1]]);
    }return i;
  };
}function orderAsc(e, t) {
  return e.text < t.text ? -1 : e.text > t.text ? 1 : 0;
}function orderDesc(e, t) {
  return e.text < t.text ? 1 : e.text > t.text ? -1 : 0;
}function getCompareFunction(e) {
  switch (e.toLowerCase()) {case "asc":
      return orderAsc;case "desc":
      return orderDesc;}
}function sort(e, t) {
  "string" == typeof t && (t = getCompareFunction(t)), Array.isArray(e) && "function" == typeof t && e.sort(t);
}var Tree = function Tree(e) {
  var t = this;this.vm = e, this.options = e.opts, this.activeElement = null;var n,
      r = this.options.fetchData;"string" == typeof r && (this.options.fetchData = (n = createTemplate(r), function (e) {
    return get(n(e)).catch(t.options.onFetchError);
  }));
};Tree.prototype.$on = function (e) {
  for (var t, n = [], r = arguments.length - 1; r-- > 0;) {
    n[r] = arguments[r + 1];
  }(t = this.vm).$on.apply(t, [e].concat(n));
}, Tree.prototype.$once = function (e) {
  for (var t, n = [], r = arguments.length - 1; r-- > 0;) {
    n[r] = arguments[r + 1];
  }(t = this.vm).$once.apply(t, [e].concat(n));
}, Tree.prototype.$off = function (e) {
  for (var t, n = [], r = arguments.length - 1; r-- > 0;) {
    n[r] = arguments[r + 1];
  }(t = this.vm).$off.apply(t, [e].concat(n));
}, Tree.prototype.$emit = function (e) {
  for (var t, n = [], r = arguments.length - 1; r-- > 0;) {
    n[r] = arguments[r + 1];
  }(t = this.vm).$emit.apply(t, [e].concat(n));
}, Tree.prototype._sort = function (e, t, n) {
  !1 !== n && this.recurseDown(e, function (e) {
    e.hasChildren() && sort(e.children, t);
  }), sort(e, t);
}, Tree.prototype.sortTree = function (e, t) {
  this._sort(this.model, e, t);
}, Tree.prototype.sort = function (e, t, n) {
  var r = this,
      i = this.find(e, !0);i && t && i.forEach(function (e) {
    r._sort(e.children, t, n);
  });
}, Tree.prototype.clearFilter = function () {
  this.recurseDown(function (e) {
    e.state("matched", !1), e.state("visible", !0), e.state("expanded", e.__expanded), e.__expanded = void 0, e.showChildren = !0;
  }), this.vm.matches.length = 0, this.vm.$emit("tree:filtered", [], "");
}, Tree.prototype.filter = function (e) {
  if (!e) return this.clearFilter();var t = [],
      n = this.options.filter.matcher,
      r = this.options.filter,
      i = r.showChildren,
      o = r.plainList;return this.recurseDown(function (r) {
    n(e, r) && t.push(r), r.showChildren = !0, void 0 === r.__expanded && (r.__expanded = r.state("expanded")), r.state("visible", !1), r.state("matched", !1), r.state("expanded", !0);
  }), t.reverse().forEach(function (e) {
    e.state("matched", !0), e.state("visible", !0), e.showChildren = !o, e.hasChildren() && e.recurseDown(function (e) {
      e.state("visible", !!i);
    }, !0), e.recurseUp(function (e) {
      e.state("visible", !0), e.state("expanded", !0);
    }), e.hasChildren() && e.state("expanded", !1);
  }), this.vm.matches = t, this.vm.$emit("tree:filtered", t, e), t;
}, Tree.prototype.selected = function () {
  return new (Function.prototype.bind.apply(Selection, [null].concat([this], this.selectedNodes)))();
}, Tree.prototype.checked = function () {
  return this.options.checkbox ? new (Function.prototype.bind.apply(Selection, [null].concat([this], this.checkedNodes)))() : null;
}, Tree.prototype.loadChildren = function (e) {
  var t = this;if (e) return this.$emit("tree:data:fetch", e), this.fetch(e).then(function (n) {
    e.append(n), e.isBatch = !1, e.checked() && e.recurseDown(function (e) {
      e.state("checked", !0);
    }), t.$emit("tree:data:received", e);
  });
}, Tree.prototype.fetch = function (e) {
  var t = this,
      n = this.options.fetchData(e);return n.then || (n = get(n).catch(this.options.onFetchError)), n.then(function (e) {
    return e && t.parse(e, t.options.modelParse);
  }).catch(this.options.onFetchError), n;
}, Tree.prototype.fetchInitData = function () {
  return this.fetch({ id: "root", name: "root" });
}, Tree.prototype.setModel = function (e) {
  var t = this;if (this.model = this.parse(e, this.options.modelParse), this.vm.model = this.model, this.selectedNodes = new List(), this.checkedNodes = new List(), recurseDown(this.model, function (e) {
    e.tree = t, e.selected() && t.selectedNodes.add(e), e.checked() && (t.checkedNodes.add(e), e.parent && e.parent.refreshIndeterminateState()), e.disabled() && e.recurseDown(function (e) {
      e.state("disabled", !0);
    });
  }), !this.options.multiple && this.selectedNodes.length) {
    var n = this.selectedNodes.top();this.selectedNodes.forEach(function (e) {
      n !== e && e.state("selected", !1);
    }), this.selectedNodes.empty().add(n);
  }this.options.checkOnSelect && this.options.checkbox && this.unselectAll();
}, Tree.prototype.recurseDown = function (e, t) {
  return !t && e && (t = e, e = this.model), recurseDown(e, t);
}, Tree.prototype.select = function (e, t) {
  var n = this.getNode(e);return !!n && (this.options.multiple && t ? this.selectedNodes.add(n) : (this.unselectAll(), this.selectedNodes.empty().add(n)), !0);
}, Tree.prototype.selectAll = function () {
  var e = this;return !!this.options.multiple && (this.selectedNodes.empty(), this.recurseDown(function (t) {
    e.selectedNodes.add(t.select(!0));
  }), !0);
}, Tree.prototype.unselect = function (e) {
  var t = this.getNode(e);return !!t && (this.selectedNodes.remove(t), !0);
}, Tree.prototype.unselectAll = function () {
  for (var e; e = this.selectedNodes.pop();) {
    e.unselect();
  }return !0;
}, Tree.prototype.check = function (e) {
  this.checkedNodes.add(e);
}, Tree.prototype.uncheck = function (e) {
  this.checkedNodes.remove(e);
}, Tree.prototype.checkAll = function () {
  this.recurseDown(function (e) {
    0 === e.depth && (e.indeterminate() && e.state("indeterminate", !1), e.check());
  });
}, Tree.prototype.uncheckAll = function () {
  for (var e; e = this.checkedNodes.pop();) {
    e.uncheck();
  }return !0;
}, Tree.prototype.expand = function (e) {
  return !e.expanded() && (e.expand(), !0);
}, Tree.prototype.collapse = function (e) {
  return !e.collapsed() && (e.collapse(), !0);
}, Tree.prototype.toggleExpand = function (e) {
  return !!e.hasChildren() && (e.toggleExpand(), !0);
}, Tree.prototype.toggleCollapse = function (e) {
  return !!e.hasChildren() && (e.toggleCollapse(), !0);
}, Tree.prototype.expandAll = function () {
  this.recurseDown(function (e) {
    e.hasChildren() && e.collapsed() && e.expand();
  });
}, Tree.prototype.collapseAll = function () {
  this.recurseDown(function (e) {
    e.hasChildren() && e.expanded() && e.collapse();
  });
}, Tree.prototype.index = function (e, t) {
  var n = e.parent,
      r = (n = n ? n.children : this.model).indexOf(e);return t ? { index: r, target: n, node: n[r] } : r;
}, Tree.prototype.nextNode = function (e) {
  var t = this.index(e, !0);return t.target[t.index + 1] || null;
}, Tree.prototype.nextVisibleNode = function (e) {
  if (e.hasChildren() && e.expanded()) return e.first();var t = this.nextNode(e);return !t && e.parent ? e.parent.next() : t;
}, Tree.prototype.prevNode = function (e) {
  var t = this.index(e, !0);return t.target[t.index - 1] || null;
}, Tree.prototype.prevVisibleNode = function (e) {
  var t = this.prevNode(e);return t ? t.hasChildren() && t.expanded() ? t.last() : t : e.parent;
}, Tree.prototype.addToModel = function (e, t) {
  var n = this;void 0 === t && (t = this.model.length), e = this.objectToNode(e), this.model.splice(t, 0, e), this.recurseDown(e, function (e) {
    e.tree = n;
  }), this.$emit("node:added", e);
}, Tree.prototype.append = function (e, t) {
  var n = this.find(e);return !!n && n.append(t);
}, Tree.prototype.prepend = function (e, t) {
  var n = this.find(e);return !!n && n.prepend(t);
}, Tree.prototype.before = function (e, t) {
  e = this.find(e);var n = this.index(e, !0),
      r = this.objectToNode(t);return !!~n.index && (n.target.splice(n.index, 0, r), this.$emit("node:added", r), t);
}, Tree.prototype.after = function (e, t) {
  e = this.find(e);var n = this.index(e, !0),
      r = this.objectToNode(t);return !!~n.index && (n.target.splice(n.index + 1, 0, r), this.$emit("node:added", r), t);
}, Tree.prototype.addNode = function (e) {
  var t = this.model.length;return e = objectToNode(e), this.model.splice(t, 0, e), this.$emit("node:added", e), e;
}, Tree.prototype.remove = function (e, t) {
  return this.removeNode(this.find(e, t));
}, Tree.prototype.removeNode = function (e) {
  if (e instanceof Selection) return e.remove();if (!e) return !1;if (e.parent) {
    var t = e.parent.children;~t.indexOf(e) && t.splice(t.indexOf(e), 1);
  } else ~this.model.indexOf(e) && this.model.splice(this.model.indexOf(e), 1);e.parent && e.parent.indeterminate() && !e.parent.hasChildren() && e.parent.state("indeterminate", !1), e.parent = null, this.$emit("node:removed", e), this.selectedNodes.remove(e), this.checkedNodes.remove(e);var n = this.vm.matches;return n && n.length && n.includes(e) && n.splice(n.indexOf(e), 1), e;
}, Tree.prototype.isNode = function (e) {
  return e instanceof Node;
}, Tree.prototype.find = function (e, t) {
  if (e instanceof Node) return e;var n = find(this.model, e);return n && n.length ? new Selection(this, !0 === t ? n : [n[0]]) : null;
}, Tree.prototype.getNode = function (e) {
  return e instanceof Node ? e : null;
}, Tree.prototype.objectToNode = function (e) {
  return objectToNode(this, e);
}, Tree.prototype.parse = function (e, t) {
  t || (t = this.options.propertyNames);try {
    return TreeParser.parse(e, this, t);
  } catch (e) {
    return console.error(e), [];
  }
};var keyCodes = { ARROW_LEFT: 37, ARROW_TOP: 38, ARROW_RIGHT: 39, ARROW_BOTTOM: 40, SPACE: 32, DELETE: 46, ENTER: 13, ESC: 27 },
    codesArr = [37, 38, 39, 40, 32];function focusUp(e, t) {
  var n = e.prevVisibleNode(t);if (n) return n.disabled() ? focusUp(e, n) : void n.focus();
}function focusdDown(e, t) {
  var n = e.nextVisibleNode(t);if (n) return n.disabled() ? focusdDown(e, n) : void n.focus();
}function checkNode(e, t) {
  e.options.checkbox && (t.checked() ? t.uncheck() : t.check());
}function leftArrow(e, t) {
  if (t.expanded()) t.collapse();else {
    var n = t.parent;n && n.focus();
  }
}function rightArrow(e, t) {
  if (t.collapsed()) t.expand();else {
    var n = t.first();n && n.focus();
  }
}function deleteNode(e, t) {
  var n = e.options.deletion;n && ("function" == typeof n ? !0 === n(t) && t.remove() : !0 === n && t.remove());
}function initKeyboardNavigation(e) {
  e.vm.$el.addEventListener("keydown", function (t) {
    var n = t.keyCode,
        r = e.activeElement;if (e.isNode(r)) if (r.isEditing) switch (n) {case keyCodes.ESC:
        return r.stopEditing(!1);} else switch (codesArr.includes(n) && (t.preventDefault(), t.stopPropagation()), n) {case keyCodes.ARROW_LEFT:
        return leftArrow(e, r);case keyCodes.ARROW_RIGHT:
        return rightArrow(e, r);case keyCodes.ARROW_TOP:
        return focusUp(e, r);case keyCodes.ARROW_BOTTOM:
        return focusdDown(e, r);case keyCodes.SPACE:case keyCodes.ENTER:
        return checkNode(e, r);case keyCodes.DELETE:
        return deleteNode(e, r);}
  }, !0);
}function initEvents(e) {
  var t = e.opts,
      n = t.multiple,
      r = t.checkbox,
      i = function i(t) {
    var i = e.selected();r ? e.$emit("input", { selected: n ? i : i[0] || null, checked: e.checked() }) : e.$emit("input", n ? i : i[0] || null);
  };e.tree.$on("node:selected", function (t) {
    n ? i(e.selected()) : i();
  }), e.tree.$on("node:unselected", i), r && (e.tree.$on("node:checked", i), e.tree.$on("node:unchecked", i));
}var TreeMixin = { mounted: function mounted() {
    var e,
        t = this,
        n = new Tree(this);this.tree = n, this._provided.tree = n, !this.data && this.opts.fetchData ? e = n.fetchInitData() : this.data && this.data.then ? (e = this.data, this.loading = !0) : e = Promise.resolve(this.data), e.then(function (e) {
      e || (e = []), t.opts.store ? t.connectStore(t.opts.store) : t.tree.setModel(e), t.loading && (t.loading = !1), t.$emit("tree:mounted", t);
    }), !1 !== this.opts.keyboardNavigation && initKeyboardNavigation(n), initEvents(this);
  }, methods: { connectStore: function connectStore(e) {
      var t = this,
          n = e.store,
          r = e.key,
          i = e.getter,
          o = this.tree,
          s = this.opts.modelParse,
          d = function d(e) {
        t.model = o.parse(e, s), t.tree.setModel(t.model);
      },
          c = function c(e, t) {
        return void 0 === e && (e = []), e.forEach(function (e, n) {
          t[n] && e.text == t[n].text && (e.state = Object.assign({}, e.state, t[n].states), e.children && e.children.length && t[n].children && c(e.children, t[n].children));
        }), e;
      },
          a = function a(e, t) {
        return i ? e.getters[i] || [] : e.state[r] || [];
      },
          h = e.mutations;h && !h.length && (h = null), d(a(n)), n.subscribe(function (e, r) {
        var i;h && !h.includes(e.type) || (i = a(n), d(c(i, t.model)));
      });
    }, recurseDown: function recurseDown(e) {
      this.tree.recurseDown(e);
    }, selected: function selected() {
      return this.tree.selected();
    }, checked: function checked() {
      return this.tree.checked();
    }, append: function append(e, t) {
      return t ? this.tree.append(e, t) : this.tree.addToModel(e, this.tree.model.length);
    }, prepend: function prepend(e, t) {
      return t ? this.tree.prepend(e, t) : this.tree.addToModel(e, 0);
    }, addChild: function addChild(e, t) {
      return this.append(e, t);
    }, remove: function remove(e, t) {
      return this.tree.remove(e, t);
    }, before: function before(e, t) {
      return t ? this.tree.before(e, t) : this.prepend(e);
    }, after: function after(e, t) {
      return t ? this.tree.after(e, t) : this.append(e);
    }, find: function find(e, t) {
      return this.tree.find(e, t);
    }, findAll: function findAll(e) {
      return this.tree.find(e, !0);
    }, expandAll: function expandAll() {
      return this.tree.expandAll();
    }, collapseAll: function collapseAll() {
      return this.tree.collapseAll();
    }, sortTree: function sortTree(e, t) {
      return this.tree.sortTree(e, t);
    }, sort: function sort() {
      for (var e, t = [], n = arguments.length; n--;) {
        t[n] = arguments[n];
      }return (e = this.tree).sort.apply(e, t);
    }, toJSON: function toJSON() {
      return JSON.parse(JSON.stringify(this.model));
    } } };!function () {
  if ("undefined" != typeof document) {
    var e = document.head || document.getElementsByTagName("head")[0],
        t = document.createElement("style"),
        n = " .tree { overflow: auto; } .tree-root, .tree-children { list-style: none; padding: 0; } .tree > .tree-root, .tree > .tree-filter-empty { padding: 3px; box-sizing: border-box; } ";t.type = "text/css", t.styleSheet ? t.styleSheet.cssText = n : t.appendChild(document.createTextNode(n)), e.appendChild(t);
  }
}();var defaults = { multiple: !0, checkbox: !1, checkOnSelect: !1, autoCheckChildren: !0, parentSelect: !1, keyboardNavigation: !0, paddingLeft: 24, fetchData: null, propertyNames: null, deletion: !1, onFetchError: function onFetchError(e) {
    throw e;
  } },
    filterDefaults = { emptyText: "Nothing found!", matcher: function matcher(e, t) {
    return new RegExp(e, "i").test(t.text);
  }, plainList: !1, showChildren: !0 },
    TreeRoot = { render: function render() {
    var e = this,
        t = e.$createElement,
        n = e._self._c || t;return n("div", { class: { tree: !0, "tree-loading": this.loading }, attrs: { role: "tree" } }, [e.filter && 0 == e.matches.length ? [n("div", { staticClass: "tree-filter-empty" }, [e._v(e._s(e.opts.filter.emptyText))])] : [n("ul", { staticClass: "tree-root" }, [e.opts.filter.plainList && e.matches.length > 0 ? e._l(e.matches, function (t) {
      return t.visible() ? n("node", { key: t.id, attrs: { node: t, options: e.opts } }) : e._e();
    }) : e._l(e.model, function (t) {
      return t.visible() ? n("node", { key: t.id, attrs: { node: t, options: e.opts } }) : e._e();
    })], 2)]], 2);
  }, staticRenderFns: [], name: "Tree", components: { node: TreeNode }, mixins: [TreeMixin], provide: function provide(e) {
    return { tree: null };
  }, props: { data: {}, options: { type: Object, default: function _default(e) {
        return {};
      } }, filter: String }, watch: { filter: function filter(e) {
      this.tree.filter(e);
    } }, data: function data() {
    var e = Object.assign({}, defaults, this.options);return e.filter = Object.assign({}, filterDefaults, e.filter), { model: null, tree: null, loading: !1, opts: e, matches: [] };
  } },
    install = function install(e) {
  e.component(TreeRoot.name, TreeRoot);
};TreeRoot.install = install, "undefined" != typeof window && window.Vue && window.Vue.use(TreeRoot);/* harmony default export */ __webpack_exports__["a"] = (TreeRoot);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/rights.vue?vue&type=template&id=646d2436&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.id,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"title":item.titleLocale || item.title,"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])])],1)})],2)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/functionRight/rights.vue?vue&type=template&id=646d2436&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/functionRight/rights.vue?vue&type=script&lang=js&


/* harmony default export */ var rightsvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
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
            group = { id: groupName, title: groupName, items: [] };
            groups.push(group);
          }
          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
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

      return this.$api.post(this.apiPath + '/rights', { roleId: this.role.id, page: { index: index } }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      this.$view.navigate('/a/baseadmin/functionRight/add?roleId=' + this.role.id + '&menu=' + this.menu);
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post(_this2.apiPath + '/delete', { id: item.id }).then(function () {
          _this2.$meta.eventHub.$emit('functionRight:delete', { id: item.id, roleId: _this2.role.id });
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
// EXTERNAL MODULE: ./front/src/components/functionRight/rights.vue?vue&type=style&index=0&id=646d2436&scoped=true&lang=css&
var rightsvue_type_style_index_0_id_646d2436_scoped_true_lang_css_ = __webpack_require__(39);

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
  "646d2436",
  null
  
)

component.options.__file = "rights.vue"
/* harmony default export */ var rights = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 18 */
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

component.options.__file = "info.vue"
/* harmony default export */ var info = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 19 */
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
        _this.$meta.eventHub.$emit('role:save', { roleId: _this.role.id, roleIdParent: _this.role.roleIdParent, role: _this.role });
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
                _this2.$api.post('role/move', { roleId: _this2.role.id, roleIdParent: roleIdParent }).then(function (data) {
                  _this2.$meta.eventHub.$emit('role:move', { roleId: _this2.role.id, roleIdFrom: _this2.role.roleIdParent, roleIdTo: roleIdParent });
                  _this2.$meta.eventHub.$emit('role:dirty', { dirty: true });
                  _this2.$view.toast.show({ text: _this2.$text('Operation succeeded') });
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
        return _this3.$api.post('role/delete', { roleId: _this3.role.id }).then(function () {
          _this3.$meta.eventHub.$emit('role:delete', { roleId: _this3.role.id, roleIdParent: _this3.role.roleIdParent });
          _this3.$meta.eventHub.$emit('role:dirty', { dirty: true });
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

component.options.__file = "info.vue"
/* harmony default export */ var info = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/children.vue?vue&type=template&id=20ac0a8d&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.roleName,"eb-href":("role/edit?roleId=" + (item.id))}},[_c('f7-badge',{attrs:{"slot":"media"},slot:"media"},[_vm._v(_vm._s(item.sorting))]),_vm._v(" "),_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.leader)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Leader')))]):_vm._e(),_vm._v(" "),(item.catalog)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Catalog')))]):_vm._e(),_vm._v(" "),(item.system)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('System')))]):_vm._e()],1)],1)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
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

      return this.$api.post('role/children', { roleId: this.role.id, page: { index: index } }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      return this.addRole({ catalog: 0 });
    },
    onPerformAddCatalog: function onPerformAddCatalog() {
      return this.addRole({ catalog: 1 });
    },
    addRole: function addRole(_ref2) {
      var _this2 = this;

      var catalog = _ref2.catalog;

      return this.$api.post('role/add', { roleIdParent: this.role.id, catalog: catalog }).then(function (data) {
        _this2.$meta.eventHub.$emit('role:add', { roleIdParent: _this2.role.id, roleId: data });
        _this2.$meta.eventHub.$emit('role:dirty', { dirty: true });
        _this2.$view.navigate('/a/baseadmin/role/edit?roleId=' + data);
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
// EXTERNAL MODULE: ./front/src/components/role/children.vue?vue&type=style&index=0&id=20ac0a8d&scoped=true&lang=css&
var childrenvue_type_style_index_0_id_20ac0a8d_scoped_true_lang_css_ = __webpack_require__(43);

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

component.options.__file = "children.vue"
/* harmony default export */ var children = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/includes.vue?vue&type=template&id=aacc4bee&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.roleName,"eb-href":("role/edit?roleId=" + (item.roleIdInc)),"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onRemove}},[_vm._v(_vm._s(_vm.$text('Remove')))])])])],1)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
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

      return this.$api.post('role/includes', { roleId: this.role.id, page: { index: index } }).then(function (data) {
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
              _this2.$api.post('role/addRoleInc', { roleId: _this2.role.id, roleIdInc: data.id }).then(function (data) {
                _this2.$meta.eventHub.$emit('role:dirty', { dirty: true });
                _this2.reload();
                _this2.$view.toast.show({ text: _this2.$text('Operation succeeded') });
              });
            }
          }
        }
      });
    },
    onRemove: function onRemove(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('role/removeRoleInc', { id: item.id }).then(function () {
          _this3.onRoleDelete({ roleId: item.roleIdInc });
          _this3.$meta.eventHub.$emit('role:dirty', { dirty: true });
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
// EXTERNAL MODULE: ./front/src/components/role/includes.vue?vue&type=style&index=0&id=aacc4bee&scoped=true&lang=css&
var includesvue_type_style_index_0_id_aacc4bee_scoped_true_lang_css_ = __webpack_require__(45);

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

component.options.__file = "includes.vue"
/* harmony default export */ var includes = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/user/roles.vue?vue&type=template&id=056c4d8a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.roleName,"eb-href":("role/edit?roleId=" + (item.roleId)),"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onRemove}},[_vm._v(_vm._s(_vm.$text('Remove')))])])])],1)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
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

      return this.$api.post('user/roles', { userId: this.user.id, page: { index: index } }).then(function (data) {
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
              _this2.$api.post('user/addRole', { userId: _this2.user.id, roleId: data.id }).then(function () {
                _this2.$meta.eventHub.$emit('user:addRole', { userId: _this2.user.id, roleId: data.id });
                _this2.reload();
                _this2.$view.toast.show({ text: _this2.$text('Operation succeeded') });
              });
            }
          }
        }
      });
    },
    onRemove: function onRemove(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('user/removeRole', { id: item.id }).then(function () {
          _this3.onRoleDelete({ roleId: item.roleId });
          _this3.$meta.eventHub.$emit('user:removeRole', { userId: _this3.user.id, roleId: item.roleId });
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
// EXTERNAL MODULE: ./front/src/components/user/roles.vue?vue&type=style&index=0&id=056c4d8a&scoped=true&lang=css&
var rolesvue_type_style_index_0_id_056c4d8a_scoped_true_lang_css_ = __webpack_require__(49);

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

component.options.__file = "roles.vue"
/* harmony default export */ var roles = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/rights.vue?vue&type=template&id=0d8596e8&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.id,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"title":item.actionName,"swipeout":""}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.action!==1 && item.scope==='0')?_c('f7-badge',[_vm._v("Self")]):_vm._e(),_vm._v(" "),(item.scopeRoles)?_vm._l((item.scopeRoles),function(scopeRole){return _c('f7-badge',{key:scopeRole.id},[_vm._v(_vm._s(scopeRole.roleName))])}):_vm._e()],2),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])])],1)})],2)})),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atomRight/rights.vue?vue&type=template&id=0d8596e8&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atomRight/rights.vue?vue&type=script&lang=js&


/* harmony default export */ var rightsvue_type_script_lang_js_ = ({
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

  computed: {
    itemGroups: function itemGroups() {
      if (!this.items) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          var groupName = item.module + '.' + item.atomClassName;
          if (!group || group.id !== groupName) {
            group = { id: groupName, title: groupName, items: [] };
            groups.push(group);
          }
          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
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

      return this.$api.post('atomRight/rights', { roleId: this.role.id, page: { index: index } }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onPerformAdd: function onPerformAdd() {
      this.$view.navigate('/a/baseadmin/atomRight/add?roleId=' + this.role.id);
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post('atomRight/delete', { id: item.id }).then(function () {
          _this2.$meta.eventHub.$emit('atomRight:delete', { id: item.id, roleId: _this2.role.id });
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
// EXTERNAL MODULE: ./front/src/components/atomRight/rights.vue?vue&type=style&index=0&id=0d8596e8&scoped=true&lang=css&
var rightsvue_type_style_index_0_id_0d8596e8_scoped_true_lang_css_ = __webpack_require__(31);

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
  "0d8596e8",
  null
  
)

component.options.__file = "rights.vue"
/* harmony default export */ var rights = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__);
var Vue = void 0;



function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: __webpack_require__(27).default,
    store: __webpack_require__(51).default(Vue),
    config: __webpack_require__(52).default,
    locales: __webpack_require__(53).default,
    components: __webpack_require__(55).default
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 26 */,
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(28)("./" + name + '.vue').default;
}

/* harmony default export */ __webpack_exports__["default"] = ([{ path: 'role/list', component: load('role/list') }, { path: 'role/edit', component: load('role/edit') }, { path: 'role/select', component: load('role/select') }, { path: 'user/list', component: load('user/list') }, { path: 'user/view', component: load('user/view') }, { path: 'user/search', component: load('user/search') }, { path: 'user/rights', component: load('user/rights') }, { path: 'atomRight/list', component: load('atomRight/list') }, { path: 'atomRight/edit', component: load('atomRight/edit') }, { path: 'atomRight/add', component: load('atomRight/add') }, { path: 'menuRight/list', component: load('menuRight/list') }, { path: 'functionRight/list', component: load('functionRight/list') }, { path: 'functionRight/edit', component: load('functionRight/edit') }, { path: 'functionRight/add', component: load('functionRight/add') }, { path: 'auth/list', component: load('auth/list') }, { path: 'auth/edit', component: load('auth/edit') }]);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atomRight/add.vue": 59,
	"./atomRight/edit.vue": 64,
	"./atomRight/list.vue": 63,
	"./auth/edit.vue": 65,
	"./auth/list.vue": 57,
	"./functionRight/add.vue": 58,
	"./functionRight/edit.vue": 71,
	"./functionRight/list.vue": 60,
	"./menuRight/list.vue": 61,
	"./role/edit.vue": 62,
	"./role/list.vue": 67,
	"./role/select.vue": 68,
	"./user/list.vue": 70,
	"./user/rights.vue": 66,
	"./user/search.vue": 56,
	"./user/view.vue": 69
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
webpackContext.id = 28;

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_17a66374_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_17a66374_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_17a66374_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_17a66374_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 30 */,
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_0d8596e8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_0d8596e8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_0d8596e8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_0d8596e8_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 32 */,
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_7e0f23f0_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_7e0f23f0_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_7e0f23f0_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_7e0f23f0_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_10fbc892_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_10fbc892_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_10fbc892_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_10fbc892_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 36 */,
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_6c877d84_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_6c877d84_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_6c877d84_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_add_vue_vue_type_style_index_0_id_6c877d84_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 38 */,
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_646d2436_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_646d2436_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_646d2436_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_rights_vue_vue_type_style_index_0_id_646d2436_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 40 */,
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_14bc8c86_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_14bc8c86_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_14bc8c86_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_spreads_vue_vue_type_style_index_0_id_14bc8c86_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 42 */,
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_children_vue_vue_type_style_index_0_id_20ac0a8d_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_children_vue_vue_type_style_index_0_id_20ac0a8d_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_children_vue_vue_type_style_index_0_id_20ac0a8d_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_children_vue_vue_type_style_index_0_id_20ac0a8d_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 44 */,
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_includes_vue_vue_type_style_index_0_id_aacc4bee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_includes_vue_vue_type_style_index_0_id_aacc4bee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_includes_vue_vue_type_style_index_0_id_aacc4bee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_includes_vue_vue_type_style_index_0_id_aacc4bee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 46 */,
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_09c9b8f0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_09c9b8f0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_09c9b8f0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_09c9b8f0_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 48 */,
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_roles_vue_vue_type_style_index_0_id_056c4d8a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_roles_vue_vue_type_style_index_0_id_056c4d8a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_roles_vue_vue_type_style_index_0_id_056c4d8a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_roles_vue_vue_type_style_index_0_id_056c4d8a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 50 */,
/* 51 */
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
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(54).default
});

/***/ }),
/* 54 */
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
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/list.vue?vue&type=template&id=610dc8f1&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClick(node)}}},[_vm._v(_vm._s(node.text))])}}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/role/list.vue?vue&type=template&id=610dc8f1&

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/@zhennann/liquor-tree/dist/liquor-tree.esm.js
var liquor_tree_esm = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/role/list.vue?vue&type=script&lang=js&
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    global: true
  },
  props: {
    roleIdStart: {
      type: Number
    }
  },
  components: _defineProperty({}, liquor_tree_esm["a" /* default */].name, liquor_tree_esm["a" /* default */]),
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
      return this.$api.post('role/children', { roleId: roleId, page: { size: 0 } }).then(function (data) {
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
      }).catch(function (err) {
        _this2.$view.toast.show({ text: err.message });
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

component.options.__file = "list.vue"
/* harmony default export */ var list = (component.exports);
// EXTERNAL MODULE: ./front/src/components/role/info.vue + 4 modules
var info = __webpack_require__(19);

// EXTERNAL MODULE: ./front/src/components/role/children.vue + 4 modules
var children = __webpack_require__(20);

// EXTERNAL MODULE: ./front/src/components/role/includes.vue + 4 modules
var includes = __webpack_require__(21);

// EXTERNAL MODULE: ./front/src/components/user/info.vue + 4 modules
var user_info = __webpack_require__(18);

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var user_list = __webpack_require__(2);

// EXTERNAL MODULE: ./front/src/components/user/roles.vue + 4 modules
var roles = __webpack_require__(22);

// EXTERNAL MODULE: ./front/src/components/atomRight/rights.vue + 4 modules
var rights = __webpack_require__(23);

// EXTERNAL MODULE: ./front/src/components/atomRight/spreads.vue + 4 modules
var spreads = __webpack_require__(3);

// EXTERNAL MODULE: ./front/src/components/functionRight/rights.vue + 4 modules
var functionRight_rights = __webpack_require__(17);

// EXTERNAL MODULE: ./front/src/components/functionRight/spreads.vue + 4 modules
var functionRight_spreads = __webpack_require__(4);

// CONCATENATED MODULE: ./front/src/components.js












/* harmony default export */ var components = __webpack_exports__["default"] = ({
  ebRoleList: list,
  roleInfo: info["a" /* default */],
  roleChildren: children["a" /* default */],
  roleIncludes: includes["a" /* default */],
  userInfo: user_info["a" /* default */],
  userList: user_list["a" /* default */],
  userRoles: roles["a" /* default */],
  atomRightRights: rights["a" /* default */],
  atomRightSpreads: spreads["a" /* default */],
  functionRightRights: functionRight_rights["a" /* default */],
  functionRightSpreads: functionRight_spreads["a" /* default */]
});

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/search.vue?vue&type=template&id=3b8c4c54&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-search-page',{attrs:{"title":_vm.$text('Search User')}},[_c('users',{attrs:{"slot":"list"},slot:"list"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/search.vue?vue&type=template&id=3b8c4c54&

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var list = __webpack_require__(2);

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

component.options.__file = "search.vue"
/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/list.vue?vue&type=template&id=e60af76e&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Auth Management'),"eb-back-link":"Back"}}),_vm._v(" "),(_vm.ready)?_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"eb-href":("auth/edit?id=" + (item.id)),"title":_vm.getModule(item.module).titleLocale,"swipeout":""}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.disabled===1)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Disabled')))]):_vm._e()],1),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[(item.disabled===0)?_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDisable}},[_vm._v(_vm._s(_vm.$text('Disable')))]):_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformEnable}},[_vm._v(_vm._s(_vm.$text('Enable')))])])])],1)})):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/auth/list.vue?vue&type=template&id=e60af76e&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/list.vue?vue&type=script&lang=js&



var ebModules = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebModules;
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

      return this.$api.post('auth/disable', { id: item.id, disabled: disabled }).then(function () {
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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/add.vue?vue&type=template&id=6c877d84&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text(_vm.menu===1?'New Menu Right':'New Function Right'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onSave}})],1)],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',{attrs:{"smartSelect":"","title":_vm.$text('Module'),"smartSelectParams":{openIn: 'page', closeOnSelect: true}}},[_c('eb-select',{attrs:{"name":"module","options":_vm.modules},model:{value:(_vm.module),callback:function ($$v) {_vm.module=$$v},expression:"module"}})],1),_vm._v(" "),(!!_vm.module)?_c('f7-list-item',{attrs:{"title":_vm.$text(_vm.menu===1?'Menu':'Function'),"link":"#"},on:{"click":_vm.onSelectFunction}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.func && _vm.func.title))])]):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/functionRight/add.vue?vue&type=template&id=6c877d84&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/add.vue?vue&type=script&lang=js&


/* harmony default export */ var addvue_type_script_lang_js_ = ({
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
      var functionsAll = this.$store.getState('a/base/functions');
      if (!functionsAll) return [];
      var options = [{ title: null, value: '' }];
      for (var key in functionsAll) {
        options.push({ title: key, value: key });
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
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-base', function (module) {
      _this.$store.dispatch('a/base/getFunctions');
    });
  },

  methods: {
    onSelectFunction: function onSelectFunction() {
      var _this2 = this;

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
              _this2.func = data;
            }
          }
        }
      });
    },
    onSave: function onSave() {
      var _this3 = this;

      if (!this.module || !this.func) return;
      return this.$api.post(this.apiPath + '/add', {
        roleId: this.roleId,
        module: this.module,
        name: this.func.name
      }).then(function () {
        _this3.$meta.eventHub.$emit('functionRight:add', { roleId: _this3.roleId });
        _this3.$f7router.back();
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/functionRight/add.vue?vue&type=script&lang=js&
 /* harmony default export */ var functionRight_addvue_type_script_lang_js_ = (addvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/functionRight/add.vue?vue&type=style&index=0&id=6c877d84&scoped=true&lang=css&
var addvue_type_style_index_0_id_6c877d84_scoped_true_lang_css_ = __webpack_require__(37);

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
  "6c877d84",
  null
  
)

component.options.__file = "add.vue"
/* harmony default export */ var add = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/add.vue?vue&type=template&id=17a66374&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('New Atom Right'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onSave}})],1)],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',{attrs:{"title":_vm.$text('Atom Class'),"link":"#"},on:{"click":_vm.onSelectAtomClass}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.atomClass && _vm.atomClass.title))])]),_vm._v(" "),_c('f7-list-item',{attrs:{"smartSelect":"","title":_vm.$text('Atom Action'),"smartSelectParams":{openIn: 'page', closeOnSelect: true}}},[_c('eb-select',{attrs:{"name":"actionCode","options":_vm.actions},model:{value:(_vm.actionCode),callback:function ($$v) {_vm.actionCode=$$v},expression:"actionCode"}})],1),_vm._v(" "),(_vm.scopeSelfEnable)?_c('f7-list-item',{attrs:{"title":_vm.$text('Scope')}},[_c('span',{staticClass:"text-color-gray"},[_vm._v("Self")]),_vm._v(" "),_c('eb-toggle',{model:{value:(_vm.scopeSelf),callback:function ($$v) {_vm.scopeSelf=$$v},expression:"scopeSelf"}})],1):_vm._e(),_vm._v(" "),(_vm.scopeEnable)?_c('f7-list-item',{attrs:{"title":_vm.$text('Scope'),"link":"#"},on:{"click":_vm.onSelectScope}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.scopeTitle))])]):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atomRight/add.vue?vue&type=template&id=17a66374&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/add.vue?vue&type=script&lang=js&



var ebActions = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebActions;
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
      var options = [{ title: null, value: '' }];
      for (var key in actions) {
        if (actions[key].authorize) {
          options.push({ title: key, value: actions[key].code });
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
        _this3.$meta.eventHub.$emit('atomRight:add', { roleId: _this3.roleId });
        _this3.$f7router.back();
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atomRight/add.vue?vue&type=script&lang=js&
 /* harmony default export */ var atomRight_addvue_type_script_lang_js_ = (addvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/atomRight/add.vue?vue&type=style&index=0&id=17a66374&scoped=true&lang=css&
var addvue_type_style_index_0_id_17a66374_scoped_true_lang_css_ = __webpack_require__(29);

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
  "17a66374",
  null
  
)

component.options.__file = "add.vue"
/* harmony default export */ var add = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/list.vue?vue&type=template&id=6f3a1a44&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Function Right Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/functionRight/list.vue?vue&type=template&id=6f3a1a44&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/functionRight/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
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
      this.$view.navigate("/a/baseadmin/functionRight/edit?roleId=" + node.id + "&menu=0");
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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menuRight/list.vue?vue&type=template&id=7f9c6551&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Menu Right Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menuRight/list.vue?vue&type=template&id=7f9c6551&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menuRight/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
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
      this.$view.navigate("/a/baseadmin/functionRight/edit?roleId=" + node.id + "&menu=1");
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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 62 */
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
var info = __webpack_require__(19);

// EXTERNAL MODULE: ./front/src/components/role/children.vue + 4 modules
var children = __webpack_require__(20);

// EXTERNAL MODULE: ./front/src/components/role/includes.vue + 4 modules
var includes = __webpack_require__(21);

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var list = __webpack_require__(2);

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

    this.$api.post('role/item', { roleId: this.roleId }).then(function (data) {
      _this.role = data;
    });
  },

  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('Role');
      if (this.role) title = title + ': ' + this.role.roleName;
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

component.options.__file = "edit.vue"
/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/list.vue?vue&type=template&id=66a3d0e5&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Atom Right Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atomRight/list.vue?vue&type=template&id=66a3d0e5&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atomRight/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
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
      this.$view.navigate("/a/baseadmin/atomRight/edit?roleId=" + node.id);
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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 64 */
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
var rights = __webpack_require__(23);

// EXTERNAL MODULE: ./front/src/components/atomRight/spreads.vue + 4 modules
var spreads = __webpack_require__(3);

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

    this.$api.post('role/item', { roleId: this.roleId }).then(function (data) {
      _this.role = data;
    });
  },

  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('Atom Right');
      if (this.role) title = title + ': ' + this.role.roleName;
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

component.options.__file = "edit.vue"
/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/edit.vue?vue&type=template&id=10fbc892&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Edit'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}})],1)],1),_vm._v(" "),_c('f7-block',[_c('eb-validate',{ref:"validate",attrs:{"auto":"","data":_vm.config,"params":{validator: 'auth'},"onPerform":_vm.onPerformValidate}})],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/auth/edit.vue?vue&type=template&id=10fbc892&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/auth/edit.vue?vue&type=script&lang=js&


/* harmony default export */ var editvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      id: parseInt(this.$f7route.query.id),
      item: null,
      config: null
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('auth/item', { id: this.id }).then(function (data) {
      _this.item = data;
      _this.config = JSON.parse(data.config);
    });
  },

  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this2 = this;

      return this.$api.post('auth/save', {
        id: this.id,
        data: this.config
      }).then(function () {
        _this2.$f7router.back();
      });
    },
    onPerformSave: function onPerformSave() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/auth/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var auth_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/auth/edit.vue?vue&type=style&index=0&id=10fbc892&scoped=true&lang=css&
var editvue_type_style_index_0_id_10fbc892_scoped_true_lang_css_ = __webpack_require__(35);

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
  "10fbc892",
  null
  
)

component.options.__file = "edit.vue"
/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 66 */
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
var spreads = __webpack_require__(3);

// EXTERNAL MODULE: ./front/src/components/functionRight/spreads.vue + 4 modules
var functionRight_spreads = __webpack_require__(4);

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

    this.$api.post('user/item', { userId: this.userId }).then(function (data) {
      _this.user = data;
    });
  },

  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('User');
      if (this.user) title = title + ': ' + this.user.userName;
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

component.options.__file = "rights.vue"
/* harmony default export */ var rights = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/list.vue?vue&type=template&id=1515f616&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Role Management'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-role-list',{ref:"roleList",attrs:{"roleIdStart":_vm.roleIdStart},on:{"node:click":_vm.onNodeClick}}),_vm._v(" "),(_vm.roleDirty)?_c('f7-fab',{attrs:{"color":"pink"}},[_c('f7-icon',{attrs:{"material":"add"}}),_vm._v(" "),_c('f7-icon',{attrs:{"material":"close"}}),_vm._v(" "),_c('f7-fab-buttons',[_c('eb-fab-button',{attrs:{"color":"orange","onPerform":_vm.onPerformBuild}},[_vm._v(_vm._s(_vm.$text('Build')))])],1)],1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/role/list.vue?vue&type=template&id=1515f616&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
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
      this.$view.navigate('/a/baseadmin/role/edit?roleId=' + node.id);
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

      var _loop = function _loop(roleIdParent) {
        var node = _this.tree.find(function (node) {
          return node.id === data[roleIdParent];
        });
        _this.reloadChildren(node && node[0]);
      };

      var _arr = ['roleIdFrom', 'roleIdTo'];

      for (var _i = 0; _i < _arr.length; _i++) {
        var roleIdParent = _arr[_i];
        _loop(roleIdParent);
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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/select.vue?vue&type=template&id=1b516a9a&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Roles'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"done"},on:{"click":function($event){$event.preventDefault();return _vm.onDone($event)}}})],1)],1),_vm._v(" "),_c('tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClick(node)}}},[(node.states._selected)?_c('f7-icon',{attrs:{"material":"check_box"}}):_vm._e(),_vm._v(_vm._s(node.text))],1)}}])})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/role/select.vue?vue&type=template&id=1b516a9a&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/@zhennann/liquor-tree/dist/liquor-tree.esm.js
var liquor_tree_esm = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/role/select.vue?vue&type=script&lang=js&
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  components: _defineProperty({}, liquor_tree_esm["a" /* default */].name, liquor_tree_esm["a" /* default */]),
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
      return this.$api.post('role/children', { roleId: roleId, page: { size: 0 } }).then(function (data) {
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
      }).catch(function (err) {
        _this2.$view.toast.show({ text: err.message });
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
      var selection = this.$refs.tree.find({ state: { _selected: true } }, true);
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
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
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
      var selection = this.$refs.tree.find({ state: { _selected: true } }, this.multiple);
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

component.options.__file = "select.vue"
/* harmony default export */ var role_select = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 69 */
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
var info = __webpack_require__(18);

// EXTERNAL MODULE: ./front/src/components/user/roles.vue + 4 modules
var roles = __webpack_require__(22);

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

    this.$api.post('user/item', { userId: this.userId }).then(function (data) {
      _this.user = data;
    });
  },

  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text('User');
      if (this.user) title = title + ': ' + this.user.userName;
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

component.options.__file = "view.vue"
/* harmony default export */ var view = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/list.vue?vue&type=template&id=54032113&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('User Management'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"search","eb-target":"_self","eb-href":"user/search"}})],1)],1),_vm._v(" "),_c('users',{ref:"users"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/list.vue?vue&type=template&id=54032113&

// EXTERNAL MODULE: ./front/src/components/user/list.vue + 4 modules
var list = __webpack_require__(2);

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

component.options.__file = "list.vue"
/* harmony default export */ var user_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 71 */
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
var rights = __webpack_require__(17);

// EXTERNAL MODULE: ./front/src/components/functionRight/spreads.vue + 4 modules
var spreads = __webpack_require__(4);

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

    this.$api.post('role/item', { roleId: this.roleId }).then(function (data) {
      _this.role = data;
    });
  },

  methods: {
    getPageTitle: function getPageTitle() {
      var title = this.$text(this.menu === 1 ? 'Menu Right' : 'Function Right');
      if (this.role) title = title + ': ' + this.role.roleName;
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

component.options.__file = "edit.vue"
/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
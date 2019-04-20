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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__);
var Vue;


function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(5)["default"],
    store: __webpack_require__(9)["default"](Vue),
    config: __webpack_require__(10)["default"],
    locales: __webpack_require__(11)["default"],
    components: __webpack_require__(13)["default"]
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(6)("./".concat(name, ".vue"))["default"];
}

/* harmony default export */ __webpack_exports__["default"] = ([{
  path: 'user/mine',
  component: load('user/mine')
}, {
  path: 'user/edit',
  component: load('user/edit')
}, {
  path: 'user/agent',
  component: load('user/agent')
}, {
  path: 'user/functions',
  component: load('user/functions')
}, {
  path: 'user/account',
  component: load('user/account')
}, {
  path: 'user/authentications',
  component: load('user/authentications')
}, {
  path: 'my/atoms',
  component: load('my/atoms')
}]);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./my/atoms.vue": 7,
	"./user/account.vue": 17,
	"./user/agent.vue": 15,
	"./user/authentications.vue": 16,
	"./user/edit.vue": 14,
	"./user/functions.vue": 19,
	"./user/mine.vue": 18
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
webpackContext.id = 6;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var render, staticRenderFns
var script = {}


/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"])(
  script,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_mine_vue_vue_type_style_index_0_id_cf16e3fe_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_mine_vue_vue_type_style_index_0_id_cf16e3fe_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_mine_vue_vue_type_style_index_0_id_cf16e3fe_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_mine_vue_vue_type_style_index_0_id_cf16e3fe_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  agent: {
    disabled: false
  }
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(12)["default"]
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'Not LoggedIn': '未登录',
  'Sign In': '现在登录',
  'Log Out': '退出登录',
  Info: '信息',
  Settings: '设置',
  Username: '用户名',
  Realname: '真实姓名',
  Email: '电子邮箱',
  Mobile: '手机号',
  Motto: '箴言',
  Locale: '本地化',
  Agent: '代理',
  'Agent by': '被代理',
  'Specify agent': '指定代理',
  'No agents': '没有代理',
  Remove: '移除',
  'Please specify the mobile': '请指定手机号',
  Functions: '功能',
  Account: '账户',
  'Change password': '修改密码',
  Change: '修改',
  Confirm: '确认',
  Verify: '验证',
  Authentications: '认证',
  Enabled: '已启用',
  Enable: '启用',
  Disable: '禁用'
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/edit.vue?vue&type=template&id=5d555ddd&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Info'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}})],1)],1),_vm._v(" "),_c('eb-validate',{ref:"validate",attrs:{"auto":false,"data":_vm.user,"params":{module:'a-base',validator: 'user'},"onPerform":_vm.onPerformValidate}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('eb-list-item-validate',{attrs:{"dataKey":"userName"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"realName"}}),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}}),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Email')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('span',[_vm._v(_vm._s(_vm.user.email))]),_vm._v(" "),(_vm.configAccount.url.emailConfirm)?_c('eb-link',{attrs:{"eb-href":_vm.configAccount.url.emailConfirm}},[_vm._v("\n            "+_vm._s(_vm.emailConfirmButtonText)+"\n          ")]):_vm._e()],1)]),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Mobile')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('span',[_vm._v(_vm._s(_vm.user.mobile))]),_vm._v(" "),(_vm.configAccount.url.mobileVerify)?_c('eb-link',{attrs:{"eb-href":_vm.configAccount.url.mobileVerify}},[_vm._v("\n            "+_vm._s(_vm.mobileVerifyButtonText)+"\n          ")]):_vm._e()],1)]),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"motto"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"locale"}})],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/edit.vue?vue&type=template&id=5d555ddd&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/edit.vue?vue&type=script&lang=js&

/* harmony default export */ var editvue_type_script_lang_js_ = ({
  components: {},
  data: function data() {
    return {
      user: external_vue_default.a.prototype.$utils.extend({}, this.$store.state.auth.user.agent),
      configAccount: null
    };
  },
  computed: {
    emailConfirmButtonText: function emailConfirmButtonText() {
      return !this.user.email || this.user.emailConfirmed ? this.$text('Change') : this.$text('Confirm');
    },
    mobileVerifyButtonText: function mobileVerifyButtonText() {
      return !this.user.mobile || this.user.mobileVerified ? this.$text('Change') : this.$text('Verify');
    }
  },
  created: function created() {
    var configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {
    onPerformSave: function onPerformSave(event) {
      return this.$refs.validate.perform(event);
    },
    onPerformValidate: function onPerformValidate(event) {
      var _this = this;

      return this.$api.post('user/save', {
        data: this.user
      }).then(function () {
        _this.$store.state.auth.user.agent = _this.user;

        _this.$f7router.back();
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "5d555ddd",
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/agent.vue?vue&type=template&id=57e70ef6&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Agent'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',[_c('eb-list-item',{attrs:{"title":_vm.$text('Agent'),"group-title":""}}),_vm._v(" "),(!_vm.agentsBy || _vm.agentsBy.length===0)?_c('eb-list-item',{attrs:{"title":_vm.$text('No agents')}}):_vm._e(),_vm._v(" "),(_vm.agentsBy && _vm.agentsBy.length>0)?_vm._l((_vm.agentsBy),function(item){return _c('eb-list-item',{key:item.id,attrs:{"radio":"","disabled":"","checked":_vm.user.op.id===item.id,"title":item.userName}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(_vm.user.op.id===item.id)?_c('eb-button',{attrs:{"context":item,"onPerform":_vm.onPerformSwitchOff}},[_vm._v(_vm._s(_vm.$text('Switch off')))]):_c('eb-button',{attrs:{"context":item,"onPerform":_vm.onPerformSwitch}},[_vm._v(_vm._s(_vm.$text('Switch')))])],1)])}):_vm._e(),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Agent by'),"group-title":""}}),_vm._v(" "),(_vm.agent)?_c('eb-list-item',{attrs:{"title":_vm.agent.userName}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('eb-button',{attrs:{"onPerform":_vm.onPerformRemoveAgent}},[_vm._v(_vm._s(_vm.$text('Remove')))])],1)]):_vm._e(),_vm._v(" "),(!_vm.agent)?_c('f7-list-item',{attrs:{"title":_vm.$text('Specify agent'),"link":"#"},on:{"click":_vm.onSelectUser}}):_vm._e()],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/agent.vue?vue&type=template&id=57e70ef6&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/agent.vue?vue&type=script&lang=js&

/* harmony default export */ var agentvue_type_script_lang_js_ = ({
  components: {},
  data: function data() {
    return {
      user: this.$store.state.auth.user,
      agent: null,
      agentsBy: null
    };
  },
  created: function created() {
    var _this = this;

    this.$api.post('user/agent').then(function (user) {
      _this.agent = user;
    });
    this.$api.post('user/agentsBy').then(function (users) {
      _this.agentsBy = users;
    });
  },
  methods: {
    onSelectUser: function onSelectUser() {
      var _this2 = this;

      this.$view.dialog.prompt(this.$text('Please specify the mobile')).then(function (mobile) {
        if (!mobile) return;

        _this2.$api.post('user/userByMobile', {
          mobile: 1
        }).then(function (userAgent) {
          if (!userAgent) {
            _this2.$view.dialog.alert(_this2.$text('Not found'));
          } else {
            _this2.$view.dialog.confirm("".concat(mobile, "<br>").concat(userAgent.userName)).then(function () {
              _this2.$api.post('user/addAgent', {
                userIdAgent: userAgent.id
              }).then(function () {
                _this2.agent = userAgent;
              });
            });
          }
        });
      });
    },
    onPerformRemoveAgent: function onPerformRemoveAgent(event) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('user/removeAgent', {
          userIdAgent: _this3.agent.id
        }).then(function () {
          _this3.agent = null;
        });
      });
    },
    onPerformSwitch: function onPerformSwitch(event, item) {
      var _this4 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this4.$api.post('user/switchAgent', {
          userIdAgent: item.id
        }).then(function () {
          _this4.$meta.vueApp.reload({
            echo: true
          });
        });
      });
    },
    onPerformSwitchOff: function onPerformSwitchOff(event, item) {
      var _this5 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this5.$api.post('user/switchOffAgent').then(function () {
          _this5.$meta.vueApp.reload({
            echo: true
          });
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/agent.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_agentvue_type_script_lang_js_ = (agentvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/agent.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_agentvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "57e70ef6",
  null
  
)

/* harmony default export */ var agent = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/authentications.vue?vue&type=template&id=076d2434&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Authentications'),"eb-back-link":"Back"}}),_vm._v(" "),(_vm.ready)?_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.providerId,attrs:{"title":_vm.getModule(item.module).titleLocale}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[(item.authId)?_c('f7-badge',[_vm._v(_vm._s(_vm.$text('Enabled')))]):_vm._e(),_vm._v(" "),(!item.authId)?_c('eb-link',{attrs:{"context":item,"onPerform":_vm.onPerformEnable}},[_vm._v(_vm._s(_vm.$text('Enable')))]):_vm._e(),_vm._v(" "),(item.authId && _vm.countEnabled>1)?_c('eb-link',{attrs:{"context":item,"onPerform":_vm.onPerformDisable}},[_vm._v(_vm._s(_vm.$text('Disable')))]):_vm._e()],1)])}),1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/authentications.vue?vue&type=template&id=076d2434&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/authentications.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
/* harmony default export */ var authenticationsvue_type_script_lang_js_ = ({
  mixins: [ebModules],
  data: function data() {
    return {
      items: null
    };
  },
  computed: {
    ready: function ready() {
      return this.modulesAll && this.items;
    },
    countEnabled: function countEnabled() {
      return this.items.filter(function (item) {
        return item.authId;
      }).length;
    }
  },
  created: function created() {
    var _this = this;

    return this.$api.post('user/authentications').then(function (data) {
      _this.items = data;
    });
  },
  methods: {
    onPerformDisable: function onPerformDisable(event, item) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post('user/authenticationDisable', {
          authId: item.authId
        }).then(function () {
          var index = _this2.items.findIndex(function (_item) {
            return _item.providerId === item.providerId;
          });

          item.authId = null;
          external_vue_default.a.set(_this2.items, index, item);
          return true;
        });
      });
    },
    onPerformEnable: function onPerformEnable(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        var module = _this3.getModule(item.module);

        var info = module.info;
        var url = "/api/".concat(info.url, "/passport/").concat(info.relativeName, "/").concat(item.providerName, "?state=associate");

        _this3.$meta.vueApp.toLogin({
          url: url,
          hash: '/a/user/user/authentications'
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/authentications.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_authenticationsvue_type_script_lang_js_ = (authenticationsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/authentications.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_authenticationsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var authentications = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/account.vue?vue&type=template&id=864c1586&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Account'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',[_c('eb-list-item',{attrs:{"title":_vm.$text('Info'),"eb-href":"user/edit"}}),_vm._v(" "),(_vm.configAccount.url.passwordChange)?_c('eb-list-item',{attrs:{"title":_vm.$text('Change password'),"eb-href":_vm.configAccount.url.passwordChange}}):_vm._e(),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}}),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Authentications'),"eb-href":"user/authentications"}}),_vm._v(" "),(!_vm.$config.agent.disabled)?[_c('f7-list-item',{attrs:{"divider":""}}),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Agent'),"eb-href":"user/agent"}})]:_vm._e()],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/account.vue?vue&type=template&id=864c1586&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/account.vue?vue&type=script&lang=js&
/* harmony default export */ var accountvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      configAccount: null
    };
  },
  created: function created() {
    var configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {}
});
// CONCATENATED MODULE: ./front/src/pages/user/account.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_accountvue_type_script_lang_js_ = (accountvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/account.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_accountvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var account = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/mine.vue?vue&type=template&id=cf16e3fe&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Mine'),"eb-back-link":"Back"}}),_vm._v(" "),_c('div',{staticClass:"me"},[_c('div',[_c('img',{staticClass:"avatar avatar48",staticStyle:{"cursor":"pointer"},attrs:{"src":_vm.$meta.util.combineImageUrl(_vm.user.op.avatar,48)},on:{"click":_vm.onClickAvatar}})]),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(_vm.userName))]),_vm._v(" "),(!_vm.loggedIn)?_c('div',{staticClass:"status"},[_vm._v(_vm._s(_vm.$text('Not LoggedIn')))]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"login"},[(!_vm.loggedIn)?_c('eb-link',{attrs:{"onPerform":_vm.onPerformLogin}},[_vm._v(_vm._s(_vm.$text('Sign In')))]):_vm._e(),_vm._v(" "),(_vm.loggedIn)?_c('eb-link',{attrs:{"onPerform":_vm.onPerformLogout}},[_vm._v(_vm._s(_vm.$text('Log Out')))]):_vm._e()],1)]),_vm._v(" "),_c('f7-list',[(!_vm.user.agent.anonymous)?_c('eb-list-item',{attrs:{"title":_vm.$text('Account'),"eb-href":"user/account"}}):_vm._e(),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Functions'),"eb-href":"user/functions"}}),_vm._v(" "),_c('eb-list-item',{attrs:{"title":_vm.$text('Settings'),"eb-href":"/a/settings/user/list"}})],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/mine.vue?vue&type=template&id=cf16e3fe&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/mine.vue?vue&type=script&lang=js&
/* harmony default export */ var minevue_type_script_lang_js_ = ({
  components: {},
  data: function data() {
    return {};
  },
  computed: {
    loggedIn: function loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    user: function user() {
      return this.$store.state.auth.user;
    },
    userName: function userName() {
      var userName = this.user.op.userName;

      if (this.user.op.id !== this.user.agent.id) {
        userName = "".concat(userName, "(").concat(this.$text('Agent'), ")");
      }

      return userName;
    }
  },
  created: function created() {},
  methods: {
    onPerformLogin: function onPerformLogin() {
      this.$meta.vueLayout.openLogin();
    },
    onPerformLogout: function onPerformLogout() {
      var _this = this;

      this.$view.dialog.confirm().then(function () {
        return _this.$api.post('/a/base/auth/logout').then(function () {
          _this.$meta.vueApp.reload({
            echo: true
          });
        });
      });
    },
    onClickAvatar: function onClickAvatar() {
      var _this2 = this;

      if (this.user.agent.anonymous || this.user.op.id !== this.user.agent.id) ;
      this.$view.navigate('/a/file/file/upload', {
        context: {
          params: {
            mode: 1
          },
          callback: function callback(code, res) {
            if (code === 200) {
              return _this2.$api.post('user/saveAvatar', {
                data: {
                  avatar: res.downloadUrl
                }
              }).then(function () {
                _this2.$store.state.auth.user.agent.avatar = res.downloadUrl;
                _this2.$store.state.auth.user.op.avatar = res.downloadUrl;
              });
            }
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/mine.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_minevue_type_script_lang_js_ = (minevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/user/mine.vue?vue&type=style&index=0&id=cf16e3fe&lang=less&scoped=true&
var minevue_type_style_index_0_id_cf16e3fe_lang_less_scoped_true_ = __webpack_require__(8);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/mine.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_minevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "cf16e3fe",
  null
  
)

/* harmony default export */ var mine = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/functions.vue?vue&type=template&id=0b17ac46&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Functions'),"eb-back-link":"Back"}}),_vm._v(" "),(_vm.items)?_c('f7-list',_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group},[_c('f7-list-item',{attrs:{"title":_vm.getModule(group).titleLocale,"group-title":""}}),_vm._v(" "),_vm._l((_vm.getGroupFunctions(group)),function(item){return _c('eb-list-item',{key:item.name,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale}})})],2)}),1):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/user/functions.vue?vue&type=template&id=0b17ac46&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/user/functions.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;
/* harmony default export */ var functionsvue_type_script_lang_js_ = ({
  mixins: [ebModules],
  data: function data() {
    return {
      items: null
    };
  },
  computed: {
    itemGroups: function itemGroups() {
      if (!this.modulesAll) return [];
      return Object.keys(this.items);
    }
  },
  created: function created() {
    var _this = this;

    return this.$api.post('user/functions').then(function (data) {
      _this.items = data;
    });
  },
  methods: {
    getGroupFunctions: function getGroupFunctions(group) {
      return Object.values(this.items[group]);
    },
    onItemClick: function onItemClick(event, item) {
      return this.$meta.util.performAction({
        ctx: this,
        action: item,
        item: item
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/user/functions.vue?vue&type=script&lang=js&
 /* harmony default export */ var user_functionsvue_type_script_lang_js_ = (functionsvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/user/functions.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  user_functionsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var functions = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
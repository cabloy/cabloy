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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
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
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_signin_vue_vue_type_style_index_0_id_1a0a85e4_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_signin_vue_vue_type_style_index_0_id_1a0a85e4_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_signin_vue_vue_type_style_index_0_id_1a0a85e4_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_signin_vue_vue_type_style_index_0_id_1a0a85e4_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(5)("./".concat(name, ".vue"))["default"];
}

/* harmony default export */ __webpack_exports__["default"] = ([{
  path: 'signup',
  component: load('signup')
}, {
  path: 'passwordChange',
  component: load('passwordChange')
}, {
  path: 'passwordForgot',
  component: load('passwordForgot')
}, {
  path: 'passwordReset',
  component: load('passwordReset')
}, {
  path: 'emailConfirm',
  component: load('emailConfirm')
}]);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./emailConfirm.vue": 14,
	"./passwordChange.vue": 12,
	"./passwordForgot.vue": 13,
	"./passwordReset.vue": 15,
	"./signup.vue": 16
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
webpackContext.id = 5;

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'en-us': __webpack_require__(9)["default"],
  'zh-cn': __webpack_require__(10)["default"]
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  emailConfirmSentAlert: 'The confirmation link has been sent to your email address, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another confirmation.',
  passwordResetEmailSentAlert: 'Password reset email has been sent to your email address, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another reset.'
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  Continue: '继续',
  'Forgot password': '忘记密码',
  'Reset password': '重置密码',
  'Sign up': '注册',
  'Sign in': '登录',
  'Your username/mobile/email': '您的用户名/手机号/邮箱',
  'Your password': '您的密码',
  'Remember me': '记住我',
  Username: '用户名',
  Realname: '真实姓名',
  Email: '电子邮箱',
  Mobile: '手机号',
  Password: '密码',
  'Password again': '重复密码',
  'Change password': '修改密码',
  'Old password': '旧密码',
  'New password': '新密码',
  'New password again': '重复新密码',
  OK: '确定',
  'Captcha code': '验证码',
  'Email confirmation': '邮件确认',
  'Send confirmation email': '发送确认邮件',
  emailConfirmSentAlert: '确认链接已经发送至您的邮箱地址，但可能需要几分钟出现在您的收件箱中。若要重发邮件，请至少等10分钟。',
  passwordResetEmailSentAlert: '密码重置邮件已经发送至您的邮箱地址，但可能需要几分钟出现在您的收件箱中。若要重发邮件，请至少等10分钟。'
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/signin.vue?vue&type=template&id=1a0a85e4&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-card',[_c('f7-card-content',[_c('eb-validate',{ref:"validate",attrs:{"onPerform":_vm.onPerformValidate}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',[_c('f7-icon',{attrs:{"slot":"media","material":"person_outline"},slot:"media"}),_vm._v(" "),_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Your username/mobile/email')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Your username/mobile/email'),"clear-button":"","dataPath":"auth"},model:{value:(_vm.data.auth),callback:function ($$v) {_vm.$set(_vm.data, "auth", $$v)},expression:"data.auth"}})],1),_vm._v(" "),_c('f7-list-item',[_c('f7-icon',{attrs:{"slot":"media","material":"lock_outline"},slot:"media"}),_vm._v(" "),_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Your password')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"password","placeholder":_vm.$text('Your password'),"clear-button":"","dataPath":"password"},model:{value:(_vm.data.password),callback:function ($$v) {_vm.$set(_vm.data, "password", $$v)},expression:"data.password"}})],1),_vm._v(" "),_c('f7-list-item',[_c('f7-icon',{attrs:{"slot":"media"},slot:"media"}),_vm._v(" "),(_vm.moduleCaptcha)?[_c('captchaContainer')]:_vm._e()],2),_vm._v(" "),_c('f7-list-item',[_c('f7-icon',{attrs:{"slot":"media"},slot:"media"}),_vm._v(" "),_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Captcha code')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Captcha code'),"clear-button":"","dataPath":"captcha/code"},model:{value:(_vm.captcha.code),callback:function ($$v) {_vm.$set(_vm.captcha, "code", $$v)},expression:"captcha.code"}})],1),_vm._v(" "),_c('f7-list-item',[_c('f7-icon',{attrs:{"slot":"media"},slot:"media"}),_vm._v(" "),_c('span',{staticClass:"text-color-gray"},[_vm._v(_vm._s(_vm.$text('Remember me')))]),_vm._v(" "),_c('eb-toggle',{attrs:{"dataPath":"rememberMe"},model:{value:(_vm.data.rememberMe),callback:function ($$v) {_vm.$set(_vm.data, "rememberMe", $$v)},expression:"data.rememberMe"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}},[_c('span',{staticClass:"eb-list-divider-normal"},[_c('eb-button',{attrs:{"onPerform":_vm.signIn}},[_vm._v(_vm._s(_vm.$text('Sign in')))])],1)])],1)],1)],1),_vm._v(" "),_c('f7-card-footer',[_c('eb-link',{staticClass:"text-smaller",attrs:{"eb-href":"/a/authsimple/passwordForgot","eb-target":"_self"}},[_vm._v(_vm._s(_vm.$text('Forgot password')))]),_vm._v(" "),_c('div'),_vm._v(" "),_c('eb-link',{staticClass:"text-smaller",attrs:{"eb-href":"/a/authsimple/signup","eb-target":"_self"}},[_vm._v(_vm._s(_vm.$text('Sign up')))])],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/signin.vue?vue&type=template&id=1a0a85e4&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/signin.vue?vue&type=script&lang=js&
/* harmony default export */ var signinvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      data: {
        auth: null,
        password: null,
        rememberMe: false
      },
      captcha: {
        code: null
      },
      moduleCaptcha: null
    };
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-captcha', function (module) {
      _this.$options.components.captchaContainer = module.options.components.captchaContainer;
      _this.moduleCaptcha = module;
    });
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this2 = this;

      return this.$api.post('auth/signin', {
        data: this.data,
        captcha: this.captcha
      }).then(function () {
        _this2.$meta.vueApp.reload({
          echo: true
        });
      });
    },
    signIn: function signIn() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/signin.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_signinvue_type_script_lang_js_ = (signinvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/components/signin.vue?vue&type=style&index=0&id=1a0a85e4&lang=less&scoped=true&
var signinvue_type_style_index_0_id_1a0a85e4_lang_less_scoped_true_ = __webpack_require__(2);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/signin.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_signinvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "1a0a85e4",
  null
  
)

/* harmony default export */ var signin = (component.exports);
// EXTERNAL MODULE: ./front/src/assets/css/module.css
var css_module = __webpack_require__(3);

// CONCATENATED MODULE: ./front/src/main.js


var Vue;

function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(4)["default"],
    store: __webpack_require__(6)["default"](Vue),
    config: __webpack_require__(7)["default"],
    locales: __webpack_require__(8)["default"],
    components: {
      signin: signin
    }
  });
}

/* harmony default export */ var main = __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/passwordChange.vue?vue&type=template&id=d779d144&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Change password'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-block',[_c('eb-validate',{ref:"validate",attrs:{"auto":false,"data":_vm.data,"params":{validator: 'passwordChange'},"onPerform":_vm.onPerformValidate}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('eb-list-item-validate',{attrs:{"dataKey":"passwordOld"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"passwordNew"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"passwordNewAgain"}}),_vm._v(" "),_c('f7-list-item',[(_vm.moduleCaptcha)?[_c('captchaContainer')]:_vm._e()],2),_vm._v(" "),_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Captcha code')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Captcha code'),"clear-button":"","dataPath":"captcha/code"},model:{value:(_vm.captcha.code),callback:function ($$v) {_vm.$set(_vm.captcha, "code", $$v)},expression:"captcha.code"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}},[_c('span',{staticClass:"eb-list-divider-normal"},[_c('eb-button',{attrs:{"onPerform":_vm.onPerformOk}},[_vm._v(_vm._s(_vm.$text('OK')))])],1)])],1)],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/passwordChange.vue?vue&type=template&id=d779d144&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/passwordChange.vue?vue&type=script&lang=js&
/* harmony default export */ var passwordChangevue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      data: {
        passwordOld: null,
        passwordNew: null,
        passwordNewAgain: null
      },
      captcha: {
        code: null
      },
      moduleCaptcha: null
    };
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-captcha', function (module) {
      _this.$options.components.captchaContainer = module.options.components.captchaContainer;
      _this.moduleCaptcha = module;
    });
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this2 = this;

      return this.$api.post('auth/passwordChange', {
        data: this.data,
        captcha: this.captcha
      }).then(function () {
        _this2.$f7router.back();
      });
    },
    onPerformOk: function onPerformOk() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/passwordChange.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_passwordChangevue_type_script_lang_js_ = (passwordChangevue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/passwordChange.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_passwordChangevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "d779d144",
  null
  
)

/* harmony default export */ var passwordChange = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/passwordForgot.vue?vue&type=template&id=9afbc8dc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Forgot password'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-block',[(_vm.sent)?[_vm._v(_vm._s(_vm.$text('passwordResetEmailSentAlert')))]:[_c('eb-validate',{ref:"validate",attrs:{"auto":false,"data":_vm.data,"params":{validator: 'passwordForgot'},"onPerform":_vm.onPerformValidate}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('eb-list-item-validate',{attrs:{"dataKey":"email"}}),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}},[_c('span',{staticClass:"eb-list-divider-normal"},[_c('eb-button',{attrs:{"onPerform":_vm.onPerformOk}},[_vm._v(_vm._s(_vm.$text('Reset password')))])],1)])],1)],1)]],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/passwordForgot.vue?vue&type=template&id=9afbc8dc&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/passwordForgot.vue?vue&type=script&lang=js&
/* harmony default export */ var passwordForgotvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      data: null,
      sent: false
    };
  },
  created: function created() {
    var userAgent = this.$store.state.auth.user.agent;
    this.data = {
      email: userAgent.email
    };
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this = this;

      return this.$api.post('auth/passwordForgot', {
        data: this.data
      }).then(function () {
        _this.sent = true;
        return true;
      });
    },
    onPerformOk: function onPerformOk() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/passwordForgot.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_passwordForgotvue_type_script_lang_js_ = (passwordForgotvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/passwordForgot.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_passwordForgotvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "9afbc8dc",
  null
  
)

/* harmony default export */ var passwordForgot = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/emailConfirm.vue?vue&type=template&id=47906ba7&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Email confirmation'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-block',[(_vm.sent)?[_vm._v(_vm._s(_vm.$text('emailConfirmSentAlert')))]:[_c('eb-validate',{ref:"validate",attrs:{"auto":false,"data":_vm.data,"params":{validator: 'emailConfirm'},"onPerform":_vm.onPerformValidate}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('eb-list-item-validate',{attrs:{"dataKey":"userName"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"email"}}),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}},[_c('span',{staticClass:"eb-list-divider-normal"},[_c('eb-button',{attrs:{"onPerform":_vm.onPerformOk}},[_vm._v(_vm._s(_vm.$text('Send confirmation email')))])],1)])],1)],1)]],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/emailConfirm.vue?vue&type=template&id=47906ba7&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/emailConfirm.vue?vue&type=script&lang=js&
/* harmony default export */ var emailConfirmvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      data: null,
      sent: false
    };
  },
  created: function created() {
    var userAgent = this.$store.state.auth.user.agent;
    this.data = {
      userName: userAgent.userName,
      email: userAgent.email
    };
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this = this;

      return this.$api.post('auth/emailConfirm', {
        data: this.data
      }).then(function () {
        _this.sent = true;
        return true;
      });
    },
    onPerformOk: function onPerformOk() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/emailConfirm.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_emailConfirmvue_type_script_lang_js_ = (emailConfirmvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/emailConfirm.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_emailConfirmvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "47906ba7",
  null
  
)

/* harmony default export */ var emailConfirm = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/passwordReset.vue?vue&type=template&id=44c4315d&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Reset password'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-block',[_c('eb-validate',{ref:"validate",attrs:{"auto":false,"data":_vm.data,"params":{validator: 'passwordReset'},"onPerform":_vm.onPerformValidate}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('eb-list-item-validate',{attrs:{"dataKey":"passwordNew"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"passwordNewAgain"}}),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}},[_c('span',{staticClass:"eb-list-divider-normal"},[_c('eb-button',{attrs:{"onPerform":_vm.onPerformOk}},[_vm._v(_vm._s(_vm.$text('OK')))])],1)])],1)],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/passwordReset.vue?vue&type=template&id=44c4315d&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/passwordReset.vue?vue&type=script&lang=js&
/* harmony default export */ var passwordResetvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      token: this.$f7route.query.token,
      data: {
        passwordNew: null,
        passwordNewAgain: null
      }
    };
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this = this;

      return this.$api.post('auth/passwordReset', {
        data: this.data,
        token: this.token
      }).then(function () {
        _this.$meta.vueApp.reload({
          echo: true
        });
      });
    },
    onPerformOk: function onPerformOk() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/passwordReset.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_passwordResetvue_type_script_lang_js_ = (passwordResetvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/passwordReset.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_passwordResetvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "44c4315d",
  null
  
)

/* harmony default export */ var passwordReset = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/signup.vue?vue&type=template&id=3f6eefdc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Sign up'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-block',[_c('eb-validate',{ref:"validate",attrs:{"auto":false,"data":_vm.data,"params":{validator: 'signup'},"onPerform":_vm.onPerformValidate},on:{"schema:ready":_vm.onSchemaReady}},[_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('eb-list-item-validate',{attrs:{"dataKey":"userName"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"realName"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"email"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"password"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"passwordAgain"}}),_vm._v(" "),_c('f7-list-item',[(_vm.moduleCaptcha)?[_c('captchaContainer')]:_vm._e()],2),_vm._v(" "),_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Captcha code')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Captcha code'),"clear-button":"","dataPath":"captcha/code"},model:{value:(_vm.captcha.code),callback:function ($$v) {_vm.$set(_vm.captcha, "code", $$v)},expression:"captcha.code"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}},[_c('span',{staticClass:"eb-list-divider-normal"},[_c('eb-button',{attrs:{"onPerform":_vm.signUp}},[_vm._v(_vm._s(_vm.$text('Sign up')))])],1)])],1)],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/signup.vue?vue&type=template&id=3f6eefdc&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/signup.vue?vue&type=script&lang=js&
/* harmony default export */ var signupvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  data: function data() {
    return {
      state: this.$f7route.query.state || 'login',
      returnTo: this.$f7route.query.returnTo,
      data: {
        userName: null,
        realName: null,
        email: null,
        password: null,
        passwordAgain: null
      },
      captcha: {
        code: null
      },
      moduleCaptcha: null,
      userNameReadOnly: false
    };
  },
  created: function created() {
    var _this = this;

    if (this.state === 'associate') {
      var userAgent = this.$store.state.auth.user.agent;
      this.data.userName = userAgent.userName;
      this.data.realName = userAgent.realName;
      this.data.email = userAgent.email;

      if (this.data.userName && this.data.userName.indexOf('__') === -1) {
        this.userNameReadOnly = true;
      }
    }

    this.$meta.module.use('a-captcha', function (module) {
      _this.$options.components.captchaContainer = module.options.components.captchaContainer;
      _this.moduleCaptcha = module;
    });
  },
  methods: {
    onSchemaReady: function onSchemaReady(schema) {
      if (this.userNameReadOnly) {
        schema.properties.userName.ebReadOnly = true;
      }
    },
    onPerformValidate: function onPerformValidate() {
      var _this2 = this;

      return this.$api.post('auth/signup', {
        state: this.state,
        data: this.data,
        captcha: this.captcha
      }).then(function () {
        var hash;

        if (_this2.returnTo) {
          hash = _this2.$meta.util.parseHash(_this2.returnTo);
        }

        _this2.$meta.vueApp.reload({
          echo: true,
          hash: hash
        });
      });
    },
    signUp: function signUp() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/signup.vue?vue&type=script&lang=js&
 /* harmony default export */ var pages_signupvue_type_script_lang_js_ = (signupvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/signup.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pages_signupvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "3f6eefdc",
  null
  
)

/* harmony default export */ var signup = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
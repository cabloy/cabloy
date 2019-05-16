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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ([]);

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  layout: {
    login: '/a/login/login',
    loginOnStart: true,
    toolbar: {
      tabbar: true,
      labels: true,
      bottom: true
    },
    tabs: [{
      name: 'Home',
      tabLinkActive: true,
      iconMaterial: 'home',
      url: '/a/base/menu/list'
    }, {
      name: 'Atom',
      tabLinkActive: false,
      iconMaterial: 'group_work',
      url: '/a/base/atom/list'
    }, {
      name: 'Mine',
      tabLinkActive: false,
      iconMaterial: 'person',
      url: '/a/user/user/mine'
    }]
  }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(5)["default"]
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  Home: '首页',
  Atom: '原子',
  Mine: '我的'
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/layoutView.vue?vue&type=script&lang=js&
/* harmony default export */ var layoutViewvue_type_script_lang_js_ = ({
  render: function render(c) {
    var attrs = this.$utils.extend({}, this.$attrs);
    return c('f7-login-screen', {
      staticClass: "eb-layout-view-container eb-layout-view-container-".concat(attrs.name)
    }, [c('eb-view', {
      staticClass: "eb-layout-view eb-layout-view-".concat(attrs.name, " eb-layout-view-size-small"),
      attrs: attrs
    })]);
  },
  destroyed: function destroyed() {
    this.$el.remove();
  }
});
// CONCATENATED MODULE: ./front/src/components/layoutView.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_layoutViewvue_type_script_lang_js_ = (layoutViewvue_type_script_lang_js_); 
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
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

// CONCATENATED MODULE: ./front/src/components/layoutView.vue
var render, staticRenderFns




/* normalize component */

var component = normalizeComponent(
  components_layoutViewvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "3d6f77e7",
  null
  
)

/* harmony default export */ var layoutView = (component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/layout.vue?vue&type=script&lang=js&

/* harmony default export */ var layoutvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  render: function render(c) {
    var _this = this;

    var pushStateMain = !this.$device.ios;
    var toolbarLinks = [];
    var tabs = [];
    this.$config.layout.tabs.forEach(function (tab) {
      var id = "eb-layout-tab-".concat(tab.name);

      var _linkAttrs = _this.$utils.extend({}, tab);

      _linkAttrs.text = _this.$text(_linkAttrs.text || _linkAttrs.name);
      _linkAttrs.tabLink = "#".concat(id);
      toolbarLinks.push(c('f7-link', {
        attrs: _linkAttrs
      }));
      var _viewAttrs = {
        id: id,
        tab: true,
        'data-url': tab.url,
        init: true,
        tabActive: tab.tabLinkActive,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false
      };
      tabs.push(c('eb-view', {
        key: id,
        staticClass: 'eb-layout-tab eb-layout-view-size-small',
        attrs: _viewAttrs,
        props: {
          size: 'small',
          sizeExtent: _this.sizeExtent
        },
        on: {
          'tab:show': _this.onTabShow
        }
      }));
    });

    var _toolbarAttrs = this.$utils.extend({}, this.$config.layout.toolbar);

    var toolbar = c('f7-toolbar', {
      attrs: _toolbarAttrs
    }, toolbarLinks);
    var views = c('f7-views', {
      attrs: {
        tabs: true
      }
    }, [toolbar].concat(tabs));
    var viewMain = c('eb-layout-view', {
      ref: 'main',
      attrs: {
        name: 'main',
        pushState: pushStateMain,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        size: 'small',
        sizeExtent: this.sizeExtent
      }
    });
    var viewLogin = c('eb-layout-view', {
      ref: 'login',
      attrs: {
        name: 'login',
        pushState: pushStateMain,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        size: 'small',
        sizeExtent: this.sizeExtent
      }
    });
    return c('div', {
      staticClass: 'eb-layout-container eb-layout-container-mobile'
    }, [views, viewMain, viewLogin]);
  },
  components: {
    ebLayoutView: layoutView
  },
  data: function data() {
    return {
      started: false,
      viewMainVisible: false,
      viewLoginVisible: false,
      tabShowed: false,
      sizeExtent: null
    };
  },
  computed: {
    viewTabsVisible: function viewTabsVisible() {
      return this.started && !this.viewMainVisible && !this.viewLoginVisible;
    }
  },
  watch: {
    viewTabsVisible: function viewTabsVisible(value) {
      var _this2 = this;

      this.$nextTick(function () {
        if (value) {
          _this2.onTabShow();
        }
      });
    },
    viewMainVisible: function viewMainVisible(value) {
      var _this3 = this;

      this.$nextTick(function () {
        if (value) {
          _this3.$f7.loginScreen.open(_this3.$refs.main.$el);
        } else {
          _this3.$f7.loginScreen.close(_this3.$refs.main.$el);
        }
      });
    },
    viewLoginVisible: function viewLoginVisible(value) {
      var _this4 = this;

      this.$nextTick(function () {
        if (value) {
          _this4.$f7.loginScreen.open(_this4.$refs.login.$el);
        } else {
          _this4.$f7.loginScreen.close(_this4.$refs.login.$el);

          _this4.$store.commit('auth/setHashInit', null);
        }
      });
    }
  },
  created: function created() {
    this._onSize();
  },
  mounted: function mounted() {
    var _this5 = this;

    this.$f7ready(function () {
      _this5.start();
    });
  },
  methods: {
    onResize: function onResize() {
      this._onSize();
    },
    _onSize: function _onSize() {
      this.sizeExtent = {
        width: this.$$(window).width(),
        height: this.$$(window).height()
      };
    },
    start: function start() {
      var _this6 = this;

      var vueApp = this.$meta.vueApp;

      if (vueApp.checkIfNeedOpenLogin()) {
        this.openLogin();
      } else {
        var hashInit = vueApp.popupHashInit();

        if (hashInit) {
          this.navigate(hashInit);
        }
      }

      this.$nextTick(function () {
        _this6.started = true;
      });
    },
    navigate: function navigate(url, options) {
      options = options || {};
      var ctx = options.ctx;
      var target = options.target;

      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        var viewName = ctx && ctx.$view.$el.f7View.name || 'main';
        this.$f7.views[viewName].router.navigate(url, options);

        if (viewName === 'main') {
          this.viewMainVisible = true;
          this.viewLoginVisible = false;
        } else if (viewName === 'login') {
          this.viewMainVisible = false;
          this.viewLoginVisible = true;
        }
      }
    },
    openLogin: function openLogin(routeTo) {
      var hashInit = !routeTo || typeof routeTo === 'string' ? routeTo : routeTo.url.url;
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      this.$f7.views.login.router.navigate(this.$config.layout.login);
      this.viewLoginVisible = true;
    },
    hideView: function hideView(view) {
      var cancel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      view = typeof view === 'string' ? this.$f7.views[view] : view;
      if (view.name === 'main') this.viewMainVisible = false;
      if (view.name === 'login') this.viewLoginVisible = false;

      if (!cancel) {
        view.router.navigate('/', {
          reloadAll: true
        });
      }
    },
    onTabShow: function onTabShow(e) {
      var target = e ? this.$$(e.target) : this.$$('.view.eb-layout-tab.tab-active');

      if (target.hasClass('eb-layout-tab')) {
        var path = target[0].f7View.router.currentRoute.path;

        if (!path || path === '/') {
          target[0].f7View.router.navigate(target.data('url'));
          this.tabShowed = true;
        }
      }
    },
    backLink: function backLink(ctx) {
      var backLink = false;

      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - 1])) {
        backLink = true;
      } else {
        var $el = ctx.$$(ctx.$el);
        var $view = $el.parents('.view');
        if ($view.hasClass('eb-layout-view-main')) backLink = true;else if ($view.hasClass('eb-layout-view-login') && this.tabShowed) backLink = true;
      }

      return backLink;
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/layout.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_layoutvue_type_script_lang_js_ = (layoutvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/layout.vue
var layout_render, layout_staticRenderFns




/* normalize component */

var layout_component = normalizeComponent(
  components_layoutvue_type_script_lang_js_,
  layout_render,
  layout_staticRenderFns,
  false,
  null,
  "d3f6ea06",
  null
  
)

/* harmony default export */ var layout = (layout_component.exports);
// EXTERNAL MODULE: ./front/src/assets/css/module.less
var css_module = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/main.js


var Vue;

function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(1)["default"],
    store: __webpack_require__(2)["default"](Vue),
    config: __webpack_require__(3)["default"],
    locales: __webpack_require__(4)["default"],
    components: {
      layout: layout
    }
  });
}

/* harmony default export */ var main = __webpack_exports__["default"] = ({
  install: install
});

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
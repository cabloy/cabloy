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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  parseAtomClass: function parseAtomClass(query) {
    var module = query && query.module;
    var atomClassName = query && query.atomClassName;

    if (module && atomClassName) {
      return {
        module: module,
        atomClassName: atomClassName
      };
    }

    return {
      module: 'a-cms',
      atomClassName: 'article'
    };
  },
  combineAtomClass: function combineAtomClass(atomClass, url) {
    var query = "module=".concat(atomClass.module, "&atomClassName=").concat(atomClass.atomClassName);
    if (!url) return query;
    var pos = url.indexOf('?');
    if (pos === -1) return "".concat(url, "?").concat(query);
    if (pos === url.length - 1) return "".concat(url).concat(query);
    return "".concat(url, "&").concat(query);
  }
});

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/category/list.vue?vue&type=template&id=5cad68f2&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClick(node)}}},[_vm._v(_vm._s(node.text))])}}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/category/list.vue?vue&type=template&id=5cad68f2&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/category/list.vue?vue&type=script&lang=js&
/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    atomClass: {
      type: Object
    },
    categoryIdStart: {
      type: Number
    },
    language: {
      type: String
    },
    catalogOnly: {
      type: Boolean
    },
    categoryIdDisable: {
      type: Boolean
    }
  },
  data: function data() {
    var _this = this;

    return {
      treeOptions: {
        fetchData: function fetchData(node) {
          return _this.fetchChildren(node);
        }
      }
    };
  },
  methods: {
    fetchChildren: function fetchChildren(node) {
      var _this2 = this;

      if (node.id === 'root' && this.categoryIdStart === undefined) {
        return new Promise(function (resolve) {
          resolve([{
            id: '_root',
            text: 'Root',
            data: {
              id: 0,
              catalog: 1
            },
            showChildren: true,
            isBatch: true
          }]);
        });
      }

      var categoryId = node.id === 'root' ? this.categoryIdStart : node.data.id;
      return this.$api.post('category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId: categoryId
      }).then(function (data) {
        var list = data.list.map(function (item) {
          var node = {
            id: item.id,
            text: item.categoryName || '[New Category]',
            data: item,
            showChildren: item.catalog === 1,
            isBatch: item.catalog === 1
          };
          return node;
        });
        list = list.filter(function (item) {
          return (!_this2.catalogOnly || item.data.catalog === 1) && (!_this2.categoryIdDisable || _this2.categoryIdDisable !== item.id);
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
// CONCATENATED MODULE: ./front/src/components/category/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/components/category/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  category_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__);
var Vue;


function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(8)["default"],
    store: __webpack_require__(12)["default"](Vue),
    config: __webpack_require__(13)["default"],
    locales: __webpack_require__(14)["default"],
    components: __webpack_require__(16)["default"]
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(9)("./".concat(name, ".vue"))["default"];
}

/* harmony default export */ __webpack_exports__["default"] = ([{
  path: 'config/list',
  component: load('config/list')
}, {
  path: 'config/site',
  component: load('config/site')
}, {
  path: 'config/siteBase',
  component: load('config/siteBase')
}, {
  path: 'config/language',
  component: load('config/language')
}, {
  path: 'config/languagePreview',
  component: load('config/languagePreview')
}, {
  path: 'category/list',
  component: load('category/list')
}, {
  path: 'category/edit',
  component: load('category/edit')
}, {
  path: 'category/select',
  component: load('category/select')
}, {
  path: 'article/contentEdit',
  component: load('article/contentEdit')
}, {
  path: 'article/category',
  component: load('article/category')
}, {
  path: 'article/list',
  component: load('article/list')
}, {
  path: 'tag/select',
  component: load('tag/select')
}]);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./article/category.vue": 20,
	"./article/contentEdit.vue": 22,
	"./article/list.vue": 18,
	"./category/edit.vue": 19,
	"./category/list.vue": 21,
	"./category/select.vue": 28,
	"./config/language.vue": 23,
	"./config/languagePreview.vue": 24,
	"./config/list.vue": 26,
	"./config/site.vue": 27,
	"./config/siteBase.vue": 17,
	"./tag/select.vue": 25
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
webpackContext.id = 9;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_59bec81a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_59bec81a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_59bec81a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_59bec81a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_ae7a725a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_ae7a725a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_ae7a725a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_ae7a725a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ __webpack_exports__["default"] = (function (Vue) {
  return {
    state: {
      configSiteBase: {},
      configSite: {},
      languages: {}
    },
    getters: {},
    mutations: {
      setConfigSiteBase: function setConfigSiteBase(state, _ref) {
        var atomClass = _ref.atomClass,
            configSiteBase = _ref.configSiteBase;
        state.configSiteBase = _objectSpread({}, state.configSiteBase, _defineProperty({}, atomClass.module, configSiteBase));
      },
      setConfigSite: function setConfigSite(state, _ref2) {
        var atomClass = _ref2.atomClass,
            configSite = _ref2.configSite;
        state.configSite = _objectSpread({}, state.configSite, _defineProperty({}, atomClass.module, configSite));
      },
      setLanguages: function setLanguages(state, _ref3) {
        var atomClass = _ref3.atomClass,
            languages = _ref3.languages;
        state.languages = _objectSpread({}, state.languages, _defineProperty({}, atomClass.module, languages));
      }
    },
    actions: {
      getConfigSiteBase: function getConfigSiteBase(_ref4, _ref5) {
        var state = _ref4.state,
            commit = _ref4.commit;
        var atomClass = _ref5.atomClass;
        return new Promise(function (resolve, reject) {
          var _configSiteBase = state.configSiteBase[atomClass.module];
          if (_configSiteBase) return resolve(_configSiteBase);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSiteBase', {
            atomClass: atomClass
          }).then(function (res) {
            var configSiteBase = res.data || {};
            commit('setConfigSiteBase', {
              atomClass: atomClass,
              configSiteBase: configSiteBase
            });
            resolve(configSiteBase);
          })["catch"](function (err) {
            return reject(err);
          });
        });
      },
      getConfigSite: function getConfigSite(_ref6, _ref7) {
        var state = _ref6.state,
            commit = _ref6.commit;
        var atomClass = _ref7.atomClass;
        return new Promise(function (resolve, reject) {
          var _configSite = state.configSite[atomClass.module];
          if (_configSite) return resolve(_configSite);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSite', {
            atomClass: atomClass
          }).then(function (res) {
            var configSite = res.data || {};
            commit('setConfigSite', {
              atomClass: atomClass,
              configSite: configSite
            });
            resolve(configSite);
          })["catch"](function (err) {
            return reject(err);
          });
        });
      },
      getLanguages: function getLanguages(_ref8, _ref9) {
        var state = _ref8.state,
            commit = _ref8.commit;
        var atomClass = _ref9.atomClass;
        return new Promise(function (resolve, reject) {
          var _languages = state.languages[atomClass.module];
          if (_languages) return resolve(_languages);
          Vue.prototype.$meta.api.post('/a/cms/site/getLanguages', {
            atomClass: atomClass
          }).then(function (res) {
            var languages = res || [];
            commit('setLanguages', {
              atomClass: atomClass,
              languages: languages
            });
            resolve(languages);
          })["catch"](function (err) {
            return reject(err);
          });
        });
      }
    }
  };
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
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(15)["default"]
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  Add: '添加',
  Article: '文章',
  Build: '构建',
  Catalog: '目录',
  Category: '目录',
  Categories: '目录',
  Config: '配置',
  Content: '内容',
  Default: '缺省',
  Delete: '删除',
  Description: '描述',
  Extra: '额外',
  Flag: '标记',
  Hidden: '隐藏',
  Keywords: '关键字',
  Language: '语言',
  Languages: '语言',
  Move: '移动',
  Preview: '预览',
  seconds: '秒',
  Site: '站点',
  Sticky: '置顶',
  Sorting: '排序',
  Tag: '标签',
  Tags: '标签',
  Title: '标题',
  Url: '链接',
  'Atom Name': '原子名称',
  'Basic Info': '基本信息',
  'Category name': '目录名称',
  'Extra Attributes': '额外属性',
  'Language Configuration': '语言配置',
  'Please specify the category name': '请指定目录名称',
  'Please specify the language': '请指定语言',
  'Select Category': '选择目录',
  'Select Tags': '选择标签',
  'Site Configuration': '站点配置',
  'Time Used': '用时',
  'What to write': '写点什么',
  'Build Language': '构建语言',
  'Build All Languages': '构建所有语言'
});

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./front/src/components/category/list.vue + 4 modules
var list = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/item.vue?vue&type=template&id=9ed5d694&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!this.readOnly)?[_c('item-edit',{attrs:{"readOnly":_vm.readOnly,"item":_vm.data,"onSave":_vm.onSave},on:{"submit":_vm.onSubmit}})]:[_c('item-view',{attrs:{"readOnly":_vm.readOnly,"item":_vm.data}})]],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/item.vue?vue&type=template&id=9ed5d694&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/itemEdit.vue?vue&type=template&id=1b7dbbe4&scoped=true&
var itemEditvue_type_template_id_1b7dbbe4_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-list',{attrs:{"form":"","no-hairlines-md":""},on:{"submit":_vm.onSubmit}},[_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Title')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"atomName"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Content')}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"content","title":_vm.$text('Content'),"onChoose":_vm.onChooseEditContent}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Basic Info')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"categoryId","title":_vm.$text('Category'),"onChoose":_vm.onChooseCategory}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.item.categoryName))])]),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"tags","title":_vm.$text('Tags'),"onChoose":_vm.onChooseTags}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.adjustTags(_vm.item.tags)))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"keywords"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"description"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"slug"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"allowComment"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Extra')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sticky"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sorting"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"flag"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"extra"}})],1)],1)}
var itemEditvue_type_template_id_1b7dbbe4_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/itemEdit.vue?vue&type=template&id=1b7dbbe4&scoped=true&

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/itemEdit.vue?vue&type=script&lang=js&

/* harmony default export */ var itemEditvue_type_script_lang_js_ = ({
  props: {
    readOnly: {
      type: Boolean
    },
    item: {
      type: Object
    },
    onSave: {
      type: Function
    }
  },
  computed: {
    atomClass: function atomClass() {
      return {
        module: this.item.module,
        atomClassName: this.item.atomClassName
      };
    },
    languages: function languages() {
      return this.$local.state.languages[this.atomClass.module];
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass
    });
  },
  methods: {
    onSubmit: function onSubmit(event) {
      this.$emit('submit', event);
    },
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    adjustTags: function adjustTags(tags) {
      if (!tags) return '';

      var _tags = JSON.parse(tags);

      return _tags.map(function (item) {
        return item.name;
      }).join(',');
    },
    onChooseTags: function onChooseTags() {
      var _this = this;

      if (!this.item.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }

      return new Promise(function (resolve) {
        var url = _this.combineAtomClass('/a/cms/tag/select');

        _this.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              language: _this.item.language,
              tags: _this.item.tags
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this.item.tags = data;
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            }
          }
        });
      });
    },
    onChooseCategory: function onChooseCategory() {
      var _this2 = this;

      if (!this.item.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }

      return new Promise(function (resolve) {
        var url = _this2.combineAtomClass('/a/cms/category/select');

        _this2.$view.navigate(url, {
          target: '_self',
          context: {
            params: {
              language: _this2.item.language,
              categoryIdStart: 0,
              leafOnly: true
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this2.item.categoryId = data.id;
                _this2.item.categoryName = data.categoryName;
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            }
          }
        });
      });
    },
    onChooseEditContent: function onChooseEditContent() {
      var _this3 = this;

      if (!this.item.categoryId) {
        this.$view.dialog.alert(this.$text('Please specify the category name'));
        return false;
      }

      var url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            ctx: this,
            item: this.item,
            readOnly: this.readOnly
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this3.item.content = data.content;
            }
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/article/itemEdit.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_itemEditvue_type_script_lang_js_ = (itemEditvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/components/article/itemEdit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_itemEditvue_type_script_lang_js_,
  itemEditvue_type_template_id_1b7dbbe4_scoped_true_render,
  itemEditvue_type_template_id_1b7dbbe4_scoped_true_staticRenderFns,
  false,
  null,
  "1b7dbbe4",
  null
  
)

/* harmony default export */ var itemEdit = (component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/itemView.vue?vue&type=template&id=de991672&scoped=true&
var itemViewvue_type_template_id_de991672_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-list',[_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Title')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"atomName"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Content')}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"content","title":_vm.$text('Content'),"onChoose":_vm.onChooseEditContent}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Basic Info')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages}}),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Category')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.item.categoryName))])]),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Tags')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.adjustTags(_vm.item.tags)))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"keywords"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"description"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"slug"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"allowComment"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Extra')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sticky"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sorting"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"flag"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"extra"}})],1)],1)}
var itemViewvue_type_template_id_de991672_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/itemView.vue?vue&type=template&id=de991672&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/itemView.vue?vue&type=script&lang=js&

/* harmony default export */ var itemViewvue_type_script_lang_js_ = ({
  props: {
    readOnly: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  computed: {
    atomClass: function atomClass() {
      return {
        module: this.item.module,
        atomClassName: this.item.atomClassName
      };
    },
    languages: function languages() {
      return this.$local.state.languages[this.atomClass.module];
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    adjustTags: function adjustTags(tags) {
      if (!tags) return '';

      var _tags = JSON.parse(tags);

      return _tags.map(function (item) {
        return item.name;
      }).join(',');
    },
    onChooseEditContent: function onChooseEditContent() {
      var _this = this;

      if (!this.item.categoryId) {
        return false;
      }

      var url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            ctx: this,
            item: this.item,
            readOnly: this.readOnly
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this.item.content = data.content;
            }
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/article/itemView.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_itemViewvue_type_script_lang_js_ = (itemViewvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/article/itemView.vue





/* normalize component */

var itemView_component = Object(componentNormalizer["a" /* default */])(
  article_itemViewvue_type_script_lang_js_,
  itemViewvue_type_template_id_de991672_scoped_true_render,
  itemViewvue_type_template_id_de991672_scoped_true_staticRenderFns,
  false,
  null,
  "de991672",
  null
  
)

/* harmony default export */ var itemView = (itemView_component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/item.vue?vue&type=script&lang=js&


/* harmony default export */ var itemvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  components: {
    itemEdit: itemEdit,
    itemView: itemView
  },
  props: {
    readOnly: {
      type: Boolean
    },
    data: {
      type: Object
    },
    onSave: {
      type: Function
    }
  },
  methods: {
    onSubmit: function onSubmit(event) {
      this.$emit('submit', event);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/article/item.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_itemvue_type_script_lang_js_ = (itemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/article/item.vue





/* normalize component */

var item_component = Object(componentNormalizer["a" /* default */])(
  article_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "9ed5d694",
  null
  
)

/* harmony default export */ var item = (item_component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/search.vue?vue&type=template&id=9b4453bc&scoped=true&
var searchvue_type_template_id_9b4453bc_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-list',[_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages},on:{"change":_vm.onChangeLanguage}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"categoryId","title":_vm.$text('Category'),"onChoose":_vm.onChooseCategory}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.data.categoryName))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"content"}})],1)}
var searchvue_type_template_id_9b4453bc_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/search.vue?vue&type=template&id=9b4453bc&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/search.vue?vue&type=script&lang=js&

/* harmony default export */ var searchvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
    data: {
      type: Object
    }
  },
  data: function data() {
    var atomClass = {
      module: 'a-cms',
      atomClassName: 'article'
    };
    return {
      atomClass: atomClass
    };
  },
  computed: {
    languages: function languages() {
      return this.$local.state.languages[this.atomClass.module];
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    onChangeLanguage: function onChangeLanguage() {
      this.$set(this.data, 'categoryId', null);
      this.$set(this.data, 'categoryName', null);
    },
    onChooseCategory: function onChooseCategory() {
      var _this = this;

      if (!this.data.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }

      return new Promise(function (resolve) {
        var url = _this.combineAtomClass('/a/cms/category/select');

        _this.$view.navigate(url, {
          context: {
            params: {
              language: _this.data.language,
              categoryIdStart: 0,
              leafOnly: true
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this.$set(_this.data, 'categoryId', data.id);

                _this.$set(_this.data, 'categoryName', data.categoryName);

                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            }
          }
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/article/search.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/article/search.vue





/* normalize component */

var search_component = Object(componentNormalizer["a" /* default */])(
  article_searchvue_type_script_lang_js_,
  searchvue_type_template_id_9b4453bc_scoped_true_render,
  searchvue_type_template_id_9b4453bc_scoped_true_staticRenderFns,
  false,
  null,
  "9b4453bc",
  null
  
)

/* harmony default export */ var search = (search_component.exports);
// CONCATENATED MODULE: ./front/src/components.js



/* harmony default export */ var components = __webpack_exports__["default"] = ({
  categoryList: list["a" /* default */],
  articleItem: item,
  articleSearch: search
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/siteBase.vue?vue&type=template&id=93986e48&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Default'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"json-textarea",attrs:{"type":"textarea","readonly":"readonly"},domProps:{"value":_vm.content}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/siteBase.vue?vue&type=template&id=93986e48&

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/siteBase.vue?vue&type=script&lang=js&

/* harmony default export */ var siteBasevue_type_script_lang_js_ = ({
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      content: '{}'
    };
  },
  created: function created() {
    var _this = this;

    this.$local.dispatch('getConfigSiteBase', {
      atomClass: this.atomClass
    }).then(function (data) {
      if (!data) {
        _this.content = '{}';
      } else {
        _this.content = JSON.stringify(data, null, 2);
      }
    });
  },
  methods: {
    onSize: function onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: "".concat(size.height - 20, "px"),
        width: "".concat(size.width - 20, "px")
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/siteBase.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_siteBasevue_type_script_lang_js_ = (siteBasevue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/config/siteBase.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  config_siteBasevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var siteBase = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/list.vue?vue&type=template&id=55af19a6&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false}},[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[(_vm.showPopover)?_c('f7-link',{attrs:{"iconMaterial":"add","popover-open":("#" + _vm.popoverId)}}):_vm._e(),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"search","onPerform":_vm.onPerformSearch}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"sort","onPerform":_vm.onPerformAtomOrders}})],1)],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"tab":false,"tab-active":""}},[_c('eb-atoms',{ref:"all",attrs:{"slot":"list","mode":"all","atomClass":_vm.atomClass,"where":{categoryId: _vm.categoryId}},slot:"list"})],1),_vm._v(" "),_c('f7-popover',{attrs:{"id":_vm.popoverId}},[(_vm.showPopover)?_c('f7-list',{attrs:{"inset":""}},_vm._l((_vm.actions),function(action){return _c('eb-list-button',{key:action.id,attrs:{"popover-close":"","context":action,"onPerform":_vm.onAction}},[_vm._v(_vm._s(action.titleLocale))])}),1):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/article/list.vue?vue&type=template&id=55af19a6&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/list.vue?vue&type=script&lang=js&

var ebMenus = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebMenus;
var ebAtoms = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebAtoms;

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  mixins: [ebMenus],
  components: {
    ebAtoms: ebAtoms
  },
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      language: this.$f7route.query.language,
      categoryId: this.$f7route.query.categoryId,
      categoryName: this.$f7route.query.categoryName,
      popoverId: external_vue_default.a.prototype.$meta.util.nextId('popover'),
      actions: null
    };
  },
  computed: {
    title: function title() {
      return "".concat(this.$text('Category'), ": ").concat(this.categoryName);
    },
    showPopover: function showPopover() {
      return this.actions && this.actions.length > 0;
    }
  },
  created: function created() {
    var _this = this;

    var options = {
      where: {
        menu: 1,
        scene: 1
      },
      orders: [['sorting', 'asc']]
    };

    if (this.atomClass) {
      options.where['e.module'] = this.atomClass.module;
      options.where['e.atomClassName'] = this.atomClass.atomClassName;
    }

    this.$api.post('/a/base/function/list', {
      options: options
    }).then(function (data) {
      _this.actions = data.list;
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    onAction: function onAction(event, item) {
      var _menu = this.getMenu(item);

      if (!_menu) return;

      if (_menu.action === 'create') {
        item = {
          atomClassId: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
          atomClassIdParent: item.atomClassIdParent,
          language: this.language,
          categoryId: this.categoryId
        };
      }

      return this.$meta.util.performAction({
        ctx: this,
        action: _menu,
        item: item
      });
    },
    onPerformSearch: function onPerformSearch() {
      var url = this.combineAtomClass('/a/base/atom/search');
      this.$view.navigate(url, {
        target: '_self'
      });
    },
    onPerformAtomOrders: function onPerformAtomOrders(event) {
      this.$refs.all.openPopoverForAtomOrders(event.currentTarget);
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/article/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/article/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/edit.vue?vue&type=template&id=1ec6d8f7&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}})],1)],1),_vm._v(" "),_c('eb-validate',{ref:"validate",attrs:{"auto":"","data":_vm.category,"params":{validator: 'category'},"onPerform":_vm.onPerformValidate}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/category/edit.vue?vue&type=template&id=1ec6d8f7&

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/edit.vue?vue&type=script&lang=js&

/* harmony default export */ var editvue_type_script_lang_js_ = ({
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      categoryId: this.$f7route.query.categoryId,
      category: null
    };
  },
  computed: {
    title: function title() {
      var _title = this.$text('Category');

      if (this.category) _title = "".concat(_title, ": ").concat(this.category.categoryName);
      return _title;
    }
  },
  created: function created() {
    var _this = this;

    this.$api.post('category/item', {
      categoryId: this.categoryId
    }).then(function (data) {
      _this.category = data;
    });
  },
  methods: {
    onPerformValidate: function onPerformValidate() {
      var _this2 = this;

      return this.$api.post('category/save', {
        categoryId: this.categoryId,
        data: this.category
      }).then(function () {
        _this2.$meta.eventHub.$emit('a-cms:category:save', {
          atomClass: _this2.atomClass,
          categoryId: _this2.categoryId,
          categoryIdParent: _this2.category.categoryIdParent,
          category: _this2.category
        });

        _this2.$f7router.back();
      });
    },
    onPerformSave: function onPerformSave() {
      return this.$refs.validate.perform();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/category/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/category/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  category_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/category.vue?vue&type=template&id=312bd12b&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.pageTitle,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"view_headline","onPerform":_vm.onPerformList}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"search","onPerform":_vm.onPerformSearch}})],1),_vm._v(" "),_c('f7-subnavbar',[_c('f7-toolbar',{attrs:{"tabbar":"","scrollable":_vm.languages && _vm.languages.length>2}},[(_vm.languages)?_vm._l((_vm.languages),function(item,index){return _c('f7-link',{key:item.value,attrs:{"tab-link":("#" + _vm.tabIdLanguages + "_" + (item.value)),"tab-link-active":index===0}},[_vm._v(_vm._s(item.title))])}):_vm._e()],2)],1)],1),_vm._v(" "),_c('f7-tabs',[(_vm.languages)?_vm._l((_vm.languages),function(item,index){return _c('f7-page-content',{key:item.value,attrs:{"id":(_vm.tabIdLanguages + "_" + (item.value)),"tab":"","tab-active":index===0}},[_c('category-list',{attrs:{"atomClass":_vm.atomClass,"categoryIdStart":0,"language":item.value},on:{"node:click":_vm.onNodeClick}})],1)}):_vm._e()],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/article/category.vue?vue&type=template&id=312bd12b&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/category/list.vue + 4 modules
var list = __webpack_require__(5);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/category.vue?vue&type=script&lang=js&

var ebAtomClasses = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebAtomClasses;
var ebMenus = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebMenus;


/* harmony default export */ var categoryvue_type_script_lang_js_ = ({
  mixins: [ebAtomClasses, ebMenus],
  components: {
    categoryList: list["a" /* default */]
  },
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      tabIdLanguages: external_vue_default.a.prototype.$meta.util.nextId('tab')
    };
  },
  computed: {
    languages: function languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
    pageTitle: function pageTitle() {
      var atomClass = this.getAtomClass(this.atomClass);
      if (atomClass) return "".concat(this.$text('Atom'), ": ").concat(atomClass.titleLocale);
      return this.$text('Atom');
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    onPerformList: function onPerformList() {
      var atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return;
      var atomClassNameCapitalize = atomClass.name.replace(/^\S/, function (s) {
        return s.toUpperCase();
      });
      var item = {
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
        name: "list".concat(atomClassNameCapitalize)
      };

      var _menu = this.getMenu(item);

      if (!_menu) return;
      _menu = this.$utils.extend(_menu, {
        navigateOptions: {
          target: '_self'
        }
      });
      return this.$meta.util.performAction({
        ctx: this,
        action: _menu,
        item: item
      });
    },
    onPerformSearch: function onPerformSearch() {
      var url = this.combineAtomClass('/a/base/atom/search');
      this.$view.navigate(url, {
        target: '_self'
      });
    },
    onNodeClick: function onNodeClick(node) {
      if (node.data.catalog) return;
      var url = this.combineAtomClass("/a/cms/article/list?language=".concat(node.data.language, "&categoryId=").concat(node.data.id, "&categoryName=").concat(encodeURIComponent(node.data.categoryName)));
      this.$view.navigate(url, {
        target: '_self'
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/article/category.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_categoryvue_type_script_lang_js_ = (categoryvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/article/category.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_categoryvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var category = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/list.vue?vue&type=template&id=59bec81a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('div',{staticClass:"category-node"},[_c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClickEdit(node)}}},[_vm._v(_vm._s(node.text))]),_vm._v(" "),_c('span',[_c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClickAdd(node)}}},[_vm._v(_vm._s(_vm.$text('Add')))]),_vm._v(" "),(node.data.id)?_c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClickMove(node)}}},[_vm._v(_vm._s(_vm.$text('Move')))]):_vm._e(),_vm._v(" "),(node.data.id)?_c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClickDelete(node)}}},[_vm._v(_vm._s(_vm.$text('Delete')))]):_vm._e()])])}}])})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/category/list.vue?vue&type=template&id=59bec81a&scoped=true&

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  data: function data() {
    var _this = this;

    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      language: this.$f7route.query.language,
      treeOptions: {
        fetchData: function fetchData(node) {
          return _this.fetchChildren(node);
        }
      }
    };
  },
  computed: {
    title: function title() {
      var _title = this.$text('Categories');

      return "".concat(_title, ": ").concat(this.language);
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('a-cms:category:save', this.onCategorySave);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('a-cms:category:save', this.onCategorySave);
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    fetchChildren: function fetchChildren(node) {
      var _this2 = this;

      if (node.id === 'root') {
        return new Promise(function (resolve) {
          resolve([{
            id: '_root',
            text: 'Root',
            data: {
              id: 0,
              catalog: 1
            },
            showChildren: true,
            isBatch: true
          }]);
        });
      }

      return this.$api.post('category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId: node.data.id
      }).then(function (data) {
        var list = data.list.map(function (item) {
          var node = {
            id: item.id,
            text: item.categoryName || '[New Category]',
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
    onNodeClickEdit: function onNodeClickEdit(node) {
      if (!node.data.id) return;
      var url = this.combineAtomClass("/a/cms/category/edit?categoryId=".concat(node.data.id));
      this.$view.navigate(url);
    },
    onNodeClickAdd: function onNodeClickAdd(node) {
      var _this3 = this;

      var categoryId = node.data.id;
      this.$view.dialog.prompt(this.$text('Please specify the category name')).then(function (categoryName) {
        if (!categoryName) return;

        _this3.$api.post('category/add', {
          atomClass: _this3.atomClass,
          data: {
            categoryName: categoryName,
            language: _this3.language,
            categoryIdParent: categoryId
          }
        }).then(function () {
          _this3.reloadChildren(node);
        });
      })["catch"](function () {});
    },
    onNodeClickDelete: function onNodeClickDelete(node) {
      var _this4 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this4.$api.post('category/delete', {
          categoryId: node.data.id
        }).then(function () {
          _this4.reloadChildren(node.parent);
        })["catch"](function (err) {
          return _this4.$view.dialog.alert(err.message);
        });
      });
    },
    onNodeClickMove: function onNodeClickMove(node) {
      var _this5 = this;

      var categoryId = node.data.id;
      var url = this.combineAtomClass('/a/cms/category/select');
      this.$view.navigate(url, {
        context: {
          params: {
            language: this.language,
            categoryIdDisable: categoryId
          },
          callback: function callback(code, data) {
            if (code === 200) {
              var categoryIdParent = data.id;

              if (node.data.categoryIdParent !== categoryIdParent) {
                _this5.$api.post('category/move', {
                  categoryId: categoryId,
                  categoryIdParent: categoryIdParent
                }).then(function () {
                  for (var _i = 0, _arr = [node.data.categoryIdParent, categoryIdParent]; _i < _arr.length; _i++) {
                    var id = _arr[_i];

                    var _node = _this5.findNode(id);

                    _this5.reloadChildren(_node && _node[0]);
                  }
                });
              }
            }
          }
        }
      });
    },
    reloadChildren: function reloadChildren(node) {
      if (!node) return;
      node.isBatch = true;
      node.collapse().empty().expand();
    },
    findNode: function findNode(id) {
      return this.$refs.tree.find(function (node) {
        return node.data.id === id;
      });
    },
    onCategorySave: function onCategorySave(data) {
      if (data.atomClass.module !== this.atomClass.module) return;
      var node = this.findNode(data.categoryIdParent);
      this.reloadChildren(node && node[0]);
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/category/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/category/list.vue?vue&type=style&index=0&id=59bec81a&lang=less&scoped=true&
var listvue_type_style_index_0_id_59bec81a_lang_less_scoped_true_ = __webpack_require__(10);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/category/list.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  category_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "59bec81a",
  null
  
)

/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/contentEdit.vue?vue&type=template&id=b3940e86&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[(!_vm.readOnly)?_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}}):_vm._e(),_vm._v(" "),(!!_vm.$device.desktop)?_c('eb-link',{attrs:{"iconMaterial":"visibility","onPerform":_vm.onPerformPreview}}):_vm._e()],1)],1),_vm._v(" "),(_vm.module)?[_c('eb-box',[_c('mavon-editor',{ref:"editor",attrs:{"value":_vm.item.content,"onImageUpload":_vm.onImageUpload,"onAudioUpload":_vm.onAudioUpload,"language":_vm.language,"subfield":_vm.subfield,"editable":_vm.editable,"defaultOpen":_vm.defaultOpen,"toolbarsFlag":_vm.toolbarsFlag,"navigation":_vm.navigation,"toolbars":_vm.toolbars},on:{"change":_vm.onChange,"save":_vm.onSave}})],1)]:_vm._e()],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/article/contentEdit.vue?vue&type=template&id=b3940e86&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/contentEdit.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var contentEditvue_type_script_lang_js_ = ({
  meta: {
    size: 'middle'
  },
  mixins: [ebPageContext],
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      dirty: false,
      module: null
    };
  },
  computed: {
    title: function title() {
      return "".concat(this.dirty ? '* ' : '').concat(this.item.atomName);
    },
    readOnly: function readOnly() {
      return this.contextParams.readOnly;
    },
    item: function item() {
      return this.contextParams.item;
    },
    editable: function editable() {
      return !this.readOnly;
    },
    language: function language() {
      var locale = this.$meta.util.cookies.get('locale') || 'en-us';
      return locale === 'zh-cn' ? 'zh-CN' : 'en';
    },
    subfield: function subfield() {
      return this.editable && this.$view.size !== 'small';
    },
    defaultOpen: function defaultOpen() {
      return this.editable ? '' : 'preview';
    },
    toolbarsFlag: function toolbarsFlag() {
      return this.editable;
    },
    navigation: function navigation() {
      return !this.editable;
    },
    toolbars: function toolbars() {
      return {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        audiolink: true,
        code: true,
        table: true,
        undo: true,
        redo: true,
        trash: true,
        navigation: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true
      };
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-mavoneditor', function (module) {
      _this.module = module;
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    onChange: function onChange(data) {
      if (this.readOnly) return;
      if (this.item.content === data) return;
      this.dirty = true;
      this.contextCallback(200, {
        content: data
      });
    },
    onSave: function onSave() {
      var _this2 = this;

      this.onPerformSave().then(function () {
        _this2.$view.toast.show();
      });
    },
    onPerformSave: function onPerformSave() {
      var _this3 = this;

      return this.contextParams.ctx.onSave().then(function () {
        _this3.dirty = false;
        return true;
      });
    },
    onPerformPreview: function onPerformPreview() {
      var _this4 = this;

      if (this.readOnly) {
        return this._preview();
      }

      return this.onPerformSave().then(function () {
        return _this4._preview();
      });
    },
    _preview: function _preview() {
      var _this5 = this;

      return this.$api.post('render/getArticleUrl', {
        atomClass: this.atomClass,
        key: {
          atomId: this.item.atomId
        }
      }).then(function (data) {
        window.open(data.url, "cms_article_".concat(_this5.atomClass.module, "_").concat(_this5.item.atomId));
      });
    },
    onImageUpload: function onImageUpload() {
      return this.onUpload(1, this.item.atomId);
    },
    onAudioUpload: function onAudioUpload() {
      return this.onUpload(3, this.item.atomId);
    },
    onUpload: function onUpload(mode, atomId) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: mode,
              atomId: atomId
            },
            callback: function callback(code, data) {
              if (code === 200) {
                resolve({
                  text: data.realName,
                  addr: data.downloadUrl
                });
              }

              if (code === false) {
                reject();
              }
            }
          }
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/article/contentEdit.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_contentEditvue_type_script_lang_js_ = (contentEditvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/article/contentEdit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_contentEditvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "b3940e86",
  null
  
)

/* harmony default export */ var contentEdit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/language.vue?vue&type=template&id=e1be741e&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"visibility","onPerform":_vm.onPerformPreview}})],1)],1),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"json-textarea",attrs:{"type":"textarea"},domProps:{"value":_vm.content},on:{"input":_vm.onInput}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/language.vue?vue&type=template&id=e1be741e&

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/language.vue?vue&type=script&lang=js&

/* harmony default export */ var languagevue_type_script_lang_js_ = ({
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      language: this.$f7route.query.language,
      content: '{}'
    };
  },
  computed: {
    title: function title() {
      var _title = this.$text('Language');

      return "".concat(_title, ": ").concat(this.language);
    }
  },
  created: function created() {
    var _this = this;

    this.$api.post('site/getConfigLanguage', {
      atomClass: this.atomClass,
      language: this.language
    }).then(function (res) {
      if (!res.data) {
        _this.content = '{}';
      } else {
        _this.content = JSON.stringify(res.data, null, 2);
      }
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
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

      var data = JSON.parse(this.content);
      return this.$api.post('site/setConfigLanguage', {
        atomClass: this.atomClass,
        language: this.language,
        data: data
      }).then(function () {
        _this2.$emit('preview');

        return true;
      });
    },
    onPerformPreview: function onPerformPreview() {
      var url = this.combineAtomClass("/a/cms/config/languagePreview?language=".concat(this.language));
      this.$view.navigate(url, {
        context: {
          params: {
            source: this
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/language.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_languagevue_type_script_lang_js_ = (languagevue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/config/language.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  config_languagevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var language = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/languagePreview.vue?vue&type=template&id=11be1806&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Preview'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"json-textarea",attrs:{"type":"textarea","readonly":"readonly"},domProps:{"value":_vm.content}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/languagePreview.vue?vue&type=template&id=11be1806&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/languagePreview.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var languagePreviewvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      language: this.$f7route.query.language,
      content: '{}'
    };
  },
  computed: {
    params: function params() {
      return this.contextParams;
    },
    source: function source() {
      return this.contextParams && this.contextParams.source;
    }
  },
  created: function created() {
    this.onLoad();
  },
  mounted: function mounted() {
    if (this.source) {
      this.source.$on('preview', this.onPreview);
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.source) {
      this.source.$off('preview', this.onPreview);
    }
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    onPreview: function onPreview() {
      this.onLoad();
    },
    onLoad: function onLoad() {
      var _this = this;

      this.$api.post('site/getConfigLanguagePreview', {
        atomClass: this.atomClass,
        language: this.language
      }).then(function (res) {
        if (!res.data) {
          _this.content = '{}';
        } else {
          _this.content = JSON.stringify(res.data, null, 2);
        }
      });
    },
    onSize: function onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: "".concat(size.height - 20, "px"),
        width: "".concat(size.width - 20, "px")
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/languagePreview.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_languagePreviewvue_type_script_lang_js_ = (languagePreviewvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/config/languagePreview.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  config_languagePreviewvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var languagePreview = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/tag/select.vue?vue&type=template&id=ae7a725a&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Tags'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-button',{ref:"buttonSubmit",attrs:{"iconMaterial":"done","onPerform":_vm.onPerformDone}})],1)],1),_vm._v(" "),_c('eb-list',{attrs:{"form":"","no-hairlines-md":""},on:{"submit":function($event){$event.preventDefault();return _vm.onFormSubmit($event)}}},[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Tags')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Tags'),"clear-button":""},model:{value:(_vm.tagsText),callback:function ($$v) {_vm.tagsText=$$v},expression:"tagsText"}})],1)],1),_vm._v(" "),_c('f7-block',[_c('div',{staticClass:"row tags"},_vm._l((_vm.tagsAll),function(item){return _c('div',{key:item.id,class:{'chip':true, 'col-33':true, 'chip-outline':_vm.tagIndex(item)===-1},on:{"click":function($event){return _vm.onTagSwitch(item)}}},[_c('div',{staticClass:"chip-media"},[_vm._v(_vm._s(item.articleCount))]),_vm._v(" "),_c('div',{staticClass:"chip-label"},[_vm._v(_vm._s(item.tagName))])])}),0)])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/tag/select.vue?vue&type=template&id=ae7a725a&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/tag/select.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      tagsText: '',
      tagsAll: null
    };
  },
  computed: {
    language: function language() {
      return this.contextParams.language;
    },
    tags: function tags() {
      return this.contextParams.tags;
    }
  },
  created: function created() {
    var _this = this;

    this.tagsText = this.adjustTags();
    var options = {
      where: {
        language: this.language
      },
      orders: [['tagName', 'asc']]
    };
    this.$api.post('tag/list', {
      atomClass: this.atomClass,
      options: options
    }).then(function (res) {
      _this.tagsAll = res.list;
    });
  },
  methods: {
    onFormSubmit: function onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    adjustTags: function adjustTags() {
      if (!this.tags) return '';
      var tags = JSON.parse(this.tags);
      return tags.map(function (item) {
        return item.name;
      }).join(',');
    },
    tagIndex: function tagIndex(item) {
      if (!this.tagsText) return -1;
      var tags = this.tagsText.split(',');
      return tags.findIndex(function (name) {
        return name === item.tagName;
      });
    },
    onTagSwitch: function onTagSwitch(item) {
      var tags = this.tagsText ? this.tagsText.split(',') : [];
      var index = this.tagIndex(item);

      if (index > -1) {
        tags.splice(index, 1);
      } else {
        tags.push(item.tagName);
      }

      this.tagsText = tags.join(',');
    },
    onPerformDone: function onPerformDone() {
      var _this2 = this;

      var selected = null;

      if (this.tagsText) {
        selected = [];
        var exists = {};
        var tags = this.tagsText.split(',');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function _loop() {
            var name = _step.value;

            if (!exists[name]) {
              exists[name] = true;

              var tag = _this2.tagsAll.find(function (item) {
                return item.tagName === name;
              });

              if (tag) {
                selected.push({
                  id: tag.id,
                  name: name
                });
              } else {
                selected.push({
                  id: 0,
                  name: name
                });
              }
            }
          };

          for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
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

      this.contextCallback(200, selected ? JSON.stringify(selected) : null);
      this.$f7router.back();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/tag/select.vue?vue&type=script&lang=js&
 /* harmony default export */ var tag_selectvue_type_script_lang_js_ = (selectvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/tag/select.vue?vue&type=style&index=0&id=ae7a725a&lang=less&scoped=true&
var selectvue_type_style_index_0_id_ae7a725a_lang_less_scoped_true_ = __webpack_require__(11);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/tag/select.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  tag_selectvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "ae7a725a",
  null
  
)

/* harmony default export */ var tag_select = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/list.vue?vue&type=template&id=234dfb80&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.pageTitle,"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',[_c('eb-list-item',{attrs:{"title":_vm.$text('Site')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('eb-link',{attrs:{"eb-href":_vm.combineAtomClass('config/site')}},[_vm._v(_vm._s(_vm.$text('Config')))]),_vm._v(" "),_c('eb-link',{attrs:{"onPerform":_vm.onPerformBuild}},[_vm._v(_vm._s(_vm.$text('Build')))])],1)]),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"title":_vm.$text('Languages'),"group-title":""}}),_vm._v(" "),(_vm.languages)?_vm._l((_vm.languages),function(item){return _c('eb-list-item',{key:item.value,attrs:{"title":item.title}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('eb-link',{attrs:{"eb-href":_vm.combineAtomClass(("category/list?language=" + (item.value)))}},[_vm._v(_vm._s(_vm.$text('Categories')))]),_vm._v(" "),_c('eb-link',{attrs:{"eb-href":_vm.combineAtomClass(("config/language?language=" + (item.value)))}},[_vm._v(_vm._s(_vm.$text('Config')))]),_vm._v(" "),_c('eb-link',{attrs:{"context":item,"onPerform":_vm.onPerformBuildLanguage}},[_vm._v(_vm._s(_vm.$text('Build')))]),_vm._v(" "),(!!_vm.$device.desktop)?_c('eb-link',{attrs:{"context":item,"onPerform":_vm.onPerformPreview}},[_vm._v(_vm._s(_vm.$text('Preview')))]):_vm._e()],1)])}):_vm._e()],2)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/list.vue?vue&type=template&id=234dfb80&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/list.vue?vue&type=script&lang=js&

var ebModules = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebModules;

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  mixins: [ebModules],
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass
    };
  },
  computed: {
    languages: function languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
    pageTitle: function pageTitle() {
      var module = this.getModule(this.atomClass.module);
      if (module) return module.titleLocale;
      return '';
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
    onPerformBuild: function onPerformBuild() {
      var _this = this;

      return this.$view.dialog.confirm().then(function () {
        return _this.$api.post('site/buildLanguages', {
          atomClass: _this.atomClass
        }).then(function (data) {
          var progressId = data.progressId;

          _this.$view.dialog.progressbar({
            progressId: progressId,
            title: _this.$text('Build All Languages')
          });
        });
      });
    },
    onPerformBuildLanguage: function onPerformBuildLanguage(event, context) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post('site/buildLanguage', {
          atomClass: _this2.atomClass,
          language: context.value
        }).then(function (data) {
          var progressId = data.progressId;

          _this2.$view.dialog.progressbar({
            progressId: progressId,
            title: "".concat(_this2.$text('Build'), " ").concat(context.title)
          });
        });
      });
    },
    onPerformPreview: function onPerformPreview(event, context) {
      var _this3 = this;

      return this.$api.post('site/getUrl', {
        atomClass: this.atomClass,
        language: context.value,
        path: 'index.html'
      }).then(function (data) {
        window.open(data, "cms_site_".concat(_this3.atomClass.module, "_").concat(context.value));
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/config/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  config_listvue_type_script_lang_js_,
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

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/site.vue?vue&type=template&id=1d0b01c0&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Site Configuration'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"info","eb-href":_vm.combineAtomClass('config/siteBase')}})],1)],1),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"json-textarea",attrs:{"type":"textarea"},domProps:{"value":_vm.content},on:{"input":_vm.onInput}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/site.vue?vue&type=template&id=1d0b01c0&

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/site.vue?vue&type=script&lang=js&

/* harmony default export */ var sitevue_type_script_lang_js_ = ({
  data: function data() {
    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      content: '{}'
    };
  },
  created: function created() {
    var _this = this;

    this.$local.dispatch('getConfigSite', {
      atomClass: this.atomClass
    }).then(function (data) {
      if (!data) {
        _this.content = '{}';
      } else {
        _this.content = JSON.stringify(data, null, 2);
      }
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils["a" /* default */].combineAtomClass(this.atomClass, url);
    },
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

      var data = JSON.parse(this.content);
      return this.$api.post('site/setConfigSite', {
        atomClass: this.atomClass,
        data: data
      }).then(function () {
        _this2.$local.commit('setConfigSite', {
          atomClass: _this2.atomClass,
          configSite: data
        });

        _this2.$local.commit('setLanguages', {
          atomClass: _this2.atomClass,
          languages: null
        });

        _this2.$local.dispatch('getLanguages', {
          atomClass: _this2.atomClass
        });

        return true;
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/site.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_sitevue_type_script_lang_js_ = (sitevue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/config/site.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  config_sitevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var site = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/select.vue?vue&type=template&id=a43ffbec&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Category'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"done"},on:{"click":function($event){$event.preventDefault();return _vm.onDone($event)}}})],1)],1),_vm._v(" "),_c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();return _vm.onNodeClick(node)}}},[(node.states._selected)?_c('f7-icon',{attrs:{"material":"check_box"}}):_vm._e(),_vm._v(_vm._s(node.text)+"\n    ")],1)}}])})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/category/select.vue?vue&type=template&id=a43ffbec&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(2);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/utils.js
var utils = __webpack_require__(0);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/select.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    var _this = this;

    var atomClass = utils["a" /* default */].parseAtomClass(this.$f7route.query);
    return {
      atomClass: atomClass,
      treeOptions: {
        fetchData: function fetchData(node) {
          return _this.fetchChildren(node);
        }
      }
    };
  },
  computed: {
    categoryIdStart: function categoryIdStart() {
      return this.contextParams.categoryIdStart;
    },
    multiple: function multiple() {
      return this.contextParams.multiple;
    },
    language: function language() {
      return this.contextParams.language;
    },
    catalogOnly: function catalogOnly() {
      return this.contextParams.catalogOnly;
    },
    leafOnly: function leafOnly() {
      return this.contextParams.leafOnly;
    },
    categoryIdDisable: function categoryIdDisable() {
      return this.contextParams.categoryIdDisable;
    }
  },
  methods: {
    fetchChildren: function fetchChildren(node) {
      var _this2 = this;

      if (node.id === 'root' && this.categoryIdStart === undefined) {
        return new Promise(function (resolve) {
          resolve([{
            id: '_root',
            text: 'Root',
            data: {
              id: 0,
              catalog: 1
            },
            showChildren: true,
            isBatch: true
          }]);
        });
      }

      var categoryId = node.id === 'root' ? this.categoryIdStart : node.data.id;
      return this.$api.post('category/children', {
        atomClass: this.atomClass,
        language: this.language,
        categoryId: categoryId
      }).then(function (data) {
        var list = data.list.map(function (item) {
          var node = {
            id: item.id,
            text: item.categoryName || '[New Category]',
            data: item,
            showChildren: item.catalog === 1,
            isBatch: item.catalog === 1
          };
          return node;
        });
        list = list.filter(function (item) {
          return (!_this2.catalogOnly || item.data.catalog === 1) && (!_this2.categoryIdDisable || _this2.categoryIdDisable !== item.id);
        });
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
      if (this.leafOnly && node.data.catalog === 1) return;

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
// CONCATENATED MODULE: ./front/src/pages/category/select.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_selectvue_type_script_lang_js_ = (selectvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(1);

// CONCATENATED MODULE: ./front/src/pages/category/select.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  category_selectvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var category_select = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
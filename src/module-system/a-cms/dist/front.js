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
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

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
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/category/list.vue?vue&type=template&id=fecab672&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClick(node)}}},[_vm._v(_vm._s(node.text))])}}])})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/category/list.vue?vue&type=template&id=fecab672&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/category/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  props: {
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
      return this.$api.post('category/children', { language: this.language, categoryId: categoryId }).then(function (data) {
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
      }).catch(function (err) {
        _this2.$view.toast.show({ text: err.message });
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
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__);
var Vue = void 0;



function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: __webpack_require__(17).default,
    store: __webpack_require__(33).default(Vue),
    config: __webpack_require__(34).default,
    locales: __webpack_require__(35).default,
    components: __webpack_require__(45).default
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
/* 16 */,
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(18)("./" + name + '.vue').default;
}

/* harmony default export */ __webpack_exports__["default"] = ([{ path: 'config/list', component: load('config/list') }, { path: 'config/site', component: load('config/site') }, { path: 'config/siteBase', component: load('config/siteBase') }, { path: 'config/language', component: load('config/language') }, { path: 'config/languagePreview', component: load('config/languagePreview') }, { path: 'category/list', component: load('category/list') }, { path: 'category/edit', component: load('category/edit') }, { path: 'category/select', component: load('category/select') }, { path: 'article/contentEdit', component: load('article/contentEdit') }, { path: 'article/category', component: load('article/category') }, { path: 'article/list', component: load('article/list') }, { path: 'tag/select', component: load('tag/select') }]);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./article/category.vue": 49,
	"./article/contentEdit.vue": 52,
	"./article/list.vue": 47,
	"./category/edit.vue": 48,
	"./category/list.vue": 46,
	"./category/select.vue": 51,
	"./config/language.vue": 57,
	"./config/languagePreview.vue": 53,
	"./config/list.vue": 54,
	"./config/site.vue": 56,
	"./config/siteBase.vue": 50,
	"./tag/select.vue": 55
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
webpackContext.id = 18;

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_contentEdit_vue_vue_type_style_index_0_id_21e485cc_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_contentEdit_vue_vue_type_style_index_0_id_21e485cc_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_contentEdit_vue_vue_type_style_index_0_id_21e485cc_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_contentEdit_vue_vue_type_style_index_0_id_21e485cc_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 20 */,
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_92655ef8_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_92655ef8_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_92655ef8_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_92655ef8_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 22 */,
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_language_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_language_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_language_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_language_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 24 */,
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_languagePreview_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_languagePreview_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_languagePreview_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_languagePreview_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 26 */,
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_site_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_site_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_site_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_site_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 28 */,
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_siteBase_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_siteBase_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_siteBase_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_siteBase_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 30 */,
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_a7a4e110_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_a7a4e110_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_a7a4e110_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_select_vue_vue_type_style_index_0_id_a7a4e110_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 32 */,
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

/* harmony default export */ __webpack_exports__["default"] = (function (Vue) {

  return {
    state: {
      configSiteBase: null,
      configSite: null,
      languages: null
    },
    getters: {
      languages2: function languages2(state) {
        if (!state.languages) return null;
        return [{ title: '', value: '' }].concat(state.languages);
      }
    },
    mutations: {
      setConfigSiteBase: function setConfigSiteBase(state, configSiteBase) {
        state.configSiteBase = configSiteBase;
      },
      setConfigSite: function setConfigSite(state, configSite) {
        state.configSite = configSite;
      },
      setLanguages: function setLanguages(state, languages) {
        state.languages = languages;
      }
    },
    actions: {
      getConfigSiteBase: function getConfigSiteBase(_ref) {
        var state = _ref.state,
            commit = _ref.commit;

        return new Promise(function (resolve, reject) {
          if (state.configSiteBase) return resolve(state.configSiteBase);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSiteBase').then(function (res) {
            var data = res.data || {};
            commit('setConfigSiteBase', data);
            resolve(data);
          }).catch(function (err) {
            return reject(err);
          });
        });
      },
      getConfigSite: function getConfigSite(_ref2) {
        var state = _ref2.state,
            commit = _ref2.commit;

        return new Promise(function (resolve, reject) {
          if (state.configSite) return resolve(state.configSite);
          Vue.prototype.$meta.api.post('/a/cms/site/getConfigSite').then(function (res) {
            var data = res.data || {};
            commit('setConfigSite', data);
            resolve(data);
          }).catch(function (err) {
            return reject(err);
          });
        });
      },
      getLanguages: function getLanguages(_ref3) {
        var state = _ref3.state,
            commit = _ref3.commit;

        return new Promise(function (resolve, reject) {
          if (state.languages) return resolve(state.languages);
          Vue.prototype.$meta.api.post('/a/cms/site/getLanguages').then(function (res) {
            var data = res || [];
            commit('setLanguages', data);
            resolve(data);
          }).catch(function (err) {
            return reject(err);
          });
        });
      }
    }
  };
});

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(36).default
});

/***/ }),
/* 36 */
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
  'What to write': '写点什么'
});

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemEdit_vue_vue_type_style_index_0_id_79a17a94_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemEdit_vue_vue_type_style_index_0_id_79a17a94_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemEdit_vue_vue_type_style_index_0_id_79a17a94_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemEdit_vue_vue_type_style_index_0_id_79a17a94_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 38 */,
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemView_vue_vue_type_style_index_0_id_bcd870ce_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemView_vue_vue_type_style_index_0_id_bcd870ce_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemView_vue_vue_type_style_index_0_id_bcd870ce_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_itemView_vue_vue_type_style_index_0_id_bcd870ce_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 40 */,
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_97ed88c6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_97ed88c6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_97ed88c6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_97ed88c6_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 42 */,
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_711a30c1_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_711a30c1_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_711a30c1_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_711a30c1_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 44 */,
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./front/src/components/category/list.vue + 4 modules
var list = __webpack_require__(13);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/item.vue?vue&type=template&id=97ed88c6&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!this.readOnly)?[_c('item-edit',{attrs:{"readOnly":_vm.readOnly,"item":_vm.data,"onSave":_vm.onSave}})]:[_c('item-view',{attrs:{"readOnly":_vm.readOnly,"item":_vm.data}})]],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/item.vue?vue&type=template&id=97ed88c6&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/itemEdit.vue?vue&type=template&id=79a17a94&scoped=true&
var itemEditvue_type_template_id_79a17a94_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-list',[_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Title')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"atomName"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Content')}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"content","title":_vm.$text('Content'),"onChoose":_vm.onChooseEditContent}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Basic Info')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"categoryId","title":_vm.$text('Category'),"onChoose":_vm.onChooseCategory}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.item.categoryName))])]),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"tags","title":_vm.$text('Tags'),"onChoose":_vm.onChooseTags}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.adjustTags(_vm.item.tags)))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"keywords"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"description"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"slug"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"allowComment"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Extra')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sticky"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sorting"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"flag"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"extra"}})],1)],1)}
var itemEditvue_type_template_id_79a17a94_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/itemEdit.vue?vue&type=template&id=79a17a94&scoped=true&

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
    languages: function languages() {
      return this.$local.getters('languages2');
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages');
  },

  methods: {
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
        _this.$view.navigate('/a/cms/tag/select', {
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
        _this2.$view.navigate('/a/cms/category/select', {
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
      this.$view.navigate('/a/cms/article/contentEdit', {
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
// EXTERNAL MODULE: ./front/src/components/article/itemEdit.vue?vue&type=style&index=0&id=79a17a94&scoped=true&lang=css&
var itemEditvue_type_style_index_0_id_79a17a94_scoped_true_lang_css_ = __webpack_require__(37);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/article/itemEdit.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_itemEditvue_type_script_lang_js_,
  itemEditvue_type_template_id_79a17a94_scoped_true_render,
  itemEditvue_type_template_id_79a17a94_scoped_true_staticRenderFns,
  false,
  null,
  "79a17a94",
  null
  
)

component.options.__file = "itemEdit.vue"
/* harmony default export */ var itemEdit = (component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/itemView.vue?vue&type=template&id=bcd870ce&scoped=true&
var itemViewvue_type_template_id_bcd870ce_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-list',[_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Title')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"atomName"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Content')}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"content","title":_vm.$text('Content'),"onChoose":_vm.onChooseEditContent}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Basic Info')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages}}),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Category')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.item.categoryName))])]),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Tags')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.adjustTags(_vm.item.tags)))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"keywords"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"description"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"slug"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"allowComment"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Extra')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sticky"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"sorting"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"flag"}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"extra"}})],1)],1)}
var itemViewvue_type_template_id_bcd870ce_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/itemView.vue?vue&type=template&id=bcd870ce&scoped=true&

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
    languages: function languages() {
      return this.$local.getters('languages2');
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages');
  },

  methods: {
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
      this.$view.navigate('/a/cms/article/contentEdit', {
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
// EXTERNAL MODULE: ./front/src/components/article/itemView.vue?vue&type=style&index=0&id=bcd870ce&scoped=true&lang=css&
var itemViewvue_type_style_index_0_id_bcd870ce_scoped_true_lang_css_ = __webpack_require__(39);

// CONCATENATED MODULE: ./front/src/components/article/itemView.vue






/* normalize component */

var itemView_component = Object(componentNormalizer["a" /* default */])(
  article_itemViewvue_type_script_lang_js_,
  itemViewvue_type_template_id_bcd870ce_scoped_true_render,
  itemViewvue_type_template_id_bcd870ce_scoped_true_staticRenderFns,
  false,
  null,
  "bcd870ce",
  null
  
)

itemView_component.options.__file = "itemView.vue"
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
  }
});
// CONCATENATED MODULE: ./front/src/components/article/item.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_itemvue_type_script_lang_js_ = (itemvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/components/article/item.vue?vue&type=style&index=0&id=97ed88c6&scoped=true&lang=css&
var itemvue_type_style_index_0_id_97ed88c6_scoped_true_lang_css_ = __webpack_require__(41);

// CONCATENATED MODULE: ./front/src/components/article/item.vue






/* normalize component */

var item_component = Object(componentNormalizer["a" /* default */])(
  article_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "97ed88c6",
  null
  
)

item_component.options.__file = "item.vue"
/* harmony default export */ var item = (item_component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/article/search.vue?vue&type=template&id=711a30c1&scoped=true&
var searchvue_type_template_id_711a30c1_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-list',[_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages},on:{"change":_vm.onChangeLanguage}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"categoryId","title":_vm.$text('Category'),"onChoose":_vm.onChooseCategory}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.data.categoryName))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"content"}})],1)}
var searchvue_type_template_id_711a30c1_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/article/search.vue?vue&type=template&id=711a30c1&scoped=true&

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
  computed: {
    languages: function languages() {
      return this.$local.getters('languages2');
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages');
  },

  methods: {
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
        _this.$view.navigate('/a/cms/category/select', {
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
// EXTERNAL MODULE: ./front/src/components/article/search.vue?vue&type=style&index=0&id=711a30c1&scoped=true&lang=css&
var searchvue_type_style_index_0_id_711a30c1_scoped_true_lang_css_ = __webpack_require__(43);

// CONCATENATED MODULE: ./front/src/components/article/search.vue






/* normalize component */

var search_component = Object(componentNormalizer["a" /* default */])(
  article_searchvue_type_script_lang_js_,
  searchvue_type_template_id_711a30c1_scoped_true_render,
  searchvue_type_template_id_711a30c1_scoped_true_staticRenderFns,
  false,
  null,
  "711a30c1",
  null
  
)

search_component.options.__file = "search.vue"
/* harmony default export */ var search = (search_component.exports);
// CONCATENATED MODULE: ./front/src/components.js




/* harmony default export */ var components = __webpack_exports__["default"] = ({
  categoryList: list["a" /* default */],
  articleItem: item,
  articleSearch: search
});

/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/list.vue?vue&type=template&id=92655ef8&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('div',{staticClass:"category-node"},[_c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClickEdit(node)}}},[_vm._v(_vm._s(node.text))]),_vm._v(" "),_c('span',[_c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClickAdd(node)}}},[_vm._v(_vm._s(_vm.$text('Add')))]),_vm._v(" "),(node.data.id)?_c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClickMove(node)}}},[_vm._v(_vm._s(_vm.$text('Move')))]):_vm._e(),_vm._v(" "),(node.data.id)?_c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClickDelete(node)}}},[_vm._v(_vm._s(_vm.$text('Delete')))]):_vm._e()])])}}])})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/category/list.vue?vue&type=template&id=92655ef8&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
  data: function data() {
    var _this = this;

    return {
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
      return _title + ': ' + this.language;
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('a-cms:category:save', this.onCategorySave);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('a-cms:category:save', this.onCategorySave);
  },

  methods: {
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

      return this.$api.post('category/children', { language: this.language, categoryId: node.data.id }).then(function (data) {
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
      }).catch(function (err) {
        _this2.$view.toast.show({ text: err.message });
      });
    },
    onNodeClickEdit: function onNodeClickEdit(node) {
      if (!node.data.id) return;
      this.$view.navigate('/a/cms/category/edit?categoryId=' + node.data.id);
    },
    onNodeClickAdd: function onNodeClickAdd(node) {
      var _this3 = this;

      var categoryId = node.data.id;
      this.$view.dialog.prompt(this.$text('Please specify the category name')).then(function (categoryName) {
        if (!categoryName) return;
        _this3.$api.post('category/add', {
          data: {
            categoryName: categoryName,
            language: _this3.language,
            categoryIdParent: categoryId
          }
        }).then(function () {
          _this3.reloadChildren(node);
        });
      }).catch(function () {});
    },
    onNodeClickDelete: function onNodeClickDelete(node) {
      var _this4 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this4.$api.post('category/delete', { categoryId: node.data.id }).then(function () {
          _this4.reloadChildren(node.parent);
        }).catch(function (err) {
          return _this4.$view.dialog.alert(err.message);
        });
      });
    },
    onNodeClickMove: function onNodeClickMove(node) {
      var _this5 = this;

      var categoryId = node.data.id;
      this.$view.navigate('/a/cms/category/select', {
        context: {
          params: {
            language: this.language,
            categoryIdDisable: categoryId
          },
          callback: function callback(code, data) {
            if (code === 200) {
              var categoryIdParent = data.id;
              if (node.data.categoryIdParent !== categoryIdParent) {
                _this5.$api.post('category/move', { categoryId: categoryId, categoryIdParent: categoryIdParent }).then(function () {
                  var _arr = [node.data.categoryIdParent, categoryIdParent];

                  for (var _i = 0; _i < _arr.length; _i++) {
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
      var node = this.findNode(data.categoryIdParent);
      this.reloadChildren(node && node[0]);
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/category/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/category/list.vue?vue&type=style&index=0&id=92655ef8&lang=less&scoped=true&
var listvue_type_style_index_0_id_92655ef8_lang_less_scoped_true_ = __webpack_require__(21);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/category/list.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  category_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "92655ef8",
  null
  
)

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/list.vue?vue&type=template&id=0acdd2f6&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false}},[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"tab":false,"tab-active":""}},[_c('eb-atoms',{attrs:{"slot":"list","mode":"search","atomClass":{module:'a-cms',atomClassName:'article'},"where":{categoryId: _vm.categoryId}},slot:"list"})],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/article/list.vue?vue&type=template&id=0acdd2f6&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/list.vue?vue&type=script&lang=js&



var ebAtoms = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebAtoms;
/* harmony default export */ var listvue_type_script_lang_js_ = ({
  components: {
    ebAtoms: ebAtoms
  },
  data: function data() {
    return {
      categoryId: this.$f7route.query.categoryId,
      categoryName: this.$f7route.query.categoryName
    };
  },

  computed: {
    title: function title() {
      return this.$text('Category') + ': ' + this.categoryName;
    }
  },
  methods: {}
});
// CONCATENATED MODULE: ./front/src/pages/article/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/edit.vue?vue&type=template&id=d026b402&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}})],1)],1),_vm._v(" "),_c('eb-validate',{ref:"validate",attrs:{"auto":"","data":_vm.category,"params":{validator: 'category'},"onPerform":_vm.onPerformValidate}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/category/edit.vue?vue&type=template&id=d026b402&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/edit.vue?vue&type=script&lang=js&


/* harmony default export */ var editvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      categoryId: this.$f7route.query.categoryId,
      category: null
    };
  },

  computed: {
    title: function title() {
      var _title = this.$text('Category');
      if (this.category) _title = _title + ': ' + this.category.categoryName;
      return _title;
    }
  },
  created: function created() {
    var _this = this;

    this.$api.post('category/item', { categoryId: this.categoryId }).then(function (data) {
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
        _this2.$meta.eventHub.$emit('a-cms:category:save', { categoryId: _this2.categoryId, categoryIdParent: _this2.category.categoryIdParent, category: _this2.category });
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
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "edit.vue"
/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/category.vue?vue&type=template&id=580ecab4&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"view_headline","onPerform":_vm.onPerformList}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"search","onPerform":_vm.onPerformSearch}})],1),_vm._v(" "),_c('f7-subnavbar',[_c('f7-toolbar',{attrs:{"tabbar":"","scrollable":_vm.languages && _vm.languages.length>2}},[(_vm.languages)?_vm._l((_vm.languages),function(item,index){return _c('f7-link',{key:item.value,attrs:{"tab-link":("#" + _vm.tabIdLanguages + "_" + (item.value)),"tab-link-active":index===0}},[_vm._v(_vm._s(item.title))])}):_vm._e()],2)],1)],1),_vm._v(" "),_c('f7-tabs',[(_vm.languages)?_vm._l((_vm.languages),function(item,index){return _c('f7-page-content',{key:item.value,attrs:{"id":(_vm.tabIdLanguages + "_" + (item.value)),"tab":"","tab-active":index===0}},[_c('category-list',{attrs:{"categoryIdStart":0,"language":item.value},on:{"node:click":_vm.onNodeClick}})],1)}):_vm._e()],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/article/category.vue?vue&type=template&id=580ecab4&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/category/list.vue + 4 modules
var list = __webpack_require__(13);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/category.vue?vue&type=script&lang=js&




var ebMenus = external_vue_default.a.prototype.$meta.module.get('a-base').options.components.ebMenus;
/* harmony default export */ var categoryvue_type_script_lang_js_ = ({
  mixins: [ebMenus],
  components: {
    categoryList: list["a" /* default */]
  },
  data: function data() {
    return {
      tabIdLanguages: external_vue_default.a.prototype.$meta.util.nextId('tab')
    };
  },

  computed: {
    title: function title() {
      return this.$text('Atom') + ': ' + this.$text('Article');
    },
    languages: function languages() {
      return this.$local.state.languages;
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages');
  },

  methods: {
    onPerformList: function onPerformList() {
      var item = { module: 'a-cms', atomClassName: 'article', name: 'listArticle' };
      var _menu = this.getMenu(item);
      if (!_menu) return;
      _menu = this.$utils.extend(_menu, { navigateOptions: { target: '_self' } });
      return this.$meta.util.performAction({ ctx: this, action: _menu, item: item });
    },
    onPerformSearch: function onPerformSearch() {
      this.$view.navigate('/a/base/atom/search?module=a-cms&atomClassName=article', { target: '_self' });
    },
    onNodeClick: function onNodeClick(node) {
      if (node.data.catalog) return;
      this.$view.navigate('/a/cms/article/list?categoryId=' + node.data.id + '&categoryName=' + encodeURIComponent(node.data.categoryName), { target: '_self' });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/article/category.vue?vue&type=script&lang=js&
 /* harmony default export */ var article_categoryvue_type_script_lang_js_ = (categoryvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "category.vue"
/* harmony default export */ var category = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/siteBase.vue?vue&type=template&id=52c9fa34&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Default'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"cms-json-textarea",attrs:{"type":"textarea","readonly":"readonly"},domProps:{"value":_vm.content}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/siteBase.vue?vue&type=template&id=52c9fa34&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/siteBase.vue?vue&type=script&lang=js&


/* harmony default export */ var siteBasevue_type_script_lang_js_ = ({
  data: function data() {
    return {
      content: '{}'
    };
  },
  created: function created() {
    var _this = this;

    this.$local.dispatch('getConfigSiteBase').then(function (data) {
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
        height: size.height - 20 + 'px',
        width: size.width - 20 + 'px'
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/siteBase.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_siteBasevue_type_script_lang_js_ = (siteBasevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/config/siteBase.vue?vue&type=style&index=0&lang=css&
var siteBasevue_type_style_index_0_lang_css_ = __webpack_require__(29);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "siteBase.vue"
/* harmony default export */ var siteBase = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/select.vue?vue&type=template&id=752d85a2&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Category'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"done"},on:{"click":function($event){$event.preventDefault();return _vm.onDone($event)}}})],1)],1),_vm._v(" "),_c('eb-tree',{ref:"tree",attrs:{"options":_vm.treeOptions},scopedSlots:_vm._u([{key:"default",fn:function(ref){
var node = ref.node;
return _c('span',{on:{"click":function($event){$event.stopPropagation();_vm.onNodeClick(node)}}},[(node.states._selected)?_c('f7-icon',{attrs:{"material":"check_box"}}):_vm._e(),_vm._v(_vm._s(node.text))],1)}}])})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/category/select.vue?vue&type=template&id=752d85a2&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/category/select.vue?vue&type=script&lang=js&



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
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
      return this.$api.post('category/children', { language: this.language, categoryId: categoryId }).then(function (data) {
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
// CONCATENATED MODULE: ./front/src/pages/category/select.vue?vue&type=script&lang=js&
 /* harmony default export */ var category_selectvue_type_script_lang_js_ = (selectvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "select.vue"
/* harmony default export */ var category_select = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/contentEdit.vue?vue&type=template&id=21e485cc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[(!_vm.readOnly)?_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}}):_vm._e(),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"visibility","onPerform":_vm.onPerformPreview}})],1)],1),_vm._v(" "),(_vm.module)?[_c('eb-box',[_c('mavon-editor',{ref:"editor",attrs:{"value":_vm.item.content,"onImageUpload":_vm.onImageUpload,"language":_vm.language,"subfield":_vm.subfield,"editable":_vm.editable,"defaultOpen":_vm.defaultOpen,"toolbarsFlag":_vm.toolbarsFlag,"navigation":_vm.navigation,"toolbars":_vm.toolbars},on:{"change":_vm.onChange,"save":_vm.onSave}})],1)]:_vm._e()],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/article/contentEdit.vue?vue&type=template&id=21e485cc&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/article/contentEdit.vue?vue&type=script&lang=js&



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var contentEditvue_type_script_lang_js_ = ({
  meta: {
    size: 'large'
  },
  mixins: [ebPageContext],
  data: function data() {
    return {
      dirty: false,
      module: null
    };
  },

  computed: {
    title: function title() {
      return '' + (this.dirty ? '* ' : '') + this.item.atomName;
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
        code: true,
        table: true,
        undo: true,
        redo: true,
        trash: true,
        navigation: true,
        alignleft: true,
        aligncenter: true,
        alignright: true,
        subfield: true };
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-mavoneditor', function (module) {
      _this.module = module;
    });
  },

  methods: {
    onChange: function onChange(data) {
      if (this.readOnly) return;
      if (this.item.content === data) return;
      this.dirty = true;
      this.contextCallback(200, { content: data });
    },
    onSave: function onSave() {
      this.onPerformSave();
    },
    onPerformSave: function onPerformSave() {
      var _this2 = this;

      return this.contextParams.ctx.onSave().then(function () {
        _this2.dirty = false;
        return true;
      });
    },
    onPerformPreview: function onPerformPreview() {
      var _this3 = this;

      if (this.readOnly) {
        return this._preview();
      }
      return this.onPerformSave().then(function () {
        return _this3._preview();
      });
    },
    _preview: function _preview() {
      var _this4 = this;

      return this.$api.post('render/getArticleUrl', { key: { atomId: this.item.atomId } }).then(function (data) {
        window.open(data.url, 'cms_article_' + _this4.item.atomId);
      });
    },
    onImageUpload: function onImageUpload() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: 1,
              atomId: _this5.item.atomId
            },
            callback: function callback(code, data) {
              if (code === 200) {
                resolve({ text: data.realName, addr: data.downloadUrl });
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
// EXTERNAL MODULE: ./front/src/pages/article/contentEdit.vue?vue&type=style&index=0&id=21e485cc&lang=less&scoped=true&
var contentEditvue_type_style_index_0_id_21e485cc_lang_less_scoped_true_ = __webpack_require__(19);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/article/contentEdit.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  article_contentEditvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "21e485cc",
  null
  
)

component.options.__file = "contentEdit.vue"
/* harmony default export */ var contentEdit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/languagePreview.vue?vue&type=template&id=a31b385e&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Preview'),"eb-back-link":"Back"}}),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"cms-json-textarea",attrs:{"type":"textarea","readonly":"readonly"},domProps:{"value":_vm.content}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/languagePreview.vue?vue&type=template&id=a31b385e&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/languagePreview.vue?vue&type=script&lang=js&



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var languagePreviewvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    return {
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
    onPreview: function onPreview() {
      this.onLoad();
    },
    onLoad: function onLoad() {
      var _this = this;

      this.$api.post('site/getConfigLanguagePreview', { language: this.language }).then(function (res) {
        if (!res.data) {
          _this.content = '{}';
        } else {
          _this.content = JSON.stringify(res.data, null, 2);
        }
      });
    },
    onSize: function onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: size.height - 20 + 'px',
        width: size.width - 20 + 'px'
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/languagePreview.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_languagePreviewvue_type_script_lang_js_ = (languagePreviewvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/config/languagePreview.vue?vue&type=style&index=0&lang=css&
var languagePreviewvue_type_style_index_0_lang_css_ = __webpack_require__(25);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "languagePreview.vue"
/* harmony default export */ var languagePreview = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/list.vue?vue&type=template&id=77f8013f&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('cms'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',[_c('eb-list-item',{attrs:{"title":_vm.$text('Site')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('eb-link',{attrs:{"eb-href":"config/site"}},[_vm._v(_vm._s(_vm.$text('Config')))]),_vm._v(" "),_c('eb-link',{attrs:{"onPerform":_vm.onPerformBuild}},[_vm._v(_vm._s(_vm.$text('Build')))])],1)]),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"title":_vm.$text('Languages'),"group-title":""}}),_vm._v(" "),(_vm.languages)?_vm._l((_vm.languages),function(item){return _c('eb-list-item',{key:item.value,attrs:{"title":item.title}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_c('eb-link',{attrs:{"eb-href":("category/list?language=" + (item.value))}},[_vm._v(_vm._s(_vm.$text('Categories')))]),_vm._v(" "),_c('eb-link',{attrs:{"eb-href":("config/language?language=" + (item.value))}},[_vm._v(_vm._s(_vm.$text('Config')))]),_vm._v(" "),_c('eb-link',{attrs:{"context":item.value,"onPerform":_vm.onPerformBuildLanguage}},[_vm._v(_vm._s(_vm.$text('Build')))]),_vm._v(" "),_c('eb-link',{attrs:{"context":item.value,"onPerform":_vm.onPerformPreview}},[_vm._v(_vm._s(_vm.$text('Preview')))])],1)])}):_vm._e()],2)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/list.vue?vue&type=template&id=77f8013f&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
  data: function data() {
    return {};
  },

  computed: {
    languages: function languages() {
      return this.$local.state.languages;
    }
  },
  created: function created() {
    this.$local.dispatch('getLanguages');
  },

  methods: {
    onPerformBuild: function onPerformBuild() {
      var _this = this;

      return this.$view.dialog.confirm().then(function () {
        return _this.$api.post('site/buildLanguages').then(function (data) {
          return _this.$text('Time Used') + ': ' + data.time + _this.$text('seconds');
        });
      });
    },
    onPerformBuildLanguage: function onPerformBuildLanguage(event, context) {
      var _this2 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this2.$api.post('site/buildLanguage', {
          language: context
        }).then(function (data) {
          return _this2.$text('Time Used') + ': ' + data.time + _this2.$text('seconds');
        });
      });
    },
    onPerformPreview: function onPerformPreview(event, context) {
      return this.$api.post('site/getUrl', {
        language: context,
        path: 'index.html'
      }).then(function (data) {
        window.open(data, 'cms_site_' + context);
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "list.vue"
/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/tag/select.vue?vue&type=template&id=a7a4e110&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Tags'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"done"},on:{"click":function($event){$event.preventDefault();return _vm.onDone($event)}}})],1)],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Tags')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Tags'),"clear-button":""},model:{value:(_vm.tagsText),callback:function ($$v) {_vm.tagsText=$$v},expression:"tagsText"}})],1)],1),_vm._v(" "),_c('f7-block',[_c('div',{staticClass:"row tags"},_vm._l((_vm.tagsAll),function(item){return _c('div',{key:item.id,class:{'chip':true, 'col-33':true, 'chip-outline':_vm.tagIndex(item)===-1},on:{"click":function($event){_vm.onTagSwitch(item)}}},[_c('div',{staticClass:"chip-media"},[_vm._v(_vm._s(item.articleCount))]),_vm._v(" "),_c('div',{staticClass:"chip-label"},[_vm._v(_vm._s(item.tagName))])])}))])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/tag/select.vue?vue&type=template&id=a7a4e110&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/tag/select.vue?vue&type=script&lang=js&



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    return {
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
      where: { language: this.language },
      orders: [['tagName', 'asc']]
    };
    this.$api.post('tag/list', { options: options }).then(function (res) {
      _this.tagsAll = res.list;
    });
  },

  methods: {
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
    onDone: function onDone() {
      var _this2 = this;

      var selected = null;
      if (this.tagsText) {
        selected = [];
        var exists = {};
        var tags = this.tagsText.split(',');

        var _loop = function _loop(name) {
          if (!exists[name]) {
            exists[name] = true;
            var tag = _this2.tagsAll.find(function (item) {
              return item.tagName === name;
            });
            if (tag) {
              selected.push({ id: tag.id, name: name });
            } else {
              selected.push({ id: 0, name: name });
            }
          }
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            _loop(name);
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
      this.contextCallback(200, selected ? JSON.stringify(selected) : null);
      this.$f7router.back();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/tag/select.vue?vue&type=script&lang=js&
 /* harmony default export */ var tag_selectvue_type_script_lang_js_ = (selectvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/tag/select.vue?vue&type=style&index=0&id=a7a4e110&lang=less&scoped=true&
var selectvue_type_style_index_0_id_a7a4e110_lang_less_scoped_true_ = __webpack_require__(31);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/tag/select.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  tag_selectvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "a7a4e110",
  null
  
)

component.options.__file = "select.vue"
/* harmony default export */ var tag_select = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/site.vue?vue&type=template&id=22fad456&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Site Configuration'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"info","eb-href":"config/siteBase"}})],1)],1),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"cms-json-textarea",attrs:{"type":"textarea"},domProps:{"value":_vm.content},on:{"input":_vm.onInput}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/site.vue?vue&type=template&id=22fad456&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/site.vue?vue&type=script&lang=js&


/* harmony default export */ var sitevue_type_script_lang_js_ = ({
  data: function data() {
    return {
      content: '{}'
    };
  },
  created: function created() {
    var _this = this;

    this.$local.dispatch('getConfigSite').then(function (data) {
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
        height: size.height - 20 + 'px',
        width: size.width - 20 + 'px'
      });
    },
    onInput: function onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave: function onPerformSave() {
      var _this2 = this;

      var data = JSON.parse(this.content);
      return this.$api.post('site/setConfigSite', { data: data }).then(function () {
        _this2.$local.commit('setConfigSite', data);

        _this2.$local.commit('setLanguages', null);
        _this2.$local.dispatch('getLanguages');
        return true;
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/config/site.vue?vue&type=script&lang=js&
 /* harmony default export */ var config_sitevue_type_script_lang_js_ = (sitevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/config/site.vue?vue&type=style&index=0&lang=css&
var sitevue_type_style_index_0_lang_css_ = __webpack_require__(27);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "site.vue"
/* harmony default export */ var site = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/language.vue?vue&type=template&id=12505148&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"visibility","onPerform":_vm.onPerformPreview}})],1)],1),_vm._v(" "),_c('eb-box',{on:{"size":_vm.onSize}},[_c('textarea',{ref:"textarea",staticClass:"cms-json-textarea",attrs:{"type":"textarea"},domProps:{"value":_vm.content},on:{"input":_vm.onInput}})])],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/config/language.vue?vue&type=template&id=12505148&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/config/language.vue?vue&type=script&lang=js&


/* harmony default export */ var languagevue_type_script_lang_js_ = ({
  data: function data() {
    return {
      language: this.$f7route.query.language,
      content: '{}'
    };
  },

  computed: {
    title: function title() {
      var _title = this.$text('Language');
      return _title + ': ' + this.language;
    }
  },
  created: function created() {
    var _this = this;

    this.$api.post('site/getConfigLanguage', { language: this.language }).then(function (res) {
      if (!res.data) {
        _this.content = '{}';
      } else {
        _this.content = JSON.stringify(res.data, null, 2);
      }
    });
  },

  methods: {
    onSize: function onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: size.height - 20 + 'px',
        width: size.width - 20 + 'px'
      });
    },
    onInput: function onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave: function onPerformSave() {
      var _this2 = this;

      var data = JSON.parse(this.content);
      return this.$api.post('site/setConfigLanguage', {
        language: this.language,
        data: data
      }).then(function () {
        _this2.$emit('preview');
        return true;
      });
    },
    onPerformPreview: function onPerformPreview() {
      this.$view.navigate('/a/cms/config/languagePreview?language=' + this.language, {
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
// EXTERNAL MODULE: ./front/src/pages/config/language.vue?vue&type=style&index=0&lang=css&
var languagevue_type_style_index_0_lang_css_ = __webpack_require__(23);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

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

component.options.__file = "language.vue"
/* harmony default export */ var language = __webpack_exports__["default"] = (component.exports);

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
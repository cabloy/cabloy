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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__);
var Vue;


function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(2)["default"],
    store: __webpack_require__(4)["default"](Vue),
    config: __webpack_require__(5)["default"],
    locales: __webpack_require__(6)["default"],
    components: __webpack_require__(8)["default"]
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(3)("./".concat(name, ".vue"))["default"];
}

/* harmony default export */ __webpack_exports__["default"] = ([]);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 3;

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(7)["default"]
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'CMS:Community': 'CMS:社区',
  Name: '名称',
  Description: '描述'
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/item.vue?vue&type=template&id=21e1cdab&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[(!this.readOnly)?[_c('item-edit',{attrs:{"readOnly":_vm.readOnly,"item":_vm.data,"onSave":_vm.onSave}})]:[_c('item-view',{attrs:{"readOnly":_vm.readOnly,"item":_vm.data}})]],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/post/item.vue?vue&type=template&id=21e1cdab&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/itemEdit.vue?vue&type=template&id=86da1d74&scoped=true&
var itemEditvue_type_template_id_86da1d74_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.moduleCMS)?_c('f7-list',[_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Title')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"atomName"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Content')}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"content","title":_vm.$text('Content'),"onChoose":_vm.onChooseEditContent}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Basic Info')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"categoryId","title":_vm.$text('Category'),"onChoose":_vm.onChooseCategory}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.item.categoryName))])]),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"tags","title":_vm.$text('Tags'),"onChoose":_vm.onChooseTags}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.adjustTags(_vm.item.tags)))])])],1)],1):_vm._e()}
var itemEditvue_type_template_id_86da1d74_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/post/itemEdit.vue?vue&type=template&id=86da1d74&scoped=true&

// CONCATENATED MODULE: ./front/src/common/utils.js
/* harmony default export */ var utils = ({
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
      module: 'cms-sitecommunity',
      atomClassName: 'post'
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
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/itemEdit.vue?vue&type=script&lang=js&

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
  data: function data() {
    return {
      moduleCMS: null
    };
  },
  computed: {
    atomClass: function atomClass() {
      return {
        module: this.item.module,
        atomClassName: this.item.atomClassName
      };
    },
    languages: function languages() {
      var stateLanguages = this.$store.getState('a/cms/languages');
      return stateLanguages[this.atomClass.module];
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-cms', function (module) {
      _this.moduleCMS = module;

      _this.$store.dispatch('a/cms/getLanguages', {
        atomClass: _this.atomClass
      });
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    adjustTags: function adjustTags(tags) {
      if (!tags) return '';

      var _tags = JSON.parse(tags);

      return _tags.map(function (item) {
        return item.name;
      }).join(',');
    },
    onChooseTags: function onChooseTags() {
      var _this2 = this;

      if (!this.item.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }

      return new Promise(function (resolve) {
        var url = _this2.combineAtomClass('/a/cms/tag/select');

        _this2.$view.navigate(url, {
          context: {
            params: {
              language: _this2.item.language,
              tags: _this2.item.tags
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this2.item.tags = data;
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
      var _this3 = this;

      if (!this.item.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }

      return new Promise(function (resolve) {
        var url = _this3.combineAtomClass('/a/cms/category/select');

        _this3.$view.navigate(url, {
          context: {
            params: {
              language: _this3.item.language,
              categoryIdStart: 0,
              leafOnly: true
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this3.item.categoryId = data.id;
                _this3.item.categoryName = data.categoryName;
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
      var _this4 = this;

      if (!this.item.categoryId) {
        this.$view.dialog.alert(this.$text('Please specify the category name'));
        return false;
      }

      var url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        context: {
          params: {
            ctx: this,
            item: this.item,
            readOnly: this.readOnly
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this4.item.content = data.content;
            }
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/post/itemEdit.vue?vue&type=script&lang=js&
 /* harmony default export */ var post_itemEditvue_type_script_lang_js_ = (itemEditvue_type_script_lang_js_); 
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

// CONCATENATED MODULE: ./front/src/components/post/itemEdit.vue





/* normalize component */

var component = normalizeComponent(
  post_itemEditvue_type_script_lang_js_,
  itemEditvue_type_template_id_86da1d74_scoped_true_render,
  itemEditvue_type_template_id_86da1d74_scoped_true_staticRenderFns,
  false,
  null,
  "86da1d74",
  null
  
)

/* harmony default export */ var itemEdit = (component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/itemView.vue?vue&type=template&id=1f781297&scoped=true&
var itemViewvue_type_template_id_1f781297_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.moduleCMS)?_c('f7-list',[_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Title')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"atomName"}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Content')}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"content","title":_vm.$text('Content'),"onChoose":_vm.onChooseEditContent}})],1),_vm._v(" "),_c('f7-list-group',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.$text('Basic Info')}}),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages}}),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Category')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.item.categoryName))])]),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Tags')}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.adjustTags(_vm.item.tags)))])])],1)],1):_vm._e()}
var itemViewvue_type_template_id_1f781297_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/post/itemView.vue?vue&type=template&id=1f781297&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/itemView.vue?vue&type=script&lang=js&

/* harmony default export */ var itemViewvue_type_script_lang_js_ = ({
  props: {
    readOnly: {
      type: Boolean
    },
    item: {
      type: Object
    }
  },
  data: function data() {
    return {
      moduleCMS: null
    };
  },
  computed: {
    atomClass: function atomClass() {
      return {
        module: this.item.module,
        atomClassName: this.item.atomClassName
      };
    },
    languages: function languages() {
      var stateLanguages = this.$store.getState('a/cms/languages');
      return stateLanguages[this.atomClass.module];
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-cms', function (module) {
      _this.moduleCMS = module;

      _this.$store.dispatch('a/cms/getLanguages', {
        atomClass: _this.atomClass
      });
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    adjustTags: function adjustTags(tags) {
      if (!tags) return '';

      var _tags = JSON.parse(tags);

      return _tags.map(function (item) {
        return item.name;
      }).join(',');
    },
    onChooseEditContent: function onChooseEditContent() {
      var _this2 = this;

      if (!this.item.categoryId) {
        return false;
      }

      var url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        context: {
          params: {
            ctx: this,
            item: this.item,
            readOnly: this.readOnly
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this2.item.content = data.content;
            }
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/post/itemView.vue?vue&type=script&lang=js&
 /* harmony default export */ var post_itemViewvue_type_script_lang_js_ = (itemViewvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/post/itemView.vue





/* normalize component */

var itemView_component = normalizeComponent(
  post_itemViewvue_type_script_lang_js_,
  itemViewvue_type_template_id_1f781297_scoped_true_render,
  itemViewvue_type_template_id_1f781297_scoped_true_staticRenderFns,
  false,
  null,
  "1f781297",
  null
  
)

/* harmony default export */ var itemView = (itemView_component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/item.vue?vue&type=script&lang=js&


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
// CONCATENATED MODULE: ./front/src/components/post/item.vue?vue&type=script&lang=js&
 /* harmony default export */ var post_itemvue_type_script_lang_js_ = (itemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/post/item.vue





/* normalize component */

var item_component = normalizeComponent(
  post_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "21e1cdab",
  null
  
)

/* harmony default export */ var item = (item_component.exports);
// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/search.vue?vue&type=template&id=21810ecb&scoped=true&
var searchvue_type_template_id_21810ecb_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.moduleCMS)?_c('f7-list',[_c('eb-list-item-validate',{attrs:{"dataKey":"language","options":_vm.languages},on:{"change":_vm.onChangeLanguage}}),_vm._v(" "),_c('eb-list-item-choose',{attrs:{"link":"#","dataPath":"categoryId","title":_vm.$text('Category'),"onChoose":_vm.onChooseCategory}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.data.categoryName))])]),_vm._v(" "),_c('eb-list-item-validate',{attrs:{"dataKey":"content"}})],1):_vm._e()}
var searchvue_type_template_id_21810ecb_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/post/search.vue?vue&type=template&id=21810ecb&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/post/search.vue?vue&type=script&lang=js&

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
      atomClass: atomClass,
      moduleCMS: null
    };
  },
  computed: {
    languages: function languages() {
      var stateLanguages = this.$store.getState('a/cms/languages');
      return stateLanguages[this.atomClass.module];
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use('a-cms', function (module) {
      _this.moduleCMS = module;

      _this.$store.dispatch('a/cms/getLanguages', {
        atomClass: _this.atomClass
      });
    });
  },
  methods: {
    combineAtomClass: function combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChangeLanguage: function onChangeLanguage() {
      this.$set(this.data, 'categoryId', null);
      this.$set(this.data, 'categoryName', null);
    },
    onChooseCategory: function onChooseCategory() {
      var _this2 = this;

      if (!this.data.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }

      return new Promise(function (resolve) {
        var url = _this2.combineAtomClass('/a/cms/category/select');

        _this2.$view.navigate(url, {
          context: {
            params: {
              language: _this2.data.language,
              categoryIdStart: 0,
              leafOnly: true
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this2.$set(_this2.data, 'categoryId', data.id);

                _this2.$set(_this2.data, 'categoryName', data.categoryName);

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
// CONCATENATED MODULE: ./front/src/components/post/search.vue?vue&type=script&lang=js&
 /* harmony default export */ var post_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./front/src/components/post/search.vue





/* normalize component */

var search_component = normalizeComponent(
  post_searchvue_type_script_lang_js_,
  searchvue_type_template_id_21810ecb_scoped_true_render,
  searchvue_type_template_id_21810ecb_scoped_true_staticRenderFns,
  false,
  null,
  "21810ecb",
  null
  
)

/* harmony default export */ var search = (search_component.exports);
// CONCATENATED MODULE: ./front/src/components.js


/* harmony default export */ var components = __webpack_exports__["default"] = ({
  postItem: item,
  postSearch: search
});

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
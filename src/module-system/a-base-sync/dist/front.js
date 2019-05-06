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
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  meta: {
    component: false
  },
  computed: {
    atomClassesAll: function atomClassesAll() {
      return this.$store.getState('a/base/atomClasses');
    }
  },
  methods: {
    getAtomClass: function getAtomClass(atomClass) {
      if (!this.atomClassesAll || !atomClass) return null;
      return this.atomClassesAll[atomClass.module][atomClass.atomClassName];
    }
  },
  created: function created() {
    this.$store.dispatch('a/base/getAtomClasses');
  }
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  meta: {
    component: false
  },
  computed: {
    actionsAll: function actionsAll() {
      return this.$store.getState('a/base/actions');
    }
  },
  methods: {
    getAction: function getAction(action) {
      if (!this.actionsAll) return null;
      return this.actionsAll[action.module][action.atomClassName][action.name];
    },
    getActionTitle: function getActionTitle(action) {
      var _action = this.getAction(action);

      return _action ? _action.titleLocale : null;
    },
    getActionsOfAtomClass: function getActionsOfAtomClass(atomClass) {
      if (!atomClass || !this.actionsAll) return null;
      return this.actionsAll[atomClass.module][atomClass.atomClassName];
    }
  },
  created: function created() {
    this.$store.dispatch('a/base/getActions');
  }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/list.vue?vue&type=template&id=648daf6b&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.atomId,staticClass:"item",attrs:{"link":_vm.itemShow?false:'#',"context":item,"onPerform":_vm.onItemClick,"swipeout":""},on:{"swipeout:opened":function($event){return _vm.onSwipeoutOpened($event,item)},"contextmenu:opened":function($event){return _vm.onSwipeoutOpened($event,item)}}},[(_vm.itemShow)?[_c('div',{attrs:{"slot":"media"},slot:"media"},[_c('img',{staticClass:"avatar avatar32",attrs:{"src":_vm.getItemMetaMedia(item)}})]),_vm._v(" "),_c('div',{staticClass:"header",attrs:{"slot":"root-start"},slot:"root-start"},[_c('div',{staticClass:"mediaLabel"},[_c('span',[_vm._v(_vm._s(_vm.getItemMetaMediaLabel(item)))])]),_vm._v(" "),_c('div',[(item.star)?_c('span',[_vm._v("⭐")]):_vm._e(),_vm._v(" "),(item.attachmentCount>0)?_c('span',[_vm._v("🧷")]):_vm._e(),_vm._v(" "),(item.attachmentCount>1)?_c('span',[_vm._v(_vm._s(((item.attachmentCount) + " ")))]):_vm._e(),_vm._v(" "),(item.commentCount>0)?_c('span',[_vm._v("💬")]):_vm._e(),_vm._v(" "),(item.commentCount>1)?_c('span',[_vm._v(_vm._s(((item.commentCount) + " ")))]):_vm._e(),_vm._v(" "),_vm._l((_vm.getItemMetaFlags(item)),function(flag){return _c('f7-badge',{key:flag},[_vm._v(_vm._s(flag))])}),_vm._v(" "),(item.atomFlag>0)?_c('f7-badge',[_vm._v(_vm._s(_vm.getFlagTitle(item)))]):_vm._e(),_vm._v(" "),(item.labels && _vm.labels)?_vm._l((JSON.parse(item.labels)),function(label){return _c('f7-badge',{key:label,style:({backgroundColor:_vm.getLabel(label).color})},[_vm._v(_vm._s(_vm.getLabel(label).text))])}):_vm._e()],2)]),_vm._v(" "),_c('div',{staticClass:"title",attrs:{"slot":"title"},slot:"title"},[_c('div',{staticClass:"date"},[_c('div',[_vm._v(_vm._s(_vm.$text('Modification Time')))]),_vm._v(" "),_c('div',[_vm._v(_vm._s(_vm.$text('Created Time')))])])]),_vm._v(" "),_c('div',{staticClass:"after",attrs:{"slot":"after"},slot:"after"},[_c('div',{staticClass:"date"},[_vm._v(_vm._s(_vm.$meta.util.formatDateTime(item.atomUpdatedAt)))]),_vm._v(" "),_c('div',{staticClass:"date"},[_vm._v(_vm._s(_vm.$meta.util.formatDateTime(item.atomCreatedAt)))])])]:_vm._e(),_vm._v(" "),(!_vm.itemShow)?[_c('div',{attrs:{"slot":"media"},slot:"media"},[_c('img',{staticClass:"avatar avatar32",attrs:{"src":_vm.getItemMetaMedia(item)}})]),_vm._v(" "),_c('div',{staticClass:"header",attrs:{"slot":"root-start"},slot:"root-start"},[_c('div',{staticClass:"mediaLabel"},[_c('span',[_vm._v(_vm._s(_vm.getItemMetaMediaLabel(item)))])]),_vm._v(" "),_c('div',{staticClass:"date"},[(item.star)?_c('span',[_vm._v("⭐")]):_vm._e(),_vm._v(" "),(item.attachmentCount>0)?_c('span',[_vm._v("🧷")]):_vm._e(),_vm._v(" "),(item.attachmentCount>1)?_c('span',[_vm._v(_vm._s(((item.attachmentCount) + " ")))]):_vm._e(),_vm._v(" "),(item.commentCount>0)?_c('span',[_vm._v("💬")]):_vm._e(),_vm._v(" "),(item.commentCount>1)?_c('span',[_vm._v(_vm._s(((item.commentCount) + " ")))]):_vm._e(),_vm._v(" "),_c('span',[_vm._v(_vm._s(_vm.$meta.util.formatDateTimeRelative(item.atomUpdatedAt)))])])]),_vm._v(" "),_c('div',{staticClass:"title",attrs:{"slot":"title"},slot:"title"},[_c('div',[_vm._v(_vm._s(item.atomName))])]),_vm._v(" "),_c('div',{staticClass:"summary",attrs:{"slot":"root-end"},slot:"root-end"},[_vm._v("\n          "+_vm._s(_vm.getItemMetaSummary(item))+"\n        ")]),_vm._v(" "),_c('div',{staticClass:"after",attrs:{"slot":"after"},slot:"after"},[_vm._l((_vm.getItemMetaFlags(item)),function(flag){return _c('f7-badge',{key:flag},[_vm._v(_vm._s(flag))])}),_vm._v(" "),(item.atomFlag>0)?_c('f7-badge',[_vm._v(_vm._s(_vm.getFlagTitle(item)))]):_vm._e(),_vm._v(" "),(item.labels && _vm.labels)?_vm._l((JSON.parse(item.labels)),function(label){return _c('f7-badge',{key:label,style:({backgroundColor:_vm.getLabel(label).color})},[_vm._v(_vm._s(_vm.getLabel(label).text))])}):_vm._e()],2)]:_vm._e(),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"left"},slot:"left"},[(_vm.mode==='stars')?[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarOff}},[_vm._v(_vm._s(_vm.$text('Unstar')))])]:[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarSwitch}},[_vm._v(_vm._s(item.star?_vm.$text('Unstar'):_vm.$text('Star')))])],_vm._v(" "),_c('div',{attrs:{"color":"yellow","context":item,"onPerform":_vm.onLabel}},[_vm._v(_vm._s(_vm.$text('Labels')))])],2),_vm._v(" "),(!_vm.itemShow)?_c('div',{attrs:{"slot":"right","ready":!!item._actions},slot:"right"},[(item._actions)?_vm._l((item._actions),function(action,index){return _c('div',{key:action.id,attrs:{"color":_vm.getActionColor(action,index),"context":{item: item,action: action},"onPerform":_vm.onAction}},[_vm._v(_vm._s(_vm.getActionTitle(action)))])}):_vm._e()],2):_vm._e()])],2)}),1),_vm._v(" "),(!_vm.itemShow)?_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}}):_vm._e(),_vm._v(" "),_c('eb-popover',{ref:"popoverAtomOrders",attrs:{"ready":_vm.popoverOrdersReady}},[(_vm.popoverOrdersReady)?_c('f7-list',{attrs:{"inset":""}},_vm._l((_vm.atomOrders),function(atomOrder){return _c('eb-list-item',{key:_vm.getAtomOrderKey(atomOrder),attrs:{"popover-close":"","link":"#","context":atomOrder,"onPerform":_vm.onPerformChangeAtomOrder}},[_c('f7-icon',{attrs:{"slot":"media","material":_vm.getAtomOrderStatus(atomOrder)},slot:"media"}),_vm._v(" "),_c('div',{attrs:{"slot":"title"},slot:"title"},[_vm._v(_vm._s(atomOrder.titleLocale))])],1)}),1):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atom/list.vue?vue&type=template&id=648daf6b&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/atomClasses.js
var atomClasses = __webpack_require__(2);

// EXTERNAL MODULE: ./front/src/common/atomActions.js
var atomActions = __webpack_require__(3);

// EXTERNAL MODULE: ./front/src/common/atomOrders.js
var atomOrders = __webpack_require__(9);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/list.vue?vue&type=script&lang=js&




/* harmony default export */ var listvue_type_script_lang_js_ = ({
  mixins: [atomClasses["a" /* default */], atomActions["a" /* default */], atomOrders["a" /* default */]],
  meta: {
    global: false
  },
  props: {
    mode: {
      type: String
    },
    itemShow: {
      type: Object
    },
    params: {
      type: Object
    },
    atomClass: {
      type: Object
    },
    where: {
      type: Object
    }
  },
  data: function data() {
    return {
      items: this.itemShow ? [this.itemShow] : [],
      atomOrderSelected: null
    };
  },
  computed: {
    labels: function labels() {
      return this.$local.getters('userLabels');
    },
    flags: function flags() {
      return this.$local.state.flags;
    },
    user: function user() {
      return this.$store.state.auth.user.op;
    },
    popoverOrdersReady: function popoverOrdersReady() {
      return !!this.ordersAll;
    },
    atomOrders: function atomOrders() {
      if (!this.ordersAll) return null;
      var ordersBase = this.getOrdersOfBase();
      var ordersAtomClass = this.atomClass ? this.getOrdersOfAtomClass(this.atomClass) : null;
      return ordersAtomClass ? ordersBase.concat(ordersAtomClass) : ordersBase;
    },
    atomOrderDefault: function atomOrderDefault() {
      var atomOrder;

      if (this.mode === 'list') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a'
        };
      } else if (this.mode === 'drafts') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a'
        };
      } else if (this.mode === 'stars') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'd'
        };
      } else if (this.mode.indexOf('labels') > -1) {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'e'
        };
      } else if (this.mode === 'all') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a'
        };
      } else if (this.mode === 'search') {
        atomOrder = {
          name: 'updatedAt',
          by: 'desc',
          tableAlias: 'a'
        };
      }

      return atomOrder;
    }
  },
  created: function created() {
    this.$local.dispatch('getLabels');
    this.$local.dispatch('getFlags');
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('atom:star', this.onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
  },
  methods: {
    reload: function reload(force) {
      if (this.itemShow) return;
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
      var options;

      if (this.mode === 'list') {
        options = {
          where: {
            'a.atomEnabled': 1
          },
          page: {
            index: index
          }
        };
      } else if (this.mode === 'drafts') {
        options = {
          where: {
            'a.atomEnabled': 0
          },
          page: {
            index: index
          }
        };
      } else if (this.mode === 'stars') {
        options = {
          star: 1,
          page: {
            index: index
          }
        };
      } else if (this.mode.indexOf('labels') > -1) {
        options = {
          label: this.mode.split('-')[1],
          page: {
            index: index
          }
        };
      } else if (this.mode === 'all') {
        options = {
          page: {
            index: index
          }
        };
      } else if (this.mode === 'search') {
        var where = {};

        if (this.params && this.params.atomName) {
          where['a.atomName'] = {
            val: this.params.atomName,
            op: 'like'
          };
        }

        if (this.params && this.params.atomClassExtra) {
          this.$utils.extend(where, this.params.atomClassExtra);
        }

        options = {
          where: where,
          page: {
            index: index
          }
        };

        if (this.params && this.params.label) {
          options.label = this.params.label;
        }
      }

      if (this.where) {
        options.where = this.$utils.extend({}, options.where, this.where);
      }

      var atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;
      options.orders = [[this.getAtomOrderKey(atomOrderCurrent), atomOrderCurrent.by]];
      options.mode = this.mode;
      return this.$api.post('atom/select', {
        atomClass: this.atomClass,
        options: options
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onStarSwitch: function onStarSwitch(event, item) {
      var star = item.star ? 0 : 1;
      return this._onStarSwitch(event, item, star, 'swipeoutClose');
    },
    onStarOff: function onStarOff(event, item) {
      return this._onStarSwitch(event, item, 0, 'swipeoutDelete');
    },
    _onStarSwitch: function _onStarSwitch(event, item, star, swipeoutAction) {
      var _this2 = this;

      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(function () {
          _this2.$meta.vueLayout.openLogin();
        });
        return;
      }

      var key = {
        atomId: item.atomId,
        itemId: item.itemId
      };
      return this.$api.post('atom/star', {
        key: key,
        atom: {
          star: star
        }
      }).then(function (data) {
        _this2.$meta.eventHub.$emit('atom:star', {
          key: key,
          star: data.star,
          starCount: data.starCount
        });

        _this2.$meta.util[swipeoutAction](event.target);
      });
    },
    onLabel: function onLabel(event, item) {
      var _this3 = this;

      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(function () {
          _this3.$meta.vueLayout.openLogin();
        });
        return;
      }

      this.$view.navigate("/a/base/atom/labels?atomId=".concat(item.atomId));
    },
    onStarChanged: function onStarChanged(data) {
      var index = this.items.findIndex(function (item) {
        return item.atomId === data.key.atomId;
      });

      if (this.mode === 'stars') {
        if (data.star === 0 && index !== -1) {
          this.items.splice(index, 1);
        } else if (data.star === 1 && index === -1) {
          this.reload();
        }
      } else {
        if (index !== -1) {
          this.items[index].star = data.star;
        }
      }
    },
    onLabelsChanged: function onLabelsChanged(data) {
      var index = this.items.findIndex(function (item) {
        return item.atomId === data.key.atomId;
      });

      if (this.mode.indexOf('labels') > -1) {
        var mode = this.mode.split('-')[1];
        var exists = data.labels.indexOf(mode) > -1;

        if (!exists && index !== -1) {
          this.items.splice(index, 1);
        } else if (exists && index === -1) {
          this.reload();
        }
      } else {
        if (index !== -1) {
          this.items[index].labels = JSON.stringify(data.labels);
        }
      }
    },
    onActionChanged: function onActionChanged(data) {
      var _this4 = this;

      var key = data.key;
      var action = data.action;

      if (action.menu === 1 && action.action === 'create') {
        if (this.mode === 'drafts' || this.mode === 'search' || this.mode === 'all') {
          this.reload();
        }

        return;
      }

      var index = this.items.findIndex(function (item) {
        return item.atomId === key.atomId;
      });

      if (action.name === 'delete') {
        if (index !== -1) {
          this.items.splice(index, 1);
        }

        return;
      }

      if (action.name === 'submit') {
        if (this.mode === 'list') {
          this.reload();
          return;
        } else if (this.mode === 'drafts' && index !== -1) {
          this.items.splice(index, 1);
          return;
        }
      }

      if (index !== -1) {
        this.$api.post('atom/read', {
          key: key
        }).then(function (data) {
          external_vue_default.a.set(_this4.items, index, data);
        });
      }
    },
    getLabel: function getLabel(id) {
      if (!this.labels) return null;
      return this.labels[id];
    },
    onSwipeoutOpened: function onSwipeoutOpened(event, item) {
      if (this.itemShow || item._actions) return;
      this.$api.post('atom/actions', {
        key: {
          atomId: item.atomId
        },
        basic: true
      }).then(function (data) {
        external_vue_default.a.set(item, '_actions', data);
      });
    },
    onAction: function onAction(event, context) {
      var _this5 = this;

      var _action = this.getAction(context.action);

      if (!_action) return;
      return this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: context.item
      }).then(function () {
        _this5.$meta.util.swipeoutClose(event.target);
      });
    },
    getActionColor: function getActionColor(action, index) {
      if (index === 0) return 'orange';else if (index === 1) return 'yellow';
      return 'blue';
    },
    getItemMetaFlags: function getItemMetaFlags(item) {
      var flags = item._meta && item._meta.flags;
      if (!flags) return [];
      if (Array.isArray(flags)) return flags;
      return flags.split(',');
    },
    getItemMetaMedia: function getItemMetaMedia(item) {
      var media = item._meta && item._meta.media || item.avatar;
      return this.$meta.util.combineImageUrl(media, 32);
    },
    getItemMetaMediaLabel: function getItemMetaMediaLabel(item) {
      var mediaLabel = item._meta && item._meta.mediaLabel || item.userName;
      return mediaLabel;
    },
    getItemMetaSummary: function getItemMetaSummary(item) {
      var summary = item._meta && item._meta.summary || '';

      if (this.atomClass) {
        return summary;
      }

      var atomClass = this.getAtomClass({
        module: item.module,
        atomClassName: item.atomClassName
      });
      if (!atomClass) return summary;
      return "".concat(atomClass.titleLocale, " ").concat(summary);
    },
    getFlagTitle: function getFlagTitle(item) {
      if (!this.flags) return null;
      var flag = this.flags[item.module][item.atomClassName][item.atomFlag];
      return flag ? flag.titleLocale : this.$text('Flag Not Found');
    },
    onItemClick: function onItemClick(event, item) {
      if (this.itemShow) return;
      return this.onAction(event, {
        item: item,
        action: {
          module: item.module,
          atomClassName: item.atomClassName,
          name: 'read'
        }
      });
    },
    openPopoverForAtomOrders: function openPopoverForAtomOrders(element) {
      var popover = this.$refs.popoverAtomOrders.$el;
      this.$f7.popover.open(popover, element);
    },
    getAtomOrderStatus: function getAtomOrderStatus(atomOrder) {
      var atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;

      if (this.getAtomOrderKey(atomOrderCurrent) === this.getAtomOrderKey(atomOrder)) {
        return atomOrderCurrent.by === 'desc' ? 'arrow_drop_down' : 'arrow_drop_up';
      }

      return '';
    },
    onPerformChangeAtomOrder: function onPerformChangeAtomOrder(event, atomOrder) {
      var atomOrderCurrent = this.atomOrderSelected || this.atomOrderDefault;

      if (this.getAtomOrderKey(atomOrderCurrent) === this.getAtomOrderKey(atomOrder)) {
        this.atomOrderSelected = {
          name: atomOrderCurrent.name,
          tableAlias: atomOrderCurrent.tableAlias,
          by: atomOrderCurrent.by === 'desc' ? 'asc' : 'desc'
        };
      } else {
        this.atomOrderSelected = atomOrder;
      }

      this.reload(true);
    },
    getAtomOrderKey: function getAtomOrderKey(atomOrder) {
      return "".concat(atomOrder.tableAlias, ".").concat(atomOrder.name);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/atom/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/atom/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  meta: {
    component: false
  },
  computed: {
    menusAll: function menusAll() {
      return this.$store.getState('a/base/menus');
    }
  },
  methods: {
    getMenu: function getMenu(menu) {
      if (!this.menusAll) return null;
      var menus = this.menusAll[menu.module];
      if (menu.name) return menus[menu.name];

      for (var key in menus) {
        if (menus[key].action === menu.action) return menus[key];
      }

      return null;
    },
    getMenuTitle: function getMenuTitle(menu) {
      var _menu = this.getMenu(menu);

      return _menu ? _menu.titleLocale : null;
    }
  },
  created: function created() {
    this.$store.dispatch('a/base/getMenus');
  }
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/menu/list.vue?vue&type=template&id=58950172&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',[(_vm.mode==='search')?_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale,"swipeout":""}},[_c('f7-icon',{attrs:{"slot":"media","color":"orange","material":item.star?'star':''},slot:"media"}),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarSwitch}},[_vm._v(_vm._s(item.star?_vm.$text('Unstar'):_vm.$text('Star')))])])])],1)}):(_vm.mode==='stars')?_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale,"swipeout":""}},[_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarOff}},[_vm._v(_vm._s(_vm.$text('Unstar')))])])])],1)}):_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.title,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale,"swipeout":""}},[_c('f7-icon',{attrs:{"slot":"media","color":"orange","material":item.star?'star':''},slot:"media"}),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarSwitch}},[_vm._v(_vm._s(item.star?_vm.$text('Unstar'):_vm.$text('Star')))])])])],1)})],2)})],2),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/menu/list.vue?vue&type=template&id=58950172&

// EXTERNAL MODULE: ./front/src/common/modules.js
var modules = __webpack_require__(10);

// EXTERNAL MODULE: ./front/src/common/menus.js
var menus = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/menu/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    global: false
  },
  mixins: [modules["a" /* default */], menus["a" /* default */]],
  props: {
    mode: {
      type: String
    }
  },
  data: function data() {
    return {
      items: [],
      query: ''
    };
  },
  computed: {
    itemGroups: function itemGroups() {
      if (this.mode === 'scenes') return this.itemGroupsScenes;
      if (this.mode === 'modules') return this.itemGroupsModules;
    },
    itemGroupsScenes: function itemGroupsScenes() {
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (!group || group.id !== item.scene) {
            var name = this.$config.menu.scene[item.scene];
            var title = this.$text(name);
            group = {
              id: item.scene,
              name: name,
              title: title,
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
    itemGroupsModules: function itemGroupsModules() {
      if (!this.modulesAll) return [];
      var groups = [];
      var group = null;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;

          if (!group || group.id !== item.module) {
            var module = this.modulesAll[item.module];
            group = {
              id: item.module,
              title: module.titleLocale,
              items: []
            };
            groups.push(group);
          }

          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return groups;
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('menu:star', this.onStarChanged);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('menu:star', this.onStarChanged);
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
      var options;

      if (this.mode === 'scenes') {
        options = {
          where: {
            menu: 1
          },
          orders: [['scene', 'asc'], ['sorting', 'asc']],
          page: {
            index: index
          }
        };
      } else if (this.mode === 'modules') {
        options = {
          where: {
            menu: 1
          },
          orders: [['module', 'asc'], ['scene', 'asc'], ['sorting', 'asc']],
          page: {
            index: index
          }
        };
      } else if (this.mode === 'stars') {
        options = {
          where: {
            menu: 1
          },
          orders: [['d.updatedAt', 'desc']],
          star: 1,
          page: {
            index: index
          }
        };
      } else if (this.mode === 'search') {
        options = {
          where: {
            menu: 1,
            titleLocale: {
              val: this.query,
              op: 'like'
            }
          },
          orders: [['titleLocale', 'asc']],
          page: {
            index: index
          }
        };
      }

      return this.$api.post('function/list', {
        options: options
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    onStarSwitch: function onStarSwitch(event, item) {
      var _this2 = this;

      var star = item.star ? 0 : 1;
      return this.$api.post('function/star', {
        id: item.id,
        star: star
      }).then(function () {
        _this2.$meta.eventHub.$emit('menu:star', {
          id: item.id,
          star: star
        });

        _this2.$meta.util.swipeoutClose(event.target);
      });
    },
    onStarOff: function onStarOff(event, item) {
      var _this3 = this;

      return this.$api.post('function/star', {
        id: item.id,
        star: 0
      }).then(function () {
        _this3.$meta.eventHub.$emit('menu:star', {
          id: item.id,
          star: 0
        });

        _this3.$meta.util.swipeoutDelete(event.target);
      });
    },
    onStarChanged: function onStarChanged(data) {
      var index = this.items.findIndex(function (item) {
        return item.id === data.id;
      });

      if (this.mode === 'stars') {
        if (data.star === 0 && index !== -1) {
          this.items.splice(index, 1);
        } else if (data.star === 1 && index === -1) {
          this.reload();
        }
      } else {
        if (index !== -1) {
          this.items[index].star = data.star;
        }
      }
    },
    onItemClick: function onItemClick(event, item) {
      var _menu = this.getMenu(item);

      if (!_menu) return;

      if (_menu.action === 'create') {
        item = {
          atomClassId: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
          atomClassIdParent: item.atomClassIdParent
        };
      }

      return this.$meta.util.performAction({
        ctx: this,
        action: _menu,
        item: item
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/menu/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var menu_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/menu/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/item.vue?vue&type=template&id=05528d2b&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.title,"eb-back-link":"Back"}},[_c('f7-nav-right',[(_vm.ready && _vm.findAction('write'))?_c('eb-link',{attrs:{"iconMaterial":this.mode==='edit'?'save':'edit',"context":this.mode==='edit'?'save':'write',"onPerform":_vm.onAction}}):_vm._e(),_vm._v(" "),(_vm.showPopover)?_c('f7-link',{attrs:{"iconMaterial":"more_horiz","popover-open":("#" + _vm.popoverId)}}):_vm._e()],1)],1),_vm._v(" "),(_vm.notfound)?[_c('f7-list',[_c('f7-list-item',{attrs:{"title":_vm.$text('Not found')}})],1)]:[(_vm.ready)?_c('atoms',{attrs:{"mode":"list","itemShow":_vm.item}}):_vm._e(),_vm._v(" "),(_vm.ready)?_c('eb-validate',{ref:"validate",attrs:{"readOnly":this.mode!=='edit',"auto":"","data":_vm.item,"params":_vm.validateParams,"onPerform":_vm.onPerformValidate,"onSave":_vm.onSave},on:{"submit":function($event){$event.preventDefault();return _vm.onSubmit($event)}}}):_vm._e(),_vm._v(" "),_c('f7-popover',{attrs:{"id":_vm.popoverId}},[(_vm.showPopover)?_c('f7-list',{attrs:{"inset":""}},[(_vm.findAction('write') && _vm.item.atomEnabled===0)?_c('eb-list-button',{attrs:{"popover-close":"","context":"submit","onPerform":_vm.onAction}},[_vm._v(_vm._s(_vm.$text('Submit')))]):_vm._e(),_vm._v(" "),_vm._l((_vm.actions),function(action){return (action.name!=='write')?_c('eb-list-button',{key:action.id,attrs:{"popover-close":"","context":action,"onPerform":_vm.onAction}},[_vm._v(_vm._s(_vm.getActionTitle(action)))]):_vm._e()})],2):_vm._e()],1)],_vm._v(" "),(_vm.ready)?_c('f7-toolbar',{attrs:{"bottom-md":""}},[_c('eb-link',{attrs:{"iconMaterial":"comment","eb-href":("comment/list?atomId=" + (_vm.item.atomId))}},[_vm._v(_vm._s(_vm.item.commentCount))]),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"attach_file","eb-href":("attachment/list?atomId=" + (_vm.item.atomId))}},[_vm._v(_vm._s(_vm.item.attachmentCount))])],1):_vm._e()],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atom/item.vue?vue&type=template&id=05528d2b&scoped=true&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var list = __webpack_require__(4);

// EXTERNAL MODULE: ./front/src/common/atomActions.js
var atomActions = __webpack_require__(3);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/item.vue?vue&type=script&lang=js&



/* harmony default export */ var itemvue_type_script_lang_js_ = ({
  mixins: [atomActions["a" /* default */]],
  meta: {
    global: false
  },
  components: {
    atoms: list["a" /* default */]
  },
  props: {
    mode: {
      type: String
    },
    query: {
      type: Object
    }
  },
  data: function data() {
    return {
      atomId: parseInt(this.query.atomId || 0),
      itemId: parseInt(this.query.itemId || 0),
      atomClassId: parseInt(this.query.atomClassId || 0),
      item: null,
      module: null,
      validateParams: null,
      actions: null,
      popoverId: external_vue_default.a.prototype.$meta.util.nextId('popover'),
      notfound: false
    };
  },
  computed: {
    ready: function ready() {
      return this.item && this.module && this.validateParams && this.actions && this.actionsAll;
    },
    title: function title() {
      var name = this.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      if (!this.item) return name;
      return "".concat(name, ": ").concat(this.item.atomName);
    },
    showPopover: function showPopover() {
      if (!this.ready) return false;
      var submit = this.findAction('write') && this.item.atomEnabled === 0;
      if (submit) return true;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var action = _step.value;
          if (action.name !== 'write') return true;
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

      return false;
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
    this.$meta.eventHub.$on('comment:action', this.onCommentChanged);
    this.$meta.eventHub.$on('attachment:action', this.onAttachmentChanged);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
    this.$meta.eventHub.$off('comment:action', this.onCommentChanged);
    this.$meta.eventHub.$off('attachment:action', this.onAttachmentChanged);
  },
  created: function created() {
    this.load();
  },
  methods: {
    reload: function reload() {
      this.item = null;
      this.actions = null;
      this.load();
    },
    load: function load() {
      var _this = this;

      this.$api.post('atom/read', {
        key: {
          atomId: this.atomId
        }
      }).then(function (data) {
        _this.item = data;

        _this.$meta.module.use(_this.item.module, function (module) {
          _this.module = module;
        });

        _this.$api.post('atom/validator', {
          atomClass: {
            id: _this.item.atomClassId
          }
        }).then(function (data) {
          _this.validateParams = {
            module: data.module,
            validator: data.validator
          };
        });

        _this.fetchActions();
      })["catch"](function () {
        _this.notfound = true;
      });
    },
    fetchActions: function fetchActions() {
      var _this2 = this;

      this.$api.post('atom/actions', {
        key: {
          atomId: this.atomId
        }
      }).then(function (data) {
        _this2.actions = data;
      });
    },
    findAction: function findAction(actionName) {
      return this.actions.find(function (item) {
        return item.name === actionName;
      });
    },
    onSave: function onSave(event) {
      var _this3 = this;

      return this.onAction(event, 'save').then(function () {
        _this3.$view.toast.show();
      });
    },
    onAction: function onAction(event, action) {
      var _this4 = this;

      if (action === 'save' || action === 'submit') {
        return this.$refs.validate.perform(event, action);
      }

      if (typeof action === 'string') {
        action = {
          module: this.item.module,
          atomClassName: this.item.atomClassName,
          name: action
        };
      }

      var _action = this.getAction(action);

      if (action.name === 'write') {
        _action = this.$utils.extend({}, _action, {
          navigateOptions: {
            target: '_self'
          }
        });
      }

      return this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: this.item
      }).then(function (res) {
        if (res) _this4.$f7router.back();
      });
    },
    onPerformValidate: function onPerformValidate(event, actionName) {
      var _this5 = this;

      var action = this.$utils.extend({}, this.findAction('write'), {
        name: actionName
      });

      var _action = this.getAction(action);

      return this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: this.item
      }).then(function () {
        if (actionName === 'save') return true;
        if (actionName === 'submit') _this5.$f7router.back();
      });
    },
    onActionChanged: function onActionChanged(data) {
      var key = data.key;
      var action = data.action;
      if (this.mode === 'edit') return;
      if (!this.ready) return;
      if (this.item.atomId !== key.atomId) return;

      if (action.menu === 1 && action.action === 'create') {
        return;
      }

      if (action.name === 'delete') {
        this.item = null;
        this.notfound = true;
        return;
      }

      this.reload();
    },
    onCommentChanged: function onCommentChanged(data) {
      if (!this.item || data.atomId !== this.atomId) return;
      if (data.action === 'create') this.item.commentCount += 1;
      if (data.action === 'delete') this.item.commentCount -= 1;
    },
    onAttachmentChanged: function onAttachmentChanged(data) {
      if (!this.item || data.atomId !== this.atomId) return;
      if (data.action === 'create') this.item.attachmentCount += 1;
      if (data.action === 'delete') this.item.attachmentCount -= 1;
    },
    onSubmit: function onSubmit(event) {
      return this.onSave(event);
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/atom/item.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_itemvue_type_script_lang_js_ = (itemvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/atom/item.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "05528d2b",
  null
  
)

/* harmony default export */ var item = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  meta: {
    component: false
  },
  computed: {
    ordersAll: function ordersAll() {
      return this.$store.getState('a/base/orders');
    }
  },
  methods: {
    getOrdersOfAtomClass: function getOrdersOfAtomClass(atomClass) {
      if (!atomClass || !this.ordersAll) return null;
      return this.ordersAll[atomClass.module][atomClass.atomClassName];
    },
    getOrdersOfBase: function getOrdersOfBase() {
      if (!this.ordersAll) return null;
      return this.ordersAll.base;
    }
  },
  created: function created() {
    this.$store.dispatch('a/base/getOrders');
  }
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  meta: {
    component: false
  },
  data: function data() {
    return {};
  },
  computed: {
    modulesAll: function modulesAll() {
      return this.$store.getState('a/base/modules');
    }
  },
  created: function created() {
    this.$store.dispatch('a/base/getModules');
  },
  methods: {
    getModule: function getModule(module) {
      return this.modulesAll ? this.modulesAll[module] : null;
    }
  }
});

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _assets_css_module_less__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_less__WEBPACK_IMPORTED_MODULE_0__);
var Vue;


function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');
  Vue = _Vue;
  return cb({
    routes: __webpack_require__(13)["default"],
    store: __webpack_require__(16)["default"](Vue),
    config: __webpack_require__(17)["default"],
    locales: __webpack_require__(18)["default"],
    components: __webpack_require__(35)["default"]
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(14)("./".concat(name, ".vue"))["default"];
}

/* harmony default export */ __webpack_exports__["default"] = ([{
  path: 'menu/list',
  component: load('menu/list')
}, {
  path: 'menu/search',
  component: load('menu/search')
}, {
  path: 'menu/selectFunction',
  component: load('menu/selectFunction')
}, {
  path: 'atom/list',
  component: load('atom/list')
}, {
  path: 'atom/search',
  component: load('atom/search')
}, {
  path: 'atom/searchResult',
  component: load('atom/searchResult')
}, {
  path: 'atom/labels',
  component: load('atom/labels')
}, {
  path: 'atom/edit',
  component: load('atom/edit')
}, {
  path: 'atom/view',
  component: load('atom/view')
}, {
  path: 'atom/selectAtomClass',
  component: load('atom/selectAtomClass')
}, {
  path: 'comment/list',
  component: load('comment/list')
}, {
  path: 'comment/item',
  component: load('comment/item')
}, {
  path: 'comment/all',
  component: load('comment/all')
}, {
  path: 'attachment/list',
  component: load('attachment/list')
}, {
  path: 'base/alert',
  component: load('base/alert')
}]);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atom/edit.vue": 25,
	"./atom/labels.vue": 24,
	"./atom/list.vue": 26,
	"./atom/search.vue": 20,
	"./atom/searchResult.vue": 27,
	"./atom/selectAtomClass.vue": 29,
	"./atom/view.vue": 30,
	"./attachment/list.vue": 23,
	"./base/alert.vue": 31,
	"./comment/all.vue": 32,
	"./comment/item.vue": 33,
	"./comment/list.vue": 21,
	"./menu/list.vue": 34,
	"./menu/search.vue": 22,
	"./menu/selectFunction.vue": 28
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
webpackContext.id = 14;

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_3291d312_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_3291d312_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_3291d312_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_3291d312_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* harmony default export */ __webpack_exports__["default"] = (function (Vue) {
  return {
    state: {
      labels: null,
      modules: null,
      atomClasses: null,
      actions: null,
      flags: null,
      orders: null,
      menus: null,
      functions: null
    },
    getters: {
      userLabels: function userLabels(state) {
        if (!state.labels) return null;
        var user = Vue.prototype.$meta.store.getState('auth/user');
        return state.labels[user.op.id];
      }
    },
    mutations: {
      setLabels: function setLabels(state, labels) {
        var user = Vue.prototype.$meta.store.getState('auth/user');
        state.labels = _defineProperty({}, user.op.id, labels);
      },
      setModules: function setModules(state, modules) {
        state.modules = modules;
      },
      setAtomClasses: function setAtomClasses(state, atomClasses) {
        state.atomClasses = atomClasses;
      },
      setActions: function setActions(state, actions) {
        state.actions = actions;
      },
      setFlags: function setFlags(state, flags) {
        state.flags = flags;
      },
      setOrders: function setOrders(state, orders) {
        state.orders = orders;
      },
      setMenus: function setMenus(state, menus) {
        state.menus = menus;
      },
      setFunctions: function setFunctions(state, functions) {
        state.functions = functions;
      }
    },
    actions: {
      getLabels: function getLabels(_ref) {
        var commit = _ref.commit,
            getters = _ref.getters;
        return new Promise(function (resolve, reject) {
          var userLabels = getters.userLabels;
          if (userLabels) return resolve(userLabels);
          Vue.prototype.$meta.api.post('/a/base/user/getLabels').then(function (data) {
            data = data || {};
            commit('setLabels', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getModules: function getModules(_ref2) {
        var state = _ref2.state,
            commit = _ref2.commit;
        return new Promise(function (resolve, reject) {
          if (state.modules) return resolve(state.modules);
          Vue.prototype.$meta.api.post('/a/base/base/modules').then(function (data) {
            data = data || {};
            commit('setModules', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getAtomClasses: function getAtomClasses(_ref3) {
        var state = _ref3.state,
            commit = _ref3.commit;
        return new Promise(function (resolve, reject) {
          if (state.atomClasses) return resolve(state.atomClasses);
          Vue.prototype.$meta.api.post('/a/base/base/atomClasses').then(function (data) {
            data = data || {};
            commit('setAtomClasses', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getActions: function getActions(_ref4) {
        var state = _ref4.state,
            commit = _ref4.commit;
        return new Promise(function (resolve, reject) {
          if (state.actions) return resolve(state.actions);
          Vue.prototype.$meta.api.post('/a/base/base/actions').then(function (data) {
            data = data || {};
            commit('setActions', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getFlags: function getFlags(_ref5) {
        var state = _ref5.state,
            commit = _ref5.commit;
        return new Promise(function (resolve, reject) {
          if (state.flags) return resolve(state.flags);
          Vue.prototype.$meta.api.post('/a/base/base/flags').then(function (data) {
            data = data || {};
            commit('setFlags', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getOrders: function getOrders(_ref6) {
        var state = _ref6.state,
            commit = _ref6.commit;
        return new Promise(function (resolve, reject) {
          if (state.orders) return resolve(state.orders);
          Vue.prototype.$meta.api.post('/a/base/base/orders').then(function (data) {
            data = data || {};
            commit('setOrders', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getMenus: function getMenus(_ref7) {
        var state = _ref7.state,
            commit = _ref7.commit;
        return new Promise(function (resolve, reject) {
          if (state.menus) return resolve(state.menus);
          Vue.prototype.$meta.api.post('/a/base/base/menus').then(function (data) {
            data = data || {};
            commit('setMenus', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      },
      getFunctions: function getFunctions(_ref8) {
        var state = _ref8.state,
            commit = _ref8.commit;
        return new Promise(function (resolve, reject) {
          if (state.functions) return resolve(state.functions);
          Vue.prototype.$meta.api.post('/a/base/base/functions').then(function (data) {
            data = data || {};
            commit('setFunctions', data);
            resolve(data);
          })["catch"](function (err) {
            reject(err);
          });
        });
      }
    }
  };
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  menu: {
    scene: {
      0: 'Default',
      1: 'Create',
      2: 'List',
      20: 'Statistics',
      50: 'Tools'
    }
  }
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(19)["default"]
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  Scenes: '场景',
  Modules: '模块',
  Stars: '星标',
  Star: '星标',
  Unstar: '取消星标',
  Close: '关闭',
  Create: '新建',
  Others: '其他',
  List: '列表',
  Tools: '工具',
  Draft: '草稿',
  Drafts: '草稿',
  Labels: '标签',
  Submit: '提交',
  Edit: '编辑',
  View: '查看',
  Save: '保存',
  Delete: '删除',
  Red: '红色',
  Orange: '橘色',
  Yellow: '黄色',
  Blue: '蓝色',
  Green: '绿色',
  Purple: '紫色',
  Label: '标签',
  Comment: '评论',
  Username: '用户名',
  Realname: '真实姓名',
  Email: '电子邮箱',
  Mobile: '手机号',
  Motto: '箴言',
  Locale: '本地化',
  Search: '搜索',
  Link: '链接',
  'Atom Flag': '原子标记',
  'Atom Name': '原子名称',
  'Modification Time': '修改时间',
  'Comment List': '评论列表',
  'Created Time': '创建时间',
  'Search Menu': '搜索菜单',
  'Search Atom': '搜索原子',
  'Search Result': '搜索结果',
  'Select Atom Class': '选择原子类型',
  'Select Menu': '选择菜单',
  'Select Function': '选择功能',
  'Atom Class': '原子类型',
  'Allow Comment': '允许评论',
  'Attachment List': '附件列表',
  'Flag Not Found': 'Flag未发现',
  'Friendly Tips': '友情提示',
  'Please sign in': '请登录'
});

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/search.vue?vue&type=template&id=0adb8ab2&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.pageTitle,"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-button',{ref:"buttonSubmit",attrs:{"iconMaterial":"search","onPerform":_vm.onPerformSearch}})],1)],1),_vm._v(" "),_c('eb-list',{attrs:{"form":"","no-hairlines-md":""},on:{"submit":function($event){$event.preventDefault();return _vm.onFormSubmit($event)}}},[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Atom Name')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Atom Name'),"clear-button":""},model:{value:(_vm.atomName),callback:function ($$v) {_vm.atomName=$$v},expression:"atomName"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"smartSelect":"","title":_vm.$text('Label'),"smartSelectParams":{openIn: 'page', closeOnSelect: true}}},[_c('eb-select',{attrs:{"name":"label","options":_vm.labels},model:{value:(_vm.label),callback:function ($$v) {_vm.label=$$v},expression:"label"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"divider":""}}),_vm._v(" "),(!_vm.atomClassInit)?_c('f7-list-item',{attrs:{"title":_vm.$text('Atom Class'),"link":"#"},on:{"click":_vm.onSelectAtomClass}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.atomClassTitle))])]):_vm._e()],1),_vm._v(" "),(_vm.item && _vm.validateParams)?_c('eb-validate',{ref:"validate",attrs:{"auto":"","data":_vm.item,"params":_vm.validateParams}}):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/search.vue?vue&type=template&id=0adb8ab2&scoped=true&

// EXTERNAL MODULE: ./front/src/common/atomClasses.js
var atomClasses = __webpack_require__(2);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/search.vue?vue&type=script&lang=js&

/* harmony default export */ var searchvue_type_script_lang_js_ = ({
  mixins: [atomClasses["a" /* default */]],
  data: function data() {
    var query = this.$f7route.query;
    var module = query && query.module;
    var atomClassName = query && query.atomClassName;
    var atomClass = module && atomClassName ? {
      module: module,
      atomClassName: atomClassName
    } : null;
    var where = query && query.where ? JSON.parse(query.where) : null;
    return {
      atomName: '',
      label: 0,
      atomClass: atomClass,
      where: where,
      item: null,
      validateParams: null,
      atomClassInit: atomClass
    };
  },
  computed: {
    pageTitle: function pageTitle() {
      var atomClassTitle = this.atomClassTitle || this.$text('Atom');
      return "".concat(this.$text('Search'), " ").concat(atomClassTitle);
    },
    labels: function labels() {
      var labelsAll = this.$local.getters('userLabels');
      if (!labelsAll) return null;
      var labels = [{
        title: '',
        value: 0
      }];

      for (var key in labelsAll) {
        labels.push({
          title: labelsAll[key].text,
          value: key
        });
      }

      return labels;
    },
    atomClassTitle: function atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;

      var _atomClass = this.getAtomClass(this.atomClass);

      if (!_atomClass) return '';
      return _atomClass.titleLocale;
    }
  },
  watch: {
    atomClass: function atomClass(value) {
      this.atomClassChanged();
    }
  },
  created: function created() {
    this.$local.dispatch('getLabels');
    this.atomClassChanged();
  },
  methods: {
    onFormSubmit: function onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    atomClassChanged: function atomClassChanged() {
      var _this = this;

      var atomClass = this.atomClass;

      if (!atomClass) {
        this.item = null;
        this.validateParams = null;
      } else {
        this.$meta.module.use(atomClass.module, function () {
          _this.$api.post('atomClass/validatorSearch', {
            atomClass: {
              module: atomClass.module,
              atomClassName: atomClass.atomClassName
            }
          }).then(function (data) {
            _this.item = {};
            _this.validateParams = {
              module: data.module,
              validator: data.validator
            };
          });
        });
      }
    },
    onSelectAtomClass: function onSelectAtomClass() {
      var _this2 = this;

      this.$view.navigate('/a/base/atom/selectAtomClass', {
        target: '_self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true
          },
          callback: function callback(code, data) {
            if (code === 200) {
              _this2.atomClass = data;
            }
          }
        }
      });
    },
    onPerformSearch: function onPerformSearch() {
      var atomClassExtra;

      if (this.item) {
        atomClassExtra = {};

        for (var key in this.item) {
          var value = this.item[key];

          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
              atomClassExtra["f.".concat(key)] = {
                val: value,
                op: 'like'
              };
            } else {
              atomClassExtra["f.".concat(key)] = value;
            }
          }
        }
      }

      this.$view.navigate('/a/base/atom/searchResult', {
        target: '_self',
        context: {
          params: {
            atomName: this.atomName,
            label: this.label,
            atomClass: this.atomClass,
            where: this.where,
            atomClassExtra: atomClassExtra
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/search.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/search.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_searchvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "0adb8ab2",
  null
  
)

/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/comment/list.vue?vue&type=template&id=ec206d78&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Comment List'),"eb-back-link":"Back"}},[_c('f7-nav-right',[(!_vm.user.anonymous)?_c('eb-link',{attrs:{"iconMaterial":"add","eb-href":("comment/item?atomId=" + _vm.atomId + "&commentId=0&replyId=0")}}):_vm._e(),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":_vm.order==='desc'?'arrow_downward':'arrow_upward',"onPerform":_vm.onPerformSort}})],1)],1),_vm._v(" "),(_vm.moduleStyle)?_vm._l((_vm.items),function(item){return _c('f7-card',{key:item.id,staticClass:"comment"},[_c('f7-card-header',[_c('div',{staticClass:"title"},[_c('img',{staticClass:"avatar avatar32",attrs:{"src":_vm.$meta.util.combineImageUrl(item.avatar,32)}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.userName))]),_vm._v(" "),_c('div',{staticClass:"date"},[_vm._v("#"+_vm._s(item.sorting)+" · "+_vm._s(_vm.$meta.util.formatDateTimeRelative(item.createdAt)))])]),_vm._v(" "),_c('div',{staticClass:"actions"},[(item.userId===_vm.user.id)?_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":"edit","eb-href":("comment/item?atomId=" + _vm.atomId + "&commentId=" + (item.id) + "&replyId=0")}}):_vm._e(),_vm._v(" "),(item.userId===_vm.user.id)?_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":"delete_forever","context":item,"onPerform":_vm.onPerformDelete}}):_vm._e(),_vm._v(" "),_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":item.heart?'favorite':'favorite_border',"context":item,"onPerform":_vm.onPerformHeart}},[_vm._v(_vm._s(item.heartCount))]),_vm._v(" "),(!_vm.user.anonymous)?_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":"reply","eb-href":("comment/item?atomId=" + _vm.atomId + "&commentId=0&replyId=" + (item.id))}}):_vm._e()],1)]),_vm._v(" "),_c('f7-card-content',{staticClass:"markdown-body",attrs:{"padding":""},domProps:{"innerHTML":_vm._s(item.html)}})],1)}):_vm._e(),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":true}})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/comment/list.vue?vue&type=template&id=ec206d78&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/comment/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      order: 'desc',
      items: [],
      moduleStyle: null
    };
  },
  computed: {
    user: function user() {
      return this.$store.state.auth.user.op;
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use(this.$meta.config.markdown.style.module, function (module) {
      _this.moduleStyle = module;
    });
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('comment:action', this.onCommentChanged);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('comment:action', this.onCommentChanged);
  },
  methods: {
    onRefresh: function onRefresh(event, done) {
      done();
      this.reload();
    },
    onInfinite: function onInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this2 = this;

      var index = _ref.index;
      var options = {
        orders: [['updatedAt', this.order]],
        page: {
          index: index
        }
      };
      return this.$api.post('comment/list', {
        key: {
          atomId: this.atomId
        },
        options: options
      }).then(function (data) {
        _this2.items = _this2.items.concat(data.list);
        return data;
      });
    },
    reload: function reload() {
      this.$refs.loadMore.reload();
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('comment/delete', {
          key: {
            atomId: _this3.atomId
          },
          data: {
            commentId: item.id
          }
        }).then(function (data) {
          _this3.$meta.eventHub.$emit('comment:action', data);

          return true;
        });
      });
    },
    onPerformHeart: function onPerformHeart(event, item) {
      var _this4 = this;

      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(function () {
          _this4.$meta.vueLayout.openLogin();
        });
        return;
      }

      return this.$api.post('comment/heart', {
        key: {
          atomId: this.atomId
        },
        data: {
          commentId: item.id,
          heart: item.heart ? 0 : 1
        }
      }).then(function (data) {
        _this4.$meta.eventHub.$emit('comment:action', data);
      });
    },
    onCommentChanged: function onCommentChanged(data) {
      var _this5 = this;

      var action = data.action;
      var atomId = data.atomId;
      var commentId = data.commentId;
      if (atomId !== this.atomId) return;

      if (action === 'create') {
        this.reload();
        return;
      }

      var index = this.items.findIndex(function (item) {
        return item.id === commentId;
      });

      if (action === 'delete') {
        if (index !== -1) {
          this.items.splice(index, 1);
        }

        return;
      }

      if (index !== -1) {
        this.$api.post('comment/item', {
          key: {
            atomId: this.atomId
          },
          data: {
            commentId: commentId
          }
        }).then(function (data) {
          external_vue_default.a.set(_this5.items, index, data);
        });
      }
    },
    onPerformSort: function onPerformSort() {
      this.order = this.order === 'desc' ? 'asc' : 'desc';
      this.reload();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/comment/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var comment_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/comment/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  comment_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/search.vue?vue&type=template&id=6c12ddf4&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-search-page',{attrs:{"title":_vm.$text('Search Menu')}},[_c('menus',{attrs:{"slot":"list","mode":"search"},slot:"list"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menu/search.vue?vue&type=template&id=6c12ddf4&

// EXTERNAL MODULE: ./front/src/components/menu/list.vue + 4 modules
var list = __webpack_require__(6);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/search.vue?vue&type=script&lang=js&

/* harmony default export */ var searchvue_type_script_lang_js_ = ({
  components: {
    menus: list["a" /* default */]
  }
});
// CONCATENATED MODULE: ./front/src/pages/menu/search.vue?vue&type=script&lang=js&
 /* harmony default export */ var menu_searchvue_type_script_lang_js_ = (searchvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menu/search.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_searchvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/attachment/list.vue?vue&type=template&id=057e7f83&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Attachment List'),"eb-back-link":"Back"}},[_c('f7-nav-right',[(_vm.findAction('write'))?_c('eb-link',{attrs:{"iconMaterial":"add","onPerform":_vm.onPerformAdd}}):_vm._e()],1)],1),_vm._v(" "),_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,staticClass:"item",attrs:{"title":item.realName,"link":"#","context":item,"onPerform":_vm.onItemClick,"swipeout":item.userId===_vm.user.id}},[_c('div',{attrs:{"slot":"media"},slot:"media"},[_c('img',{staticClass:"avatar avatar32",attrs:{"src":_vm.$meta.util.combineImageUrl(item.avatar,32)}})]),_vm._v(" "),_c('div',{staticClass:"header",attrs:{"slot":"root-start"},slot:"root-start"},[_c('div',{staticClass:"userName"},[_c('span',[_vm._v(_vm._s(item.userName))])]),_vm._v(" "),_c('div',{staticClass:"date"},[_vm._v(_vm._s(_vm.$meta.util.formatDateTimeRelative(item.createdAt)))])]),_vm._v(" "),(item.userId===_vm.user.id)?_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"color":"orange","context":item,"onPerform":_vm.onPerformDelete}},[_vm._v(_vm._s(_vm.$text('Delete')))])])]):_vm._e()],1)}),1),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":true}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/attachment/list.vue?vue&type=template&id=057e7f83&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/attachment/list.vue?vue&type=script&lang=js&

/* harmony default export */ var listvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      actions: null,
      items: []
    };
  },
  computed: {
    user: function user() {
      return this.$store.state.auth.user.op;
    }
  },
  created: function created() {
    this.fetchActions();
  },
  methods: {
    onRefresh: function onRefresh(event, done) {
      done();
      this.reload();
    },
    onInfinite: function onInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this = this;

      var index = _ref.index;
      var options = {
        where: {
          mode: 2,
          attachment: 1
        },
        orders: [['createdAt', 'asc']],
        page: {
          index: index
        }
      };
      return this.$api.post('/a/file/file/list', {
        key: {
          atomId: this.atomId
        },
        options: options
      }).then(function (data) {
        _this.items = _this.items.concat(data.list);
        return data;
      });
    },
    reload: function reload() {
      this.$refs.loadMore.reload();
    },
    fetchActions: function fetchActions() {
      var _this2 = this;

      this.$api.post('atom/actions', {
        key: {
          atomId: this.atomId
        }
      }).then(function (data) {
        _this2.actions = data;
      });
    },
    findAction: function findAction(actionName) {
      if (!this.actions) return null;
      return this.actions.find(function (item) {
        return item.name === actionName;
      });
    },
    onPerformAdd: function onPerformAdd() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: 2,
              atomId: _this3.atomId,
              attachment: 1
            },
            callback: function callback(code, data) {
              if (code === 200) {
                _this3.$meta.eventHub.$emit('attachment:action', {
                  action: 'create',
                  atomId: _this3.atomId
                });

                _this3.reload();

                resolve();
              }

              if (code === false) {
                reject();
              }
            }
          }
        });
      });
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this4 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this4.$api.post('/a/file/file/delete', {
          key: {
            atomId: _this4.atomId
          },
          data: {
            fileId: item.id
          }
        }).then(function () {
          _this4.$meta.util.swipeoutClose(event.target);

          _this4.$meta.eventHub.$emit('attachment:action', {
            action: 'delete',
            atomId: _this4.atomId,
            fileId: item.id
          });

          _this4.deleteItem(item.id);
        });
      });
    },
    deleteItem: function deleteItem(fileId) {
      var index = this.items.findIndex(function (item) {
        return item.id === fileId;
      });

      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },
    onItemClick: function onItemClick(event, item) {
      window.open(item.downloadUrl);
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/attachment/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var attachment_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/attachment/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  attachment_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/labels.vue?vue&type=template&id=3291d312&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Labels'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"add"},on:{"click":function($event){$event.preventDefault();return _vm.onAddLabel($event)}}})],1)],1),_vm._v(" "),(_vm.labelsAll)?_c('f7-list',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.item?_vm.item.atomName:''}}),_vm._v(" "),_vm._l((Object.keys(_vm.labelsAll)),function(key){return _c('eb-list-item',{key:key,attrs:{"title":_vm.labelsAll[key].text,"checkbox":"","checked":_vm.labelChecked(key),"swipeout":""},on:{"change":function($event){return _vm.onLabelCheckChange($event,key)}}},[_c('div',{staticClass:"media",style:({backgroundColor:_vm.labelsAll[key].color}),attrs:{"slot":"media"},slot:"media"}),_vm._v(" "),_c('eb-context-menu',[_c('div',{attrs:{"slot":"right"},slot:"right"},[_c('div',{attrs:{"close":"","color":"orange","context":key,"onPerform":_vm.onEditLabel}},[_vm._v(_vm._s(_vm.$text('Edit')))])])])],1)})],2):_vm._e(),_vm._v(" "),_c('f7-sheet',{ref:"ebSheet",attrs:{"fill":"","opened":_vm.sheetOpened},on:{"sheet:closed":function($event){_vm.sheetOpened = false}}},[_c('f7-toolbar',[_c('div',{staticClass:"left"},[_c('f7-link',{attrs:{"sheet-close":""}},[_vm._v(_vm._s(_vm.$text('Close')))])],1),_vm._v(" "),_c('div',{staticClass:"right"},[_c('eb-button',{ref:"buttonSubmit",attrs:{"onPerform":_vm.onSubmit}},[_vm._v(_vm._s(_vm.$text('Submit')))])],1)]),_vm._v(" "),_c('f7-page-content',[_c('div',{staticClass:"label"},[_c('f7-badge',{style:({backgroundColor:_vm.labelColor})},[_vm._v(_vm._s(_vm.labelText))])],1),_vm._v(" "),_c('eb-list',{attrs:{"form":"","no-hairlines-md":""},on:{"submit":function($event){$event.preventDefault();return _vm.onFormSubmit($event)}}},[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Text')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Text'),"clear-button":""},model:{value:(_vm.labelText),callback:function ($$v) {_vm.labelText=$$v},expression:"labelText"}})],1)],1),_vm._v(" "),_c('f7-block',[_c('div',{staticClass:"row colors"},_vm._l((_vm.colors),function(color){return _c('f7-button',{key:color.value,staticClass:"col-33",style:({backgroundColor:color.value}),attrs:{"small":"","fill":""},on:{"click":function($event){return _vm.onColorSelect(color)}}},[_vm._v(_vm._s(_vm.$text(color.name)))])}),1)])],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/labels.vue?vue&type=template&id=3291d312&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/labels.vue?vue&type=script&lang=js&
/* harmony default export */ var labelsvue_type_script_lang_js_ = ({
  data: function data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      item: null,
      labels: [],
      sheetOpened: false,
      labelId: 0,
      labelText: '',
      labelColor: '',
      colors: [{
        name: 'Red',
        value: '#FC6360'
      }, {
        name: 'Orange',
        value: '#FDA951'
      }, {
        name: 'Yellow',
        value: '#FED558'
      }, {
        name: 'Blue',
        value: '#54BEF7'
      }, {
        name: 'Green',
        value: '#86DF6A'
      }, {
        name: 'Purple',
        value: '#D592E5'
      }]
    };
  },
  computed: {
    labelsAll: function labelsAll() {
      return this.$local.getters('userLabels');
    }
  },
  methods: {
    onAddLabel: function onAddLabel() {
      this.labelId = 0;
      this.labelText = '';
      this.labelColor = '';
      this.sheetOpened = true;
    },
    onEditLabel: function onEditLabel(event, key) {
      this.labelId = key;
      this.labelText = this.labelsAll[key].text;
      this.labelColor = this.labelsAll[key].color;
      this.sheetOpened = true;
    },
    onFormSubmit: function onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onSubmit: function onSubmit() {
      var _this = this;

      if (!this.labelText || !this.labelColor) return;
      var labels = this.$utils.extend({}, this.labelsAll);

      if (this.labelId === 0) {
        labels[this.newLabelId()] = {
          text: this.labelText,
          color: this.labelColor
        };
      } else {
        labels[this.labelId] = {
          text: this.labelText,
          color: this.labelColor
        };
      }

      return this.$api.post('user/setLabels', {
        labels: labels
      }).then(function () {
        _this.$local.commit('setLabels', labels);

        _this.sheetOpened = false;
      });
    },
    onColorSelect: function onColorSelect(color) {
      this.labelColor = color.value;
    },
    newLabelId: function newLabelId() {
      var keys = Object.keys(this.labelsAll);
      if (keys.length === 0) return 1;
      keys.sort(function (a, b) {
        return b - a;
      });
      return parseInt(keys[0]) + 1;
    },
    labelChecked: function labelChecked(key) {
      return this.labels && this.labels.indexOf(key) > -1;
    },
    onLabelCheckChange: function onLabelCheckChange(event, key) {
      var _this2 = this;

      var index = this.labels.indexOf(key);

      if (event.target.checked && index === -1) {
        this.labels.push(key);
      } else if (!event.target.checked && index > -1) {
        this.labels.splice(index, 1);
      }

      this.labels.sort(function (a, b) {
        return a - b;
      });
      this.$api.post('atom/labels', {
        key: {
          atomId: this.atomId
        },
        atom: {
          labels: this.labels
        }
      }).then(function () {
        _this2.$meta.eventHub.$emit('atom:labels', {
          key: {
            atomId: _this2.atomId
          },
          labels: _this2.labels
        });
      });
    }
  },
  created: function created() {
    var _this3 = this;

    this.$local.dispatch('getLabels');
    this.$api.post('atom/read', {
      key: {
        atomId: this.atomId
      }
    }).then(function (data) {
      _this3.item = data;
      _this3.labels = JSON.parse(_this3.item.labels) || [];
    });
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/labels.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_labelsvue_type_script_lang_js_ = (labelsvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./front/src/pages/atom/labels.vue?vue&type=style&index=0&id=3291d312&scoped=true&lang=css&
var labelsvue_type_style_index_0_id_3291d312_scoped_true_lang_css_ = __webpack_require__(15);

// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/labels.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_labelsvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "3291d312",
  null
  
)

/* harmony default export */ var labels = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/edit.vue?vue&type=template&id=b93853f4&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('item',{attrs:{"query":_vm.query,"mode":"edit"}})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/edit.vue?vue&type=template&id=b93853f4&scoped=true&

// EXTERNAL MODULE: ./front/src/components/atom/item.vue + 4 modules
var item = __webpack_require__(7);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/edit.vue?vue&type=script&lang=js&

/* harmony default export */ var editvue_type_script_lang_js_ = ({
  meta: {
    size: 'middle'
  },
  components: {
    item: item["a" /* default */]
  },
  data: function data() {
    return {
      query: this.$f7route.query
    };
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/edit.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_editvue_type_script_lang_js_ = (editvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/edit.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_editvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "b93853f4",
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/list.vue?vue&type=template&id=5ad40b9e&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.pageTitle,"eb-back-link":"Back"}},[_c('f7-nav-right',[(_vm.showPopover)?_c('f7-link',{attrs:{"iconMaterial":"add","popover-open":("#" + _vm.popoverId)}}):_vm._e(),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"search","onPerform":_vm.onPerformSearch}}),_vm._v(" "),_c('eb-link',{attrs:{"iconMaterial":"sort","onPerform":_vm.onPerformAtomOrders}})],1),_vm._v(" "),_c('f7-subnavbar',[_c('f7-toolbar',{attrs:{"tabbar":"","scrollable":_vm.labels && Object.keys(_vm.labels).length>1}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdList),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('List')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdDrafts)}},[_vm._v(_vm._s(_vm.$text('Drafts')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdStars)}},[_vm._v(_vm._s(_vm.$text('Stars')))]),_vm._v(" "),(_vm.labels)?_vm._l((Object.keys(_vm.labels)),function(key){return _c('f7-link',{key:key,attrs:{"tab-link":("#" + _vm.tabIdLabels + "_" + key)}},[_vm._v(_vm._s(_vm.labels[key].text))])}):_vm._e()],2)],1)],1),_vm._v(" "),_c('f7-tabs',{ref:"tabs"},[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdList,"tab-active":"","data-ref":"list"}},[_c('atoms',{ref:"list",attrs:{"slot":"list","mode":"list","atomClass":_vm.atomClass,"where":_vm.whereForList},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdDrafts,"data-ref":"drafts"}},[_c('atoms',{ref:"drafts",attrs:{"slot":"list","mode":"drafts","atomClass":_vm.atomClass,"where":_vm.where},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdStars,"data-ref":"stars"}},[_c('atoms',{ref:"stars",attrs:{"slot":"list","mode":"stars","atomClass":_vm.atomClass,"where":_vm.where},slot:"list"})],1),_vm._v(" "),(_vm.labels)?_vm._l((Object.keys(_vm.labels)),function(key){return _c('eb-tab-page-content',{key:key,attrs:{"id":(_vm.tabIdLabels + "_" + key),"data-ref":("labels-" + key)}},[_c('atoms',{ref:("labels-" + key),refInFor:true,attrs:{"slot":"list","mode":("labels-" + key),"atomClass":_vm.atomClass,"where":_vm.where},slot:"list"})],1)}):_vm._e()],2),_vm._v(" "),_c('f7-popover',{attrs:{"id":_vm.popoverId}},[(_vm.showPopover)?_c('f7-list',{attrs:{"inset":""}},_vm._l((_vm.actions),function(action){return _c('eb-list-button',{key:action.id,attrs:{"popover-close":"","context":action,"onPerform":_vm.onAction}},[_vm._v(_vm._s(action.titleLocale))])}),1):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/list.vue?vue&type=template&id=5ad40b9e&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var list = __webpack_require__(4);

// EXTERNAL MODULE: ./front/src/common/atomClasses.js
var atomClasses = __webpack_require__(2);

// EXTERNAL MODULE: ./front/src/common/atomActions.js
var atomActions = __webpack_require__(3);

// EXTERNAL MODULE: ./front/src/common/menus.js
var menus = __webpack_require__(5);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/list.vue?vue&type=script&lang=js&





/* harmony default export */ var listvue_type_script_lang_js_ = ({
  mixins: [atomClasses["a" /* default */], atomActions["a" /* default */], menus["a" /* default */]],
  components: {
    atoms: list["a" /* default */]
  },
  data: function data() {
    var query = this.$f7route.query;
    var module = query && query.module;
    var atomClassName = query && query.atomClassName;
    var atomClass = module && atomClassName ? {
      module: module,
      atomClassName: atomClassName
    } : null;
    var where = query && query.where ? JSON.parse(query.where) : null;
    var scene = query && query.scene;
    return {
      atomClass: atomClass,
      where: where,
      scene: scene,
      tabIdList: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdDrafts: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdStars: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdLabels: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      popoverId: external_vue_default.a.prototype.$meta.util.nextId('popover'),
      actions: null
    };
  },
  computed: {
    labels: function labels() {
      return this.$local.getters('userLabels');
    },
    pageTitle: function pageTitle() {
      var atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) return this.$text('Atom');
      return "".concat(this.$text('Atom'), ": ").concat(atomClass.titleLocale);
    },
    showPopover: function showPopover() {
      return this.actions && this.actions.length > 0;
    },
    whereForList: function whereForList() {
      if (this.scene !== 'mine') return this.where;
      var where = this.where || {};
      var user = this.$store.state.auth.user.op;
      where['a.userIdCreated'] = user.id;
      return where;
    }
  },
  created: function created() {
    var _this = this;

    this.$local.dispatch('getLabels');
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

    this.$api.post('function/list', {
      options: options
    }).then(function (data) {
      _this.actions = data.list;
    });
  },
  methods: {
    onPerformSearch: function onPerformSearch() {
      var queries = {};
      var atomClass = this.atomClass;

      if (atomClass) {
        queries.module = atomClass.module;
        queries.atomClassName = atomClass.atomClassName;
      }

      if (this.where) {
        queries.where = JSON.stringify(this.where);
      }

      var url = this.$meta.util.combineQueries('/a/base/atom/search', queries);
      this.$view.navigate(url, {
        target: '_self'
      });
    },
    onAction: function onAction(event, item) {
      var _menu = this.getMenu(item);

      if (!_menu) return;

      if (_menu.action === 'create') {
        item = {
          atomClassId: item.atomClassId,
          module: item.module,
          atomClassName: item.atomClassName,
          atomClassIdParent: item.atomClassIdParent
        };
      }

      return this.$meta.util.performAction({
        ctx: this,
        action: _menu,
        item: item
      });
    },
    onPerformAtomOrders: function onPerformAtomOrders(event) {
      var tab = this.$$(this.$refs.tabs.$el).find('.tab-active');
      var tabRef = this.$refs[tab.data('ref')];
      if (Array.isArray(tabRef)) tabRef = tabRef[0];
      tabRef.openPopoverForAtomOrders(event.currentTarget);
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var atom_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/searchResult.vue?vue&type=template&id=5e7a1891&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Search Result'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"sort","onPerform":_vm.onPerformAtomOrders}})],1)],1),_vm._v(" "),_c('atoms',{ref:"list",attrs:{"mode":"search","params":_vm.params,"atomClass":_vm.atomClass,"where":_vm.where}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/searchResult.vue?vue&type=template&id=5e7a1891&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var list = __webpack_require__(4);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/searchResult.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var searchResultvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  components: {
    atoms: list["a" /* default */]
  },
  data: function data() {
    return {};
  },
  computed: {
    params: function params() {
      return this.contextParams;
    },
    atomClass: function atomClass() {
      return this.contextParams.atomClass;
    },
    where: function where() {
      return this.contextParams.where;
    }
  },
  methods: {
    onRefresh: function onRefresh(event, done) {
      done();
      this.$refs.list.reload();
    },
    onInfinite: function onInfinite() {
      this.$refs.list.loadMore();
    },
    onPerformAtomOrders: function onPerformAtomOrders(event) {
      this.$refs.list.openPopoverForAtomOrders(event.currentTarget);
    }
  },
  mounted: function mounted() {
    this.$refs.list.reload(true);
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/searchResult.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_searchResultvue_type_script_lang_js_ = (searchResultvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/searchResult.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_searchResultvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var searchResult = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/selectFunction.vue?vue&type=template&id=4ec594ea&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text(_vm.menu===1?'Select Menu':'Select Function'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',_vm._l((_vm.functions),function(item,index){return _c('f7-list-item',{key:index,attrs:{"radio":"","checked":_vm.name===item.name,"title":item.title},on:{"click":function($event){return _vm.onItemClick(item)}}})}),1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menu/selectFunction.vue?vue&type=template&id=4ec594ea&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/selectFunction.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectFunctionvue_type_script_lang_js_ = ({
  mixins: [ebPageContext],
  data: function data() {
    return {};
  },
  computed: {
    module: function module() {
      return this.contextParams.module;
    },
    name: function name() {
      return this.contextParams.name;
    },
    menu: function menu() {
      return this.contextParams.menu;
    },
    optional: function optional() {
      return this.contextParams.optional;
    },
    functions: function functions() {
      var functionsAll = this.$local.state.functions;
      if (!functionsAll) return [];
      var functions = [];

      if (this.optional) {
        functions.push({
          title: null,
          name: null
        });
      }

      for (var name in functionsAll[this.module]) {
        var func = functionsAll[this.module][name];

        if (func.menu === this.menu) {
          functions.push({
            title: func.titleLocale,
            name: name
          });
        }
      }

      return functions;
    }
  },
  created: function created() {
    this.$local.dispatch('getFunctions');
  },
  methods: {
    onItemClick: function onItemClick(item) {
      var data = item.name ? {
        module: this.module,
        name: item.name,
        title: item.title
      } : null;
      this.contextCallback(200, data);
      this.$f7router.back();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/menu/selectFunction.vue?vue&type=script&lang=js&
 /* harmony default export */ var menu_selectFunctionvue_type_script_lang_js_ = (selectFunctionvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menu/selectFunction.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_selectFunctionvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var selectFunction = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/selectAtomClass.vue?vue&type=template&id=209e6852&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select Atom Class'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',_vm._l((_vm.atomClasses),function(item,index){return _c('f7-list-item',{key:index,attrs:{"radio":"","checked":_vm.module===item.module && _vm.atomClassName===item.atomClassName,"title":item.title},on:{"click":function($event){return _vm.onItemClick(item)}}})}),1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/selectAtomClass.vue?vue&type=template&id=209e6852&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/common/atomClasses.js
var atomClasses = __webpack_require__(2);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/selectAtomClass.vue?vue&type=script&lang=js&

var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var selectAtomClassvue_type_script_lang_js_ = ({
  mixins: [ebPageContext, atomClasses["a" /* default */]],
  data: function data() {
    return {};
  },
  computed: {
    module: function module() {
      return this.contextParams.atomClass ? this.contextParams.atomClass.module : null;
    },
    atomClassName: function atomClassName() {
      return this.contextParams.atomClass ? this.contextParams.atomClass.atomClassName : null;
    },
    optional: function optional() {
      return this.contextParams.optional;
    },
    atomClasses: function atomClasses() {
      var atomClassesAll = this.atomClassesAll;
      if (!atomClassesAll) return [];
      var atomClasses = [];

      if (this.optional) {
        atomClasses.push({
          title: null,
          module: null,
          atomClassName: null
        });
      }

      for (var module in atomClassesAll) {
        for (var atomClassName in atomClassesAll[module]) {
          atomClasses.push({
            title: atomClassesAll[module][atomClassName].titleLocale,
            module: module,
            atomClassName: atomClassName
          });
        }
      }

      return atomClasses;
    }
  },
  methods: {
    onItemClick: function onItemClick(item) {
      var data = item.module ? {
        module: item.module,
        atomClassName: item.atomClassName,
        title: item.title
      } : null;
      this.contextCallback(200, data);
      this.$f7router.back();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/selectAtomClass.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_selectAtomClassvue_type_script_lang_js_ = (selectAtomClassvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/selectAtomClass.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_selectAtomClassvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var selectAtomClass = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/view.vue?vue&type=template&id=09fd04a6&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('item',{attrs:{"query":_vm.query,"mode":"view"}})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/view.vue?vue&type=template&id=09fd04a6&scoped=true&

// EXTERNAL MODULE: ./front/src/components/atom/item.vue + 4 modules
var item = __webpack_require__(7);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/view.vue?vue&type=script&lang=js&

/* harmony default export */ var viewvue_type_script_lang_js_ = ({
  meta: {
    size: 'middle'
  },
  components: {
    item: item["a" /* default */]
  },
  data: function data() {
    return {
      query: this.$f7route.query
    };
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/view.vue?vue&type=script&lang=js&
 /* harmony default export */ var atom_viewvue_type_script_lang_js_ = (viewvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/view.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_viewvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "09fd04a6",
  null
  
)

/* harmony default export */ var view = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/base/alert.vue?vue&type=template&id=009f5dc6&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.pageTitle,"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-card',[_c('f7-card-header',[_vm._v(_vm._s(_vm.data.title || _vm.$text('Friendly Tips')))]),_vm._v(" "),_c('f7-card-content',[_vm._v("\n      "+_vm._s(_vm.data.message)+"\n    ")]),_vm._v(" "),(_vm.data.link)?_c('f7-card-footer',[_c('div'),_vm._v(" "),_c('eb-link',{attrs:{"eb-href":_vm.data.link}},[_vm._v(_vm._s(_vm.data.linkText || _vm.$text('Link')))])],1):_vm._e()],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/base/alert.vue?vue&type=template&id=009f5dc6&scoped=true&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/base/alert.vue?vue&type=script&lang=js&
/* harmony default export */ var alertvue_type_script_lang_js_ = ({
  components: {},
  data: function data() {
    var data = JSON.parse(this.$f7route.query.data);
    return {
      data: data
    };
  },
  computed: {
    pageTitle: function pageTitle() {
      return this.$store.state.auth.instance.title;
    }
  },
  methods: {}
});
// CONCATENATED MODULE: ./front/src/pages/base/alert.vue?vue&type=script&lang=js&
 /* harmony default export */ var base_alertvue_type_script_lang_js_ = (alertvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/base/alert.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  base_alertvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "009f5dc6",
  null
  
)

/* harmony default export */ var base_alert = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/comment/all.vue?vue&type=template&id=776e27b9&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Comment List'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":_vm.order==='desc'?'arrow_downward':'arrow_upward',"onPerform":_vm.onPerformSort}})],1)],1),_vm._v(" "),(_vm.moduleStyle)?_vm._l((_vm.items),function(item){return _c('f7-card',{key:item.h_id,staticClass:"comment"},[_c('f7-card-header',[_c('div',{staticClass:"header-container"},[_c('div',{staticClass:"header-atom"},[_c('eb-link',{attrs:{"context":item,"onPerform":_vm.onPerformViewAtom}},[_vm._v(_vm._s(item.atomName))])],1),_vm._v(" "),_c('div',{staticClass:"header-comment"},[_c('div',{staticClass:"title"},[_c('img',{staticClass:"avatar avatar32",attrs:{"src":_vm.$meta.util.combineImageUrl(item.h_avatar,32)}}),_vm._v(" "),_c('div',{staticClass:"name"},[_vm._v(_vm._s(item.h_userName))]),_vm._v(" "),_c('div',{staticClass:"date"},[_vm._v("#"+_vm._s(item.h_sorting)+" · "+_vm._s(_vm.$meta.util.formatDateTimeRelative(item.h_createdAt)))])]),_vm._v(" "),_c('div',{staticClass:"actions"},[(item.h_userId===_vm.user.id)?_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":"edit","eb-href":("comment/item?atomId=" + (item.atomId) + "&commentId=" + (item.h_id) + "&replyId=0")}}):_vm._e(),_vm._v(" "),(item.h_userId===_vm.user.id)?_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":"delete_forever","context":item,"onPerform":_vm.onPerformDelete}}):_vm._e(),_vm._v(" "),_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":item.h_heart?'favorite':'favorite_border',"context":item,"onPerform":_vm.onPerformHeart}},[_vm._v(_vm._s(item.h_heartCount))]),_vm._v(" "),(!_vm.user.anonymous)?_c('eb-link',{staticClass:"action",attrs:{"iconMaterial":"reply","eb-href":("comment/item?atomId=" + (item.atomId) + "&commentId=0&replyId=" + (item.h_id))}}):_vm._e()],1)])])]),_vm._v(" "),_c('f7-card-content',{staticClass:"markdown-body",attrs:{"padding":""},domProps:{"innerHTML":_vm._s(item.h_html)}})],1)}):_vm._e(),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":true}})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/comment/all.vue?vue&type=template&id=776e27b9&

// EXTERNAL MODULE: ./front/src/common/atomActions.js
var atomActions = __webpack_require__(3);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/comment/all.vue?vue&type=script&lang=js&

/* harmony default export */ var allvue_type_script_lang_js_ = ({
  mixins: [atomActions["a" /* default */]],
  data: function data() {
    var query = this.$f7route.query;
    var where = query && query.where ? JSON.parse(query.where) : null;
    var scene = query && query.scene;

    if (scene === 'mine') {
      if (!where) where = {};
      var user = this.$store.state.auth.user.op;
      where['h.userId'] = user.id;
    }

    return {
      where: where,
      order: 'desc',
      items: [],
      moduleStyle: null
    };
  },
  computed: {
    user: function user() {
      return this.$store.state.auth.user.op;
    }
  },
  created: function created() {
    var _this = this;

    this.$meta.module.use(this.$meta.config.markdown.style.module, function (module) {
      _this.moduleStyle = module;
    });
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('comment:action', this.onCommentChanged);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('comment:action', this.onCommentChanged);
  },
  methods: {
    onRefresh: function onRefresh(event, done) {
      done();
      this.reload();
    },
    onInfinite: function onInfinite() {
      this.$refs.loadMore.loadMore();
    },
    onLoadClear: function onLoadClear(done) {
      this.items = [];
      done();
    },
    onLoadMore: function onLoadMore(_ref) {
      var _this2 = this;

      var index = _ref.index;
      var options = {
        orders: [['h_updatedAt', this.order]],
        page: {
          index: index
        }
      };

      if (this.where) {
        options.where = this.where;
      }

      return this.$api.post('comment/all', {
        options: options
      }).then(function (data) {
        _this2.items = _this2.items.concat(data.list);
        return data;
      });
    },
    reload: function reload() {
      this.$refs.loadMore.reload();
    },
    onPerformDelete: function onPerformDelete(event, item) {
      var _this3 = this;

      return this.$view.dialog.confirm().then(function () {
        return _this3.$api.post('comment/delete', {
          key: {
            atomId: item.atomId
          },
          data: {
            commentId: item.h_id
          }
        }).then(function (data) {
          _this3.$meta.eventHub.$emit('comment:action', data);

          return true;
        });
      });
    },
    onPerformHeart: function onPerformHeart(event, item) {
      var _this4 = this;

      if (this.user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please sign in')).then(function () {
          _this4.$meta.vueLayout.openLogin();
        });
        return;
      }

      return this.$api.post('comment/heart', {
        key: {
          atomId: item.atomId
        },
        data: {
          commentId: item.h_id,
          heart: item.h_heart ? 0 : 1
        }
      }).then(function (data) {
        _this4.$meta.eventHub.$emit('comment:action', data);
      });
    },
    onCommentChanged: function onCommentChanged(data) {
      var _this5 = this;

      var action = data.action;
      var atomId = data.atomId;
      var commentId = data.commentId;

      if (action === 'create') {
        this.reload();
        return;
      }

      var index = this.items.findIndex(function (item) {
        return item.h_id === commentId;
      });

      if (action === 'delete') {
        if (index !== -1) {
          this.items.splice(index, 1);
        }

        return;
      }

      if (index !== -1) {
        this.$api.post('comment/item', {
          key: {
            atomId: atomId
          },
          data: {
            commentId: commentId
          }
        }).then(function (data) {
          var _item = _this5.items[index];

          for (var _i = 0, _Object$keys = Object.keys(data); _i < _Object$keys.length; _i++) {
            var key = _Object$keys[_i];
            _item["h_".concat(key)] = data[key];
          }
        });
      }
    },
    onPerformSort: function onPerformSort() {
      this.order = this.order === 'desc' ? 'asc' : 'desc';
      this.reload();
    },
    onPerformViewAtom: function onPerformViewAtom(event, item) {
      var _action = this.getAction({
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'read'
      });

      if (!_action) return;
      return this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: item
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/comment/all.vue?vue&type=script&lang=js&
 /* harmony default export */ var comment_allvue_type_script_lang_js_ = (allvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/comment/all.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  comment_allvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var comment_all = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/comment/item.vue?vue&type=template&id=85dbd8dc&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Comment'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"save","onPerform":_vm.onPerformSave}})],1)],1),_vm._v(" "),(_vm.ready)?[_c('eb-box',[_c('mavon-editor',{ref:"editor",attrs:{"value":_vm.content,"onPreRender":_vm.onPreRender,"onImageUpload":_vm.onImageUpload,"language":_vm.language,"subfield":_vm.subfield,"editable":_vm.editable,"defaultOpen":_vm.defaultOpen,"toolbarsFlag":_vm.toolbarsFlag,"navigation":_vm.navigation,"toolbars":_vm.toolbars},on:{"change":_vm.onChange,"save":_vm.onSave}})],1)]:_vm._e()],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/comment/item.vue?vue&type=template&id=85dbd8dc&

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/comment/item.vue?vue&type=script&lang=js&
/* harmony default export */ var itemvue_type_script_lang_js_ = ({
  meta: {
    size: 'large'
  },
  data: function data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      commentId: parseInt(this.$f7route.query.commentId || 0),
      replyId: parseInt(this.$f7route.query.replyId || 0),
      module: null,
      comment: null,
      reply: null,
      content: ''
    };
  },
  computed: {
    ready: function ready() {
      return this.module && (this.commentId === 0 || this.comment) && (this.replyId === 0 || this.reply);
    },
    readOnly: function readOnly() {
      return false;
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
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        undo: true,
        redo: true,
        trash: true,
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
    this.loadComment(this.commentId);
    this.loadReply(this.replyId);
  },
  methods: {
    loadComment: function loadComment(commentId) {
      var _this2 = this;

      if (!commentId) return;
      this.$api.post('comment/item', {
        key: {
          atomId: this.atomId
        },
        data: {
          commentId: commentId
        }
      }).then(function (data) {
        _this2.comment = data;
        _this2.content = _this2.comment.content;
      });
    },
    loadReply: function loadReply(replyId) {
      var _this3 = this;

      if (!replyId) return;
      this.$api.post('comment/item', {
        key: {
          atomId: this.atomId
        },
        data: {
          commentId: replyId
        }
      }).then(function (data) {
        _this3.reply = data;
      });
    },
    onChange: function onChange(data) {
      this.content = data;
    },
    onSave: function onSave() {
      this.onPerformSave();
    },
    onPerformSave: function onPerformSave() {
      var _this4 = this;

      if (!this.content) return;
      return this.$api.post('/a/base/comment/save', {
        key: {
          atomId: this.atomId
        },
        data: {
          commentId: this.commentId,
          replyId: this.replyId,
          content: this.content
        }
      }).then(function (data) {
        _this4.$meta.eventHub.$emit('comment:action', data);

        _this4.$f7router.back();
      });
    },
    onImageUpload: function onImageUpload() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: 1,
              atomId: _this5.atomId,
              flag: 'comment'
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
    },
    onPreRender: function onPreRender(value) {
      if (this.comment) {
        return this.fullContent({
          content: value,
          replyContent: this.comment.replyContent,
          replyUserName: this.comment.replyUserName
        });
      }

      if (this.reply) {
        var replyContent = this.fullContent({
          content: this.reply.content,
          replyContent: this.reply.replyContent,
          replyUserName: this.reply.replyUserName
        });
        return this.fullContent({
          content: value,
          replyContent: replyContent,
          replyUserName: this.reply.userName
        });
      }

      return value;
    },
    fullContent: function fullContent(_ref) {
      var content = _ref.content,
          replyContent = _ref.replyContent,
          replyUserName = _ref.replyUserName;
      if (!replyContent) return content;
      return "".concat(content, "\n\n> `").concat(replyUserName, "`:\n> ").concat(replyContent, "\n");
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/comment/item.vue?vue&type=script&lang=js&
 /* harmony default export */ var comment_itemvue_type_script_lang_js_ = (itemvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/comment/item.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  comment_itemvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var item = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/list.vue?vue&type=template&id=9cd07680&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Home'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"search","eb-target":"_self","eb-href":"menu/search"}})],1),_vm._v(" "),_c('f7-subnavbar',[_c('f7-toolbar',{attrs:{"tabbar":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdScenes),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Scenes')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdModules)}},[_vm._v(_vm._s(_vm.$text('Modules')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdStars)}},[_vm._v(_vm._s(_vm.$text('Stars')))])],1)],1)],1),_vm._v(" "),_c('f7-tabs',[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdScenes,"tab-active":""}},[_c('menus',{attrs:{"slot":"list","mode":"scenes"},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdModules}},[_c('menus',{attrs:{"slot":"list","mode":"modules"},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdStars}},[_c('menus',{attrs:{"slot":"list","mode":"stars"},slot:"list"})],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menu/list.vue?vue&type=template&id=9cd07680&

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/menu/list.vue + 4 modules
var list = __webpack_require__(6);

// CONCATENATED MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/babel-loader/lib!/Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/list.vue?vue&type=script&lang=js&


/* harmony default export */ var listvue_type_script_lang_js_ = ({
  meta: {
    size: 'middle'
  },
  components: {
    menus: list["a" /* default */]
  },
  data: function data() {
    return {
      tabIdScenes: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdModules: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdStars: external_vue_default.a.prototype.$meta.util.nextId('tab')
    };
  }
});
// CONCATENATED MODULE: ./front/src/pages/menu/list.vue?vue&type=script&lang=js&
 /* harmony default export */ var menu_listvue_type_script_lang_js_ = (listvue_type_script_lang_js_); 
// EXTERNAL MODULE: /Users/wind/Documents/data/cabloy/egg-born-demo/node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menu/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_listvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var menu_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./front/src/components/menu/list.vue + 4 modules
var list = __webpack_require__(6);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var atom_list = __webpack_require__(4);

// EXTERNAL MODULE: ./front/src/components/atom/item.vue + 4 modules
var item = __webpack_require__(7);

// CONCATENATED MODULE: ./front/src/components/atom/action.js
/* harmony default export */ var action = ({
  meta: {
    global: false
  },
  methods: {
    onAction: function onAction(_ref) {
      var ctx = _ref.ctx,
          action = _ref.action,
          item = _ref.item;

      if (action.name === 'create' || action.action === 'create') {
        return ctx.$api.post('/a/base/atom/create', {
          atomClass: {
            id: item.atomClassId,
            module: item.module,
            atomClassName: item.atomClassName
          },
          item: item
        }).then(function (key) {
          ctx.$meta.eventHub.$emit('atom:action', {
            key: key,
            action: action
          });

          if (action.menu === 1 || action.actionComponent || action.actionPath) {
            item = ctx.$utils.extend({}, item, key);
            return ctx.$store.dispatch('a/base/getActions').then(function (actionsAll) {
              var actionWrite = actionsAll[item.module][item.atomClassName].write;
              actionWrite = ctx.$utils.extend({}, actionWrite);
              return ctx.$meta.util.performAction({
                ctx: ctx,
                action: actionWrite,
                item: item
              });
            });
          }

          return key;
        });
      } else if (action.name === 'delete') {
        var _key = {
          atomId: item.atomId,
          itemId: item.itemId
        };
        return ctx.$view.dialog.confirm().then(function () {
          return ctx.$api.post('/a/base/atom/delete', {
            key: _key
          }).then(function () {
            ctx.$meta.eventHub.$emit('atom:action', {
              key: _key,
              action: action
            });
            return true;
          });
        });
      } else if (action.name === 'save') {
        var _key2 = {
          atomId: item.atomId,
          itemId: item.itemId
        };
        return ctx.$api.post('/a/base/atom/write', {
          key: _key2,
          item: item
        }).then(function () {
          ctx.$meta.eventHub.$emit('atom:action', {
            key: _key2,
            action: action
          });
        });
      } else if (action.name === 'submit') {
        var _key3 = {
          atomId: item.atomId,
          itemId: item.itemId
        };
        return ctx.$view.dialog.confirm().then(function () {
          return ctx.$api.post('/a/base/atom/submit', {
            key: _key3,
            item: item
          }).then(function () {
            ctx.$meta.eventHub.$emit('atom:action', {
              key: _key3,
              action: action
            });
          });
        });
      }

      var key = {
        atomId: item.atomId,
        itemId: item.itemId
      };
      return ctx.$view.dialog.confirm().then(function () {
        return ctx.$api.post('/a/base/atom/action', {
          action: action.code,
          key: key
        }).then(function () {
          ctx.$meta.eventHub.$emit('atom:action', {
            key: key,
            action: action
          });
          return true;
        });
      });
    }
  }
});
// EXTERNAL MODULE: ./front/src/common/atomClasses.js
var atomClasses = __webpack_require__(2);

// EXTERNAL MODULE: ./front/src/common/atomActions.js
var atomActions = __webpack_require__(3);

// EXTERNAL MODULE: ./front/src/common/atomOrders.js
var atomOrders = __webpack_require__(9);

// EXTERNAL MODULE: ./front/src/common/modules.js
var modules = __webpack_require__(10);

// EXTERNAL MODULE: ./front/src/common/menus.js
var menus = __webpack_require__(5);

// CONCATENATED MODULE: ./front/src/common/functions.js
/* harmony default export */ var functions = ({
  meta: {
    component: false
  },
  computed: {
    functionsAll: function functionsAll() {
      return this.$store.getState('a/base/functions');
    }
  },
  methods: {
    getFunction: function getFunction(func) {
      if (!this.functionsAll || !func) return null;
      return this.functionsAll[func.module][func.name];
    },
    getFunctionTitle: function getFunctionTitle(func) {
      var _func = this.getFunction(func);

      return _func ? _func.titleLocale : null;
    }
  },
  created: function created() {
    this.$store.dispatch('a/base/getFunctions');
  }
});
// CONCATENATED MODULE: ./front/src/components.js










/* harmony default export */ var components = __webpack_exports__["default"] = ({
  menus: list["a" /* default */],
  item: item["a" /* default */],
  action: action,
  ebAtoms: atom_list["a" /* default */],
  ebAtomClasses: atomClasses["a" /* default */],
  ebAtomActions: atomActions["a" /* default */],
  ebAtomOrders: atomOrders["a" /* default */],
  ebModules: modules["a" /* default */],
  ebMenus: menus["a" /* default */],
  ebFunctions: functions
});

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
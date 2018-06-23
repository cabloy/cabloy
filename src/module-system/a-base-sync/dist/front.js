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
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
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

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/list.vue?vue&type=template&id=733f2dc8&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.atomId,staticClass:"item",attrs:{"link":_vm.itemShow?false:'#',"context":item,"onPerform":_vm.onItemClick,"swipeout":""},on:{"swipeout:opened":function($event){_vm.onSwipeoutOpened($event,item)}}},[_c('div',{staticClass:"header",attrs:{"slot":"root-start"},slot:"root-start"},[_c('div',{staticClass:"userName"},[_c('span',[_vm._v(_vm._s(item.userName))]),_vm._v(" "),_c('f7-icon',{staticClass:"star",attrs:{"color":"orange","material":item.star?'star':''}})],1),_vm._v(" "),(_vm.itemShow)?[_c('div',[(item.atomFlag>0)?_c('f7-badge',[_vm._v(_vm._s(_vm.getFlagTitle(item)))]):_vm._e(),_vm._v(" "),(item.labels && _vm.labels)?_vm._l((JSON.parse(item.labels)),function(label){return _c('f7-badge',{key:label,style:({backgroundColor:_vm.getLabel(label).color})},[_vm._v(_vm._s(_vm.getLabel(label).text))])}):_vm._e()],2)]:[_c('div',{staticClass:"date"},[_vm._v(_vm._s(_vm.$meta.util.formatDateTimeRelative(item.atomUpdatedAt)))])]],2),_vm._v(" "),_c('div',{staticClass:"title",attrs:{"slot":"title"},slot:"title"},[(_vm.itemShow)?[_c('div',{staticClass:"date"},[_c('div',[_vm._v(_vm._s(_vm.$text('Modification time')))]),_vm._v(" "),_c('div',[_vm._v(_vm._s(_vm.$text('Created time')))])])]:[_c('div',[_vm._v(_vm._s(item.atomName))])]],2),_vm._v(" "),_c('div',{staticClass:"after",attrs:{"slot":"after"},slot:"after"},[(_vm.itemShow)?[_c('div',{staticClass:"date"},[_vm._v(_vm._s(_vm.$meta.util.formatDateTime(item.atomUpdatedAt)))]),_vm._v(" "),_c('div',{staticClass:"date"},[_vm._v(_vm._s(_vm.$meta.util.formatDateTime(item.atomCreatedAt)))])]:[(item.atomFlag>0)?_c('f7-badge',[_vm._v(_vm._s(_vm.getFlagTitle(item)))]):_vm._e(),_vm._v(" "),(item.labels && _vm.labels)?_vm._l((JSON.parse(item.labels)),function(label){return _c('f7-badge',{key:label,style:({backgroundColor:_vm.getLabel(label).color})},[_vm._v(_vm._s(_vm.getLabel(label).text))])}):_vm._e()]],2),_vm._v(" "),_c('f7-swipeout-actions',{attrs:{"left":""}},[(_vm.mode==='stars')?[_c('eb-swipeout-button',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarOff}},[_vm._v(_vm._s(_vm.$text('Unstar')))])]:[_c('eb-swipeout-button',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarSwitch}},[_vm._v(_vm._s(item.star?_vm.$text('Unstar'):_vm.$text('Star')))])],_vm._v(" "),_c('eb-swipeout-button',{attrs:{"color":"yellow","context":item,"onPerform":_vm.onLabel}},[_vm._v(_vm._s(_vm.$text('Labels')))])],2),_vm._v(" "),(!_vm.itemShow)?_c('eb-swipeout-actions',{attrs:{"right":"","ready":item._actions}},[(item._actions)?_vm._l((item._actions),function(action,index){return _c('eb-swipeout-button',{key:action.id,attrs:{"color":_vm.getActionColor(action,index),"context":{item: item,action: action},"onPerform":_vm.onAction}},[_vm._v(_vm._s(_vm.getActionTitle(action)))])}):_vm._e()],2):_vm._e()],1)})),_vm._v(" "),(!_vm.itemShow)?_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}}):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atom/list.vue?vue&type=template&id=733f2dc8&scoped=true

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/list.vue?vue&type=script&lang=js



var ebActions = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebActions;
/* harmony default export */ var listvue_type_script_lang_js = ({
  mixins: [ebActions],
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
    }
  },
  data: function data() {
    return {
      items: this.itemShow ? [this.itemShow] : []
    };
  },

  computed: {
    labels: function labels() {
      return this.$local.state.labels;
    },
    flags: function flags() {
      return this.$local.state.flags;
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

      var options = void 0;
      if (this.mode === 'list') {
        options = {
          where: { 'a.atomEnabled': 1 },
          orders: [['a.updatedAt', 'desc']],
          page: { index: index }
        };
      } else if (this.mode === 'drafts') {
        options = {
          where: { 'a.atomEnabled': 0 },
          orders: [['a.updatedAt', 'desc']],
          page: { index: index }
        };
      } else if (this.mode === 'stars') {
        options = {
          orders: [['d.updatedAt', 'desc']],
          star: 1,
          page: { index: index }
        };
      } else if (this.mode.indexOf('labels') > -1) {
        options = {
          orders: [['e.updatedAt', 'desc']],
          label: this.mode.split('-')[1],
          page: { index: index }
        };
      } else if (this.mode === 'search') {
        var where = {};
        if (this.params.atomName) {
          where['a.atomName'] = { val: this.params.atomName, op: 'like' };
        }
        if (this.params.atomClassExtra) {
          this.$utils.extend(where, this.params.atomClassExtra);
        }

        options = {
          where: where,
          orders: [['a.updatedAt', 'desc']],
          page: { index: index }
        };

        if (this.params.label) {
          options.label = this.params.label;
        }
      }

      return this.$api.post('atom/select', {
        atomClass: this.atomClass,
        options: options
      }).then(function (data) {
        _this.items = data.list;
        return data;
      });
    },
    onStarSwitch: function onStarSwitch(event, item) {
      var _this2 = this;

      var key = {
        atomId: item.atomId,
        itemId: item.itemId
      };
      var star = item.star ? 0 : 1;
      return this.$api.post('atom/star', {
        key: key,
        atom: { star: star }
      }).then(function () {
        _this2.$meta.eventHub.$emit('atom:star', { key: key, star: star });
        _this2.$meta.util.swipeoutClose(event.target);
      });
    },
    onStarOff: function onStarOff(event, item) {
      var _this3 = this;

      var key = {
        atomId: item.atomId,
        itemId: item.itemId
      };
      return this.$api.post('atom/star', {
        key: key,
        atom: { star: 0 }
      }).then(function () {
        _this3.$meta.eventHub.$emit('atom:star', { key: key, star: 0 });
        _this3.$meta.util.swipeoutDelete(event.target);
      });
    },
    onLabel: function onLabel(event, item) {
      this.$meta.vueLayout.navigate('/a/base/atom/labels?atomId=' + item.atomId);
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
        if (this.mode === 'drafts') {
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
        key: { atomId: item.atomId },
        basic: true
      }).then(function (data) {
        external_vue_default.a.set(item, '_actions', data);
      });
    },
    onAction: function onAction(event, context) {
      var _this5 = this;

      var _action = this.getAction(context.action);
      if (!_action) return;
      return this.$meta.util.performAction({ ctx: this, action: _action, item: context.item }).then(function () {
        _this5.$meta.util.swipeoutClose(event.target);
      });
    },
    getActionColor: function getActionColor(action, index) {
      if (index === 0) return 'orange';else if (index === 1) return 'yellow';else return 'blue';
    },
    getFlagTitle: function getFlagTitle(item) {
      if (!this.flags) return null;
      return this.flags[item.module][item.atomClassName][item.atomFlag].titleLocale;
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
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/atom/list.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_listvue_type_script_lang_js = (listvue_type_script_lang_js); 
// EXTERNAL MODULE: ./front/src/components/atom/list.vue?vue&type=style&index=0&id=733f2dc8&lang=less&scoped=true
var listvue_type_style_index_0_id_733f2dc8_lang_less_scoped_true = __webpack_require__(37);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/atom/list.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_listvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "733f2dc8",
  null
  
)

/* harmony default export */ var list = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/item.vue?vue&type=template&id=0c2b2b1c&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',[_c('eb-navbar',{attrs:{"title":this.mode==='edit'?_vm.$text('Edit'):_vm.$text('View'),"eb-back-link":"Back"}},[_c('f7-nav-right',[(_vm.ready && _vm.findAction('write'))?_c('eb-link',{attrs:{"iconMaterial":this.mode==='edit'?'save':'edit',"context":this.mode==='edit'?'save':'write',"onPerform":_vm.onAction}}):_vm._e(),_vm._v(" "),(_vm.ready)?_c('eb-link',{attrs:{"iconMaterial":"more_horiz","popover-open":("#" + _vm.popoverId)}}):_vm._e()],1)],1),_vm._v(" "),(_vm.notfound)?[_c('f7-list',[_c('f7-list-item',{attrs:{"title":_vm.$text('Not found')}})],1)]:[(_vm.ready)?_c('atoms',{attrs:{"mode":"list","itemShow":_vm.item}}):_vm._e(),_vm._v(" "),(_vm.ready)?_c('eb-validate',{ref:"validate",attrs:{"readOnly":this.mode!=='edit',"auto":"","data":_vm.item,"params":_vm.validateParams,"onPerform":_vm.onPerformValidate}}):_vm._e(),_vm._v(" "),_c('f7-popover',{attrs:{"id":_vm.popoverId}},[(_vm.ready)?_c('f7-list',{attrs:{"inset":""}},[(_vm.findAction('write') && _vm.item.atomEnabled===0)?_c('eb-list-button',{attrs:{"popover-close":"","context":"submit","onPerform":_vm.onAction}},[_vm._v(_vm._s(_vm.$text('Submit')))]):_vm._e(),_vm._v(" "),_vm._l((_vm.actions),function(action){return (action.name!=='write')?_c('eb-list-button',{key:action.id,attrs:{"popover-close":"","context":action,"onPerform":_vm.onAction}},[_vm._v(_vm._s(_vm.getActionTitle(action)))]):_vm._e()})],2):_vm._e()],1)]],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/atom/item.vue?vue&type=template&id=0c2b2b1c&scoped=true

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/components/atom/item.vue?vue&type=script&lang=js




var ebActions = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebActions;
/* harmony default export */ var itemvue_type_script_lang_js = ({
  mixins: [ebActions],
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
    }
  },
  mounted: function mounted() {
    this.$meta.eventHub.$on('atom:action', this.onActionChanged);
  },
  beforeDestroy: function beforeDestroy() {
    this.$meta.eventHub.$off('atom:action', this.onActionChanged);
  },
  created: function created() {
    this.load();
  },

  methods: {
    load: function load() {
      var _this = this;

      this.$api.post('atom/read', {
        key: { atomId: this.atomId }
      }).then(function (data) {
        _this.item = data;

        _this.$meta.module.use(_this.item.module, function (module) {
          _this.module = module;
        });

        _this.$api.post('atom/validator', {
          atomClass: { id: _this.atomClassId }
        }).then(function (data) {
          _this.validateParams = {
            module: data.module,
            validator: data.validator
          };
        });

        _this.fetchActions();
      }).catch(function () {
        _this.notfound = true;
      });
    },
    fetchActions: function fetchActions() {
      var _this2 = this;

      this.$api.post('atom/actions', {
        key: { atomId: this.atomId }
      }).then(function (data) {
        _this2.actions = data;
      });
    },
    findAction: function findAction(actionName) {
      return this.actions.find(function (item) {
        return item.name === actionName;
      });
    },
    onAction: function onAction(event, action) {
      var _this3 = this;

      if (action === 'save' || action === 'submit') {
        return this.$refs.validate.perform(event, action);
      } else {
        if (typeof action === 'string') {
          action = {
            module: this.item.module,
            atomClassName: this.item.atomClassName,
            name: action
          };
        }

        if (action.name === 'write') {
          action.navigateOptions = { view: 'self' };
        }

        var _action = this.getAction(action);
        return this.$meta.util.performAction({ ctx: this, action: _action, item: this.item }).then(function (res) {
          console.log(res);
          if (res) _this3.$f7Router.back();
        });
      }
    },
    onPerformValidate: function onPerformValidate(event, actionName) {
      var _this4 = this;

      var action = this.$utils.extend({}, this.findAction('write'), { name: actionName });
      var _action = this.getAction(action);
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.item }).then(function () {
        if (actionName === 'save') return true;
        if (actionName === 'submit') _this4.$f7Router.back();
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

      this.item = null;
      this.actions = null;
      this.load();
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/atom/item.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_itemvue_type_script_lang_js = (itemvue_type_script_lang_js); 
// EXTERNAL MODULE: ./front/src/components/atom/item.vue?vue&type=style&index=0&id=0c2b2b1c&scoped=true&lang=css
var itemvue_type_style_index_0_id_0c2b2b1c_scoped_true_lang_css = __webpack_require__(35);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/atom/item.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_itemvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "0c2b2b1c",
  null
  
)

/* harmony default export */ var item = __webpack_exports__["a"] = (component.exports);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/components/menu/list.vue?vue&type=template&id=1089a114
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('f7-list',[(_vm.mode==='search')?_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale,"swipeout":""}},[_c('f7-icon',{attrs:{"slot":"media","color":"orange","material":item.star?'star':''},slot:"media"}),_vm._v(" "),_c('f7-swipeout-actions',[_c('eb-swipeout-button',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarSwitch}},[_vm._v(_vm._s(item.star?_vm.$text('Unstar'):_vm.$text('Star')))])],1)],1)}):(_vm.mode==='stars')?_vm._l((_vm.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale,"swipeout":""}},[_c('f7-swipeout-actions',[_c('eb-swipeout-button',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarOff}},[_vm._v(_vm._s(_vm.$text('Unstar')))])],1)],1)}):_vm._l((_vm.itemGroups),function(group){return _c('f7-list-group',{key:group.id},[_c('f7-list-item',{attrs:{"title":group.title,"group-title":""}}),_vm._v(" "),_vm._l((group.items),function(item){return _c('eb-list-item',{key:item.id,attrs:{"link":"#","context":item,"onPerform":_vm.onItemClick,"title":item.titleLocale,"swipeout":""}},[_c('f7-icon',{attrs:{"slot":"media","color":"orange","material":item.star?'star':''},slot:"media"}),_vm._v(" "),_c('f7-swipeout-actions',[_c('eb-swipeout-button',{attrs:{"color":"orange","context":item,"onPerform":_vm.onStarSwitch}},[_vm._v(_vm._s(item.star?_vm.$text('Unstar'):_vm.$text('Star')))])],1)],1)})],2)})],2),_vm._v(" "),_c('eb-load-more',{ref:"loadMore",attrs:{"onLoadClear":_vm.onLoadClear,"onLoadMore":_vm.onLoadMore,"autoInit":false}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/components/menu/list.vue?vue&type=template&id=1089a114

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/components/menu/list.vue?vue&type=script&lang=js



var ebModules = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebModules;
/* harmony default export */ var listvue_type_script_lang_js = ({
  meta: {
    global: false
  },
  mixins: [ebModules],
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
    menusAll: function menusAll() {
      return this.$local.state.menus;
    },
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
            group = { id: item.scene, name: name, title: title, items: [] };
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
            group = { id: item.module, title: module.titleLocale, items: [] };
            groups.push(group);
          }
          group.items.push(item);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
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
  created: function created() {
    this.$local.dispatch('getMenus');
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

      var options = void 0;
      if (this.mode === 'scenes') {
        options = {
          where: { menu: 1 },
          orders: [['scene', 'asc'], ['sorting', 'asc']],
          page: { index: index }
        };
      } else if (this.mode === 'modules') {
        options = {
          where: { menu: 1 },
          orders: [['module', 'asc'], ['scene', 'asc'], ['sorting', 'asc']],
          page: { index: index }
        };
      } else if (this.mode === 'stars') {
        options = {
          where: { menu: 1 },
          orders: [['d.updatedAt', 'desc']],
          star: 1,
          page: { index: index }
        };
      } else if (this.mode === 'search') {
        options = {
          where: { menu: 1, titleLocale: { val: this.query, op: 'like' } },
          orders: [['titleLocale', 'asc']],
          page: { index: index }
        };
      }

      return this.$api.post('function/list', {
        options: options
      }).then(function (data) {
        _this.items = data.list;
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
        _this2.$meta.eventHub.$emit('menu:star', { id: item.id, star: star });
        _this2.$meta.util.swipeoutClose(event.target);
      });
    },
    onStarOff: function onStarOff(event, item) {
      var _this3 = this;

      return this.$api.post('function/star', {
        id: item.id,
        star: 0
      }).then(function () {
        _this3.$meta.eventHub.$emit('menu:star', { id: item.id, star: 0 });
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
    getMenu: function getMenu(item) {
      if (!this.menusAll) return null;
      return this.menusAll[item.module][item.name];
    },
    onItemClick: function onItemClick(event, item) {
      var _menu = this.getMenu(item);
      if (!_menu) return;
      return this.$meta.util.performAction({ ctx: this, action: _menu, item: item });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components/menu/list.vue?vue&type=script&lang=js
 /* harmony default export */ var menu_listvue_type_script_lang_js = (listvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/components/menu/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_listvue_type_script_lang_js,
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./front/src/components/menu/list.vue + 4 modules
var list = __webpack_require__(4);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var atom_list = __webpack_require__(2);

// EXTERNAL MODULE: ./front/src/components/atom/item.vue + 4 modules
var item = __webpack_require__(3);

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

      if (action.menu === 1 && action.action === 'create') {
        return ctx.$api.post('/a/base/atom/create', {
          atomClass: { id: item.atomClassId }
        }).then(function (key) {
          ctx.$utils.extend(item, key);
          ctx.$meta.eventHub.$emit('atom:action', { key: key, action: action });
        });
      } else if (action.name === 'delete') {
        var _key = { atomId: item.atomId, itemId: item.itemId };
        return ctx.$view.dialog.confirm(ctx.$text('Are you sure to perform this operation?')).then(function () {
          return ctx.$api.post('/a/base/atom/delete', {
            key: _key
          }).then(function () {
            ctx.$meta.eventHub.$emit('atom:action', { key: _key, action: action });
            return true;
          });
        });
      } else if (action.name === 'save') {
        var _key2 = { atomId: item.atomId, itemId: item.itemId };
        return ctx.$api.post('/a/base/atom/write', {
          key: _key2,
          item: item
        }).then(function () {
          ctx.$meta.eventHub.$emit('atom:action', { key: _key2, action: action });
        });
      } else if (action.name === 'submit') {
        var _key3 = { atomId: item.atomId, itemId: item.itemId };
        return ctx.$view.dialog.confirm(ctx.$text('Are you sure to perform this operation?')).then(function () {
          return ctx.$api.post('/a/base/atom/submit', {
            key: _key3,
            item: item
          }).then(function () {
            ctx.$meta.eventHub.$emit('atom:action', { key: _key3, action: action });
          });
        });
      }

      var key = { atomId: item.atomId, itemId: item.itemId };
      return ctx.$view.dialog.confirm(ctx.$text('Are you sure to perform this operation?')).then(function () {
        return ctx.$api.post('/a/base/atom/action', {
          action: action.code,
          key: key
        }).then(function () {
          ctx.$meta.eventHub.$emit('atom:action', { key: key, action: action });
          return true;
        });
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/components.js





/* harmony default export */ var components = __webpack_exports__["default"] = ({
  menus: list["a" /* default */],
  atoms: atom_list["a" /* default */],
  item: item["a" /* default */],
  action: action
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/search.vue?vue&type=template&id=3027d3d8
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('eb-search-page',{attrs:{"title":_vm.$text('Search menu')}},[_c('menus',{attrs:{"slot":"list","mode":"search"},slot:"list"})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menu/search.vue?vue&type=template&id=3027d3d8

// EXTERNAL MODULE: ./front/src/components/menu/list.vue + 4 modules
var list = __webpack_require__(4);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/search.vue?vue&type=script&lang=js



/* harmony default export */ var searchvue_type_script_lang_js = ({
  components: {
    menus: list["a" /* default */]
  }
});
// CONCATENATED MODULE: ./front/src/pages/menu/search.vue?vue&type=script&lang=js
 /* harmony default export */ var menu_searchvue_type_script_lang_js = (searchvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menu/search.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_searchvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/list.vue?vue&type=template&id=4adf8dc0
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Home'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"search","eb-target":"self","eb-href":"menu/search"}})],1),_vm._v(" "),_c('f7-subnavbar',[_c('f7-toolbar',{attrs:{"tabbar":""}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdScenes),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('Scenes')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdModules)}},[_vm._v(_vm._s(_vm.$text('Modules')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdStars)}},[_vm._v(_vm._s(_vm.$text('Stars')))])],1)],1)],1),_vm._v(" "),_c('f7-tabs',[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdScenes,"tab-active":""}},[_c('menus',{attrs:{"slot":"list","mode":"scenes"},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdModules}},[_c('menus',{attrs:{"slot":"list","mode":"modules"},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdStars}},[_c('menus',{attrs:{"slot":"list","mode":"stars"},slot:"list"})],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menu/list.vue?vue&type=template&id=4adf8dc0

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/menu/list.vue + 4 modules
var list = __webpack_require__(4);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/list.vue?vue&type=script&lang=js




/* harmony default export */ var listvue_type_script_lang_js = ({
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
// CONCATENATED MODULE: ./front/src/pages/menu/list.vue?vue&type=script&lang=js
 /* harmony default export */ var menu_listvue_type_script_lang_js = (listvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menu/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_listvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var menu_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/view.vue?vue&type=template&id=40d528da&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('item',{attrs:{"query":_vm.query,"mode":"view"}})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/view.vue?vue&type=template&id=40d528da&scoped=true

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);

// EXTERNAL MODULE: ./front/src/components/atom/item.vue + 4 modules
var item = __webpack_require__(3);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/view.vue?vue&type=script&lang=js




/* harmony default export */ var viewvue_type_script_lang_js = ({
  components: {
    item: item["a" /* default */]
  },
  data: function data() {
    return {
      query: this.$f7Route.query
    };
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/view.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_viewvue_type_script_lang_js = (viewvue_type_script_lang_js); 
// EXTERNAL MODULE: ./front/src/pages/atom/view.vue?vue&type=style&index=0&id=40d528da&scoped=true&lang=css
var viewvue_type_style_index_0_id_40d528da_scoped_true_lang_css = __webpack_require__(27);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/view.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_viewvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "40d528da",
  null
  
)

/* harmony default export */ var view = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/selectAtomClass.vue?vue&type=template&id=6ebb62fc
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Select atom class'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',_vm._l((_vm.atomClasses),function(item,index){return _c('f7-list-item',{key:index,attrs:{"radio":"","checked":_vm.module===item.module && _vm.atomClassName===item.atomClassName,"title":item.title},on:{"click":function($event){_vm.onItemClick(item)}}})}))],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/selectAtomClass.vue?vue&type=template&id=6ebb62fc

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/selectAtomClass.vue?vue&type=script&lang=js



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectAtomClassvue_type_script_lang_js = ({
  mixins: [ebPageContext],
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
      var atomClassesAll = this.$local.state.atomClasses;
      if (!atomClassesAll) return [];

      var atomClasses = [];
      if (this.optional) {
        atomClasses.push({ title: null, module: null, atomClassName: null });
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
  created: function created() {
    this.$local.dispatch('getAtomClasses');
  },

  methods: {
    onItemClick: function onItemClick(item) {
      var data = item.module ? {
        module: item.module,
        atomClassName: item.atomClassName,
        title: item.title
      } : null;
      this.contextCallback(200, data);
      this.$f7Router.back();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/selectAtomClass.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_selectAtomClassvue_type_script_lang_js = (selectAtomClassvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/selectAtomClass.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_selectAtomClassvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var selectAtomClass = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/searchResult.vue?vue&type=template&id=646e1e22
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',{attrs:{"ptr":"","infinite":"","infinitePreloader":false},on:{"ptr:refresh":_vm.onRefresh,"infinite":_vm.onInfinite}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Search Result'),"eb-back-link":"Back"}}),_vm._v(" "),_c('atoms',{ref:"list",attrs:{"mode":"search","params":_vm.params,"atomClass":_vm.atomClass}})],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/searchResult.vue?vue&type=template&id=646e1e22

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/searchResult.vue?vue&type=script&lang=js



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;

/* harmony default export */ var searchResultvue_type_script_lang_js = ({
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
    }
  },
  methods: {
    onRefresh: function onRefresh(event, done) {
      done();
      this.$refs.list.reload();
    },
    onInfinite: function onInfinite() {
      this.$refs.list.loadMore();
    }
  },
  mounted: function mounted() {
    this.$refs.list.reload(true);
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/searchResult.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_searchResultvue_type_script_lang_js = (searchResultvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/searchResult.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_searchResultvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var searchResult = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/list.vue?vue&type=template&id=4f677d8e
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',{attrs:{"page-content":false,"tabs":"","with-subnavbar":""}},[_c('eb-navbar',{attrs:{"title":_vm.$text('Atom'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"search"},on:{"click":function($event){$event.preventDefault();return _vm.onSearch($event)}}})],1),_vm._v(" "),_c('f7-subnavbar',[_c('f7-toolbar',{attrs:{"tabbar":"","scrollable":_vm.labels && Object.keys(_vm.labels).length>1}},[_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdList),"tab-link-active":""}},[_vm._v(_vm._s(_vm.$text('List')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdDrafts)}},[_vm._v(_vm._s(_vm.$text('Drafts')))]),_vm._v(" "),_c('f7-link',{attrs:{"tab-link":("#" + _vm.tabIdStars)}},[_vm._v(_vm._s(_vm.$text('Stars')))]),_vm._v(" "),(_vm.labels)?_vm._l((Object.keys(_vm.labels)),function(key){return _c('f7-link',{key:key,attrs:{"tab-link":("#" + _vm.tabIdLabels + "_" + key)}},[_vm._v(_vm._s(_vm.labels[key].text))])}):_vm._e()],2)],1)],1),_vm._v(" "),_c('f7-tabs',[_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdList,"tab-active":""}},[_c('atoms',{attrs:{"slot":"list","mode":"list","atomClass":_vm.atomClass},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdDrafts}},[_c('atoms',{attrs:{"slot":"list","mode":"drafts","atomClass":_vm.atomClass},slot:"list"})],1),_vm._v(" "),_c('eb-tab-page-content',{attrs:{"id":_vm.tabIdStars}},[_c('atoms',{attrs:{"slot":"list","mode":"stars","atomClass":_vm.atomClass},slot:"list"})],1),_vm._v(" "),(_vm.labels)?_vm._l((Object.keys(_vm.labels)),function(key){return _c('eb-tab-page-content',{key:key,attrs:{"id":(_vm.tabIdLabels + "_" + key)}},[_c('atoms',{attrs:{"slot":"list","mode":("labels-" + key),"atomClass":_vm.atomClass},slot:"list"})],1)}):_vm._e()],2)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/list.vue?vue&type=template&id=4f677d8e

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// EXTERNAL MODULE: ./front/src/components/atom/list.vue + 4 modules
var list = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/list.vue?vue&type=script&lang=js




/* harmony default export */ var listvue_type_script_lang_js = ({
  components: {
    atoms: list["a" /* default */]
  },
  data: function data() {
    return {
      tabIdList: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdDrafts: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdStars: external_vue_default.a.prototype.$meta.util.nextId('tab'),
      tabIdLabels: external_vue_default.a.prototype.$meta.util.nextId('tab')
    };
  },

  computed: {
    labels: function labels() {
      return this.$local.state.labels;
    },
    atomClass: function atomClass() {
      if (!this.$f7Route.query.module || !this.$f7Route.query.atomClassName) return null;
      return {
        module: this.$f7Route.query.module,
        atomClassName: this.$f7Route.query.atomClassName
      };
    }
  },
  methods: {
    onSearch: function onSearch() {
      var atomClass = this.atomClass;
      var url = '/a/base/atom/search';
      if (atomClass) {
        url = url + '?module=' + atomClass.module + '&atomClassName=' + atomClass.atomClassName;
      }
      this.$view.navigate(url);
    }
  },
  created: function created() {
    this.$local.dispatch('getLabels');
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/list.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_listvue_type_script_lang_js = (listvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/list.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_listvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var atom_list = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/labels.vue?vue&type=template&id=0edb50b7&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Labels'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"add"},on:{"click":function($event){$event.preventDefault();return _vm.onAddLabel($event)}}})],1)],1),_vm._v(" "),(_vm.labelsAll)?_c('f7-list',[_c('f7-list-item',{attrs:{"group-title":"","title":_vm.item?_vm.item.atomName:''}}),_vm._v(" "),_vm._l((Object.keys(_vm.labelsAll)),function(key){return _c('f7-list-item',{key:key,attrs:{"title":_vm.labelsAll[key].text,"checkbox":"","checked":_vm.labelChecked(key),"swipeout":""},on:{"change":function($event){_vm.onLabelCheckChange($event,key)}}},[_c('div',{staticClass:"media",style:({backgroundColor:_vm.labelsAll[key].color}),attrs:{"slot":"media"},slot:"media"}),_vm._v(" "),_c('f7-swipeout-actions',[_c('eb-swipeout-button',{attrs:{"close":""}},[_vm._v(_vm._s(_vm.$text('Close')))]),_vm._v(" "),_c('eb-swipeout-button',{attrs:{"color":"orange","context":key,"onPerform":_vm.onEditLabel}},[_vm._v(_vm._s(_vm.$text('Edit')))])],1)],1)})],2):_vm._e(),_vm._v(" "),_c('f7-sheet',{ref:"ebSheet",attrs:{"fill":"","opened":_vm.sheetOpened},on:{"sheet:closed":function($event){_vm.sheetOpened = false}}},[_c('f7-toolbar',[_c('div',{staticClass:"left"},[_c('f7-link',{attrs:{"sheet-close":""}},[_vm._v(_vm._s(_vm.$text('Close')))])],1),_vm._v(" "),_c('div',{staticClass:"right"},[_c('eb-link',{attrs:{"onPerform":_vm.onSubmit}},[_vm._v(_vm._s(_vm.$text('Submit')))])],1)]),_vm._v(" "),_c('f7-page-content',[_c('div',{staticClass:"label"},[_c('f7-badge',{style:({backgroundColor:_vm.labelColor})},[_vm._v(_vm._s(_vm.labelText))])],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Text')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Text'),"clear-button":""},model:{value:(_vm.labelText),callback:function ($$v) {_vm.labelText=$$v},expression:"labelText"}})],1)],1),_vm._v(" "),_c('f7-block',[_c('div',{staticClass:"row colors"},_vm._l((_vm.colors),function(color){return _c('f7-button',{key:color.value,staticClass:"col-33",style:({backgroundColor:color.value}),attrs:{"small":"","fill":""},on:{"click":function($event){_vm.onColorSelect(color)}}},[_vm._v(_vm._s(_vm.$text(color.name)))])}))])],1)],1)],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/labels.vue?vue&type=template&id=0edb50b7&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/labels.vue?vue&type=script&lang=js


/* harmony default export */ var labelsvue_type_script_lang_js = ({
  data: function data() {
    return {
      atomId: parseInt(this.$f7Route.query.atomId),
      item: null,
      labels: [],
      sheetOpened: false,
      labelId: 0,
      labelText: '',
      labelColor: '',
      colors: [{ name: 'Red', value: '#FC6360' }, { name: 'Orange', value: '#FDA951' }, { name: 'Yellow', value: '#FED558' }, { name: 'Blue', value: '#54BEF7' }, { name: 'Green', value: '#86DF6A' }, { name: 'Purple', value: '#D592E5' }]
    };
  },

  computed: {
    labelsAll: function labelsAll() {
      return this.$local.state.labels;
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
    onSubmit: function onSubmit() {
      var _this = this;

      if (!this.labelText || !this.labelColor) return;
      var labels = this.$utils.extend({}, this.labelsAll);
      if (this.labelId === 0) {
        labels[this.newLabelId()] = { text: this.labelText, color: this.labelColor };
      } else {
        labels[this.labelId] = { text: this.labelText, color: this.labelColor };
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
        key: { atomId: this.atomId },
        atom: { labels: this.labels }
      }).then(function () {
        _this2.$meta.eventHub.$emit('atom:labels', { key: { atomId: _this2.atomId }, labels: _this2.labels });
      });
    }
  },
  created: function created() {
    var _this3 = this;

    this.$local.dispatch('getLabels');
    this.$api.post('atom/read', {
      key: { atomId: this.atomId }
    }).then(function (data) {
      _this3.item = data;
      _this3.labels = JSON.parse(_this3.item.labels) || [];
    });
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/labels.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_labelsvue_type_script_lang_js = (labelsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./front/src/pages/atom/labels.vue?vue&type=style&index=0&id=0edb50b7&scoped=true&lang=css
var labelsvue_type_style_index_0_id_0edb50b7_scoped_true_lang_css = __webpack_require__(31);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/labels.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_labelsvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "0edb50b7",
  null
  
)

/* harmony default export */ var labels = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/edit.vue?vue&type=template&id=0aa34cf3&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('item',{attrs:{"query":_vm.query,"mode":"edit"}})}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/edit.vue?vue&type=template&id=0aa34cf3&scoped=true

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);

// EXTERNAL MODULE: ./front/src/components/atom/item.vue + 4 modules
var item = __webpack_require__(3);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/edit.vue?vue&type=script&lang=js




/* harmony default export */ var editvue_type_script_lang_js = ({
  components: {
    item: item["a" /* default */]
  },
  data: function data() {
    return {
      query: this.$f7Route.query
    };
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/edit.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_editvue_type_script_lang_js = (editvue_type_script_lang_js); 
// EXTERNAL MODULE: ./front/src/pages/atom/edit.vue?vue&type=style&index=0&id=0aa34cf3&scoped=true&lang=css
var editvue_type_style_index_0_id_0aa34cf3_scoped_true_lang_css = __webpack_require__(33);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/edit.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_editvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "0aa34cf3",
  null
  
)

/* harmony default export */ var edit = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/selectFunction.vue?vue&type=template&id=4cc7abb5
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',[_c('eb-navbar',{attrs:{"title":_vm.$text(_vm.menu===1?'Select menu':'Select function'),"eb-back-link":"Back"}}),_vm._v(" "),_c('f7-list',_vm._l((_vm.functions),function(item,index){return _c('f7-list-item',{key:index,attrs:{"radio":"","checked":_vm.name===item.name,"title":item.title},on:{"click":function($event){_vm.onItemClick(item)}}})}))],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/menu/selectFunction.vue?vue&type=template&id=4cc7abb5

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(1);
var external_vue_default = /*#__PURE__*/__webpack_require__.n(external_vue_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/menu/selectFunction.vue?vue&type=script&lang=js



var ebPageContext = external_vue_default.a.prototype.$meta.module.get('a-components').options.components.ebPageContext;
/* harmony default export */ var selectFunctionvue_type_script_lang_js = ({
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
        functions.push({ title: null, name: null });
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
      this.$f7Router.back();
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/menu/selectFunction.vue?vue&type=script&lang=js
 /* harmony default export */ var menu_selectFunctionvue_type_script_lang_js = (selectFunctionvue_type_script_lang_js); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/menu/selectFunction.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  menu_selectFunctionvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var selectFunction = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/search.vue?vue&type=template&id=6dea3f04&scoped=true
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('f7-page',[_c('eb-navbar',{attrs:{"title":_vm.$text('Search Atom'),"eb-back-link":"Back"}},[_c('f7-nav-right',[_c('eb-link',{attrs:{"iconMaterial":"search"},on:{"click":function($event){$event.preventDefault();return _vm.onSearch($event)}}})],1)],1),_vm._v(" "),_c('f7-list',{attrs:{"form":"","no-hairlines-md":""}},[_c('f7-list-item',[_c('f7-label',{attrs:{"floating":""}},[_vm._v(_vm._s(_vm.$text('Atom name')))]),_vm._v(" "),_c('eb-input',{attrs:{"type":"text","placeholder":_vm.$text('Atom name'),"clear-button":""},model:{value:(_vm.atomName),callback:function ($$v) {_vm.atomName=$$v},expression:"atomName"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"smartSelect":"","title":_vm.$text('Label'),"smartSelectParams":{openIn: 'page', closeOnSelect: true}}},[_c('eb-select',{attrs:{"name":"label","options":_vm.labels},model:{value:(_vm.label),callback:function ($$v) {_vm.label=$$v},expression:"label"}})],1),_vm._v(" "),_c('f7-list-item',{attrs:{"title":_vm.$text('Atom class'),"link":"#"},on:{"click":_vm.onSelectAtomClass}},[_c('div',{attrs:{"slot":"after"},slot:"after"},[_vm._v(_vm._s(_vm.atomClass && _vm.atomClass.title))])])],1),_vm._v(" "),(_vm.item && _vm.validateParams)?_c('eb-validate',{ref:"validate",attrs:{"auto":"","data":_vm.item,"params":_vm.validateParams}}):_vm._e()],1)}
var staticRenderFns = []


// CONCATENATED MODULE: ./front/src/pages/atom/search.vue?vue&type=template&id=6dea3f04&scoped=true

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./front/src/pages/atom/search.vue?vue&type=script&lang=js


/* harmony default export */ var searchvue_type_script_lang_js = ({
  data: function data() {
    return {
      atomName: '',
      label: 0,
      atomClass: null,
      item: null,
      validateParams: null
    };
  },

  computed: {
    labels: function labels() {
      var labelsAll = this.$local.state.labels;
      if (!labelsAll) return null;

      var labels = [{ title: '', value: 0 }];
      for (var key in labelsAll) {
        labels.push({ title: labelsAll[key].text, value: key });
      }
      return labels;
    }
  },
  watch: {
    atomClass: function atomClass(value) {
      var _this = this;

      if (!value) {
        this.item = null;
        this.validateParams = null;
      } else {
        var atomClass = this.atomClass;

        this.$meta.module.use(atomClass.module, function () {
          _this.$api.post('atomClass/validatorSearch', {
            module: atomClass.module,
            atomClassName: atomClass.atomClassName
          }).then(function (data) {
            _this.item = {};
            _this.validateParams = {
              module: data.module,
              validator: data.validator
            };
          });
        });
      }
    }
  },
  created: function created() {
    this.$local.dispatch('getLabels');
  },

  methods: {
    onSelectAtomClass: function onSelectAtomClass() {
      var _this2 = this;

      this.$view.navigate('/a/base/atom/selectAtomClass', {
        view: 'self',
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
    onSearch: function onSearch() {
      var atomClassExtra = void 0;
      if (this.item) {
        atomClassExtra = {};
        for (var key in this.item) {
          var value = this.item[key];
          if (value) {
            if (typeof value === 'string') {
              atomClassExtra['f.' + key] = { val: value, op: 'like' };
            } else {
              atomClassExtra['f.' + key] = value;
            }
          }
        }
      }

      this.$view.navigate('/a/base/atom/searchResult', {
        view: 'self',
        context: {
          params: {
            atomName: this.atomName,
            label: this.label,
            atomClass: this.atomClass,
            atomClassExtra: atomClassExtra
          }
        }
      });
    }
  }
});
// CONCATENATED MODULE: ./front/src/pages/atom/search.vue?vue&type=script&lang=js
 /* harmony default export */ var atom_searchvue_type_script_lang_js = (searchvue_type_script_lang_js); 
// EXTERNAL MODULE: ./front/src/pages/atom/search.vue?vue&type=style&index=0&id=6dea3f04&scoped=true&lang=css
var searchvue_type_style_index_0_id_6dea3f04_scoped_true_lang_css = __webpack_require__(29);

// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./front/src/pages/atom/search.vue






/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  atom_searchvue_type_script_lang_js,
  render,
  staticRenderFns,
  false,
  null,
  "6dea3f04",
  null
  
)

/* harmony default export */ var search = __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 22 */
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
  'Search menu': '搜索菜单',
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
  'Atom Name': '原子名称',
  Red: '红色',
  Orange: '橘色',
  Yellow: '黄色',
  Blue: '蓝色',
  Green: '绿色',
  Purple: '紫色',
  'Are you sure to perform this operation?': '您确认要执行此操作吗？',
  'Modification time': '修改时间',
  'Created time': '创建时间',
  'Search Atom': '搜索原子',
  'Search Result': '搜索结果',
  'Atom name': '原子名称',
  'Atom class': '原子类别',
  Label: '标签'
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  'zh-cn': __webpack_require__(22).default
});

/***/ }),
/* 24 */
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
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

/* harmony default export */ __webpack_exports__["default"] = (function (Vue) {

  return {
    state: {
      labels: null,
      modules: null,
      atomClasses: null,
      actions: null,
      flags: null,
      menus: null,
      functions: null
    },
    getters: {},
    mutations: {
      setLabels: function setLabels(state, labels) {
        state.labels = labels;
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
      setMenus: function setMenus(state, menus) {
        state.menus = menus;
      },
      setFunctions: function setFunctions(state, functions) {
        state.functions = functions;
      }
    },
    actions: {
      getLabels: function getLabels(_ref) {
        var state = _ref.state,
            commit = _ref.commit;

        return new Promise(function (resolve, reject) {
          if (state.labels) return resolve(state.labels);
          Vue.prototype.$meta.api.post('/a/base/user/getLabels').then(function (data) {
            data = data || {};
            commit('setLabels', data);
            resolve(data);
          }).catch(function (err) {
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
          }).catch(function (err) {
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
          }).catch(function (err) {
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
          }).catch(function (err) {
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
          }).catch(function (err) {
            reject(err);
          });
        });
      },
      getMenus: function getMenus(_ref6) {
        var state = _ref6.state,
            commit = _ref6.commit;

        return new Promise(function (resolve, reject) {
          if (state.menus) return resolve(state.menus);
          Vue.prototype.$meta.api.post('/a/base/base/menus').then(function (data) {
            data = data || {};
            commit('setMenus', data);
            resolve(data);
          }).catch(function (err) {
            reject(err);
          });
        });
      },
      getFunctions: function getFunctions(_ref7) {
        var state = _ref7.state,
            commit = _ref7.commit;

        return new Promise(function (resolve, reject) {
          if (state.functions) return resolve(state.functions);
          Vue.prototype.$meta.api.post('/a/base/base/functions').then(function (data) {
            data = data || {};
            commit('setFunctions', data);
            resolve(data);
          }).catch(function (err) {
            reject(err);
          });
        });
      }
    }
  };
});

/***/ }),
/* 26 */,
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_style_index_0_id_40d528da_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_style_index_0_id_40d528da_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_style_index_0_id_40d528da_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_view_vue_vue_type_style_index_0_id_40d528da_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 28 */,
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_6dea3f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_6dea3f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_6dea3f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_search_vue_vue_type_style_index_0_id_6dea3f04_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 30 */,
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_0edb50b7_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_0edb50b7_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_0edb50b7_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_labels_vue_vue_type_style_index_0_id_0edb50b7_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 32 */,
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_0aa34cf3_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_0aa34cf3_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_0aa34cf3_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_edit_vue_vue_type_style_index_0_id_0aa34cf3_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_0c2b2b1c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_0c2b2b1c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_0c2b2b1c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_7_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_vue_loader_lib_index_js_vue_loader_options_item_vue_vue_type_style_index_0_id_0c2b2b1c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 36 */,
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_733f2dc8_lang_less_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_733f2dc8_lang_less_scoped_true__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_733f2dc8_lang_less_scoped_true__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_index_js_ref_9_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_less_loader_dist_cjs_js_ref_9_2_node_modules_vue_loader_lib_index_js_vue_loader_options_list_vue_vue_type_style_index_0_id_733f2dc8_lang_less_scoped_true__WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./atom/edit.vue": 19,
	"./atom/labels.vue": 18,
	"./atom/list.vue": 17,
	"./atom/search.vue": 21,
	"./atom/searchResult.vue": 16,
	"./atom/selectAtomClass.vue": 15,
	"./atom/view.vue": 14,
	"./menu/list.vue": 13,
	"./menu/search.vue": 12,
	"./menu/selectFunction.vue": 20
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
webpackContext.id = 38;

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function load(name) {
  return __webpack_require__(38)("./" + name + '.vue').default;
}

/* harmony default export */ __webpack_exports__["default"] = ([{ path: 'menu/list', component: load('menu/list') }, { path: 'menu/search', component: load('menu/search') }, { path: 'menu/selectFunction', component: load('menu/selectFunction') }, { path: 'atom/list', component: load('atom/list') }, { path: 'atom/search', component: load('atom/search') }, { path: 'atom/searchResult', component: load('atom/searchResult') }, { path: 'atom/labels', component: load('atom/labels') }, { path: 'atom/edit', component: load('atom/edit') }, { path: 'atom/view', component: load('atom/view') }, { path: 'atom/selectAtomClass', component: load('atom/selectAtomClass') }]);

/***/ }),
/* 40 */,
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _assets_css_module_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_css_module_css__WEBPACK_IMPORTED_MODULE_0__);
var Vue = void 0;



function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: __webpack_require__(39).default,
    store: __webpack_require__(25).default(Vue),
    config: __webpack_require__(24).default,
    locales: __webpack_require__(23).default,
    components: __webpack_require__(11).default
  });
}

/* harmony default export */ __webpack_exports__["default"] = ({
  install: install
});

/***/ })
/******/ ]);
//# sourceMappingURL=front.js.map
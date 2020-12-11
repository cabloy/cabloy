window['a-dashboard'] = function(t) { const e = {}; function r(n) { if (e[n]) return e[n].exports; const i = e[n] = { i: n, l: !1, exports: {} }; return t[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports; } return r.m = t, r.c = e, r.d = function(t, e, n) { r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n }); }, r.r = function(t) { typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(t, '__esModule', { value: !0 }); }, r.t = function(t, e) { if (1 & e && (t = r(t)), 8 & e) return t; if (4 & e && typeof t === 'object' && t && t.__esModule) return t; const n = Object.create(null); if (r.r(n), Object.defineProperty(n, 'default', { enumerable: !0, value: t }), 2 & e && typeof t !== 'string') for (const i in t)r.d(n, i, function(e) { return t[e]; }.bind(null, i)); return n; }, r.n = function(t) { const e = t && t.__esModule ? function() { return t.default; } : function() { return t; }; return r.d(e, 'a', e), e; }, r.o = function(t, e) { return Object.prototype.hasOwnProperty.call(t, e); }, r.p = '', r(r.s = 5); }([ function(t, e, r) {
  function n(t, e, r, n, i, o, a, s) {
    let d,
      u = typeof t === 'function' ? t.options : t; if (e && (u.render = e, u.staticRenderFns = r, u._compiled = !0), n && (u.functional = !0), o && (u._scopeId = 'data-v-' + o), a ? (d = function(t) { (t = t || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) || typeof __VUE_SSR_CONTEXT__ === 'undefined' || (t = __VUE_SSR_CONTEXT__), i && i.call(this, t), t && t._registeredComponents && t._registeredComponents.add(a); }, u._ssrRegister = d) : i && (d = s ? function() { i.call(this, (u.functional ? this.parent : this).$root.$options.shadowRoot); } : i), d) if (u.functional) { u._injectStyles = d; const l = u.render; u.render = function(t, e) { return d.call(e), l(t, e); }; } else { const c = u.beforeCreate; u.beforeCreate = c ? [].concat(c, d) : [ d ]; } return { exports: t, options: u };
  }r.d(e, 'a', function() { return n; });
}, function(t, e) { t.exports = window.Vue; }, function(t, e, r) {
  e.a = function(t, e) {
    for (var r = [], n = 0, i = [ 5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100 ]; n < i.length; n++) { const o = i[n]; r.push({ title: ''.concat(o, '%'), value: o }); } const a = { type: 'object', properties: { title: { type: 'string', ebType: 'text', ebTitle: 'Title', ebClue: 'title', ebCategory: 'Basic' }, widthSmall: { type: 'integer', ebType: 'select', ebTitle: 'Width(Small)', ebOptions: r, ebClue: 'width', ebCategory: 'Basic' }, widthMedium: { type: 'integer', ebType: 'select', ebTitle: 'Width(Medium)', ebOptions: r, ebClue: 'width', ebCategory: 'Basic' }, widthLarge: { type: 'integer', ebType: 'select', ebTitle: 'Width(Large)', ebOptions: r, ebClue: 'width', ebCategory: 'Basic' } } },
      s = t.prototype.$utils.extend({}, a, { type: 'object', properties: { height: { type: 'string', ebType: 'text', ebTitle: 'Height', ebClue: 'height', ebCategory: 'Basic' } } }),
      d = { type: 'object', properties: { attrTitle: { ebTitle: 'Title', ebClue: 'title', ebCategory: 'Basic' }, attrWidthSmall: { ebTitle: 'Width(Small)', ebClue: 'width', ebCategory: 'Basic' }, attrWidthMedium: { ebTitle: 'Width(Medium)', ebClue: 'width', ebCategory: 'Basic' }, attrWidthLarge: { ebTitle: 'Width(Large)', ebClue: 'width', ebCategory: 'Basic' } } },
      u = t.prototype.$utils.extend({}, d, { type: 'object', properties: { attrHeight: { ebTitle: 'Height', ebClue: 'height', ebCategory: 'Basic' } } }); return { meta: { widget: { schema: { props: e ? a : s, attrs: e ? d : u } } }, props: { widget: { type: Object }, title: { type: String }, widthSmall: { type: Number }, widthMedium: { type: Number }, widthLarge: { type: Number }, height: e ? void 0 : { type: String } }, data() { return { attrTitle: null, attrWidthSmall: null, attrWidthMedium: null, attrWidthLarge: null, attrHeight: e ? void 0 : null }; }, watch: { title() { this.attrTitle = this.title; }, widthSmall() { this.attrWidthSmall = this.widthSmall; }, widthMedium() { this.attrWidthMedium = this.widthMedium; }, widthLarge() { this.attrWidthLarge = this.widthLarge; }, height: e ? void 0 : function() { this.attrHeight = this.height; } }, created() { this.attrTitle = this.title, this.attrWidthSmall = this.widthSmall, this.attrWidthMedium = this.widthMedium, this.attrWidthLarge = this.widthLarge, e || (this.attrHeight = this.height); }, mounted() { this.$emit('widgetReal:ready', this); }, beforeDestroy() { this.$emit('widgetReal:destroy', this); } };
  };
}, function(t, e, r) {
  function n(t, e) {
    let r; if (typeof Symbol === 'undefined' || t[Symbol.iterator] == null) {
      if (Array.isArray(t) || (r = function(t, e) { if (!t) return; if (typeof t === 'string') return i(t, e); let r = Object.prototype.toString.call(t).slice(8, -1); r === 'Object' && t.constructor && (r = t.constructor.name); if (r === 'Map' || r === 'Set') return Array.from(t); if (r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return i(t, e); }(t)) || e && t && typeof t.length === 'number') {
        r && (t = r); let n = 0,
          o = function() {}; return { s: o, n() { return n >= t.length ? { done: !0 } : { done: !1, value: t[n++] }; }, e(t) { throw t; }, f: o };
      } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    } let a,
      s = !0,
      d = !1; return { s() { r = t[Symbol.iterator](); }, n() { const t = r.next(); return s = t.done, t; }, e(t) { d = !0, a = t; }, f() { try { s || r.return == null || r.return(); } finally { if (d) throw a; } } };
  } function i(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = new Array(e); r < e; r++)n[r] = t[r]; return n; } const o = { props: { dashboard: { type: Object }, widget: { type: Object }, widgetId: { type: String }, propertyName: { type: String }, propertyBind: { type: Object } }, data() { return { bindCurrent: null, optionsSourceWidget: [], optionsPropertyName: {} }; }, created() { this.bindCurrent = this.$meta.util.extend({ widgetId: '', propertyName: '' }, this.propertyBind), this.combineOptionsSourceWidget(); }, methods: { onInputSourceWidget(t) { this.bindCurrent.widgetId = t, this.bindCurrent.propertyName = '', this.$emit('bind:change', this.bindCurrent); }, onInputPropertyName(t) { this.bindCurrent.propertyName = t, this.$emit('bind:change', this.bindCurrent); }, combineOptionsSourceWidget() {
      let t,
        e = [{ title: '', value: '' }],
        r = {},
        i = (this.widget._getPropSchema(this.widget.options, this.propertyName).ebClue || '').split(','),
        o = n(this.dashboard.widgetsReal); try {
        for (o.s(); !(t = o.n()).done;) {
          const a = t.value,
            s = a.widgetReal.widget.options.id; if (s !== this.widgetId) { const d = this._getOptionsPropertyName(a, i); d.length > 1 && (r[s] = d, e.push({ title: a.widgetReal.widget.__getPropertyRealValue('title'), value: s })); }
        }
      } catch (t) { o.e(t); } finally { o.f(); } this.optionsSourceWidget = e, this.optionsPropertyName = r;
    }, _getOptionsPropertyName(t, e) {
      const r = [{ title: '', value: '' }],
        n = this.widget._getAttrsSchema(t.widgetReal.widget.options); return this._combineOptionsSourceWidgetSchema(r, n, e), r;
    }, _combineOptionsSourceWidgetSchema(t, e, r) {
      const n = this; if (e) {
        const i = function(i) {
          const o = e.properties[i],
            a = (o.ebClue || '').split(','); r.filter(function(t) { return a.indexOf(t) > -1; }).length > 0 && t.push({ title: n.$text(o.ebTitle), value: i });
        }; for (const o in e.properties) { i(o); }
      }
    } } },
    a = r(0),
    s = Object(a.a)(o, function() {
      const t = this,
        e = t.$createElement,
        r = t._self._c || e; return r('f7-list', [ r('f7-list-item', { attrs: { smartSelect: '', smartSelectParams: { openIn: 'page', closeOnSelect: !0 }, title: t.$text('Source Widget') } }, [ r('eb-select', { attrs: { name: 'sourceWidget', value: t.bindCurrent.widgetId, options: t.optionsSourceWidget }, on: { input: t.onInputSourceWidget } }) ], 1), t._v(' '), r('f7-list-item', { attrs: { smartSelect: '', smartSelectParams: { openIn: 'page', closeOnSelect: !0 }, title: t.$text('Property Name') } }, [ r('eb-select', { attrs: { name: 'propertyName', value: t.bindCurrent.propertyName, options: t.optionsPropertyName[this.bindCurrent.widgetId] || [] }, on: { input: t.onInputPropertyName } }) ], 1) ], 1);
    }, [], !1, null, '76f3de4e', null); e.a = s.exports;
}, function(t, e, r) {
  const n = r(2); function i(t, e) {
    let r; if (typeof Symbol === 'undefined' || t[Symbol.iterator] == null) {
      if (Array.isArray(t) || (r = function(t, e) { if (!t) return; if (typeof t === 'string') return o(t, e); let r = Object.prototype.toString.call(t).slice(8, -1); r === 'Object' && t.constructor && (r = t.constructor.name); if (r === 'Map' || r === 'Set') return Array.from(t); if (r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return o(t, e); }(t)) || e && t && typeof t.length === 'number') {
        r && (t = r); let n = 0,
          i = function() {}; return { s: i, n() { return n >= t.length ? { done: !0 } : { done: !1, value: t[n++] }; }, e(t) { throw t; }, f: i };
      } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    } let a,
      s = !0,
      d = !1; return { s() { r = t[Symbol.iterator](); }, n() { const t = r.next(); return s = t.done, t; }, e(t) { d = !0, a = t; }, f() { try { s || r.return == null || r.return(); } finally { if (d) throw a; } } };
  } function o(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = new Array(e); r < e; r++)n[r] = t[r]; return n; } const a = { meta: { global: !0 }, name: 'eb-dashboard-widget-group', mixins: [ Object(n.a)(Vue, !0) ], render(t) { return this.__renderRow(t); }, props: { root: { type: Boolean }, dashboard: { type: Object }, widgets: { type: Array } }, data() { return { dragdropSceneResize: Vue.prototype.$meta.util.nextId('dragdrop'), dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop') }; }, methods: { __renderRow(t) {
      let e,
        r = [],
        n = i(this.widgets); try {
        for (n.s(); !(e = n.n()).done;) {
          const o = e.value,
            a = t('eb-dashboard-widget', { key: o.id, props: { dashboard: this.dashboard, group: this, options: o, dragdropSceneResize: this.dragdropSceneResize, dragdropScene: this.dragdropScene } }); r.push(a);
        }
      } catch (t) { n.e(t); } finally { n.f(); } return r.push(t('f7-col', { staticClass: 'widget widget-last', props: { resizable: !0, resizableHandler: !1, width: 100 } })), t('f7-row', { staticClass: 'group' }, r);
    }, __getWidgetById(t) { const e = this.widgets.findIndex(function(e) { return e.id === t; }); return e === -1 ? [ null, -1 ] : [ this.widgets[e], e ]; }, onWidgetAdd(t) { const e = { module: t.module, name: t.name }; this.dashboard.__initWidget(e, this.root ? 'widget' : 'group'), this.widgets.push(e), this.dashboard.__saveLayoutConfig(); } } },
    s = r(0),
    d = Object(s.a)(a, void 0, void 0, !1, null, null, null); e.a = d.exports;
}, function(t, e, r) { r.r(e); let n; r(6); e.default = { install(t, e) { return n ? console.error('already installed.') : (n = t, e({ routes: r(9).default, store: r(11).default(n), config: r(12).default(n), locales: r(13).default, components: r(17).default, mixins: r(16).default(n) })); } }; }, function(t, e, r) { let n = r(7); typeof n === 'string' && (n = [[ t.i, n, '' ]]), n.locals && (t.exports = n.locals); (0, r(24).default)('1237ef40', n, !0, {}); }, function(t, e, r) { (e = r(8)(!0)).push([ t.i, '.dashboard-settings {\n  position: fixed;\n  bottom: 6px;\n  right: 6px;\n  z-index: 200;\n}\n.dashboard-settings.link {\n  color: var(--f7-grid-resize-handler-bg-color);\n}\n.dashboard .row {\n  justify-content: space-evenly;\n}\n.dashboard .widget.widget-item .widget-inner {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.dashboard .widget .widget-inner-error {\n  margin: 30px;\n  text-align: center;\n}\n.dashboard .widget.widget-group-empty .group {\n  background: var(--f7-text-editor-border-color);\n  height: 100px;\n}\n.dashboard .widget.widget-group-some:hover > .resize-handler {\n  right: 50%;\n}\n.dashboard .widget.widget-group-some:hover > .widget-toolbar {\n  right: 50%;\n}\n.dashboard .widget .resize-handler {\n  left: auto;\n  right: 0;\n  opacity: 0;\n  transition-duration: 400ms;\n}\n.dashboard .widget .widget-toolbar {\n  position: absolute;\n  top: 0;\n  right: 0;\n  opacity: 0;\n  transition-duration: 400ms;\n  z-index: 200;\n}\n.dashboard .widget .widget-toolbar a.link {\n  color: var(--f7-grid-resize-handler-bg-color);\n}\n.dashboard .widget .widget-toolbar a.link .icon {\n  font-size: 16px;\n}\n.dashboard .widget .widget-toolbar a.link + a.link {\n  margin-left: 8px;\n}\n.dashboard .widget:hover .resize-handler {\n  left: auto;\n  right: 0;\n  opacity: 1;\n}\n.dashboard .widget:hover .widget-toolbar {\n  opacity: 1;\n}\n.dashboard .widget[data-dragdrop-drop] {\n  background: var(--f7-text-editor-border-color);\n}\n.widget-property-edit .value-types {\n  text-align: right;\n}\n.widget-property-edit .value-types label.radio {\n  margin-left: 8px;\n}\n', '', { version: 3, sources: [ '/Users/yangjian/Documents/data/cabloy/cabloy-lerna/src/module-system/a-dashboard/front/src/assets/css/module.less', 'module.less' ], names: [], mappings: 'AAAA;EACE,eAAA;EACA,WAAA;EACA,UAAA;EACA,YAAA;ACCF;ADCE;EACE,6CAAA;ACCJ;ADGA;EAGI,6BAAA;ACHJ;ADQI;EAEI,gBAAA;EACA,kBAAA;ACPR;ADJA;EAgBM,YAAA;EACA,kBAAA;ACTN;ADYI;EAEI,8CAAA;EACA,aAAA;ACXR;ADeI;EAEI,UAAA;ACdR;ADYI;EAMI,UAAA;ACfR;ADlBA;EAsCM,UAAA;EACA,QAAA;EACA,UAAA;EACA,0BAAA;ACjBN;ADxBA;EA6CM,kBAAA;EACA,MAAA;EACA,QAAA;EACA,UAAA;EACA,0BAAA;EACA,YAAA;AClBN;ADhCA;EAqDQ,6CAAA;AClBR;ADnCA;EAwDU,eAAA;AClBV;ADqBQ;EACE,gBAAA;ACnBV;ADyBI;EAGI,UAAA;EACA,QAAA;EACA,UAAA;ACzBR;ADoBI;EASI,UAAA;AC1BR;AD8BI;EACE,8CAAA;AC5BN;ADiCA;EAEI,iBAAA;AChCJ;AD8BA;EAKM,gBAAA;AChCN', file: 'module.less', sourcesContent: [ '.dashboard-settings {\n  position: fixed;\n  bottom: 6px;\n  right: 6px;\n  z-index: 200;\n\n  &.link {\n    color: var(--f7-grid-resize-handler-bg-color);\n  }\n}\n\n.dashboard {\n\n  .row {\n    justify-content: space-evenly;\n  }\n\n  .widget {\n\n    &.widget-item {\n      .widget-inner {\n        overflow-y: auto;\n        overflow-x: hidden;\n      }\n    }\n\n    .widget-inner-error {\n      margin: 30px;\n      text-align: center;\n    }\n\n    &.widget-group-empty {\n      .group {\n        background: var(--f7-text-editor-border-color);\n        height: 100px;\n      }\n    }\n\n    &.widget-group-some:hover {\n      >.resize-handler {\n        right: 50%;\n      }\n\n      >.widget-toolbar {\n        right: 50%;\n      }\n    }\n\n    .resize-handler {\n      left: auto;\n      right: 0;\n      opacity: 0;\n      transition-duration: 400ms;\n    }\n\n    .widget-toolbar {\n      position: absolute;\n      top: 0;\n      right: 0;\n      opacity: 0;\n      transition-duration: 400ms;\n      z-index: 200;\n\n      a.link {\n        color: var(--f7-grid-resize-handler-bg-color);\n\n        .icon {\n          font-size: 16px;\n        }\n\n        &+a.link {\n          margin-left: 8px;\n        }\n      }\n\n    }\n\n    &:hover {\n\n      .resize-handler {\n        left: auto;\n        right: 0;\n        opacity: 1;\n      }\n\n      .widget-toolbar {\n        opacity: 1;\n      }\n    }\n\n    &[data-dragdrop-drop] {\n      background: var(--f7-text-editor-border-color);\n    }\n  }\n}\n\n.widget-property-edit {\n  .value-types {\n    text-align: right;\n\n    label.radio {\n      margin-left: 8px;\n    }\n  }\n}\n', '.dashboard-settings {\n  position: fixed;\n  bottom: 6px;\n  right: 6px;\n  z-index: 200;\n}\n.dashboard-settings.link {\n  color: var(--f7-grid-resize-handler-bg-color);\n}\n.dashboard .row {\n  justify-content: space-evenly;\n}\n.dashboard .widget.widget-item .widget-inner {\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.dashboard .widget .widget-inner-error {\n  margin: 30px;\n  text-align: center;\n}\n.dashboard .widget.widget-group-empty .group {\n  background: var(--f7-text-editor-border-color);\n  height: 100px;\n}\n.dashboard .widget.widget-group-some:hover > .resize-handler {\n  right: 50%;\n}\n.dashboard .widget.widget-group-some:hover > .widget-toolbar {\n  right: 50%;\n}\n.dashboard .widget .resize-handler {\n  left: auto;\n  right: 0;\n  opacity: 0;\n  transition-duration: 400ms;\n}\n.dashboard .widget .widget-toolbar {\n  position: absolute;\n  top: 0;\n  right: 0;\n  opacity: 0;\n  transition-duration: 400ms;\n  z-index: 200;\n}\n.dashboard .widget .widget-toolbar a.link {\n  color: var(--f7-grid-resize-handler-bg-color);\n}\n.dashboard .widget .widget-toolbar a.link .icon {\n  font-size: 16px;\n}\n.dashboard .widget .widget-toolbar a.link + a.link {\n  margin-left: 8px;\n}\n.dashboard .widget:hover .resize-handler {\n  left: auto;\n  right: 0;\n  opacity: 1;\n}\n.dashboard .widget:hover .widget-toolbar {\n  opacity: 1;\n}\n.dashboard .widget[data-dragdrop-drop] {\n  background: var(--f7-text-editor-border-color);\n}\n.widget-property-edit .value-types {\n  text-align: right;\n}\n.widget-property-edit .value-types label.radio {\n  margin-left: 8px;\n}\n' ] }]), t.exports = e; }, function(t, e, r) {
  t.exports = function(t) {
    const e = []; return e.toString = function() {
      return this.map(function(e) {
        const r = function(t, e) {
          const r = t[1] || '',
            n = t[3]; if (!n) return r; if (e && typeof btoa === 'function') {
            const i = (a = n, s = btoa(unescape(encodeURIComponent(JSON.stringify(a)))), d = 'sourceMappingURL=data:application/json;charset=utf-8;base64,'.concat(s), '/*# '.concat(d, ' */')),
              o = n.sources.map(function(t) { return '/*# sourceURL='.concat(n.sourceRoot || '').concat(t, ' */'); }); return [ r ].concat(o).concat([ i ]).join('\n');
          } let a,
            s,
            d; return [ r ].join('\n');
        }(e, t); return e[2] ? '@media '.concat(e[2], ' {').concat(r, '}') : r;
      }).join('');
    }, e.i = function(t, r, n) { typeof t === 'string' && (t = [[ null, t, '' ]]); const i = {}; if (n) for (let o = 0; o < this.length; o++) { const a = this[o][0]; a != null && (i[a] = !0); } for (let s = 0; s < t.length; s++) { const d = [].concat(t[s]); n && i[d[0]] || (r && (d[2] ? d[2] = ''.concat(r, ' and ').concat(d[2]) : d[2] = r), e.push(d)); } }, e;
  };
}, function(t, e, r) { function n(t) { return r(10)('./'.concat(t, '.vue')).default; }r.r(e), e.default = [{ path: 'dashboard', component: n('dashboard') }, { path: 'dashboard/settings', component: n('dashboardSettings') }, { path: 'widget/add', component: n('widgetAdd') }, { path: 'widget/properties', component: n('widgetProperties') }, { path: 'widget/property/edit', component: n('widgetPropertyEdit') }, { path: 'widget/property/bind/add', component: n('widgetPropertyBindAdd') }]; }, function(t, e, r) { const n = { './dashboard.vue': 20, './dashboardSettings.vue': 18, './widgetAdd.vue': 19, './widgetProperties.vue': 21, './widgetPropertyBindAdd.vue': 22, './widgetPropertyEdit.vue': 23 }; function i(t) { const e = o(t); return r(e); } function o(t) { if (!r.o(n, t)) { const e = new Error("Cannot find module '" + t + "'"); throw e.code = 'MODULE_NOT_FOUND', e; } return n[t]; }i.keys = function() { return Object.keys(n); }, i.resolve = o, t.exports = i, i.id = 10; }, function(t, e, r) { r.r(e), e.default = function(t) { return { state: {}, getters: {}, mutations: {}, actions: {} }; }; }, function(t, e, r) { r.r(e), e.default = function(t) { return { profile: { default: { root: { widgets: [{ module: 'a-dashboard', name: 'widgetAbout' }] } }, meta: { widget: { properties: { title: { type: 1, value: '' }, widthSmall: { type: 1, value: 100 }, widthMedium: { type: 1, value: 50 }, widthLarge: { type: 1, value: 25 }, height: { type: 1, value: 'auto' } } }, group: { properties: { title: { type: 1, value: '' }, widthSmall: { type: 1, value: 100 }, widthMedium: { type: 1, value: 100 }, widthLarge: { type: 1, value: 100 }, height: { type: 1, value: 'auto' } } } } } }; }; }, function(t, e, r) { r.r(e), e.default = { 'en-us': r(14).default, 'zh-cn': r(15).default }; }, function(t, e, r) { r.r(e), e.default = { Profile2: 'Profile', CabloyAboutTip1: 'CabloyJS - The Ultimate NodeJS Full Stack Business Development Platform', CabloyAboutTip2: 'The frontend of CabloyJS uses VueJS + Framework7 + Webpack, while the backend uses KoaJS + EggJS, and the database uses MySQL', CabloyAboutTip3: 'Vertically, CabloyJS make the frontend and the backend work together to form an organic wholeness, so as to avoid working independently between them', CabloyAboutTip4: 'Horizontally, CabloyJS has refined a code organization mode called “business modularity”, which could offer a powerful basic framework for the continually growing business demands of large-scale web applications through different module combinations' }; }, function(t, e, r) { r.r(e), e.default = { Basic: '基本', Clone: '克隆', Dashboard: '仪表板', Delete: '删除', Default: '缺省', General: '通用', Group: '组', Height: '高度', Settings: '设置', Profile2: '配置', Property: '属性', Properties: '属性', Title: '标题', Static: '静态', Dynamic: '动态', Documentation: '文档', Community: '社区', CabloyAboutTip1: 'CabloyJS - 是一款顶级NodeJS全栈业务开发框架', CabloyAboutTip2: '前端采用VueJS + Framework7 + Webpack，后端采用KoaJS + EggJS，数据库采用MySQL', CabloyAboutTip3: '在纵向上，将前端和后端打通，形成一个有机的整体，避免前端和后端各自为政的状况', CabloyAboutTip4: '在横向上，提炼出“业务模块化”的代码组织模式，通过不同的模块组合实现业务开发，也为大型Web应用不断增长的业务需求提供有力的基础架构', 'About CabloyJS': '关于CabloyJS', 'Add Group': '添加组', 'Add Widget': '添加部件', 'Add Data Source': '添加数据源', 'Data Source': '数据源', 'Save As': '保存为', 'New Profile': '新建配置', 'Please specify the profile name': '请指定配置名称', 'Widget Not Found': '部件未发现', 'Source Widget Not Found': '源部件未发现', 'Width(Small)': '宽度(小页面)', 'Width(Medium)': '宽度(中页面)', 'Width(Large)': '宽度(大页面)', 'Source Widget': '源部件', 'Property Name': '属性名' }; }, function(t, e, r) { r.r(e); const n = r(2); e.default = function(t) { return { ebDashboardWidgetBase: Object(n.a)(t, !1) }; }; }, function(t, e, r) {
  r.r(e); r(1); const n = { render(t) {
      const e = this,
        r = []; return r.push(t('eb-link', { attrs: { iconMaterial: 'remove' }, props: { onPerform() { e.onWidgetDelete(e.widget); } } })), r.push(t('f7-link', { attrs: { iconMaterial: 'settings' }, on: { click() { e.onWidgetProperties(e.widget); } } })), r.push(t('f7-link', { attrs: { iconMaterial: 'open_with' }, directives: [{ name: 'eb-dragdrop', value: { scene: this.dragdropScene, widgetId: this.widget.id, onDragStart: this.onDragStart, onDragElement: this.onDragElement, onDropElement: this.onDropElement, onDropLeave: this.onDropLeave, onDropEnter: this.onDropEnter, onDragEnd: this.onDragEnd, onDragDone: this.onDragDone } }] })), t('div', { staticClass: '' }, r);
    }, props: { widget: { type: Object }, dragdropScene: { type: String }, onDragStart: { type: Function }, onDragElement: { type: Function }, onDropElement: { type: Function }, onDropLeave: { type: Function }, onDropEnter: { type: Function }, onDragEnd: { type: Function }, onDragDone: { type: Function }, onWidgetDelete: { type: Function }, onWidgetProperties: { type: Function } }, data() { return {}; }, methods: {} },
    i = r(0),
    o = Object(i.a)(n, void 0, void 0, !1, null, null, null).exports; function a(t) { return (a = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(t) { return typeof t; } : function(t) { return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t; })(t); } function s(t, e) {
    let r; if (typeof Symbol === 'undefined' || t[Symbol.iterator] == null) {
      if (Array.isArray(t) || (r = u(t)) || e && t && typeof t.length === 'number') {
        r && (t = r); let n = 0,
          i = function() {}; return { s: i, n() { return n >= t.length ? { done: !0 } : { done: !1, value: t[n++] }; }, e(t) { throw t; }, f: i };
      } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    } let o,
      a = !0,
      s = !1; return { s() { r = t[Symbol.iterator](); }, n() { const t = r.next(); return a = t.done, t; }, e(t) { s = !0, o = t; }, f() { try { a || r.return == null || r.return(); } finally { if (s) throw o; } } };
  } function d(t, e) {
    return function(t) { if (Array.isArray(t)) return t; }(t) || function(t, e) {
      if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(t))) return; let r = [],
        n = !0,
        i = !1,
        o = void 0; try { for (var a, s = t[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !e || r.length !== e); n = !0); } catch (t) { i = !0, o = t; } finally { try { n || s.return == null || s.return(); } finally { if (i) throw o; } } return r;
    }(t, e) || u(t, e) || function() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }();
  } function u(t, e) { if (t) { if (typeof t === 'string') return l(t, e); let r = Object.prototype.toString.call(t).slice(8, -1); return r === 'Object' && t.constructor && (r = t.constructor.name), r === 'Map' || r === 'Set' ? Array.from(t) : r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? l(t, e) : void 0; } } function l(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = new Array(e); r < e; r++)n[r] = t[r]; return n; } const c = [ 5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100 ],
    p = { meta: { global: !0 }, name: 'eb-dashboard-widget', components: { widgetToolbar: o }, render(t) {
      const e = [],
        r = t('widget-toolbar', { staticClass: 'widget-toolbar', props: { widget: this.options, dragdropScene: this.dragdropScene, onDragStart: this.onDragStart, onDragElement: this.onDragElement, onDropElement: this.onDropElement, onDropLeave: this.onDropLeave, onDropEnter: this.onDropEnter, onDragEnd: this.onDragEnd, onDragDone: this.onDragDone, onWidgetDelete: this.onWidgetDelete, onWidgetProperties: this.onWidgetProperties } }); e.push(r); const n = t('span', { staticClass: 'resize-handler', directives: [{ name: 'eb-dragdrop', value: { scene: this.dragdropSceneResize, resizable: !0, widgetId: this.options.id, onDragStart: this.onDragStartResizable, onDragMove: this.onDragMoveResizable } }] }); if (e.push(n), this.options.group) { const i = { widget: this, root: !1, dashboard: this.dashboard, widgets: this.options.widgets }; this.__combineWidgetProps(i), e.push(t('eb-dashboard-widget-group', { ref: 'group', props: i, on: { 'widgetReal:ready': this.__onWidgetRealReady, 'widgetReal:destroy': this.__onWidgetRealDestroy } })); } else if (!this.errorMessage && this.ready) { const o = { widget: this }; this.__combineWidgetProps(o), e.push(t(this.__getFullName(), { staticClass: 'widget-inner', props: o, style: { height: this.__getPropertyRealValue('height') }, on: { 'widgetReal:ready': this.__onWidgetRealReady, 'widgetReal:destroy': this.__onWidgetRealDestroy } })); } else this.errorMessage && e.push(t('div', { staticClass: 'widget-inner widget-inner-error', domProps: { innerText: this.errorMessage }, style: { height: this.__getPropertyRealValue('height') } })); return t('f7-col', { staticClass: this.__getClassName(), attrs: { 'data-widget-id': this.options.id }, props: { resizable: !0, resizableHandler: !1, width: this.__getPropertyRealValue('widthSmall'), medium: this.__getPropertyRealValue('widthMedium'), large: this.__getPropertyRealValue('widthLarge') } }, e);
    }, props: { dashboard: { type: Object }, group: { type: Object }, options: { type: Object }, dragdropSceneResize: { type: String }, dragdropScene: { type: String } }, data() { return { ready: !1, errorMessage: null }; }, created() { this.__init(); }, beforeDestroy() { this.$emit('widget:destroy'); }, methods: { __init() {
      const t = this; this.options.group || this.$meta.module.use(this.options.module, function(e) {
        let r = t.__getFullName(),
          n = e.options.components[t.options.name]; n ? (n = t.$meta.util.createComponentOptions(n), t.$options.components[r] = n, t.ready = !0, t.errorMessage = null) : (t.errorMessage = ''.concat(t.$text('Widget Not Found'), ': ').concat(r), t.ready = !1);
      });
    }, __onWidgetRealReady(t) { this.dashboard.__onWidgetRealReady(this.options.id, t); }, __onWidgetRealDestroy(t) { this.dashboard.__onWidgetRealDestroy(this.options.id, t); }, __getBindValue(t) { if (t && t.widgetId && t.propertyName) { const e = d(this.dashboard.__findWidgetRealById(t.widgetId), 1)[0]; if (e) return e.widgetReal[t.propertyName]; } }, __getBindsValue(t) {
      let e,
        r = [],
        n = s(t); try { for (n.s(); !(e = n.n()).done;) { const i = e.value; if (i.widgetId && i.propertyName) { const o = this.__getBindValue(i); r.push({ id: i.id, data: o }); } } } catch (t) { n.e(t); } finally { n.f(); } return r;
    }, __getPropertyReal2(t, e) { return t.properties[e]; }, __getPropertyReal(t) { return this.__getPropertyReal2(this.options, t); }, __convertPropertyRealValue(t, e, r) { if (r == null) return r; const n = this._getPropSchema(t, e); if (!n) return r; switch (n.type) { case 'number':return Number(r); case 'integer':return parseInt(r); case 'string':return r.toString(); case 'boolean':return r === 'true' || r !== 'false' && Boolean(r); case 'array':return typeof r === 'string' ? r.split(',') : r; default:return r; } }, __getPropertyRealValue2(t, e) {
      let r,
        n = this.__getPropertyReal2(t, e); if (n) return n.type === 1 ? r = n.value : n.type === 2 && (n.bind ? r = this.__getBindValue(n.bind) : n.binds && (r = this.__getBindsValue(n.binds))), e !== 'title' || r || (r = t.group ? this.$text('Group') : this.dashboard.__findWidgetStock(t).titleLocale), r = this.__convertPropertyRealValue(t, e, r);
    }, __getPropertyRealValue(t) { return this.__getPropertyRealValue2(this.options, t); }, __setPropertyRealValue2(t, e, r) {
      r || (r = {}), a(r) !== 'object' && (r = { type: 1, value: r }), r.type || (r.type = 1); const n = t.properties[e] || {},
        i = this.$meta.util.extend({}, n, r); return this.$set(t.properties, e, i), this.dashboard.__saveLayoutConfig(), i;
    }, __setPropertyRealValue(t, e) { return this.__setPropertyRealValue2(this.options, t, e); }, _getPropSchema(t, e) { const r = this._getPropsSchema(t); if (r) { const n = r.properties[e]; if (n) return n; } return null; }, _getAttrSchema(t, e) { const r = this._getAttrsSchema(t); if (r) { const n = r.properties[e]; if (n) return n; } return null; }, _getAttrsSchema(t) { if (t.group) return this.$options.components['eb-dashboard-widget-group'].options.meta.widget.schema.attrs; const e = this.$options.components[this.__getFullName(t)]; return e && e.meta && e.meta.widget && e.meta.widget.schema && e.meta.widget.schema.attrs || null; }, _getPropsSchema(t) { if (t.group) return this.$options.components['eb-dashboard-widget-group'].options.meta.widget.schema.props; const e = this.$options.components[this.__getFullName(t)]; return e && e.meta && e.meta.widget && e.meta.widget.schema && e.meta.widget.schema.props || null; }, _getPropsSchemaCategoryGrouping(t) {
      const e = this._getPropsSchema(t); if (!e) return [ null, null ]; const r = {}; for (const n in e.properties) {
        const i = e.properties[n],
          o = i.ebCategory || ''; r[o] || (r[o] = {}), r[o][n] = i;
      } return [ e, r ];
    }, __combineWidgetProps(t) { const e = this._getPropsSchema(this.options); this.__combineWidgetPropsSchema(t, e); }, __combineWidgetPropsSchema(t, e) { if (e) for (const r in e.properties)t[r] = this.__getPropertyRealValue(r); }, _getBindSourceTitle(t) { return t.widgetReal.widget.__getPropertyRealValue('title'); }, _getBindSourcePropertyTitle(t, e) { const r = this._getAttrSchema(t.widgetReal.widget.options, e); return r ? this.$text(r.ebTitle) : ''; }, _getBindSourceTitleAndPropertyTitle(t, e) { const r = d(this.dashboard.__findWidgetRealById(t), 1)[0]; return r ? [ this._getBindSourceTitle(r), this._getBindSourcePropertyTitle(r, e) ] : [ '', '' ]; }, __getClassName() { return this.options.group ? 'widget widget-id-'.concat(this.options.id, ' widget-group ').concat(this.options.widgets.length === 0 ? 'widget-group-empty' : 'widget-group-some') : 'widget widget-id-'.concat(this.options.id, ' widget-item widget-name-').concat(this.options.module, '-').concat(this.options.name); }, __getFullName(t) { return t || (t = this.options), ''.concat(t.module, ':').concat(t.name); }, onDragStartResizable(t) { t.$el; const e = t.context; t.dragElement; return { size: { width: this.$$(this.group.$el).width() }, tooltip: this.__getTooltipResizable(e) }; }, onDragMoveResizable(t) {
      t.$el; const e = t.context,
        r = t.diff,
        n = this.getViewSize(),
        i = n.replace(n[0], n[0].toUpperCase()),
        o = 'width'.concat(i),
        a = parseInt(100 * r.percent.x); if (a !== 0) {
        let s = a < 0,
          u = d(this.group.__getWidgetById(e.widgetId), 2),
          l = u[0],
          c = u[1],
          p = this.__getPropertyRealValue2(l, o),
          h = p + a; if (!(h = this.__getPreferWidth(p, h, !1, s))) return !1; if (p === h) return !1; this.__setPropertyRealValue2(l, o, h), this.dashboard.__saveLayoutConfig(); let f = this.__getPropertyRealValue2(l, o),
          g = this.group.widgets[c + 1]; if (g) {
          let y = this.__getPropertyRealValue2(g, o),
            m = y - (h - p); (m = this.__getPreferWidth(y, m, !0, !s)) && this.__setPropertyRealValue2(g, o, m), f = ''.concat(f, ':').concat(this.__getPropertyRealValue2(g, o));
        } return { eaten: !0, tooltip: f };
      }
    }, __getTooltipResizable(t) {
      let e,
        r = this.getViewSize(),
        n = r.replace(r[0], r[0].toUpperCase()),
        i = 'width'.concat(n),
        o = d(this.group.__getWidgetById(t.widgetId), 2),
        a = o[0],
        s = o[1]; e = this.__getPropertyRealValue2(a, i); const u = this.group.widgets[s + 1]; return u && (e = ''.concat(e, ':').concat(this.__getPropertyRealValue2(u, i))), e;
    }, getViewSize() { return this.$view.size; }, __getPreferWidth(t, e, r, n) {
      for (let i = r ? 5 : 2, o = 0; o < i; o++) {
        var a,
          d = s(c); try { for (d.s(); !(a = d.n()).done;) { const u = a.value; if (n && u < t && e - u <= o) return u; if (!n && u > t && u - e <= o) return u; } } catch (t) { d.e(t); } finally { d.f(); }
      } return null;
    }, onDragStart(t) {
      t.$el; const e = t.context,
        r = (t.dragElement, d(this.group.__getWidgetById(e.widgetId), 2)),
        n = r[0]; r[1]; return { tooltip: ''.concat(this.__getPropertyRealValue2(n, 'title')) };
    }, onDragElement(t) { t.$el; const e = t.context; return this.$$('.widget-id-'.concat(e.widgetId)); }, onDropElement(t) {
      t.$el; const e = t.context,
        r = (t.dragElement, t.dragContext),
        n = d(this.group.__getWidgetById(e.widgetId), 2),
        i = n[0],
        o = n[1],
        a = d(this.group.__getWidgetById(r.widgetId), 2),
        s = (a[0], a[1]); return o === s || o == s + 1 ? null : { dropElement: this.$$('.widget-id-'.concat(e.widgetId)), tooltip: this.__getPropertyRealValue2(i, 'title') };
    }, onDropLeave(t) { t.$el, t.context, t.dropElement; }, onDropEnter(t) { t.$el, t.context, t.dropElement; }, onDragEnd(t) { t.$el, t.context, t.dragElement; }, onDragDone(t) {
      t.$el; const e = t.context,
        r = (t.dragElement, t.dropElement, t.dropContext),
        n = d(this.group.__getWidgetById(e.widgetId), 2),
        i = n[0],
        o = n[1]; this.group.widgets.splice(o, 1); const a = d(this.group.__getWidgetById(r.widgetId), 2),
        s = (a[0], a[1]); this.group.widgets.splice(s, 0, i), this.dashboard.__saveLayoutConfig();
    }, onWidgetDelete(t) {
      const e = this; this.$view.dialog.confirm().then(function() {
        const r = d(e.group.__getWidgetById(t.id), 2),
          n = (r[0], r[1]); n !== -1 && (e.group.widgets.splice(n, 1), e.dashboard.__saveLayoutConfig());
      }).catch(function() {});
    }, onWidgetProperties(t) { this.$view.navigate('/a/dashboard/widget/properties?widgetId='.concat(this.options.id), { scene: 'sidebar', sceneOptions: { side: 'right', name: 'properties', title: 'Properties' }, context: { params: { dashboard: this.dashboard, widget: this } } }); }, onWidgetsAdd(t) {
      let e,
        r = s(t.widgets); try { for (r.s(); !(e = r.n()).done;) { const n = e.value; this.$refs.group.onWidgetAdd(n); } } catch (t) { r.e(t); } finally { r.f(); }
    } } },
    h = Object(i.a)(p, void 0, void 0, !1, null, null, null).exports,
    f = r(4); const g = { install(t) { return { mixins: [ t.prototype.$meta.module.get('a-dashboard').options.mixins.ebDashboardWidgetBase ] }; } },
    y = Object(i.a)(g, function() {
      const t = this,
        e = t.$createElement,
        r = t._self._c || e; return r('f7-card', [ r('f7-card-header', [ t._v(t._s(t.$text('About CabloyJS'))) ]), t._v(' '), r('f7-card-content', [ r('div', { staticClass: 'alert-info' }, [ t._v(t._s(t.$text('CabloyAboutTip1'))) ]), t._v(' '), r('p', [ t._v(t._s(t.$text('CabloyAboutTip2'))) ]), t._v(' '), r('p', [ t._v(t._s(t.$text('CabloyAboutTip3'))) ]), t._v(' '), r('p', [ t._v(t._s(t.$text('CabloyAboutTip4'))) ]) ]), t._v(' '), r('f7-card-footer', [ r('f7-link', { attrs: { external: '', target: '_blank', href: 'https://cabloy.com' } }, [ t._v(t._s(t.$text('Documentation'))) ]), t._v(' '), r('f7-link', { attrs: { external: '', target: '_blank', href: 'https://community.cabloy.com' } }, [ t._v(t._s(t.$text('Community'))) ]), t._v(' '), r('f7-link', { attrs: { external: '', target: '_blank', href: 'https://github.com/zhennann/cabloy' } }, [ t._v('GitHub') ]) ], 1) ], 1);
    }, [], !1, null, null, null).exports; e.default = { ebDashboardWidget: h, ebDashboardWidgetGroup: f.a, widgetAbout: y };
}, function(t, e, r) {
  r.r(e); const n = r(1),
    i = { mixins: [ r.n(n).a.prototype.$meta.module.get('a-components').options.mixins.ebPageContext ], data() { return { profileIdCurrent: parseInt(this.$f7route.query.profileId || 0), profiles: null }; }, computed: { dashboard() { return this.contextParams.dashboard; }, user() { return this.$store.state.auth.user; } }, created() { this.__init(); }, mounted() { this.dashboard.$on('dashboard:destroy', this.onDashboardDestroy); }, beforeDestroy() { this.dashboard.$off('dashboard:destroy', this.onDashboardDestroy); }, methods: { __init() {
      const t = this,
        e = [{ id: 0, profileName: this.$text('Default') }]; this.user.op.anonymous === 1 ? this.profiles = e : this.$api.post('profile/list').then(function(r) { t.profiles = e.concat(r); });
    }, onDashboardDestroy() { this.$view.close(); }, onPerformAddGroup() { this.dashboard.onGroupAdd(); }, onPerformAddWidget() { const t = this; this.$view.navigate('/a/dashboard/widget/add', { target: '_self', context: { callback(e, r) { e === 200 && t.dashboard.onWidgetsAdd(r); } } }); }, onPerformNewProfile() { const t = this; return this.$view.dialog.prompt(this.$text('Please specify the profile name')).then(function(e) { if (e) { const r = { profileName: e, profileValue: null }; return t.$api.post('profile/create', { data: r }).then(function(e) { return r.id = e.profileId, t.profiles.push(r), !0; }); } }); }, onPerformClone(t, e) { const r = this; if (e.id === this.profileIdCurrent) return this.$view.dialog.prompt(this.$text('Please specify the profile name')).then(function(e) { if (e) { const n = { profileName: e, profileValue: JSON.stringify(r.dashboard.profile) }; return r.$api.post('profile/create', { data: n }).then(function(e) { return n.id = e.profileId, r.profiles.push(n), r.$meta.util.swipeoutClose(t.target), !0; }); } }); }, onPerformDelete(t, e) { const r = this; if (e.id !== 0) return this.$view.dialog.confirm().then(function() { return r.$api.post('profile/delete', { profileId: e.id }).then(function() { const n = r.__getProfileIndexById(e.id); return r.profiles.splice(n, 1), r.$meta.util.swipeoutClose(t.target), !0; }); }); }, onPerformProfile(t, e) {
      const r = this,
        n = e.id; if (this.profileIdCurrent !== n) return this.dashboard.__switchProfile(n).then(function() { r.dashboard.__saveProfileId(), r.profileIdCurrent = n; });
    }, __getProfileIndexById(t) { return this.profiles.findIndex(function(e) { return e.id === t; }); }, __getProfileTitle(t) { return this.profileIdCurrent === t.id ? ''.concat(t.profileName, ' ⭐') : t.profileName; } } },
    o = r(0),
    a = Object(o.a)(i, function() {
      const t = this,
        e = t.$createElement,
        r = t._self._c || e; return r('eb-page', [ r('eb-navbar', { attrs: { title: t.$text('Profile2'), 'eb-back-link': 'Back' } }, [ r('f7-nav-right', [ t.user.op.anonymous !== 1 ? r('eb-link', { attrs: { iconMaterial: 'add', onPerform: t.onPerformNewProfile } }) : t._e() ], 1) ], 1), t._v(' '), r('f7-list', t._l(t.profiles, function(e) { return r('eb-list-item', { key: e.id, attrs: { title: e.profileName, radio: '', checked: e.id === t.profileIdCurrent, context: e, onPerform: t.onPerformProfile, swipeout: '' } }, [ r('eb-context-menu', [ r('div', { attrs: { slot: 'right' }, slot: 'right' }, [ t.user.op.anonymous !== 1 && e.id === t.profileIdCurrent ? r('div', { attrs: { color: 'orange', context: e, onPerform: t.onPerformClone } }, [ t._v(t._s(t.$text('Clone'))) ]) : t._e(), t._v(' '), t.user.op.anonymous !== 1 && e.id > 0 && e.id !== t.profileIdCurrent ? r('div', { attrs: { color: 'red', context: e, onPerform: t.onPerformDelete } }, [ t._v(t._s(t.$text('Delete'))) ]) : t._e() ]) ]) ], 1); }), 1), t._v(' '), r('f7-toolbar', { attrs: { 'bottom-md': '' } }, [ r('eb-button', { attrs: { onPerform: t.onPerformAddGroup } }, [ t._v(t._s(t.$text('Add Group'))) ]), t._v(' '), r('eb-button', { attrs: { onPerform: t.onPerformAddWidget } }, [ t._v(t._s(t.$text('Add Widget'))) ]) ], 1) ], 1);
    }, [], !1, null, null, null); e.default = a.exports;
}, function(t, e, r) {
  r.r(e); const n = r(1),
    i = { mixins: [ r.n(n).a.prototype.$meta.module.get('a-components').options.mixins.ebPageContext ], data() { return { widgetsSelected: [], widgetsUser: null }; }, created() { const t = this; this.$store.dispatch('a/base/getUserWidgets').then(function(e) { t.widgetsUser = e; }); }, methods: { onPerformDone() { this.widgetsSelected.length !== 0 && (this.contextCallback(200, { widgets: this.widgetsSelected }), this.$f7router.back()); }, onWidgetChange(t, e) { const r = this._getWidgetIndex(e); r === -1 ? this.widgetsSelected.push({ module: e.module, name: e.name }) : this.widgetsSelected.splice(r, 1); }, _widgetFullName(t) { return ''.concat(t.module, ':').concat(t.name); }, _getWidgetIndex(t) { const e = this; return this.widgetsSelected.findIndex(function(r) { return e._widgetFullName(t) === e._widgetFullName(r); }); }, getWidgetChecked(t) { return this._getWidgetIndex(t) > -1; } } },
    o = r(0),
    a = Object(o.a)(i, function() {
      const t = this,
        e = t.$createElement,
        r = t._self._c || e; return r('eb-page', [ r('eb-navbar', { attrs: { title: t.$text('Add Widget'), 'eb-back-link': 'Back' } }, [ r('f7-nav-right', [ t.widgetsSelected.length > 0 ? r('eb-link', { attrs: { iconMaterial: 'done', onPerform: t.onPerformDone } }) : t._e() ], 1) ], 1), t._v(' '), t.widgetsUser ? r('f7-list', t._l(t.widgetsUser, function(e) { return r('eb-list-item', { key: t._widgetFullName(e), attrs: { checkbox: '', checked: t.getWidgetChecked(e), title: e.titleLocale }, on: { change(r) { return t.onWidgetChange(r, e); } } }); }), 1) : t._e() ], 1);
    }, [], !1, null, null, null); e.default = a.exports;
}, function(t, e, r) {
  r.r(e); const n = r(4),
    i = r(1),
    o = r.n(i); function a(t, e) {
    return function(t) { if (Array.isArray(t)) return t; }(t) || function(t, e) {
      if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(t))) return; let r = [],
        n = !0,
        i = !1,
        o = void 0; try { for (var a, s = t[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !e || r.length !== e); n = !0); } catch (t) { i = !0, o = t; } finally { try { n || s.return == null || s.return(); } finally { if (i) throw o; } } return r;
    }(t, e) || d(t, e) || function() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }();
  } function s(t, e) {
    let r; if (typeof Symbol === 'undefined' || t[Symbol.iterator] == null) {
      if (Array.isArray(t) || (r = d(t)) || e && t && typeof t.length === 'number') {
        r && (t = r); let n = 0,
          i = function() {}; return { s: i, n() { return n >= t.length ? { done: !0 } : { done: !1, value: t[n++] }; }, e(t) { throw t; }, f: i };
      } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
    } let o,
      a = !0,
      s = !1; return { s() { r = t[Symbol.iterator](); }, n() { const t = r.next(); return a = t.done, t; }, e(t) { s = !0, o = t; }, f() { try { a || r.return == null || r.return(); } finally { if (s) throw o; } } };
  } function d(t, e) { if (t) { if (typeof t === 'string') return u(t, e); let r = Object.prototype.toString.call(t).slice(8, -1); return r === 'Object' && t.constructor && (r = t.constructor.name), r === 'Map' || r === 'Set' ? Array.from(t) : r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? u(t, e) : void 0; } } function u(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = new Array(e); r < e; r++)n[r] = t[r]; return n; } const l = { meta: { title: 'Dashboard' }, components: { widgetGroup: n.a }, render(t) { const e = []; return this.ready && (e.push(t('widget-group', { ref: 'group', props: { root: !0, dashboard: this, widgets: this.profile.root.widgets } })), e.push(t('f7-link', { staticClass: 'dashboard-settings', attrs: { iconMaterial: 'settings' }, on: { click: this.onClickSettings } }))), t('eb-page', { staticClass: 'dashboard dashboard-profile-'.concat(this.profileId) }, e); }, data() { return { ready: !1, widgetsAll: null, profile: null, profileId: 0, widgetsReal: [] }; }, created() { this.__init(); }, beforeDestroy() { this.$emit('dashboard:destroy'); }, methods: { __init() { const t = this; this.$store.dispatch('a/base/getWidgets').then(function(e) { t.widgetsAll = e, t.$store.dispatch('a/base/getLayoutConfig', 'a-dashboard').then(function(e) { const r = e.profileId || 0; t.__switchProfile(r).then(function() { t.ready = !0; }); }); }); }, __saveProfileId() { this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-dashboard', key: 'profileId', value: this.profileId }); }, __saveLayoutConfig: o.a.prototype.$meta.util.debounce(function() {
      const t = this,
        e = this.$meta.util.extend({}, this.profile); this.profileId === 0 ? (this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-dashboard', key: 'profile', value: e }), this.__saveProfileId()) : this.$api.post('profile/save', { profileId: this.profileId, profileValue: e }).then(function() { t.__saveProfileId(); });
    }, 1e3), __onTitleChange(t) { this.$view.$emit('view:title', { title: t }); }, __switchProfile(t) { const e = this; return new Promise(function(r, n) { t !== 0 ? e.$api.post('profile/item', { profileId: t }).then(function(n) { if (!n) throw new Error('Profile not found!'); let i; return i = n.profileValue ? JSON.parse(n.profileValue) : e.__getProfileEmpty(), e.profile = i, e.profileId = t, e.__onTitleChange(''.concat(e.$text('Dashboard'), '-').concat(n.profileName)), r(); }).catch(function(t) { return n(t); }) : e.$store.dispatch('a/base/getLayoutConfig', 'a-dashboard').then(function(n) { let i; return i = n.profile ? e.$meta.util.extend({}, n.profile) : e.__getProfileDefault(), e.profile = i, e.profileId = t, e.__onTitleChange(e.$text('Dashboard')), r(); }).catch(function(t) { return n(t); }); }); }, __getProfileDefault() {
      const t = this.$config.profile.default,
        e = this.$meta.util.extend({}, t); e.root.id || (e.root.id = this.__generateUUID()); let r,
        n = s(e.root.widgets); try { for (n.s(); !(r = n.n()).done;) { const i = r.value; this.__initWidget(i, 'widget'); } } catch (t) { n.e(t); } finally { n.f(); } return e;
    }, __getProfileEmpty() { return { root: { id: this.__generateUUID(), widgets: [] } }; }, __initWidget(t, e) { t.id || (t.id = this.__generateUUID()), t.properties || (t.properties = this.$meta.util.extend({}, this.$config.profile.meta[e].properties)); }, __findWidgetStock(t) { return t.group ? null : this.widgetsAll ? this.widgetsAll[t.module][t.name] : null; }, onClickSettings() { this.$view.navigate('/a/dashboard/dashboard/settings?profileId='.concat(this.profileId), { scene: 'sidebar', sceneOptions: { side: 'right', name: 'profile', title: 'Profile2' }, context: { params: { dashboard: this } } }); }, onWidgetsAdd(t) {
      let e,
        r = s(t.widgets); try { for (r.s(); !(e = r.n()).done;) { const n = e.value; this.$refs.group.onWidgetAdd(n); } } catch (t) { r.e(t); } finally { r.f(); }
    }, onGroupAdd() { const t = { group: !0, widgets: [] }; this.__initWidget(t, 'widget'), this.profile.root.widgets.push(t), this.__saveLayoutConfig(); }, __generateUUID() { let t = (new Date()).getTime(); return window.performance && typeof window.performance.now === 'function' && (t += performance.now()), 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(e) { const r = (t + 16 * Math.random()) % 16 | 0; return t = Math.floor(t / 16), (e == 'x' ? r : 3 & r | 8).toString(16); }); }, __onWidgetRealReady(t, e) { this.__onWidgetRealDestroy(), this.widgetsReal.push({ widgetId: t, widgetReal: e }); }, __onWidgetRealDestroy(t, e) {
      const r = a(this.__findWidgetRealById(t), 2),
        n = (r[0], r[1]); n > -1 && this.widgetsReal.splice(n, 1);
    }, __findWidgetRealById(t) { const e = this.widgetsReal.findIndex(function(e) { return e.widgetId === t; }); return e === -1 ? [ null, -1 ] : [ this.widgetsReal[e], e ]; } } },
    c = r(0),
    p = Object(c.a)(l, void 0, void 0, !1, null, null, null); e.default = p.exports;
}, function(t, e, r) {
  r.r(e); const n = r(1); function i(t, e) {
    return function(t) { if (Array.isArray(t)) return t; }(t) || function(t, e) {
      if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(t))) return; let r = [],
        n = !0,
        i = !1,
        o = void 0; try { for (var a, s = t[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !e || r.length !== e); n = !0); } catch (t) { i = !0, o = t; } finally { try { n || s.return == null || s.return(); } finally { if (i) throw o; } } return r;
    }(t, e) || function(t, e) { if (!t) return; if (typeof t === 'string') return o(t, e); let r = Object.prototype.toString.call(t).slice(8, -1); r === 'Object' && t.constructor && (r = t.constructor.name); if (r === 'Map' || r === 'Set') return Array.from(t); if (r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)) return o(t, e); }(t, e) || function() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }();
  } function o(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = new Array(e); r < e; r++)n[r] = t[r]; return n; } function a(t) { return (a = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function(t) { return typeof t; } : function(t) { return t && typeof Symbol === 'function' && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t; })(t); } const s = { mixins: [ r.n(n).a.prototype.$meta.module.get('a-components').options.mixins.ebPageContext ], data() { return { widgetId: this.$f7route.query.widgetId }; }, computed: { dashboard() { return this.contextParams.dashboard; }, widget() { return this.contextParams.widget; } }, mounted() { this.widget.$on('widget:destroy', this.onWidgetDestroy); }, beforeDestroy() { this.widget.$off('widget:destroy', this.onWidgetDestroy); }, render(t) { const e = []; return e.push(this._renderNavbar(t)), e.push(this._renderList(t)), this.widget.options.group && e.push(this._renderToolbar(t)), t('eb-page', {}, e); }, methods: { onWidgetDestroy() { this.$view.close(); }, onPerformAddWidget() { const t = this; this.$view.navigate('/a/dashboard/widget/add', { target: '_self', context: { callback(e, r) { e === 200 && t.widget.onWidgetsAdd(r); } } }); }, onPerformPropertyEdit(t, e) {
      const r = e.propertySchema,
        n = e.propertyName; this.$view.navigate('/a/dashboard/widget/property/edit?widgetId='.concat(this.widgetId, '&propertyName=').concat(n), { target: '_self', context: { params: { dashboard: this.dashboard, widget: this.widget, propertySchema: r }, callback(t, e) {} } });
    }, _getSchemaData(t) { const e = {}; for (const r in t.properties) { t.properties[r]; const n = this.widget.__getPropertyRealValue(r); n && (Array.isArray(n) || a(n) === 'object') ? e[r] = '➡️' : e[r] = n; } return e; }, _getPageTitle() { return ''.concat(this.$text('Properties'), ': ').concat(this.widget.__getPropertyRealValue('title')); }, _renderNavbar(t) { return t('eb-navbar', { props: { title: this._getPageTitle(), ebBackLink: 'Back' } }); }, _renderToolbar(t) { const e = []; return e.push(t('div')), e.push(t('eb-button', { props: { text: this.$text('Add Widget'), onPerform: this.onPerformAddWidget } })), t('f7-toolbar', { props: { bottomMd: !0 } }, e); }, _renderListGroup(t) {
      const e = t.c,
        r = t.title,
        n = t.opened,
        i = t.propsSchema,
        o = []; for (const a in i) {
        const s = i[a],
          d = e('eb-list-item-validate', { props: { dataKey: a } }),
          u = e('eb-link', { staticClass: 'no-ripple display-block', props: { context: { propertySchema: s, propertyName: a }, onPerform: this.onPerformPropertyEdit } }, [ d ]); o.push(u);
      } const l = e('f7-list', { props: { inset: !0 } }, o),
        c = e('f7-accordion-content', {}, [ l ]); return e('f7-list-item', { props: { title: this.$text(r), accordionItem: !0, accordionItemOpened: n } }, [ c ]);
    }, _renderList(t) {
      const e = i(this.widget._getPropsSchemaCategoryGrouping(this.widget.options), 2),
        r = e[0],
        n = e[1],
        o = Object.keys(n).length === 1,
        a = this._getSchemaData(r),
        s = []; for (const d in n)s.push(this._renderListGroup({ c: t, title: d || 'General', opened: d !== 'Basic' || o, propsSchema: n[d] })); const u = t('eb-list', { props: { noHairlinesMd: !0, accordionList: !0 } }, s); return t('eb-validate', { ref: 'validate', props: { auto: !1, readOnly: !0, data: a, meta: { schema: r } } }, [ u ]);
    } } },
    d = r(0),
    u = Object(d.a)(s, void 0, void 0, !1, null, null, null); e.default = u.exports;
}, function(t, e, r) {
  r.r(e); const n = r(3),
    i = r(1),
    o = { mixins: [ r.n(i).a.prototype.$meta.module.get('a-components').options.mixins.ebPageContext ], components: { widgetPropertyEditDynamic: n.a }, data() { return { widgetId: this.$f7route.query.widgetId, propertyName: this.$f7route.query.propertyName }; }, computed: { dashboard() { return this.contextParams.dashboard; }, widget() { return this.contextParams.widget; }, propertySchema() { return this.contextParams.propertySchema; }, propertyBind() { return this.contextParams.propertyBind; } }, created() {}, render(t) { const e = []; return e.push(this._renderNavbar(t)), e.push(this._renderValueDynamicSingle(t, this.propertyBind)), t('eb-page', {}, e); }, methods: { _getPageTitle() { return this.$text('Data Source'); }, _onBindChange(t) { this.contextCallback(200, t); }, _renderNavbar(t) { return t('eb-navbar', { props: { title: this._getPageTitle(), ebBackLink: 'Back' } }); }, _renderValueDynamicSingle(t, e) { return t('widget-property-edit-dynamic', { props: { dashboard: this.dashboard, widget: this.widget, widgetId: this.widgetId, propertyName: this.propertyName, propertyBind: e }, on: { 'bind:change': this._onBindChange } }); } } },
    a = r(0),
    s = Object(a.a)(o, void 0, void 0, !1, null, null, null); e.default = s.exports;
}, function(t, e, r) {
  r.r(e); const n = r(3),
    i = r(1),
    o = r.n(i); function a(t, e, r) { return e in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t; } function s(t, e) {
    return function(t) { if (Array.isArray(t)) return t; }(t) || function(t, e) {
      if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(t))) return; let r = [],
        n = !0,
        i = !1,
        o = void 0; try { for (var a, s = t[Symbol.iterator](); !(n = (a = s.next()).done) && (r.push(a.value), !e || r.length !== e); n = !0); } catch (t) { i = !0, o = t; } finally { try { n || s.return == null || s.return(); } finally { if (i) throw o; } } return r;
    }(t, e) || d(t, e) || function() { throw new TypeError('Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'); }();
  } function d(t, e) { if (t) { if (typeof t === 'string') return u(t, e); let r = Object.prototype.toString.call(t).slice(8, -1); return r === 'Object' && t.constructor && (r = t.constructor.name), r === 'Map' || r === 'Set' ? Array.from(t) : r === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? u(t, e) : void 0; } } function u(t, e) { (e == null || e > t.length) && (e = t.length); for (var r = 0, n = new Array(e); r < e; r++)n[r] = t[r]; return n; } const l = { mixins: [ o.a.prototype.$meta.module.get('a-components').options.mixins.ebPageContext ], components: { widgetPropertyEditDynamic: n.a }, data() { return { widgetId: this.$f7route.query.widgetId, propertyName: this.$f7route.query.propertyName }; }, computed: { dashboard() { return this.contextParams.dashboard; }, widget() { return this.contextParams.widget; }, propertySchema() { return this.contextParams.propertySchema; } }, created() {}, render(t) {
      const e = [],
        r = this.widget.__getPropertyReal(this.propertyName),
        n = this.propertySchema.ebBindOnly || r && r.type === 2; return e.push(this._renderNavbar(t)), this.propertySchema.ebBindArray && e.push(this._renderToolbar(t)), e.push(this._renderValueTypes(t, r, n)), n ? e.push(this._renderValueDynamic(t, r)) : e.push(this._renderValueStatic(t, r)), t('eb-page', { staticClass: 'widget-property-edit' }, e);
    }, methods: { _getPageTitle() { return ''.concat(this.$text('Property'), ': ').concat(this.$text(this.propertySchema.ebTitle)); }, _setPropertyValue: o.a.prototype.$meta.util.debounce(function(t) { this.widget.__setPropertyRealValue(this.propertyName, t); }, 600), _onChangeValueType(t) { this._setPropertyValue({ type: t ? 2 : 1 }); }, _onBindChange(t) {
      if (this.propertySchema.ebBindArray) {
        const e = this.widget.__getPropertyReal(this.propertyName),
          r = e && e.binds || [],
          n = r.findIndex(function(e) { return e.id === t.id; }); n > -1 ? r.splice(n, 1, t) : r.push(t), this._setPropertyValue({ type: 2, binds: r });
      } else this._setPropertyValue({ type: 2, bind: t });
    }, _onPerformBindDelete(t, e) {
      const r = this.widget.__getPropertyReal(this.propertyName),
        n = r && r.binds || [],
        i = n.findIndex(function(t) { return t.id === e.id; }); i > -1 && (n.splice(i, 1), this._setPropertyValue({ type: 2, binds: n })), this.$meta.util.swipeoutClose(t.target);
    }, _onPerformBindEdit(t, e) { this._bindAddOrEdit(e), this.$meta.util.swipeoutClose(t.target); }, _onPerformBindAdd() { this._bindAddOrEdit({ id: this.dashboard.__generateUUID() }); }, _bindAddOrEdit(t) { const e = this; this.$view.navigate('/a/dashboard/widget/property/bind/add?widgetId='.concat(this.widgetId, '&propertyName=').concat(this.propertyName), { target: '_self', context: { params: { dashboard: this.dashboard, widget: this.widget, propertySchema: this.propertySchema, propertyBind: t }, callback(t, r) { t === 200 && e._onBindChange(r); } } }); }, _renderNavbar(t) { return t('eb-navbar', { props: { title: this._getPageTitle(), ebBackLink: 'Back' } }); }, _renderToolbar(t) { const e = []; return e.push(t('div')), e.push(t('eb-button', { props: { text: this.$text('Add Data Source'), onPerform: this._onPerformBindAdd } })), t('f7-toolbar', { props: { bottomMd: !0 } }, e); }, _renderValueDynamicArray(t, e) {
      const r = []; if (e) {
        let n,
          i = function(t, e) {
            let r; if (typeof Symbol === 'undefined' || t[Symbol.iterator] == null) {
              if (Array.isArray(t) || (r = d(t)) || e && t && typeof t.length === 'number') {
                r && (t = r); let n = 0,
                  i = function() {}; return { s: i, n() { return n >= t.length ? { done: !0 } : { done: !1, value: t[n++] }; }, e(t) { throw t; }, f: i };
              } throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.');
            } let o,
              a = !0,
              s = !1; return { s() { r = t[Symbol.iterator](); }, n() { const t = r.next(); return a = t.done, t; }, e(t) { s = !0, o = t; }, f() { try { a || r.return == null || r.return(); } finally { if (s) throw o; } } };
          }(e); try {
          for (i.s(); !(n = i.n()).done;) {
            const o = n.value,
              a = []; a.push(t('div', { attrs: { color: 'orange', context: o, onPerform: this._onPerformBindEdit } }, [ t('span', { domProps: { innerText: this.$text('Edit') } }) ])), a.push(t('div', { attrs: { color: 'red', context: o, onPerform: this._onPerformBindDelete } }, [ t('span', { domProps: { innerText: this.$text('Delete') } }) ])); const u = t('div', { slot: 'right' }, a),
              l = t('eb-context-menu', {}, [ u ]),
              c = s(this.widget._getBindSourceTitleAndPropertyTitle(o.widgetId, o.propertyName), 2),
              p = c[0],
              h = c[1]; r.push(t('eb-list-item', { key: o.id, props: { title: h, after: p, swipeout: !0 } }, [ l ]));
          }
        } catch (t) { i.e(t); } finally { i.f(); }
      } return t('f7-list', {}, r);
    }, _renderValueDynamicSingle(t, e) { return t('widget-property-edit-dynamic', { props: { dashboard: this.dashboard, widget: this.widget, widgetId: this.widgetId, propertyName: this.propertyName, propertyBind: e }, on: { 'bind:change': this._onBindChange } }); }, _renderValueDynamic(t, e) { return this.propertySchema.ebBindArray ? this._renderValueDynamicArray(t, e && e.binds) : this._renderValueDynamicSingle(t, e && e.bind); }, _renderValueStatic(t, e) {
      const r = this,
        n = { type: 'object', properties: a({}, this.propertyName, this.propertySchema) }; return t('eb-validate', { ref: 'validate', props: { auto: !0, readOnly: !1, data: a({}, this.propertyName, this.widget.__getPropertyRealValue(this.propertyName)), meta: { schema: n, hint: { optional: '', must: '' } } }, on: { 'validateItem:change': function(t, e) { return r._setPropertyValue({ type: 1, value: e }); } } });
    }, _renderValueTypes(t, e, r) {
      const n = this,
        i = []; return this.propertySchema.ebBindOnly || (i.push(t('f7-radio', { props: { name: 'valueType', value: 'static', checked: !r }, on: { change() { return n._onChangeValueType(!1); } } })), i.push(t('span', { domProps: { innerText: this.$text('Static') } }))), i.push(t('f7-radio', { props: { name: 'valueType', value: 'dynamic', checked: r }, on: { change() { return n._onChangeValueType(!0); } } })), i.push(t('span', { domProps: { innerText: this.$text('Dynamic') } })), t('f7-block', { staticClass: 'value-types' }, i);
    } } },
    c = r(0),
    p = Object(c.a)(l, void 0, void 0, !1, null, null, null); e.default = p.exports;
}, function(t, e, r) {
  function n(t, e) {
    for (var r = [], n = {}, i = 0; i < e.length; i++) {
      const o = e[i],
        a = o[0],
        s = { id: t + ':' + i, css: o[1], media: o[2], sourceMap: o[3] }; n[a] ? n[a].parts.push(s) : r.push(n[a] = { id: a, parts: [ s ] });
    } return r;
  }r.r(e), r.d(e, 'default', function() { return h; }); const i = typeof document !== 'undefined'; if (typeof DEBUG !== 'undefined' && DEBUG && !i) throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."); let o = {},
    a = i && (document.head || document.getElementsByTagName('head')[0]),
    s = null,
    d = 0,
    u = !1,
    l = function() {},
    c = null,
    p = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase()); function h(t, e, r, i) { u = r, c = i || {}; let a = n(t, e); return f(a), function(e) { for (var r = [], i = 0; i < a.length; i++) { const s = a[i]; (d = o[s.id]).refs--, r.push(d); }e ? f(a = n(t, e)) : a = []; for (i = 0; i < r.length; i++) { var d; if ((d = r[i]).refs === 0) { for (let u = 0; u < d.parts.length; u++)d.parts[u](); delete o[d.id]; } } }; } function f(t) {
    for (let e = 0; e < t.length; e++) {
      const r = t[e],
        n = o[r.id]; if (n) { n.refs++; for (var i = 0; i < n.parts.length; i++)n.parts[i](r.parts[i]); for (;i < r.parts.length; i++)n.parts.push(y(r.parts[i])); n.parts.length > r.parts.length && (n.parts.length = r.parts.length); } else { const a = []; for (i = 0; i < r.parts.length; i++)a.push(y(r.parts[i])); o[r.id] = { id: r.id, refs: 1, parts: a }; }
    }
  } function g() { const t = document.createElement('style'); return t.type = 'text/css', a.appendChild(t), t; } function y(t) {
    let e,
      r,
      n = document.querySelector('style[data-vue-ssr-id~="' + t.id + '"]'); if (n) { if (u) return l; n.parentNode.removeChild(n); } if (p) { const i = d++; n = s || (s = g()), e = v.bind(null, n, i, !1), r = v.bind(null, n, i, !0); } else n = g(), e = w.bind(null, n), r = function() { n.parentNode.removeChild(n); }; return e(t), function(n) { if (n) { if (n.css === t.css && n.media === t.media && n.sourceMap === t.sourceMap) return; e(t = n); } else r(); };
  } let m,
    b = (m = [], function(t, e) { return m[t] = e, m.filter(Boolean).join('\n'); }); function v(t, e, r, n) {
    const i = r ? '' : n.css; if (t.styleSheet)t.styleSheet.cssText = b(e, i); else {
      const o = document.createTextNode(i),
        a = t.childNodes; a[e] && t.removeChild(a[e]), a.length ? t.insertBefore(o, a[e]) : t.appendChild(o);
    }
  } function w(t, e) {
    let r = e.css,
      n = e.media,
      i = e.sourceMap; if (n && t.setAttribute('media', n), c.ssrId && t.setAttribute('data-vue-ssr-id', e.id), i && (r += '\n/*# sourceURL=' + i.sources[0] + ' */', r += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(i)))) + ' */'), t.styleSheet)t.styleSheet.cssText = r; else { for (;t.firstChild;)t.removeChild(t.firstChild); t.appendChild(document.createTextNode(r)); }
  }
} ]);

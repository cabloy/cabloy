import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, w as Use } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { n as RouterView, o as init_vue_router } from "./vue-router-DATdBaOJ.js";
//#region src/suite-vendor/a-zova/modules/a-app/src/component/app/controller.tsx
function _initializerDefineProperty(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerApp, ControllerApp;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_vue_router();
	init_src$2();
	ControllerApp = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "a-app" }), _dec3 = Use("a-behavior.bean.behaviorsHolder"), _dec4 = Reflect.metadata("design:type", typeof BeanBehaviorsHolder === "undefined" ? Object : BeanBehaviorsHolder), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerApp = class ControllerApp extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$beanBehaviorsHolder", _descriptor, this);
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this._initMeta();
				yield _this._initBehaviors();
			})();
		}
		_initMeta() {
			this.$useMeta(() => {
				return {
					title: this.sys.env.APP_TITLE,
					meta: {
						description: {
							name: "description",
							content: this.sys.env.APP_DESCRIPTION
						},
						viewport: {
							name: "viewport",
							content: this.sys.env.APP_META_VIEWPORT
						}
					},
					htmlAttr: { lang: this.app.meta.locale.current }
				};
			});
		}
		_initBehaviors() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.$$beanBehaviorsHolder.initialize({
					behaviorTag: void 0,
					behaviors: () => {
						return _this2._getAppBehaviors();
					}
				});
			})();
		}
		_getAppBehaviors() {
			return this.scope.config.behaviors;
		}
		render() {
			return this.$$beanBehaviorsHolder.render(() => {
				return createVNode(RouterView, null, null);
			});
		}
	}, _ControllerApp.$componentOptions = { inheritAttrs: false }, _ControllerApp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$beanBehaviorsHolder", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-app/src/.metadata/component/app.ts
var ZApp;
var init_app = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZApp = defineComponent((_props) => {
		useController(ControllerApp, void 0, void 0);
		return () => {};
	}, prepareComponentOptions(ControllerApp.$componentOptions));
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-app/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { behaviors: {} };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-app/src/.metadata/index.ts
/** config: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleAApp;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_app();
	init_app();
	init_config();
	init_src$2();
	components = { "app": ZApp };
	ScopeModuleAApp = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-app" }), _dec(_class = _dec2(_class = class ScopeModuleAApp extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-app/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerApp: () => ControllerApp,
	ScopeModuleAApp: () => ScopeModuleAApp,
	ZApp: () => ZApp,
	components: () => components,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };

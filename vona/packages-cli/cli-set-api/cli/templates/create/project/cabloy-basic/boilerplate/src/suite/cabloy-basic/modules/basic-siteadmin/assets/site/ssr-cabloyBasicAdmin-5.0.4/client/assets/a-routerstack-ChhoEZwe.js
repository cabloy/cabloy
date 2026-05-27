import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, w as Use, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Model, o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { r as BeanRouterViewBase, t as init_src$4 } from "./a-router-ZH9r7SU3.js";
import { n as mutate, t as init_src$5 } from "./zova-BHaXQJg22.js";
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/model/stack.ts
var _dec$2, _dec2$2, _class$2, ModelStack$1;
var init_stack$1 = __esmMin((() => {
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_src$5();
	init_src$3();
	ModelStack$1 = (_dec$2 = Model({
		enableSelector: true,
		max: -1
	}), _dec2$2 = BeanInfo({ module: "a-routerstack" }), _dec$2(_class$2 = _dec2$2(_class$2 = class ModelStack extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this.stackOptions = void 0;
			this.tabs = void 0;
			this.keepAliveInclude = void 0;
		}
		__init__(scene, options) {
			var _superprop_get__init__ = () => super.__init__, _this = this;
			return _asyncToGenerator(function* () {
				yield _superprop_get__init__().call(_this, scene);
				_this.bean._setBean("$$modelStack", _this);
				_this.stackOptions = deepExtend({}, _this.$onionOptions, options);
				_this.tabs = [];
				_this.keepAliveInclude = _this.$computed(() => {
					return _this._getKeepAliveInclude();
				});
				if (_this.$currentRoute) _this.forwardRoute(_this.$currentRoute);
			})();
		}
		addTab(tab) {
			return this._addTab(tab);
		}
		_addTab(tab) {
			const tabKey = tab.tabKey;
			if (!tabKey) return false;
			const [index, tabOld] = this.findTab(tabKey);
			if (index === -1) {
				const tabNew = {
					tabKey,
					updatedAt: Date.now()
				};
				this.tabs = mutate(this.tabs, (copyState) => {
					copyState.push(tabNew);
				});
				this.pruneTabs();
			} else {
				if (!this._checkIfTabNeedUpdate(tabOld, tab)) return false;
				this.updateTab(tab);
			}
			return true;
		}
		findTab(tabKey) {
			if (!tabKey) return [-1, void 0];
			const index = this.tabs.findIndex((item) => item.tabKey === tabKey);
			if (index === -1) return [index, void 0];
			return [index, this.tabs[index]];
		}
		deleteTab(tabKey) {
			if (!tabKey) return false;
			const [index] = this.findTab(tabKey);
			if (index === -1) return false;
			this.tabs = mutate(this.tabs, (copyState) => {
				copyState.splice(index, 1);
			});
			return true;
		}
		updateTab(tab) {
			const tabKey = tab.tabKey;
			const [index, tabOld] = this.findTab(tabKey);
			if (index === -1 || !tabOld) return;
			const tabNew = _objectSpread2(_objectSpread2({}, tabOld), {}, {
				tabKey,
				updatedAt: Date.now()
			});
			this.tabs = mutate(this.tabs, (copyState) => {
				copyState.splice(index, 1, tabNew);
			});
		}
		pruneTabs() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				let max = _this2.stackOptions.max;
				if (max === void 0 || max === -1) return;
				if (max < 1) max = 1;
				while (true) {
					if (_this2.tabs.length <= max) break;
					let tabKey;
					let updatedAt = Date.now();
					for (const tab of _this2.tabs) if (tab.updatedAt < updatedAt) {
						tabKey = tab.tabKey;
						updatedAt = tab.updatedAt;
					}
					if (!tabKey) break;
					_this2.deleteTab(tabKey);
				}
			})();
		}
		_checkIfTabNeedUpdate(tabOld, _tabNew) {
			if (this.tabs.findIndex((item) => {
				var _item$updatedAt, _tabOld$updatedAt;
				return item.tabKey !== tabOld.tabKey && ((_item$updatedAt = item.updatedAt) !== null && _item$updatedAt !== void 0 ? _item$updatedAt : 0) >= ((_tabOld$updatedAt = tabOld.updatedAt) !== null && _tabOld$updatedAt !== void 0 ? _tabOld$updatedAt : 0);
			}) > -1) return true;
			return false;
		}
		_getKeepAliveInclude() {
			const include = [];
			for (const tab of this.tabs) if (!include.includes(tab.tabKey)) include.push(tab.tabKey);
			return include;
		}
		backRoute(route) {
			this.deleteTab(route.fullPath);
		}
		forwardRoute(route) {
			const componentMeta = this.prepareRouteMeta(route);
			this.addTab(componentMeta);
		}
		prepareRouteMeta(route) {
			const fullPath = route.fullPath;
			return {
				tabKey: fullPath,
				componentKey: fullPath,
				fullPath
			};
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/component/routerViewStack/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerRouterViewStack, ControllerRouterViewStack;
var init_controller = __esmMin((() => {
	init_src$1();
	init_src$2();
	init_src$4();
	ControllerRouterViewStack = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "a-routerstack" }), _dec3 = Use({ injectionScope: "skipSelf" }), _dec4 = Reflect.metadata("design:type", typeof ModelStack === "undefined" ? Object : ModelStack), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerRouterViewStack = class ControllerRouterViewStack extends BeanRouterViewBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$modelStack", _descriptor, this);
		}
		backRoute(route) {
			this.$$modelStack.backRoute(route);
			return true;
		}
		forwardRoute(route) {
			this.$$modelStack.forwardRoute(route);
			return true;
		}
		prepareRouteMeta(route) {
			return this.$$modelStack.prepareRouteMeta(route);
		}
		getKeepAliveInclude() {
			return this.$$modelStack.keepAliveInclude;
		}
	}, _ControllerRouterViewStack.$propsDefault = {}, _ControllerRouterViewStack), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$modelStack", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/.metadata/component/routerViewStack.ts
var ZRouterViewStack;
var init_routerViewStack = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZRouterViewStack = defineComponent((_props) => {
		useController(ControllerRouterViewStack, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/.metadata/index.ts
/** components: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleARouterstack;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_stack$1();
	init_src$3();
	init_controller();
	init_routerViewStack();
	init_routerViewStack();
	init_src$2();
	components = { "routerViewStack": ZRouterViewStack };
	ScopeModuleARouterstack = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-routerstack" }), _dec(_class = _dec2(_class = class ScopeModuleARouterstack extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/types/stack.ts
var init_stack = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/types/index.ts
var init_types = __esmMin((() => {
	init_stack();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routerstack/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerRouterViewStack: () => ControllerRouterViewStack,
	ModelStack: () => ModelStack$1,
	ScopeModuleARouterstack: () => ScopeModuleARouterstack,
	ZRouterViewStack: () => ZRouterViewStack,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { src_exports as n, init_src as t };

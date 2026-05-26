import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { b as BeanControllerBase, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, p as createZovaComponentAsync, w as Use } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite/a-home/modules/home-layoutempty/src/component/layoutEmpty/controller.tsx
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
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerLayoutEmpty, ZRouterViewEmpty, ControllerLayoutEmpty;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_src$2();
	ZRouterViewEmpty = createZovaComponentAsync("a-router", "routerViewEmpty");
	ControllerLayoutEmpty = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "home-layoutempty" }), _dec3 = Use({
		init: { arg: { sidebarLeftOpenPC: false } },
		beanFullName: "home-base.service.ssrLayout"
	}), _dec4 = Reflect.metadata("design:type", typeof ServiceSsrLayout === "undefined" ? Object : ServiceSsrLayout), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerLayoutEmpty = class ControllerLayoutEmpty extends BeanControllerBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$serviceSsrLayout", _descriptor, this);
		}
		render() {
			return createVNode(ZRouterViewEmpty, null, null);
		}
	}, _ControllerLayoutEmpty.$propsDefault = {}, _ControllerLayoutEmpty), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$serviceSsrLayout", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-home/modules/home-layoutempty/src/.metadata/component/layoutEmpty.ts
var ZLayoutEmpty;
var init_layoutEmpty = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZLayoutEmpty = defineComponent((_props) => {
		useController(ControllerLayoutEmpty, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite/a-home/modules/home-layoutempty/src/.metadata/index.ts
/** components: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleHomeLayoutempty;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_layoutEmpty();
	init_layoutEmpty();
	init_src$2();
	components = { "layoutEmpty": ZLayoutEmpty };
	ScopeModuleHomeLayoutempty = (_dec = Scope(), _dec2 = BeanInfo({ module: "home-layoutempty" }), _dec(_class = _dec2(_class = class ScopeModuleHomeLayoutempty extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-layoutempty/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerLayoutEmpty: () => ControllerLayoutEmpty,
	ScopeModuleHomeLayoutempty: () => ScopeModuleHomeLayoutempty,
	ZLayoutEmpty: () => ZLayoutEmpty,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };

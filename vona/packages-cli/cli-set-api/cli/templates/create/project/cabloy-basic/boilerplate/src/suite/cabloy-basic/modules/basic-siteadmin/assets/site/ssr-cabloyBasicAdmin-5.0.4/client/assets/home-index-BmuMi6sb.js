import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { c as createTextVNode, l as createVNode } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { _ as BeanControllerPageBase, k as BeanInfo, m as BeanScopeBase, s as createZovaComponentPage } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite/a-home/modules/home-index/src/page/home/controller.tsx
var _dec$1, _dec2$1, _class$1, ControllerPageHome;
var init_controller = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerPageHome = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "home-index" }), _dec$1(_class$1 = _dec2$1(_class$1 = class ControllerPageHome extends BeanControllerPageBase {
		constructor(...args) {
			super(...args);
			this.message = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.message = "Hello Zova";
			})();
		}
		render() {
			return createVNode("div", { "style": "text-align: center;" }, [createVNode("div", null, [createVNode("div", { "style": "font-size: 36px;" }, [this.message]), createVNode("div", { "style": "font-size: 24px;opacity:.4;" }, [createTextVNode("Less is more, while more is less")])])]);
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-home/modules/home-index/src/.metadata/page/home.ts
var ZPageHome;
var init_home = __esmMin((() => {
	init_src$1();
	init_controller();
	ZPageHome = createZovaComponentPage(ControllerPageHome, void 0, void 0);
}));
//#endregion
//#region src/suite/a-home/modules/home-index/src/routes.ts
var routes;
var init_routes = __esmMin((() => {
	init_home();
	routes = [{
		path: "",
		component: ZPageHome
	}];
}));
//#endregion
//#region src/suite/a-home/modules/home-index/src/.metadata/index.ts
/** pages: end */
/** scope: begin */
var _dec, _dec2, _class, pagePathSchemas, pageNameSchemas, ScopeModuleHomeIndex;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_home();
	init_routes();
	init_src$2();
	pagePathSchemas = {};
	pageNameSchemas = {};
	ScopeModuleHomeIndex = (_dec = Scope(), _dec2 = BeanInfo({ module: "home-index" }), _dec(_class = _dec2(_class = class ScopeModuleHomeIndex extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-index/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerPageHome: () => ControllerPageHome,
	ScopeModuleHomeIndex: () => ScopeModuleHomeIndex,
	ZPageHome: () => ZPageHome,
	pageNameSchemas: () => pageNameSchemas,
	pagePathSchemas: () => pagePathSchemas,
	routes: () => routes
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };

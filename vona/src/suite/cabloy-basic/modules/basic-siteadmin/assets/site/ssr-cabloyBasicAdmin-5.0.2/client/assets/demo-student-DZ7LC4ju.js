import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { _ as BeanControllerPageBase, k as BeanInfo, m as BeanScopeBase, s as createZovaComponentPage } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/module/demo-student/src/page/test/controller.tsx
var _dec$1, _dec2$1, _class$1, ControllerPageTest;
var init_controller = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ControllerPageTest = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "demo-student" }), _dec$1(_class$1 = _dec2$1(_class$1 = class ControllerPageTest extends BeanControllerPageBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		render() {
			return null;
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/module/demo-student/src/.metadata/page/test.ts
var ZPageTest;
var init_test = __esmMin((() => {
	init_src$1();
	init_controller();
	ZPageTest = createZovaComponentPage(ControllerPageTest, void 0, void 0);
}));
//#endregion
//#region src/module/demo-student/src/routes.ts
var routes;
var init_routes = __esmMin((() => {
	init_test();
	routes = [{
		path: "test",
		component: ZPageTest
	}];
}));
//#endregion
//#region src/module/demo-student/src/.metadata/index.ts
/** pages: end */
/** scope: begin */
var _dec, _dec2, _class, pagePathSchemas, pageNameSchemas, ScopeModuleDemoStudent;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_controller();
	init_test();
	init_routes();
	init_src$2();
	pagePathSchemas = {};
	pageNameSchemas = {};
	ScopeModuleDemoStudent = (_dec = Scope(), _dec2 = BeanInfo({ module: "demo-student" }), _dec(_class = _dec2(_class = class ScopeModuleDemoStudent extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/module/demo-student/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerPageTest: () => ControllerPageTest,
	ScopeModuleDemoStudent: () => ScopeModuleDemoStudent,
	ZPageTest: () => ZPageTest,
	pageNameSchemas: () => pageNameSchemas,
	pagePathSchemas: () => pagePathSchemas,
	routes: () => routes
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };

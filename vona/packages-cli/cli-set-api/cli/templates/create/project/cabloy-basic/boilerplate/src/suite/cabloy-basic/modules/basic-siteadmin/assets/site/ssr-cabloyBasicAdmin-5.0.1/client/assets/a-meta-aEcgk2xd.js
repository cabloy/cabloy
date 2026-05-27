import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { O as createBeanDecorator, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite-vendor/a-zova/modules/a-meta/src/.metadata/index.ts
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAMeta;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_src$2();
	ScopeModuleAMeta = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-meta" }), _dec(_class = _dec2(_class = class ScopeModuleAMeta extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-meta/src/lib/meta.ts
function Meta(options) {
	return createBeanDecorator("meta", "app", void 0, options);
}
var init_meta$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-meta/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_meta$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-meta/src/types/meta.ts
var init_meta = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-meta/src/types/index.ts
var init_types = __esmMin((() => {
	init_meta();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-meta/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	Meta: () => Meta,
	ScopeModuleAMeta: () => ScopeModuleAMeta
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { src_exports as n, Meta as r, init_src as t };

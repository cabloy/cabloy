import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { U as BeanSimple, k as BeanInfo, m as BeanScopeBase, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite/cabloy-basic/modules/basic-adapter/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { formProvider: {
			behaviors: {
				FormField: "basic-form:formField",
				FormFieldLayout: "basic-form:formFieldLayout"
			},
			components: { Input: "basic-input:formFieldInput" }
		} };
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-adapter/src/.metadata/this.ts
var __ThisModule__;
var init_this = __esmMin((() => {
	init__metadata();
	__ThisModule__ = "basic-adapter";
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-adapter/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_src$1();
	init_this();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		sysInitialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				const configSelf = _this.sys.util.getModuleConfigSafe(__ThisModule__);
				const configOpenapi = _this.sys.util.getModuleConfigSafe("a-openapi");
				configOpenapi.formProvider = deepExtend({}, configOpenapi.formProvider, configSelf.formProvider);
			})();
		}
	};
}));
//#endregion
//#region src/suite/cabloy-basic/modules/basic-adapter/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleBasicAdapter;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_config();
	init_monkeySys();
	init_src$2();
	ScopeModuleBasicAdapter = (_dec = Scope(), _dec2 = BeanInfo({ module: "basic-adapter" }), _dec(_class = _dec2(_class = class ScopeModuleBasicAdapter extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-adapter/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	MonkeySys: () => MonkeySys,
	ScopeModuleBasicAdapter: () => ScopeModuleBasicAdapter,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
}));
//#endregion
export { src_exports as n, init_src as t };

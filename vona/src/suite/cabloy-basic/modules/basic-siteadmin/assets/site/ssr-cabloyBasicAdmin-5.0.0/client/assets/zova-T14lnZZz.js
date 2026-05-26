import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { it as init_wrappers, rt as defineBoot } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { d as bootstrap } from "./zova-DNf1Cx1D.js";
import { t as init_src } from "./zova-CWGd8DOC.js";
import { n as init_utils, t as getPluginZovaOptions } from "./index-B0_FKDcu.js";
//#region src/boot/zova.ts
var zova_default;
//#endregion
__esmMin((() => {
	init_wrappers();
	init_src();
	init_utils();
	init_asyncToGenerator();
	zova_default = defineBoot(function() {
		var _ref = _asyncToGenerator(function* ({ app }) {
			yield bootstrap(app, getPluginZovaOptions());
		});
		return function(_x) {
			return _ref.apply(this, arguments);
		};
	}());
}))();
export { zova_default as default };

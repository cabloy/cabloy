import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { ot as defineBoot, st as init_wrappers } from "./zova-BYPEGx1T.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DvkbkxAQ.js";
import { d as bootstrap } from "./zova-DQbBsEtS.js";
import { t as init_src } from "./zova-CoRfsquu.js";
import { n as init_utils, t as getPluginZovaOptions } from "./index-Cd4EYYtZ.js";
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

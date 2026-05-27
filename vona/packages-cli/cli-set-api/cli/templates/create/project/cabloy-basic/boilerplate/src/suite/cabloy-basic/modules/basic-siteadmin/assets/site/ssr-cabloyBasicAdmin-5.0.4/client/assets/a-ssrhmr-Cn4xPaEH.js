import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { n as WebSocketClient, r as init_dist } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { U as BeanSimple, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { n as init_debounce, t as debounce } from "./src-W_xgsiX4.js";
//#region src/suite-vendor/a-zova/modules/a-ssrhmr/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { change: { debounce: 100 } };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssrhmr/src/monkeySys.ts
var MonkeySys;
var init_monkeySys = __esmMin((() => {
	init_dist();
	init_debounce();
	init_src$1();
	init_asyncToGenerator();
	MonkeySys = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this._ws = void 0;
			this._reload = void 0;
		}
		sysReady() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this.sys.config.ssr.hmr) return;
				_this._reload = debounce(() => {
					_this._reloadInner();
				}, _this.sys.util.getModuleConfigSafe("a-ssrhmr").change.debounce);
				_this._startWs();
			})();
		}
		sysClose() {
			if (!this.sys.config.ssr.hmr) return;
			this._closeWs();
		}
		_closeWs() {
			if (this._ws) {
				this._ws.disconnect();
				this._ws = void 0;
			}
		}
		_startWs() {
			const ws = this._ws = new WebSocketClient({ reconnectDelayMax: 1e3 });
			ws.onEvent = (eventName, _data) => {
				if (eventName === "reload") {
					var _this$_reload;
					(_this$_reload = this._reload) === null || _this$_reload === void 0 || _this$_reload.call(this);
				}
			};
			ws.onOpen = (_event, reconnectAttempts) => {
				this.sys.meta.logger.get().log("silly", "[ssr hmr] ready");
				if (reconnectAttempts > 0) this._reloadInner();
			};
			const url = `${this.sys.config.ws.baseURL}${this.sys.config.ws.prefix}/ssrhmr`;
			ws.connect(url);
		}
		_reloadInner() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield _this2.sys.meta.event.emit("a-ssrhmr:reload");
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssrhmr/src/.metadata/index.ts
/** monkeySys: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleASsrhmr;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_config();
	init_monkeySys();
	init_src$2();
	ScopeModuleASsrhmr = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-ssrhmr" }), _dec(_class = _dec2(_class = class ScopeModuleASsrhmr extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssrhmr/src/types/index.ts
var init_types = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-ssrhmr/src/index.ts
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { config as i, ScopeModuleASsrhmr as n, MonkeySys as r, init_src as t };

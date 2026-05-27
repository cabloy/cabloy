import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { F as appResource, K as cast, O as createBeanDecorator, S as Virtual, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, o as Bean, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
//#region src/suite-vendor/a-zova/modules/a-api/src/bean/bean.apiBase.ts
var _dec$1, _dec2$1, _dec3, _class$1, BeanApiBase;
var init_bean_apiBase = __esmMin((() => {
	init_src$1();
	init_src$2();
	BeanApiBase = (_dec$1 = Bean(), _dec2$1 = Virtual(), _dec3 = BeanInfo({ module: "a-api" }), _dec$1(_class$1 = _dec2$1(_class$1 = _dec3(_class$1 = class BeanApiBase extends BeanBase {
		$pathTranslate(pathName, pathParams) {
			return this.sys.util.apiActionPathTranslate(pathName, pathParams);
		}
		$configPrepare(baseURL, options, authToken) {
			return this.sys.util.apiActionConfigPrepare(baseURL, options, authToken);
		}
		$formData(body) {
			const formData = new FormData();
			for (const key in body) {
				const value = body[key];
				if (Array.isArray(value)) for (const item of value) formData.append(key, item);
				else formData.append(key, value);
			}
			return formData;
		}
	}) || _class$1) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { defaultModuleApi: "home-api" };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/.metadata/this.ts
var __ThisModule__;
var init_this = __esmMin((() => {
	init__metadata();
	__ThisModule__ = "a-api";
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_src$1();
	init_this();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		constructor(moduleSelf) {
			super();
			this._moduleSelf = void 0;
			this._defaultModuleApi = void 0;
			this._moduleSelf = moduleSelf;
		}
		moduleLoading(_module) {
			return _asyncToGenerator(function* () {})();
		}
		moduleLoaded(module) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const promises = [];
				promises.push(_this._loadApis(module, "api"));
				promises.push(_this._loadApis(module, "apiSchema"));
				yield Promise.all(promises);
				if (_this._moduleSelf === module) {
					_this._defaultModuleApi = (yield _this.bean.getScope(__ThisModule__)).config.defaultModuleApi;
					yield _this.app.meta.module.use(_this._defaultModuleApi);
				}
			})();
		}
		beanInit(bean, beanInstance) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const self = _this2;
				for (const sceneName of ["api", "apiSchema"]) bean.defineProperty(beanInstance, `$${sceneName}`, {
					enumerable: false,
					configurable: true,
					get() {
						return cast(self.app.bean.scope(self._defaultModuleApi))[sceneName];
					}
				});
			})();
		}
		_loadApis(module, sceneName) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				var _appResource$scenes$s;
				const onions = (_appResource$scenes$s = appResource.scenes[sceneName]) === null || _appResource$scenes$s === void 0 ? void 0 : _appResource$scenes$s[module.info.relativeName];
				if (!onions) return;
				const scope = _this3.bean.scope(module.info.relativeName);
				const beanFullNames = Object.keys(onions);
				const promises = [];
				for (const beanFullName of beanFullNames) promises.push(_this3.bean._getBean(beanFullName, true));
				const values = yield Promise.all(promises);
				for (let index = 0; index < beanFullNames.length; index++) {
					const beanOptions = onions[beanFullNames[index]];
					scope[sceneName][beanOptions.name] = values[index];
				}
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/.metadata/index.ts
/** bean: end */
/** bean: begin */
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAApi;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_bean_apiBase();
	init_config();
	init_monkey();
	init_src$2();
	ScopeModuleAApi = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-api" }), _dec(_class = _dec2(_class = class ScopeModuleAApi extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/lib/api.ts
function Api() {
	return createBeanDecorator("api", "app");
}
function ApiMeta() {
	return createBeanDecorator("apiMeta", "app");
}
function ApiSchema() {
	return createBeanDecorator("apiSchema", "app");
}
var init_api$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_api$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/types/api.ts
var init_api = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/types/apiMeta.ts
var init_apiMeta = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/types/apiSchema.ts
var init_apiSchema = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/types/index.ts
var init_types = __esmMin((() => {
	init_api();
	init_apiMeta();
	init_apiSchema();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-api/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	Api: () => Api,
	ApiMeta: () => ApiMeta,
	ApiSchema: () => ApiSchema,
	BeanApiBase: () => BeanApiBase,
	Monkey: () => Monkey,
	ScopeModuleAApi: () => ScopeModuleAApi,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { BeanApiBase as a, ApiSchema as i, src_exports as n, Api as r, init_src as t };

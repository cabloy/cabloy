import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { l as markRaw } from "./vue-CeNp4lbs.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, M as SymbolErrorInstanceInfo, O as createBeanDecorator, S as Virtual, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase, w as Use, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, l as Service, o as Bean, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { n as init_axios, r as axios, t as Axios } from "./axios-Dz1VUne_.js";
//#region src/suite-vendor/a-zova/modules/a-fetch/src/service/composer.ts
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
var _dec$3, _dec2$3, _dec3$1, _dec4$1, _class$3, _class2, _descriptor, ServiceComposer;
var init_composer = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ServiceComposer = (_dec$3 = Service(), _dec2$3 = BeanInfo({ module: "a-fetch" }), _dec3$1 = Use("a-bean.sys.onion"), _dec4$1 = Reflect.metadata("design:type", typeof SysOnion === "undefined" ? Object : SysOnion), _dec$3(_class$3 = _dec2$3(_class$3 = (_class2 = class ServiceComposer extends BeanBase {
		constructor(...args) {
			super(...args);
			this.$beanFetch = void 0;
			_initializerDefineProperty(this, "$$sysOnion", _descriptor, this);
			this._composerRequest = void 0;
			this._composerRequestError = void 0;
			this._composerResponse = void 0;
			this._composerResponseError = void 0;
		}
		__init__(beanFetch, onionItems) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.$beanFetch = beanFetch;
				yield _this._createComposer(onionItems);
			})();
		}
		executeRequest(config) {
			return this._composerRequest(config);
		}
		executeRequestError(error) {
			return this._composerRequestError(error);
		}
		executeResponse(response) {
			return this._composerResponse(response);
		}
		executeResponseError(error) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				error = yield _this2._composerResponseError(error);
				if (error instanceof Error) error[SymbolErrorInstanceInfo] = {
					instance: _this2.ctx.instance,
					info: "executeResponseError"
				};
				return error;
			})();
		}
		_createComposer(onionItems) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				let onionSlices;
				if (onionItems) onionSlices = yield _this3.$$sysOnion.interceptor.loadOnions(onionItems);
				else onionSlices = yield _this3.$$sysOnion.interceptor.loadOnionsFromPackage();
				for (const onionSlice of onionSlices) onionSlice.beanInstance = yield _this3.bean._newBean(onionSlice.beanFullName, true, _this3.$beanFetch, onionSlice.options);
				_this3._composerRequest = _this3.$$sysOnion.interceptor.compose(onionSlices, (onionSlice, config, next) => {
					const options = _this3._combineOnionOptions(onionSlice, config);
					if (!_this3.$$sysOnion.checkOnionOptionsEnabled(options, config.url)) return next(config);
					const beanInstance = cast(onionSlice.beanInstance);
					if (!beanInstance.onRequest) return next(config);
					return beanInstance.onRequest(config, options, next);
				});
				_this3._composerRequestError = _this3.$$sysOnion.interceptor.compose(onionSlices, (onionSlice, error, next) => {
					const config = error.config;
					const options = _this3._combineOnionOptions(onionSlice, config);
					if (!_this3.$$sysOnion.checkOnionOptionsEnabled(options, config === null || config === void 0 ? void 0 : config.url)) return next(error);
					const beanInstance = cast(onionSlice.beanInstance);
					if (!beanInstance.onRequestError) return next(error);
					return beanInstance.onRequestError(error, options, next);
				});
				_this3._composerResponse = _this3.$$sysOnion.interceptor.compose(onionSlices, (onionSlice, response, next) => {
					const config = response.config;
					const options = _this3._combineOnionOptions(onionSlice, config);
					if (!_this3.$$sysOnion.checkOnionOptionsEnabled(options, config === null || config === void 0 ? void 0 : config.url)) return next(response);
					const beanInstance = cast(onionSlice.beanInstance);
					if (!beanInstance.onResponse) return next(response);
					return beanInstance.onResponse(response, options, next);
				});
				_this3._composerResponseError = _this3.$$sysOnion.interceptor.compose(onionSlices, (onionSlice, error, next) => {
					const config = error.config;
					const options = _this3._combineOnionOptions(onionSlice, config);
					if (!_this3.$$sysOnion.checkOnionOptionsEnabled(options, config === null || config === void 0 ? void 0 : config.url)) return next(error);
					const beanInstance = cast(onionSlice.beanInstance);
					if (!beanInstance.onResponseError) return next(error);
					return beanInstance.onResponseError(error, options, next);
				});
			})();
		}
		_combineOnionOptions(item, config) {
			let optionsDynamic;
			if (config === null || config === void 0 ? void 0 : config.interceptors) optionsDynamic = config === null || config === void 0 ? void 0 : config.interceptors[item.name];
			return optionsDynamic ? deepExtend({}, item.options, optionsDynamic) : item.options;
		}
	}, _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$sysOnion", [_dec3$1, _dec4$1], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/bean/bean.fetch.ts
function patchAxios(_Axios) {
	if (_Axios.__requestPatched) return;
	_Axios.__requestPatched = true;
	const requestPrev = _Axios.prototype.request;
	_Axios.prototype.request = _asyncToGenerator(function* (...args) {
		try {
			return yield requestPrev.call(this, ...args);
		} catch (err) {
			if (err instanceof Error) throw err;
			return err;
		}
	});
}
var _dec$2, _dec2$2, _class$2, SymbolFetch, BeanFetch$1;
var init_bean_fetch = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_axios();
	init_vue_runtime_esm_bundler();
	init_src$2();
	init_composer();
	SymbolFetch = Symbol("SymbolFetch");
	BeanFetch$1 = (_dec$2 = Bean(), _dec2$2 = BeanInfo({ module: "a-fetch" }), _dec$2(_class$2 = _dec2$2(_class$2 = class BeanFetch extends BeanBase {
		constructor(...args) {
			super(...args);
			this._composer = void 0;
			this[SymbolFetch] = void 0;
		}
		__init__(options) {
			var _this = this;
			return _asyncToGenerator(function* () {
				patchAxios(Axios);
				const axiosConfig = deepExtend({}, { baseURL: _this.sys.util.getApiBaseURL() }, _this.scope.config.axios.config, options === null || options === void 0 ? void 0 : options.axiosConfig);
				_this._composer = yield _this.bean._newBean(ServiceComposer, true, _this, options === null || options === void 0 ? void 0 : options.onionItems);
				_this[SymbolFetch] = markRaw(axios.create(axiosConfig));
				_this._addInterceptors(_this[SymbolFetch]);
			})();
		}
		__get__(prop) {
			return this[SymbolFetch] && this[SymbolFetch][prop];
		}
		_addInterceptors(api) {
			var _this2 = this;
			api.interceptors.request.use(function() {
				var _ref = _asyncToGenerator(function* (config) {
					return yield _this2._composer.executeRequest(config);
				});
				return function(_x) {
					return _ref.apply(this, arguments);
				};
			}(), function() {
				var _ref2 = _asyncToGenerator(function* (_error) {
					if (!(_error instanceof Error)) return Promise.reject(_error);
					const error = yield _this2._composer.executeRequestError(_error);
					return Promise.reject(error);
				});
				return function(_x2) {
					return _ref2.apply(this, arguments);
				};
			}());
			api.interceptors.response.use(function() {
				var _ref3 = _asyncToGenerator(function* (response) {
					return yield _this2._composer.executeResponse(response);
				});
				return function(_x3) {
					return _ref3.apply(this, arguments);
				};
			}(), function() {
				var _ref4 = _asyncToGenerator(function* (_error) {
					if (!(_error instanceof Error)) return Promise.reject(_error);
					const error = yield _this2._composer.executeResponseError(_error);
					return Promise.reject(error);
				});
				return function(_x4) {
					return _ref4.apply(this, arguments);
				};
			}());
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/bean/bean.interceptorBase.ts
var _dec$1, _dec2$1, _dec3, _dec4, _dec5, _class$1, BeanInterceptorBase;
var init_bean_interceptorBase = __esmMin((() => {
	init_src$1();
	init_src$2();
	BeanInterceptorBase = (_dec$1 = Bean(), _dec2$1 = Virtual(), _dec3 = BeanInfo({ module: "a-fetch" }), _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof BeanFetch === "undefined" ? Object : BeanFetch, typeof T === "undefined" ? Object : T]), _dec$1(_class$1 = _dec2$1(_class$1 = _dec3(_class$1 = _dec4(_class$1 = _dec5(_class$1 = class BeanInterceptorBase extends BeanBase {
		constructor(beanFetch, options) {
			super();
			this.$beanFetch = void 0;
			this.$options = void 0;
			this.$beanFetch = beanFetch;
			this.$options = options;
		}
	}) || _class$1) || _class$1) || _class$1) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { axios: { config: {} } };
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_src$1();
	init_bean_fetch();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		appInitialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.app.meta.$fetch = yield _this.bean._getBean(BeanFetch$1, false);
			})();
		}
		beanInit(bean, beanInstance) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const self = _this2;
				bean.defineProperty(beanInstance, "$fetch", {
					enumerable: false,
					configurable: true,
					get() {
						return self.app.meta.$fetch;
					}
				});
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/.metadata/index.ts
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAFetch;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_bean_fetch();
	init_bean_interceptorBase();
	init_composer();
	init_src$2();
	init_config();
	init_monkey();
	ScopeModuleAFetch = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-fetch" }), _dec(_class = _dec2(_class = class ScopeModuleAFetch extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/lib/const.ts
var SymbolInterceptorBodyResponseFlag;
var init_const = __esmMin((() => {
	SymbolInterceptorBodyResponseFlag = Symbol("SymbolInterceptorBodyResponseFlag");
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/lib/interceptor.ts
function Interceptor(options) {
	return createBeanDecorator("interceptor", "new", true, options);
}
var init_interceptor$1 = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_const();
	init_interceptor$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/types/interceptor.ts
var init_interceptor = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/types/index.ts
var init_types = __esmMin((() => {
	init_interceptor();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-fetch/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	BeanFetch: () => BeanFetch$1,
	BeanInterceptorBase: () => BeanInterceptorBase,
	Interceptor: () => Interceptor,
	Monkey: () => Monkey,
	ScopeModuleAFetch: () => ScopeModuleAFetch,
	ServiceComposer: () => ServiceComposer,
	SymbolInterceptorBodyResponseFlag: () => SymbolInterceptorBodyResponseFlag,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { BeanInterceptorBase as a, SymbolInterceptorBodyResponseFlag as i, src_exports as n, Interceptor as r, init_src as t };

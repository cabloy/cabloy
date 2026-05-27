import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { J as init_dist } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, k as BeanInfo, m as BeanScopeBase, n as $protocolKey } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as BeanInterceptorBase, i as SymbolInterceptorBodyResponseFlag, r as Interceptor, t as init_src$3 } from "./a-fetch-C7ZVGYW7.js";
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.body.ts
var _dec$5, _dec2$5, _class$5, InterceptorBody;
var init_interceptor_body = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	InterceptorBody = (_dec$5 = Interceptor({ dependencies: "a-interceptor:performAction" }), _dec2$5 = BeanInfo({ module: "a-interceptor" }), _dec$5(_class$5 = _dec2$5(_class$5 = class InterceptorBody extends BeanInterceptorBase {
		onResponse(response, _options, next) {
			return _asyncToGenerator(function* () {
				var _response$data$data;
				response = yield next();
				const contentType = response.headers["content-type"];
				if (!contentType || typeof contentType !== "string" || !contentType.includes("application/json")) {
					response[SymbolInterceptorBodyResponseFlag] = true;
					return response;
				}
				if (response.data.code !== 0) {
					const error = /* @__PURE__ */ new Error();
					error.code = response.data.code;
					error.message = response.data.message;
					throw error;
				}
				return (_response$data$data = response.data.data) !== null && _response$data$data !== void 0 ? _response$data$data : null;
			})();
		}
		onResponseError(error, _options, next) {
			return _asyncToGenerator(function* () {
				error = yield next();
				if (!(error instanceof Error)) return error;
				if (error.response) {
					var _cast$code, _cast, _cast$message, _cast2;
					error.code = (_cast$code = (_cast = cast(error.response.data)) === null || _cast === void 0 ? void 0 : _cast.code) !== null && _cast$code !== void 0 ? _cast$code : error.response.status;
					error.message = (_cast$message = (_cast2 = cast(error.response.data)) === null || _cast2 === void 0 ? void 0 : _cast2.message) !== null && _cast$message !== void 0 ? _cast$message : error.response.statusText;
				}
				return error;
			})();
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.headers.ts
var _dec$4, _dec2$4, _class$4, InterceptorHeaders;
var init_interceptor_headers = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	InterceptorHeaders = (_dec$4 = Interceptor({ dependencies: "a-interceptor:mock" }), _dec2$4 = BeanInfo({ module: "a-interceptor" }), _dec$4(_class$4 = _dec2$4(_class$4 = class InterceptorHeaders extends BeanInterceptorBase {
		onRequest(config, options, next) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const keyLocale = _this.sys.env.APP_LOCALE_HEADER_KEY;
				if (keyLocale && !config.headers[keyLocale]) config.headers[keyLocale] = _this.app.meta.locale.current;
				const keyTz = _this.sys.env.APP_TZ_HEADER_KEY;
				if (keyTz && !config.headers[keyTz]) config.headers[keyTz] = _this.app.meta.locale.tz;
				if (options.openapiSchema) config.headers[$protocolKey("x-vona-openapi-schema")] = true;
				return next(config);
			})();
		}
	}) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.jwt.ts
var _dec$3, _dec2$3, _class$3, InterceptorJwt;
var init_interceptor_jwt = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	InterceptorJwt = (_dec$3 = Interceptor({ dependencies: "a-interceptor:headers" }), _dec2$3 = BeanInfo({ module: "a-interceptor" }), _dec$3(_class$3 = _dec2$3(_class$3 = class InterceptorJwt extends BeanInterceptorBase {
		constructor(...args) {
			super(...args);
			this._beanJwtAdapter = void 0;
			this._refreshAuthTokenPromise = void 0;
		}
		__init__(_beanFetch, options) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const beanFullName = (options.jwtAdapter || _this.scope.config.jwtAdapter).replace(":", ".service.");
				_this._beanJwtAdapter = yield _this.app.bean._getBean(beanFullName, true);
			})();
		}
		onRequest(config, options, next) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				try {
					const accessToken = yield _this2.prepareAccessToken(config, options.authToken);
					if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
				} catch (error) {
					error.config = config;
					error.request = void 0;
					error.response = void 0;
					throw error;
				}
				return next(config);
			})();
		}
		prepareAccessToken(config, authToken) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				if (!_this3.sys.config.api.jwt) return;
				if (_this3.sys.config.ssr.ignoreCookieOnServer) return;
				const authTokenCurrent = authToken !== null && authToken !== void 0 ? authToken : _this3.scope.config.authToken.default;
				if (typeof authTokenCurrent === "string") return authTokenCurrent;
				let jwtInfo = yield _this3._beanJwtAdapter.getJwtInfo();
				if (!jwtInfo) {
					if (authToken === true) _this3.app.throw(401);
					return;
				}
				if (!jwtInfo.expireTime || jwtInfo.expireTime > Date.now()) {
					if (!jwtInfo.accessToken) {
						if (authToken === true) _this3.app.throw(401);
						return;
					}
					return jwtInfo.accessToken;
				}
				if (!jwtInfo.refreshToken) {
					if (authToken === true) _this3.app.throw(401);
					return;
				} else if (authToken === false) return;
				jwtInfo = yield _this3._refreshAuthToken(jwtInfo.refreshToken);
				return jwtInfo.accessToken;
			})();
		}
		_refreshAuthToken(refreshToken) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				if (!_this4._refreshAuthTokenPromise) _this4._refreshAuthTokenPromise = _this4._refreshAuthTokenInner(refreshToken);
				return yield _this4._refreshAuthTokenPromise;
			})();
		}
		_refreshAuthTokenInner(refreshToken) {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				try {
					return yield _this5._beanJwtAdapter.refreshAuthToken(refreshToken);
				} finally {
					_this5._refreshAuthTokenPromise = void 0;
				}
			})();
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.mock.ts
var _dec$2, _dec2$2, _class$2, __ErrorsShouldBeMocked, InterceptorMock;
var init_interceptor_mock = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$3();
	__ErrorsShouldBeMocked = [
		"ECONNREFUSED",
		"ERR_NETWORK",
		"404"
	];
	InterceptorMock = (_dec$2 = Interceptor(), _dec2$2 = BeanInfo({ module: "a-interceptor" }), _dec$2(_class$2 = _dec2$2(_class$2 = class InterceptorMock extends BeanInterceptorBase {
		onResponseError(error, _options, next) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!(error instanceof Error)) return next();
				if (_this.sys.env.MOCK_ENABLED === "true") {
					if (_this.sys.env.MOCK_BUILD === "true") {
						if (__ErrorsShouldBeMocked.includes(String(error.code)) || error.status === 404) {
							const config = error.config;
							if (config.baseURL) {
								let baseURL = `http://localhost:${_this.sys.env.MOCK_BUILD_PORT}`;
								if (config.baseURL.endsWith(_this.sys.env.API_PREFIX)) baseURL = `${baseURL}${_this.sys.env.API_PREFIX}`;
								if (config.baseURL !== baseURL && config.baseURL !== _this.sys.env.API_PREFIX) {
									const response = yield _this.$fetch.request(Object.assign({}, config, { baseURL }));
									if (response && response[SymbolInterceptorBodyResponseFlag]) return response.data;
									else return response;
								}
							}
						}
					}
				}
				return next();
			})();
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.performAction.ts
var _dec$1, _dec2$1, _class$1, InterceptorPerformAction;
var init_interceptor_performAction = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$3();
	InterceptorPerformAction = (_dec$1 = Interceptor({ dependencies: "a-interceptor:jwt" }), _dec2$1 = BeanInfo({ module: "a-interceptor" }), _dec$1(_class$1 = _dec2$1(_class$1 = class InterceptorPerformAction extends BeanInterceptorBase {
		onRequest(config, _options, next) {
			return _asyncToGenerator(function* () {
				return next();
			})();
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return {
			jwtAdapter: "home-api:jwtAdapter",
			authToken: { default: true }
		};
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/.metadata/index.ts
/** config: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAInterceptor;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_interceptor_body();
	init_interceptor_headers();
	init_interceptor_jwt();
	init_interceptor_mock();
	init_interceptor_performAction();
	init_src$3();
	init_config();
	init_src$2();
	ScopeModuleAInterceptor = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-interceptor" }), _dec(_class = _dec2(_class = class ScopeModuleAInterceptor extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/types/jwt.ts
var init_jwt = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/types/index.ts
var init_types = __esmMin((() => {
	init_jwt();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-interceptor/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	InterceptorBody: () => InterceptorBody,
	InterceptorHeaders: () => InterceptorHeaders,
	InterceptorJwt: () => InterceptorJwt,
	InterceptorMock: () => InterceptorMock,
	InterceptorPerformAction: () => InterceptorPerformAction,
	ScopeModuleAInterceptor: () => ScopeModuleAInterceptor,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { src_exports as n, init_src as t };

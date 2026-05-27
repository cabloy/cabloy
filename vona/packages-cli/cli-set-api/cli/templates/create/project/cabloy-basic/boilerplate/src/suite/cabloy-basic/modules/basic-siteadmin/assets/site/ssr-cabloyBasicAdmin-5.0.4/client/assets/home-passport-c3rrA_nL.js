import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { B as combineQueries, J as init_dist, Z as isNil } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { U as BeanSimple, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Model, o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { i as OpenApiBaseURL, t as init_src$4 } from "./home-api-D01dkd_K.js";
//#region src/suite/a-home/modules/home-passport/src/model/passport.ts
var _dec$1, _dec2$1, _class$1, ModelPassport;
var init_passport$1 = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$3();
	init_src$4();
	ModelPassport = (_dec$1 = Model(), _dec2$1 = BeanInfo({ module: "home-passport" }), _dec$1(_class$1 = _dec2$1(_class$1 = class ModelPassport extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this.passport = void 0;
			this.jwt = void 0;
			this.accessToken = void 0;
			this.expireTime = void 0;
			this.schemaLogin = void 0;
		}
		__init__() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.schemaLogin = _this.$computed(() => {
					return _this.apiSchemasLogin.requestBody;
				});
				_this.passport = _this.$useStateLocal({ queryKey: ["passport"] });
				_this.jwt = _this.$useStateLocal({ queryKey: ["jwt"] });
				_this.expireTime = _this.$useStateLocal({ queryKey: ["expireTime"] });
				_this.accessToken = _this.sys.config.ssr.ignoreCookieOnServer ? void 0 : _this.$useStateCookie({ queryKey: ["token"] });
				_this._setLocaleTz();
			})();
		}
		get apiSchemasLogin() {
			return this.$apiSchema.homeUserPassport.login({ authToken: false });
		}
		login() {
			var _this2 = this;
			return this.$useMutationData({
				mutationKey: ["login"],
				mutationFn: function() {
					var _ref = _asyncToGenerator(function* (params) {
						return _this2.$api.homeUserPassport.login(params, { authToken: false });
					});
					return function mutationFn(_x) {
						return _ref.apply(this, arguments);
					};
				}(),
				onSuccess: (data) => {
					this.afterLogin(data);
				}
			});
		}
		loginByOauthCode() {
			var _this3 = this;
			return this.$useMutationData({
				mutationKey: ["loginByOauthCode"],
				mutationFn: function() {
					var _ref2 = _asyncToGenerator(function* (params) {
						return _this3.$api.homeUserPassport.createPassportJwtFromOauthCode(params, { authToken: false });
					});
					return function mutationFn(_x2) {
						return _ref2.apply(this, arguments);
					};
				}(),
				onSuccess: (data) => {
					this.afterLogin(data);
				}
			});
		}
		getOauthLoginUrl(module, providerName, clientName) {
			const apiPath = this.sys.util.apiActionPathTranslate("/api/home/user/passport/login/{module}/{providerName}/{clientName?}", {
				module,
				providerName,
				clientName
			});
			const returnTo = this.app.$getReturnTo();
			const redirect = this.$router.getPagePath("/home/base/authCallback", { query: { returnTo } }, true);
			return combineQueries(`${OpenApiBaseURL(this.sys)}${apiPath}`, { redirect });
		}
		afterLogin(data) {
			this._setPassportJwt(data);
			this.app.$gotoReturnTo();
		}
		logout() {
			var _this4 = this;
			return this.$useMutationData({
				mutationKey: ["logout"],
				mutationFn: function() {
					var _ref3 = _asyncToGenerator(function* () {
						yield _this4.$api.homeUserPassport.logout();
					});
					return function mutationFn() {
						return _ref3.apply(this, arguments);
					};
				}(),
				onSuccess: function() {
					var _ref4 = _asyncToGenerator(function* () {
						_this4._setPassportJwt();
						yield _this4.app.$gotoLogin();
						_this4.$clear();
					});
					return function onSuccess() {
						return _ref4.apply(this, arguments);
					};
				}()
			});
		}
		get isAuthenticated() {
			return !!this.passport;
		}
		get user() {
			var _this$passport;
			return (_this$passport = this.passport) === null || _this$passport === void 0 ? void 0 : _this$passport.user;
		}
		get roles() {
			var _this$passport2;
			return (_this$passport2 = this.passport) === null || _this$passport2 === void 0 ? void 0 : _this$passport2.roles;
		}
		getJwtInfo() {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				var _this$jwt, _this$jwt2;
				if (!_this5.accessToken) return void 0;
				return {
					accessToken: _this5.accessToken,
					refreshToken: (_this$jwt = _this5.jwt) === null || _this$jwt === void 0 ? void 0 : _this$jwt.refreshToken,
					expiresIn: (_this$jwt2 = _this5.jwt) === null || _this$jwt2 === void 0 ? void 0 : _this$jwt2.expiresIn,
					expireTime: _this5.expireTime
				};
			})();
		}
		refreshAuthToken(refreshToken) {
			var _this6 = this;
			return _asyncToGenerator(function* () {
				const jwt = yield _this6.$api.homeUserPassport.refreshAuthToken({ refreshToken }, { authToken: false });
				_this6._setJwt(jwt);
				return yield _this6.getJwtInfo();
			})();
		}
		ensurePassport() {
			var _this7 = this;
			return _asyncToGenerator(function* () {
				return _this7.passport;
			})();
		}
		_setLocaleTz() {
			var _this$passport3;
			const user = (_this$passport3 = this.passport) === null || _this$passport3 === void 0 ? void 0 : _this$passport3.user;
			if (!user) return;
			if (user.locale) {
				if (!this.app.meta.cookie.getItem(this.sys.config.locale.storeKey)) this.app.meta.locale.current = user.locale;
			}
			if (user.tz) {
				if (!this.app.meta.cookie.getItem(this.sys.config.tz.storeKey)) this.app.meta.locale.tz = user.tz;
			}
		}
		_setPassportJwt(data) {
			this._setPassport(data === null || data === void 0 ? void 0 : data.passport);
			this._setJwt(data === null || data === void 0 ? void 0 : data.jwt);
		}
		_setPassport(passport) {
			if (passport) this.passport = passport;
			else this.passport = void 0;
		}
		_setJwt(jwt) {
			if (jwt) {
				this.jwt = jwt;
				this.expireTime = Date.now() + (jwt.expiresIn - this.scope.config.accessToken.expireTimeDelay) * 1e3;
				this.accessToken = jwt.accessToken;
			} else {
				this.jwt = void 0;
				this.expireTime = void 0;
				this.accessToken = void 0;
			}
		}
		checkPermission(permissions, actionName, permissionHint) {
			var _permissionHint$actio;
			if (permissionHint === null || permissionHint === void 0 ? void 0 : permissionHint.public) return true;
			const permissionAction = (_permissionHint$actio = permissionHint === null || permissionHint === void 0 ? void 0 : permissionHint.actionInherit) !== null && _permissionHint$actio !== void 0 ? _permissionHint$actio : actionName;
			if (!permissionAction) return true;
			if (isNil(permissions)) return false;
			if (permissions === false) return false;
			if (permissions === true) return true;
			if (permissions.roleIds && permissions.roleIds.some((roleId) => {
				var _this$roles;
				return (_this$roles = this.roles) === null || _this$roles === void 0 ? void 0 : _this$roles.some((role) => role.id === roleId);
			})) return true;
			if (permissions.roleNames && permissions.roleNames.some((roleName) => {
				var _this$roles2;
				return (_this$roles2 = this.roles) === null || _this$roles2 === void 0 ? void 0 : _this$roles2.some((role) => role.name === roleName);
			})) return true;
			if (permissions.actions && !!permissions.actions[permissionAction]) return true;
			return false;
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-home/modules/home-passport/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return { accessToken: { expireTimeDelay: 120 } };
	};
}));
//#endregion
//#region src/suite/a-home/modules/home-passport/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_src$1();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		constructor(moduleSelf) {
			super();
			this._moduleSelf = void 0;
			this.$$modelPassport = void 0;
			this._moduleSelf = moduleSelf;
		}
		getModelPassport() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this.$$modelPassport) _this.$$modelPassport = yield _this.bean._getBean("home-passport.model.passport", true);
				return _this.$$modelPassport;
			})();
		}
		moduleLoading(_module) {
			return _asyncToGenerator(function* () {})();
		}
		moduleLoaded(module) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (_this2._moduleSelf === module) yield _this2.getModelPassport();
			})();
		}
		beanInit(bean, beanInstance) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const self = _this3;
				bean.defineProperty(beanInstance, "$passport", {
					enumerable: false,
					configurable: true,
					get() {
						return self.$$modelPassport;
					}
				});
			})();
		}
	};
}));
//#endregion
//#region src/suite/a-home/modules/home-passport/src/.metadata/index.ts
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleHomePassport;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_passport$1();
	init_src$3();
	init_config();
	init_monkey();
	init_src$2();
	ScopeModuleHomePassport = (_dec = Scope(), _dec2 = BeanInfo({ module: "home-passport" }), _dec(_class = _dec2(_class = class ScopeModuleHomePassport extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-passport/src/types/passport.ts
var init_passport = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite/a-home/modules/home-passport/src/types/index.ts
var init_types = __esmMin((() => {
	init_passport();
}));
//#endregion
//#region src/suite/a-home/modules/home-passport/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ModelPassport: () => ModelPassport,
	Monkey: () => Monkey,
	ScopeModuleHomePassport: () => ScopeModuleHomePassport,
	config: () => config
});
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { src_exports as n, init_src as t };

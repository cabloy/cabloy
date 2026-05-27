import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { j as BeanBase, k as BeanInfo, m as BeanScopeBase } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, l as Service, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as BeanApiBase, i as ApiSchema, r as Api, t as init_src$3 } from "./a-api-DiQk04u0.js";
//#region src/suite/a-home/modules/home-api/src/api/openapi/baseURL.ts
var OpenApiBaseURL;
var init_baseURL = __esmMin((() => {
	OpenApiBaseURL = (sys) => {
		return sys.util.getOpenApiBaseURL("OPENAPI_BASE_URL_HOME_API");
	};
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/openapi/schemas.ts
var init_schemas = __esmMin((() => {}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/openapi/types.ts
var init_types$1 = __esmMin((() => {}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/openapi/index.ts
var init_openapi = __esmMin((() => {
	init_baseURL();
	init_schemas();
	init_types$1();
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/captcha.ts
var _dec$13, _dec2$13, _class$13, ApiApiCaptchacreatePath, ApiApiCaptcharefreshPath, ApiApiCaptchaverifyImmediatePath, ApiCaptcha;
var init_captcha$1 = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_openapi();
	ApiApiCaptchacreatePath = "/api/captcha/create";
	ApiApiCaptcharefreshPath = "/api/captcha/refresh";
	ApiApiCaptchaverifyImmediatePath = "/api/captcha/verifyImmediate";
	ApiCaptcha = (_dec$13 = Api(), _dec2$13 = BeanInfo({ module: "home-api" }), _dec$13(_class$13 = _dec2$13(_class$13 = class ApiCaptcha extends BeanApiBase {
		create(body, options) {
			return this.$fetch.post("/api/captcha/create", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		refresh(body, options) {
			return this.$fetch.post("/api/captcha/refresh", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		verifyImmediate(body, options) {
			return this.$fetch.post("/api/captcha/verifyImmediate", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
	}) || _class$13) || _class$13);
})), _dec$12, _dec2$12, _class$12, ApiHome;
var init_home$1 = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_openapi();
	ApiHome = (_dec$12 = Api(), _dec2$12 = BeanInfo({ module: "home-api" }), _dec$12(_class$12 = _dec2$12(_class$12 = class ApiHome extends BeanApiBase {
		/** @description Home */
		index(options) {
			return this.$fetch.get("/", this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
	}) || _class$12) || _class$12);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/homeBaseMenu.ts
var _dec$11, _dec2$11, _class$11, ApiApiHomeBaseMenuretrieveMenusPath, ApiHomeBaseMenu;
var init_homeBaseMenu$1 = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_openapi();
	ApiApiHomeBaseMenuretrieveMenusPath = "/api/home/base/menu/{publicPath?}";
	ApiHomeBaseMenu = (_dec$11 = Api(), _dec2$11 = BeanInfo({ module: "home-api" }), _dec$11(_class$11 = _dec2$11(_class$11 = class ApiHomeBaseMenu extends BeanApiBase {
		retrieveMenus(options) {
			return this.$fetch.get(this.$pathTranslate("/api/home/base/menu/{publicPath?}", options.params), this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
	}) || _class$11) || _class$11);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/homeBasePermission.ts
var _dec$10, _dec2$10, _class$10, ApiApiHomeBasePermissionretrievePermissionsPath, ApiHomeBasePermission;
var init_homeBasePermission$1 = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_openapi();
	ApiApiHomeBasePermissionretrievePermissionsPath = "/api/home/base/permission/{resource}";
	ApiHomeBasePermission = (_dec$10 = Api(), _dec2$10 = BeanInfo({ module: "home-api" }), _dec$10(_class$10 = _dec2$10(_class$10 = class ApiHomeBasePermission extends BeanApiBase {
		retrievePermissions(options) {
			return this.$fetch.get(this.$pathTranslate("/api/home/base/permission/{resource}", options.params), this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
	}) || _class$10) || _class$10);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/homeUserPassport.ts
var _dec$9, _dec2$9, _class$9, ApiApiHomeUserPassportcurrentPath, ApiApiHomeUserPassportlogoutPath, ApiApiHomeUserPassportregisterPath, ApiApiHomeUserPassportloginPath, ApiApiHomeUserPassportloginOauthPath, ApiApiHomeUserPassportassociatePath, ApiApiHomeUserPassportmigratePath, ApiApiHomeUserPassportrefreshAuthTokenPath, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath, ApiApiHomeUserPassportcreateTempAuthTokenPath, ApiHomeUserPassport;
var init_homeUserPassport$1 = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_openapi();
	ApiApiHomeUserPassportcurrentPath = "/api/home/user/passport/current";
	ApiApiHomeUserPassportlogoutPath = "/api/home/user/passport/logout";
	ApiApiHomeUserPassportregisterPath = "/api/home/user/passport/register";
	ApiApiHomeUserPassportloginPath = "/api/home/user/passport/login";
	ApiApiHomeUserPassportloginOauthPath = "/api/home/user/passport/login/{module}/{providerName}/{clientName?}";
	ApiApiHomeUserPassportassociatePath = "/api/home/user/passport/associate/{module}/{providerName}/{clientName?}";
	ApiApiHomeUserPassportmigratePath = "/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}";
	ApiApiHomeUserPassportrefreshAuthTokenPath = "/api/home/user/passport/refreshAuthToken";
	ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath = "/api/home/user/passport/createPassportJwtFromOauthCode";
	ApiApiHomeUserPassportcreateTempAuthTokenPath = "/api/home/user/passport/createTempAuthToken";
	ApiHomeUserPassport = (_dec$9 = Api(), _dec2$9 = BeanInfo({ module: "home-api" }), _dec$9(_class$9 = _dec2$9(_class$9 = class ApiHomeUserPassport extends BeanApiBase {
		current(options) {
			return this.$fetch.get("/api/home/user/passport/current", this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		logout(body, options) {
			return this.$fetch.post("/api/home/user/passport/logout", body, this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
		register(body, options) {
			return this.$fetch.post("/api/home/user/passport/register", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		login(body, options) {
			return this.$fetch.post("/api/home/user/passport/login", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		loginOauth(options) {
			return this.$fetch.get(this.$pathTranslate("/api/home/user/passport/login/{module}/{providerName}/{clientName?}", options.params), this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		associate(options) {
			return this.$fetch.get(this.$pathTranslate("/api/home/user/passport/associate/{module}/{providerName}/{clientName?}", options.params), this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
		migrate(options) {
			return this.$fetch.get(this.$pathTranslate("/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}", options.params), this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
		refreshAuthToken(body, options) {
			return this.$fetch.post("/api/home/user/passport/refreshAuthToken", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		createPassportJwtFromOauthCode(body, options) {
			return this.$fetch.post("/api/home/user/passport/createPassportJwtFromOauthCode", body, this.$configPrepare(OpenApiBaseURL(this.sys), options));
		}
		createTempAuthToken(body, options) {
			return this.$fetch.post("/api/home/user/passport/createTempAuthToken", body, this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
	}) || _class$9) || _class$9);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/testSsrToolOne.ts
var _dec$8, _dec2$8, _class$8, ApiApiTestSsrToolOnetestGetPath, ApiApiTestSsrToolOnetestPath, ApiTestSsrToolOne;
var init_testSsrToolOne$1 = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_openapi();
	ApiApiTestSsrToolOnetestGetPath = "/api/test/ssr/toolOne/test/{id?}";
	ApiApiTestSsrToolOnetestPath = "/api/test/ssr/toolOne/test/{id?}";
	ApiTestSsrToolOne = (_dec$8 = Api(), _dec2$8 = BeanInfo({ module: "home-api" }), _dec$8(_class$8 = _dec2$8(_class$8 = class ApiTestSsrToolOne extends BeanApiBase {
		testGet(options) {
			return this.$fetch.get(this.$pathTranslate("/api/test/ssr/toolOne/test/{id?}", options.params), this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
		test(body, options) {
			return this.$fetch.post(this.$pathTranslate("/api/test/ssr/toolOne/test/{id?}", options.params), body, this.$configPrepare(OpenApiBaseURL(this.sys), options, true));
		}
	}) || _class$8) || _class$8);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/captcha.ts
var _dec$7, _dec2$7, _class$7, ApiSchemaCaptcha;
var init_captcha = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_captcha$1();
	ApiSchemaCaptcha = (_dec$7 = ApiSchema(), _dec2$7 = BeanInfo({ module: "home-api" }), _dec$7(_class$7 = _dec2$7(_class$7 = class ApiSchemaCaptcha extends BeanBase {
		create(options) {
			return this.$sdk.createApiSchemas("/api/captcha/create", "post", options);
		}
		refresh(options) {
			return this.$sdk.createApiSchemas("/api/captcha/refresh", "post", options);
		}
		verifyImmediate(options) {
			return this.$sdk.createApiSchemas("/api/captcha/verifyImmediate", "post", options);
		}
	}) || _class$7) || _class$7);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/home.ts
var _dec$6, _dec2$6, _class$6, ApiSchemaHome;
var init_home = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_home$1();
	ApiSchemaHome = (_dec$6 = ApiSchema(), _dec2$6 = BeanInfo({ module: "home-api" }), _dec$6(_class$6 = _dec2$6(_class$6 = class ApiSchemaHome extends BeanBase {
		index(options) {
			return this.$sdk.createApiSchemas("/", "get", options);
		}
	}) || _class$6) || _class$6);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/homeBaseMenu.ts
var _dec$5, _dec2$5, _class$5, ApiSchemaHomeBaseMenu;
var init_homeBaseMenu = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_homeBaseMenu$1();
	ApiSchemaHomeBaseMenu = (_dec$5 = ApiSchema(), _dec2$5 = BeanInfo({ module: "home-api" }), _dec$5(_class$5 = _dec2$5(_class$5 = class ApiSchemaHomeBaseMenu extends BeanBase {
		retrieveMenus(options) {
			return this.$sdk.createApiSchemas("/api/home/base/menu/{publicPath?}", "get", options);
		}
	}) || _class$5) || _class$5);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/homeBasePermission.ts
var _dec$4, _dec2$4, _class$4, ApiSchemaHomeBasePermission;
var init_homeBasePermission = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_homeBasePermission$1();
	ApiSchemaHomeBasePermission = (_dec$4 = ApiSchema(), _dec2$4 = BeanInfo({ module: "home-api" }), _dec$4(_class$4 = _dec2$4(_class$4 = class ApiSchemaHomeBasePermission extends BeanBase {
		retrievePermissions(options) {
			return this.$sdk.createApiSchemas("/api/home/base/permission/{resource}", "get", options);
		}
	}) || _class$4) || _class$4);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/homeUserPassport.ts
var _dec$3, _dec2$3, _class$3, ApiSchemaHomeUserPassport;
var init_homeUserPassport = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_homeUserPassport$1();
	ApiSchemaHomeUserPassport = (_dec$3 = ApiSchema(), _dec2$3 = BeanInfo({ module: "home-api" }), _dec$3(_class$3 = _dec2$3(_class$3 = class ApiSchemaHomeUserPassport extends BeanBase {
		current(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/current", "get", options);
		}
		logout(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/logout", "post", options);
		}
		register(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/register", "post", options);
		}
		login(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/login", "post", options);
		}
		loginOauth(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/login/{module}/{providerName}/{clientName?}", "get", options);
		}
		associate(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/associate/{module}/{providerName}/{clientName?}", "get", options);
		}
		migrate(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}", "get", options);
		}
		refreshAuthToken(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/refreshAuthToken", "post", options);
		}
		createPassportJwtFromOauthCode(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/createPassportJwtFromOauthCode", "post", options);
		}
		createTempAuthToken(options) {
			return this.$sdk.createApiSchemas("/api/home/user/passport/createTempAuthToken", "post", options);
		}
	}) || _class$3) || _class$3);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/testSsrToolOne.ts
var _dec$2, _dec2$2, _class$2, ApiSchemaTestSsrToolOne;
var init_testSsrToolOne = __esmMin((() => {
	init_src$1();
	init_src$3();
	init_testSsrToolOne$1();
	ApiSchemaTestSsrToolOne = (_dec$2 = ApiSchema(), _dec2$2 = BeanInfo({ module: "home-api" }), _dec$2(_class$2 = _dec2$2(_class$2 = class ApiSchemaTestSsrToolOne extends BeanBase {
		testGet(options) {
			return this.$sdk.createApiSchemas("/api/test/ssr/toolOne/test/{id?}", "get", options);
		}
		test(options) {
			return this.$sdk.createApiSchemas("/api/test/ssr/toolOne/test/{id?}", "post", options);
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/service/jwtAdapter.ts
var _dec$1, _dec2$1, _class$1, ServiceJwtAdapter;
var init_jwtAdapter = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_src$2();
	ServiceJwtAdapter = (_dec$1 = Service(), _dec2$1 = BeanInfo({ module: "home-api" }), _dec$1(_class$1 = _dec2$1(_class$1 = class ServiceJwtAdapter extends BeanBase {
		__init__() {
			return _asyncToGenerator(function* () {})();
		}
		getJwtInfo() {
			var _this = this;
			return _asyncToGenerator(function* () {
				return yield _this.$passport.getJwtInfo();
			})();
		}
		refreshAuthToken(refreshToken) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				return yield _this2.$passport.refreshAuthToken(refreshToken);
			})();
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/.metadata/index.ts
/** api: end */
/** api: begin */
/** apiSchema: end */
/** apiSchema: begin */
/** service: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleHomeApi;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_captcha$1();
	init_home$1();
	init_homeBaseMenu$1();
	init_homeBasePermission$1();
	init_homeUserPassport$1();
	init_testSsrToolOne$1();
	init_openapi();
	init_captcha();
	init_home();
	init_homeBaseMenu();
	init_homeBasePermission();
	init_homeUserPassport();
	init_testSsrToolOne();
	init_jwtAdapter();
	init_src$2();
	ScopeModuleHomeApi = (_dec = Scope(), _dec2 = BeanInfo({ module: "home-api" }), _dec(_class = _dec2(_class = class ScopeModuleHomeApi extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-api/src/types/api.ts
var init_api = __esmMin((() => {}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/types/index.ts
var init_types = __esmMin((() => {
	init_api();
}));
//#endregion
//#region src/suite/a-home/modules/home-api/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ApiApiCaptchacreatePath: () => ApiApiCaptchacreatePath,
	ApiApiCaptcharefreshPath: () => ApiApiCaptcharefreshPath,
	ApiApiCaptchaverifyImmediatePath: () => ApiApiCaptchaverifyImmediatePath,
	ApiApiHomeBaseMenuretrieveMenusPath: () => ApiApiHomeBaseMenuretrieveMenusPath,
	ApiApiHomeBasePermissionretrievePermissionsPath: () => ApiApiHomeBasePermissionretrievePermissionsPath,
	ApiApiHomeUserPassportassociatePath: () => ApiApiHomeUserPassportassociatePath,
	ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath: () => ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath,
	ApiApiHomeUserPassportcreateTempAuthTokenPath: () => ApiApiHomeUserPassportcreateTempAuthTokenPath,
	ApiApiHomeUserPassportcurrentPath: () => ApiApiHomeUserPassportcurrentPath,
	ApiApiHomeUserPassportloginOauthPath: () => ApiApiHomeUserPassportloginOauthPath,
	ApiApiHomeUserPassportloginPath: () => ApiApiHomeUserPassportloginPath,
	ApiApiHomeUserPassportlogoutPath: () => ApiApiHomeUserPassportlogoutPath,
	ApiApiHomeUserPassportmigratePath: () => ApiApiHomeUserPassportmigratePath,
	ApiApiHomeUserPassportrefreshAuthTokenPath: () => ApiApiHomeUserPassportrefreshAuthTokenPath,
	ApiApiHomeUserPassportregisterPath: () => ApiApiHomeUserPassportregisterPath,
	ApiApiHomeindexPath: () => "/",
	ApiApiTestSsrToolOnetestGetPath: () => ApiApiTestSsrToolOnetestGetPath,
	ApiApiTestSsrToolOnetestPath: () => ApiApiTestSsrToolOnetestPath,
	ApiCaptcha: () => ApiCaptcha,
	ApiHome: () => ApiHome,
	ApiHomeBaseMenu: () => ApiHomeBaseMenu,
	ApiHomeBasePermission: () => ApiHomeBasePermission,
	ApiHomeUserPassport: () => ApiHomeUserPassport,
	ApiSchemaCaptcha: () => ApiSchemaCaptcha,
	ApiSchemaHome: () => ApiSchemaHome,
	ApiSchemaHomeBaseMenu: () => ApiSchemaHomeBaseMenu,
	ApiSchemaHomeBasePermission: () => ApiSchemaHomeBasePermission,
	ApiSchemaHomeUserPassport: () => ApiSchemaHomeUserPassport,
	ApiSchemaTestSsrToolOne: () => ApiSchemaTestSsrToolOne,
	ApiTestSsrToolOne: () => ApiTestSsrToolOne,
	OpenApiBaseURL: () => OpenApiBaseURL,
	ScopeModuleHomeApi: () => ScopeModuleHomeApi,
	ServiceJwtAdapter: () => ServiceJwtAdapter
});
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { OpenApiBaseURL as i, src_exports as n, ApiApiHomeUserPassportloginOauthPath as r, init_src as t };

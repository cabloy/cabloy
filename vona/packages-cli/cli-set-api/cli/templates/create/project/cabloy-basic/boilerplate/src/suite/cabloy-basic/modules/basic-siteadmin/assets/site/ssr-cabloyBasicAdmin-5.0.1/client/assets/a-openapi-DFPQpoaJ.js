import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { _ as shallowReactive, b as toRaw, h as ref } from "./vue-CeNp4lbs.js";
import { k as watch } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { C as init_zod, J as init_dist, T as external_exports, U as evaluateSimple, Z as isNil, a as init_esm, i as esm_default } from "./zova-BE4e4PxD.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, T as usePrepareArg, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase, w as Use, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { d as Sys, i as Scope, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Model, o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { n as init_oas30, t as init_oas31 } from "./openapi3-lZ6bLM-A.js";
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/database.ts
var OrderBusinessBase, OrderUnknownBase, OrderMaxBase;
var init_database = __esmMin((() => {
	OrderBusinessBase = 1e3;
	OrderUnknownBase = 1e4;
	OrderMaxBase = 1e5;
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts
function loadSchemaProperties(schema, onGetSchema, schemaScene) {
	if (!schema) return;
	const properties = schema.properties;
	const result = [];
	for (let key in properties) {
		var _property$rest, _property$rest$form, _property$rest2, _property$rest$schema, _property$rest3;
		let property = properties[key];
		if (property.$ref) property = onGetSchema(property.$ref);
		if (!property) continue;
		const fieldSource = (_property$rest = property.rest) === null || _property$rest === void 0 ? void 0 : _property$rest.fieldSource;
		if (fieldSource) {
			const parts = fieldSource.split(".");
			const propertyParent = parts[0] === key ? property : result.find((item) => item.key === parts[0]);
			property = propertyParent === null || propertyParent === void 0 ? void 0 : propertyParent.properties[parts[1]];
			key = fieldSource;
		}
		if (!property) continue;
		property = deepExtend({ key }, property, schemaScene && [
			"form-view",
			"form-create",
			"filter"
		].includes(schemaScene) ? { rest: (_property$rest$form = (_property$rest2 = property.rest) === null || _property$rest2 === void 0 ? void 0 : _property$rest2["form"]) !== null && _property$rest$form !== void 0 ? _property$rest$form : {} } : void 0, schemaScene ? { rest: (_property$rest$schema = (_property$rest3 = property.rest) === null || _property$rest3 === void 0 ? void 0 : _property$rest3[schemaScene]) !== null && _property$rest$schema !== void 0 ? _property$rest$schema : {} } : void 0);
		result.push(property);
	}
	result.sort((a, b) => {
		var _a$rest$order, _a$rest, _b$rest$order, _b$rest;
		return ((_a$rest$order = (_a$rest = a.rest) === null || _a$rest === void 0 ? void 0 : _a$rest.order) !== null && _a$rest$order !== void 0 ? _a$rest$order : OrderUnknownBase) - ((_b$rest$order = (_b$rest = b.rest) === null || _b$rest === void 0 ? void 0 : _b$rest.order) !== null && _b$rest$order !== void 0 ? _b$rest$order : OrderUnknownBase);
	});
	return result;
}
function schemaToZodSchema(schema, onGetSchema) {
	return evaluateSimple(esm_default(_normalizeSchema(toRaw(schema), onGetSchema)), { z: external_exports });
}
function _normalizeSchema(schema, onGetSchema) {
	if (!schema.properties) return schema;
	const schemaNew = Object.assign({}, schema, { properties: {} });
	for (const key in schema.properties) {
		let property = schema.properties[key];
		if (property === null || property === void 0 ? void 0 : property.$ref) property = onGetSchema(property.$ref);
		if (!property) continue;
		schemaNew.properties[key] = _normalizeSchema(property, onGetSchema);
	}
	return schemaNew;
}
function getSchemaOfRequestBody(operationObject) {
	var _cast;
	return (_cast = cast(operationObject === null || operationObject === void 0 ? void 0 : operationObject.requestBody)) === null || _cast === void 0 || (_cast = _cast.content) === null || _cast === void 0 || (_cast = _cast["application/json"]) === null || _cast === void 0 ? void 0 : _cast.schema;
}
function getSchemaOfResponseBody(operationObject) {
	var _operationObject$resp;
	return operationObject === null || operationObject === void 0 || (_operationObject$resp = operationObject.responses) === null || _operationObject$resp === void 0 || (_operationObject$resp = _operationObject$resp["200"]) === null || _operationObject$resp === void 0 || (_operationObject$resp = _operationObject$resp.content) === null || _operationObject$resp === void 0 || (_operationObject$resp = _operationObject$resp["application/json"]) === null || _operationObject$resp === void 0 ? void 0 : _operationObject$resp.schema;
}
function getSchemaOfRequestQuery(operationObject) {
	const parameters = operationObject === null || operationObject === void 0 ? void 0 : operationObject.parameters;
	if (!parameters) return;
	const schema = {
		type: "object",
		required: [],
		properties: {}
	};
	for (const _parameter of parameters) {
		const parameter = _parameter;
		if (parameter.in !== "query") continue;
		const name = parameter.name;
		const fieldSchema = parameter.schema;
		schema.properties[name] = fieldSchema;
		if (parameter.required) schema.required.push(name);
	}
	return schema;
}
function getSchemaOfRequestQueryFilter(operationObject, options) {
	const parameters = operationObject === null || operationObject === void 0 ? void 0 : operationObject.parameters;
	if (!parameters) return;
	const schema = {
		type: "object",
		required: [],
		properties: {}
	};
	for (const _parameter of parameters) {
		var _fieldSchema$filter, _fieldSchema$filter2;
		const parameter = _parameter;
		if (parameter.in !== "query") continue;
		const name = parameter.name;
		if (__FilterColumnsIgnore.includes(name)) continue;
		const fieldSchema = parameter.schema;
		if ((options === null || options === void 0 ? void 0 : options.where) === true && ((_fieldSchema$filter = fieldSchema.filter) === null || _fieldSchema$filter === void 0 || (_fieldSchema$filter = _fieldSchema$filter.capabilities) === null || _fieldSchema$filter === void 0 ? void 0 : _fieldSchema$filter.where) !== false || (options === null || options === void 0 ? void 0 : options.order) === true && ((_fieldSchema$filter2 = fieldSchema.filter) === null || _fieldSchema$filter2 === void 0 || (_fieldSchema$filter2 = _fieldSchema$filter2.capabilities) === null || _fieldSchema$filter2 === void 0 ? void 0 : _fieldSchema$filter2.order) !== false) {
			schema.properties[name] = fieldSchema;
			if (parameter.required) schema.required.push(name);
		}
	}
	return schema;
}
var __FilterColumnsIgnore;
var init_schema$1 = __esmMin((() => {
	init_esm();
	init_dist();
	init_vue_runtime_esm_bundler();
	init_zod();
	init_src$1();
	init_database();
	__FilterColumnsIgnore = [
		"columns",
		"where",
		"orders",
		"pageNo",
		"pageSize"
	];
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$2, _dec2$2, _dec3, _dec4, _dec5, _class$2, _class2, __schemaRefPrefix, ModelSdk;
var init_sdk$1 = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_dist();
	init_src$3();
	init_schema$1();
	__schemaRefPrefix = "#/components/schemas/";
	ModelSdk = (_dec$2 = Model({ enableSelector: true }), _dec2$2 = BeanInfo({ module: "a-openapi" }), _dec3 = Use({ beanFullName: "a-openapi.sys.sdk" }), _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", []), _dec$2(_class$2 = _dec2$2(_class$2 = (_class2 = class ModelSdk extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this._eventSsrHmrReload = void 0;
		}
		get $$sysSdk() {
			return usePrepareArg(this.selector, true);
		}
		__init__(locale) {
			var _superprop_get__init__ = () => super.__init__, _this = this;
			return _asyncToGenerator(function* () {
				if (!locale) throw new Error("locale not specified");
				yield _superprop_get__init__().call(_this, locale);
				if (_this.sys.config.ssr.hmr) _this._eventSsrHmrReload = _this.sys.meta.event.on("a-ssrhmr:reload", function() {
					var _ref = _asyncToGenerator(function* (_data, next) {
						yield _this.$refetchQueries({ queryKey: ["bootstrap"] });
						yield _this.$refetchQueries({ queryKey: ["sdk"] });
						return next();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
			})();
		}
		__dispose__() {
			if (this._eventSsrHmrReload) this._eventSsrHmrReload();
		}
		getBootstrap(resource) {
			var _this2 = this;
			return this.$useStateData({
				queryKey: ["bootstrap", resource],
				queryFn: function() {
					var _ref2 = _asyncToGenerator(function* () {
						const bootstrap = yield _this2.$$sysSdk.loadBootstrap(_this2.$fetch, resource);
						if (!bootstrap) throw new Error("load bootstrap error");
						yield _this2.$refetchQueries({ queryKey: ["permissions", resource] });
						return bootstrap !== null && bootstrap !== void 0 ? bootstrap : null;
					});
					return function queryFn() {
						return _ref2.apply(this, arguments);
					};
				}()
			});
		}
		getPermissions(resource) {
			var _this3 = this;
			return this.$useStateData({
				queryKey: ["permissions", resource],
				queryFn: function() {
					var _ref3 = _asyncToGenerator(function* () {
						const permissions = yield _this3.$fetch.get(_this3.sys.util.apiActionPathTranslate(_this3.scope.config.api.permissions, { resource }), _this3.sys.util.apiActionConfigPrepare());
						return permissions !== null && permissions !== void 0 ? permissions : null;
					});
					return function queryFn() {
						return _ref3.apply(this, arguments);
					};
				}()
			});
		}
		getSdk(api, apiMethod, apiOptions) {
			var _this4 = this;
			if (!api) throw new Error("should specify api");
			const [api2, apiMethod2] = this.$$sysSdk.prepareApiMeta(api, apiMethod);
			return this.$useStateData({
				queryKey: [
					"sdk",
					api2,
					apiMethod2
				],
				queryFn: function() {
					var _ref4 = _asyncToGenerator(function* () {
						const sdk = yield _this4.$$sysSdk.loadSdk(_this4.$fetch, api, apiMethod, apiOptions);
						if (!sdk) throw new Error("load sdk error");
						for (const schemaName of sdk.schemas) yield _this4.$refetchQueries({ queryKey: ["schema", schemaName] });
						return sdk;
					});
					return function queryFn() {
						return _ref4.apply(this, arguments);
					};
				}()
			});
		}
		getSchema(schemaName) {
			var _this5 = this;
			if (schemaName.startsWith(__schemaRefPrefix)) schemaName = schemaName.substring(21);
			return this.$useStateData({
				queryKey: ["schema", schemaName],
				queryFn: function() {
					var _ref5 = _asyncToGenerator(function* () {
						const schema = _this5.$$sysSdk.getSchema(schemaName);
						return schema !== null && schema !== void 0 ? schema : null;
					});
					return function queryFn() {
						return _ref5.apply(this, arguments);
					};
				}()
			});
		}
		getZodSchema(schemaName) {
			return this.$useStateComputed({
				queryKey: ["zodSchema", schemaName],
				queryFn: () => {
					const querySchema = this.getSchema(schemaName);
					if (!querySchema.data) return null;
					return this.schemaToZodSchema(querySchema.data);
				}
			});
		}
		getSchemaDefaultValue(schemaName) {
			return this.$useStateComputed({
				queryKey: ["schemaDefaultValue", schemaName],
				queryFn: () => {
					const querySchema = this.getSchema(schemaName);
					if (!querySchema.data) return null;
					const schema = querySchema.data;
					const defaultValues = {};
					for (const key in schema.properties) {
						const property = schema.properties[key];
						if (!isNil(property.default)) defaultValues[key] = property.default;
					}
					return defaultValues;
				}
			});
		}
		createApiSchemas(api, apiMethod, apiOptions) {
			const self = this;
			const sdk = this.getSdk(api, apiMethod, apiOptions);
			return {
				get sdk() {
					return sdk;
				},
				get query() {
					var _sdk$data;
					return getSchemaOfRequestQuery((_sdk$data = sdk.data) === null || _sdk$data === void 0 ? void 0 : _sdk$data.operationObject);
				},
				get filter() {
					var _sdk$data2;
					return getSchemaOfRequestQueryFilter((_sdk$data2 = sdk.data) === null || _sdk$data2 === void 0 ? void 0 : _sdk$data2.operationObject, { where: true });
				},
				get requestBody() {
					var _sdk$data3, _cast;
					const schemaBody = getSchemaOfRequestBody((_sdk$data3 = sdk.data) === null || _sdk$data3 === void 0 ? void 0 : _sdk$data3.operationObject);
					const schemaName = (_cast = cast(schemaBody)) === null || _cast === void 0 ? void 0 : _cast.$ref;
					if (schemaName) return self.getSchema(schemaName).data;
					return schemaBody;
				},
				get responseBody() {
					var _sdk$data4, _schemaBody$propertie, _cast2;
					const schemaBody = getSchemaOfResponseBody((_sdk$data4 = sdk.data) === null || _sdk$data4 === void 0 ? void 0 : _sdk$data4.operationObject);
					const schemaData = schemaBody === null || schemaBody === void 0 || (_schemaBody$propertie = schemaBody.properties) === null || _schemaBody$propertie === void 0 ? void 0 : _schemaBody$propertie.data;
					const schemaName = (_cast2 = cast(schemaData)) === null || _cast2 === void 0 ? void 0 : _cast2.$ref;
					if (schemaName) return self.getSchema(schemaName).data;
					return schemaData;
				},
				get paged() {
					var _sdk$data5, _cast3, _schemaBody$propertie2;
					const schemaBody = getSchemaOfResponseBody((_sdk$data5 = sdk.data) === null || _sdk$data5 === void 0 ? void 0 : _sdk$data5.operationObject);
					if (!schemaBody) return;
					if ((_cast3 = cast(schemaBody === null || schemaBody === void 0 || (_schemaBody$propertie2 = schemaBody.properties) === null || _schemaBody$propertie2 === void 0 ? void 0 : _schemaBody$propertie2.data)) === null || _cast3 === void 0 || (_cast3 = _cast3.items) === null || _cast3 === void 0 ? void 0 : _cast3.$ref) return;
					return this.responseBody;
				},
				get row() {
					var _sdk$data6, _schemaBody$propertie3, _cast4, _cast5, _schemaData$propertie;
					const schemaBody = getSchemaOfResponseBody((_sdk$data6 = sdk.data) === null || _sdk$data6 === void 0 ? void 0 : _sdk$data6.operationObject);
					if (!schemaBody) return;
					let schemaData;
					if (schemaBody === null || schemaBody === void 0 || (_schemaBody$propertie3 = schemaBody.properties) === null || _schemaBody$propertie3 === void 0 ? void 0 : _schemaBody$propertie3.data.$ref) {
						var _schemaBody$propertie4;
						schemaData = self.getSchema(schemaBody === null || schemaBody === void 0 || (_schemaBody$propertie4 = schemaBody.properties) === null || _schemaBody$propertie4 === void 0 ? void 0 : _schemaBody$propertie4.data.$ref).data;
					} else {
						var _schemaBody$propertie5;
						schemaData = schemaBody === null || schemaBody === void 0 || (_schemaBody$propertie5 = schemaBody.properties) === null || _schemaBody$propertie5 === void 0 ? void 0 : _schemaBody$propertie5.data;
					}
					const schemaName = (_cast4 = cast(schemaData)) === null || _cast4 === void 0 || (_cast4 = _cast4.items) === null || _cast4 === void 0 ? void 0 : _cast4.$ref;
					if (schemaName) return self.getSchema(schemaName).data;
					const schemaRow = (_cast5 = cast(schemaData === null || schemaData === void 0 || (_schemaData$propertie = schemaData.properties) === null || _schemaData$propertie === void 0 ? void 0 : _schemaData$propertie.list)) === null || _cast5 === void 0 ? void 0 : _cast5.items;
					if (schemaRow === null || schemaRow === void 0 ? void 0 : schemaRow.$ref) return self.getSchema(schemaRow === null || schemaRow === void 0 ? void 0 : schemaRow.$ref).data;
					return schemaRow;
				}
			};
		}
		loadSchemaProperties(schema, schemaScene) {
			return loadSchemaProperties(schema, (schemaName) => this.getSchema(schemaName).data, schemaScene);
		}
		schemaToZodSchema(schema) {
			return schemaToZodSchema(schema, (schemaName) => this.getSchema(schemaName).data);
		}
	}, _applyDecoratedDescriptor(_class2.prototype, "$$sysSdk", [
		_dec3,
		_dec4,
		_dec5
	], Object.getOwnPropertyDescriptor(_class2.prototype, "$$sysSdk"), _class2.prototype), _class2)) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/sdk.ts
var SymbolOpenapiSchemaName;
var init_sdk = __esmMin((() => {
	SymbolOpenapiSchemaName = "__schemaName__";
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/bean/sys.sdk.ts
var _dec$1, _dec2$1, _class$1, SysSdk;
var init_sys_sdk = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_vue_runtime_esm_bundler();
	init_src$2();
	init_sdk();
	SysSdk = (_dec$1 = Sys(), _dec2$1 = BeanInfo({ module: "a-openapi" }), _dec$1(_class$1 = _dec2$1(_class$1 = class SysSdk extends BeanBase {
		constructor(...args) {
			super(...args);
			this.locale = void 0;
			this.bootstraps = void 0;
			this.schemas = void 0;
			this.sdks = void 0;
			this._eventSsrHmrReload = void 0;
			this._fetch = void 0;
		}
		__init__(locale) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.locale = locale;
				_this.bootstraps = shallowReactive({});
				_this.schemas = shallowReactive({});
				_this.sdks = shallowReactive({});
				if (_this.sys.config.ssr.hmr) _this._eventSsrHmrReload = _this.sys.meta.event.on("a-ssrhmr:reload", function() {
					var _ref = _asyncToGenerator(function* (_data, next) {
						yield _this.reload();
						return next();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
			})();
		}
		__dispose__() {
			if (this._eventSsrHmrReload) this._eventSsrHmrReload();
		}
		reload() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const bootstraps = _this2.bootstraps;
				_this2.bootstraps = shallowReactive({});
				for (const resource in bootstraps) yield _this2.loadBootstrap(_this2._fetch, resource);
				const sdks = _this2.sdks;
				_this2.sdks = shallowReactive({});
				for (const api in sdks) for (const apiMethod in sdks[api]) yield _this2.loadSdk(_this2._fetch, api, apiMethod, { authToken: false });
			})();
		}
		getBootstrap(resource) {
			return this.bootstraps[resource];
		}
		getSdk(api, apiMethod) {
			var _this$sdks$api;
			if (!api) return;
			const [api2, apiMethod2] = this.prepareApiMeta(api, apiMethod);
			return (_this$sdks$api = this.sdks[api2]) === null || _this$sdks$api === void 0 ? void 0 : _this$sdks$api[apiMethod2];
		}
		getSchema(schemaName) {
			return this.schemas[schemaName];
		}
		loadBootstrap($fetch, resource) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				_this3._fetch = $fetch;
				if (!_this3.bootstraps[resource]) _this3.bootstraps[resource] = yield $fetch.get(_this3.sys.util.apiActionPathTranslate(_this3.scope.config.api.bootstrap, { resource }), _this3.sys.util.apiActionConfigPrepare(void 0, void 0, false));
				return _this3.bootstraps[resource];
			})();
		}
		loadSdk($fetch, api, apiMethod, apiOptions) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				var _this$sdks$api2, _data$doc$components;
				_this4._fetch = $fetch;
				if (!api) return;
				const [api2, apiMethod2] = _this4.prepareApiMeta(api, apiMethod);
				if ((_this$sdks$api2 = _this4.sdks[api2]) === null || _this$sdks$api2 === void 0 ? void 0 : _this$sdks$api2[apiMethod2]) return _this4.sdks[api2][apiMethod2];
				const params = [_this4.sys.util.apiActionPathTranslate(api2)];
				if (!["get", "delete"].includes(apiMethod2)) params.push(void 0);
				const options = {
					authToken: apiOptions === null || apiOptions === void 0 ? void 0 : apiOptions.authToken,
					openapiSchema: true,
					headers: {}
				};
				const localeKey = _this4.sys.env.APP_LOCALE_HEADER_KEY;
				if (localeKey) options.headers[localeKey] = _this4.locale;
				params.push(_this4.sys.util.apiActionConfigPrepare(void 0, options));
				const data = yield $fetch[apiMethod2](...params);
				const schemaNames = [];
				const schemas = (_data$doc$components = data.doc.components) === null || _data$doc$components === void 0 ? void 0 : _data$doc$components.schemas;
				if (schemas) for (const key in schemas) {
					const schema = schemas[key];
					if (!schema["__schemaName__"]) schema["__schemaName__"] = key;
					_this4.schemas[key] = schema;
					schemaNames.push(key);
				}
				const paths = data.doc.paths;
				if (paths) for (const key in paths) {
					if (!_this4.sdks[api2]) _this4.sdks[api2] = shallowReactive({});
					for (const method in paths[key]) _this4.sdks[api2][method] = {
						schemas: schemaNames,
						operationObject: paths[key][method],
						meta: data.meta
					};
				}
				return _this4.sdks[api2][apiMethod2];
			})();
		}
		prepareApiMeta(api, apiMethod) {
			return [api, apiMethod !== null && apiMethod !== void 0 ? apiMethod : "get"];
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/config/config.ts
var config;
var init_config = __esmMin((() => {
	config = (_sys) => {
		return {
			formProvider: {},
			api: {
				bootstrap: "/api/openapischema/resource/bootstrap/:resource",
				permissions: "/api/home/base/permission/:resource"
			}
		};
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		constructor(moduleSelf) {
			super();
			this._moduleSelf = void 0;
			this._modelSdk = ref();
			this._moduleSelf = moduleSelf;
		}
		moduleLoading(_module) {
			return _asyncToGenerator(function* () {})();
		}
		moduleLoaded(module) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (_this._moduleSelf === module) {
					yield _this._loadSdk();
					_this.ctx.util.instanceScope(() => {
						return watch(() => {
							return _this.app.meta.locale.current;
						}, _asyncToGenerator(function* () {
							yield _this._loadSdk();
						}));
					});
				}
			})();
		}
		beanInit(bean, beanInstance) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				const self = _this2;
				bean.defineProperty(beanInstance, "$sdk", {
					enumerable: false,
					configurable: true,
					get() {
						return self._modelSdk;
					}
				});
			})();
		}
		_loadSdk() {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				_this3._modelSdk.value = yield _this3.app.bean._getBeanSelector("a-openapi.model.sdk", true, _this3.app.meta.locale.current);
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/.metadata/index.ts
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAOpenapi;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_sdk$1();
	init_src$3();
	init_sys_sdk();
	init_config();
	init_monkey();
	init_src$2();
	ScopeModuleAOpenapi = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-openapi" }), _dec(_class = _dec2(_class = class ScopeModuleAOpenapi extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_schema$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/action.ts
var init_action = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/permissions.ts
var init_permissions = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/rest.ts
var renderFormFieldTopPropsSystem, renderTableColumnTopPropsSystem;
var init_rest = __esmMin((() => {
	init_oas30();
	init_oas31();
	renderFormFieldTopPropsSystem = [
		"order",
		"table",
		"form",
		"form-view",
		"form-create",
		"filter"
	];
	renderTableColumnTopPropsSystem = [
		"order",
		"table",
		"form",
		"form-view",
		"form-create",
		"filter"
	];
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/schema.ts
var init_schema = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/table.ts
var init_table = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/formMeta.ts
var init_formMeta = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/formProvider.ts
var init_formProvider = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/order.ts
var init_order = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/captcha.ts
var init_captcha = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableCell.ts
var init_tableCell = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionRow.ts
var init_tableActionRow = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionBulk.ts
var init_tableActionBulk = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formField.ts
var init_formField = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formActionRow.ts
var init_formActionRow = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/block.ts
var init_block = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formFieldLayout.ts
var init_formFieldLayout = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableAction.ts
var init_tableAction = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/index.ts
var init_resource = __esmMin((() => {
	init_tableCell();
	init_tableActionRow();
	init_tableActionBulk();
	init_formField();
	init_formActionRow();
	init_block();
	init_formFieldLayout();
	init_tableAction();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/types/index.ts
var init_types = __esmMin((() => {
	init_action();
	init_database();
	init_permissions();
	init_rest();
	init_schema();
	init_sdk();
	init_table();
	init_formMeta();
	init_formProvider();
	init_order();
	init_captcha();
	init_resource();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-openapi/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ModelSdk: () => ModelSdk,
	Monkey: () => Monkey,
	OrderBusinessBase: () => OrderBusinessBase,
	OrderCoreBase: () => 100,
	OrderMaxBase: () => OrderMaxBase,
	OrderUnknownBase: () => OrderUnknownBase,
	ScopeModuleAOpenapi: () => ScopeModuleAOpenapi,
	SymbolOpenapiSchemaName: () => SymbolOpenapiSchemaName,
	SysSdk: () => SysSdk,
	config: () => config,
	getSchemaOfRequestBody: () => getSchemaOfRequestBody,
	getSchemaOfRequestQuery: () => getSchemaOfRequestQuery,
	getSchemaOfRequestQueryFilter: () => getSchemaOfRequestQueryFilter,
	getSchemaOfResponseBody: () => getSchemaOfResponseBody,
	loadSchemaProperties: () => loadSchemaProperties,
	renderFormFieldTopPropsSystem: () => renderFormFieldTopPropsSystem,
	renderTableColumnTopPropsSystem: () => renderTableColumnTopPropsSystem,
	schemaToZodSchema: () => schemaToZodSchema
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { SymbolOpenapiSchemaName as i, src_exports as n, renderFormFieldTopPropsSystem as r, init_src as t };

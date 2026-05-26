import { a as __toESM, n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { i as hyphenate, n as camelize, o as init_shared_esm_bundler, r as hasChanged, t as EMPTY_OBJ } from "./vue-CvF_GLFp.js";
import { _ as shallowReactive, a as init_reactivity_esm_bundler, d as pauseTracking, g as resetTracking, h as ref, i as customRef, l as markRaw, p as reactive, s as isReactive, x as toRef } from "./vue-CeNp4lbs.js";
import { A as watchEffect, C as onMounted, D as setCurrentInstance, E as queuePostFlushCb, M as watchSyncEffect, O as useSlots, T as provide, d as defineComponent, f as getCurrentInstance, g as inject, h as init_runtime_core_esm_bundler, j as watchPostEffect, k as watch, o as computed, u as defineAsyncComponent, w as onUnmounted, x as onBeforeUnmount, y as nextTick } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler, t as init_jsx_runtime } from "./vue-CmE1HVn9.js";
import { A as compose, G as forEachSync, H as evaluateExpressions, J as init_dist, M as extend, N as init_dist$1, Q as isNilOrEmptyString, R as combineApiPathControllerAndAction, S as translateError, V as defaultPathSerializer, W as forEach, X as isEmptyObject, Y as isClass, Z as isNil, _ as ZodMetadata, b as setLocaleAdapter, et as isUndefined, f as getLocaleText, g as setParseAdapter, h as init_dist$5, j as init_dist$2, l as init_dist$7, m as init_dist$6, nt as init_dist$8, u as parseInfo, v as init_dist$4, x as setLocaleErrors, y as init_dist$3 } from "./zova-BE4e4PxD.js";
import { a as PluginFreeze, d as _objectSpread2, f as init_objectSpread2, i as init_objectWithoutProperties, m as init_asyncToGenerator, o as init_dist$9, p as _asyncToGenerator, r as _objectWithoutProperties, s as require_deep_equal } from "./fecha-DmopMB3M.js";
import { a as skipPrefix, i as skipLastWord, n as parseLastWord, o as splitWords, t as init_src$1 } from "./zova-6Abekb1F.js";
import { t as require_Reflect } from "./zova-C4pGJxwQ.js";
import { a as Logger, c as format, d as NpmConfigSetLevels, i as print, l as colorize, t as init_src$2 } from "./zova-k6QiZ1ov.js";
//#region packages-zova/zova-core/src/types/utils/cast.ts
function cast(source) {
	return source;
}
var init_cast = __esmMin((() => {})), AppMetadata, appMetadata;
var init_metadata = __esmMin((() => {
	init_dist();
	require_Reflect();
	AppMetadata = class {
		defineMetadata(metadataKey, metadataValue, target, prop) {
			if (isUndefined(prop)) Reflect.defineMetadata(metadataKey, metadataValue, target);
			else Reflect.defineMetadata(metadataKey, metadataValue, target, prop);
		}
		getOwnMetadata(metadataKey, target, prop) {
			if (isUndefined(prop)) return Reflect.getOwnMetadata(metadataKey, target);
			return Reflect.getOwnMetadata(metadataKey, target, prop);
		}
		getMetadata(metadataKey, target, prop) {
			if (isUndefined(prop)) return Reflect.getMetadata(metadataKey, target);
			return Reflect.getMetadata(metadataKey, target, prop);
		}
		getOwnMetadataArray(inherit, metadataKey, target, prop) {
			let own = this.getOwnMetadata(metadataKey, target, prop);
			if (!own) {
				if (!inherit) own = [];
				else {
					const parent = this.getMetadata(metadataKey, target, prop);
					if (parent) own = parent.slice();
					else own = [];
				}
				this.defineMetadata(metadataKey, own, target, prop);
			}
			return own;
		}
		getOwnMetadataMap(inherit, metadataKey, target, prop) {
			let own = this.getOwnMetadata(metadataKey, target, prop);
			if (!own) {
				if (!inherit) own = {};
				else {
					const parent = this.getMetadata(metadataKey, target, prop);
					if (parent) own = Object.assign({}, parent);
					else own = {};
				}
				this.defineMetadata(metadataKey, own, target, prop);
			}
			return own;
		}
		getDesignType(target, prop) {
			return this.getMetadata("design:type", target, prop);
		}
		getDesignParamtypes(target, prop) {
			return this.getMetadata("design:paramtypes", target, prop);
		}
		getDesignReturntype(target, prop) {
			return this.getMetadata("design:returntype", target, prop);
		}
	};
	appMetadata = new AppMetadata();
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/type.ts
var SymbolMappedClassMetadataKeys;
var init_type$9 = __esmMin((() => {
	SymbolMappedClassMetadataKeys = Symbol("SymbolMappedClassMetakeys");
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/utils.ts
function registerMappedClassMetadataKey(target, metadataKey, options) {
	const metadataKeys = appMetadata.getOwnMetadataMap(true, SymbolMappedClassMetadataKeys, target);
	if (!Object.hasOwn(metadataKeys, metadataKey)) metadataKeys[metadataKey] = options;
}
var init_utils$2 = __esmMin((() => {
	init_metadata();
	init_type$9();
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/sysFake.ts
function getSys() {
	return _sys;
}
function setSys(sys) {
	_sys = sys;
}
var _sys;
var init_sysFake = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanSimple.ts
var BeanSimple;
var init_beanSimple = __esmMin((() => {
	BeanSimple = class {
		constructor() {
			this.sys = void 0;
			this.app = void 0;
			this.ctx = void 0;
		}
		get bean() {
			return this.ctx ? this.ctx.bean : this.sys.bean;
		}
	};
})), hexBytes;
var init_uuid = __esmMin((() => {
	hexBytes = Array.from({ length: 256 });
	for (let i = 0; i < 256; i++) hexBytes[i] = (i + 256).toString(16).substring(1);
	(() => {
		const lib = typeof crypto !== "undefined" ? crypto : typeof window !== "undefined" ? window.crypto || window.msCrypto : void 0;
		if (lib !== void 0) {
			if (lib.randomBytes !== void 0) return lib.randomBytes;
			if (lib.getRandomValues !== void 0) return (n) => {
				const bytes = new Uint8Array(n);
				lib.getRandomValues(bytes);
				return bytes;
			};
		}
		return (n) => {
			const r = [];
			for (let i = n; i > 0; i--) r.push(Math.floor(Math.random() * 256));
			return r;
		};
	})();
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/util.ts
function objectAssignReactive(...args) {
	let target = args[0];
	if (!target || typeof target !== "object") throw new Error("invalid args");
	if (!isReactive(target)) target = reactive(target);
	for (let i = 1; i < args.length; i++) {
		const source = args[i];
		if (!source) continue;
		const keys = Object.getOwnPropertyNames(source);
		for (const key of keys) {
			const desc = Object.getOwnPropertyDescriptor(source, key);
			target[key] = desc === null || desc === void 0 ? void 0 : desc.value;
		}
	}
	return target;
}
function deepExtend(...args) {
	return extend(true, ...args);
}
function deepEqual(actual, expected, opts) {
	return (0, import_deep_equal.default)(actual, expected, opts);
}
function disposeInstance(instance) {
	var _instance$__dispose__;
	instance === null || instance === void 0 || (_instance$__dispose__ = instance.__dispose__) === null || _instance$__dispose__ === void 0 || _instance$__dispose__.call(instance);
}
function beanFullNameFromOnionName(onionName, sceneName) {
	return onionName.replace(":", `.${sceneName}.`);
}
function convertToUnit(str, unit = "px") {
	if (str === void 0 || str === null || str === "") return;
	const num = Number(str);
	if (Number.isNaN(num)) return String(str);
	else if (!Number.isFinite(num)) return;
	else return `${num}${unit}`;
}
function isHttpUrl(url) {
	return !!url && (url.startsWith("http://") || url.startsWith("https://"));
}
function throwErrorComponentUnmounted() {
	const error = /* @__PURE__ */ new Error();
	error.code = 600;
	throw error;
}
var import_deep_equal, SysUtil;
var init_util$2 = __esmMin((() => {
	init_dist$1();
	init_dist();
	import_deep_equal = /* @__PURE__ */ __toESM(require_deep_equal(), 1);
	init_vue_runtime_esm_bundler();
	init_beanSimple();
	init_cast();
	init_uuid();
	SysUtil = class extends BeanSimple {
		getAbsoluteUrlFromPagePath(path, ignoreHost, ignorePublicPath) {
			let prefix = ignoreHost ? "" : `${this.sys.env.SSR_PROD_PROTOCOL}://${this.sys.env.SSR_PROD_HOST}`;
			if (!ignorePublicPath && this.sys.env.APP_PUBLIC_PATH) prefix = `${prefix}/${this.sys.env.APP_PUBLIC_PATH}`;
			return `${prefix}${path || ""}`;
		}
		getPagePathFromAbsoluteUrl(url, ignorePublicPath) {
			let pagePath;
			if (isHttpUrl(url)) {
				const _url = new URL(url);
				pagePath = _url.pathname + _url.search;
			} else pagePath = url;
			if (!ignorePublicPath && this.sys.env.APP_PUBLIC_PATH) {
				const prefix = `/${this.sys.env.APP_PUBLIC_PATH}`;
				if (pagePath.startsWith(prefix)) pagePath = pagePath.substring(prefix.length);
			}
			return pagePath;
		}
		getApiBaseURL(useApiPrefix = true) {
			let baseURL = this.sys.config.api.baseURL || "";
			if (useApiPrefix) baseURL = `${baseURL}${this.sys.config.api.prefix || ""}`;
			return baseURL;
		}
		getOpenApiBaseURL(envName) {
			return this.sys.env[envName] || this.sys.env.OPENAPI_BASE_URL_DEFAULT || this.sys.env.API_BASE_URL;
		}
		getApiPath(path) {
			if (!path) return path;
			if (path.startsWith("//")) path = path.substring(1);
			else path = this.sys.config.api.prefix + path;
			return path;
		}
		apiActionPathTranslate(pathName, pathParams) {
			return defaultPathSerializer(pathName, pathParams);
		}
		apiActionConfigPrepare(baseURL, options, authToken) {
			const optionsCustom = {
				params: options === null || options === void 0 ? void 0 : options.query,
				query: void 0
			};
			const interceptors = {};
			authToken = (options === null || options === void 0 ? void 0 : options.authToken) === void 0 ? authToken : options === null || options === void 0 ? void 0 : options.authToken;
			if (authToken !== void 0) interceptors["a-interceptor:jwt"] = { authToken };
			if (options === null || options === void 0 ? void 0 : options.openapiSchema) interceptors["a-interceptor:headers"] = { openapiSchema: options === null || options === void 0 ? void 0 : options.openapiSchema };
			if (!isEmptyObject(interceptors)) optionsCustom.interceptors = interceptors;
			return deepExtend({ baseURL: baseURL || this.getApiBaseURL(false) }, options, optionsCustom);
		}
		getModuleConfigSafe(moduleName) {
			if (this.sys.meta.module.get(moduleName)) return cast(this.sys.bean.scope(moduleName)).config;
			let config = this.sys.config.modules[moduleName];
			if (!config) config = this.sys.config.modules[moduleName] = {};
			return config;
		}
		getModuleConfigOriginal(moduleName) {
			var _this$sys$configOrigi;
			return (_this$sys$configOrigi = this.sys.configOriginal.modules[moduleName]) !== null && _this$sys$configOrigi !== void 0 ? _this$sys$configOrigi : {};
		}
		parseResourceApi(resource, api) {
			const parts = resource.split(":");
			return api !== null && api !== void 0 ? api : combineApiPathControllerAndAction(parts[0], parts[1], void 0, true, true, this.sys.env.API_PREFIX);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/resource.ts
var DecoratorBeanFullName, SymbolDecoratorBeanInfo, SymbolDecoratorProxyDisable, SymbolDecoratorPreload, SymbolDecoratorVirtual, SymbolDecoratorUse, AppResource, appResource;
var init_resource$1 = __esmMin((() => {
	init_dist();
	init_src$1();
	init_utils$2();
	init_cast();
	init_metadata();
	init_sysFake();
	init_util$2();
	init_objectSpread2();
	DecoratorBeanFullName = Symbol("Decorator#BeanFullName");
	SymbolDecoratorBeanInfo = Symbol("SymbolDecoratorBeanInfo");
	SymbolDecoratorProxyDisable = Symbol("SymbolDecoratorProxyDisable");
	SymbolDecoratorPreload = Symbol("SymbolDecoratorPreload");
	SymbolDecoratorVirtual = Symbol("SymbolDecoratorVirtual");
	SymbolDecoratorUse = Symbol("SymbolDecoratorUse");
	AppResource = class {
		constructor() {
			this.beans = {};
			this.scenes = {};
		}
		/** @internal */
		dispose() {}
		addUse(target, options) {
			registerMappedClassMetadataKey(target, SymbolDecoratorUse);
			const uses = appMetadata.getOwnMetadataMap(true, SymbolDecoratorUse, target);
			uses[options.prop] = options;
		}
		getUses(target) {
			return appMetadata.getMetadata(SymbolDecoratorUse, target);
		}
		addBean(beanOptions) {
			const { beanClass, options, optionsPrimitive } = beanOptions;
			const virtual = appMetadata.getOwnMetadata(SymbolDecoratorVirtual, beanClass);
			const { scene, name } = this._parseSceneAndBeanName(beanClass, beanOptions.scene, beanOptions.name);
			const beanInfo = appMetadata.getOwnMetadata(SymbolDecoratorBeanInfo, beanClass);
			const module = beanInfo === null || beanInfo === void 0 ? void 0 : beanInfo.module;
			if (!module) throw new Error(`module name not parsed for bean: ${scene}.${name}`);
			const beanFullName = `${module}.${scene}.${name}`;
			const moduleBelong = this._parseModuleBelong(module, beanClass, virtual);
			const options2 = this._prepareOnionOptions(options, optionsPrimitive, scene, `${module}:${name}`);
			const beanOptions2 = _objectSpread2(_objectSpread2({}, beanOptions), {}, {
				module,
				scene,
				name,
				beanFullName,
				moduleBelong,
				options: options2
			});
			this.beans[beanFullName] = beanOptions2;
			if (!this.scenes[scene]) this.scenes[scene] = {};
			if (!this.scenes[scene][module]) this.scenes[scene][module] = {};
			this.scenes[scene][module][beanFullName] = beanOptions2;
			appMetadata.defineMetadata(DecoratorBeanFullName, beanFullName, beanOptions2.beanClass);
			return beanOptions2;
		}
		getBeanFullName(beanFullName) {
			if (!beanFullName) return beanFullName;
			if (typeof beanFullName === "function" && isClass(beanFullName)) return appMetadata.getOwnMetadata(DecoratorBeanFullName, beanFullName);
			return beanFullName;
		}
		getBean(beanFullName) {
			const fullName = this.getBeanFullName(beanFullName);
			if (!fullName) return null;
			return this.beans[fullName];
		}
		_parseSceneAndBeanName(beanClass, scene, name) {
			if (scene && name) return {
				scene,
				name
			};
			let beanClassName = beanClass.name;
			if (beanClassName.toLowerCase().startsWith("bean")) beanClassName = beanClassName.substring(4);
			if (!name) if (scene) name = skipPrefix(beanClassName, scene, true);
			else name = parseLastWord(beanClassName, true);
			if (!scene) {
				scene = skipLastWord(beanClassName, name, true);
				scene = splitWords(scene, true, ".");
			}
			return {
				scene,
				name
			};
		}
		_parseModuleBelong(module, beanClass, virtual) {
			if (!virtual) return module;
			let moduleBelong;
			let parent = Object.getPrototypeOf(beanClass);
			while (parent) {
				const beanOptions = this.getBean(parent);
				if (beanOptions && beanOptions.moduleBelong) {
					moduleBelong = beanOptions.moduleBelong;
					break;
				}
				parent = Object.getPrototypeOf(parent);
			}
			return moduleBelong;
		}
		_getModuleBelong(beanFullName) {
			const beanOptions = this.getBean(beanFullName);
			return beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.moduleBelong;
		}
		_getModuleName(beanFullName) {
			const beanOptions = this.getBean(beanFullName);
			return beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.module;
		}
		_prepareOnionOptions(options, optionsPrimitive, scene, name) {
			var _cast$onions$scene;
			const optionsConfig = (_cast$onions$scene = cast(getSys().config).onions[scene]) === null || _cast$onions$scene === void 0 ? void 0 : _cast$onions$scene[name];
			if (optionsPrimitive) return optionsConfig === void 0 ? options : optionsConfig;
			else return deepExtend({}, options, optionsConfig);
		}
	};
	appResource = new AppResource();
}));
//#endregion
//#region packages-zova/zova-core/src/utils/stateLock.ts
var SymbolWaitPromise, __counter, StateLock;
var init_stateLock = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	SymbolWaitPromise = Symbol("SymbolWaitPromise");
	__counter = 0;
	StateLock = class StateLock {
		static create() {
			return reactive(new StateLock());
		}
		constructor() {
			this._state = void 0;
			this._resolve = void 0;
			this._state = false;
			__counter++;
		}
		get state() {
			return this._state;
		}
		touch() {
			if (this._state === true) return;
			this._state = true;
			__counter--;
			if (this._resolve) {
				this._resolve.call(void 0, null);
				this._resolve = void 0;
			}
		}
		wait() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this[SymbolWaitPromise]) _this[SymbolWaitPromise] = _this._waitInner();
				return _this[SymbolWaitPromise];
			})();
		}
		_waitInner() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				return new Promise((resolve) => {
					if (_this2.state) return resolve(null);
					_this2._resolve = resolve;
				});
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanBaseSimple.ts
var SymbolBeanFullName, SymbolBeanInstanceKey, SymbolModuleBelong, SymbolModuleName, SymbolInited, BeanBaseSimple;
var init_beanBaseSimple = __esmMin((() => {
	init_resource$1();
	init_stateLock();
	init_beanSimple();
	SymbolBeanFullName = Symbol("SymbolBeanFullName");
	SymbolBeanInstanceKey = Symbol("SymbolBeanInstanceKey");
	SymbolModuleBelong = Symbol("SymbolModuleBelong");
	SymbolModuleName = Symbol("SymbolModuleName");
	SymbolInited = Symbol("SymbolInited");
	BeanBaseSimple = class extends BeanSimple {
		constructor() {
			super();
			this[SymbolBeanFullName] = void 0;
			this[SymbolBeanInstanceKey] = void 0;
			this[SymbolInited] = void 0;
			this[SymbolInited] = StateLock.create();
		}
		get [SymbolModuleBelong]() {
			const moduleBelong = appResource._getModuleBelong(this[SymbolBeanFullName]);
			if (!moduleBelong) throw new Error(`not found module belong: ${this[SymbolBeanFullName]}`);
			return moduleBelong;
		}
		get [SymbolModuleName]() {
			const moduleName = appResource._getModuleName(this[SymbolBeanFullName]);
			if (!moduleName) throw new Error(`not found module name: ${this[SymbolBeanFullName]}`);
			return moduleName;
		}
		get $beanFullName() {
			return this[SymbolBeanFullName];
		}
		get $beanInstanceKey() {
			return this[SymbolBeanInstanceKey];
		}
		get $beanOptions() {
			return appResource.getBean(this[SymbolBeanFullName] || this.constructor);
		}
		get $onionName() {
			const parts = this.$beanFullName.split(".");
			return `${parts[0]}:${parts[2]}`;
		}
		get $onionOptions() {
			return this.$beanOptions.options;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/component/type.ts
var init_type$8 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/component/index.ts
var init_component$6 = __esmMin((() => {
	init_type$8();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/config/type.ts
var init_type$7 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/config/index.ts
var init_config$1 = __esmMin((() => {
	init_type$7();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/constant/type.ts
var init_type$6 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/constant/index.ts
var init_constant$1 = __esmMin((() => {
	init_type$6();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/beanScopeError.ts
var BeanModuleScope$2, BeanScopeError;
var init_beanScopeError = __esmMin((() => {
	init_beanSimple();
	BeanModuleScope$2 = Symbol("BeanScopeError#ModuleScope");
	BeanScopeError = class extends BeanSimple {
		constructor(moduleScope) {
			super();
			this[BeanModuleScope$2] = void 0;
			this.__instances = {};
			this[BeanModuleScope$2] = moduleScope;
		}
		__get__(prop) {
			if (!this.__instances[prop]) this.__instances[prop] = this.app.meta.error.createScopeError(this[BeanModuleScope$2], prop);
			return this.__instances[prop];
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/errorInternal.ts
var errorsInternal;
var init_errorInternal = __esmMin((() => {
	errorsInternal = {
		"0": "Success",
		"1": "Unknown Error",
		"100": "Continue",
		"101": "Switching Protocols",
		"102": "Processing",
		"103": "Early hints",
		"200": "OK",
		"201": "Created",
		"202": "Accepted",
		"203": "Non-Authoritative Information",
		"204": "No Content",
		"205": "Reset Content",
		"206": "Partial Content",
		"207": "Multi-Status",
		"208": "Already Reported",
		"226": "IM Used",
		"300": "Multiple Choices",
		"301": "Moved Permanently",
		"302": "Found",
		"303": "See Other",
		"304": "Not Modified",
		"305": "Use Proxy",
		"307": "Temporary Redirect",
		"308": "Permanent Redirect",
		"400": "Bad Request",
		"401": "Unauthorized",
		"402": "Payment Required",
		"403": "Forbidden",
		"404": "Not Found",
		"405": "Method Not Allowed",
		"406": "Not Acceptable",
		"407": "Proxy Authentication Required",
		"408": "Request Timeout",
		"409": "Conflict",
		"410": "Gone",
		"411": "Length Required",
		"412": "Precondition Failed",
		"413": "Payload Too Large",
		"414": "URI Too Long",
		"415": "Unsupported Media Type",
		"416": "Range Not Satisfiable",
		"417": "Expectation Failed",
		"418": "I'm a teapot",
		"421": "Misdirected Request",
		"422": "Unprocessable Entity",
		"423": "Locked",
		"424": "Failed Dependency",
		"425": "Too Early",
		"426": "Upgrade Required",
		"428": "Precondition Required",
		"429": "Too Many Requests",
		"431": "Request Header Fields Too Large",
		"451": "Unavailable For Legal Reasons",
		"500": "Internal Server Error",
		"501": "Not Implemented",
		"502": "Bad Gateway",
		"503": "Service Unavailable",
		"504": "Gateway Timeout",
		"505": "HTTP Version Not Supported",
		"506": "Variant Also Negotiates",
		"507": "Insufficient Storage",
		"508": "Loop Detected",
		"509": "Bandwidth Limit Exceeded",
		"510": "Not Extended",
		"511": "Network Authentication Required",
		"600": "Component Unmounted"
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/errorClass.ts
function __combineErrorCode(module, code) {
	if (typeof code !== "number" || code <= 1e3) return code;
	return module ? `${module}:${code}` : code;
}
var ErrorClass;
var init_errorClass = __esmMin((() => {
	init_beanSimple();
	init_errorInternal();
	init_asyncToGenerator();
	ErrorClass = class extends BeanSimple {
		/** @internal */
		initialize() {
			return _asyncToGenerator(function* () {})();
		}
		throw(module, code, ...args) {
			const body = this.parseFail(module, code, ...args);
			const err = /* @__PURE__ */ new Error();
			err.code = body.code;
			err.message = body.message;
			if (body.code < 500) err.status = body.code;
			throw err;
		}
		parseFail(module, code, ...args) {
			if (typeof code === "object") return code;
			return this.parseCode(module, 1, code, ...args);
		}
		parseCode(module, codeDefault, code, ...args) {
			const ebError = this.sys.meta.error.errors[module];
			if (typeof code === "string" && /^\d+$/.test(code)) code = Number(code);
			let text;
			if (code && typeof code === "string") {
				text = code;
				code = ebError[code];
			}
			if (code === void 0 || code === null || code === "") code = codeDefault;
			let message;
			if (code <= 1e3) message = this.app.meta.locale.getText(true, void 0, void 0, errorsInternal[code], ...args);
			else message = this.app.meta.locale.getText(false, module, void 0, text || code, ...args);
			code = __combineErrorCode(module, code);
			return {
				code,
				message
			};
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/errorGlobal.ts
var init_errorGlobal = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/errorObject.ts
var init_errorObject = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/type.ts
var SymbolErrorInstanceInfo;
var init_type$5 = __esmMin((() => {
	SymbolErrorInstanceInfo = Symbol("SymbolErrorInstanceInfo");
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/error/index.ts
var init_error$2 = __esmMin((() => {
	init_beanScopeError();
	init_errorClass();
	init_errorGlobal();
	init_errorInternal();
	init_errorObject();
	init_type$5();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/locale/beanScopeLocale.ts
var BeanModuleScope$1, BeanScopeLocale;
var init_beanScopeLocale = __esmMin((() => {
	init_beanSimple();
	BeanModuleScope$1 = Symbol("BeanScopeLocale#ModuleScope");
	BeanScopeLocale = class extends BeanSimple {
		constructor(moduleScope) {
			super();
			this[BeanModuleScope$1] = void 0;
			this.__instances = {};
			this[BeanModuleScope$1] = moduleScope;
		}
		__get__(prop) {
			if (!this.__instances[prop]) {
				const metaLocale = this.app ? this.app.meta.locale : this.sys.meta.locale;
				this.__instances[prop] = metaLocale.createScopeLocaleText(this[BeanModuleScope$1], prop);
			}
			return this.__instances[prop];
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/locale/type.ts
var init_type$4 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/locale/index.ts
var init_locale$3 = __esmMin((() => {
	init_beanScopeLocale();
	init_type$4();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/page/type.ts
var init_type$3 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/page/index.ts
var init_page = __esmMin((() => {
	init_type$3();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/resource/index.ts
var init_resource = __esmMin((() => {
	init_component$6();
	init_config$1();
	init_constant$1();
	init_error$2();
	init_locale$3();
	init_page();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanBase.ts
var SymbolText, SymbolLogger, SymbolLoggerChildren, BeanBase;
var init_beanBase = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_cast();
	init_beanBaseSimple();
	init_resource();
	init_asyncToGenerator();
	SymbolText = Symbol("SymbolText");
	SymbolLogger = Symbol("SymbolLogger");
	SymbolLoggerChildren = Symbol("SymbolLoggerChildren");
	BeanBase = class extends BeanBaseSimple {
		constructor(...args) {
			super(...args);
			this[SymbolText] = void 0;
			this[SymbolLogger] = {};
			this[SymbolLoggerChildren] = {};
		}
		get $el() {
			if (!this.ctx) throw new Error("$el can not be used inside global bean.");
			return this.ctx.meta.el;
		}
		get $text() {
			if (!this[SymbolText]) this[SymbolText] = this.app.meta.locale.createLocaleText(this[SymbolModuleBelong]);
			return this[SymbolText];
		}
		get $logger() {
			return this.$loggerClient("default");
		}
		$loggerClient(clientName) {
			if (!this[SymbolLogger][clientName]) this[SymbolLogger][clientName] = this.sys.meta.logger.get(clientName).child({ beanFullName: this.$beanFullName });
			return this[SymbolLogger][clientName];
		}
		$loggerChild(childName, clientName = "default") {
			if (!this[SymbolLoggerChildren][clientName]) this[SymbolLoggerChildren][clientName] = {};
			if (!this[SymbolLoggerChildren][clientName][childName]) this[SymbolLoggerChildren][clientName][childName] = this.sys.meta.logger.get(clientName).child({
				beanFullName: this.$beanFullName,
				name: childName
			});
			return this[SymbolLoggerChildren][clientName][childName];
		}
		get $event() {
			return this.app.meta.event;
		}
		get scope() {
			return this.bean.scope(this[SymbolModuleBelong]);
		}
		$renderFreeze(freeze) {
			return cast(this.ctx.instance).ctx.renderFreeze(freeze);
		}
		$renderFreezeScope(fn) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (_this.ctx.disposed) return;
				return yield cast(_this.ctx.instance).ctx.renderFreezeScope(fn);
			})();
		}
		$errorHandler(err, info) {
			var _this$app;
			if (err instanceof Error && err[SymbolErrorInstanceInfo]) delete err[SymbolErrorInstanceInfo];
			return (_this$app = this.app) === null || _this$app === void 0 ? void 0 : _this$app.vue.config.errorHandler(err, this.ctx.instance, info);
		}
		$computed(options, debugOptions) {
			return this.ctx.util.instanceScope(() => {
				return computed(options, debugOptions);
			});
		}
		$composable(fn) {
			return this.ctx.util.instanceScope(() => {
				return fn();
			});
		}
		$watchEffect(effect, options) {
			return this.ctx.util.instanceScope(() => {
				return watchEffect(effect, options);
			});
		}
		$watchPostEffect(effect, options) {
			return this.ctx.util.instanceScope(() => {
				return watchPostEffect(effect, options);
			});
		}
		$watchSyncEffect(effect, options) {
			return this.ctx.util.instanceScope(() => {
				return watchSyncEffect(effect, options);
			});
		}
		$watch(source, cb, options) {
			return this.ctx.util.instanceScope(() => {
				return watch(source, cb, options);
			});
		}
		$controllerCreated(fn) {
			return this.ctx.util.instanceScope(() => {
				return this.ctx.meta.hooks.onCreated(fn);
			});
		}
		$controllerMounted(fn) {
			return this.ctx.util.instanceScope(() => {
				return this.ctx.meta.hooks.onMounted(fn);
			});
		}
		$customRef(factory) {
			return customRef(factory);
		}
		$toRef(object, key, defaultValue) {
			return toRef(object, key, defaultValue);
		}
		$zovaComponent(module, name) {
			return this.sys.meta.component.getZovaComponent(module, name);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanAopBase.ts
var BeanAopBase;
var init_beanAopBase = __esmMin((() => {
	init_beanBase();
	BeanAopBase = class extends BeanBase {};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanAopMethodBase.ts
var BeanAopMethodBase;
var init_beanAopMethodBase = __esmMin((() => {
	init_beanBase();
	BeanAopMethodBase = class extends BeanBase {};
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/beanInfo.ts
function BeanInfo(options) {
	return function(target) {
		appMetadata.defineMetadata(SymbolDecoratorBeanInfo, options, target);
	};
}
var init_beanInfo = __esmMin((() => {
	init_metadata();
	init_resource$1();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/createBeanDecorator.ts
function createBeanDecorator(scene, containerScope, markReactive, options, optionsPrimitive, fn) {
	return function(target) {
		const name = scene === "scope" ? "module" : void 0;
		appResource.addBean({
			scene,
			name,
			containerScope,
			markReactive,
			beanClass: target,
			options,
			optionsPrimitive
		});
		fn && fn(target);
	};
}
var init_createBeanDecorator = __esmMin((() => {
	init_resource$1();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/preload.ts
function Preload() {
	return function(target) {
		appMetadata.defineMetadata(SymbolDecoratorPreload, true, target);
	};
}
var init_preload = __esmMin((() => {
	init_metadata();
	init_resource$1();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/proxyDisable.ts
function ProxyDisable() {
	return function(target) {
		appMetadata.defineMetadata(SymbolDecoratorProxyDisable, true, target);
	};
}
var init_proxyDisable = __esmMin((() => {
	init_metadata();
	init_resource$1();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/use.ts
function Use(options) {
	return function(target, prop, descriptor) {
		if (!options) options = {};
		if (typeof options === "string") options = { beanFullName: options };
		const beanClass = appMetadata.getDesignType(target, prop);
		appResource.addUse(target, _objectSpread2(_objectSpread2({}, options), {}, {
			prop,
			beanClass,
			descriptor
		}));
	};
}
function usePrepareArg(arg, withSelector, markReactive) {
	return {
		withSelector,
		markReactive,
		args: [arg]
	};
}
function __prepareInjectSelectorInfo(beanInstance, useOptions) {
	var _selectorInfo;
	let selectorInfo = __prepareInjectSelectorInfo_descriptor(beanInstance, useOptions);
	if (!selectorInfo) selectorInfo = __prepareInjectSelectorInfo_init(beanInstance, useOptions);
	if (!selectorInfo && !isNilOrEmptyString(useOptions.selector)) return {
		withSelector: true,
		args: [evaluateExpressions(useOptions.selector, {
			self: beanInstance,
			sys: beanInstance.sys,
			app: beanInstance.app,
			ctx: beanInstance.ctx
		})]
	};
	return (_selectorInfo = selectorInfo) !== null && _selectorInfo !== void 0 ? _selectorInfo : {
		withSelector: false,
		args: []
	};
}
function __prepareInjectSelectorInfo_descriptor(beanInstance, useOptions) {
	var _useOptions$descripto, _res$withSelector, _res$markReactive;
	const fnGet = (_useOptions$descripto = useOptions.descriptor) === null || _useOptions$descripto === void 0 ? void 0 : _useOptions$descripto.get;
	if (!fnGet) return;
	const res = fnGet.call(beanInstance);
	if (!res) return;
	const withSelector = (_res$withSelector = res.withSelector) !== null && _res$withSelector !== void 0 ? _res$withSelector : false;
	const markReactive = (_res$markReactive = res.markReactive) !== null && _res$markReactive !== void 0 ? _res$markReactive : true;
	return {
		withSelector,
		args: res.args.map((arg, index) => {
			return typeof arg === "function" ? markReactive && (!withSelector || index > 0) ? toRef(arg) : arg() : arg;
		})
	};
}
function __prepareInjectSelectorInfo_init(beanInstance, useOptions) {
	var _init$withSelector, _init$markReactive, _init$args;
	const init = useOptions.init;
	if (!init) return;
	const withSelector = (_init$withSelector = init.withSelector) !== null && _init$withSelector !== void 0 ? _init$withSelector : false;
	const markReactive = (_init$markReactive = init.markReactive) !== null && _init$markReactive !== void 0 ? _init$markReactive : true;
	const _args = (_init$args = init.args) !== null && _init$args !== void 0 ? _init$args : [init.arg];
	if (!_args) return;
	return {
		withSelector,
		args: _args.map((arg, index) => __prepareInjectSelectorInfo_init_arg(beanInstance, arg, markReactive && (!withSelector || index > 0)))
	};
}
function __prepareInjectSelectorInfo_init_arg(beanInstance, arg, reactive) {
	const context = {
		self: beanInstance,
		sys: beanInstance.sys,
		app: beanInstance.app,
		ctx: beanInstance.ctx
	};
	if (reactive && evaluateExpressions(arg, context, void 0, true)) return toRef(() => evaluateExpressions(arg, context));
	return evaluateExpressions(arg, context);
}
var init_use = __esmMin((() => {
	init_dist();
	init_vue_runtime_esm_bundler();
	init_metadata();
	init_resource$1();
	init_objectSpread2();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/useScope.ts
function UseScope(options) {
	return function(target, prop) {
		if (!options) throw new Error("should specify the module name");
		if (typeof options === "string") options = { module: options };
		const beanFullName = `${options.module}.scope.module`;
		appResource.addUse(target, _objectSpread2(_objectSpread2({}, options), {}, {
			prop,
			beanFullName
		}));
	};
}
var init_useScope = __esmMin((() => {
	init_resource$1();
	init_objectSpread2();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/virtual.ts
function Virtual() {
	return function(target) {
		appMetadata.defineMetadata(SymbolDecoratorVirtual, true, target);
	};
}
var init_virtual = __esmMin((() => {
	init_metadata();
	init_resource$1();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/class/index.ts
var init_class = __esmMin((() => {
	init_beanInfo();
	init_createBeanDecorator();
	init_preload();
	init_proxyDisable();
	init_use();
	init_useScope();
	init_virtual();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/interface/beanOptions.ts
var init_beanOptions = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/interface/useOptions.ts
var init_useOptions = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/interface/index.ts
var init_interface$1 = __esmMin((() => {
	init_beanOptions();
	init_useOptions();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/type/constructable.ts
var init_constructable = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/type/containerScope.ts
var init_containerScope = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/type/functionable.ts
var init_functionable = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/type/injectionScope.ts
var init_injectionScope = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/type/index.ts
var init_type$2 = __esmMin((() => {
	init_constructable();
	init_containerScope();
	init_functionable();
	init_injectionScope();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/vueExtra/types.ts
var init_types$2 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/vueExtra/createVueDecorator.ts
var init_createVueDecorator = __esmMin((() => {
	init_metadata();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/vueExtra/model.ts
var init_model = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/decorator/vueExtra/index.ts
var init_vueExtra$1 = __esmMin((() => {
	init_createVueDecorator();
	init_model();
	init_types$2();
}));
//#endregion
//#region packages-zova/zova-core/src/decorator/index.ts
var init_decorator = __esmMin((() => {
	init_class();
	init_interface$1();
	init_type$2();
	init_vueExtra$1();
}));
//#endregion
//#region packages-zova/zova-core/src/vueExtra/computed.ts
function useComputed(options, debugOptions) {
	return computed(options, debugOptions);
}
var init_computed = __esmMin((() => {
	init_vue_runtime_esm_bundler();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanContainer.ts
function __composeForPropAdapter(_context, chain) {
	const [aopKey, fn] = chain;
	if (aopKey === SymbolProxyMagic) return;
	return {
		receiver: void 0,
		fn
	};
}
function __composeForProp(chains) {
	return compose(chains, __composeForPropAdapter);
}
function _patchAopNext([receiver, context], next) {
	return (...args) => {
		context = args.length === 0 ? context : args[0];
		return next([receiver, context]);
	};
}
function __checkAopOfDescriptorInfo(descriptorInfo) {
	if (!descriptorInfo) return true;
	return !descriptorInfo.dynamic && !descriptorInfo.ofBeanBase;
}
function __getPropertyDescriptor(obj, prop) {
	const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
	if (descriptor) return {
		descriptor,
		dynamic: true
	};
	return __getPropertyDescriptorStatic(obj, prop);
}
function __getPropertyDescriptorStatic(obj, prop) {
	let proto = Object.getPrototypeOf(obj);
	let ofBeanBase = false;
	while (proto) {
		if (proto.constructor.name === BeanBase.name) ofBeanBase = true;
		const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
		if (descriptor) return {
			descriptor,
			dynamic: false,
			ofBeanBase
		};
		proto = Object.getPrototypeOf(proto);
	}
	return null;
}
function __setPropertyValue(obj, prop, value, patch) {
	if (value && typeof value === "object" && patch) value.__v_isShallow_patch = true;
	Object.defineProperty(obj, prop, {
		enumerable: false,
		configurable: true,
		get() {
			return value;
		}
	});
	if (value && typeof value === "object" && patch) delete value.__v_isShallow_patch;
}
function __hasMagicMethod(instance) {
	return !!instance.__get__ || !!instance.__set__;
}
function __isInnerMethod(prop) {
	return [
		"__get__",
		"__set__",
		"then",
		"__v_skip",
		"__v_isReactive",
		"__v_isReadonly",
		"__v_isShallow",
		"__v_raw",
		"__v_isRef",
		"__v_isVNode",
		"__v_cache",
		"__v_isShallow_patch"
	].includes(prop);
}
function __isLifeCycleMethod(prop) {
	return ["__init__", "__dispose__"].includes(prop);
}
function __methodTypeOfDescriptor(descriptorInfo) {
	var _descriptor$value;
	if (!descriptorInfo) return null;
	const { descriptor, dynamic } = descriptorInfo;
	if (dynamic) return null;
	if (descriptor.get) return null;
	const methodType = (_descriptor$value = descriptor.value) === null || _descriptor$value === void 0 || (_descriptor$value = _descriptor$value.constructor) === null || _descriptor$value === void 0 ? void 0 : _descriptor$value.name;
	if (["Function", "AsyncFunction"].includes(methodType)) return methodType;
	return null;
}
function __getSelectorKey(beanFullName, withSelector, selector) {
	if (!withSelector) return beanFullName;
	return !!isNilOrEmptyString(selector) ? beanFullName : `${beanFullName}#${selector}`;
}
var SymbolBeanContainerParent, SymbolProxyMagic, SymbolProxyAopMethod, SymbolCacheAopChains, SymbolCacheAopChainsKey, SymbolGetBeanSelectorInnerPromises, SymbolBeanContainerInstances, BeanContainer;
var init_beanContainer = __esmMin((() => {
	init_dist$2();
	init_dist();
	init_vue_runtime_esm_bundler();
	init_metadata();
	init_resource$1();
	init_decorator();
	init_cast();
	init_computed();
	init_beanAopBase();
	init_beanBase();
	init_beanBaseSimple();
	init_beanSimple();
	init_objectSpread2();
	init_asyncToGenerator();
	SymbolBeanContainerParent = Symbol("SymbolBeanContainerParent");
	SymbolProxyMagic = Symbol("SymbolProxyMagic");
	SymbolProxyAopMethod = Symbol("SymbolProxyAopMethod");
	SymbolCacheAopChains = Symbol("SymbolCacheAopChains");
	SymbolCacheAopChainsKey = Symbol("SymbolCacheAopChainsKey");
	SymbolGetBeanSelectorInnerPromises = Symbol("SymbolGetBeanSelectorInnerPromises");
	SymbolBeanContainerInstances = Symbol("SymbolBeanContainerInstances");
	BeanContainer = class BeanContainer {
		static create(sys, app, ctx) {
			const beanContainer = new BeanContainer(sys, app, ctx);
			return markRaw(new Proxy(beanContainer, { get(obj, prop) {
				if (typeof prop === "symbol") return obj[prop];
				if (obj[prop]) return obj[prop];
				return obj._getBeanSyncOnly(prop);
			} }));
		}
		constructor(sys, app, ctx) {
			this.sys = void 0;
			this.app = void 0;
			this.ctx = void 0;
			this[SymbolBeanContainerInstances] = shallowReactive({});
			this[SymbolGetBeanSelectorInnerPromises] = {};
			this.sys = sys;
			this.app = app;
			this.ctx = ctx;
		}
		/** @internal */
		dispose() {
			const beanInstances = this[SymbolBeanContainerInstances];
			for (const prop in beanInstances) {
				if (prop.startsWith("$$")) continue;
				const beanInstance = cast(beanInstances[prop]);
				if (beanInstance && !(beanInstance instanceof BeanAopBase) && beanInstance.__dispose__) if (this.containerType === "sys") {
					this.sys.meta.module._monkeyModuleSync(false, "beanDispose", void 0, this, beanInstance);
					beanInstance.__dispose__();
					this.sys.meta.module._monkeyModuleSync(false, "beanDisposed", void 0, this, beanInstance);
				} else {
					this.app.meta.module._monkeyModuleSync(false, "beanDispose", void 0, this, beanInstance);
					this.runWithInstanceScopeOrAppContext(() => {
						beanInstance.__dispose__();
					});
					this.app.meta.module._monkeyModuleSync(false, "beanDisposed", void 0, this, beanInstance);
				}
			}
			this[SymbolBeanContainerInstances] = shallowReactive({});
			this[SymbolBeanContainerParent] = void 0;
			this[SymbolGetBeanSelectorInnerPromises] = {};
		}
		get containerType() {
			if (!this.ctx) return "sys";
			if (!this.app || this.ctx.bean === this.app.bean) return "app";
			return "ctx";
		}
		get parent() {
			if (this[SymbolBeanContainerParent] === void 0) this[SymbolBeanContainerParent] = this._getParent();
			return this[SymbolBeanContainerParent];
		}
		_getParent() {
			var _this$ctx;
			if (this.containerType === "sys") return null;
			let parent = (_this$ctx = this.ctx) === null || _this$ctx === void 0 || (_this$ctx = _this$ctx.instance) === null || _this$ctx === void 0 ? void 0 : _this$ctx.parent;
			while (parent) {
				var _parent$zova;
				const beanContainerParent = (_parent$zova = parent.zova) === null || _parent$zova === void 0 ? void 0 : _parent$zova.bean;
				if (beanContainerParent) return beanContainerParent;
				parent = parent.parent;
			}
			return this.sys.bean;
		}
		runWithInstanceScopeOrAppContext(fn, tracking) {
			if (this.containerType === "sys") return fn();
			if (this.ctx) return this.ctx.util.instanceScope(fn, tracking);
			else return this.app.vue.runWithContext(fn);
		}
		provide(injectKey, value) {
			return this.ctx.util.instanceScope(() => {
				return provide(injectKey, value);
			});
		}
		inject(injectKey, defaultValue, treatDefaultAsFactory) {
			return this.ctx.util.instanceScope(() => {
				return inject(injectKey, defaultValue, treatDefaultAsFactory);
			});
		}
		defineProperty(obj, prop, attributes) {
			const self = this;
			const attrs = _objectSpread2({}, attributes);
			if (attributes.get) attrs.get = function() {
				const innerKey = `__innerKey_${prop}`;
				if (!obj[innerKey]) self.runWithInstanceScopeOrAppContext(() => {
					__setPropertyValue(obj, innerKey, attributes.get(), true);
				});
				return obj[innerKey];
			};
			return Object.defineProperty(obj, prop, attrs);
		}
		/** get specific module's scope */
		scope(moduleScope) {
			if (this.containerType === "ctx") return this.app.bean.scope(moduleScope);
			return this._getBeanSyncOnly(`${moduleScope}.scope.module`);
		}
		getScope(moduleScope) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (_this.containerType === "ctx") return yield _this.app.bean.getScope(moduleScope);
				yield _this._useModule(moduleScope);
				return _this.scope(moduleScope);
			})();
		}
		_setBean(key, instance) {
			this[SymbolBeanContainerInstances][key] = instance;
		}
		_getBeanSync(key, markReactive, forceLoad) {
			const beanInstance = this[SymbolBeanContainerInstances][key];
			if (beanInstance === void 0) {
				if (forceLoad !== false) this._getBean(key, markReactive);
				return;
			}
			if (beanInstance && beanInstance[SymbolInited] && !beanInstance[SymbolInited].state) return;
			return beanInstance;
		}
		_getBeanSyncOnly(key) {
			return this[SymbolBeanContainerInstances][key];
		}
		_getBean(beanFullName, markReactive, ...args) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				return yield _this2._getBeanSelectorInner(true, null, beanFullName, markReactive, false, ...args);
			})();
		}
		_getBeanSelector(beanFullName, markReactive, selector, ...args) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				return yield _this3._getBeanSelectorInner(true, null, beanFullName, markReactive, true, selector, ...args);
			})();
		}
		_getBeanSelectorInnerSync(beanFullName, selector) {
			const fullName = this._getBeanFullNameByComposableOrClassSync(beanFullName);
			if (!fullName) return null;
			const key = __getSelectorKey(fullName, true, selector);
			return this[SymbolBeanContainerInstances][key];
		}
		_getBeanSelectorInner(newBeanForce, recordProp, beanFullName, markReactive, withSelector, ...args) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				const fullName = yield _this4._getBeanFullNameByComposableOrClass(beanFullName);
				if (!fullName) return null;
				const key = __getSelectorKey(fullName, withSelector, args[0]);
				if (_this4[SymbolBeanContainerInstances][key] === void 0 && newBeanForce) {
					if (!_this4[SymbolGetBeanSelectorInnerPromises][key]) _this4[SymbolGetBeanSelectorInnerPromises][key] = _this4._getBeanSelectorInnerPromise(recordProp, fullName, markReactive, withSelector, ...args);
					yield _this4[SymbolGetBeanSelectorInnerPromises][key];
				}
				if (_this4[SymbolBeanContainerInstances][key] && _this4[SymbolGetBeanSelectorInnerPromises][key]) {
					yield _this4[SymbolGetBeanSelectorInnerPromises][key];
					_this4[SymbolGetBeanSelectorInnerPromises][key] = void 0;
				}
				return _this4[SymbolBeanContainerInstances][key];
			})();
		}
		_getBeanSelectorInnerPromise(recordProp, fullName, markReactive, withSelector, ...args) {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				return yield _this5._newBeanInner(true, recordProp, null, fullName, markReactive, withSelector, ...args);
			})();
		}
		_newBeanSimple(A, markReactive, ...args) {
			const beanInstance = this._prepareBeanInstanceSimple(A, A, args, markReactive);
			if (!(beanInstance instanceof BeanAopBase) && beanInstance.__init__) beanInstance.__init__(...args);
			return beanInstance;
		}
		_newBean(beanFullName, markReactive, ...args) {
			var _this6 = this;
			return _asyncToGenerator(function* () {
				return yield _this6._newBeanInner(false, null, null, beanFullName, markReactive, false, ...args);
			})();
		}
		_newBeanSelector(beanFullName, markReactive, selector, ...args) {
			var _this7 = this;
			return _asyncToGenerator(function* () {
				return yield _this7._newBean(beanFullName, markReactive, selector, ...args);
			})();
		}
		/** @internal */
		_newBeanInner(record, recordProp, controllerData, beanFullName, markReactive, withSelector, ...args) {
			var _this8 = this;
			return _asyncToGenerator(function* () {
				var _ref;
				const beanOptions = yield _this8._getBeanOptionsForce(beanFullName);
				if (!beanOptions) {
					if (typeof beanFullName === "function" && isClass(beanFullName)) return yield _this8._createBeanInstance(record, recordProp, controllerData, void 0, beanFullName, args, false, markReactive, withSelector);
					return null;
				}
				return yield _this8._createBeanInstance(record, recordProp, controllerData, beanOptions.beanFullName, beanOptions.beanClass, args, cast(beanOptions.scene) === "aop", (_ref = markReactive !== null && markReactive !== void 0 ? markReactive : beanOptions.markReactive) !== null && _ref !== void 0 ? _ref : true, withSelector);
			})();
		}
		_getBeanFullNameByComposableOrClassSync(beanFullName) {
			const beanOptions = this._getBeanOptionsForceSync(beanFullName);
			if (!beanOptions) return;
			return beanOptions.beanFullName;
		}
		_getBeanFullNameByComposableOrClass(beanFullName) {
			var _this9 = this;
			return _asyncToGenerator(function* () {
				if (!beanFullName) return;
				const beanOptions = yield _this9._getBeanOptionsForce(beanFullName);
				if (!beanOptions) return;
				return beanOptions.beanFullName;
			})();
		}
		_getBeanOptionsForceSync(beanFullName) {
			return appResource.getBean(beanFullName);
		}
		_getBeanOptionsForce(beanFullName) {
			var _this10 = this;
			return _asyncToGenerator(function* () {
				if (typeof beanFullName === "function" && isClass(beanFullName)) return appResource.getBean(beanFullName);
				const parts = beanFullName.split(".");
				yield _this10._useModule(parts[0]);
				return appResource.getBean(beanFullName);
			})();
		}
		_createBeanInstance(record, recordProp, controllerData, beanFullName, beanClass, args, aop, markReactive, withSelector) {
			var _this11 = this;
			return _asyncToGenerator(function* () {
				const beanInstance = yield _this11._prepareBeanInstance(beanFullName, beanClass, args, markReactive, aop);
				if (controllerData) beanInstance.__initControllerData(controllerData);
				if (record) {
					const fullName = yield _this11._getBeanFullNameByComposableOrClass(beanFullName);
					if (fullName) {
						const key = __getSelectorKey(fullName, withSelector, args[0]);
						__setPropertyValue(beanInstance, SymbolBeanInstanceKey, key, false);
						_this11[SymbolBeanContainerInstances][key] = beanInstance;
					}
					if (recordProp) _this11.__recordProp(recordProp, fullName, beanInstance, true);
				}
				yield _this11._initBeanInstance(beanFullName, beanInstance, args);
				return beanInstance;
			})();
		}
		_prepareBeanInstance(beanFullName, beanClass, args, markReactive, aop) {
			var _this12 = this;
			return _asyncToGenerator(function* () {
				let beanInstance = _this12._prepareBeanInstanceCommon(beanFullName, beanClass, args, markReactive);
				const beanInstanceProxy = yield _this12._patchBeanInstance(beanFullName || beanClass, beanInstance, aop);
				if (beanInstanceProxy) if (markReactive) beanInstance = reactive(beanInstanceProxy);
				else beanInstance = markRaw(beanInstanceProxy);
				return beanInstance;
			})();
		}
		_prepareBeanInstanceSimple(beanFullName, beanClass, args, markReactive) {
			let beanInstance = this._prepareBeanInstanceCommon(beanFullName, beanClass, args, markReactive);
			const beanInstanceProxy = this._patchBeanInstanceSimple(beanFullName || beanClass, beanInstance);
			if (beanInstanceProxy) if (markReactive) beanInstance = reactive(beanInstanceProxy);
			else beanInstance = markRaw(beanInstanceProxy);
			return beanInstance;
		}
		_prepareBeanInstanceCommon(beanFullName, BeanClass, args, markReactive) {
			let beanInstance = new BeanClass(...args);
			if (beanInstance instanceof BeanSimple) {
				beanInstance.sys = this.sys;
				Object.defineProperty(beanInstance, "app", {
					enumerable: false,
					configurable: true,
					get: () => {
						var _this$ctx2;
						return (_this$ctx2 = this.ctx) === null || _this$ctx2 === void 0 ? void 0 : _this$ctx2.app;
					}
				});
				beanInstance.ctx = this.ctx;
			}
			if (typeof beanFullName === "string") __setPropertyValue(beanInstance, SymbolBeanFullName, beanFullName, false);
			if (markReactive) beanInstance = reactive(beanInstance);
			else beanInstance = markRaw(beanInstance);
			return beanInstance;
		}
		_initBeanInstance(beanFullName, beanInstance, args) {
			var _this13 = this;
			return _asyncToGenerator(function* () {
				yield _this13._injectBeanInstance(beanInstance, beanFullName);
				if (_this13.containerType === "sys") yield _this13.sys.meta.module._monkeyModule(true, "beanInit", void 0, _this13, beanInstance);
				else {
					var _this$app;
					yield (_this$app = _this13.app) === null || _this$app === void 0 ? void 0 : _this$app.meta.module._monkeyModule(true, "beanInit", void 0, _this13, beanInstance);
				}
				if (!(beanInstance instanceof BeanAopBase) && beanInstance.__init__) yield _this13.runWithInstanceScopeOrAppContext(_asyncToGenerator(function* () {
					yield beanInstance.__init__(...args);
				}));
				if (_this13.containerType === "sys") yield _this13.sys.meta.module._monkeyModule(true, "beanInited", void 0, _this13, beanInstance);
				else {
					var _this$app2;
					yield (_this$app2 = _this13.app) === null || _this$app2 === void 0 ? void 0 : _this$app2.meta.module._monkeyModule(true, "beanInited", void 0, _this13, beanInstance);
				}
				if (beanInstance[SymbolInited]) beanInstance[SymbolInited].touch();
				return beanInstance;
			})();
		}
		_injectBeanInstance(beanInstance, beanFullName) {
			var _this14 = this;
			return _asyncToGenerator(function* () {
				const beanOptions = appResource.getBean(beanFullName);
				if (!beanOptions) return;
				const uses = appResource.getUses(beanOptions.beanClass.prototype);
				if (!uses) return;
				for (const key in uses) {
					const useOptions = uses[key];
					let targetBeanFullName = useOptions.beanFullName;
					if (!targetBeanFullName && useOptions.beanClass) targetBeanFullName = appResource.getBeanFullName(useOptions.beanClass);
					if (useOptions.injectionScope && ["host", "skipSelf"].includes(useOptions.injectionScope)) {
						const selectorInfo = __prepareInjectSelectorInfo(beanInstance, useOptions);
						const useOptions2 = selectorInfo.withSelector ? Object.assign({}, useOptions, { selector: selectorInfo.args[0] }) : useOptions;
						__setPropertyValue(beanInstance, key, useComputed(() => {
							return _this14._getBeanFromHostInner(false, useOptions.prop, targetBeanFullName, useOptions2);
						}), true);
						continue;
					}
					__setPropertyValue(beanInstance, key, yield _this14._injectBeanInstanceProp(beanInstance, targetBeanFullName, useOptions), true);
				}
			})();
		}
		_injectBeanInstanceProp(beanInstance, targetBeanFullName, useOptions) {
			var _this15 = this;
			return _asyncToGenerator(function* () {
				var _ref2, _useOptions$injection, _ref3, _useOptions$markReact;
				if (useOptions.name) return _this15[SymbolBeanContainerInstances][useOptions.name];
				if (!targetBeanFullName) return _this15[SymbolBeanContainerInstances][useOptions.prop];
				let targetOptions;
				if (targetBeanFullName) {
					targetOptions = yield _this15._getBeanOptionsForce(targetBeanFullName);
					if (!targetOptions) throw new Error(`not found bean class: ${targetBeanFullName}`);
				}
				let injectionScope = (_ref2 = (_useOptions$injection = useOptions.injectionScope) !== null && _useOptions$injection !== void 0 ? _useOptions$injection : targetOptions.containerScope) !== null && _ref2 !== void 0 ? _ref2 : "ctx";
				if ((targetOptions === null || targetOptions === void 0 ? void 0 : targetOptions.scene) === "scope" && !_this15.app) injectionScope = "sys";
				const markReactive = (_ref3 = (_useOptions$markReact = useOptions.markReactive) !== null && _useOptions$markReact !== void 0 ? _useOptions$markReact : targetOptions.markReactive) !== null && _ref3 !== void 0 ? _ref3 : true;
				const selectorInfo = __prepareInjectSelectorInfo(beanInstance, useOptions);
				const recordProp = useOptions.prop;
				let targetInstance;
				if (injectionScope === "sys") {
					targetInstance = yield _this15.sys.bean._getBeanSelectorInner(true, null, targetBeanFullName, markReactive, selectorInfo.withSelector, ...selectorInfo.args);
					yield _this15._injectBeanInstanceProp_appBean(recordProp, targetBeanFullName, targetInstance);
				} else if (injectionScope === "app") {
					targetInstance = yield _this15.app.bean._getBeanSelectorInner(true, null, targetBeanFullName, markReactive, selectorInfo.withSelector, ...selectorInfo.args);
					yield _this15._injectBeanInstanceProp_appBean(recordProp, targetBeanFullName, targetInstance);
				} else if (injectionScope === "ctx") targetInstance = yield _this15._getBeanSelectorInner(true, recordProp, targetBeanFullName, markReactive, selectorInfo.withSelector, ...selectorInfo.args);
				else if (injectionScope === "new") targetInstance = yield _this15._newBeanInner(false, null, null, targetBeanFullName, markReactive, selectorInfo.withSelector, ...selectorInfo.args);
				return targetInstance;
			})();
		}
		_getBeanFromHost(beanFullName, useOptions) {
			if (typeof beanFullName !== "string") {
				useOptions = beanFullName;
				beanFullName = void 0;
			}
			if (!useOptions) useOptions = {};
			return this._getBeanFromHostInner(false, void 0, beanFullName, useOptions);
		}
		_getBeanFromHostInner(record, recordProp, targetBeanFullName, useOptions) {
			let beanContainerParent;
			if (!useOptions.injectionScope || useOptions.injectionScope === "host") beanContainerParent = this;
			else if (useOptions.injectionScope === "skipSelf") beanContainerParent = this.parent;
			while (true) {
				if (!beanContainerParent) return null;
				const beanInstance = this._getBeanFromHostInner2(recordProp, beanContainerParent, targetBeanFullName, useOptions);
				if (beanInstance !== void 0) {
					if (record) this.__recordProp(recordProp, void 0, beanInstance, false);
					return beanInstance;
				}
				beanContainerParent = beanContainerParent.parent;
			}
		}
		_getBeanFromHostInner2(recordProp, beanContainerParent, targetBeanFullName, useOptions) {
			if (useOptions.name) return beanContainerParent[SymbolBeanContainerInstances][useOptions.name];
			if (!targetBeanFullName) return beanContainerParent[SymbolBeanContainerInstances][recordProp];
			return beanContainerParent._getBeanSelectorInnerSync(targetBeanFullName, useOptions.selector);
		}
		_injectBeanInstanceProp_appBean(recordProp, _targetBeanFullName, targetInstance) {
			var _this16 = this;
			return _asyncToGenerator(function* () {
				if (targetInstance === void 0) return;
				if (!_this16.ctx) return;
				_this16.__recordProp(recordProp, void 0, targetInstance, false);
				if (targetInstance) yield targetInstance[SymbolInited].wait();
			})();
		}
		_patchBeanInstance(beanFullNameOrBeanClass, beanInstance, aop) {
			var _this17 = this;
			return _asyncToGenerator(function* () {
				if (!beanFullNameOrBeanClass) return void 0;
				if (aop) return void 0;
				if ((yield _this17._prepareAopChains(beanFullNameOrBeanClass, beanInstance)).length === 0) return void 0;
				return _this17._newBeanProxy(beanFullNameOrBeanClass, beanInstance);
			})();
		}
		_patchBeanInstanceSimple(beanFullNameOrBeanClass, beanInstance) {
			if (!beanFullNameOrBeanClass) return void 0;
			if (this._prepareAopChainsSimple(beanFullNameOrBeanClass, beanInstance).length === 0) return void 0;
			return this._newBeanProxy(beanFullNameOrBeanClass, beanInstance);
		}
		_newBeanProxy(beanFullName, beanInstance) {
			const self = this;
			return new Proxy(beanInstance, {
				get(target, prop, receiver) {
					if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);
					if (__isInnerMethod(prop)) {
						if (prop === "__v_isShallow" && target.__v_isShallow_patch) return Reflect.get(target, "__v_isShallow_patch", receiver);
						return Reflect.get(target, prop, receiver);
					}
					const descriptorInfo = __getPropertyDescriptor(target, prop);
					if (!__checkAopOfDescriptorInfo(descriptorInfo)) return Reflect.get(target, prop, receiver);
					if (!__methodTypeOfDescriptor(descriptorInfo)) {
						if (__isLifeCycleMethod(prop)) return Reflect.get(target, prop, receiver);
						const methodName = `__get_${prop}__`;
						const _aopChainsProp = self._getAopChainsProp(beanFullName, methodName, "__get__", "get", prop);
						if (!_aopChainsProp) return Reflect.get(target, prop, receiver);
						return _aopChainsProp([receiver, void 0], ([receiver, _]) => {
							if (!descriptorInfo && target.__get__) return Reflect.apply(target.__get__, receiver, [prop, target]);
							else return Reflect.get(target, prop, receiver);
						});
					}
					return self._getInstanceMethodProxy(beanFullName, target, prop, receiver);
				},
				set(target, prop, value, receiver) {
					if (typeof prop === "symbol") {
						Reflect.set(target, prop, value, receiver);
						return true;
					}
					if (__isInnerMethod(prop)) {
						Reflect.set(target, prop, value, receiver);
						return true;
					}
					const descriptorInfo = __getPropertyDescriptor(target, prop);
					if (!__checkAopOfDescriptorInfo(descriptorInfo)) {
						Reflect.set(target, prop, value, receiver);
						return true;
					}
					const methodName = `__set_${prop}__`;
					const _aopChainsProp = self._getAopChainsProp(beanFullName, methodName, "__set__", "set", prop);
					if (!_aopChainsProp) {
						Reflect.set(target, prop, value, receiver);
						return true;
					}
					return _aopChainsProp([receiver, value], ([receiver, value]) => {
						if (!descriptorInfo && target.__set__) {
							const res = Reflect.apply(target.__set__, receiver, [
								prop,
								value,
								target
							]);
							if (res === void 0) throw new Error("__set__ must return true/false");
							if (!res) Reflect.set(target, prop, value, receiver);
						} else Reflect.set(target, prop, value, receiver);
						return true;
					});
				}
			});
		}
		_getInstanceMethodProxy(beanFullName, target, prop, receiver) {
			if (__isInnerMethod(prop)) return Reflect.get(target, prop, receiver);
			const _aopChainsProp = this._getAopChainsProp(beanFullName, prop, "__method__", "method", prop);
			if (!_aopChainsProp) return Reflect.get(target, prop, receiver);
			const methodProxyKey = `__aopproxy_method_${prop}__`;
			if (target[methodProxyKey]) return target[methodProxyKey];
			const methodProxy = new Proxy(target[prop], { apply(target, thisArg, args) {
				return _aopChainsProp([thisArg, args], ([thisArg, args]) => {
					return Reflect.apply(target, thisArg, args);
				});
			} });
			__setPropertyValue(target, methodProxyKey, methodProxy, false);
			return methodProxy;
		}
		_prepareAopChains(beanFullNameOrBeanClass, beanInstance) {
			var _this18 = this;
			return _asyncToGenerator(function* () {
				if (!beanFullNameOrBeanClass) return [];
				const beanOptions = appResource.getBean(beanFullNameOrBeanClass);
				const cacheKey = (beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanFullName) || beanFullNameOrBeanClass;
				const proxyDisable = (beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanClass) ? appMetadata.getMetadata(SymbolDecoratorProxyDisable, beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanClass) : false;
				const host = _this18._aopCacheHost();
				if (!host[SymbolCacheAopChains]) host[SymbolCacheAopChains] = {};
				if (host[SymbolCacheAopChains][cacheKey]) return host[SymbolCacheAopChains][cacheKey];
				let chains = [];
				if (!proxyDisable && beanOptions && cast(beanOptions.scene) !== "aop") {
					const aops = yield (yield _this18.sys.bean._getBean("a-bean.service.aop", false)).findAopsMatched(beanOptions.beanFullName);
					if (aops) {
						const aopInstances = [];
						for (const aop of aops) aopInstances.push(yield _this18.sys.bean._getBean(aop.beanFullName, true));
						chains = chains.concat(aopInstances);
					}
				}
				if (!proxyDisable && beanOptions) {
					const aopMethods = yield (yield _this18.sys.bean._getBean("a-bean.service.aop", false)).findAopMethodsMatched(beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanFullName);
					if (aopMethods) chains.push([SymbolProxyAopMethod, aopMethods]);
				}
				if (__hasMagicMethod(beanInstance)) chains.push(SymbolProxyMagic);
				host[SymbolCacheAopChains][cacheKey] = chains;
				return chains;
			})();
		}
		_prepareAopChainsSimple(beanFullNameOrBeanClass, beanInstance) {
			if (!beanFullNameOrBeanClass) return [];
			const beanOptions = appResource.getBean(beanFullNameOrBeanClass);
			const cacheKey = (beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanFullName) || beanFullNameOrBeanClass;
			const host = this._aopCacheHost();
			if (!host[SymbolCacheAopChains]) host[SymbolCacheAopChains] = {};
			if (host[SymbolCacheAopChains][cacheKey]) return host[SymbolCacheAopChains][cacheKey];
			const chains = [];
			if (__hasMagicMethod(beanInstance)) chains.push(SymbolProxyMagic);
			host[SymbolCacheAopChains][cacheKey] = chains;
			return chains;
		}
		_getAopChains(beanFullName) {
			var _host$SymbolCacheAopC;
			const beanOptions = appResource.getBean(beanFullName);
			const cacheKey = (beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanFullName) || beanFullName;
			return ((_host$SymbolCacheAopC = this._aopCacheHost()[SymbolCacheAopChains]) === null || _host$SymbolCacheAopC === void 0 ? void 0 : _host$SymbolCacheAopC[cacheKey]) || [];
		}
		_aopCacheHost() {
			return this.sys;
		}
		_getAopChainsProp(beanFullName, methodName, methodNameMagic, methodType, prop) {
			const chainsKey = `__aopChains_${methodName}__`;
			const beanOptions = appResource.getBean(beanFullName);
			const cacheKey = (beanOptions === null || beanOptions === void 0 ? void 0 : beanOptions.beanFullName) || beanFullName;
			const host = this._aopCacheHost();
			if (!host[SymbolCacheAopChainsKey]) host[SymbolCacheAopChainsKey] = {};
			if (!host[SymbolCacheAopChainsKey][cacheKey]) host[SymbolCacheAopChainsKey][cacheKey] = {};
			if (host[SymbolCacheAopChainsKey][cacheKey][chainsKey] !== void 0) return host[SymbolCacheAopChainsKey][cacheKey][chainsKey];
			const _aopChains = this._getAopChains(beanFullName);
			const chains = [];
			for (const aopKey of _aopChains) if (aopKey === SymbolProxyMagic) {
				if (!__isLifeCycleMethod(methodName)) chains.push([aopKey, methodName]);
			} else if (Array.isArray(aopKey) && aopKey[0] === SymbolProxyAopMethod) this._getAopChainsProp_aopMethods(chains, aopKey, aopKey[1], methodType, prop);
			else {
				const aop = aopKey;
				if (aop[methodName]) {
					let fn;
					if (methodType === "get") fn = function([receiver, _], next) {
						return aop[methodName](_patchAopNext([receiver, _], next), receiver);
					};
					else if (methodType === "set") fn = function([receiver, value], next) {
						return aop[methodName](value, _patchAopNext([receiver, value], next), receiver);
					};
					else if (methodType === "method") fn = function([receiver, args], next) {
						return aop[methodName](args, _patchAopNext([receiver, args], next), receiver);
					};
					chains.push([aopKey, fn]);
				}
				if (methodNameMagic && aop[methodNameMagic]) {
					if (!__isLifeCycleMethod(methodName)) {
						let fn;
						if (methodType === "get") fn = function([receiver, _], next) {
							return aop[methodNameMagic](prop, _patchAopNext([receiver, _], next), receiver);
						};
						else if (methodType === "set") fn = function([receiver, value], next) {
							return aop[methodNameMagic](prop, value, _patchAopNext([receiver, value], next), receiver);
						};
						else if (methodType === "method") fn = function([receiver, args], next) {
							return aop[methodNameMagic](prop, args, _patchAopNext([receiver, args], next), receiver);
						};
						chains.push([aopKey, fn]);
					}
				}
			}
			let result;
			if (chains.length === 0) result = null;
			else result = __composeForProp(chains);
			host[SymbolCacheAopChainsKey][cacheKey][chainsKey] = result;
			return result;
		}
		_getAopChainsProp_aopMethods(chains, aopKey, aopMethodsAll, methodType, prop) {
			const aopMethods = aopMethodsAll[prop];
			if (!aopMethods) return;
			for (const aopMethod of aopMethods) {
				let fn;
				if (methodType === "get") fn = function([receiver, _], next) {
					if (!aopMethod.beanInstance.get) throw new Error(`get property accessor not exists: ${aopMethod.onionName}`);
					return aopMethod.beanInstance.get(aopMethod.options, _patchAopNext([receiver, _], next), receiver, prop);
				};
				else if (methodType === "set") fn = function([receiver, value], next) {
					if (!aopMethod.beanInstance.set) throw new Error(`set property accessor not exists: ${aopMethod.onionName}`);
					return aopMethod.beanInstance.set(aopMethod.options, value, _patchAopNext([receiver, value], next), receiver, prop);
				};
				else if (methodType === "method") fn = function([receiver, args], next) {
					if (!aopMethod.beanInstance.execute) throw new Error(`execute method not exists: ${aopMethod.onionName}`);
					return aopMethod.beanInstance.execute(aopMethod.options, args, _patchAopNext([receiver, args], next), receiver, prop);
				};
				chains.push([aopKey, fn]);
			}
		}
		__recordProp(recordProp, fullName, beanInstance, throwError) {
			if (this[SymbolBeanContainerInstances][recordProp] !== void 0 && throwError) throw new Error(`prop exsits: ${recordProp.toString()}, ${fullName}`);
			if (this[SymbolBeanContainerInstances][recordProp] === void 0) this[SymbolBeanContainerInstances][recordProp] = beanInstance;
		}
		_useModule(moduleName) {
			var _this19 = this;
			return _asyncToGenerator(function* () {
				if (_this19.containerType === "sys") yield _this19.sys.meta.module.use(moduleName);
				else yield _this19.app.meta.module.use(moduleName);
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/vueExtra/useModel.ts
function useModel(props, name, options = EMPTY_OBJ) {
	const i = getCurrentInstance();
	if (!i) throw new Error("useModel() called without active instance.");
	const propType = typeof Object.getPrototypeOf(this).constructor.$propsDefault[name];
	const camelizedName = camelize(name);
	const modifiers = getModelModifiers(props, camelizedName);
	const res = customRef((track, trigger) => {
		let localValue;
		let prevSetValue = EMPTY_OBJ;
		let prevEmittedValue;
		watchSyncEffect(() => {
			const propValue = props[camelizedName];
			if (hasChanged(localValue, propValue)) {
				localValue = propValue;
				trigger();
			}
		});
		return {
			get() {
				track();
				return coerceValueType(propType, options.get ? options.get(localValue) : localValue);
			},
			set(value) {
				var _rawProps;
				const emittedValue = coerceValueType(propType, options.set ? options.set(value) : value);
				if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) return;
				localValue = value;
				trigger();
				const rawProps = i.vnode.props;
				rawProps === null || rawProps === void 0 || (_rawProps = rawProps[`onUpdate:${name}`]) === null || _rawProps === void 0 || _rawProps.call(rawProps, emittedValue);
				if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) trigger();
				prevSetValue = value;
				prevEmittedValue = emittedValue;
			}
		};
	});
	res[Symbol.iterator] = () => {
		let i = 0;
		return { next() {
			if (i < 2) return {
				value: i++ ? modifiers || EMPTY_OBJ : res,
				done: false
			};
			else return { done: true };
		} };
	};
	return res;
}
function getModelModifiers(props, modelName) {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
}
function coerceValueType(type, value) {
	if (["undefined", "null"].includes(type)) return value;
	if (isNil(value)) return value;
	if (typeof value === type) return value;
	let _value;
	if (type === "number") if (Number.isNaN(Number(value))) _value = value;
	else _value = Number(value);
	else if (type === "boolean") _value = value === "false" || value === "0" ? false : Boolean(value);
	else if (type === "string") _value = String(value);
	else _value = value;
	return _value;
}
var init_useModel = __esmMin((() => {
	init_dist();
	init_reactivity_esm_bundler();
	init_shared_esm_bundler();
	init_vue_runtime_esm_bundler();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanControllerBase.ts
var BeanControllerBase;
var init_beanControllerBase = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_util$2();
	init_cast();
	init_useModel();
	init_beanBase();
	BeanControllerBase = class extends BeanBase {
		constructor(...args) {
			super(...args);
			this.$props = void 0;
			this.$slots = void 0;
		}
		/** @internal */
		__initControllerData(controllerData) {
			if (this.ctx.disposed) return;
			this.$slots = controllerData.context.slots;
			this.__initControllerProps(this.ctx.instance.vnode.props);
			this.app.meta.module._monkeyModuleSync(true, "controllerDataInit", void 0, controllerData, this);
		}
		/** @internal */
		__updateControllerData() {
			if (this.ctx.disposed) return;
			this.__initControllerProps(this.ctx.instance.vnode.props);
			this.app.meta.module._monkeyModuleSync(true, "controllerDataUpdate", void 0, this);
		}
		$useModel(name, options) {
			if (typeof name === "object") {
				options = name;
				name = "modelValue";
			}
			if (!name) name = "modelValue";
			return useModel.call(this, this.$props, name, options);
		}
		get $slotDefault() {
			var _cast$slotDefault;
			return (_cast$slotDefault = cast(this.$props).slotDefault) !== null && _cast$slotDefault !== void 0 ? _cast$slotDefault : this.$slots.default;
		}
		__initControllerProps(propsInput) {
			const componentOptions = Object.getPrototypeOf(this).constructor.$componentOptions;
			const propsDefault = Object.getPrototypeOf(this).constructor.$propsDefault;
			let props = Object.assign({}, propsInput);
			for (const key in props) if (props[key] === void 0) delete props[key];
			props = (componentOptions === null || componentOptions === void 0 ? void 0 : componentOptions.deepExtendDefault) ? deepExtend({}, propsDefault, props) : Object.assign({}, propsDefault, props);
			if (!this.$props) this.$props = shallowReactive(props);
			else {
				Object.assign(this.$props, props);
				for (const key in this.$props) if (!props || !Object.hasOwnProperty.call(props, key)) delete this.$props[key];
			}
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/type.ts
var SymbolControllerRefDisable;
var init_type$1 = __esmMin((() => {
	SymbolControllerRefDisable = Symbol("SymbolControllerRefDisable");
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanControllerLike.ts
var SymbolController, BeanControllerLike;
var init_beanControllerLike = __esmMin((() => {
	init_util$2();
	init_cast();
	init_beanBase();
	init_type$1();
	SymbolController = Symbol("SymbolController");
	BeanControllerLike = class extends BeanBase {
		get [SymbolController]() {
			if (this.ctx.disposed) throwErrorComponentUnmounted();
			return this.bean._getBeanSyncOnly("$$c");
		}
		/** @internal */
		__get__(prop) {
			const controller = cast(this[SymbolController]);
			return controller === null || controller === void 0 ? void 0 : controller[prop];
		}
		/** @internal */
		__set__(prop, value) {
			const controller = cast(this[SymbolController]);
			if (!controller) return false;
			if (prop in controller) {
				controller[prop] = value;
				return true;
			} else return false;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanControllerPageBase.ts
var BeanControllerPageBase;
var init_beanControllerPageBase = __esmMin((() => {
	init_beanBase();
	BeanControllerPageBase = class extends BeanBase {
		constructor(...args) {
			super(...args);
			this.$params = void 0;
			this.$query = void 0;
		}
		/** @internal */
		__initControllerData(controllerData) {
			if (this.app) this.app.meta.module._monkeyModuleSync(true, "controllerDataInit", void 0, controllerData, this);
		}
		/** @internal */
		__updateControllerData() {
			this.app.meta.module._monkeyModuleSync(true, "controllerDataUpdate", void 0, this);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanRenderLike.ts
var SymbolStyle, BeanRenderLike;
var init_beanRenderLike = __esmMin((() => {
	init_cast();
	init_beanControllerLike();
	init_type$1();
	SymbolStyle = Symbol("SymbolStyle");
	BeanRenderLike = class extends BeanControllerLike {
		get [SymbolStyle]() {
			return this.bean._getBeanSyncOnly("$$s");
		}
		/** @internal */
		__get__(prop) {
			const value = super.__get__(prop);
			if (value !== void 0) return value;
			const style = cast(this[SymbolStyle]);
			return style === null || style === void 0 ? void 0 : style[prop];
		}
		/** @internal */
		__set__(prop, value) {
			const res = super.__set__(prop, value);
			if (res) return res;
			const style = cast(this[SymbolStyle]);
			if (!style) return false;
			if (prop in style) {
				style[prop] = value;
				return true;
			} else return false;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanRenderBase.ts
var BeanRenderBase;
var init_beanRenderBase = __esmMin((() => {
	init_beanRenderLike();
	BeanRenderBase = class extends BeanRenderLike {
		render() {}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/beanStyleBase.ts
var BeanStyleBase;
var init_beanStyleBase = __esmMin((() => {
	init_beanControllerLike();
	BeanStyleBase = class extends BeanControllerLike {};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/scope/beanScopeUtil.ts
var BeanModuleScope, BeanScopeUtil;
var init_beanScopeUtil = __esmMin((() => {
	init_beanSimple();
	BeanModuleScope = Symbol("BeanScopeScene#ModuleScope");
	BeanScopeUtil = class extends BeanSimple {
		constructor(moduleScope) {
			super();
			this[BeanModuleScope] = void 0;
			this[BeanModuleScope] = moduleScope;
		}
		test() {
			return this[BeanModuleScope];
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/scope/beanScopeBase.ts
var BeanModuleError, BeanModuleLocale, BeanModuleConfig, BeanModuleConstant, BeanModuleApi, BeanModuleApiSchema, BeanModuleUtil, BeanScopeBase;
var init_beanScopeBase = __esmMin((() => {
	init_beanBaseSimple();
	init_beanScopeError();
	init_beanScopeLocale();
	init_beanScopeUtil();
	BeanModuleError = Symbol("BeanScopeBase#BeanModuleError");
	BeanModuleLocale = Symbol("BeanScopeBase#BeanModuleLocale");
	BeanModuleConfig = Symbol("BeanScopeBase#BeanModuleConfig");
	BeanModuleConstant = Symbol("BeanScopeBase#BeanModuleConstant");
	BeanModuleApi = Symbol("BeanScopeBase#BeanModuleApi");
	BeanModuleApiSchema = Symbol("BeanScopeBase#BeanModuleApiSchema");
	BeanModuleUtil = Symbol("BeanScopeBase#BeanModuleUtil");
	BeanScopeBase = class extends BeanBaseSimple {
		constructor(...args) {
			super(...args);
			this[BeanModuleError] = void 0;
			this[BeanModuleLocale] = void 0;
			this[BeanModuleConfig] = void 0;
			this[BeanModuleConstant] = void 0;
			this[BeanModuleApi] = void 0;
			this[BeanModuleApiSchema] = void 0;
			this[BeanModuleUtil] = void 0;
		}
		get module() {
			return this.app.meta.module.get(this[SymbolModuleBelong]);
		}
		__get__(prop) {
			const moduleBelong = this[SymbolModuleBelong];
			if (prop === "error") {
				if (!this[BeanModuleError]) this[BeanModuleError] = this.bean._newBeanSimple(BeanScopeError, false, moduleBelong);
				return this[BeanModuleError];
			}
			if (prop === "locale") {
				if (!this[BeanModuleLocale]) this[BeanModuleLocale] = this.bean._newBeanSimple(BeanScopeLocale, false, moduleBelong);
				return this[BeanModuleLocale];
			}
			if (prop === "config") {
				if (!this[BeanModuleConfig]) this[BeanModuleConfig] = this.sys.config.modules[moduleBelong];
				return this[BeanModuleConfig];
			}
			if (prop === "constant") {
				if (!this[BeanModuleConstant]) this[BeanModuleConstant] = this.sys.constant.modules[moduleBelong];
				return this[BeanModuleConstant];
			}
			if (prop === "api") {
				if (!this[BeanModuleApi]) this[BeanModuleApi] = {};
				return this[BeanModuleApi];
			}
			if (prop === "apiSchema") {
				if (!this[BeanModuleApiSchema]) this[BeanModuleApiSchema] = {};
				return this[BeanModuleApiSchema];
			}
			if (prop === "util") {
				if (!this[BeanModuleUtil]) this[BeanModuleUtil] = this.bean._newBeanSimple(BeanScopeUtil, false, moduleBelong);
				return this[BeanModuleUtil];
			}
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/bean/scope/index.ts
var init_scope = __esmMin((() => {
	init_beanScopeBase();
	init_beanScopeUtil();
}));
//#endregion
//#region packages-zova/zova-core/src/bean/index.ts
var init_bean$1 = __esmMin((() => {
	init_beanAopBase();
	init_beanAopMethodBase();
	init_beanBase();
	init_beanBaseSimple();
	init_beanContainer();
	init_beanControllerBase();
	init_beanControllerLike();
	init_beanControllerPageBase();
	init_beanRenderBase();
	init_beanRenderLike();
	init_beanSimple();
	init_beanStyleBase();
	init_resource();
	init_scope();
	init_type$1();
}));
//#endregion
//#region packages-zova/zova-core/src/utils/zod-enhance.ts
function zodEnhance(app) {
	setLocaleAdapter((text, iss) => {
		return translateError((text, ...args) => {
			return app.meta.text(text, ...args);
		}, text, iss);
	});
}
function zodEnhanceSys() {
	setParseAdapter(ZodMetadata);
}
function zodSetLocaleErrors(app, localeErrors, localeDefault) {
	setLocaleErrors(() => {
		return app.meta.locale.current;
	}, localeErrors, localeDefault);
}
var init_zod_enhance = __esmMin((() => {
	init_dist$3();
	init_dist$4();
	init_dist$5();
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/config.ts
function configDefault(env) {
	return { meta: {
		flavor: env.META_FLAVOR,
		mode: env.META_MODE,
		appMode: env.META_APP_MODE
	} };
}
var init_config = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/constant.ts
var constantDefault;
var init_constant = __esmMin((() => {
	constantDefault = { modules: {} };
}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/component.ts
var init_component$5 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_jsx_runtime();
}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/cookie.ts
var init_cookie$1 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/event.ts
var init_event$1 = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/inject.ts
var init_inject = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/module.ts
var SymbolInstalled;
var init_module$2 = __esmMin((() => {
	SymbolInstalled = Symbol("SymbolInstalled");
}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/monkey.ts
var init_monkey = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/pluginZova.ts
var init_pluginZova = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/window.ts
var init_window = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/interface/index.ts
var init_interface = __esmMin((() => {
	init_component$5();
	init_cookie$1();
	init_event$1();
	init_inject();
	init_module$2();
	init_monkey();
	init_pluginZova();
	init_window();
}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/auth.ts
var init_auth = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/env.ts
var init_env = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/omitNever.ts
var init_omitNever = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/powerPartial.ts
var init_powerPartial = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/requiredSome.ts
var init_requiredSome = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/type.ts
var init_type = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/types/utils/index.ts
var init_utils$1 = __esmMin((() => {
	init_auth();
	init_cast();
	init_env();
	init_omitNever();
	init_powerPartial();
	init_requiredSome();
	init_type();
}));
//#endregion
//#region packages-zova/zova-core/src/types/index.ts
var init_types$1 = __esmMin((() => {
	init_interface();
	init_utils$1();
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/cookie.ts
function encode(string) {
	return encodeURIComponent(string);
}
function decode(string) {
	return decodeURIComponent(string);
}
function stringifyCookieValue(value) {
	return encode(value === Object(value) ? JSON.stringify(value) : `${value}`);
}
function read(string) {
	if (string === "") return string;
	if (string.indexOf("\"") === 0) string = string.slice(1, -1).replace(/\\"/g, "\"").replace(/\\\\/g, "\\");
	string = decode(string.replace(/\+/g, " "));
	return string;
}
function parseExpireString(str) {
	let timestamp = 0;
	const days = str.match(/(\d+)d/);
	const hours = str.match(/(\d+)h/);
	const minutes = str.match(/(\d+)m/);
	const seconds = str.match(/(\d+)s/);
	if (days) timestamp += days[1] * 864e5;
	if (hours) timestamp += hours[1] * 36e5;
	if (minutes) timestamp += minutes[1] * 6e4;
	if (seconds) timestamp += seconds[1] * 1e3;
	return timestamp === 0 ? str : getString(timestamp);
}
function getString(msOffset) {
	const time = /* @__PURE__ */ new Date();
	time.setMilliseconds(time.getMilliseconds() + msOffset);
	return time.toUTCString();
}
var AppCookie;
var init_cookie = __esmMin((() => {
	init_beanSimple();
	init_types$1();
	AppCookie = class extends BeanSimple {
		getItem(key) {
			const cookieSource = cast(document);
			const cookies = cookieSource.cookie ? cookieSource.cookie.split("; ") : [];
			const l = cookies.length;
			let result = key ? void 0 : {};
			let i = 0;
			let parts;
			let name;
			let cookie;
			for (; i < l; i++) {
				parts = cookies[i].split("=");
				name = decode(parts.shift());
				cookie = parts.join("=");
				if (!key) cast(result)[name] = cookie;
				else if (key === name) {
					result = read(cookie);
					break;
				}
			}
			return result;
		}
		setItem(key, value, opts) {
			opts = opts || {};
			opts.path = opts.path || "/";
			let expire, expireValue;
			if (opts.expires !== void 0) if (Object.prototype.toString.call(opts.expires) === "[object Date]") expire = cast(opts.expires).toUTCString();
			else if (typeof opts.expires === "string") expire = parseExpireString(opts.expires);
			else {
				expireValue = Number.parseFloat(opts.expires.toString());
				expire = Number.isNaN(expireValue) === false ? getString(expireValue * 864e5) : opts.expires;
			}
			const cookie = [
				`${encode(key)}=${stringifyCookieValue(value)}`,
				expire !== void 0 ? `; Expires=${expire}` : "",
				opts.path ? `; Path=${opts.path}` : "",
				opts.domain ? `; Domain=${opts.domain}` : "",
				opts.sameSite ? `; SameSite=${opts.sameSite}` : "",
				opts.httpOnly ? "; HttpOnly" : "",
				opts.secure ? "; Secure" : "",
				opts.other ? `; ${opts.other}` : ""
			].join("");
			document.cookie = cookie;
		}
		removeItem(key, opts) {
			this.setItem(key, "", Object.assign({ expires: -1 }, opts));
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/event.ts
var __adapter, AppEvent;
var init_event = __esmMin((() => {
	init_dist$2();
	init_beanSimple();
	init_cast();
	init_asyncToGenerator();
	__adapter = (_context, chain) => {
		const eventHandlerWrapper = chain;
		if (!eventHandlerWrapper.fn) return;
		return {
			receiver: void 0,
			fn: eventHandlerWrapper.fn
		};
	};
	AppEvent = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.eventHandlersMap = {};
		}
		/** @internal */
		initialize() {
			return _asyncToGenerator(function* () {})();
		}
		/** @internal */
		dispose() {
			this.eventHandlersMap = {};
		}
		getEventHandlers(eventName) {
			let eventHandlers = this.eventHandlersMap[eventName];
			if (!eventHandlers) eventHandlers = this.eventHandlersMap[eventName] = [];
			return eventHandlers;
		}
		emit(eventName, data, nextOrDefault) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const eventHandlers = _this.getEventHandlers(eventName);
				const next = typeof nextOrDefault === "function" ? cast(nextOrDefault) : _asyncToGenerator(function* () {
					return nextOrDefault;
				});
				return yield compose(eventHandlers.concat(), __adapter)(data, next);
			})();
		}
		emitSync(eventName, data, nextOrDefault) {
			const eventHandlers = this.getEventHandlers(eventName);
			const next = typeof nextOrDefault === "function" ? cast(nextOrDefault) : () => {
				return nextOrDefault;
			};
			return compose(eventHandlers.concat(), __adapter)(data, next);
		}
		on(eventName, fn) {
			const eventHandlers = this.getEventHandlers(eventName);
			eventHandlers.push({ fn });
			return () => {
				const index = eventHandlers.findIndex((item) => item.fn === fn);
				if (index > -1) {
					eventHandlers[index].fn = void 0;
					eventHandlers.splice(index, 1);
				}
			};
		}
		once(eventName, fn) {
			const off = this.on(eventName, function() {
				var _ref = _asyncToGenerator(function* (data, next) {
					const res = yield fn(data, next);
					off();
					return res;
				});
				return function(_x, _x2) {
					return _ref.apply(this, arguments);
				};
			}());
			return off;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/logger/logger.ts
function _closeLogger(logger) {
	if (logger.__closed__) return;
	logger.end();
	logger.__closed__ = true;
}
function getLoggerFilterLevel(clientName) {
	clientName = clientName || "default";
	if (sys.env.META_MODE === "production") return;
	const envName = `LOGGER_CLIENT_${clientName.toUpperCase()}`;
	const level = sys.env[envName];
	if (level === "false") return;
	if (level === "true" || !level) return "info";
	return level;
}
function setLoggerFilterLevel(level, clientName) {
	clientName = clientName || "default";
	if (sys.env.META_MODE === "production") return;
	const envName = `LOGGER_CLIENT_${clientName.toUpperCase()}`;
	sys.env[envName] = level.toString();
}
var SymbolLoggerInstances, SysLogger;
var init_logger$1 = __esmMin((() => {
	init_src$2();
	init_beanSimple();
	init_sys$1();
	init_util$2();
	SymbolLoggerInstances = Symbol("SymbolLoggerInstances");
	SysLogger = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this[SymbolLoggerInstances] = {};
		}
		dispose() {
			for (const key in this[SymbolLoggerInstances]) {
				const logger = this[SymbolLoggerInstances][key];
				_closeLogger(logger);
			}
			this[SymbolLoggerInstances] = {};
		}
		get(clientName) {
			clientName = clientName || "default";
			if (!this[SymbolLoggerInstances][clientName]) this[SymbolLoggerInstances][clientName] = this._createClient(clientName);
			return this[SymbolLoggerInstances][clientName];
		}
		child(childName, clientName) {
			const logger = this.get(clientName);
			if (!childName) return logger;
			return logger.child({ name: childName });
		}
		getFilterLevel(clientName) {
			return getLoggerFilterLevel(clientName);
		}
		setFilterLevel(level, clientName) {
			setLoggerFilterLevel(level, clientName);
		}
		_createClient(clientName) {
			const configClient = this.sys.config.logger.clients[clientName];
			if (!configClient) throw new Error(`logger client not found: ${clientName}`);
			return new Logger(deepExtend({}, this._prepareConfigClient(clientName, this.sys.config.logger.base), this._prepareConfigClient(clientName, configClient)));
		}
		_prepareConfigClient(clientName, configClient) {
			if (typeof configClient !== "function") return configClient;
			return configClient.call(this.sys, {
				clientName,
				level: () => getLoggerFilterLevel(clientName)
			});
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/composables/useSys.ts
function useSys() {
	return sys;
}
var init_useSys = __esmMin((() => {
	init_sys$1();
}));
//#endregion
//#region packages-zova/zova-core/src/components/createZovaComponentAsync.ts
function createZovaComponentAsync(module, name) {
	return defineAsyncComponent(() => {
		return new Promise((resolve) => {
			useSys().meta.component.use(module, name).then((value) => {
				resolve(value);
			});
		});
	});
}
var init_createZovaComponentAsync = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_useSys();
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/component.ts
var SymbolZovaComponents, SysComponent;
var init_component$4 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_beanSimple();
	init_createZovaComponentAsync();
	init_asyncToGenerator();
	SymbolZovaComponents = Symbol("SymbolZovaComponents");
	SysComponent = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this[SymbolZovaComponents] = {};
		}
		/** @internal */
		initialize() {
			return _asyncToGenerator(function* () {})();
		}
		/** @internal */
		dispose() {}
		createAsyncComponent(module, name) {
			return () => {
				return this.use(module, name);
			};
		}
		getZovaComponent(module, name) {
			const componentName = module.includes(":") ? module : `${module}:${name}`;
			if (!this[SymbolZovaComponents][componentName]) this[SymbolZovaComponents][componentName] = markRaw(createZovaComponentAsync(componentName));
			return this[SymbolZovaComponents][componentName];
		}
		use(module, name) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (module.includes(":")) {
					const parts = module.split(":");
					module = parts[0];
					name = parts[1];
				}
				return (yield _this.sys.meta.module.use(module)).resource.components[name];
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/error.ts
var SysError;
var init_error$1 = __esmMin((() => {
	init_beanSimple();
	init_asyncToGenerator();
	SysError = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			/** @internal */
			this.errors = void 0;
		}
		/** @internal */
		initialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.errors = {};
			})();
		}
		/** @internal */
		dispose() {
			this.errors = {};
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/locale.ts
var SymbolLocaleCurrent, SymbolTzCurrent, AppLocale;
var init_locale$2 = __esmMin((() => {
	init_dist$6();
	init_vue_runtime_esm_bundler();
	init_beanSimple();
	init_type$4();
	init_asyncToGenerator();
	SymbolLocaleCurrent = Symbol("SymbolLocaleCurrent");
	SymbolTzCurrent = Symbol("SymbolTzCurrent");
	AppLocale = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this[SymbolLocaleCurrent] = ref();
			this[SymbolTzCurrent] = ref();
		}
		get metaCookie() {
			return this.app ? this.app.meta.cookie : this.sys.meta.cookie;
		}
		get current() {
			let locale = this[SymbolLocaleCurrent].value;
			if (!locale && this.sys.config.ssr.cookie) locale = this.metaCookie.getItem(this.sys.config.locale.storeKey);
			if (!locale) locale = this.sys.config.locale.default;
			return locale;
		}
		set current(value) {
			if (this[SymbolLocaleCurrent].value === value) return;
			this[SymbolLocaleCurrent].value = value;
			if (this.sys.config.ssr.cookie) this.metaCookie.setItem(this.sys.config.locale.storeKey, value);
		}
		get tz() {
			let tz = this[SymbolTzCurrent].value;
			if (!tz) tz = this.metaCookie.getItem(this.sys.config.tz.storeKey);
			if (!tz) tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
			return tz;
		}
		set tz(value) {
			if (this[SymbolTzCurrent].value === value) return;
			this[SymbolTzCurrent].value = value;
			this.metaCookie.setItem(this.sys.config.tz.storeKey, value);
		}
		/** @internal */
		initialize() {
			return _asyncToGenerator(function* () {})();
		}
		/** @internal */
		createLocaleText(moduleScope) {
			const self = this;
			const getText = function(text, ...args) {
				return self.getText(false, moduleScope, void 0, text, ...args);
			};
			getText.locale = function(locale, text, ...args) {
				return self.getText(false, moduleScope, locale, text, ...args);
			};
			return getText;
		}
		/** @internal */
		createScopeLocaleText(moduleScope, text) {
			const self = this;
			const getText = function(...args) {
				return self.getText(false, moduleScope, void 0, text, ...args);
			};
			getText.locale = function(locale, ...args) {
				return self.getText(false, moduleScope, locale, text, ...args);
			};
			return getText;
		}
		getText(supportCustomMessage, moduleScope, locale, key, ...args) {
			if (!key) return key;
			if (typeof key !== "string") throw new Error(`${key} should be string`);
			const pos = key.indexOf("::");
			if (pos > -1) {
				moduleScope = key.substring(0, pos);
				key = key.substring(pos + 2);
			}
			return getLocaleText(supportCustomMessage, moduleScope ? this.sys.meta.locale.localeModules[moduleScope] : void 0, this.sys.meta.locale.locales, locale || this.current, key, ...args);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/locale.ts
var SysLocale;
var init_locale$1 = __esmMin((() => {
	init_locale$2();
	init_asyncToGenerator();
	SysLocale = class extends AppLocale {
		constructor(...args) {
			super(...args);
			/** @internal */
			this.locales = {};
			this.localeModules = {};
		}
		/** @internal */
		initialize(locales) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!locales) return;
				for (const locale in locales) {
					const moduleMap = locales[locale].modules;
					for (const moduleName in moduleMap) _this._registerLocale(moduleName, locale, moduleMap[moduleName]);
				}
			})();
		}
		/** @internal */
		dispose() {
			this.locales = {};
			this.localeModules = {};
		}
		/** @internal */
		_registerLocales(moduleName, locales) {
			if (!locales) return;
			for (const locale in locales) this._registerLocale(moduleName, locale, locales[locale]);
		}
		_registerLocale(moduleName, locale, moduleLocales) {
			this.locales[locale] = Object.assign({}, moduleLocales, this.locales[locale]);
			if (!this.localeModules[moduleName]) this.localeModules[moduleName] = {};
			this.localeModules[moduleName][locale] = Object.assign({}, moduleLocales, this.localeModules[moduleName][locale]);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/module.ts
var SysModule;
var init_module$1 = __esmMin((() => {
	init_dist$7();
	init_dist();
	init_vue_runtime_esm_bundler();
	init_beanSimple();
	init_types$1();
	init_stateLock();
	init_util$2();
	init_asyncToGenerator();
	SysModule = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.modulesMeta = void 0;
			this.modules = shallowReactive({});
			this.mainInstances = {};
			this.monkeyInstances = {};
		}
		/** @internal */
		initialize(modulesMeta) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this.modulesMeta = modulesMeta;
				yield _this._loadAllMonkeysAndSyncsAndPreloads();
				yield _this._requireAllSpecifics("preload");
				yield _this._requireAllSpecifics("monkey");
				yield _this._requireAllSpecifics("sync");
			})();
		}
		/** @internal */
		dispose() {
			this.modulesMeta = void 0;
		}
		get(moduleName) {
			if (!moduleName) return void 0;
			const moduleInfo = typeof moduleName === "string" ? parseInfo(moduleName) : moduleName;
			if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
			const module = this.modules[moduleInfo.relativeName];
			if (!module) return;
			if (!module[SymbolInstalled] || !module[SymbolInstalled].state) return;
			return module;
		}
		use(moduleName) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (!moduleName) throw new Error("should specify the module name");
				const moduleInfo = typeof moduleName === "string" ? parseInfo(moduleName) : moduleName;
				if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
				const relativeName = moduleInfo.relativeName;
				const moduleRepo = _this2.modulesMeta.modules[relativeName];
				if (!moduleRepo) throw new Error(`module not exists: ${relativeName}`);
				yield _this2._install(relativeName, moduleRepo);
				return moduleRepo;
			})();
		}
		exists(moduleName) {
			if (!moduleName) return false;
			const moduleInfo = typeof moduleName === "string" ? parseInfo(moduleName) : moduleName;
			if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
			return !!this.modulesMeta.modules[moduleInfo.relativeName];
		}
		_loadAllMonkeysAndSyncsAndPreloads() {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const moduleNames = [];
				for (const moduleName of _this3.modulesMeta.moduleNames) {
					var _info$capabilities, _info$capabilities2, _info$capabilities3;
					const module = _this3.modulesMeta.modules[moduleName];
					const info = module.info;
					if (((_info$capabilities = info.capabilities) === null || _info$capabilities === void 0 ? void 0 : _info$capabilities.monkey) || ((_info$capabilities2 = info.capabilities) === null || _info$capabilities2 === void 0 ? void 0 : _info$capabilities2.sync) || ((_info$capabilities3 = info.capabilities) === null || _info$capabilities3 === void 0 ? void 0 : _info$capabilities3.preload)) {
						if (typeof module.resource === "function") moduleNames.push(moduleName);
					}
				}
				yield _this3.loadModules(moduleNames);
			})();
		}
		loadModules(moduleNames) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				if (moduleNames.length === 0) return;
				const promises = [];
				const moduleNamesLoading = [];
				for (const moduleName of moduleNames) {
					const module = _this4.modulesMeta.modules[moduleName];
					if (!module) throw new Error(`module not found: ${moduleName}`);
					const moduleResource = module.resource;
					if (typeof moduleResource === "function") {
						const promise = moduleResource();
						promises.push(promise);
						moduleNamesLoading.push(moduleName);
					}
				}
				const modulesResource = yield Promise.all(promises);
				for (let i = 0; i < modulesResource.length; i++) {
					const moduleName = moduleNamesLoading[i];
					_this4.modulesMeta.modules[moduleName].resource = modulesResource[i];
				}
			})();
		}
		_requireAllSpecifics(capabilityName) {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				const moduleNames = _this5.modulesMeta.moduleNames.filter((moduleName) => {
					var _module$info$capabili;
					return (_module$info$capabili = _this5.modulesMeta.modules[moduleName].info.capabilities) === null || _module$info$capabili === void 0 ? void 0 : _module$info$capabili[capabilityName];
				});
				if (moduleNames.length > 0) _this5.sys.meta.logger.child("module", "default").debug(`modules ${capabilityName}: ${moduleNames.join(",")}`);
				for (const moduleName of moduleNames) {
					const module = _this5.modulesMeta.modules[moduleName];
					yield _this5._install(moduleName, module);
				}
			})();
		}
		_requireAllOthers() {
			var _this6 = this;
			return _asyncToGenerator(function* () {
				for (const moduleName of _this6.modulesMeta.moduleNames) {
					var _info$capabilities4, _info$capabilities5, _info$capabilities6;
					const module = _this6.modulesMeta.modules[moduleName];
					const info = module.info;
					if (!((_info$capabilities4 = info.capabilities) === null || _info$capabilities4 === void 0 ? void 0 : _info$capabilities4.monkey) && !((_info$capabilities5 = info.capabilities) === null || _info$capabilities5 === void 0 ? void 0 : _info$capabilities5.sync) && !((_info$capabilities6 = info.capabilities) === null || _info$capabilities6 === void 0 ? void 0 : _info$capabilities6.preload)) yield _this6._install(moduleName, module);
				}
			})();
		}
		/** @internal */
		_install(moduleName, moduleRepo) {
			var _this7 = this;
			return _asyncToGenerator(function* () {
				if (_this7.modules[moduleName]) {
					const module = _this7.modules[moduleName];
					if (module[SymbolInstalled].state) return;
					yield module[SymbolInstalled].wait();
					yield _this7.sys.bean._getBean(`${moduleName}.scope.module`, false);
					return;
				}
				const module = moduleRepo;
				module[SymbolInstalled] = StateLock.create();
				_this7.modules[moduleName] = module;
				yield _this7._installInner(moduleName, moduleRepo);
				module[SymbolInstalled].touch();
				yield _this7.sys.bean._getBean(`${moduleName}.scope.module`, false);
				yield _this7._monkeyModule(true, "moduleLoaded", module);
			})();
		}
		_installInner(moduleName, moduleRepo) {
			var _this8 = this;
			return _asyncToGenerator(function* () {
				if (typeof moduleRepo.resource === "function") {
					const moduleResource = moduleRepo.resource;
					moduleRepo.resource = yield moduleResource();
				}
				if (moduleRepo.resource.MainSys) _this8.mainInstances[moduleName] = _this8.sys.bean._newBeanSimple(moduleRepo.resource.MainSys, false, moduleRepo);
				if (moduleRepo.resource.MonkeySys) _this8.monkeyInstances[moduleName] = _this8.sys.bean._newBeanSimple(moduleRepo.resource.MonkeySys, false, moduleRepo);
				yield _this8._monkeyModule(true, "moduleLoading", moduleRepo);
				yield _this8._registerResources(moduleRepo);
			})();
		}
		_registerResources(module) {
			var _this9 = this;
			return _asyncToGenerator(function* () {
				_this9._registerLocales(module);
				_this9._registerErrors(module);
				_this9._registerConstants(module);
				yield _this9._registerConfig(module);
			})();
		}
		_registerErrors(module) {
			if (!module.resource.errors) return;
			this.sys.meta.error.errors[module.info.relativeName] = module.resource.errors;
		}
		_registerLocales(module) {
			this.sys.meta.locale._registerLocales(module.info.relativeName, module.resource.locales);
		}
		_registerConstants(module) {
			if (!module.resource.constants) return;
			const relativeName = module.info.relativeName;
			this.sys.constant.modules[relativeName] = deepExtend({}, module.resource.constants, this.sys.constant.modules[relativeName]);
		}
		_registerConfig(module) {
			var _this10 = this;
			return _asyncToGenerator(function* () {
				if (!module.resource.config) return;
				const config = yield module.resource.config(_this10.sys);
				yield _this10._monkeyModule(true, "configLoaded", module, config);
				const relativeName = module.info.relativeName;
				_this10.sys.config.modules[relativeName] = deepExtend({}, config, _this10.sys.config.modules[relativeName]);
				_this10.sys.configOriginal.modules[relativeName] = config;
			})();
		}
		/** @internal */
		_monkeyModule(order, monkeyName, moduleTarget, ...monkeyData) {
			var _this11 = this;
			return _asyncToGenerator(function* () {
				if (moduleTarget) {
					const mainInstance = _this11.mainInstances[moduleTarget.info.relativeName];
					if (mainInstance && mainInstance[monkeyName]) yield mainInstance[monkeyName](...monkeyData);
				}
				yield forEach(_this11.modulesMeta.moduleNames, order, function() {
					var _ref = _asyncToGenerator(function* (key) {
						var _moduleMonkey$info$ca;
						if ((_moduleMonkey$info$ca = _this11.modulesMeta.modules[key].info.capabilities) === null || _moduleMonkey$info$ca === void 0 ? void 0 : _moduleMonkey$info$ca.monkey) {
							const monkeyInstance = _this11.monkeyInstances[key];
							if (monkeyInstance && monkeyInstance[monkeyName]) if (moduleTarget === void 0) yield monkeyInstance[monkeyName](...monkeyData);
							else yield monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
						}
					});
					return function(_x) {
						return _ref.apply(this, arguments);
					};
				}());
				const sysMonkey = _this11.sys.meta.sysMonkey;
				if (sysMonkey && sysMonkey[monkeyName]) if (moduleTarget === void 0) yield sysMonkey[monkeyName](...monkeyData);
				else yield sysMonkey[monkeyName](moduleTarget, ...monkeyData);
			})();
		}
		/** @internal */
		_monkeyModuleSync(order, monkeyName, moduleTarget, ...monkeyData) {
			if (moduleTarget) {
				const mainInstance = this.mainInstances[moduleTarget.info.relativeName];
				if (mainInstance && mainInstance[monkeyName]) mainInstance[monkeyName](...monkeyData);
			}
			forEachSync(this.modulesMeta.moduleNames, order, (key) => {
				var _moduleMonkey$info$ca2;
				if ((_moduleMonkey$info$ca2 = this.modulesMeta.modules[key].info.capabilities) === null || _moduleMonkey$info$ca2 === void 0 ? void 0 : _moduleMonkey$info$ca2.monkey) {
					const monkeyInstance = this.monkeyInstances[key];
					if (monkeyInstance && monkeyInstance[monkeyName]) if (moduleTarget === void 0) monkeyInstance[monkeyName](...monkeyData);
					else monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
				}
			});
			const sysMonkey = this.sys.meta.sysMonkey;
			if (sysMonkey && sysMonkey[monkeyName]) if (moduleTarget === void 0) sysMonkey[monkeyName](...monkeyData);
			else sysMonkey[monkeyName](moduleTarget, ...monkeyData);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/meta.ts
var SysMeta;
var init_meta$2 = __esmMin((() => {
	init_beanSimple();
	init_cookie();
	init_event();
	init_logger$1();
	init_component$4();
	init_error$1();
	init_locale$1();
	init_module$1();
	init_asyncToGenerator();
	SysMeta = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.module = void 0;
			this.component = void 0;
			this.logger = void 0;
			this.locale = void 0;
			this.error = void 0;
			this.event = void 0;
			this.cookie = void 0;
			/** @internal */
			this.sysMonkey = void 0;
			/** @internal */
			this.legacyRoutes = void 0;
		}
		__init__() {
			this.module = this.bean._newBeanSimple(SysModule, false);
			this.component = this.bean._newBeanSimple(SysComponent, false);
			this.logger = this.bean._newBeanSimple(SysLogger, false);
			this.locale = this.bean._newBeanSimple(SysLocale, false);
			this.error = this.bean._newBeanSimple(SysError, false);
			this.event = this.bean._newBeanSimple(AppEvent, false);
			this.cookie = this.bean._newBeanSimple(AppCookie, false);
		}
		/** @internal */
		dispose() {
			this.event.dispose();
			this.module.dispose();
			this.component.dispose();
			this.logger.dispose();
			this.locale.dispose();
			this.error.dispose();
			this.sysMonkey = void 0;
			this.legacyRoutes = void 0;
		}
		/** @internal */
		initialize(SysMonkey, legacyRoutes) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (SysMonkey) _this.sysMonkey = _this.bean._newBeanSimple(SysMonkey, false);
				_this.legacyRoutes = legacyRoutes;
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/sys.ts
function _mergeEnv(env, envRuntime) {
	if (!envRuntime) return env;
	const env2 = _objectSpread2({}, env);
	for (const key of Object.keys(envRuntime)) if (envRuntime[key] !== void 0) env2[key] = envRuntime[key];
	return env2;
}
var SymbolSysInitializePromise, SymbolSysClose, ZovaSys, sys;
var init_sys$1 = __esmMin((() => {
	init_beanContainer();
	init_cast();
	init_zod_enhance();
	init_config();
	init_constant();
	init_meta$2();
	init_resource$1();
	init_sysFake();
	init_util$2();
	init_asyncToGenerator();
	init_objectSpread2();
	SymbolSysInitializePromise = Symbol("SymbolSysInitializePromise");
	SymbolSysClose = Symbol("SymbolSysClose");
	ZovaSys = class {
		constructor() {
			this[SymbolSysInitializePromise] = void 0;
			this[SymbolSysClose] = void 0;
			this.bean = void 0;
			this.util = void 0;
			this.meta = void 0;
			this.config = void 0;
			this.configOriginal = void 0;
			this.env = void 0;
			this.constant = void 0;
			zodEnhanceSys();
		}
		/** @internal */
		initialize({ modulesMeta, locales, config, env, viteHot, SysMonkey, legacyRoutes }, envRuntime) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this[SymbolSysInitializePromise]) _this[SymbolSysInitializePromise] = _this._initializeInner({
					modulesMeta,
					locales,
					config,
					env,
					viteHot,
					SysMonkey,
					legacyRoutes
				}, envRuntime);
				return _this[SymbolSysInitializePromise];
			})();
		}
		_initializeInner({ modulesMeta, locales, config, env, viteHot, SysMonkey, legacyRoutes }, envRuntime) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				_this2[SymbolSysClose] = false;
				_this2.bean = BeanContainer.create(_this2, null, null);
				_this2.util = _this2.bean._newBeanSimple(SysUtil, false);
				_this2.meta = _this2.bean._newBeanSimple(SysMeta, false);
				_this2.env = _this2._prepareEnv(env, envRuntime);
				yield _this2.meta.initialize(SysMonkey, legacyRoutes);
				yield _this2.meta.component.initialize();
				yield _this2.meta.locale.initialize(locales);
				yield _this2.meta.error.initialize();
				_this2.config = yield _this2._combineConfig(config);
				_this2.configOriginal = { modules: {} };
				_this2.constant = constantDefault;
				yield _this2.meta.module.initialize(modulesMeta);
				yield _this2.meta.module._monkeyModule(true, "sysInitialize");
				yield _this2.meta.module._monkeyModule(true, "sysInitialized");
				yield _this2.meta.module._monkeyModule(true, "sysReady");
				_this2._hookClose(viteHot);
			})();
		}
		_hookClose(viteHot) {
			if (typeof window !== "undefined") {
				const hook = () => {
					this.close();
					window.removeEventListener("beforeunload", hook);
				};
				window.addEventListener("beforeunload", hook);
			}
		}
		close() {
			if (this[SymbolSysClose]) return;
			this[SymbolSysClose] = true;
			this.meta.module._monkeyModuleSync(false, "sysClose");
			this.bean.dispose();
			this.meta.dispose();
			appResource.dispose();
			this[SymbolSysInitializePromise] = void 0;
		}
		_combineConfig(config) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const _config = deepExtend({}, configDefault(_this3.env));
				for (const configFn of config) deepExtend(_config, yield configFn(_this3));
				return _config;
			})();
		}
		_prepareEnv(env, envRuntime) {
			const env2 = this._prepareEnv_Runtime(env, envRuntime);
			return this._prepareEnv_Client(env2);
		}
		_prepareEnv_Runtime(env, envRuntime) {
			return _mergeEnv(env, envRuntime);
		}
		_prepareEnv_Client(env) {
			if (!cast(window).__INITIAL_STATE__) return env;
			const ssrState = cast(window).__INITIAL_STATE__;
			return _mergeEnv(env, ssrState.envClient);
		}
	};
	sys = new ZovaSys();
	setSys(sys);
	window.sys = sys;
}));
//#endregion
//#region packages-zova/zova-core/src/plugins/bean.ts
var PluginBean;
var init_bean = __esmMin((() => {
	PluginBean = { install(app) {
		app.mixin({ created() {
			const ctx = this._.zova;
			if (ctx) ctx.meta.component.activate();
		} });
	} };
}));
//#endregion
//#region packages-zova/zova-core/src/bootstrap.ts
function bootstrap(_x, _x2) {
	return _bootstrap.apply(this, arguments);
}
function _bootstrap() {
	_bootstrap = _asyncToGenerator(function* (app, options) {
		yield sys.initialize(options);
		app.use(PluginBean);
		app.use(PluginFreeze);
	});
	return _bootstrap.apply(this, arguments);
}
var init_bootstrap = __esmMin((() => {
	init_dist$9();
	init_sys$1();
	init_bean();
	init_asyncToGenerator();
}));
//#endregion
//#region packages-zova/zova-core/src/components/clientOnly.ts
var ClientOnly;
var init_clientOnly = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	ClientOnly = defineComponent({
		name: "ClientOnly",
		inheritAttrs: true,
		setup(_props, { slots }) {
			const isMounted = ref(false);
			onMounted(() => {
				isMounted.value = true;
			});
			return () => {
				if (isMounted.value === false) {
					var _slots$placeholder;
					return (_slots$placeholder = slots.placeholder) === null || _slots$placeholder === void 0 ? void 0 : _slots$placeholder.call(slots);
				} else {
					var _slots$default;
					return (_slots$default = slots.default) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots);
				}
			};
		}
	});
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/component.ts
var CtxComponent;
var init_component$3 = __esmMin((() => {
	init_beanSimple();
	init_type$1();
	init_cast();
	CtxComponent = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this._bean_render_original = void 0;
		}
		activate() {
			if (this.ctx.disposed) return;
			const renderMethod = "render";
			const self = this;
			const instance = cast(this.ctx.instance);
			this._bean_render_original = instance[renderMethod];
			instance[renderMethod] = function(...args) {
				if (instance.isUnmounted) return;
				if (!self.ctx.meta.state.inited.state) return self._bean_render_original.call(this, ...args);
				const render = self._getRender();
				if (!render) return self._bean_render_original.call(this, ...args);
				return render.render();
			};
			instance.type.ssrRender = null;
			instance.ssrRender = null;
		}
		/** @internal */
		dispose() {
			const renderMethod = "render";
			const instance = cast(this.ctx.instance);
			instance[renderMethod] = this._bean_render_original;
			this._bean_render_original = null;
		}
		_getRender() {
			var _render$__updateContr;
			const render = this.bean._getBeanSyncOnly("$$c");
			if (!render) return;
			(_render$__updateContr = render.__updateControllerData) === null || _render$__updateContr === void 0 || _render$__updateContr.call(render);
			if (render.render) return render;
			return this.bean._getBeanSyncOnly("$$r");
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/hooks.ts
var SymbolHooksFns, SymbolHooksState, CtxHooks;
var init_hooks = __esmMin((() => {
	init_beanSimple();
	init_asyncToGenerator();
	SymbolHooksFns = Symbol("SymbolHooksFns");
	SymbolHooksState = Symbol("SymbolHooksState");
	CtxHooks = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this[SymbolHooksFns] = {};
			this[SymbolHooksState] = {};
		}
		/** @internal */
		dispose() {
			this[SymbolHooksFns] = void 0;
		}
		onCreated(fn) {
			this._onHook("created", fn);
		}
		onMounted(fn) {
			this._onHook("mounted", fn);
		}
		_onHook(type, fn) {
			if (this[SymbolHooksState][type]) this.ctx.util.instanceScope(fn);
			else {
				if (!this[SymbolHooksFns][type]) this[SymbolHooksFns][type] = [];
				this[SymbolHooksFns][type].push(fn);
			}
		}
		/** @internal */
		invokeHook(type) {
			var _this = this;
			return _asyncToGenerator(function* () {
				_this[SymbolHooksState][type] = true;
				const fns = _this[SymbolHooksFns][type];
				if (!fns) return;
				_this[SymbolHooksFns][type] = void 0;
				for (const fn of fns) yield _this.ctx.util.instanceScope(fn);
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/state.ts
var __id, CtxState;
var init_state = __esmMin((() => {
	init_beanSimple();
	init_stateLock();
	__id = 0;
	CtxState = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this._id = void 0;
			this._inited = void 0;
		}
		__init__() {
			this._id = ++__id;
			this._inited = StateLock.create();
		}
		get id() {
			return this._id;
		}
		get inited() {
			return this._inited;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/meta.ts
var CtxMeta;
var init_meta$1 = __esmMin((() => {
	init_beanSimple();
	init_component$3();
	init_hooks();
	init_state();
	CtxMeta = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.state = void 0;
			this.component = void 0;
			this.hooks = void 0;
		}
		get el() {
			return this.ctx.instance.vnode.el;
		}
		/** @internal */
		initialize() {
			this.state = this.bean._newBeanSimple(CtxState, true);
			this.component = this.bean._newBeanSimple(CtxComponent, false);
			this.hooks = this.bean._newBeanSimple(CtxHooks, false);
		}
		/** @internal */
		dispose() {
			this.component.dispose();
			this.hooks.dispose();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/util.ts
var CtxUtil;
var init_util$1 = __esmMin((() => {
	init_runtime_core_esm_bundler();
	init_reactivity_esm_bundler();
	init_beanSimple();
	init_util$2();
	CtxUtil = class extends BeanSimple {
		instanceScope(fn, tracking) {
			if (this.ctx.disposed) throwErrorComponentUnmounted();
			const reset = setCurrentInstance(this.ctx.instance);
			if (!tracking) pauseTracking();
			try {
				return fn();
			} finally {
				if (!tracking) resetTracking();
				reset();
			}
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/context.ts
var ZovaContext;
var init_context$1 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_beanContainer();
	init_cast();
	init_sys$1();
	init_meta$1();
	init_util$1();
	ZovaContext = class {
		constructor(instance) {
			this.instance = void 0;
			this.app = void 0;
			this.bean = void 0;
			this.util = void 0;
			this.meta = void 0;
			this.disposed = void 0;
			markRaw(this);
			instance.zova = this;
			this.instance = instance;
			this.app = instance.appContext.app.zova;
			this.bean = BeanContainer.create(sys, this.app, this);
			this.util = this.bean._newBeanSimple(CtxUtil, false);
			this.meta = this.bean._newBeanSimple(CtxMeta, false);
			this.meta.initialize();
			this._zovaHostProvidersInit();
		}
		/** @internal */
		dispose() {
			if (this.disposed) return;
			this.meta.dispose();
			cast(this.instance).zova = null;
			cast(this).instance = null;
			cast(this).app = null;
			cast(this).bean = null;
			cast(this).meta = null;
			this.disposed = true;
		}
		_zovaHostProvidersInit() {
			let zovaHostProviders = cast(this.instance).zovaHostProviders;
			if (!zovaHostProviders) {
				var _this$instance$parent;
				if (((_this$instance$parent = this.instance.parent) === null || _this$instance$parent === void 0 ? void 0 : _this$instance$parent.type.name) === "AsyncComponentWrapper") zovaHostProviders = cast(this.instance.parent).zovaHostProviders;
			}
			this._zovaHostProvidersUpdate_inner(zovaHostProviders);
		}
		_zovaHostProvidersUpdate(zovaHostProviders) {
			nextTick(() => {
				this._zovaHostProvidersUpdate_inner(zovaHostProviders);
			});
		}
		_zovaHostProvidersUpdate_inner(zovaHostProviders) {
			if (!this.bean || !zovaHostProviders) return;
			for (const key in zovaHostProviders) if (this.bean._getBeanSyncOnly(key) !== zovaHostProviders[key]) this.bean._setBean(key, zovaHostProviders[key]);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/context/index.ts
var init_context = __esmMin((() => {
	init_component$3();
	init_context$1();
	init_meta$1();
	init_state();
	init_util$1();
}));
//#endregion
//#region packages-zova/zova-core/src/composables/useController.ts
function useControllerPage(controllerBeanFullName, renderBeanFullName, styleBeanFullName) {
	_useController({ context: {} }, controllerBeanFullName, renderBeanFullName, styleBeanFullName);
}
function useController(controllerBeanFullName, renderBeanFullName, styleBeanFullName) {
	_useController({ context: { slots: useSlots() } }, controllerBeanFullName, renderBeanFullName, styleBeanFullName);
}
function _useController(_x, _x2, _x3, _x4) {
	return _useController2.apply(this, arguments);
}
function _useController2() {
	_useController2 = _asyncToGenerator(function* (controllerData, controllerBeanFullName, renderBeanFullName, styleBeanFullName) {
		const ctx = new ZovaContext(getCurrentInstance());
		if (ctx.app) ctx.app.meta.module._monkeyModuleSync(true, "appContextInitialize", void 0, ctx);
		else sys.meta.module._monkeyModuleSync(true, "sysContextInitialize", void 0, ctx);
		if (ctx.app) ctx.app.meta.module._monkeyModuleSync(true, "controllerDataPrepare", void 0, controllerData, ctx);
		onBeforeUnmount(() => {
			if (ctx.disposed) return;
			setControllerRef(ctx, false);
			if (ctx.bean !== ctx.app.bean) ctx.bean.dispose();
		});
		onUnmounted(() => {
			ctx.dispose();
		});
		function __load() {
			return __load2.apply(this, arguments);
		}
		function __load2() {
			__load2 = _asyncToGenerator(function* () {
				if (ctx.disposed) return;
				yield ctx.bean._newBeanInner(true, "$$c", controllerData, controllerBeanFullName, true, false);
				if (styleBeanFullName) {
					if (ctx.disposed) return;
					yield ctx.bean._newBeanInner(true, "$$s", void 0, styleBeanFullName, true, false);
				}
				if (renderBeanFullName) {
					if (ctx.disposed) return;
					yield ctx.bean._newBeanInner(true, "$$r", void 0, renderBeanFullName, true, false);
				}
				if (ctx.disposed) return;
				ctx.meta.state.inited.touch();
				ctx.util.instanceScope(() => {
					queuePostFlushCb(() => {
						setControllerRef(ctx, true);
						ctx.meta.hooks.invokeHook("mounted");
					});
				});
			});
			return __load2.apply(this, arguments);
		}
		ctx.meta.hooks.onCreated(_asyncToGenerator(function* () {
			if (ctx.disposed) return;
			try {
				return yield __load();
			} catch (err) {
				if (ctx.disposed) return;
				throw err;
			}
		}));
		ctx.meta.hooks.invokeHook("created");
	});
	return _useController2.apply(this, arguments);
}
function setControllerRef(ctx, on) {
	var _ctx$bean, _controller$ctx$insta;
	const controller = (_ctx$bean = ctx.bean) === null || _ctx$bean === void 0 ? void 0 : _ctx$bean._getBeanSyncOnly("$$c");
	if (!controller || controller[SymbolControllerRefDisable]) return;
	const controllerRef = (_controller$ctx$insta = controller.ctx.instance.vnode.props) === null || _controller$ctx$insta === void 0 ? void 0 : _controller$ctx$insta.controllerRef;
	if (controllerRef) controllerRef(on ? controller : void 0);
}
var init_useController = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_type$1();
	init_context();
	init_sys$1();
	init_asyncToGenerator();
}));
//#endregion
//#region packages-zova/zova-core/src/components/component.ts
function createZovaComponentPage(controller, render, style) {
	return defineComponent(() => {
		useControllerPage(controller, render, style);
		return () => {};
	});
}
function prepareComponentOptions(componentOptions) {
	return Object.assign({ inheritAttrs: "auto" }, componentOptions);
}
var init_component$2 = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_useController();
}));
//#endregion
//#region packages-zova/zova-core/src/components/index.ts
var init_components = __esmMin((() => {
	init_clientOnly();
	init_component$2();
	init_createZovaComponentAsync();
}));
//#endregion
//#region packages-zova/zova-core/src/composables/useApp.ts
function useApp() {
	const instance = getCurrentInstance();
	return instance === null || instance === void 0 ? void 0 : instance.appContext.app.zova;
}
var init_useApp = __esmMin((() => {
	init_vue_runtime_esm_bundler();
}));
//#endregion
//#region packages-zova/zova-core/src/composables/useContext.ts
var init_useContext = __esmMin((() => {
	init_vue_runtime_esm_bundler();
}));
//#endregion
//#region packages-zova/zova-core/src/composables/index.ts
var init_composables = __esmMin((() => {
	init_useApp();
	init_useContext();
	init_useController();
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/component.ts
var AppComponent;
var init_component$1 = __esmMin((() => {
	init_beanSimple();
	init_asyncToGenerator();
	AppComponent = class extends BeanSimple {
		/** @internal */
		initialize() {
			return _asyncToGenerator(function* () {})();
		}
		/** @internal */
		_registerComponents(_moduleName, components) {
			if (!components) return;
			for (const key in components) {
				const component = components[key];
				this._setComponentGlobal(component);
			}
		}
		_setComponentGlobal(component) {
			var _options$meta;
			const options = component;
			if (component.name && ((_options$meta = options.meta) === null || _options$meta === void 0 ? void 0 : _options$meta.global) === true) {
				if (!this.app.vue.component(component.name)) this.app.vue.component(component.name, component);
			}
			return component;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/error.ts
var AppError;
var init_error = __esmMin((() => {
	init_errorClass();
	init_type$5();
	init_asyncToGenerator();
	AppError = class extends ErrorClass {
		/** @internal */
		initialize() {
			var _superprop_getInitialize = () => super.initialize, _this = this;
			return _asyncToGenerator(function* () {
				yield _superprop_getInitialize().call(_this);
				_this.app.vue.config.errorHandler = (err, instance, info) => {
					return _this._handleError(err, instance, info);
				};
				window.addEventListener("unhandledrejection", (event) => {
					event.preventDefault();
					_this._handleUnhandledError(event.reason, "unhandledrejection");
					return false;
				});
				window.addEventListener("error", (event) => {
					event.preventDefault();
					_this._handleUnhandledError(event.error, "unhandlederror");
					return false;
				});
			})();
		}
		/** @internal */
		createScopeError(moduleScope, errorCode) {
			const self = this;
			return {
				throw: (...args) => {
					return self.throw(moduleScope, errorCode, ...args);
				},
				parseFail: (...args) => {
					return self.parseFail(moduleScope, errorCode, ...args);
				}
			};
		}
		_handleUnhandledError(error, infoDefault) {
			if (error instanceof Error) {
				const errorInfo = error[SymbolErrorInstanceInfo];
				if (errorInfo) delete error[SymbolErrorInstanceInfo];
				this.app.vue.config.errorHandler(error, errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.instance, (errorInfo === null || errorInfo === void 0 ? void 0 : errorInfo.info) || infoDefault);
			}
		}
		_handleError(err, instance, info) {
			if (!this.app) {
				console.error(err);
				return;
			}
			const err2 = this.app.meta.event.emitSync("app:errorHandler", {
				err,
				instance,
				info
			}, (data) => {
				return data.err;
			});
			if (!err2 || !(err2 instanceof Error)) return err2;
			if (!info || !["useMutationData"].includes(info)) console.error(err2);
			return err2;
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/module.ts
var AppModule;
var init_module = __esmMin((() => {
	init_dist$7();
	init_dist();
	init_vue_runtime_esm_bundler();
	init_beanSimple();
	init_types$1();
	init_stateLock();
	init_asyncToGenerator();
	AppModule = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.modules = shallowReactive({});
			this.mainInstances = {};
			this.monkeyInstances = {};
		}
		/** @internal */
		initialize() {
			var _this = this;
			return _asyncToGenerator(function* () {
				yield _this._requireAllSpecifics("preload");
				yield _this._requireAllSpecifics("monkey");
				yield _this._requireAllSpecifics("sync");
			})();
		}
		get(moduleName, forceLoad) {
			if (!moduleName) return void 0;
			const moduleInfo = typeof moduleName === "string" ? parseInfo(moduleName) : moduleName;
			if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
			const module = this.modules[moduleInfo.relativeName];
			if (!module) {
				if (forceLoad !== false) this.use(moduleInfo.relativeName);
				return;
			}
			if (!module[SymbolInstalled] || !module[SymbolInstalled].state) return;
			return this.sys.meta.module.get(moduleName);
		}
		use(moduleName) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (!moduleName) throw new Error("should specify the module name");
				const moduleInfo = typeof moduleName === "string" ? parseInfo(moduleName) : moduleName;
				if (!moduleInfo) throw new Error(`invalid module name: ${moduleName}`);
				const relativeName = moduleInfo.relativeName;
				const moduleRepo = _this2.sys.meta.module.modulesMeta.modules[relativeName];
				if (!moduleRepo) throw new Error(`module not exists: ${relativeName}`);
				yield _this2._install(relativeName, moduleRepo);
				return moduleRepo;
			})();
		}
		exists(moduleName) {
			return this.sys.meta.module.exists(moduleName);
		}
		_requireAllSpecifics(capabilityName) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				const moduleNames = _this3.sys.meta.module.modulesMeta.moduleNames.filter((moduleName) => {
					var _module$info$capabili;
					return (_module$info$capabili = _this3.sys.meta.module.modulesMeta.modules[moduleName].info.capabilities) === null || _module$info$capabili === void 0 ? void 0 : _module$info$capabili[capabilityName];
				});
				for (const moduleName of moduleNames) {
					const module = _this3.sys.meta.module.modulesMeta.modules[moduleName];
					yield _this3._install(moduleName, module);
				}
			})();
		}
		_install(moduleName, moduleRepo) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				yield _this4.sys.meta.module._install(moduleName, moduleRepo);
				if (_this4.modules[moduleName]) {
					const module = _this4.modules[moduleName];
					if (module[SymbolInstalled].state) return;
					yield module[SymbolInstalled].wait();
					yield _this4.app.bean._getBean(`${moduleName}.scope.module`, false);
					return;
				}
				const module = { [SymbolInstalled]: StateLock.create() };
				_this4.modules[moduleName] = module;
				yield _this4._installInner(moduleName, moduleRepo);
				module[SymbolInstalled].touch();
				yield _this4.app.bean._getBean(`${moduleName}.scope.module`, false);
				yield _this4._monkeyModule(true, "moduleLoaded", moduleRepo);
			})();
		}
		_installInner(moduleName, moduleRepo) {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				if (moduleRepo.resource.Main) _this5.mainInstances[moduleName] = _this5.app.bean._newBeanSimple(moduleRepo.resource.Main, false, moduleRepo);
				if (moduleRepo.resource.Monkey) _this5.monkeyInstances[moduleName] = _this5.app.bean._newBeanSimple(moduleRepo.resource.Monkey, false, moduleRepo);
				yield _this5._monkeyModule(true, "moduleLoading", moduleRepo);
				yield _this5._registerResources(moduleRepo);
			})();
		}
		_registerResources(module) {
			var _this6 = this;
			return _asyncToGenerator(function* () {
				_this6._registerComponents(module);
			})();
		}
		_registerComponents(module) {
			this.app.meta.component._registerComponents(module.info.relativeName, module.resource.components);
		}
		/** @internal */
		_monkeyModule(order, monkeyName, moduleTarget, ...monkeyData) {
			var _this7 = this;
			return _asyncToGenerator(function* () {
				if (moduleTarget) {
					const mainInstance = _this7.mainInstances[moduleTarget.info.relativeName];
					if (mainInstance && mainInstance[monkeyName]) yield _this7.app.vue.runWithContext(_asyncToGenerator(function* () {
						yield mainInstance[monkeyName](...monkeyData);
					}));
				}
				yield forEach(_this7.sys.meta.module.modulesMeta.moduleNames, order, function() {
					var _ref = _asyncToGenerator(function* (key) {
						var _moduleMonkey$info$ca;
						if ((_moduleMonkey$info$ca = _this7.sys.meta.module.modulesMeta.modules[key].info.capabilities) === null || _moduleMonkey$info$ca === void 0 ? void 0 : _moduleMonkey$info$ca.monkey) {
							const monkeyInstance = _this7.monkeyInstances[key];
							if (monkeyInstance && monkeyInstance[monkeyName]) yield _this7.app.vue.runWithContext(_asyncToGenerator(function* () {
								if (moduleTarget === void 0) yield monkeyInstance[monkeyName](...monkeyData);
								else yield monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
							}));
						}
					});
					return function(_x) {
						return _ref.apply(this, arguments);
					};
				}());
				const appMonkey = _this7.app.meta.appMonkey;
				if (appMonkey && appMonkey[monkeyName]) yield _this7.app.vue.runWithContext(_asyncToGenerator(function* () {
					if (moduleTarget === void 0) yield appMonkey[monkeyName](...monkeyData);
					else yield appMonkey[monkeyName](moduleTarget, ...monkeyData);
				}));
			})();
		}
		/** @internal */
		_monkeyModuleSync(order, monkeyName, moduleTarget, ...monkeyData) {
			if (moduleTarget) {
				const mainInstance = this.mainInstances[moduleTarget.info.relativeName];
				if (mainInstance && mainInstance[monkeyName]) this.app.vue.runWithContext(_asyncToGenerator(function* () {
					mainInstance[monkeyName](...monkeyData);
				}));
			}
			forEachSync(this.sys.meta.module.modulesMeta.moduleNames, order, (key) => {
				var _moduleMonkey$info$ca2;
				if ((_moduleMonkey$info$ca2 = this.sys.meta.module.modulesMeta.modules[key].info.capabilities) === null || _moduleMonkey$info$ca2 === void 0 ? void 0 : _moduleMonkey$info$ca2.monkey) {
					const monkeyInstance = this.monkeyInstances[key];
					if (monkeyInstance && monkeyInstance[monkeyName]) this.app.vue.runWithContext(_asyncToGenerator(function* () {
						if (moduleTarget === void 0) monkeyInstance[monkeyName](...monkeyData);
						else monkeyInstance[monkeyName](moduleTarget, ...monkeyData);
					}));
				}
			});
			const appMonkey = this.app.meta.appMonkey;
			if (appMonkey && appMonkey[monkeyName]) this.app.vue.runWithContext(_asyncToGenerator(function* () {
				if (moduleTarget === void 0) appMonkey[monkeyName](...monkeyData);
				else appMonkey[monkeyName](moduleTarget, ...monkeyData);
			}));
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/app/meta.ts
var AppMeta;
var init_meta = __esmMin((() => {
	init_beanSimple();
	init_component$1();
	init_cookie();
	init_error();
	init_event();
	init_locale$2();
	init_module();
	init_asyncToGenerator();
	AppMeta = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.module = void 0;
			this.component = void 0;
			this.locale = void 0;
			this.error = void 0;
			this.event = void 0;
			this.cookie = void 0;
			this.text = void 0;
			/** @internal */
			this.appMonkey = void 0;
		}
		__init__() {
			this.module = this.app.bean._newBeanSimple(AppModule, false);
			this.component = this.app.bean._newBeanSimple(AppComponent, false);
			this.locale = this.app.bean._newBeanSimple(AppLocale, false);
			this.error = this.app.bean._newBeanSimple(AppError, false);
			this.event = this.app.bean._newBeanSimple(AppEvent, false);
			this.cookie = this.app.bean._newBeanSimple(AppCookie, false);
			this.text = this.locale.createLocaleText();
		}
		/** @internal */
		initialize(AppMonkey) {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (AppMonkey) _this.appMonkey = _this.bean._newBeanSimple(AppMonkey, false);
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/app/util.ts
var AppUtil;
var init_util = __esmMin((() => {
	init_beanSimple();
	init_zod_enhance();
	AppUtil = class extends BeanSimple {
		setLocaleErrors(localeErrors, localeDefault) {
			return zodSetLocaleErrors(this.app, localeErrors, localeDefault);
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/app/application.ts
var SymbolAppClose, ZovaApplication;
var init_application = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_cast();
	init_zod_enhance();
	init_sys$1();
	init_meta();
	init_util();
	init_asyncToGenerator();
	SymbolAppClose = Symbol("SymbolAppClose");
	ZovaApplication = class {
		constructor(vue, ctxRoot) {
			this._reloadDelayTimer = 0;
			this[SymbolAppClose] = void 0;
			this.vue = void 0;
			this.bean = void 0;
			this.util = void 0;
			this.meta = void 0;
			this.ctx = void 0;
			markRaw(this);
			vue.zova = this;
			this.vue = vue;
			this.ctx = ctxRoot;
			this.bean = ctxRoot.bean;
			cast(this.bean).app = this;
			ctxRoot.app = this;
			this.util = this.bean._newBeanSimple(AppUtil, false);
			this.meta = this.bean._newBeanSimple(AppMeta, false);
			cast(ctxRoot.instance.appContext).reload = () => {
				this.reloadDelay();
			};
			zodEnhance(this);
		}
		/** @internal */
		initialize({ AppMonkey }) {
			var _this = this;
			return _asyncToGenerator(function* () {
				sys.meta.module._monkeyModuleSync(true, "sysApplicationInitialize", void 0, _this);
				yield _this.meta.initialize(AppMonkey);
				yield _this.meta.component.initialize();
				yield _this.meta.locale.initialize();
				yield _this.meta.error.initialize();
				yield _this.meta.module.initialize();
				yield _this.meta.module._monkeyModule(true, "appInitialize");
				yield _this.meta.module._monkeyModule(true, "appInitialized");
				yield _this.meta.module._monkeyModule(true, "appReady");
			})();
		}
		get sys() {
			return sys;
		}
		reload() {
			window.location.reload();
		}
		reloadDelay(cancel) {
			if (cancel) {
				if (this._reloadDelayTimer !== 0) {
					window.clearTimeout(this._reloadDelayTimer);
					this._reloadDelayTimer = 0;
				}
			} else {
				this.reloadDelay(true);
				this._reloadDelayTimer = window.setTimeout(() => {
					this.reload();
				}, 100);
			}
		}
		throw(code, ...args) {
			return this.meta.error.throw(void 0, code, ...args);
		}
		close() {
			if (this[SymbolAppClose]) return;
			this[SymbolAppClose] = true;
			this.meta.module._monkeyModuleSync(false, "appClose");
			this.bean.dispose();
			this.ctx.dispose();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/app/locale.ts
var init_locale = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/core/app/index.ts
var init_app = __esmMin((() => {
	init_application();
	init_locale();
	init_meta();
}));
//#endregion
//#region packages-zova/zova-core/src/core/component/index.ts
var init_component = __esmMin((() => {
	init_error();
	init_locale$2();
	init_module();
}));
//#endregion
//#region packages-zova/zova-core/src/core/logger/format.ts
function __formatLoggerFilterCheckInfo(info) {
	if (typeof info.message === "function") {
		if (info.message[SymbolLoggerMessage] === void 0) info.message[SymbolLoggerMessage] = info.message();
		info.message = info.message[SymbolLoggerMessage];
	}
	return info;
}
var _excluded, SymbolLoggerMessage, formatLoggerFilter, formatLoggerConsole;
var init_format = __esmMin((() => {
	init_src$2();
	init_dist();
	init_objectWithoutProperties();
	_excluded = [
		"timestamp",
		"level",
		"stack",
		"message",
		"name",
		"beanFullName",
		"durationMs"
	];
	SymbolLoggerMessage = Symbol("SymbolLoggerMessage");
	formatLoggerFilter = format((info, opts) => {
		const level = typeof opts.level === "function" ? opts.level() : opts.level;
		if (!level) return false;
		if (opts.strict) {
			if (NpmConfigSetLevels[info.level] === NpmConfigSetLevels[level]) return __formatLoggerFilterCheckInfo(info);
			return false;
		}
		if (NpmConfigSetLevels[info.level] <= NpmConfigSetLevels[level] || opts.silly && info.level === "silly") return __formatLoggerFilterCheckInfo(info);
		return false;
	});
	formatLoggerConsole = () => {
		return print((_ref) => {
			let { timestamp, level, stack, message, name, beanFullName, durationMs } = _ref, meta = _objectWithoutProperties(_ref, _excluded);
			const result = [`${timestamp} ${level}${name ? ` ${colorize("verbose", `[${name}]`)}` : ""}${beanFullName ? ` ${colorize("tip", `[${beanFullName}]`)}` : ""}${` ${message}`}${durationMs !== void 0 ? ` ${colorize("verbose", `+${durationMs}ms`)}` : ""}${stack ? `\n${stack}` : ""}`];
			if (!isEmptyObject(meta)) {
				const meta2 = {};
				for (const key in meta) meta2[key] = meta[key];
				result.push(meta2);
			}
			return result;
		});
	};
}));
//#endregion
//#region packages-zova/zova-core/src/core/logger/types.ts
var init_types = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/core/logger/index.ts
var init_logger = __esmMin((() => {
	init_format();
	init_logger$1();
	init_types();
}));
//#endregion
//#region packages-zova/zova-core/src/core/sys/index.ts
var init_sys = __esmMin((() => {
	init_component$4();
	init_config();
	init_constant();
	init_error$1();
	init_locale$1();
	init_meta$2();
	init_metadata();
	init_module$1();
	init_resource$1();
	init_sys$1();
	init_util$2();
}));
//#endregion
//#region packages-zova/zova-core/src/core/index.ts
var init_core = __esmMin((() => {
	init_app();
	init_component();
	init_context();
	init_logger();
	init_sys();
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/mixinClass.ts
var init_mixinClass = __esmMin((() => {
	init_utils$2();
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/omitClass.ts
var init_omitClass = __esmMin((() => {
	init_utils$2();
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/partialClass.ts
var init_partialClass = __esmMin((() => {
	init_utils$2();
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/pickClass.ts
var init_pickClass = __esmMin((() => {
	init_utils$2();
}));
//#endregion
//#region packages-zova/zova-core/src/mappedClass/index.ts
var init_mappedClass = __esmMin((() => {
	init_mixinClass();
	init_omitClass();
	init_partialClass();
	init_pickClass();
	init_type$9();
	init_utils$2();
}));
//#endregion
//#region packages-zova/zova-core/src/plugins/zova.ts
var PluginZova;
var init_zova = __esmMin((() => {
	init_beanContainer();
	init_type$1();
	init_core();
	init_types$1();
	init_asyncToGenerator();
	PluginZova = {
		install(vue, ctxRoot, { modulesMeta, locales, config, env, viteHot, SysMonkey, AppMonkey, legacyRoutes }) {
			return _asyncToGenerator(function* () {
				const app = new ZovaApplication(vue, ctxRoot);
				yield app.initialize({
					modulesMeta,
					locales,
					config,
					env,
					viteHot,
					SysMonkey,
					AppMonkey,
					legacyRoutes
				});
				return app;
			})();
		},
		update(app, ctxRoot) {
			return _asyncToGenerator(function* () {
				const bean = cast(app.bean);
				bean.ctx = ctxRoot;
				for (const key in bean[SymbolBeanContainerInstances]) bean[SymbolBeanContainerInstances][key].ctx = ctxRoot;
				delete bean[SymbolBeanContainerInstances]["$$c"];
				delete bean[SymbolBeanContainerInstances]["$$r"];
				delete bean[SymbolBeanContainerInstances]["$$s"];
				Object.assign(bean[SymbolBeanContainerInstances], ctxRoot.bean[SymbolBeanContainerInstances]);
				ctxRoot.bean = bean;
				ctxRoot.app = app;
			})();
		}
	};
}));
//#endregion
//#region packages-zova/zova-core/src/plugins/index.ts
var init_plugins = __esmMin((() => {
	init_bean();
	init_zova();
}));
//#endregion
//#region packages-zova/zova-core/src/utils/protocolKey.ts
function $protocolKey(key) {
	return key;
}
var init_protocolKey = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/utils/prefixKeys.ts
var init_prefixKeys = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/utils/index.ts
var init_utils = __esmMin((() => {
	init_protocolKey();
	init_stateLock();
	init_prefixKeys();
}));
//#endregion
//#region packages-zova/zova-core/src/vueExtra/composable.ts
var init_composable = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/vueExtra/watch.ts
var init_watch = __esmMin((() => {}));
//#endregion
//#region packages-zova/zova-core/src/vueExtra/index.ts
var init_vueExtra = __esmMin((() => {
	init_composable();
	init_watch();
	init_computed();
}));
//#endregion
//#region packages-zova/zova-core/src/index.ts
var init_src = __esmMin((() => {
	init_dist$8();
	init_bean$1();
	init_bootstrap();
	init_components();
	init_composables();
	init_core();
	init_decorator();
	init_mappedClass();
	init_plugins();
	init_types$1();
	init_utils();
	init_vueExtra();
}));
//#endregion
export { BeanAopMethodBase as A, disposeInstance as B, UseScope as C, Preload as D, ProxyDisable as E, appResource as F, appMetadata as G, objectAssignReactive as H, beanFullNameFromOnionName as I, cast as K, convertToUnit as L, SymbolErrorInstanceInfo as M, SymbolBeanFullName as N, createBeanDecorator as O, StateLock as P, deepEqual as R, Virtual as S, usePrepareArg as T, BeanSimple as U, isHttpUrl as V, registerMappedClassMetadataKey as W, BeanControllerPageBase as _, formatLoggerFilter as a, BeanControllerBase as b, prepareComponentOptions as c, bootstrap as d, sys as f, BeanRenderBase as g, BeanStyleBase as h, formatLoggerConsole as i, BeanBase as j, BeanInfo as k, useController as l, BeanScopeBase as m, $protocolKey as n, useApp as o, createZovaComponentAsync as p, PluginZova as r, createZovaComponentPage as s, init_src as t, ClientOnly as u, SymbolController as v, Use as w, useComputed as x, SymbolControllerRefDisable as y, deepExtend as z };

import { a as __toESM, n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { c as require_object_hash, d as _objectSpread2, f as init_objectSpread2, i as init_objectWithoutProperties, k as require_dist, l as init_lib, m as init_asyncToGenerator, p as _asyncToGenerator, r as _objectWithoutProperties, u as Environment } from "./fecha-DmopMB3M.js";
import { r as replaceTemplate, t as init_src } from "./zova-6Abekb1F.js";
//#region node_modules/.pnpm/@cabloy+quasar-app-vite@2.5.9_@cabloy+vue-router@4.4.16_vue@3.5.34_typescript@5.9.3___@_332ca92dddaa406d08b7b293d24ae87f/node_modules/@cabloy/quasar-app-vite/exports/wrappers/wrappers.js
var wrapper, defineBoot;
var init_wrappers = __esmMin((() => {
	wrapper = (callback) => callback;
	defineBoot = wrapper;
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json5@1.1.6/node_modules/@cabloy/json5/dist/index.js
function __patchJSON() {
	const __dateTest = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
	function __jsonReviver(self, k, v, reviver) {
		if (v && typeof v === "string" && __dateTest.test(v)) v = new Date(v);
		if (!reviver) return v;
		return reviver.call(self, k, v);
	}
	function __jsonReplacer(self, k, v, replacer) {
		if (replacer) v = replacer.call(self, k, v);
		if (typeof v === "bigint") v = String(v);
		return v;
	}
	const _jsonParse = JSON.parse;
	JSON.parse = function(source, reviver) {
		return _jsonParse(source, function(k, v) {
			return __jsonReviver(this, k, v, reviver);
		});
	};
	const _jsonStringify = JSON.stringify;
	JSON.stringify = function(value, replacer, space) {
		return _jsonStringify(value, function(k, v) {
			return __jsonReplacer(this, k, v, replacer);
		}, space);
	};
	const _json5Parse = import_dist.default.parse;
	const parse = function(source, reviver) {
		return _json5Parse(source, function(k, v) {
			return __jsonReviver(this, k, v, reviver);
		});
	};
	const _json5Stringify = import_dist.default.stringify;
	const stringify = function(value, replacer, space) {
		return _json5Stringify(value, function(k, v) {
			return __jsonReplacer(this, k, v, replacer);
		}, space);
	};
	globalThis.JSON5 = {
		parse,
		stringify
	};
}
var import_dist;
var init_dist$11 = __esmMin((() => {
	import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
	__patchJSON();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+utils@2.1.19/node_modules/@cabloy/utils/dist/index.js
function isEmptyObject(obj) {
	if (!obj) return true;
	return Object.keys(obj).length === 0;
}
function isClass(fn) {
	var _fn$prototype;
	return typeof fn === "function" && !!fn.name && ((_fn$prototype = fn.prototype) === null || _fn$prototype === void 0 ? void 0 : _fn$prototype.constructor) === fn;
}
function isPromise(obj) {
	return obj instanceof Promise || obj && typeof obj.then === "function";
}
function isNilOrEmptyString(str) {
	return str === void 0 || str === null || str === "";
}
function checkMeta(meta, data) {
	if (!meta) return true;
	for (const key in meta) {
		const metaItem = meta[key];
		if (isNil$1(metaItem)) continue;
		if (!Array.isArray(metaItem) && metaItem !== (data === null || data === void 0 ? void 0 : data[key])) return false;
		if (Array.isArray(metaItem) && !metaItem.includes(data === null || data === void 0 ? void 0 : data[key])) return false;
	}
	return true;
}
function catchError(_x) {
	return _catchError.apply(this, arguments);
}
function _catchError() {
	_catchError = _asyncToGenerator(function* (fnMethod) {
		let error;
		let data;
		try {
			data = yield fnMethod();
		} catch (err) {
			error = err;
		}
		return error ? [void 0, error] : [data, void 0];
	});
	return _catchError.apply(this, arguments);
}
function hasProperty(obj, name, sep) {
	return _hasProperty(obj, name, sep);
}
function getProperty$2(obj, name, sep) {
	return _getProperty$2(obj, name, sep, false);
}
function _hasProperty(_obj, name, sep) {
	if (!_obj) return false;
	let obj = _obj;
	const names = name.split(sep || ".");
	for (const _name of names) {
		const [name, index] = _parsePropertyKey(_name);
		if (__keysIgnore.includes(name)) throw new Error(`invalid prop: ${name}`);
		if (obj === void 0 || !Object.hasOwnProperty.call(obj, name)) return false;
		obj = obj[name];
		if (index !== void 0) obj = obj[index];
	}
	return true;
}
function _getProperty$2(_obj, name, sep, forceObject) {
	if (!_obj) return void 0;
	let obj = _obj;
	const names = name.split(sep || ".");
	for (const _name of names) {
		const [name, index] = _parsePropertyKey(_name);
		if (__keysIgnore.includes(name)) throw new Error(`invalid prop: ${name}`);
		if (obj[name] === void 0) if (forceObject) if (index === void 0) obj[name] = {};
		else obj[name] = [];
		else {
			obj = obj[name];
			break;
		}
		obj = obj[name];
		if (index !== void 0) obj = obj[index];
	}
	return obj;
}
function _parsePropertyKey(name) {
	const matched = name.match(/([^[]+)\[(\d+)\]/);
	if (!matched) return [name, void 0];
	return [matched[1], Number.parseInt(matched[2])];
}
function combineParamsAndQuery(path, options) {
	return combineQueries(defaultPathSerializer(path, options === null || options === void 0 ? void 0 : options.params), options === null || options === void 0 ? void 0 : options.query);
}
function combineQueries(pagePath, queries) {
	var _pagePath;
	pagePath = (_pagePath = pagePath) !== null && _pagePath !== void 0 ? _pagePath : "/";
	if (!queries) return pagePath;
	const query2 = [];
	const parts = [];
	if (queries) for (const key in queries) {
		const value = queries[key];
		if (isNil$1(value)) continue;
		if (typeof value === "object") query2.push([key, value]);
		else parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
	}
	for (const [key, value] of query2) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`);
	if (parts.length === 0) return pagePath;
	const str = parts.join("&");
	const pos = pagePath.indexOf("?");
	if (pos === -1) return `${pagePath}?${str}`;
	if (pos === pagePath.length - 1) return `${pagePath}${str}`;
	return `${pagePath}&${str}`;
}
function defaultPathSerializer(pathName, pathParams) {
	var _pathParams;
	if (!pathName) return void 0;
	pathParams = (_pathParams = pathParams) !== null && _pathParams !== void 0 ? _pathParams : {};
	for (const item of [PATH_PARAM_RE, PATH_PARAM_RE2]) pathName = pathName.replace(item, (_, _part) => {
		if (_part.includes("?")) _part = _part.substring(0, _part.length - 1);
		const value = pathParams === null || pathParams === void 0 ? void 0 : pathParams[_part];
		if (value === void 0 || value === null) return "";
		if (typeof value === "object") return encodeURIComponent(JSON.stringify(value));
		return encodeURIComponent(value);
	});
	return pathName;
}
function forEach(_x3, _x4, _x5) {
	return _forEach.apply(this, arguments);
}
function _forEach() {
	_forEach = _asyncToGenerator(function* (arr, order, fn) {
		if (!arr) return;
		if (order) for (let index = 0; index < arr.length; index++) yield fn(arr[index], index);
		else for (let index = arr.length - 1; index >= 0; index--) yield fn(arr[index], index);
	});
	return _forEach.apply(this, arguments);
}
function forEachSync(arr, order, fn) {
	if (order) for (let index = 0; index < arr.length; index++) fn(arr[index], index);
	else for (let index = arr.length - 1; index >= 0; index--) fn(arr[index], index);
}
function _concat(...args) {
	return [].concat(...args);
}
function _join(list, sep) {
	if (!list) return "";
	return list.join(sep);
}
function createFunction(expression, scopeKeys) {
	let fn;
	try {
		const js = `return (${expression})`;
		fn = scopeKeys && scopeKeys.length > 0 ? new Function(scopeKeys.join(","), js) : new Function(js);
	} catch (_err) {
		fn = scopeKeys && scopeKeys.length > 0 ? new Function(scopeKeys.join(","), expression) : new Function(expression);
	}
	return fn;
}
function evaluateSimple(expression, scope) {
	const scopeKeys = scope ? Object.keys(scope) : void 0;
	const scopeValues = scope ? Object.values(scope) : void 0;
	const fn = createFunction(expression, scopeKeys);
	return scopeValues ? fn(...scopeValues) : fn();
}
function evaluateExpressions(expressions, context, celEnv, dry) {
	if (isNil$1(expressions)) return _returnExpressionWithDry(expressions, dry);
	if (Array.isArray(expressions)) return expressions.map((item) => _evaluateExpressionInner(item, context, celEnv, dry));
	else if (typeof expressions === "object") {
		if (expressions.$$typeof) return expressions;
		if (expressions instanceof Date) return expressions;
		const res = {};
		for (const key in expressions) res[key] = _evaluateExpressionInner(expressions[key], context, celEnv, dry);
		return res;
	}
	return _evaluateExpressionInner(expressions, context, celEnv, dry);
}
function _evaluateExpressionInner(expression, context, celEnv, dry) {
	if (isNil$1(expression)) return _returnExpressionWithDry(expression, dry);
	if (typeof expression === "object") return evaluateExpressions(expression, context, celEnv, dry);
	if (typeof expression !== "string") return _returnExpressionWithDry(expression, dry);
	if (!expression.startsWith("cel://")) return _returnExpressionWithDry(expression, dry);
	return dry ? true : evaluate(expression.substring(6), context, celEnv);
}
function _returnExpressionWithDry(expression, dry) {
	return dry ? false : expression;
}
function evaluate(expression, context, celEnv) {
	if (expression.startsWith("raw://")) return expression.substring(6);
	else if (expression.startsWith("regexp://")) return evaluateSimple(expression.substring(9));
	else if (expression === "this") return context !== null && context !== void 0 ? context : {};
	else if (expression === "thisDef") return (celEnv !== null && celEnv !== void 0 ? celEnv : celEnvBase).getDefinitions();
	return (celEnv !== null && celEnv !== void 0 ? celEnv : celEnvBase).evaluate(expression, context);
}
function checkErrorJwtExpired(err) {
	return err && (err.message === "jwt expired" || err.name === "TokenExpiredError");
}
function hashkey(key) {
	if (key === void 0 || key === null) return "";
	if (Array.isArray(key) || typeof key === "object") return (0, import_object_hash.default)(key, { respectType: false });
	if (typeof key !== "string") return String(key);
	return key;
}
function matchSelector(match, selector, matchThis, ...matchArgs) {
	if (!Array.isArray(match)) {
		if (typeof match === "string" && match.startsWith("regexp://")) match = evaluateSimple(match.substring(9));
		return typeof match === "string" && match.startsWith("cel://") && !!evaluateExpressions(match, {
			selector,
			context: matchArgs[0] && typeof matchArgs[0] === "object" ? _objectSpread2({}, matchArgs[0]) : matchArgs[0]
		}) || typeof match === "string" && !match.startsWith("cel://") && typeof selector === "string" && match === selector || match instanceof RegExp && typeof selector === "string" && match.test(selector) || typeof match === "function" && match.call(matchThis, selector, ...matchArgs);
	}
	return match.some((item) => matchSelector(item, selector));
}
function combineResourceNameParts(resourceName, moduleName, simplify, simplifyProviderId) {
	var _simplify, _simplifyProviderId;
	simplify = (_simplify = simplify) !== null && _simplify !== void 0 ? _simplify : true;
	simplifyProviderId = (_simplifyProviderId = simplifyProviderId) !== null && _simplifyProviderId !== void 0 ? _simplifyProviderId : true;
	if (!resourceName) resourceName = "";
	if (typeof moduleName !== "string") moduleName = moduleName.relativeName;
	const parts = moduleName.split("-");
	const res = [];
	if (!simplifyProviderId || parts[0] !== "a") res.push(parts[0]);
	if (!simplify || !resourceName.startsWith(parts[1])) res.push(parts[1]);
	if (resourceName) res.push(resourceName);
	return res;
}
function combineApiPath(path, moduleName, prefix, simplify, globalPrefixConfig) {
	var _simplify2;
	const globalPrefix = typeof prefix === "string" ? prefix : prefix === false ? "" : globalPrefixConfig;
	simplify = (_simplify2 = simplify) !== null && _simplify2 !== void 0 ? _simplify2 : true;
	if (!path) path = "";
	if (path.startsWith("//")) return path.substring(1);
	if (path.startsWith("/")) return `${globalPrefix}${path}`;
	return `${globalPrefix}/${combineResourceNameParts(path, moduleName !== null && moduleName !== void 0 ? moduleName : "", simplify, true).join("/")}`;
}
function combineApiPathControllerAndAction(moduleName, controllerPath, actionPath, prefix, simplify, globalPrefixConfig) {
	if (actionPath === void 0) actionPath = "";
	let routePath;
	if (typeof actionPath !== "string") throw new TypeError("regexp not supported");
	else if (actionPath.startsWith("/")) routePath = combineApiPath(actionPath, moduleName, prefix, simplify, globalPrefixConfig);
	else if (!controllerPath) routePath = combineApiPath(actionPath, moduleName, prefix, simplify, globalPrefixConfig);
	else {
		routePath = combineApiPath(controllerPath, moduleName, prefix, simplify, globalPrefixConfig);
		if (actionPath) routePath = `${routePath}/${actionPath}`;
	}
	return routePath;
}
var import_object_hash, isUndefined$2, isNil$1, __keysIgnore, PATH_PARAM_RE, PATH_PARAM_RE2, celEnvBase, params;
var init_dist$10 = __esmMin((() => {
	init_lib();
	import_object_hash = /* @__PURE__ */ __toESM(require_object_hash(), 1);
	init_asyncToGenerator();
	init_objectSpread2();
	isUndefined$2 = (obj) => typeof obj === "undefined";
	isNil$1 = (val) => isUndefined$2(val) || val === null;
	__keysIgnore = [
		"constructor",
		"prototype",
		"__proto__"
	];
	PATH_PARAM_RE = /\{([^{}/]+)\}/g;
	PATH_PARAM_RE2 = /:([^/]+)/g;
	celEnvBase = new Environment({
		unlistedVariablesAreDyn: true,
		enableOptionalTypes: true,
		homogeneousAggregateLiterals: false
	});
	params = [];
	for (let i = 0; i < 10; i++) {
		params.push("dyn");
		celEnvBase.registerFunction(`concat(${params.join(",")}):list`, _concat);
	}
	celEnvBase.registerFunction("join(list):string", (list) => {
		return _join(list);
	});
	celEnvBase.registerFunction("join(list,string):string", (list, sep) => {
		return _join(list, sep);
	});
	celEnvBase.registerFunction("string(null):string", (value) => {
		return String(value);
	});
	celEnvBase.registerOperator("string + int", (str, n) => str + String(n));
	celEnvBase.registerOperator("int + string", (n, str) => String(n) + str);
	celEnvBase.registerOperator("string + double", (str, n) => str + String(n));
	celEnvBase.registerOperator("double + string", (n, str) => String(n) + str);
	celEnvBase.registerOperator("string + null", (str, _n) => str);
	celEnvBase.registerOperator("null + string", (_n, str) => str);
	celEnvBase.registerOperator("string == null", (str, n) => str === n);
	celEnvBase.registerOperator("int == null", (num, n) => num === n);
	celEnvBase.registerOperator("bool == null", (b, n) => b === n);
	celEnvBase.registerFunction("get(map,string):dyn", (obj, name) => {
		var _getProperty2;
		return (_getProperty2 = getProperty$2(obj, name)) !== null && _getProperty2 !== void 0 ? _getProperty2 : null;
	});
	celEnvBase.registerFunction("get(map,string,string):dyn", (obj, name, sep) => {
		var _getProperty3;
		return (_getProperty3 = getProperty$2(obj, name, sep)) !== null && _getProperty3 !== void 0 ? _getProperty3 : null;
	});
	celEnvBase.registerFunction("get(bool,string):dyn", (_obj, _name) => {
		return null;
	});
	celEnvBase.registerFunction("get(bool,string,string):dyn", (_obj, _name, _sep) => {
		return null;
	});
	celEnvBase.registerFunction("get(null,string):dyn", (_obj, _name) => {
		return null;
	});
	celEnvBase.registerFunction("get(null,string,string):dyn", (_obj, _name, _sep) => {
		return null;
	});
	celEnvBase.registerFunction("exists(null,string):bool", (obj, name) => {
		return hasProperty(obj, name);
	});
	celEnvBase.registerFunction("exists(map,string):bool", (obj, name) => {
		return hasProperty(obj, name);
	});
	celEnvBase.registerFunction("stringify(dyn):string", (dyn) => {
		return JSON.stringify(dyn, null, 2);
	});
	celEnvBase.registerFunction("parse(string):dyn", (str) => {
		return JSON.parse(str);
	});
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+extend@3.2.5/node_modules/@cabloy/extend/dist/index.js
function isArray(arr) {
	if (typeof Array.isArray === "function") return Array.isArray(arr);
	return toStr.call(arr) === "[object Array]";
}
function isPlainObject$1(obj) {
	if (!obj || toStr.call(obj) !== "[object Object]") return false;
	const hasOwnConstructor = hasOwn.call(obj, "constructor");
	const hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) return false;
	let key;
	for (key in obj);
	return typeof key === "undefined" || hasOwn.call(obj, key);
}
function setProperty(target, options) {
	if (defineProperty && options.name === "__proto__") defineProperty(target, options.name, {
		enumerable: true,
		configurable: true,
		value: options.newValue,
		writable: true
	});
	else target[options.name] = options.newValue;
}
function getProperty$1(obj, name) {
	if (name === "__proto__") {
		if (!hasOwn.call(obj, name)) return;
		else if (gOPD) return gOPD(obj, name).value;
	}
	return obj[name];
}
function extend$1(...args) {
	let options, name, src, copy, copyIsArray, clone;
	let target = args[0];
	let i = 1;
	const length = arguments.length;
	let deep = false;
	if (typeof target === "boolean") {
		deep = target;
		target = args[1] || {};
		i = 2;
	}
	if (target == null || typeof target !== "object" && typeof target !== "function") target = {};
	for (; i < length; ++i) {
		options = args[i];
		if (options != null) {
			if (options.$$typeof) {
				target = options;
				continue;
			}
			for (name in options) {
				src = getProperty$1(target, name);
				copy = getProperty$1(options, name);
				if (target !== copy) if (deep && copy && (isPlainObject$1(copy) || (copyIsArray = isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = [];
					} else clone = src && isPlainObject$1(src) ? src : {};
					setProperty(target, {
						name,
						newValue: extend$1(deep, clone, copy)
					});
				} else setProperty(target, {
					name,
					newValue: copy
				});
			}
		}
	}
	return target;
}
var hasOwn, toStr, defineProperty, gOPD;
var init_dist$9 = __esmMin((() => {
	hasOwn = Object.prototype.hasOwnProperty;
	toStr = Object.prototype.toString;
	defineProperty = Object.defineProperty;
	gOPD = Object.getOwnPropertyDescriptor;
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+compose@2.1.5/node_modules/@cabloy/compose/dist/index.js
function __adapterDefault(_context, chain) {
	return {
		receiver: void 0,
		fn: chain
	};
}
function compose(chains, adapter) {
	if (!adapter) adapter = __adapterDefault;
	if (!chains) chains = [];
	return function(context, next) {
		let index = -1;
		return dispatch(0, context);
		function dispatch(i, context) {
			if (i <= index) throw new Error("next() called multiple times");
			index = i;
			let receiver;
			let fn;
			const chain = chains[i];
			if (chain) {
				const obj = adapter(context, chain);
				if (!obj) return dispatch(i + 1, context);
				receiver = obj.receiver;
				fn = obj.fn;
				if (!fn) throw new Error("fn is not defined");
			}
			if (i === chains.length) fn = next;
			if (!fn) return context;
			return fn.call(receiver, context, (...args) => {
				context = args.length === 0 ? context : args[0];
				return dispatch(i + 1, context);
			});
		}
	};
}
var init_dist$8 = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/core.js
function $constructor(name, initializer, params) {
	var _params$Parent;
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = (_params$Parent = params === null || params === void 0 ? void 0 : params.Parent) !== null && _params$Parent !== void 0 ? _params$Parent : Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a$deferred;
		var _a;
		const inst = (params === null || params === void 0 ? void 0 : params.Parent) ? new Definition() : this;
		init(inst, def);
		(_a$deferred = (_a = inst._zod).deferred) !== null && _a$deferred !== void 0 || (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		var _inst$_zod;
		if ((params === null || params === void 0 ? void 0 : params.Parent) && inst instanceof params.Parent) return true;
		return inst === null || inst === void 0 || (_inst$_zod = inst._zod) === null || _inst$_zod === void 0 || (_inst$_zod = _inst$_zod.traits) === null || _inst$_zod === void 0 ? void 0 : _inst$_zod.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
var NEVER, $brand, $ZodAsyncError, $ZodEncodeError, globalConfig;
var init_core$1 = __esmMin((() => {
	NEVER = Object.freeze({ status: "aborted" });
	$brand = Symbol("zod_brand");
	$ZodAsyncError = class extends Error {
		constructor() {
			super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
		}
	};
	$ZodEncodeError = class extends Error {
		constructor(name) {
			super(`Encountered unidirectional transform during encode: ${name}`);
			this.name = "ZodEncodeError";
		}
	};
	globalConfig = {};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/util.js
var util_exports = /* @__PURE__ */ __exportAll({
	BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
	Class: () => Class,
	NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
	aborted: () => aborted,
	allowsEval: () => allowsEval,
	assert: () => assert,
	assertEqual: () => assertEqual,
	assertIs: () => assertIs,
	assertNever: () => assertNever,
	assertNotEqual: () => assertNotEqual,
	assignProp: () => assignProp,
	base64ToUint8Array: () => base64ToUint8Array,
	base64urlToUint8Array: () => base64urlToUint8Array,
	cached: () => cached,
	captureStackTrace: () => captureStackTrace,
	cleanEnum: () => cleanEnum,
	cleanRegex: () => cleanRegex,
	clone: () => clone,
	cloneDef: () => cloneDef,
	createTransparentProxy: () => createTransparentProxy,
	defineLazy: () => defineLazy,
	esc: () => esc,
	escapeRegex: () => escapeRegex,
	explicitlyAborted: () => explicitlyAborted,
	extend: () => extend,
	finalizeIssue: () => finalizeIssue,
	floatSafeRemainder: () => floatSafeRemainder,
	getElementAtPath: () => getElementAtPath,
	getEnumValues: () => getEnumValues,
	getLengthableOrigin: () => getLengthableOrigin,
	getParsedType: () => getParsedType,
	getSizableOrigin: () => getSizableOrigin,
	hexToUint8Array: () => hexToUint8Array,
	isObject: () => isObject$1,
	isPlainObject: () => isPlainObject,
	issue: () => issue,
	joinValues: () => joinValues,
	jsonStringifyReplacer: () => jsonStringifyReplacer,
	merge: () => merge,
	mergeDefs: () => mergeDefs,
	normalizeParams: () => normalizeParams,
	nullish: () => nullish$1,
	numKeys: () => numKeys,
	objectClone: () => objectClone,
	omit: () => omit$2,
	optionalKeys: () => optionalKeys,
	parsedType: () => parsedType,
	partial: () => partial,
	pick: () => pick,
	prefixIssues: () => prefixIssues,
	primitiveTypes: () => primitiveTypes,
	promiseAllObject: () => promiseAllObject,
	propertyKeyTypes: () => propertyKeyTypes,
	randomString: () => randomString,
	required: () => required,
	safeExtend: () => safeExtend,
	setLocaleAdapter: () => setLocaleAdapter$1,
	shallowClone: () => shallowClone,
	slugify: () => slugify,
	stringifyPrimitive: () => stringifyPrimitive,
	uint8ArrayToBase64: () => uint8ArrayToBase64,
	uint8ArrayToBase64url: () => uint8ArrayToBase64url,
	uint8ArrayToHex: () => uint8ArrayToHex,
	unwrapMessage: () => unwrapMessage
});
function assertEqual(val) {
	return val;
}
function assertNotEqual(val) {
	return val;
}
function assertIs(_arg) {}
function assertNever(_x) {
	throw new Error("Unexpected value in exhaustive check");
}
function assert(_) {}
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
	return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish$1(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepString = step.toString();
	let stepDecCount = (stepString.split(".")[1] || "").length;
	if (stepDecCount === 0 && /\d?e-\d+/.test(stepString)) {
		const match = stepString.match(/\d?e-(\d+)/);
		if (match === null || match === void 0 ? void 0 : match[1]) stepDecCount = Number.parseInt(match[1]);
	}
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / Math.pow(10, decCount);
}
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
function objectClone(obj) {
	return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
	return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
	return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
	if (!path) return obj;
	return path.reduce((acc, key) => acc === null || acc === void 0 ? void 0 : acc[key], obj);
}
function promiseAllObject(promisesObj) {
	const keys = Object.keys(promisesObj);
	const promises = keys.map((key) => promisesObj[key]);
	return Promise.all(promises).then((results) => {
		const resolvedObj = {};
		for (let i = 0; i < keys.length; i++) resolvedObj[keys[i]] = results[i];
		return resolvedObj;
	});
}
function randomString(length = 10) {
	const chars = "abcdefghijklmnopqrstuvwxyz";
	let str = "";
	for (let i = 0; i < length; i++) str += chars[Math.floor(Math.random() * 26)];
	return str;
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function isObject$1(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
function isPlainObject(o) {
	if (isObject$1(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject$1(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return _objectSpread2({}, o);
	if (Array.isArray(o)) return [...o];
	return o;
}
function numKeys(data) {
	let keyCount = 0;
	for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) keyCount++;
	return keyCount;
}
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def !== null && def !== void 0 ? def : inst._zod.def);
	if (!def || (params === null || params === void 0 ? void 0 : params.parent)) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if ((params === null || params === void 0 ? void 0 : params.message) !== void 0) {
		if ((params === null || params === void 0 ? void 0 : params.error) !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return _objectSpread2(_objectSpread2({}, params), {}, { error: () => params.error });
	return params;
}
function createTransparentProxy(getter) {
	let target;
	return new Proxy({}, {
		get(_, prop, receiver) {
			var _target;
			(_target = target) !== null && _target !== void 0 || (target = getter());
			return Reflect.get(target, prop, receiver);
		},
		set(_, prop, value, receiver) {
			var _target2;
			(_target2 = target) !== null && _target2 !== void 0 || (target = getter());
			return Reflect.set(target, prop, value, receiver);
		},
		has(_, prop) {
			var _target3;
			(_target3 = target) !== null && _target3 !== void 0 || (target = getter());
			return Reflect.has(target, prop);
		},
		deleteProperty(_, prop) {
			var _target4;
			(_target4 = target) !== null && _target4 !== void 0 || (target = getter());
			return Reflect.deleteProperty(target, prop);
		},
		ownKeys(_) {
			var _target5;
			(_target5 = target) !== null && _target5 !== void 0 || (target = getter());
			return Reflect.ownKeys(target);
		},
		getOwnPropertyDescriptor(_, prop) {
			var _target6;
			(_target6 = target) !== null && _target6 !== void 0 || (target = getter());
			return Reflect.getOwnPropertyDescriptor(target, prop);
		},
		defineProperty(_, prop, descriptor) {
			var _target7;
			(_target7 = target) !== null && _target7 !== void 0 || (target = getter());
			return Reflect.defineProperty(target, prop, descriptor);
		}
	});
}
function stringifyPrimitive(value) {
	if (typeof value === "bigint") return value.toString() + "n";
	if (typeof value === "string") return `"${value}"`;
	return `${value}`;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit$2(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = _objectSpread2({}, schema._zod.def.shape);
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = _objectSpread2(_objectSpread2({}, schema._zod.def.shape), shape);
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = _objectSpread2(_objectSpread2({}, schema._zod.def.shape), shape);
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	return clone(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = _objectSpread2(_objectSpread2({}, a._zod.def.shape), b._zod.def.shape);
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: []
	}));
}
function partial(Class, schema, mask) {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = _objectSpread2({}, oldShape);
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = _objectSpread2({}, oldShape);
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) {
		var _x$issues$i;
		if (((_x$issues$i = x.issues[i]) === null || _x$issues$i === void 0 ? void 0 : _x$issues$i.continue) !== true) return true;
	}
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) {
		var _x$issues$i2;
		if (((_x$issues$i2 = x.issues[i]) === null || _x$issues$i2 === void 0 ? void 0 : _x$issues$i2.continue) === false) return true;
	}
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a$path;
		var _a;
		(_a$path = (_a = iss).path) !== null && _a$path !== void 0 || (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
}
function setLocaleAdapter$1(localeAdapterFn) {
	__localeAdapterFn = localeAdapterFn;
}
function finalizeIssue(iss, ctx, config) {
	var _iss$path;
	const full = _objectSpread2(_objectSpread2({}, iss), {}, { path: (_iss$path = iss.path) !== null && _iss$path !== void 0 ? _iss$path : [] });
	if (!iss.message) {
		var _iss$inst, _iss$inst$error, _ref, _ref2, _ref3, _ref4, _ctx$error, _config$customError, _config$localeError;
		const msg = unwrapMessage((_iss$inst = iss.inst) === null || _iss$inst === void 0 || (_iss$inst = _iss$inst._zod.def) === null || _iss$inst === void 0 || (_iss$inst$error = _iss$inst.error) === null || _iss$inst$error === void 0 ? void 0 : _iss$inst$error.call(_iss$inst, iss));
		full.message = (_ref = (_ref2 = (_ref3 = (_ref4 = __localeAdapterFn ? __localeAdapterFn(msg, iss) : msg) !== null && _ref4 !== void 0 ? _ref4 : unwrapMessage(ctx === null || ctx === void 0 || (_ctx$error = ctx.error) === null || _ctx$error === void 0 ? void 0 : _ctx$error.call(ctx, iss))) !== null && _ref3 !== void 0 ? _ref3 : unwrapMessage((_config$customError = config.customError) === null || _config$customError === void 0 ? void 0 : _config$customError.call(config, iss))) !== null && _ref2 !== void 0 ? _ref2 : unwrapMessage((_config$localeError = config.localeError) === null || _config$localeError === void 0 ? void 0 : _config$localeError.call(config, iss))) !== null && _ref !== void 0 ? _ref : "Invalid input";
	}
	delete full.inst;
	delete full.continue;
	if (!(ctx === null || ctx === void 0 ? void 0 : ctx.reportInput)) delete full.input;
	return full;
}
function getSizableOrigin(input) {
	if (input instanceof Set) return "set";
	if (input instanceof Map) return "map";
	if (input instanceof File) return "file";
	return "unknown";
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function parsedType(data) {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "nan" : "number";
		case "object": {
			if (data === null) return "null";
			if (Array.isArray(data)) return "array";
			const obj = data;
			if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
		}
	}
	return t;
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return _objectSpread2({}, iss);
}
function cleanEnum(obj) {
	return Object.entries(obj).filter(([k, _]) => {
		return Number.isNaN(Number.parseInt(k, 10));
	}).map((el) => el[1]);
}
function base64ToUint8Array(base64) {
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
}
function uint8ArrayToBase64(bytes) {
	let binaryString = "";
	for (let i = 0; i < bytes.length; i++) binaryString += String.fromCharCode(bytes[i]);
	return btoa(binaryString);
}
function base64urlToUint8Array(base64url) {
	const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
	return base64ToUint8Array(base64 + "=".repeat((4 - base64.length % 4) % 4));
}
function uint8ArrayToBase64url(bytes) {
	return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
	const cleanHex = hex.replace(/^0x/, "");
	if (cleanHex.length % 2 !== 0) throw new Error("Invalid hex string length");
	const bytes = new Uint8Array(cleanHex.length / 2);
	for (let i = 0; i < cleanHex.length; i += 2) bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
	return bytes;
}
function uint8ArrayToHex(bytes) {
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var EVALUATING, captureStackTrace, allowsEval, getParsedType, propertyKeyTypes, primitiveTypes, NUMBER_FORMAT_RANGES, BIGINT_FORMAT_RANGES, __localeAdapterFn, Class;
var init_util = __esmMin((() => {
	init_objectSpread2();
	EVALUATING = Symbol("evaluating");
	captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
	allowsEval = cached(() => {
		var _navigator;
		if (typeof navigator !== "undefined" && ((_navigator = navigator) === null || _navigator === void 0 || (_navigator = _navigator.userAgent) === null || _navigator === void 0 ? void 0 : _navigator.includes("Cloudflare"))) return false;
		try {
			new Function("");
			return true;
		} catch (_) {
			return false;
		}
	});
	getParsedType = (data) => {
		const t = typeof data;
		switch (t) {
			case "undefined": return "undefined";
			case "string": return "string";
			case "number": return Number.isNaN(data) ? "nan" : "number";
			case "boolean": return "boolean";
			case "function": return "function";
			case "bigint": return "bigint";
			case "symbol": return "symbol";
			case "object":
				if (Array.isArray(data)) return "array";
				if (data === null) return "null";
				if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return "promise";
				if (typeof Map !== "undefined" && data instanceof Map) return "map";
				if (typeof Set !== "undefined" && data instanceof Set) return "set";
				if (typeof Date !== "undefined" && data instanceof Date) return "date";
				if (typeof File !== "undefined" && data instanceof File) return "file";
				return "object";
			default: throw new Error(`Unknown data type: ${t}`);
		}
	};
	propertyKeyTypes = new Set([
		"string",
		"number",
		"symbol"
	]);
	primitiveTypes = new Set([
		"string",
		"number",
		"bigint",
		"boolean",
		"symbol",
		"undefined"
	]);
	NUMBER_FORMAT_RANGES = {
		safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
		int32: [-2147483648, 2147483647],
		uint32: [0, 4294967295],
		float32: [-34028234663852886e22, 34028234663852886e22],
		float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
	};
	BIGINT_FORMAT_RANGES = {
		int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
		uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
	};
	Class = class {
		constructor(..._args) {}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/errors.js
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues });
		else if (issue.code === "invalid_element") processError({ issues: issue.issues });
		else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
		else {
			let curr = fieldErrors;
			let i = 0;
			while (i < issue.path.length) {
				const el = issue.path[i];
				if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
				else {
					curr[el] = curr[el] || { _errors: [] };
					curr[el]._errors.push(mapper(issue));
				}
				curr = curr[el];
				i++;
			}
		}
	};
	processError(error);
	return fieldErrors;
}
function treeifyError(error, mapper = (issue) => issue.message) {
	const result = { errors: [] };
	const processError = (error, path = []) => {
		var _a, _b;
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, issue.path));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, issue.path);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, issue.path);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) {
				result.errors.push(mapper(issue));
				continue;
			}
			let curr = result;
			let i = 0;
			while (i < fullpath.length) {
				const el = fullpath[i];
				const terminal = i === fullpath.length - 1;
				if (typeof el === "string") {
					var _curr$properties, _a$el;
					(_curr$properties = curr.properties) !== null && _curr$properties !== void 0 || (curr.properties = {});
					(_a$el = (_a = curr.properties)[el]) !== null && _a$el !== void 0 || (_a[el] = { errors: [] });
					curr = curr.properties[el];
				} else {
					var _curr$items, _b$el;
					(_curr$items = curr.items) !== null && _curr$items !== void 0 || (curr.items = []);
					(_b$el = (_b = curr.items)[el]) !== null && _b$el !== void 0 || (_b[el] = { errors: [] });
					curr = curr.items[el];
				}
				if (terminal) curr.errors.push(mapper(issue));
				i++;
			}
		}
	};
	processError(error);
	return result;
}
/** Format a ZodError as a human-readable string in the following form.
*
* From
*
* ```ts
* ZodError {
*   issues: [
*     {
*       expected: 'string',
*       code: 'invalid_type',
*       path: [ 'username' ],
*       message: 'Invalid input: expected string'
*     },
*     {
*       expected: 'number',
*       code: 'invalid_type',
*       path: [ 'favoriteNumbers', 1 ],
*       message: 'Invalid input: expected number'
*     }
*   ];
* }
* ```
*
* to
*
* ```
* username
*   ✖ Expected number, received string at "username
* favoriteNumbers[0]
*   ✖ Invalid input: expected number
* ```
*/
function toDotPath(_path) {
	const segs = [];
	const path = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
	for (const seg of path) if (typeof seg === "number") segs.push(`[${seg}]`);
	else if (typeof seg === "symbol") segs.push(`[${JSON.stringify(String(seg))}]`);
	else if (/[^\w$]/.test(seg)) segs.push(`[${JSON.stringify(seg)}]`);
	else {
		if (segs.length) segs.push(".");
		segs.push(seg);
	}
	return segs.join("");
}
function prettifyError(error) {
	const lines = [];
	const issues = [...error.issues].sort((a, b) => {
		var _a$path, _b$path;
		return ((_a$path = a.path) !== null && _a$path !== void 0 ? _a$path : []).length - ((_b$path = b.path) !== null && _b$path !== void 0 ? _b$path : []).length;
	});
	for (const issue of issues) {
		var _issue$path;
		lines.push(`✖ ${issue.message}`);
		if ((_issue$path = issue.path) === null || _issue$path === void 0 ? void 0 : _issue$path.length) lines.push(`  → at ${toDotPath(issue.path)}`);
	}
	return lines.join("\n");
}
var initializer$1, $ZodError, $ZodRealError;
var init_errors$1 = __esmMin((() => {
	init_core$1();
	init_util();
	initializer$1 = (inst, def) => {
		inst.name = "$ZodError";
		Object.defineProperty(inst, "_zod", {
			value: inst._zod,
			enumerable: false
		});
		Object.defineProperty(inst, "issues", {
			value: def,
			enumerable: false
		});
		inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
		Object.defineProperty(inst, "toString", {
			value: () => inst.message,
			enumerable: false
		});
	};
	$ZodError = $constructor("$ZodError", initializer$1);
	$ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/parse.js
var _parse, parse$1, _parseAsync, parseAsync$1, _safeParse, safeParse$1, _safeParseAsync, safeParseAsync$1, _encode, encode$1, _decode, decode$1, _encodeAsync, encodeAsync$1, _decodeAsync, decodeAsync$1, _safeEncode, safeEncode$1, _safeDecode, safeDecode$1, _safeEncodeAsync, safeEncodeAsync$1, _safeDecodeAsync, safeDecodeAsync$1;
var init_parse$1 = __esmMin((() => {
	init_core$1();
	init_errors$1();
	init_util();
	init_asyncToGenerator();
	init_objectSpread2();
	_parse = (_Err) => (schema, value, _ctx, _params) => {
		const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			var _params$Err;
			const e = new ((_params$Err = _params === null || _params === void 0 ? void 0 : _params.Err) !== null && _params$Err !== void 0 ? _params$Err : _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params === null || _params === void 0 ? void 0 : _params.callee);
			throw e;
		}
		return result.value;
	};
	parse$1 = /* @__PURE__ */ _parse($ZodRealError);
	_parseAsync = (_Err) => function() {
		var _ref = _asyncToGenerator(function* (schema, value, _ctx, params) {
			const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = yield result;
			if (result.issues.length) {
				var _params$Err2;
				const e = new ((_params$Err2 = params === null || params === void 0 ? void 0 : params.Err) !== null && _params$Err2 !== void 0 ? _params$Err2 : _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
				captureStackTrace(e, params === null || params === void 0 ? void 0 : params.callee);
				throw e;
			}
			return result.value;
		});
		return function(_x, _x2, _x3, _x4) {
			return _ref.apply(this, arguments);
		};
	}();
	parseAsync$1 = /* @__PURE__ */ _parseAsync($ZodRealError);
	_safeParse = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? _objectSpread2(_objectSpread2({}, _ctx), {}, { async: false }) : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		return result.issues.length ? {
			success: false,
			error: new (_Err !== null && _Err !== void 0 ? _Err : $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
		} : {
			success: true,
			data: result.value
		};
	};
	safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
	_safeParseAsync = (_Err) => function() {
		var _ref2 = _asyncToGenerator(function* (schema, value, _ctx) {
			const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = yield result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		});
		return function(_x5, _x6, _x7) {
			return _ref2.apply(this, arguments);
		};
	}();
	safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
	_encode = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
		return _parse(_Err)(schema, value, ctx);
	};
	encode$1 = /* @__PURE__ */ _encode($ZodRealError);
	_decode = (_Err) => (schema, value, _ctx) => {
		return _parse(_Err)(schema, value, _ctx);
	};
	decode$1 = /* @__PURE__ */ _decode($ZodRealError);
	_encodeAsync = (_Err) => function() {
		var _ref3 = _asyncToGenerator(function* (schema, value, _ctx) {
			const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		});
		return function(_x8, _x9, _x10) {
			return _ref3.apply(this, arguments);
		};
	}();
	encodeAsync$1 = /* @__PURE__ */ _encodeAsync($ZodRealError);
	_decodeAsync = (_Err) => function() {
		var _ref4 = _asyncToGenerator(function* (schema, value, _ctx) {
			return _parseAsync(_Err)(schema, value, _ctx);
		});
		return function(_x11, _x12, _x13) {
			return _ref4.apply(this, arguments);
		};
	}();
	decodeAsync$1 = /* @__PURE__ */ _decodeAsync($ZodRealError);
	_safeEncode = (_Err) => (schema, value, _ctx) => {
		const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
		return _safeParse(_Err)(schema, value, ctx);
	};
	safeEncode$1 = /* @__PURE__ */ _safeEncode($ZodRealError);
	_safeDecode = (_Err) => (schema, value, _ctx) => {
		return _safeParse(_Err)(schema, value, _ctx);
	};
	safeDecode$1 = /* @__PURE__ */ _safeDecode($ZodRealError);
	_safeEncodeAsync = (_Err) => function() {
		var _ref5 = _asyncToGenerator(function* (schema, value, _ctx) {
			const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		});
		return function(_x14, _x15, _x16) {
			return _ref5.apply(this, arguments);
		};
	}();
	safeEncodeAsync$1 = /* @__PURE__ */ _safeEncodeAsync($ZodRealError);
	_safeDecodeAsync = (_Err) => function() {
		var _ref6 = _asyncToGenerator(function* (schema, value, _ctx) {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		});
		return function(_x17, _x18, _x19) {
			return _ref6.apply(this, arguments);
		};
	}();
	safeDecodeAsync$1 = /* @__PURE__ */ _safeDecodeAsync($ZodRealError);
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/regexes.js
var regexes_exports = /* @__PURE__ */ __exportAll({
	base64: () => base64$1,
	base64url: () => base64url$1,
	bigint: () => bigint$2,
	boolean: () => boolean$2,
	browserEmail: () => browserEmail,
	cidrv4: () => cidrv4$1,
	cidrv6: () => cidrv6$1,
	cuid: () => cuid$1,
	cuid2: () => cuid2$1,
	date: () => date$3,
	datetime: () => datetime$1,
	domain: () => domain,
	duration: () => duration$1,
	e164: () => e164$1,
	email: () => email$1,
	emoji: () => emoji$1,
	extendedDuration: () => extendedDuration,
	guid: () => guid$1,
	hex: () => hex$1,
	hostname: () => hostname$1,
	html5Email: () => html5Email,
	httpProtocol: () => httpProtocol,
	idnEmail: () => idnEmail,
	integer: () => integer,
	ipv4: () => ipv4$1,
	ipv6: () => ipv6$1,
	ksuid: () => ksuid$1,
	lowercase: () => lowercase,
	mac: () => mac$1,
	md5_base64: () => md5_base64,
	md5_base64url: () => md5_base64url,
	md5_hex: () => md5_hex,
	nanoid: () => nanoid$1,
	null: () => _null$2,
	number: () => number$2,
	rfc5322Email: () => rfc5322Email,
	sha1_base64: () => sha1_base64,
	sha1_base64url: () => sha1_base64url,
	sha1_hex: () => sha1_hex,
	sha256_base64: () => sha256_base64,
	sha256_base64url: () => sha256_base64url,
	sha256_hex: () => sha256_hex,
	sha384_base64: () => sha384_base64,
	sha384_base64url: () => sha384_base64url,
	sha384_hex: () => sha384_hex,
	sha512_base64: () => sha512_base64,
	sha512_base64url: () => sha512_base64url,
	sha512_hex: () => sha512_hex,
	string: () => string$2,
	time: () => time$1,
	ulid: () => ulid$1,
	undefined: () => _undefined$2,
	unicodeEmail: () => unicodeEmail,
	uppercase: () => uppercase,
	uuid: () => uuid$1,
	uuid4: () => uuid4,
	uuid6: () => uuid6,
	uuid7: () => uuid7,
	xid: () => xid$1
});
function emoji$1() {
	return new RegExp(_emoji$1, "u");
}
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
function fixedBase64(bodyLength, padding) {
	return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
function fixedBase64url(length) {
	return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
var cuid$1, cuid2$1, ulid$1, xid$1, ksuid$1, nanoid$1, duration$1, extendedDuration, guid$1, uuid$1, uuid4, uuid6, uuid7, email$1, html5Email, rfc5322Email, unicodeEmail, idnEmail, browserEmail, _emoji$1, ipv4$1, ipv6$1, mac$1, cidrv4$1, cidrv6$1, base64$1, base64url$1, hostname$1, domain, httpProtocol, e164$1, dateSource, date$3, string$2, bigint$2, integer, number$2, boolean$2, _null$2, _undefined$2, lowercase, uppercase, hex$1, md5_hex, md5_base64, md5_base64url, sha1_hex, sha1_base64, sha1_base64url, sha256_hex, sha256_base64, sha256_base64url, sha384_hex, sha384_base64, sha384_base64url, sha512_hex, sha512_base64, sha512_base64url;
var init_regexes = __esmMin((() => {
	init_util();
	cuid$1 = /^[cC][^\s-]{8,}$/;
	cuid2$1 = /^[0-9a-z]+$/;
	ulid$1 = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
	xid$1 = /^[0-9a-vA-V]{20}$/;
	ksuid$1 = /^[A-Za-z0-9]{27}$/;
	nanoid$1 = /^[a-zA-Z0-9_-]{21}$/;
	duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
	extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
	guid$1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
	uuid$1 = (version) => {
		if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
		return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
	};
	uuid4 = /* @__PURE__ */ uuid$1(4);
	uuid6 = /* @__PURE__ */ uuid$1(6);
	uuid7 = /* @__PURE__ */ uuid$1(7);
	email$1 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
	html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
	idnEmail = unicodeEmail;
	browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	_emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
	ipv4$1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
	ipv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
	mac$1 = (delimiter) => {
		const escapedDelim = escapeRegex(delimiter !== null && delimiter !== void 0 ? delimiter : ":");
		return new RegExp(`^(?:[0-9A-F]{2}${escapedDelim}){5}[0-9A-F]{2}$|^(?:[0-9a-f]{2}${escapedDelim}){5}[0-9a-f]{2}$`);
	};
	cidrv4$1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
	cidrv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
	base64$1 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
	base64url$1 = /^[A-Za-z0-9_-]*$/;
	hostname$1 = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
	domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
	httpProtocol = /^https?$/;
	e164$1 = /^\+[1-9]\d{6,14}$/;
	dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
	date$3 = /* @__PURE__ */ new RegExp(`^${dateSource}$`);
	string$2 = (params) => {
		var _params$minimum, _params$maximum;
		const regex = params ? `[\\s\\S]{${(_params$minimum = params === null || params === void 0 ? void 0 : params.minimum) !== null && _params$minimum !== void 0 ? _params$minimum : 0},${(_params$maximum = params === null || params === void 0 ? void 0 : params.maximum) !== null && _params$maximum !== void 0 ? _params$maximum : ""}}` : `[\\s\\S]*`;
		return new RegExp(`^${regex}$`);
	};
	bigint$2 = /^-?\d+n?$/;
	integer = /^-?\d+$/;
	number$2 = /^-?\d+(?:\.\d+)?$/;
	boolean$2 = /^(?:true|false)$/i;
	_null$2 = /^null$/i;
	_undefined$2 = /^undefined$/i;
	lowercase = /^[^A-Z]*$/;
	uppercase = /^[^a-z]*$/;
	hex$1 = /^[0-9a-fA-F]*$/;
	md5_hex = /^[0-9a-fA-F]{32}$/;
	md5_base64 = /* @__PURE__ */ fixedBase64(22, "==");
	md5_base64url = /* @__PURE__ */ fixedBase64url(22);
	sha1_hex = /^[0-9a-fA-F]{40}$/;
	sha1_base64 = /* @__PURE__ */ fixedBase64(27, "=");
	sha1_base64url = /* @__PURE__ */ fixedBase64url(27);
	sha256_hex = /^[0-9a-fA-F]{64}$/;
	sha256_base64 = /* @__PURE__ */ fixedBase64(43, "=");
	sha256_base64url = /* @__PURE__ */ fixedBase64url(43);
	sha384_hex = /^[0-9a-fA-F]{96}$/;
	sha384_base64 = /* @__PURE__ */ fixedBase64(64, "");
	sha384_base64url = /* @__PURE__ */ fixedBase64url(64);
	sha512_hex = /^[0-9a-fA-F]{128}$/;
	sha512_base64 = /* @__PURE__ */ fixedBase64(86, "==");
	sha512_base64url = /* @__PURE__ */ fixedBase64url(86);
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/checks.js
function handleCheckPropertyResult(result, payload, property) {
	if (result.issues.length) payload.issues.push(...prefixIssues(property, result.issues));
}
var $ZodCheck, numericOriginMap, $ZodCheckLessThan, $ZodCheckGreaterThan, $ZodCheckMultipleOf, $ZodCheckNumberFormat, $ZodCheckBigIntFormat, $ZodCheckMaxSize, $ZodCheckMinSize, $ZodCheckSizeEquals, $ZodCheckMaxLength, $ZodCheckMinLength, $ZodCheckLengthEquals, $ZodCheckStringFormat, $ZodCheckRegex, $ZodCheckLowerCase, $ZodCheckUpperCase, $ZodCheckIncludes, $ZodCheckStartsWith, $ZodCheckEndsWith, $ZodCheckProperty, $ZodCheckMimeType, $ZodCheckOverwrite;
var init_checks$1 = __esmMin((() => {
	init_core$1();
	init_regexes();
	init_util();
	init_objectSpread2();
	$ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
		var _inst$_zod, _a$onattach;
		var _a;
		(_inst$_zod = inst._zod) !== null && _inst$_zod !== void 0 || (inst._zod = {});
		inst._zod.def = def;
		(_a$onattach = (_a = inst._zod).onattach) !== null && _a$onattach !== void 0 || (_a.onattach = []);
	});
	numericOriginMap = {
		number: "number",
		bigint: "bigint",
		object: "date"
	};
	$ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
		$ZodCheck.init(inst, def);
		const origin = numericOriginMap[typeof def.value];
		inst._zod.onattach.push((inst) => {
			var _ref;
			const bag = inst._zod.bag;
			const curr = (_ref = def.inclusive ? bag.maximum : bag.exclusiveMaximum) !== null && _ref !== void 0 ? _ref : Number.POSITIVE_INFINITY;
			if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
			else bag.exclusiveMaximum = def.value;
		});
		inst._zod.check = (payload) => {
			if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
			payload.issues.push({
				origin,
				code: "too_big",
				maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
				input: payload.value,
				inclusive: def.inclusive,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
		$ZodCheck.init(inst, def);
		const origin = numericOriginMap[typeof def.value];
		inst._zod.onattach.push((inst) => {
			var _ref2;
			const bag = inst._zod.bag;
			const curr = (_ref2 = def.inclusive ? bag.minimum : bag.exclusiveMinimum) !== null && _ref2 !== void 0 ? _ref2 : Number.NEGATIVE_INFINITY;
			if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
			else bag.exclusiveMinimum = def.value;
		});
		inst._zod.check = (payload) => {
			if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
			payload.issues.push({
				origin,
				code: "too_small",
				minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
				input: payload.value,
				inclusive: def.inclusive,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
		$ZodCheck.init(inst, def);
		inst._zod.onattach.push((inst) => {
			var _a$multipleOf;
			var _a;
			(_a$multipleOf = (_a = inst._zod.bag).multipleOf) !== null && _a$multipleOf !== void 0 || (_a.multipleOf = def.value);
		});
		inst._zod.check = (payload) => {
			if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
			if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
			payload.issues.push({
				origin: typeof payload.value,
				code: "not_multiple_of",
				divisor: def.value,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
		var _def$format;
		$ZodCheck.init(inst, def);
		def.format = def.format || "float64";
		const isInt = (_def$format = def.format) === null || _def$format === void 0 ? void 0 : _def$format.includes("int");
		const origin = isInt ? "int" : "number";
		const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.format = def.format;
			bag.minimum = minimum;
			bag.maximum = maximum;
			if (isInt) bag.pattern = integer;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (isInt) {
				if (!Number.isInteger(input)) {
					payload.issues.push({
						expected: origin,
						format: def.format,
						code: "invalid_type",
						continue: false,
						input,
						inst
					});
					return;
				}
				if (!Number.isSafeInteger(input)) {
					if (input > 0) payload.issues.push({
						input,
						code: "too_big",
						maximum: Number.MAX_SAFE_INTEGER,
						note: "Integers must be within the safe integer range.",
						inst,
						origin,
						inclusive: true,
						continue: !def.abort
					});
					else payload.issues.push({
						input,
						code: "too_small",
						minimum: Number.MIN_SAFE_INTEGER,
						note: "Integers must be within the safe integer range.",
						inst,
						origin,
						inclusive: true,
						continue: !def.abort
					});
					return;
				}
			}
			if (input < minimum) payload.issues.push({
				origin: "number",
				input,
				code: "too_small",
				minimum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
			if (input > maximum) payload.issues.push({
				origin: "number",
				input,
				code: "too_big",
				maximum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckBigIntFormat = /* @__PURE__ */ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
		$ZodCheck.init(inst, def);
		const [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.format = def.format;
			bag.minimum = minimum;
			bag.maximum = maximum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input < minimum) payload.issues.push({
				origin: "bigint",
				input,
				code: "too_small",
				minimum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
			if (input > maximum) payload.issues.push({
				origin: "bigint",
				input,
				code: "too_big",
				maximum,
				inclusive: true,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckMaxSize = /* @__PURE__ */ $constructor("$ZodCheckMaxSize", (inst, def) => {
		var _a$when;
		var _a;
		$ZodCheck.init(inst, def);
		(_a$when = (_a = inst._zod.def).when) !== null && _a$when !== void 0 || (_a.when = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.size !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			var _inst$_zod$bag$maximu;
			const curr = (_inst$_zod$bag$maximu = inst._zod.bag.maximum) !== null && _inst$_zod$bag$maximu !== void 0 ? _inst$_zod$bag$maximu : Number.POSITIVE_INFINITY;
			if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input.size <= def.maximum) return;
			payload.issues.push({
				origin: getSizableOrigin(input),
				code: "too_big",
				maximum: def.maximum,
				inclusive: true,
				input,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckMinSize = /* @__PURE__ */ $constructor("$ZodCheckMinSize", (inst, def) => {
		var _a$when2;
		var _a;
		$ZodCheck.init(inst, def);
		(_a$when2 = (_a = inst._zod.def).when) !== null && _a$when2 !== void 0 || (_a.when = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.size !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			var _inst$_zod$bag$minimu;
			const curr = (_inst$_zod$bag$minimu = inst._zod.bag.minimum) !== null && _inst$_zod$bag$minimu !== void 0 ? _inst$_zod$bag$minimu : Number.NEGATIVE_INFINITY;
			if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input.size >= def.minimum) return;
			payload.issues.push({
				origin: getSizableOrigin(input),
				code: "too_small",
				minimum: def.minimum,
				inclusive: true,
				input,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckSizeEquals = /* @__PURE__ */ $constructor("$ZodCheckSizeEquals", (inst, def) => {
		var _a$when3;
		var _a;
		$ZodCheck.init(inst, def);
		(_a$when3 = (_a = inst._zod.def).when) !== null && _a$when3 !== void 0 || (_a.when = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.size !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.minimum = def.size;
			bag.maximum = def.size;
			bag.size = def.size;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			const size = input.size;
			if (size === def.size) return;
			const tooBig = size > def.size;
			payload.issues.push(_objectSpread2(_objectSpread2({ origin: getSizableOrigin(input) }, tooBig ? {
				code: "too_big",
				maximum: def.size
			} : {
				code: "too_small",
				minimum: def.size
			}), {}, {
				inclusive: true,
				exact: true,
				input: payload.value,
				inst,
				continue: !def.abort
			}));
		};
	});
	$ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
		var _a$when4;
		var _a;
		$ZodCheck.init(inst, def);
		(_a$when4 = (_a = inst._zod.def).when) !== null && _a$when4 !== void 0 || (_a.when = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.length !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			var _inst$_zod$bag$maximu2;
			const curr = (_inst$_zod$bag$maximu2 = inst._zod.bag.maximum) !== null && _inst$_zod$bag$maximu2 !== void 0 ? _inst$_zod$bag$maximu2 : Number.POSITIVE_INFINITY;
			if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input.length <= def.maximum) return;
			const origin = getLengthableOrigin(input);
			payload.issues.push({
				origin,
				code: "too_big",
				maximum: def.maximum,
				inclusive: true,
				input,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
		var _a$when5;
		var _a;
		$ZodCheck.init(inst, def);
		(_a$when5 = (_a = inst._zod.def).when) !== null && _a$when5 !== void 0 || (_a.when = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.length !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			var _inst$_zod$bag$minimu2;
			const curr = (_inst$_zod$bag$minimu2 = inst._zod.bag.minimum) !== null && _inst$_zod$bag$minimu2 !== void 0 ? _inst$_zod$bag$minimu2 : Number.NEGATIVE_INFINITY;
			if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			if (input.length >= def.minimum) return;
			const origin = getLengthableOrigin(input);
			payload.issues.push({
				origin,
				code: "too_small",
				minimum: def.minimum,
				inclusive: true,
				input,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
		var _a$when6;
		var _a;
		$ZodCheck.init(inst, def);
		(_a$when6 = (_a = inst._zod.def).when) !== null && _a$when6 !== void 0 || (_a.when = (payload) => {
			const val = payload.value;
			return !nullish$1(val) && val.length !== void 0;
		});
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.minimum = def.length;
			bag.maximum = def.length;
			bag.length = def.length;
		});
		inst._zod.check = (payload) => {
			const input = payload.value;
			const length = input.length;
			if (length === def.length) return;
			const origin = getLengthableOrigin(input);
			const tooBig = length > def.length;
			payload.issues.push(_objectSpread2(_objectSpread2({ origin }, tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			}), {}, {
				inclusive: true,
				exact: true,
				input: payload.value,
				inst,
				continue: !def.abort
			}));
		};
	});
	$ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
		var _a$check, _b$check;
		var _a, _b;
		$ZodCheck.init(inst, def);
		inst._zod.onattach.push((inst) => {
			const bag = inst._zod.bag;
			bag.format = def.format;
			if (def.pattern) {
				var _bag$patterns;
				(_bag$patterns = bag.patterns) !== null && _bag$patterns !== void 0 || (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(def.pattern);
			}
		});
		if (def.pattern) (_a$check = (_a = inst._zod).check) !== null && _a$check !== void 0 || (_a.check = (payload) => {
			def.pattern.lastIndex = 0;
			if (def.pattern.test(payload.value)) return;
			payload.issues.push(_objectSpread2(_objectSpread2({
				origin: "string",
				code: "invalid_format",
				format: def.format,
				input: payload.value
			}, def.pattern ? { pattern: def.pattern.toString() } : {}), {}, {
				inst,
				continue: !def.abort
			}));
		});
		else (_b$check = (_b = inst._zod).check) !== null && _b$check !== void 0 || (_b.check = () => {});
	});
	$ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
		$ZodCheckStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			def.pattern.lastIndex = 0;
			if (def.pattern.test(payload.value)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "regex",
				input: payload.value,
				pattern: def.pattern.toString(),
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
		var _def$pattern;
		(_def$pattern = def.pattern) !== null && _def$pattern !== void 0 || (def.pattern = lowercase);
		$ZodCheckStringFormat.init(inst, def);
	});
	$ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
		var _def$pattern2;
		(_def$pattern2 = def.pattern) !== null && _def$pattern2 !== void 0 || (def.pattern = uppercase);
		$ZodCheckStringFormat.init(inst, def);
	});
	$ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
		$ZodCheck.init(inst, def);
		const escapedRegex = escapeRegex(def.includes);
		const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
		def.pattern = pattern;
		inst._zod.onattach.push((inst) => {
			var _bag$patterns2;
			const bag = inst._zod.bag;
			(_bag$patterns2 = bag.patterns) !== null && _bag$patterns2 !== void 0 || (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(pattern);
		});
		inst._zod.check = (payload) => {
			if (payload.value.includes(def.includes, def.position)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "includes",
				includes: def.includes,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
		var _def$pattern3;
		$ZodCheck.init(inst, def);
		const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
		(_def$pattern3 = def.pattern) !== null && _def$pattern3 !== void 0 || (def.pattern = pattern);
		inst._zod.onattach.push((inst) => {
			var _bag$patterns3;
			const bag = inst._zod.bag;
			(_bag$patterns3 = bag.patterns) !== null && _bag$patterns3 !== void 0 || (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(pattern);
		});
		inst._zod.check = (payload) => {
			if (payload.value.startsWith(def.prefix)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "starts_with",
				prefix: def.prefix,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
		var _def$pattern4;
		$ZodCheck.init(inst, def);
		const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
		(_def$pattern4 = def.pattern) !== null && _def$pattern4 !== void 0 || (def.pattern = pattern);
		inst._zod.onattach.push((inst) => {
			var _bag$patterns4;
			const bag = inst._zod.bag;
			(_bag$patterns4 = bag.patterns) !== null && _bag$patterns4 !== void 0 || (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(pattern);
		});
		inst._zod.check = (payload) => {
			if (payload.value.endsWith(def.suffix)) return;
			payload.issues.push({
				origin: "string",
				code: "invalid_format",
				format: "ends_with",
				suffix: def.suffix,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckProperty = /* @__PURE__ */ $constructor("$ZodCheckProperty", (inst, def) => {
		$ZodCheck.init(inst, def);
		inst._zod.check = (payload) => {
			const result = def.schema._zod.run({
				value: payload.value[def.property],
				issues: []
			}, {});
			if (result instanceof Promise) return result.then((result) => handleCheckPropertyResult(result, payload, def.property));
			handleCheckPropertyResult(result, payload, def.property);
		};
	});
	$ZodCheckMimeType = /* @__PURE__ */ $constructor("$ZodCheckMimeType", (inst, def) => {
		$ZodCheck.init(inst, def);
		const mimeSet = new Set(def.mime);
		inst._zod.onattach.push((inst) => {
			inst._zod.bag.mime = def.mime;
		});
		inst._zod.check = (payload) => {
			if (mimeSet.has(payload.value.type)) return;
			payload.issues.push({
				code: "invalid_value",
				values: def.mime,
				input: payload.value.type,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
		$ZodCheck.init(inst, def);
		inst._zod.check = (payload) => {
			payload.value = def.tx(payload.value);
		};
	});
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/doc.js
var Doc;
var init_doc = __esmMin((() => {
	Doc = class {
		constructor(args = []) {
			this.content = [];
			this.indent = 0;
			if (this) this.args = args;
		}
		indented(fn) {
			this.indent += 1;
			fn(this);
			this.indent -= 1;
		}
		write(arg) {
			if (typeof arg === "function") {
				arg(this, { execution: "sync" });
				arg(this, { execution: "async" });
				return;
			}
			const lines = arg.split("\n").filter((x) => x);
			const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
			const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
			for (const line of dedented) this.content.push(line);
		}
		compile() {
			var _this, _this$content, _this2;
			const F = Function;
			const args = (_this = this) === null || _this === void 0 ? void 0 : _this.args;
			const lines = [...((_this$content = (_this2 = this) === null || _this2 === void 0 ? void 0 : _this2.content) !== null && _this$content !== void 0 ? _this$content : [``]).map((x) => `  ${x}`)];
			return new F(...args, lines.join("\n"));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/versions.js
var version;
var init_versions = __esmMin((() => {
	version = {
		major: 4,
		minor: 3,
		patch: 6
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/schemas.js
function setParseAdapter$1(parseAdapterFn) {
	__parseAdapterFn = parseAdapterFn;
}
function isValidBase64(data) {
	if (data === "") return true;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch (_unused3) {
		return false;
	}
}
function isValidBase64URL(data) {
	if (!base64url$1.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && (parsedHeader === null || parsedHeader === void 0 ? void 0 : parsedHeader.typ) !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch (_unused4) {
		return false;
	}
}
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
function handlePropertyResult(result, final, key, input, isOptionalOut) {
	if (result.issues.length) {
		if (isOptionalOut && !(key in input)) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (result.value === void 0) {
		if (key in input) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) {
		var _def$shape;
		if (!((_def$shape = def.shape) === null || _def$shape === void 0 || (_def$shape = _def$shape[k]) === null || _def$shape === void 0 || (_def$shape = _def$shape._zod) === null || _def$shape === void 0 || (_def$shape = _def$shape.traits) === null || _def$shape === void 0 ? void 0 : _def$shape.has("$ZodType"))) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	}
	const okeys = optionalKeys(def.shape);
	return _objectSpread2(_objectSpread2({}, def), {}, {
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	});
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
function handleExclusiveUnionResults(results, final, inst, ctx) {
	const successes = results.filter((r) => r.issues.length === 0);
	if (successes.length === 1) {
		final.value = successes[0].value;
		return final;
	}
	if (successes.length === 0) final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	else final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: [],
		inclusive: false
	});
	return final;
}
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = _objectSpread2(_objectSpread2({}, a), b);
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		var _unrecIssue;
		(_unrecIssue = unrecIssue) !== null && _unrecIssue !== void 0 || (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push(_objectSpread2(_objectSpread2({}, unrecIssue), {}, { keys: bothKeys }));
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
function handleTupleResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
	if (keyResult.issues.length) if (propertyKeyTypes.has(typeof key)) final.issues.push(...prefixIssues(key, keyResult.issues));
	else final.issues.push({
		code: "invalid_key",
		origin: "map",
		input,
		inst,
		issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
	});
	if (valueResult.issues.length) if (propertyKeyTypes.has(typeof key)) final.issues.push(...prefixIssues(key, valueResult.issues));
	else final.issues.push({
		origin: "map",
		code: "invalid_element",
		input,
		inst,
		key,
		issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config()))
	});
	final.value.set(keyResult.value, valueResult.value);
}
function handleSetResult(result, final) {
	if (result.issues.length) final.issues.push(...result.issues);
	final.value.add(result.value);
}
function handleOptionalResult(result, input) {
	if (result.issues.length && input === void 0) return {
		issues: [],
		value: void 0
	};
	return result;
}
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
function handleCodecAResult(result, def, ctx) {
	if (result.issues.length) {
		result.aborted = true;
		return result;
	}
	if ((ctx.direction || "forward") === "forward") {
		const transformed = def.transform(result.value, result);
		if (transformed instanceof Promise) return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
		return handleCodecTxResult(result, transformed, def.out, ctx);
	} else {
		const transformed = def.reverseTransform(result.value, result);
		if (transformed instanceof Promise) return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
		return handleCodecTxResult(result, transformed, def.in, ctx);
	}
}
function handleCodecTxResult(left, value, nextSchema, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return nextSchema._zod.run({
		value,
		issues: left.issues
	}, ctx);
}
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		var _inst$_zod$def$path;
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...(_inst$_zod$def$path = inst._zod.def.path) !== null && _inst$_zod$def$path !== void 0 ? _inst$_zod$def$path : []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
var __parseAdapterFn, $ZodType, $ZodString, $ZodStringFormat, $ZodGUID, $ZodUUID, $ZodEmail, $ZodURL, $ZodEmoji, $ZodNanoID, $ZodCUID, $ZodCUID2, $ZodULID, $ZodXID, $ZodKSUID, $ZodISODateTime, $ZodISODate, $ZodISOTime, $ZodISODuration, $ZodIPv4, $ZodIPv6, $ZodMAC, $ZodCIDRv4, $ZodCIDRv6, $ZodBase64, $ZodBase64URL, $ZodE164, $ZodJWT, $ZodCustomStringFormat, $ZodNumber, $ZodNumberFormat, $ZodBoolean, $ZodBigInt, $ZodBigIntFormat, $ZodSymbol, $ZodUndefined, $ZodNull, $ZodAny, $ZodUnknown, $ZodNever, $ZodVoid, $ZodDate, $ZodArray, $ZodObject, $ZodObjectJIT, $ZodUnion, $ZodXor, $ZodDiscriminatedUnion, $ZodIntersection, $ZodTuple, $ZodRecord, $ZodMap, $ZodSet, $ZodEnum, $ZodLiteral, $ZodFile, $ZodTransform, $ZodOptional, $ZodExactOptional, $ZodNullable, $ZodDefault, $ZodPrefault, $ZodNonOptional, $ZodSuccess, $ZodCatch, $ZodNaN, $ZodPipe, $ZodCodec, $ZodReadonly, $ZodTemplateLiteral, $ZodFunction, $ZodPromise, $ZodLazy, $ZodCustom;
var init_schemas$1 = __esmMin((() => {
	init_checks$1();
	init_core$1();
	init_doc();
	init_parse$1();
	init_regexes();
	init_util();
	init_versions();
	init_asyncToGenerator();
	init_objectSpread2();
	$ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
		var _inst, _inst$_zod$def$checks;
		var _a;
		(_inst = inst) !== null && _inst !== void 0 || (inst = {});
		inst._zod.def = def;
		inst._zod.bag = inst._zod.bag || {};
		inst._zod.version = version;
		const checks = [...(_inst$_zod$def$checks = inst._zod.def.checks) !== null && _inst$_zod$def$checks !== void 0 ? _inst$_zod$def$checks : []];
		if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
		for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
		if (checks.length === 0) {
			var _a$deferred, _inst$_zod$deferred;
			(_a$deferred = (_a = inst._zod).deferred) !== null && _a$deferred !== void 0 || (_a.deferred = []);
			(_inst$_zod$deferred = inst._zod.deferred) === null || _inst$_zod$deferred === void 0 || _inst$_zod$deferred.push(() => {
				inst._zod.run = __parseAdapterFn ? __parseAdapterFn(inst, inst._zod.parse) : inst._zod.parse;
			});
		} else {
			const runChecks = (payload, checks, ctx) => {
				let isAborted = aborted(payload);
				let asyncResult;
				for (const ch of checks) {
					if (ch._zod.def.when) {
						if (explicitlyAborted(payload)) continue;
						if (!ch._zod.def.when(payload)) continue;
					} else if (isAborted) continue;
					const currLen = payload.issues.length;
					const _ = ch._zod.check(payload);
					if (_ instanceof Promise && (ctx === null || ctx === void 0 ? void 0 : ctx.async) === false) throw new $ZodAsyncError();
					if (asyncResult || _ instanceof Promise) {
						var _asyncResult;
						asyncResult = ((_asyncResult = asyncResult) !== null && _asyncResult !== void 0 ? _asyncResult : Promise.resolve()).then(_asyncToGenerator(function* () {
							yield _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}));
					} else {
						if (payload.issues.length === currLen) continue;
						if (!isAborted) isAborted = aborted(payload, currLen);
					}
				}
				if (asyncResult) return asyncResult.then(() => {
					return payload;
				});
				return payload;
			};
			const handleCanaryResult = (canary, payload, ctx) => {
				if (aborted(canary)) {
					canary.aborted = true;
					return canary;
				}
				const checkResult = runChecks(payload, checks, ctx);
				if (checkResult instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
				}
				return inst._zod.parse(checkResult, ctx);
			};
			const __run = (payload, ctx) => {
				if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
				if (ctx.direction === "backward") {
					const canary = inst._zod.parse({
						value: payload.value,
						issues: []
					}, _objectSpread2(_objectSpread2({}, ctx), {}, { skipChecks: true }));
					if (canary instanceof Promise) return canary.then((canary) => {
						return handleCanaryResult(canary, payload, ctx);
					});
					return handleCanaryResult(canary, payload, ctx);
				}
				const result = inst._zod.parse(payload, ctx);
				if (result instanceof Promise) {
					if (ctx.async === false) throw new $ZodAsyncError();
					return result.then((result) => runChecks(result, checks, ctx));
				}
				return runChecks(result, checks, ctx);
			};
			inst._zod.run = __parseAdapterFn ? __parseAdapterFn(inst, __run) : __run;
		}
		defineLazy(inst, "~standard", () => ({
			validate: (value) => {
				try {
					var _r$error;
					const r = safeParse$1(inst, value);
					return r.success ? { value: r.data } : { issues: (_r$error = r.error) === null || _r$error === void 0 ? void 0 : _r$error.issues };
				} catch (_) {
					return safeParseAsync$1(inst, value).then((r) => {
						var _r$error2;
						return r.success ? { value: r.data } : { issues: (_r$error2 = r.error) === null || _r$error2 === void 0 ? void 0 : _r$error2.issues };
					});
				}
			},
			vendor: "zod",
			version: 1
		}));
	});
	$ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
		var _pop, _inst$_zod$bag$patter, _inst$_zod$bag;
		$ZodType.init(inst, def);
		inst._zod.pattern = (_pop = [...(_inst$_zod$bag$patter = inst === null || inst === void 0 || (_inst$_zod$bag = inst._zod.bag) === null || _inst$_zod$bag === void 0 ? void 0 : _inst$_zod$bag.patterns) !== null && _inst$_zod$bag$patter !== void 0 ? _inst$_zod$bag$patter : []].pop()) !== null && _pop !== void 0 ? _pop : string$2(inst._zod.bag);
		inst._zod.parse = (payload, _) => {
			if (def.coerce) try {
				payload.value = String(payload.value);
			} catch (_) {}
			if (typeof payload.value === "string") return payload;
			payload.issues.push({
				expected: "string",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	$ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
		$ZodCheckStringFormat.init(inst, def);
		$ZodString.init(inst, def);
	});
	$ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
		var _def$pattern;
		(_def$pattern = def.pattern) !== null && _def$pattern !== void 0 || (def.pattern = guid$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
		var _def$pattern3;
		if (def.version) {
			var _def$pattern2;
			const v = {
				v1: 1,
				v2: 2,
				v3: 3,
				v4: 4,
				v5: 5,
				v6: 6,
				v7: 7,
				v8: 8
			}[def.version];
			if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
			(_def$pattern2 = def.pattern) !== null && _def$pattern2 !== void 0 || (def.pattern = uuid$1(v));
		} else (_def$pattern3 = def.pattern) !== null && _def$pattern3 !== void 0 || (def.pattern = uuid$1());
		$ZodStringFormat.init(inst, def);
	});
	$ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
		var _def$pattern4;
		(_def$pattern4 = def.pattern) !== null && _def$pattern4 !== void 0 || (def.pattern = email$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			try {
				var _def$protocol;
				const trimmed = payload.value.trim();
				if (!def.normalize && ((_def$protocol = def.protocol) === null || _def$protocol === void 0 ? void 0 : _def$protocol.source) === httpProtocol.source) {
					if (!/^https?:\/\//i.test(trimmed)) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid URL format",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
				}
				const url = new URL(trimmed);
				if (def.hostname) {
					def.hostname.lastIndex = 0;
					if (!def.hostname.test(url.hostname)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid hostname",
						pattern: def.hostname.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
				if (def.protocol) {
					def.protocol.lastIndex = 0;
					if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid protocol",
						pattern: def.protocol.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
				if (def.normalize) payload.value = url.href;
				else payload.value = trimmed;
				return;
			} catch (_) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
		};
	});
	$ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
		var _def$pattern5;
		(_def$pattern5 = def.pattern) !== null && _def$pattern5 !== void 0 || (def.pattern = emoji$1());
		$ZodStringFormat.init(inst, def);
	});
	$ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
		var _def$pattern6;
		(_def$pattern6 = def.pattern) !== null && _def$pattern6 !== void 0 || (def.pattern = nanoid$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
		var _def$pattern7;
		(_def$pattern7 = def.pattern) !== null && _def$pattern7 !== void 0 || (def.pattern = cuid$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
		var _def$pattern8;
		(_def$pattern8 = def.pattern) !== null && _def$pattern8 !== void 0 || (def.pattern = cuid2$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
		var _def$pattern9;
		(_def$pattern9 = def.pattern) !== null && _def$pattern9 !== void 0 || (def.pattern = ulid$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
		var _def$pattern10;
		(_def$pattern10 = def.pattern) !== null && _def$pattern10 !== void 0 || (def.pattern = xid$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
		var _def$pattern11;
		(_def$pattern11 = def.pattern) !== null && _def$pattern11 !== void 0 || (def.pattern = ksuid$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
		var _def$pattern12;
		(_def$pattern12 = def.pattern) !== null && _def$pattern12 !== void 0 || (def.pattern = datetime$1(def));
		$ZodStringFormat.init(inst, def);
	});
	$ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
		var _def$pattern13;
		(_def$pattern13 = def.pattern) !== null && _def$pattern13 !== void 0 || (def.pattern = date$3);
		$ZodStringFormat.init(inst, def);
	});
	$ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
		var _def$pattern14;
		(_def$pattern14 = def.pattern) !== null && _def$pattern14 !== void 0 || (def.pattern = time$1(def));
		$ZodStringFormat.init(inst, def);
	});
	$ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
		var _def$pattern15;
		(_def$pattern15 = def.pattern) !== null && _def$pattern15 !== void 0 || (def.pattern = duration$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
		var _def$pattern16;
		(_def$pattern16 = def.pattern) !== null && _def$pattern16 !== void 0 || (def.pattern = ipv4$1);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.format = `ipv4`;
	});
	$ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
		var _def$pattern17;
		(_def$pattern17 = def.pattern) !== null && _def$pattern17 !== void 0 || (def.pattern = ipv6$1);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.format = `ipv6`;
		inst._zod.check = (payload) => {
			try {
				new URL(`http://[${payload.value}]`);
			} catch (_unused) {
				payload.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
		};
	});
	$ZodMAC = /* @__PURE__ */ $constructor("$ZodMAC", (inst, def) => {
		var _def$pattern18;
		(_def$pattern18 = def.pattern) !== null && _def$pattern18 !== void 0 || (def.pattern = mac$1(def.delimiter));
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.format = `mac`;
	});
	$ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
		var _def$pattern19;
		(_def$pattern19 = def.pattern) !== null && _def$pattern19 !== void 0 || (def.pattern = cidrv4$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
		var _def$pattern20;
		(_def$pattern20 = def.pattern) !== null && _def$pattern20 !== void 0 || (def.pattern = cidrv6$1);
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			const parts = payload.value.split("/");
			try {
				if (parts.length !== 2) throw new Error();
				const [address, prefix] = parts;
				if (!prefix) throw new Error();
				const prefixNum = Number(prefix);
				if (`${prefixNum}` !== prefix) throw new Error();
				if (prefixNum < 0 || prefixNum > 128) throw new Error();
				new URL(`http://[${address}]`);
			} catch (_unused2) {
				payload.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
		};
	});
	$ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
		var _def$pattern21;
		(_def$pattern21 = def.pattern) !== null && _def$pattern21 !== void 0 || (def.pattern = base64$1);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.contentEncoding = "base64";
		inst._zod.check = (payload) => {
			if (isValidBase64(payload.value)) return;
			payload.issues.push({
				code: "invalid_format",
				format: "base64",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
		var _def$pattern22;
		(_def$pattern22 = def.pattern) !== null && _def$pattern22 !== void 0 || (def.pattern = base64url$1);
		$ZodStringFormat.init(inst, def);
		inst._zod.bag.contentEncoding = "base64url";
		inst._zod.check = (payload) => {
			if (isValidBase64URL(payload.value)) return;
			payload.issues.push({
				code: "invalid_format",
				format: "base64url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
		var _def$pattern23;
		(_def$pattern23 = def.pattern) !== null && _def$pattern23 !== void 0 || (def.pattern = e164$1);
		$ZodStringFormat.init(inst, def);
	});
	$ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			if (isValidJWT(payload.value, def.alg)) return;
			payload.issues.push({
				code: "invalid_format",
				format: "jwt",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodCustomStringFormat = /* @__PURE__ */ $constructor("$ZodCustomStringFormat", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		inst._zod.check = (payload) => {
			if (def.fn(payload.value)) return;
			payload.issues.push({
				code: "invalid_format",
				format: def.format,
				input: payload.value,
				inst,
				continue: !def.abort
			});
		};
	});
	$ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
		var _inst$_zod$bag$patter2;
		$ZodType.init(inst, def);
		inst._zod.pattern = (_inst$_zod$bag$patter2 = inst._zod.bag.pattern) !== null && _inst$_zod$bag$patter2 !== void 0 ? _inst$_zod$bag$patter2 : number$2;
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = Number(payload.value);
			} catch (_) {}
			const input = payload.value;
			if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
			const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
			payload.issues.push(_objectSpread2({
				expected: "number",
				code: "invalid_type",
				input,
				inst
			}, received ? { received } : {}));
			return payload;
		};
	});
	$ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
		$ZodCheckNumberFormat.init(inst, def);
		$ZodNumber.init(inst, def);
	});
	$ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = boolean$2;
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = Boolean(payload.value);
			} catch (_) {}
			const input = payload.value;
			if (typeof input === "boolean") return payload;
			payload.issues.push({
				expected: "boolean",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	$ZodBigInt = /* @__PURE__ */ $constructor("$ZodBigInt", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = bigint$2;
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = BigInt(payload.value);
			} catch (_) {}
			if (typeof payload.value === "bigint") return payload;
			payload.issues.push({
				expected: "bigint",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	$ZodBigIntFormat = /* @__PURE__ */ $constructor("$ZodBigIntFormat", (inst, def) => {
		$ZodCheckBigIntFormat.init(inst, def);
		$ZodBigInt.init(inst, def);
	});
	$ZodSymbol = /* @__PURE__ */ $constructor("$ZodSymbol", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (typeof input === "symbol") return payload;
			payload.issues.push({
				expected: "symbol",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	$ZodUndefined = /* @__PURE__ */ $constructor("$ZodUndefined", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = _undefined$2;
		inst._zod.values = new Set([void 0]);
		inst._zod.optin = "optional";
		inst._zod.optout = "optional";
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (typeof input === "undefined") return payload;
			payload.issues.push({
				expected: "undefined",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	$ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.pattern = _null$2;
		inst._zod.values = new Set([null]);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (input === null) return payload;
			payload.issues.push({
				expected: "null",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	$ZodAny = /* @__PURE__ */ $constructor("$ZodAny", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload) => payload;
	});
	$ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload) => payload;
	});
	$ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			payload.issues.push({
				expected: "never",
				code: "invalid_type",
				input: payload.value,
				inst
			});
			return payload;
		};
	});
	$ZodVoid = /* @__PURE__ */ $constructor("$ZodVoid", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (typeof input === "undefined") return payload;
			payload.issues.push({
				expected: "void",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	$ZodDate = /* @__PURE__ */ $constructor("$ZodDate", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			if (def.coerce) try {
				payload.value = new Date(payload.value);
			} catch (_err) {}
			const input = payload.value;
			const isDate = input instanceof Date;
			if (isDate && !Number.isNaN(input.getTime())) return payload;
			payload.issues.push(_objectSpread2(_objectSpread2({
				expected: "date",
				code: "invalid_type",
				input
			}, isDate ? { received: "Invalid Date" } : {}), {}, { inst }));
			return payload;
		};
	});
	$ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!Array.isArray(input)) {
				payload.issues.push({
					expected: "array",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = Array(input.length);
			const proms = [];
			for (let i = 0; i < input.length; i++) {
				const item = input[i];
				const result = def.element._zod.run({
					value: item,
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
				else handleArrayResult(result, payload, i);
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	$ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
		$ZodType.init(inst, def);
		const desc = Object.getOwnPropertyDescriptor(def, "shape");
		if (!(desc === null || desc === void 0 ? void 0 : desc.get)) {
			const sh = def.shape;
			Object.defineProperty(def, "shape", { get: () => {
				const newSh = _objectSpread2({}, sh);
				Object.defineProperty(def, "shape", { value: newSh });
				return newSh;
			} });
		}
		const _normalized = cached(() => normalizeDef(def));
		defineLazy(inst._zod, "propValues", () => {
			const shape = def.shape;
			const propValues = {};
			for (const key in shape) {
				const field = shape[key]._zod;
				if (field.values) {
					var _propValues$key;
					(_propValues$key = propValues[key]) !== null && _propValues$key !== void 0 || (propValues[key] = /* @__PURE__ */ new Set());
					for (const v of field.values) propValues[key].add(v);
				}
			}
			return propValues;
		});
		const isObject = isObject$1;
		const catchall = def.catchall;
		let value;
		inst._zod.parse = (payload, ctx) => {
			var _value;
			(_value = value) !== null && _value !== void 0 || (value = _normalized.value);
			const input = payload.value;
			if (!isObject(input)) {
				payload.issues.push({
					expected: "object",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			payload.value = {};
			const proms = [];
			const shape = value.shape;
			for (const key of value.keys) {
				const el = shape[key];
				const isOptionalOut = el._zod.optout === "optional";
				const r = el._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalOut);
			}
			if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
			return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
		};
	});
	$ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
		$ZodObject.init(inst, def);
		const superParse = inst._zod.parse;
		const _normalized = cached(() => normalizeDef(def));
		const generateFastpass = (shape) => {
			const doc = new Doc([
				"shape",
				"payload",
				"ctx"
			]);
			const normalized = _normalized.value;
			const parseStr = (key) => {
				const k = esc(key);
				return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
			};
			doc.write(`const input = payload.value;`);
			const ids = Object.create(null);
			let counter = 0;
			for (const key of normalized.keys) ids[key] = `key_${counter++}`;
			doc.write(`const newResult = {};`);
			for (const key of normalized.keys) {
				var _schema$_zod;
				const id = ids[key];
				const k = esc(key);
				const schema = shape[key];
				const isOptionalOut = (schema === null || schema === void 0 || (_schema$_zod = schema._zod) === null || _schema$_zod === void 0 ? void 0 : _schema$_zod.optout) === "optional";
				doc.write(`const ${id} = ${parseStr(key)};`);
				if (isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
				else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			}
			doc.write(`payload.value = newResult;`);
			doc.write(`return payload;`);
			const fn = doc.compile();
			return (payload, ctx) => fn(shape, payload, ctx);
		};
		let fastpass;
		const isObject = isObject$1;
		const jit = !globalConfig.jitless;
		const fastEnabled = jit && allowsEval.value;
		const catchall = def.catchall;
		let value;
		inst._zod.parse = (payload, ctx) => {
			var _value2;
			(_value2 = value) !== null && _value2 !== void 0 || (value = _normalized.value);
			const input = payload.value;
			if (!isObject(input)) {
				payload.issues.push({
					expected: "object",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			if (jit && fastEnabled && (ctx === null || ctx === void 0 ? void 0 : ctx.async) === false && ctx.jitless !== true) {
				if (!fastpass) fastpass = generateFastpass(def.shape);
				payload = fastpass(payload, ctx);
				if (!catchall) return payload;
				return handleCatchall([], input, payload, ctx, value, inst);
			}
			return superParse(payload, ctx);
		};
	});
	$ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
		defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
		defineLazy(inst._zod, "values", () => {
			if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
		});
		defineLazy(inst._zod, "pattern", () => {
			if (def.options.every((o) => o._zod.pattern)) {
				const patterns = def.options.map((o) => o._zod.pattern);
				return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
			}
		});
		const single = def.options.length === 1;
		const first = def.options[0]._zod.run;
		inst._zod.parse = (payload, ctx) => {
			if (single) return first(payload, ctx);
			let async = false;
			const results = [];
			for (const option of def.options) {
				const result = option._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) {
					results.push(result);
					async = true;
				} else {
					if (result.issues.length === 0) return result;
					results.push(result);
				}
			}
			if (!async) return handleUnionResults(results, payload, inst, ctx);
			return Promise.all(results).then((results) => {
				return handleUnionResults(results, payload, inst, ctx);
			});
		};
	});
	$ZodXor = /* @__PURE__ */ $constructor("$ZodXor", (inst, def) => {
		$ZodUnion.init(inst, def);
		def.inclusive = false;
		const single = def.options.length === 1;
		const first = def.options[0]._zod.run;
		inst._zod.parse = (payload, ctx) => {
			if (single) return first(payload, ctx);
			let async = false;
			const results = [];
			for (const option of def.options) {
				const result = option._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) {
					results.push(result);
					async = true;
				} else results.push(result);
			}
			if (!async) return handleExclusiveUnionResults(results, payload, inst, ctx);
			return Promise.all(results).then((results) => {
				return handleExclusiveUnionResults(results, payload, inst, ctx);
			});
		};
	});
	$ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
		def.inclusive = false;
		$ZodUnion.init(inst, def);
		const _super = inst._zod.parse;
		defineLazy(inst._zod, "propValues", () => {
			const propValues = {};
			for (const option of def.options) {
				const pv = option._zod.propValues;
				if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
				for (const [k, v] of Object.entries(pv)) {
					if (!propValues[k]) propValues[k] = /* @__PURE__ */ new Set();
					for (const val of v) propValues[k].add(val);
				}
			}
			return propValues;
		});
		const disc = cached(() => {
			const opts = def.options;
			const map = /* @__PURE__ */ new Map();
			for (const o of opts) {
				var _o$_zod$propValues;
				const values = (_o$_zod$propValues = o._zod.propValues) === null || _o$_zod$propValues === void 0 ? void 0 : _o$_zod$propValues[def.discriminator];
				if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
				for (const v of values) {
					if (map.has(v)) throw new Error(`Duplicate discriminator value "${String(v)}"`);
					map.set(v, o);
				}
			}
			return map;
		});
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!isObject$1(input)) {
				payload.issues.push({
					code: "invalid_type",
					expected: "object",
					input,
					inst
				});
				return payload;
			}
			const opt = disc.value.get(input === null || input === void 0 ? void 0 : input[def.discriminator]);
			if (opt) return opt._zod.run(payload, ctx);
			if (def.unionFallback) return _super(payload, ctx);
			payload.issues.push({
				code: "invalid_union",
				errors: [],
				note: "No matching discriminator",
				discriminator: def.discriminator,
				input,
				path: [def.discriminator],
				inst
			});
			return payload;
		};
	});
	$ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			const left = def.left._zod.run({
				value: input,
				issues: []
			}, ctx);
			const right = def.right._zod.run({
				value: input,
				issues: []
			}, ctx);
			if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
				return handleIntersectionResults(payload, left, right);
			});
			return handleIntersectionResults(payload, left, right);
		};
	});
	$ZodTuple = /* @__PURE__ */ $constructor("$ZodTuple", (inst, def) => {
		$ZodType.init(inst, def);
		const items = def.items;
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!Array.isArray(input)) {
				payload.issues.push({
					input,
					inst,
					expected: "tuple",
					code: "invalid_type"
				});
				return payload;
			}
			payload.value = [];
			const proms = [];
			const reversedIndex = [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
			const optStart = reversedIndex === -1 ? 0 : items.length - reversedIndex;
			if (!def.rest) {
				const tooBig = input.length > items.length;
				const tooSmall = input.length < optStart - 1;
				if (tooBig || tooSmall) {
					payload.issues.push(_objectSpread2(_objectSpread2({}, tooBig ? {
						code: "too_big",
						maximum: items.length,
						inclusive: true
					} : {
						code: "too_small",
						minimum: items.length
					}), {}, {
						input,
						inst,
						origin: "array"
					}));
					return payload;
				}
			}
			let i = -1;
			for (const item of items) {
				i++;
				if (i >= input.length) {
					if (i >= optStart) continue;
				}
				const result = item._zod.run({
					value: input[i],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => handleTupleResult(result, payload, i)));
				else handleTupleResult(result, payload, i);
			}
			if (def.rest) {
				const rest = input.slice(items.length);
				for (const el of rest) {
					i++;
					const result = def.rest._zod.run({
						value: el,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleTupleResult(result, payload, i)));
					else handleTupleResult(result, payload, i);
				}
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	$ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!isPlainObject(input)) {
				payload.issues.push({
					expected: "record",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			const proms = [];
			const values = def.keyType._zod.values;
			if (values) {
				payload.value = {};
				const recordKeys = /* @__PURE__ */ new Set();
				for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
					recordKeys.add(typeof key === "number" ? key.toString() : key);
					const result = def.valueType._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[key] = result.value;
					}));
					else {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[key] = result.value;
					}
				}
				let unrecognized;
				for (const key in input) if (!recordKeys.has(key)) {
					var _unrecognized;
					unrecognized = (_unrecognized = unrecognized) !== null && _unrecognized !== void 0 ? _unrecognized : [];
					unrecognized.push(key);
				}
				if (unrecognized && unrecognized.length > 0) payload.issues.push({
					code: "unrecognized_keys",
					input,
					inst,
					keys: unrecognized
				});
			} else {
				payload.value = {};
				for (const key of Reflect.ownKeys(input)) {
					if (key === "__proto__") continue;
					let keyResult = def.keyType._zod.run({
						value: key,
						issues: []
					}, ctx);
					if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (typeof key === "string" && number$2.test(key) && keyResult.issues.length) {
						const retryResult = def.keyType._zod.run({
							value: Number(key),
							issues: []
						}, ctx);
						if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
						if (retryResult.issues.length === 0) keyResult = retryResult;
					}
					if (keyResult.issues.length) {
						if (def.mode === "loose") payload.value[key] = input[key];
						else payload.issues.push({
							code: "invalid_key",
							origin: "record",
							issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
							input: key,
							path: [key],
							inst
						});
						continue;
					}
					const result = def.valueType._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[keyResult.value] = result.value;
					}));
					else {
						if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
						payload.value[keyResult.value] = result.value;
					}
				}
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	$ZodMap = /* @__PURE__ */ $constructor("$ZodMap", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!(input instanceof Map)) {
				payload.issues.push({
					expected: "map",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			}
			const proms = [];
			payload.value = /* @__PURE__ */ new Map();
			for (const [key, value] of input) {
				const keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				const valueResult = def.valueType._zod.run({
					value,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise || valueResult instanceof Promise) proms.push(Promise.all([keyResult, valueResult]).then(([keyResult, valueResult]) => {
					handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
				}));
				else handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	$ZodSet = /* @__PURE__ */ $constructor("$ZodSet", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			const input = payload.value;
			if (!(input instanceof Set)) {
				payload.issues.push({
					input,
					inst,
					expected: "set",
					code: "invalid_type"
				});
				return payload;
			}
			const proms = [];
			payload.value = /* @__PURE__ */ new Set();
			for (const item of input) {
				const result = def.valueType._zod.run({
					value: item,
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => handleSetResult(result, payload)));
				else handleSetResult(result, payload);
			}
			if (proms.length) return Promise.all(proms).then(() => payload);
			return payload;
		};
	});
	$ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
		$ZodType.init(inst, def);
		const values = getEnumValues(def.entries);
		const valuesSet = new Set(values);
		inst._zod.values = valuesSet;
		inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (valuesSet.has(input)) return payload;
			payload.issues.push({
				code: "invalid_value",
				values,
				input,
				inst
			});
			return payload;
		};
	});
	$ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
		$ZodType.init(inst, def);
		if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
		const values = new Set(def.values);
		inst._zod.values = values;
		inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (values.has(input)) return payload;
			payload.issues.push({
				code: "invalid_value",
				values: def.values,
				input,
				inst
			});
			return payload;
		};
	});
	$ZodFile = /* @__PURE__ */ $constructor("$ZodFile", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			const input = payload.value;
			if (input instanceof File) return payload;
			payload.issues.push({
				expected: "file",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		};
	});
	$ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
			const _out = def.transform(payload.value, payload);
			if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
				payload.value = output;
				return payload;
			});
			if (_out instanceof Promise) throw new $ZodAsyncError();
			payload.value = _out;
			return payload;
		};
	});
	$ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		inst._zod.optout = "optional";
		defineLazy(inst._zod, "values", () => {
			return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
		});
		defineLazy(inst._zod, "pattern", () => {
			const pattern = def.innerType._zod.pattern;
			return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			if (def.innerType._zod.optin === "optional") {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, payload.value));
				return handleOptionalResult(result, payload.value);
			}
			if (payload.value === void 0) return payload;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	$ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
		$ZodOptional.init(inst, def);
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
		inst._zod.parse = (payload, ctx) => {
			return def.innerType._zod.run(payload, ctx);
		};
	});
	$ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
		defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
		defineLazy(inst._zod, "pattern", () => {
			const pattern = def.innerType._zod.pattern;
			return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
		});
		defineLazy(inst._zod, "values", () => {
			return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			if (payload.value === null) return payload;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	$ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			if (payload.value === void 0) {
				payload.value = def.defaultValue;
				/**
				* $ZodDefault returns the default value immediately in forward direction.
				* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
				return payload;
			}
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
			return handleDefaultResult(result, def);
		};
	});
	$ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.optin = "optional";
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			if (payload.value === void 0) payload.value = def.defaultValue;
			return def.innerType._zod.run(payload, ctx);
		};
	});
	$ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "values", () => {
			const v = def.innerType._zod.values;
			return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
			return handleNonOptionalResult(result, inst);
		};
	});
	$ZodSuccess = /* @__PURE__ */ $constructor("$ZodSuccess", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") throw new $ZodEncodeError("ZodSuccess");
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => {
				payload.value = result.issues.length === 0;
				return payload;
			});
			payload.value = result.issues.length === 0;
			return payload;
		};
	});
	$ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
		defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((result) => {
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue(_objectSpread2(_objectSpread2({}, payload), {}, {
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					}));
					payload.issues = [];
				}
				return payload;
			});
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue(_objectSpread2(_objectSpread2({}, payload), {}, {
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				}));
				payload.issues = [];
			}
			return payload;
		};
	});
	$ZodNaN = /* @__PURE__ */ $constructor("$ZodNaN", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _ctx) => {
			if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
				payload.issues.push({
					input: payload.value,
					inst,
					expected: "nan",
					code: "invalid_type"
				});
				return payload;
			}
			return payload;
		};
	});
	$ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "values", () => def.in._zod.values);
		defineLazy(inst._zod, "optin", () => def.in._zod.optin);
		defineLazy(inst._zod, "optout", () => def.out._zod.optout);
		defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") {
				const right = def.out._zod.run(payload, ctx);
				if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
				return handlePipeResult(right, def.in, ctx);
			}
			const left = def.in._zod.run(payload, ctx);
			if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
			return handlePipeResult(left, def.out, ctx);
		};
	});
	$ZodCodec = /* @__PURE__ */ $constructor("$ZodCodec", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "values", () => def.in._zod.values);
		defineLazy(inst._zod, "optin", () => def.in._zod.optin);
		defineLazy(inst._zod, "optout", () => def.out._zod.optout);
		defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
		inst._zod.parse = (payload, ctx) => {
			if ((ctx.direction || "forward") === "forward") {
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handleCodecAResult(left, def, ctx));
				return handleCodecAResult(left, def, ctx);
			} else {
				const right = def.out._zod.run(payload, ctx);
				if (right instanceof Promise) return right.then((right) => handleCodecAResult(right, def, ctx));
				return handleCodecAResult(right, def, ctx);
			}
		};
	});
	$ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
		defineLazy(inst._zod, "values", () => def.innerType._zod.values);
		defineLazy(inst._zod, "optin", () => {
			var _def$innerType;
			return (_def$innerType = def.innerType) === null || _def$innerType === void 0 || (_def$innerType = _def$innerType._zod) === null || _def$innerType === void 0 ? void 0 : _def$innerType.optin;
		});
		defineLazy(inst._zod, "optout", () => {
			var _def$innerType2;
			return (_def$innerType2 = def.innerType) === null || _def$innerType2 === void 0 || (_def$innerType2 = _def$innerType2._zod) === null || _def$innerType2 === void 0 ? void 0 : _def$innerType2.optout;
		});
		inst._zod.parse = (payload, ctx) => {
			if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then(handleReadonlyResult);
			return handleReadonlyResult(result);
		};
	});
	$ZodTemplateLiteral = /* @__PURE__ */ $constructor("$ZodTemplateLiteral", (inst, def) => {
		$ZodType.init(inst, def);
		const regexParts = [];
		for (const part of def.parts) if (typeof part === "object" && part !== null) {
			if (!part._zod.pattern) throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
			const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
			if (!source) throw new Error(`Invalid template literal part: ${part._zod.traits}`);
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			regexParts.push(source.slice(start, end));
		} else if (part === null || primitiveTypes.has(typeof part)) regexParts.push(escapeRegex(`${part}`));
		else throw new Error(`Invalid template literal part: ${part}`);
		inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
		inst._zod.parse = (payload, _ctx) => {
			if (typeof payload.value !== "string") {
				payload.issues.push({
					input: payload.value,
					inst,
					expected: "string",
					code: "invalid_type"
				});
				return payload;
			}
			inst._zod.pattern.lastIndex = 0;
			if (!inst._zod.pattern.test(payload.value)) {
				var _def$format;
				payload.issues.push({
					input: payload.value,
					inst,
					code: "invalid_format",
					format: (_def$format = def.format) !== null && _def$format !== void 0 ? _def$format : "template_literal",
					pattern: inst._zod.pattern.source
				});
				return payload;
			}
			return payload;
		};
	});
	$ZodFunction = /* @__PURE__ */ $constructor("$ZodFunction", (inst, def) => {
		$ZodType.init(inst, def);
		inst._def = def;
		inst._zod.def = def;
		inst.implement = (func) => {
			if (typeof func !== "function") throw new Error("implement() must be called with a function");
			return function(...args) {
				const parsedArgs = inst._def.input ? parse$1(inst._def.input, args) : args;
				const result = Reflect.apply(func, this, parsedArgs);
				if (inst._def.output) return parse$1(inst._def.output, result);
				return result;
			};
		};
		inst.implementAsync = (func) => {
			if (typeof func !== "function") throw new Error("implementAsync() must be called with a function");
			return _asyncToGenerator(function* (...args) {
				const parsedArgs = inst._def.input ? yield parseAsync$1(inst._def.input, args) : args;
				const result = yield Reflect.apply(func, this, parsedArgs);
				if (inst._def.output) return yield parseAsync$1(inst._def.output, result);
				return result;
			});
		};
		inst._zod.parse = (payload, _ctx) => {
			if (typeof payload.value !== "function") {
				payload.issues.push({
					code: "invalid_type",
					expected: "function",
					input: payload.value,
					inst
				});
				return payload;
			}
			if (inst._def.output && inst._def.output._zod.def.type === "promise") payload.value = inst.implementAsync(payload.value);
			else payload.value = inst.implement(payload.value);
			return payload;
		};
		inst.input = (...args) => {
			const F = inst.constructor;
			if (Array.isArray(args[0])) return new F({
				type: "function",
				input: new $ZodTuple({
					type: "tuple",
					items: args[0],
					rest: args[1]
				}),
				output: inst._def.output
			});
			return new F({
				type: "function",
				input: args[0],
				output: inst._def.output
			});
		};
		inst.output = (output) => {
			const F = inst.constructor;
			return new F({
				type: "function",
				input: inst._def.input,
				output
			});
		};
		return inst;
	});
	$ZodPromise = /* @__PURE__ */ $constructor("$ZodPromise", (inst, def) => {
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, ctx) => {
			return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({
				value: inner,
				issues: []
			}, ctx));
		};
	});
	$ZodLazy = /* @__PURE__ */ $constructor("$ZodLazy", (inst, def) => {
		$ZodType.init(inst, def);
		defineLazy(inst._zod, "innerType", () => def.getter());
		defineLazy(inst._zod, "pattern", () => {
			var _inst$_zod$innerType;
			return (_inst$_zod$innerType = inst._zod.innerType) === null || _inst$_zod$innerType === void 0 || (_inst$_zod$innerType = _inst$_zod$innerType._zod) === null || _inst$_zod$innerType === void 0 ? void 0 : _inst$_zod$innerType.pattern;
		});
		defineLazy(inst._zod, "propValues", () => {
			var _inst$_zod$innerType2;
			return (_inst$_zod$innerType2 = inst._zod.innerType) === null || _inst$_zod$innerType2 === void 0 || (_inst$_zod$innerType2 = _inst$_zod$innerType2._zod) === null || _inst$_zod$innerType2 === void 0 ? void 0 : _inst$_zod$innerType2.propValues;
		});
		defineLazy(inst._zod, "optin", () => {
			var _inst$_zod$innerType$, _inst$_zod$innerType3;
			return (_inst$_zod$innerType$ = (_inst$_zod$innerType3 = inst._zod.innerType) === null || _inst$_zod$innerType3 === void 0 || (_inst$_zod$innerType3 = _inst$_zod$innerType3._zod) === null || _inst$_zod$innerType3 === void 0 ? void 0 : _inst$_zod$innerType3.optin) !== null && _inst$_zod$innerType$ !== void 0 ? _inst$_zod$innerType$ : void 0;
		});
		defineLazy(inst._zod, "optout", () => {
			var _inst$_zod$innerType$2, _inst$_zod$innerType4;
			return (_inst$_zod$innerType$2 = (_inst$_zod$innerType4 = inst._zod.innerType) === null || _inst$_zod$innerType4 === void 0 || (_inst$_zod$innerType4 = _inst$_zod$innerType4._zod) === null || _inst$_zod$innerType4 === void 0 ? void 0 : _inst$_zod$innerType4.optout) !== null && _inst$_zod$innerType$2 !== void 0 ? _inst$_zod$innerType$2 : void 0;
		});
		inst._zod.parse = (payload, ctx) => {
			return inst._zod.innerType._zod.run(payload, ctx);
		};
	});
	$ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
		$ZodCheck.init(inst, def);
		$ZodType.init(inst, def);
		inst._zod.parse = (payload, _) => {
			return payload;
		};
		inst._zod.check = (payload) => {
			const input = payload.value;
			const r = def.fn(input);
			if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
			handleRefineResult(r, payload, input, inst);
		};
	});
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ar.js
function ar_default() {
	return { localeError: error$47() };
}
var error$47;
var init_ar = __esmMin((() => {
	init_util();
	error$47 = () => {
		const Sizable = {
			string: {
				unit: "حرف",
				verb: "أن يحوي"
			},
			file: {
				unit: "بايت",
				verb: "أن يحوي"
			},
			array: {
				unit: "عنصر",
				verb: "أن يحوي"
			},
			set: {
				unit: "عنصر",
				verb: "أن يحوي"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "مدخل",
			email: "بريد إلكتروني",
			url: "رابط",
			emoji: "إيموجي",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "تاريخ ووقت بمعيار ISO",
			date: "تاريخ بمعيار ISO",
			time: "وقت بمعيار ISO",
			duration: "مدة بمعيار ISO",
			ipv4: "عنوان IPv4",
			ipv6: "عنوان IPv6",
			cidrv4: "مدى عناوين بصيغة IPv4",
			cidrv6: "مدى عناوين بصيغة IPv6",
			base64: "نَص بترميز base64-encoded",
			base64url: "نَص بترميز base64url-encoded",
			json_string: "نَص على هيئة JSON",
			e164: "رقم هاتف بمعيار E.164",
			jwt: "JWT",
			template_literal: "مدخل"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `مدخلات غير مقبولة: يفترض إدخال instanceof ${issue.expected}، ولكن تم إدخال ${received}`;
					return `مدخلات غير مقبولة: يفترض إدخال ${expected}، ولكن تم إدخال ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive(issue.values[0])}`;
					return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return ` أكبر من اللازم: يفترض أن تكون ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "القيمة"} ${adj} ${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "عنصر"}`;
					return `أكبر من اللازم: يفترض أن تكون ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "القيمة"} ${adj} ${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
					return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `نَص غير مقبول: يجب أن يبدأ بـ "${issue.prefix}"`;
					if (_issue.format === "ends_with") return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
					if (_issue.format === "includes") return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
					if (_issue.format === "regex") return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} غير مقبول`;
				}
				case "not_multiple_of": return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue.divisor}`;
				case "unrecognized_keys": return `معرف${issue.keys.length > 1 ? "ات" : ""} غريب${issue.keys.length > 1 ? "ة" : ""}: ${joinValues(issue.keys, "، ")}`;
				case "invalid_key": return `معرف غير مقبول في ${issue.origin}`;
				case "invalid_union": return "مدخل غير مقبول";
				case "invalid_element": return `مدخل غير مقبول في ${issue.origin}`;
				default: return "مدخل غير مقبول";
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/az.js
function az_default() {
	return { localeError: error$46() };
}
var error$46;
var init_az = __esmMin((() => {
	init_util();
	error$46 = () => {
		const Sizable = {
			string: {
				unit: "simvol",
				verb: "olmalıdır"
			},
			file: {
				unit: "bayt",
				verb: "olmalıdır"
			},
			array: {
				unit: "element",
				verb: "olmalıdır"
			},
			set: {
				unit: "element",
				verb: "olmalıdır"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "email address",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO datetime",
			date: "ISO date",
			time: "ISO time",
			duration: "ISO duration",
			ipv4: "IPv4 address",
			ipv6: "IPv6 address",
			cidrv4: "IPv4 range",
			cidrv6: "IPv6 range",
			base64: "base64-encoded string",
			base64url: "base64url-encoded string",
			json_string: "JSON string",
			e164: "E.164 number",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Yanlış dəyər: gözlənilən instanceof ${issue.expected}, daxil olan ${received}`;
					return `Yanlış dəyər: gözlənilən ${expected}, daxil olan ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Yanlış dəyər: gözlənilən ${stringifyPrimitive(issue.values[0])}`;
					return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Çox böyük: gözlənilən ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "dəyər"} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "element"}`;
					return `Çox böyük: gözlənilən ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "dəyər"} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
					if (_issue.format === "ends_with") return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
					if (_issue.format === "includes") return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
					if (_issue.format === "regex") return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
					return `Yanlış ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Yanlış ədəd: ${issue.divisor} ilə bölünə bilən olmalıdır`;
				case "unrecognized_keys": return `Tanınmayan açar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `${issue.origin} daxilində yanlış açar`;
				case "invalid_union": return "Yanlış dəyər";
				case "invalid_element": return `${issue.origin} daxilində yanlış dəyər`;
				default: return `Yanlış dəyər`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/be.js
function getBelarusianPlural(count, one, few, many) {
	const absCount = Math.abs(count);
	const lastDigit = absCount % 10;
	const lastTwoDigits = absCount % 100;
	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return many;
	if (lastDigit === 1) return one;
	if (lastDigit >= 2 && lastDigit <= 4) return few;
	return many;
}
function be_default() {
	return { localeError: error$45() };
}
var error$45;
var init_be = __esmMin((() => {
	init_util();
	error$45 = () => {
		const Sizable = {
			string: {
				unit: {
					one: "сімвал",
					few: "сімвалы",
					many: "сімвалаў"
				},
				verb: "мець"
			},
			array: {
				unit: {
					one: "элемент",
					few: "элементы",
					many: "элементаў"
				},
				verb: "мець"
			},
			set: {
				unit: {
					one: "элемент",
					few: "элементы",
					many: "элементаў"
				},
				verb: "мець"
			},
			file: {
				unit: {
					one: "байт",
					few: "байты",
					many: "байтаў"
				},
				verb: "мець"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "увод",
			email: "email адрас",
			url: "URL",
			emoji: "эмодзі",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO дата і час",
			date: "ISO дата",
			time: "ISO час",
			duration: "ISO працягласць",
			ipv4: "IPv4 адрас",
			ipv6: "IPv6 адрас",
			cidrv4: "IPv4 дыяпазон",
			cidrv6: "IPv6 дыяпазон",
			base64: "радок у фармаце base64",
			base64url: "радок у фармаце base64url",
			json_string: "JSON радок",
			e164: "нумар E.164",
			jwt: "JWT",
			template_literal: "увод"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "лік",
			array: "масіў"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Няправільны ўвод: чакаўся instanceof ${issue.expected}, атрымана ${received}`;
					return `Няправільны ўвод: чакаўся ${expected}, атрымана ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Няправільны ўвод: чакалася ${stringifyPrimitive(issue.values[0])}`;
					return `Няправільны варыянт: чакаўся адзін з ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin;
						const unit = getBelarusianPlural(Number(issue.maximum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
						return `Занадта вялікі: чакалася, што ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "значэнне"} павінна ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
					}
					return `Занадта вялікі: чакалася, што ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "значэнне"} павінна быць ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						const unit = getBelarusianPlural(Number(issue.minimum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
						return `Занадта малы: чакалася, што ${issue.origin} павінна ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
					}
					return `Занадта малы: чакалася, што ${issue.origin} павінна быць ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
					if (_issue.format === "regex") return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
					return `Няправільны ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Няправільны лік: павінен быць кратным ${issue.divisor}`;
				case "unrecognized_keys": return `Нераспазнаны ${issue.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Няправільны ключ у ${issue.origin}`;
				case "invalid_union": return "Няправільны ўвод";
				case "invalid_element": return `Няправільнае значэнне ў ${issue.origin}`;
				default: return `Няправільны ўвод`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/bg.js
function bg_default() {
	return { localeError: error$44() };
}
var error$44;
var init_bg = __esmMin((() => {
	init_util();
	error$44 = () => {
		const Sizable = {
			string: {
				unit: "символа",
				verb: "да съдържа"
			},
			file: {
				unit: "байта",
				verb: "да съдържа"
			},
			array: {
				unit: "елемента",
				verb: "да съдържа"
			},
			set: {
				unit: "елемента",
				verb: "да съдържа"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "вход",
			email: "имейл адрес",
			url: "URL",
			emoji: "емоджи",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO време",
			date: "ISO дата",
			time: "ISO време",
			duration: "ISO продължителност",
			ipv4: "IPv4 адрес",
			ipv6: "IPv6 адрес",
			cidrv4: "IPv4 диапазон",
			cidrv6: "IPv6 диапазон",
			base64: "base64-кодиран низ",
			base64url: "base64url-кодиран низ",
			json_string: "JSON низ",
			e164: "E.164 номер",
			jwt: "JWT",
			template_literal: "вход"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "число",
			array: "масив"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Невалиден вход: очакван instanceof ${issue.expected}, получен ${received}`;
					return `Невалиден вход: очакван ${expected}, получен ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Невалиден вход: очакван ${stringifyPrimitive(issue.values[0])}`;
					return `Невалидна опция: очаквано едно от ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Твърде голямо: очаква се ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "стойност"} да съдържа ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "елемента"}`;
					return `Твърде голямо: очаква се ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "стойност"} да бъде ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Твърде малко: очаква се ${issue.origin} да съдържа ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Твърде малко: очаква се ${issue.origin} да бъде ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Невалиден низ: трябва да започва с "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Невалиден низ: трябва да завършва с "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Невалиден низ: трябва да включва "${_issue.includes}"`;
					if (_issue.format === "regex") return `Невалиден низ: трябва да съвпада с ${_issue.pattern}`;
					let invalid_adj = "Невалиден";
					if (_issue.format === "emoji") invalid_adj = "Невалидно";
					if (_issue.format === "datetime") invalid_adj = "Невалидно";
					if (_issue.format === "date") invalid_adj = "Невалидна";
					if (_issue.format === "time") invalid_adj = "Невалидно";
					if (_issue.format === "duration") invalid_adj = "Невалидна";
					return `${invalid_adj} ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Невалидно число: трябва да бъде кратно на ${issue.divisor}`;
				case "unrecognized_keys": return `Неразпознат${issue.keys.length > 1 ? "и" : ""} ключ${issue.keys.length > 1 ? "ове" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Невалиден ключ в ${issue.origin}`;
				case "invalid_union": return "Невалиден вход";
				case "invalid_element": return `Невалидна стойност в ${issue.origin}`;
				default: return `Невалиден вход`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ca.js
function ca_default() {
	return { localeError: error$43() };
}
var error$43;
var init_ca = __esmMin((() => {
	init_util();
	error$43 = () => {
		const Sizable = {
			string: {
				unit: "caràcters",
				verb: "contenir"
			},
			file: {
				unit: "bytes",
				verb: "contenir"
			},
			array: {
				unit: "elements",
				verb: "contenir"
			},
			set: {
				unit: "elements",
				verb: "contenir"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "entrada",
			email: "adreça electrònica",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "data i hora ISO",
			date: "data ISO",
			time: "hora ISO",
			duration: "durada ISO",
			ipv4: "adreça IPv4",
			ipv6: "adreça IPv6",
			cidrv4: "rang IPv4",
			cidrv6: "rang IPv6",
			base64: "cadena codificada en base64",
			base64url: "cadena codificada en base64url",
			json_string: "cadena JSON",
			e164: "número E.164",
			jwt: "JWT",
			template_literal: "entrada"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Tipus invàlid: s'esperava instanceof ${issue.expected}, s'ha rebut ${received}`;
					return `Tipus invàlid: s'esperava ${expected}, s'ha rebut ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Valor invàlid: s'esperava ${stringifyPrimitive(issue.values[0])}`;
					return `Opció invàlida: s'esperava una de ${joinValues(issue.values, " o ")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "com a màxim" : "menys de";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Massa gran: s'esperava que ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "el valor"} contingués ${adj} ${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elements"}`;
					return `Massa gran: s'esperava que ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "el valor"} fos ${adj} ${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? "com a mínim" : "més de";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Massa petit: s'esperava que ${issue.origin} contingués ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
					return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Format invàlid: ha d'incloure "${_issue.includes}"`;
					if (_issue.format === "regex") return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
					return `Format invàlid per a ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Número invàlid: ha de ser múltiple de ${issue.divisor}`;
				case "unrecognized_keys": return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Clau invàlida a ${issue.origin}`;
				case "invalid_union": return "Entrada invàlida";
				case "invalid_element": return `Element invàlid a ${issue.origin}`;
				default: return `Entrada invàlida`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/cs.js
function cs_default() {
	return { localeError: error$42() };
}
var error$42;
var init_cs = __esmMin((() => {
	init_util();
	error$42 = () => {
		const Sizable = {
			string: {
				unit: "znaků",
				verb: "mít"
			},
			file: {
				unit: "bajtů",
				verb: "mít"
			},
			array: {
				unit: "prvků",
				verb: "mít"
			},
			set: {
				unit: "prvků",
				verb: "mít"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "regulární výraz",
			email: "e-mailová adresa",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "datum a čas ve formátu ISO",
			date: "datum ve formátu ISO",
			time: "čas ve formátu ISO",
			duration: "doba trvání ISO",
			ipv4: "IPv4 adresa",
			ipv6: "IPv6 adresa",
			cidrv4: "rozsah IPv4",
			cidrv6: "rozsah IPv6",
			base64: "řetězec zakódovaný ve formátu base64",
			base64url: "řetězec zakódovaný ve formátu base64url",
			json_string: "řetězec ve formátu JSON",
			e164: "číslo E.164",
			jwt: "JWT",
			template_literal: "vstup"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "číslo",
			string: "řetězec",
			function: "funkce",
			array: "pole"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Neplatný vstup: očekáváno instanceof ${issue.expected}, obdrženo ${received}`;
					return `Neplatný vstup: očekáváno ${expected}, obdrženo ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Neplatný vstup: očekáváno ${stringifyPrimitive(issue.values[0])}`;
					return `Neplatná možnost: očekávána jedna z hodnot ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin, _sizing$unit;
						return `Hodnota je příliš velká: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "hodnota"} musí mít ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "prvků"}`;
					}
					return `Hodnota je příliš velká: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "hodnota"} musí být ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _issue$origin4;
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin3, _sizing$unit2;
						return `Hodnota je příliš malá: ${(_issue$origin3 = issue.origin) !== null && _issue$origin3 !== void 0 ? _issue$origin3 : "hodnota"} musí mít ${adj}${issue.minimum.toString()} ${(_sizing$unit2 = sizing.unit) !== null && _sizing$unit2 !== void 0 ? _sizing$unit2 : "prvků"}`;
					}
					return `Hodnota je příliš malá: ${(_issue$origin4 = issue.origin) !== null && _issue$origin4 !== void 0 ? _issue$origin4 : "hodnota"} musí být ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
					if (_issue.format === "regex") return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
					return `Neplatný formát ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Neplatné číslo: musí být násobkem ${issue.divisor}`;
				case "unrecognized_keys": return `Neznámé klíče: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Neplatný klíč v ${issue.origin}`;
				case "invalid_union": return "Neplatný vstup";
				case "invalid_element": return `Neplatná hodnota v ${issue.origin}`;
				default: return `Neplatný vstup`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/da.js
function da_default() {
	return { localeError: error$41() };
}
var error$41;
var init_da = __esmMin((() => {
	init_util();
	error$41 = () => {
		const Sizable = {
			string: {
				unit: "tegn",
				verb: "havde"
			},
			file: {
				unit: "bytes",
				verb: "havde"
			},
			array: {
				unit: "elementer",
				verb: "indeholdt"
			},
			set: {
				unit: "elementer",
				verb: "indeholdt"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "e-mailadresse",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO dato- og klokkeslæt",
			date: "ISO-dato",
			time: "ISO-klokkeslæt",
			duration: "ISO-varighed",
			ipv4: "IPv4-område",
			ipv6: "IPv6-område",
			cidrv4: "IPv4-spektrum",
			cidrv6: "IPv6-spektrum",
			base64: "base64-kodet streng",
			base64url: "base64url-kodet streng",
			json_string: "JSON-streng",
			e164: "E.164-nummer",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = {
			nan: "NaN",
			string: "streng",
			number: "tal",
			boolean: "boolean",
			array: "liste",
			object: "objekt",
			set: "sæt",
			file: "fil"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Ugyldigt input: forventede instanceof ${issue.expected}, fik ${received}`;
					return `Ugyldigt input: forventede ${expected}, fik ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Ugyldig værdi: forventede ${stringifyPrimitive(issue.values[0])}`;
					return `Ugyldigt valg: forventede en af følgende ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _TypeDictionary$issue2, _sizing$unit;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					const origin = (_TypeDictionary$issue2 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue2 !== void 0 ? _TypeDictionary$issue2 : issue.origin;
					if (sizing) return `For stor: forventede ${origin !== null && origin !== void 0 ? origin : "value"} ${sizing.verb} ${adj} ${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementer"}`;
					return `For stor: forventede ${origin !== null && origin !== void 0 ? origin : "value"} havde ${adj} ${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _TypeDictionary$issue3;
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					const origin = (_TypeDictionary$issue3 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue3 !== void 0 ? _TypeDictionary$issue3 : issue.origin;
					if (sizing) return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
					return `For lille: forventede ${origin} havde ${adj} ${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
					if (_issue.format === "regex") return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
					return `Ugyldig ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Ugyldigt tal: skal være deleligt med ${issue.divisor}`;
				case "unrecognized_keys": return `${issue.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Ugyldig nøgle i ${issue.origin}`;
				case "invalid_union": return "Ugyldigt input: matcher ingen af de tilladte typer";
				case "invalid_element": return `Ugyldig værdi i ${issue.origin}`;
				default: return `Ugyldigt input`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/de.js
function de_default() {
	return { localeError: error$40() };
}
var error$40;
var init_de = __esmMin((() => {
	init_util();
	error$40 = () => {
		const Sizable = {
			string: {
				unit: "Zeichen",
				verb: "zu haben"
			},
			file: {
				unit: "Bytes",
				verb: "zu haben"
			},
			array: {
				unit: "Elemente",
				verb: "zu haben"
			},
			set: {
				unit: "Elemente",
				verb: "zu haben"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "Eingabe",
			email: "E-Mail-Adresse",
			url: "URL",
			emoji: "Emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO-Datum und -Uhrzeit",
			date: "ISO-Datum",
			time: "ISO-Uhrzeit",
			duration: "ISO-Dauer",
			ipv4: "IPv4-Adresse",
			ipv6: "IPv6-Adresse",
			cidrv4: "IPv4-Bereich",
			cidrv6: "IPv6-Bereich",
			base64: "Base64-codierter String",
			base64url: "Base64-URL-codierter String",
			json_string: "JSON-String",
			e164: "E.164-Nummer",
			jwt: "JWT",
			template_literal: "Eingabe"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "Zahl",
			array: "Array"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Ungültige Eingabe: erwartet instanceof ${issue.expected}, erhalten ${received}`;
					return `Ungültige Eingabe: erwartet ${expected}, erhalten ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Ungültige Eingabe: erwartet ${stringifyPrimitive(issue.values[0])}`;
					return `Ungültige Option: erwartet eine von ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Zu groß: erwartet, dass ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "Wert"} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "Elemente"} hat`;
					return `Zu groß: erwartet, dass ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "Wert"} ${adj}${issue.maximum.toString()} ist`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
					return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
					if (_issue.format === "ends_with") return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
					if (_issue.format === "includes") return `Ungültiger String: muss "${_issue.includes}" enthalten`;
					if (_issue.format === "regex") return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
					return `Ungültig: ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Ungültige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
				case "unrecognized_keys": return `${issue.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Ungültiger Schlüssel in ${issue.origin}`;
				case "invalid_union": return "Ungültige Eingabe";
				case "invalid_element": return `Ungültiger Wert in ${issue.origin}`;
				default: return `Ungültige Eingabe`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/en.js
function en_default() {
	return { localeError: error$39() };
}
var error$39;
var init_en = __esmMin((() => {
	init_util();
	error$39 = () => {
		const Sizable = {
			string: {
				unit: "characters",
				verb: "to have"
			},
			file: {
				unit: "bytes",
				verb: "to have"
			},
			array: {
				unit: "items",
				verb: "to have"
			},
			set: {
				unit: "items",
				verb: "to have"
			},
			map: {
				unit: "entries",
				verb: "to have"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "email address",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO datetime",
			date: "ISO date",
			time: "ISO time",
			duration: "ISO duration",
			ipv4: "IPv4 address",
			ipv6: "IPv6 address",
			mac: "MAC address",
			cidrv4: "IPv4 range",
			cidrv6: "IPv6 range",
			base64: "base64-encoded string",
			base64url: "base64url-encoded string",
			json_string: "JSON string",
			e164: "E.164 number",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					return `Invalid input: expected ${expected}, received ${(_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
					return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Too big: expected ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "value"} to have ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elements"}`;
					return `Too big: expected ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "value"} to be ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
					if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
					return `Invalid ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
				case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Invalid key in ${issue.origin}`;
				case "invalid_union": return "Invalid input";
				case "invalid_element": return `Invalid value in ${issue.origin}`;
				default: return `Invalid input`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/eo.js
function eo_default() {
	return { localeError: error$38() };
}
var error$38;
var init_eo = __esmMin((() => {
	init_util();
	error$38 = () => {
		const Sizable = {
			string: {
				unit: "karaktrojn",
				verb: "havi"
			},
			file: {
				unit: "bajtojn",
				verb: "havi"
			},
			array: {
				unit: "elementojn",
				verb: "havi"
			},
			set: {
				unit: "elementojn",
				verb: "havi"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "enigo",
			email: "retadreso",
			url: "URL",
			emoji: "emoĝio",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO-datotempo",
			date: "ISO-dato",
			time: "ISO-tempo",
			duration: "ISO-daŭro",
			ipv4: "IPv4-adreso",
			ipv6: "IPv6-adreso",
			cidrv4: "IPv4-rango",
			cidrv6: "IPv6-rango",
			base64: "64-ume kodita karaktraro",
			base64url: "URL-64-ume kodita karaktraro",
			json_string: "JSON-karaktraro",
			e164: "E.164-nombro",
			jwt: "JWT",
			template_literal: "enigo"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "nombro",
			array: "tabelo",
			null: "senvalora"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Nevalida enigo: atendiĝis instanceof ${issue.expected}, riceviĝis ${received}`;
					return `Nevalida enigo: atendiĝis ${expected}, riceviĝis ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Nevalida enigo: atendiĝis ${stringifyPrimitive(issue.values[0])}`;
					return `Nevalida opcio: atendiĝis unu el ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Tro granda: atendiĝis ke ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "valoro"} havu ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementojn"}`;
					return `Tro granda: atendiĝis ke ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "valoro"} havu ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Tro malgranda: atendiĝis ke ${issue.origin} havu ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Tro malgranda: atendiĝis ke ${issue.origin} estu ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
					if (_issue.format === "regex") return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
					return `Nevalida ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Nevalida nombro: devas esti oblo de ${issue.divisor}`;
				case "unrecognized_keys": return `Nekonata${issue.keys.length > 1 ? "j" : ""} ŝlosilo${issue.keys.length > 1 ? "j" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Nevalida ŝlosilo en ${issue.origin}`;
				case "invalid_union": return "Nevalida enigo";
				case "invalid_element": return `Nevalida valoro en ${issue.origin}`;
				default: return `Nevalida enigo`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/es.js
function es_default() {
	return { localeError: error$37() };
}
var error$37;
var init_es = __esmMin((() => {
	init_util();
	error$37 = () => {
		const Sizable = {
			string: {
				unit: "caracteres",
				verb: "tener"
			},
			file: {
				unit: "bytes",
				verb: "tener"
			},
			array: {
				unit: "elementos",
				verb: "tener"
			},
			set: {
				unit: "elementos",
				verb: "tener"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "entrada",
			email: "dirección de correo electrónico",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "fecha y hora ISO",
			date: "fecha ISO",
			time: "hora ISO",
			duration: "duración ISO",
			ipv4: "dirección IPv4",
			ipv6: "dirección IPv6",
			cidrv4: "rango IPv4",
			cidrv6: "rango IPv6",
			base64: "cadena codificada en base64",
			base64url: "URL codificada en base64",
			json_string: "cadena JSON",
			e164: "número E.164",
			jwt: "JWT",
			template_literal: "entrada"
		};
		const TypeDictionary = {
			nan: "NaN",
			string: "texto",
			number: "número",
			boolean: "booleano",
			array: "arreglo",
			object: "objeto",
			set: "conjunto",
			file: "archivo",
			date: "fecha",
			bigint: "número grande",
			symbol: "símbolo",
			undefined: "indefinido",
			null: "nulo",
			function: "función",
			map: "mapa",
			record: "registro",
			tuple: "tupla",
			enum: "enumeración",
			union: "unión",
			literal: "literal",
			promise: "promesa",
			void: "vacío",
			never: "nunca",
			unknown: "desconocido",
			any: "cualquiera"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Entrada inválida: se esperaba instanceof ${issue.expected}, recibido ${received}`;
					return `Entrada inválida: se esperaba ${expected}, recibido ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Entrada inválida: se esperaba ${stringifyPrimitive(issue.values[0])}`;
					return `Opción inválida: se esperaba una de ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _TypeDictionary$issue2, _sizing$unit;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					const origin = (_TypeDictionary$issue2 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue2 !== void 0 ? _TypeDictionary$issue2 : issue.origin;
					if (sizing) return `Demasiado grande: se esperaba que ${origin !== null && origin !== void 0 ? origin : "valor"} tuviera ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementos"}`;
					return `Demasiado grande: se esperaba que ${origin !== null && origin !== void 0 ? origin : "valor"} fuera ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _TypeDictionary$issue3;
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					const origin = (_TypeDictionary$issue3 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue3 !== void 0 ? _TypeDictionary$issue3 : issue.origin;
					if (sizing) return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Cadena inválida: debe incluir "${_issue.includes}"`;
					if (_issue.format === "regex") return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
					return `Inválido ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Número inválido: debe ser múltiplo de ${issue.divisor}`;
				case "unrecognized_keys": return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key":
					var _TypeDictionary$issue4;
					return `Llave inválida en ${(_TypeDictionary$issue4 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue4 !== void 0 ? _TypeDictionary$issue4 : issue.origin}`;
				case "invalid_union": return "Entrada inválida";
				case "invalid_element":
					var _TypeDictionary$issue5;
					return `Valor inválido en ${(_TypeDictionary$issue5 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue5 !== void 0 ? _TypeDictionary$issue5 : issue.origin}`;
				default: return `Entrada inválida`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/fa.js
function fa_default() {
	return { localeError: error$36() };
}
var error$36;
var init_fa = __esmMin((() => {
	init_util();
	error$36 = () => {
		const Sizable = {
			string: {
				unit: "کاراکتر",
				verb: "داشته باشد"
			},
			file: {
				unit: "بایت",
				verb: "داشته باشد"
			},
			array: {
				unit: "آیتم",
				verb: "داشته باشد"
			},
			set: {
				unit: "آیتم",
				verb: "داشته باشد"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ورودی",
			email: "آدرس ایمیل",
			url: "URL",
			emoji: "ایموجی",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "تاریخ و زمان ایزو",
			date: "تاریخ ایزو",
			time: "زمان ایزو",
			duration: "مدت زمان ایزو",
			ipv4: "IPv4 آدرس",
			ipv6: "IPv6 آدرس",
			cidrv4: "IPv4 دامنه",
			cidrv6: "IPv6 دامنه",
			base64: "base64-encoded رشته",
			base64url: "base64url-encoded رشته",
			json_string: "JSON رشته",
			e164: "E.164 عدد",
			jwt: "JWT",
			template_literal: "ورودی"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "عدد",
			array: "آرایه"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `ورودی نامعتبر: می‌بایست instanceof ${issue.expected} می‌بود، ${received} دریافت شد`;
					return `ورودی نامعتبر: می‌بایست ${expected} می‌بود، ${received} دریافت شد`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive(issue.values[0])} می‌بود`;
					return `گزینه نامعتبر: می‌بایست یکی از ${joinValues(issue.values, "|")} می‌بود`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin, _sizing$unit;
						return `خیلی بزرگ: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "مقدار"} باید ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "عنصر"} باشد`;
					}
					return `خیلی بزرگ: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "مقدار"} باید ${adj}${issue.maximum.toString()} باشد`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} باشد`;
					return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} باشد`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
					if (_issue.format === "ends_with") return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
					if (_issue.format === "includes") return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
					if (_issue.format === "regex") return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} نامعتبر`;
				}
				case "not_multiple_of": return `عدد نامعتبر: باید مضرب ${issue.divisor} باشد`;
				case "unrecognized_keys": return `کلید${issue.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `کلید ناشناس در ${issue.origin}`;
				case "invalid_union": return `ورودی نامعتبر`;
				case "invalid_element": return `مقدار نامعتبر در ${issue.origin}`;
				default: return `ورودی نامعتبر`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/fi.js
function fi_default() {
	return { localeError: error$35() };
}
var error$35;
var init_fi = __esmMin((() => {
	init_util();
	error$35 = () => {
		const Sizable = {
			string: {
				unit: "merkkiä",
				subject: "merkkijonon"
			},
			file: {
				unit: "tavua",
				subject: "tiedoston"
			},
			array: {
				unit: "alkiota",
				subject: "listan"
			},
			set: {
				unit: "alkiota",
				subject: "joukon"
			},
			number: {
				unit: "",
				subject: "luvun"
			},
			bigint: {
				unit: "",
				subject: "suuren kokonaisluvun"
			},
			int: {
				unit: "",
				subject: "kokonaisluvun"
			},
			date: {
				unit: "",
				subject: "päivämäärän"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "säännöllinen lauseke",
			email: "sähköpostiosoite",
			url: "URL-osoite",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO-aikaleima",
			date: "ISO-päivämäärä",
			time: "ISO-aika",
			duration: "ISO-kesto",
			ipv4: "IPv4-osoite",
			ipv6: "IPv6-osoite",
			cidrv4: "IPv4-alue",
			cidrv6: "IPv6-alue",
			base64: "base64-koodattu merkkijono",
			base64url: "base64url-koodattu merkkijono",
			json_string: "JSON-merkkijono",
			e164: "E.164-luku",
			jwt: "JWT",
			template_literal: "templaattimerkkijono"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Virheellinen tyyppi: odotettiin instanceof ${issue.expected}, oli ${received}`;
					return `Virheellinen tyyppi: odotettiin ${expected}, oli ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Virheellinen syöte: täytyy olla ${stringifyPrimitive(issue.values[0])}`;
					return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues(issue.values, "|")}`;
				case "too_big": {
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
					return `Liian suuri: arvon täytyy olla ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
					return `Liian pieni: arvon täytyy olla ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
					if (_issue.format === "regex") return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
					return `Virheellinen ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Virheellinen luku: täytyy olla luvun ${issue.divisor} monikerta`;
				case "unrecognized_keys": return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return "Virheellinen avain tietueessa";
				case "invalid_union": return "Virheellinen unioni";
				case "invalid_element": return "Virheellinen arvo joukossa";
				default: return `Virheellinen syöte`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/fr.js
function fr_default() {
	return { localeError: error$34() };
}
var error$34;
var init_fr = __esmMin((() => {
	init_util();
	error$34 = () => {
		const Sizable = {
			string: {
				unit: "caractères",
				verb: "avoir"
			},
			file: {
				unit: "octets",
				verb: "avoir"
			},
			array: {
				unit: "éléments",
				verb: "avoir"
			},
			set: {
				unit: "éléments",
				verb: "avoir"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "entrée",
			email: "adresse e-mail",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "date et heure ISO",
			date: "date ISO",
			time: "heure ISO",
			duration: "durée ISO",
			ipv4: "adresse IPv4",
			ipv6: "adresse IPv6",
			cidrv4: "plage IPv4",
			cidrv6: "plage IPv6",
			base64: "chaîne encodée en base64",
			base64url: "chaîne encodée en base64url",
			json_string: "chaîne JSON",
			e164: "numéro E.164",
			jwt: "JWT",
			template_literal: "entrée"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "nombre",
			array: "tableau"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Entrée invalide : instanceof ${issue.expected} attendu, ${received} reçu`;
					return `Entrée invalide : ${expected} attendu, ${received} reçu`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Entrée invalide : ${stringifyPrimitive(issue.values[0])} attendu`;
					return `Option invalide : une valeur parmi ${joinValues(issue.values, "|")} attendue`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Trop grand : ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "élément(s)"}`;
					return `Trop grand : ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "valeur"} doit être ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Trop petit : ${issue.origin} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Trop petit : ${issue.origin} doit être ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Chaîne invalide : doit inclure "${_issue.includes}"`;
					if (_issue.format === "regex") return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} invalide`;
				}
				case "not_multiple_of": return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
				case "unrecognized_keys": return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Clé invalide dans ${issue.origin}`;
				case "invalid_union": return "Entrée invalide";
				case "invalid_element": return `Valeur invalide dans ${issue.origin}`;
				default: return `Entrée invalide`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/fr-CA.js
function fr_CA_default() {
	return { localeError: error$33() };
}
var error$33;
var init_fr_CA = __esmMin((() => {
	init_util();
	error$33 = () => {
		const Sizable = {
			string: {
				unit: "caractères",
				verb: "avoir"
			},
			file: {
				unit: "octets",
				verb: "avoir"
			},
			array: {
				unit: "éléments",
				verb: "avoir"
			},
			set: {
				unit: "éléments",
				verb: "avoir"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "entrée",
			email: "adresse courriel",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "date-heure ISO",
			date: "date ISO",
			time: "heure ISO",
			duration: "durée ISO",
			ipv4: "adresse IPv4",
			ipv6: "adresse IPv6",
			cidrv4: "plage IPv4",
			cidrv6: "plage IPv6",
			base64: "chaîne encodée en base64",
			base64url: "chaîne encodée en base64url",
			json_string: "chaîne JSON",
			e164: "numéro E.164",
			jwt: "JWT",
			template_literal: "entrée"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Entrée invalide : attendu instanceof ${issue.expected}, reçu ${received}`;
					return `Entrée invalide : attendu ${expected}, reçu ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Entrée invalide : attendu ${stringifyPrimitive(issue.values[0])}`;
					return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _issue$origin2;
					const adj = issue.inclusive ? "≤" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Trop grand : attendu que ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
					return `Trop grand : attendu que ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "la valeur"} soit ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? "≥" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Chaîne invalide : doit inclure "${_issue.includes}"`;
					if (_issue.format === "regex") return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} invalide`;
				}
				case "not_multiple_of": return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
				case "unrecognized_keys": return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Clé invalide dans ${issue.origin}`;
				case "invalid_union": return "Entrée invalide";
				case "invalid_element": return `Valeur invalide dans ${issue.origin}`;
				default: return `Entrée invalide`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/he.js
function he_default() {
	return { localeError: error$32() };
}
var error$32;
var init_he = __esmMin((() => {
	init_util();
	error$32 = () => {
		const TypeNames = {
			string: {
				label: "מחרוזת",
				gender: "f"
			},
			number: {
				label: "מספר",
				gender: "m"
			},
			boolean: {
				label: "ערך בוליאני",
				gender: "m"
			},
			bigint: {
				label: "BigInt",
				gender: "m"
			},
			date: {
				label: "תאריך",
				gender: "m"
			},
			array: {
				label: "מערך",
				gender: "m"
			},
			object: {
				label: "אובייקט",
				gender: "m"
			},
			null: {
				label: "ערך ריק (null)",
				gender: "m"
			},
			undefined: {
				label: "ערך לא מוגדר (undefined)",
				gender: "m"
			},
			symbol: {
				label: "סימבול (Symbol)",
				gender: "m"
			},
			function: {
				label: "פונקציה",
				gender: "f"
			},
			map: {
				label: "מפה (Map)",
				gender: "f"
			},
			set: {
				label: "קבוצה (Set)",
				gender: "f"
			},
			file: {
				label: "קובץ",
				gender: "m"
			},
			promise: {
				label: "Promise",
				gender: "m"
			},
			NaN: {
				label: "NaN",
				gender: "m"
			},
			unknown: {
				label: "ערך לא ידוע",
				gender: "m"
			},
			value: {
				label: "ערך",
				gender: "m"
			}
		};
		const Sizable = {
			string: {
				unit: "תווים",
				shortLabel: "קצר",
				longLabel: "ארוך"
			},
			file: {
				unit: "בייטים",
				shortLabel: "קטן",
				longLabel: "גדול"
			},
			array: {
				unit: "פריטים",
				shortLabel: "קטן",
				longLabel: "גדול"
			},
			set: {
				unit: "פריטים",
				shortLabel: "קטן",
				longLabel: "גדול"
			},
			number: {
				unit: "",
				shortLabel: "קטן",
				longLabel: "גדול"
			}
		};
		const typeEntry = (t) => t ? TypeNames[t] : void 0;
		const typeLabel = (t) => {
			const e = typeEntry(t);
			if (e) return e.label;
			return t !== null && t !== void 0 ? t : TypeNames.unknown.label;
		};
		const withDefinite = (t) => `ה${typeLabel(t)}`;
		const verbFor = (t) => {
			var _e$gender;
			const e = typeEntry(t);
			return ((_e$gender = e === null || e === void 0 ? void 0 : e.gender) !== null && _e$gender !== void 0 ? _e$gender : "m") === "f" ? "צריכה להיות" : "צריך להיות";
		};
		const getSizing = (origin) => {
			var _Sizable$origin;
			if (!origin) return null;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		};
		const FormatDictionary = {
			regex: {
				label: "קלט",
				gender: "m"
			},
			email: {
				label: "כתובת אימייל",
				gender: "f"
			},
			url: {
				label: "כתובת רשת",
				gender: "f"
			},
			emoji: {
				label: "אימוג'י",
				gender: "m"
			},
			uuid: {
				label: "UUID",
				gender: "m"
			},
			nanoid: {
				label: "nanoid",
				gender: "m"
			},
			guid: {
				label: "GUID",
				gender: "m"
			},
			cuid: {
				label: "cuid",
				gender: "m"
			},
			cuid2: {
				label: "cuid2",
				gender: "m"
			},
			ulid: {
				label: "ULID",
				gender: "m"
			},
			xid: {
				label: "XID",
				gender: "m"
			},
			ksuid: {
				label: "KSUID",
				gender: "m"
			},
			datetime: {
				label: "תאריך וזמן ISO",
				gender: "m"
			},
			date: {
				label: "תאריך ISO",
				gender: "m"
			},
			time: {
				label: "זמן ISO",
				gender: "m"
			},
			duration: {
				label: "משך זמן ISO",
				gender: "m"
			},
			ipv4: {
				label: "כתובת IPv4",
				gender: "f"
			},
			ipv6: {
				label: "כתובת IPv6",
				gender: "f"
			},
			cidrv4: {
				label: "טווח IPv4",
				gender: "m"
			},
			cidrv6: {
				label: "טווח IPv6",
				gender: "m"
			},
			base64: {
				label: "מחרוזת בבסיס 64",
				gender: "f"
			},
			base64url: {
				label: "מחרוזת בבסיס 64 לכתובות רשת",
				gender: "f"
			},
			json_string: {
				label: "מחרוזת JSON",
				gender: "f"
			},
			e164: {
				label: "מספר E.164",
				gender: "m"
			},
			jwt: {
				label: "JWT",
				gender: "m"
			},
			ends_with: {
				label: "קלט",
				gender: "m"
			},
			includes: {
				label: "קלט",
				gender: "m"
			},
			lowercase: {
				label: "קלט",
				gender: "m"
			},
			starts_with: {
				label: "קלט",
				gender: "m"
			},
			uppercase: {
				label: "קלט",
				gender: "m"
			}
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary, _ref, _TypeDictionary$recei, _TypeNames$receivedTy;
					const expectedKey = issue.expected;
					const expected = (_TypeDictionary = TypeDictionary[expectedKey !== null && expectedKey !== void 0 ? expectedKey : ""]) !== null && _TypeDictionary !== void 0 ? _TypeDictionary : typeLabel(expectedKey);
					const receivedType = parsedType(issue.input);
					const received = (_ref = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : (_TypeNames$receivedTy = TypeNames[receivedType]) === null || _TypeNames$receivedTy === void 0 ? void 0 : _TypeNames$receivedTy.label) !== null && _ref !== void 0 ? _ref : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `קלט לא תקין: צריך להיות instanceof ${issue.expected}, התקבל ${received}`;
					return `קלט לא תקין: צריך להיות ${expected}, התקבל ${received}`;
				}
				case "invalid_value": {
					if (issue.values.length === 1) return `ערך לא תקין: הערך חייב להיות ${stringifyPrimitive(issue.values[0])}`;
					const stringified = issue.values.map((v) => stringifyPrimitive(v));
					if (issue.values.length === 2) return `ערך לא תקין: האפשרויות המתאימות הן ${stringified[0]} או ${stringified[1]}`;
					const lastValue = stringified[stringified.length - 1];
					return `ערך לא תקין: האפשרויות המתאימות הן ${stringified.slice(0, -1).join(", ")} או ${lastValue}`;
				}
				case "too_big": {
					var _issue$origin, _issue$origin2, _sizing$longLabel2;
					const sizing = getSizing(issue.origin);
					const subject = withDefinite((_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "value");
					if (issue.origin === "string") {
						var _sizing$longLabel, _sizing$unit;
						return `${(_sizing$longLabel = sizing === null || sizing === void 0 ? void 0 : sizing.longLabel) !== null && _sizing$longLabel !== void 0 ? _sizing$longLabel : "ארוך"} מדי: ${subject} צריכה להכיל ${issue.maximum.toString()} ${(_sizing$unit = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : ""} ${issue.inclusive ? "או פחות" : "לכל היותר"}`.trim();
					}
					if (issue.origin === "number") return `גדול מדי: ${subject} צריך להיות ${issue.inclusive ? `קטן או שווה ל-${issue.maximum}` : `קטן מ-${issue.maximum}`}`;
					if (issue.origin === "array" || issue.origin === "set") {
						var _sizing$unit2, _sizing$unit3;
						return `גדול מדי: ${subject} ${issue.origin === "set" ? "צריכה" : "צריך"} להכיל ${issue.inclusive ? `${issue.maximum} ${(_sizing$unit2 = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit2 !== void 0 ? _sizing$unit2 : ""} או פחות` : `פחות מ-${issue.maximum} ${(_sizing$unit3 = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit3 !== void 0 ? _sizing$unit3 : ""}`}`.trim();
					}
					const adj = issue.inclusive ? "<=" : "<";
					const be = verbFor((_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "value");
					if (sizing === null || sizing === void 0 ? void 0 : sizing.unit) return `${sizing.longLabel} מדי: ${subject} ${be} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
					return `${(_sizing$longLabel2 = sizing === null || sizing === void 0 ? void 0 : sizing.longLabel) !== null && _sizing$longLabel2 !== void 0 ? _sizing$longLabel2 : "גדול"} מדי: ${subject} ${be} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _issue$origin3, _issue$origin4, _sizing$shortLabel2;
					const sizing = getSizing(issue.origin);
					const subject = withDefinite((_issue$origin3 = issue.origin) !== null && _issue$origin3 !== void 0 ? _issue$origin3 : "value");
					if (issue.origin === "string") {
						var _sizing$shortLabel, _sizing$unit4;
						return `${(_sizing$shortLabel = sizing === null || sizing === void 0 ? void 0 : sizing.shortLabel) !== null && _sizing$shortLabel !== void 0 ? _sizing$shortLabel : "קצר"} מדי: ${subject} צריכה להכיל ${issue.minimum.toString()} ${(_sizing$unit4 = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit4 !== void 0 ? _sizing$unit4 : ""} ${issue.inclusive ? "או יותר" : "לפחות"}`.trim();
					}
					if (issue.origin === "number") return `קטן מדי: ${subject} צריך להיות ${issue.inclusive ? `גדול או שווה ל-${issue.minimum}` : `גדול מ-${issue.minimum}`}`;
					if (issue.origin === "array" || issue.origin === "set") {
						var _sizing$unit5, _sizing$unit6;
						const verb = issue.origin === "set" ? "צריכה" : "צריך";
						if (issue.minimum === 1 && issue.inclusive) return `קטן מדי: ${subject} ${verb} להכיל ${issue.origin === "set" ? "לפחות פריט אחד" : "לפחות פריט אחד"}`;
						return `קטן מדי: ${subject} ${verb} להכיל ${issue.inclusive ? `${issue.minimum} ${(_sizing$unit5 = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit5 !== void 0 ? _sizing$unit5 : ""} או יותר` : `יותר מ-${issue.minimum} ${(_sizing$unit6 = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit6 !== void 0 ? _sizing$unit6 : ""}`}`.trim();
					}
					const adj = issue.inclusive ? ">=" : ">";
					const be = verbFor((_issue$origin4 = issue.origin) !== null && _issue$origin4 !== void 0 ? _issue$origin4 : "value");
					if (sizing === null || sizing === void 0 ? void 0 : sizing.unit) return `${sizing.shortLabel} מדי: ${subject} ${be} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `${(_sizing$shortLabel2 = sizing === null || sizing === void 0 ? void 0 : sizing.shortLabel) !== null && _sizing$shortLabel2 !== void 0 ? _sizing$shortLabel2 : "קטן"} מדי: ${subject} ${be} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _nounEntry$label, _nounEntry$gender;
					const _issue = issue;
					if (_issue.format === "starts_with") return `המחרוזת חייבת להתחיל ב "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `המחרוזת חייבת להסתיים ב "${_issue.suffix}"`;
					if (_issue.format === "includes") return `המחרוזת חייבת לכלול "${_issue.includes}"`;
					if (_issue.format === "regex") return `המחרוזת חייבת להתאים לתבנית ${_issue.pattern}`;
					const nounEntry = FormatDictionary[_issue.format];
					return `${(_nounEntry$label = nounEntry === null || nounEntry === void 0 ? void 0 : nounEntry.label) !== null && _nounEntry$label !== void 0 ? _nounEntry$label : _issue.format} לא ${((_nounEntry$gender = nounEntry === null || nounEntry === void 0 ? void 0 : nounEntry.gender) !== null && _nounEntry$gender !== void 0 ? _nounEntry$gender : "m") === "f" ? "תקינה" : "תקין"}`;
				}
				case "not_multiple_of": return `מספר לא תקין: חייב להיות מכפלה של ${issue.divisor}`;
				case "unrecognized_keys": return `מפתח${issue.keys.length > 1 ? "ות" : ""} לא מזוה${issue.keys.length > 1 ? "ים" : "ה"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `שדה לא תקין באובייקט`;
				case "invalid_union": return "קלט לא תקין";
				case "invalid_element":
					var _issue$origin5;
					return `ערך לא תקין ב${withDefinite((_issue$origin5 = issue.origin) !== null && _issue$origin5 !== void 0 ? _issue$origin5 : "array")}`;
				default: return `קלט לא תקין`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/hr.js
function hr_default() {
	return { localeError: error$31() };
}
var error$31;
var init_hr = __esmMin((() => {
	init_util();
	error$31 = () => {
		const Sizable = {
			string: {
				unit: "znakova",
				verb: "imati"
			},
			file: {
				unit: "bajtova",
				verb: "imati"
			},
			array: {
				unit: "stavki",
				verb: "imati"
			},
			set: {
				unit: "stavki",
				verb: "imati"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "unos",
			email: "email adresa",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO datum i vrijeme",
			date: "ISO datum",
			time: "ISO vrijeme",
			duration: "ISO trajanje",
			ipv4: "IPv4 adresa",
			ipv6: "IPv6 adresa",
			cidrv4: "IPv4 raspon",
			cidrv6: "IPv6 raspon",
			base64: "base64 kodirani tekst",
			base64url: "base64url kodirani tekst",
			json_string: "JSON tekst",
			e164: "E.164 broj",
			jwt: "JWT",
			template_literal: "unos"
		};
		const TypeDictionary = {
			nan: "NaN",
			string: "tekst",
			number: "broj",
			boolean: "boolean",
			array: "niz",
			object: "objekt",
			set: "skup",
			file: "datoteka",
			date: "datum",
			bigint: "bigint",
			symbol: "simbol",
			undefined: "undefined",
			null: "null",
			function: "funkcija",
			map: "mapa"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Neispravan unos: očekuje se instanceof ${issue.expected}, a primljeno je ${received}`;
					return `Neispravan unos: očekuje se ${expected}, a primljeno je ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Neispravna vrijednost: očekivano ${stringifyPrimitive(issue.values[0])}`;
					return `Neispravna opcija: očekivano jedno od ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _TypeDictionary$issue2, _sizing$unit;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					const origin = (_TypeDictionary$issue2 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue2 !== void 0 ? _TypeDictionary$issue2 : issue.origin;
					if (sizing) return `Preveliko: očekivano da ${origin !== null && origin !== void 0 ? origin : "vrijednost"} ima ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elemenata"}`;
					return `Preveliko: očekivano da ${origin !== null && origin !== void 0 ? origin : "vrijednost"} bude ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _TypeDictionary$issue3;
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					const origin = (_TypeDictionary$issue3 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue3 !== void 0 ? _TypeDictionary$issue3 : issue.origin;
					if (sizing) return `Premalo: očekivano da ${origin} ima ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Premalo: očekivano da ${origin} bude ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Neispravan tekst: mora započinjati s "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Neispravan tekst: mora završavati s "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Neispravan tekst: mora sadržavati "${_issue.includes}"`;
					if (_issue.format === "regex") return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
					return `Neispravna ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Neispravan broj: mora biti višekratnik od ${issue.divisor}`;
				case "unrecognized_keys": return `Neprepoznat${issue.keys.length > 1 ? "i ključevi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key":
					var _TypeDictionary$issue4;
					return `Neispravan ključ u ${(_TypeDictionary$issue4 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue4 !== void 0 ? _TypeDictionary$issue4 : issue.origin}`;
				case "invalid_union": return "Neispravan unos";
				case "invalid_element":
					var _TypeDictionary$issue5;
					return `Neispravna vrijednost u ${(_TypeDictionary$issue5 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue5 !== void 0 ? _TypeDictionary$issue5 : issue.origin}`;
				default: return `Neispravan unos`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/hu.js
function hu_default() {
	return { localeError: error$30() };
}
var error$30;
var init_hu = __esmMin((() => {
	init_util();
	error$30 = () => {
		const Sizable = {
			string: {
				unit: "karakter",
				verb: "legyen"
			},
			file: {
				unit: "byte",
				verb: "legyen"
			},
			array: {
				unit: "elem",
				verb: "legyen"
			},
			set: {
				unit: "elem",
				verb: "legyen"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "bemenet",
			email: "email cím",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO időbélyeg",
			date: "ISO dátum",
			time: "ISO idő",
			duration: "ISO időintervallum",
			ipv4: "IPv4 cím",
			ipv6: "IPv6 cím",
			cidrv4: "IPv4 tartomány",
			cidrv6: "IPv6 tartomány",
			base64: "base64-kódolt string",
			base64url: "base64url-kódolt string",
			json_string: "JSON string",
			e164: "E.164 szám",
			jwt: "JWT",
			template_literal: "bemenet"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "szám",
			array: "tömb"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Érvénytelen bemenet: a várt érték instanceof ${issue.expected}, a kapott érték ${received}`;
					return `Érvénytelen bemenet: a várt érték ${expected}, a kapott érték ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive(issue.values[0])}`;
					return `Érvénytelen opció: valamelyik érték várt ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Túl nagy: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "érték"} mérete túl nagy ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elem"}`;
					return `Túl nagy: a bemeneti érték ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "érték"} túl nagy: ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Túl kicsi: a bemeneti érték ${issue.origin} mérete túl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Túl kicsi: a bemeneti érték ${issue.origin} túl kicsi ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
					if (_issue.format === "ends_with") return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
					if (_issue.format === "includes") return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
					if (_issue.format === "regex") return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
					return `Érvénytelen ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Érvénytelen szám: ${issue.divisor} többszörösének kell lennie`;
				case "unrecognized_keys": return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Érvénytelen kulcs ${issue.origin}`;
				case "invalid_union": return "Érvénytelen bemenet";
				case "invalid_element": return `Érvénytelen érték: ${issue.origin}`;
				default: return `Érvénytelen bemenet`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/hy.js
function getArmenianPlural(count, one, many) {
	return Math.abs(count) === 1 ? one : many;
}
function withDefiniteArticle(word) {
	if (!word) return "";
	const vowels = [
		"ա",
		"ե",
		"ը",
		"ի",
		"ո",
		"ու",
		"օ"
	];
	const lastChar = word[word.length - 1];
	return word + (vowels.includes(lastChar) ? "ն" : "ը");
}
function hy_default() {
	return { localeError: error$29() };
}
var error$29;
var init_hy = __esmMin((() => {
	init_util();
	error$29 = () => {
		const Sizable = {
			string: {
				unit: {
					one: "նշան",
					many: "նշաններ"
				},
				verb: "ունենալ"
			},
			file: {
				unit: {
					one: "բայթ",
					many: "բայթեր"
				},
				verb: "ունենալ"
			},
			array: {
				unit: {
					one: "տարր",
					many: "տարրեր"
				},
				verb: "ունենալ"
			},
			set: {
				unit: {
					one: "տարր",
					many: "տարրեր"
				},
				verb: "ունենալ"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "մուտք",
			email: "էլ. հասցե",
			url: "URL",
			emoji: "էմոջի",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO ամսաթիվ և ժամ",
			date: "ISO ամսաթիվ",
			time: "ISO ժամ",
			duration: "ISO տևողություն",
			ipv4: "IPv4 հասցե",
			ipv6: "IPv6 հասցե",
			cidrv4: "IPv4 միջակայք",
			cidrv6: "IPv6 միջակայք",
			base64: "base64 ձևաչափով տող",
			base64url: "base64url ձևաչափով տող",
			json_string: "JSON տող",
			e164: "E.164 համար",
			jwt: "JWT",
			template_literal: "մուտք"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "թիվ",
			array: "զանգված"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Սխալ մուտքագրում․ սպասվում էր instanceof ${issue.expected}, ստացվել է ${received}`;
					return `Սխալ մուտքագրում․ սպասվում էր ${expected}, ստացվել է ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Սխալ մուտքագրում․ սպասվում էր ${stringifyPrimitive(issue.values[1])}`;
					return `Սխալ տարբերակ․ սպասվում էր հետևյալներից մեկը՝ ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin;
						const unit = getArmenianPlural(Number(issue.maximum), sizing.unit.one, sizing.unit.many);
						return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle((_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "արժեք")} կունենա ${adj}${issue.maximum.toString()} ${unit}`;
					}
					return `Չափազանց մեծ արժեք․ սպասվում է, որ ${withDefiniteArticle((_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "արժեք")} լինի ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						const unit = getArmenianPlural(Number(issue.minimum), sizing.unit.one, sizing.unit.many);
						return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin)} կունենա ${adj}${issue.minimum.toString()} ${unit}`;
					}
					return `Չափազանց փոքր արժեք․ սպասվում է, որ ${withDefiniteArticle(issue.origin)} լինի ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Սխալ տող․ պետք է սկսվի "${_issue.prefix}"-ով`;
					if (_issue.format === "ends_with") return `Սխալ տող․ պետք է ավարտվի "${_issue.suffix}"-ով`;
					if (_issue.format === "includes") return `Սխալ տող․ պետք է պարունակի "${_issue.includes}"`;
					if (_issue.format === "regex") return `Սխալ տող․ պետք է համապատասխանի ${_issue.pattern} ձևաչափին`;
					return `Սխալ ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Սխալ թիվ․ պետք է բազմապատիկ լինի ${issue.divisor}-ի`;
				case "unrecognized_keys": return `Չճանաչված բանալի${issue.keys.length > 1 ? "ներ" : ""}. ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Սխալ բանալի ${withDefiniteArticle(issue.origin)}-ում`;
				case "invalid_union": return "Սխալ մուտքագրում";
				case "invalid_element": return `Սխալ արժեք ${withDefiniteArticle(issue.origin)}-ում`;
				default: return `Սխալ մուտքագրում`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/id.js
function id_default() {
	return { localeError: error$28() };
}
var error$28;
var init_id = __esmMin((() => {
	init_util();
	error$28 = () => {
		const Sizable = {
			string: {
				unit: "karakter",
				verb: "memiliki"
			},
			file: {
				unit: "byte",
				verb: "memiliki"
			},
			array: {
				unit: "item",
				verb: "memiliki"
			},
			set: {
				unit: "item",
				verb: "memiliki"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "alamat email",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "tanggal dan waktu format ISO",
			date: "tanggal format ISO",
			time: "jam format ISO",
			duration: "durasi format ISO",
			ipv4: "alamat IPv4",
			ipv6: "alamat IPv6",
			cidrv4: "rentang alamat IPv4",
			cidrv6: "rentang alamat IPv6",
			base64: "string dengan enkode base64",
			base64url: "string dengan enkode base64url",
			json_string: "string JSON",
			e164: "angka E.164",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Input tidak valid: diharapkan instanceof ${issue.expected}, diterima ${received}`;
					return `Input tidak valid: diharapkan ${expected}, diterima ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Input tidak valid: diharapkan ${stringifyPrimitive(issue.values[0])}`;
					return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Terlalu besar: diharapkan ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "value"} memiliki ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elemen"}`;
					return `Terlalu besar: diharapkan ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "value"} menjadi ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
					if (_issue.format === "includes") return `String tidak valid: harus menyertakan "${_issue.includes}"`;
					if (_issue.format === "regex") return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} tidak valid`;
				}
				case "not_multiple_of": return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
				case "unrecognized_keys": return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Kunci tidak valid di ${issue.origin}`;
				case "invalid_union": return "Input tidak valid";
				case "invalid_element": return `Nilai tidak valid di ${issue.origin}`;
				default: return `Input tidak valid`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/is.js
function is_default() {
	return { localeError: error$27() };
}
var error$27;
var init_is = __esmMin((() => {
	init_util();
	error$27 = () => {
		const Sizable = {
			string: {
				unit: "stafi",
				verb: "að hafa"
			},
			file: {
				unit: "bæti",
				verb: "að hafa"
			},
			array: {
				unit: "hluti",
				verb: "að hafa"
			},
			set: {
				unit: "hluti",
				verb: "að hafa"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "gildi",
			email: "netfang",
			url: "vefslóð",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO dagsetning og tími",
			date: "ISO dagsetning",
			time: "ISO tími",
			duration: "ISO tímalengd",
			ipv4: "IPv4 address",
			ipv6: "IPv6 address",
			cidrv4: "IPv4 range",
			cidrv6: "IPv6 range",
			base64: "base64-encoded strengur",
			base64url: "base64url-encoded strengur",
			json_string: "JSON strengur",
			e164: "E.164 tölugildi",
			jwt: "JWT",
			template_literal: "gildi"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "númer",
			array: "fylki"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera instanceof ${issue.expected}`;
					return `Rangt gildi: Þú slóst inn ${received} þar sem á að vera ${expected}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Rangt gildi: gert ráð fyrir ${stringifyPrimitive(issue.values[0])}`;
					return `Ógilt val: má vera eitt af eftirfarandi ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Of stórt: gert er ráð fyrir að ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "gildi"} hafi ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "hluti"}`;
					return `Of stórt: gert er ráð fyrir að ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "gildi"} sé ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Of lítið: gert er ráð fyrir að ${issue.origin} hafi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Of lítið: gert er ráð fyrir að ${issue.origin} sé ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
					if (_issue.format === "regex") return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
					return `Rangt ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Röng tala: verður að vera margfeldi af ${issue.divisor}`;
				case "unrecognized_keys": return `Óþekkt ${issue.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Rangur lykill í ${issue.origin}`;
				case "invalid_union": return "Rangt gildi";
				case "invalid_element": return `Rangt gildi í ${issue.origin}`;
				default: return `Rangt gildi`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/it.js
function it_default() {
	return { localeError: error$26() };
}
var error$26;
var init_it = __esmMin((() => {
	init_util();
	error$26 = () => {
		const Sizable = {
			string: {
				unit: "caratteri",
				verb: "avere"
			},
			file: {
				unit: "byte",
				verb: "avere"
			},
			array: {
				unit: "elementi",
				verb: "avere"
			},
			set: {
				unit: "elementi",
				verb: "avere"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "indirizzo email",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "data e ora ISO",
			date: "data ISO",
			time: "ora ISO",
			duration: "durata ISO",
			ipv4: "indirizzo IPv4",
			ipv6: "indirizzo IPv6",
			cidrv4: "intervallo IPv4",
			cidrv6: "intervallo IPv6",
			base64: "stringa codificata in base64",
			base64url: "URL codificata in base64",
			json_string: "stringa JSON",
			e164: "numero E.164",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "numero",
			array: "vettore"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Input non valido: atteso instanceof ${issue.expected}, ricevuto ${received}`;
					return `Input non valido: atteso ${expected}, ricevuto ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Input non valido: atteso ${stringifyPrimitive(issue.values[0])}`;
					return `Opzione non valida: atteso uno tra ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Troppo grande: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "valore"} deve avere ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementi"}`;
					return `Troppo grande: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "valore"} deve essere ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Stringa non valida: deve includere "${_issue.includes}"`;
					if (_issue.format === "regex") return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
					return `Invalid ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
				case "unrecognized_keys": return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Chiave non valida in ${issue.origin}`;
				case "invalid_union": return "Input non valido";
				case "invalid_element": return `Valore non valido in ${issue.origin}`;
				default: return `Input non valido`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ja.js
function ja_default() {
	return { localeError: error$25() };
}
var error$25;
var init_ja = __esmMin((() => {
	init_util();
	error$25 = () => {
		const Sizable = {
			string: {
				unit: "文字",
				verb: "である"
			},
			file: {
				unit: "バイト",
				verb: "である"
			},
			array: {
				unit: "要素",
				verb: "である"
			},
			set: {
				unit: "要素",
				verb: "である"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "入力値",
			email: "メールアドレス",
			url: "URL",
			emoji: "絵文字",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO日時",
			date: "ISO日付",
			time: "ISO時刻",
			duration: "ISO期間",
			ipv4: "IPv4アドレス",
			ipv6: "IPv6アドレス",
			cidrv4: "IPv4範囲",
			cidrv6: "IPv6範囲",
			base64: "base64エンコード文字列",
			base64url: "base64urlエンコード文字列",
			json_string: "JSON文字列",
			e164: "E.164番号",
			jwt: "JWT",
			template_literal: "入力値"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "数値",
			array: "配列"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `無効な入力: instanceof ${issue.expected}が期待されましたが、${received}が入力されました`;
					return `無効な入力: ${expected}が期待されましたが、${received}が入力されました`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `無効な入力: ${stringifyPrimitive(issue.values[0])}が期待されました`;
					return `無効な選択: ${joinValues(issue.values, "、")}のいずれかである必要があります`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "以下である" : "より小さい";
					const sizing = getSizing(issue.origin);
					if (sizing) return `大きすぎる値: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "値"}は${issue.maximum.toString()}${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "要素"}${adj}必要があります`;
					return `大きすぎる値: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "値"}は${issue.maximum.toString()}${adj}必要があります`;
				}
				case "too_small": {
					const adj = issue.inclusive ? "以上である" : "より大きい";
					const sizing = getSizing(issue.origin);
					if (sizing) return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${sizing.unit}${adj}必要があります`;
					return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${adj}必要があります`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
					if (_issue.format === "ends_with") return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
					if (_issue.format === "includes") return `無効な文字列: "${_issue.includes}"を含む必要があります`;
					if (_issue.format === "regex") return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
					return `無効な${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `無効な数値: ${issue.divisor}の倍数である必要があります`;
				case "unrecognized_keys": return `認識されていないキー${issue.keys.length > 1 ? "群" : ""}: ${joinValues(issue.keys, "、")}`;
				case "invalid_key": return `${issue.origin}内の無効なキー`;
				case "invalid_union": return "無効な入力";
				case "invalid_element": return `${issue.origin}内の無効な値`;
				default: return `無効な入力`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ka.js
function ka_default() {
	return { localeError: error$24() };
}
var error$24;
var init_ka = __esmMin((() => {
	init_util();
	error$24 = () => {
		const Sizable = {
			string: {
				unit: "სიმბოლო",
				verb: "უნდა შეიცავდეს"
			},
			file: {
				unit: "ბაიტი",
				verb: "უნდა შეიცავდეს"
			},
			array: {
				unit: "ელემენტი",
				verb: "უნდა შეიცავდეს"
			},
			set: {
				unit: "ელემენტი",
				verb: "უნდა შეიცავდეს"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "შეყვანა",
			email: "ელ-ფოსტის მისამართი",
			url: "URL",
			emoji: "ემოჯი",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "თარიღი-დრო",
			date: "თარიღი",
			time: "დრო",
			duration: "ხანგრძლივობა",
			ipv4: "IPv4 მისამართი",
			ipv6: "IPv6 მისამართი",
			cidrv4: "IPv4 დიაპაზონი",
			cidrv6: "IPv6 დიაპაზონი",
			base64: "base64-კოდირებული ველი",
			base64url: "base64url-კოდირებული ველი",
			json_string: "JSON ველი",
			e164: "E.164 ნომერი",
			jwt: "JWT",
			template_literal: "შეყვანა"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "რიცხვი",
			string: "ველი",
			boolean: "ბულეანი",
			function: "ფუნქცია",
			array: "მასივი"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `არასწორი შეყვანა: მოსალოდნელი instanceof ${issue.expected}, მიღებული ${received}`;
					return `არასწორი შეყვანა: მოსალოდნელი ${expected}, მიღებული ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `არასწორი შეყვანა: მოსალოდნელი ${stringifyPrimitive(issue.values[0])}`;
					return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${joinValues(issue.values, "|")}-დან`;
				case "too_big": {
					var _issue$origin, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `ზედმეტად დიდი: მოსალოდნელი ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "მნიშვნელობა"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
					return `ზედმეტად დიდი: მოსალოდნელი ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "მნიშვნელობა"} იყოს ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} იყოს ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `არასწორი ველი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
					if (_issue.format === "ends_with") return `არასწორი ველი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
					if (_issue.format === "includes") return `არასწორი ველი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
					if (_issue.format === "regex") return `არასწორი ველი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
					return `არასწორი ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `არასწორი რიცხვი: უნდა იყოს ${issue.divisor}-ის ჯერადი`;
				case "unrecognized_keys": return `უცნობი გასაღებ${issue.keys.length > 1 ? "ები" : "ი"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `არასწორი გასაღები ${issue.origin}-ში`;
				case "invalid_union": return "არასწორი შეყვანა";
				case "invalid_element": return `არასწორი მნიშვნელობა ${issue.origin}-ში`;
				default: return `არასწორი შეყვანა`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/km.js
function km_default() {
	return { localeError: error$23() };
}
var error$23;
var init_km = __esmMin((() => {
	init_util();
	error$23 = () => {
		const Sizable = {
			string: {
				unit: "តួអក្សរ",
				verb: "គួរមាន"
			},
			file: {
				unit: "បៃ",
				verb: "គួរមាន"
			},
			array: {
				unit: "ធាតុ",
				verb: "គួរមាន"
			},
			set: {
				unit: "ធាតុ",
				verb: "គួរមាន"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ទិន្នន័យបញ្ចូល",
			email: "អាសយដ្ឋានអ៊ីមែល",
			url: "URL",
			emoji: "សញ្ញាអារម្មណ៍",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
			date: "កាលបរិច្ឆេទ ISO",
			time: "ម៉ោង ISO",
			duration: "រយៈពេល ISO",
			ipv4: "អាសយដ្ឋាន IPv4",
			ipv6: "អាសយដ្ឋាន IPv6",
			cidrv4: "ដែនអាសយដ្ឋាន IPv4",
			cidrv6: "ដែនអាសយដ្ឋាន IPv6",
			base64: "ខ្សែអក្សរអ៊ិកូដ base64",
			base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
			json_string: "ខ្សែអក្សរ JSON",
			e164: "លេខ E.164",
			jwt: "JWT",
			template_literal: "ទិន្នន័យបញ្ចូល"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "លេខ",
			array: "អារេ (Array)",
			null: "គ្មានតម្លៃ (null)"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ instanceof ${issue.expected} ប៉ុន្តែទទួលបាន ${received}`;
					return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${expected} ប៉ុន្តែទទួលបាន ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive(issue.values[0])}`;
					return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `ធំពេក៖ ត្រូវការ ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "តម្លៃ"} ${adj} ${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "ធាតុ"}`;
					return `ធំពេក៖ ត្រូវការ ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "តម្លៃ"} ${adj} ${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
					return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
					if (_issue.format === "includes") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
					if (_issue.format === "regex") return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
					return `មិនត្រឹមត្រូវ៖ ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue.divisor}`;
				case "unrecognized_keys": return `រកឃើញសោមិនស្គាល់៖ ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
				case "invalid_union": return `ទិន្នន័យមិនត្រឹមត្រូវ`;
				case "invalid_element": return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
				default: return `ទិន្នន័យមិនត្រឹមត្រូវ`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/kh.js
/** @deprecated Use `km` instead. */
function kh_default() {
	return km_default();
}
var init_kh = __esmMin((() => {
	init_km();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ko.js
function ko_default() {
	return { localeError: error$22() };
}
var error$22;
var init_ko = __esmMin((() => {
	init_util();
	error$22 = () => {
		const Sizable = {
			string: {
				unit: "문자",
				verb: "to have"
			},
			file: {
				unit: "바이트",
				verb: "to have"
			},
			array: {
				unit: "개",
				verb: "to have"
			},
			set: {
				unit: "개",
				verb: "to have"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "입력",
			email: "이메일 주소",
			url: "URL",
			emoji: "이모지",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO 날짜시간",
			date: "ISO 날짜",
			time: "ISO 시간",
			duration: "ISO 기간",
			ipv4: "IPv4 주소",
			ipv6: "IPv6 주소",
			cidrv4: "IPv4 범위",
			cidrv6: "IPv6 범위",
			base64: "base64 인코딩 문자열",
			base64url: "base64url 인코딩 문자열",
			json_string: "JSON 문자열",
			e164: "E.164 번호",
			jwt: "JWT",
			template_literal: "입력"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `잘못된 입력: 예상 타입은 instanceof ${issue.expected}, 받은 타입은 ${received}입니다`;
					return `잘못된 입력: 예상 타입은 ${expected}, 받은 타입은 ${received}입니다`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `잘못된 입력: 값은 ${stringifyPrimitive(issue.values[0])} 이어야 합니다`;
					return `잘못된 옵션: ${joinValues(issue.values, "또는 ")} 중 하나여야 합니다`;
				case "too_big": {
					var _sizing$unit, _issue$origin, _issue$origin2;
					const adj = issue.inclusive ? "이하" : "미만";
					const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
					const sizing = getSizing(issue.origin);
					const unit = (_sizing$unit = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "요소";
					if (sizing) return `${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "값"}이 너무 큽니다: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
					return `${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "값"}이 너무 큽니다: ${issue.maximum.toString()} ${adj}${suffix}`;
				}
				case "too_small": {
					var _sizing$unit2, _issue$origin4;
					const adj = issue.inclusive ? "이상" : "초과";
					const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
					const sizing = getSizing(issue.origin);
					const unit = (_sizing$unit2 = sizing === null || sizing === void 0 ? void 0 : sizing.unit) !== null && _sizing$unit2 !== void 0 ? _sizing$unit2 : "요소";
					if (sizing) {
						var _issue$origin3;
						return `${(_issue$origin3 = issue.origin) !== null && _issue$origin3 !== void 0 ? _issue$origin3 : "값"}이 너무 작습니다: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
					}
					return `${(_issue$origin4 = issue.origin) !== null && _issue$origin4 !== void 0 ? _issue$origin4 : "값"}이 너무 작습니다: ${issue.minimum.toString()} ${adj}${suffix}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
					if (_issue.format === "ends_with") return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
					if (_issue.format === "includes") return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
					if (_issue.format === "regex") return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
					return `잘못된 ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `잘못된 숫자: ${issue.divisor}의 배수여야 합니다`;
				case "unrecognized_keys": return `인식할 수 없는 키: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `잘못된 키: ${issue.origin}`;
				case "invalid_union": return `잘못된 입력`;
				case "invalid_element": return `잘못된 값: ${issue.origin}`;
				default: return `잘못된 입력`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/lt.js
function getUnitTypeFromNumber(number) {
	const abs = Math.abs(number);
	const last = abs % 10;
	const last2 = abs % 100;
	if (last2 >= 11 && last2 <= 19 || last === 0) return "many";
	if (last === 1) return "one";
	return "few";
}
function lt_default() {
	return { localeError: error$21() };
}
var capitalizeFirstCharacter, error$21;
var init_lt = __esmMin((() => {
	init_util();
	capitalizeFirstCharacter = (text) => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	};
	error$21 = () => {
		const Sizable = {
			string: {
				unit: {
					one: "simbolis",
					few: "simboliai",
					many: "simbolių"
				},
				verb: {
					smaller: {
						inclusive: "turi būti ne ilgesnė kaip",
						notInclusive: "turi būti trumpesnė kaip"
					},
					bigger: {
						inclusive: "turi būti ne trumpesnė kaip",
						notInclusive: "turi būti ilgesnė kaip"
					}
				}
			},
			file: {
				unit: {
					one: "baitas",
					few: "baitai",
					many: "baitų"
				},
				verb: {
					smaller: {
						inclusive: "turi būti ne didesnis kaip",
						notInclusive: "turi būti mažesnis kaip"
					},
					bigger: {
						inclusive: "turi būti ne mažesnis kaip",
						notInclusive: "turi būti didesnis kaip"
					}
				}
			},
			array: {
				unit: {
					one: "elementą",
					few: "elementus",
					many: "elementų"
				},
				verb: {
					smaller: {
						inclusive: "turi turėti ne daugiau kaip",
						notInclusive: "turi turėti mažiau kaip"
					},
					bigger: {
						inclusive: "turi turėti ne mažiau kaip",
						notInclusive: "turi turėti daugiau kaip"
					}
				}
			},
			set: {
				unit: {
					one: "elementą",
					few: "elementus",
					many: "elementų"
				},
				verb: {
					smaller: {
						inclusive: "turi turėti ne daugiau kaip",
						notInclusive: "turi turėti mažiau kaip"
					},
					bigger: {
						inclusive: "turi turėti ne mažiau kaip",
						notInclusive: "turi turėti daugiau kaip"
					}
				}
			}
		};
		function getSizing(origin, unitType, inclusive, targetShouldBe) {
			var _Sizable$origin;
			const result = (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
			if (result === null) return result;
			return {
				unit: result.unit[unitType],
				verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
			};
		}
		const FormatDictionary = {
			regex: "įvestis",
			email: "el. pašto adresas",
			url: "URL",
			emoji: "jaustukas",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO data ir laikas",
			date: "ISO data",
			time: "ISO laikas",
			duration: "ISO trukmė",
			ipv4: "IPv4 adresas",
			ipv6: "IPv6 adresas",
			cidrv4: "IPv4 tinklo prefiksas (CIDR)",
			cidrv6: "IPv6 tinklo prefiksas (CIDR)",
			base64: "base64 užkoduota eilutė",
			base64url: "base64url užkoduota eilutė",
			json_string: "JSON eilutė",
			e164: "E.164 numeris",
			jwt: "JWT",
			template_literal: "įvestis"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "skaičius",
			bigint: "sveikasis skaičius",
			string: "eilutė",
			boolean: "loginė reikšmė",
			undefined: "neapibrėžta reikšmė",
			function: "funkcija",
			symbol: "simbolis",
			array: "masyvas",
			object: "objektas",
			null: "nulinė reikšmė"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Gautas tipas ${received}, o tikėtasi - instanceof ${issue.expected}`;
					return `Gautas tipas ${received}, o tikėtasi - ${expected}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Privalo būti ${stringifyPrimitive(issue.values[0])}`;
					return `Privalo būti vienas iš ${joinValues(issue.values, "|")} pasirinkimų`;
				case "too_big": {
					var _TypeDictionary$issue2, _issue$inclusive, _ref, _sizing$unit, _ref2;
					const origin = (_TypeDictionary$issue2 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue2 !== void 0 ? _TypeDictionary$issue2 : issue.origin;
					const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.maximum)), (_issue$inclusive = issue.inclusive) !== null && _issue$inclusive !== void 0 ? _issue$inclusive : false, "smaller");
					if (sizing === null || sizing === void 0 ? void 0 : sizing.verb) return `${capitalizeFirstCharacter((_ref = origin !== null && origin !== void 0 ? origin : issue.origin) !== null && _ref !== void 0 ? _ref : "reikšmė")} ${sizing.verb} ${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementų"}`;
					const adj = issue.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
					return `${capitalizeFirstCharacter((_ref2 = origin !== null && origin !== void 0 ? origin : issue.origin) !== null && _ref2 !== void 0 ? _ref2 : "reikšmė")} turi būti ${adj} ${issue.maximum.toString()} ${sizing === null || sizing === void 0 ? void 0 : sizing.unit}`;
				}
				case "too_small": {
					var _TypeDictionary$issue3, _issue$inclusive2, _ref3, _sizing$unit2, _ref4;
					const origin = (_TypeDictionary$issue3 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue3 !== void 0 ? _TypeDictionary$issue3 : issue.origin;
					const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.minimum)), (_issue$inclusive2 = issue.inclusive) !== null && _issue$inclusive2 !== void 0 ? _issue$inclusive2 : false, "bigger");
					if (sizing === null || sizing === void 0 ? void 0 : sizing.verb) return `${capitalizeFirstCharacter((_ref3 = origin !== null && origin !== void 0 ? origin : issue.origin) !== null && _ref3 !== void 0 ? _ref3 : "reikšmė")} ${sizing.verb} ${issue.minimum.toString()} ${(_sizing$unit2 = sizing.unit) !== null && _sizing$unit2 !== void 0 ? _sizing$unit2 : "elementų"}`;
					const adj = issue.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
					return `${capitalizeFirstCharacter((_ref4 = origin !== null && origin !== void 0 ? origin : issue.origin) !== null && _ref4 !== void 0 ? _ref4 : "reikšmė")} turi būti ${adj} ${issue.minimum.toString()} ${sizing === null || sizing === void 0 ? void 0 : sizing.unit}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Eilutė privalo prasidėti "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Eilutė privalo įtraukti "${_issue.includes}"`;
					if (_issue.format === "regex") return `Eilutė privalo atitikti ${_issue.pattern}`;
					return `Neteisingas ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Skaičius privalo būti ${issue.divisor} kartotinis.`;
				case "unrecognized_keys": return `Neatpažint${issue.keys.length > 1 ? "i" : "as"} rakt${issue.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return "Rastas klaidingas raktas";
				case "invalid_union": return "Klaidinga įvestis";
				case "invalid_element": {
					var _TypeDictionary$issue4, _ref5;
					const origin = (_TypeDictionary$issue4 = TypeDictionary[issue.origin]) !== null && _TypeDictionary$issue4 !== void 0 ? _TypeDictionary$issue4 : issue.origin;
					return `${capitalizeFirstCharacter((_ref5 = origin !== null && origin !== void 0 ? origin : issue.origin) !== null && _ref5 !== void 0 ? _ref5 : "reikšmė")} turi klaidingą įvestį`;
				}
				default: return "Klaidinga įvestis";
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/mk.js
function mk_default() {
	return { localeError: error$20() };
}
var error$20;
var init_mk = __esmMin((() => {
	init_util();
	error$20 = () => {
		const Sizable = {
			string: {
				unit: "знаци",
				verb: "да имаат"
			},
			file: {
				unit: "бајти",
				verb: "да имаат"
			},
			array: {
				unit: "ставки",
				verb: "да имаат"
			},
			set: {
				unit: "ставки",
				verb: "да имаат"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "внес",
			email: "адреса на е-пошта",
			url: "URL",
			emoji: "емоџи",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO датум и време",
			date: "ISO датум",
			time: "ISO време",
			duration: "ISO времетраење",
			ipv4: "IPv4 адреса",
			ipv6: "IPv6 адреса",
			cidrv4: "IPv4 опсег",
			cidrv6: "IPv6 опсег",
			base64: "base64-енкодирана низа",
			base64url: "base64url-енкодирана низа",
			json_string: "JSON низа",
			e164: "E.164 број",
			jwt: "JWT",
			template_literal: "внес"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "број",
			array: "низа"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Грешен внес: се очекува instanceof ${issue.expected}, примено ${received}`;
					return `Грешен внес: се очекува ${expected}, примено ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
					return `Грешана опција: се очекува една ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Премногу голем: се очекува ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "вредноста"} да има ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "елементи"}`;
					return `Премногу голем: се очекува ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "вредноста"} да биде ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Премногу мал: се очекува ${issue.origin} да има ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Премногу мал: се очекува ${issue.origin} да биде ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
					if (_issue.format === "regex") return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
					return `Invalid ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Грешен број: мора да биде делив со ${issue.divisor}`;
				case "unrecognized_keys": return `${issue.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Грешен клуч во ${issue.origin}`;
				case "invalid_union": return "Грешен внес";
				case "invalid_element": return `Грешна вредност во ${issue.origin}`;
				default: return `Грешен внес`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ms.js
function ms_default() {
	return { localeError: error$19() };
}
var error$19;
var init_ms = __esmMin((() => {
	init_util();
	error$19 = () => {
		const Sizable = {
			string: {
				unit: "aksara",
				verb: "mempunyai"
			},
			file: {
				unit: "bait",
				verb: "mempunyai"
			},
			array: {
				unit: "elemen",
				verb: "mempunyai"
			},
			set: {
				unit: "elemen",
				verb: "mempunyai"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "alamat e-mel",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "tarikh masa ISO",
			date: "tarikh ISO",
			time: "masa ISO",
			duration: "tempoh ISO",
			ipv4: "alamat IPv4",
			ipv6: "alamat IPv6",
			cidrv4: "julat IPv4",
			cidrv6: "julat IPv6",
			base64: "string dikodkan base64",
			base64url: "string dikodkan base64url",
			json_string: "string JSON",
			e164: "nombor E.164",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "nombor"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Input tidak sah: dijangka instanceof ${issue.expected}, diterima ${received}`;
					return `Input tidak sah: dijangka ${expected}, diterima ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Input tidak sah: dijangka ${stringifyPrimitive(issue.values[0])}`;
					return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Terlalu besar: dijangka ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elemen"}`;
					return `Terlalu besar: dijangka ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "nilai"} adalah ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
					if (_issue.format === "includes") return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
					if (_issue.format === "regex") return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} tidak sah`;
				}
				case "not_multiple_of": return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
				case "unrecognized_keys": return `Kunci tidak dikenali: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Kunci tidak sah dalam ${issue.origin}`;
				case "invalid_union": return "Input tidak sah";
				case "invalid_element": return `Nilai tidak sah dalam ${issue.origin}`;
				default: return `Input tidak sah`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/nl.js
function nl_default() {
	return { localeError: error$18() };
}
var error$18;
var init_nl = __esmMin((() => {
	init_util();
	error$18 = () => {
		const Sizable = {
			string: {
				unit: "tekens",
				verb: "heeft"
			},
			file: {
				unit: "bytes",
				verb: "heeft"
			},
			array: {
				unit: "elementen",
				verb: "heeft"
			},
			set: {
				unit: "elementen",
				verb: "heeft"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "invoer",
			email: "emailadres",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO datum en tijd",
			date: "ISO datum",
			time: "ISO tijd",
			duration: "ISO duur",
			ipv4: "IPv4-adres",
			ipv6: "IPv6-adres",
			cidrv4: "IPv4-bereik",
			cidrv6: "IPv6-bereik",
			base64: "base64-gecodeerde tekst",
			base64url: "base64 URL-gecodeerde tekst",
			json_string: "JSON string",
			e164: "E.164-nummer",
			jwt: "JWT",
			template_literal: "invoer"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "getal"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Ongeldige invoer: verwacht instanceof ${issue.expected}, ontving ${received}`;
					return `Ongeldige invoer: verwacht ${expected}, ontving ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue.values[0])}`;
					return `Ongeldige optie: verwacht één van ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					const longName = issue.origin === "date" ? "laat" : issue.origin === "string" ? "lang" : "groot";
					if (sizing) return `Te ${longName}: verwacht dat ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "waarde"} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementen"} ${sizing.verb}`;
					return `Te ${longName}: verwacht dat ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "waarde"} ${adj}${issue.maximum.toString()} is`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					const shortName = issue.origin === "date" ? "vroeg" : issue.origin === "string" ? "kort" : "klein";
					if (sizing) return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
					return `Te ${shortName}: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} is`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
					if (_issue.format === "ends_with") return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
					if (_issue.format === "includes") return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
					if (_issue.format === "regex") return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
					return `Ongeldig: ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Ongeldig getal: moet een veelvoud van ${issue.divisor} zijn`;
				case "unrecognized_keys": return `Onbekende key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Ongeldige key in ${issue.origin}`;
				case "invalid_union": return "Ongeldige invoer";
				case "invalid_element": return `Ongeldige waarde in ${issue.origin}`;
				default: return `Ongeldige invoer`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/no.js
function no_default() {
	return { localeError: error$17() };
}
var error$17;
var init_no = __esmMin((() => {
	init_util();
	error$17 = () => {
		const Sizable = {
			string: {
				unit: "tegn",
				verb: "å ha"
			},
			file: {
				unit: "bytes",
				verb: "å ha"
			},
			array: {
				unit: "elementer",
				verb: "å inneholde"
			},
			set: {
				unit: "elementer",
				verb: "å inneholde"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "input",
			email: "e-postadresse",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO dato- og klokkeslett",
			date: "ISO-dato",
			time: "ISO-klokkeslett",
			duration: "ISO-varighet",
			ipv4: "IPv4-område",
			ipv6: "IPv6-område",
			cidrv4: "IPv4-spekter",
			cidrv6: "IPv6-spekter",
			base64: "base64-enkodet streng",
			base64url: "base64url-enkodet streng",
			json_string: "JSON-streng",
			e164: "E.164-nummer",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "tall",
			array: "liste"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Ugyldig input: forventet instanceof ${issue.expected}, fikk ${received}`;
					return `Ugyldig input: forventet ${expected}, fikk ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Ugyldig verdi: forventet ${stringifyPrimitive(issue.values[0])}`;
					return `Ugyldig valg: forventet en av ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `For stor(t): forventet ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "value"} til å ha ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementer"}`;
					return `For stor(t): forventet ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "value"} til å ha ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ugyldig streng: må starte med "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Ugyldig streng: må ende med "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Ugyldig streng: må inneholde "${_issue.includes}"`;
					if (_issue.format === "regex") return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
					return `Ugyldig ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Ugyldig tall: må være et multiplum av ${issue.divisor}`;
				case "unrecognized_keys": return `${issue.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Ugyldig nøkkel i ${issue.origin}`;
				case "invalid_union": return "Ugyldig input";
				case "invalid_element": return `Ugyldig verdi i ${issue.origin}`;
				default: return `Ugyldig input`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ota.js
function ota_default() {
	return { localeError: error$16() };
}
var error$16;
var init_ota = __esmMin((() => {
	init_util();
	error$16 = () => {
		const Sizable = {
			string: {
				unit: "harf",
				verb: "olmalıdır"
			},
			file: {
				unit: "bayt",
				verb: "olmalıdır"
			},
			array: {
				unit: "unsur",
				verb: "olmalıdır"
			},
			set: {
				unit: "unsur",
				verb: "olmalıdır"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "giren",
			email: "epostagâh",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO hengâmı",
			date: "ISO tarihi",
			time: "ISO zamanı",
			duration: "ISO müddeti",
			ipv4: "IPv4 nişânı",
			ipv6: "IPv6 nişânı",
			cidrv4: "IPv4 menzili",
			cidrv6: "IPv6 menzili",
			base64: "base64-şifreli metin",
			base64url: "base64url-şifreli metin",
			json_string: "JSON metin",
			e164: "E.164 sayısı",
			jwt: "JWT",
			template_literal: "giren"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "numara",
			array: "saf",
			null: "gayb"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Fâsit giren: umulan instanceof ${issue.expected}, alınan ${received}`;
					return `Fâsit giren: umulan ${expected}, alınan ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Fâsit giren: umulan ${stringifyPrimitive(issue.values[0])}`;
					return `Fâsit tercih: mûteberler ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Fazla büyük: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "value"}, ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elements"} sahip olmalıydı.`;
					return `Fazla büyük: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "value"}, ${adj}${issue.maximum.toString()} olmalıydı.`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
					return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} olmalıydı.`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
					if (_issue.format === "ends_with") return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
					if (_issue.format === "includes") return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
					if (_issue.format === "regex") return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
					return `Fâsit ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Fâsit sayı: ${issue.divisor} katı olmalıydı.`;
				case "unrecognized_keys": return `Tanınmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `${issue.origin} için tanınmayan anahtar var.`;
				case "invalid_union": return "Giren tanınamadı.";
				case "invalid_element": return `${issue.origin} için tanınmayan kıymet var.`;
				default: return `Kıymet tanınamadı.`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ps.js
function ps_default() {
	return { localeError: error$15() };
}
var error$15;
var init_ps = __esmMin((() => {
	init_util();
	error$15 = () => {
		const Sizable = {
			string: {
				unit: "توکي",
				verb: "ولري"
			},
			file: {
				unit: "بایټس",
				verb: "ولري"
			},
			array: {
				unit: "توکي",
				verb: "ولري"
			},
			set: {
				unit: "توکي",
				verb: "ولري"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ورودي",
			email: "بریښنالیک",
			url: "یو آر ال",
			emoji: "ایموجي",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "نیټه او وخت",
			date: "نېټه",
			time: "وخت",
			duration: "موده",
			ipv4: "د IPv4 پته",
			ipv6: "د IPv6 پته",
			cidrv4: "د IPv4 ساحه",
			cidrv6: "د IPv6 ساحه",
			base64: "base64-encoded متن",
			base64url: "base64url-encoded متن",
			json_string: "JSON متن",
			e164: "د E.164 شمېره",
			jwt: "JWT",
			template_literal: "ورودي"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "عدد",
			array: "ارې"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `ناسم ورودي: باید instanceof ${issue.expected} وای, مګر ${received} ترلاسه شو`;
					return `ناسم ورودي: باید ${expected} وای, مګر ${received} ترلاسه شو`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `ناسم ورودي: باید ${stringifyPrimitive(issue.values[0])} وای`;
					return `ناسم انتخاب: باید یو له ${joinValues(issue.values, "|")} څخه وای`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin, _sizing$unit;
						return `ډیر لوی: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "ارزښت"} باید ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "عنصرونه"} ولري`;
					}
					return `ډیر لوی: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "ارزښت"} باید ${adj}${issue.maximum.toString()} وي`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} ولري`;
					return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} وي`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
					if (_issue.format === "ends_with") return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
					if (_issue.format === "includes") return `ناسم متن: باید "${_issue.includes}" ولري`;
					if (_issue.format === "regex") return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} ناسم دی`;
				}
				case "not_multiple_of": return `ناسم عدد: باید د ${issue.divisor} مضرب وي`;
				case "unrecognized_keys": return `ناسم ${issue.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `ناسم کلیډ په ${issue.origin} کې`;
				case "invalid_union": return `ناسمه ورودي`;
				case "invalid_element": return `ناسم عنصر په ${issue.origin} کې`;
				default: return `ناسمه ورودي`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/pl.js
function pl_default() {
	return { localeError: error$14() };
}
var error$14;
var init_pl = __esmMin((() => {
	init_util();
	error$14 = () => {
		const Sizable = {
			string: {
				unit: "znaków",
				verb: "mieć"
			},
			file: {
				unit: "bajtów",
				verb: "mieć"
			},
			array: {
				unit: "elementów",
				verb: "mieć"
			},
			set: {
				unit: "elementów",
				verb: "mieć"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "wyrażenie",
			email: "adres email",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "data i godzina w formacie ISO",
			date: "data w formacie ISO",
			time: "godzina w formacie ISO",
			duration: "czas trwania ISO",
			ipv4: "adres IPv4",
			ipv6: "adres IPv6",
			cidrv4: "zakres IPv4",
			cidrv6: "zakres IPv6",
			base64: "ciąg znaków zakodowany w formacie base64",
			base64url: "ciąg znaków zakodowany w formacie base64url",
			json_string: "ciąg znaków w formacie JSON",
			e164: "liczba E.164",
			jwt: "JWT",
			template_literal: "wejście"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "liczba",
			array: "tablica"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Nieprawidłowe dane wejściowe: oczekiwano instanceof ${issue.expected}, otrzymano ${received}`;
					return `Nieprawidłowe dane wejściowe: oczekiwano ${expected}, otrzymano ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive(issue.values[0])}`;
					return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin, _sizing$unit;
						return `Za duża wartość: oczekiwano, że ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "wartość"} będzie mieć ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementów"}`;
					}
					return `Zbyt duż(y/a/e): oczekiwano, że ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "wartość"} będzie wynosić ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _issue$origin4;
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin3, _sizing$unit2;
						return `Za mała wartość: oczekiwano, że ${(_issue$origin3 = issue.origin) !== null && _issue$origin3 !== void 0 ? _issue$origin3 : "wartość"} będzie mieć ${adj}${issue.minimum.toString()} ${(_sizing$unit2 = sizing.unit) !== null && _sizing$unit2 !== void 0 ? _sizing$unit2 : "elementów"}`;
					}
					return `Zbyt mał(y/a/e): oczekiwano, że ${(_issue$origin4 = issue.origin) !== null && _issue$origin4 !== void 0 ? _issue$origin4 : "wartość"} będzie wynosić ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
					if (_issue.format === "regex") return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
					return `Nieprawidłow(y/a/e) ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Nieprawidłowa liczba: musi być wielokrotnością ${issue.divisor}`;
				case "unrecognized_keys": return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Nieprawidłowy klucz w ${issue.origin}`;
				case "invalid_union": return "Nieprawidłowe dane wejściowe";
				case "invalid_element": return `Nieprawidłowa wartość w ${issue.origin}`;
				default: return `Nieprawidłowe dane wejściowe`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/pt.js
function pt_default() {
	return { localeError: error$13() };
}
var error$13;
var init_pt = __esmMin((() => {
	init_util();
	error$13 = () => {
		const Sizable = {
			string: {
				unit: "caracteres",
				verb: "ter"
			},
			file: {
				unit: "bytes",
				verb: "ter"
			},
			array: {
				unit: "itens",
				verb: "ter"
			},
			set: {
				unit: "itens",
				verb: "ter"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "padrão",
			email: "endereço de e-mail",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "data e hora ISO",
			date: "data ISO",
			time: "hora ISO",
			duration: "duração ISO",
			ipv4: "endereço IPv4",
			ipv6: "endereço IPv6",
			cidrv4: "faixa de IPv4",
			cidrv6: "faixa de IPv6",
			base64: "texto codificado em base64",
			base64url: "URL codificada em base64",
			json_string: "texto JSON",
			e164: "número E.164",
			jwt: "JWT",
			template_literal: "entrada"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "número",
			null: "nulo"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Tipo inválido: esperado instanceof ${issue.expected}, recebido ${received}`;
					return `Tipo inválido: esperado ${expected}, recebido ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Entrada inválida: esperado ${stringifyPrimitive(issue.values[0])}`;
					return `Opção inválida: esperada uma das ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Muito grande: esperado que ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "valor"} tivesse ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementos"}`;
					return `Muito grande: esperado que ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "valor"} fosse ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Muito pequeno: esperado que ${issue.origin} tivesse ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Muito pequeno: esperado que ${issue.origin} fosse ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Texto inválido: deve começar com "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Texto inválido: deve terminar com "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Texto inválido: deve incluir "${_issue.includes}"`;
					if (_issue.format === "regex") return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} inválido`;
				}
				case "not_multiple_of": return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
				case "unrecognized_keys": return `Chave${issue.keys.length > 1 ? "s" : ""} desconhecida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Chave inválida em ${issue.origin}`;
				case "invalid_union": return "Entrada inválida";
				case "invalid_element": return `Valor inválido em ${issue.origin}`;
				default: return `Campo inválido`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ru.js
function getRussianPlural(count, one, few, many) {
	const absCount = Math.abs(count);
	const lastDigit = absCount % 10;
	const lastTwoDigits = absCount % 100;
	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return many;
	if (lastDigit === 1) return one;
	if (lastDigit >= 2 && lastDigit <= 4) return few;
	return many;
}
function ru_default() {
	return { localeError: error$12() };
}
var error$12;
var init_ru = __esmMin((() => {
	init_util();
	error$12 = () => {
		const Sizable = {
			string: {
				unit: {
					one: "символ",
					few: "символа",
					many: "символов"
				},
				verb: "иметь"
			},
			file: {
				unit: {
					one: "байт",
					few: "байта",
					many: "байт"
				},
				verb: "иметь"
			},
			array: {
				unit: {
					one: "элемент",
					few: "элемента",
					many: "элементов"
				},
				verb: "иметь"
			},
			set: {
				unit: {
					one: "элемент",
					few: "элемента",
					many: "элементов"
				},
				verb: "иметь"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ввод",
			email: "email адрес",
			url: "URL",
			emoji: "эмодзи",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO дата и время",
			date: "ISO дата",
			time: "ISO время",
			duration: "ISO длительность",
			ipv4: "IPv4 адрес",
			ipv6: "IPv6 адрес",
			cidrv4: "IPv4 диапазон",
			cidrv6: "IPv6 диапазон",
			base64: "строка в формате base64",
			base64url: "строка в формате base64url",
			json_string: "JSON строка",
			e164: "номер E.164",
			jwt: "JWT",
			template_literal: "ввод"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "число",
			array: "массив"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Неверный ввод: ожидалось instanceof ${issue.expected}, получено ${received}`;
					return `Неверный ввод: ожидалось ${expected}, получено ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Неверный ввод: ожидалось ${stringifyPrimitive(issue.values[0])}`;
					return `Неверный вариант: ожидалось одно из ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin;
						const unit = getRussianPlural(Number(issue.maximum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
						return `Слишком большое значение: ожидалось, что ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "значение"} будет иметь ${adj}${issue.maximum.toString()} ${unit}`;
					}
					return `Слишком большое значение: ожидалось, что ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "значение"} будет ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						const unit = getRussianPlural(Number(issue.minimum), sizing.unit.one, sizing.unit.few, sizing.unit.many);
						return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет иметь ${adj}${issue.minimum.toString()} ${unit}`;
					}
					return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Неверная строка: должна содержать "${_issue.includes}"`;
					if (_issue.format === "regex") return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
					return `Неверный ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Неверное число: должно быть кратным ${issue.divisor}`;
				case "unrecognized_keys": return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${issue.keys.length > 1 ? "и" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Неверный ключ в ${issue.origin}`;
				case "invalid_union": return "Неверные входные данные";
				case "invalid_element": return `Неверное значение в ${issue.origin}`;
				default: return `Неверные входные данные`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/sl.js
function sl_default() {
	return { localeError: error$11() };
}
var error$11;
var init_sl = __esmMin((() => {
	init_util();
	error$11 = () => {
		const Sizable = {
			string: {
				unit: "znakov",
				verb: "imeti"
			},
			file: {
				unit: "bajtov",
				verb: "imeti"
			},
			array: {
				unit: "elementov",
				verb: "imeti"
			},
			set: {
				unit: "elementov",
				verb: "imeti"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "vnos",
			email: "e-poštni naslov",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO datum in čas",
			date: "ISO datum",
			time: "ISO čas",
			duration: "ISO trajanje",
			ipv4: "IPv4 naslov",
			ipv6: "IPv6 naslov",
			cidrv4: "obseg IPv4",
			cidrv6: "obseg IPv6",
			base64: "base64 kodiran niz",
			base64url: "base64url kodiran niz",
			json_string: "JSON niz",
			e164: "E.164 številka",
			jwt: "JWT",
			template_literal: "vnos"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "število",
			array: "tabela"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Neveljaven vnos: pričakovano instanceof ${issue.expected}, prejeto ${received}`;
					return `Neveljaven vnos: pričakovano ${expected}, prejeto ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Neveljaven vnos: pričakovano ${stringifyPrimitive(issue.values[0])}`;
					return `Neveljavna možnost: pričakovano eno izmed ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Preveliko: pričakovano, da bo ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "vrednost"} imelo ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "elementov"}`;
					return `Preveliko: pričakovano, da bo ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "vrednost"} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Premajhno: pričakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Premajhno: pričakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
					if (_issue.format === "regex") return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
					return `Neveljaven ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Neveljavno število: mora biti večkratnik ${issue.divisor}`;
				case "unrecognized_keys": return `Neprepoznan${issue.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Neveljaven ključ v ${issue.origin}`;
				case "invalid_union": return "Neveljaven vnos";
				case "invalid_element": return `Neveljavna vrednost v ${issue.origin}`;
				default: return "Neveljaven vnos";
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/sv.js
function sv_default() {
	return { localeError: error$10() };
}
var error$10;
var init_sv = __esmMin((() => {
	init_util();
	error$10 = () => {
		const Sizable = {
			string: {
				unit: "tecken",
				verb: "att ha"
			},
			file: {
				unit: "bytes",
				verb: "att ha"
			},
			array: {
				unit: "objekt",
				verb: "att innehålla"
			},
			set: {
				unit: "objekt",
				verb: "att innehålla"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "reguljärt uttryck",
			email: "e-postadress",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO-datum och tid",
			date: "ISO-datum",
			time: "ISO-tid",
			duration: "ISO-varaktighet",
			ipv4: "IPv4-intervall",
			ipv6: "IPv6-intervall",
			cidrv4: "IPv4-spektrum",
			cidrv6: "IPv6-spektrum",
			base64: "base64-kodad sträng",
			base64url: "base64url-kodad sträng",
			json_string: "JSON-sträng",
			e164: "E.164-nummer",
			jwt: "JWT",
			template_literal: "mall-literal"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "antal",
			array: "lista"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Ogiltig inmatning: förväntat instanceof ${issue.expected}, fick ${received}`;
					return `Ogiltig inmatning: förväntat ${expected}, fick ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Ogiltig inmatning: förväntat ${stringifyPrimitive(issue.values[0])}`;
					return `Ogiltigt val: förväntade en av ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin, _sizing$unit;
						return `För stor(t): förväntade ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "värdet"} att ha ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "element"}`;
					}
					return `För stor(t): förväntat ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "värdet"} att ha ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					var _issue$origin4;
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin3;
						return `För lite(t): förväntade ${(_issue$origin3 = issue.origin) !== null && _issue$origin3 !== void 0 ? _issue$origin3 : "värdet"} att ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					}
					return `För lite(t): förväntade ${(_issue$origin4 = issue.origin) !== null && _issue$origin4 !== void 0 ? _issue$origin4 : "värdet"} att ha ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
					if (_issue.format === "regex") return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
					return `Ogiltig(t) ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Ogiltigt tal: måste vara en multipel av ${issue.divisor}`;
				case "unrecognized_keys": return `${issue.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key":
					var _issue$origin5;
					return `Ogiltig nyckel i ${(_issue$origin5 = issue.origin) !== null && _issue$origin5 !== void 0 ? _issue$origin5 : "värdet"}`;
				case "invalid_union": return "Ogiltig input";
				case "invalid_element":
					var _issue$origin6;
					return `Ogiltigt värde i ${(_issue$origin6 = issue.origin) !== null && _issue$origin6 !== void 0 ? _issue$origin6 : "värdet"}`;
				default: return `Ogiltig input`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ta.js
function ta_default() {
	return { localeError: error$9() };
}
var error$9;
var init_ta = __esmMin((() => {
	init_util();
	error$9 = () => {
		const Sizable = {
			string: {
				unit: "எழுத்துக்கள்",
				verb: "கொண்டிருக்க வேண்டும்"
			},
			file: {
				unit: "பைட்டுகள்",
				verb: "கொண்டிருக்க வேண்டும்"
			},
			array: {
				unit: "உறுப்புகள்",
				verb: "கொண்டிருக்க வேண்டும்"
			},
			set: {
				unit: "உறுப்புகள்",
				verb: "கொண்டிருக்க வேண்டும்"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "உள்ளீடு",
			email: "மின்னஞ்சல் முகவரி",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO தேதி நேரம்",
			date: "ISO தேதி",
			time: "ISO நேரம்",
			duration: "ISO கால அளவு",
			ipv4: "IPv4 முகவரி",
			ipv6: "IPv6 முகவரி",
			cidrv4: "IPv4 வரம்பு",
			cidrv6: "IPv6 வரம்பு",
			base64: "base64-encoded சரம்",
			base64url: "base64url-encoded சரம்",
			json_string: "JSON சரம்",
			e164: "E.164 எண்",
			jwt: "JWT",
			template_literal: "input"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "எண்",
			array: "அணி",
			null: "வெறுமை"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது instanceof ${issue.expected}, பெறப்பட்டது ${received}`;
					return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${expected}, பெறப்பட்டது ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive(issue.values[0])}`;
					return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues(issue.values, "|")} இல் ஒன்று`;
				case "too_big": {
					var _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) {
						var _issue$origin, _sizing$unit;
						return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "மதிப்பு"} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
					}
					return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "மதிப்பு"} ${adj}${issue.maximum.toString()} ஆக இருக்க வேண்டும்`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`;
					return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ஆக இருக்க வேண்டும்`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
					if (_issue.format === "ends_with") return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
					if (_issue.format === "includes") return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
					if (_issue.format === "regex") return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
					return `தவறான ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `தவறான எண்: ${issue.divisor} இன் பலமாக இருக்க வேண்டும்`;
				case "unrecognized_keys": return `அடையாளம் தெரியாத விசை${issue.keys.length > 1 ? "கள்" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `${issue.origin} இல் தவறான விசை`;
				case "invalid_union": return "தவறான உள்ளீடு";
				case "invalid_element": return `${issue.origin} இல் தவறான மதிப்பு`;
				default: return `தவறான உள்ளீடு`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/th.js
function th_default() {
	return { localeError: error$8() };
}
var error$8;
var init_th = __esmMin((() => {
	init_util();
	error$8 = () => {
		const Sizable = {
			string: {
				unit: "ตัวอักษร",
				verb: "ควรมี"
			},
			file: {
				unit: "ไบต์",
				verb: "ควรมี"
			},
			array: {
				unit: "รายการ",
				verb: "ควรมี"
			},
			set: {
				unit: "รายการ",
				verb: "ควรมี"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ข้อมูลที่ป้อน",
			email: "ที่อยู่อีเมล",
			url: "URL",
			emoji: "อิโมจิ",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "วันที่เวลาแบบ ISO",
			date: "วันที่แบบ ISO",
			time: "เวลาแบบ ISO",
			duration: "ช่วงเวลาแบบ ISO",
			ipv4: "ที่อยู่ IPv4",
			ipv6: "ที่อยู่ IPv6",
			cidrv4: "ช่วง IP แบบ IPv4",
			cidrv6: "ช่วง IP แบบ IPv6",
			base64: "ข้อความแบบ Base64",
			base64url: "ข้อความแบบ Base64 สำหรับ URL",
			json_string: "ข้อความแบบ JSON",
			e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
			jwt: "โทเคน JWT",
			template_literal: "ข้อมูลที่ป้อน"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "ตัวเลข",
			array: "อาร์เรย์ (Array)",
			null: "ไม่มีค่า (null)"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น instanceof ${issue.expected} แต่ได้รับ ${received}`;
					return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${expected} แต่ได้รับ ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive(issue.values[0])}`;
					return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "ไม่เกิน" : "น้อยกว่า";
					const sizing = getSizing(issue.origin);
					if (sizing) return `เกินกำหนด: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "ค่า"} ควรมี${adj} ${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "รายการ"}`;
					return `เกินกำหนด: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "ค่า"} ควรมี${adj} ${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? "อย่างน้อย" : "มากกว่า";
					const sizing = getSizing(issue.origin);
					if (sizing) return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()} ${sizing.unit}`;
					return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
					if (_issue.format === "includes") return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
					if (_issue.format === "regex") return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
					return `รูปแบบไม่ถูกต้อง: ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue.divisor} ได้ลงตัว`;
				case "unrecognized_keys": return `พบคีย์ที่ไม่รู้จัก: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `คีย์ไม่ถูกต้องใน ${issue.origin}`;
				case "invalid_union": return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
				case "invalid_element": return `ข้อมูลไม่ถูกต้องใน ${issue.origin}`;
				default: return `ข้อมูลไม่ถูกต้อง`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/tr.js
function tr_default() {
	return { localeError: error$7() };
}
var error$7;
var init_tr = __esmMin((() => {
	init_util();
	error$7 = () => {
		const Sizable = {
			string: {
				unit: "karakter",
				verb: "olmalı"
			},
			file: {
				unit: "bayt",
				verb: "olmalı"
			},
			array: {
				unit: "öğe",
				verb: "olmalı"
			},
			set: {
				unit: "öğe",
				verb: "olmalı"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "girdi",
			email: "e-posta adresi",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO tarih ve saat",
			date: "ISO tarih",
			time: "ISO saat",
			duration: "ISO süre",
			ipv4: "IPv4 adresi",
			ipv6: "IPv6 adresi",
			cidrv4: "IPv4 aralığı",
			cidrv6: "IPv6 aralığı",
			base64: "base64 ile şifrelenmiş metin",
			base64url: "base64url ile şifrelenmiş metin",
			json_string: "JSON dizesi",
			e164: "E.164 sayısı",
			jwt: "JWT",
			template_literal: "Şablon dizesi"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Geçersiz değer: beklenen instanceof ${issue.expected}, alınan ${received}`;
					return `Geçersiz değer: beklenen ${expected}, alınan ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Geçersiz değer: beklenen ${stringifyPrimitive(issue.values[0])}`;
					return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Çok büyük: beklenen ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "değer"} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "öğe"}`;
					return `Çok büyük: beklenen ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "değer"} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
					if (_issue.format === "ends_with") return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
					if (_issue.format === "includes") return `Geçersiz metin: "${_issue.includes}" içermeli`;
					if (_issue.format === "regex") return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
					return `Geçersiz ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Geçersiz sayı: ${issue.divisor} ile tam bölünebilmeli`;
				case "unrecognized_keys": return `Tanınmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `${issue.origin} içinde geçersiz anahtar`;
				case "invalid_union": return "Geçersiz değer";
				case "invalid_element": return `${issue.origin} içinde geçersiz değer`;
				default: return `Geçersiz değer`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/uk.js
function uk_default() {
	return { localeError: error$6() };
}
var error$6;
var init_uk = __esmMin((() => {
	init_util();
	error$6 = () => {
		const Sizable = {
			string: {
				unit: "символів",
				verb: "матиме"
			},
			file: {
				unit: "байтів",
				verb: "матиме"
			},
			array: {
				unit: "елементів",
				verb: "матиме"
			},
			set: {
				unit: "елементів",
				verb: "матиме"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "вхідні дані",
			email: "адреса електронної пошти",
			url: "URL",
			emoji: "емодзі",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "дата та час ISO",
			date: "дата ISO",
			time: "час ISO",
			duration: "тривалість ISO",
			ipv4: "адреса IPv4",
			ipv6: "адреса IPv6",
			cidrv4: "діапазон IPv4",
			cidrv6: "діапазон IPv6",
			base64: "рядок у кодуванні base64",
			base64url: "рядок у кодуванні base64url",
			json_string: "рядок JSON",
			e164: "номер E.164",
			jwt: "JWT",
			template_literal: "вхідні дані"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "число",
			array: "масив"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Неправильні вхідні дані: очікується instanceof ${issue.expected}, отримано ${received}`;
					return `Неправильні вхідні дані: очікується ${expected}, отримано ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Неправильні вхідні дані: очікується ${stringifyPrimitive(issue.values[0])}`;
					return `Неправильна опція: очікується одне з ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Занадто велике: очікується, що ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "значення"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "елементів"}`;
					return `Занадто велике: очікується, що ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "значення"} буде ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Занадто мале: очікується, що ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Занадто мале: очікується, що ${issue.origin} буде ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Неправильний рядок: повинен містити "${_issue.includes}"`;
					if (_issue.format === "regex") return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
					return `Неправильний ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Неправильне число: повинно бути кратним ${issue.divisor}`;
				case "unrecognized_keys": return `Нерозпізнаний ключ${issue.keys.length > 1 ? "і" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Неправильний ключ у ${issue.origin}`;
				case "invalid_union": return "Неправильні вхідні дані";
				case "invalid_element": return `Неправильне значення у ${issue.origin}`;
				default: return `Неправильні вхідні дані`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ua.js
/** @deprecated Use `uk` instead. */
function ua_default() {
	return uk_default();
}
var init_ua = __esmMin((() => {
	init_uk();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/ur.js
function ur_default() {
	return { localeError: error$5() };
}
var error$5;
var init_ur = __esmMin((() => {
	init_util();
	error$5 = () => {
		const Sizable = {
			string: {
				unit: "حروف",
				verb: "ہونا"
			},
			file: {
				unit: "بائٹس",
				verb: "ہونا"
			},
			array: {
				unit: "آئٹمز",
				verb: "ہونا"
			},
			set: {
				unit: "آئٹمز",
				verb: "ہونا"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ان پٹ",
			email: "ای میل ایڈریس",
			url: "یو آر ایل",
			emoji: "ایموجی",
			uuid: "یو یو آئی ڈی",
			uuidv4: "یو یو آئی ڈی وی 4",
			uuidv6: "یو یو آئی ڈی وی 6",
			nanoid: "نینو آئی ڈی",
			guid: "جی یو آئی ڈی",
			cuid: "سی یو آئی ڈی",
			cuid2: "سی یو آئی ڈی 2",
			ulid: "یو ایل آئی ڈی",
			xid: "ایکس آئی ڈی",
			ksuid: "کے ایس یو آئی ڈی",
			datetime: "آئی ایس او ڈیٹ ٹائم",
			date: "آئی ایس او تاریخ",
			time: "آئی ایس او وقت",
			duration: "آئی ایس او مدت",
			ipv4: "آئی پی وی 4 ایڈریس",
			ipv6: "آئی پی وی 6 ایڈریس",
			cidrv4: "آئی پی وی 4 رینج",
			cidrv6: "آئی پی وی 6 رینج",
			base64: "بیس 64 ان کوڈڈ سٹرنگ",
			base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
			json_string: "جے ایس او این سٹرنگ",
			e164: "ای 164 نمبر",
			jwt: "جے ڈبلیو ٹی",
			template_literal: "ان پٹ"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "نمبر",
			array: "آرے",
			null: "نل"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `غلط ان پٹ: instanceof ${issue.expected} متوقع تھا، ${received} موصول ہوا`;
					return `غلط ان پٹ: ${expected} متوقع تھا، ${received} موصول ہوا`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `غلط ان پٹ: ${stringifyPrimitive(issue.values[0])} متوقع تھا`;
					return `غلط آپشن: ${joinValues(issue.values, "|")} میں سے ایک متوقع تھا`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `بہت بڑا: ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "ویلیو"} کے ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "عناصر"} ہونے متوقع تھے`;
					return `بہت بڑا: ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "ویلیو"} کا ${adj}${issue.maximum.toString()} ہونا متوقع تھا`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `بہت چھوٹا: ${issue.origin} کے ${adj}${issue.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
					return `بہت چھوٹا: ${issue.origin} کا ${adj}${issue.minimum.toString()} ہونا متوقع تھا`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
					if (_issue.format === "ends_with") return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
					if (_issue.format === "includes") return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
					if (_issue.format === "regex") return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
					return `غلط ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `غلط نمبر: ${issue.divisor} کا مضاعف ہونا چاہیے`;
				case "unrecognized_keys": return `غیر تسلیم شدہ کی${issue.keys.length > 1 ? "ز" : ""}: ${joinValues(issue.keys, "، ")}`;
				case "invalid_key": return `${issue.origin} میں غلط کی`;
				case "invalid_union": return "غلط ان پٹ";
				case "invalid_element": return `${issue.origin} میں غلط ویلیو`;
				default: return `غلط ان پٹ`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/uz.js
function uz_default() {
	return { localeError: error$4() };
}
var error$4;
var init_uz = __esmMin((() => {
	init_util();
	error$4 = () => {
		const Sizable = {
			string: {
				unit: "belgi",
				verb: "bo‘lishi kerak"
			},
			file: {
				unit: "bayt",
				verb: "bo‘lishi kerak"
			},
			array: {
				unit: "element",
				verb: "bo‘lishi kerak"
			},
			set: {
				unit: "element",
				verb: "bo‘lishi kerak"
			},
			map: {
				unit: "yozuv",
				verb: "bo‘lishi kerak"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "kirish",
			email: "elektron pochta manzili",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO sana va vaqti",
			date: "ISO sana",
			time: "ISO vaqt",
			duration: "ISO davomiylik",
			ipv4: "IPv4 manzil",
			ipv6: "IPv6 manzil",
			mac: "MAC manzil",
			cidrv4: "IPv4 diapazon",
			cidrv6: "IPv6 diapazon",
			base64: "base64 kodlangan satr",
			base64url: "base64url kodlangan satr",
			json_string: "JSON satr",
			e164: "E.164 raqam",
			jwt: "JWT",
			template_literal: "kirish"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "raqam",
			array: "massiv"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Noto‘g‘ri kirish: kutilgan instanceof ${issue.expected}, qabul qilingan ${received}`;
					return `Noto‘g‘ri kirish: kutilgan ${expected}, qabul qilingan ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Noto‘g‘ri kirish: kutilgan ${stringifyPrimitive(issue.values[0])}`;
					return `Noto‘g‘ri variant: quyidagilardan biri kutilgan ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Juda katta: kutilgan ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "qiymat"} ${adj}${issue.maximum.toString()} ${sizing.unit} ${sizing.verb}`;
					return `Juda katta: kutilgan ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "qiymat"} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ${sizing.verb}`;
					return `Juda kichik: kutilgan ${issue.origin} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Noto‘g‘ri satr: "${_issue.prefix}" bilan boshlanishi kerak`;
					if (_issue.format === "ends_with") return `Noto‘g‘ri satr: "${_issue.suffix}" bilan tugashi kerak`;
					if (_issue.format === "includes") return `Noto‘g‘ri satr: "${_issue.includes}" ni o‘z ichiga olishi kerak`;
					if (_issue.format === "regex") return `Noto‘g‘ri satr: ${_issue.pattern} shabloniga mos kelishi kerak`;
					return `Noto‘g‘ri ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Noto‘g‘ri raqam: ${issue.divisor} ning karralisi bo‘lishi kerak`;
				case "unrecognized_keys": return `Noma’lum kalit${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `${issue.origin} dagi kalit noto‘g‘ri`;
				case "invalid_union": return "Noto‘g‘ri kirish";
				case "invalid_element": return `${issue.origin} da noto‘g‘ri qiymat`;
				default: return `Noto‘g‘ri kirish`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/vi.js
function vi_default() {
	return { localeError: error$3() };
}
var error$3;
var init_vi = __esmMin((() => {
	init_util();
	error$3 = () => {
		const Sizable = {
			string: {
				unit: "ký tự",
				verb: "có"
			},
			file: {
				unit: "byte",
				verb: "có"
			},
			array: {
				unit: "phần tử",
				verb: "có"
			},
			set: {
				unit: "phần tử",
				verb: "có"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "đầu vào",
			email: "địa chỉ email",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ngày giờ ISO",
			date: "ngày ISO",
			time: "giờ ISO",
			duration: "khoảng thời gian ISO",
			ipv4: "địa chỉ IPv4",
			ipv6: "địa chỉ IPv6",
			cidrv4: "dải IPv4",
			cidrv6: "dải IPv6",
			base64: "chuỗi mã hóa base64",
			base64url: "chuỗi mã hóa base64url",
			json_string: "chuỗi JSON",
			e164: "số E.164",
			jwt: "JWT",
			template_literal: "đầu vào"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "số",
			array: "mảng"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Đầu vào không hợp lệ: mong đợi instanceof ${issue.expected}, nhận được ${received}`;
					return `Đầu vào không hợp lệ: mong đợi ${expected}, nhận được ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive(issue.values[0])}`;
					return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Quá lớn: mong đợi ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "giá trị"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "phần tử"}`;
					return `Quá lớn: mong đợi ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "giá trị"} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Quá nhỏ: mong đợi ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `Quá nhỏ: mong đợi ${issue.origin} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
					if (_issue.format === "regex") return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
					return `${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format} không hợp lệ`;
				}
				case "not_multiple_of": return `Số không hợp lệ: phải là bội số của ${issue.divisor}`;
				case "unrecognized_keys": return `Khóa không được nhận dạng: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Khóa không hợp lệ trong ${issue.origin}`;
				case "invalid_union": return "Đầu vào không hợp lệ";
				case "invalid_element": return `Giá trị không hợp lệ trong ${issue.origin}`;
				default: return `Đầu vào không hợp lệ`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/zh-CN.js
function zh_CN_default() {
	return { localeError: error$2() };
}
var error$2;
var init_zh_CN = __esmMin((() => {
	init_util();
	error$2 = () => {
		const Sizable = {
			string: {
				unit: "字符",
				verb: "包含"
			},
			file: {
				unit: "字节",
				verb: "包含"
			},
			array: {
				unit: "项",
				verb: "包含"
			},
			set: {
				unit: "项",
				verb: "包含"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "输入",
			email: "电子邮件",
			url: "URL",
			emoji: "表情符号",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO日期时间",
			date: "ISO日期",
			time: "ISO时间",
			duration: "ISO时长",
			ipv4: "IPv4地址",
			ipv6: "IPv6地址",
			cidrv4: "IPv4网段",
			cidrv6: "IPv6网段",
			base64: "base64编码字符串",
			base64url: "base64url编码字符串",
			json_string: "JSON字符串",
			e164: "E.164号码",
			jwt: "JWT",
			template_literal: "输入"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "数字",
			array: "数组",
			null: "空值(null)"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `无效输入：期望 instanceof ${issue.expected}，实际接收 ${received}`;
					return `无效输入：期望 ${expected}，实际接收 ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `无效输入：期望 ${stringifyPrimitive(issue.values[0])}`;
					return `无效选项：期望以下之一 ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `数值过大：期望 ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "值"} ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "个元素"}`;
					return `数值过大：期望 ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "值"} ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `无效字符串：必须以 "${_issue.prefix}" 开头`;
					if (_issue.format === "ends_with") return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
					if (_issue.format === "includes") return `无效字符串：必须包含 "${_issue.includes}"`;
					if (_issue.format === "regex") return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
					return `无效${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `无效数字：必须是 ${issue.divisor} 的倍数`;
				case "unrecognized_keys": return `出现未知的键(key): ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `${issue.origin} 中的键(key)无效`;
				case "invalid_union": return "无效输入";
				case "invalid_element": return `${issue.origin} 中包含无效值(value)`;
				default: return `无效输入`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/zh-TW.js
function zh_TW_default() {
	return { localeError: error$1() };
}
var error$1;
var init_zh_TW = __esmMin((() => {
	init_util();
	error$1 = () => {
		const Sizable = {
			string: {
				unit: "字元",
				verb: "擁有"
			},
			file: {
				unit: "位元組",
				verb: "擁有"
			},
			array: {
				unit: "項目",
				verb: "擁有"
			},
			set: {
				unit: "項目",
				verb: "擁有"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "輸入",
			email: "郵件地址",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "ISO 日期時間",
			date: "ISO 日期",
			time: "ISO 時間",
			duration: "ISO 期間",
			ipv4: "IPv4 位址",
			ipv6: "IPv6 位址",
			cidrv4: "IPv4 範圍",
			cidrv6: "IPv6 範圍",
			base64: "base64 編碼字串",
			base64url: "base64url 編碼字串",
			json_string: "JSON 字串",
			e164: "E.164 數值",
			jwt: "JWT",
			template_literal: "輸入"
		};
		const TypeDictionary = { nan: "NaN" };
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `無效的輸入值：預期為 instanceof ${issue.expected}，但收到 ${received}`;
					return `無效的輸入值：預期為 ${expected}，但收到 ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `無效的輸入值：預期為 ${stringifyPrimitive(issue.values[0])}`;
					return `無效的選項：預期為以下其中之一 ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin, _sizing$unit, _issue$origin2;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `數值過大：預期 ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "值"} 應為 ${adj}${issue.maximum.toString()} ${(_sizing$unit = sizing.unit) !== null && _sizing$unit !== void 0 ? _sizing$unit : "個元素"}`;
					return `數值過大：預期 ${(_issue$origin2 = issue.origin) !== null && _issue$origin2 !== void 0 ? _issue$origin2 : "值"} 應為 ${adj}${issue.maximum.toString()}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
					return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
					if (_issue.format === "ends_with") return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
					if (_issue.format === "includes") return `無效的字串：必須包含 "${_issue.includes}"`;
					if (_issue.format === "regex") return `無效的字串：必須符合格式 ${_issue.pattern}`;
					return `無效的 ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `無效的數字：必須為 ${issue.divisor} 的倍數`;
				case "unrecognized_keys": return `無法識別的鍵值${issue.keys.length > 1 ? "們" : ""}：${joinValues(issue.keys, "、")}`;
				case "invalid_key": return `${issue.origin} 中有無效的鍵值`;
				case "invalid_union": return "無效的輸入值";
				case "invalid_element": return `${issue.origin} 中有無效的值`;
				default: return `無效的輸入值`;
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/yo.js
function yo_default() {
	return { localeError: error() };
}
var error;
var init_yo = __esmMin((() => {
	init_util();
	error = () => {
		const Sizable = {
			string: {
				unit: "àmi",
				verb: "ní"
			},
			file: {
				unit: "bytes",
				verb: "ní"
			},
			array: {
				unit: "nkan",
				verb: "ní"
			},
			set: {
				unit: "nkan",
				verb: "ní"
			}
		};
		function getSizing(origin) {
			var _Sizable$origin;
			return (_Sizable$origin = Sizable[origin]) !== null && _Sizable$origin !== void 0 ? _Sizable$origin : null;
		}
		const FormatDictionary = {
			regex: "ẹ̀rọ ìbáwọlé",
			email: "àdírẹ́sì ìmẹ́lì",
			url: "URL",
			emoji: "emoji",
			uuid: "UUID",
			uuidv4: "UUIDv4",
			uuidv6: "UUIDv6",
			nanoid: "nanoid",
			guid: "GUID",
			cuid: "cuid",
			cuid2: "cuid2",
			ulid: "ULID",
			xid: "XID",
			ksuid: "KSUID",
			datetime: "àkókò ISO",
			date: "ọjọ́ ISO",
			time: "àkókò ISO",
			duration: "àkókò tó pé ISO",
			ipv4: "àdírẹ́sì IPv4",
			ipv6: "àdírẹ́sì IPv6",
			cidrv4: "àgbègbè IPv4",
			cidrv6: "àgbègbè IPv6",
			base64: "ọ̀rọ̀ tí a kọ́ ní base64",
			base64url: "ọ̀rọ̀ base64url",
			json_string: "ọ̀rọ̀ JSON",
			e164: "nọ́mbà E.164",
			jwt: "JWT",
			template_literal: "ẹ̀rọ ìbáwọlé"
		};
		const TypeDictionary = {
			nan: "NaN",
			number: "nọ́mbà",
			array: "akopọ"
		};
		return (issue) => {
			switch (issue.code) {
				case "invalid_type": {
					var _TypeDictionary$issue, _TypeDictionary$recei;
					const expected = (_TypeDictionary$issue = TypeDictionary[issue.expected]) !== null && _TypeDictionary$issue !== void 0 ? _TypeDictionary$issue : issue.expected;
					const receivedType = parsedType(issue.input);
					const received = (_TypeDictionary$recei = TypeDictionary[receivedType]) !== null && _TypeDictionary$recei !== void 0 ? _TypeDictionary$recei : receivedType;
					if (/^[A-Z]/.test(issue.expected)) return `Ìbáwọlé aṣìṣe: a ní láti fi instanceof ${issue.expected}, àmọ̀ a rí ${received}`;
					return `Ìbáwọlé aṣìṣe: a ní láti fi ${expected}, àmọ̀ a rí ${received}`;
				}
				case "invalid_value":
					if (issue.values.length === 1) return `Ìbáwọlé aṣìṣe: a ní láti fi ${stringifyPrimitive(issue.values[0])}`;
					return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${joinValues(issue.values, "|")}`;
				case "too_big": {
					var _issue$origin;
					const adj = issue.inclusive ? "<=" : "<";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Tó pọ̀ jù: a ní láti jẹ́ pé ${(_issue$origin = issue.origin) !== null && _issue$origin !== void 0 ? _issue$origin : "iye"} ${sizing.verb} ${adj}${issue.maximum} ${sizing.unit}`;
					return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue.maximum}`;
				}
				case "too_small": {
					const adj = issue.inclusive ? ">=" : ">";
					const sizing = getSizing(issue.origin);
					if (sizing) return `Kéré ju: a ní láti jẹ́ pé ${issue.origin} ${sizing.verb} ${adj}${issue.minimum} ${sizing.unit}`;
					return `Kéré ju: a ní láti jẹ́ ${adj}${issue.minimum}`;
				}
				case "invalid_format": {
					var _FormatDictionary$_is;
					const _issue = issue;
					if (_issue.format === "starts_with") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
					if (_issue.format === "ends_with") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
					if (_issue.format === "includes") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
					if (_issue.format === "regex") return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
					return `Aṣìṣe: ${(_FormatDictionary$_is = FormatDictionary[_issue.format]) !== null && _FormatDictionary$_is !== void 0 ? _FormatDictionary$_is : issue.format}`;
				}
				case "not_multiple_of": return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue.divisor}`;
				case "unrecognized_keys": return `Bọtìnì àìmọ̀: ${joinValues(issue.keys, ", ")}`;
				case "invalid_key": return `Bọtìnì aṣìṣe nínú ${issue.origin}`;
				case "invalid_union": return "Ìbáwọlé aṣìṣe";
				case "invalid_element": return `Iye aṣìṣe nínú ${issue.origin}`;
				default: return "Ìbáwọlé aṣìṣe";
			}
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/locales/index.js
var locales_exports = /* @__PURE__ */ __exportAll({
	ar: () => ar_default,
	az: () => az_default,
	be: () => be_default,
	bg: () => bg_default,
	ca: () => ca_default,
	cs: () => cs_default,
	da: () => da_default,
	de: () => de_default,
	en: () => en_default,
	eo: () => eo_default,
	es: () => es_default,
	fa: () => fa_default,
	fi: () => fi_default,
	fr: () => fr_default,
	frCA: () => fr_CA_default,
	he: () => he_default,
	hr: () => hr_default,
	hu: () => hu_default,
	hy: () => hy_default,
	id: () => id_default,
	is: () => is_default,
	it: () => it_default,
	ja: () => ja_default,
	ka: () => ka_default,
	kh: () => kh_default,
	km: () => km_default,
	ko: () => ko_default,
	lt: () => lt_default,
	mk: () => mk_default,
	ms: () => ms_default,
	nl: () => nl_default,
	no: () => no_default,
	ota: () => ota_default,
	pl: () => pl_default,
	ps: () => ps_default,
	pt: () => pt_default,
	ru: () => ru_default,
	sl: () => sl_default,
	sv: () => sv_default,
	ta: () => ta_default,
	th: () => th_default,
	tr: () => tr_default,
	ua: () => ua_default,
	uk: () => uk_default,
	ur: () => ur_default,
	uz: () => uz_default,
	vi: () => vi_default,
	yo: () => yo_default,
	zhCN: () => zh_CN_default,
	zhTW: () => zh_TW_default
});
var init_locales$1 = __esmMin((() => {
	init_ar();
	init_az();
	init_be();
	init_bg();
	init_ca();
	init_cs();
	init_da();
	init_de();
	init_en();
	init_eo();
	init_es();
	init_fa();
	init_fi();
	init_fr();
	init_fr_CA();
	init_he();
	init_hr();
	init_hu();
	init_hy();
	init_id();
	init_is();
	init_it();
	init_ja();
	init_ka();
	init_kh();
	init_km();
	init_ko();
	init_lt();
	init_mk();
	init_ms();
	init_nl();
	init_no();
	init_ota();
	init_ps();
	init_pl();
	init_pt();
	init_ru();
	init_sl();
	init_sv();
	init_ta();
	init_th();
	init_tr();
	init_ua();
	init_uk();
	init_ur();
	init_uz();
	init_vi();
	init_zh_CN();
	init_zh_TW();
	init_yo();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/registries.js
function registry$1() {
	return new $ZodRegistry$1();
}
var _a$__zod_globalRegist$1, _a$1, $output, $input, $ZodRegistry$1, globalRegistry;
var init_registries = __esmMin((() => {
	init_objectSpread2();
	$output = Symbol("ZodOutput");
	$input = Symbol("ZodInput");
	$ZodRegistry$1 = class {
		constructor() {
			this._map = /* @__PURE__ */ new WeakMap();
			this._idmap = /* @__PURE__ */ new Map();
		}
		add(schema, ..._meta) {
			const meta = _meta[0];
			this._map.set(schema, meta);
			if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
			return this;
		}
		clear() {
			this._map = /* @__PURE__ */ new WeakMap();
			this._idmap = /* @__PURE__ */ new Map();
			return this;
		}
		remove(schema) {
			const meta = this._map.get(schema);
			if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
			this._map.delete(schema);
			return this;
		}
		get(schema) {
			const p = schema._zod.parent;
			if (p) {
				var _this$get;
				const pm = _objectSpread2({}, (_this$get = this.get(p)) !== null && _this$get !== void 0 ? _this$get : {});
				delete pm.id;
				const f = _objectSpread2(_objectSpread2({}, pm), this._map.get(schema));
				return Object.keys(f).length ? f : void 0;
			}
			return this._map.get(schema);
		}
		has(schema) {
			return this._map.has(schema);
		}
	};
	(_a$__zod_globalRegist$1 = (_a$1 = globalThis).__zod_globalRegistry) !== null && _a$__zod_globalRegist$1 !== void 0 || (_a$1.__zod_globalRegistry = registry$1());
	globalRegistry = globalThis.__zod_globalRegistry;
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function _string(Class, params) {
	return new Class(_objectSpread2({ type: "string" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedString(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		coerce: true
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _email(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _guid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uuid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv4(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv6(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uuidv7(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _url(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _emoji(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _nanoid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _cuid2(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _ulid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _xid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _ksuid(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv4(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _ipv6(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _mac(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "mac",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv4(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _cidrv6(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _base64(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _base64url(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _e164(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _jwt(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDateTime(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDate(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "date",
		check: "string_format"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _isoTime(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _isoDuration(Class, params) {
	return new Class(_objectSpread2({
		type: "string",
		format: "duration",
		check: "string_format"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _number(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		checks: []
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedNumber(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		coerce: true,
		checks: []
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _int(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _float32(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		check: "number_format",
		abort: false,
		format: "float32"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _float64(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		check: "number_format",
		abort: false,
		format: "float64"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _int32(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		check: "number_format",
		abort: false,
		format: "int32"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uint32(Class, params) {
	return new Class(_objectSpread2({
		type: "number",
		check: "number_format",
		abort: false,
		format: "uint32"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _boolean(Class, params) {
	return new Class(_objectSpread2({ type: "boolean" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedBoolean(Class, params) {
	return new Class(_objectSpread2({
		type: "boolean",
		coerce: true
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _bigint(Class, params) {
	return new Class(_objectSpread2({ type: "bigint" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedBigint(Class, params) {
	return new Class(_objectSpread2({
		type: "bigint",
		coerce: true
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _int64(Class, params) {
	return new Class(_objectSpread2({
		type: "bigint",
		check: "bigint_format",
		abort: false,
		format: "int64"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uint64(Class, params) {
	return new Class(_objectSpread2({
		type: "bigint",
		check: "bigint_format",
		abort: false,
		format: "uint64"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _symbol(Class, params) {
	return new Class(_objectSpread2({ type: "symbol" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _undefined$1(Class, params) {
	return new Class(_objectSpread2({ type: "undefined" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _null$1(Class, params) {
	return new Class(_objectSpread2({ type: "null" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _any(Class) {
	return new Class({ type: "any" });
}
/* @__NO_SIDE_EFFECTS__ */
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function _never(Class, params) {
	return new Class(_objectSpread2({ type: "never" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _void$1(Class, params) {
	return new Class(_objectSpread2({ type: "void" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _date(Class, params) {
	return new Class(_objectSpread2({ type: "date" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _coercedDate(Class, params) {
	return new Class(_objectSpread2({
		type: "date",
		coerce: true
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _nan(Class, params) {
	return new Class(_objectSpread2({ type: "nan" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _lt(value, params) {
	return new $ZodCheckLessThan(_objectSpread2(_objectSpread2({ check: "less_than" }, normalizeParams(params)), {}, {
		value,
		inclusive: false
	}));
}
/* @__NO_SIDE_EFFECTS__ */
function _lte(value, params) {
	return new $ZodCheckLessThan(_objectSpread2(_objectSpread2({ check: "less_than" }, normalizeParams(params)), {}, {
		value,
		inclusive: true
	}));
}
/* @__NO_SIDE_EFFECTS__ */
function _gt(value, params) {
	return new $ZodCheckGreaterThan(_objectSpread2(_objectSpread2({ check: "greater_than" }, normalizeParams(params)), {}, {
		value,
		inclusive: false
	}));
}
/* @__NO_SIDE_EFFECTS__ */
function _gte(value, params) {
	return new $ZodCheckGreaterThan(_objectSpread2(_objectSpread2({ check: "greater_than" }, normalizeParams(params)), {}, {
		value,
		inclusive: true
	}));
}
/* @__NO_SIDE_EFFECTS__ */
function _positive(params) {
	return /* @__PURE__ */ _gt(0, params);
}
/* @__NO_SIDE_EFFECTS__ */
function _negative(params) {
	return /* @__PURE__ */ _lt(0, params);
}
/* @__NO_SIDE_EFFECTS__ */
function _nonpositive(params) {
	return /* @__PURE__ */ _lte(0, params);
}
/* @__NO_SIDE_EFFECTS__ */
function _nonnegative(params) {
	return /* @__PURE__ */ _gte(0, params);
}
/* @__NO_SIDE_EFFECTS__ */
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf(_objectSpread2(_objectSpread2({ check: "multiple_of" }, normalizeParams(params)), {}, { value }));
}
/* @__NO_SIDE_EFFECTS__ */
function _maxSize(maximum, params) {
	return new $ZodCheckMaxSize(_objectSpread2(_objectSpread2({ check: "max_size" }, normalizeParams(params)), {}, { maximum }));
}
/* @__NO_SIDE_EFFECTS__ */
function _minSize(minimum, params) {
	return new $ZodCheckMinSize(_objectSpread2(_objectSpread2({ check: "min_size" }, normalizeParams(params)), {}, { minimum }));
}
/* @__NO_SIDE_EFFECTS__ */
function _size(size, params) {
	return new $ZodCheckSizeEquals(_objectSpread2(_objectSpread2({ check: "size_equals" }, normalizeParams(params)), {}, { size }));
}
/* @__NO_SIDE_EFFECTS__ */
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength(_objectSpread2(_objectSpread2({ check: "max_length" }, normalizeParams(params)), {}, { maximum }));
}
/* @__NO_SIDE_EFFECTS__ */
function _minLength(minimum, params) {
	return new $ZodCheckMinLength(_objectSpread2(_objectSpread2({ check: "min_length" }, normalizeParams(params)), {}, { minimum }));
}
/* @__NO_SIDE_EFFECTS__ */
function _length(length, params) {
	return new $ZodCheckLengthEquals(_objectSpread2(_objectSpread2({ check: "length_equals" }, normalizeParams(params)), {}, { length }));
}
/* @__NO_SIDE_EFFECTS__ */
function _regex(pattern, params) {
	return new $ZodCheckRegex(_objectSpread2(_objectSpread2({
		check: "string_format",
		format: "regex"
	}, normalizeParams(params)), {}, { pattern }));
}
/* @__NO_SIDE_EFFECTS__ */
function _lowercase(params) {
	return new $ZodCheckLowerCase(_objectSpread2({
		check: "string_format",
		format: "lowercase"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _uppercase(params) {
	return new $ZodCheckUpperCase(_objectSpread2({
		check: "string_format",
		format: "uppercase"
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _includes(includes, params) {
	return new $ZodCheckIncludes(_objectSpread2(_objectSpread2({
		check: "string_format",
		format: "includes"
	}, normalizeParams(params)), {}, { includes }));
}
/* @__NO_SIDE_EFFECTS__ */
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith(_objectSpread2(_objectSpread2({
		check: "string_format",
		format: "starts_with"
	}, normalizeParams(params)), {}, { prefix }));
}
/* @__NO_SIDE_EFFECTS__ */
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith(_objectSpread2(_objectSpread2({
		check: "string_format",
		format: "ends_with"
	}, normalizeParams(params)), {}, { suffix }));
}
/* @__NO_SIDE_EFFECTS__ */
function _property(property, schema, params) {
	return new $ZodCheckProperty(_objectSpread2({
		check: "property",
		property,
		schema
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _mime(types, params) {
	return new $ZodCheckMimeType(_objectSpread2({
		check: "mime_type",
		mime: types
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
/* @__NO_SIDE_EFFECTS__ */
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
/* @__NO_SIDE_EFFECTS__ */
function _array(Class, element, params) {
	return new Class(_objectSpread2({
		type: "array",
		element
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _union(Class, options, params) {
	return new Class(_objectSpread2({
		type: "union",
		options
	}, normalizeParams(params)));
}
function _xor(Class, options, params) {
	return new Class(_objectSpread2({
		type: "union",
		options,
		inclusive: false
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _discriminatedUnion(Class, discriminator, options, params) {
	return new Class(_objectSpread2({
		type: "union",
		options,
		discriminator
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _intersection(Class, left, right) {
	return new Class({
		type: "intersection",
		left,
		right
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _tuple(Class, items, _paramsOrRest, _params) {
	const hasRest = _paramsOrRest instanceof $ZodType;
	return new Class(_objectSpread2({
		type: "tuple",
		items,
		rest: hasRest ? _paramsOrRest : null
	}, normalizeParams(hasRest ? _params : _paramsOrRest)));
}
/* @__NO_SIDE_EFFECTS__ */
function _record(Class, keyType, valueType, params) {
	return new Class(_objectSpread2({
		type: "record",
		keyType,
		valueType
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _map(Class, keyType, valueType, params) {
	return new Class(_objectSpread2({
		type: "map",
		keyType,
		valueType
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _set(Class, valueType, params) {
	return new Class(_objectSpread2({
		type: "set",
		valueType
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _enum$1(Class, values, params) {
	return new Class(_objectSpread2({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values
	}, normalizeParams(params)));
}
/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
*
* ```ts
* enum Colors { red, green, blue }
* z.enum(Colors);
* ```
*/
/* @__NO_SIDE_EFFECTS__ */
function _nativeEnum(Class, entries, params) {
	return new Class(_objectSpread2({
		type: "enum",
		entries
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _literal(Class, value, params) {
	return new Class(_objectSpread2({
		type: "literal",
		values: Array.isArray(value) ? value : [value]
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _file(Class, params) {
	return new Class(_objectSpread2({ type: "file" }, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _transform(Class, fn) {
	return new Class({
		type: "transform",
		transform: fn
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _optional(Class, innerType) {
	return new Class({
		type: "optional",
		innerType
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _nullable(Class, innerType) {
	return new Class({
		type: "nullable",
		innerType
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _default$1(Class, innerType, defaultValue) {
	return new Class({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _nonoptional(Class, innerType, params) {
	return new Class(_objectSpread2({
		type: "nonoptional",
		innerType
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _success(Class, innerType) {
	return new Class({
		type: "success",
		innerType
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _catch$1(Class, innerType, catchValue) {
	return new Class({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _pipe(Class, in_, out) {
	return new Class({
		type: "pipe",
		in: in_,
		out
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _readonly(Class, innerType) {
	return new Class({
		type: "readonly",
		innerType
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _templateLiteral(Class, parts, params) {
	return new Class(_objectSpread2({
		type: "template_literal",
		parts
	}, normalizeParams(params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _lazy(Class, getter) {
	return new Class({
		type: "lazy",
		getter
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _promise(Class, innerType) {
	return new Class({
		type: "promise",
		innerType
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _custom(Class, fn, _params) {
	var _norm$abort;
	const norm = normalizeParams(_params);
	(_norm$abort = norm.abort) !== null && _norm$abort !== void 0 || (norm.abort = true);
	return new Class(_objectSpread2({
		type: "custom",
		check: "custom",
		fn
	}, norm));
}
/* @__NO_SIDE_EFFECTS__ */
function _refine(Class, fn, _params) {
	return new Class(_objectSpread2({
		type: "custom",
		check: "custom",
		fn
	}, normalizeParams(_params)));
}
/* @__NO_SIDE_EFFECTS__ */
function _superRefine(fn) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				var _issue$code, _issue$input, _issue$inst, _issue$continue;
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				(_issue$code = _issue.code) !== null && _issue$code !== void 0 || (_issue.code = "custom");
				(_issue$input = _issue.input) !== null && _issue$input !== void 0 || (_issue.input = payload.value);
				(_issue$inst = _issue.inst) !== null && _issue$inst !== void 0 || (_issue.inst = ch);
				(_issue$continue = _issue.continue) !== null && _issue$continue !== void 0 || (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	});
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _check(fn, params) {
	const ch = new $ZodCheck(_objectSpread2({ check: "custom" }, normalizeParams(params)));
	ch._zod.check = fn;
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function describe$1(description) {
	const ch = new $ZodCheck({ check: "describe" });
	ch._zod.onattach = [(inst) => {
		var _registries$globalReg;
		const existing = (_registries$globalReg = globalRegistry.get(inst)) !== null && _registries$globalReg !== void 0 ? _registries$globalReg : {};
		globalRegistry.add(inst, _objectSpread2(_objectSpread2({}, existing), {}, { description }));
	}];
	ch._zod.check = () => {};
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function meta$1(metadata) {
	const ch = new $ZodCheck({ check: "meta" });
	ch._zod.onattach = [(inst) => {
		var _registries$globalReg2;
		const existing = (_registries$globalReg2 = globalRegistry.get(inst)) !== null && _registries$globalReg2 !== void 0 ? _registries$globalReg2 : {};
		globalRegistry.add(inst, _objectSpread2(_objectSpread2({}, existing), metadata));
	}];
	ch._zod.check = () => {};
	return ch;
}
/* @__NO_SIDE_EFFECTS__ */
function _stringbool(Classes, _params) {
	var _params$truthy, _params$falsy, _Classes$Codec, _Classes$Boolean, _Classes$String;
	const params = normalizeParams(_params);
	let truthyArray = (_params$truthy = params.truthy) !== null && _params$truthy !== void 0 ? _params$truthy : [
		"true",
		"1",
		"yes",
		"on",
		"y",
		"enabled"
	];
	let falsyArray = (_params$falsy = params.falsy) !== null && _params$falsy !== void 0 ? _params$falsy : [
		"false",
		"0",
		"no",
		"off",
		"n",
		"disabled"
	];
	if (params.case !== "sensitive") {
		truthyArray = truthyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
		falsyArray = falsyArray.map((v) => typeof v === "string" ? v.toLowerCase() : v);
	}
	const truthySet = new Set(truthyArray);
	const falsySet = new Set(falsyArray);
	const _Codec = (_Classes$Codec = Classes.Codec) !== null && _Classes$Codec !== void 0 ? _Classes$Codec : $ZodCodec;
	const _Boolean = (_Classes$Boolean = Classes.Boolean) !== null && _Classes$Boolean !== void 0 ? _Classes$Boolean : $ZodBoolean;
	const codec = new _Codec({
		type: "pipe",
		in: new ((_Classes$String = Classes.String) !== null && _Classes$String !== void 0 ? _Classes$String : $ZodString)({
			type: "string",
			error: params.error
		}),
		out: new _Boolean({
			type: "boolean",
			error: params.error
		}),
		transform: ((input, payload) => {
			let data = input;
			if (params.case !== "sensitive") data = data.toLowerCase();
			if (truthySet.has(data)) return true;
			else if (falsySet.has(data)) return false;
			else {
				payload.issues.push({
					code: "invalid_value",
					expected: "stringbool",
					values: [...truthySet, ...falsySet],
					input: payload.value,
					inst: codec,
					continue: false
				});
				return {};
			}
		}),
		reverseTransform: ((input, _payload) => {
			if (input === true) return truthyArray[0] || "true";
			else return falsyArray[0] || "false";
		}),
		error: params.error
	});
	return codec;
}
/* @__NO_SIDE_EFFECTS__ */
function _stringFormat(Class, format, fnOrRegex, _params = {}) {
	const params = normalizeParams(_params);
	const def = _objectSpread2(_objectSpread2({}, normalizeParams(_params)), {}, {
		check: "string_format",
		type: "string",
		format,
		fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val)
	}, params);
	if (fnOrRegex instanceof RegExp) def.pattern = fnOrRegex;
	return new Class(def);
}
var TimePrecision;
var init_api = __esmMin((() => {
	init_checks$1();
	init_registries();
	init_schemas$1();
	init_util();
	init_objectSpread2();
	TimePrecision = {
		Any: null,
		Minute: -1,
		Second: 0,
		Millisecond: 3,
		Microsecond: 6
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	var _params$target, _params$processors, _params$metadata, _params$unrepresentab, _params$override, _params$io, _params$cycles, _params$reused, _params$external;
	let target = (_params$target = params === null || params === void 0 ? void 0 : params.target) !== null && _params$target !== void 0 ? _params$target : "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: (_params$processors = params.processors) !== null && _params$processors !== void 0 ? _params$processors : {},
		metadataRegistry: (_params$metadata = params === null || params === void 0 ? void 0 : params.metadata) !== null && _params$metadata !== void 0 ? _params$metadata : globalRegistry,
		target,
		unrepresentable: (_params$unrepresentab = params === null || params === void 0 ? void 0 : params.unrepresentable) !== null && _params$unrepresentab !== void 0 ? _params$unrepresentab : "throw",
		override: (_params$override = params === null || params === void 0 ? void 0 : params.override) !== null && _params$override !== void 0 ? _params$override : (() => {}),
		io: (_params$io = params === null || params === void 0 ? void 0 : params.io) !== null && _params$io !== void 0 ? _params$io : "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: (_params$cycles = params === null || params === void 0 ? void 0 : params.cycles) !== null && _params$cycles !== void 0 ? _params$cycles : "ref",
		reused: (_params$reused = params === null || params === void 0 ? void 0 : params.reused) !== null && _params$reused !== void 0 ? _params$reused : "inline",
		external: (_params$external = params === null || params === void 0 ? void 0 : params.external) !== null && _params$external !== void 0 ? _params$external : void 0
	};
}
function process(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _schema$_zod$toJSONSc, _schema$_zod, _a$default;
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = (_schema$_zod$toJSONSc = (_schema$_zod = schema._zod).toJSONSchema) === null || _schema$_zod$toJSONSc === void 0 ? void 0 : _schema$_zod$toJSONSc.call(_schema$_zod);
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = _objectSpread2(_objectSpread2({}, _params), {}, {
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		});
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) Object.assign(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && result.schema._prefault) (_a$default = (_a = result.schema).default) !== null && _a$default !== void 0 || (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		var _ctx$metadataRegistry;
		const id = (_ctx$metadataRegistry = ctx.metadataRegistry.get(entry[0])) === null || _ctx$metadataRegistry === void 0 ? void 0 : _ctx$metadataRegistry.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		var _entry$1$schema$id;
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			var _ctx$external$registr, _ctx$external$uri, _ref, _entry$1$defId;
			const externalId = (_ctx$external$registr = ctx.external.registry.get(entry[0])) === null || _ctx$external$registr === void 0 ? void 0 : _ctx$external$registr.id;
			const uriGenerator = (_ctx$external$uri = ctx.external.uri) !== null && _ctx$external$uri !== void 0 ? _ctx$external$uri : ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = (_ref = (_entry$1$defId = entry[1].defId) !== null && _entry$1$defId !== void 0 ? _entry$1$defId : entry[1].schema.id) !== null && _ref !== void 0 ? _ref : `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const defUriPrefix = `#/${defsSegment}/`;
		const defId = (_entry$1$schema$id = entry[1].schema.id) !== null && _entry$1$schema$id !== void 0 ? _entry$1$schema$id : `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = _objectSpread2({}, seen.schema);
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) {
			var _seen$cycle;
			throw new Error(`Cycle detected: #/${(_seen$cycle = seen.cycle) === null || _seen$cycle === void 0 ? void 0 : _seen$cycle.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
		}
	}
	for (const entry of ctx.seen.entries()) {
		var _ctx$metadataRegistry2;
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			var _ctx$external$registr2;
			const ext = (_ctx$external$registr2 = ctx.external.registry.get(entry[0])) === null || _ctx$external$registr2 === void 0 ? void 0 : _ctx$external$registr2.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if ((_ctx$metadataRegistry2 = ctx.metadataRegistry.get(entry[0])) === null || _ctx$metadataRegistry2 === void 0 ? void 0 : _ctx$metadataRegistry2.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize(ctx, schema) {
	var _ctx$external, _root$def, _ctx$external$defs, _ctx$external2;
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		var _seen$def, _seen$path;
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = (_seen$def = seen.def) !== null && _seen$def !== void 0 ? _seen$def : seen.schema;
		const _cached = _objectSpread2({}, schema);
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				var _schema$allOf;
				schema.allOf = (_schema$allOf = schema.allOf) !== null && _schema$allOf !== void 0 ? _schema$allOf : [];
				schema.allOf.push(refSchema);
			} else Object.assign(schema, refSchema);
			Object.assign(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen === null || parentSeen === void 0 ? void 0 : parentSeen.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: (_seen$path = seen.path) !== null && _seen$path !== void 0 ? _seen$path : []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if ((_ctx$external = ctx.external) === null || _ctx$external === void 0 ? void 0 : _ctx$external.uri) {
		var _ctx$external$registr3;
		const id = (_ctx$external$registr3 = ctx.external.registry.get(schema)) === null || _ctx$external$registr3 === void 0 ? void 0 : _ctx$external$registr3.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, (_root$def = root.def) !== null && _root$def !== void 0 ? _root$def : root.schema);
	const defs = (_ctx$external$defs = (_ctx$external2 = ctx.external) === null || _ctx$external2 === void 0 ? void 0 : _ctx$external2.defs) !== null && _ctx$external$defs !== void 0 ? _ctx$external$defs : {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) defs[seen.defId] = seen.def;
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: _objectSpread2(_objectSpread2({}, schema["~standard"]), {}, { jsonSchema: {
				input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
				output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
			} }),
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx !== null && _ctx !== void 0 ? _ctx : { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
var createToJSONSchemaMethod, createStandardJSONSchemaMethod;
var init_to_json_schema = __esmMin((() => {
	init_registries();
	init_objectSpread2();
	createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
		const ctx = initializeContext(_objectSpread2(_objectSpread2({}, params), {}, { processors }));
		process(schema, ctx);
		extractDefs(ctx, schema);
		return finalize(ctx, schema);
	};
	createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
		const { libraryOptions, target } = params !== null && params !== void 0 ? params : {};
		const ctx = initializeContext(_objectSpread2(_objectSpread2({}, libraryOptions !== null && libraryOptions !== void 0 ? libraryOptions : {}), {}, {
			target,
			io,
			processors
		}));
		process(schema, ctx);
		extractDefs(ctx, schema);
		return finalize(ctx, schema);
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/json-schema-processors.js
function toJSONSchema(input, params) {
	if ("_idmap" in input) {
		const registry = input;
		const ctx = initializeContext(_objectSpread2(_objectSpread2({}, params), {}, { processors: allProcessors }));
		const defs = {};
		for (const entry of registry._idmap.entries()) {
			const [_, schema] = entry;
			process(schema, ctx);
		}
		const schemas = {};
		ctx.external = {
			registry,
			uri: params === null || params === void 0 ? void 0 : params.uri,
			defs
		};
		for (const entry of registry._idmap.entries()) {
			const [key, schema] = entry;
			extractDefs(ctx, schema);
			schemas[key] = finalize(ctx, schema);
		}
		if (Object.keys(defs).length > 0) schemas.__shared = { [ctx.target === "draft-2020-12" ? "$defs" : "definitions"]: defs };
		return { schemas };
	}
	const ctx = initializeContext(_objectSpread2(_objectSpread2({}, params), {}, { processors: allProcessors }));
	process(input, ctx);
	extractDefs(ctx, input);
	return finalize(ctx, input);
}
var formatMap, stringProcessor, numberProcessor, booleanProcessor, bigintProcessor, symbolProcessor, nullProcessor, undefinedProcessor, voidProcessor, neverProcessor, anyProcessor, unknownProcessor, dateProcessor, enumProcessor, literalProcessor, nanProcessor, templateLiteralProcessor, fileProcessor, successProcessor, customProcessor, functionProcessor, transformProcessor, mapProcessor, setProcessor, arrayProcessor, objectProcessor, unionProcessor, intersectionProcessor, tupleProcessor, recordProcessor, nullableProcessor, nonoptionalProcessor, defaultProcessor, prefaultProcessor, catchProcessor, pipeProcessor, readonlyProcessor, promiseProcessor, optionalProcessor, lazyProcessor, allProcessors;
var init_json_schema_processors = __esmMin((() => {
	init_to_json_schema();
	init_util();
	init_objectSpread2();
	formatMap = {
		guid: "uuid",
		url: "uri",
		datetime: "date-time",
		json_string: "json-string",
		regex: ""
	};
	stringProcessor = (schema, ctx, _json, _params) => {
		const json = _json;
		json.type = "string";
		const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
		if (typeof minimum === "number") json.minLength = minimum;
		if (typeof maximum === "number") json.maxLength = maximum;
		if (format) {
			var _formatMap$format;
			json.format = (_formatMap$format = formatMap[format]) !== null && _formatMap$format !== void 0 ? _formatMap$format : format;
			if (json.format === "") delete json.format;
			if (format === "time") delete json.format;
		}
		if (contentEncoding) json.contentEncoding = contentEncoding;
		if (patterns && patterns.size > 0) {
			const regexes = [...patterns];
			if (regexes.length === 1) json.pattern = regexes[0].source;
			else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => _objectSpread2(_objectSpread2({}, ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {}), {}, { pattern: regex.source }))];
		}
	};
	numberProcessor = (schema, ctx, _json, _params) => {
		const json = _json;
		const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
		if (typeof format === "string" && format.includes("int")) json.type = "integer";
		else json.type = "number";
		if (typeof exclusiveMinimum === "number") if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
		if (typeof minimum === "number") {
			json.minimum = minimum;
			if (typeof exclusiveMinimum === "number" && ctx.target !== "draft-04") if (exclusiveMinimum >= minimum) delete json.minimum;
			else delete json.exclusiveMinimum;
		}
		if (typeof exclusiveMaximum === "number") if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
		if (typeof maximum === "number") {
			json.maximum = maximum;
			if (typeof exclusiveMaximum === "number" && ctx.target !== "draft-04") if (exclusiveMaximum <= maximum) delete json.maximum;
			else delete json.exclusiveMaximum;
		}
		if (typeof multipleOf === "number") json.multipleOf = multipleOf;
	};
	booleanProcessor = (_schema, _ctx, json, _params) => {
		json.type = "boolean";
	};
	bigintProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("BigInt cannot be represented in JSON Schema");
	};
	symbolProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Symbols cannot be represented in JSON Schema");
	};
	nullProcessor = (_schema, ctx, json, _params) => {
		if (ctx.target === "openapi-3.0") {
			json.type = "string";
			json.nullable = true;
			json.enum = [null];
		} else json.type = "null";
	};
	undefinedProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Undefined cannot be represented in JSON Schema");
	};
	voidProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Void cannot be represented in JSON Schema");
	};
	neverProcessor = (_schema, _ctx, json, _params) => {
		json.not = {};
	};
	anyProcessor = (_schema, _ctx, _json, _params) => {};
	unknownProcessor = (_schema, _ctx, _json, _params) => {};
	dateProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Date cannot be represented in JSON Schema");
	};
	enumProcessor = (schema, _ctx, json, _params) => {
		const def = schema._zod.def;
		const values = getEnumValues(def.entries);
		if (values.every((v) => typeof v === "number")) json.type = "number";
		if (values.every((v) => typeof v === "string")) json.type = "string";
		json.enum = values;
	};
	literalProcessor = (schema, ctx, json, _params) => {
		const def = schema._zod.def;
		const vals = [];
		for (const val of def.values) if (val === void 0) {
			if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
		} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
		else vals.push(Number(val));
		else vals.push(val);
		if (vals.length === 0) {} else if (vals.length === 1) {
			const val = vals[0];
			json.type = val === null ? "null" : typeof val;
			if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
			else json.const = val;
		} else {
			if (vals.every((v) => typeof v === "number")) json.type = "number";
			if (vals.every((v) => typeof v === "string")) json.type = "string";
			if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
			if (vals.every((v) => v === null)) json.type = "null";
			json.enum = vals;
		}
	};
	nanProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("NaN cannot be represented in JSON Schema");
	};
	templateLiteralProcessor = (schema, _ctx, json, _params) => {
		const _json = json;
		const pattern = schema._zod.pattern;
		if (!pattern) throw new Error("Pattern not found in template literal");
		_json.type = "string";
		_json.pattern = pattern.source;
	};
	fileProcessor = (schema, _ctx, json, _params) => {
		const _json = json;
		const file = {
			type: "string",
			format: "binary",
			contentEncoding: "binary"
		};
		const { minimum, maximum, mime } = schema._zod.bag;
		if (minimum !== void 0) file.minLength = minimum;
		if (maximum !== void 0) file.maxLength = maximum;
		if (mime) if (mime.length === 1) {
			file.contentMediaType = mime[0];
			Object.assign(_json, file);
		} else {
			Object.assign(_json, file);
			_json.anyOf = mime.map((m) => ({ contentMediaType: m }));
		}
		else Object.assign(_json, file);
	};
	successProcessor = (_schema, _ctx, json, _params) => {
		json.type = "boolean";
	};
	customProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
	};
	functionProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Function types cannot be represented in JSON Schema");
	};
	transformProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
	};
	mapProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Map cannot be represented in JSON Schema");
	};
	setProcessor = (_schema, ctx, _json, _params) => {
		if (ctx.unrepresentable === "throw") throw new Error("Set cannot be represented in JSON Schema");
	};
	arrayProcessor = (schema, ctx, _json, params) => {
		const json = _json;
		const def = schema._zod.def;
		const { minimum, maximum } = schema._zod.bag;
		if (typeof minimum === "number") json.minItems = minimum;
		if (typeof maximum === "number") json.maxItems = maximum;
		json.type = "array";
		json.items = process(def.element, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [...params.path, "items"] }));
	};
	objectProcessor = (schema, ctx, _json, params) => {
		var _def$catchall;
		const json = _json;
		const def = schema._zod.def;
		json.type = "object";
		json.properties = {};
		const shape = def.shape;
		for (const key in shape) json.properties[key] = process(shape[key], ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
			...params.path,
			"properties",
			key
		] }));
		const allKeys = new Set(Object.keys(shape));
		const requiredKeys = new Set([...allKeys].filter((key) => {
			const v = def.shape[key]._zod;
			if (ctx.io === "input") return v.optin === void 0;
			else return v.optout === void 0;
		}));
		if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
		if (((_def$catchall = def.catchall) === null || _def$catchall === void 0 ? void 0 : _def$catchall._zod.def.type) === "never") json.additionalProperties = false;
		else if (!def.catchall) {
			if (ctx.io === "output") json.additionalProperties = false;
		} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [...params.path, "additionalProperties"] }));
	};
	unionProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		const isExclusive = def.inclusive === false;
		const options = def.options.map((x, i) => process(x, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		] })));
		if (isExclusive) json.oneOf = options;
		else json.anyOf = options;
	};
	intersectionProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		const a = process(def.left, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
			...params.path,
			"allOf",
			0
		] }));
		const b = process(def.right, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
			...params.path,
			"allOf",
			1
		] }));
		const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
		json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	};
	tupleProcessor = (schema, ctx, _json, params) => {
		const json = _json;
		const def = schema._zod.def;
		json.type = "array";
		const prefixPath = ctx.target === "draft-2020-12" ? "prefixItems" : "items";
		const restPath = ctx.target === "draft-2020-12" ? "items" : ctx.target === "openapi-3.0" ? "items" : "additionalItems";
		const prefixItems = def.items.map((x, i) => process(x, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
			...params.path,
			prefixPath,
			i
		] })));
		const rest = def.rest ? process(def.rest, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
			...params.path,
			restPath,
			...ctx.target === "openapi-3.0" ? [def.items.length] : []
		] })) : null;
		if (ctx.target === "draft-2020-12") {
			json.prefixItems = prefixItems;
			if (rest) json.items = rest;
		} else if (ctx.target === "openapi-3.0") {
			json.items = { anyOf: prefixItems };
			if (rest) json.items.anyOf.push(rest);
			json.minItems = prefixItems.length;
			if (!rest) json.maxItems = prefixItems.length;
		} else {
			json.items = prefixItems;
			if (rest) json.additionalItems = rest;
		}
		const { minimum, maximum } = schema._zod.bag;
		if (typeof minimum === "number") json.minItems = minimum;
		if (typeof maximum === "number") json.maxItems = maximum;
	};
	recordProcessor = (schema, ctx, _json, params) => {
		const json = _json;
		const def = schema._zod.def;
		json.type = "object";
		const keyType = def.keyType;
		const keyBag = keyType._zod.bag;
		const patterns = keyBag === null || keyBag === void 0 ? void 0 : keyBag.patterns;
		if (def.mode === "loose" && patterns && patterns.size > 0) {
			const valueSchema = process(def.valueType, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [
				...params.path,
				"patternProperties",
				"*"
			] }));
			json.patternProperties = {};
			for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
		} else {
			if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process(def.keyType, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [...params.path, "propertyNames"] }));
			json.additionalProperties = process(def.valueType, ctx, _objectSpread2(_objectSpread2({}, params), {}, { path: [...params.path, "additionalProperties"] }));
		}
		const keyValues = keyType._zod.values;
		if (keyValues) {
			const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
			if (validKeyValues.length > 0) json.required = validKeyValues;
		}
	};
	nullableProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		const inner = process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		if (ctx.target === "openapi-3.0") {
			seen.ref = def.innerType;
			json.nullable = true;
		} else json.anyOf = [inner, { type: "null" }];
	};
	nonoptionalProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
	};
	defaultProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		json.default = JSON.parse(JSON.stringify(def.defaultValue));
	};
	prefaultProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
	};
	catchProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		let catchValue;
		try {
			catchValue = def.catchValue(void 0);
		} catch (_unused) {
			throw new Error("Dynamic catch values are not supported in JSON Schema");
		}
		json.default = catchValue;
	};
	pipeProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		const innerType = ctx.io === "input" ? def.in._zod.def.type === "transform" ? def.out : def.in : def.out;
		process(innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = innerType;
	};
	readonlyProcessor = (schema, ctx, json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
		json.readOnly = true;
	};
	promiseProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
	};
	optionalProcessor = (schema, ctx, _json, params) => {
		const def = schema._zod.def;
		process(def.innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = def.innerType;
	};
	lazyProcessor = (schema, ctx, _json, params) => {
		const innerType = schema._zod.innerType;
		process(innerType, ctx, params);
		const seen = ctx.seen.get(schema);
		seen.ref = innerType;
	};
	allProcessors = {
		string: stringProcessor,
		number: numberProcessor,
		boolean: booleanProcessor,
		bigint: bigintProcessor,
		symbol: symbolProcessor,
		null: nullProcessor,
		undefined: undefinedProcessor,
		void: voidProcessor,
		never: neverProcessor,
		any: anyProcessor,
		unknown: unknownProcessor,
		date: dateProcessor,
		enum: enumProcessor,
		literal: literalProcessor,
		nan: nanProcessor,
		template_literal: templateLiteralProcessor,
		file: fileProcessor,
		success: successProcessor,
		custom: customProcessor,
		function: functionProcessor,
		transform: transformProcessor,
		map: mapProcessor,
		set: setProcessor,
		array: arrayProcessor,
		object: objectProcessor,
		union: unionProcessor,
		intersection: intersectionProcessor,
		tuple: tupleProcessor,
		record: recordProcessor,
		nullable: nullableProcessor,
		nonoptional: nonoptionalProcessor,
		default: defaultProcessor,
		prefault: prefaultProcessor,
		catch: catchProcessor,
		pipe: pipeProcessor,
		readonly: readonlyProcessor,
		promise: promiseProcessor,
		optional: optionalProcessor,
		lazy: lazyProcessor
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/json-schema-generator.js
var _excluded$2, JSONSchemaGenerator;
var init_json_schema_generator = __esmMin((() => {
	init_json_schema_processors();
	init_to_json_schema();
	init_objectSpread2();
	init_objectWithoutProperties();
	_excluded$2 = ["~standard"];
	JSONSchemaGenerator = class {
		/** @deprecated Access via ctx instead */
		get metadataRegistry() {
			return this.ctx.metadataRegistry;
		}
		/** @deprecated Access via ctx instead */
		get target() {
			return this.ctx.target;
		}
		/** @deprecated Access via ctx instead */
		get unrepresentable() {
			return this.ctx.unrepresentable;
		}
		/** @deprecated Access via ctx instead */
		get override() {
			return this.ctx.override;
		}
		/** @deprecated Access via ctx instead */
		get io() {
			return this.ctx.io;
		}
		/** @deprecated Access via ctx instead */
		get counter() {
			return this.ctx.counter;
		}
		set counter(value) {
			this.ctx.counter = value;
		}
		/** @deprecated Access via ctx instead */
		get seen() {
			return this.ctx.seen;
		}
		constructor(params) {
			var _params$target;
			let normalizedTarget = (_params$target = params === null || params === void 0 ? void 0 : params.target) !== null && _params$target !== void 0 ? _params$target : "draft-2020-12";
			if (normalizedTarget === "draft-4") normalizedTarget = "draft-04";
			if (normalizedTarget === "draft-7") normalizedTarget = "draft-07";
			this.ctx = initializeContext(_objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({
				processors: allProcessors,
				target: normalizedTarget
			}, (params === null || params === void 0 ? void 0 : params.metadata) && { metadata: params.metadata }), (params === null || params === void 0 ? void 0 : params.unrepresentable) && { unrepresentable: params.unrepresentable }), (params === null || params === void 0 ? void 0 : params.override) && { override: params.override }), (params === null || params === void 0 ? void 0 : params.io) && { io: params.io }));
		}
		/**
		* Process a schema to prepare it for JSON Schema generation.
		* This must be called before emit().
		*/
		process(schema, _params = {
			path: [],
			schemaPath: []
		}) {
			return process(schema, this.ctx, _params);
		}
		/**
		* Emit the final JSON Schema after processing.
		* Must call process() first.
		*/
		emit(schema, _params) {
			if (_params) {
				if (_params.cycles) this.ctx.cycles = _params.cycles;
				if (_params.reused) this.ctx.reused = _params.reused;
				if (_params.external) this.ctx.external = _params.external;
			}
			extractDefs(this.ctx, schema);
			const result = finalize(this.ctx, schema);
			const { "~standard": _ } = result;
			return _objectWithoutProperties(result, _excluded$2);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/json-schema.js
var json_schema_exports = /* @__PURE__ */ __exportAll({});
var init_json_schema = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/core/index.js
var core_exports = /* @__PURE__ */ __exportAll({
	$ZodAny: () => $ZodAny,
	$ZodArray: () => $ZodArray,
	$ZodAsyncError: () => $ZodAsyncError,
	$ZodBase64: () => $ZodBase64,
	$ZodBase64URL: () => $ZodBase64URL,
	$ZodBigInt: () => $ZodBigInt,
	$ZodBigIntFormat: () => $ZodBigIntFormat,
	$ZodBoolean: () => $ZodBoolean,
	$ZodCIDRv4: () => $ZodCIDRv4,
	$ZodCIDRv6: () => $ZodCIDRv6,
	$ZodCUID: () => $ZodCUID,
	$ZodCUID2: () => $ZodCUID2,
	$ZodCatch: () => $ZodCatch,
	$ZodCheck: () => $ZodCheck,
	$ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
	$ZodCheckEndsWith: () => $ZodCheckEndsWith,
	$ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
	$ZodCheckIncludes: () => $ZodCheckIncludes,
	$ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
	$ZodCheckLessThan: () => $ZodCheckLessThan,
	$ZodCheckLowerCase: () => $ZodCheckLowerCase,
	$ZodCheckMaxLength: () => $ZodCheckMaxLength,
	$ZodCheckMaxSize: () => $ZodCheckMaxSize,
	$ZodCheckMimeType: () => $ZodCheckMimeType,
	$ZodCheckMinLength: () => $ZodCheckMinLength,
	$ZodCheckMinSize: () => $ZodCheckMinSize,
	$ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
	$ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
	$ZodCheckOverwrite: () => $ZodCheckOverwrite,
	$ZodCheckProperty: () => $ZodCheckProperty,
	$ZodCheckRegex: () => $ZodCheckRegex,
	$ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
	$ZodCheckStartsWith: () => $ZodCheckStartsWith,
	$ZodCheckStringFormat: () => $ZodCheckStringFormat,
	$ZodCheckUpperCase: () => $ZodCheckUpperCase,
	$ZodCodec: () => $ZodCodec,
	$ZodCustom: () => $ZodCustom,
	$ZodCustomStringFormat: () => $ZodCustomStringFormat,
	$ZodDate: () => $ZodDate,
	$ZodDefault: () => $ZodDefault,
	$ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
	$ZodE164: () => $ZodE164,
	$ZodEmail: () => $ZodEmail,
	$ZodEmoji: () => $ZodEmoji,
	$ZodEncodeError: () => $ZodEncodeError,
	$ZodEnum: () => $ZodEnum,
	$ZodError: () => $ZodError,
	$ZodExactOptional: () => $ZodExactOptional,
	$ZodFile: () => $ZodFile,
	$ZodFunction: () => $ZodFunction,
	$ZodGUID: () => $ZodGUID,
	$ZodIPv4: () => $ZodIPv4,
	$ZodIPv6: () => $ZodIPv6,
	$ZodISODate: () => $ZodISODate,
	$ZodISODateTime: () => $ZodISODateTime,
	$ZodISODuration: () => $ZodISODuration,
	$ZodISOTime: () => $ZodISOTime,
	$ZodIntersection: () => $ZodIntersection,
	$ZodJWT: () => $ZodJWT,
	$ZodKSUID: () => $ZodKSUID,
	$ZodLazy: () => $ZodLazy,
	$ZodLiteral: () => $ZodLiteral,
	$ZodMAC: () => $ZodMAC,
	$ZodMap: () => $ZodMap,
	$ZodNaN: () => $ZodNaN,
	$ZodNanoID: () => $ZodNanoID,
	$ZodNever: () => $ZodNever,
	$ZodNonOptional: () => $ZodNonOptional,
	$ZodNull: () => $ZodNull,
	$ZodNullable: () => $ZodNullable,
	$ZodNumber: () => $ZodNumber,
	$ZodNumberFormat: () => $ZodNumberFormat,
	$ZodObject: () => $ZodObject,
	$ZodObjectJIT: () => $ZodObjectJIT,
	$ZodOptional: () => $ZodOptional,
	$ZodPipe: () => $ZodPipe,
	$ZodPrefault: () => $ZodPrefault,
	$ZodPromise: () => $ZodPromise,
	$ZodReadonly: () => $ZodReadonly,
	$ZodRealError: () => $ZodRealError,
	$ZodRecord: () => $ZodRecord,
	$ZodRegistry: () => $ZodRegistry$1,
	$ZodSet: () => $ZodSet,
	$ZodString: () => $ZodString,
	$ZodStringFormat: () => $ZodStringFormat,
	$ZodSuccess: () => $ZodSuccess,
	$ZodSymbol: () => $ZodSymbol,
	$ZodTemplateLiteral: () => $ZodTemplateLiteral,
	$ZodTransform: () => $ZodTransform,
	$ZodTuple: () => $ZodTuple,
	$ZodType: () => $ZodType,
	$ZodULID: () => $ZodULID,
	$ZodURL: () => $ZodURL,
	$ZodUUID: () => $ZodUUID,
	$ZodUndefined: () => $ZodUndefined,
	$ZodUnion: () => $ZodUnion,
	$ZodUnknown: () => $ZodUnknown,
	$ZodVoid: () => $ZodVoid,
	$ZodXID: () => $ZodXID,
	$ZodXor: () => $ZodXor,
	$brand: () => $brand,
	$constructor: () => $constructor,
	$input: () => $input,
	$output: () => $output,
	Doc: () => Doc,
	JSONSchema: () => json_schema_exports,
	JSONSchemaGenerator: () => JSONSchemaGenerator,
	NEVER: () => NEVER,
	TimePrecision: () => TimePrecision,
	_any: () => _any,
	_array: () => _array,
	_base64: () => _base64,
	_base64url: () => _base64url,
	_bigint: () => _bigint,
	_boolean: () => _boolean,
	_catch: () => _catch$1,
	_check: () => _check,
	_cidrv4: () => _cidrv4,
	_cidrv6: () => _cidrv6,
	_coercedBigint: () => _coercedBigint,
	_coercedBoolean: () => _coercedBoolean,
	_coercedDate: () => _coercedDate,
	_coercedNumber: () => _coercedNumber,
	_coercedString: () => _coercedString,
	_cuid: () => _cuid,
	_cuid2: () => _cuid2,
	_custom: () => _custom,
	_date: () => _date,
	_decode: () => _decode,
	_decodeAsync: () => _decodeAsync,
	_default: () => _default$1,
	_discriminatedUnion: () => _discriminatedUnion,
	_e164: () => _e164,
	_email: () => _email,
	_emoji: () => _emoji,
	_encode: () => _encode,
	_encodeAsync: () => _encodeAsync,
	_endsWith: () => _endsWith,
	_enum: () => _enum$1,
	_file: () => _file,
	_float32: () => _float32,
	_float64: () => _float64,
	_gt: () => _gt,
	_gte: () => _gte,
	_guid: () => _guid,
	_includes: () => _includes,
	_int: () => _int,
	_int32: () => _int32,
	_int64: () => _int64,
	_intersection: () => _intersection,
	_ipv4: () => _ipv4,
	_ipv6: () => _ipv6,
	_isoDate: () => _isoDate,
	_isoDateTime: () => _isoDateTime,
	_isoDuration: () => _isoDuration,
	_isoTime: () => _isoTime,
	_jwt: () => _jwt,
	_ksuid: () => _ksuid,
	_lazy: () => _lazy,
	_length: () => _length,
	_literal: () => _literal,
	_lowercase: () => _lowercase,
	_lt: () => _lt,
	_lte: () => _lte,
	_mac: () => _mac,
	_map: () => _map,
	_max: () => _lte,
	_maxLength: () => _maxLength,
	_maxSize: () => _maxSize,
	_mime: () => _mime,
	_min: () => _gte,
	_minLength: () => _minLength,
	_minSize: () => _minSize,
	_multipleOf: () => _multipleOf,
	_nan: () => _nan,
	_nanoid: () => _nanoid,
	_nativeEnum: () => _nativeEnum,
	_negative: () => _negative,
	_never: () => _never,
	_nonnegative: () => _nonnegative,
	_nonoptional: () => _nonoptional,
	_nonpositive: () => _nonpositive,
	_normalize: () => _normalize,
	_null: () => _null$1,
	_nullable: () => _nullable,
	_number: () => _number,
	_optional: () => _optional,
	_overwrite: () => _overwrite,
	_parse: () => _parse,
	_parseAsync: () => _parseAsync,
	_pipe: () => _pipe,
	_positive: () => _positive,
	_promise: () => _promise,
	_property: () => _property,
	_readonly: () => _readonly,
	_record: () => _record,
	_refine: () => _refine,
	_regex: () => _regex,
	_safeDecode: () => _safeDecode,
	_safeDecodeAsync: () => _safeDecodeAsync,
	_safeEncode: () => _safeEncode,
	_safeEncodeAsync: () => _safeEncodeAsync,
	_safeParse: () => _safeParse,
	_safeParseAsync: () => _safeParseAsync,
	_set: () => _set,
	_size: () => _size,
	_slugify: () => _slugify,
	_startsWith: () => _startsWith,
	_string: () => _string,
	_stringFormat: () => _stringFormat,
	_stringbool: () => _stringbool,
	_success: () => _success,
	_superRefine: () => _superRefine,
	_symbol: () => _symbol,
	_templateLiteral: () => _templateLiteral,
	_toLowerCase: () => _toLowerCase,
	_toUpperCase: () => _toUpperCase,
	_transform: () => _transform,
	_trim: () => _trim,
	_tuple: () => _tuple,
	_uint32: () => _uint32,
	_uint64: () => _uint64,
	_ulid: () => _ulid,
	_undefined: () => _undefined$1,
	_union: () => _union,
	_unknown: () => _unknown,
	_uppercase: () => _uppercase,
	_url: () => _url,
	_uuid: () => _uuid,
	_uuidv4: () => _uuidv4,
	_uuidv6: () => _uuidv6,
	_uuidv7: () => _uuidv7,
	_void: () => _void$1,
	_xid: () => _xid,
	_xor: () => _xor,
	clone: () => clone,
	config: () => config,
	createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
	createToJSONSchemaMethod: () => createToJSONSchemaMethod,
	decode: () => decode$1,
	decodeAsync: () => decodeAsync$1,
	describe: () => describe$1,
	encode: () => encode$1,
	encodeAsync: () => encodeAsync$1,
	extractDefs: () => extractDefs,
	finalize: () => finalize,
	flattenError: () => flattenError,
	formatError: () => formatError,
	globalConfig: () => globalConfig,
	globalRegistry: () => globalRegistry,
	initializeContext: () => initializeContext,
	isValidBase64: () => isValidBase64,
	isValidBase64URL: () => isValidBase64URL,
	isValidJWT: () => isValidJWT,
	locales: () => locales_exports,
	meta: () => meta$1,
	parse: () => parse$1,
	parseAsync: () => parseAsync$1,
	prettifyError: () => prettifyError,
	process: () => process,
	regexes: () => regexes_exports,
	registry: () => registry$1,
	safeDecode: () => safeDecode$1,
	safeDecodeAsync: () => safeDecodeAsync$1,
	safeEncode: () => safeEncode$1,
	safeEncodeAsync: () => safeEncodeAsync$1,
	safeParse: () => safeParse$1,
	safeParseAsync: () => safeParseAsync$1,
	setParseAdapter: () => setParseAdapter$1,
	toDotPath: () => toDotPath,
	toJSONSchema: () => toJSONSchema,
	treeifyError: () => treeifyError,
	util: () => util_exports,
	version: () => version
});
var init_core = __esmMin((() => {
	init_core$1();
	init_parse$1();
	init_errors$1();
	init_schemas$1();
	init_checks$1();
	init_versions();
	init_util();
	init_regexes();
	init_locales$1();
	init_registries();
	init_doc();
	init_api();
	init_to_json_schema();
	init_json_schema_processors();
	init_json_schema_generator();
	init_json_schema();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/checks.js
var checks_exports = /* @__PURE__ */ __exportAll({
	endsWith: () => _endsWith,
	gt: () => _gt,
	gte: () => _gte,
	includes: () => _includes,
	length: () => _length,
	lowercase: () => _lowercase,
	lt: () => _lt,
	lte: () => _lte,
	maxLength: () => _maxLength,
	maxSize: () => _maxSize,
	mime: () => _mime,
	minLength: () => _minLength,
	minSize: () => _minSize,
	multipleOf: () => _multipleOf,
	negative: () => _negative,
	nonnegative: () => _nonnegative,
	nonpositive: () => _nonpositive,
	normalize: () => _normalize,
	overwrite: () => _overwrite,
	positive: () => _positive,
	property: () => _property,
	regex: () => _regex,
	size: () => _size,
	slugify: () => _slugify,
	startsWith: () => _startsWith,
	toLowerCase: () => _toLowerCase,
	toUpperCase: () => _toUpperCase,
	trim: () => _trim,
	uppercase: () => _uppercase
});
var init_checks = __esmMin((() => {
	init_core();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/iso.js
var iso_exports = /* @__PURE__ */ __exportAll({
	ZodISODate: () => ZodISODate,
	ZodISODateTime: () => ZodISODateTime,
	ZodISODuration: () => ZodISODuration,
	ZodISOTime: () => ZodISOTime,
	date: () => date$2,
	datetime: () => datetime,
	duration: () => duration,
	time: () => time
});
function datetime(params) {
	return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
function date$2(params) {
	return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
function time(params) {
	return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
function duration(params) {
	return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
var ZodISODateTime, ZodISODate, ZodISOTime, ZodISODuration;
var init_iso = __esmMin((() => {
	init_core();
	init_schemas();
	ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
		$ZodISODateTime.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
		$ZodISODate.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
		$ZodISOTime.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
		$ZodISODuration.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/errors.js
var initializer, ZodError, ZodRealError;
var init_errors = __esmMin((() => {
	init_core();
	init_util();
	initializer = (inst, issues) => {
		$ZodError.init(inst, issues);
		inst.name = "ZodError";
		Object.defineProperties(inst, {
			format: { value: (mapper) => formatError(inst, mapper) },
			flatten: { value: (mapper) => flattenError(inst, mapper) },
			addIssue: { value: (issue) => {
				inst.issues.push(issue);
				inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
			} },
			addIssues: { value: (issues) => {
				inst.issues.push(...issues);
				inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
			} },
			isEmpty: { get() {
				return inst.issues.length === 0;
			} }
		});
	};
	ZodError = $constructor("ZodError", initializer);
	ZodRealError = $constructor("ZodError", initializer, { Parent: Error });
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/parse.js
var parse, parseAsync, safeParse, safeParseAsync, encode, decode, encodeAsync, decodeAsync, safeEncode, safeDecode, safeEncodeAsync, safeDecodeAsync;
var init_parse = __esmMin((() => {
	init_core();
	init_errors();
	parse = /* @__PURE__ */ _parse(ZodRealError);
	parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
	safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
	safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
	encode = /* @__PURE__ */ _encode(ZodRealError);
	decode = /* @__PURE__ */ _decode(ZodRealError);
	encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
	decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
	safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
	safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
	safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
	safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/schemas.js
var schemas_exports = /* @__PURE__ */ __exportAll({
	ZodAny: () => ZodAny,
	ZodArray: () => ZodArray,
	ZodBase64: () => ZodBase64,
	ZodBase64URL: () => ZodBase64URL,
	ZodBigInt: () => ZodBigInt,
	ZodBigIntFormat: () => ZodBigIntFormat,
	ZodBoolean: () => ZodBoolean,
	ZodCIDRv4: () => ZodCIDRv4,
	ZodCIDRv6: () => ZodCIDRv6,
	ZodCUID: () => ZodCUID,
	ZodCUID2: () => ZodCUID2,
	ZodCatch: () => ZodCatch,
	ZodCodec: () => ZodCodec,
	ZodCustom: () => ZodCustom,
	ZodCustomStringFormat: () => ZodCustomStringFormat,
	ZodDate: () => ZodDate,
	ZodDefault: () => ZodDefault,
	ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
	ZodE164: () => ZodE164,
	ZodEmail: () => ZodEmail,
	ZodEmoji: () => ZodEmoji,
	ZodEnum: () => ZodEnum,
	ZodExactOptional: () => ZodExactOptional,
	ZodFile: () => ZodFile,
	ZodFunction: () => ZodFunction,
	ZodGUID: () => ZodGUID,
	ZodIPv4: () => ZodIPv4,
	ZodIPv6: () => ZodIPv6,
	ZodIntersection: () => ZodIntersection,
	ZodJWT: () => ZodJWT,
	ZodKSUID: () => ZodKSUID,
	ZodLazy: () => ZodLazy,
	ZodLiteral: () => ZodLiteral,
	ZodMAC: () => ZodMAC,
	ZodMap: () => ZodMap,
	ZodNaN: () => ZodNaN,
	ZodNanoID: () => ZodNanoID,
	ZodNever: () => ZodNever,
	ZodNonOptional: () => ZodNonOptional,
	ZodNull: () => ZodNull,
	ZodNullable: () => ZodNullable,
	ZodNumber: () => ZodNumber,
	ZodNumberFormat: () => ZodNumberFormat,
	ZodObject: () => ZodObject,
	ZodOptional: () => ZodOptional,
	ZodPipe: () => ZodPipe,
	ZodPrefault: () => ZodPrefault,
	ZodPromise: () => ZodPromise,
	ZodReadonly: () => ZodReadonly,
	ZodRecord: () => ZodRecord,
	ZodSet: () => ZodSet,
	ZodString: () => ZodString,
	ZodStringFormat: () => ZodStringFormat,
	ZodSuccess: () => ZodSuccess,
	ZodSymbol: () => ZodSymbol,
	ZodTemplateLiteral: () => ZodTemplateLiteral,
	ZodTransform: () => ZodTransform,
	ZodTuple: () => ZodTuple,
	ZodType: () => ZodType,
	ZodULID: () => ZodULID,
	ZodURL: () => ZodURL,
	ZodUUID: () => ZodUUID,
	ZodUndefined: () => ZodUndefined,
	ZodUnion: () => ZodUnion,
	ZodUnknown: () => ZodUnknown,
	ZodVoid: () => ZodVoid,
	ZodXID: () => ZodXID,
	ZodXor: () => ZodXor,
	_ZodString: () => _ZodString,
	_default: () => _default,
	_function: () => _function,
	any: () => any,
	array: () => array,
	base64: () => base64,
	base64url: () => base64url,
	bigint: () => bigint$1,
	boolean: () => boolean$1,
	catch: () => _catch,
	check: () => check,
	cidrv4: () => cidrv4,
	cidrv6: () => cidrv6,
	codec: () => codec,
	cuid: () => cuid,
	cuid2: () => cuid2,
	custom: () => custom,
	date: () => date$1,
	describe: () => describe,
	discriminatedUnion: () => discriminatedUnion,
	e164: () => e164,
	email: () => email,
	emoji: () => emoji,
	enum: () => _enum,
	exactOptional: () => exactOptional,
	file: () => file,
	float32: () => float32,
	float64: () => float64,
	function: () => _function,
	guid: () => guid,
	hash: () => hash,
	hex: () => hex,
	hostname: () => hostname,
	httpUrl: () => httpUrl,
	instanceof: () => _instanceof,
	int: () => int,
	int32: () => int32,
	int64: () => int64,
	intersection: () => intersection,
	ipv4: () => ipv4,
	ipv6: () => ipv6,
	json: () => json,
	jwt: () => jwt,
	keyof: () => keyof,
	ksuid: () => ksuid,
	lazy: () => lazy,
	literal: () => literal,
	looseObject: () => looseObject,
	looseRecord: () => looseRecord,
	mac: () => mac,
	map: () => map,
	meta: () => meta,
	nan: () => nan,
	nanoid: () => nanoid,
	nativeEnum: () => nativeEnum,
	never: () => never,
	nonoptional: () => nonoptional,
	null: () => _null,
	nullable: () => nullable,
	nullish: () => nullish,
	number: () => number$1,
	object: () => object,
	optional: () => optional,
	partialRecord: () => partialRecord,
	pipe: () => pipe,
	prefault: () => prefault,
	preprocess: () => preprocess,
	promise: () => promise,
	readonly: () => readonly,
	record: () => record,
	refine: () => refine,
	set: () => set,
	strictObject: () => strictObject,
	string: () => string$1,
	stringFormat: () => stringFormat,
	stringbool: () => stringbool,
	success: () => success,
	superRefine: () => superRefine,
	symbol: () => symbol,
	templateLiteral: () => templateLiteral,
	transform: () => transform,
	tuple: () => tuple,
	uint32: () => uint32,
	uint64: () => uint64,
	ulid: () => ulid,
	undefined: () => _undefined,
	union: () => union,
	unknown: () => unknown,
	url: () => url,
	uuid: () => uuid,
	uuidv4: () => uuidv4,
	uuidv6: () => uuidv6,
	uuidv7: () => uuidv7,
	void: () => _void,
	xid: () => xid,
	xor: () => xor
});
function string$1(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
function email(params) {
	return /* @__PURE__ */ _email(ZodEmail, params);
}
function guid(params) {
	return /* @__PURE__ */ _guid(ZodGUID, params);
}
function uuid(params) {
	return /* @__PURE__ */ _uuid(ZodUUID, params);
}
function uuidv4(params) {
	return /* @__PURE__ */ _uuidv4(ZodUUID, params);
}
function uuidv6(params) {
	return /* @__PURE__ */ _uuidv6(ZodUUID, params);
}
function uuidv7(params) {
	return /* @__PURE__ */ _uuidv7(ZodUUID, params);
}
function url(params) {
	return /* @__PURE__ */ _url(ZodURL, params);
}
function httpUrl(params) {
	return /* @__PURE__ */ _url(ZodURL, _objectSpread2({
		protocol: httpProtocol,
		hostname: domain
	}, normalizeParams(params)));
}
function emoji(params) {
	return /* @__PURE__ */ _emoji(ZodEmoji, params);
}
function nanoid(params) {
	return /* @__PURE__ */ _nanoid(ZodNanoID, params);
}
function cuid(params) {
	return /* @__PURE__ */ _cuid(ZodCUID, params);
}
function cuid2(params) {
	return /* @__PURE__ */ _cuid2(ZodCUID2, params);
}
function ulid(params) {
	return /* @__PURE__ */ _ulid(ZodULID, params);
}
function xid(params) {
	return /* @__PURE__ */ _xid(ZodXID, params);
}
function ksuid(params) {
	return /* @__PURE__ */ _ksuid(ZodKSUID, params);
}
function ipv4(params) {
	return /* @__PURE__ */ _ipv4(ZodIPv4, params);
}
function mac(params) {
	return /* @__PURE__ */ _mac(ZodMAC, params);
}
function ipv6(params) {
	return /* @__PURE__ */ _ipv6(ZodIPv6, params);
}
function cidrv4(params) {
	return /* @__PURE__ */ _cidrv4(ZodCIDRv4, params);
}
function cidrv6(params) {
	return /* @__PURE__ */ _cidrv6(ZodCIDRv6, params);
}
function base64(params) {
	return /* @__PURE__ */ _base64(ZodBase64, params);
}
function base64url(params) {
	return /* @__PURE__ */ _base64url(ZodBase64URL, params);
}
function e164(params) {
	return /* @__PURE__ */ _e164(ZodE164, params);
}
function jwt(params) {
	return /* @__PURE__ */ _jwt(ZodJWT, params);
}
function stringFormat(format, fnOrRegex, _params = {}) {
	return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function hostname(_params) {
	return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, "hostname", hostname$1, _params);
}
function hex(_params) {
	return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, "hex", hex$1, _params);
}
function hash(alg, params) {
	var _params$enc;
	const format = `${alg}_${(_params$enc = params === null || params === void 0 ? void 0 : params.enc) !== null && _params$enc !== void 0 ? _params$enc : "hex"}`;
	const regex = regexes_exports[format];
	if (!regex) throw new Error(`Unrecognized hash format: ${format}`);
	return /* @__PURE__ */ _stringFormat(ZodCustomStringFormat, format, regex, params);
}
function number$1(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
function float32(params) {
	return /* @__PURE__ */ _float32(ZodNumberFormat, params);
}
function float64(params) {
	return /* @__PURE__ */ _float64(ZodNumberFormat, params);
}
function int32(params) {
	return /* @__PURE__ */ _int32(ZodNumberFormat, params);
}
function uint32(params) {
	return /* @__PURE__ */ _uint32(ZodNumberFormat, params);
}
function boolean$1(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
function bigint$1(params) {
	return /* @__PURE__ */ _bigint(ZodBigInt, params);
}
function int64(params) {
	return /* @__PURE__ */ _int64(ZodBigIntFormat, params);
}
function uint64(params) {
	return /* @__PURE__ */ _uint64(ZodBigIntFormat, params);
}
function symbol(params) {
	return /* @__PURE__ */ _symbol(ZodSymbol, params);
}
function _undefined(params) {
	return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
}
function _null(params) {
	return /* @__PURE__ */ _null$1(ZodNull, params);
}
function any() {
	return /* @__PURE__ */ _any(ZodAny);
}
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
function _void(params) {
	return /* @__PURE__ */ _void$1(ZodVoid, params);
}
function date$1(params) {
	return /* @__PURE__ */ _date(ZodDate, params);
}
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
function keyof(schema) {
	const shape = schema._zod.def.shape;
	return _enum(Object.keys(shape));
}
function object(shape, params) {
	return new ZodObject(_objectSpread2({
		type: "object",
		shape: shape !== null && shape !== void 0 ? shape : {}
	}, normalizeParams(params)));
}
function strictObject(shape, params) {
	return new ZodObject(_objectSpread2({
		type: "object",
		shape,
		catchall: never()
	}, normalizeParams(params)));
}
function looseObject(shape, params) {
	return new ZodObject(_objectSpread2({
		type: "object",
		shape,
		catchall: unknown()
	}, normalizeParams(params)));
}
function union(options, params) {
	return new ZodUnion(_objectSpread2({
		type: "union",
		options
	}, normalizeParams(params)));
}
/** Creates an exclusive union (XOR) where exactly one option must match.
* Unlike regular unions that succeed when any option matches, xor fails if
* zero or more than one option matches the input. */
function xor(options, params) {
	return new ZodXor(_objectSpread2({
		type: "union",
		options,
		inclusive: false
	}, normalizeParams(params)));
}
function discriminatedUnion(discriminator, options, params) {
	return new ZodDiscriminatedUnion(_objectSpread2({
		type: "union",
		options,
		discriminator
	}, normalizeParams(params)));
}
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
function tuple(items, _paramsOrRest, _params) {
	const hasRest = _paramsOrRest instanceof $ZodType;
	return new ZodTuple(_objectSpread2({
		type: "tuple",
		items,
		rest: hasRest ? _paramsOrRest : null
	}, normalizeParams(hasRest ? _params : _paramsOrRest)));
}
function record(keyType, valueType, params) {
	return new ZodRecord(_objectSpread2({
		type: "record",
		keyType,
		valueType
	}, normalizeParams(params)));
}
function partialRecord(keyType, valueType, params) {
	const k = clone(keyType);
	k._zod.values = void 0;
	return new ZodRecord(_objectSpread2({
		type: "record",
		keyType: k,
		valueType
	}, normalizeParams(params)));
}
function looseRecord(keyType, valueType, params) {
	return new ZodRecord(_objectSpread2({
		type: "record",
		keyType,
		valueType,
		mode: "loose"
	}, normalizeParams(params)));
}
function map(keyType, valueType, params) {
	return new ZodMap(_objectSpread2({
		type: "map",
		keyType,
		valueType
	}, normalizeParams(params)));
}
function set(valueType, params) {
	return new ZodSet(_objectSpread2({
		type: "set",
		valueType
	}, normalizeParams(params)));
}
function _enum(values, params) {
	return new ZodEnum(_objectSpread2({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values
	}, normalizeParams(params)));
}
/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
*
* ```ts
* enum Colors { red, green, blue }
* z.enum(Colors);
* ```
*/
function nativeEnum(entries, params) {
	return new ZodEnum(_objectSpread2({
		type: "enum",
		entries
	}, normalizeParams(params)));
}
function literal(value, params) {
	return new ZodLiteral(_objectSpread2({
		type: "literal",
		values: Array.isArray(value) ? value : [value]
	}, normalizeParams(params)));
}
function file(params) {
	return /* @__PURE__ */ _file(ZodFile, params);
}
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
function nullish(innerType) {
	return optional(nullable(innerType));
}
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
function nonoptional(innerType, params) {
	return new ZodNonOptional(_objectSpread2({
		type: "nonoptional",
		innerType
	}, normalizeParams(params)));
}
function success(innerType) {
	return new ZodSuccess({
		type: "success",
		innerType
	});
}
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
function nan(params) {
	return /* @__PURE__ */ _nan(ZodNaN, params);
}
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
function codec(in_, out, params) {
	return new ZodCodec({
		type: "pipe",
		in: in_,
		out,
		transform: params.decode,
		reverseTransform: params.encode
	});
}
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
function templateLiteral(parts, params) {
	return new ZodTemplateLiteral(_objectSpread2({
		type: "template_literal",
		parts
	}, normalizeParams(params)));
}
function lazy(getter) {
	return new ZodLazy({
		type: "lazy",
		getter
	});
}
function promise(innerType) {
	return new ZodPromise({
		type: "promise",
		innerType
	});
}
function _function(params) {
	var _params$input, _params$output;
	return new ZodFunction({
		type: "function",
		input: Array.isArray(params === null || params === void 0 ? void 0 : params.input) ? tuple(params === null || params === void 0 ? void 0 : params.input) : (_params$input = params === null || params === void 0 ? void 0 : params.input) !== null && _params$input !== void 0 ? _params$input : array(unknown()),
		output: (_params$output = params === null || params === void 0 ? void 0 : params.output) !== null && _params$output !== void 0 ? _params$output : unknown()
	});
}
function check(fn) {
	const ch = new $ZodCheck({ check: "custom" });
	ch._zod.check = fn;
	return ch;
}
function custom(fn, _params) {
	return /* @__PURE__ */ _custom(ZodCustom, fn !== null && fn !== void 0 ? fn : (() => true), _params);
}
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn) {
	return /* @__PURE__ */ _superRefine(fn);
}
function _instanceof(cls, params = {}) {
	const inst = new ZodCustom(_objectSpread2({
		type: "custom",
		check: "custom",
		fn: (data) => data instanceof cls,
		abort: true
	}, normalizeParams(params)));
	inst._zod.bag.Class = cls;
	inst._zod.check = (payload) => {
		if (!(payload.value instanceof cls)) {
			var _inst$_zod$def$path;
			payload.issues.push({
				code: "invalid_type",
				expected: cls.name,
				input: payload.value,
				inst,
				path: [...(_inst$_zod$def$path = inst._zod.def.path) !== null && _inst$_zod$def$path !== void 0 ? _inst$_zod$def$path : []]
			});
		}
	};
	return inst;
}
function json(params) {
	const jsonSchema = lazy(() => {
		return union([
			string$1(params),
			number$1(),
			boolean$1(),
			_null(),
			array(jsonSchema),
			record(string$1(), jsonSchema)
		]);
	});
	return jsonSchema;
}
function preprocess(fn, schema) {
	return pipe(transform(fn), schema);
}
var ZodType, _ZodString, ZodString, ZodStringFormat, ZodEmail, ZodGUID, ZodUUID, ZodURL, ZodEmoji, ZodNanoID, ZodCUID, ZodCUID2, ZodULID, ZodXID, ZodKSUID, ZodIPv4, ZodMAC, ZodIPv6, ZodCIDRv4, ZodCIDRv6, ZodBase64, ZodBase64URL, ZodE164, ZodJWT, ZodCustomStringFormat, ZodNumber, ZodNumberFormat, ZodBoolean, ZodBigInt, ZodBigIntFormat, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodDate, ZodArray, ZodObject, ZodUnion, ZodXor, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodEnum, ZodLiteral, ZodFile, ZodTransform, ZodOptional, ZodExactOptional, ZodNullable, ZodDefault, ZodPrefault, ZodNonOptional, ZodSuccess, ZodCatch, ZodNaN, ZodPipe, ZodCodec, ZodReadonly, ZodTemplateLiteral, ZodLazy, ZodPromise, ZodFunction, ZodCustom, describe, meta, stringbool;
var init_schemas = __esmMin((() => {
	init_core();
	init_json_schema_processors();
	init_to_json_schema();
	init_checks();
	init_iso();
	init_parse();
	init_asyncToGenerator();
	init_objectSpread2();
	ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
		$ZodType.init(inst, def);
		Object.assign(inst["~standard"], { jsonSchema: {
			input: createStandardJSONSchemaMethod(inst, "input"),
			output: createStandardJSONSchemaMethod(inst, "output")
		} });
		inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
		inst.def = def;
		inst.type = def.type;
		Object.defineProperty(inst, "_def", { value: def });
		inst.check = (...checks) => {
			var _def$checks;
			return inst.clone(mergeDefs(def, { checks: [...(_def$checks = def.checks) !== null && _def$checks !== void 0 ? _def$checks : [], ...checks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)] }), { parent: true });
		};
		inst.with = inst.check;
		inst.clone = (def, params) => clone(inst, def, params);
		inst.brand = () => inst;
		inst.register = ((reg, meta) => {
			reg.add(inst, meta);
			return inst;
		});
		inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
		inst.safeParse = (data, params) => safeParse(inst, data, params);
		inst.parseAsync = function() {
			var _ref = _asyncToGenerator(function* (data, params) {
				return parseAsync(inst, data, params, { callee: inst.parseAsync });
			});
			return function(_x, _x2) {
				return _ref.apply(this, arguments);
			};
		}();
		inst.safeParseAsync = function() {
			var _ref2 = _asyncToGenerator(function* (data, params) {
				return safeParseAsync(inst, data, params);
			});
			return function(_x3, _x4) {
				return _ref2.apply(this, arguments);
			};
		}();
		inst.spa = inst.safeParseAsync;
		inst.encode = (data, params) => encode(inst, data, params);
		inst.decode = (data, params) => decode(inst, data, params);
		inst.encodeAsync = function() {
			var _ref3 = _asyncToGenerator(function* (data, params) {
				return encodeAsync(inst, data, params);
			});
			return function(_x5, _x6) {
				return _ref3.apply(this, arguments);
			};
		}();
		inst.decodeAsync = function() {
			var _ref4 = _asyncToGenerator(function* (data, params) {
				return decodeAsync(inst, data, params);
			});
			return function(_x7, _x8) {
				return _ref4.apply(this, arguments);
			};
		}();
		inst.safeEncode = (data, params) => safeEncode(inst, data, params);
		inst.safeDecode = (data, params) => safeDecode(inst, data, params);
		inst.safeEncodeAsync = function() {
			var _ref5 = _asyncToGenerator(function* (data, params) {
				return safeEncodeAsync(inst, data, params);
			});
			return function(_x9, _x10) {
				return _ref5.apply(this, arguments);
			};
		}();
		inst.safeDecodeAsync = function() {
			var _ref6 = _asyncToGenerator(function* (data, params) {
				return safeDecodeAsync(inst, data, params);
			});
			return function(_x11, _x12) {
				return _ref6.apply(this, arguments);
			};
		}();
		inst.refine = (check, params) => inst.check(refine(check, params));
		inst.superRefine = (refinement) => inst.check(superRefine(refinement));
		inst.overwrite = (fn) => inst.check(/* @__PURE__ */ _overwrite(fn));
		inst.optional = () => optional(inst);
		inst.exactOptional = () => exactOptional(inst);
		inst.nullable = () => nullable(inst);
		inst.nullish = () => optional(nullable(inst));
		inst.nonoptional = (params) => nonoptional(inst, params);
		inst.array = () => array(inst);
		inst.or = (arg) => union([inst, arg]);
		inst.and = (arg) => intersection(inst, arg);
		inst.transform = (tx) => pipe(inst, transform(tx));
		inst.default = (def) => _default(inst, def);
		inst.prefault = (def) => prefault(inst, def);
		inst.catch = (params) => _catch(inst, params);
		inst.pipe = (target) => pipe(inst, target);
		inst.readonly = () => readonly(inst);
		inst.describe = (description) => {
			const cl = inst.clone();
			globalRegistry.add(cl, { description });
			return cl;
		};
		Object.defineProperty(inst, "description", {
			get() {
				var _core$globalRegistry$;
				return (_core$globalRegistry$ = globalRegistry.get(inst)) === null || _core$globalRegistry$ === void 0 ? void 0 : _core$globalRegistry$.description;
			},
			configurable: true
		});
		inst.meta = (...args) => {
			if (args.length === 0) return globalRegistry.get(inst);
			const cl = inst.clone();
			globalRegistry.add(cl, args[0]);
			return cl;
		};
		inst.isOptional = () => inst.safeParse(void 0).success;
		inst.isNullable = () => inst.safeParse(null).success;
		inst.apply = (fn) => fn(inst);
		return inst;
	});
	_ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
		var _bag$format, _bag$minimum, _bag$maximum;
		$ZodString.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
		const bag = inst._zod.bag;
		inst.format = (_bag$format = bag.format) !== null && _bag$format !== void 0 ? _bag$format : null;
		inst.minLength = (_bag$minimum = bag.minimum) !== null && _bag$minimum !== void 0 ? _bag$minimum : null;
		inst.maxLength = (_bag$maximum = bag.maximum) !== null && _bag$maximum !== void 0 ? _bag$maximum : null;
		inst.regex = (...args) => inst.check(/* @__PURE__ */ _regex(...args));
		inst.includes = (...args) => inst.check(/* @__PURE__ */ _includes(...args));
		inst.startsWith = (...args) => inst.check(/* @__PURE__ */ _startsWith(...args));
		inst.endsWith = (...args) => inst.check(/* @__PURE__ */ _endsWith(...args));
		inst.min = (...args) => inst.check(/* @__PURE__ */ _minLength(...args));
		inst.max = (...args) => inst.check(/* @__PURE__ */ _maxLength(...args));
		inst.length = (...args) => inst.check(/* @__PURE__ */ _length(...args));
		inst.nonempty = (...args) => inst.check(/* @__PURE__ */ _minLength(1, ...args));
		inst.lowercase = (params) => inst.check(/* @__PURE__ */ _lowercase(params));
		inst.uppercase = (params) => inst.check(/* @__PURE__ */ _uppercase(params));
		inst.trim = () => inst.check(/* @__PURE__ */ _trim());
		inst.normalize = (...args) => inst.check(/* @__PURE__ */ _normalize(...args));
		inst.toLowerCase = () => inst.check(/* @__PURE__ */ _toLowerCase());
		inst.toUpperCase = () => inst.check(/* @__PURE__ */ _toUpperCase());
		inst.slugify = () => inst.check(/* @__PURE__ */ _slugify());
	});
	ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
		$ZodString.init(inst, def);
		_ZodString.init(inst, def);
		inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
		inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
		inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
		inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
		inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
		inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
		inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
		inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
		inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
		inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
		inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
		inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
		inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
		inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
		inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
		inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
		inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
		inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
		inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
		inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
		inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
		inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
		inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
		inst.datetime = (params) => inst.check(datetime(params));
		inst.date = (params) => inst.check(date$2(params));
		inst.time = (params) => inst.check(time(params));
		inst.duration = (params) => inst.check(duration(params));
	});
	ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
		$ZodStringFormat.init(inst, def);
		_ZodString.init(inst, def);
	});
	ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
		$ZodEmail.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
		$ZodGUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
		$ZodUUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
		$ZodURL.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
		$ZodEmoji.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
		$ZodNanoID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
		$ZodCUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
		$ZodCUID2.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
		$ZodULID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
		$ZodXID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
		$ZodKSUID.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
		$ZodIPv4.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodMAC = /* @__PURE__ */ $constructor("ZodMAC", (inst, def) => {
		$ZodMAC.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
		$ZodIPv6.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
		$ZodCIDRv4.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
		$ZodCIDRv6.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
		$ZodBase64.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
		$ZodBase64URL.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
		$ZodE164.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
		$ZodJWT.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodCustomStringFormat = /* @__PURE__ */ $constructor("ZodCustomStringFormat", (inst, def) => {
		$ZodCustomStringFormat.init(inst, def);
		ZodStringFormat.init(inst, def);
	});
	ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
		var _Math$max, _bag$minimum2, _bag$exclusiveMinimum, _Math$min, _bag$maximum2, _bag$exclusiveMaximum, _bag$format2, _bag$multipleOf, _bag$format3;
		$ZodNumber.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
		inst.gt = (value, params) => inst.check(/* @__PURE__ */ _gt(value, params));
		inst.gte = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.lt = (value, params) => inst.check(/* @__PURE__ */ _lt(value, params));
		inst.lte = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
		inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
		inst.int = (params) => inst.check(int(params));
		inst.safe = (params) => inst.check(int(params));
		inst.positive = (params) => inst.check(/* @__PURE__ */ _gt(0, params));
		inst.nonnegative = (params) => inst.check(/* @__PURE__ */ _gte(0, params));
		inst.negative = (params) => inst.check(/* @__PURE__ */ _lt(0, params));
		inst.nonpositive = (params) => inst.check(/* @__PURE__ */ _lte(0, params));
		inst.multipleOf = (value, params) => inst.check(/* @__PURE__ */ _multipleOf(value, params));
		inst.step = (value, params) => inst.check(/* @__PURE__ */ _multipleOf(value, params));
		inst.finite = () => inst;
		const bag = inst._zod.bag;
		inst.minValue = (_Math$max = Math.max((_bag$minimum2 = bag.minimum) !== null && _bag$minimum2 !== void 0 ? _bag$minimum2 : Number.NEGATIVE_INFINITY, (_bag$exclusiveMinimum = bag.exclusiveMinimum) !== null && _bag$exclusiveMinimum !== void 0 ? _bag$exclusiveMinimum : Number.NEGATIVE_INFINITY)) !== null && _Math$max !== void 0 ? _Math$max : null;
		inst.maxValue = (_Math$min = Math.min((_bag$maximum2 = bag.maximum) !== null && _bag$maximum2 !== void 0 ? _bag$maximum2 : Number.POSITIVE_INFINITY, (_bag$exclusiveMaximum = bag.exclusiveMaximum) !== null && _bag$exclusiveMaximum !== void 0 ? _bag$exclusiveMaximum : Number.POSITIVE_INFINITY)) !== null && _Math$min !== void 0 ? _Math$min : null;
		inst.isInt = ((_bag$format2 = bag.format) !== null && _bag$format2 !== void 0 ? _bag$format2 : "").includes("int") || Number.isSafeInteger((_bag$multipleOf = bag.multipleOf) !== null && _bag$multipleOf !== void 0 ? _bag$multipleOf : .5);
		inst.isFinite = true;
		inst.format = (_bag$format3 = bag.format) !== null && _bag$format3 !== void 0 ? _bag$format3 : null;
	});
	ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
		$ZodNumberFormat.init(inst, def);
		ZodNumber.init(inst, def);
	});
	ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
		$ZodBoolean.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
	});
	ZodBigInt = /* @__PURE__ */ $constructor("ZodBigInt", (inst, def) => {
		var _bag$minimum3, _bag$maximum3, _bag$format4;
		$ZodBigInt.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => bigintProcessor(inst, ctx, json, params);
		inst.gte = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.gt = (value, params) => inst.check(/* @__PURE__ */ _gt(value, params));
		inst.gte = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.lt = (value, params) => inst.check(/* @__PURE__ */ _lt(value, params));
		inst.lte = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
		inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
		inst.positive = (params) => inst.check(/* @__PURE__ */ _gt(BigInt(0), params));
		inst.negative = (params) => inst.check(/* @__PURE__ */ _lt(BigInt(0), params));
		inst.nonpositive = (params) => inst.check(/* @__PURE__ */ _lte(BigInt(0), params));
		inst.nonnegative = (params) => inst.check(/* @__PURE__ */ _gte(BigInt(0), params));
		inst.multipleOf = (value, params) => inst.check(/* @__PURE__ */ _multipleOf(value, params));
		const bag = inst._zod.bag;
		inst.minValue = (_bag$minimum3 = bag.minimum) !== null && _bag$minimum3 !== void 0 ? _bag$minimum3 : null;
		inst.maxValue = (_bag$maximum3 = bag.maximum) !== null && _bag$maximum3 !== void 0 ? _bag$maximum3 : null;
		inst.format = (_bag$format4 = bag.format) !== null && _bag$format4 !== void 0 ? _bag$format4 : null;
	});
	ZodBigIntFormat = /* @__PURE__ */ $constructor("ZodBigIntFormat", (inst, def) => {
		$ZodBigIntFormat.init(inst, def);
		ZodBigInt.init(inst, def);
	});
	ZodSymbol = /* @__PURE__ */ $constructor("ZodSymbol", (inst, def) => {
		$ZodSymbol.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => symbolProcessor(inst, ctx, json, params);
	});
	ZodUndefined = /* @__PURE__ */ $constructor("ZodUndefined", (inst, def) => {
		$ZodUndefined.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
	});
	ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
		$ZodNull.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
	});
	ZodAny = /* @__PURE__ */ $constructor("ZodAny", (inst, def) => {
		$ZodAny.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => anyProcessor(inst, ctx, json, params);
	});
	ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
		$ZodUnknown.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
	});
	ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
		$ZodNever.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
	});
	ZodVoid = /* @__PURE__ */ $constructor("ZodVoid", (inst, def) => {
		$ZodVoid.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => voidProcessor(inst, ctx, json, params);
	});
	ZodDate = /* @__PURE__ */ $constructor("ZodDate", (inst, def) => {
		$ZodDate.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => dateProcessor(inst, ctx, json, params);
		inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
		inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
		const c = inst._zod.bag;
		inst.minDate = c.minimum ? new Date(c.minimum) : null;
		inst.maxDate = c.maximum ? new Date(c.maximum) : null;
	});
	ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
		$ZodArray.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
		inst.element = def.element;
		inst.min = (minLength, params) => inst.check(/* @__PURE__ */ _minLength(minLength, params));
		inst.nonempty = (params) => inst.check(/* @__PURE__ */ _minLength(1, params));
		inst.max = (maxLength, params) => inst.check(/* @__PURE__ */ _maxLength(maxLength, params));
		inst.length = (len, params) => inst.check(/* @__PURE__ */ _length(len, params));
		inst.unwrap = () => inst.element;
	});
	ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
		$ZodObjectJIT.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
		defineLazy(inst, "shape", () => {
			return def.shape;
		});
		inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
		inst.catchall = (catchall) => inst.clone(_objectSpread2(_objectSpread2({}, inst._zod.def), {}, { catchall }));
		inst.passthrough = () => inst.clone(_objectSpread2(_objectSpread2({}, inst._zod.def), {}, { catchall: unknown() }));
		inst.loose = () => inst.clone(_objectSpread2(_objectSpread2({}, inst._zod.def), {}, { catchall: unknown() }));
		inst.strict = () => inst.clone(_objectSpread2(_objectSpread2({}, inst._zod.def), {}, { catchall: never() }));
		inst.strip = () => inst.clone(_objectSpread2(_objectSpread2({}, inst._zod.def), {}, { catchall: void 0 }));
		inst.extend = (incoming) => {
			return extend(inst, incoming);
		};
		inst.safeExtend = (incoming) => {
			return safeExtend(inst, incoming);
		};
		inst.merge = (other) => merge(inst, other);
		inst.pick = (mask) => pick(inst, mask);
		inst.omit = (mask) => omit$2(inst, mask);
		inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
		inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
	});
	ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
		$ZodUnion.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
		inst.options = def.options;
	});
	ZodXor = /* @__PURE__ */ $constructor("ZodXor", (inst, def) => {
		ZodUnion.init(inst, def);
		$ZodXor.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
		inst.options = def.options;
	});
	ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
		ZodUnion.init(inst, def);
		$ZodDiscriminatedUnion.init(inst, def);
	});
	ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
		$ZodIntersection.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
	});
	ZodTuple = /* @__PURE__ */ $constructor("ZodTuple", (inst, def) => {
		$ZodTuple.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => tupleProcessor(inst, ctx, json, params);
		inst.rest = (rest) => inst.clone(_objectSpread2(_objectSpread2({}, inst._zod.def), {}, { rest }));
	});
	ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
		$ZodRecord.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
		inst.keyType = def.keyType;
		inst.valueType = def.valueType;
	});
	ZodMap = /* @__PURE__ */ $constructor("ZodMap", (inst, def) => {
		$ZodMap.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => mapProcessor(inst, ctx, json, params);
		inst.keyType = def.keyType;
		inst.valueType = def.valueType;
		inst.min = (...args) => inst.check(/* @__PURE__ */ _minSize(...args));
		inst.nonempty = (params) => inst.check(/* @__PURE__ */ _minSize(1, params));
		inst.max = (...args) => inst.check(/* @__PURE__ */ _maxSize(...args));
		inst.size = (...args) => inst.check(/* @__PURE__ */ _size(...args));
	});
	ZodSet = /* @__PURE__ */ $constructor("ZodSet", (inst, def) => {
		$ZodSet.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => setProcessor(inst, ctx, json, params);
		inst.min = (...args) => inst.check(/* @__PURE__ */ _minSize(...args));
		inst.nonempty = (params) => inst.check(/* @__PURE__ */ _minSize(1, params));
		inst.max = (...args) => inst.check(/* @__PURE__ */ _maxSize(...args));
		inst.size = (...args) => inst.check(/* @__PURE__ */ _size(...args));
	});
	ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
		$ZodEnum.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
		inst.enum = def.entries;
		inst.options = Object.values(def.entries);
		const keys = new Set(Object.keys(def.entries));
		inst.extract = (values, params) => {
			const newEntries = {};
			for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
			else throw new Error(`Key ${value} not found in enum`);
			return new ZodEnum(_objectSpread2(_objectSpread2(_objectSpread2({}, def), {}, { checks: [] }, normalizeParams(params)), {}, { entries: newEntries }));
		};
		inst.exclude = (values, params) => {
			const newEntries = _objectSpread2({}, def.entries);
			for (const value of values) if (keys.has(value)) delete newEntries[value];
			else throw new Error(`Key ${value} not found in enum`);
			return new ZodEnum(_objectSpread2(_objectSpread2(_objectSpread2({}, def), {}, { checks: [] }, normalizeParams(params)), {}, { entries: newEntries }));
		};
	});
	ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
		$ZodLiteral.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
		inst.values = new Set(def.values);
		Object.defineProperty(inst, "value", { get() {
			if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
			return def.values[0];
		} });
	});
	ZodFile = /* @__PURE__ */ $constructor("ZodFile", (inst, def) => {
		$ZodFile.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => fileProcessor(inst, ctx, json, params);
		inst.min = (size, params) => inst.check(/* @__PURE__ */ _minSize(size, params));
		inst.max = (size, params) => inst.check(/* @__PURE__ */ _maxSize(size, params));
		inst.mime = (types, params) => inst.check(/* @__PURE__ */ _mime(Array.isArray(types) ? types : [types], params));
	});
	ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
		$ZodTransform.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
		inst._zod.parse = (payload, _ctx) => {
			if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
			payload.addIssue = (issue$1) => {
				if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
				else {
					var _issue$code, _issue$input, _issue$inst;
					const _issue = issue$1;
					if (_issue.fatal) _issue.continue = false;
					(_issue$code = _issue.code) !== null && _issue$code !== void 0 || (_issue.code = "custom");
					(_issue$input = _issue.input) !== null && _issue$input !== void 0 || (_issue.input = payload.value);
					(_issue$inst = _issue.inst) !== null && _issue$inst !== void 0 || (_issue.inst = inst);
					payload.issues.push(issue(_issue));
				}
			};
			const output = def.transform(payload.value, payload);
			if (output instanceof Promise) return output.then((output) => {
				payload.value = output;
				return payload;
			});
			payload.value = output;
			return payload;
		};
	});
	ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
		$ZodOptional.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
		$ZodExactOptional.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
		$ZodNullable.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
		$ZodDefault.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
		inst.removeDefault = inst.unwrap;
	});
	ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
		$ZodPrefault.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
		$ZodNonOptional.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodSuccess = /* @__PURE__ */ $constructor("ZodSuccess", (inst, def) => {
		$ZodSuccess.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => successProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
		$ZodCatch.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
		inst.removeCatch = inst.unwrap;
	});
	ZodNaN = /* @__PURE__ */ $constructor("ZodNaN", (inst, def) => {
		$ZodNaN.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => nanProcessor(inst, ctx, json, params);
	});
	ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
		$ZodPipe.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
		inst.in = def.in;
		inst.out = def.out;
	});
	ZodCodec = /* @__PURE__ */ $constructor("ZodCodec", (inst, def) => {
		ZodPipe.init(inst, def);
		$ZodCodec.init(inst, def);
	});
	ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
		$ZodReadonly.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodTemplateLiteral = /* @__PURE__ */ $constructor("ZodTemplateLiteral", (inst, def) => {
		$ZodTemplateLiteral.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => templateLiteralProcessor(inst, ctx, json, params);
	});
	ZodLazy = /* @__PURE__ */ $constructor("ZodLazy", (inst, def) => {
		$ZodLazy.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => lazyProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.getter();
	});
	ZodPromise = /* @__PURE__ */ $constructor("ZodPromise", (inst, def) => {
		$ZodPromise.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => promiseProcessor(inst, ctx, json, params);
		inst.unwrap = () => inst._zod.def.innerType;
	});
	ZodFunction = /* @__PURE__ */ $constructor("ZodFunction", (inst, def) => {
		$ZodFunction.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => functionProcessor(inst, ctx, json, params);
	});
	ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
		$ZodCustom.init(inst, def);
		ZodType.init(inst, def);
		inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
	});
	describe = describe$1;
	meta = meta$1;
	stringbool = (...args) => /* @__PURE__ */ _stringbool({
		Codec: ZodCodec,
		Boolean: ZodBoolean,
		String: ZodString
	}, ...args);
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/compat.js
/** @deprecated Use `z.config(params)` instead. */
function setErrorMap(map) {
	config({ customError: map });
}
/** @deprecated Use `z.config()` instead. */
function getErrorMap() {
	return config().customError;
}
var ZodIssueCode, ZodFirstPartyTypeKind;
var init_compat = __esmMin((() => {
	init_core();
	ZodIssueCode = {
		invalid_type: "invalid_type",
		too_big: "too_big",
		too_small: "too_small",
		invalid_format: "invalid_format",
		not_multiple_of: "not_multiple_of",
		unrecognized_keys: "unrecognized_keys",
		invalid_union: "invalid_union",
		invalid_key: "invalid_key",
		invalid_element: "invalid_element",
		invalid_value: "invalid_value",
		custom: "custom"
	};
	(function(ZodFirstPartyTypeKind) {})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/from-json-schema.js
function detectVersion(schema, defaultTarget) {
	const $schema = schema.$schema;
	if ($schema === "https://json-schema.org/draft/2020-12/schema") return "draft-2020-12";
	if ($schema === "http://json-schema.org/draft-07/schema#") return "draft-7";
	if ($schema === "http://json-schema.org/draft-04/schema#") return "draft-4";
	return defaultTarget !== null && defaultTarget !== void 0 ? defaultTarget : "draft-2020-12";
}
function resolveRef(ref, ctx) {
	if (!ref.startsWith("#")) throw new Error("External $ref is not supported, only local refs (#/...) are allowed");
	const path = ref.slice(1).split("/").filter(Boolean);
	if (path.length === 0) return ctx.rootSchema;
	const defsKey = ctx.version === "draft-2020-12" ? "$defs" : "definitions";
	if (path[0] === defsKey) {
		const key = path[1];
		if (!key || !ctx.defs[key]) throw new Error(`Reference not found: ${ref}`);
		return ctx.defs[key];
	}
	throw new Error(`Reference not found: ${ref}`);
}
function convertBaseSchema(schema, ctx) {
	if (schema.not !== void 0) {
		if (typeof schema.not === "object" && Object.keys(schema.not).length === 0) return z.never();
		throw new Error("not is not supported in Zod (except { not: {} } for never)");
	}
	if (schema.unevaluatedItems !== void 0) throw new Error("unevaluatedItems is not supported");
	if (schema.unevaluatedProperties !== void 0) throw new Error("unevaluatedProperties is not supported");
	if (schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) throw new Error("Conditional schemas (if/then/else) are not supported");
	if (schema.dependentSchemas !== void 0 || schema.dependentRequired !== void 0) throw new Error("dependentSchemas and dependentRequired are not supported");
	if (schema.$ref) {
		const refPath = schema.$ref;
		if (ctx.refs.has(refPath)) return ctx.refs.get(refPath);
		if (ctx.processing.has(refPath)) return z.lazy(() => {
			if (!ctx.refs.has(refPath)) throw new Error(`Circular reference not resolved: ${refPath}`);
			return ctx.refs.get(refPath);
		});
		ctx.processing.add(refPath);
		const zodSchema = convertSchema(resolveRef(refPath, ctx), ctx);
		ctx.refs.set(refPath, zodSchema);
		ctx.processing.delete(refPath);
		return zodSchema;
	}
	if (schema.enum !== void 0) {
		const enumValues = schema.enum;
		if (ctx.version === "openapi-3.0" && schema.nullable === true && enumValues.length === 1 && enumValues[0] === null) return z.null();
		if (enumValues.length === 0) return z.never();
		if (enumValues.length === 1) return z.literal(enumValues[0]);
		if (enumValues.every((v) => typeof v === "string")) return z.enum(enumValues);
		const literalSchemas = enumValues.map((v) => z.literal(v));
		if (literalSchemas.length < 2) return literalSchemas[0];
		return z.union([
			literalSchemas[0],
			literalSchemas[1],
			...literalSchemas.slice(2)
		]);
	}
	if (schema.const !== void 0) return z.literal(schema.const);
	const type = schema.type;
	if (Array.isArray(type)) {
		const typeSchemas = type.map((t) => {
			return convertBaseSchema(_objectSpread2(_objectSpread2({}, schema), {}, { type: t }), ctx);
		});
		if (typeSchemas.length === 0) return z.never();
		if (typeSchemas.length === 1) return typeSchemas[0];
		return z.union(typeSchemas);
	}
	if (!type) return z.any();
	let zodSchema;
	switch (type) {
		case "string": {
			let stringSchema = z.string();
			if (schema.format) {
				const format = schema.format;
				if (format === "email") stringSchema = stringSchema.check(z.email());
				else if (format === "uri" || format === "uri-reference") stringSchema = stringSchema.check(z.url());
				else if (format === "uuid" || format === "guid") stringSchema = stringSchema.check(z.uuid());
				else if (format === "date-time") stringSchema = stringSchema.check(z.iso.datetime());
				else if (format === "date") stringSchema = stringSchema.check(z.iso.date());
				else if (format === "time") stringSchema = stringSchema.check(z.iso.time());
				else if (format === "duration") stringSchema = stringSchema.check(z.iso.duration());
				else if (format === "ipv4") stringSchema = stringSchema.check(z.ipv4());
				else if (format === "ipv6") stringSchema = stringSchema.check(z.ipv6());
				else if (format === "mac") stringSchema = stringSchema.check(z.mac());
				else if (format === "cidr") stringSchema = stringSchema.check(z.cidrv4());
				else if (format === "cidr-v6") stringSchema = stringSchema.check(z.cidrv6());
				else if (format === "base64") stringSchema = stringSchema.check(z.base64());
				else if (format === "base64url") stringSchema = stringSchema.check(z.base64url());
				else if (format === "e164") stringSchema = stringSchema.check(z.e164());
				else if (format === "jwt") stringSchema = stringSchema.check(z.jwt());
				else if (format === "emoji") stringSchema = stringSchema.check(z.emoji());
				else if (format === "nanoid") stringSchema = stringSchema.check(z.nanoid());
				else if (format === "cuid") stringSchema = stringSchema.check(z.cuid());
				else if (format === "cuid2") stringSchema = stringSchema.check(z.cuid2());
				else if (format === "ulid") stringSchema = stringSchema.check(z.ulid());
				else if (format === "xid") stringSchema = stringSchema.check(z.xid());
				else if (format === "ksuid") stringSchema = stringSchema.check(z.ksuid());
			}
			if (typeof schema.minLength === "number") stringSchema = stringSchema.min(schema.minLength);
			if (typeof schema.maxLength === "number") stringSchema = stringSchema.max(schema.maxLength);
			if (schema.pattern) stringSchema = stringSchema.regex(new RegExp(schema.pattern));
			zodSchema = stringSchema;
			break;
		}
		case "number":
		case "integer": {
			let numberSchema = type === "integer" ? z.number().int() : z.number();
			if (typeof schema.minimum === "number") numberSchema = numberSchema.min(schema.minimum);
			if (typeof schema.maximum === "number") numberSchema = numberSchema.max(schema.maximum);
			if (typeof schema.exclusiveMinimum === "number") numberSchema = numberSchema.gt(schema.exclusiveMinimum);
			else if (schema.exclusiveMinimum === true && typeof schema.minimum === "number") numberSchema = numberSchema.gt(schema.minimum);
			if (typeof schema.exclusiveMaximum === "number") numberSchema = numberSchema.lt(schema.exclusiveMaximum);
			else if (schema.exclusiveMaximum === true && typeof schema.maximum === "number") numberSchema = numberSchema.lt(schema.maximum);
			if (typeof schema.multipleOf === "number") numberSchema = numberSchema.multipleOf(schema.multipleOf);
			zodSchema = numberSchema;
			break;
		}
		case "boolean":
			zodSchema = z.boolean();
			break;
		case "null":
			zodSchema = z.null();
			break;
		case "object": {
			const shape = {};
			const properties = schema.properties || {};
			const requiredSet = new Set(schema.required || []);
			for (const [key, propSchema] of Object.entries(properties)) {
				const propZodSchema = convertSchema(propSchema, ctx);
				shape[key] = requiredSet.has(key) ? propZodSchema : propZodSchema.optional();
			}
			if (schema.propertyNames) {
				const keySchema = convertSchema(schema.propertyNames, ctx);
				const valueSchema = schema.additionalProperties && typeof schema.additionalProperties === "object" ? convertSchema(schema.additionalProperties, ctx) : z.any();
				if (Object.keys(shape).length === 0) {
					zodSchema = z.record(keySchema, valueSchema);
					break;
				}
				const objectSchema = z.object(shape).passthrough();
				const recordSchema = z.looseRecord(keySchema, valueSchema);
				zodSchema = z.intersection(objectSchema, recordSchema);
				break;
			}
			if (schema.patternProperties) {
				const patternProps = schema.patternProperties;
				const patternKeys = Object.keys(patternProps);
				const looseRecords = [];
				for (const pattern of patternKeys) {
					const patternValue = convertSchema(patternProps[pattern], ctx);
					const keySchema = z.string().regex(new RegExp(pattern));
					looseRecords.push(z.looseRecord(keySchema, patternValue));
				}
				const schemasToIntersect = [];
				if (Object.keys(shape).length > 0) schemasToIntersect.push(z.object(shape).passthrough());
				schemasToIntersect.push(...looseRecords);
				if (schemasToIntersect.length === 0) zodSchema = z.object({}).passthrough();
				else if (schemasToIntersect.length === 1) zodSchema = schemasToIntersect[0];
				else {
					let result = z.intersection(schemasToIntersect[0], schemasToIntersect[1]);
					for (let i = 2; i < schemasToIntersect.length; i++) result = z.intersection(result, schemasToIntersect[i]);
					zodSchema = result;
				}
				break;
			}
			const objectSchema = z.object(shape);
			if (schema.additionalProperties === false) zodSchema = objectSchema.strict();
			else if (typeof schema.additionalProperties === "object") zodSchema = objectSchema.catchall(convertSchema(schema.additionalProperties, ctx));
			else zodSchema = objectSchema.passthrough();
			break;
		}
		case "array": {
			const prefixItems = schema.prefixItems;
			const items = schema.items;
			if (prefixItems && Array.isArray(prefixItems)) {
				const tupleItems = prefixItems.map((item) => convertSchema(item, ctx));
				const rest = items && typeof items === "object" && !Array.isArray(items) ? convertSchema(items, ctx) : void 0;
				if (rest) zodSchema = z.tuple(tupleItems).rest(rest);
				else zodSchema = z.tuple(tupleItems);
				if (typeof schema.minItems === "number") zodSchema = zodSchema.check(z.minLength(schema.minItems));
				if (typeof schema.maxItems === "number") zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
			} else if (Array.isArray(items)) {
				const tupleItems = items.map((item) => convertSchema(item, ctx));
				const rest = schema.additionalItems && typeof schema.additionalItems === "object" ? convertSchema(schema.additionalItems, ctx) : void 0;
				if (rest) zodSchema = z.tuple(tupleItems).rest(rest);
				else zodSchema = z.tuple(tupleItems);
				if (typeof schema.minItems === "number") zodSchema = zodSchema.check(z.minLength(schema.minItems));
				if (typeof schema.maxItems === "number") zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
			} else if (items !== void 0) {
				const element = convertSchema(items, ctx);
				let arraySchema = z.array(element);
				if (typeof schema.minItems === "number") arraySchema = arraySchema.min(schema.minItems);
				if (typeof schema.maxItems === "number") arraySchema = arraySchema.max(schema.maxItems);
				zodSchema = arraySchema;
			} else zodSchema = z.array(z.any());
			break;
		}
		default: throw new Error(`Unsupported type: ${type}`);
	}
	if (schema.description) zodSchema = zodSchema.describe(schema.description);
	if (schema.default !== void 0) zodSchema = zodSchema.default(schema.default);
	return zodSchema;
}
function convertSchema(schema, ctx) {
	if (typeof schema === "boolean") return schema ? z.any() : z.never();
	let baseSchema = convertBaseSchema(schema, ctx);
	const hasExplicitType = schema.type || schema.enum !== void 0 || schema.const !== void 0;
	if (schema.anyOf && Array.isArray(schema.anyOf)) {
		const options = schema.anyOf.map((s) => convertSchema(s, ctx));
		const anyOfUnion = z.union(options);
		baseSchema = hasExplicitType ? z.intersection(baseSchema, anyOfUnion) : anyOfUnion;
	}
	if (schema.oneOf && Array.isArray(schema.oneOf)) {
		const options = schema.oneOf.map((s) => convertSchema(s, ctx));
		const oneOfUnion = z.xor(options);
		baseSchema = hasExplicitType ? z.intersection(baseSchema, oneOfUnion) : oneOfUnion;
	}
	if (schema.allOf && Array.isArray(schema.allOf)) if (schema.allOf.length === 0) baseSchema = hasExplicitType ? baseSchema : z.any();
	else {
		let result = hasExplicitType ? baseSchema : convertSchema(schema.allOf[0], ctx);
		const startIdx = hasExplicitType ? 0 : 1;
		for (let i = startIdx; i < schema.allOf.length; i++) result = z.intersection(result, convertSchema(schema.allOf[i], ctx));
		baseSchema = result;
	}
	if (schema.nullable === true && ctx.version === "openapi-3.0") baseSchema = z.nullable(baseSchema);
	if (schema.readOnly === true) baseSchema = z.readonly(baseSchema);
	const extraMeta = {};
	for (const key of [
		"$id",
		"id",
		"$comment",
		"$anchor",
		"$vocabulary",
		"$dynamicRef",
		"$dynamicAnchor"
	]) if (key in schema) extraMeta[key] = schema[key];
	for (const key of [
		"contentEncoding",
		"contentMediaType",
		"contentSchema"
	]) if (key in schema) extraMeta[key] = schema[key];
	for (const key of Object.keys(schema)) if (!RECOGNIZED_KEYS.has(key)) extraMeta[key] = schema[key];
	if (Object.keys(extraMeta).length > 0) ctx.registry.add(baseSchema, extraMeta);
	return baseSchema;
}
/**
* Converts a JSON Schema to a Zod schema. This function should be considered semi-experimental. It's behavior is liable to change. */
function fromJSONSchema(schema, params) {
	var _params$registry;
	if (typeof schema === "boolean") return schema ? z.any() : z.never();
	return convertSchema(schema, {
		version: detectVersion(schema, params === null || params === void 0 ? void 0 : params.defaultTarget),
		defs: schema.$defs || schema.definitions || {},
		refs: /* @__PURE__ */ new Map(),
		processing: /* @__PURE__ */ new Set(),
		rootSchema: schema,
		registry: (_params$registry = params === null || params === void 0 ? void 0 : params.registry) !== null && _params$registry !== void 0 ? _params$registry : globalRegistry
	});
}
var z, RECOGNIZED_KEYS;
var init_from_json_schema = __esmMin((() => {
	init_registries();
	init_checks();
	init_iso();
	init_schemas();
	init_objectSpread2();
	z = _objectSpread2(_objectSpread2(_objectSpread2({}, schemas_exports), checks_exports), {}, { iso: iso_exports });
	RECOGNIZED_KEYS = new Set([
		"$schema",
		"$ref",
		"$defs",
		"definitions",
		"$id",
		"id",
		"$comment",
		"$anchor",
		"$vocabulary",
		"$dynamicRef",
		"$dynamicAnchor",
		"type",
		"enum",
		"const",
		"anyOf",
		"oneOf",
		"allOf",
		"not",
		"properties",
		"required",
		"additionalProperties",
		"patternProperties",
		"propertyNames",
		"minProperties",
		"maxProperties",
		"items",
		"prefixItems",
		"additionalItems",
		"minItems",
		"maxItems",
		"uniqueItems",
		"contains",
		"minContains",
		"maxContains",
		"minLength",
		"maxLength",
		"pattern",
		"format",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"multipleOf",
		"description",
		"default",
		"contentEncoding",
		"contentMediaType",
		"contentSchema",
		"unevaluatedItems",
		"unevaluatedProperties",
		"if",
		"then",
		"else",
		"dependentSchemas",
		"dependentRequired",
		"nullable",
		"readOnly"
	]);
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/coerce.js
var coerce_exports = /* @__PURE__ */ __exportAll({
	bigint: () => bigint,
	boolean: () => boolean,
	date: () => date,
	number: () => number,
	string: () => string
});
function string(params) {
	return /* @__PURE__ */ _coercedString(ZodString, params);
}
function number(params) {
	return /* @__PURE__ */ _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return /* @__PURE__ */ _coercedBoolean(ZodBoolean, params);
}
function bigint(params) {
	return /* @__PURE__ */ _coercedBigint(ZodBigInt, params);
}
function date(params) {
	return /* @__PURE__ */ _coercedDate(ZodDate, params);
}
var init_coerce = __esmMin((() => {
	init_core();
	init_schemas();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/v4/classic/external.js
var external_exports = /* @__PURE__ */ __exportAll({
	$brand: () => $brand,
	$input: () => $input,
	$output: () => $output,
	NEVER: () => NEVER,
	TimePrecision: () => TimePrecision,
	ZodAny: () => ZodAny,
	ZodArray: () => ZodArray,
	ZodBase64: () => ZodBase64,
	ZodBase64URL: () => ZodBase64URL,
	ZodBigInt: () => ZodBigInt,
	ZodBigIntFormat: () => ZodBigIntFormat,
	ZodBoolean: () => ZodBoolean,
	ZodCIDRv4: () => ZodCIDRv4,
	ZodCIDRv6: () => ZodCIDRv6,
	ZodCUID: () => ZodCUID,
	ZodCUID2: () => ZodCUID2,
	ZodCatch: () => ZodCatch,
	ZodCodec: () => ZodCodec,
	ZodCustom: () => ZodCustom,
	ZodCustomStringFormat: () => ZodCustomStringFormat,
	ZodDate: () => ZodDate,
	ZodDefault: () => ZodDefault,
	ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
	ZodE164: () => ZodE164,
	ZodEmail: () => ZodEmail,
	ZodEmoji: () => ZodEmoji,
	ZodEnum: () => ZodEnum,
	ZodError: () => ZodError,
	ZodExactOptional: () => ZodExactOptional,
	ZodFile: () => ZodFile,
	ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
	ZodFunction: () => ZodFunction,
	ZodGUID: () => ZodGUID,
	ZodIPv4: () => ZodIPv4,
	ZodIPv6: () => ZodIPv6,
	ZodISODate: () => ZodISODate,
	ZodISODateTime: () => ZodISODateTime,
	ZodISODuration: () => ZodISODuration,
	ZodISOTime: () => ZodISOTime,
	ZodIntersection: () => ZodIntersection,
	ZodIssueCode: () => ZodIssueCode,
	ZodJWT: () => ZodJWT,
	ZodKSUID: () => ZodKSUID,
	ZodLazy: () => ZodLazy,
	ZodLiteral: () => ZodLiteral,
	ZodMAC: () => ZodMAC,
	ZodMap: () => ZodMap,
	ZodNaN: () => ZodNaN,
	ZodNanoID: () => ZodNanoID,
	ZodNever: () => ZodNever,
	ZodNonOptional: () => ZodNonOptional,
	ZodNull: () => ZodNull,
	ZodNullable: () => ZodNullable,
	ZodNumber: () => ZodNumber,
	ZodNumberFormat: () => ZodNumberFormat,
	ZodObject: () => ZodObject,
	ZodOptional: () => ZodOptional,
	ZodPipe: () => ZodPipe,
	ZodPrefault: () => ZodPrefault,
	ZodPromise: () => ZodPromise,
	ZodReadonly: () => ZodReadonly,
	ZodRealError: () => ZodRealError,
	ZodRecord: () => ZodRecord,
	ZodSet: () => ZodSet,
	ZodString: () => ZodString,
	ZodStringFormat: () => ZodStringFormat,
	ZodSuccess: () => ZodSuccess,
	ZodSymbol: () => ZodSymbol,
	ZodTemplateLiteral: () => ZodTemplateLiteral,
	ZodTransform: () => ZodTransform,
	ZodTuple: () => ZodTuple,
	ZodType: () => ZodType,
	ZodULID: () => ZodULID,
	ZodURL: () => ZodURL,
	ZodUUID: () => ZodUUID,
	ZodUndefined: () => ZodUndefined,
	ZodUnion: () => ZodUnion,
	ZodUnknown: () => ZodUnknown,
	ZodVoid: () => ZodVoid,
	ZodXID: () => ZodXID,
	ZodXor: () => ZodXor,
	_ZodString: () => _ZodString,
	_default: () => _default,
	_function: () => _function,
	any: () => any,
	array: () => array,
	base64: () => base64,
	base64url: () => base64url,
	bigint: () => bigint$1,
	boolean: () => boolean$1,
	catch: () => _catch,
	check: () => check,
	cidrv4: () => cidrv4,
	cidrv6: () => cidrv6,
	clone: () => clone,
	codec: () => codec,
	coerce: () => coerce_exports,
	config: () => config,
	core: () => core_exports,
	cuid: () => cuid,
	cuid2: () => cuid2,
	custom: () => custom,
	date: () => date$1,
	decode: () => decode,
	decodeAsync: () => decodeAsync,
	describe: () => describe,
	discriminatedUnion: () => discriminatedUnion,
	e164: () => e164,
	email: () => email,
	emoji: () => emoji,
	encode: () => encode,
	encodeAsync: () => encodeAsync,
	endsWith: () => _endsWith,
	enum: () => _enum,
	exactOptional: () => exactOptional,
	file: () => file,
	flattenError: () => flattenError,
	float32: () => float32,
	float64: () => float64,
	formatError: () => formatError,
	fromJSONSchema: () => fromJSONSchema,
	function: () => _function,
	getErrorMap: () => getErrorMap,
	globalRegistry: () => globalRegistry,
	gt: () => _gt,
	gte: () => _gte,
	guid: () => guid,
	hash: () => hash,
	hex: () => hex,
	hostname: () => hostname,
	httpUrl: () => httpUrl,
	includes: () => _includes,
	instanceof: () => _instanceof,
	int: () => int,
	int32: () => int32,
	int64: () => int64,
	intersection: () => intersection,
	ipv4: () => ipv4,
	ipv6: () => ipv6,
	iso: () => iso_exports,
	json: () => json,
	jwt: () => jwt,
	keyof: () => keyof,
	ksuid: () => ksuid,
	lazy: () => lazy,
	length: () => _length,
	literal: () => literal,
	locales: () => locales_exports,
	looseObject: () => looseObject,
	looseRecord: () => looseRecord,
	lowercase: () => _lowercase,
	lt: () => _lt,
	lte: () => _lte,
	mac: () => mac,
	map: () => map,
	maxLength: () => _maxLength,
	maxSize: () => _maxSize,
	meta: () => meta,
	mime: () => _mime,
	minLength: () => _minLength,
	minSize: () => _minSize,
	multipleOf: () => _multipleOf,
	nan: () => nan,
	nanoid: () => nanoid,
	nativeEnum: () => nativeEnum,
	negative: () => _negative,
	never: () => never,
	nonnegative: () => _nonnegative,
	nonoptional: () => nonoptional,
	nonpositive: () => _nonpositive,
	normalize: () => _normalize,
	null: () => _null,
	nullable: () => nullable,
	nullish: () => nullish,
	number: () => number$1,
	object: () => object,
	optional: () => optional,
	overwrite: () => _overwrite,
	parse: () => parse,
	parseAsync: () => parseAsync,
	partialRecord: () => partialRecord,
	pipe: () => pipe,
	positive: () => _positive,
	prefault: () => prefault,
	preprocess: () => preprocess,
	prettifyError: () => prettifyError,
	promise: () => promise,
	property: () => _property,
	readonly: () => readonly,
	record: () => record,
	refine: () => refine,
	regex: () => _regex,
	regexes: () => regexes_exports,
	registry: () => registry$1,
	safeDecode: () => safeDecode,
	safeDecodeAsync: () => safeDecodeAsync,
	safeEncode: () => safeEncode,
	safeEncodeAsync: () => safeEncodeAsync,
	safeParse: () => safeParse,
	safeParseAsync: () => safeParseAsync,
	set: () => set,
	setErrorMap: () => setErrorMap,
	size: () => _size,
	slugify: () => _slugify,
	startsWith: () => _startsWith,
	strictObject: () => strictObject,
	string: () => string$1,
	stringFormat: () => stringFormat,
	stringbool: () => stringbool,
	success: () => success,
	superRefine: () => superRefine,
	symbol: () => symbol,
	templateLiteral: () => templateLiteral,
	toJSONSchema: () => toJSONSchema,
	toLowerCase: () => _toLowerCase,
	toUpperCase: () => _toUpperCase,
	transform: () => transform,
	treeifyError: () => treeifyError,
	trim: () => _trim,
	tuple: () => tuple,
	uint32: () => uint32,
	uint64: () => uint64,
	ulid: () => ulid,
	undefined: () => _undefined,
	union: () => union,
	unknown: () => unknown,
	uppercase: () => _uppercase,
	url: () => url,
	util: () => util_exports,
	uuid: () => uuid,
	uuidv4: () => uuidv4,
	uuidv6: () => uuidv6,
	uuidv7: () => uuidv7,
	void: () => _void,
	xid: () => xid,
	xor: () => xor
});
var init_external = __esmMin((() => {
	init_core();
	init_schemas();
	init_checks();
	init_errors();
	init_parse();
	init_compat();
	init_en();
	init_json_schema_processors();
	init_from_json_schema();
	init_locales$1();
	init_iso();
	init_coerce();
	config(en_default());
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/index.js
var zod_default;
var init_zod = __esmMin((() => {
	init_external();
	init_external();
	zod_default = external_exports;
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod-errors-custom@2.1.6/node_modules/@cabloy/zod-errors-custom/dist/index.js
function setLocaleAdapter(localeAdapterFn) {
	setLocaleAdapter$1(localeAdapterFn);
}
function setLocaleErrors(localeCurrentAdapterFn, localeErrors, localeDefault = "en-us") {
	const localeErrorsInstance = {};
	function getLocalErrorInstance(locale) {
		if (!localeErrorsInstance[locale]) localeErrorsInstance[locale] = localeErrors[locale]().localeError;
		return localeErrorsInstance[locale];
	}
	config({ localeError(issue) {
		const localeCurrent = localeCurrentAdapterFn();
		if (localeErrors[localeCurrent]) return getLocalErrorInstance(localeCurrent)(issue);
		if (localeCurrent !== localeDefault && localeErrors[localeDefault]) return getLocalErrorInstance(localeDefault)(issue);
	} });
}
function translateError(localeAdapterFn, key, scope) {
	const content = localeAdapterFn(key);
	const [, args] = _replaceTemplate(content, scope);
	if (args.length === 0) return content;
	let message = localeAdapterFn(key, ...args);
	message = replaceTemplate(message, scope);
	return message;
}
function _replaceTemplate(content, scope) {
	if (!content) return [content, []];
	if (!scope) return [content, []];
	const args = [];
	content = content.toString().replace(/(\\)?\{\{ *([\w.]+) *\}\}/g, (block, skip, key) => {
		if (skip) return block.substring(skip.length);
		let value = getProperty(scope, key);
		value = value !== void 0 ? value : "";
		args.push(value);
		return "%s";
	});
	return [content, args];
}
function getProperty(obj, name, sep) {
	return _getProperty$1(obj, name);
}
function _getProperty$1(obj, name, sep, forceObject) {
	if (!obj) return void 0;
	const names = name.split(".");
	for (const name of names) {
		if (obj[name] === void 0 || obj[name] === null) {
			obj = obj[name];
			break;
		}
		obj = obj[name];
	}
	return obj;
}
var init_dist$7 = __esmMin((() => {
	init_zod();
	init_src();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod-to-openapi@8.1.6/node_modules/@cabloy/zod-to-openapi/dist/index.mjs
function isZodType$1(schema, typeNames) {
	return (Array.isArray(typeNames) ? typeNames : [typeNames]).some((typeName) => {
		var _schema$def;
		const typeNameMatch = (schema === null || schema === void 0 || (_schema$def = schema.def) === null || _schema$def === void 0 ? void 0 : _schema$def.type) === ZodTypeKeys$1[typeName];
		if (typeName === "ZodDiscriminatedUnion") return typeNameMatch && "discriminator" in schema.def;
		return typeNameMatch;
	});
}
function isAnyZodType$1(schema) {
	return schema && "def" in schema;
}
function registry() {
	return new $ZodRegistry();
}
function isUndefined$1(value) {
	return value === void 0;
}
function omit$1(object, keys) {
	const result = {};
	Object.entries(object).forEach(([key, value]) => {
		if (!keys.some((keyToOmit) => keyToOmit === key)) result[key] = value;
	});
	return result;
}
function omitBy(object, predicate) {
	const result = {};
	Object.entries(object).forEach(([key, value]) => {
		if (!predicate(value, key)) result[key] = value;
	});
	return result;
}
var _excluded$1, _excluded2, _excluded3, _a$__zod_globalRegist, ZodTypeKeys$1, _a, $ZodRegistry, zodToOpenAPIRegistry, Metadata$1;
var init_dist$6 = __esmMin((() => {
	init_objectSpread2();
	init_objectWithoutProperties();
	_excluded$1 = ["_internal"], _excluded2 = ["_internal"], _excluded3 = ["id", "title"];
	ZodTypeKeys$1 = {
		ZodAny: "any",
		ZodArray: "array",
		ZodBigInt: "bigint",
		ZodBoolean: "boolean",
		ZodDefault: "default",
		ZodPrefault: "prefault",
		ZodTransform: "transform",
		ZodEnum: "enum",
		ZodIntersection: "intersection",
		ZodLiteral: "literal",
		ZodNever: "never",
		ZodNull: "null",
		ZodNullable: "nullable",
		ZodNumber: "number",
		ZodNonOptional: "nonoptional",
		ZodObject: "object",
		ZodOptional: "optional",
		ZodPipe: "pipe",
		ZodReadonly: "readonly",
		ZodRecord: "record",
		ZodString: "string",
		ZodTuple: "tuple",
		ZodType: "type",
		ZodUnion: "union",
		ZodDiscriminatedUnion: "union",
		ZodUnknown: "unknown",
		ZodVoid: "void",
		ZodDate: "date"
	};
	$ZodRegistry = class {
		constructor() {
			this._map = /* @__PURE__ */ new WeakMap();
			this._idmap = /* @__PURE__ */ new Map();
		}
		add(schema, ..._meta) {
			const meta = _meta[0];
			this._map.set(schema, meta);
			if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
			return this;
		}
		clear() {
			this._map = /* @__PURE__ */ new WeakMap();
			this._idmap = /* @__PURE__ */ new Map();
			return this;
		}
		remove(schema) {
			const meta = this._map.get(schema);
			if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
			this._map.delete(schema);
			return this;
		}
		get(schema) {
			const p = schema._zod.parent;
			if (p) {
				var _this$get;
				const pm = _objectSpread2({}, (_this$get = this.get(p)) !== null && _this$get !== void 0 ? _this$get : {});
				delete pm.id;
				const f = _objectSpread2(_objectSpread2({}, pm), this._map.get(schema));
				return Object.keys(f).length ? f : void 0;
			}
			return this._map.get(schema);
		}
		has(schema) {
			return this._map.has(schema);
		}
	};
	(_a$__zod_globalRegist = (_a = globalThis).__zod_globalRegistry) !== null && _a$__zod_globalRegist !== void 0 || (_a.__zod_globalRegistry = registry());
	zodToOpenAPIRegistry = registry();
	Metadata$1 = class {
		static collectMetadata(schema, metadata) {
			const currentMetadata = this.getMetadataFromRegistry(schema);
			const _internal = _objectSpread2(_objectSpread2({}, currentMetadata === null || currentMetadata === void 0 ? void 0 : currentMetadata._internal), metadata === null || metadata === void 0 ? void 0 : metadata._internal);
			const param = _objectSpread2(_objectSpread2({}, currentMetadata === null || currentMetadata === void 0 ? void 0 : currentMetadata.param), metadata === null || metadata === void 0 ? void 0 : metadata.param);
			const totalMetadata = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, Object.keys(_internal).length > 0 ? { _internal } : {}), currentMetadata), metadata), Object.keys(param).length > 0 ? { param } : {});
			if (isZodType$1(schema, [
				"ZodOptional",
				"ZodNullable",
				"ZodDefault",
				"ZodPrefault",
				"ZodReadonly",
				"ZodNonOptional"
			]) && isAnyZodType$1(schema._zod.def.innerType)) return this.collectMetadata(schema._zod.def.innerType, totalMetadata);
			if (isZodType$1(schema, "ZodPipe")) {
				const inSchema = schema._zod.def.in;
				const outSchema = schema._zod.def.out;
				if (isZodType$1(inSchema, "ZodTransform") && isAnyZodType$1(outSchema)) return this.collectMetadata(outSchema, totalMetadata);
				if (isAnyZodType$1(inSchema)) return this.collectMetadata(inSchema, totalMetadata);
			}
			return totalMetadata;
		}
		/**
		* @deprecated Use one of `getOpenApiMetadata` or `getInternalMetadata` instead
		*/
		static getMetadata(zodSchema) {
			return this.collectMetadata(zodSchema);
		}
		static getOpenApiMetadata(zodSchema) {
			const metadata = this.collectMetadata(zodSchema);
			const _ref = metadata !== null && metadata !== void 0 ? metadata : {}, { _internal } = _ref;
			return _objectWithoutProperties(_ref, _excluded$1);
		}
		static getInternalMetadata(zodSchema) {
			var _this$collectMetadata;
			return (_this$collectMetadata = this.collectMetadata(zodSchema)) === null || _this$collectMetadata === void 0 ? void 0 : _this$collectMetadata._internal;
		}
		static getParamMetadata(zodSchema) {
			const metadata = this.collectMetadata(zodSchema);
			return _objectSpread2(_objectSpread2({}, metadata), {}, { param: _objectSpread2(_objectSpread2({}, (metadata === null || metadata === void 0 ? void 0 : metadata.description) ? { description: metadata.description } : {}), metadata === null || metadata === void 0 ? void 0 : metadata.param) });
		}
		/**
		* A method that omits all custom keys added to the regular OpenAPI
		* metadata properties
		*/
		static buildSchemaMetadata(metadata) {
			return omitBy(omit$1(metadata, ["param", "_internal"]), isUndefined$1);
		}
		static buildParameterMetadata(metadata) {
			return omitBy(metadata, isUndefined$1);
		}
		static applySchemaMetadata(initialData, metadata) {
			return omitBy(_objectSpread2(_objectSpread2({}, initialData), this.buildSchemaMetadata(metadata)), isUndefined$1);
		}
		static getRefId(zodSchema) {
			var _this$getInternalMeta;
			return (_this$getInternalMeta = this.getInternalMetadata(zodSchema)) === null || _this$getInternalMeta === void 0 ? void 0 : _this$getInternalMeta.refId;
		}
		static unwrapChained(schema) {
			return this.unwrapUntil(schema);
		}
		static getDefaultValue(zodSchema) {
			var _this$unwrapUntil;
			const unwrapped = (_this$unwrapUntil = this.unwrapUntil(zodSchema, "ZodDefault")) !== null && _this$unwrapUntil !== void 0 ? _this$unwrapUntil : this.unwrapUntil(zodSchema, "ZodPrefault");
			return unwrapped === null || unwrapped === void 0 ? void 0 : unwrapped._zod.def.defaultValue;
		}
		static unwrapUntil(schema, typeName) {
			if (typeName && isZodType$1(schema, typeName)) return schema;
			if (isZodType$1(schema, [
				"ZodOptional",
				"ZodNullable",
				"ZodDefault",
				"ZodPrefault",
				"ZodReadonly",
				"ZodNonOptional"
			]) && isAnyZodType$1(schema._zod.def.innerType)) return this.unwrapUntil(schema._zod.def.innerType, typeName);
			if (isZodType$1(schema, "ZodPipe")) {
				const inSchema = schema._zod.def.in;
				const outSchema = schema._zod.def.out;
				if (isZodType$1(inSchema, "ZodTransform") && isAnyZodType$1(outSchema)) return this.unwrapUntil(outSchema, typeName);
				if (isAnyZodType$1(inSchema)) return this.unwrapUntil(inSchema, typeName);
			}
			return typeName ? void 0 : schema;
		}
		static getMetadataFromInternalRegistry(zodSchema) {
			return zodToOpenAPIRegistry.get(zodSchema);
		}
		static getMetadataFromRegistry(zodSchema) {
			const internal = this.getMetadataFromInternalRegistry(zodSchema);
			const general = zodSchema.meta();
			if (!internal) return general;
			const { _internal } = internal, rest = _objectWithoutProperties(internal, _excluded2);
			const _ref2 = general !== null && general !== void 0 ? general : {}, { id, title } = _ref2, restGeneral = _objectWithoutProperties(_ref2, _excluded3);
			return _objectSpread2(_objectSpread2(_objectSpread2({ _internal: _objectSpread2(_objectSpread2({}, id ? { refId: id } : {}), _internal) }, rest), title ? { description: title } : {}), restGeneral);
		}
		static setMetadataInRegistry(zodSchema, metadata) {
			zodToOpenAPIRegistry.add(zodSchema, metadata);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod-openapi@1.1.6/node_modules/@cabloy/zod-openapi/dist/index.js
var ZodMetadata$1;
var init_dist$5 = __esmMin((() => {
	init_dist$6();
	ZodMetadata$1 = class {
		static unwrapUntil(schema, typeName) {
			return Metadata$1.unwrapUntil(schema, typeName);
		}
		static unwrapChained(schema) {
			if (!schema) return void 0;
			return Metadata$1.unwrapChained(schema);
		}
		static getDefaultValue(zodSchema) {
			return Metadata$1.getDefaultValue(zodSchema);
		}
		static getInternalMetadata(zodSchema) {
			return Metadata$1.getInternalMetadata(zodSchema);
		}
		static getLazySchema(zodSchema) {
			var _zodSchema$_zod$def$g;
			const innerSchema = this.unwrapChained(zodSchema);
			return (_zodSchema$_zod$def$g = zodSchema._zod.def.getter) !== null && _zodSchema$_zod$def$g !== void 0 ? _zodSchema$_zod$def$g : innerSchema._zod.def.getter;
		}
		static resolveLazySchema(zodSchema) {
			const getter = this.getLazySchema(zodSchema);
			if (!getter) return zodSchema;
			const metadata = this.getOpenapiMetadata(zodSchema);
			zodSchema = getter();
			return metadata ? zodSchema.openapi(metadata) : zodSchema;
		}
		static getRefId(zodSchema) {
			return Metadata$1.getRefId(zodSchema);
		}
		static getFieldSchema(zodSchema, key) {
			if (!zodSchema) return;
			const parts = key.split(".");
			for (const part of parts) {
				zodSchema = this._getFieldSchemaInner(zodSchema, part);
				if (!zodSchema) break;
			}
			return zodSchema;
		}
		static _getFieldSchemaInner(zodSchema, key) {
			if (!zodSchema) return;
			zodSchema = this.unwrapChained(zodSchema);
			let schema;
			if (zodSchema.def.type === "object") schema = zodSchema;
			else if (zodSchema.def.type === "union") schema = zodSchema.def.options.find((item) => item.def.type === "object");
			else throw new Error("invalid zod schema");
			return schema.shape[key];
		}
		static getOpenapiMetadata(zodSchema) {
			return Metadata$1.getOpenApiMetadata(zodSchema);
		}
		static isZodType(schema, typeNames) {
			return isZodType$1(schema, typeNames);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod-query@2.1.5/node_modules/@cabloy/zod-query/dist/index.js
function isZodType(schema, typeNames) {
	return (Array.isArray(typeNames) ? typeNames : [typeNames]).some((typeName) => {
		var _schema$def;
		const typeNameMatch = (schema === null || schema === void 0 || (_schema$def = schema.def) === null || _schema$def === void 0 ? void 0 : _schema$def.type) === ZodTypeKeys[typeName];
		if (typeName === "ZodDiscriminatedUnion") return typeNameMatch && "discriminator" in schema.def;
		return typeNameMatch;
	});
}
function isAnyZodType(schema) {
	return "def" in schema;
}
function setParseAdapter(zodMetadata) {
	ZodMetadata = zodMetadata;
	setParseAdapter$1(__parseAdapter);
}
function __parseAdapter(inst, parse) {
	return (payload, _) => {
		switch (inst.type) {
			case "string": return __parseString(inst, parse, payload, _);
			case "number": return __parseNumber(inst, parse, payload, _);
			case "bigint": return __parseBigInt(inst, parse, payload, _);
			case "boolean": return __parseBoolean(inst, parse, payload, _);
			case "date": return __parseDate(inst, parse, payload, _);
			case "object": return __parseObject(inst, parse, payload, _);
			case "array": return __parseArray(inst, parse, payload, _);
			case "optional": return __parseOptional(inst, parse, payload, _);
			case "default": return __parseDefault(inst, parse, payload, _);
		}
		return parse(payload, _);
	};
}
function __parseString(inst, parse, payload, _) {
	const metadata = ZodMetadata === null || ZodMetadata === void 0 ? void 0 : ZodMetadata.getOpenapiMetadata(inst);
	if ((metadata === null || metadata === void 0 ? void 0 : metadata.format) === "binary" && !isNil(payload.value)) return payload;
	_coerceString(payload);
	return parse(payload, _);
}
function __parseNumber(_inst, parse, payload, _) {
	_coerceWithNil(payload, () => {
		payload.value = Number(payload.value);
	});
	return parse(payload, _);
}
function __parseBigInt(_inst, parse, payload, _) {
	_coerceWithNil(payload, () => {
		payload.value = BigInt(payload.value);
	});
	return parse(payload, _);
}
function __parseBoolean(_inst, parse, payload, _) {
	_coerceWithNil(payload, () => {
		if (payload.value === "false" || payload.value === "0") payload.value = false;
		else payload.value = Boolean(payload.value);
	});
	return parse(payload, _);
}
function __parseDate(_inst, parse, payload, _) {
	_coerceWithNil(payload, () => {
		payload.value = new Date(payload.value);
	});
	return parse(payload, _);
}
function __parseObject(_inst, parse, payload, _) {
	_coerceWithNil(payload, () => {
		if (typeof payload.value === "string") payload.value = JSON.parse(payload.value);
	});
	return parse(payload, _);
}
function __parseArray(_inst, parse, payload, _) {
	_coerceWithNil(payload, () => {
		if (typeof payload.value === "string") if (payload.value.startsWith("[") && payload.value.endsWith("]")) payload.value = JSON.parse(payload.value);
		else payload.value = payload.value.split(",");
	});
	return parse(payload, _);
}
function __parseOptional(_inst, parse, payload, _) {
	if (isZodType(Metadata.unwrapUntil(_inst), "ZodString")) _coerceString(payload);
	else _coerceWithNil(payload);
	if (payload.value === null) payload.value = void 0;
	return parse(payload, _);
}
function __parseDefault(_inst, parse, payload, _) {
	if (isZodType(Metadata.unwrapUntil(_inst), "ZodString")) _coerceString(payload);
	else _coerceWithNil(payload);
	return parse(payload, _);
}
function _coerceString(payload, fn) {
	if (!isNil(payload.value)) {
		if (payload.value === "") payload.value = void 0;
		else if (typeof payload.value !== "string") payload.value = String(payload.value);
	}
}
function _coerceWithNil(payload, fn) {
	if (!isNil(payload.value)) if (payload.value === "undefined" || payload.value === "") payload.value = void 0;
	else if (payload.value === "null") payload.value = null;
	else fn === null || fn === void 0 || fn(payload);
}
var ZodTypeKeys, Metadata, isUndefined, isNil, ZodMetadata;
var init_dist$4 = __esmMin((() => {
	init_zod();
	ZodTypeKeys = {
		ZodAny: "any",
		ZodArray: "array",
		ZodBigInt: "bigint",
		ZodBoolean: "boolean",
		ZodDefault: "default",
		ZodTransform: "transform",
		ZodEnum: "enum",
		ZodIntersection: "intersection",
		ZodLiteral: "literal",
		ZodNever: "never",
		ZodNull: "null",
		ZodNullable: "nullable",
		ZodNumber: "number",
		ZodNonOptional: "nonoptional",
		ZodObject: "object",
		ZodOptional: "optional",
		ZodPipe: "pipe",
		ZodReadonly: "readonly",
		ZodRecord: "record",
		ZodString: "string",
		ZodTuple: "tuple",
		ZodType: "type",
		ZodUnion: "union",
		ZodDiscriminatedUnion: "union",
		ZodUnknown: "unknown",
		ZodVoid: "void",
		ZodDate: "date"
	};
	Metadata = class {
		static unwrapUntil(schema, typeName) {
			if (typeName && isZodType(schema, typeName)) return schema;
			if (isZodType(schema, [
				"ZodOptional",
				"ZodNullable",
				"ZodDefault",
				"ZodReadonly",
				"ZodNonOptional"
			]) && isAnyZodType(schema._zod.def.innerType)) return this.unwrapUntil(schema._zod.def.innerType, typeName);
			if (isZodType(schema, "ZodPipe")) {
				const inSchema = schema._zod.def.in;
				const outSchema = schema._zod.def.out;
				if (isZodType(inSchema, "ZodTransform") && isAnyZodType(outSchema)) return this.unwrapUntil(outSchema, typeName);
				if (isAnyZodType(inSchema)) return this.unwrapUntil(inSchema, typeName);
			}
			return typeName ? void 0 : schema;
		}
	};
	isUndefined = (obj) => typeof obj === "undefined";
	isNil = (val) => isUndefined(val) || val === null;
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+localeutil@2.1.5/node_modules/@cabloy/localeutil/dist/index.js
function tryStringify(arg) {
	try {
		return JSON.stringify(arg);
	} catch (err) {
		if (!CIRCULAR_ERROR_MESSAGE) try {
			const a = {};
			a.a = a;
			JSON.stringify(a);
		} catch (err) {
			CIRCULAR_ERROR_MESSAGE = err.message;
		}
		if (err.name === "TypeError" && err.message === CIRCULAR_ERROR_MESSAGE) return "[Circular]";
		throw err;
	}
}
function format(f) {
	if (arguments.length === 1) return f;
	let str = "";
	let a = 1;
	let lastPos = 0;
	for (let i = 0; i < f.length;) {
		if (f.charCodeAt(i) === 37 && i + 1 < f.length) {
			if (f.charCodeAt(i + 1) !== 37 && a >= arguments.length) {
				++i;
				continue;
			}
			switch (f.charCodeAt(i + 1)) {
				case 100:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += Number(arguments[a++]);
					break;
				case 105:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += parseInt(arguments[a++]);
					break;
				case 102:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += parseFloat(arguments[a++]);
					break;
				case 106:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += tryStringify(arguments[a++]);
					break;
				case 115:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += String(arguments[a++]);
					break;
				case 37:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += "%";
					break;
				default:
					if (lastPos < i) str += f.slice(lastPos, i);
					str += "%";
					lastPos = i = i + 1;
					continue;
			}
			lastPos = i = i + 2;
			continue;
		}
		++i;
	}
	if (lastPos === 0) str = f;
	else if (lastPos < f.length) str += f.slice(lastPos);
	return str;
}
/**
* based on koa-locales
*
* https://github.com/koajs/locales/blob/master/index.js
*
*/
function getText(...args) {
	if (args.length === 0) return "";
	const [text, value] = args;
	if (!text) return "";
	if (args.length === 1) return text;
	if (args.length === 2) {
		if (isObject(value)) return formatWithObject(text, value);
		if (Array.isArray(value)) return formatWithArray(text, value);
		return format(text, value);
	}
	const _args = new Array(args.length);
	_args[0] = text;
	for (let i = 1; i < _args.length; i++) _args[i] = args[i];
	return format.apply(null, _args);
}
function isObject(obj) {
	return Object.prototype.toString.call(obj) === "[object Object]";
}
function formatWithArray(text, values) {
	return text.replace(ARRAY_INDEX_RE, function(orignal, matched) {
		const index = parseInt(matched);
		if (index < values.length) return values[index];
		return orignal;
	});
}
function formatWithObject(text, values) {
	return text.replace(Object_INDEX_RE, function(orignal, matched) {
		const value = values[matched];
		if (value) return value;
		return orignal;
	});
}
function getLocaleText(supportCustomMessage, locales1, locales2, locale, key, ...args) {
	const keyCaches = _parseKeyCaches(locales1, locales2, locale, key);
	if (keyCaches !== false) for (const keyCache of keyCaches) {
		var _flags$;
		const flags = keyCache[0];
		const _key = keyCache[1];
		if (args[(_flags$ = flags[1]) !== null && _flags$ !== void 0 ? _flags$ : 0] === flags[0]) return _getLocaleText_inner(supportCustomMessage, locales1, locales2, locale, _key, ...args);
	}
	return _getLocaleText_inner(supportCustomMessage, locales1, locales2, locale, key, ...args);
}
function _parseKeyCaches(locales1, locales2, locale, key) {
	if (!__keysCachesLocales[locale]) __keysCachesLocales[locale] = {};
	const keysCaches = __keysCachesLocales[locale];
	if (keysCaches[key] !== void 0) return keysCaches[key];
	const _keyCaches = [];
	_collectKeyCaches(_keyCaches, false, locales1, locale, key);
	_collectKeyCaches(_keyCaches, true, locales2, locale, key);
	keysCaches[key] = _keyCaches.length === 0 ? false : _keyCaches;
	return keysCaches[key];
}
function _collectKeyCaches(keyCaches, checkExists, locales, locale, key) {
	if (!locales || !locales[locale]) return;
	for (const _key in locales[locale]) {
		if (_key === key || !_key.startsWith(key)) continue;
		let flag = _key.substring(key.length);
		if (flag.startsWith("_")) flag = flag.substring(1);
		const flags = flag.split("_").map((item) => Number(item));
		if (!checkExists || !keyCaches.some((item) => item[1] === _key)) keyCaches.push([flags, _key]);
	}
}
function _getLocaleText_inner(supportCustomMessage, locales1, locales2, locale, key, ...args) {
	var _locales1$locale$key, _locales1$locale, _locales2$locale;
	if (!key) return "";
	let text = (_locales1$locale$key = locales1 === null || locales1 === void 0 || (_locales1$locale = locales1[locale]) === null || _locales1$locale === void 0 ? void 0 : _locales1$locale[key]) !== null && _locales1$locale$key !== void 0 ? _locales1$locale$key : locales2 === null || locales2 === void 0 || (_locales2$locale = locales2[locale]) === null || _locales2$locale === void 0 ? void 0 : _locales2$locale[key];
	if (text === void 0 && locale !== "en-us") {
		var _locales1$enUs$key, _locales1$enUs, _locales2$enUs;
		text = (_locales1$enUs$key = locales1 === null || locales1 === void 0 || (_locales1$enUs = locales1["en-us"]) === null || _locales1$enUs === void 0 ? void 0 : _locales1$enUs[key]) !== null && _locales1$enUs$key !== void 0 ? _locales1$enUs$key : locales2 === null || locales2 === void 0 || (_locales2$enUs = locales2["en-us"]) === null || _locales2$enUs === void 0 ? void 0 : _locales2$enUs[key];
	}
	if (text === void 0) text = key;
	if (supportCustomMessage && !text.replaceAll("%%", "").includes("%") && args[0]) return getText(...args);
	return getText(text, ...args);
}
var CIRCULAR_ERROR_MESSAGE, ARRAY_INDEX_RE, Object_INDEX_RE, __keysCachesLocales;
var init_dist$3 = __esmMin((() => {
	ARRAY_INDEX_RE = /\{(\d+)\}/g;
	Object_INDEX_RE = /\{(.+?)\}/g;
	__keysCachesLocales = {};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+module-info@2.0.0/node_modules/@cabloy/module-info/dist/index.mjs
function getOnionScenesMeta(modules) {
	if (!__onionScenesMeta) __onionScenesMeta = _getOnionScenesMeta(modules);
	return __onionScenesMeta;
}
function _getOnionScenesMeta(modules) {
	const result = {};
	for (const moduleName in modules) {
		var _module$info$onionsMe;
		const module = modules[moduleName];
		const onions = (_module$info$onionsMe = module.info.onionsMeta) === null || _module$info$onionsMe === void 0 ? void 0 : _module$info$onionsMe.onions;
		if (!onions) continue;
		for (const sceneName in onions) result[sceneName] = _objectSpread2(_objectSpread2({}, onions[sceneName]), {}, { module });
	}
	return result;
}
function parseInfo(moduleName) {
	if (!moduleName) return;
	if (moduleName.includes("://")) return;
	if (moduleName.charAt(0) === "/") moduleName = moduleName.substring(1);
	let parts = moduleName.split("/").filter((item) => item);
	if (parts.length < 2) {
		parts = moduleName.split("-").filter((item) => item);
		if (parts.length < 2) return;
		if (parts.length === 4) parts = parts.slice(2);
		if (parts.length === 5) parts = parts.slice(3);
	}
	return {
		pid: parts[0],
		name: parts[1],
		relativeName: `${parts[0]}-${parts[1]}`,
		url: `${parts[0]}/${parts[1]}`,
		originalName: parts.join("-")
	};
}
function parseName(moduleUrl) {
	const moduleName = _parseNameInner(moduleUrl);
	if (!moduleName) return;
	const [a, b] = moduleName.split("-");
	if (!a || !b) return;
	return moduleName;
}
function _parseNameInner(moduleUrl) {
	if (!moduleUrl) return;
	if (moduleUrl.indexOf("/api/static/") === 0) moduleUrl = `/api/${moduleUrl.substring(12)}`;
	if (moduleUrl.indexOf(PREFIX_A) === 0) return _parseNameLikeUrl(moduleUrl, PREFIX_A);
	else if (moduleUrl.indexOf(PREFIX_B) === 0) return _parseName(moduleUrl, PREFIX_B);
	else if (moduleUrl.indexOf(PREFIX_C) === 0) return _parseName(moduleUrl, PREFIX_C);
	else if (moduleUrl.indexOf(PREFIX_D) === 0) return _parseName(moduleUrl, PREFIX_D);
	else if (moduleUrl.indexOf(PREFIX_E) === 0) return _parseNameLikeUrl(moduleUrl, PREFIX_E);
	else return _parseName(moduleUrl.replace("/", "-"), "");
}
function _parseNameLikeUrl(moduleUrl, prefix) {
	const posA = prefix.length;
	const posB = moduleUrl.indexOf("/", posA) + 1;
	if (posB === 0) return;
	let posC = moduleUrl.indexOf("/", posB);
	if (posC === -1) posC = moduleUrl.length;
	return moduleUrl.substring(posA, posC).replace("/", "-");
}
function _parseName(moduleUrl, prefix) {
	const posA = prefix.length;
	let posB = moduleUrl.indexOf("/", posA);
	if (posB === -1) posB = moduleUrl.indexOf(":", posA);
	if (posB === -1) posB = moduleUrl.indexOf(".", posA);
	if (posB === -1) posB = moduleUrl.length;
	return moduleUrl.substring(posA, posB);
}
var __onionScenesMeta, PREFIX_A, PREFIX_B, PREFIX_C, PREFIX_D, PREFIX_E;
var init_dist$2 = __esmMin((() => {
	init_objectSpread2();
	PREFIX_A = "/api/";
	PREFIX_B = "vona-module-";
	PREFIX_C = "./vona-module-";
	PREFIX_D = "./";
	PREFIX_E = "/";
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+deps@1.1.5/node_modules/@cabloy/deps/dist/index.js
function swapDeps(items, options) {
	const depsDynamic = _handleDependents(items, options);
	while (true) if (!_swapDeps(depsDynamic, items, options)) break;
}
function _handleDependents(items, options) {
	const keyDependents = (options === null || options === void 0 ? void 0 : options.dependents) || "dependents";
	const keyName = (options === null || options === void 0 ? void 0 : options.name) || "name";
	const depsDynamic = {};
	for (const item of items) {
		const itemName = _getProperty(item, keyName);
		let dependents = typeof keyDependents === "function" ? keyDependents(item) : _getProperty(item, keyDependents);
		if (!dependents) continue;
		if (!Array.isArray(dependents)) dependents = dependents.split(",");
		for (const dep of dependents) {
			if (!depsDynamic[dep]) depsDynamic[dep] = [];
			if (depsDynamic[dep].findIndex((item) => item === itemName) === -1) depsDynamic[dep].push(itemName);
		}
	}
	return depsDynamic;
}
function _swapDeps(depsDynamic, items, options) {
	const keyDependencies = (options === null || options === void 0 ? void 0 : options.dependencies) || "dependencies";
	const keyName = (options === null || options === void 0 ? void 0 : options.name) || "name";
	let result = false;
	for (const item of items) {
		const name = _getProperty(item, keyName);
		let deps = (typeof keyDependencies === "function" ? keyDependencies(item) : _getProperty(item, keyDependencies)) || [];
		if (typeof deps === "string") deps = deps.split(",");
		if (depsDynamic[name]) {
			for (const depDynamic of depsDynamic[name]) if (deps.findIndex((item) => item === depDynamic) === -1) deps.push(depDynamic);
		}
		for (const dep of deps) if (_swapDep(items, dep, name, keyName)) result = true;
	}
	return result;
}
function _swapDep(arr, a, b, keyName) {
	const indexA = arr.findIndex((item) => _getProperty(item, keyName) === a);
	const indexB = arr.findIndex((item) => _getProperty(item, keyName) === b);
	if (indexA === -1 || indexB === -1 || indexA < indexB) return false;
	arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
	return true;
}
function _getProperty(obj, name) {
	if (!obj) return void 0;
	const names = name.split(".");
	for (const name of names) {
		if (obj[name] === void 0 || obj[name] === null) {
			obj = obj[name];
			break;
		}
		obj = obj[name];
	}
	return obj;
}
var init_dist$1 = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/Types.js
var init_Types = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseAnyOf.js
var parseAnyOf;
var init_parseAnyOf = __esmMin((() => {
	init_parseSchema();
	init_objectSpread2();
	parseAnyOf = (schema, refs) => {
		return schema.anyOf.length ? schema.anyOf.length === 1 ? parseSchema(schema.anyOf[0], _objectSpread2(_objectSpread2({}, refs), {}, { path: [
			...refs.path,
			"anyOf",
			0
		] })) : `z.union([${schema.anyOf.map((schema, i) => parseSchema(schema, _objectSpread2(_objectSpread2({}, refs), {}, { path: [
			...refs.path,
			"anyOf",
			i
		] }))).join(", ")}])` : `z.any()`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseBoolean.js
var parseBoolean;
var init_parseBoolean = __esmMin((() => {
	parseBoolean = (_schema) => {
		return "z.boolean()";
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseDefault.js
var parseDefault;
var init_parseDefault = __esmMin((() => {
	parseDefault = (_schema) => {
		return "z.any()";
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseMultipleType.js
var parseMultipleType;
var init_parseMultipleType = __esmMin((() => {
	init_parseSchema();
	init_objectSpread2();
	parseMultipleType = (schema, refs) => {
		return `z.union([${schema.type.map((type) => parseSchema(_objectSpread2(_objectSpread2({}, schema), {}, { type }), _objectSpread2(_objectSpread2({}, refs), {}, { withoutDefaults: true }))).join(", ")}])`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseNot.js
var parseNot;
var init_parseNot = __esmMin((() => {
	init_parseSchema();
	init_objectSpread2();
	parseNot = (schema, refs) => {
		return `z.any().refine((value) => !${parseSchema(schema.not, _objectSpread2(_objectSpread2({}, refs), {}, { path: [...refs.path, "not"] }))}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseNull.js
var parseNull;
var init_parseNull = __esmMin((() => {
	parseNull = (_schema) => {
		return "z.null()";
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/utils/half.js
var half;
var init_half = __esmMin((() => {
	half = (arr) => {
		return [arr.slice(0, arr.length / 2), arr.slice(arr.length / 2)];
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseAllOf.js
function parseAllOf(schema, refs) {
	if (schema.allOf.length === 0) return "z.never()";
	else if (schema.allOf.length === 1) {
		const item = schema.allOf[0];
		return parseSchema(item, _objectSpread2(_objectSpread2({}, refs), {}, { path: [
			...refs.path,
			"allOf",
			item[originalIndex]
		] }));
	} else {
		const [left, right] = half(ensureOriginalIndex(schema.allOf));
		return `z.intersection(${parseAllOf({ allOf: left }, refs)}, ${parseAllOf({ allOf: right }, refs)})`;
	}
}
var originalIndex, ensureOriginalIndex;
var init_parseAllOf = __esmMin((() => {
	init_parseSchema();
	init_half();
	init_objectSpread2();
	originalIndex = Symbol("Original index");
	ensureOriginalIndex = (arr) => {
		let newArr = [];
		for (let i = 0; i < arr.length; i++) {
			const item = arr[i];
			if (typeof item === "boolean") newArr.push(item ? { [originalIndex]: i } : {
				[originalIndex]: i,
				not: {}
			});
			else if (originalIndex in item) return arr;
			else newArr.push(_objectSpread2(_objectSpread2({}, item), {}, { [originalIndex]: i }));
		}
		return newArr;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/utils/withMessage.js
function withMessage(schema, key, get) {
	const value = schema[key];
	let r = "";
	if (key === "default" || value !== void 0) {
		const got = get({
			value,
			json: JSON.stringify(value)
		});
		if (got) {
			var _schema$errorMessage;
			const opener = got[0];
			const prefix = got.length === 3 ? got[1] : "";
			const closer = got.length === 3 ? got[2] : got[1];
			r += opener;
			if (((_schema$errorMessage = schema.errorMessage) === null || _schema$errorMessage === void 0 ? void 0 : _schema$errorMessage[key]) !== void 0) r += prefix + JSON.stringify(schema.errorMessage[key]);
			r += closer;
		}
	}
	return r;
}
var init_withMessage = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseArray.js
var parseArray;
var init_parseArray = __esmMin((() => {
	init_withMessage();
	init_parseSchema();
	init_objectSpread2();
	parseArray = (schema, refs) => {
		if (Array.isArray(schema.items)) return `z.tuple([${schema.items.map((v, i) => parseSchema(v, _objectSpread2(_objectSpread2({}, refs), {}, { path: [
			...refs.path,
			"items",
			i
		] })))}])`;
		let r = !schema.items ? "z.array(z.any())" : `z.array(${parseSchema(schema.items, _objectSpread2(_objectSpread2({}, refs), {}, { path: [...refs.path, "items"] }))})`;
		r += withMessage(schema, "minItems", ({ json }) => [
			`.min(${json}`,
			", ",
			")"
		]);
		r += withMessage(schema, "maxItems", ({ json }) => [
			`.max(${json}`,
			", ",
			")"
		]);
		return r;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseConst.js
var parseConst;
var init_parseConst = __esmMin((() => {
	parseConst = (schema) => {
		return `z.literal(${JSON.stringify(schema.const)})`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseEnum.js
var parseEnum;
var init_parseEnum = __esmMin((() => {
	parseEnum = (schema) => {
		if (schema.enum.length === 0) return "z.never()";
		else if (schema.enum.length === 1) return `z.literal(${JSON.stringify(schema.enum[0])})`;
		else if (schema.enum.every((x) => typeof x === "string")) return `z.enum([${schema.enum.map((x) => JSON.stringify(x))}])`;
		else return `z.union([${schema.enum.map((x) => `z.literal(${JSON.stringify(x)})`).join(", ")}])`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseIfThenElse.js
var parseIfThenElse;
var init_parseIfThenElse = __esmMin((() => {
	init_parseSchema();
	init_objectSpread2();
	parseIfThenElse = (schema, refs) => {
		const $if = parseSchema(schema.if, _objectSpread2(_objectSpread2({}, refs), {}, { path: [...refs.path, "if"] }));
		const $then = parseSchema(schema.then, _objectSpread2(_objectSpread2({}, refs), {}, { path: [...refs.path, "then"] }));
		const $else = parseSchema(schema.else, _objectSpread2(_objectSpread2({}, refs), {}, { path: [...refs.path, "else"] }));
		return `z.union([${$then}, ${$else}]).superRefine((value,ctx) => {
  const result = ${$if}.safeParse(value).success
    ? ${$then}.safeParse(value)
    : ${$else}.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
})`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseNumber.js
var parseNumber;
var init_parseNumber = __esmMin((() => {
	init_withMessage();
	parseNumber = (schema) => {
		let r = withMessage(schema, "default", () => ["z.number(", ")"]);
		if (schema.type === "integer") r += withMessage(schema, "type", () => [".int(", ")"]);
		else r += withMessage(schema, "format", ({ value }) => {
			if (value === "int64") return [".int(", ")"];
		});
		r += withMessage(schema, "multipleOf", ({ value, json }) => {
			if (value === 1) {
				if (r.startsWith("z.number().int(")) return;
				return [".int(", ")"];
			}
			return [
				`.multipleOf(${json}`,
				", ",
				")"
			];
		});
		if (typeof schema.minimum === "number") if (schema.exclusiveMinimum === true) r += withMessage(schema, "minimum", ({ json }) => [
			`.gt(${json}`,
			", ",
			")"
		]);
		else r += withMessage(schema, "minimum", ({ json }) => [
			`.gte(${json}`,
			", ",
			")"
		]);
		else if (typeof schema.exclusiveMinimum === "number") r += withMessage(schema, "exclusiveMinimum", ({ json }) => [
			`.gt(${json}`,
			", ",
			")"
		]);
		if (typeof schema.maximum === "number") if (schema.exclusiveMaximum === true) r += withMessage(schema, "maximum", ({ json }) => [
			`.lt(${json}`,
			", ",
			")"
		]);
		else r += withMessage(schema, "maximum", ({ json }) => [
			`.lte(${json}`,
			", ",
			")"
		]);
		else if (typeof schema.exclusiveMaximum === "number") r += withMessage(schema, "exclusiveMaximum", ({ json }) => [
			`.lt(${json}`,
			", ",
			")"
		]);
		return r;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseOneOf.js
var parseOneOf;
var init_parseOneOf = __esmMin((() => {
	init_parseSchema();
	init_objectSpread2();
	parseOneOf = (schema, refs) => {
		return schema.oneOf.length ? schema.oneOf.length === 1 ? parseSchema(schema.oneOf[0], _objectSpread2(_objectSpread2({}, refs), {}, { path: [
			...refs.path,
			"oneOf",
			0
		] })) : `z.any().superRefine((x, ctx) => {
    const schemas = [${schema.oneOf.map((schema, i) => parseSchema(schema, _objectSpread2(_objectSpread2({}, refs), {}, { path: [
			...refs.path,
			"oneOf",
			i
		] }))).join(", ")}];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  })` : "z.any()";
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/utils/jsdocs.js
var expandJsdocs, addJsdocs;
var init_jsdocs = __esmMin((() => {
	expandJsdocs = (jsdocs) => {
		const lines = jsdocs.split("\n");
		return `/**${lines.length === 1 ? lines[0] : `\n${lines.map((x) => `* ${x}`).join("\n")}\n`}*/\n`;
	};
	addJsdocs = (schema, parsed) => {
		const description = schema.description;
		if (!description) return parsed;
		return `\n${expandJsdocs(description)}${parsed}`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseObject.js
function parseObject(objectSchema, refs) {
	let properties = void 0;
	if (objectSchema.properties) if (!Object.keys(objectSchema.properties).length) properties = "z.object({})";
	else {
		properties = "z.object({ ";
		properties += Object.keys(objectSchema.properties).map((key) => {
			const propSchema = objectSchema.properties[key];
			let result = `${JSON.stringify(key)}: ${parseSchema(propSchema, _objectSpread2(_objectSpread2({}, refs), {}, { path: [
				...refs.path,
				"properties",
				key
			] }))}`;
			if (refs.withJsdocs && typeof propSchema === "object") result = addJsdocs(propSchema, result);
			const hasDefault = typeof propSchema === "object" && propSchema.default !== void 0;
			const required = Array.isArray(objectSchema.required) ? objectSchema.required.includes(key) : typeof propSchema === "object" && propSchema.required === true;
			return !hasDefault && !required ? `${result}.optional()` : result;
		}).join(", ");
		properties += " })";
	}
	const additionalProperties = objectSchema.additionalProperties !== void 0 ? parseSchema(objectSchema.additionalProperties, _objectSpread2(_objectSpread2({}, refs), {}, { path: [...refs.path, "additionalProperties"] })) : void 0;
	let patternProperties = void 0;
	if (objectSchema.patternProperties) {
		const parsedPatternProperties = Object.fromEntries(Object.entries(objectSchema.patternProperties).map(([key, value]) => {
			return [key, parseSchema(value, _objectSpread2(_objectSpread2({}, refs), {}, { path: [
				...refs.path,
				"patternProperties",
				key
			] }))];
		}, {}));
		patternProperties = "";
		if (properties) if (additionalProperties) patternProperties += `.catchall(z.union([${[...Object.values(parsedPatternProperties), additionalProperties].join(", ")}]))`;
		else if (Object.keys(parsedPatternProperties).length > 1) patternProperties += `.catchall(z.union([${Object.values(parsedPatternProperties).join(", ")}]))`;
		else patternProperties += `.catchall(${Object.values(parsedPatternProperties)})`;
		else if (additionalProperties) patternProperties += `z.record(z.string(), z.union([${[...Object.values(parsedPatternProperties), additionalProperties].join(", ")}]))`;
		else if (Object.keys(parsedPatternProperties).length > 1) patternProperties += `z.record(z.string(), z.union([${Object.values(parsedPatternProperties).join(", ")}]))`;
		else patternProperties += `z.record(z.string(), ${Object.values(parsedPatternProperties)})`;
		patternProperties += ".superRefine((value, ctx) => {\n";
		patternProperties += "for (const key in value) {\n";
		if (additionalProperties) if (objectSchema.properties) patternProperties += `let evaluated = [${Object.keys(objectSchema.properties).map((key) => JSON.stringify(key)).join(", ")}].includes(key)\n`;
		else patternProperties += `let evaluated = false\n`;
		for (const key in objectSchema.patternProperties) {
			patternProperties += "if (key.match(new RegExp(" + JSON.stringify(key) + "))) {\n";
			if (additionalProperties) patternProperties += "evaluated = true\n";
			patternProperties += "const result = " + parsedPatternProperties[key] + ".safeParse(value[key])\n";
			patternProperties += "if (!result.success) {\n";
			patternProperties += `ctx.addIssue({
          path: [key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`;
			patternProperties += "}\n";
			patternProperties += "}\n";
		}
		if (additionalProperties) {
			patternProperties += "if (!evaluated) {\n";
			patternProperties += "const result = " + additionalProperties + ".safeParse(value[key])\n";
			patternProperties += "if (!result.success) {\n";
			patternProperties += `ctx.addIssue({
          path: [key],
          code: 'custom',
          message: \`Invalid input: must match catchall schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`;
			patternProperties += "}\n";
			patternProperties += "}\n";
		}
		patternProperties += "}\n";
		patternProperties += "})";
	}
	let output = properties ? patternProperties ? properties + patternProperties : additionalProperties ? additionalProperties === "z.never()" ? properties + ".strict()" : properties + `.catchall(${additionalProperties})` : properties : patternProperties ? patternProperties : additionalProperties ? `z.record(z.string(), ${additionalProperties})` : "z.record(z.string(), z.any())";
	if (its.an.anyOf(objectSchema)) output += `.and(${parseAnyOf(_objectSpread2(_objectSpread2({}, objectSchema), {}, { anyOf: objectSchema.anyOf.map((x) => typeof x === "object" && !x.type && (x.properties || x.additionalProperties || x.patternProperties) ? _objectSpread2(_objectSpread2({}, x), {}, { type: "object" }) : x) }), refs)})`;
	if (its.a.oneOf(objectSchema)) output += `.and(${parseOneOf(_objectSpread2(_objectSpread2({}, objectSchema), {}, { oneOf: objectSchema.oneOf.map((x) => typeof x === "object" && !x.type && (x.properties || x.additionalProperties || x.patternProperties) ? _objectSpread2(_objectSpread2({}, x), {}, { type: "object" }) : x) }), refs)})`;
	if (its.an.allOf(objectSchema)) output += `.and(${parseAllOf(_objectSpread2(_objectSpread2({}, objectSchema), {}, { allOf: objectSchema.allOf.map((x) => typeof x === "object" && !x.type && (x.properties || x.additionalProperties || x.patternProperties) ? _objectSpread2(_objectSpread2({}, x), {}, { type: "object" }) : x) }), refs)})`;
	return output;
}
var init_parseObject = __esmMin((() => {
	init_parseAnyOf();
	init_parseOneOf();
	init_parseSchema();
	init_parseAllOf();
	init_jsdocs();
	init_objectSpread2();
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseString.js
var parseString;
var init_parseString = __esmMin((() => {
	init_withMessage();
	init_parseSchema();
	parseString = (schema) => {
		let r = withMessage(schema, "default", () => ["z.string(", ")"]);
		r += withMessage(schema, "format", ({ value }) => {
			switch (value) {
				case "email": return [".email(", ")"];
				case "ip": return [".ip(", ")"];
				case "ipv4": return [
					".ip({ version: \"v4\"",
					", message: ",
					" })"
				];
				case "ipv6": return [
					".ip({ version: \"v6\"",
					", message: ",
					" })"
				];
				case "uri": return [".url(", ")"];
				case "uuid": return [".uuid(", ")"];
				case "date-time": return [
					".datetime({ offset: true",
					", message: ",
					" })"
				];
				case "time": return [".time(", ")"];
				case "date": return [".date(", ")"];
				case "binary": return [".base64(", ")"];
				case "duration": return [".duration(", ")"];
			}
		});
		r += withMessage(schema, "pattern", ({ json }) => [
			`.regex(new RegExp(${json})`,
			", ",
			")"
		]);
		r += withMessage(schema, "minLength", ({ json }) => [
			`.min(${json}`,
			", ",
			")"
		]);
		r += withMessage(schema, "maxLength", ({ json }) => [
			`.max(${json}`,
			", ",
			")"
		]);
		r += withMessage(schema, "contentEncoding", ({ value }) => {
			if (value === "base64") return [".base64(", ")"];
		});
		const contentMediaType = withMessage(schema, "contentMediaType", ({ value }) => {
			if (value === "application/json") return [
				".transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: \"custom\", message: \"Invalid JSON\" }); }}",
				", ",
				")"
			];
		});
		if (contentMediaType != "") {
			r += contentMediaType;
			r += withMessage(schema, "contentSchema", ({ value }) => {
				if (value && value instanceof Object) return [
					`.pipe(${parseSchema(value)}`,
					", ",
					")"
				];
			});
		}
		return r;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/utils/omit.js
var omit;
var init_omit = __esmMin((() => {
	omit = (obj, ...keys) => Object.keys(obj).reduce((acc, key) => {
		if (!keys.includes(key)) acc[key] = obj[key];
		return acc;
	}, {});
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseNullable.js
var parseNullable;
var init_parseNullable = __esmMin((() => {
	init_omit();
	init_parseSchema();
	parseNullable = (schema, refs) => {
		return `${parseSchema(omit(schema, "nullable"), refs, true)}.nullable()`;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/parsers/parseSchema.js
var parseSchema, addDescribes, addDefaults, addAnnotations, selectParser, its;
var init_parseSchema = __esmMin((() => {
	init_parseAnyOf();
	init_parseBoolean();
	init_parseDefault();
	init_parseMultipleType();
	init_parseNot();
	init_parseNull();
	init_parseAllOf();
	init_parseArray();
	init_parseConst();
	init_parseEnum();
	init_parseIfThenElse();
	init_parseNumber();
	init_parseObject();
	init_parseString();
	init_parseOneOf();
	init_parseNullable();
	parseSchema = (schema, refs = {
		seen: /* @__PURE__ */ new Map(),
		path: []
	}, blockMeta) => {
		if (typeof schema !== "object") return schema ? "z.any()" : "z.never()";
		if (refs.parserOverride) {
			const custom = refs.parserOverride(schema, refs);
			if (typeof custom === "string") return custom;
		}
		let seen = refs.seen.get(schema);
		if (seen) {
			if (seen.r !== void 0) return seen.r;
			if (refs.depth === void 0 || seen.n >= refs.depth) return "z.any()";
			seen.n += 1;
		} else {
			seen = {
				r: void 0,
				n: 0
			};
			refs.seen.set(schema, seen);
		}
		let parsed = selectParser(schema, refs);
		if (!blockMeta) {
			if (!refs.withoutDescribes) parsed = addDescribes(schema, parsed);
			if (!refs.withoutDefaults) parsed = addDefaults(schema, parsed);
			parsed = addAnnotations(schema, parsed);
		}
		seen.r = parsed;
		return parsed;
	};
	addDescribes = (schema, parsed) => {
		if (schema.description) parsed += `.describe(${JSON.stringify(schema.description)})`;
		return parsed;
	};
	addDefaults = (schema, parsed) => {
		if (schema.default !== void 0) parsed += `.default(${JSON.stringify(schema.default)})`;
		return parsed;
	};
	addAnnotations = (schema, parsed) => {
		if (schema.readOnly) parsed += ".readonly()";
		return parsed;
	};
	selectParser = (schema, refs) => {
		if (its.a.nullable(schema)) return parseNullable(schema, refs);
		else if (its.an.object(schema)) return parseObject(schema, refs);
		else if (its.an.array(schema)) return parseArray(schema, refs);
		else if (its.an.anyOf(schema)) return parseAnyOf(schema, refs);
		else if (its.an.allOf(schema)) return parseAllOf(schema, refs);
		else if (its.a.oneOf(schema)) return parseOneOf(schema, refs);
		else if (its.a.not(schema)) return parseNot(schema, refs);
		else if (its.an.enum(schema)) return parseEnum(schema);
		else if (its.a.const(schema)) return parseConst(schema);
		else if (its.a.multipleType(schema)) return parseMultipleType(schema, refs);
		else if (its.a.primitive(schema, "string")) return parseString(schema);
		else if (its.a.primitive(schema, "number") || its.a.primitive(schema, "integer")) return parseNumber(schema);
		else if (its.a.primitive(schema, "boolean")) return parseBoolean(schema);
		else if (its.a.primitive(schema, "null")) return parseNull(schema);
		else if (its.a.conditional(schema)) return parseIfThenElse(schema, refs);
		else return parseDefault(schema);
	};
	its = {
		an: {
			object: (x) => x.type === "object",
			array: (x) => x.type === "array",
			anyOf: (x) => x.anyOf !== void 0,
			allOf: (x) => x.allOf !== void 0,
			enum: (x) => x.enum !== void 0
		},
		a: {
			nullable: (x) => x.nullable === true,
			multipleType: (x) => Array.isArray(x.type),
			not: (x) => x.not !== void 0,
			const: (x) => x.const !== void 0,
			primitive: (x, p) => x.type === p,
			conditional: (x) => Boolean("if" in x && x.if && "then" in x && "else" in x && x.then && x.else),
			oneOf: (x) => x.oneOf !== void 0
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/jsonSchemaToZod.js
var _excluded, jsonSchemaToZod;
var init_jsonSchemaToZod = __esmMin((() => {
	init_parseSchema();
	init_jsdocs();
	init_objectWithoutProperties();
	init_objectSpread2();
	_excluded = [
		"module",
		"name",
		"type",
		"noImport"
	];
	jsonSchemaToZod = (schema, _ref = {}) => {
		let { module, name, type, noImport } = _ref, rest = _objectWithoutProperties(_ref, _excluded);
		if (type && (!name || module !== "esm")) throw new Error("Option `type` requires `name` to be set and `module` to be `esm`");
		let result = parseSchema(schema, _objectSpread2({
			module,
			name,
			path: [],
			seen: /* @__PURE__ */ new Map()
		}, rest));
		const jsdocs = rest.withJsdocs && typeof schema !== "boolean" && schema.description ? expandJsdocs(schema.description) : "";
		if (module === "cjs") {
			result = `${jsdocs}module.exports = ${name ? `{ ${JSON.stringify(name)}: ${result} }` : result}
`;
			if (!noImport) result = `${jsdocs}const { z } = require("zod")

${result}`;
		} else if (module === "esm") {
			result = `${jsdocs}export ${name ? `const ${name} =` : `default`} ${result}
`;
			if (!noImport) result = `import { z } from "zod"

${result}`;
		} else if (name) result = `${jsdocs}const ${name} = ${result}`;
		if (type && name) {
			let typeName = typeof type === "string" ? type : `${name[0].toUpperCase()}${name.substring(1)}`;
			result += `export type ${typeName} = z.infer<typeof ${name}>
`;
		}
		return result;
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+json-schema-to-zod@2.6.4/node_modules/@cabloy/json-schema-to-zod/dist/esm/index.js
var esm_default;
var init_esm = __esmMin((() => {
	init_Types();
	init_jsonSchemaToZod();
	init_parseAllOf();
	init_parseAnyOf();
	init_parseArray();
	init_parseBoolean();
	init_parseConst();
	init_parseDefault();
	init_parseEnum();
	init_parseIfThenElse();
	init_parseMultipleType();
	init_parseNot();
	init_parseNull();
	init_parseNullable();
	init_parseNumber();
	init_parseObject();
	init_parseOneOf();
	init_parseSchema();
	init_parseString();
	init_half();
	init_jsdocs();
	init_omit();
	init_withMessage();
	init_jsonSchemaToZod();
	esm_default = jsonSchemaToZod;
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+socket@2.1.6/node_modules/@cabloy/socket/dist/index.js
var socketEventRecord, socketEventRecordReverse, SymbolPerformActionId, SymbolPerformActionRecord, __cabloyEventPrefix, __closeReasonNormal, WebSocketClient;
var init_dist = __esmMin((() => {
	socketEventRecord = {
		sysReady: "_a",
		sysPerformAction: "_b",
		sysPerformActionBack: "_c"
	};
	socketEventRecordReverse = {
		_a: "sysReady",
		_b: "sysPerformAction",
		_c: "sysPerformActionBack"
	};
	SymbolPerformActionId = Symbol("SymbolPerformActionId");
	SymbolPerformActionRecord = Symbol("SymbolPerformActionRecord");
	__cabloyEventPrefix = "_:";
	__closeReasonNormal = "Manual close";
	WebSocketClient = class {
		constructor(options) {
			this[SymbolPerformActionRecord] = {};
			this._ws = void 0;
			this._timeoutRetry = void 0;
			this._reconnectDelay = void 0;
			this._reconnectDelayMax = void 0;
			this._reconnectAttemptsMax = void 0;
			this._reconnectAttempts = 0;
			this.onReady = void 0;
			this.onEvent = void 0;
			this.onFallback = void 0;
			this.onOpen = void 0;
			this.onError = void 0;
			this.onClose = void 0;
			this._reconnectDelay = (options === null || options === void 0 ? void 0 : options.reconnectDelay) || 1e3;
			this._reconnectDelayMax = (options === null || options === void 0 ? void 0 : options.reconnectDelayMax) || 5e3;
			this._reconnectAttemptsMax = (options === null || options === void 0 ? void 0 : options.reconnectAttemptsMax) || Infinity;
		}
		get ws() {
			return this._ws;
		}
		connect(url, protocols) {
			this.disconnect();
			this._connect(url, protocols);
		}
		_connect(url, protocols) {
			const ws = this._ws = new WebSocket(url, protocols);
			const onMessage = (event) => {
				this._parseEvent(event);
			};
			const onOpen = (event) => {
				var _this$onOpen;
				(_this$onOpen = this.onOpen) === null || _this$onOpen === void 0 || _this$onOpen.call(this, event, this._reconnectAttempts);
				this._reconnectAttempts = 0;
			};
			const onError = (event) => {
				var _this$onError;
				(_this$onError = this.onError) === null || _this$onError === void 0 || _this$onError.call(this, event);
			};
			const onClose = (event) => {
				var _this$onClose;
				this._closeEvents();
				this._closeTimeoutRetry();
				ws.removeEventListener("message", onMessage);
				ws.removeEventListener("open", onOpen);
				ws.removeEventListener("error", onError);
				ws.removeEventListener("close", onClose);
				const reconnect = event.reason !== __closeReasonNormal && this._reconnectAttempts < this._reconnectAttemptsMax;
				(_this$onClose = this.onClose) === null || _this$onClose === void 0 || _this$onClose.call(this, event, reconnect);
				if (reconnect) this._startTimeoutRetry(url, protocols);
			};
			ws.addEventListener("message", onMessage);
			ws.addEventListener("open", onOpen);
			ws.addEventListener("error", onError);
			ws.addEventListener("close", onClose);
		}
		_closeTimeoutRetry() {
			if (this._timeoutRetry) {
				clearTimeout(this._timeoutRetry);
				this._timeoutRetry = void 0;
			}
		}
		_startTimeoutRetry(url, protocols) {
			this._closeTimeoutRetry();
			this._reconnectAttempts++;
			const delay = this._reconnectDelay * Math.min(this._reconnectAttempts, this._reconnectDelayMax);
			this._timeoutRetry = setTimeout(() => {
				this.connect(url, protocols);
			}, delay);
		}
		disconnect() {
			if (this._ws) {
				this._ws.close(1e3, __closeReasonNormal);
				this._ws = void 0;
			}
		}
		sendEvent(eventName, data) {
			var _socketEventRecord$ev;
			if (!this._ws) throw new Error("ws closed");
			const eventNameInner = (_socketEventRecord$ev = socketEventRecord[eventName]) !== null && _socketEventRecord$ev !== void 0 ? _socketEventRecord$ev : eventName;
			this._ws.send(__cabloyEventPrefix + JSON.stringify([eventNameInner, data]));
		}
		_parseEvent(event) {
			const data = event.data;
			let packet;
			if (typeof data === "string" && data.startsWith(__cabloyEventPrefix)) {
				var _socketEventRecordRev;
				const packetInner = JSON.parse(data.substring(2));
				packet = [(_socketEventRecordRev = socketEventRecordReverse[packetInner[0]]) !== null && _socketEventRecordRev !== void 0 ? _socketEventRecordRev : packetInner[0], packetInner[1]];
			} else packet = [void 0, data];
			const eventName = packet[0];
			const result = packet[1];
			if (eventName === "sysReady") {
				var _this$onReady;
				(_this$onReady = this.onReady) === null || _this$onReady === void 0 || _this$onReady.call(this);
			} else if (eventName === "sysPerformActionBack") {
				const id = result.i;
				const performActionBack = this[SymbolPerformActionRecord][id];
				delete this[SymbolPerformActionRecord][id];
				if (performActionBack) if (result.c === 0) performActionBack.resolve(result.d);
				else {
					const err = /* @__PURE__ */ new Error();
					err.code = result.c;
					err.message = result.m;
					performActionBack.reject(err);
				}
			} else if (eventName !== void 0) {
				var _this$onEvent;
				(_this$onEvent = this.onEvent) === null || _this$onEvent === void 0 || _this$onEvent.call(this, eventName, result, event);
			} else {
				var _this$onFallback;
				(_this$onFallback = this.onFallback) === null || _this$onFallback === void 0 || _this$onFallback.call(this, event);
			}
			return packet;
		}
		performAction(method, path, options) {
			var _this$SymbolPerformAc;
			const id = ((_this$SymbolPerformAc = this[SymbolPerformActionId]) !== null && _this$SymbolPerformAc !== void 0 ? _this$SymbolPerformAc : 0) + 1;
			this[SymbolPerformActionId] = id;
			return new Promise((resolve, reject) => {
				this[SymbolPerformActionRecord][id] = {
					resolve,
					reject
				};
				const data = {
					i: id,
					m: method,
					p: path,
					q: options === null || options === void 0 ? void 0 : options.query,
					b: options === null || options === void 0 ? void 0 : options.body,
					h: options === null || options === void 0 ? void 0 : options.headers
				};
				this.sendEvent("sysPerformAction", data);
			});
		}
		_closeEvents() {
			const callbacks = this[SymbolPerformActionRecord];
			this[SymbolPerformActionRecord] = {};
			for (const id in callbacks) {
				const callback = callbacks[id];
				const err = /* @__PURE__ */ new Error();
				err.code = 400;
				callback.reject(err);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@cabloy+zod@4.3.6/node_modules/@cabloy/zod/locales/index.js
var init_locales = __esmMin((() => {
	init_locales$1();
}));
//#endregion
export { isPromise as $, compose as A, combineQueries as B, init_zod as C, string$1 as D, object as E, celEnvBase as F, forEachSync as G, evaluateExpressions as H, checkErrorJwtExpired as I, init_dist$10 as J, getProperty$2 as K, checkMeta as L, extend$1 as M, init_dist$9 as N, zh_CN_default as O, catchError as P, isNilOrEmptyString as Q, combineApiPathControllerAndAction as R, translateError as S, external_exports as T, evaluateSimple as U, defaultPathSerializer as V, forEach as W, isEmptyObject as X, isClass as Y, isNil$1 as Z, ZodMetadata$1 as _, init_esm as a, setLocaleAdapter as b, getOnionScenesMeta as c, parseName as d, isUndefined$2 as et, getLocaleText as f, setParseAdapter as g, init_dist$4 as h, esm_default as i, init_wrappers as it, init_dist$8 as j, en_default as k, init_dist$2 as l, init_dist$3 as m, WebSocketClient as n, init_dist$11 as nt, init_dist$1 as o, getText as p, hashkey as q, init_dist as r, defineBoot as rt, swapDeps as s, init_locales as t, matchSelector as tt, parseInfo as u, init_dist$5 as v, zod_default as w, setLocaleErrors as x, init_dist$7 as y, combineParamsAndQuery as z };

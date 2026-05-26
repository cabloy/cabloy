import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
//#region node_modules/.pnpm/@vue+shared@3.5.13/node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.13
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/*! #__NO_SIDE_EFFECTS__ */
/* @__NO_SIDE_EFFECTS__ */
function makeMap$1(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
function normalizeStyle(value) {
	if (isArray$1(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString$1(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) for (const key in normalized) res[key] = normalized[key];
		}
		return res;
	} else if (isString$1(value) || isObject(value)) return value;
}
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString$1(value)) res = value;
	else if (isArray$1(value)) for (let i = 0; i < value.length; i++) {
		const normalized = normalizeClass(value[i]);
		if (normalized) res += normalized + " ";
	}
	else if (isObject(value)) {
		for (const name in value) if (value[name]) res += name + " ";
	}
	return res.trim();
}
function includeBooleanAttr$1(value) {
	return !!value || value === "";
}
var EMPTY_OBJ$1, EMPTY_ARR, NOOP, NO, isOn, isModelListener, extend, remove, hasOwnProperty, hasOwn, isArray$1, isMap, isSet, isRegExp, isFunction, isString$1, isSymbol, isObject, isPromise, objectToString, toTypeString, toRawType, isPlainObject, isIntegerKey, isReservedProp, cacheStringFunction$1, camelizeRE$1, camelize$1, hyphenateRE$1, hyphenate$1, capitalize$1, toHandlerKey$1, hasChanged$1, invokeArrayFns, def, looseToNumber, toNumber, _globalThis, getGlobalThis, listDelimiterRE, propertyDelimiterRE, styleCommentRE, specialBooleanAttrs$1, isSpecialBooleanAttr;
var init_shared_esm_bundler$1 = __esmMin((() => {
	EMPTY_OBJ$1 = {};
	EMPTY_ARR = [];
	NOOP = () => {};
	NO = () => false;
	isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
	isModelListener = (key) => key.startsWith("onUpdate:");
	extend = Object.assign;
	remove = (arr, el) => {
		const i = arr.indexOf(el);
		if (i > -1) arr.splice(i, 1);
	};
	hasOwnProperty = Object.prototype.hasOwnProperty;
	hasOwn = (val, key) => hasOwnProperty.call(val, key);
	isArray$1 = Array.isArray;
	isMap = (val) => toTypeString(val) === "[object Map]";
	isSet = (val) => toTypeString(val) === "[object Set]";
	isRegExp = (val) => toTypeString(val) === "[object RegExp]";
	isFunction = (val) => typeof val === "function";
	isString$1 = (val) => typeof val === "string";
	isSymbol = (val) => typeof val === "symbol";
	isObject = (val) => val !== null && typeof val === "object";
	isPromise = (val) => {
		return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
	};
	objectToString = Object.prototype.toString;
	toTypeString = (value) => objectToString.call(value);
	toRawType = (value) => {
		return toTypeString(value).slice(8, -1);
	};
	isPlainObject = (val) => toTypeString(val) === "[object Object]";
	isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
	isReservedProp = /* @__PURE__ */ makeMap$1(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
	cacheStringFunction$1 = (fn) => {
		const cache = /* @__PURE__ */ Object.create(null);
		return (str) => {
			return cache[str] || (cache[str] = fn(str));
		};
	};
	camelizeRE$1 = /-(\w)/g;
	camelize$1 = cacheStringFunction$1((str) => {
		return str.replace(camelizeRE$1, (_, c) => c ? c.toUpperCase() : "");
	});
	hyphenateRE$1 = /\B([A-Z])/g;
	hyphenate$1 = cacheStringFunction$1((str) => str.replace(hyphenateRE$1, "-$1").toLowerCase());
	capitalize$1 = cacheStringFunction$1((str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});
	toHandlerKey$1 = cacheStringFunction$1((str) => {
		return str ? `on${capitalize$1(str)}` : ``;
	});
	hasChanged$1 = (value, oldValue) => !Object.is(value, oldValue);
	invokeArrayFns = (fns, ...arg) => {
		for (let i = 0; i < fns.length; i++) fns[i](...arg);
	};
	def = (obj, key, value, writable = false) => {
		Object.defineProperty(obj, key, {
			configurable: true,
			enumerable: false,
			writable,
			value
		});
	};
	looseToNumber = (val) => {
		const n = parseFloat(val);
		return isNaN(n) ? val : n;
	};
	toNumber = (val) => {
		const n = isString$1(val) ? Number(val) : NaN;
		return isNaN(n) ? val : n;
	};
	getGlobalThis = () => {
		return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
	};
	listDelimiterRE = /;(?![^(]*\))/g;
	propertyDelimiterRE = /:([^]+)/;
	styleCommentRE = /\/\*[^]*?\*\//g;
	specialBooleanAttrs$1 = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
	isSpecialBooleanAttr = /* @__PURE__ */ makeMap$1(specialBooleanAttrs$1);
	specialBooleanAttrs$1 + "";
}));
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.34/node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/* @__NO_SIDE_EFFECTS__ */
function makeMap(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
function stringifyStyle(styles) {
	if (!styles) return "";
	if (isString(styles)) return styles;
	let ret = "";
	for (const key in styles) {
		const value = styles[key];
		if (isString(value) || typeof value === "number") {
			const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
			ret += `${normalizedKey}:${value};`;
		}
	}
	return ret;
}
function includeBooleanAttr(value) {
	return !!value || value === "";
}
var EMPTY_OBJ, isString, cacheStringFunction, camelizeRE, camelize, hyphenateRE, hyphenate, capitalize, hasChanged, specialBooleanAttrs, isBooleanAttr;
var init_shared_esm_bundler = __esmMin((() => {
	EMPTY_OBJ = {};
	Array.isArray;
	isString = (val) => typeof val === "string";
	cacheStringFunction = (fn) => {
		const cache = /* @__PURE__ */ Object.create(null);
		return ((str) => {
			return cache[str] || (cache[str] = fn(str));
		});
	};
	camelizeRE = /-\w/g;
	camelize = cacheStringFunction((str) => {
		return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
	});
	hyphenateRE = /\B([A-Z])/g;
	hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
	capitalize = cacheStringFunction((str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});
	cacheStringFunction((str) => {
		return str ? `on${capitalize(str)}` : ``;
	});
	hasChanged = (value, oldValue) => !Object.is(value, oldValue);
	specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
	isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
}));
//#endregion
export { isObject as A, looseToNumber as B, init_shared_esm_bundler$1 as C, isIntegerKey as D, isFunction as E, isReservedProp as F, toHandlerKey$1 as G, normalizeClass as H, isSet as I, toNumber as K, isSpecialBooleanAttr as L, isPlainObject as M, isPromise as N, isMap as O, isRegExp as P, isString$1 as R, includeBooleanAttr$1 as S, isArray$1 as T, normalizeStyle as U, makeMap$1 as V, remove as W, extend as _, includeBooleanAttr as a, hasOwn as b, isString as c, EMPTY_OBJ$1 as d, NO as f, def as g, capitalize$1 as h, hyphenate as i, isOn as j, isModelListener as k, stringifyStyle as l, camelize$1 as m, camelize as n, init_shared_esm_bundler as o, NOOP as p, toRawType as q, hasChanged as r, isBooleanAttr as s, EMPTY_OBJ as t, EMPTY_ARR as u, getGlobalThis as v, invokeArrayFns as w, hyphenate$1 as x, hasChanged$1 as y, isSymbol as z };

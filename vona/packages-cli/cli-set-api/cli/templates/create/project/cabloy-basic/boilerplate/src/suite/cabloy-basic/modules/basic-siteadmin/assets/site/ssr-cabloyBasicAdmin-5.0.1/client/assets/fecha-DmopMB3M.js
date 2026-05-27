import { i as __require, n as __esmMin, t as __commonJSMin } from "./rolldown-runtime-lkMnaVCm.js";
import { h as ref } from "./vue-CeNp4lbs.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
//#region node_modules/.pnpm/json5@2.2.3/node_modules/json5/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.JSON5 = factory();
	})(exports, (function() {
		"use strict";
		function createCommonjsModule(fn, module$1) {
			return module$1 = { exports: {} }, fn(module$1, module$1.exports), module$1.exports;
		}
		var _global = createCommonjsModule(function(module$2) {
			var global = module$2.exports = typeof window != "undefined" && window.Math == Math ? window : typeof self != "undefined" && self.Math == Math ? self : Function("return this")();
			if (typeof __g == "number") __g = global;
		});
		var _core = createCommonjsModule(function(module$3) {
			var core = module$3.exports = { version: "2.6.5" };
			if (typeof __e == "number") __e = core;
		});
		_core.version;
		var _isObject = function(it) {
			return typeof it === "object" ? it !== null : typeof it === "function";
		};
		var _anObject = function(it) {
			if (!_isObject(it)) throw TypeError(it + " is not an object!");
			return it;
		};
		var _fails = function(exec) {
			try {
				return !!exec();
			} catch (e) {
				return true;
			}
		};
		var _descriptors = !_fails(function() {
			return Object.defineProperty({}, "a", { get: function() {
				return 7;
			} }).a != 7;
		});
		var document = _global.document;
		var is = _isObject(document) && _isObject(document.createElement);
		var _domCreate = function(it) {
			return is ? document.createElement(it) : {};
		};
		var _ie8DomDefine = !_descriptors && !_fails(function() {
			return Object.defineProperty(_domCreate("div"), "a", { get: function() {
				return 7;
			} }).a != 7;
		});
		var _toPrimitive = function(it, S) {
			if (!_isObject(it)) return it;
			var fn, val;
			if (S && typeof (fn = it.toString) == "function" && !_isObject(val = fn.call(it))) return val;
			if (typeof (fn = it.valueOf) == "function" && !_isObject(val = fn.call(it))) return val;
			if (!S && typeof (fn = it.toString) == "function" && !_isObject(val = fn.call(it))) return val;
			throw TypeError("Can't convert object to primitive value");
		};
		var dP = Object.defineProperty;
		var _objectDp = { f: _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
			_anObject(O);
			P = _toPrimitive(P, true);
			_anObject(Attributes);
			if (_ie8DomDefine) try {
				return dP(O, P, Attributes);
			} catch (e) {}
			if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported!");
			if ("value" in Attributes) O[P] = Attributes.value;
			return O;
		} };
		var _propertyDesc = function(bitmap, value) {
			return {
				enumerable: !(bitmap & 1),
				configurable: !(bitmap & 2),
				writable: !(bitmap & 4),
				value
			};
		};
		var _hide = _descriptors ? function(object, key, value) {
			return _objectDp.f(object, key, _propertyDesc(1, value));
		} : function(object, key, value) {
			object[key] = value;
			return object;
		};
		var hasOwnProperty = {}.hasOwnProperty;
		var _has = function(it, key) {
			return hasOwnProperty.call(it, key);
		};
		var id = 0;
		var px = Math.random();
		var _uid = function(key) {
			return "Symbol(".concat(key === void 0 ? "" : key, ")_", (++id + px).toString(36));
		};
		var _library = false;
		var _functionToString = createCommonjsModule(function(module$4) {
			var SHARED = "__core-js_shared__";
			var store = _global[SHARED] || (_global[SHARED] = {});
			(module$4.exports = function(key, value) {
				return store[key] || (store[key] = value !== void 0 ? value : {});
			})("versions", []).push({
				version: _core.version,
				mode: _library ? "pure" : "global",
				copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
			});
		})("native-function-to-string", Function.toString);
		var _redefine = createCommonjsModule(function(module$5) {
			var SRC = _uid("src");
			var TO_STRING = "toString";
			var TPL = ("" + _functionToString).split(TO_STRING);
			_core.inspectSource = function(it) {
				return _functionToString.call(it);
			};
			(module$5.exports = function(O, key, val, safe) {
				var isFunction = typeof val == "function";
				if (isFunction) _has(val, "name") || _hide(val, "name", key);
				if (O[key] === val) return;
				if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? "" + O[key] : TPL.join(String(key)));
				if (O === _global) O[key] = val;
				else if (!safe) {
					delete O[key];
					_hide(O, key, val);
				} else if (O[key]) O[key] = val;
				else _hide(O, key, val);
			})(Function.prototype, TO_STRING, function toString() {
				return typeof this == "function" && this[SRC] || _functionToString.call(this);
			});
		});
		var _aFunction = function(it) {
			if (typeof it != "function") throw TypeError(it + " is not a function!");
			return it;
		};
		var _ctx = function(fn, that, length) {
			_aFunction(fn);
			if (that === void 0) return fn;
			switch (length) {
				case 1: return function(a) {
					return fn.call(that, a);
				};
				case 2: return function(a, b) {
					return fn.call(that, a, b);
				};
				case 3: return function(a, b, c) {
					return fn.call(that, a, b, c);
				};
			}
			return function() {
				return fn.apply(that, arguments);
			};
		};
		var PROTOTYPE = "prototype";
		var $export = function(type, name, source) {
			var IS_FORCED = type & $export.F;
			var IS_GLOBAL = type & $export.G;
			var IS_STATIC = type & $export.S;
			var IS_PROTO = type & $export.P;
			var IS_BIND = type & $export.B;
			var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
			var exports$1 = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
			var expProto = exports$1[PROTOTYPE] || (exports$1[PROTOTYPE] = {});
			var key, own, out, exp;
			if (IS_GLOBAL) source = name;
			for (key in source) {
				own = !IS_FORCED && target && target[key] !== void 0;
				out = (own ? target : source)[key];
				exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == "function" ? _ctx(Function.call, out) : out;
				if (target) _redefine(target, key, out, type & $export.U);
				if (exports$1[key] != out) _hide(exports$1, key, exp);
				if (IS_PROTO && expProto[key] != out) expProto[key] = out;
			}
		};
		_global.core = _core;
		$export.F = 1;
		$export.G = 2;
		$export.S = 4;
		$export.P = 8;
		$export.B = 16;
		$export.W = 32;
		$export.U = 64;
		$export.R = 128;
		var _export = $export;
		var ceil = Math.ceil;
		var floor = Math.floor;
		var _toInteger = function(it) {
			return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
		};
		var _defined = function(it) {
			if (it == void 0) throw TypeError("Can't call method on  " + it);
			return it;
		};
		var _stringAt = function(TO_STRING) {
			return function(that, pos) {
				var s = String(_defined(that));
				var i = _toInteger(pos);
				var l = s.length;
				var a, b;
				if (i < 0 || i >= l) return TO_STRING ? "" : void 0;
				a = s.charCodeAt(i);
				return a < 55296 || a > 56319 || i + 1 === l || (b = s.charCodeAt(i + 1)) < 56320 || b > 57343 ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 55296 << 10) + (b - 56320) + 65536;
			};
		};
		var $at = _stringAt(false);
		_export(_export.P, "String", { codePointAt: function codePointAt(pos) {
			return $at(this, pos);
		} });
		_core.String.codePointAt;
		var max = Math.max;
		var min = Math.min;
		var _toAbsoluteIndex = function(index, length) {
			index = _toInteger(index);
			return index < 0 ? max(index + length, 0) : min(index, length);
		};
		var fromCharCode = String.fromCharCode;
		var $fromCodePoint = String.fromCodePoint;
		_export(_export.S + _export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), "String", { fromCodePoint: function fromCodePoint(x) {
			var arguments$1 = arguments;
			var res = [];
			var aLen = arguments.length;
			var i = 0;
			var code;
			while (aLen > i) {
				code = +arguments$1[i++];
				if (_toAbsoluteIndex(code, 1114111) !== code) throw RangeError(code + " is not a valid code point");
				res.push(code < 65536 ? fromCharCode(code) : fromCharCode(((code -= 65536) >> 10) + 55296, code % 1024 + 56320));
			}
			return res.join("");
		} });
		_core.String.fromCodePoint;
		var unicode = {
			Space_Separator: /[\u1680\u2000-\u200A\u202F\u205F\u3000]/,
			ID_Start: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/,
			ID_Continue: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
		};
		var util = {
			isSpaceSeparator: function isSpaceSeparator(c) {
				return typeof c === "string" && unicode.Space_Separator.test(c);
			},
			isIdStartChar: function isIdStartChar(c) {
				return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
			},
			isIdContinueChar: function isIdContinueChar(c) {
				return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "‌" || c === "‍" || unicode.ID_Continue.test(c));
			},
			isDigit: function isDigit(c) {
				return typeof c === "string" && /[0-9]/.test(c);
			},
			isHexDigit: function isHexDigit(c) {
				return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
			}
		};
		var source;
		var parseState;
		var stack;
		var pos;
		var line;
		var column;
		var token;
		var key;
		var root;
		var parse = function parse(text, reviver) {
			source = String(text);
			parseState = "start";
			stack = [];
			pos = 0;
			line = 1;
			column = 0;
			token = void 0;
			key = void 0;
			root = void 0;
			do {
				token = lex();
				parseStates[parseState]();
			} while (token.type !== "eof");
			if (typeof reviver === "function") return internalize({ "": root }, "", reviver);
			return root;
		};
		function internalize(holder, name, reviver) {
			var value = holder[name];
			if (value != null && typeof value === "object") if (Array.isArray(value)) for (var i = 0; i < value.length; i++) {
				var key = String(i);
				var replacement = internalize(value, key, reviver);
				if (replacement === void 0) delete value[key];
				else Object.defineProperty(value, key, {
					value: replacement,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
			else for (var key$1 in value) {
				var replacement$1 = internalize(value, key$1, reviver);
				if (replacement$1 === void 0) delete value[key$1];
				else Object.defineProperty(value, key$1, {
					value: replacement$1,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
			return reviver.call(holder, name, value);
		}
		var lexState;
		var buffer;
		var doubleQuote;
		var sign;
		var c;
		function lex() {
			lexState = "default";
			buffer = "";
			doubleQuote = false;
			sign = 1;
			for (;;) {
				c = peek();
				var token = lexStates[lexState]();
				if (token) return token;
			}
		}
		function peek() {
			if (source[pos]) return String.fromCodePoint(source.codePointAt(pos));
		}
		function read() {
			var c = peek();
			if (c === "\n") {
				line++;
				column = 0;
			} else if (c) column += c.length;
			else column++;
			if (c) pos += c.length;
			return c;
		}
		var lexStates = {
			default: function default$1() {
				switch (c) {
					case "	":
					case "\v":
					case "\f":
					case " ":
					case "\xA0":
					case "﻿":
					case "\n":
					case "\r":
					case "\u2028":
					case "\u2029":
						read();
						return;
					case "/":
						read();
						lexState = "comment";
						return;
					case void 0:
						read();
						return newToken("eof");
				}
				if (util.isSpaceSeparator(c)) {
					read();
					return;
				}
				return lexStates[parseState]();
			},
			comment: function comment() {
				switch (c) {
					case "*":
						read();
						lexState = "multiLineComment";
						return;
					case "/":
						read();
						lexState = "singleLineComment";
						return;
				}
				throw invalidChar(read());
			},
			multiLineComment: function multiLineComment() {
				switch (c) {
					case "*":
						read();
						lexState = "multiLineCommentAsterisk";
						return;
					case void 0: throw invalidChar(read());
				}
				read();
			},
			multiLineCommentAsterisk: function multiLineCommentAsterisk() {
				switch (c) {
					case "*":
						read();
						return;
					case "/":
						read();
						lexState = "default";
						return;
					case void 0: throw invalidChar(read());
				}
				read();
				lexState = "multiLineComment";
			},
			singleLineComment: function singleLineComment() {
				switch (c) {
					case "\n":
					case "\r":
					case "\u2028":
					case "\u2029":
						read();
						lexState = "default";
						return;
					case void 0:
						read();
						return newToken("eof");
				}
				read();
			},
			value: function value() {
				switch (c) {
					case "{":
					case "[": return newToken("punctuator", read());
					case "n":
						read();
						literal("ull");
						return newToken("null", null);
					case "t":
						read();
						literal("rue");
						return newToken("boolean", true);
					case "f":
						read();
						literal("alse");
						return newToken("boolean", false);
					case "-":
					case "+":
						if (read() === "-") sign = -1;
						lexState = "sign";
						return;
					case ".":
						buffer = read();
						lexState = "decimalPointLeading";
						return;
					case "0":
						buffer = read();
						lexState = "zero";
						return;
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						buffer = read();
						lexState = "decimalInteger";
						return;
					case "I":
						read();
						literal("nfinity");
						return newToken("numeric", Infinity);
					case "N":
						read();
						literal("aN");
						return newToken("numeric", NaN);
					case "\"":
					case "'":
						doubleQuote = read() === "\"";
						buffer = "";
						lexState = "string";
						return;
				}
				throw invalidChar(read());
			},
			identifierNameStartEscape: function identifierNameStartEscape() {
				if (c !== "u") throw invalidChar(read());
				read();
				var u = unicodeEscape();
				switch (u) {
					case "$":
					case "_": break;
					default:
						if (!util.isIdStartChar(u)) throw invalidIdentifier();
						break;
				}
				buffer += u;
				lexState = "identifierName";
			},
			identifierName: function identifierName() {
				switch (c) {
					case "$":
					case "_":
					case "‌":
					case "‍":
						buffer += read();
						return;
					case "\\":
						read();
						lexState = "identifierNameEscape";
						return;
				}
				if (util.isIdContinueChar(c)) {
					buffer += read();
					return;
				}
				return newToken("identifier", buffer);
			},
			identifierNameEscape: function identifierNameEscape() {
				if (c !== "u") throw invalidChar(read());
				read();
				var u = unicodeEscape();
				switch (u) {
					case "$":
					case "_":
					case "‌":
					case "‍": break;
					default:
						if (!util.isIdContinueChar(u)) throw invalidIdentifier();
						break;
				}
				buffer += u;
				lexState = "identifierName";
			},
			sign: function sign$1() {
				switch (c) {
					case ".":
						buffer = read();
						lexState = "decimalPointLeading";
						return;
					case "0":
						buffer = read();
						lexState = "zero";
						return;
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						buffer = read();
						lexState = "decimalInteger";
						return;
					case "I":
						read();
						literal("nfinity");
						return newToken("numeric", sign * Infinity);
					case "N":
						read();
						literal("aN");
						return newToken("numeric", NaN);
				}
				throw invalidChar(read());
			},
			zero: function zero() {
				switch (c) {
					case ".":
						buffer += read();
						lexState = "decimalPoint";
						return;
					case "e":
					case "E":
						buffer += read();
						lexState = "decimalExponent";
						return;
					case "x":
					case "X":
						buffer += read();
						lexState = "hexadecimal";
						return;
				}
				return newToken("numeric", sign * 0);
			},
			decimalInteger: function decimalInteger() {
				switch (c) {
					case ".":
						buffer += read();
						lexState = "decimalPoint";
						return;
					case "e":
					case "E":
						buffer += read();
						lexState = "decimalExponent";
						return;
				}
				if (util.isDigit(c)) {
					buffer += read();
					return;
				}
				return newToken("numeric", sign * Number(buffer));
			},
			decimalPointLeading: function decimalPointLeading() {
				if (util.isDigit(c)) {
					buffer += read();
					lexState = "decimalFraction";
					return;
				}
				throw invalidChar(read());
			},
			decimalPoint: function decimalPoint() {
				switch (c) {
					case "e":
					case "E":
						buffer += read();
						lexState = "decimalExponent";
						return;
				}
				if (util.isDigit(c)) {
					buffer += read();
					lexState = "decimalFraction";
					return;
				}
				return newToken("numeric", sign * Number(buffer));
			},
			decimalFraction: function decimalFraction() {
				switch (c) {
					case "e":
					case "E":
						buffer += read();
						lexState = "decimalExponent";
						return;
				}
				if (util.isDigit(c)) {
					buffer += read();
					return;
				}
				return newToken("numeric", sign * Number(buffer));
			},
			decimalExponent: function decimalExponent() {
				switch (c) {
					case "+":
					case "-":
						buffer += read();
						lexState = "decimalExponentSign";
						return;
				}
				if (util.isDigit(c)) {
					buffer += read();
					lexState = "decimalExponentInteger";
					return;
				}
				throw invalidChar(read());
			},
			decimalExponentSign: function decimalExponentSign() {
				if (util.isDigit(c)) {
					buffer += read();
					lexState = "decimalExponentInteger";
					return;
				}
				throw invalidChar(read());
			},
			decimalExponentInteger: function decimalExponentInteger() {
				if (util.isDigit(c)) {
					buffer += read();
					return;
				}
				return newToken("numeric", sign * Number(buffer));
			},
			hexadecimal: function hexadecimal() {
				if (util.isHexDigit(c)) {
					buffer += read();
					lexState = "hexadecimalInteger";
					return;
				}
				throw invalidChar(read());
			},
			hexadecimalInteger: function hexadecimalInteger() {
				if (util.isHexDigit(c)) {
					buffer += read();
					return;
				}
				return newToken("numeric", sign * Number(buffer));
			},
			string: function string() {
				switch (c) {
					case "\\":
						read();
						buffer += escape();
						return;
					case "\"":
						if (doubleQuote) {
							read();
							return newToken("string", buffer);
						}
						buffer += read();
						return;
					case "'":
						if (!doubleQuote) {
							read();
							return newToken("string", buffer);
						}
						buffer += read();
						return;
					case "\n":
					case "\r": throw invalidChar(read());
					case "\u2028":
					case "\u2029":
						separatorChar(c);
						break;
					case void 0: throw invalidChar(read());
				}
				buffer += read();
			},
			start: function start() {
				switch (c) {
					case "{":
					case "[": return newToken("punctuator", read());
				}
				lexState = "value";
			},
			beforePropertyName: function beforePropertyName() {
				switch (c) {
					case "$":
					case "_":
						buffer = read();
						lexState = "identifierName";
						return;
					case "\\":
						read();
						lexState = "identifierNameStartEscape";
						return;
					case "}": return newToken("punctuator", read());
					case "\"":
					case "'":
						doubleQuote = read() === "\"";
						lexState = "string";
						return;
				}
				if (util.isIdStartChar(c)) {
					buffer += read();
					lexState = "identifierName";
					return;
				}
				throw invalidChar(read());
			},
			afterPropertyName: function afterPropertyName() {
				if (c === ":") return newToken("punctuator", read());
				throw invalidChar(read());
			},
			beforePropertyValue: function beforePropertyValue() {
				lexState = "value";
			},
			afterPropertyValue: function afterPropertyValue() {
				switch (c) {
					case ",":
					case "}": return newToken("punctuator", read());
				}
				throw invalidChar(read());
			},
			beforeArrayValue: function beforeArrayValue() {
				if (c === "]") return newToken("punctuator", read());
				lexState = "value";
			},
			afterArrayValue: function afterArrayValue() {
				switch (c) {
					case ",":
					case "]": return newToken("punctuator", read());
				}
				throw invalidChar(read());
			},
			end: function end() {
				throw invalidChar(read());
			}
		};
		function newToken(type, value) {
			return {
				type,
				value,
				line,
				column
			};
		}
		function literal(s) {
			for (var i = 0, list = s; i < list.length; i += 1) {
				var c = list[i];
				if (peek() !== c) throw invalidChar(read());
				read();
			}
		}
		function escape() {
			switch (peek()) {
				case "b":
					read();
					return "\b";
				case "f":
					read();
					return "\f";
				case "n":
					read();
					return "\n";
				case "r":
					read();
					return "\r";
				case "t":
					read();
					return "	";
				case "v":
					read();
					return "\v";
				case "0":
					read();
					if (util.isDigit(peek())) throw invalidChar(read());
					return "\0";
				case "x":
					read();
					return hexEscape();
				case "u":
					read();
					return unicodeEscape();
				case "\n":
				case "\u2028":
				case "\u2029":
					read();
					return "";
				case "\r":
					read();
					if (peek() === "\n") read();
					return "";
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9": throw invalidChar(read());
				case void 0: throw invalidChar(read());
			}
			return read();
		}
		function hexEscape() {
			var buffer = "";
			var c = peek();
			if (!util.isHexDigit(c)) throw invalidChar(read());
			buffer += read();
			c = peek();
			if (!util.isHexDigit(c)) throw invalidChar(read());
			buffer += read();
			return String.fromCodePoint(parseInt(buffer, 16));
		}
		function unicodeEscape() {
			var buffer = "";
			var count = 4;
			while (count-- > 0) {
				var c = peek();
				if (!util.isHexDigit(c)) throw invalidChar(read());
				buffer += read();
			}
			return String.fromCodePoint(parseInt(buffer, 16));
		}
		var parseStates = {
			start: function start() {
				if (token.type === "eof") throw invalidEOF();
				push();
			},
			beforePropertyName: function beforePropertyName() {
				switch (token.type) {
					case "identifier":
					case "string":
						key = token.value;
						parseState = "afterPropertyName";
						return;
					case "punctuator":
						pop();
						return;
					case "eof": throw invalidEOF();
				}
			},
			afterPropertyName: function afterPropertyName() {
				if (token.type === "eof") throw invalidEOF();
				parseState = "beforePropertyValue";
			},
			beforePropertyValue: function beforePropertyValue() {
				if (token.type === "eof") throw invalidEOF();
				push();
			},
			beforeArrayValue: function beforeArrayValue() {
				if (token.type === "eof") throw invalidEOF();
				if (token.type === "punctuator" && token.value === "]") {
					pop();
					return;
				}
				push();
			},
			afterPropertyValue: function afterPropertyValue() {
				if (token.type === "eof") throw invalidEOF();
				switch (token.value) {
					case ",":
						parseState = "beforePropertyName";
						return;
					case "}": pop();
				}
			},
			afterArrayValue: function afterArrayValue() {
				if (token.type === "eof") throw invalidEOF();
				switch (token.value) {
					case ",":
						parseState = "beforeArrayValue";
						return;
					case "]": pop();
				}
			},
			end: function end() {}
		};
		function push() {
			var value;
			switch (token.type) {
				case "punctuator":
					switch (token.value) {
						case "{":
							value = {};
							break;
						case "[":
							value = [];
							break;
					}
					break;
				case "null":
				case "boolean":
				case "numeric":
				case "string":
					value = token.value;
					break;
			}
			if (root === void 0) root = value;
			else {
				var parent = stack[stack.length - 1];
				if (Array.isArray(parent)) parent.push(value);
				else Object.defineProperty(parent, key, {
					value,
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
			if (value !== null && typeof value === "object") {
				stack.push(value);
				if (Array.isArray(value)) parseState = "beforeArrayValue";
				else parseState = "beforePropertyName";
			} else {
				var current = stack[stack.length - 1];
				if (current == null) parseState = "end";
				else if (Array.isArray(current)) parseState = "afterArrayValue";
				else parseState = "afterPropertyValue";
			}
		}
		function pop() {
			stack.pop();
			var current = stack[stack.length - 1];
			if (current == null) parseState = "end";
			else if (Array.isArray(current)) parseState = "afterArrayValue";
			else parseState = "afterPropertyValue";
		}
		function invalidChar(c) {
			if (c === void 0) return syntaxError("JSON5: invalid end of input at " + line + ":" + column);
			return syntaxError("JSON5: invalid character '" + formatChar(c) + "' at " + line + ":" + column);
		}
		function invalidEOF() {
			return syntaxError("JSON5: invalid end of input at " + line + ":" + column);
		}
		function invalidIdentifier() {
			column -= 5;
			return syntaxError("JSON5: invalid identifier character at " + line + ":" + column);
		}
		function separatorChar(c) {
			console.warn("JSON5: '" + formatChar(c) + "' in strings is not valid ECMAScript; consider escaping");
		}
		function formatChar(c) {
			var replacements = {
				"'": "\\'",
				"\"": "\\\"",
				"\\": "\\\\",
				"\b": "\\b",
				"\f": "\\f",
				"\n": "\\n",
				"\r": "\\r",
				"	": "\\t",
				"\v": "\\v",
				"\0": "\\0",
				"\u2028": "\\u2028",
				"\u2029": "\\u2029"
			};
			if (replacements[c]) return replacements[c];
			if (c < " ") {
				var hexString = c.charCodeAt(0).toString(16);
				return "\\x" + ("00" + hexString).substring(hexString.length);
			}
			return c;
		}
		function syntaxError(message) {
			var err = new SyntaxError(message);
			err.lineNumber = line;
			err.columnNumber = column;
			return err;
		}
		return {
			parse,
			stringify: function stringify(value, replacer, space) {
				var stack = [];
				var indent = "";
				var propertyList;
				var replacerFunc;
				var gap = "";
				var quote;
				if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
					space = replacer.space;
					quote = replacer.quote;
					replacer = replacer.replacer;
				}
				if (typeof replacer === "function") replacerFunc = replacer;
				else if (Array.isArray(replacer)) {
					propertyList = [];
					for (var i = 0, list = replacer; i < list.length; i += 1) {
						var v = list[i];
						var item = void 0;
						if (typeof v === "string") item = v;
						else if (typeof v === "number" || v instanceof String || v instanceof Number) item = String(v);
						if (item !== void 0 && propertyList.indexOf(item) < 0) propertyList.push(item);
					}
				}
				if (space instanceof Number) space = Number(space);
				else if (space instanceof String) space = String(space);
				if (typeof space === "number") {
					if (space > 0) {
						space = Math.min(10, Math.floor(space));
						gap = "          ".substr(0, space);
					}
				} else if (typeof space === "string") gap = space.substr(0, 10);
				return serializeProperty("", { "": value });
				function serializeProperty(key, holder) {
					var value = holder[key];
					if (value != null) {
						if (typeof value.toJSON5 === "function") value = value.toJSON5(key);
						else if (typeof value.toJSON === "function") value = value.toJSON(key);
					}
					if (replacerFunc) value = replacerFunc.call(holder, key, value);
					if (value instanceof Number) value = Number(value);
					else if (value instanceof String) value = String(value);
					else if (value instanceof Boolean) value = value.valueOf();
					switch (value) {
						case null: return "null";
						case true: return "true";
						case false: return "false";
					}
					if (typeof value === "string") return quoteString(value, false);
					if (typeof value === "number") return String(value);
					if (typeof value === "object") return Array.isArray(value) ? serializeArray(value) : serializeObject(value);
				}
				function quoteString(value) {
					var quotes = {
						"'": .1,
						"\"": .2
					};
					var replacements = {
						"'": "\\'",
						"\"": "\\\"",
						"\\": "\\\\",
						"\b": "\\b",
						"\f": "\\f",
						"\n": "\\n",
						"\r": "\\r",
						"	": "\\t",
						"\v": "\\v",
						"\0": "\\0",
						"\u2028": "\\u2028",
						"\u2029": "\\u2029"
					};
					var product = "";
					for (var i = 0; i < value.length; i++) {
						var c = value[i];
						switch (c) {
							case "'":
							case "\"":
								quotes[c]++;
								product += c;
								continue;
							case "\0": if (util.isDigit(value[i + 1])) {
								product += "\\x00";
								continue;
							}
						}
						if (replacements[c]) {
							product += replacements[c];
							continue;
						}
						if (c < " ") {
							var hexString = c.charCodeAt(0).toString(16);
							product += "\\x" + ("00" + hexString).substring(hexString.length);
							continue;
						}
						product += c;
					}
					var quoteChar = quote || Object.keys(quotes).reduce(function(a, b) {
						return quotes[a] < quotes[b] ? a : b;
					});
					product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
					return quoteChar + product + quoteChar;
				}
				function serializeObject(value) {
					if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
					stack.push(value);
					var stepback = indent;
					indent = indent + gap;
					var keys = propertyList || Object.keys(value);
					var partial = [];
					for (var i = 0, list = keys; i < list.length; i += 1) {
						var key = list[i];
						var propertyString = serializeProperty(key, value);
						if (propertyString !== void 0) {
							var member = serializeKey(key) + ":";
							if (gap !== "") member += " ";
							member += propertyString;
							partial.push(member);
						}
					}
					var final;
					if (partial.length === 0) final = "{}";
					else {
						var properties;
						if (gap === "") {
							properties = partial.join(",");
							final = "{" + properties + "}";
						} else {
							var separator = ",\n" + indent;
							properties = partial.join(separator);
							final = "{\n" + indent + properties + ",\n" + stepback + "}";
						}
					}
					stack.pop();
					indent = stepback;
					return final;
				}
				function serializeKey(key) {
					if (key.length === 0) return quoteString(key, true);
					var firstChar = String.fromCodePoint(key.codePointAt(0));
					if (!util.isIdStartChar(firstChar)) return quoteString(key, true);
					for (var i = firstChar.length; i < key.length; i++) if (!util.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) return quoteString(key, true);
					return key;
				}
				function serializeArray(value) {
					if (stack.indexOf(value) >= 0) throw TypeError("Converting circular structure to JSON5");
					stack.push(value);
					var stepback = indent;
					indent = indent + gap;
					var partial = [];
					for (var i = 0; i < value.length; i++) {
						var propertyString = serializeProperty(String(i), value);
						partial.push(propertyString !== void 0 ? propertyString : "null");
					}
					var final;
					if (partial.length === 0) final = "[]";
					else if (gap === "") final = "[" + partial.join(",") + "]";
					else {
						var separator = ",\n" + indent;
						var properties$1 = partial.join(separator);
						final = "[\n" + indent + properties$1 + ",\n" + stepback + "]";
					}
					stack.pop();
					indent = stepback;
					return final;
				}
			}
		};
	}));
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/checkPrivateRedeclaration.js
function _checkPrivateRedeclaration(e, t) {
	if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
var init_checkPrivateRedeclaration = __esmMin((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/classPrivateFieldInitSpec.js
function _classPrivateFieldInitSpec(e, t, a) {
	_checkPrivateRedeclaration(e, t), t.set(e, a);
}
var init_classPrivateFieldInitSpec = __esmMin((() => {
	init_checkPrivateRedeclaration();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/assertClassBrand.js
function _assertClassBrand(e, t, n) {
	if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
	throw new TypeError("Private element is not present on this object");
}
var init_assertClassBrand = __esmMin((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/classPrivateFieldSet2.js
function _classPrivateFieldSet2(s, a, r) {
	return s.set(_assertClassBrand(s, a), r), r;
}
var init_classPrivateFieldSet2 = __esmMin((() => {
	init_assertClassBrand();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/classPrivateFieldGet2.js
function _classPrivateFieldGet2(s, a) {
	return s.get(_assertClassBrand(s, a));
}
var init_classPrivateFieldGet2 = __esmMin((() => {
	init_assertClassBrand();
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/errors.js
function normalizeArgs(name, defaultCode, message, node, cause) {
	if (typeof message === "string") return {
		name,
		code: defaultCode,
		message,
		node,
		cause
	};
	const opts = message;
	if (typeof opts !== "object") throw new Error("First param to error must be a string or object");
	return {
		name,
		code: opts.code || defaultCode,
		message: opts.message,
		node: opts.node,
		cause: opts.cause,
		range: opts.range
	};
}
function parseError(code, message, node) {
	if (typeof code === "object") return new ParseError(code);
	return new ParseError({
		code,
		message,
		node
	});
}
function evaluationError(code, message, node) {
	if (typeof code === "object") return new EvaluationError(code);
	return new EvaluationError({
		code,
		message,
		node
	});
}
function typeError(code, message, node) {
	if (typeof code === "object") return new TypeError$1(code);
	return new TypeError$1({
		code,
		message,
		node
	});
}
function normalizeRange(node) {
	var _node$pos;
	const start = (_node$pos = node === null || node === void 0 ? void 0 : node.pos) !== null && _node$pos !== void 0 ? _node$pos : node === null || node === void 0 ? void 0 : node.start;
	if (typeof start !== "number") return;
	return {
		start,
		end: typeof node.end === "number" ? node.end : start
	};
}
function formatErrorWithHighlight(message, node, range) {
	var _node$pos2;
	const pos = (_node$pos2 = node.pos) !== null && _node$pos2 !== void 0 ? _node$pos2 : range === null || range === void 0 ? void 0 : range.start;
	if (typeof pos !== "number") return message;
	const input = node.input;
	let lineNum = 1;
	let currentPos = 0;
	let columnNum = 0;
	while (currentPos < pos) {
		if (input[currentPos] === "\n") {
			lineNum++;
			columnNum = 0;
		} else columnNum++;
		currentPos++;
	}
	let contextStart = pos;
	let contextEnd = pos;
	while (contextStart > 0 && input[contextStart - 1] !== "\n") contextStart--;
	while (contextEnd < input.length && input[contextEnd] !== "\n") contextEnd++;
	const line = input.slice(contextStart, contextEnd);
	return `${message}\n\n${`> ${`${lineNum}`.padStart(4, " ")} | ${line}\n${" ".repeat(9 + columnNum)}^`}`;
}
function attachErrorAst(error, node) {
	if (error instanceof CelError) return error.withAst(node);
	return error;
}
var _node$1, _code, _range, _summary, CelError, ParseError, EvaluationError, TypeError$1;
var init_errors = __esmMin((() => {
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	_node$1 = /* @__PURE__ */ new WeakMap();
	_code = /* @__PURE__ */ new WeakMap();
	_range = /* @__PURE__ */ new WeakMap();
	_summary = /* @__PURE__ */ new WeakMap();
	CelError = class extends Error {
		constructor({ name, code, message, node, cause, range }) {
			super(message, cause ? { cause } : void 0);
			_classPrivateFieldInitSpec(this, _node$1, void 0);
			_classPrivateFieldInitSpec(this, _code, void 0);
			_classPrivateFieldInitSpec(this, _range, void 0);
			_classPrivateFieldInitSpec(this, _summary, void 0);
			this.name = name;
			_classPrivateFieldSet2(_code, this, code);
			_classPrivateFieldSet2(_summary, this, message);
			_classPrivateFieldSet2(_node$1, this, node);
			_classPrivateFieldSet2(_range, this, range && normalizeRange(range) || normalizeRange(node));
			if (!(node === null || node === void 0 ? void 0 : node.input)) return;
			this.message = formatErrorWithHighlight(_classPrivateFieldGet2(_summary, this), node, _classPrivateFieldGet2(_range, this));
		}
		get node() {
			return _classPrivateFieldGet2(_node$1, this);
		}
		get code() {
			return _classPrivateFieldGet2(_code, this);
		}
		get range() {
			return _classPrivateFieldGet2(_range, this);
		}
		get summary() {
			return _classPrivateFieldGet2(_summary, this);
		}
		withAst(node) {
			var _classPrivateFieldGet2$2;
			if (_classPrivateFieldGet2(_node$1, this) || !(node === null || node === void 0 ? void 0 : node.input)) return this;
			_classPrivateFieldSet2(_node$1, this, node);
			(_classPrivateFieldGet2$2 = _classPrivateFieldGet2(_range, this)) !== null && _classPrivateFieldGet2$2 !== void 0 || _classPrivateFieldSet2(_range, this, normalizeRange(node));
			this.message = formatErrorWithHighlight(_classPrivateFieldGet2(_summary, this), node, _classPrivateFieldGet2(_range, this));
			return this;
		}
	};
	ParseError = class extends CelError {
		constructor(message, node, cause) {
			super(normalizeArgs("ParseError", "parse_error", message, node, cause));
		}
	};
	EvaluationError = class extends CelError {
		constructor(message, node, cause) {
			super(normalizeArgs("EvaluationError", "evaluation_error", message, node, cause));
		}
	};
	TypeError$1 = class extends CelError {
		constructor(message, node, cause) {
			super(normalizeArgs("TypeError", "type_error", message, node, cause));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/optional.js
function toggleOptionalTypes(registry, enable) {
	const optionalConstant = enable ? optionalNamespace : void 0;
	registry.deleteVariable("optional");
	registry.registerConstant("optional", "OptionalNamespace", optionalConstant);
}
function register(registry) {
	const sync = { async: false };
	const functionOverload = (sig, handler) => registry.registerFunctionOverload(sig, handler, sync);
	const optionalConstant = registry.enableOptionalTypes ? optionalNamespace : void 0;
	registry.registerType("OptionalNamespace", OptionalNamespace);
	registry.registerConstant("optional", "OptionalNamespace", optionalConstant);
	functionOverload("optional.hasValue(): bool", (v) => v.hasValue());
	functionOverload("optional<A>.value(): A", (v) => v.value());
	registry.registerFunctionOverload("OptionalNamespace.none(): optional<T>", () => Optional.none());
	functionOverload("OptionalNamespace.of(A): optional<A>", (_, value) => Optional.of(value));
	function ensureOptional(value, ast, description) {
		if (value instanceof Optional) return value;
		throw evaluationError("optional_expected", `${description} must be optional`, ast);
	}
	function evaluateOptional(ev, macro, ctx) {
		const v = ev.eval(macro.receiver, ctx);
		if (v instanceof Promise) return v.then((_v) => handleOptionalResolved(_v, ev, macro, ctx));
		return handleOptionalResolved(v, ev, macro, ctx);
	}
	function handleOptionalResolved(value, ev, macro, ctx) {
		const optional = ensureOptional(value, macro.receiver, `${macro.functionDesc} receiver`);
		if (optional.hasValue()) return macro.onHasValue(optional);
		return macro.onEmpty(ev, macro, ctx);
	}
	function ensureOptionalType(checker, node, ctx, description) {
		const type = checker.check(node, ctx);
		if (type.kind === "optional") return type;
		if (type.kind === "dyn") return checker.getType("optional");
		throw checker.createError("optional_expected", `${description} must be optional, got '${type}'`, node);
	}
	function createOptionalMacro({ functionDesc, evaluate, typeCheck, onHasValue, onEmpty }) {
		return ({ ast, args, receiver }) => ({
			ast,
			functionDesc,
			receiver,
			arg: args[0],
			evaluate,
			typeCheck,
			onHasValue,
			onEmpty
		});
	}
	const invalidOrValueReceiver = "optional.orValue() receiver";
	const invalidOrReceiver = "optional.or(optional) receiver";
	const invalidOrArg = "optional.or(optional) argument";
	registry.registerFunctionOverload("optional.or(ast): optional<dyn>", createOptionalMacro({
		functionDesc: "optional.or(optional)",
		evaluate: evaluateOptional,
		typeCheck(check, macro, ctx) {
			const l = ensureOptionalType(check, macro.receiver, ctx, invalidOrReceiver);
			const r = ensureOptionalType(check, macro.arg, ctx, invalidOrArg);
			if (!(macro.receiver.maybeAsync || macro.arg.maybeAsync)) macro.ast.setMeta("async", false);
			const unified = l.unify(check.registry, r);
			if (unified) return unified;
			throw check.createError("incompatible_argument_type", `${macro.functionDesc} argument must be compatible type, got '${l}' and '${r}'`, macro.arg);
		},
		onHasValue: (optional) => optional,
		onEmpty(ev, macro, ctx) {
			const ast = macro.arg;
			const v = ev.eval(ast, ctx);
			if (v instanceof Promise) return v.then((_v) => ensureOptional(_v, ast, invalidOrArg));
			return ensureOptional(v, ast, invalidOrArg);
		}
	}));
	registry.registerFunctionOverload("optional.orValue(ast): dyn", createOptionalMacro({
		functionDesc: "optional.orValue(value)",
		onHasValue: (optionalValue) => optionalValue.value(),
		onEmpty(ev, macro, ctx) {
			return ev.eval(macro.arg, ctx);
		},
		evaluate: evaluateOptional,
		typeCheck(check, macro, ctx) {
			const l = ensureOptionalType(check, macro.receiver, ctx, invalidOrValueReceiver).valueType;
			const r = check.check(macro.arg, ctx);
			if (!(macro.receiver.maybeAsync || macro.arg.maybeAsync)) macro.ast.setMeta("async", false);
			const unified = l.unify(check.registry, r);
			if (unified) return unified;
			throw check.createError("incompatible_argument_type", `${macro.functionDesc} argument must be compatible type, got '${l}' and '${r}'`, macro.arg);
		}
	}));
}
var _Symbol$toStringTag$2, _Symbol$for$1, _value$1, Optional, OPTIONAL_NONE, OptionalNamespace, optionalNamespace;
var init_optional = __esmMin((() => {
	init_errors();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	_value$1 = /* @__PURE__ */ new WeakMap();
	_Symbol$toStringTag$2 = Symbol.toStringTag;
	_Symbol$for$1 = Symbol.for("nodejs.util.inspect.custom");
	Optional = class Optional {
		constructor(value) {
			_classPrivateFieldInitSpec(this, _value$1, void 0);
			_classPrivateFieldSet2(_value$1, this, value);
		}
		static of(value) {
			if (value === void 0) return OPTIONAL_NONE;
			return new Optional(value);
		}
		static none() {
			return OPTIONAL_NONE;
		}
		hasValue() {
			return _classPrivateFieldGet2(_value$1, this) !== void 0;
		}
		value() {
			if (_classPrivateFieldGet2(_value$1, this) === void 0) throw evaluationError("optional_value_missing", "Optional value is not present");
			return _classPrivateFieldGet2(_value$1, this);
		}
		or(optional) {
			if (_classPrivateFieldGet2(_value$1, this) !== void 0) return this;
			if (optional instanceof Optional) return optional;
			throw evaluationError("invalid_optional_argument", "Optional.or must be called with an Optional argument");
		}
		orValue(defaultValue) {
			return _classPrivateFieldGet2(_value$1, this) === void 0 ? defaultValue : _classPrivateFieldGet2(_value$1, this);
		}
		get [_Symbol$toStringTag$2]() {
			return "optional";
		}
		[_Symbol$for$1]() {
			return _classPrivateFieldGet2(_value$1, this) === void 0 ? `Optional { none }` : `Optional { value: ${JSON.stringify(_classPrivateFieldGet2(_value$1, this))} }`;
		}
	};
	OPTIONAL_NONE = Object.freeze(new Optional());
	OptionalNamespace = class {};
	optionalNamespace = new OptionalNamespace();
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/globals.js
function isAsync(fn, fallback) {
	if ((fn === null || fn === void 0 ? void 0 : fn[Symbol.toStringTag]) === "AsyncFunction") return true;
	return typeof fallback === "boolean" ? fallback : true;
}
var hasOwn, objKeys, objFreeze, objEntries, isArray, arrayFrom, RESERVED;
var init_globals = __esmMin((() => {
	hasOwn = Object.hasOwn;
	objKeys = Object.keys;
	objFreeze = Object.freeze;
	objEntries = Object.entries;
	isArray = Array.isArray;
	arrayFrom = Array.from;
	RESERVED = new Set([
		"as",
		"break",
		"const",
		"continue",
		"else",
		"for",
		"function",
		"if",
		"import",
		"let",
		"loop",
		"package",
		"namespace",
		"return",
		"var",
		"void",
		"while",
		"__proto__",
		"prototype"
	]);
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/functions.js
function registerFunctions(registry) {
	const sync = { async: false };
	const functionOverload = (sig, handler) => registry.registerFunctionOverload(sig, handler, sync);
	const identity = (v) => v;
	functionOverload("dyn(dyn): dyn", identity);
	for (const _t in TYPES) {
		const type = TYPES[_t];
		if (!(type instanceof Type)) continue;
		functionOverload(`type(${type.name}): type`, () => type);
	}
	functionOverload("bool(bool): bool", identity);
	functionOverload("bool(string): bool", (v) => {
		switch (v) {
			case "1":
			case "t":
			case "true":
			case "TRUE":
			case "True": return true;
			case "0":
			case "f":
			case "false":
			case "FALSE":
			case "False": return false;
			default: throw evaluationError("bool_conversion_error", `bool() conversion error: invalid string value "${v}"`);
		}
	});
	functionOverload("size(string): int", (v) => BigInt(stringSize(v)));
	functionOverload("size(bytes): int", (v) => BigInt(v.length));
	functionOverload("size(list): int", (v) => {
		var _v$length;
		return BigInt((_v$length = v.length) !== null && _v$length !== void 0 ? _v$length : v.size);
	});
	functionOverload("size(map): int", (v) => BigInt(v instanceof Map ? v.size : objKeys(v).length));
	functionOverload("string.size(): int", (v) => BigInt(stringSize(v)));
	functionOverload("bytes.size(): int", (v) => BigInt(v.length));
	functionOverload("list.size(): int", (v) => {
		var _v$length2;
		return BigInt((_v$length2 = v.length) !== null && _v$length2 !== void 0 ? _v$length2 : v.size);
	});
	functionOverload("map.size(): int", (v) => BigInt(v instanceof Map ? v.size : objKeys(v).length));
	functionOverload("bytes(string): bytes", (v) => ByteOpts.fromString(v));
	functionOverload("bytes(bytes): bytes", identity);
	functionOverload("double(double): double", identity);
	functionOverload("double(int): double", (v) => Number(v));
	functionOverload("double(uint): double", (v) => Number(v));
	functionOverload("double(string): double", (v) => {
		if (!v || v !== v.trim()) throw evaluationError("double_conversion_error", "double() type error: cannot convert to double");
		switch (v.toLowerCase()) {
			case "inf":
			case "+inf":
			case "infinity":
			case "+infinity": return Number.POSITIVE_INFINITY;
			case "-inf":
			case "-infinity": return Number.NEGATIVE_INFINITY;
			case "nan": return NaN;
			default: {
				const parsed = Number(v);
				if (!Number.isNaN(parsed)) return parsed;
				throw evaluationError("double_conversion_error", "double() type error: cannot convert to double");
			}
		}
	});
	functionOverload("int(int): int", identity);
	functionOverload("int(double): int", (v) => {
		if (Number.isFinite(v)) return BigInt(Math.trunc(v));
		throw evaluationError("numeric_overflow", "int() type error: integer overflow");
	});
	functionOverload("int(string): int", (v) => {
		if (v !== v.trim() || v.length > 20 || v.includes("0x")) throw evaluationError("int_conversion_error", "int() type error: cannot convert to int");
		try {
			const num = BigInt(v);
			if (num <= 9223372036854775807n && num >= -9223372036854775808n) return num;
		} catch (_e) {}
		throw evaluationError("int_conversion_error", "int() type error: cannot convert to int");
	});
	functionOverload("uint(uint): uint", identity);
	functionOverload("uint(int): uint", (v) => {
		try {
			return new UnsignedInt(v);
		} catch (e) {
			throw evaluationError("uint_conversion_error", "uint() type error: cannot convert to uint");
		}
	});
	functionOverload("uint(double): uint", (v) => {
		try {
			return new UnsignedInt(Math.trunc(v));
		} catch (e) {
			throw evaluationError("numeric_overflow", "uint() type error: unsigned integer overflow");
		}
	});
	functionOverload("uint(string): uint", (v) => {
		if (v !== v.trim() || v.length > 20 || v.includes("0x")) throw evaluationError("uint_conversion_error", "uint() type error: cannot convert to uint");
		try {
			return new UnsignedInt(v);
		} catch (e) {
			throw evaluationError("uint_conversion_error", "uint() type error: cannot convert to uint");
		}
	});
	functionOverload("string(string): string", identity);
	functionOverload("string(bool): string", (v) => `${v}`);
	functionOverload("string(int): string", (v) => `${v}`);
	functionOverload("string(uint): string", (v) => `${v}`);
	functionOverload("string(bytes): string", (v) => ByteOpts.toUtf8(v));
	functionOverload("string(double): string", (v) => {
		if (v === Infinity) return "+Inf";
		if (v === -Infinity) return "-Inf";
		return `${v}`;
	});
	functionOverload("string.startsWith(string): bool", (a, b) => a.startsWith(b));
	functionOverload("string.endsWith(string): bool", (a, b) => a.endsWith(b));
	functionOverload("string.contains(string): bool", (a, b) => a.includes(b));
	functionOverload("string.lowerAscii(): string", (a) => a.toLowerCase());
	functionOverload("string.upperAscii(): string", (a) => a.toUpperCase());
	functionOverload("string.trim(): string", (a) => a.trim());
	functionOverload("string.indexOf(string): int", (string, search) => BigInt(string.indexOf(search)));
	functionOverload("string.indexOf(string, int): int", (string, search, fromIndex) => {
		if (search === "") return fromIndex;
		fromIndex = Number(fromIndex);
		if (fromIndex < 0 || fromIndex >= string.length) throw evaluationError("index_out_of_range", "string.indexOf(search, fromIndex): fromIndex out of range");
		return BigInt(string.indexOf(search, fromIndex));
	});
	functionOverload("string.lastIndexOf(string): int", (string, search) => BigInt(string.lastIndexOf(search)));
	functionOverload("string.lastIndexOf(string, int): int", (string, search, fromIndex) => {
		if (search === "") return fromIndex;
		fromIndex = Number(fromIndex);
		if (fromIndex < 0 || fromIndex >= string.length) throw evaluationError("index_out_of_range", "string.lastIndexOf(search, fromIndex): fromIndex out of range");
		return BigInt(string.lastIndexOf(search, fromIndex));
	});
	functionOverload("string.substring(int): string", (string, start) => {
		start = Number(start);
		if (start < 0 || start > string.length) throw evaluationError("index_out_of_range", "string.substring(start, end): start index out of range");
		return string.substring(start);
	});
	functionOverload("string.substring(int, int): string", (string, start, end) => {
		start = Number(start);
		if (start < 0 || start > string.length) throw evaluationError("index_out_of_range", "string.substring(start, end): start index out of range");
		end = Number(end);
		if (end < start || end > string.length) throw evaluationError("index_out_of_range", "string.substring(start, end): end index out of range");
		return string.substring(start, end);
	});
	functionOverload("string.matches(string): bool", (a, b) => {
		try {
			return new RegExp(b).test(a);
		} catch (_err) {
			throw evaluationError("invalid_regular_expression", `Invalid regular expression: ${b}`);
		}
	});
	functionOverload("string.split(string): list<string>", (s, sep) => s.split(sep));
	functionOverload("string.split(string, int): list<string>", (s, sep, l) => {
		l = Number(l);
		if (l === 0) return [];
		const parts = s.split(sep);
		if (l < 0 || parts.length <= l) return parts;
		const limited = parts.slice(0, l - 1);
		limited.push(parts.slice(l - 1).join(sep));
		return limited;
	});
	functionOverload("list<string>.join(): string", (v) => {
		for (let i = 0; i < v.length; i++) if (typeof v[i] !== "string") throw evaluationError("invalid_list_element_type", "string.join(): list must contain only strings");
		return v.join("");
	});
	functionOverload("list<string>.join(string): string", (v, sep) => {
		for (let i = 0; i < v.length; i++) if (typeof v[i] !== "string") throw evaluationError("invalid_list_element_type", "string.join(separator): list must contain only strings");
		return v.join(sep);
	});
	const textEncoder = new TextEncoder("utf8");
	const textDecoder = new TextDecoder("utf8");
	const ByteOpts = typeof Buffer !== "undefined" ? {
		byteLength: (v) => Buffer.byteLength(v),
		fromString: (str) => Buffer.from(str, "utf8"),
		toHex: (b) => Buffer.prototype.hexSlice.call(b, 0, b.length),
		toBase64: (b) => Buffer.prototype.base64Slice.call(b, 0, b.length),
		toUtf8: (b) => Buffer.prototype.utf8Slice.call(b, 0, b.length),
		jsonParse: (b) => JSON.parse(b)
	} : {
		textEncoder: new TextEncoder("utf8"),
		byteLength: (v) => textEncoder.encode(v).length,
		fromString: (str) => textEncoder.encode(str),
		toHex: Uint8Array.prototype.toHex ? (b) => b.toHex() : (b) => arrayFrom(b, (i) => i.toString(16).padStart(2, "0")).join(""),
		toBase64: Uint8Array.prototype.toBase64 ? (b) => b.toBase64() : (b) => btoa(arrayFrom(b, (i) => String.fromCodePoint(i)).join("")),
		toUtf8: (b) => textDecoder.decode(b),
		jsonParse: (b) => JSON.parse(textEncoder.decode(b))
	};
	functionOverload("bytes.json(): map", ByteOpts.jsonParse);
	functionOverload("bytes.hex(): string", ByteOpts.toHex);
	functionOverload("bytes.string(): string", ByteOpts.toUtf8);
	functionOverload("bytes.base64(): string", ByteOpts.toBase64);
	functionOverload("bytes.at(int): int", (b, index) => {
		if (index < 0 || index >= b.length) throw evaluationError("index_out_of_range", "Bytes index out of range");
		return BigInt(b[index]);
	});
	const TS = "google.protobuf.Timestamp";
	const GPD = "google.protobuf.Duration";
	const TimestampType = registry.registerType(TS, Date).typeType;
	const DurationType = registry.registerType(GPD, Duration).typeType;
	registry.registerConstant("google", "map<string, map<string, type>>", { protobuf: {
		Duration: DurationType,
		Timestamp: TimestampType
	} });
	function tzDate(d, timeZone) {
		return new Date(d.toLocaleString("en-US", { timeZone }));
	}
	function getDayOfYear(d, tz) {
		const workingDate = tz ? tzDate(d, tz) : new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
		const start = new Date(workingDate.getFullYear(), 0, 0);
		return BigInt(Math.floor((workingDate - start) / 864e5) - 1);
	}
	functionOverload(`timestamp(string): ${TS}`, (v) => {
		if (v.length < 20 || v.length > 30) throw evaluationError("invalid_timestamp", "timestamp() requires a string in ISO 8601 format");
		const d = new Date(v);
		if (d <= 0xe677d21fdbff && d >= -621355968e5) return d;
		throw evaluationError("invalid_timestamp", "timestamp() requires a string in ISO 8601 format");
	});
	functionOverload(`timestamp(int): ${TS}`, (i) => {
		i = Number(i) * 1e3;
		if (i <= 0xe677d21fdbff && i >= -621355968e5) return new Date(i);
		throw evaluationError("invalid_timestamp", "timestamp() requires a valid integer unix timestamp");
	});
	functionOverload(`${TS}.getDate(): int`, (d) => BigInt(d.getUTCDate()));
	functionOverload(`${TS}.getDate(string): int`, (d, tz) => BigInt(tzDate(d, tz).getDate()));
	functionOverload(`${TS}.getDayOfMonth(): int`, (d) => BigInt(d.getUTCDate() - 1));
	functionOverload(`${TS}.getDayOfMonth(string): int`, (d, tz) => BigInt(tzDate(d, tz).getDate() - 1));
	functionOverload(`${TS}.getDayOfWeek(): int`, (d) => BigInt(d.getUTCDay()));
	functionOverload(`${TS}.getDayOfWeek(string): int`, (d, tz) => BigInt(tzDate(d, tz).getDay()));
	functionOverload(`${TS}.getDayOfYear(): int`, getDayOfYear);
	functionOverload(`${TS}.getDayOfYear(string): int`, getDayOfYear);
	functionOverload(`${TS}.getFullYear(): int`, (d) => BigInt(d.getUTCFullYear()));
	functionOverload(`${TS}.getFullYear(string): int`, (d, tz) => BigInt(tzDate(d, tz).getFullYear()));
	functionOverload(`${TS}.getHours(): int`, (d) => BigInt(d.getUTCHours()));
	functionOverload(`${TS}.getHours(string): int`, (d, tz) => BigInt(tzDate(d, tz).getHours()));
	functionOverload(`${TS}.getMilliseconds(): int`, (d) => BigInt(d.getUTCMilliseconds()));
	functionOverload(`${TS}.getMilliseconds(string): int`, (d) => BigInt(d.getUTCMilliseconds()));
	functionOverload(`${TS}.getMinutes(): int`, (d) => BigInt(d.getUTCMinutes()));
	functionOverload(`${TS}.getMinutes(string): int`, (d, tz) => BigInt(tzDate(d, tz).getMinutes()));
	functionOverload(`${TS}.getMonth(): int`, (d) => BigInt(d.getUTCMonth()));
	functionOverload(`${TS}.getMonth(string): int`, (d, tz) => BigInt(tzDate(d, tz).getMonth()));
	functionOverload(`${TS}.getSeconds(): int`, (d) => BigInt(d.getUTCSeconds()));
	functionOverload(`${TS}.getSeconds(string): int`, (d, tz) => BigInt(tzDate(d, tz).getSeconds()));
	const parseDurationPattern = /(\d*\.?\d*)(ns|us|µs|ms|s|m|h)/;
	function parseDuration(string) {
		if (!string) throw evaluationError("invalid_duration", `Invalid duration string: ''`);
		const isNegative = string[0] === "-";
		if (string[0] === "-" || string[0] === "+") string = string.slice(1);
		let nanoseconds = BigInt(0);
		while (true) {
			const match = parseDurationPattern.exec(string);
			if (!match) throw evaluationError("invalid_duration", `Invalid duration string: ${string}`);
			if (match.index !== 0) throw evaluationError("invalid_duration", `Invalid duration string: ${string}`);
			string = string.slice(match[0].length);
			const unitNanos = UNIT_NANOSECONDS[match[2]];
			const [intPart = "0", fracPart = ""] = match[1].split(".");
			const intVal = BigInt(intPart) * unitNanos;
			const fracNanos = fracPart ? BigInt(fracPart.slice(0, 13).padEnd(13, "0")) * unitNanos / 10000000000000n : 0n;
			nanoseconds += intVal + fracNanos;
			if (string === "") break;
		}
		const seconds = nanoseconds >= billionBigInt ? nanoseconds / billionBigInt : 0n;
		const nanos = Number(nanoseconds % billionBigInt);
		if (isNegative) return new Duration(-seconds, -nanos);
		return new Duration(seconds, nanos);
	}
	functionOverload(`duration(string): google.protobuf.Duration`, (s) => parseDuration(s));
	functionOverload(`google.protobuf.Duration.getHours(): int`, (d) => d.getHours());
	functionOverload(`google.protobuf.Duration.getMinutes(): int`, (d) => d.getMinutes());
	functionOverload(`google.protobuf.Duration.getSeconds(): int`, (d) => d.getSeconds());
	functionOverload(`google.protobuf.Duration.getMilliseconds(): int`, (d) => d.getMilliseconds());
	register(registry);
}
function stringSize(str) {
	let count = 0;
	for (const c of str) count++;
	return count;
}
var _Symbol$toStringTag$1, _Symbol$for, _Symbol$toStringTag2, _Symbol$for2, _value, UnsignedInt, billion, billionBigInt, UNIT_NANOSECONDS, _seconds, _nanos, Duration;
var init_functions = __esmMin((() => {
	init_errors();
	init_registry();
	init_optional();
	init_globals();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldGet2();
	init_classPrivateFieldSet2();
	_value = /* @__PURE__ */ new WeakMap();
	_Symbol$toStringTag$1 = Symbol.toStringTag;
	_Symbol$for = Symbol.for("nodejs.util.inspect.custom");
	UnsignedInt = class {
		constructor(value) {
			_classPrivateFieldInitSpec(this, _value, void 0);
			this.verify(typeof value === "bigint" ? value : BigInt(value));
		}
		get value() {
			return _classPrivateFieldGet2(_value, this);
		}
		valueOf() {
			return _classPrivateFieldGet2(_value, this);
		}
		toString() {
			return `${_classPrivateFieldGet2(_value, this)}`;
		}
		verify(v) {
			if (v < 0n || v > 18446744073709551615n) throw evaluationError("numeric_overflow", "Unsigned integer overflow");
			_classPrivateFieldSet2(_value, this, v);
		}
		get [_Symbol$toStringTag$1]() {
			return `value = ${_classPrivateFieldGet2(_value, this)}`;
		}
		[_Symbol$for]() {
			return `UnsignedInteger { value: ${_classPrivateFieldGet2(_value, this)} }`;
		}
	};
	billion = 1e9;
	billionBigInt = 1000000000n;
	UNIT_NANOSECONDS = {
		h: 3600000000000n,
		m: 60000000000n,
		s: billionBigInt,
		ms: 1000000n,
		us: 1000n,
		µs: 1000n,
		ns: 1n
	};
	_seconds = /* @__PURE__ */ new WeakMap();
	_nanos = /* @__PURE__ */ new WeakMap();
	_Symbol$toStringTag2 = Symbol.toStringTag;
	_Symbol$for2 = Symbol.for("nodejs.util.inspect.custom");
	Duration = class Duration {
		constructor(seconds, nanos = 0) {
			_classPrivateFieldInitSpec(this, _seconds, void 0);
			_classPrivateFieldInitSpec(this, _nanos, void 0);
			_classPrivateFieldSet2(_seconds, this, BigInt(seconds));
			_classPrivateFieldSet2(_nanos, this, nanos);
		}
		get seconds() {
			return _classPrivateFieldGet2(_seconds, this);
		}
		get nanos() {
			return _classPrivateFieldGet2(_nanos, this);
		}
		valueOf() {
			return Number(_classPrivateFieldGet2(_seconds, this)) * 1e3 + _classPrivateFieldGet2(_nanos, this) / 1e6;
		}
		static fromMilliseconds(ms) {
			const totalNanos = BigInt(Math.trunc(ms * 1e6));
			return new Duration(totalNanos / billionBigInt, Number(totalNanos % billionBigInt));
		}
		addDuration(other) {
			const nanos = _classPrivateFieldGet2(_nanos, this) + other.nanos;
			return new Duration(_classPrivateFieldGet2(_seconds, this) + other.seconds + BigInt(Math.floor(nanos / billion)), nanos % billion);
		}
		subtractDuration(other) {
			const nanos = _classPrivateFieldGet2(_nanos, this) - other.nanos;
			return new Duration(_classPrivateFieldGet2(_seconds, this) - other.seconds + BigInt(Math.floor(nanos / billion)), (nanos + billion) % billion);
		}
		extendTimestamp(ts) {
			return new Date(ts.getTime() + Number(_classPrivateFieldGet2(_seconds, this)) * 1e3 + Math.floor(_classPrivateFieldGet2(_nanos, this) / 1e6));
		}
		subtractTimestamp(ts) {
			return /* @__PURE__ */ new Date(ts.getTime() - Number(_classPrivateFieldGet2(_seconds, this)) * 1e3 - Math.floor(_classPrivateFieldGet2(_nanos, this) / 1e6));
		}
		toString() {
			const nanos = _classPrivateFieldGet2(_nanos, this) ? (_classPrivateFieldGet2(_nanos, this) / billion).toLocaleString("en-US", {
				useGrouping: false,
				maximumFractionDigits: 9
			}).slice(1) : "";
			return `${_classPrivateFieldGet2(_seconds, this)}${nanos}s`;
		}
		getHours() {
			return _classPrivateFieldGet2(_seconds, this) / 3600n;
		}
		getMinutes() {
			return _classPrivateFieldGet2(_seconds, this) / 60n;
		}
		getSeconds() {
			return _classPrivateFieldGet2(_seconds, this);
		}
		getMilliseconds() {
			return _classPrivateFieldGet2(_seconds, this) * 1000n + BigInt(Math.floor(_classPrivateFieldGet2(_nanos, this) / 1e6));
		}
		get [_Symbol$toStringTag2]() {
			return "google.protobuf.Duration";
		}
		[_Symbol$for2]() {
			return `google.protobuf.Duration { seconds: ${_classPrivateFieldGet2(_seconds, this)}, nanos: ${_classPrivateFieldGet2(_nanos, this)} }`;
		}
	};
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/classPrivateMethodInitSpec.js
function _classPrivateMethodInitSpec(e, a) {
	_checkPrivateRedeclaration(e, a), a.add(e);
}
var init_classPrivateMethodInitSpec = __esmMin((() => {
	init_checkPrivateRedeclaration();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
var init_typeof = __esmMin((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var init_toPrimitive = __esmMin((() => {
	init_typeof();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
var init_toPropertyKey = __esmMin((() => {
	init_typeof();
	init_toPrimitive();
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
var init_defineProperty = __esmMin((() => {
	init_toPropertyKey();
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/registry.js
function _getOptionalField(obj, key, ast, ev) {
	obj = obj instanceof Optional ? obj.orValue() : obj;
	if (obj === void 0) return OPTIONAL_NONE;
	const type = ev.debugType(obj);
	try {
		return Optional.of(type.fieldLazy(obj, key, ast, ev));
	} catch (e) {
		if (e instanceof EvaluationError) return OPTIONAL_NONE;
		throw e;
	}
}
function _getMessageField(obj, key, ast, ev) {
	const message = obj ? ev.objectTypesByConstructor.get(obj.constructor) : void 0;
	if (!message) return;
	const type = message.fields ? message.fields[key] : dynType$1;
	if (!type) return void 0;
	const value = obj instanceof Map ? obj.get(key) : obj[key];
	if (value === void 0) return;
	if (type.matchesValueType(value, ev)) return value;
	throw evaluationError("field_type_mismatch", `Field '${key}' is not of type '${type}', got '${ev.debugType(value)}'`, ast);
}
function _getMapField(obj, key, ast, ev) {
	const value = obj instanceof Map ? obj.get(key) : obj && hasOwn(obj, key) ? obj[key] : void 0;
	if (value === void 0) return;
	if (this.valueType.matchesValueType(value, ev)) return value;
	throw evaluationError("field_type_mismatch", `Field '${key}' is not of type '${this.valueType}', got '${ev.debugType(value)}'`, ast);
}
function _getListElementAtIndex(list, pos) {
	switch (list === null || list === void 0 ? void 0 : list.constructor) {
		case Array: return list[pos];
		case Set: {
			let i = 0;
			for (const item of list) {
				if (i++ !== pos) continue;
				return item;
			}
		}
	}
}
function _getListField(obj, key, ast, ev) {
	if (typeof key === "bigint") key = Number(key);
	else if (typeof key !== "number") return;
	const value = _assertClassBrand(_TypeDeclaration_brand, this, _getListElementAtIndex).call(this, obj, key);
	if (value === void 0) {
		if (!obj) return;
		throw evaluationError("index_out_of_bounds", `No such key: index out of bounds, index ${key} ${key < 0 ? "< 0" : `>= size ${obj.length || obj.size}`}`, ast);
	}
	if (this.valueType.matchesValueType(value, ev)) return value;
	throw evaluationError("list_item_type_mismatch", `List item with index '${key}' is not of type '${this.valueType}', got '${ev.debugType(value)}'`, ast);
}
function _matches(s, o) {
	switch (s.kind) {
		case "dyn":
		case "param": return true;
		case "list": return o.kind === "list" && s.valueType.matches(o.valueType);
		case "map": return o.kind === "map" && s.keyType.matches(o.keyType) && s.valueType.matches(o.valueType);
		case "optional": return o.kind === "optional" && s.valueType.matches(o.valueType);
		default: return s.name === o.name;
	}
}
function wrapMacroExpander(name, handler) {
	const p = `Macro '${name}' must`;
	return function macroExpander(opts) {
		const macro = handler(opts);
		if (!macro || typeof macro !== "object") throw new Error(`${p} return an object.`);
		if (macro.callAst) return macro;
		if (!macro.evaluate) throw new Error(`${p} ${macroEvaluateErr}`);
		if (!macro.typeCheck) throw new Error(`${p} ${macroTypeCheckErr}`);
		return macro;
	};
}
function _createListType(valueType) {
	return new TypeDeclaration({
		kind: "list",
		name: `list<${valueType}>`,
		type: "list",
		valueType
	});
}
function _createPrimitiveType(name) {
	return new TypeDeclaration({
		kind: "primitive",
		name,
		type: name
	});
}
function _createMessageType(name) {
	return new TypeDeclaration({
		kind: "message",
		name,
		type: name
	});
}
function _createDynType(valueType) {
	const name = valueType ? `dyn<${valueType}>` : "dyn";
	return new TypeDeclaration({
		kind: "dyn",
		name,
		type: name,
		valueType
	});
}
function _createOptionalType(valueType) {
	return new TypeDeclaration({
		kind: "optional",
		name: `optional<${valueType}>`,
		type: "optional",
		valueType
	});
}
function _createMapType(keyType, valueType) {
	return new TypeDeclaration({
		kind: "map",
		name: `map<${keyType}, ${valueType}>`,
		type: "map",
		keyType,
		valueType
	});
}
function _createPlaceholderType(name) {
	return new TypeDeclaration({
		kind: "param",
		name,
		type: name
	});
}
function _cacheBinary(c, l, r, v) {
	return (c.get(l) || c.set(l, /* @__PURE__ */ new Map()).get(l)).set(r, v), v;
}
function _findBinaryUncached(left, right) {
	const ops = _assertClassBrand(_Candidates_brand, this, _findBinaryOverloads).call(this, left, right);
	if (ops.length === 0) return false;
	if (ops.length === 1) return ops[0];
	throw new Error(`Operator overload '${ops[0].signature}' overlaps with '${ops[1].signature}'.`);
}
function _checkBinaryUncached(left, right) {
	const ops = _assertClassBrand(_Candidates_brand, this, _findBinaryOverloads).call(this, left, right);
	if (ops.length === 0) return false;
	let rt = ops[0].returnType;
	for (let i = 1; i < ops.length; i++) rt = rt.unify(this.registry, ops[i].returnType) || dynType$1;
	return rt;
}
function _findBinaryOverloads(leftType, rightType) {
	const nonexactMatches = [];
	for (const decl of this.declarations) {
		if (decl.leftType === leftType && decl.rightType === rightType) return [decl];
		const secondary = _assertClassBrand(_Candidates_brand, this, _matchBinaryOverload).call(this, decl, leftType, rightType);
		if (secondary) nonexactMatches.push(secondary);
	}
	if (nonexactMatches.length === 0) {
		var _this$declarations$;
		const op = (_this$declarations$ = this.declarations[0]) === null || _this$declarations$ === void 0 ? void 0 : _this$declarations$.operator;
		if ((op === "==" || op === "!=") && leftType.kind === "dyn") return fallbackDynEqualityMatchers[op];
	}
	return nonexactMatches;
}
function _matchBinaryOverload(decl, actualLeft, actualRight) {
	const bindings = decl.hasPlaceholderType ? /* @__PURE__ */ new Map() : null;
	const leftType = _assertClassBrand(_Candidates_brand, this, _matchTypeWithPlaceholders).call(this, decl.leftType, actualLeft, bindings);
	if (!leftType) return;
	const rightType = _assertClassBrand(_Candidates_brand, this, _matchTypeWithPlaceholders).call(this, decl.rightType, actualRight, bindings);
	if (!rightType) return;
	if ((decl.operator === "==" || decl.operator === "!=") && decl.leftType.kind === "dyn" && decl.leftType.valueType && actualLeft.kind !== "dyn" && actualRight.kind !== "dyn") return false;
	return decl.hasPlaceholderType ? {
		async: decl.async,
		signature: decl.signature,
		handler: decl.handler,
		leftType,
		rightType,
		returnType: decl.returnType.templated(this.registry, bindings)
	} : decl;
}
function _matchesFunction(fn, argTypes, receiverType) {
	if (fn.hasPlaceholderType) return _assertClassBrand(_Candidates_brand, this, _matchWithPlaceholders).call(this, fn, argTypes, receiverType);
	if (receiverType && fn.receiverType && !receiverType.matches(fn.receiverType)) return;
	return fn.matchesArgs(argTypes);
}
function _matchWithPlaceholders(fn, argTypes, receiverType) {
	const bindings = /* @__PURE__ */ new Map();
	if (receiverType && fn.receiverType) {
		if (!_assertClassBrand(_Candidates_brand, this, _matchTypeWithPlaceholders).call(this, fn.receiverType, receiverType, bindings)) return null;
	}
	for (let i = 0; i < argTypes.length; i++) if (!_assertClassBrand(_Candidates_brand, this, _matchTypeWithPlaceholders).call(this, fn.argTypes[i], argTypes[i], bindings)) return null;
	return {
		async: fn.async,
		handler: fn.handler,
		signature: fn.signature,
		returnType: fn.returnType.templated(this.registry, bindings)
	};
}
function _matchTypeWithPlaceholders(declared, actual, bindings) {
	if (!declared.hasPlaceholderType) return actual.matches(declared) ? actual : null;
	const treatAsDyn = actual.kind === "dyn";
	if (!_assertClassBrand(_Candidates_brand, this, _collectPlaceholderBindings).call(this, declared, actual, bindings, treatAsDyn)) return null;
	if (treatAsDyn) return actual;
	return actual.matches(declared.templated(this.registry, bindings)) ? actual : null;
}
function _collectPlaceholderBindings(dec, act, bind, fromDyn = false) {
	if (!dec.hasPlaceholderType) return true;
	if (!act) return false;
	const asDyn = fromDyn || act.kind === "dyn";
	act = act.unwrappedType;
	switch (dec.kind) {
		case "param": {
			const type = asDyn ? dynType$1 : act;
			const existing = bind.get(dec.name);
			if (!existing) return bind.set(dec.name, type) && true;
			return existing.kind === "dyn" || type.kind === "dyn" ? true : existing.matchesBoth(type);
		}
		case "list":
			if (act.name === "dyn") act = dec;
			if (act.kind !== "list") return false;
			return _assertClassBrand(_Candidates_brand, this, _collectPlaceholderBindings).call(this, dec.valueType, act.valueType, bind, asDyn);
		case "map":
			if (act.name === "dyn") act = dec;
			if (act.kind !== "map") return false;
			return _assertClassBrand(_Candidates_brand, this, _collectPlaceholderBindings).call(this, dec.keyType, act.keyType, bind, asDyn) && _assertClassBrand(_Candidates_brand, this, _collectPlaceholderBindings).call(this, dec.valueType, act.valueType, bind, asDyn);
		case "optional":
			if (act.name === "dyn") act = dec;
			if (act.kind !== "optional") return false;
			return _assertClassBrand(_Candidates_brand, this, _collectPlaceholderBindings).call(this, dec.valueType, act.valueType, bind, asDyn);
	}
	return true;
}
function splitByComma(str) {
	const parts = [];
	let current = "";
	let depth = 0;
	for (const char of str) {
		if (char === "<") depth++;
		else if (char === ">") depth--;
		else if (char === "," && depth === 0) {
			parts.push(current.trim());
			current = "";
			continue;
		}
		current += char;
	}
	if (current) parts.push(current.trim());
	return parts;
}
function _ensureOwnVariables() {
	if (_classPrivateFieldGet2(_ownsVariables, this)) return;
	this.variables = new Map(this.variables);
	this.variables.dyn = this.unlistedVariablesAreDyn;
	_classPrivateFieldSet2(_ownsVariables, this, true);
}
function _pushOperator(decl) {
	if (!_classPrivateFieldGet2(_operators, this)) _classPrivateFieldSet2(_operatorsByOp, this, null);
	this.operatorCandidates(decl.operator).add(decl);
	_classPrivateFieldGet2(_operators, this).push(decl);
}
function _pushFunction(decl) {
	if (!_classPrivateFieldGet2(_functions, this)) _classPrivateFieldSet2(_functionsByKey, this, null);
	_assertClassBrand(_Registry_brand, this, _functionCandidates).call(this, decl.partitionKey).add(decl);
	_classPrivateFieldGet2(_functions, this).push(decl);
}
function _ensureCandiate(c, key) {
	return c.get(key) || c.set(key, new Candidates(this)).get(key);
}
function _getOperators() {
	if (_classPrivateFieldGet2(_operators, this)) return _classPrivateFieldGet2(_operators, this);
	return _classPrivateFieldSet2(_operators, this, [..._classPrivateFieldGet2(_others, this).operators]);
}
function _getFunctions() {
	if (_classPrivateFieldGet2(_functions, this)) return _classPrivateFieldGet2(_functions, this);
	return _classPrivateFieldSet2(_functions, this, [..._classPrivateFieldGet2(_others, this).functions]);
}
function _functionCandidates(key) {
	if (_classPrivateFieldGet2(_functionsByKey, this)) return _assertClassBrand(_Registry_brand, this, _ensureCandiate).call(this, _classPrivateFieldGet2(_functionsByKey, this), key);
	const c = _classPrivateFieldSet2(_functionsByKey, this, /* @__PURE__ */ new Map());
	for (const decl of _assertClassBrand(_Registry_brand, this, _getFunctions).call(this)) _assertClassBrand(_Registry_brand, this, _ensureCandiate).call(this, c, decl.partitionKey).add(decl);
	return _assertClassBrand(_Registry_brand, this, _ensureCandiate).call(this, c, key);
}
function _registerSchemaAsType(name, schema) {
	const fields = Object.create(null);
	for (const key of objKeys(schema)) {
		const def = schema[key];
		if (typeof def === "object" && def) fields[key] = this.registerType({
			name: `${name}.${key}`,
			schema: def
		}).type.name;
		else if (typeof def === "string") fields[key] = def;
		else throw new Error(`Invalid field definition for '${name}.${key}'`);
	}
	return fields;
}
/** @returns {TypeDeclaration} */
function _parseTypeString(typeStr, requireKnownTypes = true) {
	let match = _classPrivateFieldGet2(_typeDeclarations, this).get(typeStr);
	if (match) return match;
	if (typeof typeStr !== "string" || !typeStr.length) throw new Error(`Invalid type: must be a string`);
	match = typeStr.match(/^[A-Z]$/);
	if (match) return _assertClassBrand(_Registry_brand, this, _createDeclaration).call(this, _createPlaceholderType, typeStr, typeStr);
	match = typeStr.match(/^(dyn|list|map|optional)<(.+)>$/);
	if (!match) {
		if (requireKnownTypes) {
			const err = /* @__PURE__ */ new Error(`Unknown type: ${typeStr}`);
			err.unknownType = typeStr;
			throw err;
		}
		return _assertClassBrand(_Registry_brand, this, _createDeclaration).call(this, _createMessageType, typeStr, typeStr);
	}
	const kind = match[1];
	const inner = match[2].trim();
	switch (kind) {
		case "dyn": {
			const type = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, inner, requireKnownTypes).wrappedType;
			_classPrivateFieldGet2(_typeDeclarations, this).set(type.name, type);
			return type;
		}
		case "list": {
			const vType = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, inner, requireKnownTypes);
			return _assertClassBrand(_Registry_brand, this, _createDeclaration).call(this, _createListType, `list<${vType}>`, vType);
		}
		case "map": {
			const parts = splitByComma(inner);
			if (parts.length !== 2) throw new Error(`Invalid map type: ${typeStr}`);
			const kType = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, parts[0], requireKnownTypes);
			const vType = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, parts[1], requireKnownTypes);
			return _assertClassBrand(_Registry_brand, this, _createDeclaration).call(this, _createMapType, `map<${kType}, ${vType}>`, kType, vType);
		}
		case "optional": {
			const vType = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, inner, requireKnownTypes);
			return _assertClassBrand(_Registry_brand, this, _createDeclaration).call(this, _createOptionalType, `optional<${vType}>`, vType);
		}
	}
}
function _createDeclaration(creator, key, ...args) {
	return _classPrivateFieldGet2(_typeDeclarations, this).get(key) || _classPrivateFieldGet2(_typeDeclarations, this).set(key, creator(...args)).get(key);
}
function _toCelFieldType(field) {
	if (typeof field === "string") return { type: field };
	if (field.id) return protobufjsFieldToCelType(field);
	return field;
}
function _toCelFieldDeclaration(typename, fields, k, requireKnownTypes = false) {
	try {
		const field = _assertClassBrand(_Registry_brand, this, _toCelFieldType).call(this, fields[k]);
		if (typeof (field === null || field === void 0 ? void 0 : field.type) !== "string") throw new Error(`unsupported declaration`);
		return _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, field.type, requireKnownTypes);
	} catch (e) {
		e.message = `Field '${k}' in type '${typename}' has unsupported declaration: ${JSON.stringify(fields[k])}`;
		throw e;
	}
}
function _normalizeFields(typename, fields) {
	if (!fields) return;
	const all = Object.create(null);
	for (const k of objKeys(fields)) all[k] = _assertClassBrand(_Registry_brand, this, _toCelFieldDeclaration).call(this, typename, fields, k);
	return all;
}
function _createDefaultConvert(name, fields) {
	var _raw;
	let _Symbol$iterator2;
	const keys = objKeys(fields);
	const conversions = Object.create(null);
	for (const k of keys) {
		const type = fields[k];
		const decl = type.kind === "message" && this.objectTypes.get(type.name);
		if (decl === false) conversions[k] = false;
		else conversions[k] = decl.convert ? decl : false;
	}
	const Ctor = { [name]: (_raw = /* @__PURE__ */ new WeakMap(), _Symbol$iterator2 = Symbol.iterator, class extends Map {
		constructor(v) {
			super();
			_classPrivateFieldInitSpec(this, _raw, void 0);
			_classPrivateFieldSet2(_raw, this, v);
		}
		[_Symbol$iterator2]() {
			if (this.size !== keys.length) for (const k of keys) this.get(k);
			return super[Symbol.iterator]();
		}
		get(field) {
			var _classPrivateFieldGet8;
			let v = super.get(field);
			if (v !== void 0 || this.has(field)) return v;
			const dec = conversions[field];
			if (dec === void 0) return;
			v = _classPrivateFieldGet2(_raw, this) instanceof Map ? _classPrivateFieldGet2(_raw, this).get(field) : (_classPrivateFieldGet8 = _classPrivateFieldGet2(_raw, this)) === null || _classPrivateFieldGet8 === void 0 ? void 0 : _classPrivateFieldGet8[field];
			if (dec && v && typeof v === "object") switch (v.constructor) {
				case void 0:
				case Object:
				case Map: v = dec.convert(v);
			}
			return super.set(field, v), v;
		}
	}) }[name];
	return {
		ctor: Ctor,
		convert(v) {
			if (!v) return;
			if (v.constructor === Ctor) return v;
			return new Ctor(v);
		}
	};
}
function _parseSignature(signature) {
	if (typeof signature !== "string") throw new Error("Invalid signature: must be a string");
	const match = signature.match(/^(?:([a-zA-Z0-9.<>]+)\.)?(\w+)\(([^)]*)\):(.*)$/);
	if (!match) throw new Error(`Invalid signature: ${signature}`);
	const returnType = match[4].trim();
	if (!returnType) throw new Error(`Invalid signature: ${signature}`);
	return {
		receiverType: match[1] || null,
		name: match[2],
		argTypes: splitByComma(match[3]),
		returnType
	};
}
/**
* @param {FunctionDeclaration} a
* @param {FunctionDeclaration} b
*/
function _functionSignatureOverlaps(a, b) {
	if (a.name !== b.name) return false;
	if (a.argTypes.length !== b.argTypes.length) return false;
	if ((a.receiverType || b.receiverType) && (!a.receiverType || !b.receiverType)) return false;
	return !(a.receiverType !== b.receiverType && a.receiverType !== dynType$1 && b.receiverType !== dynType$1) && (b.macro || a.macro || b.argTypes.every((t, i) => {
		const o = a.argTypes[i];
		return t === o || t === dynType$1 || o === dynType$1;
	}));
}
/** @param {FunctionDeclaration} newDec */
function _checkOverlappingSignatures(newDec) {
	for (const decl of _assertClassBrand(_Registry_brand, this, _functionCandidates).call(this, newDec.partitionKey)) {
		if (!_assertClassBrand(_Registry_brand, this, _functionSignatureOverlaps).call(this, decl, newDec)) continue;
		throw new Error(`Function signature '${newDec.signature}' overlaps with existing overload '${decl.signature}'.`);
	}
}
function _normalizeParam(i, aType, param) {
	var _param$description;
	if (!param) return {
		type: this.getFunctionType(aType),
		name: `arg${i}`,
		description: null
	};
	const type = param.type || aType;
	if (!type) throw new Error(`params[${i}].type is required`);
	if (aType && type !== aType) throw new Error(`params[${i}].type not equal to signature type`);
	return {
		name: param.name || `arg${i}`,
		type: this.getFunctionType(type),
		description: (_param$description = param.description) !== null && _param$description !== void 0 ? _param$description : null
	};
}
function _hasOverload(d) {
	for (const o of this.operatorCandidates(d.operator)) if (d.equals(o)) return true;
	return false;
}
function _assertOverload(decl) {
	if (!_assertClassBrand(_Registry_brand, this, _hasOverload).call(this, decl)) return decl;
	throw new Error(`Operator overload already registered: ${decl.signature}`);
}
function createRegistry(opts) {
	return new Registry(opts);
}
/**
* Extract CEL field declarations from a protobufjs message type.
* Maps protobuf types to CEL types.
* @param {protobuf.Type} messageType - The protobufjs message type
* @returns {Object} Field declarations in CEL format {fieldName: 'celType'}
*/
function protobufjsFieldToCelType(field) {
	let fieldType;
	if (field.map) fieldType = `map<${protobufjsTypeToCelType(field.keyType, field.resolvedKeyType)}, ${protobufjsTypeToCelType(field.type, field.resolvedType)}>`;
	else fieldType = protobufjsTypeToCelType(field.type, field.resolvedType);
	return { type: field.repeated ? `list<${fieldType}>` : fieldType };
}
/**
* Map protobuf type names to CEL type names.
* @param {string} protoType - The protobuf type name
* @param {protobuf.Type|null} resolvedType - The resolved type for message/enum fields
* @returns {string} The CEL type name
*/
function protobufjsTypeToCelType(protoType, resolvedType) {
	switch (protoType) {
		case "string": return "string";
		case "bytes": return "bytes";
		case "bool": return "bool";
		case "double":
		case "float":
		case "int32":
		case "int64":
		case "sint32":
		case "sint64":
		case "sfixed32":
		case "sfixed64":
		case "uint32":
		case "uint64":
		case "fixed32":
		case "fixed64": return "double";
		default:
			switch (resolvedType === null || resolvedType === void 0 ? void 0 : resolvedType.constructor.name) {
				case "Type": return resolvedType.fullName.slice(1);
				case "Enum": return "int";
			}
			if (protoType === null || protoType === void 0 ? void 0 : protoType.includes(".")) return protoType;
			return "dyn";
	}
}
var _Symbol$toStringTag, _Symbol$iterator, _name, Type, TYPES, optionalType, valueTypeMatchers, _matchesCache, _TypeDeclaration_brand, TypeDeclaration, macroEvaluateErr, macroTypeCheckErr, VariableDeclaration, FunctionDeclaration, OperatorDeclaration, dynType$1, astType, listType, mapType, celTypes, _matchCache, _checkCache, _Candidates_brand, Candidates, objTypesDecls, objTypes, objTypesCtor, invalidVar, invalidType, fallbackDynEqualityMatchers, _parent, _typeDeclarations, _ownsVariables, _operators, _functions, _operatorsByOp, _functionsByKey, _listTypes, _mapTypes, _optionalTypes, _others, _locked, _Registry_brand, Registry, isRelational, _vars, _contextObj, _contextMap, _convertCache, RootContext, _parent2, OverlayContext;
var init_registry = __esmMin((() => {
	init_errors();
	init_functions();
	init_optional();
	init_globals();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_classPrivateMethodInitSpec();
	init_assertClassBrand();
	init_defineProperty();
	_name = /* @__PURE__ */ new WeakMap();
	_Symbol$toStringTag = Symbol.toStringTag;
	Type = class {
		constructor(name) {
			_classPrivateFieldInitSpec(this, _name, void 0);
			_classPrivateFieldSet2(_name, this, name);
			objFreeze(this);
		}
		get name() {
			return _classPrivateFieldGet2(_name, this);
		}
		get [_Symbol$toStringTag]() {
			return `Type<${_classPrivateFieldGet2(_name, this)}>`;
		}
		toString() {
			return `Type<${_classPrivateFieldGet2(_name, this)}>`;
		}
	};
	TYPES = {
		string: new Type("string"),
		bool: new Type("bool"),
		int: new Type("int"),
		uint: new Type("uint"),
		double: new Type("double"),
		map: new Type("map"),
		list: new Type("list"),
		bytes: new Type("bytes"),
		null_type: new Type("null"),
		type: new Type("type")
	};
	optionalType = new Type("optional");
	valueTypeMatchers = {
		dyn(v, ev) {
			switch (typeof v) {
				case "string":
				case "bigint":
				case "number":
				case "boolean": return true;
				case "object": switch (v ? v.constructor : v) {
					case null:
					case void 0:
					case Object:
					case Map:
					case Array:
					case Set: return true;
					default: if (ev.objectTypesByConstructor.get(v.constructor)) return true;
				}
			}
			return !!ev.debugType(v);
		},
		string(v) {
			return typeof v === "string";
		},
		int(v) {
			return typeof v === "bigint";
		},
		double(v) {
			return typeof v === "number";
		},
		bool(v) {
			return typeof v === "boolean";
		},
		null(v) {
			return v === null;
		},
		bytes(v) {
			return v instanceof Uint8Array;
		},
		uint(v) {
			return v instanceof UnsignedInt;
		},
		type(v) {
			return v instanceof Type;
		},
		list(v) {
			switch (v === null || v === void 0 ? void 0 : v.constructor) {
				case Array:
				case Set: return true;
				default: return false;
			}
		},
		map(v) {
			switch (typeof v === "object" && v ? v.constructor : null) {
				case void 0:
				case Object:
				case Map: return true;
				default: return false;
			}
		},
		optional(v) {
			return v instanceof Optional;
		},
		message(v, ev) {
			return this === ev.debugType(v);
		}
	};
	valueTypeMatchers.param = valueTypeMatchers.dyn;
	_matchesCache = /* @__PURE__ */ new WeakMap();
	_TypeDeclaration_brand = /* @__PURE__ */ new WeakSet();
	TypeDeclaration = class {
		constructor({ kind, type, name, keyType, valueType }) {
			var _this$valueType, _this$keyType, _this$keyType2, _this$valueType2;
			_classPrivateMethodInitSpec(this, _TypeDeclaration_brand);
			_classPrivateFieldInitSpec(this, _matchesCache, /* @__PURE__ */ new WeakMap());
			this.kind = kind;
			this.type = type;
			this.name = name;
			this.keyType = keyType;
			this.valueType = valueType;
			this.unwrappedType = kind === "dyn" && valueType ? valueType.unwrappedType : this;
			this.wrappedType = kind === "dyn" ? this : _createDynType(this.unwrappedType);
			this.hasDynType = this.kind === "dyn" || ((_this$valueType = this.valueType) === null || _this$valueType === void 0 ? void 0 : _this$valueType.hasDynType) || ((_this$keyType = this.keyType) === null || _this$keyType === void 0 ? void 0 : _this$keyType.hasDynType) || false;
			this.hasPlaceholderType = this.kind === "param" || ((_this$keyType2 = this.keyType) === null || _this$keyType2 === void 0 ? void 0 : _this$keyType2.hasPlaceholderType) || ((_this$valueType2 = this.valueType) === null || _this$valueType2 === void 0 ? void 0 : _this$valueType2.hasPlaceholderType) || false;
			if (kind === "list") this.fieldLazy = _assertClassBrand(_TypeDeclaration_brand, this, _getListField);
			else if (kind === "map") this.fieldLazy = _assertClassBrand(_TypeDeclaration_brand, this, _getMapField);
			else if (kind === "message") this.fieldLazy = _assertClassBrand(_TypeDeclaration_brand, this, _getMessageField);
			else if (kind === "optional") this.fieldLazy = _assertClassBrand(_TypeDeclaration_brand, this, _getOptionalField);
			this.matchesValueType = valueTypeMatchers[name] || valueTypeMatchers[kind];
			objFreeze(this);
		}
		isDynOrBool() {
			return this.type === "bool" || this.kind === "dyn";
		}
		isEmpty() {
			return this.valueType && this.valueType.kind === "param";
		}
		unify(r, t2) {
			const t1 = this;
			if (t1 === t2 || t1.kind === "dyn" || t2.kind === "param") return t1;
			if (t2.kind === "dyn" || t1.kind === "param") return t2;
			if (t1.kind !== t2.kind) return null;
			if (!(t1.hasPlaceholderType || t2.hasPlaceholderType || t1.hasDynType || t2.hasDynType)) return null;
			const valueType = t1.valueType.unify(r, t2.valueType);
			if (!valueType) return null;
			switch (t1.kind) {
				case "optional": return r.getOptionalType(valueType);
				case "list": return r.getListType(valueType);
				case "map":
					const keyType = t1.keyType.unify(r, t2.keyType);
					return keyType ? r.getMapType(keyType, valueType) : null;
			}
		}
		templated(r, bind) {
			if (!this.hasPlaceholderType) return this;
			switch (this.kind) {
				case "dyn": return this.valueType.templated(r, bind);
				case "param": return (bind === null || bind === void 0 ? void 0 : bind.get(this.name)) || this;
				case "map": return r.getMapType(this.keyType.templated(r, bind), this.valueType.templated(r, bind));
				case "list": return r.getListType(this.valueType.templated(r, bind));
				case "optional": return r.getOptionalType(this.valueType.templated(r, bind));
				default: return this;
			}
		}
		toString() {
			return this.name;
		}
		fieldLazy() {}
		field(obj, key, ast, ev) {
			const v = this.fieldLazy(obj, key, ast, ev);
			if (v !== void 0) return v;
			throw evaluationError("no_such_key", `No such key: ${key}`, ast);
		}
		matchesBoth(other) {
			return this.matches(other) && other.matches(this);
		}
		matches(o) {
			var _this$matchesCache$ge;
			const s = this.unwrappedType;
			o = o.unwrappedType;
			if (s === o || s.kind === "dyn" || o.kind === "dyn" || o.kind === "param") return true;
			return (_this$matchesCache$ge = _classPrivateFieldGet2(_matchesCache, this).get(o)) !== null && _this$matchesCache$ge !== void 0 ? _this$matchesCache$ge : _classPrivateFieldGet2(_matchesCache, this).set(o, _assertClassBrand(_TypeDeclaration_brand, this, _matches).call(this, s, o)).get(o);
		}
	};
	macroEvaluateErr = `have a .callAst property or .evaluate(checker, macro, ctx) method.`;
	macroTypeCheckErr = `have a .callAst property or .typeCheck(checker, macro, ctx) method.`;
	VariableDeclaration = class {
		constructor(name, type, description, value) {
			this.name = name;
			this.type = type;
			this.description = description !== null && description !== void 0 ? description : null;
			this.constant = value !== void 0;
			this.value = value;
			objFreeze(this);
		}
	};
	FunctionDeclaration = class {
		constructor({ name, receiverType, returnType, handler, description, params, async }) {
			var _this$receiverType;
			if (typeof name !== "string") throw new Error("name must be a string");
			if (typeof handler !== "function") throw new Error("handler must be a function");
			this.name = name;
			this.async = isAsync(handler, async);
			this.receiverType = receiverType !== null && receiverType !== void 0 ? receiverType : null;
			this.returnType = returnType;
			this.description = description !== null && description !== void 0 ? description : null;
			this.params = params;
			this.argTypes = params.map((p) => p.type);
			this.macro = this.argTypes.includes(astType);
			const receiverString = receiverType ? `${receiverType}.` : "";
			this.signature = `${receiverString}${name}(${this.argTypes.join(", ")}): ${returnType}`;
			this.handler = this.macro ? wrapMacroExpander(this.signature, handler) : handler;
			this.partitionKey = `${receiverType ? "rcall" : "call"}:${name}:${params.length}`;
			this.hasPlaceholderType = this.returnType.hasPlaceholderType || ((_this$receiverType = this.receiverType) === null || _this$receiverType === void 0 ? void 0 : _this$receiverType.hasPlaceholderType) || this.argTypes.some((t) => t.hasPlaceholderType) || false;
			objFreeze(this);
		}
		matchesArgs(argTypes) {
			return argTypes.length === this.argTypes.length && this.argTypes.every((t, i) => t.matches(argTypes[i])) ? this : null;
		}
	};
	OperatorDeclaration = class {
		constructor({ op, leftType, rightType, handler, returnType, async }) {
			var _this$rightType;
			this.operator = op;
			this.leftType = leftType;
			this.rightType = rightType || null;
			this.handler = handler;
			this.async = isAsync(handler, async);
			this.returnType = returnType;
			if (rightType) this.signature = `${leftType} ${op} ${rightType}: ${returnType}`;
			else this.signature = `${op}${leftType}: ${returnType}`;
			this.hasPlaceholderType = this.leftType.hasPlaceholderType || ((_this$rightType = this.rightType) === null || _this$rightType === void 0 ? void 0 : _this$rightType.hasPlaceholderType) || false;
			objFreeze(this);
		}
		equals(other) {
			return this.operator === other.operator && this.leftType === other.leftType && this.rightType === other.rightType;
		}
	};
	dynType$1 = _createDynType();
	astType = _createPrimitiveType("ast");
	listType = _createListType(dynType$1);
	mapType = _createMapType(dynType$1, dynType$1);
	celTypes = {
		string: _createPrimitiveType("string"),
		bool: _createPrimitiveType("bool"),
		int: _createPrimitiveType("int"),
		uint: _createPrimitiveType("uint"),
		double: _createPrimitiveType("double"),
		bytes: _createPrimitiveType("bytes"),
		dyn: dynType$1,
		null: _createPrimitiveType("null"),
		type: _createPrimitiveType("type"),
		optional: _createOptionalType(dynType$1),
		list: listType,
		"list<dyn>": listType,
		map: mapType,
		"map<dyn, dyn>": mapType
	};
	for (const t of [
		celTypes.string,
		celTypes.double,
		celTypes.int
	]) {
		const list = _createListType(t);
		const map = _createMapType(celTypes.string, t);
		celTypes[list.name] = list;
		celTypes[map.name] = map;
	}
	Object.freeze(celTypes);
	_matchCache = /* @__PURE__ */ new WeakMap();
	_checkCache = /* @__PURE__ */ new WeakMap();
	_Candidates_brand = /* @__PURE__ */ new WeakSet();
	_Symbol$iterator = Symbol.iterator;
	Candidates = class {
		constructor(registry) {
			_classPrivateMethodInitSpec(this, _Candidates_brand);
			_defineProperty(this, "returnType", null);
			_defineProperty(this, "async", false);
			_defineProperty(this, "macro", false);
			_classPrivateFieldInitSpec(this, _matchCache, null);
			_classPrivateFieldInitSpec(this, _checkCache, null);
			_defineProperty(
				this,
				/** @type {Array<FunctionDeclaration>|Array<OperatorDeclaration>} */
				"declarations",
				[]
			);
			this.registry = registry;
		}
		[_Symbol$iterator]() {
			return this.declarations[Symbol.iterator]();
		}
		add(decl) {
			var _classPrivateFieldGet2$1, _classPrivateFieldGet3;
			this.returnType = (this.returnType || decl.returnType).unify(this.registry, decl.returnType) || dynType$1;
			if (decl.macro) this.macro = decl;
			if (decl.async && !this.async) this.async = true;
			this.declarations.push(decl);
			(_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_matchCache, this)) === null || _classPrivateFieldGet2$1 === void 0 || _classPrivateFieldGet2$1.clear();
			(_classPrivateFieldGet3 = _classPrivateFieldGet2(_checkCache, this)) === null || _classPrivateFieldGet3 === void 0 || _classPrivateFieldGet3.clear();
		}
		findFunction(argTypes, receiverType = null) {
			for (let i = 0; i < this.declarations.length; i++) {
				const match = _assertClassBrand(_Candidates_brand, this, _matchesFunction).call(this, this.declarations[i], argTypes, receiverType);
				if (match) return match;
			}
			return null;
		}
		findUnaryOverload(left) {
			var _classPrivateFieldGet4;
			const cached = ((_classPrivateFieldGet4 = _classPrivateFieldGet2(_matchCache, this)) !== null && _classPrivateFieldGet4 !== void 0 ? _classPrivateFieldGet4 : _classPrivateFieldSet2(_matchCache, this, /* @__PURE__ */ new Map())).get(left);
			if (cached !== void 0) return cached;
			let value = false;
			for (const decl of this.declarations) {
				if (decl.leftType !== left) continue;
				value = decl;
				break;
			}
			_classPrivateFieldGet2(_matchCache, this).set(left, value);
			return value;
		}
		findBinaryOverload(left, right) {
			var _this$matchCache$get$, _this$matchCache$get, _classPrivateFieldGet5;
			if (left.kind === "dyn" && left.valueType) right = right.wrappedType;
			else if (right.kind === "dyn" && right.valueType) left = left.wrappedType;
			return (_this$matchCache$get$ = (_this$matchCache$get = ((_classPrivateFieldGet5 = _classPrivateFieldGet2(_matchCache, this)) !== null && _classPrivateFieldGet5 !== void 0 ? _classPrivateFieldGet5 : _classPrivateFieldSet2(_matchCache, this, /* @__PURE__ */ new Map())).get(left)) === null || _this$matchCache$get === void 0 ? void 0 : _this$matchCache$get.get(right)) !== null && _this$matchCache$get$ !== void 0 ? _this$matchCache$get$ : _assertClassBrand(_Candidates_brand, this, _cacheBinary).call(this, _classPrivateFieldGet2(_matchCache, this), left, right, _assertClassBrand(_Candidates_brand, this, _findBinaryUncached).call(this, left, right));
		}
		checkBinaryOverload(left, right) {
			var _this$checkCache$get$, _this$checkCache$get, _classPrivateFieldGet6;
			return (_this$checkCache$get$ = (_this$checkCache$get = ((_classPrivateFieldGet6 = _classPrivateFieldGet2(_checkCache, this)) !== null && _classPrivateFieldGet6 !== void 0 ? _classPrivateFieldGet6 : _classPrivateFieldSet2(_checkCache, this, /* @__PURE__ */ new Map())).get(left)) === null || _this$checkCache$get === void 0 ? void 0 : _this$checkCache$get.get(right)) !== null && _this$checkCache$get$ !== void 0 ? _this$checkCache$get$ : _assertClassBrand(_Candidates_brand, this, _cacheBinary).call(this, _classPrivateFieldGet2(_checkCache, this), left, right, _assertClassBrand(_Candidates_brand, this, _checkBinaryUncached).call(this, left, right));
		}
	};
	objTypesDecls = [
		[
			UnsignedInt,
			"uint",
			TYPES.uint,
			celTypes.uint
		],
		[
			Type,
			"type",
			TYPES.type,
			celTypes.type
		],
		[
			Optional,
			"optional",
			optionalType,
			celTypes.optional
		],
		[
			Uint8Array,
			"bytes",
			TYPES.bytes,
			celTypes.bytes
		],
		...typeof Buffer !== "undefined" ? [[
			Buffer,
			"bytes",
			TYPES.bytes,
			celTypes.bytes
		]] : []
	].map(([ctor, name, typeType, type]) => Object.freeze({
		name,
		typeType,
		type,
		ctor
	}));
	objTypes = objTypesDecls.map((t) => [t.name, t]);
	objTypesCtor = objTypesDecls.map((t) => [t.ctor, t]);
	invalidVar = (postfix) => /* @__PURE__ */ new Error(`Invalid variable declaration: ${postfix}`);
	invalidType = (postfix) => /* @__PURE__ */ new Error(`Invalid type declaration: ${postfix}`);
	fallbackDynEqualityMatchers = {
		"==": [{
			handler: (a, b) => a === b,
			returnType: celTypes.bool
		}],
		"!=": [{
			handler: (a, b) => a !== b,
			returnType: celTypes.bool
		}]
	};
	_parent = /* @__PURE__ */ new WeakMap();
	_typeDeclarations = /* @__PURE__ */ new WeakMap();
	_ownsVariables = /* @__PURE__ */ new WeakMap();
	_operators = /* @__PURE__ */ new WeakMap();
	_functions = /* @__PURE__ */ new WeakMap();
	_operatorsByOp = /* @__PURE__ */ new WeakMap();
	_functionsByKey = /* @__PURE__ */ new WeakMap();
	_listTypes = /* @__PURE__ */ new WeakMap();
	_mapTypes = /* @__PURE__ */ new WeakMap();
	_optionalTypes = /* @__PURE__ */ new WeakMap();
	_others = /* @__PURE__ */ new WeakMap();
	_locked = /* @__PURE__ */ new WeakMap();
	_Registry_brand = /* @__PURE__ */ new WeakSet();
	Registry = class Registry {
		constructor(opts = {}) {
			var _opts$enableOptionalT, _opts$unlistedVariabl;
			_classPrivateMethodInitSpec(this, _Registry_brand);
			_classPrivateFieldInitSpec(this, _parent, null);
			_classPrivateFieldInitSpec(this, _typeDeclarations, void 0);
			_classPrivateFieldInitSpec(this, _ownsVariables, true);
			_classPrivateFieldInitSpec(this, _operators, null);
			_classPrivateFieldInitSpec(this, _functions, null);
			_classPrivateFieldInitSpec(this, _operatorsByOp, null);
			_classPrivateFieldInitSpec(this, _functionsByKey, null);
			_classPrivateFieldInitSpec(this, _listTypes, null);
			_classPrivateFieldInitSpec(this, _mapTypes, null);
			_classPrivateFieldInitSpec(this, _optionalTypes, null);
			_classPrivateFieldInitSpec(this, _others, null);
			_classPrivateFieldInitSpec(this, _locked, false);
			this.enableOptionalTypes = (_opts$enableOptionalT = opts.enableOptionalTypes) !== null && _opts$enableOptionalT !== void 0 ? _opts$enableOptionalT : false;
			this.unlistedVariablesAreDyn = (_opts$unlistedVariabl = opts.unlistedVariablesAreDyn) !== null && _opts$unlistedVariabl !== void 0 ? _opts$unlistedVariabl : false;
			const parent = opts.parent instanceof Registry ? opts.parent : null;
			if (parent) {
				_classPrivateFieldSet2(_parent, this, parent);
				let opParent = parent;
				while (opParent && !_classPrivateFieldGet2(_operators, opParent)) opParent = _classPrivateFieldGet2(_parent, opParent);
				let fnParent = parent;
				while (fnParent && !_classPrivateFieldGet2(_functions, fnParent)) fnParent = _classPrivateFieldGet2(_parent, fnParent);
				_classPrivateFieldSet2(_operatorsByOp, this, _classPrivateFieldGet2(_operatorsByOp, parent));
				_classPrivateFieldSet2(_functionsByKey, this, _classPrivateFieldGet2(_functionsByKey, parent));
				_classPrivateFieldSet2(_others, this, {
					operators: _classPrivateFieldGet2(_operators, opParent),
					functions: _classPrivateFieldGet2(_functions, fnParent)
				});
				this.objectTypes = new Map(parent.objectTypes);
				this.objectTypesByConstructor = new Map(parent.objectTypesByConstructor);
				this.variables = parent.variables;
				_classPrivateFieldSet2(_ownsVariables, this, false);
				_classPrivateFieldSet2(_typeDeclarations, this, _classPrivateFieldGet2(_typeDeclarations, parent));
				_classPrivateFieldSet2(_listTypes, this, _classPrivateFieldGet2(_listTypes, parent));
				_classPrivateFieldSet2(_mapTypes, this, _classPrivateFieldGet2(_mapTypes, parent));
				_classPrivateFieldSet2(_optionalTypes, this, _classPrivateFieldGet2(_optionalTypes, parent));
				if (this.enableOptionalTypes !== parent.enableOptionalTypes || this.unlistedVariablesAreDyn !== parent.unlistedVariablesAreDyn) toggleOptionalTypes(this, this.enableOptionalTypes);
			} else {
				_classPrivateFieldSet2(_operators, this, []);
				_classPrivateFieldSet2(_functions, this, []);
				this.objectTypes = new Map(objTypes);
				this.objectTypesByConstructor = new Map(objTypesCtor);
				_classPrivateFieldSet2(_typeDeclarations, this, new Map(objEntries(celTypes)));
				_classPrivateFieldSet2(_listTypes, this, /* @__PURE__ */ new Map());
				_classPrivateFieldSet2(_mapTypes, this, /* @__PURE__ */ new Map());
				_classPrivateFieldSet2(_optionalTypes, this, /* @__PURE__ */ new Map());
				this.variables = /* @__PURE__ */ new Map();
				this.variables.dyn = this.unlistedVariablesAreDyn;
				for (const n in TYPES) this.registerConstant(n, "type", TYPES[n]);
			}
		}
		deleteVariable(name) {
			_assertClassBrand(_Registry_brand, this, _ensureOwnVariables).call(this);
			this.variables.delete(name);
		}
		operatorCandidates(op) {
			if (_classPrivateFieldGet2(_operatorsByOp, this)) return _assertClassBrand(_Registry_brand, this, _ensureCandiate).call(this, _classPrivateFieldGet2(_operatorsByOp, this), op);
			const c = _classPrivateFieldSet2(_operatorsByOp, this, /* @__PURE__ */ new Map());
			for (const decl of _assertClassBrand(_Registry_brand, this, _getOperators).call(this)) _assertClassBrand(_Registry_brand, this, _ensureCandiate).call(this, c, decl.operator).add(decl);
			return _assertClassBrand(_Registry_brand, this, _ensureCandiate).call(this, c, op);
		}
		functionCandidates(rec, name, argLen) {
			return _assertClassBrand(_Registry_brand, this, _functionCandidates).call(this, `${rec ? "rcall" : "call"}:${name}:${argLen}`);
		}
		registerVariable(name, type, opts) {
			if (_classPrivateFieldGet2(_locked, this)) throw new Error("Cannot modify frozen registry");
			let description = opts === null || opts === void 0 ? void 0 : opts.description;
			let value;
			if (typeof name === "string" && typeof type === "object" && !(type instanceof TypeDeclaration)) {
				description = type.description;
				value = type.value;
				if (type.schema) type = this.registerType({
					name: `$${name}`,
					schema: type.schema
				}).type;
				else type = type.type;
			} else if (typeof name === "object") {
				if (name.schema) type = this.registerType({
					name: `$${name.name}`,
					schema: name.schema
				}).type;
				else type = name.type;
				description = name.description;
				value = name.value;
				name = name.name;
			}
			if (typeof name !== "string" || !name) throw invalidVar(`name must be a string`);
			if (RESERVED.has(name)) throw invalidVar(`'${name}' is a reserved name`);
			if (this.variables.get(name) !== void 0) throw invalidVar(`'${name}' is already registered`);
			if (typeof type === "string") type = this.getType(type);
			else if (!(type instanceof TypeDeclaration)) throw invalidVar(`type is required`);
			_assertClassBrand(_Registry_brand, this, _ensureOwnVariables).call(this);
			this.variables.set(name, new VariableDeclaration(name, type, description, value));
			return this;
		}
		registerConstant(name, type, value) {
			if (typeof name === "object") this.registerVariable(name);
			else this.registerVariable({
				name,
				type,
				value
			});
			return this;
		}
		getType(typename) {
			return _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, typename, true);
		}
		getListType(type) {
			return _classPrivateFieldGet2(_listTypes, this).get(type) || _classPrivateFieldGet2(_listTypes, this).set(type, _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, `list<${type}>`, true)).get(type);
		}
		getMapType(a, b) {
			var _classPrivateFieldGet7;
			return ((_classPrivateFieldGet7 = _classPrivateFieldGet2(_mapTypes, this).get(a)) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.get(b)) || (_classPrivateFieldGet2(_mapTypes, this).get(a) || _classPrivateFieldGet2(_mapTypes, this).set(a, /* @__PURE__ */ new Map()).get(a)).set(b, _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, `map<${a}, ${b}>`, true)).get(b);
		}
		getOptionalType(type) {
			return _classPrivateFieldGet2(_optionalTypes, this).get(type) || _classPrivateFieldGet2(_optionalTypes, this).set(type, _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, `optional<${type}>`, true)).get(type);
		}
		assertType(typename, type, signature) {
			try {
				return _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, typename, true);
			} catch (e) {
				e.message = `Invalid ${type} '${e.unknownType || typename}' in '${signature}'`;
				throw e;
			}
		}
		getFunctionType(typename) {
			if (typename === "ast") return astType;
			const t = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, typename, true);
			if (t.kind === "dyn" && t.valueType) throw new Error(`type '${t.name}' is not supported`);
			return t;
		}
		registerType(name, _d) {
			var _d$ctor;
			if (_classPrivateFieldGet2(_locked, this)) throw new Error("Cannot modify frozen registry");
			if (typeof name === "object") _d = name, name = _d.fullName || _d.name || ((_d$ctor = _d.ctor) === null || _d$ctor === void 0 ? void 0 : _d$ctor.name);
			if (typeof name === "string" && name[0] === ".") name = name.slice(1);
			if (typeof name !== "string" || name.length < 2 || RESERVED.has(name)) throw invalidType(`name '${name}' is not valid`);
			if (this.objectTypes.has(name)) throw invalidType(`type '${name}' already registered`);
			const type = _assertClassBrand(_Registry_brand, this, _parseTypeString).call(this, name, false);
			if (type.kind !== "message") throw invalidType(`type '${name}' is not valid`);
			const decl = {
				name,
				typeType: new Type(name),
				type,
				ctor: typeof _d === "function" ? _d : _d === null || _d === void 0 ? void 0 : _d.ctor,
				convert: typeof _d === "function" ? void 0 : _d === null || _d === void 0 ? void 0 : _d.convert,
				fields: typeof (_d === null || _d === void 0 ? void 0 : _d.schema) === "object" ? _assertClassBrand(_Registry_brand, this, _normalizeFields).call(this, name, _assertClassBrand(_Registry_brand, this, _registerSchemaAsType).call(this, name, _d.schema)) : _assertClassBrand(_Registry_brand, this, _normalizeFields).call(this, name, typeof _d === "function" ? void 0 : _d === null || _d === void 0 ? void 0 : _d.fields)
			};
			if (typeof decl.ctor !== "function") {
				if (!decl.fields) throw invalidType(`type '${name}' requires a constructor or fields`);
				Object.assign(decl, _assertClassBrand(_Registry_brand, this, _createDefaultConvert).call(this, name, decl.fields));
			}
			this.objectTypes.set(name, Object.freeze(decl));
			this.objectTypesByConstructor.set(decl.ctor, decl);
			this.registerFunctionOverload(`type(${name}): type`, () => decl.typeType, { async: false });
			return decl;
		}
		findMacro(name, hasReceiver, argLen) {
			return this.functionCandidates(hasReceiver, name, argLen).macro;
		}
		findUnaryOverload(op, left) {
			return this.operatorCandidates(op).findUnaryOverload(left);
		}
		findBinaryOverload(op, left, right) {
			return this.operatorCandidates(op).findBinaryOverload(left, right);
		}
		clone(opts) {
			_classPrivateFieldSet2(_locked, this, true);
			return new Registry({
				parent: this,
				unlistedVariablesAreDyn: opts.unlistedVariablesAreDyn,
				enableOptionalTypes: opts.enableOptionalTypes
			});
		}
		getDefinitions() {
			const variables = [];
			const functions = [];
			for (const [, varDecl] of this.variables) {
				if (!varDecl) continue;
				variables.push({
					name: varDecl.name,
					description: varDecl.description || null,
					type: varDecl.type.name
				});
			}
			for (const decl of _assertClassBrand(_Registry_brand, this, _getFunctions).call(this)) functions.push({
				signature: decl.signature,
				name: decl.name,
				description: decl.description,
				receiverType: decl.receiverType ? decl.receiverType.name : null,
				returnType: decl.returnType.name,
				params: decl.params.map((p) => ({
					name: p.name,
					type: p.type.name,
					description: p.description
				}))
			});
			return {
				variables,
				functions
			};
		}
		registerFunctionOverload(s, handler, opts) {
			var _opts$signature;
			if (_classPrivateFieldGet2(_locked, this)) throw new Error("Cannot modify frozen registry");
			if (typeof s === "object") opts = s;
			else if (typeof handler === "object") opts = handler;
			else if (!opts) opts = {};
			const sig = typeof s === "string" ? s : (_opts$signature = opts.signature) !== null && _opts$signature !== void 0 ? _opts$signature : void 0;
			const parsed = sig !== void 0 ? _assertClassBrand(_Registry_brand, this, _parseSignature).call(this, sig) : void 0;
			const name = (parsed === null || parsed === void 0 ? void 0 : parsed.name) || opts.name;
			const receiverType = (parsed === null || parsed === void 0 ? void 0 : parsed.receiverType) || opts.receiverType;
			const argTypes = parsed === null || parsed === void 0 ? void 0 : parsed.argTypes;
			const returnType = (parsed === null || parsed === void 0 ? void 0 : parsed.returnType) || opts.returnType;
			const params = opts.params;
			handler = typeof handler === "function" ? handler : opts.handler;
			let dec;
			try {
				if (!name) throw new Error(`signature or name are required`);
				if (!returnType) throw new Error(`must have a returnType`);
				if (params) {
					if (argTypes && params.length !== argTypes.length) throw new Error(`mismatched length in params and args in signature`);
				} else if (!argTypes) throw new Error(`signature or params are required`);
				dec = new FunctionDeclaration({
					name,
					async: opts === null || opts === void 0 ? void 0 : opts.async,
					receiverType: receiverType ? this.getType(receiverType) : null,
					returnType: this.getType(returnType),
					handler,
					description: opts.description,
					params: (argTypes || params).map((_, i) => _assertClassBrand(_Registry_brand, this, _normalizeParam).call(this, i, argTypes === null || argTypes === void 0 ? void 0 : argTypes[i], params === null || params === void 0 ? void 0 : params[i]))
				});
			} catch (e) {
				if (typeof sig === "string") e.message = `Invalid function declaration '${sig}': ${e.message}`;
				else if (name) e.message = `Invalid function declaration '${name}': ${e.message}`;
				else e.message = `Invalid function declaration: ${e.message}`;
				throw e;
			}
			_assertClassBrand(_Registry_brand, this, _checkOverlappingSignatures).call(this, dec);
			_assertClassBrand(_Registry_brand, this, _pushFunction).call(this, dec);
		}
		registerOperatorOverload(string, handler, opts) {
			const unaryParts = string.match(/^([-!])([\w.<>]+)(?::\s*([\w.<>]+))?$/);
			if (unaryParts) {
				const [, op, operandType, returnType] = unaryParts;
				return this.unaryOverload(op, operandType, handler, returnType, opts === null || opts === void 0 ? void 0 : opts.async);
			}
			const parts = string.match(/^([\w.<>]+) ([-+*%/]|==|!=|<|<=|>|>=|in) ([\w.<>]+)(?::\s*([\w.<>]+))?$/);
			if (!parts) throw new Error(`Operator overload invalid: ${string}`);
			const [, leftType, op, rightType, returnType] = parts;
			return this.binaryOverload(leftType, op, rightType, handler, returnType);
		}
		unaryOverload(op, typeStr, handler, returnTypeStr, async) {
			if (_classPrivateFieldGet2(_locked, this)) throw new Error("Cannot modify frozen registry");
			const leftType = this.assertType(typeStr, "type", `${op}${typeStr}`);
			const returnType = this.assertType(returnTypeStr || typeStr, "return type", `${op}${typeStr}: ${returnTypeStr || typeStr}`);
			const d = new OperatorDeclaration({
				op: `${op}_`,
				leftType,
				returnType,
				handler,
				async
			});
			_assertClassBrand(_Registry_brand, this, _pushOperator).call(this, _assertClassBrand(_Registry_brand, this, _assertOverload).call(this, d));
		}
		binaryOverload(leftTypeStr, op, rightTypeStr, handler, returnTypeStr, async) {
			var _returnTypeStr;
			if (_classPrivateFieldGet2(_locked, this)) throw new Error("Cannot modify frozen registry");
			(_returnTypeStr = returnTypeStr) !== null && _returnTypeStr !== void 0 || (returnTypeStr = isRelational.has(op) ? "bool" : leftTypeStr);
			const sig = `${leftTypeStr} ${op} ${rightTypeStr}: ${returnTypeStr}`;
			let leftType = this.assertType(leftTypeStr, "left type", sig);
			let rightType = this.assertType(rightTypeStr, "right type", sig);
			const returnType = this.assertType(returnTypeStr, "return type", sig);
			if (leftType.kind === "dyn" && leftType.valueType) rightType = rightType.wrappedType;
			else if (rightType.kind === "dyn" && rightType.valueType) leftType = leftType.wrappedType;
			if (isRelational.has(op) && returnType.type !== "bool") throw new Error(`Comparison operator '${op}' must return 'bool', got '${returnType.type}'`);
			const dec = new OperatorDeclaration({
				op,
				leftType,
				rightType,
				returnType,
				handler,
				async
			});
			if (dec.hasPlaceholderType && !(rightType.hasPlaceholderType && leftType.hasPlaceholderType)) throw new Error(`Operator overload with placeholders must use them in both left and right types: ${sig}`);
			_assertClassBrand(_Registry_brand, this, _assertOverload).call(this, dec);
			if (op === "==") {
				const declarations = [new OperatorDeclaration({
					op: "!=",
					leftType,
					rightType,
					handler(a, b, ast, ev) {
						return !handler(a, b, ast, ev);
					},
					returnType,
					async
				})];
				if (leftType !== rightType) declarations.push(new OperatorDeclaration({
					op: "==",
					leftType: rightType,
					rightType: leftType,
					handler(a, b, ast, ev) {
						return handler(b, a, ast, ev);
					},
					returnType,
					async
				}), new OperatorDeclaration({
					op: "!=",
					leftType: rightType,
					rightType: leftType,
					handler(a, b, ast, ev) {
						return !handler(b, a, ast, ev);
					},
					returnType,
					async
				}));
				for (const decl of declarations) _assertClassBrand(_Registry_brand, this, _assertOverload).call(this, decl);
				for (const decl of declarations) _assertClassBrand(_Registry_brand, this, _pushOperator).call(this, decl);
			}
			_assertClassBrand(_Registry_brand, this, _pushOperator).call(this, dec);
		}
	};
	isRelational = new Set([
		"<",
		"<=",
		">",
		">=",
		"==",
		"!=",
		"in"
	]);
	_vars = /* @__PURE__ */ new WeakMap();
	_contextObj = /* @__PURE__ */ new WeakMap();
	_contextMap = /* @__PURE__ */ new WeakMap();
	_convertCache = /* @__PURE__ */ new WeakMap();
	RootContext = class {
		constructor(registry, context) {
			_classPrivateFieldInitSpec(this, _vars, void 0);
			_classPrivateFieldInitSpec(this, _contextObj, void 0);
			_classPrivateFieldInitSpec(this, _contextMap, void 0);
			_classPrivateFieldInitSpec(this, _convertCache, void 0);
			_classPrivateFieldSet2(_vars, this, registry.variables);
			if (context === void 0 || context === null) return;
			if (typeof context !== "object") throw evaluationError("invalid_context", "Context must be an object");
			if (context instanceof Map) _classPrivateFieldSet2(_contextMap, this, context);
			else _classPrivateFieldSet2(_contextObj, this, context);
		}
		getValue(key) {
			var _classPrivateFieldGet9, _classPrivateFieldGet10;
			return ((_classPrivateFieldGet9 = _classPrivateFieldGet2(_convertCache, this)) === null || _classPrivateFieldGet9 === void 0 ? void 0 : _classPrivateFieldGet9.get(key)) || (_classPrivateFieldGet2(_contextObj, this) ? _classPrivateFieldGet2(_contextObj, this)[key] : (_classPrivateFieldGet10 = _classPrivateFieldGet2(_contextMap, this)) === null || _classPrivateFieldGet10 === void 0 ? void 0 : _classPrivateFieldGet10.get(key));
		}
		getVariable(name) {
			var _this$vars$get;
			return (_this$vars$get = _classPrivateFieldGet2(_vars, this).get(name)) !== null && _this$vars$get !== void 0 ? _this$vars$get : _classPrivateFieldGet2(_vars, this).dyn && !RESERVED.has(name) ? new VariableDeclaration(name, dynType$1) : void 0;
		}
		getCheckedValue(ev, ast) {
			const v = this.getValue(ast.args);
			if (v === void 0) throw ev.createError("unknown_variable", `Unknown variable: ${ast.args}`, ast);
			if (ast.checkedType.matchesValueType(v, ev)) return v;
			const type = ast.checkedType;
			const valueType = ev.debugType(v);
			if (type.kind === "message" && valueType.kind === "map") {
				var _ev$objectTypes$get, _ev$objectTypes$get$c, _classPrivateFieldGet11;
				const c = (_ev$objectTypes$get = ev.objectTypes.get(type.name)) === null || _ev$objectTypes$get === void 0 || (_ev$objectTypes$get$c = _ev$objectTypes$get.convert) === null || _ev$objectTypes$get$c === void 0 ? void 0 : _ev$objectTypes$get$c.call(_ev$objectTypes$get, v);
				if (c) return ((_classPrivateFieldGet11 = _classPrivateFieldGet2(_convertCache, this)) !== null && _classPrivateFieldGet11 !== void 0 ? _classPrivateFieldGet11 : _classPrivateFieldSet2(_convertCache, this, /* @__PURE__ */ new Map())).set(ast.args, c), c;
			}
			throw ev.createError("variable_type_mismatch", `Variable '${ast.args}' is not of type '${type}', got '${valueType}'`, ast);
		}
		forkWithVariable(iterVar, iterType) {
			return new OverlayContext(this, iterVar, iterType);
		}
	};
	_parent2 = /* @__PURE__ */ new WeakMap();
	OverlayContext = class OverlayContext {
		constructor(parent, iterVar, iterType) {
			_classPrivateFieldInitSpec(this, _parent2, void 0);
			_defineProperty(this, "accuType", void 0);
			_defineProperty(this, "accuValue", void 0);
			_defineProperty(this, "iterValue", void 0);
			_classPrivateFieldSet2(_parent2, this, parent);
			this.iterVar = iterVar;
			this.iterType = iterType;
		}
		forkWithVariable(iterVar, iterType) {
			return new OverlayContext(this, iterVar, iterType);
		}
		reuse(parent) {
			if (!this.async) return _classPrivateFieldSet2(_parent2, this, parent), this;
			const ctx = new OverlayContext(parent, this.iterVar, this.iterType);
			ctx.accuType = this.accuType;
			return ctx;
		}
		setIterValue(v, ev) {
			if (this.iterType.matchesValueType(v, ev)) return this.iterValue = v, this;
			const type = this.iterType;
			const valueType = ev.debugType(v);
			if (type.kind === "message" && valueType.kind === "map") {
				var _ev$objectTypes$get2, _ev$objectTypes$get2$;
				const c = (_ev$objectTypes$get2 = ev.objectTypes.get(type.name)) === null || _ev$objectTypes$get2 === void 0 || (_ev$objectTypes$get2$ = _ev$objectTypes$get2.convert) === null || _ev$objectTypes$get2$ === void 0 ? void 0 : _ev$objectTypes$get2$.call(_ev$objectTypes$get2, v);
				if (c) return this.iterValue = c, this;
			}
			throw ev.createError("variable_type_mismatch", `Variable '${this.iterVar}' is not of type '${type}', got '${valueType}'`);
		}
		setAccuType(type) {
			return this.accuType = type, this;
		}
		setAccuValue(v) {
			return this.accuValue = v, this;
		}
		getValue(key) {
			return this.iterVar === key ? this.iterValue : _classPrivateFieldGet2(_parent2, this).getValue(key);
		}
		getCheckedValue(ev, ast) {
			if (this.iterVar === ast.args) return this.iterValue;
			return _classPrivateFieldGet2(_parent2, this).getCheckedValue(ev, ast);
		}
		getVariable(name) {
			if (this.iterVar === name) return new VariableDeclaration(name, this.iterType);
			return _classPrivateFieldGet2(_parent2, this).getVariable(name);
		}
	};
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/asyncToGenerator.js
function asyncGeneratorStep(n, t, e, r, o, a, c) {
	try {
		var i = n[a](c), u = i.value;
	} catch (n) {
		e(n);
		return;
	}
	i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
	return function() {
		var t = this, e = arguments;
		return new Promise(function(r, o) {
			var a = n.apply(t, e);
			function _next(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
			}
			function _throw(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
			}
			_next(void 0);
		});
	};
}
var init_asyncToGenerator = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/operators.js
function unsupportedType(self, type) {
	throw self.createError("unsupported_type", `Unsupported type: ${type}`);
}
function maybeAsync(l, r, h) {
	if (r === true || r && ((r === null || r === void 0 ? void 0 : r.maybeAsync) || maybeAsyncArray(r))) return maybeAsyncBoth(h);
	if (l === true || l && ((l === null || l === void 0 ? void 0 : l.maybeAsync) || maybeAsyncArray(l))) return maybeAsyncFirst(h);
	return h;
}
function maybeAsyncBoth(handler) {
	var _handler$__asyncBoth;
	return (_handler$__asyncBoth = handler.__asyncBoth) !== null && _handler$__asyncBoth !== void 0 ? _handler$__asyncBoth : handler.__asyncBoth = function handle(a, b, c, d) {
		if (!(a instanceof Promise || b instanceof Promise)) return handler(a, b, c, d);
		if (!(b instanceof Promise)) return a.then((_a) => handler(_a, b, c, d));
		if (!(a instanceof Promise)) return b.then((_b) => handler(a, _b, c, d));
		return Promise.all([a, b]).then((p) => handler(p[0], p[1], c, d));
	};
}
function maybeAsyncFirst(handler) {
	var _handler$__asyncFirst;
	return (_handler$__asyncFirst = handler.__asyncFirst) !== null && _handler$__asyncFirst !== void 0 ? _handler$__asyncFirst : handler.__asyncFirst = function handle(a, b, c, d) {
		if (a instanceof Promise) return a.then((_a) => handler(_a, b, c, d));
		return handler(a, b, c, d);
	};
}
function checkAccessNode(chk, ast, ctx) {
	ast.right = ast.args[1];
	const leftType = chk.check(ast.left = ast.args[0], ctx);
	if (ast.op === "[]") chk.check(ast.right, ctx);
	ast.handle = maybeAsync(ast.left, ast.op === "[]" ? ast.right : false, leftType !== dynType ? fieldAccessStatic : fieldAccess);
	if (leftType.kind !== "optional") return chk.checkAccessOnType(ast, ctx, leftType);
	return chk.registry.getOptionalType(chk.checkAccessOnType(ast, ctx, leftType.valueType, true));
}
function checkOptionalAccessNode(chk, ast, ctx) {
	ast.right = ast.args[1];
	const leftType = chk.check(ast.left = ast.args[0], ctx);
	if (ast.op === "[?]") chk.check(ast.right, ctx);
	ast.handle = maybeAsync(ast.left, ast.op === "[?]" ? ast.right : false, oFieldAccess);
	const actualType = leftType.kind === "optional" ? leftType.valueType : leftType;
	return chk.registry.getOptionalType(chk.checkAccessOnType(ast, ctx, actualType, true));
}
function checkElementHomogenous(chk, ctx, expected, el, code) {
	const type = chk.check(el, ctx);
	if (type === expected || expected.isEmpty()) return type;
	if (type.isEmpty()) return expected;
	throw chk.createError(code, `${HOMOGENEOUS_PREFIX[code]} expected type '${chk.formatType(expected)}' but found '${chk.formatType(type)}'`, el);
}
function checkElement(chk, ctx, expected, el) {
	return expected.unify(chk.registry, chk.check(el, ctx)) || dynType;
}
function ternaryConditionError(ev, value, node) {
	const type = ev.debugRuntimeType(value);
	return ev.createError("invalid_condition_type", `${node.meta.label || "Ternary condition must be bool"}, got '${type}'`, node);
}
function handleTernary(c, ev, ast, ctx) {
	if (c === true) return ev.eval(ast.left, ctx);
	if (c === false) return ev.eval(ast.right, ctx);
	throw ternaryConditionError(ev, c, ast.condition);
}
function logicalOperandError(ev, value, node) {
	const type = ev.debugRuntimeType(value);
	return ev.createError("invalid_logical_operand", `Logical operator requires bool operands, got '${type}'`, node);
}
function logicalValueOrErr(ev, v, node) {
	if (v instanceof Error) return v;
	return logicalOperandError(ev, v, node);
}
function _logicalOp(exp, ev, ast, left, right) {
	if (right === exp) return exp;
	if (right === !exp) {
		if (left === right) return right;
		throw logicalValueOrErr(ev, left, ast.left);
	}
	if (right instanceof Promise) return right.then((r) => _logicalOpAsync(exp, ev, ast, left, r));
	throw logicalOperandError(ev, right, ast.left);
}
function _logicalOpAsync(exp, ev, ast, left, right) {
	if (right === exp) return exp;
	if (typeof right !== "boolean") throw logicalOperandError(ev, right, ast.right);
	if (typeof left !== "boolean") throw logicalValueOrErr(ev, left, ast.left);
	return !exp;
}
function checkLogicalOp(chk, ast, ctx) {
	const leftType = chk.check(ast.left = ast.args[0], ctx);
	const rightType = chk.check(ast.right = ast.args[1], ctx);
	if (!leftType.isDynOrBool()) throw chk.createError("invalid_logical_operand", `Logical operator requires bool operands, got '${chk.formatType(leftType)}'`, ast);
	if (!rightType.isDynOrBool()) throw chk.createError("invalid_logical_operand", `Logical operator requires bool operands, got '${chk.formatType(rightType)}'`, ast);
	return chk.boolType;
}
function checkUnary(chk, ast, ctx) {
	const op = ast.op;
	const right = chk.check(ast.args, ctx);
	ast.candidates = chk.registry.operatorCandidates(op);
	if (right.kind === "dyn") {
		ast.handle = maybeAsync(ast.args, false, handleUnary);
		return ast.candidates.returnType;
	}
	const overload = ast.candidates.findUnaryOverload(right);
	if (!overload) throw chk.createError("no_such_overload", `no such overload: ${op[0]}${chk.formatType(right)}`, ast);
	ast.handle = maybeAsync(ast.args, false, overload.handler);
	return overload.returnType;
}
function handleUnary(left, ast, ev) {
	const leftType = ev.debugRuntimeType(left, ast.args.checkedType);
	const overload = ast.candidates.findUnaryOverload(leftType);
	if (overload) return overload.handler(left);
	throw ev.createError("no_such_overload", `no such overload: ${ast.op[0]}${leftType}`, ast);
}
function evaluateUnary(ev, ast, ctx) {
	return ast.handle(ev.eval(ast.args, ctx), ast, ev);
}
function checkBinary(chk, ast, ctx) {
	const op = ast.op;
	const left = chk.check(ast.left = ast.args[0], ctx);
	const right = chk.check(ast.right = ast.args[1], ctx);
	ast.candidates = chk.registry.operatorCandidates(op);
	const overload = left.hasDynType || right.hasDynType ? void 0 : ast.candidates.findBinaryOverload(left, right);
	ast.handle = maybeAsync(ast.left, ast.right, (overload === null || overload === void 0 ? void 0 : overload.handler) || handleBinary);
	if (overload) return overload.returnType;
	const type = ast.candidates.checkBinaryOverload(left, right);
	if (!left.hasDynType) ast.leftStaticType = left;
	if (!right.hasDynType) ast.rightStaticType = right;
	if (type) return type;
	throw chk.createError("no_such_overload", `no such overload: ${chk.formatType(left)} ${op} ${chk.formatType(right)}`, ast);
}
function evaluateBinary(ev, ast, ctx) {
	return ast.handle(ev.eval(ast.left, ctx), ev.eval(ast.right, ctx), ast, ev);
}
function evaluateBinaryFirst(ev, ast, ctx) {
	return ast.handle(ev.eval(ast.left, ctx), ast.right, ast, ev);
}
function handleBinary(left, right, ast, ev) {
	const leftType = ast.leftStaticType || ev.debugTypeDeep(left).wrappedType;
	const rightType = ast.rightStaticType || ev.debugTypeDeep(right).wrappedType;
	const overload = ast.candidates.findBinaryOverload(leftType, rightType);
	if (overload) return overload.handler(left, right, ast, ev);
	throw ev.createError("no_such_overload", `no such overload: ${leftType} ${ast.op} ${rightType}`, ast);
}
function callFunctionHandler(handler, ev, args, ast) {
	try {
		const result = handler.apply(ev, args);
		if (result instanceof Promise) return result.catch((error) => {
			throw attachErrorAst(error, ast);
		});
		return result;
	} catch (error) {
		throw attachErrorAst(error, ast);
	}
}
function callFn(args, ast, ev) {
	const argAst = ast.args[1];
	const types = ast.argTypes;
	let i = argAst.length;
	while (i--) types[i] = ev.debugRuntimeType(args[i], argAst[i].checkedType);
	const decl = ast.candidates.findFunction(types);
	if (decl) return callFunctionHandler(decl.handler, ev, args, ast);
	throw ev.createError("no_matching_overload", `found no matching overload for '${ast.args[0]}(${types.map((t) => t.unwrappedType).join(", ")})'`, ast);
}
function callRecFn(args, ev, ast) {
	const [, receiverAst, argAst] = ast.args;
	const types = ast.argTypes;
	for (let i = 0; i < types.length; i++) types[i] = ev.debugRuntimeType(args[i + 1], argAst[i].checkedType);
	const receiverType = ev.debugRuntimeType(args[0], receiverAst.checkedType);
	const decl = ast.candidates.findFunction(types, receiverType);
	if (decl) return callFunctionHandler(decl.handler, ev, args, ast);
	throw ev.createError("no_matching_overload", `found no matching overload for '${receiverType.type}.${ast.args[0]}(${types.map((t) => t.unwrappedType).join(", ")})'`, ast);
}
function resolveAstArray(ev, astArray, ctx, i = astArray.length) {
	var _async;
	if (i === 0) return [];
	let async;
	const results = new Array(i);
	while (i--) if ((results[i] = ev.eval(astArray[i], ctx)) instanceof Promise) (_async = async) !== null && _async !== void 0 || (async = true);
	return async ? Promise.all(results) : results;
}
function safeFromEntries(entries) {
	const obj = {};
	for (let i = 0; i < entries.length; i++) {
		const [k, v] = entries[i];
		if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
		obj[k] = v;
	}
	return obj;
}
function comprehensionElementType(chk, iterable, ctx) {
	const iterType = chk.check(iterable, ctx);
	if (iterType.kind === "dyn") return iterType;
	if (iterType.kind === "list") return iterType.valueType;
	if (iterType.kind === "map") return iterType.keyType;
	throw chk.createError("invalid_comprehension_range", `Expression of type '${chk.formatType(iterType)}' cannot be range of a comprehension (must be list, map, or dynamic).`, iterable);
}
function toIterable(ev, args, coll) {
	if (coll instanceof Set) return [...coll];
	if (coll instanceof Map) return [...coll.keys()];
	if (coll && typeof coll === "object") return objKeys(coll);
	throw ev.createError("invalid_comprehension_range", `Expression of type '${ev.debugType(coll)}' cannot be range of a comprehension (must be list, map, or dynamic).`, args.iterable);
}
function runQualifier(items, args, ev, ctx) {
	if (!isArray(items)) items = toIterable(ev, args, items);
	const accu = ev.eval(args.init, ctx = args.iterCtx.reuse(ctx));
	ctx.accuValue = accu;
	if (ctx === args.iterCtx) return iterateQuantifier(ev, ctx, args, items, accu, 0);
	return continueQuantifier(ev, ctx, args, items, accu, 0);
}
function runComprehension(items, args, ev, ctx) {
	if (!isArray(items)) items = toIterable(ev, args, items);
	const accu = ev.eval(args.init, ctx = args.iterCtx.reuse(ctx));
	ctx.accuValue = accu;
	if (ctx === args.iterCtx) return iterateLoop(ev, ctx, args, items, accu, 0);
	return continueLoop(ev, ctx, args, items, accu, 0);
}
function iterateLoop(ev, ctx, args, items, accu, i) {
	const condition = args.condition;
	const step = args.step;
	const len = items.length;
	while (i < len) {
		if (condition && !condition(accu)) break;
		accu = ev.eval(step, ctx.setIterValue(items[i++], ev));
		if (accu instanceof Promise) return continueLoop(ev, ctx, args, items, accu, i);
	}
	return args.result(accu);
}
function continueLoop(_x, _x2, _x3, _x4, _x5, _x6) {
	return _continueLoop.apply(this, arguments);
}
function _continueLoop() {
	_continueLoop = _asyncToGenerator(function* (ev, ctx, args, items, accu, i) {
		if (ctx === args.iterCtx) ctx.async = true;
		const condition = args.condition;
		const step = args.step;
		const len = items.length;
		accu = yield accu;
		while (i < len) {
			if (condition && !condition(accu)) return args.result(accu);
			accu = ev.eval(step, ctx.setIterValue(items[i++], ev));
			if (accu instanceof Promise) accu = yield accu;
		}
		return args.result(accu);
	});
	return _continueLoop.apply(this, arguments);
}
function iterateQuantifier(ev, ctx, args, items, accu, i, error, stp) {
	const condition = args.condition;
	const step = args.step;
	const len = items.length;
	while (i < len) {
		var _error;
		if (!condition(accu)) return args.result(accu);
		stp = ev.tryEval(step, ctx.setIterValue(items[i++], ev));
		if (stp instanceof Promise) return continueQuantifier(ev, ctx, args, items, accu, i, error, stp);
		if (stp instanceof Error && ((_error = error) !== null && _error !== void 0 ? _error : error = stp)) continue;
		accu = stp;
	}
	if (error && condition(accu)) throw error;
	return args.result(accu);
}
function continueQuantifier(_x7, _x8, _x9, _x10, _x11, _x12, _x13, _x14) {
	return _continueQuantifier.apply(this, arguments);
}
function _continueQuantifier() {
	_continueQuantifier = _asyncToGenerator(function* (ev, ctx, args, items, accu, i, error, stp) {
		var _error2;
		if (ctx === args.iterCtx) ctx.async = true;
		const condition = args.condition;
		const step = args.step;
		const len = items.length;
		stp = yield stp;
		if (stp instanceof Error) (_error2 = error) !== null && _error2 !== void 0 || (error = stp);
		else accu = stp;
		while (i < len) {
			var _error3;
			if (!condition(accu)) return args.result(accu);
			stp = ev.tryEval(step, ctx.setIterValue(items[i++], ev));
			if (stp instanceof Promise) stp = yield stp;
			if (stp instanceof Error && ((_error3 = error) !== null && _error3 !== void 0 ? _error3 : error = stp)) continue;
			accu = stp;
		}
		if (error && condition(accu)) throw error;
		return args.result(accu);
	});
	return _continueQuantifier.apply(this, arguments);
}
function oFieldAccess(left, right, ast, ev) {
	return ev.optionalType.field(left, right, ast, ev);
}
function fieldAccessStatic(left, right, ast, ev) {
	return ast.left.checkedType.field(left, right, ast, ev);
}
function fieldAccess(left, right, ast, ev) {
	switch (left === null || left === void 0 ? void 0 : left.constructor) {
		case void 0:
		case Object: {
			const v = hasOwn(left || empty, right) ? left[right] : void 0;
			if (v !== void 0) return ev.debugType(v), v;
			break;
		}
		case Map: {
			const v = left.get(right);
			if (v !== void 0) return ev.debugType(v), v;
			break;
		}
		case Array:
		case Set: return ev.listType.field(left, right, ast, ev);
		default:
			const t = ev.objectTypesByConstructor.get(left.constructor);
			if (t) return t.type.field(left, right, ast, ev);
			else if (typeof left === "object") unsupportedType(ev, left.constructor.name);
	}
	throw ev.createError("no_such_key", `No such key: ${right}`, ast);
}
var dynType, Base, maybeAsyncArray, HOMOGENEOUS_PREFIX, empty, emptyList, emptyMap, OPERATORS;
var init_operators = __esmMin((() => {
	init_registry();
	init_globals();
	init_errors();
	init_defineProperty();
	init_asyncToGenerator();
	dynType = celTypes.dyn;
	Base = class {
		constructor(opts) {
			_defineProperty(this, "dynType", celTypes.dyn);
			_defineProperty(this, "optionalType", celTypes.optional);
			_defineProperty(this, "stringType", celTypes.string);
			_defineProperty(this, "intType", celTypes.int);
			_defineProperty(this, "doubleType", celTypes.double);
			_defineProperty(this, "boolType", celTypes.bool);
			_defineProperty(this, "nullType", celTypes.null);
			_defineProperty(this, "listType", celTypes.list);
			_defineProperty(this, "mapType", celTypes.map);
			this.opts = opts.opts;
			this.registry = opts.registry;
			this.objectTypes = this.registry.objectTypes;
			this.objectTypesByConstructor = this.registry.objectTypesByConstructor;
		}
		/**
		* Get a TypeDeclaration instance for a type name
		* @param {string} typeName - The type name (e.g., 'string', 'int', 'dyn')
		* @returns {TypeDeclaration} The type declaration instance
		*/
		getType(typeName) {
			return this.registry.getType(typeName);
		}
		debugType(v) {
			switch (typeof v) {
				case "string": return this.stringType;
				case "bigint": return this.intType;
				case "number": return this.doubleType;
				case "boolean": return this.boolType;
				case "object":
					if (v === null) return this.nullType;
					switch (v.constructor) {
						case void 0:
						case Object:
						case Map: return this.mapType;
						case Array:
						case Set: return this.listType;
						default:
							var _this$objectTypesByCo, _v$constructor;
							return ((_this$objectTypesByCo = this.objectTypesByConstructor.get(v.constructor)) === null || _this$objectTypesByCo === void 0 ? void 0 : _this$objectTypesByCo.type) || unsupportedType(this, ((_v$constructor = v.constructor) === null || _v$constructor === void 0 ? void 0 : _v$constructor.name) || typeof v);
					}
				default: unsupportedType(this, typeof v);
			}
		}
	};
	maybeAsyncArray = (a) => Array.isArray(a) ? a.some((n) => n.maybeAsync) : false;
	HOMOGENEOUS_PREFIX = {
		heterogeneous_list_element: "List elements must have the same type,",
		heterogeneous_map_key: "Map key uses wrong type,",
		heterogeneous_map_value: "Map value uses wrong type,"
	};
	empty = Object.create(null);
	emptyList = () => [];
	emptyMap = () => ({});
	OPERATORS = {
		value: {
			check(chk, ast) {
				return chk.debugType(ast.args);
			},
			evaluate(_ev, ast) {
				return ast.args;
			}
		},
		id: {
			check(chk, ast, ctx) {
				const variable = ctx.getVariable(ast.args);
				if (!variable) throw chk.createError("unknown_variable", `Unknown variable: ${ast.args}`, ast);
				if (variable.constant) {
					const alternate = ast.clone(OPERATORS.value, variable.value);
					ast.setMeta("alternate", alternate);
					return chk.check(alternate, ctx);
				}
				return variable.type;
			},
			evaluate(ev, ast, ctx) {
				return ctx.getCheckedValue(ev, ast);
			}
		},
		".": {
			alias: "fieldAccess",
			check: checkAccessNode,
			evaluate: evaluateBinaryFirst
		},
		".?": {
			alias: "optionalFieldAccess",
			check: checkOptionalAccessNode,
			evaluate: evaluateBinaryFirst
		},
		"[]": {
			alias: "bracketAccess",
			check: checkAccessNode,
			evaluate: evaluateBinary
		},
		"[?]": {
			alias: "optionalBracketAccess",
			check: checkOptionalAccessNode,
			evaluate: evaluateBinary
		},
		call: {
			check(chk, ast, ctx) {
				var _decl$handler, _decl$handler$__handl;
				const [functionName, args] = ast.args;
				const candidates = ast.candidates = chk.registry.functionCandidates(false, functionName, args.length);
				const argTypes = ast.argTypes = args.map((a) => chk.check(a, ctx));
				const decl = candidates.findFunction(argTypes);
				if (!decl) throw chk.createError("no_matching_overload", `found no matching overload for '${functionName}(${chk.formatTypeList(argTypes)})'`, ast);
				ast.handle = maybeAsync(args, false, argTypes.some((t) => t.hasDynType) ? callFn : (_decl$handler$__handl = (_decl$handler = decl.handler).__handle) !== null && _decl$handler$__handl !== void 0 ? _decl$handler$__handl : _decl$handler.__handle = (l, _ast, e) => callFunctionHandler(decl.handler, e, l, _ast));
				return decl.returnType;
			},
			evaluate(ev, ast, ctx) {
				return ast.handle(resolveAstArray(ev, ast.args[1], ctx), ast, ev);
			}
		},
		rcall: {
			check(chk, ast, ctx) {
				const [methodName, receiver, args] = ast.args;
				const receiverType = chk.check(receiver, ctx);
				const candidates = ast.candidates = chk.registry.functionCandidates(true, methodName, args.length);
				const argTypes = ast.argTypes = args.map((a) => chk.check(a, ctx));
				ast.receiverWithArgs = [receiver, ...args];
				ast.handle = maybeAsync(ast.receiverWithArgs, false, callRecFn);
				if (receiverType.kind === "dyn" && candidates.returnType) return candidates.returnType;
				const decl = candidates.findFunction(argTypes, receiverType);
				if (!decl) throw chk.createError("no_matching_overload", `found no matching overload for '${receiverType.type}.${methodName}(${chk.formatTypeList(argTypes)})'`, ast);
				if (!receiverType.hasPlaceholderType && !argTypes.some((t) => t.hasDynType)) {
					var _fn$__handle;
					const fn = decl.handler;
					const handle = (_fn$__handle = fn.__handle) !== null && _fn$__handle !== void 0 ? _fn$__handle : fn.__handle = (a, ev, _ast) => callFunctionHandler(fn, ev, a, _ast);
					ast.handle = maybeAsync(ast.receiverWithArgs, false, handle);
				}
				return decl.returnType;
			},
			evaluate(ev, ast, ctx) {
				return ast.handle(resolveAstArray(ev, ast.receiverWithArgs, ctx), ev, ast);
			}
		},
		list: {
			check(chk, ast, ctx) {
				const arr = ast.args;
				const arrLen = arr.length;
				if (arrLen === 0) return ast.setMeta("evaluate", emptyList) && chk.getType("list<T>");
				let valueType = chk.check(arr[0], ctx);
				const check = chk.opts.homogeneousAggregateLiterals ? checkElementHomogenous : checkElement;
				for (let i = 1; i < arrLen; i++) valueType = check(chk, ctx, valueType, arr[i], "heterogeneous_list_element");
				return chk.registry.getListType(valueType);
			},
			evaluate(ev, ast, ctx) {
				return resolveAstArray(ev, ast.args, ctx);
			}
		},
		map: {
			check(chk, ast, ctx) {
				const arr = ast.args;
				const arrLen = arr.length;
				if (arrLen === 0) return ast.setMeta("evaluate", emptyMap) && chk.getType("map<K, V>");
				const check = chk.opts.homogeneousAggregateLiterals ? checkElementHomogenous : checkElement;
				let keyType = chk.check(arr[0][0], ctx);
				let valueType = chk.check(arr[0][1], ctx);
				for (let i = 1; i < arrLen; i++) {
					const e = arr[i];
					keyType = check(chk, ctx, keyType, e[0], "heterogeneous_map_key");
					valueType = check(chk, ctx, valueType, e[1], "heterogeneous_map_value");
				}
				return chk.registry.getMapType(keyType, valueType);
			},
			evaluate(ev, ast, ctx) {
				const astEntries = ast.args;
				const len = astEntries.length;
				const results = new Array(len);
				let async;
				for (let i = 0; i < len; i++) {
					const e = astEntries[i];
					const k = ev.eval(e[0], ctx);
					const v = ev.eval(e[1], ctx);
					if (k instanceof Promise || v instanceof Promise) {
						var _async2;
						results[i] = Promise.all([k, v]);
						(_async2 = async) !== null && _async2 !== void 0 || (async = true);
					} else results[i] = [k, v];
				}
				if (async) return Promise.all(results).then(safeFromEntries);
				return safeFromEntries(results);
			}
		},
		comprehension: {
			check(chk, ast, ctx) {
				const args = ast.args;
				args.iterCtx = ctx.forkWithVariable(args.iterVarName, comprehensionElementType(chk, args.iterable, ctx)).setAccuType(chk.check(args.init, ctx));
				const stepType = chk.check(args.step, args.iterCtx);
				const handler = args.errorsAreFatal ? runComprehension : runQualifier;
				ast.handle = maybeAsync(args.iterable, false, handler);
				if (args.kind === "quantifier") return chk.boolType;
				return stepType;
			},
			evaluate(ev, ast, ctx) {
				return ast.handle(ev.eval(ast.args.iterable, ctx), ast.args, ev, ctx);
			}
		},
		accuValue: {
			check(_chk, _ast, ctx) {
				return ctx.accuType;
			},
			evaluate(_ev, _ast, ctx) {
				return ctx.accuValue;
			}
		},
		accuInc: {
			check(_chk, _ast, ctx) {
				return ctx.accuType;
			},
			evaluate(_ev, _ast, ctx) {
				return ctx.accuValue += 1;
			}
		},
		accuPush: {
			check(chk, ast, ctx) {
				const listType = ctx.accuType;
				const itemType = chk.check(ast.args, ctx);
				if (!ast.args.maybeAsync) ast.setMeta("evaluate", OPERATORS.accuPush.evaluateSync);
				if (listType.kind === "list" && listType.valueType.kind !== "param") return listType;
				return chk.registry.getListType(itemType);
			},
			evaluateSync(ev, ast, ctx) {
				return ctx.accuValue.push(ev.eval(ast.args, ctx)), ctx.accuValue;
			},
			evaluate(ev, ast, ctx) {
				const arr = ctx.accuValue;
				const el = ev.eval(ast.args, ctx);
				if (el instanceof Promise) return el.then((_e) => arr.push(_e) && arr);
				arr.push(el);
				return arr;
			}
		},
		"?:": {
			alias: "ternary",
			check(chk, ast, ctx) {
				const condast = ast.condition = ast.args[0];
				const leftast = ast.left = ast.args[1];
				const rightast = ast.right = ast.args[2];
				const condType = chk.check(condast, ctx);
				if (!condType.isDynOrBool()) throw chk.createError("invalid_condition_type", `${condast.meta.label || "Ternary condition must be bool"}, got '${chk.formatType(condType)}'`, condast);
				const leftType = chk.check(leftast, ctx);
				const rightType = chk.check(rightast, ctx);
				const unified = leftType.unify(chk.registry, rightType);
				ast.handle = maybeAsync(condast, false, handleTernary);
				if (unified) return unified;
				throw chk.createError("incompatible_ternary_branches", `Ternary branches must have the same type, got '${chk.formatType(leftType)}' and '${chk.formatType(rightType)}'`, ast);
			},
			evaluate(ev, ast, ctx) {
				return ast.handle(ev.eval(ast.condition, ctx), ev, ast, ctx);
			}
		},
		"||": {
			check: checkLogicalOp,
			evaluate(ev, ast, ctx) {
				const l = ev.tryEval(ast.left, ctx);
				if (l === true) return true;
				if (l === false) {
					const right = ev.eval(ast.right, ctx);
					if (typeof right === "boolean") return right;
					return _logicalOp(true, ev, ast, l, right);
				}
				if (l instanceof Promise) return l.then((_l) => _l === true ? _l : _logicalOp(true, ev, ast, _l, ev.eval(ast.right, ctx)));
				return _logicalOp(true, ev, ast, l, ev.eval(ast.right, ctx));
			}
		},
		"&&": {
			check: checkLogicalOp,
			evaluate(ev, ast, ctx) {
				const l = ev.tryEval(ast.left, ctx);
				if (l === false) return false;
				if (l === true) {
					const right = ev.eval(ast.right, ctx);
					if (typeof right === "boolean") return right;
					return _logicalOp(false, ev, ast, l, right);
				}
				if (l instanceof Promise) return l.then((_l) => _l === false ? _l : _logicalOp(false, ev, ast, _l, ev.eval(ast.right, ctx)));
				return _logicalOp(false, ev, ast, l, ev.eval(ast.right, ctx));
			}
		},
		"!_": {
			alias: "unaryNot",
			check: checkUnary,
			evaluate: evaluateUnary
		},
		"-_": {
			alias: "unaryMinus",
			check: checkUnary,
			evaluate: evaluateUnary
		}
	};
	for (const op of [
		"!=",
		"==",
		"in",
		"+",
		"-",
		"*",
		"/",
		"%",
		"<",
		"<=",
		">",
		">="
	]) OPERATORS[op] = {
		check: checkBinary,
		evaluate: evaluateBinary
	};
	for (const op of objKeys(OPERATORS)) {
		const obj = OPERATORS[op];
		obj.name = op;
		if (obj.alias) OPERATORS[obj.alias] = obj;
	}
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/macros.js
function assertIdentifier(node, message) {
	if (node.op === "id") return node.args;
	throw parseError("invalid_macro_argument", message, node);
}
function createMapExpander(hasFilter) {
	const functionDesc = hasFilter ? "map(var, filter, transform)" : "map(var, transform)";
	const invalidMsg = `${functionDesc} invalid predicate iteration variable`;
	const label = `${functionDesc} filter predicate must return bool`;
	return ({ args, receiver, ast: callAst }) => {
		const [iterVar, predicate, transform] = hasFilter ? args : [
			args[0],
			null,
			args[1]
		];
		let step = transform.clone(OPERATORS.accuPush, transform);
		if (predicate) {
			const accuValue = predicate.clone(OPERATORS.accuValue);
			step = predicate.clone(OPERATORS.ternary, [
				predicate.setMeta("label", label),
				step,
				accuValue
			]);
		}
		return { callAst: callAst.clone(OPERATORS.comprehension, {
			errorsAreFatal: true,
			iterable: receiver,
			iterVarName: assertIdentifier(iterVar, invalidMsg),
			init: callAst.clone(OPERATORS.list, []),
			step,
			result: identity
		}) };
	};
}
function createFilterExpander() {
	const functionDesc = "filter(var, predicate)";
	const invalidMsg = `${functionDesc} invalid predicate iteration variable`;
	const label = `${functionDesc} predicate must return bool`;
	return ({ args, receiver, ast: callAst }) => {
		const iterVarName = assertIdentifier(args[0], invalidMsg);
		const accuValue = callAst.clone(OPERATORS.accuValue);
		const predicate = args[1].setMeta("label", label);
		const appendItem = callAst.clone(OPERATORS.accuPush, callAst.clone(OPERATORS.id, iterVarName));
		const step = predicate.clone(OPERATORS.ternary, [
			predicate,
			appendItem,
			accuValue
		]);
		return { callAst: callAst.clone(OPERATORS.comprehension, {
			errorsAreFatal: true,
			iterable: receiver,
			iterVarName,
			init: callAst.clone(OPERATORS.list, []),
			step,
			result: identity
		}) };
	};
}
function createQuantifierExpander(opts) {
	const invalidMsg = `${opts.name}(var, predicate) invalid predicate iteration variable`;
	const label = `${opts.name}(var, predicate) predicate must return bool`;
	return ({ args, receiver, ast: callAst }) => {
		const predicate = args[1].setMeta("label", label);
		const transform = opts.transform({
			args,
			ast: callAst,
			predicate,
			opts
		});
		return { callAst: callAst.clone(OPERATORS.comprehension, {
			kind: "quantifier",
			errorsAreFatal: opts.errorsAreFatal || false,
			iterable: receiver,
			iterVarName: assertIdentifier(args[0], invalidMsg),
			init: transform.init,
			condition: transform.condition,
			step: transform.step,
			result: transform.result || identity
		}) };
	};
}
function createHasExpander() {
	const invalidHasArgument = "has() invalid argument";
	function evaluate(ev, macro, ctx) {
		const nodes = macro.macroHasProps;
		let i = nodes.length;
		let obj = ev.eval(nodes[--i], ctx);
		let inOptionalContext;
		while (i--) {
			var _inOptionalContext;
			const node = nodes[i];
			if (node.op === ".?") (_inOptionalContext = inOptionalContext) !== null && _inOptionalContext !== void 0 || (inOptionalContext = true);
			obj = ev.debugType(obj).fieldLazy(obj, node.args[1], node, ev);
			if (obj !== void 0) continue;
			if (!(!inOptionalContext && i && node.op === ".")) break;
			throw evaluationError("no_such_key", `No such key: ${node.args[1]}`, node);
		}
		return obj !== void 0;
	}
	function typeCheck(checker, macro, ctx) {
		let node = macro.args[0];
		if (node.op !== ".") throw checker.createError("invalid_macro_argument", invalidHasArgument, node);
		if (!macro.macroHasProps) {
			const props = [];
			while (node.op === "." || node.op === ".?") node = props.push(node) && node.args[0];
			if (node.op !== "id") throw checker.createError("invalid_macro_argument", invalidHasArgument, node);
			checker.check(node, ctx);
			props.push(node);
			macro.macroHasProps = props;
		}
		return checker.getType("bool");
	}
	return function({ args }) {
		return {
			args,
			evaluate,
			typeCheck,
			async: false
		};
	};
}
function registerMacros(registry) {
	const functionOverload = (sig, handler) => registry.registerFunctionOverload(sig, handler);
	functionOverload("has(ast): bool", createHasExpander());
	functionOverload("list.all(ast, ast): bool", createQuantifierExpander({
		name: "all",
		transform({ ast: callAst, predicate, opts }) {
			return {
				init: callAst.clone(OPERATORS.value, true),
				condition: identity,
				step: predicate.clone(OPERATORS.ternary, [
					predicate,
					predicate.clone(OPERATORS.value, true),
					predicate.clone(OPERATORS.value, false)
				])
			};
		}
	}));
	functionOverload("list.exists(ast, ast): bool", createQuantifierExpander({
		name: "exists",
		condition(accu) {
			return !accu;
		},
		transform({ ast: callAst, predicate, opts }) {
			return {
				init: callAst.clone(OPERATORS.value, false),
				condition: opts.condition,
				step: predicate.clone(OPERATORS.ternary, [
					predicate,
					predicate.clone(OPERATORS.value, true),
					predicate.clone(OPERATORS.value, false)
				])
			};
		}
	}));
	functionOverload("list.exists_one(ast, ast): bool", createQuantifierExpander({
		name: "exists_one",
		errorsAreFatal: true,
		result(accu) {
			return accu === 1;
		},
		transform({ ast: callAst, predicate, opts }) {
			const accuValue = callAst.clone(OPERATORS.accuValue);
			return {
				init: callAst.clone(OPERATORS.value, 0),
				step: predicate.clone(OPERATORS.ternary, [
					predicate,
					callAst.clone(OPERATORS.accuInc),
					accuValue
				]),
				result: opts.result
			};
		}
	}));
	functionOverload("list.map(ast, ast): list<dyn>", createMapExpander(false));
	functionOverload("list.map(ast, ast, ast): list<dyn>", createMapExpander(true));
	functionOverload("list.filter(ast, ast): list<dyn>", createFilterExpander());
	class CelNamespace {}
	const celNamespace = new CelNamespace();
	registry.registerType("CelNamespace", CelNamespace);
	registry.registerConstant("cel", "CelNamespace", celNamespace);
	function bindTypeCheck(checker, m, ctx) {
		m.bindCtx = ctx.forkWithVariable(m.var, checker.check(m.val, ctx));
		const type = checker.check(m.exp, m.bindCtx);
		if (m.val.maybeAsync || m.exp.maybeAsync) return type;
		m.ast.setMeta("async", false);
		m.evaluate = bindEvaluateSync;
		return type;
	}
	function bindOptionalEvaluate(ev, exp, bindCtx, ctx, boundValue) {
		const res = ev.eval(exp, ctx = bindCtx.reuse(ctx).setIterValue(boundValue, ev));
		if (res instanceof Promise && ctx === bindCtx) ctx.async = true;
		return res;
	}
	function bindEvaluate(ev, { val, exp, bindCtx }, ctx) {
		const v = ev.eval(val, ctx);
		if (v instanceof Promise) return v.then((_v) => bindOptionalEvaluate(ev, exp, bindCtx, ctx, _v));
		return bindOptionalEvaluate(ev, exp, bindCtx, ctx, v);
	}
	function bindEvaluateSync(ev, { val, exp, bindCtx }, ctx) {
		return ev.eval(exp, bindCtx.reuse(ctx).setIterValue(ev.eval(val, ctx), ev));
	}
	functionOverload("CelNamespace.bind(ast, dyn, ast): dyn", ({ ast, args }) => {
		return {
			ast,
			var: assertIdentifier(args[0], "invalid variable argument"),
			val: args[1],
			exp: args[2],
			bindCtx: void 0,
			typeCheck: bindTypeCheck,
			evaluate: bindEvaluate
		};
	});
}
var identity;
var init_macros = __esmMin((() => {
	init_errors();
	init_operators();
	identity = (x) => x;
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/overloads.js
function registerOverloads(registry) {
	const unaryOverload = (op, t, h, ret) => registry.unaryOverload(op, t, h, ret, false);
	const binaryOverload = (l, op, r, h, ret) => registry.binaryOverload(l, op, r, h, ret, false);
	function verifyInteger(v, ast) {
		if (v <= 9223372036854775807n && v >= -9223372036854775808n) return v;
		throw evaluationError("numeric_overflow", `integer overflow: ${v}`, ast);
	}
	function throwDivisionByZero(ast) {
		throw evaluationError("division_by_zero", "division by zero", ast);
	}
	function throwModuloByZero(ast) {
		throw evaluationError("modulo_by_zero", "modulo by zero", ast);
	}
	unaryOverload("!", "bool", (a) => !a);
	unaryOverload("-", "int", (a) => -a);
	binaryOverload("dyn<int>", `==`, `double`, (a, b) => a == b);
	binaryOverload("dyn<int>", `==`, `uint`, (a, b) => a == b.valueOf());
	binaryOverload("int", "*", "int", (a, b, ast) => verifyInteger(a * b, ast));
	binaryOverload("int", "+", "int", (a, b, ast) => verifyInteger(a + b, ast));
	binaryOverload("int", "-", "int", (a, b, ast) => verifyInteger(a - b, ast));
	binaryOverload("int", "/", "int", (a, b, ast) => {
		if (b === 0n) return throwDivisionByZero(ast);
		return a / b;
	});
	binaryOverload("int", "%", "int", (a, b, ast) => {
		if (b === 0n) return throwModuloByZero(ast);
		return a % b;
	});
	unaryOverload("-", "double", (a) => -a);
	binaryOverload("double", "*", "double", (a, b) => a * b);
	binaryOverload("double", "+", "double", (a, b) => a + b);
	binaryOverload("double", "-", "double", (a, b) => a - b);
	binaryOverload("double", "/", "double", (a, b) => a / b);
	binaryOverload("string", "+", "string", (a, b) => a + b);
	binaryOverload("list<V>", "+", "list<V>", (a, b) => [...a, ...b]);
	binaryOverload("bytes", "+", "bytes", (a, b) => {
		if (!a.length) return b;
		if (!b.length) return a;
		const result = new Uint8Array(a.length + b.length);
		result.set(a, 0);
		result.set(b, a.length);
		return result;
	});
	const GPD = "google.protobuf.Duration";
	binaryOverload(GPD, "+", GPD, (a, b) => a.addDuration(b));
	binaryOverload(GPD, "-", GPD, (a, b) => a.subtractDuration(b));
	binaryOverload(GPD, "==", GPD, (a, b) => a.seconds === b.seconds && a.nanos === b.nanos);
	const GPT = "google.protobuf.Timestamp";
	binaryOverload(GPT, "==", GPT, (a, b) => a.getTime() === b.getTime());
	binaryOverload(GPT, "-", GPT, (a, b) => Duration.fromMilliseconds(a.getTime() - b.getTime()), GPD);
	binaryOverload(GPT, "-", GPD, (a, b) => b.subtractTimestamp(a));
	binaryOverload(GPT, "+", GPD, (a, b) => b.extendTimestamp(a));
	binaryOverload(GPD, "+", GPT, (a, b) => a.extendTimestamp(b));
	function listIncludes(value, list, ast, ev) {
		if (list instanceof Set && list.has(value)) return true;
		for (const v of list) if (isEqual(value, v, ast, ev)) return true;
		return false;
	}
	function mapIncludes(a, b) {
		if (b instanceof Map) return b.get(a) !== void 0;
		return hasOwn(b, a) ? b[a] !== void 0 : false;
	}
	function listMembership(value, list, ast, ev) {
		return listIncludes(value, list, ast, ev);
	}
	binaryOverload("V", "in", "list<V>", listMembership);
	binaryOverload("K", "in", "map<K, V>", mapIncludes);
	for (const t of [
		"type",
		"null",
		"bool",
		"string",
		"int",
		"double"
	]) binaryOverload(t, "==", t, (a, b) => a === b);
	binaryOverload("bytes", `==`, "bytes", (a, b) => {
		if (a === b) return true;
		let i = a.length;
		if (i !== b.length) return false;
		while (i--) if (a[i] !== b[i]) return false;
		return true;
	});
	binaryOverload("list<V>", `==`, "list<V>", (a, b, ast, ev) => {
		if (a === b) return true;
		if (isArray(a) && isArray(b)) {
			const length = a.length;
			if (length !== b.length) return false;
			for (let i = 0; i < length; i++) if (!isEqual(a[i], b[i], ast, ev)) return false;
			return true;
		}
		if (a instanceof Set && b instanceof Set) {
			if (a.size !== b.size) return false;
			for (const value of a) if (!b.has(value)) return false;
			return true;
		}
		const arr = a instanceof Set ? b : a;
		const set = a instanceof Set ? a : b;
		if (!isArray(arr)) return false;
		if (arr.length !== (set === null || set === void 0 ? void 0 : set.size)) return false;
		for (let i = 0; i < arr.length; i++) if (!set.has(arr[i])) return false;
		return true;
	});
	binaryOverload("map<K, V>", `==`, "map<K, V>", (a, b, ast, ev) => {
		if (a === b) return true;
		if (a instanceof Map && b instanceof Map) {
			if (a.size !== b.size) return false;
			for (const [key, value] of a) if (!(b.has(key) && isEqual(value, b.get(key), ast, ev))) return false;
			return true;
		}
		if (a instanceof Map || b instanceof Map) {
			const obj = a instanceof Map ? b : a;
			const map = a instanceof Map ? a : b;
			const keysObj = objKeys(obj);
			if (map.size !== keysObj.length) return false;
			for (const [key, value] of map) if (!(key in obj && isEqual(value, obj[key], ast, ev))) return false;
			return true;
		}
		const keysA = objKeys(a);
		const keysB = objKeys(b);
		if (keysA.length !== keysB.length) return false;
		for (let i = 0; i < keysA.length; i++) {
			const key = keysA[i];
			if (!(key in b && isEqual(a[key], b[key], ast, ev))) return false;
		}
		return true;
	});
	binaryOverload("uint", "==", "uint", (a, b) => a.valueOf() === b.valueOf());
	binaryOverload("dyn<uint>", `==`, `double`, (a, b) => a.valueOf() == b);
	binaryOverload("uint", "+", "uint", (a, b) => new UnsignedInt(a.valueOf() + b.valueOf()));
	binaryOverload("uint", "-", "uint", (a, b) => new UnsignedInt(a.valueOf() - b.valueOf()));
	binaryOverload("uint", "*", "uint", (a, b) => new UnsignedInt(a.valueOf() * b.valueOf()));
	binaryOverload("uint", "/", "uint", (a, b, ast) => {
		if (b.valueOf() === 0n) return throwDivisionByZero(ast);
		return new UnsignedInt(a.valueOf() / b.valueOf());
	});
	binaryOverload("uint", "%", "uint", (a, b, ast) => {
		if (b.valueOf() === 0n) return throwModuloByZero(ast);
		return new UnsignedInt(a.valueOf() % b.valueOf());
	});
	for (const [left, right] of [
		["bool", "bool"],
		["int", "int"],
		["uint", "uint"],
		["double", "double"],
		["string", "string"],
		["google.protobuf.Timestamp", "google.protobuf.Timestamp"],
		["google.protobuf.Duration", "google.protobuf.Duration"],
		["int", "uint"],
		["int", "double"],
		["double", "int"],
		["double", "uint"],
		["uint", "int"],
		["uint", "double"]
	]) {
		binaryOverload(left, "<", right, (a, b) => a < b);
		binaryOverload(left, "<=", right, (a, b) => a <= b);
		binaryOverload(left, ">", right, (a, b) => a > b);
		binaryOverload(left, ">=", right, (a, b) => a >= b);
	}
}
function isEqual(a, b, ast, ev) {
	if (a === b) return true;
	switch (typeof a) {
		case "undefined":
		case "string":
		case "boolean": return false;
		case "bigint":
			if (typeof b === "number") return a == b;
			return false;
		case "number":
			if (typeof b === "bigint") return a == b;
			return false;
		case "object":
			if (typeof b !== "object") return false;
			const leftType = ev.debugType(a);
			const rightType = ev.debugType(b);
			if (leftType !== rightType) return false;
			const overload = ev.registry.findBinaryOverload("==", leftType, rightType);
			if (!overload) return false;
			return overload.handler(a, b, ast, ev);
	}
	throw evaluationError("invalid_comparison_type", `Cannot compare values of type ${typeof a}`, ast);
}
var init_overloads = __esmMin((() => {
	init_functions();
	init_errors();
	init_globals();
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/type-checker.js
var toDynTypeBinding, TypeChecker;
var init_type_checker = __esmMin((() => {
	init_errors();
	init_operators();
	toDynTypeBinding = (/* @__PURE__ */ new Map()).set("A", "dyn").set("T", "dyn").set("K", "dyn").set("V", "dyn");
	TypeChecker = class extends Base {
		constructor(opts, isEvaluating) {
			super(opts);
			this.createError = isEvaluating ? evaluationError : typeError;
		}
		/**
		* Check an expression and return its inferred type
		* @param {Array|any} ast - The AST node to check
		* @returns {Object} The inferred type declaration
		* @throws {TypeError} If type checking fails
		*/
		check(ast, ctx) {
			try {
				var _ast$checkedType;
				return (_ast$checkedType = ast.checkedType) !== null && _ast$checkedType !== void 0 ? _ast$checkedType : ast.checkedType = ast.check(this, ast, ctx);
			} catch (error) {
				throw attachErrorAst(error, ast);
			}
		}
		checkAccessOnType(ast, ctx, leftType, allowMissingField = false) {
			if (leftType === this.dynType) return leftType;
			const indexTypeName = (ast.op === "[]" || ast.op === "[?]" ? this.check(ast.args[1], ctx) : this.stringType).type;
			if (leftType.kind === "list") {
				if (indexTypeName === "int" || indexTypeName === "dyn") return leftType.valueType;
				throw this.createError("invalid_index_type", `List index must be int, got '${indexTypeName}'`, ast);
			}
			if (leftType.kind === "map") return leftType.valueType;
			const customType = this.objectTypes.get(leftType.name);
			if (customType) {
				if (!(indexTypeName === "string" || indexTypeName === "dyn")) throw this.createError("invalid_index_type", `Cannot index type '${leftType.name}' with type '${indexTypeName}'`, ast);
				if (customType.fields) {
					let keyName;
					if (ast.op === "." || ast.op === ".?") keyName = ast.args[1];
					else if (ast.args[1].op === "value") keyName = ast.args[1].args;
					if (typeof keyName === "string") {
						const fieldType = customType.fields[keyName];
						if (fieldType) return fieldType;
						if (allowMissingField) return this.dynType;
						throw this.createError("no_such_key", `No such key: ${keyName}`, ast);
					}
				}
				return this.dynType;
			}
			throw this.createError("cannot_index_type", `Cannot index type '${this.formatType(leftType)}'`, ast);
		}
		formatType(type) {
			if (!type.hasPlaceholderType) return type.name;
			return type.templated(this.registry, toDynTypeBinding).name;
		}
		formatTypeList(types) {
			return types.map((t) => this.formatType(t)).join(", ");
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/parser.js
function _computeIsAsync() {
	var _this$meta$alternate;
	const ast = (_this$meta$alternate = _classPrivateFieldGet2(_meta, this).alternate) !== null && _this$meta$alternate !== void 0 ? _this$meta$alternate : this;
	switch (ast.op) {
		case "value":
		case "id":
		case "accuValue":
		case "accuInc": return false;
		case "accuPush": return ast.args.maybeAsync;
		case "!_":
		case "-_":
			var _ast$candidates;
			if (((_ast$candidates = ast.candidates) === null || _ast$candidates === void 0 ? void 0 : _ast$candidates.async) !== false) return true;
			return ast.args.maybeAsync;
		case "!=":
		case "==":
		case "in":
		case "+":
		case "-":
		case "*":
		case "/":
		case "%":
		case "<":
		case "<=":
		case ">":
		case ">=":
			var _ast$candidates2;
			if (((_ast$candidates2 = ast.candidates) === null || _ast$candidates2 === void 0 ? void 0 : _ast$candidates2.async) !== false) return true;
			return ast.args.some((a) => a.maybeAsync);
		case "call":
		case "rcall":
			var _ast$candidates3;
			if (((_ast$candidates3 = ast.candidates) === null || _ast$candidates3 === void 0 ? void 0 : _ast$candidates3.async) !== false) return true;
			return (ast.receiverWithArgs || ast.args[1]).some((a) => a.maybeAsync);
		case "comprehension": return ast.args.iterable.maybeAsync || ast.args.step.maybeAsync;
		case ".":
		case ".?": return ast.args[0].maybeAsync;
		case "?:":
		case "list":
		case "[]":
		case "[?]": return ast.args.some((a) => a.maybeAsync);
		case "||":
		case "&&": return ast.args.some((a) => a.maybeAsync);
		case "map": return ast.args.some((a) => a[0].maybeAsync || a[1].maybeAsync);
		default: return true;
	}
}
function _evaluateAlternate(ev, ast, ctx) {
	return (ast = _classPrivateFieldGet2(_meta, this).alternate).evaluate(ev, ast, ctx);
}
function _evaluateMacro(ev, ast, ctx) {
	return (ast = _classPrivateFieldGet2(_meta, this).macro).evaluate(ev, ast, ctx);
}
function _escapeErr(code, offset, len, i, chars, extra) {
	const start = offset + i;
	return parseError(code, ESCAPE_ERRORS[code](extra), {
		input: this.input,
		pos: start,
		start,
		end: Math.min(start + chars, offset + len)
	});
}
function _limitExceeded(limitKey, pos = this.pos) {
	throw parseError("limit_exceeded", `Exceeded ${limitKey} (${this.limits[limitKey]})`, {
		pos,
		start: pos,
		end: pos,
		input: this.input
	});
}
function _node(start, end, op, args, pos = start) {
	const node = new ASTNode(this.input, pos, start, end, op, args);
	if (!this.astNodesRemaining--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxAstNodes", pos);
	return node;
}
function _infixNode(op, left, right) {
	return _assertClassBrand(_Parser_brand, this, _node).call(this, left.start, right.end, op, [left, right]);
}
function _ternaryNode(expression, consequent, alternate) {
	return _assertClassBrand(_Parser_brand, this, _node).call(this, expression.start, alternate.end, OPERATORS.ternary, [
		expression,
		consequent,
		alternate
	]);
}
function _unaryNode(pos, op, arg) {
	return _assertClassBrand(_Parser_brand, this, _node).call(this, pos, arg.end, op, arg);
}
function _accessNode(op, left, right, end, pos = left.start) {
	return _assertClassBrand(_Parser_brand, this, _node).call(this, left.start, end, op, [left, right], pos);
}
function _advanceToken(returnValue = this.pos) {
	const l = this.lexer.nextToken();
	this.pos = l.tokenPos;
	this.type = l.tokenType;
	return returnValue;
}
function _expandMacro(start, end, op, args) {
	const methodName = args[0];
	const receiver = op === OPERATORS.rcall ? args[1] : null;
	const fnArgs = op === OPERATORS.rcall ? args[2] : args[1];
	const decl = this.registry.findMacro(methodName, !!receiver, fnArgs.length);
	const ast = _assertClassBrand(_Parser_brand, this, _node).call(this, start, end, op, args);
	if (!decl) return ast;
	const macro = decl.handler({
		ast,
		args: fnArgs,
		receiver,
		methodName,
		parser: this
	});
	if (macro.callAst) return ast.setMeta("alternate", macro.callAst);
	return ast.setMeta("macro", macro).setMeta("async", isAsync(macro.evaluate, macro.async));
}
function _consumeLiteral() {
	return _assertClassBrand(_Parser_brand, this, _advanceToken).call(this, _assertClassBrand(_Parser_brand, this, _node).call(this, this.pos, this.lexer.pos, OPERATORS.value, this.value));
}
function _parseIdentifierPrimary() {
	const value = this.value;
	const end = this.lexer.pos;
	const start = this.consume(TOKEN.IDENTIFIER);
	if (RESERVED.has(value)) throw parseError("reserved_identifier", `Reserved identifier: ${value}`, {
		pos: start,
		start,
		end,
		input: this.input
	});
	if (!this.match(TOKEN.LPAREN)) return _assertClassBrand(_Parser_brand, this, _node).call(this, start, end, OPERATORS.id, value);
	_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
	const args = this.parseArgumentList();
	const closeEnd = this.lexer.pos;
	this.consume(TOKEN.RPAREN);
	return _assertClassBrand(_Parser_brand, this, _expandMacro).call(this, start, closeEnd, OPERATORS.call, [value, args]);
}
function _parseParenthesizedExpression() {
	this.consume(TOKEN.LPAREN);
	const expr = this.parseExpression();
	this.consume(TOKEN.RPAREN);
	return expr;
}
var TOKEN, OP_FOR_TOKEN, TOKEN_BY_NUMBER, HEX_CODES, ESCAPE_ERRORS, STRING_ESCAPES, _meta, _input, _ASTNode_brand, ASTNode, _Lexer_brand, Lexer, globalLexer, _Parser_brand, Parser;
var init_parser = __esmMin((() => {
	init_functions();
	init_errors();
	init_operators();
	init_globals();
	init_classPrivateMethodInitSpec();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_assertClassBrand();
	init_defineProperty();
	TOKEN = {
		EOF: 0,
		NUMBER: 1,
		STRING: 2,
		BOOLEAN: 3,
		NULL: 4,
		IDENTIFIER: 5,
		PLUS: 6,
		MINUS: 7,
		MULTIPLY: 8,
		DIVIDE: 9,
		MODULO: 10,
		EQ: 11,
		NE: 12,
		LT: 13,
		LE: 14,
		GT: 15,
		GE: 16,
		AND: 17,
		OR: 18,
		NOT: 19,
		IN: 20,
		LPAREN: 21,
		RPAREN: 22,
		LBRACKET: 23,
		RBRACKET: 24,
		LBRACE: 25,
		RBRACE: 26,
		DOT: 27,
		COMMA: 28,
		COLON: 29,
		QUESTION: 30,
		BYTES: 31
	};
	OP_FOR_TOKEN = {
		[TOKEN.EQ]: OPERATORS["=="],
		[TOKEN.PLUS]: OPERATORS["+"],
		[TOKEN.MINUS]: OPERATORS["-"],
		[TOKEN.MULTIPLY]: OPERATORS["*"],
		[TOKEN.DIVIDE]: OPERATORS["/"],
		[TOKEN.MODULO]: OPERATORS["%"],
		[TOKEN.LE]: OPERATORS["<="],
		[TOKEN.LT]: OPERATORS["<"],
		[TOKEN.GE]: OPERATORS[">="],
		[TOKEN.GT]: OPERATORS[">"],
		[TOKEN.NE]: OPERATORS["!="],
		[TOKEN.IN]: OPERATORS["in"]
	};
	TOKEN_BY_NUMBER = {};
	for (const key in TOKEN) TOKEN_BY_NUMBER[TOKEN[key]] = key;
	HEX_CODES = new Uint8Array(128);
	for (const ch of "0123456789abcdefABCDEF") HEX_CODES[ch.charCodeAt(0)] = 1;
	ESCAPE_ERRORS = {
		bytes_unicode_escape: (e) => `\\${e} not allowed in bytes literals`,
		invalid_unicode_escape: (e) => `Invalid Unicode escape: \\${e}`,
		invalid_unicode_surrogate: (e) => `Invalid Unicode surrogate: \\${e}`,
		invalid_hex_escape: (e) => `Invalid hex escape: \\${e}`,
		invalid_octal_escape: () => "Octal escape must be 3 digits",
		octal_escape_out_of_range: (e) => `Octal escape out of range: \\${e}`,
		invalid_escape_sequence: (e) => `Invalid escape sequence: \\${e}`
	};
	STRING_ESCAPES = {
		"\\": "\\",
		"?": "?",
		"\"": "\"",
		"'": "'",
		"`": "`",
		a: "\x07",
		b: "\b",
		f: "\f",
		n: "\n",
		r: "\r",
		t: "	",
		v: "\v"
	};
	_meta = /* @__PURE__ */ new WeakMap();
	_input = /* @__PURE__ */ new WeakMap();
	_ASTNode_brand = /* @__PURE__ */ new WeakSet();
	ASTNode = class ASTNode {
		constructor(input, pos, start, end, op, args) {
			_classPrivateMethodInitSpec(this, _ASTNode_brand);
			_classPrivateFieldInitSpec(this, _meta, void 0);
			_classPrivateFieldInitSpec(this, _input, void 0);
			_classPrivateFieldSet2(_meta, this, {
				check: op.check,
				evaluate: op.evaluate
			});
			_classPrivateFieldSet2(_input, this, input);
			this.op = op.name;
			this.args = args;
			this.pos = pos;
			this.start = start;
			this.end = end;
		}
		clone(op, args) {
			return new ASTNode(_classPrivateFieldGet2(_input, this), this.pos, this.start, this.end, op, args);
		}
		get meta() {
			return _classPrivateFieldGet2(_meta, this);
		}
		get input() {
			return _classPrivateFieldGet2(_input, this);
		}
		/**
		* Check whether we can optimize away async calling
		* If no ast members includes a function, we can optimize the call
		* for which we want to return true here.
		* @returns {boolean}
		*/
		get maybeAsync() {
			var _this$meta, _this$meta$async;
			return (_this$meta$async = (_this$meta = _classPrivateFieldGet2(_meta, this)).async) !== null && _this$meta$async !== void 0 ? _this$meta$async : _this$meta.async = _assertClassBrand(_ASTNode_brand, this, _computeIsAsync).call(this);
		}
		check(chk, ast, ctx) {
			const meta = _classPrivateFieldGet2(_meta, this);
			if (meta.alternate) return chk.check(meta.alternate, ctx);
			else if (meta.macro) return meta.macro.typeCheck(chk, meta.macro, ctx);
			return meta.check(chk, ast, ctx);
		}
		evaluate(ev, ast, ctx) {
			const meta = _classPrivateFieldGet2(_meta, this);
			if (meta.alternate) this.evaluate = _assertClassBrand(_ASTNode_brand, this, _evaluateAlternate);
			else if (meta.macro) this.evaluate = _assertClassBrand(_ASTNode_brand, this, _evaluateMacro);
			else this.evaluate = meta.evaluate;
			return this.evaluate(ev, ast, ctx);
		}
		setMeta(key, value) {
			return _classPrivateFieldGet2(_meta, this)[key] = value, this;
		}
		get range() {
			return {
				start: this.start,
				end: this.end
			};
		}
		toOldStructure() {
			const args = Array.isArray(this.args) ? this.args : [this.args];
			return [this.op, ...args.map((a) => a instanceof ASTNode ? a.toOldStructure() : a)];
		}
	};
	_Lexer_brand = /* @__PURE__ */ new WeakSet();
	Lexer = class {
		constructor() {
			_classPrivateMethodInitSpec(this, _Lexer_brand);
			_defineProperty(this, "input", void 0);
			_defineProperty(this, "pos", void 0);
			_defineProperty(this, "length", void 0);
			_defineProperty(this, "tokenPos", void 0);
			_defineProperty(this, "tokenType", void 0);
			_defineProperty(this, "tokenValue", void 0);
		}
		reset(input) {
			this.pos = 0;
			this.input = input;
			this.length = input.length;
			return input;
		}
		token(pos, type, value) {
			this.tokenPos = pos;
			this.tokenType = type;
			this.tokenValue = value;
			return this;
		}
		nextToken() {
			while (true) {
				const { pos, input, length } = this;
				if (pos >= length) return this.token(pos, TOKEN.EOF);
				const ch = input[pos];
				switch (ch) {
					case " ":
					case "	":
					case "\n":
					case "\r":
						this.pos++;
						continue;
					case "=":
						if (input[pos + 1] !== "=") break;
						return this.token((this.pos += 2) - 2, TOKEN.EQ);
					case "&":
						if (input[pos + 1] !== "&") break;
						return this.token((this.pos += 2) - 2, TOKEN.AND);
					case "|":
						if (input[pos + 1] !== "|") break;
						return this.token((this.pos += 2) - 2, TOKEN.OR);
					case "+": return this.token(this.pos++, TOKEN.PLUS);
					case "-": return this.token(this.pos++, TOKEN.MINUS);
					case "*": return this.token(this.pos++, TOKEN.MULTIPLY);
					case "/":
						if (input[pos + 1] === "/") {
							while (this.pos < length && this.input[this.pos] !== "\n") this.pos++;
							continue;
						}
						return this.token(this.pos++, TOKEN.DIVIDE);
					case "%": return this.token(this.pos++, TOKEN.MODULO);
					case "<":
						if (input[pos + 1] === "=") return this.token((this.pos += 2) - 2, TOKEN.LE);
						return this.token(this.pos++, TOKEN.LT);
					case ">":
						if (input[pos + 1] === "=") return this.token((this.pos += 2) - 2, TOKEN.GE);
						return this.token(this.pos++, TOKEN.GT);
					case "!":
						if (input[pos + 1] === "=") return this.token((this.pos += 2) - 2, TOKEN.NE);
						return this.token(this.pos++, TOKEN.NOT);
					case "(": return this.token(this.pos++, TOKEN.LPAREN);
					case ")": return this.token(this.pos++, TOKEN.RPAREN);
					case "[": return this.token(this.pos++, TOKEN.LBRACKET);
					case "]": return this.token(this.pos++, TOKEN.RBRACKET);
					case "{": return this.token(this.pos++, TOKEN.LBRACE);
					case "}": return this.token(this.pos++, TOKEN.RBRACE);
					case ".": return this.token(this.pos++, TOKEN.DOT);
					case ",": return this.token(this.pos++, TOKEN.COMMA);
					case ":": return this.token(this.pos++, TOKEN.COLON);
					case "?": return this.token(this.pos++, TOKEN.QUESTION);
					case `"`:
					case `'`: return this.readString(ch);
					case "b":
					case "B":
					case "r":
					case "R": {
						const next = input[pos + 1];
						if (next === "\"" || next === "'") return ++this.pos && this.readString(next, ch);
						return this.readIdentifier();
					}
					default: {
						const code = ch.charCodeAt(0);
						if (code <= 57 && code >= 48) return this.readNumber();
						if (this._isIdentifierCharCode(code)) return this.readIdentifier();
					}
				}
				throw parseError("unexpected_character", `Unexpected character: ${ch}`, {
					pos,
					start: pos,
					end: pos + 1,
					input
				});
			}
		}
		_isIdentifierCharCode(c) {
			if (c < 48 || c > 122) return false;
			return c >= 97 || c >= 65 && c <= 90 || c <= 57 || c === 95;
		}
		_parseAsDouble(start, end) {
			const value = Number(this.input.substring(start, end));
			if (Number.isFinite(value)) return this.token(start, TOKEN.NUMBER, value);
			throw parseError("invalid_number", `Invalid number: ${value}`, {
				pos: start,
				start,
				end,
				input: this.input
			});
		}
		_parseAsBigInt(start, end, isHex, unsigned) {
			const string = this.input.substring(start, end);
			if (unsigned === "u" || unsigned === "U") {
				this.pos++;
				try {
					return this.token(start, TOKEN.NUMBER, new UnsignedInt(string));
				} catch (_err) {}
			} else try {
				return this.token(start, TOKEN.NUMBER, BigInt(string));
			} catch (_err) {}
			throw parseError(isHex ? "invalid_hex_integer" : "invalid_integer", isHex ? `Invalid hex integer: ${string}` : `Invalid integer: ${string}`, {
				pos: start,
				start,
				end: this.pos,
				input: this.input
			});
		}
		_readDigits(input, length, pos, code) {
			while (pos < length && (code = input.charCodeAt(pos)) && !(code > 57 || code < 48)) pos++;
			return pos;
		}
		_readExponent(input, length, pos) {
			let ch = pos < length && input[pos];
			if (ch === "e" || ch === "E") {
				ch = ++pos < length && input[pos];
				if (ch === "-" || ch === "+") pos++;
				const start = pos;
				pos = this._readDigits(input, length, pos);
				if (start === pos) throw parseError("invalid_exponent", "Invalid exponent", {
					pos,
					start: pos,
					end: Math.min(pos + 1, input.length),
					input
				});
			}
			return pos;
		}
		readNumber() {
			const { input, length, pos: start } = this;
			let pos = start;
			if (input[pos] === "0" && (input[pos + 1] === "x" || input[pos + 1] === "X")) {
				pos += 2;
				while (pos < length && HEX_CODES[input[pos].charCodeAt(0)]) pos++;
				return this._parseAsBigInt(start, this.pos = pos, true, input[pos]);
			}
			pos = this._readDigits(input, length, pos);
			if (pos + 1 < length) {
				let isDouble = false;
				let afterpos = input[pos] === "." ? this._readDigits(input, length, pos + 1) : pos + 1;
				if (afterpos !== pos + 1) (isDouble = true) && (pos = afterpos);
				afterpos = this._readExponent(input, length, pos);
				if (afterpos !== pos) (isDouble = true) && (pos = afterpos);
				if (isDouble) return this._parseAsDouble(start, this.pos = pos);
			}
			return this._parseAsBigInt(start, this.pos = pos, false, input[pos]);
		}
		readString(del, prefix) {
			const { input: i, pos: s } = this;
			if (i[s + 1] === del && i[s + 2] === del) return this.readTripleQuotedString(del, prefix);
			return this.readSingleQuotedString(del, prefix);
		}
		_closeQuotedString(rawStart, rawValue, prefix, pos) {
			switch (prefix) {
				case "b":
				case "B": {
					const processed = this.processEscapes(rawStart, rawValue, true);
					const bytes = new Uint8Array(processed.length);
					for (let i = 0; i < processed.length; i++) bytes[i] = processed.charCodeAt(i) & 255;
					return this.token(pos - 1, TOKEN.BYTES, bytes);
				}
				case "r":
				case "R": return this.token(pos - 1, TOKEN.STRING, rawValue);
				default: {
					const value = this.processEscapes(rawStart, rawValue, false);
					return this.token(pos, TOKEN.STRING, value);
				}
			}
		}
		readSingleQuotedString(delimiter, prefix) {
			const { input, length, pos: start } = this;
			let ch;
			let pos = this.pos + 1;
			while (pos < length && (ch = input[pos])) {
				switch (ch) {
					case delimiter:
						const rawStart = start + 1;
						const rawValue = input.slice(rawStart, pos);
						this.pos = ++pos;
						return this._closeQuotedString(rawStart, rawValue, prefix, start);
					case "\n":
					case "\r": throw parseError("newline_in_string", "Newlines not allowed in single-quoted strings", {
						pos,
						start: pos,
						end: pos + 1,
						input
					});
					case "\\": pos++;
				}
				pos++;
			}
			throw parseError("unterminated_string", "Unterminated string", {
				pos: start,
				start,
				end: input.length,
				input
			});
		}
		readTripleQuotedString(delimiter, prefix) {
			const { input, length, pos: start } = this;
			let ch;
			let pos = this.pos + 3;
			while (pos < length && (ch = input[pos])) {
				switch (ch) {
					case delimiter:
						if (input[pos + 1] === delimiter && input[pos + 2] === delimiter) {
							const rawStart = start + 3;
							const rawValue = input.slice(rawStart, pos);
							this.pos = pos + 3;
							return this._closeQuotedString(rawStart, rawValue, prefix, start);
						}
						break;
					case "\\": pos++;
				}
				pos++;
			}
			throw parseError("unterminated_triple_quoted_string", "Unterminated triple-quoted string", {
				pos: start,
				start,
				end: input.length,
				input
			});
		}
		processEscapes(offset, str, isBytes) {
			if (!str.includes("\\")) return str;
			const len = str.length;
			let result = "";
			let i = 0;
			while (i < len) {
				if (str[i] !== "\\" || i + 1 >= len) {
					result += str[i++];
					continue;
				}
				const next = str[i + 1];
				if (STRING_ESCAPES[next]) {
					result += STRING_ESCAPES[next];
					i += 2;
				} else if (next === "u" || next === "U") {
					if (isBytes) throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "bytes_unicode_escape", offset, len, i, 2, next);
					const hexLen = next === "u" ? 4 : 8;
					const hex = str.substring(i + 2, i + 2 + hexLen);
					const c = Number.parseInt(hex, 16);
					if (hex.length !== hexLen || !/^[0-9a-fA-F]+$/.test(hex) || c > 1114111) throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "invalid_unicode_escape", offset, len, i, 2 + hexLen, next + hex);
					if (c >= 55296 && c <= 57343) throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "invalid_unicode_surrogate", offset, len, i, 2 + hexLen, next + hex);
					result += String.fromCodePoint(c);
					i += 2 + hexLen;
				} else if (next === "x" || next === "X") {
					const h = str.substring(i + 2, i + 4);
					if (!/^[0-9a-fA-F]{2}$/.test(h)) throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "invalid_hex_escape", offset, len, i, 4, next + h);
					result += String.fromCharCode(Number.parseInt(h, 16));
					i += 4;
				} else if (next >= "0" && next <= "7") {
					const o = str.substring(i + 1, i + 4);
					if (!/^[0-7]{3}$/.test(o)) throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "invalid_octal_escape", offset, len, i, 4);
					const value = Number.parseInt(o, 8);
					if (value > 255) throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "octal_escape_out_of_range", offset, len, i, 4, o);
					result += String.fromCharCode(value);
					i += 4;
				} else throw _assertClassBrand(_Lexer_brand, this, _escapeErr).call(this, "invalid_escape_sequence", offset, len, i, 2, next);
			}
			return result;
		}
		readIdentifier() {
			const { pos, input, length } = this;
			let p = pos;
			while (p < length && this._isIdentifierCharCode(input[p].charCodeAt(0))) p++;
			const value = input.substring(pos, this.pos = p);
			switch (value) {
				case "true": return this.token(pos, TOKEN.BOOLEAN, true);
				case "false": return this.token(pos, TOKEN.BOOLEAN, false);
				case "null": return this.token(pos, TOKEN.NULL, null);
				case "in": return this.token(pos, TOKEN.IN);
				default: return this.token(pos, TOKEN.IDENTIFIER, value);
			}
		}
	};
	globalLexer = new Lexer();
	_Parser_brand = /* @__PURE__ */ new WeakSet();
	Parser = class {
		constructor(limits, registry) {
			_classPrivateMethodInitSpec(this, _Parser_brand);
			_defineProperty(this, "lexer", globalLexer);
			_defineProperty(this, "input", null);
			_defineProperty(this, "maxDepthRemaining", null);
			_defineProperty(this, "astNodesRemaining", null);
			_defineProperty(this, "type", null);
			_defineProperty(this, "pos", null);
			this.limits = limits;
			this.registry = registry;
		}
		get value() {
			return this.lexer.tokenValue;
		}
		consume(expectedType) {
			if (this.type === expectedType) return _assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
			throw parseError("expected_token", `Expected ${TOKEN_BY_NUMBER[expectedType]}, got ${TOKEN_BY_NUMBER[this.type]}`, {
				pos: this.pos,
				start: this.pos,
				end: this.lexer.pos,
				input: this.input
			});
		}
		match(type) {
			return this.type === type;
		}
		parse(input) {
			if (typeof input !== "string") throw parseError("expression_must_be_string", "Expression must be a string");
			this.input = this.lexer.reset(input);
			_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
			this.maxDepthRemaining = this.limits.maxDepth;
			this.astNodesRemaining = this.limits.maxAstNodes;
			const result = this.parseExpression();
			if (this.match(TOKEN.EOF)) return result;
			throw parseError("unexpected_character", `Unexpected character: '${this.input[this.lexer.pos - 1]}'`, {
				pos: this.pos,
				start: this.pos,
				end: this.lexer.pos,
				input: this.input
			});
		}
		parseExpression() {
			if (!this.maxDepthRemaining--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxDepth");
			const expr = this.parseLogicalOr();
			if (!this.match(TOKEN.QUESTION)) return ++this.maxDepthRemaining && expr;
			_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
			const consequent = this.parseExpression();
			this.consume(TOKEN.COLON);
			const alternate = this.parseExpression();
			this.maxDepthRemaining++;
			return _assertClassBrand(_Parser_brand, this, _ternaryNode).call(this, expr, consequent, alternate);
		}
		parseLogicalOr() {
			let expr = this.parseLogicalAnd();
			while (this.match(TOKEN.OR)) {
				_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
				expr = _assertClassBrand(_Parser_brand, this, _infixNode).call(this, OPERATORS["||"], expr, this.parseLogicalAnd());
			}
			return expr;
		}
		parseLogicalAnd() {
			let expr = this.parseEquality();
			while (this.match(TOKEN.AND)) {
				_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
				expr = _assertClassBrand(_Parser_brand, this, _infixNode).call(this, OPERATORS["&&"], expr, this.parseEquality());
			}
			return expr;
		}
		parseEquality() {
			let expr = this.parseRelational();
			while (this.match(TOKEN.EQ) || this.match(TOKEN.NE)) {
				const op = OP_FOR_TOKEN[this.type];
				_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
				expr = _assertClassBrand(_Parser_brand, this, _infixNode).call(this, op, expr, this.parseRelational());
			}
			return expr;
		}
		parseRelational() {
			let expr = this.parseAdditive();
			while (this.match(TOKEN.LT) || this.match(TOKEN.LE) || this.match(TOKEN.GT) || this.match(TOKEN.GE) || this.match(TOKEN.IN)) {
				const op = OP_FOR_TOKEN[this.type];
				_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
				expr = _assertClassBrand(_Parser_brand, this, _infixNode).call(this, op, expr, this.parseAdditive());
			}
			return expr;
		}
		parseAdditive() {
			let expr = this.parseMultiplicative();
			while (this.match(TOKEN.PLUS) || this.match(TOKEN.MINUS)) {
				const op = OP_FOR_TOKEN[this.type];
				_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
				expr = _assertClassBrand(_Parser_brand, this, _infixNode).call(this, op, expr, this.parseMultiplicative());
			}
			return expr;
		}
		parseMultiplicative() {
			let expr = this.parseUnary();
			while (this.match(TOKEN.MULTIPLY) || this.match(TOKEN.DIVIDE) || this.match(TOKEN.MODULO)) {
				const op = OP_FOR_TOKEN[this.type];
				_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
				expr = _assertClassBrand(_Parser_brand, this, _infixNode).call(this, op, expr, this.parseUnary());
			}
			return expr;
		}
		parseUnary() {
			if (this.type === TOKEN.NOT) return _assertClassBrand(_Parser_brand, this, _unaryNode).call(this, _assertClassBrand(_Parser_brand, this, _advanceToken).call(this), OPERATORS.unaryNot, this.parseUnary());
			if (this.type === TOKEN.MINUS) return _assertClassBrand(_Parser_brand, this, _unaryNode).call(this, _assertClassBrand(_Parser_brand, this, _advanceToken).call(this), OPERATORS.unaryMinus, this.parseUnary());
			return this.parsePostfix();
		}
		parsePostfix() {
			let expr = this.parsePrimary();
			const depth = this.maxDepthRemaining;
			while (true) {
				if (this.match(TOKEN.DOT)) {
					const dot = _assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
					if (!this.maxDepthRemaining--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxDepth", dot);
					const op = this.match(TOKEN.QUESTION) && this.registry.enableOptionalTypes && _assertClassBrand(_Parser_brand, this, _advanceToken).call(this) ? OPERATORS.optionalFieldAccess : OPERATORS.fieldAccess;
					const propertyValue = this.value;
					const start = this.pos;
					const end = this.lexer.pos;
					this.consume(TOKEN.IDENTIFIER);
					if (op === OPERATORS.fieldAccess && this.match(TOKEN.LPAREN) && _assertClassBrand(_Parser_brand, this, _advanceToken).call(this)) {
						const args = this.parseArgumentList();
						const closeEnd = this.lexer.pos;
						this.consume(TOKEN.RPAREN);
						expr = _assertClassBrand(_Parser_brand, this, _expandMacro).call(this, expr.start, closeEnd, OPERATORS.rcall, [
							propertyValue,
							expr,
							args
						]);
					} else expr = _assertClassBrand(_Parser_brand, this, _accessNode).call(this, op, expr, propertyValue, end, start);
					continue;
				}
				if (this.match(TOKEN.LBRACKET)) {
					const bracket = _assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
					if (!this.maxDepthRemaining--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxDepth", bracket);
					const op = this.match(TOKEN.QUESTION) && this.registry.enableOptionalTypes && _assertClassBrand(_Parser_brand, this, _advanceToken).call(this) ? OPERATORS.optionalBracketAccess : OPERATORS.bracketAccess;
					const index = this.parseExpression();
					const closeEnd = this.lexer.pos;
					this.consume(TOKEN.RBRACKET);
					expr = _assertClassBrand(_Parser_brand, this, _accessNode).call(this, op, expr, index, closeEnd);
					continue;
				}
				break;
			}
			this.maxDepthRemaining = depth;
			return expr;
		}
		parsePrimary() {
			switch (this.type) {
				case TOKEN.NUMBER:
				case TOKEN.STRING:
				case TOKEN.BYTES:
				case TOKEN.BOOLEAN:
				case TOKEN.NULL: return _assertClassBrand(_Parser_brand, this, _consumeLiteral).call(this);
				case TOKEN.IDENTIFIER: return _assertClassBrand(_Parser_brand, this, _parseIdentifierPrimary).call(this);
				case TOKEN.LPAREN: return _assertClassBrand(_Parser_brand, this, _parseParenthesizedExpression).call(this);
				case TOKEN.LBRACKET: return this.parseList();
				case TOKEN.LBRACE: return this.parseMap();
			}
			throw parseError("unexpected_token", `Unexpected token: ${TOKEN_BY_NUMBER[this.type]}`, {
				pos: this.pos,
				start: this.pos,
				end: this.lexer.pos,
				input: this.input
			});
		}
		parseList() {
			const start = this.consume(TOKEN.LBRACKET);
			const elements = [];
			let remainingElements = this.limits.maxListElements;
			if (!this.match(TOKEN.RBRACKET)) {
				elements.push(this.parseExpression());
				if (!remainingElements--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxListElements", elements.at(-1).pos);
				while (this.match(TOKEN.COMMA)) {
					_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
					if (this.match(TOKEN.RBRACKET)) break;
					elements.push(this.parseExpression());
					if (!remainingElements--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxListElements", elements.at(-1).pos);
				}
			}
			const closeEnd = this.lexer.pos;
			this.consume(TOKEN.RBRACKET);
			return _assertClassBrand(_Parser_brand, this, _node).call(this, start, closeEnd, OPERATORS.list, elements);
		}
		parseMap() {
			const start = this.consume(TOKEN.LBRACE);
			const props = [];
			let remainingEntries = this.limits.maxMapEntries;
			if (!this.match(TOKEN.RBRACE)) {
				props.push(this.parseProperty());
				if (!remainingEntries--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxMapEntries", props.at(-1)[0].pos);
				while (this.match(TOKEN.COMMA)) {
					_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
					if (this.match(TOKEN.RBRACE)) break;
					props.push(this.parseProperty());
					if (!remainingEntries--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxMapEntries", props.at(-1)[0].pos);
				}
			}
			const closeEnd = this.lexer.pos;
			this.consume(TOKEN.RBRACE);
			return _assertClassBrand(_Parser_brand, this, _node).call(this, start, closeEnd, OPERATORS.map, props);
		}
		parseProperty() {
			return [this.parseExpression(), (this.consume(TOKEN.COLON), this.parseExpression())];
		}
		parseArgumentList() {
			const args = [];
			let remainingArgs = this.limits.maxCallArguments;
			if (!this.match(TOKEN.RPAREN)) {
				args.push(this.parseExpression());
				if (!remainingArgs--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxCallArguments", args.at(-1).pos);
				while (this.match(TOKEN.COMMA)) {
					_assertClassBrand(_Parser_brand, this, _advanceToken).call(this);
					if (this.match(TOKEN.RPAREN)) break;
					args.push(this.parseExpression());
					if (!remainingArgs--) _assertClassBrand(_Parser_brand, this, _limitExceeded).call(this, "maxCallArguments", args.at(-1).pos);
				}
			}
			return args;
		}
	};
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectSpread2.js
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
var init_objectSpread2 = __esmMin((() => {
	init_defineProperty();
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/options.js
function createLimits(overrides, base = DEFAULT_LIMITS) {
	const keys = overrides ? objKeys(overrides) : void 0;
	if (!(keys === null || keys === void 0 ? void 0 : keys.length)) return base;
	const merged = _objectSpread2({}, base);
	for (const key of keys) {
		if (!LIMIT_KEYS.has(key)) throw new TypeError(`Unknown limits option: ${key}`);
		const value = overrides[key];
		if (typeof value !== "number") continue;
		merged[key] = value;
	}
	return objFreeze(merged);
}
function bool(a, b, key) {
	var _a$key;
	const value = (_a$key = a === null || a === void 0 ? void 0 : a[key]) !== null && _a$key !== void 0 ? _a$key : b === null || b === void 0 ? void 0 : b[key];
	if (typeof value !== "boolean") throw new TypeError(`Invalid option: ${key}`);
	return value;
}
function createOptions(opts, base = DEFAULT_OPTIONS) {
	if (!opts) return base;
	return objFreeze({
		unlistedVariablesAreDyn: bool(opts, base, "unlistedVariablesAreDyn"),
		homogeneousAggregateLiterals: bool(opts, base, "homogeneousAggregateLiterals"),
		enableOptionalTypes: bool(opts, base, "enableOptionalTypes"),
		limits: createLimits(opts.limits, base.limits)
	});
}
var DEFAULT_LIMITS, LIMIT_KEYS, DEFAULT_OPTIONS;
var init_options = __esmMin((() => {
	init_globals();
	init_objectSpread2();
	DEFAULT_LIMITS = objFreeze({
		maxAstNodes: 1e5,
		maxDepth: 250,
		maxListElements: 1e3,
		maxMapEntries: 1e3,
		maxCallArguments: 32
	});
	LIMIT_KEYS = new Set(objKeys(DEFAULT_LIMITS));
	DEFAULT_OPTIONS = objFreeze({
		unlistedVariablesAreDyn: false,
		homogeneousAggregateLiterals: true,
		enableOptionalTypes: false,
		limits: DEFAULT_LIMITS
	});
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/evaluator.js
function _checkAST(ast) {
	try {
		const typeDecl = _classPrivateFieldGet2(_typeChecker, this).check(ast, new RootContext(_classPrivateFieldGet2(_registry, this)));
		return {
			valid: true,
			type: _assertClassBrand(_Environment_brand, this, _formatTypeForCheck).call(this, typeDecl)
		};
	} catch (error) {
		return {
			valid: false,
			error
		};
	}
}
function _formatTypeForCheck(typeDecl) {
	if (typeDecl.name === `list<dyn>`) return "list";
	if (typeDecl.name === `map<dyn, dyn>`) return "map";
	return typeDecl.name;
}
function _evaluateAST(ast, ctx) {
	if (ast.checkedType) return ast.evaluate(_classPrivateFieldGet2(_evaluator, this), ast, new RootContext(_classPrivateFieldGet2(_registry, this), ctx));
	else {
		_classPrivateFieldGet2(_evalTypeChecker, this).check(ast, ctx = new RootContext(_classPrivateFieldGet2(_registry, this), ctx));
		return ast.evaluate(_classPrivateFieldGet2(_evaluator, this), ast, ctx);
	}
}
function _firstMapElement(coll) {
	if (coll instanceof Map) return coll.entries().next().value;
	for (const key in coll) return [key, coll[key]];
}
var globalRegistry, _registry, _evaluator, _typeChecker, _evalTypeChecker, _parser, _Environment_brand, Environment, _Evaluator_brand, Evaluator;
var init_evaluator = __esmMin((() => {
	init_registry();
	init_errors();
	init_functions();
	init_macros();
	init_overloads();
	init_type_checker();
	init_parser();
	init_options();
	init_operators();
	init_classPrivateMethodInitSpec();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_assertClassBrand();
	globalRegistry = createRegistry({ enableOptionalTypes: false });
	registerFunctions(globalRegistry);
	registerOverloads(globalRegistry);
	registerMacros(globalRegistry);
	_registry = /* @__PURE__ */ new WeakMap();
	_evaluator = /* @__PURE__ */ new WeakMap();
	_typeChecker = /* @__PURE__ */ new WeakMap();
	_evalTypeChecker = /* @__PURE__ */ new WeakMap();
	_parser = /* @__PURE__ */ new WeakMap();
	_Environment_brand = /* @__PURE__ */ new WeakSet();
	Environment = class Environment {
		constructor(opts, inherited) {
			_classPrivateMethodInitSpec(this, _Environment_brand);
			_classPrivateFieldInitSpec(this, _registry, void 0);
			_classPrivateFieldInitSpec(this, _evaluator, void 0);
			_classPrivateFieldInitSpec(this, _typeChecker, void 0);
			_classPrivateFieldInitSpec(this, _evalTypeChecker, void 0);
			_classPrivateFieldInitSpec(this, _parser, void 0);
			this.opts = createOptions(opts, inherited === null || inherited === void 0 ? void 0 : inherited.opts);
			_classPrivateFieldSet2(_registry, this, (inherited instanceof Environment ? _classPrivateFieldGet2(_registry, inherited) : globalRegistry).clone(this.opts));
			const childOpts = {
				registry: _classPrivateFieldGet2(_registry, this),
				opts: this.opts
			};
			_classPrivateFieldSet2(_typeChecker, this, new TypeChecker(childOpts));
			_classPrivateFieldSet2(_evalTypeChecker, this, new TypeChecker(childOpts, true));
			_classPrivateFieldSet2(_evaluator, this, new Evaluator(childOpts));
			_classPrivateFieldSet2(_parser, this, new Parser(this.opts.limits, _classPrivateFieldGet2(_registry, this)));
			Object.freeze(this);
		}
		clone(opts) {
			return new Environment(opts, this);
		}
		registerFunction(signature, handler, opts) {
			_classPrivateFieldGet2(_registry, this).registerFunctionOverload(signature, handler, opts);
			return this;
		}
		registerOperator(string, handler, opts) {
			_classPrivateFieldGet2(_registry, this).registerOperatorOverload(string, handler, opts);
			return this;
		}
		registerType(typename, constructor) {
			_classPrivateFieldGet2(_registry, this).registerType(typename, constructor);
			return this;
		}
		registerVariable(name, type, opts) {
			_classPrivateFieldGet2(_registry, this).registerVariable(name, type, opts);
			return this;
		}
		registerConstant(name, type, value) {
			_classPrivateFieldGet2(_registry, this).registerConstant(name, type, value);
			return this;
		}
		hasVariable(name) {
			return _classPrivateFieldGet2(_registry, this).variables.has(name);
		}
		getDefinitions() {
			return _classPrivateFieldGet2(_registry, this).getDefinitions();
		}
		check(expression) {
			try {
				return _assertClassBrand(_Environment_brand, this, _checkAST).call(this, _classPrivateFieldGet2(_parser, this).parse(expression));
			} catch (error) {
				return {
					valid: false,
					error
				};
			}
		}
		parse(expression) {
			const ast = _classPrivateFieldGet2(_parser, this).parse(expression);
			const evaluateParsed = _assertClassBrand(_Environment_brand, this, _evaluateAST).bind(this, ast);
			evaluateParsed.check = _assertClassBrand(_Environment_brand, this, _checkAST).bind(this, ast);
			evaluateParsed.ast = ast;
			return evaluateParsed;
		}
		evaluate(expression, context) {
			return _assertClassBrand(_Environment_brand, this, _evaluateAST).call(this, _classPrivateFieldGet2(_parser, this).parse(expression), context);
		}
	};
	_Evaluator_brand = /* @__PURE__ */ new WeakSet();
	Evaluator = class extends Base {
		constructor(opts) {
			super(opts);
			_classPrivateMethodInitSpec(this, _Evaluator_brand);
			this.createError = evaluationError;
		}
		debugRuntimeType(value, checkedType) {
			return (checkedType === null || checkedType === void 0 ? void 0 : checkedType.hasDynType) === false ? checkedType : this.debugTypeDeep(value);
		}
		debugTypeDeep(value) {
			const runtimeType = this.debugType(value);
			switch (runtimeType.kind) {
				case "list": {
					const first = value instanceof Array ? value[0] : value.values().next().value;
					if (first === void 0) return runtimeType;
					return this.registry.getListType(this.debugTypeDeep(first));
				}
				case "map": {
					const first = _assertClassBrand(_Evaluator_brand, this, _firstMapElement).call(this, value);
					if (!first) return runtimeType;
					return this.registry.getMapType(runtimeType.keyType.hasDynType ? this.debugTypeDeep(first[0]) : runtimeType.keyType, runtimeType.valueType.hasDynType ? this.debugTypeDeep(first[1]) : runtimeType.valueType);
				}
				default: return runtimeType;
			}
		}
		tryEval(ast, ctx) {
			try {
				const res = this.eval(ast, ctx);
				if (res instanceof Promise) return res.catch((err) => err);
				return res;
			} catch (err) {
				return err;
			}
		}
		eval(ast, ctx) {
			return ast.evaluate(this, ast, ctx);
		}
	};
	new Environment({ unlistedVariablesAreDyn: true });
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/serialize.js
var init_serialize = __esmMin((() => {
	init_functions();
	init_optional();
}));
//#endregion
//#region node_modules/.pnpm/@marcbachmann+cel-js@7.6.1/node_modules/@marcbachmann/cel-js/lib/index.js
var init_lib = __esmMin((() => {
	init_evaluator();
	init_serialize();
	init_optional();
}));
//#endregion
//#region node_modules/.pnpm/object-hash@3.0.0/node_modules/object-hash/dist/object_hash.js
var require_object_hash = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(e) {
		var t;
		"object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : ("undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self), t.objectHash = e());
	})(function() {
		return function r(o, i, u) {
			function s(n, e) {
				if (!i[n]) {
					if (!o[n]) {
						var t = "function" == typeof __require && __require;
						if (!e && t) return t(n, !0);
						if (a) return a(n, !0);
						throw new Error("Cannot find module '" + n + "'");
					}
					e = i[n] = { exports: {} };
					o[n][0].call(e.exports, function(e) {
						var t = o[n][1][e];
						return s(t || e);
					}, e, e.exports, r, o, i, u);
				}
				return i[n].exports;
			}
			for (var a = "function" == typeof __require && __require, e = 0; e < u.length; e++) s(u[e]);
			return s;
		}({
			1: [function(w, b, m) {
				(function(e, n, s, c, d, h, p, g, y) {
					"use strict";
					var r = w("crypto");
					function t(e, t) {
						t = u(e, t);
						var n;
						return void 0 === (n = "passthrough" !== t.algorithm ? r.createHash(t.algorithm) : new l()).write && (n.write = n.update, n.end = n.update), f(t, n).dispatch(e), n.update || n.end(""), n.digest ? n.digest("buffer" === t.encoding ? void 0 : t.encoding) : (e = n.read(), "buffer" !== t.encoding ? e.toString(t.encoding) : e);
					}
					(m = b.exports = t).sha1 = function(e) {
						return t(e);
					}, m.keys = function(e) {
						return t(e, {
							excludeValues: !0,
							algorithm: "sha1",
							encoding: "hex"
						});
					}, m.MD5 = function(e) {
						return t(e, {
							algorithm: "md5",
							encoding: "hex"
						});
					}, m.keysMD5 = function(e) {
						return t(e, {
							algorithm: "md5",
							encoding: "hex",
							excludeValues: !0
						});
					};
					var o = r.getHashes ? r.getHashes().slice() : ["sha1", "md5"], i = (o.push("passthrough"), [
						"buffer",
						"hex",
						"binary",
						"base64"
					]);
					function u(e, t) {
						var n = {};
						if (n.algorithm = (t = t || {}).algorithm || "sha1", n.encoding = t.encoding || "hex", n.excludeValues = !!t.excludeValues, n.algorithm = n.algorithm.toLowerCase(), n.encoding = n.encoding.toLowerCase(), n.ignoreUnknown = !0 === t.ignoreUnknown, n.respectType = !1 !== t.respectType, n.respectFunctionNames = !1 !== t.respectFunctionNames, n.respectFunctionProperties = !1 !== t.respectFunctionProperties, n.unorderedArrays = !0 === t.unorderedArrays, n.unorderedSets = !1 !== t.unorderedSets, n.unorderedObjects = !1 !== t.unorderedObjects, n.replacer = t.replacer || void 0, n.excludeKeys = t.excludeKeys || void 0, void 0 === e) throw new Error("Object argument required.");
						for (var r = 0; r < o.length; ++r) o[r].toLowerCase() === n.algorithm.toLowerCase() && (n.algorithm = o[r]);
						if (-1 === o.indexOf(n.algorithm)) throw new Error("Algorithm \"" + n.algorithm + "\"  not supported. supported values: " + o.join(", "));
						if (-1 === i.indexOf(n.encoding) && "passthrough" !== n.algorithm) throw new Error("Encoding \"" + n.encoding + "\"  not supported. supported values: " + i.join(", "));
						return n;
					}
					function a(e) {
						if ("function" == typeof e) return null != /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(e));
					}
					function f(o, t, i) {
						i = i || [];
						function u(e) {
							return t.update ? t.update(e, "utf8") : t.write(e, "utf8");
						}
						return {
							dispatch: function(e) {
								return this["_" + (null === (e = o.replacer ? o.replacer(e) : e) ? "null" : typeof e)](e);
							},
							_object: function(t) {
								var n, e = Object.prototype.toString.call(t), r = /\[object (.*)\]/i.exec(e);
								r = (r = r ? r[1] : "unknown:[" + e + "]").toLowerCase();
								if (0 <= (e = i.indexOf(t))) return this.dispatch("[CIRCULAR:" + e + "]");
								if (i.push(t), void 0 !== s && s.isBuffer && s.isBuffer(t)) return u("buffer:"), u(t);
								if ("object" === r || "function" === r || "asyncfunction" === r) return e = Object.keys(t), o.unorderedObjects && (e = e.sort()), !1 === o.respectType || a(t) || e.splice(0, 0, "prototype", "__proto__", "constructor"), o.excludeKeys && (e = e.filter(function(e) {
									return !o.excludeKeys(e);
								})), u("object:" + e.length + ":"), n = this, e.forEach(function(e) {
									n.dispatch(e), u(":"), o.excludeValues || n.dispatch(t[e]), u(",");
								});
								if (!this["_" + r]) {
									if (o.ignoreUnknown) return u("[" + r + "]");
									throw new Error("Unknown object type \"" + r + "\"");
								}
								this["_" + r](t);
							},
							_array: function(e, t) {
								t = void 0 !== t ? t : !1 !== o.unorderedArrays;
								var n = this;
								if (u("array:" + e.length + ":"), !t || e.length <= 1) return e.forEach(function(e) {
									return n.dispatch(e);
								});
								var r = [], t = e.map(function(e) {
									var t = new l(), n = i.slice();
									return f(o, t, n).dispatch(e), r = r.concat(n.slice(i.length)), t.read().toString();
								});
								return i = i.concat(r), t.sort(), this._array(t, !1);
							},
							_date: function(e) {
								return u("date:" + e.toJSON());
							},
							_symbol: function(e) {
								return u("symbol:" + e.toString());
							},
							_error: function(e) {
								return u("error:" + e.toString());
							},
							_boolean: function(e) {
								return u("bool:" + e.toString());
							},
							_string: function(e) {
								u("string:" + e.length + ":"), u(e.toString());
							},
							_function: function(e) {
								u("fn:"), a(e) ? this.dispatch("[native]") : this.dispatch(e.toString()), !1 !== o.respectFunctionNames && this.dispatch("function-name:" + String(e.name)), o.respectFunctionProperties && this._object(e);
							},
							_number: function(e) {
								return u("number:" + e.toString());
							},
							_xml: function(e) {
								return u("xml:" + e.toString());
							},
							_null: function() {
								return u("Null");
							},
							_undefined: function() {
								return u("Undefined");
							},
							_regexp: function(e) {
								return u("regex:" + e.toString());
							},
							_uint8array: function(e) {
								return u("uint8array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_uint8clampedarray: function(e) {
								return u("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_int8array: function(e) {
								return u("int8array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_uint16array: function(e) {
								return u("uint16array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_int16array: function(e) {
								return u("int16array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_uint32array: function(e) {
								return u("uint32array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_int32array: function(e) {
								return u("int32array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_float32array: function(e) {
								return u("float32array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_float64array: function(e) {
								return u("float64array:"), this.dispatch(Array.prototype.slice.call(e));
							},
							_arraybuffer: function(e) {
								return u("arraybuffer:"), this.dispatch(new Uint8Array(e));
							},
							_url: function(e) {
								return u("url:" + e.toString());
							},
							_map: function(e) {
								u("map:");
								e = Array.from(e);
								return this._array(e, !1 !== o.unorderedSets);
							},
							_set: function(e) {
								u("set:");
								e = Array.from(e);
								return this._array(e, !1 !== o.unorderedSets);
							},
							_file: function(e) {
								return u("file:"), this.dispatch([
									e.name,
									e.size,
									e.type,
									e.lastModfied
								]);
							},
							_blob: function() {
								if (o.ignoreUnknown) return u("[blob]");
								throw Error("Hashing Blob objects is currently not supported\n(see https://github.com/puleos/object-hash/issues/26)\nUse \"options.replacer\" or \"options.ignoreUnknown\"\n");
							},
							_domwindow: function() {
								return u("domwindow");
							},
							_bigint: function(e) {
								return u("bigint:" + e.toString());
							},
							_process: function() {
								return u("process");
							},
							_timer: function() {
								return u("timer");
							},
							_pipe: function() {
								return u("pipe");
							},
							_tcp: function() {
								return u("tcp");
							},
							_udp: function() {
								return u("udp");
							},
							_tty: function() {
								return u("tty");
							},
							_statwatcher: function() {
								return u("statwatcher");
							},
							_securecontext: function() {
								return u("securecontext");
							},
							_connection: function() {
								return u("connection");
							},
							_zlib: function() {
								return u("zlib");
							},
							_context: function() {
								return u("context");
							},
							_nodescript: function() {
								return u("nodescript");
							},
							_httpparser: function() {
								return u("httpparser");
							},
							_dataview: function() {
								return u("dataview");
							},
							_signal: function() {
								return u("signal");
							},
							_fsevent: function() {
								return u("fsevent");
							},
							_tlswrap: function() {
								return u("tlswrap");
							}
						};
					}
					function l() {
						return {
							buf: "",
							write: function(e) {
								this.buf += e;
							},
							end: function(e) {
								this.buf += e;
							},
							read: function() {
								return this.buf;
							}
						};
					}
					m.writeToStream = function(e, t, n) {
						return void 0 === n && (n = t, t = {}), f(t = u(e, t), n).dispatch(e);
					};
				}).call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_9a5aa49d.js", "/");
			}, {
				buffer: 3,
				crypto: 5,
				lYpoI2: 11
			}],
			2: [function(e, t, f) {
				(function(e, t, n, r, o, i, u, s, a) {
					(function(e) {
						"use strict";
						var a = "undefined" != typeof Uint8Array ? Uint8Array : Array, t = "+".charCodeAt(0), n = "/".charCodeAt(0), r = "0".charCodeAt(0), o = "a".charCodeAt(0), i = "A".charCodeAt(0), u = "-".charCodeAt(0), s = "_".charCodeAt(0);
						function f(e) {
							e = e.charCodeAt(0);
							return e === t || e === u ? 62 : e === n || e === s ? 63 : e < r ? -1 : e < r + 10 ? e - r + 26 + 26 : e < i + 26 ? e - i : e < o + 26 ? e - o + 26 : void 0;
						}
						e.toByteArray = function(e) {
							var t, n;
							if (0 < e.length % 4) throw new Error("Invalid string. Length must be a multiple of 4");
							var r = e.length, r = "=" === e.charAt(r - 2) ? 2 : "=" === e.charAt(r - 1) ? 1 : 0, o = new a(3 * e.length / 4 - r), i = 0 < r ? e.length - 4 : e.length, u = 0;
							function s(e) {
								o[u++] = e;
							}
							for (t = 0; t < i; t += 4) s((16711680 & (n = f(e.charAt(t)) << 18 | f(e.charAt(t + 1)) << 12 | f(e.charAt(t + 2)) << 6 | f(e.charAt(t + 3)))) >> 16), s((65280 & n) >> 8), s(255 & n);
							return 2 == r ? s(255 & (n = f(e.charAt(t)) << 2 | f(e.charAt(t + 1)) >> 4)) : 1 == r && (s((n = f(e.charAt(t)) << 10 | f(e.charAt(t + 1)) << 4 | f(e.charAt(t + 2)) >> 2) >> 8 & 255), s(255 & n)), o;
						}, e.fromByteArray = function(e) {
							var t, n, r, o, i = e.length % 3, u = "";
							function s(e) {
								return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e);
							}
							for (t = 0, r = e.length - i; t < r; t += 3) n = (e[t] << 16) + (e[t + 1] << 8) + e[t + 2], u += s((o = n) >> 18 & 63) + s(o >> 12 & 63) + s(o >> 6 & 63) + s(63 & o);
							switch (i) {
								case 1:
									u = (u += s((n = e[e.length - 1]) >> 2)) + s(n << 4 & 63) + "==";
									break;
								case 2: u = (u = (u += s((n = (e[e.length - 2] << 8) + e[e.length - 1]) >> 10)) + s(n >> 4 & 63)) + s(n << 2 & 63) + "=";
							}
							return u;
						};
					})(void 0 === f ? this.base64js = {} : f);
				}).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			3: [function(O, e, H) {
				(function(e, n, f, r, h, p, g, y, w) {
					var a = O("base64-js"), i = O("ieee754");
					function f(e, t, n) {
						if (!(this instanceof f)) return new f(e, t, n);
						var r, o, i, u, s = typeof e;
						if ("base64" === t && "string" == s) for (e = (u = e).trim ? u.trim() : u.replace(/^\s+|\s+$/g, ""); e.length % 4 != 0;) e += "=";
						if ("number" == s) r = j(e);
						else if ("string" == s) r = f.byteLength(e, t);
						else {
							if ("object" != s) throw new Error("First argument needs to be a number, array or string.");
							r = j(e.length);
						}
						if (f._useTypedArrays ? o = f._augment(new Uint8Array(r)) : ((o = this).length = r, o._isBuffer = !0), f._useTypedArrays && "number" == typeof e.byteLength) o._set(e);
						else if (C(u = e) || f.isBuffer(u) || u && "object" == typeof u && "number" == typeof u.length) for (i = 0; i < r; i++) f.isBuffer(e) ? o[i] = e.readUInt8(i) : o[i] = e[i];
						else if ("string" == s) o.write(e, 0, t);
						else if ("number" == s && !f._useTypedArrays && !n) for (i = 0; i < r; i++) o[i] = 0;
						return o;
					}
					function b(e, t, n, r) {
						return f._charsWritten = c(function(e) {
							for (var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
							return t;
						}(t), e, n, r);
					}
					function m(e, t, n, r) {
						return f._charsWritten = c(function(e) {
							for (var t, n, r = [], o = 0; o < e.length; o++) n = e.charCodeAt(o), t = n >> 8, n = n % 256, r.push(n), r.push(t);
							return r;
						}(t), e, n, r);
					}
					function v(e, t, n) {
						var r = "";
						n = Math.min(e.length, n);
						for (var o = t; o < n; o++) r += String.fromCharCode(e[o]);
						return r;
					}
					function o(e, t, n, r) {
						r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 1 < e.length, "Trying to read beyond buffer length"));
						var o, r = e.length;
						if (!(r <= t)) return n ? (o = e[t], t + 1 < r && (o |= e[t + 1] << 8)) : (o = e[t] << 8, t + 1 < r && (o |= e[t + 1])), o;
					}
					function u(e, t, n, r) {
						r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 3 < e.length, "Trying to read beyond buffer length"));
						var o, r = e.length;
						if (!(r <= t)) return n ? (t + 2 < r && (o = e[t + 2] << 16), t + 1 < r && (o |= e[t + 1] << 8), o |= e[t], t + 3 < r && (o += e[t + 3] << 24 >>> 0)) : (t + 1 < r && (o = e[t + 1] << 16), t + 2 < r && (o |= e[t + 2] << 8), t + 3 < r && (o |= e[t + 3]), o += e[t] << 24 >>> 0), o;
					}
					function _(e, t, n, r) {
						if (r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 1 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) return r = o(e, t, n, !0), 32768 & r ? -1 * (65535 - r + 1) : r;
					}
					function E(e, t, n, r) {
						if (r || (d("boolean" == typeof n, "missing or invalid endian"), d(null != t, "missing offset"), d(t + 3 < e.length, "Trying to read beyond buffer length")), !(e.length <= t)) return r = u(e, t, n, !0), 2147483648 & r ? -1 * (4294967295 - r + 1) : r;
					}
					function I(e, t, n, r) {
						return r || (d("boolean" == typeof n, "missing or invalid endian"), d(t + 3 < e.length, "Trying to read beyond buffer length")), i.read(e, t, n, 23, 4);
					}
					function A(e, t, n, r) {
						return r || (d("boolean" == typeof n, "missing or invalid endian"), d(t + 7 < e.length, "Trying to read beyond buffer length")), i.read(e, t, n, 52, 8);
					}
					function s(e, t, n, r, o) {
						o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 1 < e.length, "trying to write beyond buffer length"), Y(t, 65535));
						o = e.length;
						if (!(o <= n)) for (var i = 0, u = Math.min(o - n, 2); i < u; i++) e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i);
					}
					function l(e, t, n, r, o) {
						o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 3 < e.length, "trying to write beyond buffer length"), Y(t, 4294967295));
						o = e.length;
						if (!(o <= n)) for (var i = 0, u = Math.min(o - n, 4); i < u; i++) e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255;
					}
					function B(e, t, n, r, o) {
						o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 1 < e.length, "Trying to write beyond buffer length"), F(t, 32767, -32768)), e.length <= n || s(e, 0 <= t ? t : 65535 + t + 1, n, r, o);
					}
					function L(e, t, n, r, o) {
						o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 3 < e.length, "Trying to write beyond buffer length"), F(t, 2147483647, -2147483648)), e.length <= n || l(e, 0 <= t ? t : 4294967295 + t + 1, n, r, o);
					}
					function U(e, t, n, r, o) {
						o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 3 < e.length, "Trying to write beyond buffer length"), D(t, 34028234663852886e22, -34028234663852886e22)), e.length <= n || i.write(e, t, n, r, 23, 4);
					}
					function x(e, t, n, r, o) {
						o || (d(null != t, "missing value"), d("boolean" == typeof r, "missing or invalid endian"), d(null != n, "missing offset"), d(n + 7 < e.length, "Trying to write beyond buffer length"), D(t, 17976931348623157e292, -17976931348623157e292)), e.length <= n || i.write(e, t, n, r, 52, 8);
					}
					H.Buffer = f, H.SlowBuffer = f, H.INSPECT_MAX_BYTES = 50, f.poolSize = 8192, f._useTypedArrays = function() {
						try {
							var t = new Uint8Array(/* @__PURE__ */ new ArrayBuffer(0));
							return t.foo = function() {
								return 42;
							}, 42 === t.foo() && "function" == typeof t.subarray;
						} catch (e) {
							return !1;
						}
					}(), f.isEncoding = function(e) {
						switch (String(e).toLowerCase()) {
							case "hex":
							case "utf8":
							case "utf-8":
							case "ascii":
							case "binary":
							case "base64":
							case "raw":
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le": return !0;
							default: return !1;
						}
					}, f.isBuffer = function(e) {
						return !(null == e || !e._isBuffer);
					}, f.byteLength = function(e, t) {
						var n;
						switch (e += "", t || "utf8") {
							case "hex":
								n = e.length / 2;
								break;
							case "utf8":
							case "utf-8":
								n = T(e).length;
								break;
							case "ascii":
							case "binary":
							case "raw":
								n = e.length;
								break;
							case "base64":
								n = M(e).length;
								break;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								n = 2 * e.length;
								break;
							default: throw new Error("Unknown encoding");
						}
						return n;
					}, f.concat = function(e, t) {
						if (d(C(e), "Usage: Buffer.concat(list, [totalLength])\nlist should be an Array."), 0 === e.length) return new f(0);
						if (1 === e.length) return e[0];
						if ("number" != typeof t) for (o = t = 0; o < e.length; o++) t += e[o].length;
						for (var n = new f(t), r = 0, o = 0; o < e.length; o++) {
							var i = e[o];
							i.copy(n, r), r += i.length;
						}
						return n;
					}, f.prototype.write = function(e, t, n, r) {
						isFinite(t) ? isFinite(n) || (r = n, n = void 0) : (a = r, r = t, t = n, n = a), t = Number(t) || 0;
						var o, i, u, s, a = this.length - t;
						switch ((!n || a < (n = Number(n))) && (n = a), r = String(r || "utf8").toLowerCase()) {
							case "hex":
								o = function(e, t, n, r) {
									n = Number(n) || 0;
									var o = e.length - n;
									(!r || o < (r = Number(r))) && (r = o), d((o = t.length) % 2 == 0, "Invalid hex string"), o / 2 < r && (r = o / 2);
									for (var i = 0; i < r; i++) {
										var u = parseInt(t.substr(2 * i, 2), 16);
										d(!isNaN(u), "Invalid hex string"), e[n + i] = u;
									}
									return f._charsWritten = 2 * i, i;
								}(this, e, t, n);
								break;
							case "utf8":
							case "utf-8":
								i = this, u = t, s = n, o = f._charsWritten = c(T(e), i, u, s);
								break;
							case "ascii":
							case "binary":
								o = b(this, e, t, n);
								break;
							case "base64":
								i = this, u = t, s = n, o = f._charsWritten = c(M(e), i, u, s);
								break;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								o = m(this, e, t, n);
								break;
							default: throw new Error("Unknown encoding");
						}
						return o;
					}, f.prototype.toString = function(e, t, n) {
						var r, o, i, u, s = this;
						if (e = String(e || "utf8").toLowerCase(), t = Number(t) || 0, (n = void 0 !== n ? Number(n) : s.length) === t) return "";
						switch (e) {
							case "hex":
								r = function(e, t, n) {
									var r = e.length;
									(!t || t < 0) && (t = 0);
									(!n || n < 0 || r < n) && (n = r);
									for (var o = "", i = t; i < n; i++) o += k(e[i]);
									return o;
								}(s, t, n);
								break;
							case "utf8":
							case "utf-8":
								r = function(e, t, n) {
									var r = "", o = "";
									n = Math.min(e.length, n);
									for (var i = t; i < n; i++) e[i] <= 127 ? (r += N(o) + String.fromCharCode(e[i]), o = "") : o += "%" + e[i].toString(16);
									return r + N(o);
								}(s, t, n);
								break;
							case "ascii":
							case "binary":
								r = v(s, t, n);
								break;
							case "base64":
								o = s, u = n, r = 0 === (i = t) && u === o.length ? a.fromByteArray(o) : a.fromByteArray(o.slice(i, u));
								break;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								r = function(e, t, n) {
									for (var r = e.slice(t, n), o = "", i = 0; i < r.length; i += 2) o += String.fromCharCode(r[i] + 256 * r[i + 1]);
									return o;
								}(s, t, n);
								break;
							default: throw new Error("Unknown encoding");
						}
						return r;
					}, f.prototype.toJSON = function() {
						return {
							type: "Buffer",
							data: Array.prototype.slice.call(this._arr || this, 0)
						};
					}, f.prototype.copy = function(e, t, n, r) {
						if (t = t || 0, (r = r || 0 === r ? r : this.length) !== (n = n || 0) && 0 !== e.length && 0 !== this.length) {
							d(n <= r, "sourceEnd < sourceStart"), d(0 <= t && t < e.length, "targetStart out of bounds"), d(0 <= n && n < this.length, "sourceStart out of bounds"), d(0 <= r && r <= this.length, "sourceEnd out of bounds"), r > this.length && (r = this.length);
							var o = (r = e.length - t < r - n ? e.length - t + n : r) - n;
							if (o < 100 || !f._useTypedArrays) for (var i = 0; i < o; i++) e[i + t] = this[i + n];
							else e._set(this.subarray(n, n + o), t);
						}
					}, f.prototype.slice = function(e, t) {
						var n = this.length;
						if (e = S(e, n, 0), t = S(t, n, n), f._useTypedArrays) return f._augment(this.subarray(e, t));
						for (var r = t - e, o = new f(r, void 0, !0), i = 0; i < r; i++) o[i] = this[i + e];
						return o;
					}, f.prototype.get = function(e) {
						return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(e);
					}, f.prototype.set = function(e, t) {
						return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(e, t);
					}, f.prototype.readUInt8 = function(e, t) {
						if (t || (d(null != e, "missing offset"), d(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return this[e];
					}, f.prototype.readUInt16LE = function(e, t) {
						return o(this, e, !0, t);
					}, f.prototype.readUInt16BE = function(e, t) {
						return o(this, e, !1, t);
					}, f.prototype.readUInt32LE = function(e, t) {
						return u(this, e, !0, t);
					}, f.prototype.readUInt32BE = function(e, t) {
						return u(this, e, !1, t);
					}, f.prototype.readInt8 = function(e, t) {
						if (t || (d(null != e, "missing offset"), d(e < this.length, "Trying to read beyond buffer length")), !(e >= this.length)) return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
					}, f.prototype.readInt16LE = function(e, t) {
						return _(this, e, !0, t);
					}, f.prototype.readInt16BE = function(e, t) {
						return _(this, e, !1, t);
					}, f.prototype.readInt32LE = function(e, t) {
						return E(this, e, !0, t);
					}, f.prototype.readInt32BE = function(e, t) {
						return E(this, e, !1, t);
					}, f.prototype.readFloatLE = function(e, t) {
						return I(this, e, !0, t);
					}, f.prototype.readFloatBE = function(e, t) {
						return I(this, e, !1, t);
					}, f.prototype.readDoubleLE = function(e, t) {
						return A(this, e, !0, t);
					}, f.prototype.readDoubleBE = function(e, t) {
						return A(this, e, !1, t);
					}, f.prototype.writeUInt8 = function(e, t, n) {
						n || (d(null != e, "missing value"), d(null != t, "missing offset"), d(t < this.length, "trying to write beyond buffer length"), Y(e, 255)), t >= this.length || (this[t] = e);
					}, f.prototype.writeUInt16LE = function(e, t, n) {
						s(this, e, t, !0, n);
					}, f.prototype.writeUInt16BE = function(e, t, n) {
						s(this, e, t, !1, n);
					}, f.prototype.writeUInt32LE = function(e, t, n) {
						l(this, e, t, !0, n);
					}, f.prototype.writeUInt32BE = function(e, t, n) {
						l(this, e, t, !1, n);
					}, f.prototype.writeInt8 = function(e, t, n) {
						n || (d(null != e, "missing value"), d(null != t, "missing offset"), d(t < this.length, "Trying to write beyond buffer length"), F(e, 127, -128)), t >= this.length || (0 <= e ? this.writeUInt8(e, t, n) : this.writeUInt8(255 + e + 1, t, n));
					}, f.prototype.writeInt16LE = function(e, t, n) {
						B(this, e, t, !0, n);
					}, f.prototype.writeInt16BE = function(e, t, n) {
						B(this, e, t, !1, n);
					}, f.prototype.writeInt32LE = function(e, t, n) {
						L(this, e, t, !0, n);
					}, f.prototype.writeInt32BE = function(e, t, n) {
						L(this, e, t, !1, n);
					}, f.prototype.writeFloatLE = function(e, t, n) {
						U(this, e, t, !0, n);
					}, f.prototype.writeFloatBE = function(e, t, n) {
						U(this, e, t, !1, n);
					}, f.prototype.writeDoubleLE = function(e, t, n) {
						x(this, e, t, !0, n);
					}, f.prototype.writeDoubleBE = function(e, t, n) {
						x(this, e, t, !1, n);
					}, f.prototype.fill = function(e, t, n) {
						if (t = t || 0, n = n || this.length, d("number" == typeof (e = "string" == typeof (e = e || 0) ? e.charCodeAt(0) : e) && !isNaN(e), "value is not a number"), d(t <= n, "end < start"), n !== t && 0 !== this.length) {
							d(0 <= t && t < this.length, "start out of bounds"), d(0 <= n && n <= this.length, "end out of bounds");
							for (var r = t; r < n; r++) this[r] = e;
						}
					}, f.prototype.inspect = function() {
						for (var e = [], t = this.length, n = 0; n < t; n++) if (e[n] = k(this[n]), n === H.INSPECT_MAX_BYTES) {
							e[n + 1] = "...";
							break;
						}
						return "<Buffer " + e.join(" ") + ">";
					}, f.prototype.toArrayBuffer = function() {
						if ("undefined" == typeof Uint8Array) throw new Error("Buffer.toArrayBuffer not supported in this browser");
						if (f._useTypedArrays) return new f(this).buffer;
						for (var e = new Uint8Array(this.length), t = 0, n = e.length; t < n; t += 1) e[t] = this[t];
						return e.buffer;
					};
					var t = f.prototype;
					function S(e, t, n) {
						return "number" != typeof e ? n : t <= (e = ~~e) ? t : 0 <= e || 0 <= (e += t) ? e : 0;
					}
					function j(e) {
						return (e = ~~Math.ceil(+e)) < 0 ? 0 : e;
					}
					function C(e) {
						return (Array.isArray || function(e) {
							return "[object Array]" === Object.prototype.toString.call(e);
						})(e);
					}
					function k(e) {
						return e < 16 ? "0" + e.toString(16) : e.toString(16);
					}
					function T(e) {
						for (var t = [], n = 0; n < e.length; n++) {
							var r = e.charCodeAt(n);
							if (r <= 127) t.push(e.charCodeAt(n));
							else for (var o = n, i = (55296 <= r && r <= 57343 && n++, encodeURIComponent(e.slice(o, n + 1)).substr(1).split("%")), u = 0; u < i.length; u++) t.push(parseInt(i[u], 16));
						}
						return t;
					}
					function M(e) {
						return a.toByteArray(e);
					}
					function c(e, t, n, r) {
						for (var o = 0; o < r && !(o + n >= t.length || o >= e.length); o++) t[o + n] = e[o];
						return o;
					}
					function N(e) {
						try {
							return decodeURIComponent(e);
						} catch (e) {
							return String.fromCharCode(65533);
						}
					}
					function Y(e, t) {
						d("number" == typeof e, "cannot write a non-number as a number"), d(0 <= e, "specified a negative value for writing an unsigned value"), d(e <= t, "value is larger than maximum value for type"), d(Math.floor(e) === e, "value has a fractional component");
					}
					function F(e, t, n) {
						d("number" == typeof e, "cannot write a non-number as a number"), d(e <= t, "value larger than maximum allowed value"), d(n <= e, "value smaller than minimum allowed value"), d(Math.floor(e) === e, "value has a fractional component");
					}
					function D(e, t, n) {
						d("number" == typeof e, "cannot write a non-number as a number"), d(e <= t, "value larger than maximum allowed value"), d(n <= e, "value smaller than minimum allowed value");
					}
					function d(e, t) {
						if (!e) throw new Error(t || "Failed assertion");
					}
					f._augment = function(e) {
						return e._isBuffer = !0, e._get = e.get, e._set = e.set, e.get = t.get, e.set = t.set, e.write = t.write, e.toString = t.toString, e.toLocaleString = t.toString, e.toJSON = t.toJSON, e.copy = t.copy, e.slice = t.slice, e.readUInt8 = t.readUInt8, e.readUInt16LE = t.readUInt16LE, e.readUInt16BE = t.readUInt16BE, e.readUInt32LE = t.readUInt32LE, e.readUInt32BE = t.readUInt32BE, e.readInt8 = t.readInt8, e.readInt16LE = t.readInt16LE, e.readInt16BE = t.readInt16BE, e.readInt32LE = t.readInt32LE, e.readInt32BE = t.readInt32BE, e.readFloatLE = t.readFloatLE, e.readFloatBE = t.readFloatBE, e.readDoubleLE = t.readDoubleLE, e.readDoubleBE = t.readDoubleBE, e.writeUInt8 = t.writeUInt8, e.writeUInt16LE = t.writeUInt16LE, e.writeUInt16BE = t.writeUInt16BE, e.writeUInt32LE = t.writeUInt32LE, e.writeUInt32BE = t.writeUInt32BE, e.writeInt8 = t.writeInt8, e.writeInt16LE = t.writeInt16LE, e.writeInt16BE = t.writeInt16BE, e.writeInt32LE = t.writeInt32LE, e.writeInt32BE = t.writeInt32BE, e.writeFloatLE = t.writeFloatLE, e.writeFloatBE = t.writeFloatBE, e.writeDoubleLE = t.writeDoubleLE, e.writeDoubleBE = t.writeDoubleBE, e.fill = t.fill, e.inspect = t.inspect, e.toArrayBuffer = t.toArrayBuffer, e;
					};
				}).call(this, O("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, O("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
			}, {
				"base64-js": 2,
				buffer: 3,
				ieee754: 10,
				lYpoI2: 11
			}],
			4: [function(c, d, e) {
				(function(e, t, a, n, r, o, i, u, s) {
					var a = c("buffer").Buffer, f = 4, l = new a(f);
					l.fill(0);
					d.exports = { hash: function(e, t, n, r) {
						for (var o = t(function(e, t) {
							e.length % f != 0 && (n = e.length + (f - e.length % f), e = a.concat([e, l], n));
							for (var n, r = [], o = t ? e.readInt32BE : e.readInt32LE, i = 0; i < e.length; i += f) r.push(o.call(e, i));
							return r;
						}(e = a.isBuffer(e) ? e : new a(e), r), 8 * e.length), t = r, i = new a(n), u = t ? i.writeInt32BE : i.writeInt32LE, s = 0; s < o.length; s++) u.call(i, o[s], 4 * s, !0);
						return i;
					} };
				}).call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			5: [function(v, e, _) {
				(function(l, c, u, d, h, p, g, y, w) {
					var u = v("buffer").Buffer, e = v("./sha"), t = v("./sha256"), n = v("./rng"), b = {
						sha1: e,
						sha256: t,
						md5: v("./md5")
					}, s = 64, a = new u(s);
					function r(e, n) {
						var r = b[e = e || "sha1"], o = [];
						return r || i("algorithm:", e, "is not yet supported"), {
							update: function(e) {
								return u.isBuffer(e) || (e = new u(e)), o.push(e), e.length, this;
							},
							digest: function(e) {
								var t = u.concat(o), t = n ? function(e, t, n) {
									u.isBuffer(t) || (t = new u(t)), u.isBuffer(n) || (n = new u(n)), t.length > s ? t = e(t) : t.length < s && (t = u.concat([t, a], s));
									for (var r = new u(s), o = new u(s), i = 0; i < s; i++) r[i] = 54 ^ t[i], o[i] = 92 ^ t[i];
									return n = e(u.concat([r, n])), e(u.concat([o, n]));
								}(r, n, t) : r(t);
								return o = null, e ? t.toString(e) : t;
							}
						};
					}
					function i() {
						var e = [].slice.call(arguments).join(" ");
						throw new Error([
							e,
							"we accept pull requests",
							"http://github.com/dominictarr/crypto-browserify"
						].join("\n"));
					}
					a.fill(0), _.createHash = function(e) {
						return r(e);
					}, _.createHmac = r, _.randomBytes = function(e, t) {
						if (!t || !t.call) return new u(n(e));
						try {
							t.call(this, void 0, new u(n(e)));
						} catch (e) {
							t(e);
						}
					};
					var o, f = [
						"createCredentials",
						"createCipher",
						"createCipheriv",
						"createDecipher",
						"createDecipheriv",
						"createSign",
						"createVerify",
						"createDiffieHellman",
						"pbkdf2"
					], m = function(e) {
						_[e] = function() {
							i("sorry,", e, "is not implemented yet");
						};
					};
					for (o in f) m(f[o], o);
				}).call(this, v("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, v("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./md5": 6,
				"./rng": 7,
				"./sha": 8,
				"./sha256": 9,
				buffer: 3,
				lYpoI2: 11
			}],
			6: [function(w, b, e) {
				(function(e, r, o, i, u, a, f, l, y) {
					var t = w("./helpers");
					function n(e, t) {
						e[t >> 5] |= 128 << t % 32, e[14 + (t + 64 >>> 9 << 4)] = t;
						for (var n = 1732584193, r = -271733879, o = -1732584194, i = 271733878, u = 0; u < e.length; u += 16) {
							var s = n, a = r, f = o, l = i, n = c(n, r, o, i, e[u + 0], 7, -680876936), i = c(i, n, r, o, e[u + 1], 12, -389564586), o = c(o, i, n, r, e[u + 2], 17, 606105819), r = c(r, o, i, n, e[u + 3], 22, -1044525330);
							n = c(n, r, o, i, e[u + 4], 7, -176418897), i = c(i, n, r, o, e[u + 5], 12, 1200080426), o = c(o, i, n, r, e[u + 6], 17, -1473231341), r = c(r, o, i, n, e[u + 7], 22, -45705983), n = c(n, r, o, i, e[u + 8], 7, 1770035416), i = c(i, n, r, o, e[u + 9], 12, -1958414417), o = c(o, i, n, r, e[u + 10], 17, -42063), r = c(r, o, i, n, e[u + 11], 22, -1990404162), n = c(n, r, o, i, e[u + 12], 7, 1804603682), i = c(i, n, r, o, e[u + 13], 12, -40341101), o = c(o, i, n, r, e[u + 14], 17, -1502002290), n = d(n, r = c(r, o, i, n, e[u + 15], 22, 1236535329), o, i, e[u + 1], 5, -165796510), i = d(i, n, r, o, e[u + 6], 9, -1069501632), o = d(o, i, n, r, e[u + 11], 14, 643717713), r = d(r, o, i, n, e[u + 0], 20, -373897302), n = d(n, r, o, i, e[u + 5], 5, -701558691), i = d(i, n, r, o, e[u + 10], 9, 38016083), o = d(o, i, n, r, e[u + 15], 14, -660478335), r = d(r, o, i, n, e[u + 4], 20, -405537848), n = d(n, r, o, i, e[u + 9], 5, 568446438), i = d(i, n, r, o, e[u + 14], 9, -1019803690), o = d(o, i, n, r, e[u + 3], 14, -187363961), r = d(r, o, i, n, e[u + 8], 20, 1163531501), n = d(n, r, o, i, e[u + 13], 5, -1444681467), i = d(i, n, r, o, e[u + 2], 9, -51403784), o = d(o, i, n, r, e[u + 7], 14, 1735328473), n = h(n, r = d(r, o, i, n, e[u + 12], 20, -1926607734), o, i, e[u + 5], 4, -378558), i = h(i, n, r, o, e[u + 8], 11, -2022574463), o = h(o, i, n, r, e[u + 11], 16, 1839030562), r = h(r, o, i, n, e[u + 14], 23, -35309556), n = h(n, r, o, i, e[u + 1], 4, -1530992060), i = h(i, n, r, o, e[u + 4], 11, 1272893353), o = h(o, i, n, r, e[u + 7], 16, -155497632), r = h(r, o, i, n, e[u + 10], 23, -1094730640), n = h(n, r, o, i, e[u + 13], 4, 681279174), i = h(i, n, r, o, e[u + 0], 11, -358537222), o = h(o, i, n, r, e[u + 3], 16, -722521979), r = h(r, o, i, n, e[u + 6], 23, 76029189), n = h(n, r, o, i, e[u + 9], 4, -640364487), i = h(i, n, r, o, e[u + 12], 11, -421815835), o = h(o, i, n, r, e[u + 15], 16, 530742520), n = p(n, r = h(r, o, i, n, e[u + 2], 23, -995338651), o, i, e[u + 0], 6, -198630844), i = p(i, n, r, o, e[u + 7], 10, 1126891415), o = p(o, i, n, r, e[u + 14], 15, -1416354905), r = p(r, o, i, n, e[u + 5], 21, -57434055), n = p(n, r, o, i, e[u + 12], 6, 1700485571), i = p(i, n, r, o, e[u + 3], 10, -1894986606), o = p(o, i, n, r, e[u + 10], 15, -1051523), r = p(r, o, i, n, e[u + 1], 21, -2054922799), n = p(n, r, o, i, e[u + 8], 6, 1873313359), i = p(i, n, r, o, e[u + 15], 10, -30611744), o = p(o, i, n, r, e[u + 6], 15, -1560198380), r = p(r, o, i, n, e[u + 13], 21, 1309151649), n = p(n, r, o, i, e[u + 4], 6, -145523070), i = p(i, n, r, o, e[u + 11], 10, -1120210379), o = p(o, i, n, r, e[u + 2], 15, 718787259), r = p(r, o, i, n, e[u + 9], 21, -343485551), n = g(n, s), r = g(r, a), o = g(o, f), i = g(i, l);
						}
						return Array(n, r, o, i);
					}
					function s(e, t, n, r, o, i) {
						return g((t = g(g(t, e), g(r, i))) << o | t >>> 32 - o, n);
					}
					function c(e, t, n, r, o, i, u) {
						return s(t & n | ~t & r, e, t, o, i, u);
					}
					function d(e, t, n, r, o, i, u) {
						return s(t & r | n & ~r, e, t, o, i, u);
					}
					function h(e, t, n, r, o, i, u) {
						return s(t ^ n ^ r, e, t, o, i, u);
					}
					function p(e, t, n, r, o, i, u) {
						return s(n ^ (t | ~r), e, t, o, i, u);
					}
					function g(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
					}
					b.exports = function(e) {
						return t.hash(e, n, 16);
					};
				}).call(this, w("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, w("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./helpers": 4,
				buffer: 3,
				lYpoI2: 11
			}],
			7: [function(e, l, t) {
				(function(e, t, n, r, o, i, u, s, f) {
					var a;
					l.exports = a || function(e) {
						for (var t, n = new Array(e), r = 0; r < e; r++) 0 == (3 & r) && (t = 4294967296 * Math.random()), n[r] = t >>> ((3 & r) << 3) & 255;
						return n;
					};
				}).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			8: [function(c, d, e) {
				(function(e, t, n, r, o, s, a, f, l) {
					var i = c("./helpers");
					function u(l, c) {
						l[c >> 5] |= 128 << 24 - c % 32, l[15 + (c + 64 >> 9 << 4)] = c;
						for (var e, t, n, r = Array(80), o = 1732584193, i = -271733879, u = -1732584194, s = 271733878, d = -1009589776, h = 0; h < l.length; h += 16) {
							for (var p = o, g = i, y = u, w = s, b = d, a = 0; a < 80; a++) {
								r[a] = a < 16 ? l[h + a] : v(r[a - 3] ^ r[a - 8] ^ r[a - 14] ^ r[a - 16], 1);
								var f = m(m(v(o, 5), (f = i, t = u, n = s, (e = a) < 20 ? f & t | ~f & n : !(e < 40) && e < 60 ? f & t | f & n | t & n : f ^ t ^ n)), m(m(d, r[a]), (e = a) < 20 ? 1518500249 : e < 40 ? 1859775393 : e < 60 ? -1894007588 : -899497514)), d = s, s = u, u = v(i, 30), i = o, o = f;
							}
							o = m(o, p), i = m(i, g), u = m(u, y), s = m(s, w), d = m(d, b);
						}
						return Array(o, i, u, s, d);
					}
					function m(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
					}
					function v(e, t) {
						return e << t | e >>> 32 - t;
					}
					d.exports = function(e) {
						return i.hash(e, u, 20, !0);
					};
				}).call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./helpers": 4,
				buffer: 3,
				lYpoI2: 11
			}],
			9: [function(c, d, e) {
				(function(e, t, n, r, u, s, a, f, l) {
					function b(e, t) {
						var n = (65535 & e) + (65535 & t);
						return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
					}
					function o(e, l) {
						var c, d = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298), t = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225), n = new Array(64);
						e[l >> 5] |= 128 << 24 - l % 32, e[15 + (l + 64 >> 9 << 4)] = l;
						for (var r, o, h = 0; h < e.length; h += 16) {
							for (var i = t[0], u = t[1], s = t[2], p = t[3], a = t[4], g = t[5], y = t[6], w = t[7], f = 0; f < 64; f++) n[f] = f < 16 ? e[f + h] : b(b(b((o = n[f - 2], m(o, 17) ^ m(o, 19) ^ v(o, 10)), n[f - 7]), (o = n[f - 15], m(o, 7) ^ m(o, 18) ^ v(o, 3))), n[f - 16]), c = b(b(b(b(w, m(o = a, 6) ^ m(o, 11) ^ m(o, 25)), a & g ^ ~a & y), d[f]), n[f]), r = b(m(r = i, 2) ^ m(r, 13) ^ m(r, 22), i & u ^ i & s ^ u & s), w = y, y = g, g = a, a = b(p, c), p = s, s = u, u = i, i = b(c, r);
							t[0] = b(i, t[0]), t[1] = b(u, t[1]), t[2] = b(s, t[2]), t[3] = b(p, t[3]), t[4] = b(a, t[4]), t[5] = b(g, t[5]), t[6] = b(y, t[6]), t[7] = b(w, t[7]);
						}
						return t;
					}
					var i = c("./helpers"), m = function(e, t) {
						return e >>> t | e << 32 - t;
					}, v = function(e, t) {
						return e >>> t;
					};
					d.exports = function(e) {
						return i.hash(e, o, 32, !0);
					};
				}).call(this, c("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, c("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
			}, {
				"./helpers": 4,
				buffer: 3,
				lYpoI2: 11
			}],
			10: [function(e, t, f) {
				(function(e, t, n, r, o, i, u, s, a) {
					f.read = function(e, t, n, r, o) {
						var i, u, l = 8 * o - r - 1, c = (1 << l) - 1, d = c >> 1, s = -7, a = n ? o - 1 : 0, f = n ? -1 : 1, o = e[t + a];
						for (a += f, i = o & (1 << -s) - 1, o >>= -s, s += l; 0 < s; i = 256 * i + e[t + a], a += f, s -= 8);
						for (u = i & (1 << -s) - 1, i >>= -s, s += r; 0 < s; u = 256 * u + e[t + a], a += f, s -= 8);
						if (0 === i) i = 1 - d;
						else {
							if (i === c) return u ? NaN : Infinity * (o ? -1 : 1);
							u += Math.pow(2, r), i -= d;
						}
						return (o ? -1 : 1) * u * Math.pow(2, i - r);
					}, f.write = function(e, t, l, n, r, c) {
						var o, i, u = 8 * c - r - 1, s = (1 << u) - 1, a = s >> 1, d = 23 === r ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f = n ? 0 : c - 1, h = n ? 1 : -1, c = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
						for (t = Math.abs(t), isNaN(t) || t === Infinity ? (i = isNaN(t) ? 1 : 0, o = s) : (o = Math.floor(Math.log(t) / Math.LN2), t * (n = Math.pow(2, -o)) < 1 && (o--, n *= 2), 2 <= (t += 1 <= o + a ? d / n : d * Math.pow(2, 1 - a)) * n && (o++, n /= 2), s <= o + a ? (i = 0, o = s) : 1 <= o + a ? (i = (t * n - 1) * Math.pow(2, r), o += a) : (i = t * Math.pow(2, a - 1) * Math.pow(2, r), o = 0)); 8 <= r; e[l + f] = 255 & i, f += h, i /= 256, r -= 8);
						for (o = o << r | i, u += r; 0 < u; e[l + f] = 255 & o, f += h, o /= 256, u -= 8);
						e[l + f - h] |= 128 * c;
					};
				}).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/ieee754/index.js", "/node_modules/gulp-browserify/node_modules/ieee754");
			}, {
				buffer: 3,
				lYpoI2: 11
			}],
			11: [function(e, h, t) {
				(function(e, t, n, r, o, f, l, c, d) {
					var i, u, s;
					function a() {}
					(e = h.exports = {}).nextTick = (u = "undefined" != typeof window && window.setImmediate, s = "undefined" != typeof window && window.postMessage && window.addEventListener, u ? function(e) {
						return window.setImmediate(e);
					} : s ? (i = [], window.addEventListener("message", function(e) {
						var t = e.source;
						t !== window && null !== t || "process-tick" !== e.data || (e.stopPropagation(), 0 < i.length && i.shift()());
					}, !0), function(e) {
						i.push(e), window.postMessage("process-tick", "*");
					}) : function(e) {
						setTimeout(e, 0);
					}), e.title = "browser", e.browser = !0, e.env = {}, e.argv = [], e.on = a, e.addListener = a, e.once = a, e.off = a, e.removeListener = a, e.removeAllListeners = a, e.emit = a, e.binding = function(e) {
						throw new Error("process.binding is not supported");
					}, e.cwd = function() {
						return "/";
					}, e.chdir = function(e) {
						throw new Error("process.chdir is not supported");
					};
				}).call(this, e("lYpoI2"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
			}, {
				buffer: 3,
				lYpoI2: 11
			}]
		}, {}, [1])(1);
	});
}));
//#endregion
//#region node_modules/.pnpm/object-keys@1.1.1/node_modules/object-keys/isArguments.js
var require_isArguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toStr = Object.prototype.toString;
	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === "[object Arguments]";
		if (!isArgs) isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
		return isArgs;
	};
}));
//#endregion
//#region node_modules/.pnpm/object-keys@1.1.1/node_modules/object-keys/implementation.js
var require_implementation$4 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var keysShim;
	if (!Object.keys) {
		var has = Object.prototype.hasOwnProperty;
		var toStr = Object.prototype.toString;
		var isArgs = require_isArguments();
		var isEnumerable = Object.prototype.propertyIsEnumerable;
		var hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
		var hasProtoEnumBug = isEnumerable.call(function() {}, "prototype");
		var dontEnums = [
			"toString",
			"toLocaleString",
			"valueOf",
			"hasOwnProperty",
			"isPrototypeOf",
			"propertyIsEnumerable",
			"constructor"
		];
		var equalsConstructorPrototype = function(o) {
			var ctor = o.constructor;
			return ctor && ctor.prototype === o;
		};
		var excludedKeys = {
			$applicationCache: true,
			$console: true,
			$external: true,
			$frame: true,
			$frameElement: true,
			$frames: true,
			$innerHeight: true,
			$innerWidth: true,
			$onmozfullscreenchange: true,
			$onmozfullscreenerror: true,
			$outerHeight: true,
			$outerWidth: true,
			$pageXOffset: true,
			$pageYOffset: true,
			$parent: true,
			$scrollLeft: true,
			$scrollTop: true,
			$scrollX: true,
			$scrollY: true,
			$self: true,
			$webkitIndexedDB: true,
			$webkitStorageInfo: true,
			$window: true
		};
		var hasAutomationEqualityBug = function() {
			if (typeof window === "undefined") return false;
			for (var k in window) try {
				if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			} catch (e) {
				return true;
			}
			return false;
		}();
		var equalsConstructorPrototypeIfNotBuggy = function(o) {
			if (typeof window === "undefined" || !hasAutomationEqualityBug) return equalsConstructorPrototype(o);
			try {
				return equalsConstructorPrototype(o);
			} catch (e) {
				return false;
			}
		};
		keysShim = function keys(object) {
			var isObject = object !== null && typeof object === "object";
			var isFunction = toStr.call(object) === "[object Function]";
			var isArguments = isArgs(object);
			var isString = isObject && toStr.call(object) === "[object String]";
			var theKeys = [];
			if (!isObject && !isFunction && !isArguments) throw new TypeError("Object.keys called on a non-object");
			var skipProto = hasProtoEnumBug && isFunction;
			if (isString && object.length > 0 && !has.call(object, 0)) for (var i = 0; i < object.length; ++i) theKeys.push(String(i));
			if (isArguments && object.length > 0) for (var j = 0; j < object.length; ++j) theKeys.push(String(j));
			else for (var name in object) if (!(skipProto && name === "prototype") && has.call(object, name)) theKeys.push(String(name));
			if (hasDontEnumBug) {
				var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
				for (var k = 0; k < dontEnums.length; ++k) if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) theKeys.push(dontEnums[k]);
			}
			return theKeys;
		};
	}
	module.exports = keysShim;
}));
//#endregion
//#region node_modules/.pnpm/object-keys@1.1.1/node_modules/object-keys/index.js
var require_object_keys = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var slice = Array.prototype.slice;
	var isArgs = require_isArguments();
	var origKeys = Object.keys;
	var keysShim = origKeys ? function keys(o) {
		return origKeys(o);
	} : require_implementation$4();
	var originalKeys = Object.keys;
	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			if (!function() {
				var args = Object.keys(arguments);
				return args && args.length === arguments.length;
			}(1, 2)) Object.keys = function keys(object) {
				if (isArgs(object)) return originalKeys(slice.call(object));
				return originalKeys(object);
			};
		} else Object.keys = keysShim;
		return Object.keys || keysShim;
	};
	module.exports = keysShim;
}));
//#endregion
//#region node_modules/.pnpm/es-define-property@1.0.1/node_modules/es-define-property/index.js
var require_es_define_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) try {
		$defineProperty({}, "a", { value: 1 });
	} catch (e) {
		$defineProperty = false;
	}
	module.exports = $defineProperty;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/syntax.js
var require_syntax = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./syntax')} */
	module.exports = SyntaxError;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/type.js
var require_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./type')} */
	module.exports = TypeError;
}));
//#endregion
//#region node_modules/.pnpm/gopd@1.2.0/node_modules/gopd/gOPD.js
var require_gOPD = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./gOPD')} */
	module.exports = Object.getOwnPropertyDescriptor;
}));
//#endregion
//#region node_modules/.pnpm/gopd@1.2.0/node_modules/gopd/index.js
var require_gopd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $gOPD = require_gOPD();
	if ($gOPD) try {
		$gOPD([], "length");
	} catch (e) {
		$gOPD = null;
	}
	module.exports = $gOPD;
}));
//#endregion
//#region node_modules/.pnpm/define-data-property@1.1.4/node_modules/define-data-property/index.js
var require_define_data_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $defineProperty = require_es_define_property();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var gopd = require_gopd();
	/** @type {import('.')} */
	module.exports = function defineDataProperty(obj, property, value) {
		if (!obj || typeof obj !== "object" && typeof obj !== "function") throw new $TypeError("`obj` must be an object or a function`");
		if (typeof property !== "string" && typeof property !== "symbol") throw new $TypeError("`property` must be a string or a symbol`");
		if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
		if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
		if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
		if (arguments.length > 6 && typeof arguments[6] !== "boolean") throw new $TypeError("`loose`, if provided, must be a boolean");
		var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
		var nonWritable = arguments.length > 4 ? arguments[4] : null;
		var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
		var loose = arguments.length > 6 ? arguments[6] : false;
		var desc = !!gopd && gopd(obj, property);
		if ($defineProperty) $defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
		else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) obj[property] = value;
		else throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
	};
}));
//#endregion
//#region node_modules/.pnpm/has-property-descriptors@1.0.2/node_modules/has-property-descriptors/index.js
var require_has_property_descriptors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $defineProperty = require_es_define_property();
	var hasPropertyDescriptors = function hasPropertyDescriptors() {
		return !!$defineProperty;
	};
	hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
		if (!$defineProperty) return null;
		try {
			return $defineProperty([], "length", { value: 1 }).length !== 1;
		} catch (e) {
			return true;
		}
	};
	module.exports = hasPropertyDescriptors;
}));
//#endregion
//#region node_modules/.pnpm/define-properties@1.2.1/node_modules/define-properties/index.js
var require_define_properties = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var keys = require_object_keys();
	var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
	var toStr = Object.prototype.toString;
	var concat = Array.prototype.concat;
	var defineDataProperty = require_define_data_property();
	var isFunction = function(fn) {
		return typeof fn === "function" && toStr.call(fn) === "[object Function]";
	};
	var supportsDescriptors = require_has_property_descriptors()();
	var defineProperty = function(object, name, value, predicate) {
		if (name in object) {
			if (predicate === true) {
				if (object[name] === value) return;
			} else if (!isFunction(predicate) || !predicate()) return;
		}
		if (supportsDescriptors) defineDataProperty(object, name, value, true);
		else defineDataProperty(object, name, value);
	};
	var defineProperties = function(object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) props = concat.call(props, Object.getOwnPropertySymbols(map));
		for (var i = 0; i < props.length; i += 1) defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	};
	defineProperties.supportsDescriptors = !!supportsDescriptors;
	module.exports = defineProperties;
}));
//#endregion
//#region node_modules/.pnpm/es-object-atoms@1.1.1/node_modules/es-object-atoms/index.js
var require_es_object_atoms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Object;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/index.js
var require_es_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Error;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/eval.js
var require_eval = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./eval')} */
	module.exports = EvalError;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./range')} */
	module.exports = RangeError;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./ref')} */
	module.exports = ReferenceError;
}));
//#endregion
//#region node_modules/.pnpm/es-errors@1.3.0/node_modules/es-errors/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./uri')} */
	module.exports = URIError;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/abs.js
var require_abs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./abs')} */
	module.exports = Math.abs;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/floor.js
var require_floor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./floor')} */
	module.exports = Math.floor;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/max.js
var require_max = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./max')} */
	module.exports = Math.max;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/min.js
var require_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./min')} */
	module.exports = Math.min;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/pow.js
var require_pow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./pow')} */
	module.exports = Math.pow;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/round.js
var require_round = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./round')} */
	module.exports = Math.round;
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/isNaN.js
var require_isNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isNaN')} */
	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
}));
//#endregion
//#region node_modules/.pnpm/math-intrinsics@1.1.0/node_modules/math-intrinsics/sign.js
var require_sign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $isNaN = require_isNaN();
	/** @type {import('./sign')} */
	module.exports = function sign(number) {
		if ($isNaN(number) || number === 0) return number;
		return number < 0 ? -1 : 1;
	};
}));
//#endregion
//#region node_modules/.pnpm/has-symbols@1.1.0/node_modules/has-symbols/shams.js
var require_shams$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./shams')} */
	module.exports = function hasSymbols() {
		if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return false;
		if (typeof Symbol.iterator === "symbol") return true;
		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol("test");
		var symObj = Object(sym);
		if (typeof sym === "string") return false;
		if (Object.prototype.toString.call(sym) !== "[object Symbol]") return false;
		if (Object.prototype.toString.call(symObj) !== "[object Symbol]") return false;
		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) return false;
		if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) return false;
		if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) return false;
		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) return false;
		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) return false;
		if (typeof Object.getOwnPropertyDescriptor === "function") {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== symVal || descriptor.enumerable !== true) return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/.pnpm/has-symbols@1.1.0/node_modules/has-symbols/index.js
var require_has_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var origSymbol = typeof Symbol !== "undefined" && Symbol;
	var hasSymbolSham = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasNativeSymbols() {
		if (typeof origSymbol !== "function") return false;
		if (typeof Symbol !== "function") return false;
		if (typeof origSymbol("foo") !== "symbol") return false;
		if (typeof Symbol("bar") !== "symbol") return false;
		return hasSymbolSham();
	};
}));
//#endregion
//#region node_modules/.pnpm/get-proto@1.0.1/node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Reflect.getPrototypeOf')} */
	module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
}));
//#endregion
//#region node_modules/.pnpm/get-proto@1.0.1/node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Object.getPrototypeOf')} */
	module.exports = require_es_object_atoms().getPrototypeOf || null;
}));
//#endregion
//#region node_modules/.pnpm/function-bind@1.1.2/node_modules/function-bind/implementation.js
var require_implementation$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = "[object Function]";
	var concatty = function concatty(a, b) {
		var arr = [];
		for (var i = 0; i < a.length; i += 1) arr[i] = a[i];
		for (var j = 0; j < b.length; j += 1) arr[j + a.length] = b[j];
		return arr;
	};
	var slicy = function slicy(arrLike, offset) {
		var arr = [];
		for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) arr[j] = arrLike[i];
		return arr;
	};
	var joiny = function(arr, joiner) {
		var str = "";
		for (var i = 0; i < arr.length; i += 1) {
			str += arr[i];
			if (i + 1 < arr.length) str += joiner;
		}
		return str;
	};
	module.exports = function bind(that) {
		var target = this;
		if (typeof target !== "function" || toStr.apply(target) !== funcType) throw new TypeError(ERROR_MESSAGE + target);
		var args = slicy(arguments, 1);
		var bound;
		var binder = function() {
			if (this instanceof bound) {
				var result = target.apply(this, concatty(args, arguments));
				if (Object(result) === result) return result;
				return this;
			}
			return target.apply(that, concatty(args, arguments));
		};
		var boundLength = max(0, target.length - args.length);
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) boundArgs[i] = "$" + i;
		bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
		if (target.prototype) {
			var Empty = function Empty() {};
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			Empty.prototype = null;
		}
		return bound;
	};
}));
//#endregion
//#region node_modules/.pnpm/function-bind@1.1.2/node_modules/function-bind/index.js
var require_function_bind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation$3();
	module.exports = Function.prototype.bind || implementation;
}));
//#endregion
//#region node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionCall')} */
	module.exports = Function.prototype.call;
}));
//#endregion
//#region node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionApply')} */
	module.exports = Function.prototype.apply;
}));
//#endregion
//#region node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./reflectApply')} */
	module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
}));
//#endregion
//#region node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	/** @type {import('./actualApply')} */
	module.exports = require_reflectApply() || bind.call($call, $apply);
}));
//#endregion
//#region node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $TypeError = require_type();
	var $call = require_functionCall();
	var $actualApply = require_actualApply();
	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	module.exports = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== "function") throw new $TypeError("a function is required");
		return $actualApply(bind, $call, args);
	};
}));
//#endregion
//#region node_modules/.pnpm/dunder-proto@1.0.1/node_modules/dunder-proto/get.js
var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind_apply_helpers();
	var gOPD = require_gopd();
	var hasProtoAccessor;
	try {
		hasProtoAccessor = [].__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") throw e;
	}
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;
	/** @type {import('./get')} */
	module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
		return $getPrototypeOf(value == null ? value : $Object(value));
	} : false;
}));
//#endregion
//#region node_modules/.pnpm/get-proto@1.0.1/node_modules/get-proto/index.js
var require_get_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reflectGetProto = require_Reflect_getPrototypeOf();
	var originalGetProto = require_Object_getPrototypeOf();
	var getDunderProto = require_get();
	/** @type {import('.')} */
	module.exports = reflectGetProto ? function getProto(O) {
		return reflectGetProto(O);
	} : originalGetProto ? function getProto(O) {
		if (!O || typeof O !== "object" && typeof O !== "function") throw new TypeError("getProto: not an object");
		return originalGetProto(O);
	} : getDunderProto ? function getProto(O) {
		return getDunderProto(O);
	} : null;
}));
//#endregion
//#region node_modules/.pnpm/hasown@2.0.3/node_modules/hasown/index.js
var require_hasown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	/** @type {import('.')} */
	module.exports = require_function_bind().call(call, $hasOwn);
}));
//#endregion
//#region node_modules/.pnpm/get-intrinsic@1.3.0/node_modules/get-intrinsic/index.js
var require_get_intrinsic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var undefined;
	var $Object = require_es_object_atoms();
	var $Error = require_es_errors();
	var $EvalError = require_eval();
	var $RangeError = require_range();
	var $ReferenceError = require_ref();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var $URIError = require_uri();
	var abs = require_abs();
	var floor = require_floor();
	var max = require_max();
	var min = require_min();
	var pow = require_pow();
	var round = require_round();
	var sign = require_sign();
	var $Function = Function;
	var getEvalledConstructor = function(expressionSyntax) {
		try {
			return $Function("\"use strict\"; return (" + expressionSyntax + ").constructor;")();
		} catch (e) {}
	};
	var $gOPD = require_gopd();
	var $defineProperty = require_es_define_property();
	var throwTypeError = function() {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD ? function() {
		try {
			arguments.callee;
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				return $gOPD(arguments, "callee").get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}() : throwTypeError;
	var hasSymbols = require_has_symbols()();
	var getProto = require_get_proto();
	var $ObjectGPO = require_Object_getPrototypeOf();
	var $ReflectGPO = require_Reflect_getPrototypeOf();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	var needsEval = {};
	var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined : getProto(Uint8Array);
	var INTRINSICS = {
		__proto__: null,
		"%AggregateError%": typeof AggregateError === "undefined" ? undefined : AggregateError,
		"%Array%": Array,
		"%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined : ArrayBuffer,
		"%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
		"%AsyncFromSyncIteratorPrototype%": undefined,
		"%AsyncFunction%": needsEval,
		"%AsyncGenerator%": needsEval,
		"%AsyncGeneratorFunction%": needsEval,
		"%AsyncIteratorPrototype%": needsEval,
		"%Atomics%": typeof Atomics === "undefined" ? undefined : Atomics,
		"%BigInt%": typeof BigInt === "undefined" ? undefined : BigInt,
		"%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined : BigInt64Array,
		"%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined : BigUint64Array,
		"%Boolean%": Boolean,
		"%DataView%": typeof DataView === "undefined" ? undefined : DataView,
		"%Date%": Date,
		"%decodeURI%": decodeURI,
		"%decodeURIComponent%": decodeURIComponent,
		"%encodeURI%": encodeURI,
		"%encodeURIComponent%": encodeURIComponent,
		"%Error%": $Error,
		"%eval%": eval,
		"%EvalError%": $EvalError,
		"%Float16Array%": typeof Float16Array === "undefined" ? undefined : Float16Array,
		"%Float32Array%": typeof Float32Array === "undefined" ? undefined : Float32Array,
		"%Float64Array%": typeof Float64Array === "undefined" ? undefined : Float64Array,
		"%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry,
		"%Function%": $Function,
		"%GeneratorFunction%": needsEval,
		"%Int8Array%": typeof Int8Array === "undefined" ? undefined : Int8Array,
		"%Int16Array%": typeof Int16Array === "undefined" ? undefined : Int16Array,
		"%Int32Array%": typeof Int32Array === "undefined" ? undefined : Int32Array,
		"%isFinite%": isFinite,
		"%isNaN%": isNaN,
		"%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
		"%JSON%": typeof JSON === "object" ? JSON : undefined,
		"%Map%": typeof Map === "undefined" ? undefined : Map,
		"%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
		"%Math%": Math,
		"%Number%": Number,
		"%Object%": $Object,
		"%Object.getOwnPropertyDescriptor%": $gOPD,
		"%parseFloat%": parseFloat,
		"%parseInt%": parseInt,
		"%Promise%": typeof Promise === "undefined" ? undefined : Promise,
		"%Proxy%": typeof Proxy === "undefined" ? undefined : Proxy,
		"%RangeError%": $RangeError,
		"%ReferenceError%": $ReferenceError,
		"%Reflect%": typeof Reflect === "undefined" ? undefined : Reflect,
		"%RegExp%": RegExp,
		"%Set%": typeof Set === "undefined" ? undefined : Set,
		"%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
		"%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined : SharedArrayBuffer,
		"%String%": String,
		"%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined,
		"%Symbol%": hasSymbols ? Symbol : undefined,
		"%SyntaxError%": $SyntaxError,
		"%ThrowTypeError%": ThrowTypeError,
		"%TypedArray%": TypedArray,
		"%TypeError%": $TypeError,
		"%Uint8Array%": typeof Uint8Array === "undefined" ? undefined : Uint8Array,
		"%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined : Uint8ClampedArray,
		"%Uint16Array%": typeof Uint16Array === "undefined" ? undefined : Uint16Array,
		"%Uint32Array%": typeof Uint32Array === "undefined" ? undefined : Uint32Array,
		"%URIError%": $URIError,
		"%WeakMap%": typeof WeakMap === "undefined" ? undefined : WeakMap,
		"%WeakRef%": typeof WeakRef === "undefined" ? undefined : WeakRef,
		"%WeakSet%": typeof WeakSet === "undefined" ? undefined : WeakSet,
		"%Function.prototype.call%": $call,
		"%Function.prototype.apply%": $apply,
		"%Object.defineProperty%": $defineProperty,
		"%Object.getPrototypeOf%": $ObjectGPO,
		"%Math.abs%": abs,
		"%Math.floor%": floor,
		"%Math.max%": max,
		"%Math.min%": min,
		"%Math.pow%": pow,
		"%Math.round%": round,
		"%Math.sign%": sign,
		"%Reflect.getPrototypeOf%": $ReflectGPO
	};
	if (getProto) try {
		null.error;
	} catch (e) {
		INTRINSICS["%Error.prototype%"] = getProto(getProto(e));
	}
	var doEval = function doEval(name) {
		var value;
		if (name === "%AsyncFunction%") value = getEvalledConstructor("async function () {}");
		else if (name === "%GeneratorFunction%") value = getEvalledConstructor("function* () {}");
		else if (name === "%AsyncGeneratorFunction%") value = getEvalledConstructor("async function* () {}");
		else if (name === "%AsyncGenerator%") {
			var fn = doEval("%AsyncGeneratorFunction%");
			if (fn) value = fn.prototype;
		} else if (name === "%AsyncIteratorPrototype%") {
			var gen = doEval("%AsyncGenerator%");
			if (gen && getProto) value = getProto(gen.prototype);
		}
		INTRINSICS[name] = value;
		return value;
	};
	var LEGACY_ALIASES = {
		__proto__: null,
		"%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
		"%ArrayPrototype%": ["Array", "prototype"],
		"%ArrayProto_entries%": [
			"Array",
			"prototype",
			"entries"
		],
		"%ArrayProto_forEach%": [
			"Array",
			"prototype",
			"forEach"
		],
		"%ArrayProto_keys%": [
			"Array",
			"prototype",
			"keys"
		],
		"%ArrayProto_values%": [
			"Array",
			"prototype",
			"values"
		],
		"%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
		"%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
		"%AsyncGeneratorPrototype%": [
			"AsyncGeneratorFunction",
			"prototype",
			"prototype"
		],
		"%BooleanPrototype%": ["Boolean", "prototype"],
		"%DataViewPrototype%": ["DataView", "prototype"],
		"%DatePrototype%": ["Date", "prototype"],
		"%ErrorPrototype%": ["Error", "prototype"],
		"%EvalErrorPrototype%": ["EvalError", "prototype"],
		"%Float32ArrayPrototype%": ["Float32Array", "prototype"],
		"%Float64ArrayPrototype%": ["Float64Array", "prototype"],
		"%FunctionPrototype%": ["Function", "prototype"],
		"%Generator%": ["GeneratorFunction", "prototype"],
		"%GeneratorPrototype%": [
			"GeneratorFunction",
			"prototype",
			"prototype"
		],
		"%Int8ArrayPrototype%": ["Int8Array", "prototype"],
		"%Int16ArrayPrototype%": ["Int16Array", "prototype"],
		"%Int32ArrayPrototype%": ["Int32Array", "prototype"],
		"%JSONParse%": ["JSON", "parse"],
		"%JSONStringify%": ["JSON", "stringify"],
		"%MapPrototype%": ["Map", "prototype"],
		"%NumberPrototype%": ["Number", "prototype"],
		"%ObjectPrototype%": ["Object", "prototype"],
		"%ObjProto_toString%": [
			"Object",
			"prototype",
			"toString"
		],
		"%ObjProto_valueOf%": [
			"Object",
			"prototype",
			"valueOf"
		],
		"%PromisePrototype%": ["Promise", "prototype"],
		"%PromiseProto_then%": [
			"Promise",
			"prototype",
			"then"
		],
		"%Promise_all%": ["Promise", "all"],
		"%Promise_reject%": ["Promise", "reject"],
		"%Promise_resolve%": ["Promise", "resolve"],
		"%RangeErrorPrototype%": ["RangeError", "prototype"],
		"%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
		"%RegExpPrototype%": ["RegExp", "prototype"],
		"%SetPrototype%": ["Set", "prototype"],
		"%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
		"%StringPrototype%": ["String", "prototype"],
		"%SymbolPrototype%": ["Symbol", "prototype"],
		"%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
		"%TypedArrayPrototype%": ["TypedArray", "prototype"],
		"%TypeErrorPrototype%": ["TypeError", "prototype"],
		"%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
		"%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
		"%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
		"%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
		"%URIErrorPrototype%": ["URIError", "prototype"],
		"%WeakMapPrototype%": ["WeakMap", "prototype"],
		"%WeakSetPrototype%": ["WeakSet", "prototype"]
	};
	var bind = require_function_bind();
	var hasOwn = require_hasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g;
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === "%" && last !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
		else if (last === "%" && first !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
		var result = [];
		$replace(string, rePropName, function(match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
		});
		return result;
	};
	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = "%" + alias[0] + "%";
		}
		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) value = doEval(intrinsicName);
			if (typeof value === "undefined" && !allowMissing) throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
			return {
				alias,
				name: intrinsicName,
				value
			};
		}
		throw new $SyntaxError("intrinsic " + name + " does not exist!");
	};
	module.exports = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== "string" || name.length === 0) throw new $TypeError("intrinsic name must be a non-empty string");
		if (arguments.length > 1 && typeof allowMissing !== "boolean") throw new $TypeError("\"allowMissing\" argument must be a boolean");
		if ($exec(/^%?[^%]*%?$/, name) === null) throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
		var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;
		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}
		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if ((first === "\"" || first === "'" || first === "`" || last === "\"" || last === "'" || last === "`") && first !== last) throw new $SyntaxError("property names with quotes must have matching quotes");
			if (part === "constructor" || !isOwn) skipFurtherCaching = true;
			intrinsicBaseName += "." + part;
			intrinsicRealName = "%" + intrinsicBaseName + "%";
			if (hasOwn(INTRINSICS, intrinsicRealName)) value = INTRINSICS[intrinsicRealName];
			else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
					return;
				}
				if ($gOPD && i + 1 >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;
					if (isOwn && "get" in desc && !("originalValue" in desc.get)) value = desc.get;
					else value = value[part];
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}
				if (isOwn && !skipFurtherCaching) INTRINSICS[intrinsicRealName] = value;
			}
		}
		return value;
	};
}));
//#endregion
//#region node_modules/.pnpm/set-function-length@1.2.2/node_modules/set-function-length/index.js
var require_set_function_length = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var define = require_define_data_property();
	var hasDescriptors = require_has_property_descriptors()();
	var gOPD = require_gopd();
	var $TypeError = require_type();
	var $floor = GetIntrinsic("%Math.floor%");
	/** @type {import('.')} */
	module.exports = function setFunctionLength(fn, length) {
		if (typeof fn !== "function") throw new $TypeError("`fn` is not a function");
		if (typeof length !== "number" || length < 0 || length > 4294967295 || $floor(length) !== length) throw new $TypeError("`length` must be a positive 32-bit integer");
		var loose = arguments.length > 2 && !!arguments[2];
		var functionLengthIsConfigurable = true;
		var functionLengthIsWritable = true;
		if ("length" in fn && gOPD) {
			var desc = gOPD(fn, "length");
			if (desc && !desc.configurable) functionLengthIsConfigurable = false;
			if (desc && !desc.writable) functionLengthIsWritable = false;
		}
		if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) if (hasDescriptors) define(fn, "length", length, true, true);
		else define(fn, "length", length);
		return fn;
	};
}));
//#endregion
//#region node_modules/.pnpm/call-bind-apply-helpers@1.0.2/node_modules/call-bind-apply-helpers/applyBind.js
var require_applyBind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $apply = require_functionApply();
	var actualApply = require_actualApply();
	/** @type {import('./applyBind')} */
	module.exports = function applyBind() {
		return actualApply(bind, $apply, arguments);
	};
}));
//#endregion
//#region node_modules/.pnpm/call-bind@1.0.9/node_modules/call-bind/index.js
var require_call_bind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var setFunctionLength = require_set_function_length();
	var $defineProperty = require_es_define_property();
	var callBindBasic = require_call_bind_apply_helpers();
	var applyBind = require_applyBind();
	module.exports = function callBind(originalFunction) {
		var func = callBindBasic(arguments);
		var adjustedLength = 1 + originalFunction.length - (arguments.length - 1);
		return setFunctionLength(func, adjustedLength > 0 ? adjustedLength : 0, true);
	};
	if ($defineProperty) $defineProperty(module.exports, "apply", { value: applyBind });
	else module.exports.apply = applyBind;
}));
//#endregion
//#region node_modules/.pnpm/call-bound@1.0.4/node_modules/call-bound/index.js
var require_call_bound = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBindBasic = require_call_bind_apply_helpers();
	/** @type {(thisArg: string, searchString: string, position?: number) => number} */
	var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
	/** @type {import('.')} */
	module.exports = function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic(name, !!allowMissing);
		if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) return callBindBasic([intrinsic]);
		return intrinsic;
	};
}));
//#endregion
//#region node_modules/.pnpm/object.assign@4.1.7/node_modules/object.assign/implementation.js
var require_implementation$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var objectKeys = require_object_keys();
	var hasSymbols = require_shams$1()();
	var callBound = require_call_bound();
	var $Object = require_es_object_atoms();
	var $push = callBound("Array.prototype.push");
	var $propIsEnumerable = callBound("Object.prototype.propertyIsEnumerable");
	var originalGetSymbols = hasSymbols ? $Object.getOwnPropertySymbols : null;
	module.exports = function assign(target, source1) {
		if (target == null) throw new TypeError("target must be an object");
		var to = $Object(target);
		if (arguments.length === 1) return to;
		for (var s = 1; s < arguments.length; ++s) {
			var from = $Object(arguments[s]);
			var keys = objectKeys(from);
			var getSymbols = hasSymbols && ($Object.getOwnPropertySymbols || originalGetSymbols);
			if (getSymbols) {
				var syms = getSymbols(from);
				for (var j = 0; j < syms.length; ++j) {
					var key = syms[j];
					if ($propIsEnumerable(from, key)) $push(keys, key);
				}
			}
			for (var i = 0; i < keys.length; ++i) {
				var nextKey = keys[i];
				if ($propIsEnumerable(from, nextKey)) to[nextKey] = from[nextKey];
			}
		}
		return to;
	};
}));
//#endregion
//#region node_modules/.pnpm/object.assign@4.1.7/node_modules/object.assign/polyfill.js
var require_polyfill$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation$2();
	var lacksProperEnumerationOrder = function() {
		if (!Object.assign) return false;
		var str = "abcdefghijklmnopqrst";
		var letters = str.split("");
		var map = {};
		for (var i = 0; i < letters.length; ++i) map[letters[i]] = letters[i];
		var obj = Object.assign({}, map);
		var actual = "";
		for (var k in obj) actual += k;
		return str !== actual;
	};
	var assignHasPendingExceptions = function() {
		if (!Object.assign || !Object.preventExtensions) return false;
		var thrower = Object.preventExtensions({ 1: 2 });
		try {
			Object.assign(thrower, "xy");
		} catch (e) {
			return thrower[1] === "y";
		}
		return false;
	};
	module.exports = function getPolyfill() {
		if (!Object.assign) return implementation;
		if (lacksProperEnumerationOrder()) return implementation;
		if (assignHasPendingExceptions()) return implementation;
		return Object.assign;
	};
}));
//#endregion
//#region node_modules/.pnpm/object.assign@4.1.7/node_modules/object.assign/shim.js
var require_shim$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var define = require_define_properties();
	var getPolyfill = require_polyfill$2();
	module.exports = function shimAssign() {
		var polyfill = getPolyfill();
		define(Object, { assign: polyfill }, { assign: function() {
			return Object.assign !== polyfill;
		} });
		return polyfill;
	};
}));
//#endregion
//#region node_modules/.pnpm/object.assign@4.1.7/node_modules/object.assign/index.js
var require_object_assign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var defineProperties = require_define_properties();
	var callBind = require_call_bind();
	var implementation = require_implementation$2();
	var getPolyfill = require_polyfill$2();
	var shim = require_shim$2();
	var polyfill = callBind.apply(getPolyfill());
	var bound = function assign(target, source1) {
		return polyfill(Object, arguments);
	};
	defineProperties(bound, {
		getPolyfill,
		implementation,
		shim
	});
	module.exports = bound;
}));
//#endregion
//#region node_modules/.pnpm/call-bind@1.0.9/node_modules/call-bind/callBound.js
var require_callBound = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBind = require_call_bind();
	var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
	module.exports = function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic(name, !!allowMissing);
		if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) return callBind(intrinsic);
		return intrinsic;
	};
}));
//#endregion
//#region node_modules/.pnpm/functions-have-names@1.2.3/node_modules/functions-have-names/index.js
var require_functions_have_names = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var functionsHaveNames = function functionsHaveNames() {
		return typeof function f() {}.name === "string";
	};
	var gOPD = Object.getOwnPropertyDescriptor;
	if (gOPD) try {
		gOPD([], "length");
	} catch (e) {
		gOPD = null;
	}
	functionsHaveNames.functionsHaveConfigurableNames = function functionsHaveConfigurableNames() {
		if (!functionsHaveNames() || !gOPD) return false;
		var desc = gOPD(function() {}, "name");
		return !!desc && !!desc.configurable;
	};
	var $bind = Function.prototype.bind;
	functionsHaveNames.boundFunctionsHaveNames = function boundFunctionsHaveNames() {
		return functionsHaveNames() && typeof $bind === "function" && function f() {}.bind().name !== "";
	};
	module.exports = functionsHaveNames;
}));
//#endregion
//#region node_modules/.pnpm/set-function-name@2.0.2/node_modules/set-function-name/index.js
var require_set_function_name = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var define = require_define_data_property();
	var hasDescriptors = require_has_property_descriptors()();
	var functionsHaveConfigurableNames = require_functions_have_names().functionsHaveConfigurableNames();
	var $TypeError = require_type();
	/** @type {import('.')} */
	module.exports = function setFunctionName(fn, name) {
		if (typeof fn !== "function") throw new $TypeError("`fn` is not a function");
		if (!(arguments.length > 2 && !!arguments[2]) || functionsHaveConfigurableNames) if (hasDescriptors) define(fn, "name", name, true, true);
		else define(fn, "name", name);
		return fn;
	};
}));
//#endregion
//#region node_modules/.pnpm/regexp.prototype.flags@1.5.4/node_modules/regexp.prototype.flags/implementation.js
var require_implementation$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var setFunctionName = require_set_function_name();
	var $TypeError = require_type();
	var $Object = Object;
	module.exports = setFunctionName(function flags() {
		if (this == null || this !== $Object(this)) throw new $TypeError("RegExp.prototype.flags getter called on non-object");
		var result = "";
		if (this.hasIndices) result += "d";
		if (this.global) result += "g";
		if (this.ignoreCase) result += "i";
		if (this.multiline) result += "m";
		if (this.dotAll) result += "s";
		if (this.unicode) result += "u";
		if (this.unicodeSets) result += "v";
		if (this.sticky) result += "y";
		return result;
	}, "get flags", true);
}));
//#endregion
//#region node_modules/.pnpm/regexp.prototype.flags@1.5.4/node_modules/regexp.prototype.flags/polyfill.js
var require_polyfill$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation$1();
	var supportsDescriptors = require_define_properties().supportsDescriptors;
	var $gOPD = Object.getOwnPropertyDescriptor;
	module.exports = function getPolyfill() {
		if (supportsDescriptors && /a/gim.flags === "gim") {
			var descriptor = $gOPD(RegExp.prototype, "flags");
			if (descriptor && typeof descriptor.get === "function" && "dotAll" in RegExp.prototype && "hasIndices" in RegExp.prototype) {
				var calls = "";
				var o = {};
				Object.defineProperty(o, "hasIndices", { get: function() {
					calls += "d";
				} });
				Object.defineProperty(o, "sticky", { get: function() {
					calls += "y";
				} });
				descriptor.get.call(o);
				if (calls === "dy") return descriptor.get;
			}
		}
		return implementation;
	};
}));
//#endregion
//#region node_modules/.pnpm/regexp.prototype.flags@1.5.4/node_modules/regexp.prototype.flags/shim.js
var require_shim$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var supportsDescriptors = require_define_properties().supportsDescriptors;
	var getPolyfill = require_polyfill$1();
	var gOPD = require_gopd();
	var defineProperty = Object.defineProperty;
	var $TypeError = require_es_errors();
	var getProto = require_get_proto();
	var regex = /a/;
	module.exports = function shimFlags() {
		if (!supportsDescriptors || !getProto) throw new $TypeError("RegExp.prototype.flags requires a true ES5 environment that supports property descriptors");
		var polyfill = getPolyfill();
		var proto = getProto(regex);
		var descriptor = gOPD(proto, "flags");
		if (!descriptor || descriptor.get !== polyfill) defineProperty(proto, "flags", {
			configurable: true,
			enumerable: false,
			get: polyfill
		});
		return polyfill;
	};
}));
//#endregion
//#region node_modules/.pnpm/regexp.prototype.flags@1.5.4/node_modules/regexp.prototype.flags/index.js
var require_regexp_prototype_flags = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var define = require_define_properties();
	var callBind = require_call_bind();
	var implementation = require_implementation$1();
	var getPolyfill = require_polyfill$1();
	var shim = require_shim$1();
	var flagsBound = callBind(getPolyfill());
	define(flagsBound, {
		getPolyfill,
		implementation,
		shim
	});
	module.exports = flagsBound;
}));
//#endregion
//#region node_modules/.pnpm/has-tostringtag@1.0.2/node_modules/has-tostringtag/shams.js
var require_shams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasSymbols = require_shams$1();
	/** @type {import('.')} */
	module.exports = function hasToStringTagShams() {
		return hasSymbols() && !!Symbol.toStringTag;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-arguments@1.2.0/node_modules/is-arguments/index.js
var require_is_arguments = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasToStringTag = require_shams()();
	var $toString = require_call_bound()("Object.prototype.toString");
	/** @type {import('.')} */
	var isStandardArguments = function isArguments(value) {
		if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) return false;
		return $toString(value) === "[object Arguments]";
	};
	/** @type {import('.')} */
	var isLegacyArguments = function isArguments(value) {
		if (isStandardArguments(value)) return true;
		return value !== null && typeof value === "object" && "length" in value && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && "callee" in value && $toString(value.callee) === "[object Function]";
	};
	var supportsStandardArguments = function() {
		return isStandardArguments(arguments);
	}();
	isStandardArguments.isLegacyArguments = isLegacyArguments;
	/** @type {import('.')} */
	module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
}));
//#endregion
//#region __vite-browser-external
var require___vite_browser_external = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
}));
//#endregion
//#region node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/index.js
var require_object_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasMap = typeof Map === "function" && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === "function" && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var weakMapHas = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap.prototype.has : null;
	var weakSetHas = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet.prototype.has : null;
	var weakRefDeref = typeof WeakRef === "function" && WeakRef.prototype ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
	var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
		return O.__proto__;
	} : null);
	function addNumericSeparator(num, str) {
		if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) return str;
		var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
		if (typeof num === "number") {
			var int = num < 0 ? -$floor(-num) : $floor(num);
			if (int !== num) {
				var intStr = String(int);
				var dec = $slice.call(str, intStr.length + 1);
				return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
			}
		}
		return $replace.call(str, sepRegex, "$&_");
	}
	var utilInspect = require___vite_browser_external();
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
	var quotes = {
		__proto__: null,
		"double": "\"",
		single: "'"
	};
	var quoteREs = {
		__proto__: null,
		"double": /(["\\])/g,
		single: /(['\\])/g
	};
	module.exports = function inspect_(obj, options, depth, seen) {
		var opts = options || {};
		if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
		if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
		var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
		if (typeof customInspect !== "boolean" && customInspect !== "symbol") throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
		if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
		if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
		var numericSeparator = opts.numericSeparator;
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		if (typeof obj === "boolean") return obj ? "true" : "false";
		if (typeof obj === "string") return inspectString(obj, opts);
		if (typeof obj === "number") {
			if (obj === 0) return Infinity / obj > 0 ? "0" : "-0";
			var str = String(obj);
			return numericSeparator ? addNumericSeparator(obj, str) : str;
		}
		if (typeof obj === "bigint") {
			var bigIntStr = String(obj) + "n";
			return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
		}
		var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
		if (typeof depth === "undefined") depth = 0;
		if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") return isArray(obj) ? "[Array]" : "[Object]";
		var indent = getIndent(opts, depth);
		if (typeof seen === "undefined") seen = [];
		else if (indexOf(seen, obj) >= 0) return "[Circular]";
		function inspect(value, from, noIndent) {
			if (from) {
				seen = $arrSlice.call(seen);
				seen.push(from);
			}
			if (noIndent) {
				var newOpts = { depth: opts.depth };
				if (has(opts, "quoteStyle")) newOpts.quoteStyle = opts.quoteStyle;
				return inspect_(value, newOpts, depth + 1, seen);
			}
			return inspect_(value, opts, depth + 1, seen);
		}
		if (typeof obj === "function" && !isRegExp(obj)) {
			var name = nameOf(obj);
			var keys = arrObjKeys(obj, inspect);
			return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
		}
		if (isSymbol(obj)) {
			var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
			return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
		}
		if (isElement(obj)) {
			var s = "<" + $toLowerCase.call(String(obj.nodeName));
			var attrs = obj.attributes || [];
			for (var i = 0; i < attrs.length; i++) s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
			s += ">";
			if (obj.childNodes && obj.childNodes.length) s += "...";
			s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
			return s;
		}
		if (isArray(obj)) {
			if (obj.length === 0) return "[]";
			var xs = arrObjKeys(obj, inspect);
			if (indent && !singleLineValues(xs)) return "[" + indentedJoin(xs, indent) + "]";
			return "[ " + $join.call(xs, ", ") + " ]";
		}
		if (isError(obj)) {
			var parts = arrObjKeys(obj, inspect);
			if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
			if (parts.length === 0) return "[" + String(obj) + "]";
			return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
		}
		if (typeof obj === "object" && customInspect) {
			if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) return utilInspect(obj, { depth: maxDepth - depth });
			else if (customInspect !== "symbol" && typeof obj.inspect === "function") return obj.inspect();
		}
		if (isMap(obj)) {
			var mapParts = [];
			if (mapForEach) mapForEach.call(obj, function(value, key) {
				mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
			});
			return collectionOf("Map", mapSize.call(obj), mapParts, indent);
		}
		if (isSet(obj)) {
			var setParts = [];
			if (setForEach) setForEach.call(obj, function(value) {
				setParts.push(inspect(value, obj));
			});
			return collectionOf("Set", setSize.call(obj), setParts, indent);
		}
		if (isWeakMap(obj)) return weakCollectionOf("WeakMap");
		if (isWeakSet(obj)) return weakCollectionOf("WeakSet");
		if (isWeakRef(obj)) return weakCollectionOf("WeakRef");
		if (isNumber(obj)) return markBoxed(inspect(Number(obj)));
		if (isBigInt(obj)) return markBoxed(inspect(bigIntValueOf.call(obj)));
		if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
		if (isString(obj)) return markBoxed(inspect(String(obj)));
		if (typeof window !== "undefined" && obj === window) return "{ [object Window] }";
		if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) return "{ [object globalThis] }";
		if (!isDate(obj) && !isRegExp(obj)) {
			var ys = arrObjKeys(obj, inspect);
			var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
			var protoTag = obj instanceof Object ? "" : "null prototype";
			var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
			var tag = (isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "") + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
			if (ys.length === 0) return tag + "{}";
			if (indent) return tag + "{" + indentedJoin(ys, indent) + "}";
			return tag + "{ " + $join.call(ys, ", ") + " }";
		}
		return String(obj);
	};
	function wrapQuotes(s, defaultStyle, opts) {
		var quoteChar = quotes[opts.quoteStyle || defaultStyle];
		return quoteChar + s + quoteChar;
	}
	function quote(s) {
		return $replace.call(String(s), /"/g, "&quot;");
	}
	function canTrustToString(obj) {
		return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
	}
	function isArray(obj) {
		return toStr(obj) === "[object Array]" && canTrustToString(obj);
	}
	function isDate(obj) {
		return toStr(obj) === "[object Date]" && canTrustToString(obj);
	}
	function isRegExp(obj) {
		return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
	}
	function isError(obj) {
		return toStr(obj) === "[object Error]" && canTrustToString(obj);
	}
	function isString(obj) {
		return toStr(obj) === "[object String]" && canTrustToString(obj);
	}
	function isNumber(obj) {
		return toStr(obj) === "[object Number]" && canTrustToString(obj);
	}
	function isBoolean(obj) {
		return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
	}
	function isSymbol(obj) {
		if (hasShammedSymbols) return obj && typeof obj === "object" && obj instanceof Symbol;
		if (typeof obj === "symbol") return true;
		if (!obj || typeof obj !== "object" || !symToString) return false;
		try {
			symToString.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	function isBigInt(obj) {
		if (!obj || typeof obj !== "object" || !bigIntValueOf) return false;
		try {
			bigIntValueOf.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	var hasOwn = Object.prototype.hasOwnProperty || function(key) {
		return key in this;
	};
	function has(obj, key) {
		return hasOwn.call(obj, key);
	}
	function toStr(obj) {
		return objectToString.call(obj);
	}
	function nameOf(f) {
		if (f.name) return f.name;
		var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
		if (m) return m[1];
		return null;
	}
	function indexOf(xs, x) {
		if (xs.indexOf) return xs.indexOf(x);
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
	function isMap(x) {
		if (!mapSize || !x || typeof x !== "object") return false;
		try {
			mapSize.call(x);
			try {
				setSize.call(x);
			} catch (s) {
				return true;
			}
			return x instanceof Map;
		} catch (e) {}
		return false;
	}
	function isWeakMap(x) {
		if (!weakMapHas || !x || typeof x !== "object") return false;
		try {
			weakMapHas.call(x, weakMapHas);
			try {
				weakSetHas.call(x, weakSetHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakMap;
		} catch (e) {}
		return false;
	}
	function isWeakRef(x) {
		if (!weakRefDeref || !x || typeof x !== "object") return false;
		try {
			weakRefDeref.call(x);
			return true;
		} catch (e) {}
		return false;
	}
	function isSet(x) {
		if (!setSize || !x || typeof x !== "object") return false;
		try {
			setSize.call(x);
			try {
				mapSize.call(x);
			} catch (m) {
				return true;
			}
			return x instanceof Set;
		} catch (e) {}
		return false;
	}
	function isWeakSet(x) {
		if (!weakSetHas || !x || typeof x !== "object") return false;
		try {
			weakSetHas.call(x, weakSetHas);
			try {
				weakMapHas.call(x, weakMapHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakSet;
		} catch (e) {}
		return false;
	}
	function isElement(x) {
		if (!x || typeof x !== "object") return false;
		if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) return true;
		return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
	}
	function inspectString(str, opts) {
		if (str.length > opts.maxStringLength) {
			var remaining = str.length - opts.maxStringLength;
			var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
			return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
		}
		var quoteRE = quoteREs[opts.quoteStyle || "single"];
		quoteRE.lastIndex = 0;
		return wrapQuotes($replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte), "single", opts);
	}
	function lowbyte(c) {
		var n = c.charCodeAt(0);
		var x = {
			8: "b",
			9: "t",
			10: "n",
			12: "f",
			13: "r"
		}[n];
		if (x) return "\\" + x;
		return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
	}
	function markBoxed(str) {
		return "Object(" + str + ")";
	}
	function weakCollectionOf(type) {
		return type + " { ? }";
	}
	function collectionOf(type, size, entries, indent) {
		var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
		return type + " (" + size + ") {" + joinedEntries + "}";
	}
	function singleLineValues(xs) {
		for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], "\n") >= 0) return false;
		return true;
	}
	function getIndent(opts, depth) {
		var baseIndent;
		if (opts.indent === "	") baseIndent = "	";
		else if (typeof opts.indent === "number" && opts.indent > 0) baseIndent = $join.call(Array(opts.indent + 1), " ");
		else return null;
		return {
			base: baseIndent,
			prev: $join.call(Array(depth + 1), baseIndent)
		};
	}
	function indentedJoin(xs, indent) {
		if (xs.length === 0) return "";
		var lineJoiner = "\n" + indent.prev + indent.base;
		return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
	}
	function arrObjKeys(obj, inspect) {
		var isArr = isArray(obj);
		var xs = [];
		if (isArr) {
			xs.length = obj.length;
			for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
		}
		var syms = typeof gOPS === "function" ? gOPS(obj) : [];
		var symMap;
		if (hasShammedSymbols) {
			symMap = {};
			for (var k = 0; k < syms.length; k++) symMap["$" + syms[k]] = syms[k];
		}
		for (var key in obj) {
			if (!has(obj, key)) continue;
			if (isArr && String(Number(key)) === key && key < obj.length) continue;
			if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) continue;
			else if ($test.call(/[^\w$]/, key)) xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
			else xs.push(key + ": " + inspect(obj[key], obj));
		}
		if (typeof gOPS === "function") {
			for (var j = 0; j < syms.length; j++) if (isEnumerable.call(obj, syms[j])) xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
		}
		return xs;
	}
}));
//#endregion
//#region node_modules/.pnpm/side-channel-list@1.0.1/node_modules/side-channel-list/index.js
var require_side_channel_list = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var inspect = require_object_inspect();
	var $TypeError = require_type();
	/** @type {import('./list.d.ts').listGetNode} */
	var listGetNode = function(list, key, isDelete) {
		/** @type {typeof list | NonNullable<(typeof list)['next']>} */
		var prev = list;
		/** @type {(typeof list)['next']} */
		var curr;
		for (; (curr = prev.next) != null; prev = curr) if (curr.key === key) {
			prev.next = curr.next;
			if (!isDelete) {
				curr.next = list.next;
				list.next = curr;
			}
			return curr;
		}
	};
	/** @type {import('./list.d.ts').listGet} */
	var listGet = function(objects, key) {
		if (!objects) return;
		var node = listGetNode(objects, key);
		return node && node.value;
	};
	/** @type {import('./list.d.ts').listSet} */
	var listSet = function(objects, key, value) {
		var node = listGetNode(objects, key);
		if (node) node.value = value;
		else objects.next = {
			key,
			next: objects.next,
			value
		};
	};
	/** @type {import('./list.d.ts').listHas} */
	var listHas = function(objects, key) {
		if (!objects) return false;
		return !!listGetNode(objects, key);
	};
	/** @type {import('./list.d.ts').listDelete} */
	var listDelete = function(objects, key) {
		if (objects) return listGetNode(objects, key, true);
	};
	/** @type {import('.')} */
	module.exports = function getSideChannelList() {
		/** @typedef {ReturnType<typeof getSideChannelList>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {import('./list.d.ts').RootNode<V, K> | undefined} */ var $o;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				var deletedNode = listDelete($o, key);
				if (deletedNode && $o && !$o.next) $o = void 0;
				return !!deletedNode;
			},
			get: function(key) {
				return listGet($o, key);
			},
			has: function(key) {
				return listHas($o, key);
			},
			set: function(key, value) {
				if (!$o) $o = { next: void 0 };
				listSet($o, key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/.pnpm/side-channel-map@1.0.1/node_modules/side-channel-map/index.js
var require_side_channel_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var inspect = require_object_inspect();
	var $TypeError = require_type();
	var $Map = GetIntrinsic("%Map%", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
	var $mapGet = callBound("Map.prototype.get", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
	var $mapSet = callBound("Map.prototype.set", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapHas = callBound("Map.prototype.has", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapDelete = callBound("Map.prototype.delete", true);
	/** @type {<K, V>(thisArg: Map<K, V>) => number} */
	var $mapSize = callBound("Map.prototype.size", true);
	/** @type {import('.')} */
	module.exports = !!$Map && function getSideChannelMap() {
		/** @typedef {ReturnType<typeof getSideChannelMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {Map<K, V> | undefined} */ var $m;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				if ($m) {
					var result = $mapDelete($m, key);
					if ($mapSize($m) === 0) $m = void 0;
					return result;
				}
				return false;
			},
			get: function(key) {
				if ($m) return $mapGet($m, key);
			},
			has: function(key) {
				if ($m) return $mapHas($m, key);
				return false;
			},
			set: function(key, value) {
				if (!$m) $m = new $Map();
				$mapSet($m, key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/.pnpm/side-channel-weakmap@1.0.2/node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var inspect = require_object_inspect();
	var getSideChannelMap = require_side_channel_map();
	var $TypeError = require_type();
	var $WeakMap = GetIntrinsic("%WeakMap%", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => V} */
	var $weakMapGet = callBound("WeakMap.prototype.get", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K, value: V) => void} */
	var $weakMapSet = callBound("WeakMap.prototype.set", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapHas = callBound("WeakMap.prototype.has", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
	/** @type {import('.')} */
	module.exports = $WeakMap ? function getSideChannelWeakMap() {
		/** @typedef {ReturnType<typeof getSideChannelWeakMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {WeakMap<K & object, V> | undefined} */ var $wm;
		/** @type {Channel | undefined} */ var $m;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapDelete($wm, key);
				} else if (getSideChannelMap) {
					if ($m) return $m["delete"](key);
				}
				return false;
			},
			get: function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapGet($wm, key);
				}
				return $m && $m.get(key);
			},
			has: function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapHas($wm, key);
				}
				return !!$m && $m.has(key);
			},
			set: function(key, value) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if (!$wm) $wm = new $WeakMap();
					$weakMapSet($wm, key, value);
				} else if (getSideChannelMap) {
					if (!$m) $m = getSideChannelMap();
					/** @type {NonNullable<typeof $m>} */ $m.set(key, value);
				}
			}
		};
		return channel;
	} : getSideChannelMap;
}));
//#endregion
//#region node_modules/.pnpm/side-channel@1.1.0/node_modules/side-channel/index.js
var require_side_channel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var inspect = require_object_inspect();
	var getSideChannelList = require_side_channel_list();
	var getSideChannelMap = require_side_channel_map();
	var makeChannel = require_side_channel_weakmap() || getSideChannelMap || getSideChannelList;
	/** @type {import('.')} */
	module.exports = function getSideChannel() {
		/** @typedef {ReturnType<typeof getSideChannel>} Channel */
		/** @type {Channel | undefined} */ var $channelData;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				return !!$channelData && $channelData["delete"](key);
			},
			get: function(key) {
				return $channelData && $channelData.get(key);
			},
			has: function(key) {
				return !!$channelData && $channelData.has(key);
			},
			set: function(key, value) {
				if (!$channelData) $channelData = makeChannel();
				$channelData.set(key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/.pnpm/internal-slot@1.1.0/node_modules/internal-slot/index.js
var require_internal_slot = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @typedef {`$${import('.').InternalSlot}`} SaltedInternalSlot */
	/** @typedef {{ [k in SaltedInternalSlot]?: unknown }} SlotsObject */
	var hasOwn = require_hasown();
	/** @type {import('side-channel').Channel<object, SlotsObject>} */
	var channel = require_side_channel()();
	var $TypeError = require_type();
	/** @type {import('.')} */
	var SLOT = {
		assert: function(O, slot) {
			if (!O || typeof O !== "object" && typeof O !== "function") throw new $TypeError("`O` is not an object");
			if (typeof slot !== "string") throw new $TypeError("`slot` must be a string");
			channel.assert(O);
			if (!SLOT.has(O, slot)) throw new $TypeError("`" + slot + "` is not present on `O`");
		},
		get: function(O, slot) {
			if (!O || typeof O !== "object" && typeof O !== "function") throw new $TypeError("`O` is not an object");
			if (typeof slot !== "string") throw new $TypeError("`slot` must be a string");
			var slots = channel.get(O);
			return slots && slots["$" + slot];
		},
		has: function(O, slot) {
			if (!O || typeof O !== "object" && typeof O !== "function") throw new $TypeError("`O` is not an object");
			if (typeof slot !== "string") throw new $TypeError("`slot` must be a string");
			var slots = channel.get(O);
			return !!slots && hasOwn(slots, "$" + slot);
		},
		set: function(O, slot, V) {
			if (!O || typeof O !== "object" && typeof O !== "function") throw new $TypeError("`O` is not an object");
			if (typeof slot !== "string") throw new $TypeError("`slot` must be a string");
			var slots = channel.get(O);
			if (!slots) {
				slots = {};
				channel.set(O, slots);
			}
			slots["$" + slot] = V;
		}
	};
	if (Object.freeze) Object.freeze(SLOT);
	module.exports = SLOT;
}));
//#endregion
//#region node_modules/.pnpm/stop-iteration-iterator@1.1.0/node_modules/stop-iteration-iterator/index.js
var require_stop_iteration_iterator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var SLOT = require_internal_slot();
	var $SyntaxError = require_syntax();
	var $StopIteration = typeof StopIteration === "object" ? StopIteration : null;
	/** @type {import('.')} */
	module.exports = function getStopIterationIterator(origIterator) {
		if (!$StopIteration) throw new $SyntaxError("this environment lacks StopIteration");
		SLOT.set(origIterator, "[[Done]]", false);
		/** @template T @typedef {T extends Iterator<infer U> ? U : never} IteratorType */
		/** @typedef {IteratorType<ReturnType<typeof getStopIterationIterator>>} T */
		var siIterator = { next: function next() {
			var iterator = SLOT.get(this, "[[Iterator]]");
			var done = !!SLOT.get(iterator, "[[Done]]");
			try {
				return {
					done,
					value: done ? void 0 : iterator.next()
				};
			} catch (e) {
				SLOT.set(iterator, "[[Done]]", true);
				if (e !== $StopIteration) throw e;
				return {
					done: true,
					value: void 0
				};
			}
		} };
		SLOT.set(siIterator, "[[Iterator]]", origIterator);
		return siIterator;
	};
}));
//#endregion
//#region node_modules/.pnpm/isarray@2.0.5/node_modules/isarray/index.js
var require_isarray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var toString = {}.toString;
	module.exports = Array.isArray || function(arr) {
		return toString.call(arr) == "[object Array]";
	};
}));
//#endregion
//#region node_modules/.pnpm/is-string@1.1.1/node_modules/is-string/index.js
var require_is_string = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	/** @type {(receiver: ThisParameterType<typeof String.prototype.valueOf>, ...args: Parameters<typeof String.prototype.valueOf>) => ReturnType<typeof String.prototype.valueOf>} */
	var $strValueOf = callBound("String.prototype.valueOf");
	/** @type {import('.')} */
	var tryStringObject = function tryStringObject(value) {
		try {
			$strValueOf(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	/** @type {(receiver: ThisParameterType<typeof Object.prototype.toString>, ...args: Parameters<typeof Object.prototype.toString>) => ReturnType<typeof Object.prototype.toString>} */
	var $toString = callBound("Object.prototype.toString");
	var strClass = "[object String]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isString(value) {
		if (typeof value === "string") return true;
		if (!value || typeof value !== "object") return false;
		return hasToStringTag ? tryStringObject(value) : $toString(value) === strClass;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-map@2.0.3/node_modules/is-map/index.js
var require_is_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @const */
	var $Map = typeof Map === "function" && Map.prototype ? Map : null;
	var $Set = typeof Set === "function" && Set.prototype ? Set : null;
	var exported;
	if (!$Map)
 /** @type {import('.')} */
	exported = function isMap(x) {
		return false;
	};
	var $mapHas = $Map ? Map.prototype.has : null;
	var $setHas = $Set ? Set.prototype.has : null;
	if (!exported && !$mapHas)
 /** @type {import('.')} */
	exported = function isMap(x) {
		return false;
	};
	/** @type {import('.')} */
	module.exports = exported || function isMap(x) {
		if (!x || typeof x !== "object") return false;
		try {
			$mapHas.call(x);
			if ($setHas) try {
				$setHas.call(x);
			} catch (e) {
				return true;
			}
			return x instanceof $Map;
		} catch (e) {}
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-set@2.0.3/node_modules/is-set/index.js
var require_is_set = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $Map = typeof Map === "function" && Map.prototype ? Map : null;
	var $Set = typeof Set === "function" && Set.prototype ? Set : null;
	var exported;
	if (!$Set)
 /** @type {import('.')} */
	exported = function isSet(x) {
		return false;
	};
	var $mapHas = $Map ? Map.prototype.has : null;
	var $setHas = $Set ? Set.prototype.has : null;
	if (!exported && !$setHas)
 /** @type {import('.')} */
	exported = function isSet(x) {
		return false;
	};
	/** @type {import('.')} */
	module.exports = exported || function isSet(x) {
		if (!x || typeof x !== "object") return false;
		try {
			$setHas.call(x);
			if ($mapHas) try {
				$mapHas.call(x);
			} catch (e) {
				return true;
			}
			return x instanceof $Set;
		} catch (e) {}
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/es-get-iterator@1.1.3/node_modules/es-get-iterator/index.js
var require_es_get_iterator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isArguments = require_is_arguments();
	var getStopIterationIterator = require_stop_iteration_iterator();
	if (require_has_symbols()() || require_shams$1()()) {
		var $iterator = Symbol.iterator;
		module.exports = function getIterator(iterable) {
			if (iterable != null && typeof iterable[$iterator] !== "undefined") return iterable[$iterator]();
			if (isArguments(iterable)) return Array.prototype[$iterator].call(iterable);
		};
	} else {
		var isArray = require_isarray();
		var isString = require_is_string();
		var GetIntrinsic = require_get_intrinsic();
		var $Map = GetIntrinsic("%Map%", true);
		var $Set = GetIntrinsic("%Set%", true);
		var callBound = require_callBound();
		var $arrayPush = callBound("Array.prototype.push");
		var $charCodeAt = callBound("String.prototype.charCodeAt");
		var $stringSlice = callBound("String.prototype.slice");
		var advanceStringIndex = function advanceStringIndex(S, index) {
			var length = S.length;
			if (index + 1 >= length) return index + 1;
			var first = $charCodeAt(S, index);
			if (first < 55296 || first > 56319) return index + 1;
			var second = $charCodeAt(S, index + 1);
			if (second < 56320 || second > 57343) return index + 1;
			return index + 2;
		};
		var getArrayIterator = function getArrayIterator(arraylike) {
			var i = 0;
			return { next: function next() {
				var done = i >= arraylike.length;
				var value;
				if (!done) {
					value = arraylike[i];
					i += 1;
				}
				return {
					done,
					value
				};
			} };
		};
		var getNonCollectionIterator = function getNonCollectionIterator(iterable, noPrimordialCollections) {
			if (isArray(iterable) || isArguments(iterable)) return getArrayIterator(iterable);
			if (isString(iterable)) {
				var i = 0;
				return { next: function next() {
					var nextIndex = advanceStringIndex(iterable, i);
					var value = $stringSlice(iterable, i, nextIndex);
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value
					};
				} };
			}
			if (noPrimordialCollections && typeof iterable["_es6-shim iterator_"] !== "undefined") return iterable["_es6-shim iterator_"]();
		};
		if (!$Map && !$Set) module.exports = function getIterator(iterable) {
			if (iterable != null) return getNonCollectionIterator(iterable, true);
		};
		else {
			var isMap = require_is_map();
			var isSet = require_is_set();
			var $mapForEach = callBound("Map.prototype.forEach", true);
			var $setForEach = callBound("Set.prototype.forEach", true);
			if (typeof process === "undefined" || !process.versions || !process.versions.node) {
				var $mapIterator = callBound("Map.prototype.iterator", true);
				var $setIterator = callBound("Set.prototype.iterator", true);
			}
			var $mapAtAtIterator = callBound("Map.prototype.@@iterator", true) || callBound("Map.prototype._es6-shim iterator_", true);
			var $setAtAtIterator = callBound("Set.prototype.@@iterator", true) || callBound("Set.prototype._es6-shim iterator_", true);
			var getCollectionIterator = function getCollectionIterator(iterable) {
				if (isMap(iterable)) {
					if ($mapIterator) return getStopIterationIterator($mapIterator(iterable));
					if ($mapAtAtIterator) return $mapAtAtIterator(iterable);
					if ($mapForEach) {
						var entries = [];
						$mapForEach(iterable, function(v, k) {
							$arrayPush(entries, [k, v]);
						});
						return getArrayIterator(entries);
					}
				}
				if (isSet(iterable)) {
					if ($setIterator) return getStopIterationIterator($setIterator(iterable));
					if ($setAtAtIterator) return $setAtAtIterator(iterable);
					if ($setForEach) {
						var values = [];
						$setForEach(iterable, function(v) {
							$arrayPush(values, v);
						});
						return getArrayIterator(values);
					}
				}
			};
			module.exports = function getIterator(iterable) {
				return getCollectionIterator(iterable) || getNonCollectionIterator(iterable);
			};
		}
	}
}));
//#endregion
//#region node_modules/.pnpm/object-is@1.1.6/node_modules/object-is/implementation.js
var require_implementation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var numberIsNaN = function(value) {
		return value !== value;
	};
	module.exports = function is(a, b) {
		if (a === 0 && b === 0) return 1 / a === 1 / b;
		if (a === b) return true;
		if (numberIsNaN(a) && numberIsNaN(b)) return true;
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/object-is@1.1.6/node_modules/object-is/polyfill.js
var require_polyfill = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation();
	module.exports = function getPolyfill() {
		return typeof Object.is === "function" ? Object.is : implementation;
	};
}));
//#endregion
//#region node_modules/.pnpm/object-is@1.1.6/node_modules/object-is/shim.js
var require_shim = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getPolyfill = require_polyfill();
	var define = require_define_properties();
	module.exports = function shimObjectIs() {
		var polyfill = getPolyfill();
		define(Object, { is: polyfill }, { is: function testObjectIs() {
			return Object.is !== polyfill;
		} });
		return polyfill;
	};
}));
//#endregion
//#region node_modules/.pnpm/object-is@1.1.6/node_modules/object-is/index.js
var require_object_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var define = require_define_properties();
	var callBind = require_call_bind();
	var implementation = require_implementation();
	var getPolyfill = require_polyfill();
	var shim = require_shim();
	var polyfill = callBind(getPolyfill(), Object);
	define(polyfill, {
		getPolyfill,
		implementation,
		shim
	});
	module.exports = polyfill;
}));
//#endregion
//#region node_modules/.pnpm/is-array-buffer@3.0.5/node_modules/is-array-buffer/index.js
var require_is_array_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind();
	var callBound = require_call_bound();
	var $ArrayBuffer = require_get_intrinsic()("%ArrayBuffer%", true);
	/** @type {undefined | ((receiver: ArrayBuffer) => number) | ((receiver: unknown) => never)} */
	var $byteLength = callBound("ArrayBuffer.prototype.byteLength", true);
	var $toString = callBound("Object.prototype.toString");
	var abSlice = !!$ArrayBuffer && !$byteLength && new $ArrayBuffer(0).slice;
	var $abSlice = !!abSlice && callBind(abSlice);
	/** @type {import('.')} */
	module.exports = $byteLength || $abSlice ? function isArrayBuffer(obj) {
		if (!obj || typeof obj !== "object") return false;
		try {
			if ($byteLength) $byteLength(obj);
			else $abSlice(obj, 0);
			return true;
		} catch (e) {
			return false;
		}
	} : $ArrayBuffer ? function isArrayBuffer(obj) {
		return $toString(obj) === "[object ArrayBuffer]";
	} : function isArrayBuffer(obj) {
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-date-object@1.1.0/node_modules/is-date-object/index.js
var require_is_date_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var getDay = callBound("Date.prototype.getDay");
	/** @type {import('.')} */
	var tryDateObject = function tryDateGetDayCall(value) {
		try {
			getDay(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	/** @type {(value: unknown) => string} */
	var toStr = callBound("Object.prototype.toString");
	var dateClass = "[object Date]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isDateObject(value) {
		if (typeof value !== "object" || value === null) return false;
		return hasToStringTag ? tryDateObject(value) : toStr(value) === dateClass;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-regex@1.2.1/node_modules/is-regex/index.js
var require_is_regex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var hasToStringTag = require_shams()();
	var hasOwn = require_hasown();
	var gOPD = require_gopd();
	/** @type {import('.')} */
	var fn;
	if (hasToStringTag) {
		/** @type {(receiver: ThisParameterType<typeof RegExp.prototype.exec>, ...args: Parameters<typeof RegExp.prototype.exec>) => ReturnType<typeof RegExp.prototype.exec>} */
		var $exec = callBound("RegExp.prototype.exec");
		/** @type {object} */
		var isRegexMarker = {};
		var throwRegexMarker = function() {
			throw isRegexMarker;
		};
		/** @type {{ toString(): never, valueOf(): never, [Symbol.toPrimitive]?(): never }} */
		var badStringifier = {
			toString: throwRegexMarker,
			valueOf: throwRegexMarker
		};
		if (typeof Symbol.toPrimitive === "symbol") badStringifier[Symbol.toPrimitive] = throwRegexMarker;
		/** @type {import('.')} */
		fn = function isRegex(value) {
			if (!value || typeof value !== "object") return false;
			var descriptor = gOPD(value, "lastIndex");
			if (!(descriptor && hasOwn(descriptor, "value"))) return false;
			try {
				$exec(value, badStringifier);
			} catch (e) {
				return e === isRegexMarker;
			}
		};
	} else {
		/** @type {(receiver: ThisParameterType<typeof Object.prototype.toString>, ...args: Parameters<typeof Object.prototype.toString>) => ReturnType<typeof Object.prototype.toString>} */
		var $toString = callBound("Object.prototype.toString");
		/** @const @type {'[object RegExp]'} */
		var regexClass = "[object RegExp]";
		/** @type {import('.')} */
		fn = function isRegex(value) {
			if (!value || typeof value !== "object" && typeof value !== "function") return false;
			return $toString(value) === regexClass;
		};
	}
	module.exports = fn;
}));
//#endregion
//#region node_modules/.pnpm/is-shared-array-buffer@1.0.4/node_modules/is-shared-array-buffer/index.js
var require_is_shared_array_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {undefined | ((thisArg: SharedArrayBuffer) => number)} */
	var $byteLength = require_call_bound()("SharedArrayBuffer.prototype.byteLength", true);
	/** @type {import('.')} */
	module.exports = $byteLength ? function isSharedArrayBuffer(obj) {
		if (!obj || typeof obj !== "object") return false;
		try {
			$byteLength(obj);
			return true;
		} catch (e) {
			return false;
		}
	} : function isSharedArrayBuffer(_obj) {
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-number-object@1.1.1/node_modules/is-number-object/index.js
var require_is_number_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var $numToStr = callBound("Number.prototype.toString");
	/** @type {import('.')} */
	var tryNumberObject = function tryNumberObject(value) {
		try {
			$numToStr(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var $toString = callBound("Object.prototype.toString");
	var numClass = "[object Number]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isNumberObject(value) {
		if (typeof value === "number") return true;
		if (!value || typeof value !== "object") return false;
		return hasToStringTag ? tryNumberObject(value) : $toString(value) === numClass;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-boolean-object@1.2.2/node_modules/is-boolean-object/index.js
var require_is_boolean_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var $boolToStr = callBound("Boolean.prototype.toString");
	var $toString = callBound("Object.prototype.toString");
	/** @type {import('.')} */
	var tryBooleanObject = function booleanBrandCheck(value) {
		try {
			$boolToStr(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var boolClass = "[object Boolean]";
	var hasToStringTag = require_shams()();
	/** @type {import('.')} */
	module.exports = function isBoolean(value) {
		if (typeof value === "boolean") return true;
		if (value === null || typeof value !== "object") return false;
		return hasToStringTag ? tryBooleanObject(value) : $toString(value) === boolClass;
	};
}));
//#endregion
//#region node_modules/.pnpm/safe-regex-test@1.1.0/node_modules/safe-regex-test/index.js
var require_safe_regex_test = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var isRegex = require_is_regex();
	var $exec = callBound("RegExp.prototype.exec");
	var $TypeError = require_type();
	/** @type {import('.')} */
	module.exports = function regexTester(regex) {
		if (!isRegex(regex)) throw new $TypeError("`regex` must be a RegExp");
		return function test(s) {
			return $exec(regex, s) !== null;
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/is-symbol@1.1.1/node_modules/is-symbol/index.js
var require_is_symbol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBound = require_call_bound();
	var $toString = callBound("Object.prototype.toString");
	var hasSymbols = require_has_symbols()();
	var safeRegexTest = require_safe_regex_test();
	if (hasSymbols) {
		var $symToStr = callBound("Symbol.prototype.toString");
		var isSymString = safeRegexTest(/^Symbol\(.*\)$/);
		/** @type {(value: object) => value is Symbol} */
		var isSymbolObject = function isRealSymbolObject(value) {
			if (typeof value.valueOf() !== "symbol") return false;
			return isSymString($symToStr(value));
		};
		/** @type {import('.')} */
		module.exports = function isSymbol(value) {
			if (typeof value === "symbol") return true;
			if (!value || typeof value !== "object" || $toString(value) !== "[object Symbol]") return false;
			try {
				return isSymbolObject(value);
			} catch (e) {
				return false;
			}
		};
	} else
 /** @type {import('.')} */
	module.exports = function isSymbol(value) {
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/has-bigints@1.1.0/node_modules/has-bigints/index.js
var require_has_bigints = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $BigInt = typeof BigInt !== "undefined" && BigInt;
	/** @type {import('.')} */
	module.exports = function hasNativeBigInts() {
		return typeof $BigInt === "function" && typeof BigInt === "function" && typeof $BigInt(42) === "bigint" && typeof BigInt(42) === "bigint";
	};
}));
//#endregion
//#region node_modules/.pnpm/is-bigint@1.1.0/node_modules/is-bigint/index.js
var require_is_bigint = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (require_has_bigints()()) {
		var bigIntValueOf = BigInt.prototype.valueOf;
		/** @type {(value: object) => value is BigInt} */
		var tryBigInt = function tryBigIntObject(value) {
			try {
				bigIntValueOf.call(value);
				return true;
			} catch (e) {}
			return false;
		};
		/** @type {import('.')} */
		module.exports = function isBigInt(value) {
			if (value === null || typeof value === "undefined" || typeof value === "boolean" || typeof value === "string" || typeof value === "number" || typeof value === "symbol" || typeof value === "function") return false;
			if (typeof value === "bigint") return true;
			return tryBigInt(value);
		};
	} else
 /** @type {import('.')} */
	module.exports = function isBigInt(value) {
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/which-boxed-primitive@1.1.1/node_modules/which-boxed-primitive/index.js
var require_which_boxed_primitive = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isString = require_is_string();
	var isNumber = require_is_number_object();
	var isBoolean = require_is_boolean_object();
	var isSymbol = require_is_symbol();
	var isBigInt = require_is_bigint();
	/** @type {import('.')} */
	module.exports = function whichBoxedPrimitive(value) {
		if (value == null || typeof value !== "object" && typeof value !== "function") return null;
		if (isString(value)) return "String";
		if (isNumber(value)) return "Number";
		if (isBoolean(value)) return "Boolean";
		if (isSymbol(value)) return "Symbol";
		if (isBigInt(value)) return "BigInt";
	};
}));
//#endregion
//#region node_modules/.pnpm/is-weakmap@2.0.2/node_modules/is-weakmap/index.js
var require_is_weakmap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $WeakMap = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap : null;
	var $WeakSet = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet : null;
	var exported;
	if (!$WeakMap)
 /** @type {import('.')} */
	exported = function isWeakMap(x) {
		return false;
	};
	var $mapHas = $WeakMap ? $WeakMap.prototype.has : null;
	var $setHas = $WeakSet ? $WeakSet.prototype.has : null;
	if (!exported && !$mapHas)
 /** @type {import('.')} */
	exported = function isWeakMap(x) {
		return false;
	};
	/** @type {import('.')} */
	module.exports = exported || function isWeakMap(x) {
		if (!x || typeof x !== "object") return false;
		try {
			$mapHas.call(x, $mapHas);
			if ($setHas) try {
				$setHas.call(x, $setHas);
			} catch (e) {
				return true;
			}
			return x instanceof $WeakMap;
		} catch (e) {}
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-weakset@2.0.4/node_modules/is-weakset/index.js
var require_is_weakset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var $WeakSet = GetIntrinsic("%WeakSet%", true);
	/** @type {undefined | (<V>(thisArg: Set<V>, value: V) => boolean)} */
	var $setHas = callBound("WeakSet.prototype.has", true);
	if ($setHas) {
		/** @type {undefined | (<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean)} */
		var $mapHas = callBound("WeakMap.prototype.has", true);
		/** @type {import('.')} */
		module.exports = function isWeakSet(x) {
			if (!x || typeof x !== "object") return false;
			try {
				$setHas(x, $setHas);
				if ($mapHas) try {
					$mapHas(x, $mapHas);
				} catch (e) {
					return true;
				}
				return x instanceof $WeakSet;
			} catch (e) {}
			return false;
		};
	} else
 /** @type {import('.')} */
	module.exports = function isWeakSet(x) {
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/which-collection@1.0.2/node_modules/which-collection/index.js
var require_which_collection = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isMap = require_is_map();
	var isSet = require_is_set();
	var isWeakMap = require_is_weakmap();
	var isWeakSet = require_is_weakset();
	/** @type {import('.')} */
	module.exports = function whichCollection(value) {
		if (value && typeof value === "object") {
			if (isMap(value)) return "Map";
			if (isSet(value)) return "Set";
			if (isWeakMap(value)) return "WeakMap";
			if (isWeakSet(value)) return "WeakSet";
		}
		return false;
	};
}));
//#endregion
//#region node_modules/.pnpm/is-callable@1.2.7/node_modules/is-callable/index.js
var require_is_callable = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fnToStr = Function.prototype.toString;
	var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
	var badArrayLike;
	var isCallableMarker;
	if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") try {
		badArrayLike = Object.defineProperty({}, "length", { get: function() {
			throw isCallableMarker;
		} });
		isCallableMarker = {};
		reflectApply(function() {
			throw 42;
		}, null, badArrayLike);
	} catch (_) {
		if (_ !== isCallableMarker) reflectApply = null;
	}
	else reflectApply = null;
	var constructorRegex = /^\s*class\b/;
	var isES6ClassFn = function isES6ClassFunction(value) {
		try {
			var fnStr = fnToStr.call(value);
			return constructorRegex.test(fnStr);
		} catch (e) {
			return false;
		}
	};
	var tryFunctionObject = function tryFunctionToStr(value) {
		try {
			if (isES6ClassFn(value)) return false;
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var objectClass = "[object Object]";
	var fnClass = "[object Function]";
	var genClass = "[object GeneratorFunction]";
	var ddaClass = "[object HTMLAllCollection]";
	var ddaClass2 = "[object HTML document.all class]";
	var ddaClass3 = "[object HTMLCollection]";
	var hasToStringTag = typeof Symbol === "function" && !!Symbol.toStringTag;
	var isIE68 = !(0 in [,]);
	var isDDA = function isDocumentDotAll() {
		return false;
	};
	if (typeof document === "object") {
		var all = document.all;
		if (toStr.call(all) === toStr.call(document.all)) isDDA = function isDocumentDotAll(value) {
			if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) try {
				var str = toStr.call(value);
				return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
			} catch (e) {}
			return false;
		};
	}
	module.exports = reflectApply ? function isCallable(value) {
		if (isDDA(value)) return true;
		if (!value) return false;
		if (typeof value !== "function" && typeof value !== "object") return false;
		try {
			reflectApply(value, null, badArrayLike);
		} catch (e) {
			if (e !== isCallableMarker) return false;
		}
		return !isES6ClassFn(value) && tryFunctionObject(value);
	} : function isCallable(value) {
		if (isDDA(value)) return true;
		if (!value) return false;
		if (typeof value !== "function" && typeof value !== "object") return false;
		if (hasToStringTag) return tryFunctionObject(value);
		if (isES6ClassFn(value)) return false;
		var strClass = toStr.call(value);
		if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) return false;
		return tryFunctionObject(value);
	};
}));
//#endregion
//#region node_modules/.pnpm/for-each@0.3.5/node_modules/for-each/index.js
var require_for_each = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isCallable = require_is_callable();
	var toStr = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	/** @type {<This, A extends readonly unknown[]>(arr: A, iterator: (this: This | void, value: A[number], index: number, arr: A) => void, receiver: This | undefined) => void} */
	var forEachArray = function forEachArray(array, iterator, receiver) {
		for (var i = 0, len = array.length; i < len; i++) if (hasOwnProperty.call(array, i)) if (receiver == null) iterator(array[i], i, array);
		else iterator.call(receiver, array[i], i, array);
	};
	/** @type {<This, S extends string>(string: S, iterator: (this: This | void, value: S[number], index: number, string: S) => void, receiver: This | undefined) => void} */
	var forEachString = function forEachString(string, iterator, receiver) {
		for (var i = 0, len = string.length; i < len; i++) if (receiver == null) iterator(string.charAt(i), i, string);
		else iterator.call(receiver, string.charAt(i), i, string);
	};
	/** @type {<This, O>(obj: O, iterator: (this: This | void, value: O[keyof O], index: keyof O, obj: O) => void, receiver: This | undefined) => void} */
	var forEachObject = function forEachObject(object, iterator, receiver) {
		for (var k in object) if (hasOwnProperty.call(object, k)) if (receiver == null) iterator(object[k], k, object);
		else iterator.call(receiver, object[k], k, object);
	};
	/** @type {(x: unknown) => x is readonly unknown[]} */
	function isArray(x) {
		return toStr.call(x) === "[object Array]";
	}
	/** @type {import('.')._internal} */
	module.exports = function forEach(list, iterator, thisArg) {
		if (!isCallable(iterator)) throw new TypeError("iterator must be a function");
		var receiver;
		if (arguments.length >= 3) receiver = thisArg;
		if (isArray(list)) forEachArray(list, iterator, receiver);
		else if (typeof list === "string") forEachString(list, iterator, receiver);
		else forEachObject(list, iterator, receiver);
	};
}));
//#endregion
//#region node_modules/.pnpm/possible-typed-array-names@1.1.0/node_modules/possible-typed-array-names/index.js
var require_possible_typed_array_names = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = [
		"Float16Array",
		"Float32Array",
		"Float64Array",
		"Int8Array",
		"Int16Array",
		"Int32Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Uint16Array",
		"Uint32Array",
		"BigInt64Array",
		"BigUint64Array"
	];
}));
//#endregion
//#region node_modules/.pnpm/available-typed-arrays@1.0.7/node_modules/available-typed-arrays/index.js
var require_available_typed_arrays = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var possibleNames = require_possible_typed_array_names();
	var g = typeof globalThis === "undefined" ? global : globalThis;
	/** @type {import('.')} */
	module.exports = function availableTypedArrays() {
		var out = [];
		for (var i = 0; i < possibleNames.length; i++) if (typeof g[possibleNames[i]] === "function") out[out.length] = possibleNames[i];
		return out;
	};
}));
//#endregion
//#region node_modules/.pnpm/which-typed-array@1.1.20/node_modules/which-typed-array/index.js
var require_which_typed_array = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var forEach = require_for_each();
	var availableTypedArrays = require_available_typed_arrays();
	var callBind = require_call_bind();
	var callBound = require_call_bound();
	var gOPD = require_gopd();
	var getProto = require_get_proto();
	var $toString = callBound("Object.prototype.toString");
	var hasToStringTag = require_shams()();
	var g = typeof globalThis === "undefined" ? global : globalThis;
	var typedArrays = availableTypedArrays();
	var $slice = callBound("String.prototype.slice");
	/** @type {<T = unknown>(array: readonly T[], value: unknown) => number} */
	var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
		for (var i = 0; i < array.length; i += 1) if (array[i] === value) return i;
		return -1;
	};
	/** @typedef {import('./types').Getter} Getter */
	/** @type {import('./types').Cache} */
	var cache = { __proto__: null };
	if (hasToStringTag && gOPD && getProto) forEach(typedArrays, function(typedArray) {
		var arr = new g[typedArray]();
		if (Symbol.toStringTag in arr && getProto) {
			var proto = getProto(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor && proto) descriptor = gOPD(getProto(proto), Symbol.toStringTag);
			if (descriptor && descriptor.get) {
				var bound = callBind(descriptor.get);
				cache["$" + typedArray] = bound;
			}
		}
	});
	else forEach(typedArrays, function(typedArray) {
		var arr = new g[typedArray]();
		var fn = arr.slice || arr.set;
		if (fn) {
			var bound = callBind(fn);
			cache["$" + typedArray] = bound;
		}
	});
	/** @type {(value: object) => false | import('.').TypedArrayName} */
	var tryTypedArrays = function tryAllTypedArrays(value) {
		/** @type {ReturnType<typeof tryAllTypedArrays>} */ var found = false;
		forEach(
			cache,
			/** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
			function(getter, typedArray) {
				if (!found) try {
					if ("$" + getter(value) === typedArray) found = $slice(typedArray, 1);
				} catch (e) {}
			}
		);
		return found;
	};
	/** @type {(value: object) => false | import('.').TypedArrayName} */
	var trySlices = function tryAllSlices(value) {
		/** @type {ReturnType<typeof tryAllSlices>} */ var found = false;
		forEach(
			cache,
			/** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
			function(getter, name) {
				if (!found) try {
					getter(value);
					found = $slice(name, 1);
				} catch (e) {}
			}
		);
		return found;
	};
	/** @type {import('.')} */
	module.exports = function whichTypedArray(value) {
		if (!value || typeof value !== "object") return false;
		if (!hasToStringTag) {
			/** @type {string} */
			var tag = $slice($toString(value), 8, -1);
			if ($indexOf(typedArrays, tag) > -1) return tag;
			if (tag !== "Object") return false;
			return trySlices(value);
		}
		if (!gOPD) return null;
		return tryTypedArrays(value);
	};
}));
//#endregion
//#region node_modules/.pnpm/array-buffer-byte-length@1.0.2/node_modules/array-buffer-byte-length/index.js
var require_array_buffer_byte_length = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $byteLength = require_call_bound()("ArrayBuffer.prototype.byteLength", true);
	var isArrayBuffer = require_is_array_buffer();
	/** @type {import('.')} */
	module.exports = function byteLength(ab) {
		if (!isArrayBuffer(ab)) return NaN;
		return $byteLength ? $byteLength(ab) : ab.byteLength;
	};
}));
//#endregion
//#region node_modules/.pnpm/deep-equal@2.2.3/node_modules/deep-equal/index.js
var require_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var assign = require_object_assign();
	var callBound = require_callBound();
	var flags = require_regexp_prototype_flags();
	var GetIntrinsic = require_get_intrinsic();
	var getIterator = require_es_get_iterator();
	var getSideChannel = require_side_channel();
	var is = require_object_is();
	var isArguments = require_is_arguments();
	var isArray = require_isarray();
	var isArrayBuffer = require_is_array_buffer();
	var isDate = require_is_date_object();
	var isRegex = require_is_regex();
	var isSharedArrayBuffer = require_is_shared_array_buffer();
	var objectKeys = require_object_keys();
	var whichBoxedPrimitive = require_which_boxed_primitive();
	var whichCollection = require_which_collection();
	var whichTypedArray = require_which_typed_array();
	var byteLength = require_array_buffer_byte_length();
	var sabByteLength = callBound("SharedArrayBuffer.prototype.byteLength", true);
	var $getTime = callBound("Date.prototype.getTime");
	var gPO = Object.getPrototypeOf;
	var $objToString = callBound("Object.prototype.toString");
	var $Set = GetIntrinsic("%Set%", true);
	var $mapHas = callBound("Map.prototype.has", true);
	var $mapGet = callBound("Map.prototype.get", true);
	var $mapSize = callBound("Map.prototype.size", true);
	var $setAdd = callBound("Set.prototype.add", true);
	var $setDelete = callBound("Set.prototype.delete", true);
	var $setHas = callBound("Set.prototype.has", true);
	var $setSize = callBound("Set.prototype.size", true);
	function setHasEqualElement(set, val1, opts, channel) {
		var i = getIterator(set);
		var result;
		while ((result = i.next()) && !result.done) if (internalDeepEqual(val1, result.value, opts, channel)) {
			$setDelete(set, result.value);
			return true;
		}
		return false;
	}
	function findLooseMatchingPrimitives(prim) {
		if (typeof prim === "undefined") return null;
		if (typeof prim === "object") return;
		if (typeof prim === "symbol") return false;
		if (typeof prim === "string" || typeof prim === "number") return +prim === +prim;
		return true;
	}
	function mapMightHaveLoosePrim(a, b, prim, item, opts, channel) {
		var altValue = findLooseMatchingPrimitives(prim);
		if (altValue != null) return altValue;
		var curB = $mapGet(b, altValue);
		var looseOpts = assign({}, opts, { strict: false });
		if (typeof curB === "undefined" && !$mapHas(b, altValue) || !internalDeepEqual(item, curB, looseOpts, channel)) return false;
		return !$mapHas(a, altValue) && internalDeepEqual(item, curB, looseOpts, channel);
	}
	function setMightHaveLoosePrim(a, b, prim) {
		var altValue = findLooseMatchingPrimitives(prim);
		if (altValue != null) return altValue;
		return $setHas(b, altValue) && !$setHas(a, altValue);
	}
	function mapHasEqualEntry(set, map, key1, item1, opts, channel) {
		var i = getIterator(set);
		var result;
		var key2;
		while ((result = i.next()) && !result.done) {
			key2 = result.value;
			if (internalDeepEqual(key1, key2, opts, channel) && internalDeepEqual(item1, $mapGet(map, key2), opts, channel)) {
				$setDelete(set, key2);
				return true;
			}
		}
		return false;
	}
	function internalDeepEqual(actual, expected, options, channel) {
		var opts = options || {};
		if (opts.strict ? is(actual, expected) : actual === expected) return true;
		if (whichBoxedPrimitive(actual) !== whichBoxedPrimitive(expected)) return false;
		if (!actual || !expected || typeof actual !== "object" && typeof expected !== "object") return opts.strict ? is(actual, expected) : actual == expected;
		var hasActual = channel.has(actual);
		var hasExpected = channel.has(expected);
		var sentinel;
		if (hasActual && hasExpected) {
			if (channel.get(actual) === channel.get(expected)) return true;
		} else sentinel = {};
		if (!hasActual) channel.set(actual, sentinel);
		if (!hasExpected) channel.set(expected, sentinel);
		return objEquiv(actual, expected, opts, channel);
	}
	function isBuffer(x) {
		if (!x || typeof x !== "object" || typeof x.length !== "number") return false;
		if (typeof x.copy !== "function" || typeof x.slice !== "function") return false;
		if (x.length > 0 && typeof x[0] !== "number") return false;
		return !!(x.constructor && x.constructor.isBuffer && x.constructor.isBuffer(x));
	}
	function setEquiv(a, b, opts, channel) {
		if ($setSize(a) !== $setSize(b)) return false;
		var iA = getIterator(a);
		var iB = getIterator(b);
		var resultA;
		var resultB;
		var set;
		while ((resultA = iA.next()) && !resultA.done) if (resultA.value && typeof resultA.value === "object") {
			if (!set) set = new $Set();
			$setAdd(set, resultA.value);
		} else if (!$setHas(b, resultA.value)) {
			if (opts.strict) return false;
			if (!setMightHaveLoosePrim(a, b, resultA.value)) return false;
			if (!set) set = new $Set();
			$setAdd(set, resultA.value);
		}
		if (set) {
			while ((resultB = iB.next()) && !resultB.done) if (resultB.value && typeof resultB.value === "object") {
				if (!setHasEqualElement(set, resultB.value, opts.strict, channel)) return false;
			} else if (!opts.strict && !$setHas(a, resultB.value) && !setHasEqualElement(set, resultB.value, opts.strict, channel)) return false;
			return $setSize(set) === 0;
		}
		return true;
	}
	function mapEquiv(a, b, opts, channel) {
		if ($mapSize(a) !== $mapSize(b)) return false;
		var iA = getIterator(a);
		var iB = getIterator(b);
		var resultA;
		var resultB;
		var set;
		var key;
		var item1;
		var item2;
		while ((resultA = iA.next()) && !resultA.done) {
			key = resultA.value[0];
			item1 = resultA.value[1];
			if (key && typeof key === "object") {
				if (!set) set = new $Set();
				$setAdd(set, key);
			} else {
				item2 = $mapGet(b, key);
				if (typeof item2 === "undefined" && !$mapHas(b, key) || !internalDeepEqual(item1, item2, opts, channel)) {
					if (opts.strict) return false;
					if (!mapMightHaveLoosePrim(a, b, key, item1, opts, channel)) return false;
					if (!set) set = new $Set();
					$setAdd(set, key);
				}
			}
		}
		if (set) {
			while ((resultB = iB.next()) && !resultB.done) {
				key = resultB.value[0];
				item2 = resultB.value[1];
				if (key && typeof key === "object") {
					if (!mapHasEqualEntry(set, a, key, item2, opts, channel)) return false;
				} else if (!opts.strict && (!a.has(key) || !internalDeepEqual($mapGet(a, key), item2, opts, channel)) && !mapHasEqualEntry(set, a, key, item2, assign({}, opts, { strict: false }), channel)) return false;
			}
			return $setSize(set) === 0;
		}
		return true;
	}
	function objEquiv(a, b, opts, channel) {
		var i, key;
		if (typeof a !== typeof b) return false;
		if (a == null || b == null) return false;
		if ($objToString(a) !== $objToString(b)) return false;
		if (isArguments(a) !== isArguments(b)) return false;
		if (isArray(a) !== isArray(b)) return false;
		var aIsError = a instanceof Error;
		var bIsError = b instanceof Error;
		if (aIsError !== bIsError) return false;
		if (aIsError || bIsError) {
			if (a.name !== b.name || a.message !== b.message) return false;
		}
		var aIsRegex = isRegex(a);
		var bIsRegex = isRegex(b);
		if (aIsRegex !== bIsRegex) return false;
		if ((aIsRegex || bIsRegex) && (a.source !== b.source || flags(a) !== flags(b))) return false;
		var aIsDate = isDate(a);
		var bIsDate = isDate(b);
		if (aIsDate !== bIsDate) return false;
		if (aIsDate || bIsDate) {
			if ($getTime(a) !== $getTime(b)) return false;
		}
		if (opts.strict && gPO && gPO(a) !== gPO(b)) return false;
		var aWhich = whichTypedArray(a);
		var bWhich = whichTypedArray(b);
		if (aWhich !== bWhich) return false;
		if (aWhich || bWhich) {
			if (a.length !== b.length) return false;
			for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
			return true;
		}
		var aIsBuffer = isBuffer(a);
		var bIsBuffer = isBuffer(b);
		if (aIsBuffer !== bIsBuffer) return false;
		if (aIsBuffer || bIsBuffer) {
			if (a.length !== b.length) return false;
			for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
			return true;
		}
		var aIsArrayBuffer = isArrayBuffer(a);
		var bIsArrayBuffer = isArrayBuffer(b);
		if (aIsArrayBuffer !== bIsArrayBuffer) return false;
		if (aIsArrayBuffer || bIsArrayBuffer) {
			if (byteLength(a) !== byteLength(b)) return false;
			return typeof Uint8Array === "function" && internalDeepEqual(new Uint8Array(a), new Uint8Array(b), opts, channel);
		}
		var aIsSAB = isSharedArrayBuffer(a);
		var bIsSAB = isSharedArrayBuffer(b);
		if (aIsSAB !== bIsSAB) return false;
		if (aIsSAB || bIsSAB) {
			if (sabByteLength(a) !== sabByteLength(b)) return false;
			return typeof Uint8Array === "function" && internalDeepEqual(new Uint8Array(a), new Uint8Array(b), opts, channel);
		}
		if (typeof a !== typeof b) return false;
		var ka = objectKeys(a);
		var kb = objectKeys(b);
		if (ka.length !== kb.length) return false;
		ka.sort();
		kb.sort();
		for (i = ka.length - 1; i >= 0; i--) if (ka[i] != kb[i]) return false;
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!internalDeepEqual(a[key], b[key], opts, channel)) return false;
		}
		var aCollection = whichCollection(a);
		var bCollection = whichCollection(b);
		if (aCollection !== bCollection) return false;
		if (aCollection === "Set" || bCollection === "Set") return setEquiv(a, b, opts, channel);
		if (aCollection === "Map") return mapEquiv(a, b, opts, channel);
		return true;
	}
	module.exports = function deepEqual(a, b, opts) {
		return internalDeepEqual(a, b, opts, getSideChannel());
	};
}));
//#endregion
//#region node_modules/.pnpm/vue-plugin-render-freeze@2.0.4_vue@3.5.34_typescript@5.9.3_/node_modules/vue-plugin-render-freeze/dist/index.js
var SymbolRenderOriginal, SymbolRenderFreezeCounter, SymbolRenderFreezeSnapshot, PluginFreeze;
var init_dist = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_asyncToGenerator();
	SymbolRenderOriginal = Symbol("SymbolRenderOriginal");
	SymbolRenderFreezeCounter = Symbol("SymbolRenderFreezeCounter");
	SymbolRenderFreezeSnapshot = Symbol("SymbolRenderFreezeSnapshot");
	PluginFreeze = { install(app) {
		app.mixin({
			created() {
				const renderMethod = "render";
				const self = this;
				const instance = this._;
				self[SymbolRenderFreezeCounter] = ref(0);
				self[SymbolRenderFreezeSnapshot] = void 0;
				self[SymbolRenderOriginal] = instance[renderMethod];
				instance[renderMethod] = function(...args) {
					if (self[SymbolRenderFreezeCounter].value === 0) return self[SymbolRenderOriginal].call(this, ...args);
					if (!self[SymbolRenderFreezeSnapshot]) self[SymbolRenderFreezeSnapshot] = self[SymbolRenderOriginal].call(this, ...args);
					return self[SymbolRenderFreezeSnapshot];
				};
			},
			beforeUnmount() {
				const self = this;
				if (self[SymbolRenderFreezeSnapshot]) self[SymbolRenderFreezeSnapshot] = void 0;
			},
			methods: {
				renderFreeze(freeze) {
					const self = this;
					if (freeze) {
						if (self[SymbolRenderFreezeCounter].value === 0) self[SymbolRenderFreezeSnapshot] = void 0;
						self[SymbolRenderFreezeCounter].value++;
					} else {
						self[SymbolRenderFreezeCounter].value--;
						if (self[SymbolRenderFreezeCounter].value === 0) self[SymbolRenderFreezeSnapshot] = void 0;
					}
				},
				renderFreezeScope(fn) {
					var _this = this;
					return _asyncToGenerator(function* () {
						const self = _this;
						try {
							self.renderFreeze(true);
							return yield fn();
						} finally {
							self.renderFreeze(false);
						}
					})();
				}
			}
		});
	} };
}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (e.includes(n)) continue;
		t[n] = r[n];
	}
	return t;
}
var init_objectWithoutPropertiesLoose = __esmMin((() => {}));
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/objectWithoutProperties.js
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var s = Object.getOwnPropertySymbols(e);
		for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
var init_objectWithoutProperties = __esmMin((() => {
	init_objectWithoutPropertiesLoose();
}));
//#endregion
//#region node_modules/.pnpm/fecha@4.2.3/node_modules/fecha/lib/fecha.js
function shorten(arr, sLen) {
	var newArr = [];
	for (var i = 0, len = arr.length; i < len; i++) newArr.push(arr[i].substr(0, sLen));
	return newArr;
}
function assign(origObj) {
	var args = [];
	for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
	for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
		var obj = args_1[_a];
		for (var key in obj) origObj[key] = obj[key];
	}
	return origObj;
}
/**
* Parse a date string into a Javascript Date object /
* @method parse
* @param {string} dateStr Date string
* @param {string} format Date parse format
* @param {i18n} I18nSettingsOptional Full or subset of I18N settings
* @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
*/
function parse(dateStr, format, i18n) {
	if (i18n === void 0) i18n = {};
	if (typeof format !== "string") throw new Error("Invalid format in fecha parse");
	format = globalMasks[format] || format;
	if (dateStr.length > 1e3) return null;
	var dateInfo = {
		year: (/* @__PURE__ */ new Date()).getFullYear(),
		month: 0,
		day: 1,
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0,
		isPm: null,
		timezoneOffset: null
	};
	var parseInfo = [];
	var literals = [];
	var newFormat = format.replace(literal, function($0, $1) {
		literals.push(regexEscape($1));
		return "@@@";
	});
	var specifiedFields = {};
	var requiredFields = {};
	newFormat = regexEscape(newFormat).replace(token, function($0) {
		var info = parseFlags[$0];
		var field = info[0], regex = info[1], requiredField = info[3];
		if (specifiedFields[field]) throw new Error("Invalid format. " + field + " specified twice in format");
		specifiedFields[field] = true;
		if (requiredField) requiredFields[requiredField] = true;
		parseInfo.push(info);
		return "(" + regex + ")";
	});
	Object.keys(requiredFields).forEach(function(field) {
		if (!specifiedFields[field]) throw new Error("Invalid format. " + field + " is required in specified format");
	});
	newFormat = newFormat.replace(/@@@/g, function() {
		return literals.shift();
	});
	var matches = dateStr.match(new RegExp(newFormat, "i"));
	if (!matches) return null;
	var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
	for (var i = 1; i < matches.length; i++) {
		var _a = parseInfo[i - 1], field = _a[0], parser = _a[2];
		var value = parser ? parser(matches[i], combinedI18nSettings) : +matches[i];
		if (value == null) return null;
		dateInfo[field] = value;
	}
	if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) dateInfo.hour = +dateInfo.hour + 12;
	else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) dateInfo.hour = 0;
	var dateTZ;
	if (dateInfo.timezoneOffset == null) {
		dateTZ = new Date(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute, dateInfo.second, dateInfo.millisecond);
		var validateFields = [
			["month", "getMonth"],
			["day", "getDate"],
			["hour", "getHours"],
			["minute", "getMinutes"],
			["second", "getSeconds"]
		];
		for (var i = 0, len = validateFields.length; i < len; i++) if (specifiedFields[validateFields[i][0]] && dateInfo[validateFields[i][0]] !== dateTZ[validateFields[i][1]]()) return null;
	} else {
		dateTZ = new Date(Date.UTC(dateInfo.year, dateInfo.month, dateInfo.day, dateInfo.hour, dateInfo.minute - dateInfo.timezoneOffset, dateInfo.second, dateInfo.millisecond));
		if (dateInfo.month > 11 || dateInfo.month < 0 || dateInfo.day > 31 || dateInfo.day < 1 || dateInfo.hour > 23 || dateInfo.hour < 0 || dateInfo.minute > 59 || dateInfo.minute < 0 || dateInfo.second > 59 || dateInfo.second < 0) return null;
	}
	return dateTZ;
}
var token, twoDigitsOptional, twoDigits, threeDigits, fourDigits, word, literal, monthUpdate, dayNames, monthNames, monthNamesShort, defaultI18n, globalI18n, setGlobalDateI18n, regexEscape, pad, formatFlags, monthParse, emptyDigits, emptyWord, amPm, timezoneOffset, parseFlags, globalMasks, setGlobalDateMasks, format, fecha;
var init_fecha = __esmMin((() => {
	token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
	twoDigitsOptional = "\\d\\d?";
	twoDigits = "\\d\\d";
	threeDigits = "\\d{3}";
	fourDigits = "\\d{4}";
	word = "[^\\s]+";
	literal = /\[([^]*?)\]/gm;
	monthUpdate = function(arrName) {
		return function(v, i18n) {
			var index = i18n[arrName].map(function(v) {
				return v.toLowerCase();
			}).indexOf(v.toLowerCase());
			if (index > -1) return index;
			return null;
		};
	};
	dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	monthNamesShort = shorten(monthNames, 3);
	defaultI18n = {
		dayNamesShort: shorten(dayNames, 3),
		dayNames,
		monthNamesShort,
		monthNames,
		amPm: ["am", "pm"],
		DoFn: function(dayOfMonth) {
			return dayOfMonth + [
				"th",
				"st",
				"nd",
				"rd"
			][dayOfMonth % 10 > 3 ? 0 : (dayOfMonth - dayOfMonth % 10 !== 10 ? 1 : 0) * dayOfMonth % 10];
		}
	};
	globalI18n = assign({}, defaultI18n);
	setGlobalDateI18n = function(i18n) {
		return globalI18n = assign(globalI18n, i18n);
	};
	regexEscape = function(str) {
		return str.replace(/[|\\{()[^$+*?.-]/g, "\\$&");
	};
	pad = function(val, len) {
		if (len === void 0) len = 2;
		val = String(val);
		while (val.length < len) val = "0" + val;
		return val;
	};
	formatFlags = {
		D: function(dateObj) {
			return String(dateObj.getDate());
		},
		DD: function(dateObj) {
			return pad(dateObj.getDate());
		},
		Do: function(dateObj, i18n) {
			return i18n.DoFn(dateObj.getDate());
		},
		d: function(dateObj) {
			return String(dateObj.getDay());
		},
		dd: function(dateObj) {
			return pad(dateObj.getDay());
		},
		ddd: function(dateObj, i18n) {
			return i18n.dayNamesShort[dateObj.getDay()];
		},
		dddd: function(dateObj, i18n) {
			return i18n.dayNames[dateObj.getDay()];
		},
		M: function(dateObj) {
			return String(dateObj.getMonth() + 1);
		},
		MM: function(dateObj) {
			return pad(dateObj.getMonth() + 1);
		},
		MMM: function(dateObj, i18n) {
			return i18n.monthNamesShort[dateObj.getMonth()];
		},
		MMMM: function(dateObj, i18n) {
			return i18n.monthNames[dateObj.getMonth()];
		},
		YY: function(dateObj) {
			return pad(String(dateObj.getFullYear()), 4).substr(2);
		},
		YYYY: function(dateObj) {
			return pad(dateObj.getFullYear(), 4);
		},
		h: function(dateObj) {
			return String(dateObj.getHours() % 12 || 12);
		},
		hh: function(dateObj) {
			return pad(dateObj.getHours() % 12 || 12);
		},
		H: function(dateObj) {
			return String(dateObj.getHours());
		},
		HH: function(dateObj) {
			return pad(dateObj.getHours());
		},
		m: function(dateObj) {
			return String(dateObj.getMinutes());
		},
		mm: function(dateObj) {
			return pad(dateObj.getMinutes());
		},
		s: function(dateObj) {
			return String(dateObj.getSeconds());
		},
		ss: function(dateObj) {
			return pad(dateObj.getSeconds());
		},
		S: function(dateObj) {
			return String(Math.round(dateObj.getMilliseconds() / 100));
		},
		SS: function(dateObj) {
			return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
		},
		SSS: function(dateObj) {
			return pad(dateObj.getMilliseconds(), 3);
		},
		a: function(dateObj, i18n) {
			return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
		},
		A: function(dateObj, i18n) {
			return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
		},
		ZZ: function(dateObj) {
			var offset = dateObj.getTimezoneOffset();
			return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60, 4);
		},
		Z: function(dateObj) {
			var offset = dateObj.getTimezoneOffset();
			return (offset > 0 ? "-" : "+") + pad(Math.floor(Math.abs(offset) / 60), 2) + ":" + pad(Math.abs(offset) % 60, 2);
		}
	};
	monthParse = function(v) {
		return +v - 1;
	};
	emptyDigits = [null, twoDigitsOptional];
	emptyWord = [null, word];
	amPm = [
		"isPm",
		word,
		function(v, i18n) {
			var val = v.toLowerCase();
			if (val === i18n.amPm[0]) return 0;
			else if (val === i18n.amPm[1]) return 1;
			return null;
		}
	];
	timezoneOffset = [
		"timezoneOffset",
		"[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?",
		function(v) {
			var parts = (v + "").match(/([+-]|\d\d)/gi);
			if (parts) {
				var minutes = +parts[1] * 60 + parseInt(parts[2], 10);
				return parts[0] === "+" ? minutes : -minutes;
			}
			return 0;
		}
	];
	parseFlags = {
		D: ["day", twoDigitsOptional],
		DD: ["day", twoDigits],
		Do: [
			"day",
			twoDigitsOptional + word,
			function(v) {
				return parseInt(v, 10);
			}
		],
		M: [
			"month",
			twoDigitsOptional,
			monthParse
		],
		MM: [
			"month",
			twoDigits,
			monthParse
		],
		YY: [
			"year",
			twoDigits,
			function(v) {
				var cent = +("" + (/* @__PURE__ */ new Date()).getFullYear()).substr(0, 2);
				return +("" + (+v > 68 ? cent - 1 : cent) + v);
			}
		],
		h: [
			"hour",
			twoDigitsOptional,
			void 0,
			"isPm"
		],
		hh: [
			"hour",
			twoDigits,
			void 0,
			"isPm"
		],
		H: ["hour", twoDigitsOptional],
		HH: ["hour", twoDigits],
		m: ["minute", twoDigitsOptional],
		mm: ["minute", twoDigits],
		s: ["second", twoDigitsOptional],
		ss: ["second", twoDigits],
		YYYY: ["year", fourDigits],
		S: [
			"millisecond",
			"\\d",
			function(v) {
				return +v * 100;
			}
		],
		SS: [
			"millisecond",
			twoDigits,
			function(v) {
				return +v * 10;
			}
		],
		SSS: ["millisecond", threeDigits],
		d: emptyDigits,
		dd: emptyDigits,
		ddd: emptyWord,
		dddd: emptyWord,
		MMM: [
			"month",
			word,
			monthUpdate("monthNamesShort")
		],
		MMMM: [
			"month",
			word,
			monthUpdate("monthNames")
		],
		a: amPm,
		A: amPm,
		ZZ: timezoneOffset,
		Z: timezoneOffset
	};
	globalMasks = {
		default: "ddd MMM DD YYYY HH:mm:ss",
		shortDate: "M/D/YY",
		mediumDate: "MMM D, YYYY",
		longDate: "MMMM D, YYYY",
		fullDate: "dddd, MMMM D, YYYY",
		isoDate: "YYYY-MM-DD",
		isoDateTime: "YYYY-MM-DDTHH:mm:ssZ",
		shortTime: "HH:mm",
		mediumTime: "HH:mm:ss",
		longTime: "HH:mm:ss.SSS"
	};
	setGlobalDateMasks = function(masks) {
		return assign(globalMasks, masks);
	};
	format = function(dateObj, mask, i18n) {
		if (mask === void 0) mask = globalMasks["default"];
		if (i18n === void 0) i18n = {};
		if (typeof dateObj === "number") dateObj = new Date(dateObj);
		if (Object.prototype.toString.call(dateObj) !== "[object Date]" || isNaN(dateObj.getTime())) throw new Error("Invalid Date pass to format");
		mask = globalMasks[mask] || mask;
		var literals = [];
		mask = mask.replace(literal, function($0, $1) {
			literals.push($1);
			return "@@@";
		});
		var combinedI18nSettings = assign(assign({}, globalI18n), i18n);
		mask = mask.replace(token, function($0) {
			return formatFlags[$0](dateObj, combinedI18nSettings);
		});
		return mask.replace(/@@@/g, function() {
			return literals.shift();
		});
	};
	fecha = {
		format,
		parse,
		defaultI18n,
		setGlobalDateI18n,
		setGlobalDateMasks
	};
}));
//#endregion
export { _classPrivateFieldSet2 as C, _classPrivateFieldInitSpec as D, init_assertClassBrand as E, init_classPrivateFieldInitSpec as O, init_classPrivateFieldGet2 as S, _assertClassBrand as T, init_toPropertyKey as _, PluginFreeze as a, init_classPrivateMethodInitSpec as b, require_object_hash as c, _objectSpread2 as d, init_objectSpread2 as f, init_defineProperty as g, _defineProperty as h, init_objectWithoutProperties as i, require_dist as k, init_lib as l, init_asyncToGenerator as m, init_fecha as n, init_dist as o, _asyncToGenerator as p, _objectWithoutProperties as r, require_deep_equal as s, fecha as t, Environment as u, toPropertyKey as v, init_classPrivateFieldSet2 as w, _classPrivateFieldGet2 as x, _classPrivateMethodInitSpec as y };

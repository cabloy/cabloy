import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { g as init_defineProperty, h as _defineProperty } from "./fecha-DmopMB3M.js";
import { a as ZFormFieldCurrency, c as currencyUpdate, i as TableCellCurrency, n as ScopeModuleBasicCurrency, o as ControllerFormFieldCurrency, r as components, s as currencyFormat, t as init_src } from "./basic-currency-DXoPdU7e.js";
//#region node_modules/.pnpm/@zhennann+currency@2.0.4/node_modules/@zhennann/currency/dist/index.js
function _trimZero(str, zero) {
	let indexZero = str.indexOf(".");
	if (indexZero === -1) return str;
	for (let index = str.length - 1; index > indexZero; index--) if (str[index] === "0" && index - indexZero > zero) str = str.substring(0, str.length - 1);
	else break;
	if (indexZero === str.length - 1) str = str.substring(0, str.length - 1);
	return str;
}
var Currency;
var init_dist = __esmMin((() => {
	init_defineProperty();
	Currency = class {
		constructor(options) {
			var _options$fixed, _options$exp, _options$zero;
			_defineProperty(this, "fixed", void 0);
			_defineProperty(this, "exp", void 0);
			_defineProperty(this, "zero", void 0);
			if (options === false) throw new Error("Currency options cannot be false");
			if (!options || typeof options !== "object") options = {};
			this.fixed = (_options$fixed = options.fixed) !== null && _options$fixed !== void 0 ? _options$fixed : 2;
			this.exp = (_options$exp = options.exp) !== null && _options$exp !== void 0 ? _options$exp : this.fixed;
			this.zero = (_options$zero = options.zero) !== null && _options$zero !== void 0 ? _options$zero : this.fixed;
		}
		format(value) {
			if (value === void 0 || value === null) return "";
			if (typeof value === "string" && value.trim() === "") return "";
			if (isNaN(value)) return String(value);
			return _trimZero((Number(value) / Math.pow(10, this.exp)).toFixed(this.fixed), this.zero);
		}
		update(value) {
			if (value === void 0 || value === null) return void 0;
			if (typeof value === "string" && value.trim() === "") return null;
			if (isNaN(value)) return void 0;
			return Number((Number(value) * Math.pow(10, this.exp)).toFixed(0));
		}
	};
}));
//#endregion
init_src();
export { ControllerFormFieldCurrency, ScopeModuleBasicCurrency, TableCellCurrency, ZFormFieldCurrency, components, currencyFormat, currencyUpdate, init_dist as n, Currency as t };

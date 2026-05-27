import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { i as config, n as ScopeModuleASsrhmr, r as MonkeySys, t as init_src } from "./a-ssrhmr-Cn4xPaEH.js";
//#region node_modules/.pnpm/debounce@3.0.0/node_modules/debounce/index.js
function debounce(function_, wait = 100, options = {}) {
	if (typeof function_ !== "function") throw new TypeError(`Expected the first parameter to be a function, got \`${typeof function_}\`.`);
	if (wait < 0) throw new RangeError("`wait` must not be negative.");
	if (typeof options === "boolean") throw new TypeError("The `options` parameter must be an object, not a boolean. Use `{immediate: true}` instead.");
	const { immediate } = options;
	let storedContext;
	let storedArguments;
	let timeoutId;
	let timestamp;
	let result;
	function run() {
		const callContext = storedContext;
		const callArguments = storedArguments;
		storedContext = void 0;
		storedArguments = void 0;
		result = function_.apply(callContext, callArguments);
		return result;
	}
	function later() {
		const last = Date.now() - timestamp;
		if (last < wait && last >= 0) timeoutId = setTimeout(later, wait - last);
		else {
			timeoutId = void 0;
			if (!immediate) result = run();
		}
	}
	const debounced = function(...arguments_) {
		if (storedContext && this !== storedContext && Object.getPrototypeOf(this) === Object.getPrototypeOf(storedContext)) throw new Error("Debounced method called with different contexts of the same prototype.");
		storedContext = this;
		storedArguments = arguments_;
		timestamp = Date.now();
		const callNow = immediate && !timeoutId;
		if (!timeoutId) timeoutId = setTimeout(later, wait);
		if (callNow) {
			result = run();
			return result;
		}
	};
	Object.defineProperty(debounced, "isPending", { get() {
		return timeoutId !== void 0;
	} });
	debounced.clear = () => {
		if (!timeoutId) return;
		clearTimeout(timeoutId);
		timeoutId = void 0;
		storedContext = void 0;
		storedArguments = void 0;
	};
	debounced.flush = () => {
		if (!timeoutId) return;
		debounced.trigger();
	};
	debounced.trigger = () => {
		result = run();
		debounced.clear();
	};
	return debounced;
}
var init_debounce = __esmMin((() => {}));
//#endregion
init_src();
export { MonkeySys, ScopeModuleASsrhmr, config, init_debounce as n, debounce as t };

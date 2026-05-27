import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { T as unref, c as isRef, h as ref, y as shallowRef } from "./vue-CeNp4lbs.js";
import { A as watchEffect, d as defineComponent, k as watch, p as h } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2 } from "./fecha-DmopMB3M.js";
import { i as init_lib$1, n as createTable } from "./tanstack-table-F1fQXKo6.js";
//#region node_modules/.pnpm/@tanstack+vue-table@8.21.3_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-table/build/lib/index.mjs
/**
* vue-table
*
* Copyright (c) TanStack
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
function trueFn() {
	return true;
}
function resolveSource(s) {
	return "value" in s ? s.value : s;
}
function mergeProxy() {
	for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) sources[_key] = arguments[_key];
	return new Proxy({
		get(property) {
			for (let i = sources.length - 1; i >= 0; i--) {
				const v = resolveSource(sources[i])[property];
				if (v !== void 0) return v;
			}
		},
		has(property) {
			for (let i = sources.length - 1; i >= 0; i--) if (property in resolveSource(sources[i])) return true;
			return false;
		},
		keys() {
			const keys = [];
			for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
			return [...Array.from(new Set(keys))];
		}
	}, propTraps);
}
function getOptionsWithReactiveData(options) {
	return mergeProxy(options, { data: unref(options.data) });
}
function useVueTable(initialOptions) {
	const IS_REACTIVE = isRef(initialOptions.data);
	const table = createTable(mergeProxy({
		state: {},
		onStateChange: () => {},
		renderFallbackValue: null,
		mergeOptions(defaultOptions, options) {
			return IS_REACTIVE ? _objectSpread2(_objectSpread2({}, defaultOptions), options) : mergeProxy(defaultOptions, options);
		}
	}, IS_REACTIVE ? getOptionsWithReactiveData(initialOptions) : initialOptions));
	if (IS_REACTIVE) {
		const dataRef = shallowRef(initialOptions.data);
		watch(dataRef, () => {
			table.setState((prev) => _objectSpread2(_objectSpread2({}, prev), {}, { data: dataRef.value }));
		}, { immediate: true });
	}
	const state = ref(table.initialState);
	watchEffect(() => {
		table.setOptions((prev) => {
			var _initialOptions$state;
			const stateProxy = new Proxy({}, { get: (_, prop) => state.value[prop] });
			return mergeProxy(prev, IS_REACTIVE ? getOptionsWithReactiveData(initialOptions) : initialOptions, {
				state: mergeProxy(stateProxy, (_initialOptions$state = initialOptions.state) != null ? _initialOptions$state : {}),
				onStateChange: (updater) => {
					if (updater instanceof Function) state.value = updater(state.value);
					else state.value = updater;
					initialOptions.onStateChange == null || initialOptions.onStateChange(updater);
				}
			});
		});
	});
	return table;
}
var $PROXY, propTraps, FlexRender;
var init_lib = __esmMin((() => {
	init_lib$1();
	init_objectSpread2();
	init_lib$1();
	init_vue_runtime_esm_bundler();
	$PROXY = Symbol("merge-proxy");
	propTraps = {
		get(_, property, receiver) {
			if (property === $PROXY) return receiver;
			return _.get(property);
		},
		has(_, property) {
			return _.has(property);
		},
		set: trueFn,
		deleteProperty: trueFn,
		getOwnPropertyDescriptor(_, property) {
			return {
				configurable: true,
				enumerable: true,
				get() {
					return _.get(property);
				},
				set: trueFn,
				deleteProperty: trueFn
			};
		},
		ownKeys(_) {
			return _.keys();
		}
	};
	FlexRender = defineComponent({
		props: ["render", "props"],
		setup: (props) => {
			return () => {
				if (typeof props.render === "function" || typeof props.render === "object") return h(props.render, props.props);
				return props.render;
			};
		}
	});
}));
//#endregion
export { init_lib as n, useVueTable as r, FlexRender as t };

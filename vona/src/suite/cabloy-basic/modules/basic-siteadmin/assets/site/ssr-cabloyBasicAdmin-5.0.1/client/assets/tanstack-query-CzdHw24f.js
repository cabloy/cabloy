import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { S as toRefs, T as unref, _ as shallowReactive, c as isRef, h as ref, m as readonly, p as reactive, u as onScopeDispose, v as shallowReadonly } from "./vue-CeNp4lbs.js";
import { g as inject, k as watch, m as hasInjectionContext, o as computed, y as nextTick } from "./vue-t5FcxkD3.js";
import { d as _objectSpread2, f as init_objectSpread2 } from "./fecha-DmopMB3M.js";
import { a as init_lib } from "./extends-CqKXG2OF.js";
import { a as MutationCache$1, d as isServer, i as MutationObserver, m as shouldThrowError, n as QueryClient$1, o as QueryObserver, r as QueryCache$1, t as init_modern$1 } from "./tanstack-query-ChvwIT2C.js";
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/utils.js
function getClientKey(key) {
	return `${VUE_QUERY_CLIENT}${key ? `:${key}` : ""}`;
}
function updateState(state, update) {
	Object.keys(state).forEach((key) => {
		state[key] = update[key];
	});
}
function _cloneDeep(value, customize, currentKey = "", currentLevel = 0) {
	if (customize) {
		const result = customize(value, currentKey, currentLevel);
		if (result === void 0 && isRef(value)) return result;
		if (result !== void 0) return result;
	}
	if (Array.isArray(value)) return value.map((val, index) => _cloneDeep(val, customize, String(index), currentLevel + 1));
	if (typeof value === "object" && isPlainObject(value)) {
		const entries = Object.entries(value).map(([key, val]) => [key, _cloneDeep(val, customize, key, currentLevel + 1)]);
		return Object.fromEntries(entries);
	}
	return value;
}
function cloneDeep(value, customize) {
	return _cloneDeep(value, customize);
}
function cloneDeepUnref(obj, unrefGetters = false) {
	return cloneDeep(obj, (val, key, level) => {
		if (level === 1 && key === "queryKey") return cloneDeepUnref(val, true);
		if (unrefGetters && isFunction(val)) return cloneDeepUnref(val(), unrefGetters);
		if (isRef(val)) return cloneDeepUnref(unref(val), unrefGetters);
	});
}
function isPlainObject(value) {
	if (Object.prototype.toString.call(value) !== "[object Object]") return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
function isFunction(value) {
	return typeof value === "function";
}
var VUE_QUERY_CLIENT;
var init_utils = __esmMin((() => {
	init_lib();
	VUE_QUERY_CLIENT = "VUE_QUERY_CLIENT";
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/useQueryClient.js
function useQueryClient(id = "") {
	if (!hasInjectionContext()) throw new Error("vue-query hooks can only be used inside setup() function or functions that support injection context.");
	const queryClient = inject(getClientKey(id));
	if (!queryClient) throw new Error("No 'queryClient' found in Vue context, use 'VueQueryPlugin' to properly initialize the library.");
	return queryClient;
}
var init_useQueryClient = __esmMin((() => {
	init_lib();
	init_utils();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/queryCache.js
var QueryCache;
var init_queryCache = __esmMin((() => {
	init_modern$1();
	init_utils();
	QueryCache = class extends QueryCache$1 {
		find(filters) {
			return super.find(cloneDeepUnref(filters));
		}
		findAll(filters = {}) {
			return super.findAll(cloneDeepUnref(filters));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/mutationCache.js
var MutationCache;
var init_mutationCache = __esmMin((() => {
	init_modern$1();
	init_utils();
	MutationCache = class extends MutationCache$1 {
		find(filters) {
			return super.find(cloneDeepUnref(filters));
		}
		findAll(filters = {}) {
			return super.findAll(cloneDeepUnref(filters));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/queryClient.js
var QueryClient;
var init_queryClient = __esmMin((() => {
	init_lib();
	init_modern$1();
	init_utils();
	init_queryCache();
	init_mutationCache();
	init_objectSpread2();
	QueryClient = class extends QueryClient$1 {
		constructor(config = {}) {
			const vueQueryConfig = {
				defaultOptions: config.defaultOptions,
				queryCache: config.queryCache || new QueryCache(),
				mutationCache: config.mutationCache || new MutationCache()
			};
			super(vueQueryConfig);
			this.isRestoring = ref(false);
		}
		isFetching(filters = {}) {
			return super.isFetching(cloneDeepUnref(filters));
		}
		isMutating(filters = {}) {
			return super.isMutating(cloneDeepUnref(filters));
		}
		getQueryData(queryKey) {
			return super.getQueryData(cloneDeepUnref(queryKey));
		}
		ensureQueryData(options) {
			return super.ensureQueryData(cloneDeepUnref(options));
		}
		getQueriesData(filters) {
			return super.getQueriesData(cloneDeepUnref(filters));
		}
		setQueryData(queryKey, updater, options = {}) {
			return super.setQueryData(cloneDeepUnref(queryKey), updater, cloneDeepUnref(options));
		}
		setQueriesData(filters, updater, options = {}) {
			return super.setQueriesData(cloneDeepUnref(filters), updater, cloneDeepUnref(options));
		}
		getQueryState(queryKey) {
			return super.getQueryState(cloneDeepUnref(queryKey));
		}
		removeQueries(filters = {}) {
			return super.removeQueries(cloneDeepUnref(filters));
		}
		resetQueries(filters = {}, options = {}) {
			return super.resetQueries(cloneDeepUnref(filters), cloneDeepUnref(options));
		}
		cancelQueries(filters = {}, options = {}) {
			return super.cancelQueries(cloneDeepUnref(filters), cloneDeepUnref(options));
		}
		invalidateQueries(filters = {}, options = {}) {
			var _ref, _filtersCloned$refetc;
			const filtersCloned = cloneDeepUnref(filters);
			const optionsCloned = cloneDeepUnref(options);
			super.invalidateQueries(_objectSpread2(_objectSpread2({}, filtersCloned), {}, { refetchType: "none" }), optionsCloned);
			if (filtersCloned.refetchType === "none") return Promise.resolve();
			const refetchFilters = _objectSpread2(_objectSpread2({}, filtersCloned), {}, { type: (_ref = (_filtersCloned$refetc = filtersCloned.refetchType) !== null && _filtersCloned$refetc !== void 0 ? _filtersCloned$refetc : filtersCloned.type) !== null && _ref !== void 0 ? _ref : "active" });
			return nextTick().then(() => {
				return super.refetchQueries(refetchFilters, optionsCloned);
			});
		}
		refetchQueries(filters = {}, options = {}) {
			return super.refetchQueries(cloneDeepUnref(filters), cloneDeepUnref(options));
		}
		fetchQuery(options) {
			return super.fetchQuery(cloneDeepUnref(options));
		}
		prefetchQuery(options) {
			return super.prefetchQuery(cloneDeepUnref(options));
		}
		fetchInfiniteQuery(options) {
			return super.fetchInfiniteQuery(cloneDeepUnref(options));
		}
		prefetchInfiniteQuery(options) {
			return super.prefetchInfiniteQuery(cloneDeepUnref(options));
		}
		setDefaultOptions(options) {
			super.setDefaultOptions(cloneDeepUnref(options));
		}
		setQueryDefaults(queryKey, options) {
			super.setQueryDefaults(cloneDeepUnref(queryKey), cloneDeepUnref(options));
		}
		getQueryDefaults(queryKey) {
			return super.getQueryDefaults(cloneDeepUnref(queryKey));
		}
		setMutationDefaults(mutationKey, options) {
			super.setMutationDefaults(cloneDeepUnref(mutationKey), cloneDeepUnref(options));
		}
		getMutationDefaults(mutationKey) {
			return super.getMutationDefaults(cloneDeepUnref(mutationKey));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/vueQueryPlugin.js
var VueQueryPlugin;
var init_vueQueryPlugin = __esmMin((() => {
	init_lib();
	init_modern$1();
	init_queryClient();
	init_utils();
	VueQueryPlugin = { install: (app, options = {}) => {
		const clientKey = getClientKey(options.queryClientKey);
		let client;
		if ("queryClient" in options && options.queryClient) client = options.queryClient;
		else client = new QueryClient("queryClientConfig" in options ? options.queryClientConfig : void 0);
		if (!isServer) client.mount();
		let persisterUnmount = () => {};
		if (options.clientPersister) {
			if (client.isRestoring) client.isRestoring.value = true;
			const [unmount, promise] = options.clientPersister(client);
			persisterUnmount = unmount;
			promise.then(() => {
				var _options$clientPersis;
				if (client.isRestoring) client.isRestoring.value = false;
				(_options$clientPersis = options.clientPersisterOnSuccess) === null || _options$clientPersis === void 0 || _options$clientPersis.call(options, client);
			});
		}
		const cleanup = () => {
			client.unmount();
			persisterUnmount();
		};
		if (app.onUnmount) app.onUnmount(cleanup);
		else {
			const originalUnmount = app.unmount;
			app.unmount = function vueQueryUnmount() {
				cleanup();
				originalUnmount();
			};
		}
		app.provide(clientKey, client);
	} };
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/useBaseQuery.js
function useBaseQuery(Observer, options, queryClient) {
	const client = queryClient || useQueryClient();
	const defaultedOptions = computed(() => {
		var _client$isRestoring;
		let resolvedOptions = options;
		if (typeof resolvedOptions === "function") resolvedOptions = resolvedOptions();
		const clonedOptions = cloneDeepUnref(resolvedOptions);
		if (typeof clonedOptions.enabled === "function") clonedOptions.enabled = clonedOptions.enabled();
		const defaulted = client.defaultQueryOptions(clonedOptions);
		defaulted._optimisticResults = ((_client$isRestoring = client.isRestoring) === null || _client$isRestoring === void 0 ? void 0 : _client$isRestoring.value) ? "isRestoring" : "optimistic";
		return defaulted;
	});
	const observer = new Observer(client, defaultedOptions.value);
	const state = defaultedOptions.value.shallow ? shallowReactive(observer.getCurrentResult()) : reactive(observer.getCurrentResult());
	let unsubscribe = () => {};
	if (client.isRestoring) watch(client.isRestoring, (isRestoring) => {
		if (!isRestoring) {
			unsubscribe();
			unsubscribe = observer.subscribe((result) => {
				updateState(state, result);
			});
		}
	}, { immediate: true });
	const updater = () => {
		observer.setOptions(defaultedOptions.value);
		updateState(state, observer.getCurrentResult());
	};
	watch(defaultedOptions, updater);
	onScopeDispose(() => {
		unsubscribe();
	});
	const refetch = (...args) => {
		updater();
		return state.refetch(...args);
	};
	const suspense = () => {
		return new Promise((resolve, reject) => {
			let stopWatch = () => {};
			const run = () => {
				if (defaultedOptions.value.enabled !== false) {
					observer.setOptions(defaultedOptions.value);
					const optimisticResult = observer.getOptimisticResult(defaultedOptions.value);
					if (optimisticResult.isStale) {
						stopWatch();
						observer.fetchOptimistic(defaultedOptions.value).then(resolve, (error) => {
							if (shouldThrowError(defaultedOptions.value.throwOnError, [error, observer.getCurrentQuery()])) reject(error);
							else resolve(observer.getCurrentResult());
						});
					} else {
						stopWatch();
						resolve(optimisticResult);
					}
				}
			};
			run();
			stopWatch = watch(defaultedOptions, run);
		});
	};
	watch(() => state.error, (error) => {
		if (state.isError && !state.isFetching && shouldThrowError(defaultedOptions.value.throwOnError, [error, observer.getCurrentQuery()])) throw error;
	});
	const object = toRefs(defaultedOptions.value.shallow ? shallowReadonly(state) : readonly(state));
	for (const key in state) if (typeof state[key] === "function") object[key] = state[key];
	object.suspense = suspense;
	object.refetch = refetch;
	return object;
}
var init_useBaseQuery = __esmMin((() => {
	init_lib();
	init_modern$1();
	init_useQueryClient();
	init_utils();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/useQuery.js
function useQuery(options, queryClient) {
	return useBaseQuery(QueryObserver, options, queryClient);
}
var init_useQuery = __esmMin((() => {
	init_modern$1();
	init_useBaseQuery();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/useMutation.js
function useMutation(mutationOptions, queryClient) {
	const client = queryClient || useQueryClient();
	const options = computed(() => {
		const resolvedOptions = typeof mutationOptions === "function" ? mutationOptions() : mutationOptions;
		return client.defaultMutationOptions(cloneDeepUnref(resolvedOptions));
	});
	const observer = new MutationObserver(client, options.value);
	const state = options.value.shallow ? shallowReactive(observer.getCurrentResult()) : reactive(observer.getCurrentResult());
	const unsubscribe = observer.subscribe((result) => {
		updateState(state, result);
	});
	const mutate = (variables, mutateOptions) => {
		observer.mutate(variables, mutateOptions).catch(() => {});
	};
	watch(options, () => {
		observer.setOptions(options.value);
	});
	onScopeDispose(() => {
		unsubscribe();
	});
	const resultRefs = toRefs(options.value.shallow ? shallowReadonly(state) : readonly(state));
	watch(() => state.error, (error) => {
		if (error && shouldThrowError(options.value.throwOnError, [error])) throw error;
	});
	return _objectSpread2(_objectSpread2({}, resultRefs), {}, {
		mutate,
		mutateAsync: state.mutate,
		reset: state.reset
	});
}
var init_useMutation = __esmMin((() => {
	init_lib();
	init_modern$1();
	init_utils();
	init_useQueryClient();
	init_objectSpread2();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+vue-query@5.100.10_vue@3.5.34_typescript@5.9.3_/node_modules/@tanstack/vue-query/build/modern/index.js
var init_modern = __esmMin((() => {
	init_modern$1();
	init_useQueryClient();
	init_vueQueryPlugin();
	init_queryClient();
	init_queryCache();
	init_useQuery();
	init_useMutation();
}));
//#endregion
export { QueryClient as a, VueQueryPlugin as i, useMutation as n, QueryCache as o, useQuery as r, useQueryClient as s, init_modern as t };

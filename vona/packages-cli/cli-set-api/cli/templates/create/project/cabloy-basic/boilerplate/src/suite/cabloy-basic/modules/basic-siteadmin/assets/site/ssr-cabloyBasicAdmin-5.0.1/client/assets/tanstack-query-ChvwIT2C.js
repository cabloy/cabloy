import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { C as _classPrivateFieldSet2, D as _classPrivateFieldInitSpec, E as init_assertClassBrand, O as init_classPrivateFieldInitSpec, S as init_classPrivateFieldGet2, T as _assertClassBrand, b as init_classPrivateMethodInitSpec, d as _objectSpread2, f as init_objectSpread2, i as init_objectWithoutProperties, m as init_asyncToGenerator, p as _asyncToGenerator, r as _objectWithoutProperties, w as init_classPrivateFieldSet2, x as _classPrivateFieldGet2, y as _classPrivateMethodInitSpec } from "./fecha-DmopMB3M.js";
import { i as init_objectDestructuringEmpty, n as init_extends, r as _objectDestructuringEmpty, t as _extends } from "./extends-CqKXG2OF.js";
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/subscribable.js
var Subscribable;
var init_subscribable = __esmMin((() => {
	Subscribable = class {
		constructor() {
			this.listeners = /* @__PURE__ */ new Set();
			this.subscribe = this.subscribe.bind(this);
		}
		subscribe(listener) {
			this.listeners.add(listener);
			this.onSubscribe();
			return () => {
				this.listeners.delete(listener);
				this.onUnsubscribe();
			};
		}
		hasListeners() {
			return this.listeners.size > 0;
		}
		onSubscribe() {}
		onUnsubscribe() {}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/focusManager.js
var _focused, _cleanup$1, _setup$1, FocusManager, focusManager;
var init_focusManager = __esmMin((() => {
	init_subscribable();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	FocusManager = (_focused = /* @__PURE__ */ new WeakMap(), _cleanup$1 = /* @__PURE__ */ new WeakMap(), _setup$1 = /* @__PURE__ */ new WeakMap(), class extends Subscribable {
		constructor() {
			super();
			_classPrivateFieldInitSpec(this, _focused, void 0);
			_classPrivateFieldInitSpec(this, _cleanup$1, void 0);
			_classPrivateFieldInitSpec(this, _setup$1, void 0);
			_classPrivateFieldSet2(_setup$1, this, (onFocus) => {
				if (typeof window !== "undefined" && window.addEventListener) {
					const listener = () => onFocus();
					window.addEventListener("visibilitychange", listener, false);
					return () => {
						window.removeEventListener("visibilitychange", listener);
					};
				}
			});
		}
		onSubscribe() {
			if (!_classPrivateFieldGet2(_cleanup$1, this)) this.setEventListener(_classPrivateFieldGet2(_setup$1, this));
		}
		onUnsubscribe() {
			if (!this.hasListeners()) {
				var _classPrivateFieldGet2$8;
				(_classPrivateFieldGet2$8 = _classPrivateFieldGet2(_cleanup$1, this)) === null || _classPrivateFieldGet2$8 === void 0 || _classPrivateFieldGet2$8.call(this);
				_classPrivateFieldSet2(_cleanup$1, this, void 0);
			}
		}
		setEventListener(setup) {
			var _classPrivateFieldGet3;
			_classPrivateFieldSet2(_setup$1, this, setup);
			(_classPrivateFieldGet3 = _classPrivateFieldGet2(_cleanup$1, this)) === null || _classPrivateFieldGet3 === void 0 || _classPrivateFieldGet3.call(this);
			_classPrivateFieldSet2(_cleanup$1, this, setup((focused) => {
				if (typeof focused === "boolean") this.setFocused(focused);
				else this.onFocus();
			}));
		}
		setFocused(focused) {
			if (_classPrivateFieldGet2(_focused, this) !== focused) {
				_classPrivateFieldSet2(_focused, this, focused);
				this.onFocus();
			}
		}
		onFocus() {
			const isFocused = this.isFocused();
			this.listeners.forEach((listener) => {
				listener(isFocused);
			});
		}
		isFocused() {
			var _globalThis$document;
			if (typeof _classPrivateFieldGet2(_focused, this) === "boolean") return _classPrivateFieldGet2(_focused, this);
			return ((_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.visibilityState) !== "hidden";
		}
	});
	focusManager = new FocusManager();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/timeoutManager.js
function systemSetTimeoutZero(callback) {
	setTimeout(callback, 0);
}
var _provider, _providerCalled, defaultTimeoutProvider, TimeoutManager, timeoutManager;
var init_timeoutManager = __esmMin((() => {
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldGet2();
	init_classPrivateFieldSet2();
	defaultTimeoutProvider = {
		setTimeout: (callback, delay) => setTimeout(callback, delay),
		clearTimeout: (timeoutId) => clearTimeout(timeoutId),
		setInterval: (callback, delay) => setInterval(callback, delay),
		clearInterval: (intervalId) => clearInterval(intervalId)
	};
	TimeoutManager = (_provider = /* @__PURE__ */ new WeakMap(), _providerCalled = /* @__PURE__ */ new WeakMap(), class {
		constructor() {
			_classPrivateFieldInitSpec(this, _provider, defaultTimeoutProvider);
			_classPrivateFieldInitSpec(this, _providerCalled, false);
		}
		setTimeoutProvider(provider) {
			_classPrivateFieldSet2(_provider, this, provider);
		}
		setTimeout(callback, delay) {
			return _classPrivateFieldGet2(_provider, this).setTimeout(callback, delay);
		}
		clearTimeout(timeoutId) {
			_classPrivateFieldGet2(_provider, this).clearTimeout(timeoutId);
		}
		setInterval(callback, delay) {
			return _classPrivateFieldGet2(_provider, this).setInterval(callback, delay);
		}
		clearInterval(intervalId) {
			_classPrivateFieldGet2(_provider, this).clearInterval(intervalId);
		}
	});
	timeoutManager = new TimeoutManager();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/utils.js
function noop() {}
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
	return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
	return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
	return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
	return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
	const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
	if (queryKey) {
		if (exact) {
			if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
		} else if (!partialMatchKey(query.queryKey, queryKey)) return false;
	}
	if (type !== "all") {
		const isActive = query.isActive();
		if (type === "active" && !isActive) return false;
		if (type === "inactive" && isActive) return false;
	}
	if (typeof stale === "boolean" && query.isStale() !== stale) return false;
	if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
	if (predicate && !predicate(query)) return false;
	return true;
}
function matchMutation(filters, mutation) {
	const { exact, status, predicate, mutationKey } = filters;
	if (mutationKey) {
		if (!mutation.options.mutationKey) return false;
		if (exact) {
			if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
		} else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
	}
	if (status && mutation.state.status !== status) return false;
	if (predicate && !predicate(mutation)) return false;
	return true;
}
function hashQueryKeyByOptions(queryKey, options) {
	return ((options === null || options === void 0 ? void 0 : options.queryKeyHashFn) || hashKey)(queryKey);
}
function hashKey(queryKey) {
	return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function partialMatchKey(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a && b && typeof a === "object" && typeof b === "object") return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
	return false;
}
function replaceEqualDeep(a, b, depth = 0) {
	if (a === b) return a;
	if (depth > 500) return b;
	const array = isPlainArray(a) && isPlainArray(b);
	if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
	const aSize = (array ? a : Object.keys(a)).length;
	const bItems = array ? b : Object.keys(b);
	const bSize = bItems.length;
	const copy = array ? new Array(bSize) : {};
	let equalItems = 0;
	for (let i = 0; i < bSize; i++) {
		const key = array ? i : bItems[i];
		const aItem = a[key];
		const bItem = b[key];
		if (aItem === bItem) {
			copy[key] = aItem;
			if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
			continue;
		}
		if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
			copy[key] = bItem;
			continue;
		}
		const v = replaceEqualDeep(aItem, bItem, depth + 1);
		copy[key] = v;
		if (v === aItem) equalItems++;
	}
	return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
	if (!b || Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (a[key] !== b[key]) return false;
	return true;
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	if (Object.getPrototypeOf(o) !== Object.prototype) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
	return new Promise((resolve) => {
		timeoutManager.setTimeout(resolve, timeout);
	});
}
function replaceData(prevData, data, options) {
	if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
	else if (options.structuralSharing !== false) return replaceEqualDeep(prevData, data);
	return data;
}
function addToEnd(items, item, max = 0) {
	const newItems = [...items, item];
	return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
	const newItems = [item, ...items];
	return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
function ensureQueryFn(options, fetchOptions) {
	if (!options.queryFn && (fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.initialPromise)) return () => fetchOptions.initialPromise;
	if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
	return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
	if (typeof throwOnError === "function") return throwOnError(...params);
	return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
	let consumed = false;
	let signal;
	Object.defineProperty(object, "signal", {
		enumerable: true,
		get: () => {
			var _signal;
			(_signal = signal) !== null && _signal !== void 0 || (signal = getSignal());
			if (consumed) return signal;
			consumed = true;
			if (signal.aborted) onCancelled();
			else signal.addEventListener("abort", onCancelled, { once: true });
			return signal;
		}
	});
	return object;
}
var isServer, hasOwn, skipToken;
var init_utils = __esmMin((() => {
	init_timeoutManager();
	isServer = typeof window === "undefined" || "Deno" in globalThis;
	hasOwn = Object.prototype.hasOwnProperty;
	skipToken = /* @__PURE__ */ Symbol();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/environmentManager.js
var environmentManager;
var init_environmentManager = __esmMin((() => {
	init_utils();
	environmentManager = /* @__PURE__ */ (() => {
		let isServerFn = () => isServer;
		return {
			/**
			* Returns whether the current runtime should be treated as a server environment.
			*/
			isServer() {
				return isServerFn();
			},
			/**
			* Overrides the server check globally.
			*/
			setIsServer(isServerValue) {
				isServerFn = isServerValue;
			}
		};
	})();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/thenable.js
function pendingThenable() {
	let resolve;
	let reject;
	const thenable = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	thenable.status = "pending";
	thenable.catch(() => {});
	function finalize(data) {
		Object.assign(thenable, data);
		delete thenable.resolve;
		delete thenable.reject;
	}
	thenable.resolve = (value) => {
		finalize({
			status: "fulfilled",
			value
		});
		resolve(value);
	};
	thenable.reject = (reason) => {
		finalize({
			status: "rejected",
			reason
		});
		reject(reason);
	};
	return thenable;
}
function tryResolveSync(promise) {
	var _promise$then;
	let data;
	(_promise$then = promise.then((result) => {
		data = result;
		return result;
	}, noop)) === null || _promise$then === void 0 || _promise$then.catch(noop);
	if (data !== void 0) return { data };
}
var init_thenable = __esmMin((() => {
	init_utils();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/hydration.js
function defaultTransformerFn(data) {
	return data;
}
function defaultShouldDehydrateQuery(query) {
	return query.state.status === "success";
}
function hydrate(client, dehydratedState, options) {
	var _ref5, _options$defaultOptio, _options$defaultOptio2, _client$getDefaultOpt5;
	if (typeof dehydratedState !== "object" || dehydratedState === null) return;
	const mutationCache = client.getMutationCache();
	const queryCache = client.getQueryCache();
	const deserializeData = (_ref5 = (_options$defaultOptio = options === null || options === void 0 || (_options$defaultOptio2 = options.defaultOptions) === null || _options$defaultOptio2 === void 0 ? void 0 : _options$defaultOptio2.deserializeData) !== null && _options$defaultOptio !== void 0 ? _options$defaultOptio : (_client$getDefaultOpt5 = client.getDefaultOptions().hydrate) === null || _client$getDefaultOpt5 === void 0 ? void 0 : _client$getDefaultOpt5.deserializeData) !== null && _ref5 !== void 0 ? _ref5 : defaultTransformerFn;
	const mutations = dehydratedState.mutations || [];
	const queries = dehydratedState.queries || [];
	mutations.forEach((_ref6) => {
		var _client$getDefaultOpt6, _options$defaultOptio3;
		let { state } = _ref6, mutationOptions = _objectWithoutProperties(_ref6, _excluded);
		mutationCache.build(client, _objectSpread2(_objectSpread2(_objectSpread2({}, (_client$getDefaultOpt6 = client.getDefaultOptions().hydrate) === null || _client$getDefaultOpt6 === void 0 ? void 0 : _client$getDefaultOpt6.mutations), options === null || options === void 0 || (_options$defaultOptio3 = options.defaultOptions) === null || _options$defaultOptio3 === void 0 ? void 0 : _options$defaultOptio3.mutations), mutationOptions), state);
	});
	queries.forEach(({ queryKey, state, queryHash, meta, promise, dehydratedAt, queryType }) => {
		const syncData = promise ? tryResolveSync(promise) : void 0;
		const rawData = state.data === void 0 ? syncData === null || syncData === void 0 ? void 0 : syncData.data : state.data;
		const data = rawData === void 0 ? rawData : deserializeData(rawData);
		let query = queryCache.get(queryHash);
		const existingQueryIsPending = (query === null || query === void 0 ? void 0 : query.state.status) === "pending";
		const existingQueryIsFetching = (query === null || query === void 0 ? void 0 : query.state.fetchStatus) === "fetching";
		if (query) {
			const hasNewerSyncData = syncData && dehydratedAt !== void 0 && dehydratedAt > query.state.dataUpdatedAt;
			if (state.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
				const { fetchStatus: _ignored } = state, serializedState = _objectWithoutProperties(state, _excluded2);
				query.setState(_objectSpread2(_objectSpread2({}, serializedState), {}, { data }, state.status === "pending" && data !== void 0 && _objectSpread2({ status: "success" }, !existingQueryIsFetching && { fetchStatus: "idle" })));
			}
		} else {
			var _client$getDefaultOpt7, _options$defaultOptio4;
			query = queryCache.build(client, _objectSpread2(_objectSpread2(_objectSpread2({}, (_client$getDefaultOpt7 = client.getDefaultOptions().hydrate) === null || _client$getDefaultOpt7 === void 0 ? void 0 : _client$getDefaultOpt7.queries), options === null || options === void 0 || (_options$defaultOptio4 = options.defaultOptions) === null || _options$defaultOptio4 === void 0 ? void 0 : _options$defaultOptio4.queries), {}, {
				queryKey,
				queryHash,
				meta,
				_type: queryType
			}), _objectSpread2(_objectSpread2({}, state), {}, {
				data,
				fetchStatus: "idle",
				status: state.status === "pending" && data !== void 0 ? "success" : state.status
			}));
		}
		if (promise && !syncData && !existingQueryIsPending && !existingQueryIsFetching && (dehydratedAt === void 0 || dehydratedAt > query.state.dataUpdatedAt)) query.fetch(void 0, { initialPromise: Promise.resolve(promise).then(deserializeData) }).catch(noop);
	});
}
var _excluded, _excluded2;
var init_hydration = __esmMin((() => {
	init_thenable();
	init_utils();
	init_objectSpread2();
	init_objectWithoutProperties();
	_excluded = ["state"], _excluded2 = ["fetchStatus"];
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/notifyManager.js
function createNotifyManager() {
	let queue = [];
	let transactions = 0;
	let notifyFn = (callback) => {
		callback();
	};
	let batchNotifyFn = (callback) => {
		callback();
	};
	let scheduleFn = defaultScheduler;
	const schedule = (callback) => {
		if (transactions) queue.push(callback);
		else scheduleFn(() => {
			notifyFn(callback);
		});
	};
	const flush = () => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) scheduleFn(() => {
			batchNotifyFn(() => {
				originalQueue.forEach((callback) => {
					notifyFn(callback);
				});
			});
		});
	};
	return {
		batch: (callback) => {
			let result;
			transactions++;
			try {
				result = callback();
			} finally {
				transactions--;
				if (!transactions) flush();
			}
			return result;
		},
		/**
		* All calls to the wrapped function will be batched.
		*/
		batchCalls: (callback) => {
			return (...args) => {
				schedule(() => {
					callback(...args);
				});
			};
		},
		schedule,
		/**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/
		setNotifyFunction: (fn) => {
			notifyFn = fn;
		},
		/**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* By default React Query will use the batch function provided by ReactDOM or React Native.
		*/
		setBatchNotifyFunction: (fn) => {
			batchNotifyFn = fn;
		},
		setScheduler: (fn) => {
			scheduleFn = fn;
		}
	};
}
var defaultScheduler, notifyManager;
var init_notifyManager = __esmMin((() => {
	init_timeoutManager();
	defaultScheduler = systemSetTimeoutZero;
	notifyManager = createNotifyManager();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/onlineManager.js
var _online, _cleanup, _setup, OnlineManager, onlineManager;
var init_onlineManager = __esmMin((() => {
	init_subscribable();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	OnlineManager = (_online = /* @__PURE__ */ new WeakMap(), _cleanup = /* @__PURE__ */ new WeakMap(), _setup = /* @__PURE__ */ new WeakMap(), class extends Subscribable {
		constructor() {
			super();
			_classPrivateFieldInitSpec(this, _online, true);
			_classPrivateFieldInitSpec(this, _cleanup, void 0);
			_classPrivateFieldInitSpec(this, _setup, void 0);
			_classPrivateFieldSet2(_setup, this, (onOnline) => {
				if (typeof window !== "undefined" && window.addEventListener) {
					const onlineListener = () => onOnline(true);
					const offlineListener = () => onOnline(false);
					window.addEventListener("online", onlineListener, false);
					window.addEventListener("offline", offlineListener, false);
					return () => {
						window.removeEventListener("online", onlineListener);
						window.removeEventListener("offline", offlineListener);
					};
				}
			});
		}
		onSubscribe() {
			if (!_classPrivateFieldGet2(_cleanup, this)) this.setEventListener(_classPrivateFieldGet2(_setup, this));
		}
		onUnsubscribe() {
			if (!this.hasListeners()) {
				var _classPrivateFieldGet2$7;
				(_classPrivateFieldGet2$7 = _classPrivateFieldGet2(_cleanup, this)) === null || _classPrivateFieldGet2$7 === void 0 || _classPrivateFieldGet2$7.call(this);
				_classPrivateFieldSet2(_cleanup, this, void 0);
			}
		}
		setEventListener(setup) {
			var _classPrivateFieldGet3;
			_classPrivateFieldSet2(_setup, this, setup);
			(_classPrivateFieldGet3 = _classPrivateFieldGet2(_cleanup, this)) === null || _classPrivateFieldGet3 === void 0 || _classPrivateFieldGet3.call(this);
			_classPrivateFieldSet2(_cleanup, this, setup(this.setOnline.bind(this)));
		}
		setOnline(online) {
			if (_classPrivateFieldGet2(_online, this) !== online) {
				_classPrivateFieldSet2(_online, this, online);
				this.listeners.forEach((listener) => {
					listener(online);
				});
			}
		}
		isOnline() {
			return _classPrivateFieldGet2(_online, this);
		}
	});
	onlineManager = new OnlineManager();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/retryer.js
function defaultRetryDelay(failureCount) {
	return Math.min(1e3 * Math.pow(2, failureCount), 3e4);
}
function canFetch(networkMode) {
	return (networkMode !== null && networkMode !== void 0 ? networkMode : "online") === "online" ? onlineManager.isOnline() : true;
}
function createRetryer(config) {
	let isRetryCancelled = false;
	let failureCount = 0;
	let continueFn;
	const thenable = pendingThenable();
	const isResolved = () => thenable.status !== "pending";
	const cancel = (cancelOptions) => {
		if (!isResolved()) {
			var _config$onCancel;
			const error = new CancelledError(cancelOptions);
			reject(error);
			(_config$onCancel = config.onCancel) === null || _config$onCancel === void 0 || _config$onCancel.call(config, error);
		}
	};
	const cancelRetry = () => {
		isRetryCancelled = true;
	};
	const continueRetry = () => {
		isRetryCancelled = false;
	};
	const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
	const canStart = () => canFetch(config.networkMode) && config.canRun();
	const resolve = (value) => {
		if (!isResolved()) {
			continueFn === null || continueFn === void 0 || continueFn();
			thenable.resolve(value);
		}
	};
	const reject = (value) => {
		if (!isResolved()) {
			continueFn === null || continueFn === void 0 || continueFn();
			thenable.reject(value);
		}
	};
	const pause = () => {
		return new Promise((continueResolve) => {
			var _config$onPause;
			continueFn = (value) => {
				if (isResolved() || canContinue()) continueResolve(value);
			};
			(_config$onPause = config.onPause) === null || _config$onPause === void 0 || _config$onPause.call(config);
		}).then(() => {
			continueFn = void 0;
			if (!isResolved()) {
				var _config$onContinue;
				(_config$onContinue = config.onContinue) === null || _config$onContinue === void 0 || _config$onContinue.call(config);
			}
		});
	};
	const run = () => {
		if (isResolved()) return;
		let promiseOrValue;
		const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
		try {
			promiseOrValue = initialPromise !== null && initialPromise !== void 0 ? initialPromise : config.fn();
		} catch (error) {
			promiseOrValue = Promise.reject(error);
		}
		Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
			var _config$retry, _config$retryDelay, _config$onFail;
			if (isResolved()) return;
			const retry = (_config$retry = config.retry) !== null && _config$retry !== void 0 ? _config$retry : environmentManager.isServer() ? 0 : 3;
			const retryDelay = (_config$retryDelay = config.retryDelay) !== null && _config$retryDelay !== void 0 ? _config$retryDelay : defaultRetryDelay;
			const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
			const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
			if (isRetryCancelled || !shouldRetry) {
				reject(error);
				return;
			}
			failureCount++;
			(_config$onFail = config.onFail) === null || _config$onFail === void 0 || _config$onFail.call(config, failureCount, error);
			sleep(delay).then(() => {
				return canContinue() ? void 0 : pause();
			}).then(() => {
				if (isRetryCancelled) reject(error);
				else run();
			});
		});
	};
	return {
		promise: thenable,
		status: () => thenable.status,
		cancel,
		continue: () => {
			continueFn === null || continueFn === void 0 || continueFn();
			return thenable;
		},
		cancelRetry,
		continueRetry,
		canStart,
		start: () => {
			if (canStart()) run();
			else pause().then(run);
			return thenable;
		}
	};
}
var CancelledError;
var init_retryer = __esmMin((() => {
	init_focusManager();
	init_onlineManager();
	init_thenable();
	init_environmentManager();
	init_utils();
	CancelledError = class extends Error {
		constructor(options) {
			super("CancelledError");
			this.revert = options === null || options === void 0 ? void 0 : options.revert;
			this.silent = options === null || options === void 0 ? void 0 : options.silent;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/removable.js
var _gcTimeout, Removable;
var init_removable = __esmMin((() => {
	init_timeoutManager();
	init_environmentManager();
	init_utils();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	Removable = (_gcTimeout = /* @__PURE__ */ new WeakMap(), class {
		constructor() {
			_classPrivateFieldInitSpec(this, _gcTimeout, void 0);
		}
		destroy() {
			this.clearGcTimeout();
		}
		scheduleGc() {
			this.clearGcTimeout();
			if (isValidTimeout(this.gcTime)) _classPrivateFieldSet2(_gcTimeout, this, timeoutManager.setTimeout(() => {
				this.optionalRemove();
			}, this.gcTime));
		}
		updateGcTime(newGcTime) {
			this.gcTime = Math.max(this.gcTime || 0, newGcTime !== null && newGcTime !== void 0 ? newGcTime : environmentManager.isServer() ? Infinity : 300 * 1e3);
		}
		clearGcTimeout() {
			if (_classPrivateFieldGet2(_gcTimeout, this) !== void 0) {
				timeoutManager.clearTimeout(_classPrivateFieldGet2(_gcTimeout, this));
				_classPrivateFieldSet2(_gcTimeout, this, void 0);
			}
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
function infiniteQueryBehavior(pages) {
	return { onFetch: (context, query) => {
		var _context$fetchOptions, _context$state$data, _context$state$data2;
		const options = context.options;
		const direction = (_context$fetchOptions = context.fetchOptions) === null || _context$fetchOptions === void 0 || (_context$fetchOptions = _context$fetchOptions.meta) === null || _context$fetchOptions === void 0 || (_context$fetchOptions = _context$fetchOptions.fetchMore) === null || _context$fetchOptions === void 0 ? void 0 : _context$fetchOptions.direction;
		const oldPages = ((_context$state$data = context.state.data) === null || _context$state$data === void 0 ? void 0 : _context$state$data.pages) || [];
		const oldPageParams = ((_context$state$data2 = context.state.data) === null || _context$state$data2 === void 0 ? void 0 : _context$state$data2.pageParams) || [];
		let result = {
			pages: [],
			pageParams: []
		};
		let currentPage = 0;
		const fetchFn = function() {
			var _ref2 = _asyncToGenerator(function* () {
				let cancelled = false;
				const addSignalProperty = (object) => {
					addConsumeAwareSignal(object, () => context.signal, () => cancelled = true);
				};
				const queryFn = ensureQueryFn(context.options, context.fetchOptions);
				const fetchPage = function() {
					var _ref = _asyncToGenerator(function* (data, param, previous) {
						if (cancelled) return Promise.reject(context.signal.reason);
						if (param == null && data.pages.length) return Promise.resolve(data);
						const createQueryFnContext = () => {
							const queryFnContext2 = {
								client: context.client,
								queryKey: context.queryKey,
								pageParam: param,
								direction: previous ? "backward" : "forward",
								meta: context.options.meta
							};
							addSignalProperty(queryFnContext2);
							return queryFnContext2;
						};
						const page = yield queryFn(createQueryFnContext());
						const { maxPages } = context.options;
						const addTo = previous ? addToStart : addToEnd;
						return {
							pages: addTo(data.pages, page, maxPages),
							pageParams: addTo(data.pageParams, param, maxPages)
						};
					});
					return function fetchPage(_x, _x2, _x3) {
						return _ref.apply(this, arguments);
					};
				}();
				if (direction && oldPages.length) {
					const previous = direction === "backward";
					const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
					const oldData = {
						pages: oldPages,
						pageParams: oldPageParams
					};
					result = yield fetchPage(oldData, pageParamFn(options, oldData), previous);
				} else {
					const remainingPages = pages !== null && pages !== void 0 ? pages : oldPages.length;
					do {
						var _oldPageParams$;
						const param = currentPage === 0 ? (_oldPageParams$ = oldPageParams[0]) !== null && _oldPageParams$ !== void 0 ? _oldPageParams$ : options.initialPageParam : getNextPageParam(options, result);
						if (currentPage > 0 && param == null) break;
						result = yield fetchPage(result, param);
						currentPage++;
					} while (currentPage < remainingPages);
				}
				return result;
			});
			return function fetchFn() {
				return _ref2.apply(this, arguments);
			};
		}();
		if (context.options.persister) context.fetchFn = () => {
			var _context$options$pers, _context$options;
			return (_context$options$pers = (_context$options = context.options).persister) === null || _context$options$pers === void 0 ? void 0 : _context$options$pers.call(_context$options, fetchFn, {
				client: context.client,
				queryKey: context.queryKey,
				meta: context.options.meta,
				signal: context.signal
			}, query);
		};
		else context.fetchFn = fetchFn;
	} };
}
function getNextPageParam(options, { pages, pageParams }) {
	const lastIndex = pages.length - 1;
	return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
	var _options$getPreviousP;
	return pages.length > 0 ? (_options$getPreviousP = options.getPreviousPageParam) === null || _options$getPreviousP === void 0 ? void 0 : _options$getPreviousP.call(options, pages[0], pages, pageParams[0], pageParams) : void 0;
}
var init_infiniteQueryBehavior = __esmMin((() => {
	init_utils();
	init_asyncToGenerator();
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/query.js
function _isInitialPausedFetch() {
	return this.state.fetchStatus === "paused" && this.state.status === "pending";
}
function _dispatch$1(action) {
	const reducer = (state) => {
		switch (action.type) {
			case "failed": return _objectSpread2(_objectSpread2({}, state), {}, {
				fetchFailureCount: action.failureCount,
				fetchFailureReason: action.error
			});
			case "pause": return _objectSpread2(_objectSpread2({}, state), {}, { fetchStatus: "paused" });
			case "continue": return _objectSpread2(_objectSpread2({}, state), {}, { fetchStatus: "fetching" });
			case "fetch":
				var _action$meta;
				return _objectSpread2(_objectSpread2(_objectSpread2({}, state), fetchState(state.data, this.options)), {}, { fetchMeta: (_action$meta = action.meta) !== null && _action$meta !== void 0 ? _action$meta : null });
			case "success":
				const newState = _objectSpread2(_objectSpread2(_objectSpread2({}, state), successState(action.data, action.dataUpdatedAt)), {}, { dataUpdateCount: state.dataUpdateCount + 1 }, !action.manual && {
					fetchStatus: "idle",
					fetchFailureCount: 0,
					fetchFailureReason: null
				});
				_classPrivateFieldSet2(_revertState, this, action.manual ? newState : void 0);
				return newState;
			case "error":
				const error = action.error;
				return _objectSpread2(_objectSpread2({}, state), {}, {
					error,
					errorUpdateCount: state.errorUpdateCount + 1,
					errorUpdatedAt: Date.now(),
					fetchFailureCount: state.fetchFailureCount + 1,
					fetchFailureReason: error,
					fetchStatus: "idle",
					status: "error",
					isInvalidated: true
				});
			case "invalidate": return _objectSpread2(_objectSpread2({}, state), {}, { isInvalidated: true });
			case "setState": return _objectSpread2(_objectSpread2({}, state), action.state);
		}
	};
	this.state = reducer(this.state);
	notifyManager.batch(() => {
		this.observers.forEach((observer) => {
			observer.onQueryUpdate();
		});
		_classPrivateFieldGet2(_cache, this).notify({
			query: this,
			type: "updated",
			action
		});
	});
}
function fetchState(data, options) {
	return _objectSpread2({
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused"
	}, data === void 0 && {
		error: null,
		status: "pending"
	});
}
function successState(data, dataUpdatedAt) {
	return {
		data,
		dataUpdatedAt: dataUpdatedAt !== null && dataUpdatedAt !== void 0 ? dataUpdatedAt : Date.now(),
		error: null,
		isInvalidated: false,
		status: "success"
	};
}
function getDefaultState$1(options) {
	const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
	const hasData = data !== void 0;
	const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
	return {
		data,
		dataUpdateCount: 0,
		dataUpdatedAt: hasData ? initialDataUpdatedAt !== null && initialDataUpdatedAt !== void 0 ? initialDataUpdatedAt : Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: false,
		status: hasData ? "success" : "pending",
		fetchStatus: "idle"
	};
}
var _queryType, _initialState, _revertState, _cache, _client$3, _retryer$1, _defaultOptions$1, _abortSignalConsumed, _Class_brand$3, Query;
var init_query = __esmMin((() => {
	init_utils();
	init_notifyManager();
	init_retryer();
	init_removable();
	init_infiniteQueryBehavior();
	init_classPrivateMethodInitSpec();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_objectSpread2();
	init_assertClassBrand();
	init_asyncToGenerator();
	Query = (_queryType = /* @__PURE__ */ new WeakMap(), _initialState = /* @__PURE__ */ new WeakMap(), _revertState = /* @__PURE__ */ new WeakMap(), _cache = /* @__PURE__ */ new WeakMap(), _client$3 = /* @__PURE__ */ new WeakMap(), _retryer$1 = /* @__PURE__ */ new WeakMap(), _defaultOptions$1 = /* @__PURE__ */ new WeakMap(), _abortSignalConsumed = /* @__PURE__ */ new WeakMap(), _Class_brand$3 = /* @__PURE__ */ new WeakSet(), class extends Removable {
		constructor(config) {
			var _config$state;
			super();
			_classPrivateMethodInitSpec(this, _Class_brand$3);
			_classPrivateFieldInitSpec(this, _queryType, void 0);
			_classPrivateFieldInitSpec(this, _initialState, void 0);
			_classPrivateFieldInitSpec(this, _revertState, void 0);
			_classPrivateFieldInitSpec(this, _cache, void 0);
			_classPrivateFieldInitSpec(this, _client$3, void 0);
			_classPrivateFieldInitSpec(this, _retryer$1, void 0);
			_classPrivateFieldInitSpec(this, _defaultOptions$1, void 0);
			_classPrivateFieldInitSpec(this, _abortSignalConsumed, void 0);
			_classPrivateFieldSet2(_abortSignalConsumed, this, false);
			_classPrivateFieldSet2(_defaultOptions$1, this, config.defaultOptions);
			this.setOptions(config.options);
			this.observers = [];
			_classPrivateFieldSet2(_client$3, this, config.client);
			_classPrivateFieldSet2(_cache, this, _classPrivateFieldGet2(_client$3, this).getQueryCache());
			this.queryKey = config.queryKey;
			this.queryHash = config.queryHash;
			_classPrivateFieldSet2(_initialState, this, getDefaultState$1(this.options));
			this.state = (_config$state = config.state) !== null && _config$state !== void 0 ? _config$state : _classPrivateFieldGet2(_initialState, this);
			this.scheduleGc();
		}
		get meta() {
			return this.options.meta;
		}
		get queryType() {
			return _classPrivateFieldGet2(_queryType, this);
		}
		get promise() {
			var _classPrivateFieldGet2$6;
			return (_classPrivateFieldGet2$6 = _classPrivateFieldGet2(_retryer$1, this)) === null || _classPrivateFieldGet2$6 === void 0 ? void 0 : _classPrivateFieldGet2$6.promise;
		}
		setOptions(options) {
			this.options = _objectSpread2(_objectSpread2({}, _classPrivateFieldGet2(_defaultOptions$1, this)), options);
			if (options === null || options === void 0 ? void 0 : options._type) _classPrivateFieldSet2(_queryType, this, options._type);
			this.updateGcTime(this.options.gcTime);
			if (this.state && this.state.data === void 0) {
				const defaultState = getDefaultState$1(this.options);
				if (defaultState.data !== void 0) {
					this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
					_classPrivateFieldSet2(_initialState, this, defaultState);
				}
			}
		}
		optionalRemove() {
			if (!this.observers.length && this.state.fetchStatus === "idle") _classPrivateFieldGet2(_cache, this).remove(this);
		}
		setData(newData, options) {
			const data = replaceData(this.state.data, newData, this.options);
			_assertClassBrand(_Class_brand$3, this, _dispatch$1).call(this, {
				data,
				type: "success",
				dataUpdatedAt: options === null || options === void 0 ? void 0 : options.updatedAt,
				manual: options === null || options === void 0 ? void 0 : options.manual
			});
			return data;
		}
		setState(state) {
			_assertClassBrand(_Class_brand$3, this, _dispatch$1).call(this, {
				type: "setState",
				state
			});
		}
		cancel(options) {
			var _classPrivateFieldGet3, _classPrivateFieldGet4;
			const promise = (_classPrivateFieldGet3 = _classPrivateFieldGet2(_retryer$1, this)) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.promise;
			(_classPrivateFieldGet4 = _classPrivateFieldGet2(_retryer$1, this)) === null || _classPrivateFieldGet4 === void 0 || _classPrivateFieldGet4.cancel(options);
			return promise ? promise.then(noop).catch(noop) : Promise.resolve();
		}
		destroy() {
			super.destroy();
			this.cancel({ silent: true });
		}
		get resetState() {
			return _classPrivateFieldGet2(_initialState, this);
		}
		reset() {
			this.destroy();
			this.setState(this.resetState);
		}
		isActive() {
			return this.observers.some((observer) => resolveQueryBoolean(observer.options.enabled, this) !== false);
		}
		isDisabled() {
			if (this.getObserversCount() > 0) return !this.isActive();
			return this.options.queryFn === skipToken || !this.isFetched();
		}
		isFetched() {
			return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
		}
		isStatic() {
			if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveStaleTime(observer.options.staleTime, this) === "static");
			return false;
		}
		isStale() {
			if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
			return this.state.data === void 0 || this.state.isInvalidated;
		}
		isStaleByTime(staleTime = 0) {
			if (this.state.data === void 0) return true;
			if (staleTime === "static") return false;
			if (this.state.isInvalidated) return true;
			return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
		}
		onFocus() {
			var _classPrivateFieldGet5;
			const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
			observer === null || observer === void 0 || observer.refetch({ cancelRefetch: false });
			(_classPrivateFieldGet5 = _classPrivateFieldGet2(_retryer$1, this)) === null || _classPrivateFieldGet5 === void 0 || _classPrivateFieldGet5.continue();
		}
		onOnline() {
			var _classPrivateFieldGet6;
			const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
			observer === null || observer === void 0 || observer.refetch({ cancelRefetch: false });
			(_classPrivateFieldGet6 = _classPrivateFieldGet2(_retryer$1, this)) === null || _classPrivateFieldGet6 === void 0 || _classPrivateFieldGet6.continue();
		}
		addObserver(observer) {
			if (!this.observers.includes(observer)) {
				this.observers.push(observer);
				this.clearGcTimeout();
				_classPrivateFieldGet2(_cache, this).notify({
					type: "observerAdded",
					query: this,
					observer
				});
			}
		}
		removeObserver(observer) {
			if (this.observers.includes(observer)) {
				this.observers = this.observers.filter((x) => x !== observer);
				if (!this.observers.length) {
					if (_classPrivateFieldGet2(_retryer$1, this)) if (_classPrivateFieldGet2(_abortSignalConsumed, this) || _assertClassBrand(_Class_brand$3, this, _isInitialPausedFetch).call(this)) _classPrivateFieldGet2(_retryer$1, this).cancel({ revert: true });
					else _classPrivateFieldGet2(_retryer$1, this).cancelRetry();
					this.scheduleGc();
				}
				_classPrivateFieldGet2(_cache, this).notify({
					type: "observerRemoved",
					query: this,
					observer
				});
			}
		}
		getObserversCount() {
			return this.observers.length;
		}
		invalidate() {
			if (!this.state.isInvalidated) _assertClassBrand(_Class_brand$3, this, _dispatch$1).call(this, { type: "invalidate" });
		}
		fetch(options, fetchOptions) {
			var _this = this;
			return _asyncToGenerator(function* () {
				var _classPrivateFieldGet7, _context$fetchOptions;
				if (_this.state.fetchStatus !== "idle" && ((_classPrivateFieldGet7 = _classPrivateFieldGet2(_retryer$1, _this)) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.status()) !== "rejected") {
					if (_this.state.data !== void 0 && (fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.cancelRefetch)) _this.cancel({ silent: true });
					else if (_classPrivateFieldGet2(_retryer$1, _this)) {
						_classPrivateFieldGet2(_retryer$1, _this).continueRetry();
						return _classPrivateFieldGet2(_retryer$1, _this).promise;
					}
				}
				if (options) _this.setOptions(options);
				if (!_this.options.queryFn) {
					const observer = _this.observers.find((x) => x.options.queryFn);
					if (observer) _this.setOptions(observer.options);
				}
				const abortController = new AbortController();
				const addSignalProperty = (object) => {
					Object.defineProperty(object, "signal", {
						enumerable: true,
						get: () => {
							_classPrivateFieldSet2(_abortSignalConsumed, _this, true);
							return abortController.signal;
						}
					});
				};
				const fetchFn = () => {
					const queryFn = ensureQueryFn(_this.options, fetchOptions);
					const createQueryFnContext = () => {
						const queryFnContext2 = {
							client: _classPrivateFieldGet2(_client$3, _this),
							queryKey: _this.queryKey,
							meta: _this.meta
						};
						addSignalProperty(queryFnContext2);
						return queryFnContext2;
					};
					const queryFnContext = createQueryFnContext();
					_classPrivateFieldSet2(_abortSignalConsumed, _this, false);
					if (_this.options.persister) return _this.options.persister(queryFn, queryFnContext, _this);
					return queryFn(queryFnContext);
				};
				const createFetchContext = () => {
					const context2 = {
						fetchOptions,
						options: _this.options,
						queryKey: _this.queryKey,
						client: _classPrivateFieldGet2(_client$3, _this),
						state: _this.state,
						fetchFn
					};
					addSignalProperty(context2);
					return context2;
				};
				const context = createFetchContext();
				const behavior = _classPrivateFieldGet2(_queryType, _this) === "infinite" ? infiniteQueryBehavior(_this.options.pages) : _this.options.behavior;
				behavior === null || behavior === void 0 || behavior.onFetch(context, _this);
				_classPrivateFieldSet2(_revertState, _this, _this.state);
				if (_this.state.fetchStatus === "idle" || _this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) === null || _context$fetchOptions === void 0 ? void 0 : _context$fetchOptions.meta)) {
					var _context$fetchOptions2;
					_assertClassBrand(_Class_brand$3, _this, _dispatch$1).call(_this, {
						type: "fetch",
						meta: (_context$fetchOptions2 = context.fetchOptions) === null || _context$fetchOptions2 === void 0 ? void 0 : _context$fetchOptions2.meta
					});
				}
				_classPrivateFieldSet2(_retryer$1, _this, createRetryer({
					initialPromise: fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.initialPromise,
					fn: context.fetchFn,
					onCancel: (error) => {
						if (error instanceof CancelledError && error.revert) _this.setState(_objectSpread2(_objectSpread2({}, _classPrivateFieldGet2(_revertState, _this)), {}, { fetchStatus: "idle" }));
						abortController.abort();
					},
					onFail: (failureCount, error) => {
						_assertClassBrand(_Class_brand$3, _this, _dispatch$1).call(_this, {
							type: "failed",
							failureCount,
							error
						});
					},
					onPause: () => {
						_assertClassBrand(_Class_brand$3, _this, _dispatch$1).call(_this, { type: "pause" });
					},
					onContinue: () => {
						_assertClassBrand(_Class_brand$3, _this, _dispatch$1).call(_this, { type: "continue" });
					},
					retry: context.options.retry,
					retryDelay: context.options.retryDelay,
					networkMode: context.options.networkMode,
					canRun: () => true
				}));
				try {
					var _classPrivateFieldGet8, _classPrivateFieldGet9, _classPrivateFieldGet10, _classPrivateFieldGet11;
					const data = yield _classPrivateFieldGet2(_retryer$1, _this).start();
					if (data === void 0) throw new Error(`${_this.queryHash} data is undefined`);
					_this.setData(data);
					(_classPrivateFieldGet8 = (_classPrivateFieldGet9 = _classPrivateFieldGet2(_cache, _this).config).onSuccess) === null || _classPrivateFieldGet8 === void 0 || _classPrivateFieldGet8.call(_classPrivateFieldGet9, data, _this);
					(_classPrivateFieldGet10 = (_classPrivateFieldGet11 = _classPrivateFieldGet2(_cache, _this).config).onSettled) === null || _classPrivateFieldGet10 === void 0 || _classPrivateFieldGet10.call(_classPrivateFieldGet11, data, _this.state.error, _this);
					return data;
				} catch (error) {
					var _classPrivateFieldGet12, _classPrivateFieldGet13, _classPrivateFieldGet14, _classPrivateFieldGet15;
					if (error instanceof CancelledError) {
						if (error.silent) return _classPrivateFieldGet2(_retryer$1, _this).promise;
						else if (error.revert) {
							if (_this.state.data === void 0) throw error;
							return _this.state.data;
						}
					}
					_assertClassBrand(_Class_brand$3, _this, _dispatch$1).call(_this, {
						type: "error",
						error
					});
					(_classPrivateFieldGet12 = (_classPrivateFieldGet13 = _classPrivateFieldGet2(_cache, _this).config).onError) === null || _classPrivateFieldGet12 === void 0 || _classPrivateFieldGet12.call(_classPrivateFieldGet13, error, _this);
					(_classPrivateFieldGet14 = (_classPrivateFieldGet15 = _classPrivateFieldGet2(_cache, _this).config).onSettled) === null || _classPrivateFieldGet14 === void 0 || _classPrivateFieldGet14.call(_classPrivateFieldGet15, _this.state.data, error, _this);
					throw error;
				} finally {
					_this.scheduleGc();
				}
			})();
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/queryObserver.js
function _executeFetch(fetchOptions) {
	_assertClassBrand(_Class_brand$2, this, _updateQuery).call(this);
	let promise = _classPrivateFieldGet2(_currentQuery, this).fetch(this.options, fetchOptions);
	if (!(fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.throwOnError)) promise = promise.catch(noop);
	return promise;
}
function _updateStaleTimeout() {
	_assertClassBrand(_Class_brand$2, this, _clearStaleTimeout).call(this);
	const staleTime = resolveStaleTime(this.options.staleTime, _classPrivateFieldGet2(_currentQuery, this));
	if (environmentManager.isServer() || _classPrivateFieldGet2(_currentResult$1, this).isStale || !isValidTimeout(staleTime)) return;
	const timeout = timeUntilStale(_classPrivateFieldGet2(_currentResult$1, this).dataUpdatedAt, staleTime) + 1;
	_classPrivateFieldSet2(_staleTimeoutId, this, timeoutManager.setTimeout(() => {
		if (!_classPrivateFieldGet2(_currentResult$1, this).isStale) this.updateResult();
	}, timeout));
}
function _computeRefetchInterval() {
	var _ref2;
	return (_ref2 = typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(_classPrivateFieldGet2(_currentQuery, this)) : this.options.refetchInterval) !== null && _ref2 !== void 0 ? _ref2 : false;
}
function _updateRefetchInterval(nextInterval) {
	_assertClassBrand(_Class_brand$2, this, _clearRefetchInterval).call(this);
	_classPrivateFieldSet2(_currentRefetchInterval, this, nextInterval);
	if (environmentManager.isServer() || resolveQueryBoolean(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) === false || !isValidTimeout(_classPrivateFieldGet2(_currentRefetchInterval, this)) || _classPrivateFieldGet2(_currentRefetchInterval, this) === 0) return;
	_classPrivateFieldSet2(_refetchIntervalId, this, timeoutManager.setInterval(() => {
		if (this.options.refetchIntervalInBackground || focusManager.isFocused()) _assertClassBrand(_Class_brand$2, this, _executeFetch).call(this);
	}, _classPrivateFieldGet2(_currentRefetchInterval, this)));
}
function _updateTimers() {
	_assertClassBrand(_Class_brand$2, this, _updateStaleTimeout).call(this);
	_assertClassBrand(_Class_brand$2, this, _updateRefetchInterval).call(this, _assertClassBrand(_Class_brand$2, this, _computeRefetchInterval).call(this));
}
function _clearStaleTimeout() {
	if (_classPrivateFieldGet2(_staleTimeoutId, this) !== void 0) {
		timeoutManager.clearTimeout(_classPrivateFieldGet2(_staleTimeoutId, this));
		_classPrivateFieldSet2(_staleTimeoutId, this, void 0);
	}
}
function _clearRefetchInterval() {
	if (_classPrivateFieldGet2(_refetchIntervalId, this) !== void 0) {
		timeoutManager.clearInterval(_classPrivateFieldGet2(_refetchIntervalId, this));
		_classPrivateFieldSet2(_refetchIntervalId, this, void 0);
	}
}
function _updateQuery() {
	const query = _classPrivateFieldGet2(_client$2, this).getQueryCache().build(_classPrivateFieldGet2(_client$2, this), this.options);
	if (query === _classPrivateFieldGet2(_currentQuery, this)) return;
	const prevQuery = _classPrivateFieldGet2(_currentQuery, this);
	_classPrivateFieldSet2(_currentQuery, this, query);
	_classPrivateFieldSet2(_currentQueryInitialState, this, query.state);
	if (this.hasListeners()) {
		prevQuery === null || prevQuery === void 0 || prevQuery.removeObserver(this);
		query.addObserver(this);
	}
}
function _notify$1(notifyOptions) {
	notifyManager.batch(() => {
		if (notifyOptions.listeners) this.listeners.forEach((listener) => {
			listener(_classPrivateFieldGet2(_currentResult$1, this));
		});
		_classPrivateFieldGet2(_client$2, this).getQueryCache().notify({
			query: _classPrivateFieldGet2(_currentQuery, this),
			type: "observerResultsUpdated"
		});
	});
}
function shouldLoadOnMount(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && resolveQueryBoolean(options.retryOnMount, query) === false);
}
function shouldFetchOnMount(query, options) {
	return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
	if (resolveQueryBoolean(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
		const value = typeof field === "function" ? field(query) : field;
		return value === "always" || value !== false && isStale(query, options);
	}
	return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
	return (query !== prevQuery || resolveQueryBoolean(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
	return resolveQueryBoolean(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
	if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) return true;
	return false;
}
var _client$2, _currentQuery, _currentQueryInitialState, _currentResult$1, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _Class_brand$2, QueryObserver;
var init_queryObserver = __esmMin((() => {
	init_focusManager();
	init_environmentManager();
	init_notifyManager();
	init_query();
	init_subscribable();
	init_thenable();
	init_utils();
	init_timeoutManager();
	init_classPrivateMethodInitSpec();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_assertClassBrand();
	init_objectDestructuringEmpty();
	init_extends();
	init_objectSpread2();
	QueryObserver = (_client$2 = /* @__PURE__ */ new WeakMap(), _currentQuery = /* @__PURE__ */ new WeakMap(), _currentQueryInitialState = /* @__PURE__ */ new WeakMap(), _currentResult$1 = /* @__PURE__ */ new WeakMap(), _currentResultState = /* @__PURE__ */ new WeakMap(), _currentResultOptions = /* @__PURE__ */ new WeakMap(), _currentThenable = /* @__PURE__ */ new WeakMap(), _selectError = /* @__PURE__ */ new WeakMap(), _selectFn = /* @__PURE__ */ new WeakMap(), _selectResult = /* @__PURE__ */ new WeakMap(), _lastQueryWithDefinedData = /* @__PURE__ */ new WeakMap(), _staleTimeoutId = /* @__PURE__ */ new WeakMap(), _refetchIntervalId = /* @__PURE__ */ new WeakMap(), _currentRefetchInterval = /* @__PURE__ */ new WeakMap(), _trackedProps = /* @__PURE__ */ new WeakMap(), _Class_brand$2 = /* @__PURE__ */ new WeakSet(), class extends Subscribable {
		constructor(client, options) {
			super();
			_classPrivateMethodInitSpec(this, _Class_brand$2);
			_classPrivateFieldInitSpec(this, _client$2, void 0);
			_classPrivateFieldInitSpec(this, _currentQuery, void 0);
			_classPrivateFieldInitSpec(this, _currentQueryInitialState, void 0);
			_classPrivateFieldInitSpec(this, _currentResult$1, void 0);
			_classPrivateFieldInitSpec(this, _currentResultState, void 0);
			_classPrivateFieldInitSpec(this, _currentResultOptions, void 0);
			_classPrivateFieldInitSpec(this, _currentThenable, void 0);
			_classPrivateFieldInitSpec(this, _selectError, void 0);
			_classPrivateFieldInitSpec(this, _selectFn, void 0);
			_classPrivateFieldInitSpec(this, _selectResult, void 0);
			_classPrivateFieldInitSpec(this, _lastQueryWithDefinedData, void 0);
			_classPrivateFieldInitSpec(this, _staleTimeoutId, void 0);
			_classPrivateFieldInitSpec(this, _refetchIntervalId, void 0);
			_classPrivateFieldInitSpec(this, _currentRefetchInterval, void 0);
			_classPrivateFieldInitSpec(this, _trackedProps, /* @__PURE__ */ new Set());
			this.options = options;
			_classPrivateFieldSet2(_client$2, this, client);
			_classPrivateFieldSet2(_selectError, this, null);
			_classPrivateFieldSet2(_currentThenable, this, pendingThenable());
			this.bindMethods();
			this.setOptions(options);
		}
		bindMethods() {
			this.refetch = this.refetch.bind(this);
		}
		onSubscribe() {
			if (this.listeners.size === 1) {
				_classPrivateFieldGet2(_currentQuery, this).addObserver(this);
				if (shouldFetchOnMount(_classPrivateFieldGet2(_currentQuery, this), this.options)) _assertClassBrand(_Class_brand$2, this, _executeFetch).call(this);
				else this.updateResult();
				_assertClassBrand(_Class_brand$2, this, _updateTimers).call(this);
			}
		}
		onUnsubscribe() {
			if (!this.hasListeners()) this.destroy();
		}
		shouldFetchOnReconnect() {
			return shouldFetchOn(_classPrivateFieldGet2(_currentQuery, this), this.options, this.options.refetchOnReconnect);
		}
		shouldFetchOnWindowFocus() {
			return shouldFetchOn(_classPrivateFieldGet2(_currentQuery, this), this.options, this.options.refetchOnWindowFocus);
		}
		destroy() {
			this.listeners = /* @__PURE__ */ new Set();
			_assertClassBrand(_Class_brand$2, this, _clearStaleTimeout).call(this);
			_assertClassBrand(_Class_brand$2, this, _clearRefetchInterval).call(this);
			_classPrivateFieldGet2(_currentQuery, this).removeObserver(this);
		}
		setOptions(options) {
			const prevOptions = this.options;
			const prevQuery = _classPrivateFieldGet2(_currentQuery, this);
			this.options = _classPrivateFieldGet2(_client$2, this).defaultQueryOptions(options);
			if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveQueryBoolean(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== "boolean") throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");
			_assertClassBrand(_Class_brand$2, this, _updateQuery).call(this);
			_classPrivateFieldGet2(_currentQuery, this).setOptions(this.options);
			if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) _classPrivateFieldGet2(_client$2, this).getQueryCache().notify({
				type: "observerOptionsUpdated",
				query: _classPrivateFieldGet2(_currentQuery, this),
				observer: this
			});
			const mounted = this.hasListeners();
			if (mounted && shouldFetchOptionally(_classPrivateFieldGet2(_currentQuery, this), prevQuery, this.options, prevOptions)) _assertClassBrand(_Class_brand$2, this, _executeFetch).call(this);
			this.updateResult();
			if (mounted && (_classPrivateFieldGet2(_currentQuery, this) !== prevQuery || resolveQueryBoolean(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== resolveQueryBoolean(prevOptions.enabled, _classPrivateFieldGet2(_currentQuery, this)) || resolveStaleTime(this.options.staleTime, _classPrivateFieldGet2(_currentQuery, this)) !== resolveStaleTime(prevOptions.staleTime, _classPrivateFieldGet2(_currentQuery, this)))) _assertClassBrand(_Class_brand$2, this, _updateStaleTimeout).call(this);
			const nextRefetchInterval = _assertClassBrand(_Class_brand$2, this, _computeRefetchInterval).call(this);
			if (mounted && (_classPrivateFieldGet2(_currentQuery, this) !== prevQuery || resolveQueryBoolean(this.options.enabled, _classPrivateFieldGet2(_currentQuery, this)) !== resolveQueryBoolean(prevOptions.enabled, _classPrivateFieldGet2(_currentQuery, this)) || nextRefetchInterval !== _classPrivateFieldGet2(_currentRefetchInterval, this))) _assertClassBrand(_Class_brand$2, this, _updateRefetchInterval).call(this, nextRefetchInterval);
		}
		getOptimisticResult(options) {
			const query = _classPrivateFieldGet2(_client$2, this).getQueryCache().build(_classPrivateFieldGet2(_client$2, this), options);
			const result = this.createResult(query, options);
			if (shouldAssignObserverCurrentProperties(this, result)) {
				_classPrivateFieldSet2(_currentResult$1, this, result);
				_classPrivateFieldSet2(_currentResultOptions, this, this.options);
				_classPrivateFieldSet2(_currentResultState, this, _classPrivateFieldGet2(_currentQuery, this).state);
			}
			return result;
		}
		getCurrentResult() {
			return _classPrivateFieldGet2(_currentResult$1, this);
		}
		trackResult(result, onPropTracked) {
			return new Proxy(result, { get: (target, key) => {
				this.trackProp(key);
				onPropTracked === null || onPropTracked === void 0 || onPropTracked(key);
				if (key === "promise") {
					this.trackProp("data");
					if (!this.options.experimental_prefetchInRender && _classPrivateFieldGet2(_currentThenable, this).status === "pending") _classPrivateFieldGet2(_currentThenable, this).reject(/* @__PURE__ */ new Error("experimental_prefetchInRender feature flag is not enabled"));
				}
				return Reflect.get(target, key);
			} });
		}
		trackProp(key) {
			_classPrivateFieldGet2(_trackedProps, this).add(key);
		}
		getCurrentQuery() {
			return _classPrivateFieldGet2(_currentQuery, this);
		}
		refetch(_ref = {}) {
			let options = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
			return this.fetch(_objectSpread2({}, options));
		}
		fetchOptimistic(options) {
			const defaultedOptions = _classPrivateFieldGet2(_client$2, this).defaultQueryOptions(options);
			const query = _classPrivateFieldGet2(_client$2, this).getQueryCache().build(_classPrivateFieldGet2(_client$2, this), defaultedOptions);
			return query.fetch().then(() => this.createResult(query, defaultedOptions));
		}
		fetch(fetchOptions) {
			var _fetchOptions$cancelR;
			return _assertClassBrand(_Class_brand$2, this, _executeFetch).call(this, _objectSpread2(_objectSpread2({}, fetchOptions), {}, { cancelRefetch: (_fetchOptions$cancelR = fetchOptions.cancelRefetch) !== null && _fetchOptions$cancelR !== void 0 ? _fetchOptions$cancelR : true })).then(() => {
				this.updateResult();
				return _classPrivateFieldGet2(_currentResult$1, this);
			});
		}
		createResult(query, options) {
			const prevQuery = _classPrivateFieldGet2(_currentQuery, this);
			const prevOptions = this.options;
			const prevResult = _classPrivateFieldGet2(_currentResult$1, this);
			const prevResultState = _classPrivateFieldGet2(_currentResultState, this);
			const prevResultOptions = _classPrivateFieldGet2(_currentResultOptions, this);
			const queryInitialState = query !== prevQuery ? query.state : _classPrivateFieldGet2(_currentQueryInitialState, this);
			const { state } = query;
			let newState = _objectSpread2({}, state);
			let isPlaceholderData = false;
			let data;
			if (options._optimisticResults) {
				const mounted = this.hasListeners();
				const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
				const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
				if (fetchOnMount || fetchOptionally) newState = _objectSpread2(_objectSpread2({}, newState), fetchState(state.data, query.options));
				if (options._optimisticResults === "isRestoring") newState.fetchStatus = "idle";
			}
			let { error, errorUpdatedAt, status } = newState;
			data = newState.data;
			let skipSelect = false;
			if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
				let placeholderData;
				if ((prevResult === null || prevResult === void 0 ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions === null || prevResultOptions === void 0 ? void 0 : prevResultOptions.placeholderData)) {
					placeholderData = prevResult.data;
					skipSelect = true;
				} else {
					var _classPrivateFieldGet2$5;
					placeholderData = typeof options.placeholderData === "function" ? options.placeholderData((_classPrivateFieldGet2$5 = _classPrivateFieldGet2(_lastQueryWithDefinedData, this)) === null || _classPrivateFieldGet2$5 === void 0 ? void 0 : _classPrivateFieldGet2$5.state.data, _classPrivateFieldGet2(_lastQueryWithDefinedData, this)) : options.placeholderData;
				}
				if (placeholderData !== void 0) {
					status = "success";
					data = replaceData(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, placeholderData, options);
					isPlaceholderData = true;
				}
			}
			if (options.select && data !== void 0 && !skipSelect) if (prevResult && data === (prevResultState === null || prevResultState === void 0 ? void 0 : prevResultState.data) && options.select === _classPrivateFieldGet2(_selectFn, this)) data = _classPrivateFieldGet2(_selectResult, this);
			else try {
				_classPrivateFieldSet2(_selectFn, this, options.select);
				data = options.select(data);
				data = replaceData(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, data, options);
				_classPrivateFieldSet2(_selectResult, this, data);
				_classPrivateFieldSet2(_selectError, this, null);
			} catch (selectError) {
				_classPrivateFieldSet2(_selectError, this, selectError);
			}
			if (_classPrivateFieldGet2(_selectError, this)) {
				error = _classPrivateFieldGet2(_selectError, this);
				data = _classPrivateFieldGet2(_selectResult, this);
				errorUpdatedAt = Date.now();
				status = "error";
			}
			const isFetching = newState.fetchStatus === "fetching";
			const isPending = status === "pending";
			const isError = status === "error";
			const isLoading = isPending && isFetching;
			const hasData = data !== void 0;
			const nextResult = {
				status,
				fetchStatus: newState.fetchStatus,
				isPending,
				isSuccess: status === "success",
				isError,
				isInitialLoading: isLoading,
				isLoading,
				data,
				dataUpdatedAt: newState.dataUpdatedAt,
				error,
				errorUpdatedAt,
				failureCount: newState.fetchFailureCount,
				failureReason: newState.fetchFailureReason,
				errorUpdateCount: newState.errorUpdateCount,
				isFetched: query.isFetched(),
				isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
				isFetching,
				isRefetching: isFetching && !isPending,
				isLoadingError: isError && !hasData,
				isPaused: newState.fetchStatus === "paused",
				isPlaceholderData,
				isRefetchError: isError && hasData,
				isStale: isStale(query, options),
				refetch: this.refetch,
				promise: _classPrivateFieldGet2(_currentThenable, this),
				isEnabled: resolveQueryBoolean(options.enabled, query) !== false
			};
			if (this.options.experimental_prefetchInRender) {
				const hasResultData = nextResult.data !== void 0;
				const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
				const finalizeThenableIfPossible = (thenable) => {
					if (isErrorWithoutData) thenable.reject(nextResult.error);
					else if (hasResultData) thenable.resolve(nextResult.data);
				};
				const recreateThenable = () => {
					finalizeThenableIfPossible(_classPrivateFieldSet2(_currentThenable, this, nextResult.promise = pendingThenable()));
				};
				const prevThenable = _classPrivateFieldGet2(_currentThenable, this);
				switch (prevThenable.status) {
					case "pending":
						if (query.queryHash === prevQuery.queryHash) finalizeThenableIfPossible(prevThenable);
						break;
					case "fulfilled":
						if (isErrorWithoutData || nextResult.data !== prevThenable.value) recreateThenable();
						break;
					case "rejected":
						if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) recreateThenable();
						break;
				}
			}
			return nextResult;
		}
		updateResult() {
			const prevResult = _classPrivateFieldGet2(_currentResult$1, this);
			const nextResult = this.createResult(_classPrivateFieldGet2(_currentQuery, this), this.options);
			_classPrivateFieldSet2(_currentResultState, this, _classPrivateFieldGet2(_currentQuery, this).state);
			_classPrivateFieldSet2(_currentResultOptions, this, this.options);
			if (_classPrivateFieldGet2(_currentResultState, this).data !== void 0) _classPrivateFieldSet2(_lastQueryWithDefinedData, this, _classPrivateFieldGet2(_currentQuery, this));
			if (shallowEqualObjects(nextResult, prevResult)) return;
			_classPrivateFieldSet2(_currentResult$1, this, nextResult);
			const shouldNotifyListeners = () => {
				if (!prevResult) return true;
				const { notifyOnChangeProps } = this.options;
				const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
				if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !_classPrivateFieldGet2(_trackedProps, this).size) return true;
				const includedProps = new Set(notifyOnChangePropsValue !== null && notifyOnChangePropsValue !== void 0 ? notifyOnChangePropsValue : _classPrivateFieldGet2(_trackedProps, this));
				if (this.options.throwOnError) includedProps.add("error");
				return Object.keys(_classPrivateFieldGet2(_currentResult$1, this)).some((key) => {
					const typedKey = key;
					return _classPrivateFieldGet2(_currentResult$1, this)[typedKey] !== prevResult[typedKey] && includedProps.has(typedKey);
				});
			};
			_assertClassBrand(_Class_brand$2, this, _notify$1).call(this, { listeners: shouldNotifyListeners() });
		}
		onQueryUpdate() {
			this.updateResult();
			if (this.hasListeners()) _assertClassBrand(_Class_brand$2, this, _updateTimers).call(this);
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/mutation.js
function _dispatch(action) {
	const reducer = (state) => {
		switch (action.type) {
			case "failed": return _objectSpread2(_objectSpread2({}, state), {}, {
				failureCount: action.failureCount,
				failureReason: action.error
			});
			case "pause": return _objectSpread2(_objectSpread2({}, state), {}, { isPaused: true });
			case "continue": return _objectSpread2(_objectSpread2({}, state), {}, { isPaused: false });
			case "pending": return _objectSpread2(_objectSpread2({}, state), {}, {
				context: action.context,
				data: void 0,
				failureCount: 0,
				failureReason: null,
				error: null,
				isPaused: action.isPaused,
				status: "pending",
				variables: action.variables,
				submittedAt: Date.now()
			});
			case "success": return _objectSpread2(_objectSpread2({}, state), {}, {
				data: action.data,
				failureCount: 0,
				failureReason: null,
				error: null,
				status: "success",
				isPaused: false
			});
			case "error": return _objectSpread2(_objectSpread2({}, state), {}, {
				data: void 0,
				error: action.error,
				failureCount: state.failureCount + 1,
				failureReason: action.error,
				isPaused: false,
				status: "error"
			});
		}
	};
	this.state = reducer(this.state);
	notifyManager.batch(() => {
		_classPrivateFieldGet2(_observers, this).forEach((observer) => {
			observer.onMutationUpdate(action);
		});
		_classPrivateFieldGet2(_mutationCache$1, this).notify({
			mutation: this,
			type: "updated",
			action
		});
	});
}
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: false,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
var _client$1, _observers, _mutationCache$1, _retryer, _Class_brand$1, Mutation;
var init_mutation = __esmMin((() => {
	init_notifyManager();
	init_removable();
	init_retryer();
	init_classPrivateMethodInitSpec();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_assertClassBrand();
	init_asyncToGenerator();
	init_objectSpread2();
	Mutation = (_client$1 = /* @__PURE__ */ new WeakMap(), _observers = /* @__PURE__ */ new WeakMap(), _mutationCache$1 = /* @__PURE__ */ new WeakMap(), _retryer = /* @__PURE__ */ new WeakMap(), _Class_brand$1 = /* @__PURE__ */ new WeakSet(), class extends Removable {
		constructor(config) {
			super();
			_classPrivateMethodInitSpec(this, _Class_brand$1);
			_classPrivateFieldInitSpec(this, _client$1, void 0);
			_classPrivateFieldInitSpec(this, _observers, void 0);
			_classPrivateFieldInitSpec(this, _mutationCache$1, void 0);
			_classPrivateFieldInitSpec(this, _retryer, void 0);
			_classPrivateFieldSet2(_client$1, this, config.client);
			this.mutationId = config.mutationId;
			_classPrivateFieldSet2(_mutationCache$1, this, config.mutationCache);
			_classPrivateFieldSet2(_observers, this, []);
			this.state = config.state || getDefaultState();
			this.setOptions(config.options);
			this.scheduleGc();
		}
		setOptions(options) {
			this.options = options;
			this.updateGcTime(this.options.gcTime);
		}
		get meta() {
			return this.options.meta;
		}
		addObserver(observer) {
			if (!_classPrivateFieldGet2(_observers, this).includes(observer)) {
				_classPrivateFieldGet2(_observers, this).push(observer);
				this.clearGcTimeout();
				_classPrivateFieldGet2(_mutationCache$1, this).notify({
					type: "observerAdded",
					mutation: this,
					observer
				});
			}
		}
		removeObserver(observer) {
			_classPrivateFieldSet2(_observers, this, _classPrivateFieldGet2(_observers, this).filter((x) => x !== observer));
			this.scheduleGc();
			_classPrivateFieldGet2(_mutationCache$1, this).notify({
				type: "observerRemoved",
				mutation: this,
				observer
			});
		}
		optionalRemove() {
			if (!_classPrivateFieldGet2(_observers, this).length) if (this.state.status === "pending") this.scheduleGc();
			else _classPrivateFieldGet2(_mutationCache$1, this).remove(this);
		}
		continue() {
			var _this$retryer$continu, _classPrivateFieldGet2$4;
			return (_this$retryer$continu = (_classPrivateFieldGet2$4 = _classPrivateFieldGet2(_retryer, this)) === null || _classPrivateFieldGet2$4 === void 0 ? void 0 : _classPrivateFieldGet2$4.continue()) !== null && _this$retryer$continu !== void 0 ? _this$retryer$continu : this.execute(this.state.variables);
		}
		execute(variables) {
			var _this = this;
			return _asyncToGenerator(function* () {
				var _this$options$retry;
				const onContinue = () => {
					_assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, { type: "continue" });
				};
				const mutationFnContext = {
					client: _classPrivateFieldGet2(_client$1, _this),
					meta: _this.options.meta,
					mutationKey: _this.options.mutationKey
				};
				_classPrivateFieldSet2(_retryer, _this, createRetryer({
					fn: () => {
						if (!_this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
						return _this.options.mutationFn(variables, mutationFnContext);
					},
					onFail: (failureCount, error) => {
						_assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, {
							type: "failed",
							failureCount,
							error
						});
					},
					onPause: () => {
						_assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, { type: "pause" });
					},
					onContinue,
					retry: (_this$options$retry = _this.options.retry) !== null && _this$options$retry !== void 0 ? _this$options$retry : 0,
					retryDelay: _this.options.retryDelay,
					networkMode: _this.options.networkMode,
					canRun: () => _classPrivateFieldGet2(_mutationCache$1, _this).canRun(_this)
				}));
				const restored = _this.state.status === "pending";
				const isPaused = !_classPrivateFieldGet2(_retryer, _this).canStart();
				try {
					var _classPrivateFieldGet3, _classPrivateFieldGet4, _this$options$onSucce, _this$options2, _classPrivateFieldGet5, _classPrivateFieldGet6, _this$options$onSettl, _this$options3;
					if (restored) onContinue();
					else {
						var _this$options$onMutat, _this$options;
						_assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, {
							type: "pending",
							variables,
							isPaused
						});
						if (_classPrivateFieldGet2(_mutationCache$1, _this).config.onMutate) yield _classPrivateFieldGet2(_mutationCache$1, _this).config.onMutate(variables, _this, mutationFnContext);
						const context = yield (_this$options$onMutat = (_this$options = _this.options).onMutate) === null || _this$options$onMutat === void 0 ? void 0 : _this$options$onMutat.call(_this$options, variables, mutationFnContext);
						if (context !== _this.state.context) _assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, {
							type: "pending",
							context,
							variables,
							isPaused
						});
					}
					const data = yield _classPrivateFieldGet2(_retryer, _this).start();
					yield (_classPrivateFieldGet3 = (_classPrivateFieldGet4 = _classPrivateFieldGet2(_mutationCache$1, _this).config).onSuccess) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.call(_classPrivateFieldGet4, data, variables, _this.state.context, _this, mutationFnContext);
					yield (_this$options$onSucce = (_this$options2 = _this.options).onSuccess) === null || _this$options$onSucce === void 0 ? void 0 : _this$options$onSucce.call(_this$options2, data, variables, _this.state.context, mutationFnContext);
					yield (_classPrivateFieldGet5 = (_classPrivateFieldGet6 = _classPrivateFieldGet2(_mutationCache$1, _this).config).onSettled) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.call(_classPrivateFieldGet6, data, null, _this.state.variables, _this.state.context, _this, mutationFnContext);
					yield (_this$options$onSettl = (_this$options3 = _this.options).onSettled) === null || _this$options$onSettl === void 0 ? void 0 : _this$options$onSettl.call(_this$options3, data, null, variables, _this.state.context, mutationFnContext);
					_assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, {
						type: "success",
						data
					});
					return data;
				} catch (error) {
					try {
						var _classPrivateFieldGet7, _classPrivateFieldGet8;
						yield (_classPrivateFieldGet7 = (_classPrivateFieldGet8 = _classPrivateFieldGet2(_mutationCache$1, _this).config).onError) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.call(_classPrivateFieldGet8, error, variables, _this.state.context, _this, mutationFnContext);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						var _this$options$onError, _this$options4;
						yield (_this$options$onError = (_this$options4 = _this.options).onError) === null || _this$options$onError === void 0 ? void 0 : _this$options$onError.call(_this$options4, error, variables, _this.state.context, mutationFnContext);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						var _classPrivateFieldGet9, _classPrivateFieldGet10;
						yield (_classPrivateFieldGet9 = (_classPrivateFieldGet10 = _classPrivateFieldGet2(_mutationCache$1, _this).config).onSettled) === null || _classPrivateFieldGet9 === void 0 ? void 0 : _classPrivateFieldGet9.call(_classPrivateFieldGet10, void 0, error, _this.state.variables, _this.state.context, _this, mutationFnContext);
					} catch (e) {
						Promise.reject(e);
					}
					try {
						var _this$options$onSettl2, _this$options5;
						yield (_this$options$onSettl2 = (_this$options5 = _this.options).onSettled) === null || _this$options$onSettl2 === void 0 ? void 0 : _this$options$onSettl2.call(_this$options5, void 0, error, variables, _this.state.context, mutationFnContext);
					} catch (e) {
						Promise.reject(e);
					}
					_assertClassBrand(_Class_brand$1, _this, _dispatch).call(_this, {
						type: "error",
						error
					});
					throw error;
				} finally {
					_classPrivateFieldGet2(_mutationCache$1, _this).runNext(_this);
				}
			})();
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/mutationCache.js
function scopeFor(mutation) {
	var _mutation$options$sco;
	return (_mutation$options$sco = mutation.options.scope) === null || _mutation$options$sco === void 0 ? void 0 : _mutation$options$sco.id;
}
var _mutations, _scopes, _mutationId, MutationCache;
var init_mutationCache = __esmMin((() => {
	init_notifyManager();
	init_mutation();
	init_utils();
	init_subscribable();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_objectSpread2();
	MutationCache = (_mutations = /* @__PURE__ */ new WeakMap(), _scopes = /* @__PURE__ */ new WeakMap(), _mutationId = /* @__PURE__ */ new WeakMap(), class extends Subscribable {
		constructor(config = {}) {
			super();
			_classPrivateFieldInitSpec(this, _mutations, void 0);
			_classPrivateFieldInitSpec(this, _scopes, void 0);
			_classPrivateFieldInitSpec(this, _mutationId, void 0);
			this.config = config;
			_classPrivateFieldSet2(_mutations, this, /* @__PURE__ */ new Set());
			_classPrivateFieldSet2(_scopes, this, /* @__PURE__ */ new Map());
			_classPrivateFieldSet2(_mutationId, this, 0);
		}
		build(client, options, state) {
			var _this$mutationId;
			const mutation = new Mutation({
				client,
				mutationCache: this,
				mutationId: _classPrivateFieldSet2(_mutationId, this, (_this$mutationId = _classPrivateFieldGet2(_mutationId, this), ++_this$mutationId)),
				options: client.defaultMutationOptions(options),
				state
			});
			this.add(mutation);
			return mutation;
		}
		add(mutation) {
			_classPrivateFieldGet2(_mutations, this).add(mutation);
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const scopedMutations = _classPrivateFieldGet2(_scopes, this).get(scope);
				if (scopedMutations) scopedMutations.push(mutation);
				else _classPrivateFieldGet2(_scopes, this).set(scope, [mutation]);
			}
			this.notify({
				type: "added",
				mutation
			});
		}
		remove(mutation) {
			if (_classPrivateFieldGet2(_mutations, this).delete(mutation)) {
				const scope = scopeFor(mutation);
				if (typeof scope === "string") {
					const scopedMutations = _classPrivateFieldGet2(_scopes, this).get(scope);
					if (scopedMutations) {
						if (scopedMutations.length > 1) {
							const index = scopedMutations.indexOf(mutation);
							if (index !== -1) scopedMutations.splice(index, 1);
						} else if (scopedMutations[0] === mutation) _classPrivateFieldGet2(_scopes, this).delete(scope);
					}
				}
			}
			this.notify({
				type: "removed",
				mutation
			});
		}
		canRun(mutation) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const mutationsWithSameScope = _classPrivateFieldGet2(_scopes, this).get(scope);
				const firstPendingMutation = mutationsWithSameScope === null || mutationsWithSameScope === void 0 ? void 0 : mutationsWithSameScope.find((m) => m.state.status === "pending");
				return !firstPendingMutation || firstPendingMutation === mutation;
			} else return true;
		}
		runNext(mutation) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				var _classPrivateFieldGet2$3, _foundMutation$contin;
				const foundMutation = (_classPrivateFieldGet2$3 = _classPrivateFieldGet2(_scopes, this).get(scope)) === null || _classPrivateFieldGet2$3 === void 0 ? void 0 : _classPrivateFieldGet2$3.find((m) => m !== mutation && m.state.isPaused);
				return (_foundMutation$contin = foundMutation === null || foundMutation === void 0 ? void 0 : foundMutation.continue()) !== null && _foundMutation$contin !== void 0 ? _foundMutation$contin : Promise.resolve();
			} else return Promise.resolve();
		}
		clear() {
			notifyManager.batch(() => {
				_classPrivateFieldGet2(_mutations, this).forEach((mutation) => {
					this.notify({
						type: "removed",
						mutation
					});
				});
				_classPrivateFieldGet2(_mutations, this).clear();
				_classPrivateFieldGet2(_scopes, this).clear();
			});
		}
		getAll() {
			return Array.from(_classPrivateFieldGet2(_mutations, this));
		}
		find(filters) {
			const defaultedFilters = _objectSpread2({ exact: true }, filters);
			return this.getAll().find((mutation) => matchMutation(defaultedFilters, mutation));
		}
		findAll(filters = {}) {
			return this.getAll().filter((mutation) => matchMutation(filters, mutation));
		}
		notify(event) {
			notifyManager.batch(() => {
				this.listeners.forEach((listener) => {
					listener(event);
				});
			});
		}
		resumePausedMutations() {
			const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
			return notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(noop))));
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/mutationObserver.js
function _updateResult() {
	var _this$currentMutation, _classPrivateFieldGet6;
	const state = (_this$currentMutation = (_classPrivateFieldGet6 = _classPrivateFieldGet2(_currentMutation, this)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.state) !== null && _this$currentMutation !== void 0 ? _this$currentMutation : getDefaultState();
	_classPrivateFieldSet2(_currentResult, this, _objectSpread2(_objectSpread2({}, state), {}, {
		isPending: state.status === "pending",
		isSuccess: state.status === "success",
		isError: state.status === "error",
		isIdle: state.status === "idle",
		mutate: this.mutate,
		reset: this.reset
	}));
}
function _notify(action) {
	notifyManager.batch(() => {
		if (_classPrivateFieldGet2(_mutateOptions, this) && this.hasListeners()) {
			const variables = _classPrivateFieldGet2(_currentResult, this).variables;
			const onMutateResult = _classPrivateFieldGet2(_currentResult, this).context;
			const context = {
				client: _classPrivateFieldGet2(_client, this),
				meta: this.options.meta,
				mutationKey: this.options.mutationKey
			};
			if ((action === null || action === void 0 ? void 0 : action.type) === "success") {
				try {
					var _classPrivateFieldGet7, _classPrivateFieldGet8;
					(_classPrivateFieldGet7 = (_classPrivateFieldGet8 = _classPrivateFieldGet2(_mutateOptions, this)).onSuccess) === null || _classPrivateFieldGet7 === void 0 || _classPrivateFieldGet7.call(_classPrivateFieldGet8, action.data, variables, onMutateResult, context);
				} catch (e) {
					Promise.reject(e);
				}
				try {
					var _classPrivateFieldGet9, _classPrivateFieldGet10;
					(_classPrivateFieldGet9 = (_classPrivateFieldGet10 = _classPrivateFieldGet2(_mutateOptions, this)).onSettled) === null || _classPrivateFieldGet9 === void 0 || _classPrivateFieldGet9.call(_classPrivateFieldGet10, action.data, null, variables, onMutateResult, context);
				} catch (e) {
					Promise.reject(e);
				}
			} else if ((action === null || action === void 0 ? void 0 : action.type) === "error") {
				try {
					var _classPrivateFieldGet11, _classPrivateFieldGet12;
					(_classPrivateFieldGet11 = (_classPrivateFieldGet12 = _classPrivateFieldGet2(_mutateOptions, this)).onError) === null || _classPrivateFieldGet11 === void 0 || _classPrivateFieldGet11.call(_classPrivateFieldGet12, action.error, variables, onMutateResult, context);
				} catch (e) {
					Promise.reject(e);
				}
				try {
					var _classPrivateFieldGet13, _classPrivateFieldGet14;
					(_classPrivateFieldGet13 = (_classPrivateFieldGet14 = _classPrivateFieldGet2(_mutateOptions, this)).onSettled) === null || _classPrivateFieldGet13 === void 0 || _classPrivateFieldGet13.call(_classPrivateFieldGet14, void 0, action.error, variables, onMutateResult, context);
				} catch (e) {
					Promise.reject(e);
				}
			}
		}
		this.listeners.forEach((listener) => {
			listener(_classPrivateFieldGet2(_currentResult, this));
		});
	});
}
var _client, _currentResult, _currentMutation, _mutateOptions, _Class_brand, MutationObserver;
var init_mutationObserver = __esmMin((() => {
	init_mutation();
	init_notifyManager();
	init_subscribable();
	init_utils();
	init_classPrivateMethodInitSpec();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_assertClassBrand();
	init_classPrivateFieldGet2();
	init_objectSpread2();
	MutationObserver = (_client = /* @__PURE__ */ new WeakMap(), _currentResult = /* @__PURE__ */ new WeakMap(), _currentMutation = /* @__PURE__ */ new WeakMap(), _mutateOptions = /* @__PURE__ */ new WeakMap(), _Class_brand = /* @__PURE__ */ new WeakSet(), class extends Subscribable {
		constructor(client, options) {
			super();
			_classPrivateMethodInitSpec(this, _Class_brand);
			_classPrivateFieldInitSpec(this, _client, void 0);
			_classPrivateFieldInitSpec(this, _currentResult, void 0);
			_classPrivateFieldInitSpec(this, _currentMutation, void 0);
			_classPrivateFieldInitSpec(this, _mutateOptions, void 0);
			_classPrivateFieldSet2(_client, this, client);
			this.setOptions(options);
			this.bindMethods();
			_assertClassBrand(_Class_brand, this, _updateResult).call(this);
		}
		bindMethods() {
			this.mutate = this.mutate.bind(this);
			this.reset = this.reset.bind(this);
		}
		setOptions(options) {
			var _classPrivateFieldGet2$2;
			const prevOptions = this.options;
			this.options = _classPrivateFieldGet2(_client, this).defaultMutationOptions(options);
			if (!shallowEqualObjects(this.options, prevOptions)) _classPrivateFieldGet2(_client, this).getMutationCache().notify({
				type: "observerOptionsUpdated",
				mutation: _classPrivateFieldGet2(_currentMutation, this),
				observer: this
			});
			if ((prevOptions === null || prevOptions === void 0 ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) this.reset();
			else if (((_classPrivateFieldGet2$2 = _classPrivateFieldGet2(_currentMutation, this)) === null || _classPrivateFieldGet2$2 === void 0 ? void 0 : _classPrivateFieldGet2$2.state.status) === "pending") _classPrivateFieldGet2(_currentMutation, this).setOptions(this.options);
		}
		onUnsubscribe() {
			if (!this.hasListeners()) {
				var _classPrivateFieldGet3;
				(_classPrivateFieldGet3 = _classPrivateFieldGet2(_currentMutation, this)) === null || _classPrivateFieldGet3 === void 0 || _classPrivateFieldGet3.removeObserver(this);
			}
		}
		onMutationUpdate(action) {
			_assertClassBrand(_Class_brand, this, _updateResult).call(this);
			_assertClassBrand(_Class_brand, this, _notify).call(this, action);
		}
		getCurrentResult() {
			return _classPrivateFieldGet2(_currentResult, this);
		}
		reset() {
			var _classPrivateFieldGet4;
			(_classPrivateFieldGet4 = _classPrivateFieldGet2(_currentMutation, this)) === null || _classPrivateFieldGet4 === void 0 || _classPrivateFieldGet4.removeObserver(this);
			_classPrivateFieldSet2(_currentMutation, this, void 0);
			_assertClassBrand(_Class_brand, this, _updateResult).call(this);
			_assertClassBrand(_Class_brand, this, _notify).call(this);
		}
		mutate(variables, options) {
			var _classPrivateFieldGet5;
			_classPrivateFieldSet2(_mutateOptions, this, options);
			(_classPrivateFieldGet5 = _classPrivateFieldGet2(_currentMutation, this)) === null || _classPrivateFieldGet5 === void 0 || _classPrivateFieldGet5.removeObserver(this);
			_classPrivateFieldSet2(_currentMutation, this, _classPrivateFieldGet2(_client, this).getMutationCache().build(_classPrivateFieldGet2(_client, this), this.options));
			_classPrivateFieldGet2(_currentMutation, this).addObserver(this);
			return _classPrivateFieldGet2(_currentMutation, this).execute(variables);
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/queryCache.js
var _queries, QueryCache;
var init_queryCache = __esmMin((() => {
	init_utils();
	init_query();
	init_notifyManager();
	init_subscribable();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_objectSpread2();
	QueryCache = (_queries = /* @__PURE__ */ new WeakMap(), class extends Subscribable {
		constructor(config = {}) {
			super();
			_classPrivateFieldInitSpec(this, _queries, void 0);
			this.config = config;
			_classPrivateFieldSet2(_queries, this, /* @__PURE__ */ new Map());
		}
		build(client, options, state) {
			var _options$queryHash;
			const queryKey = options.queryKey;
			const queryHash = (_options$queryHash = options.queryHash) !== null && _options$queryHash !== void 0 ? _options$queryHash : hashQueryKeyByOptions(queryKey, options);
			let query = this.get(queryHash);
			if (!query) {
				query = new Query({
					client,
					queryKey,
					queryHash,
					options: client.defaultQueryOptions(options),
					state,
					defaultOptions: client.getQueryDefaults(queryKey)
				});
				this.add(query);
			}
			return query;
		}
		add(query) {
			if (!_classPrivateFieldGet2(_queries, this).has(query.queryHash)) {
				_classPrivateFieldGet2(_queries, this).set(query.queryHash, query);
				this.notify({
					type: "added",
					query
				});
			}
		}
		remove(query) {
			const queryInMap = _classPrivateFieldGet2(_queries, this).get(query.queryHash);
			if (queryInMap) {
				query.destroy();
				if (queryInMap === query) _classPrivateFieldGet2(_queries, this).delete(query.queryHash);
				this.notify({
					type: "removed",
					query
				});
			}
		}
		clear() {
			notifyManager.batch(() => {
				this.getAll().forEach((query) => {
					this.remove(query);
				});
			});
		}
		get(queryHash) {
			return _classPrivateFieldGet2(_queries, this).get(queryHash);
		}
		getAll() {
			return [..._classPrivateFieldGet2(_queries, this).values()];
		}
		find(filters) {
			const defaultedFilters = _objectSpread2({ exact: true }, filters);
			return this.getAll().find((query) => matchQuery(defaultedFilters, query));
		}
		findAll(filters = {}) {
			const queries = this.getAll();
			return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
		}
		notify(event) {
			notifyManager.batch(() => {
				this.listeners.forEach((listener) => {
					listener(event);
				});
			});
		}
		onFocus() {
			notifyManager.batch(() => {
				this.getAll().forEach((query) => {
					query.onFocus();
				});
			});
		}
		onOnline() {
			notifyManager.batch(() => {
				this.getAll().forEach((query) => {
					query.onOnline();
				});
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/queryClient.js
var _queryCache, _mutationCache, _defaultOptions, _queryDefaults, _mutationDefaults, _mountCount, _unsubscribeFocus, _unsubscribeOnline, QueryClient;
var init_queryClient = __esmMin((() => {
	init_utils();
	init_queryCache();
	init_mutationCache();
	init_focusManager();
	init_onlineManager();
	init_notifyManager();
	init_classPrivateFieldInitSpec();
	init_classPrivateFieldSet2();
	init_classPrivateFieldGet2();
	init_asyncToGenerator();
	init_objectSpread2();
	QueryClient = (_queryCache = /* @__PURE__ */ new WeakMap(), _mutationCache = /* @__PURE__ */ new WeakMap(), _defaultOptions = /* @__PURE__ */ new WeakMap(), _queryDefaults = /* @__PURE__ */ new WeakMap(), _mutationDefaults = /* @__PURE__ */ new WeakMap(), _mountCount = /* @__PURE__ */ new WeakMap(), _unsubscribeFocus = /* @__PURE__ */ new WeakMap(), _unsubscribeOnline = /* @__PURE__ */ new WeakMap(), class {
		constructor(config = {}) {
			_classPrivateFieldInitSpec(this, _queryCache, void 0);
			_classPrivateFieldInitSpec(this, _mutationCache, void 0);
			_classPrivateFieldInitSpec(this, _defaultOptions, void 0);
			_classPrivateFieldInitSpec(this, _queryDefaults, void 0);
			_classPrivateFieldInitSpec(this, _mutationDefaults, void 0);
			_classPrivateFieldInitSpec(this, _mountCount, void 0);
			_classPrivateFieldInitSpec(this, _unsubscribeFocus, void 0);
			_classPrivateFieldInitSpec(this, _unsubscribeOnline, void 0);
			_classPrivateFieldSet2(_queryCache, this, config.queryCache || new QueryCache());
			_classPrivateFieldSet2(_mutationCache, this, config.mutationCache || new MutationCache());
			_classPrivateFieldSet2(_defaultOptions, this, config.defaultOptions || {});
			_classPrivateFieldSet2(_queryDefaults, this, /* @__PURE__ */ new Map());
			_classPrivateFieldSet2(_mutationDefaults, this, /* @__PURE__ */ new Map());
			_classPrivateFieldSet2(_mountCount, this, 0);
		}
		mount() {
			var _this = this, _this$mountCount;
			_classPrivateFieldSet2(_mountCount, this, (_this$mountCount = _classPrivateFieldGet2(_mountCount, this), _this$mountCount++, _this$mountCount));
			if (_classPrivateFieldGet2(_mountCount, this) !== 1) return;
			_classPrivateFieldSet2(_unsubscribeFocus, this, focusManager.subscribe(function() {
				var _ref = _asyncToGenerator(function* (focused) {
					if (focused) {
						yield _this.resumePausedMutations();
						_classPrivateFieldGet2(_queryCache, _this).onFocus();
					}
				});
				return function(_x) {
					return _ref.apply(this, arguments);
				};
			}()));
			_classPrivateFieldSet2(_unsubscribeOnline, this, onlineManager.subscribe(function() {
				var _ref2 = _asyncToGenerator(function* (online) {
					if (online) {
						yield _this.resumePausedMutations();
						_classPrivateFieldGet2(_queryCache, _this).onOnline();
					}
				});
				return function(_x2) {
					return _ref2.apply(this, arguments);
				};
			}()));
		}
		unmount() {
			var _this$mountCount3, _classPrivateFieldGet2$1, _classPrivateFieldGet3;
			_classPrivateFieldSet2(_mountCount, this, (_this$mountCount3 = _classPrivateFieldGet2(_mountCount, this), _this$mountCount3--, _this$mountCount3));
			if (_classPrivateFieldGet2(_mountCount, this) !== 0) return;
			(_classPrivateFieldGet2$1 = _classPrivateFieldGet2(_unsubscribeFocus, this)) === null || _classPrivateFieldGet2$1 === void 0 || _classPrivateFieldGet2$1.call(this);
			_classPrivateFieldSet2(_unsubscribeFocus, this, void 0);
			(_classPrivateFieldGet3 = _classPrivateFieldGet2(_unsubscribeOnline, this)) === null || _classPrivateFieldGet3 === void 0 || _classPrivateFieldGet3.call(this);
			_classPrivateFieldSet2(_unsubscribeOnline, this, void 0);
		}
		isFetching(filters) {
			return _classPrivateFieldGet2(_queryCache, this).findAll(_objectSpread2(_objectSpread2({}, filters), {}, { fetchStatus: "fetching" })).length;
		}
		isMutating(filters) {
			return _classPrivateFieldGet2(_mutationCache, this).findAll(_objectSpread2(_objectSpread2({}, filters), {}, { status: "pending" })).length;
		}
		/**
		* Imperative (non-reactive) way to retrieve data for a QueryKey.
		* Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
		*
		* Hint: Do not use this function inside a component, because it won't receive updates.
		* Use `useQuery` to create a `QueryObserver` that subscribes to changes.
		*/
		getQueryData(queryKey) {
			var _classPrivateFieldGet4;
			const options = this.defaultQueryOptions({ queryKey });
			return (_classPrivateFieldGet4 = _classPrivateFieldGet2(_queryCache, this).get(options.queryHash)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.state.data;
		}
		ensureQueryData(options) {
			const defaultedOptions = this.defaultQueryOptions(options);
			const query = _classPrivateFieldGet2(_queryCache, this).build(this, defaultedOptions);
			const cachedData = query.state.data;
			if (cachedData === void 0) return this.fetchQuery(options);
			if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
			return Promise.resolve(cachedData);
		}
		getQueriesData(filters) {
			return _classPrivateFieldGet2(_queryCache, this).findAll(filters).map(({ queryKey, state }) => {
				return [queryKey, state.data];
			});
		}
		setQueryData(queryKey, updater, options) {
			const defaultedOptions = this.defaultQueryOptions({ queryKey });
			const query = _classPrivateFieldGet2(_queryCache, this).get(defaultedOptions.queryHash);
			const data = functionalUpdate(updater, query === null || query === void 0 ? void 0 : query.state.data);
			if (data === void 0) return;
			return _classPrivateFieldGet2(_queryCache, this).build(this, defaultedOptions).setData(data, _objectSpread2(_objectSpread2({}, options), {}, { manual: true }));
		}
		setQueriesData(filters, updater, options) {
			return notifyManager.batch(() => _classPrivateFieldGet2(_queryCache, this).findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
		}
		getQueryState(queryKey) {
			var _classPrivateFieldGet5;
			const options = this.defaultQueryOptions({ queryKey });
			return (_classPrivateFieldGet5 = _classPrivateFieldGet2(_queryCache, this).get(options.queryHash)) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.state;
		}
		removeQueries(filters) {
			const queryCache = _classPrivateFieldGet2(_queryCache, this);
			notifyManager.batch(() => {
				queryCache.findAll(filters).forEach((query) => {
					queryCache.remove(query);
				});
			});
		}
		resetQueries(filters, options) {
			const queryCache = _classPrivateFieldGet2(_queryCache, this);
			return notifyManager.batch(() => {
				queryCache.findAll(filters).forEach((query) => {
					query.reset();
				});
				return this.refetchQueries(_objectSpread2({ type: "active" }, filters), options);
			});
		}
		cancelQueries(filters, cancelOptions = {}) {
			const defaultedCancelOptions = _objectSpread2({ revert: true }, cancelOptions);
			const promises = notifyManager.batch(() => _classPrivateFieldGet2(_queryCache, this).findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
			return Promise.all(promises).then(noop).catch(noop);
		}
		invalidateQueries(filters, options = {}) {
			return notifyManager.batch(() => {
				var _ref3, _filters$refetchType;
				_classPrivateFieldGet2(_queryCache, this).findAll(filters).forEach((query) => {
					query.invalidate();
				});
				if ((filters === null || filters === void 0 ? void 0 : filters.refetchType) === "none") return Promise.resolve();
				return this.refetchQueries(_objectSpread2(_objectSpread2({}, filters), {}, { type: (_ref3 = (_filters$refetchType = filters === null || filters === void 0 ? void 0 : filters.refetchType) !== null && _filters$refetchType !== void 0 ? _filters$refetchType : filters === null || filters === void 0 ? void 0 : filters.type) !== null && _ref3 !== void 0 ? _ref3 : "active" }), options);
			});
		}
		refetchQueries(filters, options = {}) {
			var _options$cancelRefetc;
			const fetchOptions = _objectSpread2(_objectSpread2({}, options), {}, { cancelRefetch: (_options$cancelRefetc = options.cancelRefetch) !== null && _options$cancelRefetc !== void 0 ? _options$cancelRefetc : true });
			const promises = notifyManager.batch(() => _classPrivateFieldGet2(_queryCache, this).findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
				let promise = query.fetch(void 0, fetchOptions);
				if (!fetchOptions.throwOnError) promise = promise.catch(noop);
				return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
			}));
			return Promise.all(promises).then(noop);
		}
		fetchQuery(options) {
			const defaultedOptions = this.defaultQueryOptions(options);
			if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
			const query = _classPrivateFieldGet2(_queryCache, this).build(this, defaultedOptions);
			return query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
		}
		prefetchQuery(options) {
			return this.fetchQuery(options).then(noop).catch(noop);
		}
		fetchInfiniteQuery(options) {
			options._type = "infinite";
			return this.fetchQuery(options);
		}
		prefetchInfiniteQuery(options) {
			return this.fetchInfiniteQuery(options).then(noop).catch(noop);
		}
		ensureInfiniteQueryData(options) {
			options._type = "infinite";
			return this.ensureQueryData(options);
		}
		resumePausedMutations() {
			if (onlineManager.isOnline()) return _classPrivateFieldGet2(_mutationCache, this).resumePausedMutations();
			return Promise.resolve();
		}
		getQueryCache() {
			return _classPrivateFieldGet2(_queryCache, this);
		}
		getMutationCache() {
			return _classPrivateFieldGet2(_mutationCache, this);
		}
		getDefaultOptions() {
			return _classPrivateFieldGet2(_defaultOptions, this);
		}
		setDefaultOptions(options) {
			_classPrivateFieldSet2(_defaultOptions, this, options);
		}
		setQueryDefaults(queryKey, options) {
			_classPrivateFieldGet2(_queryDefaults, this).set(hashKey(queryKey), {
				queryKey,
				defaultOptions: options
			});
		}
		getQueryDefaults(queryKey) {
			const defaults = [..._classPrivateFieldGet2(_queryDefaults, this).values()];
			const result = {};
			defaults.forEach((queryDefault) => {
				if (partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
			});
			return result;
		}
		setMutationDefaults(mutationKey, options) {
			_classPrivateFieldGet2(_mutationDefaults, this).set(hashKey(mutationKey), {
				mutationKey,
				defaultOptions: options
			});
		}
		getMutationDefaults(mutationKey) {
			const defaults = [..._classPrivateFieldGet2(_mutationDefaults, this).values()];
			const result = {};
			defaults.forEach((queryDefault) => {
				if (partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
			});
			return result;
		}
		defaultQueryOptions(options) {
			if (options._defaulted) return options;
			const defaultedOptions = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, _classPrivateFieldGet2(_defaultOptions, this).queries), this.getQueryDefaults(options.queryKey)), options), {}, { _defaulted: true });
			if (!defaultedOptions.queryHash) defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
			if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
			if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
			if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
			if (defaultedOptions.queryFn === skipToken) defaultedOptions.enabled = false;
			return defaultedOptions;
		}
		defaultMutationOptions(options) {
			if (options === null || options === void 0 ? void 0 : options._defaulted) return options;
			return _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, _classPrivateFieldGet2(_defaultOptions, this).mutations), (options === null || options === void 0 ? void 0 : options.mutationKey) && this.getMutationDefaults(options.mutationKey)), options), {}, { _defaulted: true });
		}
		clear() {
			_classPrivateFieldGet2(_queryCache, this).clear();
			_classPrivateFieldGet2(_mutationCache, this).clear();
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/types.js
var init_types = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-core@5.100.10/node_modules/@tanstack/query-core/build/modern/index.js
var init_modern = __esmMin((() => {
	init_hydration();
	init_mutationCache();
	init_mutationObserver();
	init_notifyManager();
	init_queryCache();
	init_queryClient();
	init_queryObserver();
	init_utils();
	init_types();
}));
//#endregion
export { MutationCache as a, defaultShouldDehydrateQuery as c, isServer as d, matchQuery as f, MutationObserver as i, hydrate as l, shouldThrowError as m, QueryClient as n, QueryObserver as o, partialMatchKey as p, QueryCache as r, notifyManager as s, init_modern as t, hashKey as u };

import { a as __toESM, n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { l as markRaw } from "./vue-CeNp4lbs.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { I as checkErrorJwtExpired, J as init_dist } from "./zova-BE4e4PxD.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { K as cast, N as SymbolBeanFullName, O as createBeanDecorator, S as Virtual, U as BeanSimple, j as BeanBase, k as BeanInfo, m as BeanScopeBase, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, l as Service, o as Bean, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { c as defaultShouldDehydrateQuery, l as hydrate, u as hashKey } from "./tanstack-query-ChvwIT2C.js";
import { a as QueryClient, i as VueQueryPlugin, n as useMutation, o as QueryCache, r as useQuery, s as useQueryClient, t as init_modern } from "./tanstack-query-CzdHw24f.js";
import { t as require_localforage } from "./localforage-e6vl49GD.js";
import { n as experimental_createQueryPersister, t as init_modern$1 } from "./tanstack-query-p_BdftBN.js";
//#region src/suite-vendor/a-zova/modules/a-model/src/types/model.ts
var init_model$1 = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/types/query.ts
function resolveStaleTime(staleTime, query) {
	return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveMaxAgeTime(maxAge, query) {
	return typeof maxAge === "function" ? maxAge(query) : maxAge;
}
var init_query = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/types/index.ts
var init_types = __esmMin((() => {
	init_model$1();
	init_query();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/.metadata/this.ts
var __ThisModule__;
var init_this = __esmMin((() => {
	init__metadata();
	__ThisModule__ = "a-model";
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/common/cookieWrapper.ts
var CookieWrapper;
var init_cookieWrapper = __esmMin((() => {
	init_src$1();
	init_this();
	init_types();
	init_objectSpread2();
	CookieWrapper = class extends BeanSimple {
		constructor(...args) {
			super(...args);
			this.options = void 0;
			this.query = void 0;
		}
		__init__(options, query) {
			this.options = options;
			this.query = query;
		}
		getItem(key) {
			return this.app.meta.cookie.getItem(key);
		}
		setItem(key, value) {
			const configScope = this.bean.scope(__ThisModule__).config;
			const opts = _objectSpread2({}, configScope.persister.cookie.options);
			let maxAge = resolveMaxAgeTime(this.options.maxAge, this.query);
			if (maxAge !== void 0) {
				if (maxAge === Infinity) maxAge = 1e3 * 60 * 60 * 24 * 365;
				opts.expires = new Date(Date.now() + maxAge);
			}
			this.app.meta.cookie.setItem(key, value, opts);
		}
		removeItem(key) {
			this.app.meta.cookie.removeItem(key);
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.last.ts
var BeanModelLast;
var init_bean_model_last = __esmMin((() => {
	init_src$1();
	init_this();
	init_asyncToGenerator();
	BeanModelLast = class extends BeanBase {
		constructor(selector) {
			var _this$$onionOptions;
			super();
			this.selector = void 0;
			if ((_this$$onionOptions = this.$onionOptions) === null || _this$$onionOptions === void 0 ? void 0 : _this$$onionOptions.enableSelector) this.selector = selector !== null && selector !== void 0 ? selector : "";
		}
		__init__(_selector) {
			return _asyncToGenerator(function* () {})();
		}
		get $onionOptions() {
			return super.$onionOptions;
		}
		get self() {
			return cast(this);
		}
		get scopeSelf() {
			return this.bean.scope(__ThisModule__);
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts
var import_localforage$1, BeanModelPersister;
var init_bean_model_persister = __esmMin((() => {
	init_modern$1();
	import_localforage$1 = /* @__PURE__ */ __toESM(require_localforage(), 1);
	init_src$1();
	init_cookieWrapper();
	init_types();
	init_bean_model_last();
	init_objectSpread2();
	BeanModelPersister = class extends BeanModelLast {
		_persisterLoad_inner(storage, storageKey, storedData, query, options) {
			if (!storedData) return void 0;
			const persistedQuery = options.deserialize ? options.deserialize(storedData, options.deserializeDefault) : options.deserializeDefault(storedData);
			if (persistedQuery.state.dataUpdatedAt) {
				var _resolveMaxAgeTime;
				const expired = Date.now() - persistedQuery.state.dataUpdatedAt > ((_resolveMaxAgeTime = resolveMaxAgeTime(options.maxAge, query)) !== null && _resolveMaxAgeTime !== void 0 ? _resolveMaxAgeTime : Infinity);
				const busted = persistedQuery.buster !== options.buster;
				if (expired || busted) storage.removeItem(storageKey);
				else {
					query.setState({
						dataUpdatedAt: persistedQuery.state.dataUpdatedAt,
						errorUpdatedAt: persistedQuery.state.errorUpdatedAt
					});
					return persistedQuery.state.data;
				}
			} else storage.removeItem(storageKey);
		}
		$persisterLoad(queryKey) {
			var _query$meta;
			const query = this.self.$queryFind({ queryKey });
			if (!query) return void 0;
			const options = this._adjustPersisterOptions((_query$meta = query.meta) === null || _query$meta === void 0 ? void 0 : _query$meta.persister);
			if (!options) return void 0;
			const storage = this._getPersisterStorage(options, query);
			if (!storage) return void 0;
			const storageKey = this._getPersisterStorageKey(options, query);
			try {
				const storedData = storage.getItem(storageKey);
				if (options.sync) return this._persisterLoad_inner(storage, storageKey, storedData, query, options);
				else return storedData.then((storedData) => {
					return this._persisterLoad_inner(storage, storageKey, storedData, query, options);
				});
			} catch (err) {
				storage.removeItem(storageKey);
			}
		}
		$persisterSave(queryKey) {
			var _query$meta2;
			const query = this.self.$queryFind({ queryKey });
			if (!query) return;
			const options = this._adjustPersisterOptions((_query$meta2 = query.meta) === null || _query$meta2 === void 0 ? void 0 : _query$meta2.persister);
			if (!options) return;
			const storage = this._getPersisterStorage(options, query);
			if (!storage) return;
			const storageKey = this._getPersisterStorageKey(options, query);
			const params = {
				state: query.state,
				queryKey: query.queryKey,
				queryHash: query.queryHash,
				buster: options.buster
			};
			const data = options.serialize ? options.serialize(params, options.serializeDefault) : options.serializeDefault(params);
			if (options.sync === true) storage.setItem(storageKey, data);
			else setTimeout(() => {
				storage.setItem(storageKey, data);
			}, 0);
		}
		$persisterRemove(queryKey) {
			var _query$meta3;
			const query = this.self.$queryFind({ queryKey });
			if (!query) return;
			const options = this._adjustPersisterOptions((_query$meta3 = query.meta) === null || _query$meta3 === void 0 ? void 0 : _query$meta3.persister);
			if (!options) return;
			const storage = this._getPersisterStorage(options, query);
			if (!storage) return;
			const storageKey = this._getPersisterStorageKey(options, query);
			if (options.sync === true) storage.removeItem(storageKey);
			else setTimeout(() => {
				storage.removeItem(storageKey);
			}, 0);
		}
		_createPersister(options) {
			options = this._adjustPersisterOptions(options);
			if (!options) return void 0;
			return experimental_createQueryPersister({
				storage: this._getPersisterStorage(options),
				maxAge: options.maxAge,
				refetchOnRestore: options.refetchOnRestore,
				prefix: options.prefix,
				buster: options.buster
			}).persisterFn;
		}
		_adjustPersisterOptions(options) {
			var _options$storage, _options$maxAge, _options$refetchOnRes, _options$prefix, _options$buster, _options$serializeDef, _options$deserializeD;
			if (options === false) return void 0;
			if (options === void 0 || options === true) options = {};
			else options = _objectSpread2({}, options);
			options.storage = (_options$storage = options.storage) !== null && _options$storage !== void 0 ? _options$storage : options.sync ? "local" : "db";
			options.maxAge = (_options$maxAge = options.maxAge) !== null && _options$maxAge !== void 0 ? _options$maxAge : this.scopeSelf.config.persister.maxAge[options.storage];
			options.refetchOnRestore = (_options$refetchOnRes = options.refetchOnRestore) !== null && _options$refetchOnRes !== void 0 ? _options$refetchOnRes : this.scopeSelf.config.persister.refetchOnRestore;
			options.prefix = (_options$prefix = options.prefix) !== null && _options$prefix !== void 0 ? _options$prefix : this._getPersisterPrefix();
			options.buster = (_options$buster = options.buster) !== null && _options$buster !== void 0 ? _options$buster : this._getPersisterBuster();
			options.serializeDefault = (_options$serializeDef = options.serializeDefault) !== null && _options$serializeDef !== void 0 ? _options$serializeDef : JSON.stringify;
			options.deserializeDefault = (_options$deserializeD = options.deserializeDefault) !== null && _options$deserializeD !== void 0 ? _options$deserializeD : JSON.parse;
			return options;
		}
		_getPersisterStorageKey(options, query) {
			if (options.storageKeySimplify) return String(query.queryKey[query.queryKey.length - 1]);
			return `${options.prefix}-${query.queryHash}`;
		}
		_getPersisterStorage(options, query) {
			options = this._adjustPersisterOptions(options);
			if (!options) return void 0;
			if (options.storage === "cookie") return this.bean._newBeanSimple(CookieWrapper, false, options, query);
			if (options.storage === "local") return localStorage;
			if (options.storage === "db") return import_localforage$1.default;
		}
		_getPersisterPrefix() {
			return `${this.sys.env.APP_NAME}-query`;
		}
		_getPersisterBuster() {
			return this.sys.env.APP_VERSION;
		}
		_forceQueryKeyPrefix(queryKey) {
			if (!queryKey) queryKey = [];
			if (!this._prefixIsBeanFullName(queryKey[0])) {
				var _this$$onionOptions;
				const prefixes = [this[SymbolBeanFullName]];
				if ((_this$$onionOptions = this.$onionOptions) === null || _this$$onionOptions === void 0 ? void 0 : _this$$onionOptions.enableSelector) prefixes.push(this.selector);
				queryKey = prefixes.concat(queryKey);
			}
			return queryKey;
		}
		_prefixIsBeanFullName(prefix) {
			return prefix === this[SymbolBeanFullName];
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.local.ts
var BeanModelLocal;
var init_bean_model_local = __esmMin((() => {
	init_bean_model_persister();
	BeanModelLocal = class extends BeanModelPersister {
		$serializeLocal(obj) {
			var _obj$state;
			return JSON.stringify(obj === null || obj === void 0 || (_obj$state = obj.state) === null || _obj$state === void 0 ? void 0 : _obj$state.data);
		}
		$deserializeLocal(value) {
			return {
				state: {
					data: value ? JSON.parse(value) : void 0,
					dataUpdateCount: 0,
					dataUpdatedAt: Date.now(),
					error: null,
					errorUpdateCount: 0,
					errorUpdatedAt: 0,
					fetchFailureCount: 0,
					fetchFailureReason: null,
					fetchMeta: null,
					isInvalidated: false,
					status: "success",
					fetchStatus: "idle"
				},
				queryKey: void 0,
				queryHash: void 0,
				buster: this._getPersisterBuster()
			};
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.cookie.ts
var BeanModelCookie;
var init_bean_model_cookie = __esmMin((() => {
	init_bean_model_local();
	BeanModelCookie = class extends BeanModelLocal {
		$serializeCookie(obj) {
			var _obj$state$data, _obj$state;
			return String((_obj$state$data = obj === null || obj === void 0 || (_obj$state = obj.state) === null || _obj$state === void 0 ? void 0 : _obj$state.data) !== null && _obj$state$data !== void 0 ? _obj$state$data : "");
		}
		$deserializeCookie(value) {
			return {
				state: {
					data: value,
					dataUpdateCount: 0,
					dataUpdatedAt: Date.now(),
					error: null,
					errorUpdateCount: 0,
					errorUpdatedAt: 0,
					fetchFailureCount: 0,
					fetchFailureReason: null,
					fetchMeta: null,
					isInvalidated: false,
					status: "success",
					fetchStatus: "idle"
				},
				queryKey: void 0,
				queryHash: void 0,
				buster: this._getPersisterBuster()
			};
		}
		_cookieCoerce(value, cookieType) {
			if (value === void 0 || value === "") return void 0;
			if (!cookieType || cookieType === "auto") return value === "true" ? true : value === "false" ? false : value;
			else if (cookieType === "boolean") return value === "true" ? true : value === "false" ? false : Boolean(Number(value));
			else if (cookieType === "number") return Number(value);
			else if (cookieType === "date") return new Date(value);
			else if (cookieType === "string") return value;
			return value;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.query.ts
var import_localforage, BeanModelQuery;
var init_bean_model_query = __esmMin((() => {
	import_localforage = /* @__PURE__ */ __toESM(require_localforage(), 1);
	init_src$1();
	init_bean_model_cookie();
	init_asyncToGenerator();
	init_objectSpread2();
	BeanModelQuery = class extends BeanModelCookie {
		$setQueryData(queryKey, updater, persisterSave, options) {
			queryKey = this._forceQueryKeyPrefix(queryKey);
			const data = this.$queryClient.setQueryData(queryKey, updater, options);
			if (data === void 0) {
				if (persisterSave) this.$persisterRemove(queryKey);
				this.$setQueryDataDirect(queryKey, data);
			} else if (persisterSave) this.$persisterSave(queryKey);
			return data;
		}
		$queryFind(filters) {
			filters = this.$normalizeFilters(filters);
			return this.$queryClient.getQueryCache().find(filters);
		}
		$invalidateQueries(filters, options) {
			filters = this.$normalizeFilters(filters);
			return this.$queryClient.invalidateQueries(filters, options);
		}
		$refetchQueries(filters, options) {
			filters = this.$normalizeFilters(filters);
			return this.$queryClient.refetchQueries(filters, options);
		}
		$setQueryDataDirect(queryKey, value) {
			const query = this.$queryFind({
				queryKey,
				exact: true
			});
			query === null || query === void 0 || query.setData(value);
		}
		$clear() {
			var _this = this;
			return _asyncToGenerator(function* () {
				const queries = _this.$queryClient.getQueryCache().getAll();
				for (const query of queries) query === null || query === void 0 || query.setData(void 0);
				yield import_localforage.default.clear();
			})();
		}
		$normalizeFilters(filters) {
			if (!filters) filters = {};
			const queryKey = this._forceQueryKeyPrefix(cast(filters).queryKey);
			return _objectSpread2(_objectSpread2({}, filters), {}, { queryKey });
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts
var BeanModelUseQuery;
var init_bean_model_useQuery = __esmMin((() => {
	init_dist();
	init_modern();
	init_src$1();
	init_types();
	init_bean_model_query();
	BeanModelUseQuery = class extends BeanModelQuery {
		$useQuery(options, queryClient) {
			var _options$meta, _cast$meta, _options$meta2, _options$meta3;
			const queryKey = this.self._forceQueryKeyPrefix(options.queryKey);
			const persister = this._createPersister((_options$meta = options.meta) === null || _options$meta === void 0 ? void 0 : _options$meta.persister);
			const optionsDefault = {};
			if (!((_cast$meta = cast(options).meta) === null || _cast$meta === void 0 ? void 0 : _cast$meta.disableErrorEffect)) optionsDefault.throwOnError = (error, query) => {
				var _cast$meta2, _errorInfo;
				let errorInfo = (_cast$meta2 = cast(options).meta) === null || _cast$meta2 === void 0 ? void 0 : _cast$meta2.errorInfo;
				if (typeof errorInfo === "function") errorInfo = errorInfo(error, query);
				if (!error.message.includes("useQuery:") && !checkErrorJwtExpired(error)) error.message = `useQuery: [${queryKey.join(", ")}]: ${error.message}`;
				this.$errorHandler(error, (_errorInfo = errorInfo) !== null && _errorInfo !== void 0 ? _errorInfo : "useQuery");
				return false;
			};
			options = Object.assign(optionsDefault, options, {
				queryKey,
				persister
			});
			if ((typeof ((_options$meta2 = options.meta) === null || _options$meta2 === void 0 ? void 0 : _options$meta2.persister) === "object" && ((_options$meta3 = options.meta) === null || _options$meta3 === void 0 || (_options$meta3 = _options$meta3.persister) === null || _options$meta3 === void 0 ? void 0 : _options$meta3.sync)) !== true) {
				var _options$staleTime;
				const staleTime = (_options$staleTime = options.staleTime) !== null && _options$staleTime !== void 0 ? _options$staleTime : this.scopeSelf.config.query.staleTime.async;
				const queryCache = this.$queryFind({ queryKey });
				const queryCacheExists = (queryCache === null || queryCache === void 0 ? void 0 : queryCache.state.data) !== void 0;
				options.staleTime = (query) => {
					if (this.ctx.meta.$ssr.isRuntimeSsrPreHydration && queryCacheExists) return resolveStaleTime(this.scopeSelf.config.query.staleTime.ssr, query);
					return resolveStaleTime(staleTime, query);
				};
			}
			return this.ctx.util.instanceScope(() => {
				return useQuery(options, queryClient);
			});
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts
var SymbolUseQueries, SymbolUseComputeds, BeanModelUseState;
var init_bean_model_useState = __esmMin((() => {
	init_modern();
	init_src$1();
	init_bean_model_useQuery();
	init_asyncToGenerator();
	SymbolUseQueries = Symbol("SymbolUseQueries");
	SymbolUseComputeds = Symbol("SymbolUseComputeds");
	BeanModelUseState = class extends BeanModelUseQuery {
		constructor(...args) {
			super(...args);
			this[SymbolUseQueries] = {};
			this[SymbolUseComputeds] = {};
		}
		$loadStateDb(dbData) {
			return _asyncToGenerator(function* () {
				return yield dbData;
			})();
		}
		$useStateDb(options, queryClient) {
			options = deepExtend({ meta: { maxAge: this.scopeSelf.config.persister.maxAge.local } }, options, {
				enabled: false,
				staleTime: Infinity,
				meta: {
					ssr: { dehydrate: false },
					persister: {
						storage: "db",
						sync: false
					}
				}
			});
			const self = this;
			return this.$customRef(() => {
				return {
					get() {
						return self._handleAsyncDataGet(options, queryClient, true);
					},
					set(value) {
						self._handleSyncDataSet(options, queryClient, true, value);
					}
				};
			});
		}
		$useStateLocal(options, queryClient) {
			options = deepExtend({ meta: { persister: {
				serializeDefault: (obj) => {
					return this.$serializeLocal(obj);
				},
				deserializeDefault: (value) => {
					return this.$deserializeLocal(value);
				},
				storageKeySimplify: true
			} } }, options, {
				enabled: false,
				staleTime: Infinity,
				meta: { persister: {
					storage: "local",
					sync: true
				} }
			});
			const self = this;
			return this.$customRef(() => {
				return {
					get() {
						return self._handleSyncDataGet(options, queryClient, true);
					},
					set(value) {
						self._handleSyncDataSet(options, queryClient, true, value);
					}
				};
			});
		}
		$useStateCookie(options, queryClient) {
			options = deepExtend({ meta: { persister: {
				serializeDefault: (obj) => {
					return this.$serializeCookie(obj);
				},
				deserializeDefault: (value) => {
					const cookieType = options.meta.persister.cookieType;
					return this.$deserializeCookie(this._cookieCoerce(value, cookieType));
				},
				storageKeySimplify: true
			} } }, options, {
				enabled: false,
				staleTime: Infinity,
				meta: { persister: {
					storage: "cookie",
					sync: true
				} }
			});
			const self = this;
			return this.$customRef(() => {
				return {
					get() {
						return self._handleSyncDataGet(options, queryClient, true);
					},
					set(value) {
						self._handleSyncDataSet(options, queryClient, true, value);
					}
				};
			});
		}
		$useStateMem(options, queryClient) {
			options = deepExtend({}, options, {
				enabled: false,
				staleTime: Infinity,
				meta: { persister: false }
			});
			const self = this;
			return this.$customRef(() => {
				return {
					get() {
						return self._handleSyncDataGet(options, queryClient, false);
					},
					set(value) {
						self._handleSyncDataSet(options, queryClient, false, value);
					}
				};
			});
		}
		$useStateComputed(options) {
			const queryHash = hashKey(this.self._forceQueryKeyPrefix(options.queryKey));
			if (!this[SymbolUseComputeds][queryHash]) this[SymbolUseComputeds][queryHash] = this.$computed(options.queryFn, options.debugOptions);
			return this[SymbolUseComputeds][queryHash];
		}
		$useStateData(options, queryClient) {
			const queryHash = hashKey(this.self._forceQueryKeyPrefix(options.queryKey));
			if (!this[SymbolUseQueries][queryHash]) {
				var _options$meta;
				const useQuery = this.$useQuery(options, queryClient);
				this[SymbolUseQueries][queryHash] = useQuery;
				if (!((_options$meta = options.meta) === null || _options$meta === void 0 ? void 0 : _options$meta.disableSuspenseOnInit)) useQuery.suspense();
			}
			return this[SymbolUseQueries][queryHash];
		}
		_handleAsyncDataGet(options, queryClient, persister) {
			const query = this.$useStateData(options, queryClient);
			if (query.data !== void 0) return query.data;
			return this._handleAsyncDataGet_inner(options, queryClient, persister);
		}
		_handleAsyncDataGet_inner(options, queryClient, persister) {
			var _this = this;
			return _asyncToGenerator(function* () {
				const queryKey = options.queryKey;
				const query = _this.$useStateData(options, queryClient);
				if (persister) {
					const data = yield _this.$persisterLoad(queryKey);
					if (data !== void 0) _this.$setQueryData(queryKey, data, false);
				}
				if (query.data === void 0) _this._handleSyncDataGet_defaultData(queryKey, options);
				return query.data;
			})();
		}
		_handleSyncDataGet(options, queryClient, persister) {
			const queryKey = options.queryKey;
			const query = this.$useStateData(options, queryClient);
			if (query.data !== void 0) return query.data;
			if (persister) {
				const data = this.$persisterLoad(queryKey);
				if (data !== void 0) this.$setQueryData(queryKey, data, false);
			}
			if (query.data === void 0) this._handleSyncDataGet_defaultData(queryKey, options);
			return query.data;
		}
		_handleSyncDataGet_defaultData(queryKey, options) {
			var _options$meta2;
			let defaultData = (_options$meta2 = options.meta) === null || _options$meta2 === void 0 ? void 0 : _options$meta2.defaultData;
			if (typeof defaultData === "function") defaultData = defaultData();
			if (defaultData !== void 0) this.$setQueryData(queryKey, defaultData, false);
		}
		_handleSyncDataSet(options, queryClient, persister, value) {
			const queryKey = options.queryKey;
			const query = this.$useStateData(options, queryClient);
			this.$setQueryData(queryKey, value, persister);
			return query;
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useStateGeneral.ts
var BeanModelUseStateGeneral;
var init_bean_model_useStateGeneral = __esmMin((() => {
	init_bean_model_useState();
	BeanModelUseStateGeneral = class extends BeanModelUseState {
		$useState(stateType, options, queryClient) {
			switch (stateType) {
				case "db": return this.$useStateDb(options, queryClient);
				case "local": return this.$useStateLocal(options, queryClient);
				case "cookie": return this.$useStateCookie(options, queryClient);
				case "mem": return this.$useStateMem(options, queryClient);
				case "data": return this.$useStateData(options, queryClient);
			}
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useMutation.ts
var SymbolUseMutations, BeanModelUseMutation;
var init_bean_model_useMutation = __esmMin((() => {
	init_modern();
	init_src$1();
	init_bean_model_useStateGeneral();
	SymbolUseMutations = Symbol("SymbolUseMutations");
	BeanModelUseMutation = class extends BeanModelUseStateGeneral {
		constructor(...args) {
			super(...args);
			this[SymbolUseMutations] = {};
		}
		$useMutation(mutationOptions, queryClient) {
			return this.ctx.util.instanceScope(() => {
				return useMutation(mutationOptions, queryClient);
			});
		}
		$useMutationData(mutationOptions, queryClient) {
			let mutationKey = cast(mutationOptions).mutationKey;
			if (!mutationKey || mutationKey.length === 0) throw new Error("should specify mutationKey");
			mutationKey = this.self._forceQueryKeyPrefix(mutationKey);
			const mutationHash = hashKey(mutationKey);
			if (!this[SymbolUseMutations][mutationHash]) {
				var _cast$meta;
				const optionsDefault = {};
				if (!((_cast$meta = cast(mutationOptions).meta) === null || _cast$meta === void 0 ? void 0 : _cast$meta.disableErrorEffect)) optionsDefault.onError = (error, variables, context) => {
					var _cast$meta2, _errorInfo;
					let errorInfo = (_cast$meta2 = cast(mutationOptions).meta) === null || _cast$meta2 === void 0 ? void 0 : _cast$meta2.errorInfo;
					if (typeof errorInfo === "function") errorInfo = errorInfo(error, variables, context);
					this.$errorHandler(error, (_errorInfo = errorInfo) !== null && _errorInfo !== void 0 ? _errorInfo : "useMutationData");
				};
				mutationOptions = Object.assign(optionsDefault, mutationOptions, { mutationKey });
				this[SymbolUseMutations][mutationHash] = this.$useMutation(mutationOptions, queryClient);
			}
			return this[SymbolUseMutations][mutationHash];
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.first.ts
var BeanModelFirst;
var init_bean_model_first = __esmMin((() => {
	init_bean_model_useMutation();
	BeanModelFirst = class extends BeanModelUseMutation {};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/bean/bean.modelBase.ts
var _dec$2, _dec2$2, _dec3, _class$2, BeanModelBase;
var init_bean_modelBase = __esmMin((() => {
	init_src$1();
	init_src$2();
	init_bean_model_first();
	BeanModelBase = (_dec$2 = Bean(), _dec2$2 = Virtual(), _dec3 = BeanInfo({ module: "a-model" }), _dec$2(_class$2 = _dec2$2(_class$2 = _dec3(_class$2 = class BeanModelBase extends BeanModelFirst {}) || _class$2) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts
var _dec$1, _dec2$1, _class$1, ServiceStorage;
var init_storage = __esmMin((() => {
	init_asyncToGenerator();
	init_src$1();
	init_modern();
	init_src$2();
	ServiceStorage = (_dec$1 = Service(), _dec2$1 = BeanInfo({ module: "a-model" }), _dec$1(_class$1 = _dec2$1(_class$1 = class ServiceStorage extends BeanBase {
		constructor(...args) {
			super(...args);
			this._queryClient = void 0;
		}
		moduleLoaded() {
			var _this = this;
			return _asyncToGenerator(function* () {
				let options = _this.scope.config.queryClientConfig.defaultOptions;
				const vueQueryPluginOptions = { queryClient: _this._queryClient = new QueryClient({
					defaultOptions: options,
					queryCache: new QueryCache()
				}) };
				_this.app.vue.use(VueQueryPlugin, vueQueryPluginOptions);
			})();
		}
		appInitialize() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (_this2.ctx.meta.$ssr.isRuntimeSsrPreHydration) hydrate(_this2._queryClient, _this2.ctx.meta.$ssr.stateDefer.query);
			})();
		}
	}) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/config/config.ts
var defaultOptions, config;
var init_config = __esmMin((() => {
	init_modern();
	defaultOptions = {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: true,
			gcTime: 1e3 * 60 * 5
		},
		dehydrate: {
			shouldDehydrateQuery(query) {
				var _query$meta, _query$meta2, _query$meta3;
				if (((_query$meta = query.meta) === null || _query$meta === void 0 || (_query$meta = _query$meta.ssr) === null || _query$meta === void 0 ? void 0 : _query$meta.dehydrate) === false) return false;
				if (typeof ((_query$meta2 = query.meta) === null || _query$meta2 === void 0 ? void 0 : _query$meta2.persister) === "object" && ((_query$meta3 = query.meta) === null || _query$meta3 === void 0 || (_query$meta3 = _query$meta3.persister) === null || _query$meta3 === void 0 ? void 0 : _query$meta3.sync)) return false;
				return defaultShouldDehydrateQuery(query);
			},
			shouldDehydrateMutation(_mutation) {
				return false;
			}
		}
	};
	config = (_sys) => {
		return {
			persister: {
				maxAge: {
					cookie: void 0,
					local: Infinity,
					db: 1e3 * 60 * 60 * 24
				},
				cookie: { options: {} },
				refetchOnRestore: true
			},
			query: { staleTime: {
				async: 0,
				ssr: Infinity
			} },
			queryClientConfig: { defaultOptions }
		};
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/monkey.ts
var Monkey;
var init_monkey = __esmMin((() => {
	init_modern();
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_storage();
	init_asyncToGenerator();
	Monkey = class extends BeanSimple {
		constructor(moduleSelf) {
			super();
			this._moduleSelf = void 0;
			this._storage = void 0;
			this._moduleSelf = moduleSelf;
		}
		getStorage() {
			var _this = this;
			return _asyncToGenerator(function* () {
				if (!_this._storage) _this._storage = yield _this.bean._newBean(ServiceStorage, false);
				return _this._storage;
			})();
		}
		appInitialize() {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				yield (yield _this2.getStorage()).appInitialize();
			})();
		}
		moduleLoading(_module) {
			return _asyncToGenerator(function* () {})();
		}
		moduleLoaded(module) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				if (_this3._moduleSelf === module) yield (yield _this3.getStorage()).moduleLoaded();
			})();
		}
		beanInit(bean, beanInstance) {
			return _asyncToGenerator(function* () {
				bean.defineProperty(beanInstance, "$queryClient", {
					enumerable: false,
					configurable: true,
					get() {
						return markRaw(useQueryClient());
					}
				});
			})();
		}
	};
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/.metadata/index.ts
/** bean: end */
/** bean: begin */
/** monkey: end */
/** scope: begin */
var _dec, _dec2, _class, ScopeModuleAModel;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_bean_modelBase();
	init_storage();
	init_src$2();
	init_config();
	init_monkey();
	ScopeModuleAModel = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-model" }), _dec(_class = _dec2(_class = class ScopeModuleAModel extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/lib/model.ts
function Model(options) {
	return createBeanDecorator("model", "ctx", true, options);
}
var init_model = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/lib/utils.ts
function $QueryAutoLoad(_x) {
	return _$QueryAutoLoad.apply(this, arguments);
}
function _$QueryAutoLoad() {
	_$QueryAutoLoad = _asyncToGenerator(function* (fn) {
		return _QueryAutoLoadInner(fn);
	});
	return _$QueryAutoLoad.apply(this, arguments);
}
function $QueriesAutoLoad(_x2, _x3, _x4, _x5, _x6) {
	return _$QueriesAutoLoad.apply(this, arguments);
}
function _$QueriesAutoLoad() {
	_$QueriesAutoLoad = _asyncToGenerator(function* (fn1, fn2, fn3, fn4, fn5, ...fns) {
		let promises = [
			_QueryAutoLoadInner(fn1),
			_QueryAutoLoadInner(fn2),
			_QueryAutoLoadInner(fn3),
			_QueryAutoLoadInner(fn4),
			_QueryAutoLoadInner(fn5)
		];
		if (fns.length > 0) promises = promises.concat(fns.map((fn) => _QueryAutoLoadInner(fn)));
		return yield Promise.all(promises);
	});
	return _$QueriesAutoLoad.apply(this, arguments);
}
function _QueryAutoLoadInner(_x7) {
	return _QueryAutoLoadInner2.apply(this, arguments);
}
function _QueryAutoLoadInner2() {
	_QueryAutoLoadInner2 = _asyncToGenerator(function* (fn) {
		if (!fn) return;
		const query = fn();
		if (query && query.data === void 0) yield query.suspense();
		return query;
	});
	return _QueryAutoLoadInner2.apply(this, arguments);
}
var init_utils = __esmMin((() => {
	init_asyncToGenerator();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/lib/index.ts
var init_lib = __esmMin((() => {
	init_model();
	init_utils();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-model/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	$QueriesAutoLoad: () => $QueriesAutoLoad,
	$QueryAutoLoad: () => $QueryAutoLoad,
	BeanModelBase: () => BeanModelBase,
	Model: () => Model,
	Monkey: () => Monkey,
	ScopeModuleAModel: () => ScopeModuleAModel,
	ServiceStorage: () => ServiceStorage,
	config: () => config,
	resolveMaxAgeTime: () => resolveMaxAgeTime,
	resolveStaleTime: () => resolveStaleTime
});
var init_src = __esmMin((() => {
	init__metadata();
	init_lib();
	init_types();
}));
//#endregion
export { Model as a, $QueryAutoLoad as i, src_exports as n, BeanModelBase as o, $QueriesAutoLoad as r, init_src as t };

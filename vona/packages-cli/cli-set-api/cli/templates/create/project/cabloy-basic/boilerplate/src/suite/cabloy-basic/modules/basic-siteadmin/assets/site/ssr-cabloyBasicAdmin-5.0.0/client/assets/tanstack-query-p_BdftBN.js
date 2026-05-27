import { n as __esmMin } from "./rolldown-runtime-lkMnaVCm.js";
import { m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { f as matchQuery, p as partialMatchKey, s as notifyManager, t as init_modern$1, u as hashKey } from "./tanstack-query-ChvwIT2C.js";
//#region node_modules/.pnpm/@tanstack+query-persist-client-core@5.100.10/node_modules/@tanstack/query-persist-client-core/build/modern/persist.js
var init_persist = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-persist-client-core@5.100.10/node_modules/@tanstack/query-persist-client-core/build/modern/retryStrategies.js
var init_retryStrategies = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-persist-client-core@5.100.10/node_modules/@tanstack/query-persist-client-core/build/modern/createPersister.js
function experimental_createQueryPersister({ storage, buster = "", maxAge = 1e3 * 60 * 60 * 24, serialize = JSON.stringify, deserialize = JSON.parse, prefix = PERSISTER_KEY_PREFIX, refetchOnRestore = true, filters }) {
	function isExpiredOrBusted(persistedQuery) {
		if (persistedQuery.state.dataUpdatedAt) {
			const expired = Date.now() - persistedQuery.state.dataUpdatedAt > maxAge;
			const busted = persistedQuery.buster !== buster;
			if (expired || busted) return true;
			return false;
		}
		return true;
	}
	function retrieveQuery(_x, _x2) {
		return _retrieveQuery.apply(this, arguments);
	}
	function _retrieveQuery() {
		_retrieveQuery = _asyncToGenerator(function* (queryHash, afterRestoreMacroTask) {
			if (storage != null) {
				const storageKey = `${prefix}-${queryHash}`;
				try {
					const storedData = yield storage.getItem(storageKey);
					if (storedData) {
						let persistedQuery;
						try {
							persistedQuery = yield deserialize(storedData);
						} catch (_unused) {
							yield storage.removeItem(storageKey);
							return;
						}
						if (isExpiredOrBusted(persistedQuery)) yield storage.removeItem(storageKey);
						else {
							if (afterRestoreMacroTask) notifyManager.schedule(() => afterRestoreMacroTask(persistedQuery));
							return persistedQuery.state.data;
						}
					}
				} catch (err) {
					yield storage.removeItem(storageKey);
				}
			}
		});
		return _retrieveQuery.apply(this, arguments);
	}
	function persistQueryByKey(_x3, _x4) {
		return _persistQueryByKey.apply(this, arguments);
	}
	function _persistQueryByKey() {
		_persistQueryByKey = _asyncToGenerator(function* (queryKey, queryClient) {
			if (storage != null) {
				const query = queryClient.getQueryCache().find({ queryKey });
				if (query) yield persistQuery(query);
			}
		});
		return _persistQueryByKey.apply(this, arguments);
	}
	function persistQuery(_x5) {
		return _persistQuery.apply(this, arguments);
	}
	function _persistQuery() {
		_persistQuery = _asyncToGenerator(function* (query) {
			if (storage != null) {
				const storageKey = `${prefix}-${query.queryHash}`;
				storage.setItem(storageKey, yield serialize({
					state: query.state,
					queryKey: query.queryKey,
					queryHash: query.queryHash,
					buster
				}));
			}
		});
		return _persistQuery.apply(this, arguments);
	}
	function persisterFn(_x6, _x7, _x8) {
		return _persisterFn.apply(this, arguments);
	}
	function _persisterFn() {
		_persisterFn = _asyncToGenerator(function* (queryFn, ctx, query) {
			const matchesFilter = filters ? matchQuery(filters, query) : true;
			if (matchesFilter && query.state.data === void 0 && storage != null) {
				const restoredData = yield retrieveQuery(query.queryHash, (persistedQuery) => {
					query.setState({
						dataUpdatedAt: persistedQuery.state.dataUpdatedAt,
						errorUpdatedAt: persistedQuery.state.errorUpdatedAt
					});
					if (refetchOnRestore === "always" || refetchOnRestore === true && query.isStale()) query.fetch();
				});
				if (restoredData !== void 0) return Promise.resolve(restoredData);
			}
			const queryFnResult = yield queryFn(ctx);
			if (matchesFilter && storage != null) notifyManager.schedule(() => {
				persistQuery(query);
			});
			return Promise.resolve(queryFnResult);
		});
		return _persisterFn.apply(this, arguments);
	}
	function persisterGc() {
		return _persisterGc.apply(this, arguments);
	}
	function _persisterGc() {
		_persisterGc = _asyncToGenerator(function* () {
			if (storage === null || storage === void 0 ? void 0 : storage.entries) {
				const storageKeyPrefix = `${prefix}-`;
				const entries = yield storage.entries();
				for (const [key, value] of entries) if (key.startsWith(storageKeyPrefix)) {
					let persistedQuery;
					try {
						persistedQuery = yield deserialize(value);
					} catch (_unused2) {
						yield storage.removeItem(key);
						continue;
					}
					if (isExpiredOrBusted(persistedQuery)) yield storage.removeItem(key);
				}
			}
		});
		return _persisterGc.apply(this, arguments);
	}
	function restoreQueries(_x9) {
		return _restoreQueries.apply(this, arguments);
	}
	function _restoreQueries() {
		_restoreQueries = _asyncToGenerator(function* (queryClient, filters2 = {}) {
			const { exact, queryKey } = filters2;
			if (storage === null || storage === void 0 ? void 0 : storage.entries) {
				const storageKeyPrefix = `${prefix}-`;
				const entries = yield storage.entries();
				for (const [key, value] of entries) if (key.startsWith(storageKeyPrefix)) {
					let persistedQuery;
					try {
						persistedQuery = yield deserialize(value);
					} catch (_unused3) {
						yield storage.removeItem(key);
						continue;
					}
					if (isExpiredOrBusted(persistedQuery)) {
						yield storage.removeItem(key);
						continue;
					}
					if (queryKey) {
						if (exact) {
							if (persistedQuery.queryHash !== hashKey(queryKey)) continue;
						} else if (!partialMatchKey(persistedQuery.queryKey, queryKey)) continue;
					}
					queryClient.setQueryData(persistedQuery.queryKey, persistedQuery.state.data, { updatedAt: persistedQuery.state.dataUpdatedAt });
				}
			}
		});
		return _restoreQueries.apply(this, arguments);
	}
	function removeQueries() {
		return _removeQueries.apply(this, arguments);
	}
	function _removeQueries() {
		_removeQueries = _asyncToGenerator(function* (filters2 = {}) {
			const { exact, queryKey } = filters2;
			if (storage === null || storage === void 0 ? void 0 : storage.entries) {
				const entries = yield storage.entries();
				const storageKeyPrefix = `${prefix}-`;
				for (const [key, value] of entries) if (key.startsWith(storageKeyPrefix)) {
					if (!queryKey) {
						yield storage.removeItem(key);
						continue;
					}
					let persistedQuery;
					try {
						persistedQuery = yield deserialize(value);
					} catch (_unused4) {
						yield storage.removeItem(key);
						continue;
					}
					if (exact) {
						if (persistedQuery.queryHash !== hashKey(queryKey)) continue;
					} else if (!partialMatchKey(persistedQuery.queryKey, queryKey)) continue;
					yield storage.removeItem(key);
				}
			}
		});
		return _removeQueries.apply(this, arguments);
	}
	return {
		persisterFn,
		persistQuery,
		persistQueryByKey,
		retrieveQuery,
		persisterGc,
		restoreQueries,
		removeQueries
	};
}
var PERSISTER_KEY_PREFIX;
var init_createPersister = __esmMin((() => {
	init_modern$1();
	init_asyncToGenerator();
	PERSISTER_KEY_PREFIX = "tanstack-query";
}));
//#endregion
//#region node_modules/.pnpm/@tanstack+query-persist-client-core@5.100.10/node_modules/@tanstack/query-persist-client-core/build/modern/index.js
var init_modern = __esmMin((() => {
	init_persist();
	init_retryStrategies();
	init_createPersister();
}));
//#endregion
export { experimental_createQueryPersister as n, init_modern as t };

import { n as __esmMin, r as __exportAll } from "./rolldown-runtime-lkMnaVCm.js";
import { d as defineComponent } from "./vue-t5FcxkD3.js";
import { n as init_vue_runtime_esm_bundler } from "./vue-CmE1HVn9.js";
import { d as _objectSpread2, f as init_objectSpread2, m as init_asyncToGenerator, p as _asyncToGenerator } from "./fecha-DmopMB3M.js";
import { R as deepEqual, c as prepareComponentOptions, k as BeanInfo, l as useController, m as BeanScopeBase, w as Use, z as deepExtend } from "./zova-DNf1Cx1D.js";
import { t as init_src$1 } from "./zova-CWGd8DOC.js";
import { i as Scope, s as Controller, t as init_src$2 } from "./a-bean-D7Mlzb3d.js";
import { a as Model, o as BeanModelBase, t as init_src$3 } from "./a-model-Dk4zg8ps.js";
import { r as BeanRouterViewBase, t as init_src$4 } from "./a-router-ZH9r7SU3.js";
import { n as mutate, t as init_src$5 } from "./zova-BHaXQJg22.js";
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts
var _dec$2, _dec2$2, _class$2, ModelTabs$1;
var init_tabs$1 = __esmMin((() => {
	init_asyncToGenerator();
	init_objectSpread2();
	init_src$1();
	init_src$5();
	init_src$3();
	ModelTabs$1 = (_dec$2 = Model({
		enableSelector: true,
		max: -1,
		maxItems: -1,
		cache: false
	}), _dec2$2 = BeanInfo({ module: "a-routertabs" }), _dec$2(_class$2 = _dec2$2(_class$2 = class ModelTabs extends BeanModelBase {
		constructor(...args) {
			super(...args);
			this.tabsOptions = void 0;
			this.tabs = void 0;
			this.componentKeyCurrent = void 0;
			this.tabKeyCurrent = void 0;
			this.tabCurrentIndex = void 0;
			this.tabCurrent = void 0;
			this.keepAliveInclude = void 0;
			this._eventSsrHmrReload = void 0;
		}
		__init__(scene, options) {
			var _superprop_get__init__ = () => super.__init__, _this = this;
			return _asyncToGenerator(function* () {
				yield _superprop_get__init__().call(_this, scene);
				_this.bean._setBean("$$modelTabs", _this);
				_this.tabsOptions = deepExtend({}, _this.$onionOptions, options);
				_this.tabCurrentIndex = _this.$computed(() => {
					const [index] = _this.findTab(_this.tabKeyCurrent);
					return index;
				});
				_this.tabCurrent = _this.$computed(() => {
					const [, tab] = _this.findTab(_this.tabKeyCurrent);
					return tab;
				});
				_this.keepAliveInclude = _this.$computed(() => {
					return _this._getKeepAliveInclude();
				});
				_this.componentKeyCurrent = _this.$useStateMem({ queryKey: ["componentKeyCurrent"] });
				_this.tabKeyCurrent = _this.$useStateMem({ queryKey: ["tabKeyCurrent"] });
				const queryOptionsTabs = {
					queryKey: ["tabs"],
					meta: { defaultData: _this._getInitialTabs() }
				};
				if (_this.tabsOptions.cache) _this.tabs = _this.$useStateDb(queryOptionsTabs);
				else _this.tabs = _this.$useStateMem(queryOptionsTabs);
				if (_this.tabsOptions.cache) yield _this.$loadStateDb(_this.tabs);
				_this._resetAllPageDirty();
				if (_this.$currentRoute) _this.forwardRoute(_this.$currentRoute);
				if (_this.sys.config.ssr.hmr) _this._eventSsrHmrReload = _this.sys.meta.event.on("a-ssrhmr:reload", function() {
					var _ref = _asyncToGenerator(function* (_data, next) {
						_this.updateAllTabInfos();
						return next();
					});
					return function(_x, _x2) {
						return _ref.apply(this, arguments);
					};
				}());
				_this.$watch(() => {
					return _this.app.meta.locale.current;
				}, () => {
					_this.updateAllTabInfos();
				});
			})();
		}
		__dispose__() {
			if (this._eventSsrHmrReload) this._eventSsrHmrReload();
		}
		get cache() {
			return this.tabsOptions.cache;
		}
		addTab(tab, affix) {
			const res = this._addTab(tab, affix);
			this.tabKeyCurrent = res ? tab.tabKey : void 0;
			this.componentKeyCurrent = res ? tab.componentKey : void 0;
			return res;
		}
		_addTab(tab, affix) {
			var _this$tabsOptions$get, _this$tabsOptions$get2, _this$tabsOptions;
			const tabKey = tab.tabKey;
			if (!tabKey) return false;
			const [index, tabOld] = this.findTab(tabKey);
			const tabInfo = (_this$tabsOptions$get = (_this$tabsOptions$get2 = (_this$tabsOptions = this.tabsOptions).getTabInfo) === null || _this$tabsOptions$get2 === void 0 ? void 0 : _this$tabsOptions$get2.call(_this$tabsOptions, tabKey)) !== null && _this$tabsOptions$get !== void 0 ? _this$tabsOptions$get : tabOld === null || tabOld === void 0 ? void 0 : tabOld.info;
			if (!tabInfo) return false;
			if (index === -1) {
				const tabNew = {
					tabKey,
					affix,
					items: tab.componentKey ? [{
						componentKey: tab.componentKey,
						fullPath: tab.fullPath,
						keepAlive: tab.keepAlive,
						updatedAt: Date.now()
					}] : [],
					updatedAt: Date.now(),
					info: tabInfo
				};
				if (this.tabCurrentIndex === -1) this.tabs = mutate(this.tabs, (copyState) => {
					copyState.push(tabNew);
				});
				else this.tabs = mutate(this.tabs, (copyState) => {
					copyState.splice(this.tabCurrentIndex + 1, 0, tabNew);
				});
				this.pruneTabs();
			} else {
				if (!deepEqual(tabInfo, tabOld === null || tabOld === void 0 ? void 0 : tabOld.info)) this.updateTabInfo(tabKey);
				if (!this._checkIfTabNeedUpdate(tabOld, tab)) return true;
				this.updateTab(tab);
				this.pruneTabItems(tabKey);
			}
			return true;
		}
		updateAllTabInfos(tabInitials) {
			for (const tab of this.tabs) {
				const tabInitial = tabInitials === null || tabInitials === void 0 ? void 0 : tabInitials.find((item) => item.tabKey === tab.tabKey);
				this.updateTabInfo(tab.tabKey, tabInitial);
			}
		}
		updateTabInfo(tabKey, tabInitial) {
			var _tabInitial$info;
			if (!tabKey) return;
			const [index, tabOld] = this.findTab(tabKey);
			if (index === -1) return;
			const tabInfo = this.tabsOptions.getTabInfo ? this.tabsOptions.getTabInfo(tabKey) : (_tabInitial$info = tabInitial === null || tabInitial === void 0 ? void 0 : tabInitial.info) !== null && _tabInitial$info !== void 0 ? _tabInitial$info : tabOld === null || tabOld === void 0 ? void 0 : tabOld.info;
			if (!tabInfo) return;
			const tabNew = _objectSpread2(_objectSpread2({}, tabOld), {}, { info: tabInfo });
			this.updateTab(tabNew);
		}
		updateTabItemPageMeta(tabKey, componentKey, pageMeta) {
			if (!tabKey || !componentKey) return false;
			const [index, tab] = this.findTab(tabKey);
			if (index === -1 || !tab) return false;
			if (!tab.items) return false;
			const indexItem = tab.items.findIndex((item) => item.componentKey === componentKey);
			if (indexItem === -1) return false;
			const tabItem = tab.items[indexItem];
			const pageMetaNew = _objectSpread2(_objectSpread2({}, tabItem.pageMeta), pageMeta);
			const tabItemNew = _objectSpread2(_objectSpread2({}, tabItem), {}, { pageMeta: pageMetaNew });
			const items = mutate(tab.items, (copyState) => {
				copyState.splice(indexItem, 1, tabItemNew);
			});
			const tabNew = _objectSpread2(_objectSpread2({}, tab), {}, { items });
			this.tabs = mutate(this.tabs, (copyState) => {
				copyState.splice(index, 1, tabNew);
			});
			return true;
		}
		deleteTab(tabKey, noActiveNext) {
			var _this2 = this;
			return _asyncToGenerator(function* () {
				if (!tabKey) return;
				const [index] = _this2.findTab(tabKey);
				if (index === -1) return;
				let tabKeyActiveNext;
				if (!noActiveNext && index === _this2.tabCurrentIndex) {
					const tabCurrentIndex = index + 1 < _this2.tabs.length ? index + 1 : index - 1 > -1 ? index - 1 : -1;
					if (tabCurrentIndex > -1) {
						var _this$tabs$tabCurrent;
						tabKeyActiveNext = (_this$tabs$tabCurrent = _this2.tabs[tabCurrentIndex]) === null || _this$tabs$tabCurrent === void 0 ? void 0 : _this$tabs$tabCurrent.tabKey;
					}
				}
				_this2.tabs = mutate(_this2.tabs, (copyState) => {
					copyState.splice(index, 1);
				});
				if (tabKeyActiveNext) yield _this2.activeTab(tabKeyActiveNext);
			})();
		}
		deleteTabItem(tabKey, componentKey, noActiveNext) {
			var _this3 = this;
			return _asyncToGenerator(function* () {
				if (!tabKey || !componentKey) return false;
				if (tabKey === componentKey) return false;
				const [index, tab] = _this3.findTab(tabKey);
				if (index === -1 || !tab) return false;
				if (!tab.items) return false;
				const indexItem = tab.items.findIndex((item) => item.componentKey === componentKey);
				if (indexItem === -1) return false;
				if (tab.items.length === 1 && !tab.affix) {
					yield _this3.deleteTab(tabKey, noActiveNext);
					return true;
				}
				let componentKeyActiveNext;
				if (!noActiveNext && componentKey === _this3.componentKeyCurrent) {
					const tabItemCurrentIndex = indexItem + 1 < tab.items.length ? indexItem + 1 : indexItem - 1 > -1 ? indexItem - 1 : -1;
					if (tabItemCurrentIndex > -1) {
						var _tab$items$tabItemCur;
						componentKeyActiveNext = (_tab$items$tabItemCur = tab.items[tabItemCurrentIndex]) === null || _tab$items$tabItemCur === void 0 ? void 0 : _tab$items$tabItemCur.componentKey;
					}
				}
				const items = mutate(tab.items, (copyState) => {
					copyState.splice(indexItem, 1);
				});
				const tabNew = _objectSpread2(_objectSpread2({}, tab), {}, { items });
				_this3.tabs = mutate(_this3.tabs, (copyState) => {
					copyState.splice(index, 1, tabNew);
				});
				if (componentKeyActiveNext) yield _this3.activeTabItem(tabKey, componentKeyActiveNext);
				return true;
			})();
		}
		findTabItemByFullPath(fullPath) {
			for (const tab of this.tabs) {
				if (!tab.items) continue;
				for (const item of tab.items) if (item.fullPath === fullPath) return [tab.tabKey, item.componentKey];
			}
			return [];
		}
		updateTab(tab) {
			const tabKey = tab.tabKey;
			const [index, tabOld] = this.findTab(tabKey);
			if (index === -1 || !tabOld) return;
			const items = tabOld.items ? [].concat(tabOld.items) : [];
			if (tab.componentKey) {
				const tabItem = {
					componentKey: tab.componentKey,
					fullPath: tab.fullPath,
					keepAlive: tab.keepAlive,
					updatedAt: Date.now()
				};
				const index = items.findIndex((item) => item.componentKey === tab.componentKey);
				if (index === -1) items.push(tabItem);
				else {
					const tabItemNew = _objectSpread2(_objectSpread2({}, items[index]), tabItem);
					items.splice(index, 1, tabItemNew);
				}
				items.sort((a, b) => (a.componentKey === tabKey ? 0 : 1) - (b.componentKey === tabKey ? 0 : 1));
			}
			const tabNew = _objectSpread2(_objectSpread2(_objectSpread2({}, tabOld), tab), {}, {
				tabKey,
				items,
				updatedAt: Date.now()
			});
			this.tabs = mutate(this.tabs, (copyState) => {
				copyState.splice(index, 1, tabNew);
			});
		}
		activeTab(tabKey) {
			var _this4 = this;
			return _asyncToGenerator(function* () {
				var _tab$items;
				if (!tabKey) return;
				const [_, tab] = _this4.findTab(tabKey);
				if (!tab) return;
				const tabItemFirst = (_tab$items = tab.items) === null || _tab$items === void 0 ? void 0 : _tab$items[0];
				const path = (tabItemFirst === null || tabItemFirst === void 0 ? void 0 : tabItemFirst.componentKey) === tabKey ? tabItemFirst.fullPath : tabKey;
				yield _this4.$router.push(path);
			})();
		}
		activeTabItem(tabKey, componentKey) {
			var _this5 = this;
			return _asyncToGenerator(function* () {
				var _tab$items2;
				if (!tabKey || !componentKey) return;
				const [_, tab] = _this5.findTab(tabKey);
				if (!tab) return;
				const tabItem = (_tab$items2 = tab.items) === null || _tab$items2 === void 0 ? void 0 : _tab$items2.find((item) => item.componentKey === componentKey);
				if (!tabItem) return;
				const path = tabItem.fullPath;
				yield _this5.$router.push(path);
			})();
		}
		findTab(tabKey) {
			if (!tabKey) return [-1, void 0];
			const index = this.tabs.findIndex((item) => item.tabKey === tabKey);
			if (index === -1) return [index, void 0];
			return [index, this.tabs[index]];
		}
		pruneTabs() {
			var _this6 = this;
			return _asyncToGenerator(function* () {
				let max = _this6.tabsOptions.max;
				if (max === void 0 || max === -1) return;
				if (max < 1) max = 1;
				while (true) {
					const affixCount = _this6.tabs.filter((item) => item.affix).length;
					if (_this6.tabs.length - affixCount <= max) break;
					let tabKey;
					let updatedAt = Date.now();
					for (const tab of _this6.tabs) if (!tab.affix && tab.updatedAt < updatedAt) {
						tabKey = tab.tabKey;
						updatedAt = tab.updatedAt;
					}
					if (!tabKey) break;
					yield _this6.deleteTab(tabKey, true);
				}
			})();
		}
		pruneTabItems(tabKey) {
			var _this7 = this;
			return _asyncToGenerator(function* () {
				if (!tabKey) return;
				let maxItems = _this7.tabsOptions.maxItems;
				if (maxItems === void 0 || maxItems === -1) return;
				if (maxItems < 1) maxItems = 1;
				while (true) {
					const [_, tab] = _this7.findTab(tabKey);
					if (!tab || !tab.items) break;
					const ignoreCount = tab.items.filter((item) => item.componentKey === tabKey).length;
					if (tab.items.length - ignoreCount <= maxItems) break;
					let componentKey;
					let updatedAt = Date.now();
					for (const tabItem of tab.items) if (tabItem.componentKey !== tabKey && tabItem.updatedAt < updatedAt) {
						componentKey = tabItem.componentKey;
						updatedAt = tabItem.updatedAt;
					}
					if (!componentKey) break;
					yield _this7.deleteTabItem(tabKey, componentKey, true);
				}
			})();
		}
		_checkIfTabNeedUpdate(tabOld, tabNew) {
			for (const key in tabNew) {
				if ([
					"fullPath",
					"keepAlive",
					"updatedAt"
				].includes(key)) continue;
				if (["componentKey"].includes(key)) {
					if (!tabOld.items) return true;
					const tabItemOld = tabOld.items.find((item) => item[key] === tabNew[key]);
					if (!tabItemOld) return true;
					for (const key2 of ["fullPath", "keepAlive"]) if (tabItemOld[key2] !== tabNew[key2]) return true;
					if (tabOld.items.findIndex((item) => {
						var _item$updatedAt, _tabItemOld$updatedAt;
						return item[key] !== tabItemOld[key] && ((_item$updatedAt = item.updatedAt) !== null && _item$updatedAt !== void 0 ? _item$updatedAt : 0) >= ((_tabItemOld$updatedAt = tabItemOld.updatedAt) !== null && _tabItemOld$updatedAt !== void 0 ? _tabItemOld$updatedAt : 0);
					}) > -1) return true;
				} else if (tabNew[key] !== tabOld[key]) return true;
			}
			if (this.tabs.findIndex((item) => {
				var _item$updatedAt2, _tabOld$updatedAt;
				return item.tabKey !== tabOld.tabKey && ((_item$updatedAt2 = item.updatedAt) !== null && _item$updatedAt2 !== void 0 ? _item$updatedAt2 : 0) >= ((_tabOld$updatedAt = tabOld.updatedAt) !== null && _tabOld$updatedAt !== void 0 ? _tabOld$updatedAt : 0);
			}) > -1) return true;
			return false;
		}
		_getKeepAliveInclude() {
			const include = [];
			for (const tab of this.tabs) {
				if (!tab.items) continue;
				for (const item of tab.items) if (item.keepAlive !== false && item.componentKey) {
					if (!include.includes(item.componentKey)) include.push(item.componentKey);
				}
			}
			return include;
		}
		_getInitialTabs() {
			var _this$tabsOptions$get3, _this$tabsOptions$get4, _this$tabsOptions2;
			const tabs = (_this$tabsOptions$get3 = (_this$tabsOptions$get4 = (_this$tabsOptions2 = this.tabsOptions).getInitialTabs) === null || _this$tabsOptions$get4 === void 0 ? void 0 : _this$tabsOptions$get4.call(_this$tabsOptions2)) !== null && _this$tabsOptions$get3 !== void 0 ? _this$tabsOptions$get3 : [];
			if (!this.tabsOptions.getTabInfo) return tabs;
			return tabs.map((tab) => {
				var _this$tabsOptions$get5, _this$tabsOptions$get6, _this$tabsOptions3;
				return _objectSpread2(_objectSpread2({}, tab), {}, { info: (_this$tabsOptions$get5 = (_this$tabsOptions$get6 = (_this$tabsOptions3 = this.tabsOptions).getTabInfo) === null || _this$tabsOptions$get6 === void 0 ? void 0 : _this$tabsOptions$get6.call(_this$tabsOptions3, tab.tabKey)) !== null && _this$tabsOptions$get5 !== void 0 ? _this$tabsOptions$get5 : tab.info });
			});
		}
		backRoute(route) {
			const [tabKey, componentKey] = this.findTabItemByFullPath(route.fullPath);
			this.deleteTabItem(tabKey, componentKey, true);
		}
		forwardRoute(route) {
			const routeMeta = this.prepareRouteMeta(route);
			this.addTab(routeMeta);
		}
		setPageMeta(route, pageMeta) {
			const [tabKey, componentKey] = this.findTabItemByFullPath(route.fullPath);
			this.updateTabItemPageMeta(tabKey, componentKey, pageMeta);
		}
		prepareRouteMeta(route) {
			const fullPath = route.fullPath;
			const componentKey = this.__handleRoutePropComponentKey(route);
			return {
				tabKey: this._handleRouteProp(route, "tabKey") || componentKey,
				componentKey,
				fullPath,
				keepAlive: this._handleRouteProp(route, "keepAlive")
			};
		}
		_handleRouteProp(route, prop) {
			let value = route.meta[prop];
			if (typeof value === "function") value = value.call(this.app, route);
			return value;
		}
		__handleRoutePropComponentKey(route) {
			const componentKey = this._handleRouteProp(route, "componentKey");
			if (componentKey) return componentKey;
			const name = this.$router.getRealRouteName(route.name);
			if (!name) return route.path;
			if (route.meta.componentKeyMode === "nameOnly") return name;
			return route.path;
		}
		_resetAllPageDirty() {
			const tabItems = [];
			for (const tab of this.tabs) {
				if (!tab.items) continue;
				for (const tabItem of tab.items) {
					var _tabItem$pageMeta;
					if ((_tabItem$pageMeta = tabItem.pageMeta) === null || _tabItem$pageMeta === void 0 ? void 0 : _tabItem$pageMeta.pageDirty) tabItems.push([tab.tabKey, tabItem.componentKey]);
				}
			}
			for (const [tabKey, componentKey] of tabItems) this.updateTabItemPageMeta(tabKey, componentKey, { pageDirty: false });
		}
	}) || _class$2) || _class$2);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx
function _initializerDefineProperty(e, i, r, l) {
	r && Object.defineProperty(e, i, {
		enumerable: r.enumerable,
		configurable: r.configurable,
		writable: r.writable,
		value: r.initializer ? r.initializer.call(l) : void 0
	});
}
function _applyDecoratedDescriptor(i, e, r, n, l) {
	var a = {};
	return Object.keys(n).forEach(function(i) {
		a[i] = n[i];
	}), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function(r, n) {
		return n(i, e, r) || r;
	}, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
var _dec$1, _dec2$1, _dec3, _dec4, _class$1, _class2, _descriptor, _ControllerRouterViewTabs, ControllerRouterViewTabs;
var init_controller = __esmMin((() => {
	init_src$1();
	init_src$2();
	init_src$4();
	ControllerRouterViewTabs = (_dec$1 = Controller(), _dec2$1 = BeanInfo({ module: "a-routertabs" }), _dec3 = Use({ injectionScope: "skipSelf" }), _dec4 = Reflect.metadata("design:type", typeof ModelTabs === "undefined" ? Object : ModelTabs), _dec$1(_class$1 = _dec2$1(_class$1 = (_class2 = (_ControllerRouterViewTabs = class ControllerRouterViewTabs extends BeanRouterViewBase {
		constructor(...args) {
			super(...args);
			_initializerDefineProperty(this, "$$modelTabs", _descriptor, this);
		}
		backRoute(route) {
			this.$$modelTabs.backRoute(route);
			return true;
		}
		forwardRoute(route) {
			this.$$modelTabs.forwardRoute(route);
			return true;
		}
		setPageMeta(route, pageMeta) {
			this.$$modelTabs.setPageMeta(route, pageMeta);
		}
		prepareRouteMeta(route) {
			return this.$$modelTabs.prepareRouteMeta(route);
		}
		getKeepAliveInclude() {
			return this.$$modelTabs.keepAliveInclude;
		}
	}, _ControllerRouterViewTabs.$propsDefault = {}, _ControllerRouterViewTabs), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "$$modelTabs", [_dec3, _dec4], {
		configurable: true,
		enumerable: true,
		writable: true,
		initializer: null
	}), _class2)) || _class$1) || _class$1);
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/.metadata/component/routerViewTabs.ts
var ZRouterViewTabs;
var init_routerViewTabs = __esmMin((() => {
	init_vue_runtime_esm_bundler();
	init_src$1();
	init_controller();
	ZRouterViewTabs = defineComponent((_props) => {
		useController(ControllerRouterViewTabs, void 0, void 0);
		return () => {};
	}, prepareComponentOptions());
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/.metadata/index.ts
/** components: end */
/** scope: begin */
var _dec, _dec2, _class, components, ScopeModuleARoutertabs;
var init__metadata = __esmMin((() => {
	init_src$1();
	init_tabs$1();
	init_src$3();
	init_controller();
	init_routerViewTabs();
	init_routerViewTabs();
	init_src$2();
	components = { "routerViewTabs": ZRouterViewTabs };
	ScopeModuleARoutertabs = (_dec = Scope(), _dec2 = BeanInfo({ module: "a-routertabs" }), _dec(_class = _dec2(_class = class ScopeModuleARoutertabs extends BeanScopeBase {}) || _class) || _class);
}));
/** scope: end */
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/types/tabs.ts
var init_tabs = __esmMin((() => {}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/types/index.ts
var init_types = __esmMin((() => {
	init_tabs();
}));
//#endregion
//#region src/suite-vendor/a-zova/modules/a-routertabs/src/index.ts
var src_exports = /* @__PURE__ */ __exportAll({
	ControllerRouterViewTabs: () => ControllerRouterViewTabs,
	ModelTabs: () => ModelTabs$1,
	ScopeModuleARoutertabs: () => ScopeModuleARoutertabs,
	ZRouterViewTabs: () => ZRouterViewTabs,
	components: () => components
});
var init_src = __esmMin((() => {
	init__metadata();
	init_types();
}));
//#endregion
export { src_exports as n, init_src as t };

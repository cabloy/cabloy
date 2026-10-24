import type {
  IDecoratorModelOptions,
  ModelPersistenceToken,
  ServiceStorage,
  UseQueryOptions,
} from 'zova-module-a-model';

import {
  RouteLocationNormalizedLoaded,
  RouteLocationNormalizedLoadedGeneric,
} from '@cabloy/vue-router';
import { mutate } from 'mutate-on-copy';
import { shallowReactive } from 'vue';
import { deepEqual, deepExtend, TypeEventOff } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';
import {
  IPageMeta,
  IRouteViewRouteItem,
  IRouteViewRouteMeta,
  TypeRouteDiscardReason,
} from 'zova-module-a-router';

import {
  ModelTabsOptions,
  ModelTabsOptionsBase,
  RouteTab,
  RouteTabInitial,
  RouteTabTransient,
} from '../types/tabs.ts';

export interface IModelOptionsTabs extends IDecoratorModelOptions, ModelTabsOptionsBase {}

interface TabsReadiness {
  ctx: { disposed: boolean };
  persistence: ServiceStorage;
  token: ModelPersistenceToken;
  ready: boolean;
  promise?: Promise<void>;
  work: (() => void)[];
}

@Model<IModelOptionsTabs>({
  enableSelector: true,
  max: -1,
  maxItems: -1,
  cache: false,
})
export class ModelTabs extends BeanModelBase {
  tabsOptions: ModelTabsOptions;
  private _tabsState: RouteTab[];
  private _tabsReadiness?: TabsReadiness;
  private _tabsDisposed = false;
  private _offPersistence?: () => void;

  get tabs(): RouteTab[] {
    if (this._tabsDisposed || this.ctx.disposed) return [];
    if (!this.tabsOptions?.cache) return this._tabsState ?? [];
    const readiness = this._getTabsReadiness();
    if (!readiness.ready) {
      this._startTabsRestore(readiness);
      return [];
    }
    return this._tabsState;
  }

  set tabs(value: RouteTab[]) {
    if (this._tabsDisposed || this.ctx.disposed) return;
    // The pending array is only a projection, never a write/default for storage.
    if (this.tabsOptions.cache && !this._getTabsReadiness().ready) return;
    this._tabsState = value;
  }

  componentKeyCurrent?: string;
  tabKeyCurrent?: string;
  tabCurrentIndex: number;
  tabCurrent?: RouteTab;
  keepAliveInclude: string[];
  private _eventSsrHmrReload: TypeEventOff;

  protected async __init__(scene: string, options?: ModelTabsOptions) {
    const ctx = this.ctx;
    await super.__init__(scene);
    if (this._tabsDisposed || ctx.disposed) return;
    this.bean._setBean('$$modelTabs', this);
    // options
    this.tabsOptions = deepExtend({}, this.$onionOptions, options);
    // computed
    this.tabCurrentIndex = this.$computed(() => {
      const [index] = this.findTab(this.tabKeyCurrent);
      return index;
    });
    this.tabCurrent = this.$computed(() => {
      const [, tab] = this.findTab(this.tabKeyCurrent);
      return tab;
    });
    this.keepAliveInclude = this.$computed(() => {
      return this._getKeepAliveInclude();
    });
    // componentKeyCurrent
    const queryOptionsComponentKeyCurrent: UseQueryOptions<string> = {
      queryKey: ['componentKeyCurrent'],
    };
    this.componentKeyCurrent = this.$useStateMem(queryOptionsComponentKeyCurrent);
    // tabKeyCurrent
    const queryOptionsTabKeyCurrent: UseQueryOptions<string> = {
      queryKey: ['tabKeyCurrent'],
    };
    this.tabKeyCurrent = this.$useStateMem(queryOptionsTabKeyCurrent);
    // if (this.tabsOptions.cache) {
    //   this.tabKeyCurrent = this.$useStateLocalAsync(queryOptionsTabKeyCurrent);
    // } else {
    //   this.tabKeyCurrent = this.$useStateMem(queryOptionsTabKeyCurrent);
    // }
    // tabs
    const queryOptionsTabs: UseQueryOptions<RouteTab[]> = {
      queryKey: ['tabs'],
      meta: {
        // Memory query metadata is dehydrated; only DB state can retain a factory.
        defaultData: this.tabsOptions.cache ? () => this._getInitialTabs() : this._getInitialTabs(),
      },
    };
    if (this.tabsOptions.cache) {
      this._tabsState = this.$useStateLocalAsync(queryOptionsTabs);
      const persistence = this.$modelPersistence;
      this._offPersistence = persistence.subscribe(() => {
        if (!this._tabsDisposed && !this.ctx.disposed) {
          this._startTabsRestore(this._getTabsReadiness());
        }
      });
      // Keep initial ordering, but do not initialize a route from an obsolete
      // restore if identity changes while the model itself is being loaded.
      while (!this._tabsDisposed && !this.ctx.disposed) {
        const readiness = this._getTabsReadiness();
        await this._startTabsRestore(readiness);
        if (this._isTabsReadinessCurrent(readiness)) break;
      }
    } else {
      this._tabsState = this.$useStateMem(queryOptionsTabs);
      this._initializeTabs();
    }
    if (this._tabsDisposed || this.ctx.disposed) return;
    // event
    if (process.env.CLIENT && this.sys.config.ssr.hmr) {
      this._eventSsrHmrReload = this.sys.meta.event.on('a-ssrhmr:reload', async (_data, next) => {
        this.updateAllTabInfos();
        return next();
      });
    }
    // locale
    this.$watch(
      () => {
        return this.app.meta.locale.current;
      },
      () => {
        this.updateAllTabInfos();
      },
    );
  }

  protected __dispose__() {
    this._tabsDisposed = true;
    this._offPersistence?.();
    this._tabsReadiness?.work.splice(0);
    if (this._eventSsrHmrReload) {
      this._eventSsrHmrReload();
      this._eventSsrHmrReload = undefined!;
    }
  }

  private _getTabsReadiness(): TabsReadiness {
    const persistence = this.$modelPersistence;
    let readiness = this._tabsReadiness;
    if (!readiness || !persistence.current(readiness.token)) {
      readiness?.work.splice(0);
      readiness = shallowReactive({
        ctx: this.ctx,
        persistence,
        token: persistence.capture(),
        ready: false,
        work: [],
      });
      this._tabsReadiness = readiness;
    }
    return readiness;
  }

  private _isTabsReadinessCurrent(readiness: TabsReadiness) {
    return (
      !this._tabsDisposed &&
      !readiness.ctx.disposed &&
      this._tabsReadiness === readiness &&
      readiness.persistence.current(readiness.token)
    );
  }

  private _startTabsRestore(readiness: TabsReadiness): Promise<void> {
    if (!readiness.promise) {
      // One actual backing read per epoch: repeated render/watch reads share it.
      const state = this._tabsState;
      readiness.promise = this.$ensureStateLocalAsync(state).then(() => {
        if (!this._isTabsReadinessCurrent(readiness)) return;
        readiness.ready = true;
        this._initializeTabs();
        for (const work of readiness.work.splice(0)) {
          if (!this._isTabsReadinessCurrent(readiness)) break;
          work();
        }
      });
      void readiness.promise.catch(error => {
        if (this._isTabsReadinessCurrent(readiness)) this.$errorHandler(error);
      });
    }
    return readiness.promise;
  }

  private _initializeTabs() {
    this._resetAllPageDirty();
    if (this.$currentRoute) this.forwardRoute(this.$currentRoute);
  }

  private _deferTabsWork(work: () => void): boolean {
    if (this._tabsDisposed || this.ctx.disposed) return true;
    if (!this.tabsOptions.cache) return false;
    const readiness = this._getTabsReadiness();
    if (readiness.ready) return false;
    readiness.work.push(work);
    this._startTabsRestore(readiness);
    return true;
  }

  private _captureTabsOperation() {
    const ctx = this.ctx;
    const persistence = this.$modelPersistence;
    const token = persistence.capture();
    return () => !this._tabsDisposed && !ctx.disposed && persistence.current(token);
  }

  get cache() {
    return this.tabsOptions.cache;
  }

  // need not async
  addTab(tab: RouteTabTransient, affix?: boolean): boolean {
    if (this._deferTabsWork(() => this.addTab(tab, affix))) return false;
    const res = this._addTab(tab, affix);
    // current
    this.tabKeyCurrent = res ? tab.tabKey : undefined;
    this.componentKeyCurrent = res ? tab.componentKey : undefined;
    return res;
  }

  // need not async
  _addTab(tab: Partial<RouteTabTransient>, affix?: boolean): boolean {
    if (this._deferTabsWork(() => this._addTab(tab, affix))) return false;
    const tabKey = tab.tabKey;
    if (!tabKey) return false;
    // tab
    const [index, tabOld] = this.findTab(tabKey);
    // tabInfo
    const tabInfo = this.tabsOptions.getTabInfo?.(tabKey) ?? tabOld?.info;
    if (!tabInfo) return false;
    // tabs
    if (index === -1) {
      // new
      const items: IRouteViewRouteItem[] = tab.componentKey
        ? [
            {
              componentKey: tab.componentKey!,
              fullPath: tab.fullPath!,
              keepAlive: tab.keepAlive,
              updatedAt: Date.now(),
            },
          ]
        : [];
      const tabNew: RouteTab = {
        tabKey,
        affix,
        items,
        updatedAt: Date.now(),
        info: tabInfo,
      };
      const insertIndex = this._getInsertIndexForNewTab(tabNew);
      this.tabs = mutate(this.tabs, copyState => {
        copyState.splice(insertIndex, 0, tabNew);
      });
      // need not await
      this.pruneTabs();
    } else {
      // update tabInfo
      if (!deepEqual(tabInfo, tabOld?.info)) {
        this.updateTabInfo(tabKey);
      }
      // update
      if (!this._checkIfTabNeedUpdate(tabOld!, tab)) {
        return true;
      }
      this.updateTab(tab);
      // need not await
      this.pruneTabItems(tabKey);
    }
    return true;
  }

  resetAllTabInfos() {
    if (this._deferTabsWork(() => this.resetAllTabInfos())) return;
    this.tabs = this._getInitialTabs() as RouteTab[];
  }

  updateAllTabInfos(tabInitials?: RouteTabInitial[]) {
    if (this._deferTabsWork(() => this.updateAllTabInfos(tabInitials))) return;
    for (const tab of this.tabs) {
      const tabInitial = tabInitials?.find(item => item.tabKey === tab.tabKey);
      this.updateTabInfo(tab.tabKey, tabInitial);
    }
  }

  updateTabInfo(tabKey?: string, tabInitial?: RouteTabInitial) {
    if (this._deferTabsWork(() => this.updateTabInfo(tabKey, tabInitial))) return;
    if (!tabKey) return;
    // tabs
    const [index, tabOld] = this.findTab(tabKey);
    if (index === -1) return;
    // tabInfo
    const tabInfo = this.tabsOptions.getTabInfo
      ? this.tabsOptions.getTabInfo(tabKey)
      : (tabInitial?.info ?? tabOld?.info);
    if (!tabInfo) return;
    // update
    const tabNew = { ...tabOld, info: tabInfo };
    this.updateTab(tabNew);
  }

  updateTabItemPageMeta(tabKey?: string, componentKey?: string, pageMeta?: IPageMeta) {
    if (this._deferTabsWork(() => this.updateTabItemPageMeta(tabKey, componentKey, pageMeta))) {
      return false;
    }
    if (!tabKey || !componentKey) return false;
    // tab
    const [index, tab] = this.findTab(tabKey);
    if (index === -1 || !tab) return false;
    // tabItem
    if (!tab.items) return false;
    const indexItem = tab.items.findIndex(item => item.componentKey === componentKey);
    if (indexItem === -1) return false;
    const tabItem = tab.items[indexItem];
    // change tab item
    const pageMetaNew: IPageMeta = { ...tabItem.pageMeta, ...pageMeta };
    const tabItemNew: IRouteViewRouteItem = { ...tabItem, pageMeta: pageMetaNew };
    const items = mutate(tab.items, copyState => {
      copyState.splice(indexItem, 1, tabItemNew);
    });
    const tabNew: RouteTab = { ...tab, items };
    this.tabs = mutate(this.tabs, copyState => {
      copyState.splice(index, 1, tabNew);
    });
    return true;
  }

  async deleteTab(
    tabKey?: string,
    noActiveNext?: boolean,
    reason: TypeRouteDiscardReason | false = 'workspaceClose',
  ) {
    if (this._tabsDisposed || this.ctx.disposed || !tabKey) return;
    const current = this._captureTabsOperation();
    // tabs
    const [index, tab] = this.findTab(tabKey);
    if (index === -1 || !tab) return;
    const cleanup = reason
      ? this.$router.notifyRouteDiscard(
          reason,
          (tab.items ?? []).map(item => ({
            fullPath: item.fullPath,
            componentKey: item.componentKey,
            tabKey,
          })),
          this.selector,
        )
      : undefined;
    // active next
    let tabKeyActiveNext;
    if (!noActiveNext && index === this.tabCurrentIndex) {
      // prev/next
      const tabCurrentIndex =
        index + 1 < this.tabs.length ? index + 1 : index - 1 > -1 ? index - 1 : -1;
      if (tabCurrentIndex > -1) {
        tabKeyActiveNext = this.tabs[tabCurrentIndex]?.tabKey;
      }
    }
    // tabs
    this.tabs = mutate(this.tabs, copyState => {
      copyState.splice(index, 1);
    });
    await cleanup;
    if (!current()) return;
    // active next
    if (tabKeyActiveNext) {
      await this.activeTab(tabKeyActiveNext);
    }
  }

  async deleteTabItem(
    tabKey?: string,
    componentKey?: string,
    noActiveNext?: boolean,
    reason: TypeRouteDiscardReason | false = 'taskClose',
  ) {
    if (this._tabsDisposed || this.ctx.disposed || !tabKey || !componentKey) return false;
    const current = this._captureTabsOperation();
    if (tabKey === componentKey) return false; // not delete first tabItem
    // tab
    const [index, tab] = this.findTab(tabKey);
    if (index === -1 || !tab) return false;
    // indexItem
    if (!tab.items) return false;
    const indexItem = tab.items.findIndex(item => item.componentKey === componentKey);
    if (indexItem === -1) return false;
    // deleteTab if length===1
    if (tab.items.length === 1 && !tab.affix) {
      // delete tab
      await this.deleteTab(tabKey, noActiveNext, reason);
      return true;
    }
    const cleanup = reason
      ? this.$router.notifyRouteDiscard(
          reason,
          [{ fullPath: tab.items[indexItem].fullPath, componentKey, tabKey }],
          this.selector,
        )
      : undefined;
    // active next
    let componentKeyActiveNext;
    if (!noActiveNext && componentKey === this.componentKeyCurrent) {
      // prev/next
      const tabItemCurrentIndex =
        indexItem + 1 < tab.items.length ? indexItem + 1 : indexItem - 1 > -1 ? indexItem - 1 : -1;
      if (tabItemCurrentIndex > -1) {
        componentKeyActiveNext = tab.items[tabItemCurrentIndex]?.componentKey;
      }
    }
    // delete tab item
    const items = mutate(tab.items, copyState => {
      copyState.splice(indexItem, 1);
    });
    const tabNew: RouteTab = { ...tab, items };
    this.tabs = mutate(this.tabs, copyState => {
      copyState.splice(index, 1, tabNew);
    });
    await cleanup;
    if (!current()) return false;
    // active next
    if (componentKeyActiveNext) {
      await this.activeTabItem(tabKey, componentKeyActiveNext);
    }
    return true;
  }

  findTabItemByFullPath(fullPath: string) {
    for (const tab of this.tabs) {
      if (!tab.items) continue;
      for (const item of tab.items) {
        if (item.fullPath === fullPath) {
          return [tab.tabKey, item.componentKey];
        }
      }
    }
    return [];
  }

  updateTab(tab: Partial<RouteTabTransient>) {
    if (this._deferTabsWork(() => this.updateTab(tab))) return;
    const tabKey = tab.tabKey!;
    const [index, tabOld] = this.findTab(tabKey);
    if (index === -1 || !tabOld) return;
    const items: IRouteViewRouteItem[] = tabOld.items
      ? ([] as IRouteViewRouteItem[]).concat(tabOld.items)
      : [];
    if (tab.componentKey) {
      const tabItem: IRouteViewRouteItem = {
        componentKey: tab.componentKey,
        fullPath: tab.fullPath!,
        keepAlive: tab.keepAlive,
        updatedAt: Date.now(),
      };
      const itemIndex = this._findTabItemIndex(items, tab.componentKey);
      if (itemIndex === -1) {
        const insertIndex = this._getInsertIndexForNewTabItem(tabOld, items);
        items.splice(insertIndex, 0, tabItem);
      } else {
        const tabItemNew: IRouteViewRouteItem = { ...items[itemIndex], ...tabItem };
        items.splice(itemIndex, 1, tabItemNew);
      }
      this._moveAnchorItemFirst(items, tabKey);
    }
    const tabNew: RouteTab = {
      ...tabOld,
      ...tab,
      tabKey,
      items,
      updatedAt: Date.now(),
    };
    this.tabs = mutate(this.tabs, copyState => {
      copyState.splice(index, 1, tabNew);
    });
  }

  async activeTab(tabKey?: string) {
    if (this._tabsDisposed || this.ctx.disposed || !tabKey) return;
    const [_, tab] = this.findTab(tabKey);
    if (!tab) return;
    // should not updateTab here
    // this.updateTab({ tabKey });
    // this.tabKeyCurrent = tabKey;
    // first check tab.items?.[0]?.fullPath, because fullPath maybe has query string
    const tabItemFirst = tab.items?.[0];
    const path = tabItemFirst?.componentKey === tabKey ? tabItemFirst.fullPath : tabKey;
    await this.$router.push(path);
  }

  async activeTabItem(tabKey?: string, componentKey?: string) {
    if (this._tabsDisposed || this.ctx.disposed || !tabKey || !componentKey) return;
    const [_, tab] = this.findTab(tabKey);
    if (!tab) return;
    const tabItem = tab.items?.find(item => item.componentKey === componentKey);
    if (!tabItem) return;
    //
    const path = tabItem.fullPath;
    await this.$router.push(path);
  }

  findTab(tabKey?: string): [number, RouteTab | undefined] {
    if (!tabKey) return [-1, undefined];
    const index = this.tabs.findIndex(item => item.tabKey === tabKey);
    if (index === -1) return [index, undefined];
    return [index, this.tabs[index]];
  }

  private _getInsertIndexForNewTab(tabNew: RouteTab) {
    const lastAffixTabIndex = this._getLastAffixTabIndex();
    if (this.tabCurrentIndex === -1) {
      return lastAffixTabIndex + 1;
    }
    if (tabNew.affix) {
      return lastAffixTabIndex + 1;
    }
    const tabCurrent = this.tabs[this.tabCurrentIndex];
    if (tabCurrent?.affix) {
      return lastAffixTabIndex + 1;
    }
    return this.tabCurrentIndex + 1;
  }

  private _getLastAffixTabIndex() {
    let lastAffixTabIndex = -1;
    for (let index = 0; index < this.tabs.length; index++) {
      if (!this.tabs[index].affix) break;
      lastAffixTabIndex = index;
    }
    return lastAffixTabIndex;
  }

  private _findTabItemIndex(items: IRouteViewRouteItem[], componentKey?: string) {
    if (!componentKey) return -1;
    return items.findIndex(item => item.componentKey === componentKey);
  }

  private _getCurrentTabItemIndex(tab: RouteTab, items: IRouteViewRouteItem[]) {
    if (this.tabKeyCurrent !== tab.tabKey) return -1;
    return this._findTabItemIndex(items, this.componentKeyCurrent);
  }

  private _getInsertIndexForNewTabItem(tab: RouteTab, items: IRouteViewRouteItem[]) {
    const indexCurrentTabItem = this._getCurrentTabItemIndex(tab, items);
    if (indexCurrentTabItem > -1) {
      return indexCurrentTabItem + 1;
    }
    return items.length;
  }

  private _moveAnchorItemFirst(items: IRouteViewRouteItem[], tabKey: string) {
    const indexAnchor = items.findIndex(item => item.componentKey === tabKey);
    if (indexAnchor <= 0) return;
    const [anchorItem] = items.splice(indexAnchor, 1);
    items.unshift(anchorItem);
  }

  async pruneTabs() {
    if (this._tabsDisposed || this.ctx.disposed) return;
    const current = this._captureTabsOperation();
    let max = this.tabsOptions.max;
    if (max === undefined || max === -1) return;
    if (max < 1) max = 1;
    while (true) {
      const affixCount = this.tabs.filter(item => item.affix).length;
      if (this.tabs.length - affixCount <= max) break;
      let tabKey: string | undefined;
      let updatedAt = Date.now();
      for (const tab of this.tabs) {
        if (!tab.affix && tab.updatedAt < updatedAt) {
          tabKey = tab.tabKey;
          updatedAt = tab.updatedAt;
        }
      }
      if (!tabKey) break;
      await this.deleteTab(tabKey, true, false);
      if (!current()) return;
    }
  }

  async pruneTabItems(tabKey?: string) {
    if (this._tabsDisposed || this.ctx.disposed || !tabKey) return;
    const current = this._captureTabsOperation();
    let maxItems = this.tabsOptions.maxItems;
    if (maxItems === undefined || maxItems === -1) return;
    if (maxItems < 1) maxItems = 1;
    while (true) {
      const [_, tab] = this.findTab(tabKey);
      if (!tab || !tab.items) break;
      const ignoreCount = tab.items.filter(item => item.componentKey === tabKey).length;
      if (tab.items.length - ignoreCount <= maxItems) break;
      let componentKey: string | undefined;
      let updatedAt = Date.now();
      for (const tabItem of tab.items) {
        if (tabItem.componentKey !== tabKey && tabItem.updatedAt < updatedAt) {
          componentKey = tabItem.componentKey;
          updatedAt = tabItem.updatedAt;
        }
      }
      if (!componentKey) break;
      await this.deleteTabItem(tabKey, componentKey, true, false);
      if (!current()) return;
    }
  }

  // special for _addTab
  private _checkIfTabNeedUpdate(tabOld: RouteTab, tabNew: Partial<RouteTabTransient>) {
    for (const key in tabNew) {
      if (['fullPath', 'keepAlive', 'updatedAt'].includes(key)) continue;
      if (['componentKey'].includes(key)) {
        if (!tabOld.items) return true;
        const tabItemOld = tabOld.items.find(item => item[key] === tabNew[key]);
        if (!tabItemOld) return true;
        for (const key2 of ['fullPath', 'keepAlive']) {
          if (tabItemOld[key2] !== tabNew[key2]) return true;
        }
        const recentItemIndex = tabOld.items.findIndex(
          item =>
            item[key] !== tabItemOld[key] && (item.updatedAt ?? 0) >= (tabItemOld.updatedAt ?? 0),
        );
        if (recentItemIndex > -1) return true;
      } else if (tabNew[key] !== tabOld[key]) {
        return true;
      }
    }
    const recentTabIndex = this.tabs.findIndex(
      item => item.tabKey !== tabOld.tabKey && (item.updatedAt ?? 0) >= (tabOld.updatedAt ?? 0),
    );
    if (recentTabIndex > -1) return true;
    return false;
  }

  private _getKeepAliveInclude() {
    const include: string[] = [];
    for (const tab of this.tabs) {
      if (!tab.items) continue;
      for (const item of tab.items) {
        if (item.keepAlive !== false && item.componentKey) {
          if (!include.includes(item.componentKey)) {
            include.push(item.componentKey);
          }
        }
      }
    }
    return include;
  }

  private _getInitialTabs() {
    const tabs = this.tabsOptions.getInitialTabs?.() ?? [];
    if (!this.tabsOptions.getTabInfo) return tabs;
    return tabs.map(tab => {
      return {
        ...tab,
        info: this.tabsOptions.getTabInfo?.(tab.tabKey) ?? tab.info,
      };
    });
  }

  backRoute(route: RouteLocationNormalizedLoadedGeneric) {
    if (this._deferTabsWork(() => this.backRoute(route))) return;
    const [tabKey, componentKey] = this.findTabItemByFullPath(route.fullPath);
    // The router emits the Back notification once; replace/pruning are not explicit discards.
    void this.deleteTabItem(tabKey, componentKey, true, false);
  }

  forwardRoute(route: RouteLocationNormalizedLoadedGeneric) {
    if (this._deferTabsWork(() => this.forwardRoute(route))) return;
    const routeMeta = this.prepareRouteMeta(route);
    this.addTab(routeMeta);
  }

  public setPageMeta(route: RouteLocationNormalizedLoadedGeneric, pageMeta: IPageMeta) {
    if (this._deferTabsWork(() => this.setPageMeta(route, pageMeta))) return;
    const [tabKey, componentKey] = this.findTabItemByFullPath(route.fullPath);
    this.updateTabItemPageMeta(tabKey, componentKey, pageMeta);
  }

  prepareRouteMeta(route: RouteLocationNormalizedLoadedGeneric): IRouteViewRouteMeta {
    // fullPath
    const fullPath = route.fullPath;
    // componentKey
    const componentKey = this.__handleRoutePropComponentKey(route);
    // tabKey
    const tabKey = this._handleRouteProp(route, 'tabKey') || componentKey;
    // keepAlive
    const keepAlive = this._handleRouteProp(route, 'keepAlive');
    // tab
    return { tabKey, componentKey, fullPath, keepAlive };
  }

  private _handleRouteProp(
    route: RouteLocationNormalizedLoaded,
    prop: 'componentKey' | 'tabKey',
  ): string;
  private _handleRouteProp(route: RouteLocationNormalizedLoaded, prop: 'keepAlive'): boolean;
  private _handleRouteProp(route: RouteLocationNormalizedLoaded, prop) {
    let value = route.meta[prop];
    if (typeof value === 'function') {
      value = value.call(this.app, route);
    }
    return value;
  }

  private __handleRoutePropComponentKey(route: RouteLocationNormalizedLoaded) {
    const componentKey = this._handleRouteProp(route, 'componentKey');
    if (componentKey) return componentKey;
    // name
    const name = this.$router.getRealRouteName(route.name);
    // path
    if (!name) return route.path;
    // name: nameOnly
    if (route.meta.componentKeyMode === 'nameOnly') return name;
    // name: withParams
    return route.path;
  }

  private _resetAllPageDirty() {
    const tabItems: [string, string][] = [];
    for (const tab of this.tabs) {
      if (!tab.items) continue;
      for (const tabItem of tab.items) {
        if (tabItem.pageMeta?.pageDirty) {
          tabItems.push([tab.tabKey, tabItem.componentKey]);
        }
      }
    }
    for (const [tabKey, componentKey] of tabItems) {
      this.updateTabItemPageMeta(tabKey, componentKey, { pageDirty: false });
    }
  }
}

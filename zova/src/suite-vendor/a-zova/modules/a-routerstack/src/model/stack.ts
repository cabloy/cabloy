import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { RouteLocationNormalizedLoadedGeneric } from '@cabloy/vue-router';
import { mutate } from 'mutate-on-copy';
import { deepExtend } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';
import { IRouteViewRouteMeta } from 'zova-module-a-router';

import {
  ModelStackOptions,
  ModelStackOptionsBase,
  RouteTab,
  RouteTabTransient,
} from '../types/stack.js';

export interface IModelOptionsStack extends IDecoratorModelOptions, ModelStackOptionsBase {}

@Model<IModelOptionsStack>({
  enableSelector: true,
  max: -1,
})
export class ModelStack extends BeanModelBase {
  stackOptions: ModelStackOptions;
  tabs: RouteTab[];
  keepAliveInclude: string[];

  protected async __init__(scene: string, options?: ModelStackOptions) {
    await super.__init__(scene);
    this.bean._setBean('$$modelStack', this);
    // options
    this.stackOptions = deepExtend({}, this.$onionOptions, options);
    // tabs: always []
    this.tabs = [];
    // computed
    this.keepAliveInclude = this.$computed(() => {
      return this._getKeepAliveInclude();
    });
    // first route
    if (this.$currentRoute) {
      this.forwardRoute(this.$currentRoute);
    }
  }

  addTab(tab: RouteTabTransient): boolean {
    return this._addTab(tab);
  }

  _addTab(tab: Partial<RouteTabTransient>): boolean {
    const tabKey = tab.tabKey;
    if (!tabKey) return false;
    // tab
    const [index, tabOld] = this.findTab(tabKey);
    // tabs
    if (index === -1) {
      // new
      const tabNew: RouteTab = {
        tabKey,
        updatedAt: Date.now(),
      };
      this.tabs = mutate(this.tabs, copyState => {
        copyState.push(tabNew);
      });
      this.pruneTabs();
    } else {
      // update
      if (!this._checkIfTabNeedUpdate(tabOld!, tab)) {
        return false;
      }
      this.updateTab(tab);
    }
    return true;
  }

  findTab(tabKey?: string): [number, RouteTab | undefined] {
    if (!tabKey) return [-1, undefined];
    const index = this.tabs.findIndex(item => item.tabKey === tabKey);
    if (index === -1) return [index, undefined];
    return [index, this.tabs[index]];
  }

  deleteTab(tabKey?: string) {
    if (!tabKey) return false;
    // tabs
    const [index] = this.findTab(tabKey);
    if (index === -1) return false;
    // tabs
    this.tabs = mutate(this.tabs, copyState => {
      copyState.splice(index, 1);
    });
    return true;
  }

  updateTab(tab: Partial<RouteTabTransient>) {
    const tabKey = tab.tabKey!;
    const [index, tabOld] = this.findTab(tabKey);
    if (index === -1 || !tabOld) return;
    const tabNew: RouteTab = {
      ...tabOld,
      tabKey,
      updatedAt: Date.now(),
    };
    this.tabs = mutate(this.tabs, copyState => {
      copyState.splice(index, 1, tabNew);
    });
  }

  async pruneTabs() {
    let max = this.stackOptions.max;
    if (max === undefined || max === -1) return;
    if (max < 1) max = 1;
    while (true) {
      if (this.tabs.length <= max) break;
      let tabKey: string | undefined;
      let updatedAt = Date.now();
      for (const tab of this.tabs) {
        if (tab.updatedAt < updatedAt) {
          tabKey = tab.tabKey;
          updatedAt = tab.updatedAt;
        }
      }
      if (!tabKey) break;
      this.deleteTab(tabKey);
    }
  }

  // special for _addTab
  private _checkIfTabNeedUpdate(tabOld: RouteTab, _tabNew: Partial<RouteTabTransient>) {
    const recentTabIndex = this.tabs.findIndex(
      item => item.tabKey !== tabOld.tabKey && (item.updatedAt ?? 0) >= (tabOld.updatedAt ?? 0),
    );
    if (recentTabIndex > -1) return true;
    return false;
  }

  private _getKeepAliveInclude() {
    const include: string[] = [];
    for (const tab of this.tabs) {
      if (!include.includes(tab.tabKey)) {
        include.push(tab.tabKey);
      }
    }
    return include;
  }

  backRoute(route: RouteLocationNormalizedLoadedGeneric) {
    this.deleteTab(route.fullPath);
  }

  forwardRoute(route: RouteLocationNormalizedLoadedGeneric) {
    const componentMeta = this.prepareRouteMeta(route);
    this.addTab(componentMeta);
  }

  prepareRouteMeta(route: RouteLocationNormalizedLoadedGeneric): IRouteViewRouteMeta {
    // fullPath
    const fullPath = route.fullPath;
    // tab
    return { tabKey: fullPath, componentKey: fullPath, fullPath };
  }
}

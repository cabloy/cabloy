import type { ModelTabs, ModelTabsOptions } from 'zova-module-a-routertabs';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

import { ModelLayout } from '../../model/layout.js';
import { ModelMenu } from '../../model/menu.js';

export interface ControllerLayoutTabsProps {}

@Controller()
export class ControllerLayoutTabs extends BeanControllerBase {
  static $propsDefault = {};

  $$modelTabs: ModelTabs;

  @Use()
  $$modelMenu: ModelMenu;

  @Use()
  $$modelLayout: ModelLayout;

  @Use({ init: { arg: { sidebarLeftOpenPC: true } as IServiceSsrLayoutOptions } })
  $$serviceSsrLayout: ServiceSsrLayout;

  leftDrawerOpen: boolean;
  leftDrawerOpenMobile: boolean = false;
  belowBreakpoint: boolean;

  protected async __init__() {
    // belowBreakpoint
    this.belowBreakpoint = this.$computed(() => {
      let width;
      if (process.env.SERVER) {
        width = 0;
      } else {
        width = document.documentElement.clientWidth;
      }
      return width <= this.sys.config.layout.sidebar.breakpoint;
    });
    // leftDrawerOpen
    this.leftDrawerOpen = this.$customRef(() => {
      // eslint-disable-next-line
      const self = this;
      return {
        get() {
          return self.belowBreakpoint
            ? self.leftDrawerOpenMobile
            : self.$$modelLayout.leftDrawerOpenPC;
        },
        set(value) {
          if (self.belowBreakpoint) {
            self.leftDrawerOpenMobile = value;
          } else {
            self.$$modelLayout.leftDrawerOpenPC = value;
          }
        },
      };
    });
    // passport
    if (process.env.SERVER) {
      await this.$passport.ensurePassport();
    }
    // menu
    await $QueryAutoLoad(() => this.$$modelMenu.retrieveMenus());
    // tabs
    await this._initTabs();
  }

  private async _initTabs() {
    const configTabs = this.scope.config.tabs;
    const tabsOptions: ModelTabsOptions = {
      max: configTabs.max,
      maxItems: configTabs.maxItems,
      cache: configTabs.cache,
      getInitialTabs: () => {
        if (!this.$$modelMenu.retrieveMenus().data) return;
        return [{ tabKey: '/', affix: true }];
      },
      getTabInfo: tabKey => {
        const queryMenu = this.$$modelMenu.retrieveMenus();
        if (!queryMenu.data || queryMenu.isError) return undefined;
        const menuItem = this.$$modelMenu.findMenuItem({ link: tabKey });
        if (!menuItem) return undefined;
        return { title: menuItem.title, icon: menuItem.icon };
      },
    };
    this.$$modelTabs = await this.bean._getBeanSelector(
      'a-routertabs.model.tabs',
      true,
      configTabs.scene,
      tabsOptions,
    );
    // watch menus
    this.$watch(
      () => {
        return this.$$modelMenu.retrieveMenus().data;
      },
      () => {
        this.$$modelTabs.updateAllTabInfos();
      },
    );
  }

  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}

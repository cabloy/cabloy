import type { ModelTabs, ModelTabsOptions } from 'zova-module-a-routertabs';

import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { IServiceSsrLayoutOptions, ServiceLocale, ServiceSsrLayout } from 'zova-module-home-base';

import { ModelLayout } from '../../model/layout.js';
import { ModelMenu } from '../../model/menu.js';

export interface ControllerLayoutAdminProps {}

@Controller()
export class ControllerLayoutAdmin extends BeanControllerBase {
  static $propsDefault = {};

  $$modelTabs: ModelTabs;

  @Use()
  $$modelMenu: ModelMenu;

  @Use()
  $$modelLayout: ModelLayout;

  @Use()
  get $$serviceSsrLayout(): ServiceSsrLayout {
    const sidebar = this.scope.config.layout.sidebar;
    return usePrepareArg({
      bodyReadyObserver: sidebar.bodyReadyObserver,
      sidebarBreakpoint: sidebar.breakpoint,
      sidebarLeftOpenPCCapability: sidebar.leftOpenPCCapability,
      sidebarLeftOpenPCFallback: sidebar.leftOpenPCFallback,
    } satisfies IServiceSsrLayoutOptions);
  }

  @Use()
  $$serviceLocale: ServiceLocale;

  leftDrawerOpen: boolean;
  leftDrawerOpenMobile: boolean = false;
  belowBreakpoint: boolean;
  private viewportWidth: number = 0;
  private _windowResizeHandler?: () => void;

  protected async __init__() {
    // viewport
    if (process.env.CLIENT) {
      this._windowResizeHandler = () => {
        this.viewportWidth = document.documentElement.clientWidth;
      };
      this._windowResizeHandler();
      window.addEventListener('resize', this._windowResizeHandler);
    }
    // belowBreakpoint
    this.belowBreakpoint = this.$computed(() => {
      return this.viewportWidth <= this.scope.config.layout.sidebar.breakpoint;
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
    await $QueryEnsureLoaded(() => this.$$modelMenu.retrieveMenus());
    // tabs
    await this._initTabs();
  }

  protected __dispose__() {
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
    }
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

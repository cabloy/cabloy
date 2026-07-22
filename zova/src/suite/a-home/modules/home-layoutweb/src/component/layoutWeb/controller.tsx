import { BeanControllerBase, Use, UseScope } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ModelTabs, ModelTabsOptions, RouteTabInitial } from 'zova-module-a-routertabs';
import { ScopeModuleASsr } from 'zova-module-a-ssr';
import { IServiceSsrLayoutOptions, ServiceLocale, ServiceSsrLayout } from 'zova-module-home-base';

import { ModelLayout } from '../../model/layout.js';
import { ModelMenu } from '../../model/menu.js';

export interface ControllerLayoutWebProps {}

@Controller()
export class ControllerLayoutWeb extends BeanControllerBase {
  static $propsDefault = {};

  $$modelTabs: ModelTabs;

  @Use()
  $$modelMenu: ModelMenu;

  @Use()
  $$modelLayout: ModelLayout;

  @UseScope()
  $$scopeSsr: ScopeModuleASsr;

  @Use({ init: { arg: { sidebarLeftOpenPC: false } as IServiceSsrLayoutOptions } })
  $$serviceSsrLayout: ServiceSsrLayout;

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
      return this.viewportWidth <= this.sys.config.layout.sidebar.breakpoint;
    });
    // leftDrawerOpen
    this.leftDrawerOpen = this.$customRef(() => {
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
        return this._getInitialTabs();
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
        this.$$modelTabs.resetAllTabInfos();
      },
    );
  }

  private _getInitialTabs() {
    return this.$$modelMenu.menuTree?.map(item => {
      return {
        tabKey: item.folder ? item.name : item.link,
        info: item,
      } as RouteTabInitial;
    });
  }

  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
  }
}

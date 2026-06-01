import { provide, ref } from 'vue';
import { BeanControllerBase, Use, useComputed, UseScope } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { ModelTabs, ModelTabsOptions, RouteTabInitial } from 'zova-module-a-routertabs';
import { ScopeModuleASsr } from 'zova-module-a-ssr';
import { IServiceSsrLayoutOptions, ServiceLocale, ServiceSsrLayout } from 'zova-module-home-base';
import { ILayoutConfig } from 'zova-module-vuetify-adapter';

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

  layoutConfig: ILayoutConfig;
  layoutConfigTimeout: number = 0;

  leftDrawerOpen: boolean;
  leftDrawerOpenMobile: boolean = false;
  belowBreakpoint: boolean;

  protected async __init__() {
    // belowBreakpoint
    this.belowBreakpoint = useComputed(() => {
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
    // layoutConfig
    this.__initLayoutConfig();
    // menu
    await $QueryAutoLoad(() => this.$$modelMenu.retrieveMenus());
    // tabs
    await this._initTabs();
  }

  toggleLeftDrawer() {
    this.leftDrawerOpen = !this.leftDrawerOpen;
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
        this.$$modelTabs.updateAllTabInfos(this._getInitialTabs());
      },
    );
  }

  private __initLayoutConfig() {
    this.layoutConfig = this.scope.config.layout;
    this.layoutConfig.leftDrawerOpen = this.leftDrawerOpen;
    if (process.env.SSR) {
      const layoutConfigRef = ref<ILayoutConfig | undefined>(this.layoutConfig);
      provide('VuetifyLayoutConfig', layoutConfigRef);
      if (process.env.CLIENT) {
        if (!this.layoutConfigTimeout) {
          this.layoutConfigTimeout = window.setTimeout(() => {
            layoutConfigRef.value = undefined;
          }, 100);
        }
      }
    }
  }

  private _getInitialTabs() {
    return this.$$modelMenu.menuTree?.map(item => {
      return {
        tabKey: item.folder ? item.name : item.link,
        info: item,
      } as RouteTabInitial;
    });
  }
}

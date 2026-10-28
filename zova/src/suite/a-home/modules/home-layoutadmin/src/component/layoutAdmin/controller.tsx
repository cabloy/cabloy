import type { ModelTabs, ModelTabsOptions } from 'zova-module-a-routertabs';

import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

import { ModelLayout } from '../../model/layout.ts';
import { ModelMenu } from '../../model/menu.ts';

export interface ControllerLayoutAdminProps {}

@Controller()
export class ControllerLayoutAdmin extends BeanControllerBase {
  static $propsDefault = {};

  $$modelTabs: ModelTabs;

  @Use()
  $$modelMenu: ModelMenu;

  @Use()
  $$modelLayout: ModelLayout;

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    const sidebar = this.scope.config.layout.sidebar;
    return usePrepareArg({
      bodyReadyObserver: sidebar.bodyReadyObserver,
      sidebarWidth: sidebar.width,
      sidebarBreakpoint: sidebar.breakpoint,
      sidebarLeftOpenPCCapability: sidebar.leftOpenPCCapability,
      sidebarLeftOpenPCFallback: sidebar.leftOpenPCFallback,
    } satisfies IServiceSsrLayoutOptions);
  }

  leftDrawerOpen: boolean;
  leftDrawerOpenMobile: boolean = false;
  belowBreakpoint: boolean;
  private viewportWidth: number = 0;
  private _windowResizeHandler?: () => void;

  headerActionsOpen = false;
  headerActionsId = 'home-layoutadmin-header-actions';
  private _headerActionsElement?: HTMLDivElement;
  private _headerOutsideHandler: (event: PointerEvent) => void;
  private _headerClickHandler: (event: MouseEvent) => void;

  protected async __init__() {
    this._headerClickHandler = event => this.onHeaderActionsClick(event);
    this._headerOutsideHandler = event => {
      if (event.target instanceof Node && !this._headerActionsElement?.contains(event.target)) {
        this.closeHeaderActions();
      }
    };
    // viewport
    if (process.env.CLIENT) {
      this._windowResizeHandler = () => {
        this.viewportWidth = document.documentElement.clientWidth;
        this.closeHeaderActions();
      };
      this._windowResizeHandler();
      window.addEventListener('resize', this._windowResizeHandler);
      document.addEventListener('pointerdown', this._headerOutsideHandler);
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
    this.setHeaderActionsElement();
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
      document.removeEventListener('pointerdown', this._headerOutsideHandler);
    }
  }

  setHeaderActionsElement(element?: HTMLDivElement) {
    if (element === this._headerActionsElement) return;
    this._headerActionsElement?.removeEventListener('click', this._headerClickHandler, true);
    this._headerActionsElement = element;
    element?.addEventListener('click', this._headerClickHandler, true);
  }

  toggleHeaderActions() {
    if (this.headerActionsOpen) {
      this.closeHeaderActions();
    } else {
      this.headerActionsOpen = true;
    }
  }

  closeHeaderActions(restoreFocus = false) {
    this.headerActionsOpen = false;
    this._headerActionsElement
      ?.querySelectorAll<HTMLDetailsElement>('details[open]')
      .forEach(details => {
        details.open = false;
      });
    if (restoreFocus) {
      this._headerActionsElement?.querySelector<HTMLButtonElement>('button')?.focus();
    }
  }

  onHeaderActionsFocusout(event: FocusEvent) {
    if (
      this.headerActionsOpen &&
      (!(event.relatedTarget instanceof Node) ||
        !this._headerActionsElement?.contains(event.relatedTarget))
    ) {
      this.closeHeaderActions();
    }
  }

  onHeaderActionsClick(event: MouseEvent) {
    if (!this.headerActionsOpen || !(event.target instanceof Element)) return;
    const action = event.target.closest('a, button');
    if (action?.closest('details') && !action.matches(':disabled, [aria-disabled="true"]')) {
      this.closeHeaderActions(true);
    }
  }

  onHeaderActionsKeydown(event: KeyboardEvent) {
    if (
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      !(event.target instanceof Element) ||
      event.target.closest('dialog[open], [role="dialog"]')
    ) {
      return;
    }
    const details = event.target.closest<HTMLDetailsElement>('details[open]');
    if (details) {
      event.preventDefault();
      event.stopPropagation();
      details.open = false;
      details.querySelector<HTMLElement>('summary')?.focus();
    } else if (this.headerActionsOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.closeHeaderActions(true);
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

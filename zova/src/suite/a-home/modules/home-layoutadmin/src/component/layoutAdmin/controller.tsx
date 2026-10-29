import type { ModelTabs, ModelTabsOptions } from 'zova-module-a-routertabs';

import { nextTick, useId } from 'vue';
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

  tabItemsWidth: number | undefined = undefined;
  tabItemsOverflowStart = false;
  tabItemsOverflowEnd = false;
  tabItemsMenuOpen = false;
  tabItemsMenuId: string;
  private _tabItemsElement?: HTMLDivElement;
  private _tabItemsMenuElement?: HTMLDivElement;
  private _tabItemsObserver?: ResizeObserver;
  private _tabItemsMounted = false;
  private _tabItemsMenuFrame?: number;
  private _tabItemsOnScroll: () => void;
  private _tabItemsOnToggle: (event: ToggleEvent) => void;
  private _tabItemsOnViewport: (event: Event) => void;
  private _tabItemsOnKeydown: (event: KeyboardEvent) => void;

  get tabItemsCompact() {
    return this.tabItemsWidth !== undefined && this.tabItemsWidth < 240;
  }

  protected async __init__() {
    this.tabItemsMenuId = this.$composable(useId);
    this._tabItemsOnScroll = () => this.measureTabItems();
    this._tabItemsOnToggle = event => this.onTabItemsMenuToggle(event);
    this._tabItemsOnViewport = event => {
      if (event.target instanceof Node && this._tabItemsMenuElement?.contains(event.target)) return;
      this.closeTabItemsMenu();
    };
    this._tabItemsOnKeydown = event => {
      if (event.key !== 'Escape' || event.defaultPrevented || !this.tabItemsMenuOpen) return;
      const active = this._tabItemsMenuElement?.ownerDocument.activeElement;
      const trigger = this._tabItemsElement?.querySelector('[data-testid="tab-items-more"]');
      if (active?.closest('dialog[open], [role="dialog"]')) return;
      if (
        active !== document.body &&
        active !== trigger &&
        !this._tabItemsMenuElement?.contains(active ?? null)
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      this.closeTabItemsMenu(true);
    };
    this.$controllerMounted(() => {
      this.$ssr.handleDirectOrOnHydrated(() => {
        if (this.ctx.disposed) return;
        this._tabItemsMounted = true;
        this.observeTabItems();
      });
    });
    this.$watch(
      () => [
        this.$$modelTabs?.tabKeyCurrent,
        this.$$modelTabs?.componentKeyCurrent,
        this.$$modelTabs?.tabCurrent?.items?.map(item => [
          item.componentKey,
          item.pageMeta?.pageTitle,
          item.pageMeta?.pageDirty,
          item.pageMeta?.formMeta?.formScene,
        ]),
        this.tabItemsCompact,
      ],
      ([tabKey], [previousTabKey]) => {
        if (tabKey !== previousTabKey) this.closeTabItemsMenu();
        void nextTick(() => this.observeTabItems());
      },
    );
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
        this.closeTabItemsMenu();
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

  setTabItemsElement(element?: HTMLDivElement) {
    if (element === this._tabItemsElement) return;
    this._tabItemsObserver?.disconnect();
    this._tabItemsElement?.removeEventListener('scroll', this._tabItemsOnScroll, true);
    this._tabItemsElement = element;
    element?.addEventListener('scroll', this._tabItemsOnScroll, true);
    this.observeTabItems();
  }

  private observeTabItems() {
    const element = this._tabItemsElement;
    if (!this._tabItemsMounted || this.ctx.disposed || !element) return;
    this._tabItemsObserver?.disconnect();
    this._tabItemsObserver = new ResizeObserver(() => {
      this.measureTabItems();
      this.revealTabItem();
    });
    this._tabItemsObserver.observe(element);
    const content = element.querySelector('.tab-items-content');
    if (content) this._tabItemsObserver.observe(content);
    this.measureTabItems();
    this.revealTabItem();
  }

  private measureTabItems() {
    const element = this._tabItemsElement;
    if (this.ctx.disposed || !element) return;
    this.tabItemsWidth = element.clientWidth;
    const scroller = element.querySelector('.tab-items-scroll');
    const content = element.querySelector('.tab-items-content');
    const bounds = scroller?.getBoundingClientRect();
    const items = content?.getBoundingClientRect();
    this.tabItemsOverflowStart = !!bounds && !!items && items.left < bounds.left - 1;
    this.tabItemsOverflowEnd = !!bounds && !!items && items.right > bounds.right + 1;
  }

  private revealTabItem() {
    const element = this._tabItemsElement;
    const scroller = element?.querySelector('.tab-items-scroll');
    const active = scroller?.querySelector('[aria-selected="true"]');
    if (!scroller || !active || this.ctx.disposed) return;
    const bounds = scroller.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    const delta =
      item.left < bounds.left ? item.left - bounds.left : Math.max(0, item.right - bounds.right);
    if (delta) scroller.scrollBy({ left: delta, behavior: 'instant' });
    this.measureTabItems();
  }

  setTabItemsMenuElement(element?: HTMLDivElement) {
    if (element === this._tabItemsMenuElement) return;
    this.closeTabItemsMenu();
    this._tabItemsMenuElement?.removeEventListener('beforetoggle', this._tabItemsOnToggle);
    this._tabItemsMenuElement = element;
    element?.addEventListener('beforetoggle', this._tabItemsOnToggle);
  }

  closeTabItemsMenu(restoreFocus = false) {
    const element = this._tabItemsMenuElement;
    if (this.tabItemsMenuOpen && element?.isConnected) element.hidePopover();
    this.clearTabItemsMenu();
    if (restoreFocus) {
      this._tabItemsElement
        ?.querySelector<HTMLButtonElement>('[data-testid="tab-items-more"]')
        ?.focus({ preventScroll: true });
    }
  }

  private clearTabItemsMenu() {
    this.tabItemsMenuOpen = false;
    if (this._tabItemsMenuFrame !== undefined) {
      window.cancelAnimationFrame(this._tabItemsMenuFrame);
      this._tabItemsMenuFrame = undefined;
    }
    if (process.env.CLIENT) {
      window.removeEventListener('scroll', this._tabItemsOnViewport, true);
      document.removeEventListener('keydown', this._tabItemsOnKeydown);
    }
    this._tabItemsMenuElement?.style.removeProperty('visibility');
  }

  private onTabItemsMenuToggle(event: ToggleEvent) {
    if (event.target !== this._tabItemsMenuElement) return;
    if (event.newState !== 'open') {
      this.clearTabItemsMenu();
      return;
    }
    this.closeHeaderActions();
    this.tabItemsMenuOpen = true;
    const element = this._tabItemsMenuElement!;
    element.style.visibility = 'hidden';
    this._tabItemsMenuFrame = window.requestAnimationFrame(() => {
      this._tabItemsMenuFrame = undefined;
      if (!this.tabItemsMenuOpen) return;
      this.positionTabItemsMenu();
      element.style.removeProperty('visibility');
      element.querySelector<HTMLButtonElement>('.tab-items-select')?.focus({ preventScroll: true });
      window.addEventListener('scroll', this._tabItemsOnViewport, true);
    });
    document.addEventListener('keydown', this._tabItemsOnKeydown);
  }

  private positionTabItemsMenu() {
    const element = this._tabItemsMenuElement;
    const trigger = this._tabItemsElement?.querySelector('[data-testid="tab-items-more"]');
    if (!element || !trigger) return;
    const anchor = trigger.getBoundingClientRect();
    const popup = element.getBoundingClientRect();
    const viewport = element.ownerDocument.documentElement;
    element.style.left = `${Math.max(8, Math.min(anchor.right - popup.width, viewport.clientWidth - popup.width - 8))}px`;
    element.style.top = `${Math.max(8, Math.min(anchor.bottom + 4, viewport.clientHeight - popup.height - 8))}px`;
  }

  protected __dispose__() {
    this._tabItemsMounted = false;
    this.setTabItemsElement();
    this.setTabItemsMenuElement();
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

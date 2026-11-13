import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

@Controller()
export class ControllerLayoutMine extends BeanControllerBase {
  mobileMenuOpen = false;
  headerActionsOpen = false;
  headerActionsId = 'home-layoutmine-header-actions';
  private _headerActionsElement?: HTMLDivElement;
  private _headerOutsideHandler: (event: PointerEvent) => void;
  private _headerClickHandler: (event: MouseEvent) => void;
  private _windowResizeHandler?: () => void;

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    return usePrepareArg({
      bodyReadyObserver: false,
      sidebarLeftOpenPCCapability: false,
    } satisfies IServiceSsrLayoutOptions);
  }

  protected async __init__() {
    this._headerClickHandler = event => this.onHeaderActionsClick(event);
    this._headerOutsideHandler = event => {
      if (event.target instanceof Node && !this._headerActionsElement?.contains(event.target)) {
        this.closeHeaderActions();
      }
    };
    if (process.env.CLIENT) {
      this._windowResizeHandler = () => this.closeHeaderActions();
      window.addEventListener('resize', this._windowResizeHandler);
      document.addEventListener('pointerdown', this._headerOutsideHandler);
    }
    this.$watch(
      () => this.$currentRoute?.fullPath,
      () => {
        this.mobileMenuOpen = false;
        this.closeHeaderActions();
        this.$logger.debug('layout.mine.navigation completed');
      },
    );
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
      this.mobileMenuOpen = false;
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

  private _getMcpMenuGroup() {
    if (!this.$passport.roles?.some(role => role.mcpAccess === true)) return;
    return {
      title: 'MCP',
      items: [
        { path: '/cabloy/mcp/scopes', title: this.scope.locale.McpScopes() },
        { path: '/cabloy/mcp/authorizations', title: this.scope.locale.McpAuthorizations() },
        { path: '/cabloy/mcp/accessTokens', title: this.scope.locale.McpAccessTokens() },
      ],
    };
  }

  get menuGroups() {
    const mcpMenuGroup = this._getMcpMenuGroup();
    const groups = [
      {
        title: undefined,
        items: [{ path: '/home/user/account', title: this.scope.locale['Account Settings']() }],
      },
      ...(mcpMenuGroup ? [mcpMenuGroup] : []),
    ];
    return groups
      .map(group => ({
        ...group,
        items: group.items
          .filter(item => this.$router.checkPathValid(item.path))
          .map(item => ({ ...item, href: this.$router.getPagePath(item.path as never) })),
      }))
      .filter(group => group.items.length > 0);
  }
}

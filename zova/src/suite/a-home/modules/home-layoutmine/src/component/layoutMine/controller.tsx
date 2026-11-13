import { BeanControllerBase, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { IServiceSsrLayoutOptions, ServiceSsrLayout } from 'zova-module-home-base';

@Controller()
export class ControllerLayoutMine extends BeanControllerBase {
  mobileMenuOpen = false;

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    return usePrepareArg({
      bodyReadyObserver: false,
      sidebarLeftOpenPCCapability: false,
    } satisfies IServiceSsrLayoutOptions);
  }

  protected async __init__() {
    this.$watch(
      () => this.$currentRoute?.fullPath,
      () => {
        this.mobileMenuOpen = false;
        this.$logger.debug('layout.mine.navigation completed');
      },
    );
  }

  get menuGroups() {
    return [
      {
        title: undefined,
        items: [{ path: '/home/user/account', title: this.scope.locale['Account Settings']() }],
      },
      {
        title: 'MCP',
        items: [
          { path: '/cabloy/mcp/scopes', title: this.scope.locale.McpScopes() },
          { path: '/cabloy/mcp/authorizations', title: this.scope.locale.McpAuthorizations() },
          { path: '/cabloy/mcp/accessTokens', title: this.scope.locale.McpAccessTokens() },
        ],
      },
    ]
      .map(group => ({
        ...group,
        items: group.items
          .filter(item => this.$router.checkPathValid(item.path))
          .map(item => ({ ...item, href: this.$router.getPagePath(item.path as never) })),
      }))
      .filter(group => group.items.length > 0);
  }
}

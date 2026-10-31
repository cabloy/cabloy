import { BeanControllerBase, ClientOnly, Use, usePrepareArg } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { ZRouterViewEmpty } from 'zova-module-a-router';
import {
  closeNearestDetails,
  IServiceSsrLayoutOptions,
  ServiceSsrLayout,
} from 'zova-module-home-base';

export interface ControllerLayoutEmptyProps {}

@Controller()
export class ControllerLayoutEmpty extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ beanFullName: 'home-base.service.ssrLayout' })
  get $$serviceSsrLayout(): ServiceSsrLayout {
    const sidebar = this.scope.config.layout.sidebar;
    return usePrepareArg({
      bodyReadyObserver: sidebar.bodyReadyObserver,
      sidebarLeftOpenPCCapability: sidebar.leftOpenPCCapability,
    } satisfies IServiceSsrLayoutOptions);
  }

  protected renderLocale() {
    const currentRoute = this.$currentRoute;
    const metaLocale = currentRoute?.meta?.locale;
    const locales = this.app.meta.locale.getItems(currentRoute?.meta?.locales);
    return (
      <li>
        <details>
          <summary aria-label="Language">{$icon('::language', 24)}</summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48 right-0">
              {Object.keys(locales).map(key => {
                const title = this.$scopeBase.locale[locales[key]]();
                return (
                  <li key={key} class={this.app.meta.locale.current === key ? 'disabled' : ''}>
                    <a
                      onClick={event => {
                        if (metaLocale) {
                          this.app.$gotoPage(currentRoute.matched[0].path, {
                            params: { ...currentRoute.params, locale: key },
                            query: currentRoute.query,
                          });
                        } else {
                          this.app.meta.locale.current = key as any;
                        }
                        closeNearestDetails(event);
                      }}
                    >
                      {$icon(this.app.meta.locale.current === key ? '::done' : '::none', 24)}
                      {title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </ClientOnly>
        </details>
      </li>
    );
  }

  protected render() {
    return (
      <>
        <ZRouterViewEmpty></ZRouterViewEmpty>
        <ul class="menu menu-horizontal fixed top-4 right-4 z-50">{this.renderLocale()}</ul>
      </>
    );
  }
}

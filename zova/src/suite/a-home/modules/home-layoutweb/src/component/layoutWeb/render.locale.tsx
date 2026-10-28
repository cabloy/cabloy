import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-basic-button';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const currentRoute = this.$currentRoute;
    const metaLocale = currentRoute?.meta?.locale;
    const locales = this.app.meta.locale.getItems(currentRoute?.meta?.locales);
    return (
      <li>
        <details>
          <summary aria-label={this.scope.locale.Language()} title={this.scope.locale.Language()}>
            {$icon('::language', 24)}
            <span class="lg:hidden">{this.scope.locale.Language()}</span>
          </summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {Object.keys(locales).map(key => {
                const title = this.$scopeBase.locale[locales[key]]();
                return (
                  <li key={key} class={this.app.meta.locale.current === key ? 'disabled' : ''}>
                    <ZButton
                      disabled={this.app.meta.locale.current === key}
                      onPerform={async event => {
                        closeNearestDetails({ currentTarget: event.target });
                        if (metaLocale) {
                          const options = {
                            params: {
                              ...currentRoute.params,
                              locale: key === this.sys.config.locale.default ? '' : key,
                            },
                            query: currentRoute.query,
                          };
                          const name = this.$router.getRealRouteName(currentRoute.name);
                          const alias =
                            name && this.$router.getAliasPath(name as never, options as never);
                          // A root alias with only a query must not resolve against the current path.
                          const target = alias?.startsWith('?') ? `/${alias}` : alias;
                          await this.app.$gotoPage(
                            target || currentRoute.matched[0].path,
                            target ? undefined : options,
                          );
                        } else {
                          this.app.meta.locale.current = key as any;
                        }
                      }}
                    >
                      {$icon(this.app.meta.locale.current === key ? '::done' : '::none', 24)}
                      {title}
                    </ZButton>
                  </li>
                );
              })}
            </ul>
          </ClientOnly>
        </details>
      </li>
    );
  }
}

import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const currentRoute = this.$currentRoute;
    const metaLocale = currentRoute?.meta?.locale;
    const locales = currentRoute?.meta?.locales ?? this.sys.config.locale.items;
    return (
      <li>
        <details>
          <summary>{$icon('::language', 24)}</summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {Object.keys(locales).map(key => {
                const title = this.$scopeBase.locale[locales[key]]();
                return (
                  <li key={key} class={this.app.meta.locale.current === key ? 'disabled' : ''}>
                    <a
                      onClick={() => {
                        if (metaLocale) {
                          const fullPath = this.$router.resolveName(currentRoute.name as any, {
                            params: Object.assign({}, currentRoute.params, {
                              locale: key === this.sys.config.locale.default ? '' : key,
                            }),
                            query: currentRoute.query,
                          });
                          this.$router.push(fullPath);
                        } else {
                          this.app.meta.locale.current = key as any;
                        }
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
}

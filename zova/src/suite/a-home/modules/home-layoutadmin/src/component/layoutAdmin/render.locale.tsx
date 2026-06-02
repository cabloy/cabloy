import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const locales = this.sys.config.locale.items;
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
                      onClick={event => {
                        this.$$serviceLocale.setLocale(key as any);
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
}

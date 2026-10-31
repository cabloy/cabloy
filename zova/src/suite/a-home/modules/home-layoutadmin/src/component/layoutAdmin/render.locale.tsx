import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-basic-button';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const locales = this.sys.config.locale.items;
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
                      onPerform={event => {
                        this.app.meta.locale.current = key as any;
                        closeNearestDetails({ currentTarget: event.target });
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

import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-basic-button';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const locales = this.app.meta.locale.getItems();
    return (
      <li>
        <details>
          <summary aria-label={this.scope.locale.Language()} title={this.scope.locale.Language()}>
            {$icon('::language', 24)}
          </summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {Object.keys(locales).map(key => (
                <li key={key}>
                  <ZButton
                    disabled={this.app.meta.locale.current === key}
                    onPerform={event => {
                      this.app.meta.locale.current = key as any;
                      closeNearestDetails({ currentTarget: event.target });
                    }}
                  >
                    {$icon(this.app.meta.locale.current === key ? '::done' : '::none', 24)}
                    {this.$scopeBase.locale[locales[key]]()}
                  </ZButton>
                </li>
              ))}
            </ul>
          </ClientOnly>
        </details>
      </li>
    );
  }
}

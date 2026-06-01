import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const locales = [
      {
        name: 'en-us',
        title: this.scope.locale.LanguageEnglish(),
      },
      {
        name: 'zh-cn',
        title: this.scope.locale.LanguageChinese(),
      },
    ];
    return (
      <li>
        <details>
          <summary>{$icon('::language', 24)}</summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {locales.map(item => {
                return (
                  <li
                    key={item.name}
                    class={this.app.meta.locale.current === item.name ? 'disabled' : ''}
                  >
                    <a
                      onClick={() => {
                        this.app.meta.locale.current = item.name as any;
                      }}
                    >
                      {$icon(this.app.meta.locale.current === item.name ? '::done' : '::none', 24)}
                      {item.title}
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

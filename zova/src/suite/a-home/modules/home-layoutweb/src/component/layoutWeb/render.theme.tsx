import type { IThemeRecord } from 'zova-module-a-style';

import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderTheme extends BeanRenderBase {
  renderThemeDark() {
    const themes = [
      {
        mode: false,
        title: this.scope.locale.ThemeLight(),
      },
      {
        mode: true,
        title: this.scope.locale.ThemeDark(),
      },
      {
        mode: 'auto',
        title: this.scope.locale.ThemeAuto(),
      },
    ];
    return (
      <li>
        <details>
          <summary>{$icon('::dark-theme', 24)}</summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {themes.map(item => {
                return (
                  <li
                    key={item.mode.toString()}
                    class={this.$theme.darkMode === item.mode ? 'disabled' : ''}
                  >
                    <a
                      onClick={event => {
                        this.$theme.darkMode = item.mode as any;
                        closeNearestDetails(event);
                      }}
                    >
                      {$icon(this.$theme.darkMode === item.mode ? '::done' : '::none', 24)}
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

  renderThemeName() {
    const themes = this.getThemeNames();
    return (
      <li>
        <details>
          <summary>{$icon(':outline:theme-outline', 24)}</summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {themes.map(item => {
                return (
                  <li key={item.name} class={this.$theme.name === item.name ? 'disabled' : ''}>
                    <a
                      onClick={event => {
                        this.$theme.name = item.name as keyof IThemeRecord;
                        closeNearestDetails(event);
                      }}
                    >
                      {$icon(this.$theme.name === item.name ? '::done' : '::none', 24)}
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

  getThemeNames() {
    return [
      {
        name: 'home-theme:orange' satisfies keyof IThemeRecord,
        title: this.scope.locale.ThemeOrange(),
      },
      {
        name: 'home-theme:default' satisfies keyof IThemeRecord,
        title: this.scope.locale.ThemeBlue(),
      },
    ];
  }
}

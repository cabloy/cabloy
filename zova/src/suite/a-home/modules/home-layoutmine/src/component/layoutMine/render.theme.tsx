import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $icon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-basic-button';
import { closeNearestDetails } from 'zova-module-home-base';

@Render()
export class RenderTheme extends BeanRenderBase {
  public renderThemeDark() {
    const themes = [
      { mode: false, title: this.scope.locale.ThemeLight() },
      { mode: true, title: this.scope.locale.ThemeDark() },
      { mode: 'auto' as const, title: this.scope.locale.ThemeAuto() },
    ];
    return (
      <li>
        <details>
          <summary aria-label={this.scope.locale.ColorMode()} title={this.scope.locale.ColorMode()}>
            {$icon('::dark-theme', 24)}
          </summary>
          <ClientOnly>
            <ul class="bg-base-100 rounded-t-none p-2 w-48">
              {themes.map(item => (
                <li key={item.mode.toString()}>
                  <ZButton
                    disabled={this.$theme.darkMode === item.mode}
                    onPerform={event => {
                      this.$theme.darkMode = item.mode;
                      closeNearestDetails({ currentTarget: event.target });
                    }}
                  >
                    {$icon(this.$theme.darkMode === item.mode ? '::done' : '::none', 24)}
                    {item.title}
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

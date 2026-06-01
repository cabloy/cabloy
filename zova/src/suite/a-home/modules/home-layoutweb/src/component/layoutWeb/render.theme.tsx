import type { IThemeRecord } from 'zova-module-a-style';

import { VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';

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
    const slots = {
      activator: ({ props }) => {
        return <VBtn icon={$iconName('::dark-theme')} variant="text" {...props}></VBtn>;
      },
    };
    return (
      <VMenu v-slots={slots}>
        <ClientOnly>
          <VList>
            {themes.map(item => {
              return (
                <VListItem
                  key={item.mode.toString()}
                  value={item.mode}
                  title={item.title}
                  disabled={this.$theme.darkMode === item.mode}
                  prependIcon={$iconName(this.$theme.darkMode === item.mode ? '::done' : '::none')}
                  onClick={() => {
                    this.$theme.darkMode = item.mode as any;
                  }}
                ></VListItem>
              );
            })}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }

  renderThemeName() {
    const themes = [
      {
        name: 'home-theme:default' satisfies keyof IThemeRecord,
        title: this.scope.locale.ThemeDefault(),
      },
      {
        name: 'home-theme:orange' satisfies keyof IThemeRecord,
        title: this.scope.locale.ThemeOrange(),
      },
    ];
    const slots = {
      activator: ({ props }) => {
        return <VBtn icon={$iconName(':outline:theme-outline')} variant="text" {...props}></VBtn>;
      },
    };
    return (
      <VMenu v-slots={slots}>
        <ClientOnly>
          <VList>
            {themes.map(item => {
              return (
                <VListItem
                  key={item.name}
                  value={item.name}
                  title={item.title}
                  disabled={this.$theme.name === item.name}
                  prependIcon={$iconName(this.$theme.name === item.name ? '::done' : '::none')}
                  onClick={() => {
                    this.$theme.name = item.name as keyof IThemeRecord;
                  }}
                ></VListItem>
              );
            })}
          </VList>
        </ClientOnly>
      </VMenu>
    );
  }
}

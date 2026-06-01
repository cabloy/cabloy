import { VBtn, VList, VListItem, VMenu } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';

@Render()
export class RenderLocale extends BeanRenderBase {
  public render() {
    const currentRoute = this.$currentRoute;
    const metaLocale = currentRoute?.meta?.locale;
    const locales = currentRoute?.meta?.locales ?? this.sys.config.locale.items;
    const slots = {
      activator: ({ props }) => {
        return <VBtn icon={$iconName('::language')} variant="text" {...props}></VBtn>;
      },
    };
    return (
      <VMenu v-slots={slots}>
        <ClientOnly>
          <VList>
            {Object.keys(locales).map(key => {
              const title = this.$scopeBase.locale[locales[key]]();
              return (
                <VListItem
                  key={key}
                  value={key}
                  title={title}
                  disabled={this.app.meta.locale.current === key}
                  prependIcon={$iconName(
                    this.app.meta.locale.current === key ? '::done' : '::none',
                  )}
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
                      this.$$serviceLocale.setLocale(key as any);
                    }
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

import { VNode } from 'vue';
import { VBtn, VList, VMenu, VTab } from 'vuetify/components';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName } from 'zova-module-a-icon';
import { RouteTab, ZRouterViewTabs } from 'zova-module-a-routertabs';
import { ZItemLink } from 'zova-module-home-base';

@Render()
export class RenderTabs extends BeanRenderBase {
  public renderTabs() {
    const $$modelTabs = this.$$modelTabs;
    if (!$$modelTabs) return;
    const domTabs: VNode[] = [];
    for (const tab of $$modelTabs.tabs) {
      domTabs.push(this._renderTab(tab));
    }
    const domWrapper = (
      <div role="tablist" class="tabs tabs-lifted">
        {domTabs}
      </div>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private _renderTab(tab: RouteTab) {
    const $$modelTabs = this.$$modelTabs;
    const { tabKey, info } = tab;
    const titleLocale = this.$text(info?.title || '');
    if (info.folder) {
      const slots = {
        activator: ({ props }) => {
          return (
            <VBtn
              style={{ height: 'calc(var(--v-tabs-height))' }}
              icon={info.icon}
              variant="text"
              {...props}
              text={titleLocale}
            ></VBtn>
          );
        },
      };
      return (
        <VMenu key={tab.tabKey} v-slots={slots}>
          <VList>
            {info.children?.map(item => {
              return (
                <ZItemLink
                  key={item.link}
                  title={item.title!}
                  icon={(item.icon as any) ?? $iconName('::none')}
                  href={item.link && item.external ? item.link : undefined}
                  to={item.link && !item.external ? item.link : undefined}
                ></ZItemLink>
              );
            })}
          </VList>
        </VMenu>
      );
    }
    // not external
    if (!info.external) {
      const className = tabKey === $$modelTabs.tabKeyCurrent ? 'text-primary' : '';
      return (
        <VTab
          key={tabKey}
          value={tabKey}
          class={`${className}`}
          href={info.link && info.external ? info.link : undefined}
          to={info.link && !info.external ? info.link : undefined}
          prependIcon={this.getTabIcon(tab)}
        >
          {titleLocale}
        </VTab>
      );
    }
    // external
    return (
      <ZItemLink
        key={tabKey}
        title={titleLocale}
        icon={info.icon as any}
        href={info.link}
      ></ZItemLink>
    );
  }

  public getTabIcon(tab: RouteTab) {
    const { info } = tab;
    return info?.icon ? info?.icon : '';
  }

  _renderRouterViewTabs() {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}

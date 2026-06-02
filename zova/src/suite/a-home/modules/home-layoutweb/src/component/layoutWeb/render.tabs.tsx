import { VNode } from 'vue';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, ZIcon } from 'zova-module-a-icon';
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
    const tabIcon = this.getTabIcon(tab);
    if (info.folder) {
      return (
        <li>
          <details>
            <summary>
              {!!tabIcon && <ZIcon name={tabIcon as any} width="24"></ZIcon>}
              {titleLocale}
            </summary>
            <ClientOnly>
              <ul class="bg-base-100 rounded-t-none p-2 w-48">
                {info.children?.map(item => {
                  return (
                    <li
                      key={item.link}
                      onClick={event => {
                        const details = (event.currentTarget as HTMLElement | null)?.closest(
                          'details',
                        ) as HTMLDetailsElement | null;
                        if (details) details.open = false;
                      }}
                    >
                      <ZItemLink
                        key={item.link}
                        title={item.title!}
                        icon={(item.icon as any) ?? $iconName('::none')}
                        href={item.link && item.external ? item.link : undefined}
                        to={item.link && !item.external ? item.link : undefined}
                      ></ZItemLink>
                    </li>
                  );
                })}
              </ul>
            </ClientOnly>
          </details>
        </li>
      );
    }
    // not external
    if (!info.external) {
      const className = tabKey === $$modelTabs.tabKeyCurrent ? 'text-primary' : '';

      return (
        <a
          key={tabKey}
          role="tab"
          class={`tab ${className}`}
          onClick={() => {
            $$modelTabs.activeTab(tabKey);
          }}
        >
          {!!tabIcon && <ZIcon name={tabIcon as any} width="24"></ZIcon>}
          {titleLocale}
        </a>
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

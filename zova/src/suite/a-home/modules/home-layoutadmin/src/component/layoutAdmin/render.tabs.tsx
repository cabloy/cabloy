import type { VNode } from 'vue';

import { withModifiers } from 'vue';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { $iconName, IIconRecord, ZIcon } from 'zova-module-a-icon';
import { IRouteViewRouteItem } from 'zova-module-a-router';
import { RouteTab, ZRouterViewTabs } from 'zova-module-a-routertabs';
import { ZButton } from 'zova-module-basic-button';

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
    const className = tabKey === $$modelTabs.tabKeyCurrent ? 'tab-active text-primary' : '';
    const titleLocale = info?.title || '';
    const tabIcon = this.getTabIcon(tab);
    return (
      <a
        key={tabKey}
        role="tab"
        class={`tab ${className} ${this.cTab}`}
        onClick={() => {
          $$modelTabs.activeTab(tabKey);
        }}
      >
        {!!tabIcon && <ZIcon name={tabIcon as any} width="24" height="24"></ZIcon>}
        {titleLocale}
        {!tab.affix && (
          <ZIcon
            class="tab-close hidden hover:bg-slate-400 rounded-sm"
            name="::close"
            width="16"
            height="16"
            nativeOnClick={withModifiers(() => {
              $$modelTabs.deleteTab(tabKey);
            }, ['stop'])}
          ></ZIcon>
        )}
      </a>
    );
  }

  public renderTabItems() {
    const $$modelTabs = this.$$modelTabs;
    if (!$$modelTabs) return;
    const tabCurrent = $$modelTabs.tabCurrent;
    if (!tabCurrent || !tabCurrent.items) return;
    const tabKey = tabCurrent.tabKey;
    const tabItemAnchor = tabCurrent.items.find(item => item.componentKey === tabKey);
    const onCustomRenderIsolate = tabItemAnchor?.pageMeta?.onCustomRenderIsolate;
    if (onCustomRenderIsolate) {
      const domContent = onCustomRenderIsolate(tabCurrent);
      if (!this.$$modelTabs.cache) return domContent;
      return <ClientOnly>{domContent}</ClientOnly>;
    }
    const pageTitleAnchor = tabItemAnchor?.pageMeta?.pageTitle;
    if (pageTitleAnchor) {
      const domWrapper = <div class="flex items-center justify-center">{pageTitleAnchor}</div>;
      if (!this.$$modelTabs.cache) return domWrapper;
      return <ClientOnly>{domWrapper}</ClientOnly>;
    }

    const tabItems = tabCurrent.items.filter(item => item.componentKey !== tabKey);
    if (!tabItems.length) return;
    const visibleItems = this.tabItemsCompact
      ? tabItems.filter(item => item.componentKey === $$modelTabs.componentKeyCurrent)
      : tabItems;
    const domTabs: VNode[] = [];
    for (const tabItem of visibleItems) {
      const { componentKey } = tabItem;
      const current = componentKey === $$modelTabs.componentKeyCurrent;
      const className = current ? 'tab-active text-primary' : '';
      const pageContent = this.getTabItemContent(tabItem);
      const tabItemIcon = this.getTabItemIcon(tabItem);
      const domTab = (
        <a
          key={componentKey}
          role="tab"
          aria-selected={current}
          tabindex={0}
          class={`tab flex items-center ${className} ${this.cTab}`}
          onKeydown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              void $$modelTabs.activeTabItem(tabKey, componentKey);
            }
          }}
          onClick={() => {
            $$modelTabs.activeTabItem(tabKey, componentKey);
          }}
        >
          {!!tabItemIcon && <ZIcon name={tabItemIcon} width="24" height="24"></ZIcon>}
          <div
            class="overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ display: 'inline-block', maxWidth: this.scope.config.tabItem.maxWidth }}
          >
            {pageContent}
          </div>
          <ZIcon
            class="tab-close hidden hover:bg-slate-400 rounded-sm"
            name="::close"
            width="16"
            height="16"
            nativeOnClick={withModifiers(() => {
              $$modelTabs.deleteTabItem(tabKey, componentKey, false);
            }, ['stop'])}
          ></ZIcon>
        </a>
      );
      domTabs.push(domTab);
    }
    const domWrapper = (
      <div
        class={`tab-items ${this.cTabItems} ${this.tabItemsCompact ? 'is-compact' : ''}`}
        data-testid="tab-items"
        data-compact={this.tabItemsCompact ? 'true' : 'false'}
        ref={ref => {
          if (!this.ctx.disposed)
            this.setTabItemsElement((ref as HTMLDivElement | null) ?? undefined);
        }}
      >
        <div
          class={`tab-items-viewport ${this.tabItemsOverflowStart ? 'has-start' : ''} ${this.tabItemsOverflowEnd ? 'has-end' : ''}`}
        >
          <div class="tab-items-scroll">
            <div role="tablist" class="tab-items-content tabs tabs-border">
              {domTabs}
            </div>
          </div>
        </div>
        <ZButton
          class="tab-items-more btn btn-square btn-ghost"
          data-testid="tab-items-more"
          aria-label={this.scope.locale.AllTabs()}
          title={this.scope.locale.AllTabs()}
          aria-controls={this.tabItemsMenuId}
          aria-expanded={this.tabItemsMenuOpen}
          {...{ 'popovertarget': this.tabItemsMenuId, 'data-hydrate-ignore-popovertarget': '' }}
        >
          <span aria-hidden="true">▾</span>
        </ZButton>
        <div
          id={this.tabItemsMenuId}
          ref={ref => {
            if (!this.ctx.disposed)
              this.setTabItemsMenuElement((ref as HTMLDivElement | null) ?? undefined);
          }}
          {...{ popover: 'auto' }}
          class={`${this.cTabItemsMenu} bg-base-100 border border-base-300 rounded-box shadow-lg p-2`}
          data-testid="tab-items-list"
          role="group"
          aria-label={this.scope.locale.AllTabs()}
        >
          {tabItems.map(tabItem => {
            const current = tabItem.componentKey === $$modelTabs.componentKeyCurrent;
            const icon = this.getTabItemIcon(tabItem);
            return (
              <div key={tabItem.componentKey} class="tab-items-row flex items-center gap-1">
                <ZButton
                  class={`tab-items-select btn btn-ghost ${current ? 'bg-base-200 text-primary' : ''}`}
                  aria-current={current ? 'page' : undefined}
                  onPerform={async () => {
                    this.closeTabItemsMenu();
                    await $$modelTabs.activeTabItem(tabKey, tabItem.componentKey);
                  }}
                >
                  {!!icon && <ZIcon name={icon} width={20} aria-hidden="true" />}
                  <span class="tab-items-label">{this.getTabItemContent(tabItem)}</span>
                  {current && <ZIcon name="::done" width={16} aria-hidden="true" />}
                </ZButton>
                <ZButton
                  class="btn btn-square btn-ghost shrink-0"
                  aria-label={this.scope.locale.CloseTab(tabItem.pageMeta?.pageTitle || '')}
                  title={this.scope.locale.CloseTab(tabItem.pageMeta?.pageTitle || '')}
                  onPerform={async () => {
                    await $$modelTabs.deleteTabItem(tabKey, tabItem.componentKey, false);
                    if (tabItems.length === 1) this.closeTabItemsMenu();
                  }}
                >
                  <ZIcon name="::close" width={16} aria-hidden="true" />
                </ZButton>
              </div>
            );
          })}
        </div>
      </div>
    );
    if (!this.$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private getTabItemContent(tabItem: IRouteViewRouteItem) {
    const pageMeta = tabItem.pageMeta;
    return pageMeta?.onCustomRender ? pageMeta.onCustomRender(tabItem) : pageMeta?.pageTitle || '';
  }

  public getTabIcon(tab: RouteTab) {
    const { info, items } = tab;
    // pageDirty
    const hasPageDirty = items && items.some(item => !!item.pageMeta?.pageDirty);
    if (hasPageDirty) return $iconName('::asterisk');
    // default
    return info?.icon ? info?.icon : '';
  }

  public getTabItemIcon(tabItem: IRouteViewRouteItem): keyof IIconRecord | '' {
    const { pageMeta } = tabItem;
    if (pageMeta?.pageDirty) return '::asterisk';
    if (pageMeta?.formMeta?.formScene === 'create') return '::add';
    if (pageMeta?.formMeta?.formScene === 'edit') return '::edit';
    return '';
  }

  _renderRouterViewTabs() {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}

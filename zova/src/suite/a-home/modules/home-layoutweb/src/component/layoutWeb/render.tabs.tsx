import type { VNode } from 'vue';

import { RouterLink } from '@cabloy/vue-router';
import { BeanRenderBase, ClientOnly } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';
import { ZRouterViewTabs } from 'zova-module-a-routertabs';
import { closeNearestDetails } from 'zova-module-home-base';

import type { TypeMenuGroup, TypeMenuItem } from '../../model/menu.js';

type TypeMenuLeaf = Exclude<TypeMenuItem, TypeMenuGroup>;

@Render()
export class RenderTabs extends BeanRenderBase {
  public renderTabs(): VNode | undefined {
    const $$modelTabs = this.$$modelTabs;
    if (!$$modelTabs) return;

    const domTabs = $$modelTabs.tabs.map(tab => {
      return this._renderMenuItem(tab.info as TypeMenuItem, true, tab.tabKey);
    });
    const domWrapper = (
      <ul class="menu menu-horizontal w-max min-w-full flex-nowrap gap-1 px-0">{domTabs}</ul>
    );
    if (!$$modelTabs.cache) return domWrapper;
    return <ClientOnly>{domWrapper}</ClientOnly>;
  }

  private _renderMenuItem(item: TypeMenuItem, topLevel: boolean = false, tabKey?: string): VNode {
    if (item.folder) {
      return this._renderMenuFolder(item, topLevel);
    }
    if (item.separator) {
      return this._renderMenuSeparator(item, topLevel);
    }
    return this._renderMenuLeaf(item, topLevel, tabKey);
  }

  private _renderMenuFolder(item: TypeMenuGroup, topLevel: boolean): VNode {
    const isActive = this._hasActiveDescendant(item);
    const className = this._getMenuItemClassName(isActive);
    const title = item.title ?? '';
    const childrenClass = topLevel ? 'w-56' : 'w-52';
    return (
      <li key={this._getMenuItemKey(item)}>
        <details>
          <summary class={className}>
            {this._renderItemIcon(item.icon as any)}
            <span>{title}</span>
          </summary>
          <ul class={`bg-base-100 rounded-t-none p-2 shadow ${childrenClass}`}>
            {item.children.map(child => this._renderMenuItem(child))}
          </ul>
        </details>
      </li>
    );
  }

  private _renderMenuLeaf(item: TypeMenuLeaf, topLevel: boolean, tabKey?: string): VNode {
    const title = item.title ?? '';
    const key = this._getMenuItemKey(item);
    const className = this._getMenuItemClassName(this._isMenuLeafActive(item, tabKey));
    const domContent = this._renderMenuItemContent(item.icon as any, title);
    const onClick = topLevel ? undefined : closeNearestDetails;

    if (item.external) {
      return (
        <li key={key} onClick={onClick}>
          <a class={className} href={item.link} target={item.target ?? '_blank'}>
            {domContent}
          </a>
        </li>
      );
    }

    if (topLevel && tabKey) {
      return (
        <li key={key}>
          <a
            class={className}
            onClick={() => {
              void this.$$modelTabs.activeTab(tabKey);
            }}
          >
            {domContent}
          </a>
        </li>
      );
    }

    return (
      <li key={key} onClick={onClick}>
        <RouterLink class={className} to={this._buildMenuTo(item)}>
          {domContent}
        </RouterLink>
      </li>
    );
  }

  private _renderMenuSeparator(item: TypeMenuLeaf, topLevel: boolean): VNode {
    const key = `${this._getMenuItemKey(item)}:separator`;
    if (topLevel) {
      return (
        <li key={key} class="mx-1 self-center opacity-30">
          <span class="pointer-events-none px-0">|</span>
        </li>
      );
    }
    return <li key={key} class="menu-disabled my-1 h-px bg-base-300"></li>;
  }

  private _buildMenuTo(item: TypeMenuLeaf) {
    let to: any;
    if (!item.external) {
      to = {};
      if (this.$router.isRouterName(item.link)) {
        to.name = item.link;
      } else {
        to.path = item.link;
      }
      if (item.meta?.params && to.name) {
        to.params = item.meta.params;
      }
      if (item.meta?.query) {
        to.query = item.meta.query;
      }
    }
    return to;
  }

  private _hasActiveDescendant(item: TypeMenuGroup): boolean {
    return item.children.some(child => {
      if (child.folder) return this._hasActiveDescendant(child);
      return this._isMenuLeafCurrent(child);
    });
  }

  private _isMenuLeafActive(item: TypeMenuLeaf, tabKey?: string): boolean {
    if (item.external || !item.link) return false;
    if (tabKey && tabKey === this.$$modelTabs.tabKeyCurrent) return true;
    return this._isMenuLeafCurrent(item);
  }

  private _isMenuLeafCurrent(item: TypeMenuLeaf): boolean {
    if (item.external || !item.link) return false;
    const currentRoute = this.$currentRoute;
    if (!currentRoute) return false;
    return this.$router.checkIfSameOfFullPath(item.link, currentRoute);
  }

  private _getMenuItemKey(item: TypeMenuItem): string {
    if (item.folder) return item.name || item.title || '';
    return item.name || item.link || item.title || '';
  }

  private _getMenuItemClassName(isActive: boolean): string {
    return isActive ? 'active text-primary' : '';
  }

  private _renderMenuItemContent(icon: string | undefined, title: string): VNode {
    return (
      <>
        {this._renderItemIcon(icon)}
        <span>{title}</span>
      </>
    );
  }

  private _renderItemIcon(icon?: string): VNode | undefined {
    if (!icon) return;
    return <ZIcon name={icon as any} width="20" height="20"></ZIcon>;
  }

  public _renderRouterViewTabs(): VNode {
    return <ZRouterViewTabs></ZRouterViewTabs>;
  }
}

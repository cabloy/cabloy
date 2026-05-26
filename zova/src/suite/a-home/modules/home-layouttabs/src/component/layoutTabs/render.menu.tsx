import type { VNode } from 'vue';

import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZItemLink } from 'zova-module-home-base';

import { TypeMenuItem, TypeMenuTree } from '../../.metadata/index.js';

@Render()
export class RenderMenu extends BeanRenderBase {
  _renderMenuItem(item: TypeMenuItem) {
    const titleLocale = this.$text(item.title ?? '');
    if (item.folder) {
      return (
        <li>
          <h2 class="menu-title">{titleLocale}</h2>
          <ul>{this._renderMenuItems(item.children)}</ul>
        </li>
      );
    }
    if (item.separator) {
      return <li></li>;
    }
    let to: any;
    if (!item.external) {
      to = {};
      if (this.$router.isRouterName(item.link)) {
        to.name = item.link;
      } else {
        to.path = item.link;
      }
      if (item.meta?.params && to.name) {
        to.params = item.meta?.params;
      }
      if (item.meta?.query) to.query = item.meta?.query;
    }
    return (
      <li key={item.title}>
        <ZItemLink
          title={titleLocale}
          description={item.description}
          icon={item.icon as any}
          href={item.external ? item.link : undefined}
          to={to}
        />
      </li>
    );
  }

  _renderMenuItems(items?: TypeMenuTree) {
    if (!items) return;
    const domItems: VNode[] = [];
    for (const item of items) {
      domItems.push(this._renderMenuItem(item));
    }
    return domItems;
  }

  public render() {
    const menuTree = this.$$modelMenu.menuTree;
    if (!menuTree) return;
    const domItems = this._renderMenuItems(menuTree);
    return <ul class="menu bg-base-200 text-base-content min-h-full w-full p-4">{domItems}</ul>;
  }
}

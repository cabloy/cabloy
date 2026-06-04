import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type {
  ApiSchemaAMenuDtoMenuGroup,
  ApiSchemaAMenuDtoMenuItem,
  ApiSchemaAMenuDtoMenus,
} from 'zova-module-home-api';

import { TypeEventOff } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export type TypeMenuGroup = ApiSchemaAMenuDtoMenuGroup & { folder: true; children: TypeMenuItem[] };
export type TypeMenuItem = (ApiSchemaAMenuDtoMenuItem & { folder: false }) | TypeMenuGroup;
export type TypeMenuTree = TypeMenuItem[];

export interface IModelOptionsMenu extends IDecoratorModelOptions {}

@Model<IModelOptionsMenu>()
export class ModelMenu extends BeanModelBase {
  menuTree?: TypeMenuTree;
  private _eventSsrHmrReload: TypeEventOff;

  protected async __init__() {
    this.menuTree = this.$computed(() => {
      const queryMenus = this.retrieveMenus();
      if (!queryMenus.data) return;
      return this._prepareMenuTree(queryMenus.data);
    });
    // event
    if (process.env.CLIENT && this.sys.config.ssr.hmr) {
      this._eventSsrHmrReload = this.sys.meta.event.on('a-ssrhmr:reload', async (_data, next) => {
        await this._refetchRetrieveMenus();
        return next();
      });
    }
  }

  protected __dispose__() {
    if (this._eventSsrHmrReload) {
      this._eventSsrHmrReload();
    }
  }

  retrieveMenus() {
    return this.$useStateData({
      queryKey: this._getQueryKeyRetrieveMenus(),
      queryFn: async () => {
        const data = await this.$api.homeBaseMenu.retrieveMenus({
          params: { publicPath: this.sys.env.APP_PUBLIC_PATH },
        });
        const menus = data.menus
          ?.map(item => {
            if (item.link && !this.$router.isRouterName(item.link) && item.meta?.params) {
              const link = this.app.util.apiActionPathTranslate(item.link, item.meta?.params);
              return { ...item, link };
            }
            return item;
          })
          ?.filter(item => {
            return item.external || !item.link || this.$router.checkPathValid(item.link);
          });
        return { ...data, menus };
      },
    });
  }

  findMenuItem(search: { name?: string; link?: string }): ApiSchemaAMenuDtoMenuItem | undefined {
    const menus = this.retrieveMenus().data;
    if (!menus || !menus.menus) return;
    const hasName = search.name !== undefined;
    const hasLink = search.link !== undefined;
    if (!hasName && !hasLink) return;
    return menus.menus.find(item => {
      return (hasName && item.name === search.name) || (hasLink && item.link === search.link);
    });
  }

  private _refetchRetrieveMenus(): Promise<void> {
    return this.$refetchQueries({ queryKey: this._getQueryKeyRetrieveMenus() });
  }

  private _getQueryKeyRetrieveMenus(): [string, string | undefined, string | undefined] {
    return ['retrieveMenus', this.sys.env.APP_PUBLIC_PATH, this.app.meta.locale.current];
  }

  private _prepareMenuTree(
    menus: ApiSchemaAMenuDtoMenus,
    groupName?: string,
    groupNames?: Set<string>,
  ): TypeMenuTree {
    let children: TypeMenuItem[] = [];
    if (menus.menus) {
      children = children.concat(
        menus.menus
          ?.filter(
            item =>
              item.group === groupName ||
              (Array.isArray(item.group) && item.group.includes(groupName!)),
          )
          .map(item => {
            return { ...item, folder: false };
          }),
      );
    }
    if (menus.groups) {
      const groups = menus.groups
        .filter(
          item =>
            !groupNames?.has(item.name) &&
            (item.group === groupName ||
              (Array.isArray(item.group) && item.group.includes(groupName!))),
        )
        .map(menuGroup => {
          const children = this._prepareMenuTree(
            menus,
            menuGroup.name,
            new Set([...(groupNames || []), menuGroup.name]),
          );
          if (children.length === 0) return undefined;
          return Object.assign({}, menuGroup, {
            folder: true,
            children,
          });
        })
        .filter(group => !!group);
      children = children.concat(groups);
    }
    return children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }
}

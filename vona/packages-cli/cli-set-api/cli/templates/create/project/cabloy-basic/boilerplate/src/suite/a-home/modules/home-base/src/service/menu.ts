import type { IMenus } from 'vona-module-a-menu';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceMenu extends BeanBase {
  async retrieveMenus(publicPath?: string): Promise<IMenus> {
    const res = await this.bean.ssr.retrieveMenus(publicPath);
    if (res) return res;
    return this._getMenusDefault();
  }

  private _getMenusDefault(): IMenus {
    return {
      menus: [
        { name: 'home', title: this.$scope.homeIndex.locale.Home(), icon: '::home', link: '/' },
      ],
    };
  }
}

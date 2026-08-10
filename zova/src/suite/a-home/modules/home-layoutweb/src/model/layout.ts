import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsLayout extends IDecoratorModelOptions {}

@Model<IModelOptionsLayout>()
export class ModelLayout extends BeanModelBase {
  leftDrawerOpenPC: boolean;

  protected async __init__() {
    const sidebar = this.scope.config.layout.sidebar;
    const leftOpenPCFallback = sidebar.leftOpenPCFallback;
    this.leftDrawerOpenPC =
      process.env.SSR && !sidebar.bodyReadyObserver
        ? leftOpenPCFallback
        : this.$useStateLocal({
            queryKey: ['sidebarLeftOpenPC'],
            meta: {
              defaultData: leftOpenPCFallback,
            },
          });
  }
}

import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { UseScope } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';
import { ScopeModuleASsr } from 'zova-module-a-ssr';

export interface IModelOptionsLayout extends IDecoratorModelOptions {}

@Model<IModelOptionsLayout>()
export class ModelLayout extends BeanModelBase {
  leftDrawerOpenPC: boolean;

  @UseScope()
  $$scopeSsr: ScopeModuleASsr;

  protected async __init__() {
    this.leftDrawerOpenPC =
      process.env.SSR && !this.$$scopeSsr.config.optimization.bodyReadyObserver
        ? this.sys.config.layout.sidebar.leftOpenPC
        : this.$useStateLocal({
            queryKey: ['sidebarLeftOpenPC'],
            meta: {
              defaultData: this.sys.config.layout.sidebar.leftOpenPC,
            },
          });
  }
}

import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsPageData extends IDecoratorModelOptions {}

@Model<IModelOptionsPageData>()
export class ModelPageData<PAGEDATA = unknown> extends BeanModelBase {
  protected _pageDataInner: any;
  public current: PAGEDATA | undefined;

  protected async __init__() {
    if (process.env.SERVER) {
      const pagePath = this.$ssr.state.pagePath;
      if (pagePath) {
        this._pageDataInner = this.getPageData(pagePath);
        this._pageDataInner = this.$ssr.state.pageData;
        this.current = this._pageDataInner;
      }
    } else {
      if (this.$ssr.isRuntimeSsrPreHydration) {
        this.current = this.$ssr.state.pageData as PAGEDATA;
      } else {
        const route = this.$pageRoute;
        this.current = route ? this.getPageData(route.path) : undefined;
      }
    }
  }

  getPageData(pagePath: string): PAGEDATA {
    return this.$useStateMem({ queryKey: ['pageData', pagePath] });
  }
}

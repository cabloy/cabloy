import type { IResourceBlockOptionsBase, IJsxRenderContextPage } from 'zova-module-a-openapi';

import { BeanControllerBase, type IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockPager'?: ControllerBlockPagerProps;
  }
}

export interface ControllerBlockPagerProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockPager extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {}

  protected render() {
    const domPager = this._renderPager();
    if (!domPager) return;
    return (
      <div class={this.$props.class}>
        <div class="join">{domPager}</div>
      </div>
    );
  }

  private _renderPager() {
    const { $$page } = this.$$renderContext;
    const { paged } = $$page;
    if (!paged) return;
    return (
      <>
        <button class="join-item btn btn-disabled">{`${this.scope.locale.PagedTotalItems()}: ${paged.total}`}</button>
        <button class="join-item btn btn-disabled">{`${this.scope.locale.PagedTotalPages()}: ${paged.pageCount}`}</button>
        {paged.pageNo > 1 && (
          <button
            class="join-item btn"
            onClick={() => {
              $$page.gotoPage($$page.paged!.pageNo - 1);
            }}
          >
            «
          </button>
        )}
        {paged.pageCount > 0 && <button class="join-item btn">{paged.pageNo}</button>}
        {paged.pageNo < paged.pageCount && (
          <button
            class="join-item btn"
            onClick={() => {
              $$page.gotoPage($$page.paged!.pageNo + 1);
            }}
          >
            »
          </button>
        )}
      </>
    );
  }
}

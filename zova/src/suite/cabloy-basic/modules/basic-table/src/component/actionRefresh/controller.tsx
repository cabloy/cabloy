import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'basic-table:actionRefresh'?: ControllerActionRefreshProps;
  }
}

export interface ControllerActionRefreshProps extends IResourceTableActionBulkPropsBase {}

@Controller()
export class ControllerActionRefresh extends BeanControllerBase {
  static $propsDefault = { class: 'btn join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected render() {
    const disabled = this.$props.disabled === true || this.$props.dynamicDisabled === true;
    return (
      <button
        class={this.$props.class}
        type="button"
        disabled={disabled}
        onClick={async () => {
          if (disabled) return;
          await this.$$renderContext.$$page.queryData.refetch();
        }}
      >
        {this.scope.locale.Refresh() as string}
      </button>
    );
  }
}

import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';

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
        class={[this.$props.class, 'btn-square']}
        type="button"
        disabled={disabled}
        aria-label={this.scope.locale.Refresh()}
        title={this.scope.locale.Refresh()}
        onClick={async () => {
          if (disabled) return;
          await this.$$renderContext.$$page.queryData.refetch();
        }}
      >
        <ZIcon name="::arrow-repeat" width={20}></ZIcon>
      </button>
    );
  }
}

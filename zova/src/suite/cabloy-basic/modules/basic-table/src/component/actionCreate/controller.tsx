import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkOptionsBase,
} from 'zova-module-a-openapi';

import { BeanControllerBase, type IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'basic-table:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceTableActionBulkOptionsBase {}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-primary join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {}

  protected render() {
    return (
      <button
        class={this.$props.class}
        type="button"
        onClick={async () => {
          await this.$performCommand('basic-commands:create', this.$props, this.$$renderContext);
        }}
      >
        {this.scope.locale.Create()}
      </button>
    );
  }
}

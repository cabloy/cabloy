import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextDetails,
  IResourceDetailsActionBulkOptionsBase,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceDetailsActionBulkRecord {
    'basic-details:actionCreate'?: ControllerActionCreateProps;
  }
}

export interface ControllerActionCreateProps extends IResourceDetailsActionBulkOptionsBase {}

@Controller()
export class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault = { class: 'btn btn-info join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected async __init__() {}

  protected render() {
    return (
      <button
        class={this.$props.class}
        type="button"
        onClick={async () => {
          console.log('create');
          // await this.$performCommand('basic-commands:create', this.$props, this.$$renderContext);
        }}
      >
        {this.scope.locale.AddDetail()}
      </button>
    );
  }
}

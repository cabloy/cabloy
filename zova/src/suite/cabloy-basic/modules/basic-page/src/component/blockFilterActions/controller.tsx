import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextForm } from 'zova-module-a-form';
import type { IResourceBlockOptionsBase } from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockFilterActions'?: ControllerBlockFilterActionsProps;
  }
}

export interface ControllerBlockFilterActionsProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockFilterActions extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextForm;

  protected async __init__() {}

  protected render() {
    const { $$filter } = this.$$renderContext.$celScope;
    return (
      <div class={this.$props.class}>
        <button
          class="btn btn-primary"
          type="button"
          onClick={() => {
            $$filter?.submitFilter();
          }}
        >
          {this.scope.locale.Search()}
        </button>
        <button
          class="btn btn-warning"
          type="button"
          onClick={() => {
            $$filter?.resetFilter();
          }}
        >
          {this.scope.locale.Reset()}
        </button>
      </div>
    );
  }
}

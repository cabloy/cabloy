import type { IComponentOptions } from 'zova';
import type {
  IResourceBlockOptionsBase,
  IJsxRenderContextDetails,
  IResourceRenderDetailsActionBulkOptionsAction,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockDetailsToolbarBulk'?: ControllerBlockDetailsToolbarBulkProps;
  }
}

export interface ControllerBlockDetailsToolbarBulkProps extends IResourceBlockOptionsBase {
  actions?: IResourceRenderDetailsActionBulkOptionsAction[];
}

@Controller()
export class ControllerBlockDetailsToolbarBulk extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextDetails;

  protected async __init__() {}

  protected render() {
    const domActions = this._renderActions();
    if (!domActions || domActions.length === 0) return;
    return (
      <div class={this.$props.class}>
        <div class="join">{domActions}</div>
      </div>
    );
  }

  private _renderActions() {
    const { $jsx, $celScope, $$details } = this.$$renderContext;
    const actions = this.$props.actions;
    if (!actions || actions.length === 0) return;
    const domActions: VNode[] = [];
    actions.forEach((action, index) => {
      const permissionHint = action.options?.permission;
      if (!$$details.checkPermission(permissionHint)) return;
      const options = Object.assign({ key: index }, action.options);
      const domAction = $jsx.render(action.render!, options, $celScope, this.$$renderContext);
      if (!domAction) return;
      if (Array.isArray(domAction)) {
        domActions.push(...domAction);
      } else {
        domActions.push(domAction);
      }
    });
    return domActions;
  }
}

import type { IComponentOptions } from 'zova';
import type {
  IResourceBlockOptionsBase,
  IJsxRenderContextDetails,
  IResourceRenderDetailsActionBulkOptionsAction,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { filterDetailsBulkActions } from '../../lib/detailsPermissions.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockToolbarBulk'?: ControllerBlockToolbarBulkProps;
  }
}

export interface ControllerBlockToolbarBulkProps extends IResourceBlockOptionsBase {
  actions?: IResourceRenderDetailsActionBulkOptionsAction[];
}

@Controller()
export class ControllerBlockToolbarBulk extends BeanControllerBase {
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
    const allowedActions = filterDetailsBulkActions(
      $$details.formScene,
      $$details.checkPermission.bind($$details),
      actions,
    );
    allowedActions.forEach((action, index) => {
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

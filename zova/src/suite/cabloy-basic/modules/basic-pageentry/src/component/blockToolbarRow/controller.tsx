import type {
  IResourceBlockOptionsBase,
  IJsxRenderContextPageEntry,
  IResourceRenderFormActionRowOptionsAction,
  IPermissionHintTableActionRow,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { BeanControllerBase, type IComponentOptions, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-pageentry:blockToolbarRow'?: ControllerBlockToolbarRowProps;
  }
}

export interface ControllerBlockToolbarRowProps extends IResourceBlockOptionsBase {
  actions?: IResourceRenderFormActionRowOptionsAction[];
}

@Controller()
export class ControllerBlockToolbarRow extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPageEntry;

  protected async __init__() {}

  get permissions() {
    return this.$$renderContext.$celScope.permissions;
  }

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
    const { $jsx, $celScope } = this.$$renderContext;
    const actions = this.$props.actions;
    if (!actions || actions.length === 0) return;
    const domActions: VNode[] = [];
    actions.forEach((action, index) => {
      const actionName = action.name;
      const permissionHint: IPermissionHintTableActionRow | undefined = action.options?.permission;
      // check formScene
      if (!this._checkFormScene(permissionHint)) return;
      // check permission
      if (!this.$passport.checkPermission(this.permissions, actionName, permissionHint)) return;
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

  private _checkFormScene(permissionHint?: IPermissionHintTableActionRow) {
    const { $$pageEntry } = this.$$renderContext;
    const formScene = $$pageEntry.formMeta.formScene;
    const formSceneHint = permissionHint?.formScene;
    if (!formSceneHint) return true;
    if (Array.isArray(formSceneHint) && formSceneHint.includes(formScene!)) return true;
    if (formSceneHint === formScene) return true;
    return false;
  }
}

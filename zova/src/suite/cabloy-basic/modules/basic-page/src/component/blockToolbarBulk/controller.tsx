import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceBlockOptionsBase,
  IResourceRenderTableActionBulkOptionsAction,
} from 'zova-module-a-openapi';

import { VNode } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { resolveTableActionBulkDynamicProps } from '../../lib/selection.js';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-page:blockToolbarBulk'?: ControllerBlockToolbarBulkProps;
  }
}

export interface ControllerBlockToolbarBulkProps extends IResourceBlockOptionsBase {
  actions?: IResourceRenderTableActionBulkOptionsAction[];
}

@Controller()
export class ControllerBlockToolbarBulk extends BeanControllerBase {
  static $propsDefault = {};

  private _selectionRequired = false;
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  protected async __init__() {
    this._setSelectionRequired(this._hasSelectionAction());
    this.$watch(
      () => this.$props.actions,
      actions => {
        this._setSelectionRequired(
          actions?.some(action => action.options?.requiresSelection) ?? false,
        );
      },
    );
  }

  protected __dispose__() {
    this._setSelectionRequired(false);
  }

  private _hasSelectionAction() {
    return this.$props.actions?.some(action => action.options?.requiresSelection) ?? false;
  }

  private _setSelectionRequired(required: boolean) {
    if (this._selectionRequired === required) return;
    this._selectionRequired = required;
    this.$$renderContext.$$page.setSelectionRequired(required);
  }

  get permissions() {
    return this.$$renderContext.$celScope.permissions;
  }

  protected render() {
    const { $$page } = this.$$renderContext;
    const domActions = this._renderActions();
    const selectionAvailable = $$page.selectionAvailable;
    if ((!domActions || domActions.length === 0) && !selectionAvailable) return;
    return (
      <div class={this.$props.class}>
        <div class="join" role="toolbar" aria-label={this.scope.locale.BulkActions()}>
          {$$page.selectionToggleAvailable && (
            <button type="button" class="btn join-item" onClick={() => $$page.toggleSelection()}>
              {$$page.selectionVisible ? this.scope.locale.Done() : this.scope.locale.Select()}
            </button>
          )}
          {$$page.selectionEnabled && (
            <span
              class="join-item border-base-300 bg-base-200 px-3 py-2"
              role="status"
              aria-live="polite"
            >
              {this.scope.locale.SelectedItems($$page.selection.count)}
            </span>
          )}
          {domActions}
        </div>
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
      const permissionHint = action.options?.permission;
      if (!this.$passport.checkPermission(this.permissions, actionName, permissionHint)) return;
      const selection = this.$$renderContext.$$page.selection;
      const completeSelection = selection.rows.length === selection.count;
      const selectionAllowed =
        selection.count > 0 &&
        completeSelection &&
        this.$passport.checkPermission(
          this.permissions,
          actionName,
          permissionHint,
          selection.rows,
        );
      const dynamicProps = resolveTableActionBulkDynamicProps(
        action.options,
        selection,
        selectionAllowed,
      );
      const options = Object.assign({}, action.options, {
        key: index,
        dynamicSelection: dynamicProps.dynamicSelection,
        dynamicDisabled: dynamicProps.dynamicDisabled,
        dynamicDisabledReason:
          dynamicProps.dynamicDisabledReason === 'maxExceeded'
            ? this.scope.locale.SelectionActionMaxExceeded(dynamicProps.selectedMaxIds!)
            : dynamicProps.dynamicDisabledReason === 'selectionUnavailable'
              ? this.scope.locale.SelectionActionUnavailable()
              : undefined,
      });
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

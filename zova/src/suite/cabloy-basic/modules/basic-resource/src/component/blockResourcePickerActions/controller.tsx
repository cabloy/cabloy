import type { IComponentOptions } from 'zova';
import type { IJsxRenderContextPage, IResourceBlockOptionsBase } from 'zova-module-a-openapi';
import type { IResourcePickerPageContext } from 'zova-module-rest-resource';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { resolvePickerSelectionMax } from 'zova-module-basic-page';
import { resourcePickerPageContextKey } from 'zova-module-rest-resource';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-resource:blockResourcePickerActions'?: ControllerBlockResourcePickerActionsProps;
  }
}

export interface ControllerBlockResourcePickerActionsProps extends IResourceBlockOptionsBase {}

@Controller()
export class ControllerBlockResourcePickerActions extends BeanControllerBase {
  static $propsDefault = {
    class: 'flex items-center justify-between gap-3',
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  @Use({ name: resourcePickerPageContextKey, injectionScope: 'host' })
  $$pickerContext: IResourcePickerPageContext;

  protected async __init__() {}

  get pickerOptions() {
    return this.$$pickerContext.options;
  }

  get selectionMax() {
    return resolvePickerSelectionMax(
      this.pickerOptions.selectionMode,
      this.pickerOptions.selectionMax,
    );
  }

  get selection() {
    return this.$$renderContext.$$page.selection.ids;
  }

  get canConfirm() {
    const count = this.selection.length;
    return (
      count > 0 &&
      count <= this.selectionMax &&
      (this.pickerOptions.selectionMode !== 'single' || count === 1)
    );
  }

  public confirm() {
    if (!this.canConfirm) return;
    this.$$pickerContext.dialog.resolve(this.$$renderContext.$$page.selection);
  }

  public cancel() {
    this.$$pickerContext.dialog.cancel();
  }

  protected render() {
    const count = this.selection.length;
    return (
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-base-content/70" role="status" aria-live="polite">
          {this.pickerOptions.selectionMode === 'multiple'
            ? this.scope.locale.SelectedItemsWithMax(count, this.selectionMax)
            : this.scope.locale.SelectedItems(count)}
        </span>
        <div class="join">
          <button type="button" class="btn join-item" onClick={() => this.cancel()}>
            {this.scope.locale.Cancel()}
          </button>
          <button
            type="button"
            class="btn btn-primary join-item"
            disabled={!this.canConfirm}
            onClick={() => this.confirm()}
          >
            {this.scope.locale.Select()}
          </button>
        </div>
      </div>
    );
  }
}

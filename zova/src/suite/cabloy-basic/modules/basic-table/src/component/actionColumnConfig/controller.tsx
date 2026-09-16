import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextPage,
  IResourceTableActionBulkPropsBase,
  ISchemaObjectExtensionField,
} from 'zova-module-a-openapi';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';
import { ITableLayout } from 'zova-module-a-table';
import { reconcileTableLayout } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableActionBulkRecord {
    'basic-table:actionColumnConfig'?: ControllerActionColumnConfigProps;
  }
}

export interface ControllerActionColumnConfigProps extends IResourceTableActionBulkPropsBase {}

@Controller()
export class ControllerActionColumnConfig extends BeanControllerBase {
  static $propsDefault = { class: 'btn join-item' };
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private _saving = false;
  private _error: string | undefined;
  private _reset = false;
  private _draft: ITableLayout | undefined;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextPage;

  get $$page() {
    return this.$$renderContext.$$page;
  }

  get seed() {
    return this.$$page.columnConfigSeed;
  }

  protected render() {
    // const disabled =
    //   this.$props.disabled === true || this.$props.dynamicDisabled === true || !this.seed;
    const disabled = this.$props.disabled === true || this.$props.dynamicDisabled === true;
    return (
      <button
        class={[this.$props.class, 'btn-square']}
        type="button"
        disabled={disabled}
        aria-label={this.scope.locale.ColumnConfiguration()}
        title={this.scope.locale.ColumnConfiguration()}
        onClick={() => this._open()}
      >
        <ZIcon name="::settings" width={20}></ZIcon>
      </button>
    );
  }

  private _open() {
    const seed = this.seed;
    if (!seed) return;
    this._error = undefined;
    this._reset = false;
    this._draft = this._cloneLayout(seed.layout);
    const dialog = this.$appModal.dialog(
      {
        title: this.scope.locale.ColumnConfiguration(),
        slotDefault: () => this._renderDialog(),
        slotActions: modal => (
          <>
            {this._error && (
              <span class="mr-auto text-sm text-error" role="alert">
                {this._error}
              </span>
            )}
            <button
              class="btn btn-ghost"
              type="button"
              disabled={this._saving}
              onClick={modal.close}
            >
              {this.scope.locale.Cancel()}
            </button>
            <button
              class="btn btn-primary"
              type="button"
              disabled={this._saving}
              onClick={() => this._save(dialog)}
            >
              {this._saving && <span class="loading loading-spinner loading-xs" />}
              {this.scope.locale.Save()}
            </button>
          </>
        ),
      },
      { closeOnBackdrop: false, closeOnEscape: false, maxWidth: 560, showCloseButton: true },
    );
  }

  private _renderDialog() {
    const draft = this._draft;
    const properties = this.seed?.properties ?? [];
    return (
      <div class="max-h-[60vh] space-y-2 overflow-y-auto">
        <div class="text-sm text-base-content/70">{this.scope.locale.Columns()}</div>
        {draft?.columns.map((column, index) => {
          const property = properties.find(item => item.key === column.key);
          const previous = draft.columns[index - 1];
          const next = draft.columns[index + 1];
          const canMoveUp =
            !!previous && this._sameFixedRegion(properties, column.key, previous.key);
          const canMoveDown = !!next && this._sameFixedRegion(properties, column.key, next.key);
          return (
            <div
              key={column.key}
              class="flex items-center gap-2 rounded-box border border-base-300 p-2"
            >
              <input
                class="checkbox checkbox-sm"
                type="checkbox"
                checked={column.visible}
                aria-label={`${this.scope.locale.Visible()} ${property?.title ?? column.key}`}
                onChange={(event: Event) => {
                  this._reset = false;
                  column.visible = (event.target as HTMLInputElement).checked;
                }}
              />
              <span class="min-w-0 flex-1 truncate">{property?.title ?? column.key}</span>
              <input
                class="input input-bordered input-sm w-20"
                type="number"
                min="1"
                max="2000"
                value={typeof column.width === 'number' ? column.width : ''}
                aria-label={`${this.scope.locale.Width()} ${property?.title ?? column.key}`}
                onInput={(event: Event) => {
                  this._reset = false;
                  const value = (event.target as HTMLInputElement).value;
                  column.width = value === '' ? 'auto' : Number(value);
                }}
              />
              <label class="flex items-center gap-1 text-xs">
                <input
                  class="checkbox checkbox-sm"
                  type="checkbox"
                  checked={column.width === 'auto'}
                  aria-label={`${this.scope.locale.Auto()} ${property?.title ?? column.key}`}
                  onChange={(event: Event) => {
                    if ((event.target as HTMLInputElement).checked) {
                      this._reset = false;
                      column.width = 'auto';
                    }
                  }}
                />
                {this.scope.locale.Auto()}
              </label>
              <button
                class="btn btn-ghost btn-xs"
                type="button"
                disabled={!canMoveUp || this._saving}
                aria-label={this.scope.locale.MoveUp()}
                onClick={() => this._moveColumn(index, -1)}
              >
                ↑
              </button>
              <button
                class="btn btn-ghost btn-xs"
                type="button"
                disabled={!canMoveDown || this._saving}
                aria-label={this.scope.locale.MoveDown()}
                onClick={() => this._moveColumn(index, 1)}
              >
                ↓
              </button>
            </div>
          );
        })}
        <button
          class="btn btn-outline btn-sm"
          type="button"
          disabled={this._saving}
          onClick={() => this._resetDraft()}
        >
          {this.scope.locale.Reset() as string}
        </button>
      </div>
    );
  }

  private _cloneLayout(layout: ITableLayout): ITableLayout {
    return {
      version: 1,
      ...(layout.schemaFingerprint ? { schemaFingerprint: layout.schemaFingerprint } : {}),
      columns: layout.columns.map(column => ({ ...column })),
    };
  }

  private _sameFixedRegion(
    properties: readonly ISchemaObjectExtensionField[],
    leftKey: string,
    rightKey: string,
  ) {
    const left = properties.find(item => item.key === leftKey)?.rest?.fixed;
    const right = properties.find(item => item.key === rightKey)?.rest?.fixed;
    return (left ?? 'center') === (right ?? 'center');
  }

  private _moveColumn(index: number, offset: -1 | 1) {
    const columns = this._draft?.columns;
    const properties = this.seed?.properties;
    if (!columns || !properties) return;
    const target = index + offset;
    if (
      target < 0 ||
      target >= columns.length ||
      !this._sameFixedRegion(properties, columns[index].key, columns[target].key)
    ) {
      return;
    }
    this._reset = false;
    [columns[index], columns[target]] = [columns[target], columns[index]];
  }

  private _resetDraft() {
    const seed = this.seed;
    if (!seed || this._saving) return;
    this._reset = true;
    this._draft = reconcileTableLayout(seed.properties);
  }

  private async _save(dialog: { close: () => void }) {
    const seed = this.seed;
    const draft = this._draft;
    if (!seed || !draft || this._saving) return;
    this._saving = true;
    this._error = undefined;
    try {
      if (this._reset) {
        await this.$$page.resetColumnConfig();
      } else {
        await this.$$page.saveColumnConfig(this._normalizeLayout(seed.properties, draft));
      }
      this._reset = false;
      dialog.close();
    } catch (error) {
      this._error = error instanceof Error ? error.message : String(error);
    } finally {
      this._saving = false;
    }
  }

  private _normalizeLayout(
    properties: readonly ISchemaObjectExtensionField[],
    draft: ITableLayout,
  ): ITableLayout {
    return reconcileTableLayout(properties, draft);
  }
}

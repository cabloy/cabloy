import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { TypeFormOnSubmitData } from 'zova-module-a-form';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import type { ApiApiCommerceTradeStockBalanceadjustStockRequestBody } from '../../api/commerceTradeStockBalance.js';
import type { ITableCellOptionsActionAdjustStock } from '../../bean/tableCell.actionAdjustStock.js';
import type { ModelStockBalance } from '../../model/stockBalance.js';

export interface ControllerTableCellActionAdjustStockProps extends ITableCellOptionsActionAdjustStock {}

type StockAdjustmentDraft = Omit<
  ApiApiCommerceTradeStockBalanceadjustStockRequestBody,
  'correlationId' | 'skuId'
>;

const emptyDraft = (): StockAdjustmentDraft => ({ delta: 0, reason: '' });

@Controller()
export class ControllerTableCellActionAdjustStock extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextTableCell;

  @Use({ beanFullName: 'commerce-trade.model.stockBalance' })
  $$modelStockBalance: ModelStockBalance;

  draft: StockAdjustmentDraft = emptyDraft();
  schema?: SchemaObject;

  get apiSchemasStockAdjust() {
    return this.scope.apiSchema.commerceTradeStockBalance.adjustStock();
  }

  private get _sku() {
    return this.$$renderContext.cellContext.row.original as {
      available: number;
      code: string;
      id: TableIdentity;
    };
  }

  private get _mutation() {
    return this.$$modelStockBalance.adjustStock(this._sku.id);
  }

  private async _ensureSchema() {
    if (this.schema) return;
    await $QueryEnsureLoaded(() => this.apiSchemasStockAdjust.sdk);
    this.schema = this.$computed(() => this.apiSchemasStockAdjust.requestBody);
  }

  private async _submit(data: TypeFormOnSubmitData<StockAdjustmentDraft>, close: () => void) {
    const mutation = this._mutation;
    if (mutation.isPending) return;
    const delta = Number(data.value.delta);
    const reason = data.value.reason.trim();
    if (!Number.isInteger(delta) || delta === 0 || !reason) return;
    await mutation.mutateAsync({
      skuId: this._sku.id,
      delta,
      reason,
      correlationId: crypto.randomUUID(),
    });
    close();
  }

  private async _openDialog() {
    await this._ensureSchema();
    this.draft = emptyDraft();
    const dialog = this.$appModal.dialog(
      {
        title: this.scope.locale.AdjustStock(),
        slotDefault: () => {
          return (
            <div class="space-y-4">
              <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt class="text-base-content/70">{this.scope.locale.SkuId()}</dt>
                <dd>{this._sku.code}</dd>
                <dt class="text-base-content/70">{this.scope.locale.Available()}</dt>
                <dd>{this._sku.available}</dd>
              </dl>
              <ZForm
                data={this.draft}
                schema={this.schema}
                onSubmitData={data => this._submit(data, () => dialog.close())}
                onShowError={async ({ error }) => {
                  await this.$performCommand('basic-commands:alert', {
                    type: 'error',
                    text: error.message,
                  });
                }}
                slotFooter={$$form => (
                  <div class="flex justify-end gap-2">
                    {this._mutation.isPending && (
                      <span class="loading loading-spinner text-primary"></span>
                    )}
                    <button class="btn btn-ghost" type="button" onClick={() => dialog.close()}>
                      {this.scope.locale.Cancel()}
                    </button>
                    <button
                      class="btn btn-secondary"
                      disabled={$$form.formState.isSubmitting || this._mutation.isPending}
                      type="submit"
                    >
                      {this.scope.locale.AdjustStock()}
                    </button>
                  </div>
                )}
              ></ZForm>
            </div>
          );
        },
      },
      {
        closeOnBackdrop: false,
        closeOnEscape: false,
        maxWidth: 480,
        showCloseButton: true,
      },
    );
  }

  protected render() {
    const props = this.$props as ControllerTableCellActionAdjustStockProps;
    return (
      <button class={props.class} type="button" onClick={() => this._openDialog()}>
        {this.scope.locale.AdjustStock()}
      </button>
    );
  }
}

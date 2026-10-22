import type { SchemaObject } from 'openapi3-ts/oas31';
import type { TableIdentity } from 'table-identity';
import type { TypeFormOnSubmitData } from 'zova-module-a-form';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZButton } from 'zova-module-basic-button';

import type { ApiApiCommerceTradeOrdershipRequestBody } from '../../api/commerceTradeOrder.js';
import type { ITableCellOptionsActionShip } from '../../bean/tableCell.actionShip.js';
import type { ModelOrder } from '../../model/order.js';

export interface ControllerTableCellActionShipProps extends ITableCellOptionsActionShip {}

@Controller()
export class ControllerTableCellActionShip extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextTableCell;

  @Use({ beanFullName: 'commerce-trade.model.order' })
  $$modelOrder: ModelOrder;

  draft: ApiApiCommerceTradeOrdershipRequestBody = { carrier: '', trackingNumber: '' };
  schema?: SchemaObject;

  get apiSchemasShip() {
    return this.scope.apiSchema.commerceTradeOrder.ship();
  }

  private get _mutation() {
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    return this.$$modelOrder.ship(orderId);
  }

  private async _submit(
    data: TypeFormOnSubmitData<ApiApiCommerceTradeOrdershipRequestBody>,
    close: () => void,
  ) {
    const mutation = this._mutation;
    if (mutation.isPending) return;
    const confirmed = await this.$performCommand('basic-commands:confirm', {
      text: this.scope.locale.ShipOrderConfirm(),
    });
    if (!confirmed) return;
    await mutation.mutateAsync(data.value);
    close();
  }

  private async _openDialog() {
    await $QueryEnsureLoaded(() => this.apiSchemasShip.sdk);
    if (!this.schema) {
      this.schema = this.$computed(() => this.apiSchemasShip.requestBody);
    }
    this.draft = { carrier: '', trackingNumber: '' };
    this.$appModal.dialog(
      {
        title: this.scope.locale.ShipOrder(),
        slotDefault: dialog => (
          <ZForm
            data={this.draft}
            schema={this.schema}
            onSubmitData={data => this._submit(data, dialog.close)}
            onShowError={async ({ error }) => {
              await this.$performCommand('basic-commands:alert', {
                type: 'error',
                text: error.message,
              });
            }}
            slotFooter={$$form => (
              <div class="flex justify-end gap-2">
                {$$form.formState.isSubmitting && (
                  <span class="loading loading-spinner text-primary"></span>
                )}
                <button class="btn btn-ghost" type="button" onClick={dialog.close}>
                  {this.scope.locale.Cancel()}
                </button>
                <button
                  class="btn btn-primary"
                  disabled={$$form.formState.isSubmitting || this._mutation.isPending}
                  type="submit"
                >
                  {this.scope.locale.ShipOrder()}
                </button>
              </div>
            )}
          ></ZForm>
        ),
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
    const props = this.$props as ControllerTableCellActionShipProps;
    return (
      <ZButton class={props.class} onPerform={() => this._openDialog()}>
        {this.scope.locale.ShipOrder()}
      </ZButton>
    );
  }
}

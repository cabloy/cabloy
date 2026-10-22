import type { TableIdentity } from 'table-identity';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';

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

  carrier = '';
  trackingNumber = '';
  confirmed = false;

  private get _mutation() {
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    return this.$$modelOrder.ship(orderId);
  }

  private get _valid() {
    return !!this.carrier.trim() && !!this.trackingNumber.trim() && this.confirmed;
  }

  private async _ship(close: () => void) {
    const mutation = this._mutation;
    if (!this._valid || mutation.isPending) return;
    const carrier = this.carrier.trim();
    const trackingNumber = this.trackingNumber.trim();
    await mutation.mutateAsync({ carrier, trackingNumber });
    close();
  }

  private _openDialog() {
    this.carrier = '';
    this.trackingNumber = '';
    this.confirmed = false;
    this.$appModal.dialog(
      {
        title: this.scope.locale.ShipOrder(),
        slotDefault: () => (
          <div class="space-y-3">
            <input
              class="input input-bordered w-full"
              name="carrier"
              placeholder="Carrier"
              v-model={this.carrier}
            />
            <input
              class="input input-bordered w-full"
              name="trackingNumber"
              placeholder="Tracking number"
              v-model={this.trackingNumber}
            />
            <label class="label cursor-pointer justify-start gap-2">
              <input
                class="checkbox checkbox-sm"
                name="confirmed"
                type="checkbox"
                v-model={this.confirmed}
              />
              <span class="label-text text-xs">{this.scope.locale.Confirm()}</span>
            </label>
          </div>
        ),
        slotActions: dialog => (
          <>
            {this._mutation.isPending && <span class="loading loading-spinner text-primary"></span>}
            <button class="btn btn-ghost" type="button" onClick={dialog.close}>
              {this.scope.locale.Cancel()}
            </button>
            <ZButton
              class="btn btn-primary"
              disabled={!this._valid || this._mutation.isPending}
              onPerform={() => this._ship(dialog.close)}
            >
              {this.scope.locale.ShipOrder()}
            </ZButton>
          </>
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

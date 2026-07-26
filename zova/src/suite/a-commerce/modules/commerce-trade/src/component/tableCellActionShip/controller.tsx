import type { TableIdentity } from 'table-identity';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

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

  private async _ship() {
    const carrier = this.carrier.trim();
    const trackingNumber = this.trackingNumber.trim();
    if (!carrier || !trackingNumber || !this.confirmed) return;

    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    await this.$$modelOrder.ship(orderId).mutateAsync({ carrier, trackingNumber });
  }

  protected render() {
    const props = this.$props as ControllerTableCellActionShipProps;
    return (
      <div class="join">
        <input
          class="input input-bordered input-sm join-item w-32"
          name="carrier"
          placeholder="Carrier"
          v-model={this.carrier}
        />
        <input
          class="input input-bordered input-sm join-item w-36"
          name="trackingNumber"
          placeholder="Tracking number"
          v-model={this.trackingNumber}
        />
        <label class="label cursor-pointer join-item gap-1 px-2">
          <input
            class="checkbox checkbox-sm"
            name="confirmed"
            type="checkbox"
            v-model={this.confirmed}
          />
          <span class="label-text text-xs">Confirm</span>
        </label>
        <button class={props.class} type="button" onClick={() => this._ship()}>
          Ship order
        </button>
      </div>
    );
  }
}

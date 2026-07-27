import type { TableIdentity } from 'table-identity';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { ApiSchemaCommerceTradeDtoOrderSelectResItem } from '../../api/openapi/schemas.js';
import type { ITableCellOptionsActionRefund } from '../../bean/tableCell.actionRefund.js';
import type { ModelOrder } from '../../model/order.js';

export interface ControllerTableCellActionRefundProps extends ITableCellOptionsActionRefund {}

@Controller()
export class ControllerTableCellActionRefund extends BeanControllerBase {
  static $propsDefault = {};

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextTableCell;

  @Use({ beanFullName: 'commerce-trade.model.order' })
  $$modelOrder: ModelOrder;

  reason = '';
  confirmed = false;

  private async _approve() {
    const reason = this.reason.trim();
    if (!reason || !this.confirmed) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    await this.$$modelOrder.approveRefund(orderId).mutateAsync({ reason });
  }

  private async _reject() {
    const reason = this.reason.trim();
    if (!reason || !this.confirmed) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    await this.$$modelOrder.rejectRefund(orderId).mutateAsync({ reason });
  }

  private async _execute() {
    if (!this.confirmed) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    await this.$$modelOrder.refundOutcome(orderId).mutateAsync({
      outcome: 'succeeded',
      idempotencyKey: crypto.randomUUID(),
    });
  }

  protected render() {
    const props = this.$props as ControllerTableCellActionRefundProps;
    const order = this.$$renderContext.cellContext.row
      .original as ApiSchemaCommerceTradeDtoOrderSelectResItem;
    const requested = order.state === 'refund_requested';
    return (
      <div class="join">
        {requested && (
          <input
            class="input input-bordered input-sm join-item w-40"
            name="reason"
            placeholder="Decision reason"
            v-model={this.reason}
          />
        )}
        <label class="label cursor-pointer join-item gap-1 px-2">
          <input
            class="checkbox checkbox-sm"
            name="confirmed"
            type="checkbox"
            v-model={this.confirmed}
          />
          <span class="label-text text-xs">Confirm</span>
        </label>
        {requested ? (
          <>
            <button class={props.class} type="button" onClick={() => this._approve()}>
              Approve refund
            </button>
            <button
              class="btn btn-outline btn-error join-item"
              type="button"
              onClick={() => this._reject()}
            >
              Reject refund
            </button>
          </>
        ) : (
          <button class={props.class} type="button" onClick={() => this._execute()}>
            Execute refund
          </button>
        )}
      </div>
    );
  }
}

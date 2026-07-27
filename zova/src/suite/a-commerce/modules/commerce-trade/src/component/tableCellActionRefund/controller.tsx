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
  approveIdempotencyKey?: string;
  rejectIdempotencyKey?: string;
  outcomeIdempotencyKey?: string;

  private async _approve() {
    const reason = this.reason.trim();
    if (!reason || !this.confirmed) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    const idempotencyKey = this.approveIdempotencyKey ?? crypto.randomUUID();
    this.approveIdempotencyKey = idempotencyKey;
    await this.$$modelOrder.approveRefund(orderId).mutateAsync({ reason, idempotencyKey });
    this.approveIdempotencyKey = undefined;
  }

  private async _reject() {
    const reason = this.reason.trim();
    if (!reason || !this.confirmed) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    const idempotencyKey = this.rejectIdempotencyKey ?? crypto.randomUUID();
    this.rejectIdempotencyKey = idempotencyKey;
    await this.$$modelOrder.rejectRefund(orderId).mutateAsync({ reason, idempotencyKey });
    this.rejectIdempotencyKey = undefined;
  }

  private async _execute() {
    if (!this.confirmed) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    const idempotencyKey = this.outcomeIdempotencyKey ?? crypto.randomUUID();
    this.outcomeIdempotencyKey = idempotencyKey;
    await this.$$modelOrder.refundOutcome(orderId).mutateAsync({
      outcome: 'succeeded',
      idempotencyKey,
    });
    this.outcomeIdempotencyKey = undefined;
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
            placeholder={this.scope.locale.RefundDecisionReason()}
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
          <span class="label-text text-xs">{this.scope.locale.Confirm()}</span>
        </label>
        {requested ? (
          <>
            <button class={props.class} type="button" onClick={() => this._approve()}>
              {this.scope.locale.ApproveRefund()}
            </button>
            <button
              class="btn btn-outline btn-error join-item"
              type="button"
              onClick={() => this._reject()}
            >
              {this.scope.locale.RejectRefund()}
            </button>
          </>
        ) : (
          <button class={props.class} type="button" onClick={() => this._execute()}>
            {this.scope.locale.ExecuteRefund()}
          </button>
        )}
      </div>
    );
  }
}

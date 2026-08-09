import type { TableIdentity } from 'table-identity';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';

import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type {
  ApiSchemaCommerceTradeDtoOrderSelectResItem,
  ApiSchemaCommerceTradeDtoRefundRecoveryView,
} from '../../api/openapi/schemas.js';
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
  recoveryOpen = false;
  recoveryLoaded = false;
  recoveryReason = '';
  retryRiskAcknowledged = false;
  approveIdempotencyKey?: string;
  rejectIdempotencyKey?: string;
  reconcileIdempotencyKey?: string;
  retryIdempotencyKey?: string;

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
    await this.$$modelOrder.executeRefund(orderId).mutateAsync(undefined);
  }

  private _recovery() {
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    return this.$$modelOrder.refundRecovery(orderId);
  }

  private async _toggleRecovery() {
    this.recoveryOpen = !this.recoveryOpen;
    if (this.recoveryOpen && !this.recoveryLoaded) {
      await this._recovery().refetch();
      this.recoveryLoaded = true;
    }
  }

  private async _reconcile() {
    const reason = this.recoveryReason.trim();
    if (!reason) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    const actionIdempotencyKey = this.reconcileIdempotencyKey ?? crypto.randomUUID();
    this.reconcileIdempotencyKey = actionIdempotencyKey;
    await this.$$modelOrder
      .reconcileRefund(orderId)
      .mutateAsync({ reason, actionIdempotencyKey, acknowledgeRetryRisk: false });
    this.reconcileIdempotencyKey = undefined;
    await this._recovery().refetch();
  }

  private async _retry() {
    const reason = this.recoveryReason.trim();
    if (!reason || !this.retryRiskAcknowledged) return;
    const orderId = this.$$renderContext.cellContext.row.id as TableIdentity;
    const actionIdempotencyKey = this.retryIdempotencyKey ?? crypto.randomUUID();
    this.retryIdempotencyKey = actionIdempotencyKey;
    await this.$$modelOrder
      .retryRefund(orderId)
      .mutateAsync({ reason, actionIdempotencyKey, acknowledgeRetryRisk: true });
    this.retryIdempotencyKey = undefined;
    await this._recovery().refetch();
  }

  protected render() {
    const props = this.$props as ControllerTableCellActionRefundProps;
    const order = this.$$renderContext.cellContext.row
      .original as ApiSchemaCommerceTradeDtoOrderSelectResItem;
    const requested = order.state === 'refund_requested';
    const recovery = this.recoveryOpen ? this._recovery() : undefined;
    const recoveryData = recovery?.data as ApiSchemaCommerceTradeDtoRefundRecoveryView | undefined;
    const showExecute = !recoveryData;
    return (
      <div class="flex flex-col items-start gap-2">
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
            <>
              {showExecute && (
                <button class={props.class} type="button" onClick={() => this._execute()}>
                  {this.scope.locale.ExecuteRefund()}
                </button>
              )}
              <button
                class="btn btn-outline join-item"
                type="button"
                onClick={() => this._toggleRecovery()}
              >
                {this.scope.locale.InspectRefundRecovery()}
              </button>
            </>
          )}
        </div>
        {recoveryData && (
          <section class="w-full rounded border border-base-300 p-3 text-sm">
            <p>
              {this.scope.locale.RefundRecoveryState({
                state: recoveryData.providerOperationState,
                attemptCount: recoveryData.attemptCount,
              })}
            </p>
            {recoveryData.providerRefundId && (
              <p>
                {this.scope.locale.RefundRecoveryProviderRefundId({
                  providerRefundId: recoveryData.providerRefundId,
                })}
              </p>
            )}
            {recoveryData.errorSummary && <p>{recoveryData.errorSummary}</p>}
            <p class="text-base-content/70">{recoveryData.recoveryMessage}</p>
            {recoveryData.recoveryDisposition !== 'none' && (
              <input
                class="input input-bordered input-sm mt-2 w-full"
                name="recoveryReason"
                placeholder={this.scope.locale.RefundRecoveryReason()}
                v-model={this.recoveryReason}
              />
            )}
            {(recoveryData.recoveryDisposition === 'query_only' ||
              recoveryData.recoveryDisposition === 'reconcile_only') && (
              <button
                class="btn btn-outline btn-sm mt-2"
                type="button"
                onClick={() => this._reconcile()}
              >
                {this.scope.locale.ReconcileProviderRefund()}
              </button>
            )}
            {recoveryData.recoveryDisposition === 'retry_same_key' && (
              <>
                <label class="label cursor-pointer mt-2 justify-start gap-2">
                  <input
                    class="checkbox checkbox-sm"
                    name="retryRiskAcknowledged"
                    type="checkbox"
                    v-model={this.retryRiskAcknowledged}
                  />
                  <span class="label-text text-xs">
                    {this.scope.locale.AcknowledgeRefundRetryRisk()}
                  </span>
                </label>
                <button class="btn btn-warning btn-sm" type="button" onClick={() => this._retry()}>
                  {this.scope.locale.RetryRefund()}
                </button>
              </>
            )}
          </section>
        )}
      </div>
    );
  }
}

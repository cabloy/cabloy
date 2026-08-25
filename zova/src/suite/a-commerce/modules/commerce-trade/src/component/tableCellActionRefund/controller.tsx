import type { TableIdentity } from 'table-identity';
import type { IJsxRenderContextTableCell } from 'zova-module-a-table';
import type { ModelPayMockPayment } from 'zova-module-pay-mock';

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

  @Use({ beanFullName: 'pay-mock.model.payMockPayment' })
  $$modelPayMockPayment: ModelPayMockPayment;

  decisionReason = '';
  decisionConfirmed = false;
  executionConfirmed = false;
  recoveryOpen = false;
  recoveryLoaded = false;
  recoveryUnavailable = false;
  recoveryError?: unknown;
  mockCompletionError?: unknown;
  mockCompletionSucceeded = false;
  recoveryReason = '';
  retryRiskAcknowledged = false;
  approveIdempotencyKey?: string;
  rejectIdempotencyKey?: string;
  reconcileIdempotencyKey?: string;
  retryIdempotencyKey?: string;

  private get _orderId() {
    return this.$$renderContext.cellContext.row.id as TableIdentity;
  }

  private get _decisionPending() {
    return (
      this.$$modelOrder.approveRefund(this._orderId).isPending ||
      this.$$modelOrder.rejectRefund(this._orderId).isPending
    );
  }

  private get _decisionValid() {
    return !!this.decisionReason.trim() && this.decisionConfirmed;
  }

  private async _submitDecision(approved: boolean, close: () => void) {
    const reason = this.decisionReason.trim();
    if (!reason || !this.decisionConfirmed || this._decisionPending) return;
    const idempotencyKey = approved
      ? (this.approveIdempotencyKey ?? crypto.randomUUID())
      : (this.rejectIdempotencyKey ?? crypto.randomUUID());
    if (approved) {
      this.approveIdempotencyKey = idempotencyKey;
    } else {
      this.rejectIdempotencyKey = idempotencyKey;
    }
    const mutation = approved
      ? this.$$modelOrder.approveRefund(this._orderId)
      : this.$$modelOrder.rejectRefund(this._orderId);
    await mutation.mutateAsync({ reason, idempotencyKey });
    if (approved) {
      this.approveIdempotencyKey = undefined;
    } else {
      this.rejectIdempotencyKey = undefined;
    }
    close();
  }

  private _openRefundDecisionDialog() {
    this.decisionReason = '';
    this.decisionConfirmed = false;
    this.approveIdempotencyKey = undefined;
    this.rejectIdempotencyKey = undefined;
    this.$appModal.dialog(
      {
        title: this.scope.locale.RefundDecision(),
        slotDefault: () => {
          return (
            <>
              <textarea
                class="textarea textarea-bordered w-full"
                name="decisionReason"
                placeholder={this.scope.locale.RefundDecisionReason()}
                v-model={this.decisionReason}
              />
              <label class="label cursor-pointer mt-2 justify-start gap-2">
                <input
                  class="checkbox checkbox-sm"
                  name="decisionConfirmed"
                  type="checkbox"
                  v-model={this.decisionConfirmed}
                />
                <span class="label-text text-xs">{this.scope.locale.Confirm()}</span>
              </label>
            </>
          );
        },
        slotActions: dialog => {
          const disabled = !this._decisionValid || this._decisionPending;
          return (
            <>
              {this._decisionPending && <span class="loading loading-spinner text-primary"></span>}
              <button class="btn btn-ghost" type="button" onClick={dialog.close}>
                {this.scope.locale.Cancel()}
              </button>
              <button
                class="btn btn-error"
                type="button"
                disabled={disabled}
                onClick={() => this._submitDecision(false, dialog.close)}
              >
                {this.scope.locale.RejectRefund()}
              </button>
              <button
                class="btn btn-warning"
                type="button"
                disabled={disabled}
                onClick={() => this._submitDecision(true, dialog.close)}
              >
                {this.scope.locale.ApproveRefund()}
              </button>
            </>
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

  private get _executionPending() {
    return this.$$modelOrder.executeRefund(this._orderId).isPending;
  }

  private get _recoveryActionPending() {
    return (
      this.$$modelOrder.reconcileRefund(this._orderId).isPending ||
      this.$$modelOrder.retryRefund(this._orderId).isPending
    );
  }

  private get _mockCompletion() {
    const recovery = this._recovery().data as
      | ApiSchemaCommerceTradeDtoRefundRecoveryView
      | undefined;
    if (!recovery || recovery.providerName !== 'pay-mock:mock') return undefined;
    if (recovery.refundOperationState !== 'pending') return undefined;
    return this.$$modelPayMockPayment.completeRefund(recovery.refundOperationId);
  }

  private get _mockCompletionAvailable() {
    return (
      this.sys.env.META_MODE !== 'production' &&
      this.recoveryOpen &&
      this.recoveryDisposition === 'await_webhook'
    );
  }

  private get recoveryDisposition() {
    const recovery = this._recovery().data as
      | ApiSchemaCommerceTradeDtoRefundRecoveryView
      | undefined;
    return recovery?.recoveryDisposition;
  }

  private async _completeMockRefund() {
    const mutation = this._mockCompletion;
    if (!mutation || mutation.isPending) return;
    this.mockCompletionError = undefined;
    try {
      await mutation.mutateAsync({ outcome: 'succeeded' });
      this.mockCompletionSucceeded = true;
      this.recoveryError = undefined;
      this.recoveryUnavailable = false;
      this.recoveryLoaded = true;
      await this.$$modelOrder.select()?.refetch();
    } catch (error) {
      this.mockCompletionError = error;
    }
  }

  private async _execute(close: () => void) {
    if (!this.executionConfirmed || this._executionPending) return;
    await this.$$modelOrder.executeRefund(this._orderId).mutateAsync(undefined);
    close();
  }

  private _recovery() {
    const orderId = this._orderId;
    return this.$$modelOrder.refundRecovery(orderId);
  }

  private _isRecoveryUnavailable(error: unknown) {
    const candidate = error as { code?: unknown; message?: unknown; status?: unknown } | undefined;
    const status = candidate?.code ?? candidate?.status;
    return status === 404 && candidate?.message === 'refund recovery is not available';
  }

  private async _loadRecovery() {
    this.recoveryError = undefined;
    this.recoveryUnavailable = false;
    const result = await this._recovery().refetch();
    if (result.error) {
      if (this._isRecoveryUnavailable(result.error)) {
        this.recoveryUnavailable = true;
        this.recoveryLoaded = true;
      } else {
        this.recoveryError = result.error;
        this.recoveryLoaded = false;
      }
      return;
    }
    this.recoveryLoaded = true;
  }

  private async _toggleRecovery() {
    this.recoveryOpen = !this.recoveryOpen;
    if (this.recoveryOpen && !this.recoveryLoaded) {
      await this._loadRecovery();
    }
  }

  private async _reconcile() {
    const reason = this.recoveryReason.trim();
    if (!reason || this._recoveryActionPending) return;
    const orderId = this._orderId;
    const actionIdempotencyKey = this.reconcileIdempotencyKey ?? crypto.randomUUID();
    this.reconcileIdempotencyKey = actionIdempotencyKey;
    await this.$$modelOrder
      .reconcileRefund(orderId)
      .mutateAsync({ reason, actionIdempotencyKey, acknowledgeRetryRisk: false });
    this.reconcileIdempotencyKey = undefined;
    await this._loadRecovery();
  }

  private async _retry() {
    const reason = this.recoveryReason.trim();
    if (!reason || !this.retryRiskAcknowledged || this._recoveryActionPending) return;
    const orderId = this._orderId;
    const actionIdempotencyKey = this.retryIdempotencyKey ?? crypto.randomUUID();
    this.retryIdempotencyKey = actionIdempotencyKey;
    await this.$$modelOrder
      .retryRefund(orderId)
      .mutateAsync({ reason, actionIdempotencyKey, acknowledgeRetryRisk: true });
    this.retryIdempotencyKey = undefined;
    await this._loadRecovery();
  }

  private _resetExecutionDialogState() {
    this.executionConfirmed = false;
    this.mockCompletionError = undefined;
    this.mockCompletionSucceeded = false;
    this.recoveryOpen = false;
    this.recoveryLoaded = false;
    this.recoveryUnavailable = false;
    this.recoveryError = undefined;
    this.recoveryReason = '';
    this.retryRiskAcknowledged = false;
    this.reconcileIdempotencyKey = undefined;
    this.retryIdempotencyKey = undefined;
  }

  private _openRefundExecutionDialog() {
    this._resetExecutionDialogState();
    this.$appModal.dialog(
      {
        title: this.scope.locale.RefundExecution(),
        slotDefault: () => {
          const recovery = this.recoveryOpen ? this._recovery() : undefined;
          const recoveryData = recovery?.data as
            | ApiSchemaCommerceTradeDtoRefundRecoveryView
            | undefined;
          return (
            <div class="flex flex-col items-start gap-3">
              <label class="label m-0 cursor-pointer justify-start gap-2 p-0">
                <input
                  class="checkbox checkbox-sm"
                  name="executionConfirmed"
                  type="checkbox"
                  v-model={this.executionConfirmed}
                />
                <span class="label-text">{this.scope.locale.Confirm()}</span>
              </label>
              <button
                class="btn btn-outline btn-sm"
                type="button"
                onClick={() => this._toggleRecovery()}
              >
                {this.scope.locale.InspectRefundRecovery()}
              </button>
              {this.recoveryOpen && (
                <section class="w-full rounded border border-base-300 p-3 text-sm">
                  {recovery?.isFetching && !recoveryData && (
                    <div class="flex items-center gap-2">
                      <span class="loading loading-spinner text-primary"></span>
                      <span>{this.scope.locale.LoadingRefundRecovery()}</span>
                    </div>
                  )}
                  {this.recoveryUnavailable && (
                    <div role="alert" class="alert alert-info">
                      <span>{this.scope.locale.RefundRecoveryUnavailable()}</span>
                    </div>
                  )}
                  {this.mockCompletionSucceeded && (
                    <div role="status" class="alert alert-success">
                      <span>{this.scope.locale.MockRefundCompleted()}</span>
                    </div>
                  )}
                  {this.recoveryError && !this.mockCompletionSucceeded && (
                    <div role="alert" class="alert alert-error">
                      <span>{this.scope.locale.RefundRecoveryLoadFailed()}</span>
                      <button
                        class="btn btn-outline btn-sm"
                        type="button"
                        onClick={() => this._loadRecovery()}
                      >
                        {this.scope.locale.RetryInspectRefundRecovery()}
                      </button>
                    </div>
                  )}
                  {recoveryData &&
                    !this.mockCompletionSucceeded &&
                    !this.recoveryUnavailable &&
                    !this.recoveryError && (
                      <>
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
                        {recoveryData.recoveryDisposition === 'await_webhook' && (
                          <div class="mt-2 w-full rounded border border-info/40 bg-info/10 p-3">
                            <p>{this.scope.locale.RefundAwaitingProviderConfirmation()}</p>
                            {recoveryData.providerName === 'pay-mock:mock' &&
                              this._mockCompletionAvailable && (
                                <>
                                  <p class="mt-1 text-base-content/70">
                                    {this.scope.locale.MockRefundSimulatorHelp()}
                                  </p>
                                  <button
                                    class="btn btn-info btn-sm mt-2"
                                    type="button"
                                    disabled={this._mockCompletion?.isPending}
                                    onClick={() => this._completeMockRefund()}
                                  >
                                    {this._mockCompletion?.isPending && (
                                      <span class="loading loading-spinner loading-xs"></span>
                                    )}
                                    {this.scope.locale.CompleteMockRefund()}
                                  </button>
                                  {this.mockCompletionError && (
                                    <p role="alert" class="mt-2 text-error">
                                      {this.scope.locale.MockRefundCompletionFailed()}
                                    </p>
                                  )}
                                </>
                              )}
                          </div>
                        )}
                        {recoveryData.recoveryDisposition !== 'none' &&
                          recoveryData.recoveryDisposition !== 'await_webhook' && (
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
                            disabled={this._recoveryActionPending}
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
                            <button
                              class="btn btn-warning btn-sm"
                              type="button"
                              disabled={this._recoveryActionPending}
                              onClick={() => this._retry()}
                            >
                              {this.scope.locale.RetryRefund()}
                            </button>
                          </>
                        )}
                      </>
                    )}
                </section>
              )}
            </div>
          );
        },
        slotActions: dialog => {
          const disabled = !this.executionConfirmed || this._executionPending;
          return (
            <>
              {this._executionPending && <span class="loading loading-spinner text-primary"></span>}
              <button class="btn btn-ghost" type="button" onClick={dialog.close}>
                {this.scope.locale.Cancel()}
              </button>
              <button
                class="btn btn-warning"
                type="button"
                disabled={disabled}
                onClick={() => this._execute(dialog.close)}
              >
                {this.scope.locale.ExecuteRefund()}
              </button>
            </>
          );
        },
        onClose: () => this._resetExecutionDialogState(),
      },
      {
        closeOnBackdrop: false,
        closeOnEscape: false,
        maxWidth: 560,
        showCloseButton: true,
      },
    );
  }

  protected render() {
    const props = this.$props as ControllerTableCellActionRefundProps;
    const order = this.$$renderContext.cellContext.row
      .original as ApiSchemaCommerceTradeDtoOrderSelectResItem;
    if (order.state === 'refund_requested') {
      return (
        <span
          class={props.class}
          role="button"
          tabindex={0}
          onClick={() => this._openRefundDecisionDialog()}
          onKeydown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              this._openRefundDecisionDialog();
            }
          }}
        >
          {this.scope.locale.ReviewRefund()}
        </span>
      );
    }
    return (
      <button class={props.class} type="button" onClick={() => this._openRefundExecutionDialog()}>
        {this.scope.locale.ExecuteRefund()}
      </button>
    );
  }
}

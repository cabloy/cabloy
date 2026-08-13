import type { ModelPaymentSession, TypePaymentNextAction } from 'zova-module-a-pay';
import type { ModelPayMockPayment } from 'zova-module-pay-mock';

import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPaymentNextAction } from 'zova-module-a-pay';
import { ZPage } from 'zova-module-home-base';

import { ModelOrderMine } from '../../model/orderMine.js';

export const ControllerPagePaymentSchemaParams = z.object({
  paymentSessionId: z.string(),
  orderId: z.string(),
  locale: z.string().optional(),
});
export const ControllerPagePaymentSchemaQuery = z.object({
  providerResult: z.enum(['return', 'cancel']).optional(),
});

type TypeMockPaymentOutcome = 'succeeded' | 'failed' | 'cancelled';

const SettlementPollDelaysMilliseconds = [0, 1_000, 2_000, 4_000, 5_000, 5_000, 5_000, 5_000];

function isNotFoundError(error: unknown) {
  return (error as { status?: unknown } | undefined)?.status === 404;
}

@Controller()
export class ControllerPagePayment extends BeanControllerPageBase {
  @Use({ beanFullName: 'a-pay.model.paymentSession' })
  $$modelPaymentSession: ModelPaymentSession;

  @Use({ beanFullName: 'pay-mock.model.payMockPayment' })
  $$modelPayMockPayment: ModelPayMockPayment;

  @Use()
  $$modelOrderMine: ModelOrderMine;

  paymentSessionId?: string;
  orderId?: string;
  submitting = false;
  waitingForOrder = false;
  pendingConfirmation = false;
  pendingSessionState?: string;
  pendingOrderState?: string;
  pendingNextAction?: TypePaymentNextAction;
  cancelReturnReconciled = false;
  paymentSessionUnavailable = false;
  message?: string;
  private _settlementPollVersion = 0;

  protected __dispose__() {
    this._settlementPollVersion += 1;
  }

  protected async __init__() {
    this.paymentSessionId = this.$computed(() => this.$params.paymentSessionId);
    this.orderId = this.$computed(() => this.$params.orderId);
    if (process.env.SERVER) {
      await $QueryEnsureLoaded(() => this.queryPaymentSession);
    }
    if (process.env.CLIENT) {
      await this.$ssr.handleDirectOrOnHydrated(() => this._initClient());
    }
  }

  private async _initClient() {
    await $QueryEnsureLoaded(() => this.queryPaymentSession);
    if (this.$query.providerResult === 'return') {
      await this.reconcile();
    } else if (this.$query.providerResult === 'cancel') {
      await this.reconcile({ waitForSettlement: false });
    }
  }

  get queryPaymentSession() {
    return this.$$modelPaymentSession.view(this.paymentSessionId!);
  }

  get queryOrder() {
    return this.$$modelOrderMine.viewMine(this.orderId!);
  }

  async reconcile({ waitForSettlement = true }: { waitForSettlement?: boolean } = {}) {
    if (!this.paymentSessionId || this.submitting) return;
    this.submitting = true;
    this.cancelReturnReconciled = false;
    this.pendingConfirmation = false;
    this.pendingSessionState = undefined;
    this.pendingOrderState = undefined;
    this.pendingNextAction = undefined;
    this.paymentSessionUnavailable = false;
    this.message = undefined;
    try {
      await this.$$modelPaymentSession.reconcile(this.paymentSessionId).mutateAsync();
      if (waitForSettlement) {
        await this._waitForSettlement();
      } else {
        await this.queryPaymentSession?.refetch();
        this.cancelReturnReconciled = true;
      }
    } catch (error: any) {
      this.message = error.message;
    } finally {
      this.submitting = false;
    }
  }

  async start() {
    if (!this.paymentSessionId || this.submitting) return;
    this.submitting = true;
    this.message = undefined;
    try {
      await this.$$modelPaymentSession.start(this.paymentSessionId).mutateAsync();
      await this.queryPaymentSession?.refetch();
    } catch (error: any) {
      this.message = error.message;
    } finally {
      this.submitting = false;
    }
  }

  async openOrder() {
    await this.$router.push({
      name: 'commerce-trade:order',
      params: { id: this.orderId, locale: this.$params.locale },
    });
  }

  async refreshOrderStatus() {
    if (this.waitingForOrder) return;
    await this.queryOrder?.refetch();
  }

  async settle(outcome: TypeMockPaymentOutcome) {
    if (!this.paymentSessionId || this.submitting) return;
    this.submitting = true;
    this.message = undefined;
    try {
      await this.$$modelPayMockPayment.complete(this.paymentSessionId).mutateAsync({ outcome });
      await this._waitForSettlement(outcome);
    } catch (error: any) {
      this.message = error.message;
    } finally {
      this.submitting = false;
    }
  }

  private async _waitForSettlement(outcome?: TypeMockPaymentOutcome) {
    const pollVersion = ++this._settlementPollVersion;
    this.waitingForOrder = true;
    const terminalSessionState = outcome;
    const terminalOrderState = outcome === 'succeeded' ? 'paid' : outcome ? 'cancelled' : undefined;
    try {
      for (const [attempt, delay] of SettlementPollDelaysMilliseconds.entries()) {
        if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
        if (!this._isCurrentSettlementPoll(pollVersion)) return;
        let session;
        try {
          session = await this.queryPaymentSession?.refetch();
        } catch (error) {
          if (isNotFoundError(error)) {
            this.paymentSessionUnavailable = true;
            this.message = 'Payment session is unavailable. You can open your order.';
            return;
          }
          throw error;
        }
        if (!this._isCurrentSettlementPoll(pollVersion)) return;
        const sessionState = session?.data?.state;
        this.pendingSessionState = sessionState;
        this.pendingNextAction = session?.data?.nextAction;
        const isSessionTerminal = ['succeeded', 'failed', 'cancelled', 'expired'].includes(
          sessionState ?? '',
        );
        if (!isSessionTerminal) continue;

        const order = await this.scope.api.commerceTradeOrder.viewMine({
          params: { id: this.orderId! },
        });
        if (!this._isCurrentSettlementPoll(pollVersion)) return;
        this.pendingSessionState = sessionState;
        this.pendingOrderState = order?.state;
        const settled =
          terminalSessionState && terminalOrderState
            ? sessionState === terminalSessionState && order?.state === terminalOrderState
            : ['paid', 'cancelled', 'expired'].includes(order?.state ?? '');
        if (settled) {
          await this.queryOrder?.refetch();
          if (!this._isCurrentSettlementPoll(pollVersion)) return;
          await this.$router.push({
            name: 'commerce-trade:order',
            params: { id: this.orderId, locale: this.$params.locale },
          });
          return;
        }
        if (attempt === SettlementPollDelaysMilliseconds.length - 1) break;
      }
      if (!this._isCurrentSettlementPoll(pollVersion)) return;
      this.pendingConfirmation = true;
      this.pendingSessionState = this.queryPaymentSession?.data?.state ?? this.pendingSessionState;
      this.pendingOrderState = this.queryOrder?.data?.state ?? this.pendingOrderState;
      this.message = this._pendingMessage();
    } finally {
      if (this._isCurrentSettlementPoll(pollVersion)) this.waitingForOrder = false;
    }
  }

  private _isCurrentSettlementPoll(pollVersion: number) {
    return this._settlementPollVersion === pollVersion;
  }

  private _pendingMessage() {
    if (this.pendingSessionState === 'requires_action') {
      return this.$query.providerResult === 'cancel'
        ? 'You returned from PayPal without completing payment. The order is still awaiting payment.'
        : 'Payment still needs your approval.';
    }
    if (this.pendingSessionState === 'processing') {
      return 'Your payment is still being processed. We will continue to verify it with the provider.';
    }
    if (['succeeded', 'failed', 'cancelled', 'expired'].includes(this.pendingSessionState ?? '')) {
      return 'Payment outcome is verified. Commerce is still updating the order.';
    }
    return 'Payment confirmation is still pending. We will continue to verify it with the provider.';
  }

  protected render() {
    const session = this.queryPaymentSession?.data;
    const isMockSession = session?.providerName === 'pay-mock:mock';
    const isCreated = session?.state === 'created';
    const isStarting = session?.state === 'starting';
    const isActionable = session?.state === 'requires_action';
    const isActionableCancelReturn =
      this.$query.providerResult === 'cancel' && this.cancelReturnReconciled && isActionable;
    const hasResumableCancelRedirect =
      isActionableCancelReturn && session?.nextAction?.kind === 'redirect';
    const isPendingTerminalState = ['succeeded', 'failed', 'cancelled', 'expired'].includes(
      this.pendingSessionState ?? '',
    );
    const hasPendingRedirect =
      this.pendingConfirmation &&
      this.pendingSessionState === 'requires_action' &&
      this.pendingNextAction?.kind === 'redirect';
    return (
      <ZPage>
        <section class="mx-auto max-w-xl p-6">
          <h1 class="text-3xl font-semibold">Payment</h1>
          <p class="mt-3 text-base-content/70">
            Payment status is verified before Commerce updates the order.
          </p>
          {isCreated && (
            <button
              class="btn btn-primary mt-6"
              disabled={this.submitting}
              onClick={() => this.start()}
            >
              Start payment
            </button>
          )}
          {(isStarting || this.paymentSessionUnavailable) && (
            <section class="mt-6 rounded border border-base-300 p-4" aria-live="polite">
              <p class="text-base-content/70">
                {this.paymentSessionUnavailable
                  ? 'Payment session is unavailable. You can open your order.'
                  : 'Payment preparation is being verified safely in the background.'}
              </p>
              <div class="mt-3 flex flex-wrap gap-3">
                {!this.paymentSessionUnavailable && (
                  <button
                    class="btn btn-primary"
                    type="button"
                    disabled={this.submitting || this.waitingForOrder}
                    onClick={() => this.reconcile()}
                  >
                    Check payment status
                  </button>
                )}
                <button class="btn btn-outline" type="button" onClick={() => this.openOrder()}>
                  Open order
                </button>
              </div>
            </section>
          )}
          {isActionableCancelReturn && (
            <section class="mt-6 rounded border border-base-300 p-4" aria-live="polite">
              <p class="text-base-content/70">
                {hasResumableCancelRedirect
                  ? 'You returned from the payment provider without completing payment. Your payment status has been refreshed. You can continue to payment or open your order.'
                  : 'You returned from the payment provider without completing payment. Your payment status has been refreshed. You can open your order.'}
              </p>
            </section>
          )}
          {!isCreated && !this.waitingForOrder && !this.pendingConfirmation && (
            <ZPaymentNextAction
              action={session?.nextAction}
              disabled={this.submitting}
              onRefresh={async () => {
                await this.queryPaymentSession?.refetch();
              }}
            />
          )}
          {isActionableCancelReturn && (
            <button class="btn btn-outline mt-3" type="button" onClick={() => this.openOrder()}>
              Open order
            </button>
          )}
          {isMockSession && isActionable && (
            <section class="mt-6 rounded border border-dashed border-base-300 p-4">
              <h2 class="font-semibold">Mock payment simulator</h2>
              <p class="mt-1 text-sm text-base-content/70">
                Available only when the server enables the development/test mock provider.
              </p>
              <div class="mt-3 flex flex-wrap gap-3">
                <button
                  class="btn btn-primary"
                  disabled={this.submitting || this.waitingForOrder}
                  onClick={() => this.settle('succeeded')}
                >
                  Payment succeeded
                </button>
                <button
                  class="btn btn-outline"
                  disabled={this.submitting || this.waitingForOrder}
                  onClick={() => this.settle('failed')}
                >
                  Payment failed
                </button>
                <button
                  class="btn btn-error btn-outline"
                  disabled={this.submitting || this.waitingForOrder}
                  onClick={() => this.settle('cancelled')}
                >
                  Cancel payment
                </button>
              </div>
            </section>
          )}
          {this.waitingForOrder && (
            <p class="mt-6 text-base-content/70" aria-live="polite">
              Waiting for verified provider confirmation and order settlement…
            </p>
          )}
          {session && !isCreated && !isActionable && !this.waitingForOrder && (
            <p class="mt-6 text-base-content/70">Payment session state: {session.state}</p>
          )}
          {this.message && (
            <div
              class={
                this.pendingConfirmation ? 'alert alert-warning mt-6' : 'alert alert-error mt-6'
              }
              role="alert"
            >
              <div>
                <span>{this.message}</span>
                {this.pendingConfirmation && (
                  <p class="mt-1 text-sm">
                    Payment session: {this.pendingSessionState ?? 'unknown'}; order:{' '}
                    {this.pendingOrderState ?? 'unknown'}.
                  </p>
                )}
              </div>
              {this.pendingConfirmation && (
                <div class="flex shrink-0 flex-wrap gap-2">
                  {hasPendingRedirect ? (
                    <ZPaymentNextAction
                      action={this.pendingNextAction}
                      disabled={this.submitting || this.waitingForOrder}
                    />
                  ) : isPendingTerminalState ? (
                    <button
                      class="btn btn-sm btn-primary"
                      type="button"
                      disabled={this.waitingForOrder}
                      onClick={() => this.refreshOrderStatus()}
                    >
                      Refresh order status
                    </button>
                  ) : (
                    <button
                      class="btn btn-sm btn-primary"
                      type="button"
                      disabled={this.submitting || this.waitingForOrder}
                      onClick={() => this.reconcile()}
                    >
                      Check payment status
                    </button>
                  )}
                  <button class="btn btn-sm" type="button" onClick={() => this.openOrder()}>
                    Open order
                  </button>
                </div>
              )}
            </div>
          )}
          {this.queryPaymentSession?.error && (
            <div class="alert alert-error mt-6" role="alert">
              <span>{this.queryPaymentSession.error.message}</span>
            </div>
          )}
        </section>
      </ZPage>
    );
  }
}

import type { ModelPaymentSession } from 'zova-module-a-pay';
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
  message?: string;

  protected async __init__() {
    this.paymentSessionId = this.$computed(() => this.$params.paymentSessionId);
    this.orderId = this.$computed(() => this.$params.orderId);
    if (this.$ssr.isRuntimeSsrHydrated) {
      await $QueryEnsureLoaded(() => this.queryPaymentSession);
      await $QueryEnsureLoaded(() => this.queryOrder);
      if (this.$query.providerResult) await this.reconcile();
    }
  }

  get queryPaymentSession() {
    return this.$$modelPaymentSession.view(this.paymentSessionId!);
  }

  get queryOrder() {
    return this.$$modelOrderMine.viewMine(this.orderId!);
  }

  async reconcile() {
    if (!this.paymentSessionId || this.submitting) return;
    this.submitting = true;
    this.message = undefined;
    try {
      await this.$$modelPaymentSession.reconcile(this.paymentSessionId).mutateAsync();
      await this._waitForSettlement();
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
    this.waitingForOrder = true;
    const terminalSessionState = outcome;
    const terminalOrderState = outcome === 'succeeded' ? 'paid' : outcome ? 'cancelled' : undefined;
    try {
      for (let attempt = 0; attempt < 60; attempt++) {
        const session = await this.queryPaymentSession?.refetch();
        const order = await this.scope.api.commerceTradeOrder.viewMine({
          params: { id: this.orderId! },
        });
        const settled =
          terminalSessionState && terminalOrderState
            ? session?.data?.state === terminalSessionState && order?.state === terminalOrderState
            : ['succeeded', 'failed', 'cancelled', 'expired'].includes(
                session?.data?.state ?? '',
              ) && ['paid', 'cancelled', 'expired'].includes(order?.state ?? '');
        if (settled) {
          await this.queryOrder?.refetch();
          await this.$router.push({
            name: 'commerce-trade:order',
            params: { id: this.orderId, locale: this.$params.locale },
          });
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      this.message =
        'Payment confirmation is still pending. Open the order to check its latest status.';
    } finally {
      this.waitingForOrder = false;
    }
  }

  protected render() {
    if (!this.$ssr.isRuntimeSsrHydrated) {
      return (
        <ZPage>
          <section class="mx-auto max-w-xl p-6" aria-busy="true" />
        </ZPage>
      );
    }
    const session = this.queryPaymentSession?.data;
    const isMockSession = session?.providerName === 'pay-mock:mock';
    const isCreated = session?.state === 'created';
    const isActionable = session?.state === 'requires_action';
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
          {!isCreated && !this.waitingForOrder && (
            <ZPaymentNextAction
              action={session?.nextAction}
              disabled={this.submitting}
              onRefresh={async () => {
                await this.queryPaymentSession?.refetch();
              }}
            />
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
            <div class="alert alert-error mt-6" role="alert">
              <span>{this.message}</span>
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

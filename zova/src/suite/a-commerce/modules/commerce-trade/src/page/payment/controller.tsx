import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ModelPayment } from '../../model/payment.js';

export const ControllerPagePaymentSchemaParams = z.object({
  attemptId: z.string(),
  locale: z.string().optional(),
});
export const ControllerPagePaymentSchemaQuery = z.object({});

@Controller()
export class ControllerPagePayment extends BeanControllerPageBase {
  @Use()
  $$modelPayment: ModelPayment;

  submitting = false;
  idempotencyKeys: Partial<Record<'succeeded' | 'failed' | 'cancelled', string>> = {};

  get attemptId() {
    return this.$router.currentRoute.value.params.attemptId as string;
  }

  async settle(outcome: 'succeeded' | 'failed' | 'cancelled') {
    if (this.submitting) return;
    this.submitting = true;
    try {
      const idempotencyKey =
        this.idempotencyKeys[outcome] ?? `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
      this.idempotencyKeys[outcome] = idempotencyKey;
      const result = await this.$$modelPayment.outcome().mutateAsync({
        attemptId: this.attemptId,
        body: { outcome, idempotencyKey },
      });
      this.$router.push({
        name: 'commerce-trade:order',
        params: { id: String(result.orderId) },
      });
    } finally {
      this.submitting = false;
    }
  }

  protected render() {
    return (
      <ZPage>
        <section class="mx-auto max-w-xl p-6">
          <h1 class="text-3xl font-semibold">Mock payment</h1>
          <p class="mt-3 text-base-content/70">
            Choose a server-authoritative mock payment outcome for this order.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button
              class="btn btn-primary"
              disabled={this.submitting}
              onClick={() => this.settle('succeeded')}
            >
              Payment succeeded
            </button>
            <button
              class="btn btn-outline"
              disabled={this.submitting}
              onClick={() => this.settle('failed')}
            >
              Payment failed
            </button>
            <button
              class="btn btn-error btn-outline"
              disabled={this.submitting}
              onClick={() => this.settle('cancelled')}
            >
              Cancel payment
            </button>
          </div>
        </section>
      </ZPage>
    );
  }
}

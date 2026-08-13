import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelOrderMine } from '../../model/orderMine.js';

export const ControllerPageOrderSchemaParams = z.object({
  id: z.string(),
});
export const ControllerPageOrderSchemaQuery = z.object({});

@Controller()
export class ControllerPageOrder extends BeanControllerPageBase {
  @Use()
  $$modelOrderMine: ModelOrderMine;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryOrder);
  }

  get orderId() {
    return this.$params.id;
  }

  get queryOrder() {
    return this.$$modelOrderMine.viewMine(this.orderId);
  }

  get mutationRequestRefund() {
    return this.$$modelOrderMine.requestRefund(this.orderId);
  }

  refundReason = '';
  refundRequestIdempotencyKey?: string;

  private async _requestRefund() {
    const reason = this.refundReason.trim();
    if (!reason) return;
    const idempotencyKey = this.refundRequestIdempotencyKey ?? crypto.randomUUID();
    this.refundRequestIdempotencyKey = idempotencyKey;
    await this.mutationRequestRefund.mutateAsync({ reason, idempotencyKey });
    this.refundReason = '';
    this.refundRequestIdempotencyKey = undefined;
  }

  protected render() {
    const query = this.queryOrder;
    const order = query?.data;
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl p-6">
          {!order && !query?.error && <p class="text-base-content/70">Loading order…</p>}
          {order && (
            <>
              <h1 class="text-3xl font-semibold">Order #{order.id}</h1>
              <p class="mt-2 text-base-content/70">
                {order.state} · ${(order.payableTotalCents / 100).toFixed(2)}
              </p>
              {order.state === 'paid' && !order.shipment && (
                <article class="card mt-6 border border-base-300 bg-base-100 shadow-sm">
                  <div class="card-body">
                    <h2 class="card-title">{this.scope.locale.RequestRefund()}</h2>
                    <p class="text-sm text-base-content/70">
                      {this.scope.locale.RefundRequestHelp()}
                    </p>
                    <textarea
                      class="textarea textarea-bordered"
                      name="refundReason"
                      placeholder={this.scope.locale.RefundReason()}
                      v-model={this.refundReason}
                    />
                    <button
                      class="btn btn-outline btn-warning self-start"
                      type="button"
                      disabled={!this.refundReason.trim() || this.mutationRequestRefund.isPending}
                      onClick={() => this._requestRefund()}
                    >
                      {this.scope.locale.RequestRefund()}
                    </button>
                  </div>
                </article>
              )}
              <div class="mt-6 grid gap-6 md:grid-cols-2">
                <article class="card border border-base-300 bg-base-100 shadow-sm">
                  <div class="card-body">
                    <h2 class="card-title">Delivery address</h2>
                    <p>{order.addressSnapshot.recipientName}</p>
                    <p>{order.addressSnapshot.addressLine1}</p>
                    <p>
                      {order.addressSnapshot.city}, {order.addressSnapshot.region}{' '}
                      {order.addressSnapshot.postalCode}
                    </p>
                  </div>
                </article>
                <article class="card border border-base-300 bg-base-100 shadow-sm">
                  <div class="card-body">
                    <h2 class="card-title">Payment</h2>
                    <p>{order.currency}</p>
                    <p>Discount: ${(order.discountCents / 100).toFixed(2)}</p>
                  </div>
                </article>
                {order.shipment && (
                  <article class="card border border-base-300 bg-base-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="card-title">Shipment</h2>
                      <p>{order.shipment.carrier}</p>
                      <p>{order.shipment.trackingNumber}</p>
                      <p class="text-sm text-base-content/70">
                        {new Date(order.shipment.shippedAt).toLocaleString()}
                      </p>
                    </div>
                  </article>
                )}
              </div>
              <div class="mt-6 space-y-3">
                {order.lines.map(line => (
                  <article class="card border border-base-300 bg-base-100 shadow-sm">
                    <div class="card-body">
                      <h2 class="card-title">{line.titleSnapshot}</h2>
                      <p class="text-sm text-base-content/70">{line.skuCodeSnapshot}</p>
                      <p>
                        {line.quantity} × ${(line.unitPriceCents / 100).toFixed(2)} = $
                        {(line.lineTotalCents / 100).toFixed(2)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
          {query?.error && (
            <div role="alert" class="alert alert-error mt-6">
              <span>{query.error.message}</span>
            </div>
          )}
        </section>
      </ZPage>
    );
  }
}

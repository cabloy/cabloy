import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ModelOrder } from '../../model/order.js';

export const ControllerPageOrderSchemaParams = z.object({
  id: z.string(),
  locale: z.string().optional(),
});
export const ControllerPageOrderSchemaQuery = z.object({});

@Controller()
export class ControllerPageOrder extends BeanControllerPageBase {
  @Use()
  $$modelOrder: ModelOrder;

  get orderId() {
    return this.$router.currentRoute.value.params.id as string;
  }

  get queryOrder() {
    if (process.env.SERVER) return;
    return this.$$modelOrder.view(this.orderId);
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

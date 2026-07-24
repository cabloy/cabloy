import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import { ModelOrderMine } from '../../model/orderMine.js';

export const ControllerPageOrdersSchemaParams = z.object({
  locale: z.string().optional(),
});
export const ControllerPageOrdersSchemaQuery = z.object({});

@Controller()
export class ControllerPageOrders extends BeanControllerPageBase {
  @Use()
  $$modelOrderMine: ModelOrderMine;

  pageNo = 1;
  readonly pageSize = 10;

  get queryOrders() {
    if (!this.$ssr.isRuntimeSsrHydrated) return;
    return this.$$modelOrderMine.mine({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  viewOrder(id: string) {
    this.$router.push({ name: 'commerce-trade:order', params: { id } });
  }

  protected render() {
    if (!this.$ssr.isRuntimeSsrHydrated) {
      return (
        <ZPage>
          <section class="mx-auto max-w-4xl p-6" aria-busy="true" />
        </ZPage>
      );
    }
    const query = this.queryOrders;
    const orders = query?.data?.list ?? [];
    const pageCount = query?.data?.pageCount ?? 0;
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl p-6">
          <h1 class="text-3xl font-semibold">My orders</h1>
          <div class="mt-6 space-y-3">
            {orders.map(order => (
              <article class="card border border-base-300 bg-base-100 shadow-sm">
                <div class="card-body flex-row items-center justify-between">
                  <div>
                    <h2 class="font-semibold">Order #{order.id}</h2>
                    <p class="text-sm text-base-content/70">
                      {order.state} · ${(order.payableTotalCents / 100).toFixed(2)}
                    </p>
                  </div>
                  <button
                    class="btn btn-outline btn-sm"
                    onClick={() => this.viewOrder(String(order.id))}
                  >
                    View
                  </button>
                </div>
              </article>
            ))}
          </div>
          {pageCount > 1 && (
            <div class="mt-6 flex items-center justify-between">
              <button
                class="btn btn-outline btn-sm"
                disabled={this.pageNo <= 1}
                onClick={() => (this.pageNo -= 1)}
              >
                Previous
              </button>
              <span class="text-sm text-base-content/70">
                Page {this.pageNo} of {pageCount}
              </span>
              <button
                class="btn btn-outline btn-sm"
                disabled={this.pageNo >= pageCount}
                onClick={() => (this.pageNo += 1)}
              >
                Next
              </button>
            </div>
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

import { RouterLink } from '@cabloy/vue-router';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelCart } from '../../model/cart.js';

export const ControllerPageCartSchemaParams = z.object({});
export const ControllerPageCartSchemaQuery = z.object({});

@Controller()
export class ControllerPageCart extends BeanControllerPageBase {
  @Use()
  $$modelCart: ModelCart;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryCurrent);
  }

  get queryCurrent() {
    return this.$$modelCart.current();
  }

  async updateQuantity(id: string, event: Event) {
    const quantity = Number((event.target as HTMLInputElement).value);
    if (!Number.isInteger(quantity) || quantity <= 0) return;
    await this.$$modelCart.updateItem().mutateAsync({ id, body: { quantity } });
  }

  async deleteItem(id: string) {
    await this.$$modelCart.deleteItem().mutateAsync(id);
  }

  async clear() {
    await this.$$modelCart.clear().mutateAsync();
  }

  private _getAddressPagePath(): string {
    return this.$router.getPagePath('/commerce/member/address');
  }

  private _getCheckoutPagePath(): string {
    return this.$router.getPagePath('/commerce/trade/checkout');
  }

  protected render() {
    const query = this.queryCurrent;
    const items = query?.data?.items ?? [];
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl p-6">
          <div class="flex items-center justify-between gap-4">
            <h1 class="text-3xl font-semibold">{this.scope.locale.Cart()}</h1>
            <div class="flex gap-2">
              <RouterLink class="btn btn-outline btn-sm" to={this._getAddressPagePath()}>
                {this.scope.locale.Addresses()}
              </RouterLink>
              {items.length > 0 && (
                <>
                  <RouterLink class="btn btn-primary btn-sm" to={this._getCheckoutPagePath()}>
                    {this.scope.locale.Checkout()}
                  </RouterLink>
                  <button class="btn btn-outline btn-sm" onClick={() => this.clear()}>
                    {this.scope.locale.ClearCart()}
                  </button>
                </>
              )}
            </div>
          </div>
          {items.length === 0 && (
            <p class="mt-6 text-base-content/70">{this.scope.locale.CartEmpty()}</p>
          )}
          {items.length > 0 && (
            <div class="mt-6 space-y-3">
              {items.map(item => (
                <article class="card bg-base-100 border border-base-300 shadow-sm">
                  <div class="card-body gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 class="card-title">{item.productTitle}</h2>
                      <p class="text-sm text-base-content/60">{item.skuCode}</p>
                      <p class="mt-1 font-semibold">${(item.priceCents / 100).toFixed(2)}</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <label class="flex items-center gap-2">
                        <span class="text-sm">{this.scope.locale.Quantity()}</span>
                        <input
                          class="input input-bordered input-sm w-20"
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(event: Event) => this.updateQuantity(String(item.id), event)}
                        />
                      </label>
                      <button
                        class="btn btn-error btn-outline btn-sm"
                        onClick={() => this.deleteItem(String(item.id))}
                      >
                        {this.scope.locale.RemoveCartItem()}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          {query?.error && (
            <div role="alert" class="alert alert-error mt-6">
              <span>{query?.error.message}</span>
            </div>
          )}
        </section>
      </ZPage>
    );
  }
}

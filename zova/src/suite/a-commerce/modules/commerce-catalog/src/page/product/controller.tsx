import type { ModelCart } from 'zova-module-commerce-trade';

import { RouterLink } from '@cabloy/vue-router';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelCatalogue } from '../../model/catalogue.js';

export const ControllerPageProductSchemaParams = z.object({
  id: z.string(),
  locale: z.string().optional(),
});
export const ControllerPageProductSchemaQuery = z.object({});

@Controller()
export class ControllerPageProduct extends BeanControllerPageBase {
  @Use()
  $$modelCatalogue: ModelCatalogue;

  @Use({ beanFullName: 'commerce-trade.model.cart' })
  $$modelCart: ModelCart;

  currentProductId?: string;

  protected async __init__() {
    this.currentProductId = this.$computed(() => {
      return this.$params.id;
    });
    await $QueryEnsureLoaded(() => this.queryPublicProduct);
  }

  get queryPublicProduct() {
    return this.$$modelCatalogue.publicProduct(this.currentProductId);
  }

  get queryCurrentCart() {
    return this.$$modelCart.current();
  }

  async addItem(skuId: string) {
    await this.$$modelCart.addItem().mutateAsync({ skuId, quantity: 1 });
  }

  private _getCartPagePath(): string {
    return this.$router.getAliasPath('commerce-trade:cart', {
      params: { locale: true },
    })!;
  }

  private _renderCartBadge() {
    const quantity =
      this.queryCurrentCart?.data?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
    return quantity > 0 ? <span class="badge badge-sm">{quantity}</span> : undefined;
  }

  protected render() {
    const query = this.queryPublicProduct;
    return (
      <ZPage>
        <section class="mx-auto max-w-4xl p-6">
          {query?.data && (
            <article class="card bg-base-100 border border-base-300 shadow-sm">
              <div class="card-body">
                <p class="text-sm text-base-content/60">{query.data.categoryName}</p>
                <h1 class="card-title text-3xl">{query.data.title}</h1>
                {query.data.description && (
                  <p class="text-base-content/70">{query.data.description}</p>
                )}
                {query.data.descriptionHtml && (
                  <div
                    class="product-description prose prose-sm mt-6 max-w-none text-base-content"
                    innerHTML={query.data.descriptionHtml}
                  ></div>
                )}
                <div class="mt-4 flex justify-end">
                  <RouterLink class="btn btn-outline btn-sm gap-2" to={this._getCartPagePath()}>
                    {this.scope.locale.Cart()}
                    {this._renderCartBadge()}
                  </RouterLink>
                </div>
                <div class="mt-4 space-y-3">
                  {query.data.skuAvailables.map(sku => (
                    <div class="flex items-center justify-between rounded border border-base-300 p-3">
                      <span>{sku.code}</span>
                      <span>${(sku.priceCents / 100).toFixed(2)}</span>
                      <span class="badge badge-success">
                        {this.scope.locale.AvailableCount(sku.available)}
                      </span>
                      <button
                        class="btn btn-primary btn-sm"
                        onClick={() => this.addItem(String(sku.id))}
                      >
                        {this.scope.locale.AddToCart()}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </article>
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

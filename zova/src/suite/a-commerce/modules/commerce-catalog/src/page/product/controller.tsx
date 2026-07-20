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
                <div class="mt-4 space-y-3">
                  {query.data.skuAvailables.map(sku => (
                    <div class="flex items-center justify-between rounded border border-base-300 p-3">
                      <span>{sku.code}</span>
                      <span>${(sku.priceCents / 100).toFixed(2)}</span>
                      <span class="badge badge-success">
                        {this.scope.locale.AvailableCount(sku.available)}
                      </span>
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

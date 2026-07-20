import { RouterLink } from '@cabloy/vue-router';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelCatalogue } from '../../model/catalogue.js';

export const ControllerPageCatalogueSchemaParams = z.object({
  locale: z.string().optional(),
});
export const ControllerPageCatalogueSchemaQuery = z.object({});

@Controller()
export class ControllerPageCatalogue extends BeanControllerPageBase {
  @Use()
  $$modelCatalogue: ModelCatalogue;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryPublicProducts);
  }

  get queryPublicProducts() {
    return this.$$modelCatalogue.publicProducts();
  }

  private _getProductPagePath(id: string | number): string {
    const localeCurrent = this.app.meta.locale.current;
    const routeAlias = this.$router.resolveName(
      '$alias:commerce-catalog:product' as never,
      {
        params: {
          id: String(id),
          locale: localeCurrent === this.sys.config.locale.default ? undefined : localeCurrent,
        },
      } as never,
    );
    return routeAlias.startsWith('/__alias__')
      ? routeAlias.substring('/__alias__'.length)
      : routeAlias;
  }

  protected render() {
    const query = this.queryPublicProducts;
    return (
      <ZPage>
        <section class="mx-auto max-w-6xl p-6">
          <h1 class="text-3xl font-semibold">Commerce catalogue</h1>
          <p class="mt-2 text-base-content/70">
            Current prices and stock are confirmed at checkout.
          </p>
          {query.error && (
            <div role="alert" class="alert alert-error mt-6">
              <span>{query.error.message}</span>
            </div>
          )}
          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {query.data?.list.map(item => (
              <article class="card bg-base-100 border border-base-300 shadow-sm">
                <div class="card-body">
                  <p class="text-sm text-base-content/60">{item.categoryName}</p>
                  <h2 class="card-title">
                    <RouterLink to={this._getProductPagePath(item.id)}>{item.title}</RouterLink>
                  </h2>
                  <p class="text-base-content/70">{item.description}</p>
                  <div class="card-actions mt-2 items-center justify-between">
                    <span class="font-semibold">From ${(item.priceCents / 100).toFixed(2)}</span>
                    <span class="badge badge-success">{item.available} available</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </ZPage>
    );
  }
}

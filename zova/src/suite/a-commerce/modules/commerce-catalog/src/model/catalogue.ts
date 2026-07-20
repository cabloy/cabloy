import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsCatalogue extends IDecoratorModelOptions {}

@Model<IModelOptionsCatalogue>()
export class ModelCatalogue extends BeanModelBase {
  publicProducts(query?: {
    pageNo?: number;
    pageSize?: number;
    categoryId?: string;
    title?: string;
  }) {
    return this.$useStateData({
      queryKey: [
        'publicProducts',
        query?.pageNo ?? 1,
        query?.pageSize ?? 20,
        query?.categoryId,
        query?.title,
      ],
      queryFn: async () => {
        return await this.scope.api.commerceCatalogProduct.selectPublic({ query });
      },
    });
  }

  publicProduct(id?: string) {
    if (!id) return undefined;
    return this.$useStateData({
      queryKey: ['publicProduct', id],
      queryFn: async () => {
        return await this.scope.api.commerceCatalogProduct.viewPublic({ params: { id } });
      },
    });
  }
}

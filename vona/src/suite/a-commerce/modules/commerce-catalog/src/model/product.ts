import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityProduct } from '../entity/product.tsx';

export interface IModelOptionsProduct extends IDecoratorModelOptions<EntityProduct> {}

@Model<IModelOptionsProduct>({
  entity: EntityProduct,
  relations: {
    category: $relation.belongsTo(
      'commerce-catalog:product',
      'commerce-catalog:category',
      'categoryId',
    ),
    skus: $relation.hasMany('commerce-catalog:sku', 'productId'),
    skuAvailables: $relation.hasMany(
      'commerce-catalog:sku',
      'productId',
      {
        columns: ['id', 'code', 'productId', 'priceCents'],
        joins: [
          [
            'innerJoin',
            'commerceTradeStockBalance',
            function () {
              this.on('commerceCatalogSku.id', '=', 'commerceTradeStockBalance.skuId').andOn(
                'commerceCatalogSku.iid',
                '=',
                'commerceTradeStockBalance.iid',
              );
            },
          ],
        ],
        where: {
          'lifecycle': 'active',
          'commerceTradeStockBalance.deleted': false,
          'commerceTradeStockBalance.available': { _gt_: 0 },
        },
      },
      'commerce-trade:stockBalance',
    ),
  },
})
export class ModelProduct extends BeanModelBase<EntityProduct> {}

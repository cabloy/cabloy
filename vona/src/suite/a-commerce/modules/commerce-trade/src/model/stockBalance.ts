import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStockBalance } from '../entity/stockBalance.tsx';

export interface IModelOptionsStockBalance extends IDecoratorModelOptions<EntityStockBalance> {}

@Model<IModelOptionsStockBalance>({
  entity: EntityStockBalance,
  cache: {
    modelsClear: 'commerce-catalog:sku',
  },
})
export class ModelStockBalance extends BeanModelBase<EntityStockBalance> {}

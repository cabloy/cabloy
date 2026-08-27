import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiCommerceTradeStockBalanceadjustStockRequestBody,
  ApiApiCommerceTradeStockBalanceadjustStockResponseBody,
} from '../api/commerceTradeStockBalance.js';

export interface IModelOptionsStockBalance extends IDecoratorModelOptions {}

const SkuResource = 'commerce-catalog:sku';

@Model<IModelOptionsStockBalance>()
export class ModelStockBalance extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(SkuResource, true);
  }

  adjustStock(id: TableIdentity) {
    return this.$$modelResource.mutationItem<
      ApiApiCommerceTradeStockBalanceadjustStockResponseBody,
      ApiApiCommerceTradeStockBalanceadjustStockRequestBody
    >({
      id,
      action: 'adjustStock',
      mutationFn: async payload => {
        return await this.scope.api.commerceTradeStockBalance.adjustStock(payload);
      },
    });
  }
}

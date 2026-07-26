import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiCommerceTradeOrdershipRequestBody } from '../api/commerceTradeOrder.js';

export interface IModelOptionsOrder extends IDecoratorModelOptions {}

const OrderResource = 'commerce-trade:order';

@Model<IModelOptionsOrder>()
export class ModelOrder extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(OrderResource, true);
  }

  select(query?: Record<string, unknown>) {
    return this.$$modelResource.select(query);
  }

  view(id: TableIdentity) {
    return this.$$modelResource.view(id);
  }

  ship(id: TableIdentity) {
    return this.$$modelResource.mutationItem<unknown, ApiApiCommerceTradeOrdershipRequestBody>({
      id,
      action: 'ship',
      mutationFn: async payload => {
        return await this.scope.api.commerceTradeOrder.ship(payload, { params: { id } });
      },
    });
  }
}

import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

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
}

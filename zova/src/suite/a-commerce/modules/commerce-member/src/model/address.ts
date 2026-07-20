import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';
import type { ModelResource } from 'zova-module-rest-resource';

import { Use, usePrepareArg } from 'zova';
import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsAddress extends IDecoratorModelOptions {}

const AddressResource = 'commerce-member:address';

@Model<IModelOptionsAddress>()
export class ModelAddress extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(AddressResource, true);
  }

  select(query?: Record<string, unknown>) {
    return this.$$modelResource.select(query);
  }

  view(id: TableIdentity) {
    return this.$$modelResource.view(id);
  }

  create() {
    return this.$$modelResource.create();
  }

  update(id: TableIdentity) {
    return this.$$modelResource.update(id);
  }

  delete(id: TableIdentity) {
    return this.$$modelResource.delete(id);
  }
}

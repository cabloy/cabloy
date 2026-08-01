import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiPayMockPaymentcompleteRequestBody } from '../api/payMockPayment.js';

export interface IModelOptionsPayMockPayment extends IDecoratorModelOptions {}

@Model<IModelOptionsPayMockPayment>()
export class ModelPayMockPayment extends BeanModelBase {
  complete(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['complete', id],
      mutationFn: async (body: ApiApiPayMockPaymentcompleteRequestBody) => {
        return await this.scope.api.payMockPayment.complete(body, { params: { id } });
      },
    });
  }
}

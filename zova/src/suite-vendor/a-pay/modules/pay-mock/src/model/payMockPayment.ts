import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import { ApiApiPayMockMockPaymentcompleteRequestBody } from '../api/payMockMockPayment.js';

export interface IModelOptionsPayMockPayment extends IDecoratorModelOptions {}

@Model<IModelOptionsPayMockPayment>()
export class ModelPayMockPayment extends BeanModelBase {
  complete(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['complete', id],
      mutationFn: async (body: ApiApiPayMockMockPaymentcompleteRequestBody) => {
        return await this.scope.api.payMockMockPayment.complete(body, { params: { id } });
      },
    });
  }
}

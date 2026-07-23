import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiCommerceTradePaymentoutcomeRequestBody } from '../api/commerceTradePayment.js';

export interface IModelOptionsPayment extends IDecoratorModelOptions {}

@Model<IModelOptionsPayment>()
export class ModelPayment extends BeanModelBase {
  outcome() {
    return this.$useMutationData({
      mutationKey: ['outcome'],
      mutationFn: async ({
        attemptId,
        body,
      }: {
        attemptId: string;
        body: ApiApiCommerceTradePaymentoutcomeRequestBody;
      }) => {
        return await this.scope.api.commerceTradePayment.outcome(body, { params: { attemptId } });
      },
    });
  }
}

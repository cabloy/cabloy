import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiCommerceTradeOrderrequestRefundRequestBody } from '../api/commerceTradeOrder.js';

export interface IModelOptionsOrderMine extends IDecoratorModelOptions {}

@Model<IModelOptionsOrderMine>()
export class ModelOrderMine extends BeanModelBase {
  mine(query: { pageNo: number; pageSize: number }) {
    if (!process.env.CLIENT || !this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['mine', query],
      queryFn: async () => {
        return await this.scope.api.commerceTradeOrder.mine({ query });
      },
      meta: { disableSuspenseOnInit: true },
    });
  }

  viewMine(id: TableIdentity) {
    if (!process.env.CLIENT || !this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['viewMine', id],
      queryFn: async () => {
        return await this.scope.api.commerceTradeOrder.viewMine({ params: { id } });
      },
      meta: { disableSuspenseOnInit: true },
    });
  }

  requestRefund(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['requestRefund', id],
      mutationFn: async (body: ApiApiCommerceTradeOrderrequestRefundRequestBody) => {
        return await this.scope.api.commerceTradeOrder.requestRefund(body, { params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
        await this.$invalidateQueries({ queryKey: ['viewMine', id] });
      },
    });
  }
}

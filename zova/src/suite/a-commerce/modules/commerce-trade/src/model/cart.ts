import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiCommerceTradeCartaddItemRequestBody,
  ApiApiCommerceTradeCartupdateItemRequestBody,
} from '../api/commerceTradeCart.js';

export interface IModelOptionsCart extends IDecoratorModelOptions {}

@Model<IModelOptionsCart>()
export class ModelCart extends BeanModelBase {
  current() {
    return this.$useStateData({
      queryKey: ['current'],
      queryFn: async () => {
        return await this.scope.api.commerceTradeCart.current();
      },
      meta: { disableSuspenseOnInit: true },
    });
  }

  addItem() {
    return this.$useMutationData({
      mutationKey: ['addItem'],
      mutationFn: async (body: ApiApiCommerceTradeCartaddItemRequestBody) => {
        return await this.scope.api.commerceTradeCart.addItem(body);
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['current'] });
      },
    });
  }

  updateItem() {
    return this.$useMutationData({
      mutationKey: ['updateItem'],
      mutationFn: async ({
        id,
        body,
      }: {
        id: string;
        body: ApiApiCommerceTradeCartupdateItemRequestBody;
      }) => {
        return await this.scope.api.commerceTradeCart.updateItem(body, { params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['current'] });
      },
    });
  }

  deleteItem() {
    return this.$useMutationData({
      mutationKey: ['deleteItem'],
      mutationFn: async (id: string) => {
        return await this.scope.api.commerceTradeCart.deleteItem({ params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['current'] });
      },
    });
  }

  clear() {
    return this.$useMutationData({
      mutationKey: ['clear'],
      mutationFn: async () => {
        return await this.scope.api.commerceTradeCart.clear();
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['current'] });
      },
    });
  }
}

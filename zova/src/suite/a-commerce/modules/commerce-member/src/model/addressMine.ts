import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiCommerceMemberAddresscreateMineRequestBody,
  ApiApiCommerceMemberAddressupdateMineRequestBody,
} from '../api/commerceMemberAddress.js';

export interface IModelOptionsAddressMine extends IDecoratorModelOptions {}

@Model<IModelOptionsAddressMine>()
export class ModelAddressMine extends BeanModelBase {
  mine(query: { pageNo: number; pageSize: number }) {
    if (!this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['mine', query],
      queryFn: async () => {
        return await this.scope.api.commerceMemberAddress.mine({ query });
      },
    });
  }

  createMine() {
    return this.$useMutationData({
      mutationKey: ['createMine'],
      mutationFn: async (body: ApiApiCommerceMemberAddresscreateMineRequestBody) => {
        return await this.scope.api.commerceMemberAddress.createMine(body);
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }

  updateMine() {
    return this.$useMutationData({
      mutationKey: ['updateMine'],
      mutationFn: async ({
        id,
        body,
      }: {
        id: TableIdentity;
        body: ApiApiCommerceMemberAddressupdateMineRequestBody;
      }) => {
        await this.scope.api.commerceMemberAddress.updateMine(body, { params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }

  deleteMine() {
    return this.$useMutationData({
      mutationKey: ['deleteMine'],
      mutationFn: async (id: TableIdentity) => {
        await this.scope.api.commerceMemberAddress.deleteMine({ params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }
}

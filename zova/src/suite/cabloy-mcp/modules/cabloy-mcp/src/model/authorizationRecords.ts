import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsAuthorizationRecords extends IDecoratorModelOptions {}

@Model<IModelOptionsAuthorizationRecords>()
export class ModelAuthorizationRecords extends BeanModelBase {
  mine(query: { pageNo: number; pageSize: number }) {
    if (!this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['mine', this.$passport.user?.id, query],
      queryFn: () => this.scope.api.mcpAuthAuthorizationGrant.mine({ query }),
      meta: {
        disableSuspenseOnInit: true,
        persister: false,
      },
    });
  }

  revokeMine(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['revokeMine', id],
      mutationFn: async () => {
        await this.scope.api.mcpAuthAuthorizationGrant.revokeMine(undefined, { params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }

  deleteMine(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['deleteMine', id],
      mutationFn: async () => {
        await this.scope.api.mcpAuthAuthorizationGrant.deleteMine({ params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }
}

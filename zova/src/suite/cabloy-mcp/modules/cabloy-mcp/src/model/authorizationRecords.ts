import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsAuthorizationRecords extends IDecoratorModelOptions {}

@Model<IModelOptionsAuthorizationRecords>()
export class ModelAuthorizationRecords extends BeanModelBase {
  mine(query: { pageNo: number; pageSize: number }) {
    if (!this.$passport.isAuthenticated) return;
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useStateData({
      queryKey: ['mine', ssrSiteId, this.$passport.user?.id, query],
      queryFn: () =>
        this.scope.api.mcpAuthAuthorizationGrant.mine({ query: { ...query, ssrSiteId } }),
      meta: {
        disableSuspenseOnInit: true,
        persister: false,
      },
    });
  }

  revokeMine(id: TableIdentity) {
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useMutationData({
      mutationKey: ['revokeMine', ssrSiteId, id],
      mutationFn: async () => {
        await this.scope.api.mcpAuthAuthorizationGrant.revokeMine(undefined, {
          params: { id },
          query: { ssrSiteId },
        });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine', ssrSiteId] });
      },
    });
  }
}

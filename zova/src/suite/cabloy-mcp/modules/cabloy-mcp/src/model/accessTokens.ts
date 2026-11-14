import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiMcpAuthAccessTokencreateMineRequestBody,
  ApiApiMcpAuthAccessTokenmineResponseBody,
} from '../api/mcpAuthAccessToken.ts';

export type AccessTokenItem = ApiApiMcpAuthAccessTokenmineResponseBody['list'][number];
export type AccessTokenDraft = ApiApiMcpAuthAccessTokencreateMineRequestBody;

export interface IModelOptionsAccessTokens extends IDecoratorModelOptions {}

@Model<IModelOptionsAccessTokens>()
export class ModelAccessTokens extends BeanModelBase {
  mine(query: { pageNo: number; pageSize: number }) {
    if (!this.$passport.isAuthenticated) return;
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useStateData({
      queryKey: ['mine', ssrSiteId, this.$passport.user?.id, query],
      queryFn: () => this.scope.api.mcpAuthAccessToken.mine({ query: { ...query, ssrSiteId } }),
      meta: {
        persister: false,
      },
    });
  }

  // A one-time credential must never enter query data or mutation-cache results.
  async createMine(body: AccessTokenDraft) {
    this.$logger.debug('mcp.accessToken.create started');
    const result = await this.scope.api.mcpAuthAccessToken.createMine(body, {
      query: { ssrSiteId: this.sys.env.SITE_ID },
    });
    this.$logger.debug('mcp.accessToken.create completed');
    return result;
  }

  invalidateMine() {
    return this.$invalidateQueries({ queryKey: ['mine', this.sys.env.SITE_ID] });
  }

  deleteMine(id: TableIdentity) {
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useMutationData({
      mutationKey: ['deleteMine', ssrSiteId, id],
      mutationFn: async () => {
        this.$logger.debug('mcp.accessToken.delete started');
        await this.scope.api.mcpAuthAccessToken.deleteMine({
          params: { id },
          query: { ssrSiteId },
        });
        this.$logger.debug('mcp.accessToken.delete completed');
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine', ssrSiteId] });
      },
    });
  }
}

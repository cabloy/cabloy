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
    return this.$useStateData({
      queryKey: ['mine', this.$passport.user?.id, query],
      queryFn: () => this.scope.api.mcpAuthAccessToken.mine({ query }),
      meta: {
        persister: false,
      },
    });
  }

  // A one-time credential must never enter query data or mutation-cache results.
  async createMine(body: AccessTokenDraft) {
    this.$logger.debug('mcp.accessToken.create started');
    const result = await this.scope.api.mcpAuthAccessToken.createMine(body);
    this.$logger.debug('mcp.accessToken.create completed');
    return result;
  }

  invalidateMine() {
    return this.$invalidateQueries({ queryKey: ['mine'] });
  }

  deleteMine(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['deleteMine', id],
      mutationFn: async () => {
        this.$logger.debug('mcp.accessToken.delete started');
        await this.scope.api.mcpAuthAccessToken.deleteMine({ params: { id } });
        this.$logger.debug('mcp.accessToken.delete completed');
      },
      onSuccess: async () => {
        await this.invalidateMine();
      },
    });
  }
}

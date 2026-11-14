import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiMcpAuthCustomScopecatalogResponseBody,
  ApiApiMcpAuthCustomScopecreateMineRequestBody,
  ApiApiMcpAuthCustomScopemineResponseBody,
} from '../api/mcpAuthCustomScope.ts';

export type PersonalScope = ApiApiMcpAuthCustomScopemineResponseBody['list'][number];
export type PersonalScopeDraft = ApiApiMcpAuthCustomScopecreateMineRequestBody;
export type CatalogTool = ApiApiMcpAuthCustomScopecatalogResponseBody[number];
export type ToolIdentity = PersonalScopeDraft['tools'][number];

export function toolIdentityKey(tool: ToolIdentity) {
  return JSON.stringify([tool.name, tool.controller, tool.action]);
}

export interface IModelOptionsPersonalScopes extends IDecoratorModelOptions {}

@Model<IModelOptionsPersonalScopes>()
export class ModelPersonalScopes extends BeanModelBase {
  mine() {
    if (!this.$passport.isAuthenticated) return;
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useStateData({
      queryKey: ['mine', ssrSiteId, this.$passport.user?.id],
      queryFn: () => this.scope.api.mcpAuthCustomScope.mine({ query: { ssrSiteId } }),
      meta: {
        persister: false,
      },
    });
  }

  catalog() {
    if (!this.$passport.isAuthenticated) return;
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useStateData({
      queryKey: ['catalog', ssrSiteId, this.$passport.user?.id, this.app.meta.locale.current],
      queryFn: () => this.scope.api.mcpAuthCustomScope.catalog({ query: { ssrSiteId } }),
      meta: {
        persister: false,
      },
    });
  }

  save(id?: TableIdentity) {
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useMutationData({
      mutationKey: ['save', ssrSiteId, id],
      mutationFn: (body: PersonalScopeDraft) =>
        id === undefined
          ? this.scope.api.mcpAuthCustomScope.createMine(body, { query: { ssrSiteId } })
          : this.scope.api.mcpAuthCustomScope.updateMine(body, {
              params: { id },
              query: { ssrSiteId },
            }),
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine', ssrSiteId] });
      },
    });
  }

  deleteMine(id: TableIdentity) {
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useMutationData({
      mutationKey: ['deleteMine', ssrSiteId, id],
      mutationFn: () =>
        this.scope.api.mcpAuthCustomScope.deleteMine({ params: { id }, query: { ssrSiteId } }),
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine', ssrSiteId] });
      },
    });
  }
}

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
    return this.$useStateData({
      queryKey: ['mine', this.$passport.user?.id],
      queryFn: () => this.scope.api.mcpAuthCustomScope.mine(),
      meta: {
        persister: false,
      },
    });
  }

  catalog() {
    if (!this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['catalog', this.$passport.user?.id, this.app.meta.locale.current],
      queryFn: () => this.scope.api.mcpAuthCustomScope.catalog(),
      meta: {
        persister: false,
      },
    });
  }

  save(id?: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['save', id],
      mutationFn: (body: PersonalScopeDraft) =>
        id === undefined
          ? this.scope.api.mcpAuthCustomScope.createMine(body)
          : this.scope.api.mcpAuthCustomScope.updateMine(body, { params: { id } }),
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }

  deleteMine(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['deleteMine', id],
      mutationFn: () => this.scope.api.mcpAuthCustomScope.deleteMine({ params: { id } }),
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['mine'] });
      },
    });
  }
}

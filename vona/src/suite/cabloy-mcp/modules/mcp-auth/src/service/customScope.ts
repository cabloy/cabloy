import type { TableIdentity } from 'table-identity';

import { randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoCustomScopeCreate } from '../dto/customScopeCreate.tsx';
import type { DtoCustomScopeMineRes, DtoCustomScopeView } from '../dto/customScopeView.tsx';
import type { EntityCustomScope } from '../entity/customScope.tsx';
import type { IMcpToolCatalogItem, IMcpToolIdentity, TypeMcpScope } from '../types/index.ts';

import { isMcpCustomScope, OAuthError } from '../lib/authorization.ts';

export function toolIdentityKey(tool: IMcpToolIdentity): string {
  return JSON.stringify([tool.name, tool.controller, tool.action]);
}

/** Canonical exact identities, not names, patterns, or caller-supplied annotations. */
export function normalizeToolIdentities(value: unknown): IMcpToolIdentity[] {
  // Raw builders return JSON text on SQLite and decoded JSON on other supported drivers.
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      throw new OAuthError('invalid_scope');
    }
  }
  if (!Array.isArray(value) || !value.length || value.length > 256)
    throw new OAuthError('invalid_scope');
  const tools = value.map(tool => {
    if (
      !tool ||
      typeof tool !== 'object' ||
      Array.isArray(tool) ||
      !['name', 'controller', 'action'].every(
        key => typeof tool[key] === 'string' && tool[key].length > 0 && tool[key].length <= 255,
      ) ||
      Object.keys(tool).some(key => !['name', 'controller', 'action'].includes(key))
    ) {
      throw new OAuthError('invalid_scope');
    }
    return {
      name: tool.name,
      controller: tool.controller,
      action: tool.action,
    } as IMcpToolIdentity;
  });
  return Array.from(new Map(tools.map(tool => [toolIdentityKey(tool), tool])).values()).toSorted(
    (a, b) => toolIdentityKey(a).localeCompare(toolIdentityKey(b)),
  );
}

export function sameTools(left: unknown, right: unknown): boolean {
  try {
    return (
      JSON.stringify(normalizeToolIdentities(left)) ===
      JSON.stringify(normalizeToolIdentities(right))
    );
  } catch {
    return false;
  }
}

@Service()
export class ServiceCustomScope extends BeanBase {
  async catalog(): Promise<IMcpToolCatalogItem[]> {
    // Runtime composition seam: no reverse package import or dependency edge.
    return await this.app.scope('cabloy-mcp').service.sharedBusinessTools.catalog();
  }

  async mine(userId: TableIdentity): Promise<DtoCustomScopeMineRes> {
    const rows = await this.scope.model.customScope
      .builderSelect()
      .where({ userId })
      .orderBy('id', 'desc');
    return { list: rows.map(row => this.toView(row)) };
  }

  toView(row: EntityCustomScope): DtoCustomScopeView {
    return {
      id: row.id,
      scope: row.scope,
      name: row.name,
      description: row.description,
      tools: normalizeToolIdentities(row.tools),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async createMine(userId: TableIdentity, data: DtoCustomScopeCreate): Promise<EntityCustomScope> {
    const parsed = await this.validate(data);
    return await this.scope.model.customScope.insert({
      ...parsed,
      userId,
      scope: `mcp:custom:${randomBytes(32).toString('base64url')}`,
    });
  }

  async updateMine(
    userId: TableIdentity,
    id: TableIdentity,
    data: DtoCustomScopeCreate,
  ): Promise<EntityCustomScope> {
    const row = await this.scope.model.customScope.get({ id, userId });
    if (!row) this.app.throw(404);
    const parsed = await this.validate(data);
    if (!sameTools(row.tools, parsed.tools)) await this.revokeLinked(userId, row.scope);
    await this.scope.model.customScope.update({ id, userId, ...parsed });
    const updated = (await this.scope.model.customScope
      .builderSelect()
      .where({ id, userId })
      .first())!;
    return { ...updated, tools: normalizeToolIdentities(updated.tools) };
  }

  async deleteMine(userId: TableIdentity, id: TableIdentity): Promise<void> {
    const row = await this.scope.model.customScope.get({ id, userId });
    if (!row) return;
    await this.revokeLinked(userId, row.scope);
    await this.scope.model.customScope.delete({ id, userId });
  }

  async resolve(userId: TableIdentity, scope: TypeMcpScope): Promise<EntityCustomScope> {
    if (!isMcpCustomScope(scope)) throw new OAuthError('invalid_scope');
    const row = await this.scope.model.customScope.builderSelect().where({ scope, userId }).first();
    if (!row) throw new OAuthError('invalid_scope');
    return { ...row, tools: normalizeToolIdentities(row.tools) };
  }

  /** Validate custom scope definitions before linking grants. */
  async withDefinitions<T>(
    userId: TableIdentity,
    scopes: TypeMcpScope[],
    operation: () => Promise<T>,
  ): Promise<T> {
    for (const scope of Array.from(new Set(scopes.filter(isMcpCustomScope))).toSorted()) {
      const row = await this.scope.model.customScope.get({ scope, userId });
      if (!row) throw new OAuthError('invalid_scope');
      normalizeToolIdentities(row.tools);
    }
    return await operation();
  }

  private async validate(data: DtoCustomScopeCreate): Promise<DtoCustomScopeCreate> {
    if (
      !data ||
      typeof data.name !== 'string' ||
      !data.name.trim() ||
      data.name.trim().length > 100 ||
      typeof data.description !== 'string' ||
      data.description.length > 1000 ||
      Object.keys(data).some(key => !['name', 'description', 'tools'].includes(key))
    ) {
      throw new OAuthError('invalid_request');
    }
    if (!Array.isArray(data.tools)) throw new OAuthError('invalid_scope');
    const tools = normalizeToolIdentities(data.tools);
    const available = new Set((await this.catalog()).map(toolIdentityKey));
    if (tools.some(tool => !available.has(toolIdentityKey(tool))))
      throw new OAuthError('invalid_scope');
    return { name: data.name.trim(), description: data.description, tools };
  }

  private async revokeLinked(userId: TableIdentity, scope: TypeMcpScope): Promise<void> {
    await this.scope.model.authorization
      .builderSelect()
      .where({ userId })
      .where(builder => builder.where({ scope }).orWhere({ requestedScope: scope }))
      .whereIn('state', ['codeReady', 'tokenActive'])
      .update({ state: 'revoked', codeDigest: '', tokenDigest: '', expiresAt: Date.now() });
  }
}

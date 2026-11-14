import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoCustomScopeCreate } from '../dto/customScopeCreate.tsx';
import type { DtoCustomScopeMineRes, DtoCustomScopeView } from '../dto/customScopeView.tsx';
import type { EntityCustomScope } from '../entity/customScope.tsx';
import type { IMcpToolCatalogItem, IMcpToolIdentity, TypeMcpScope } from '../types/index.ts';

import {
  isCanonicalMcpCustomScope,
  isMcpCustomScope,
  mcpCustomScopeNamePattern,
  OAuthError,
} from '../lib/authorization.ts';

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
  async catalog(resource: string): Promise<IMcpToolCatalogItem[]> {
    // Runtime composition seam: no reverse package import or dependency edge.
    return await this.app.scope('cabloy-mcp').service.sharedBusinessTools.catalog(resource);
  }

  async mine(userId: TableIdentity, resource: string): Promise<DtoCustomScopeMineRes> {
    const rows = await this.scope.model.customScope
      .builderSelect()
      .where({ userId, resource })
      .orderBy('id', 'desc');
    return { list: rows.map(row => this.toView(row)) };
  }

  toView(row: EntityCustomScope): DtoCustomScopeView {
    return {
      id: row.id,
      resource: row.resource,
      scope: row.scope,
      name: row.name,
      description: row.description,
      tools: normalizeToolIdentities(row.tools),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async createMine(
    userId: TableIdentity,
    resource: string,
    data: DtoCustomScopeCreate,
  ): Promise<EntityCustomScope> {
    this.scope.service.authorization.configForResource(resource);
    return await this.withOwnerLock(userId, resource, async () => {
      const parsed = await this.validate(resource, data);
      const scope = `mcp:custom:${parsed.name}` as const;
      await this.ensureUniqueName(userId, resource, parsed.name);
      return await this.scope.model.customScope.insert({ ...parsed, userId, resource, scope });
    });
  }

  async updateMine(
    userId: TableIdentity,
    resource: string,
    id: TableIdentity,
    data: DtoCustomScopeCreate,
  ): Promise<EntityCustomScope> {
    return await this.withOwnerLock(userId, resource, async () => {
      const row = await this.scope.model.customScope.get({ id, userId, resource });
      if (!row) this.app.throw(404);
      const parsed = await this.validate(row.resource, data);
      const scope = `mcp:custom:${parsed.name}` as const;
      await this.ensureUniqueName(userId, row.resource, parsed.name, id);
      if (row.scope !== scope || !sameTools(row.tools, parsed.tools))
        await this.revokeLinked(userId, row.resource, row.scope);
      await this.scope.model.customScope.update({
        id,
        userId,
        resource: row.resource,
        ...parsed,
        scope,
      });
      const updated = (await this.scope.model.customScope
        .builderSelect()
        .where({ id, userId, resource: row.resource })
        .first())!;
      return { ...updated, tools: normalizeToolIdentities(updated.tools) };
    });
  }

  async deleteMine(userId: TableIdentity, resource: string, id: TableIdentity): Promise<void> {
    await this.withOwnerLock(userId, resource, async () => {
      const row = await this.scope.model.customScope.get({ id, userId, resource });
      if (!row) return;
      await this.revokeLinked(userId, row.resource, row.scope);
      await this.scope.model.customScope.delete({ id, userId, resource: row.resource });
    });
  }

  async resolve(
    userId: TableIdentity,
    resource: string,
    scope: TypeMcpScope,
  ): Promise<EntityCustomScope> {
    if (!isMcpCustomScope(scope)) throw new OAuthError('invalid_scope');
    const rows = await this.scope.model.customScope
      .builderSelect()
      .where({ scope, userId, resource });
    const row = rows.find(row => row.scope === scope && row.resource === resource);
    if (!row || !isCanonicalMcpCustomScope(row)) throw new OAuthError('invalid_scope');
    return { ...row, tools: normalizeToolIdentities(row.tools) };
  }

  /** Validate custom scope definitions before linking grants. */
  async withDefinitions<T>(
    userId: TableIdentity,
    resource: string,
    scopes: TypeMcpScope[],
    operation: () => Promise<T>,
  ): Promise<T> {
    return await this.withOwnerLock(userId, resource, async () => {
      for (const scope of new Set(scopes.filter(isMcpCustomScope))) {
        await this.resolve(userId, resource, scope);
      }
      return await operation();
    });
  }

  private async validate(
    resource: string,
    data: DtoCustomScopeCreate,
  ): Promise<DtoCustomScopeCreate> {
    if (
      !data ||
      typeof data.name !== 'string' ||
      !mcpCustomScopeNamePattern.test(data.name.trim()) ||
      typeof data.description !== 'string' ||
      data.description.length > 1000 ||
      Object.keys(data).some(key => !['name', 'description', 'tools'].includes(key))
    ) {
      throw new OAuthError('invalid_request');
    }
    if (!Array.isArray(data.tools)) throw new OAuthError('invalid_scope');
    const tools = normalizeToolIdentities(data.tools);
    const available = new Set((await this.catalog(resource)).map(toolIdentityKey));
    if (tools.some(tool => !available.has(toolIdentityKey(tool))))
      throw new OAuthError('invalid_scope');
    return { name: data.name.trim(), description: data.description, tools };
  }

  private async ensureUniqueName(
    userId: TableIdentity,
    resource: string,
    name: string,
    id?: TableIdentity,
  ): Promise<void> {
    const scope = `mcp:custom:${name}` as const;
    const rows = await this.scope.model.customScope
      .builderSelect()
      .where({ userId, resource })
      .where(builder => builder.where({ name }).orWhere({ scope }));
    if (
      rows.some(row => String(row.id) !== String(id) && (row.name === name || row.scope === scope))
    ) {
      throw new OAuthError('invalid_request');
    }
  }

  private async withOwnerLock<T>(
    userId: TableIdentity,
    resource: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    return await this.scope.redlock.lock(
      `customScope.owner.${encodeURIComponent(JSON.stringify([String(userId), resource]))}`,
      operation,
    );
  }

  private async revokeLinked(
    userId: TableIdentity,
    resource: string,
    scope: TypeMcpScope,
  ): Promise<void> {
    const rows = await this.scope.model.authorization
      .builderSelect()
      .where({ userId, resource })
      .where(builder => builder.where({ scope }).orWhere({ requestedScope: scope }))
      .whereIn('state', ['codeReady', 'tokenActive']);
    const ids = rows
      .filter(row => row.scope === scope || row.requestedScope === scope)
      .map(row => row.id);
    if (!ids.length) return;
    await this.scope.model.authorization
      .builderSelect()
      .where({ userId, resource })
      .whereIn('id', ids)
      .whereIn('state', ['codeReady', 'tokenActive'])
      .update({ state: 'revoked', codeDigest: '', tokenDigest: '', expiresAt: Date.now() });
    this.$logger.debug('mcp.custom_scope.linked_grants_revoked');
  }
}

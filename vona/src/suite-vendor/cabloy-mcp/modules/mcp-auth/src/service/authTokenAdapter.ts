import type { IJwtCreateOptions, IPayloadData } from 'vona-module-a-jwt';
import type {
  IAuthTokenAdapter,
  IAuthTokenOptions,
  IAuthTokenVerifyOptions,
  IPassport,
  IUser,
} from 'vona-module-a-user';

import { randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { EntityAuthorization } from '../entity/authorization.tsx';
import type {
  IMcpAuthTokenInput,
  IMcpLegacyTokenPayload,
  IMcpOAuthTokenPayload,
  IMcpTokenPayload,
} from '../lib/authToken.ts';
import type { IMcpToolIdentity, TypeMcpScope } from '../types/index.ts';

import { isMcpCustomScope } from '../lib/authorization.ts';
import {
  equalDigest,
  getMcpAuthConfig,
  isMcpScope,
  OAuthError,
  sha256,
} from '../lib/authorization.ts';
import { normalizeToolIdentities } from './customScope.ts';

@Service()
export class ServiceAuthTokenAdapter extends BeanBase implements IAuthTokenAdapter {
  readonly options: Readonly<IAuthTokenOptions> = { stateless: false, strategy: 'reissue' };

  async deserialize(data: IPayloadData): Promise<IPassport> {
    const payload = this.payload(data);
    return await this.scope.service.authorization.loadMcpPassport(
      payload.userId,
      payload.mcp.resource,
      payload.authId,
      'invalid_grant',
      400,
    );
  }

  getJwtOptions(data: IPayloadData): IJwtCreateOptions {
    const payload = this.oauthPayload(data);
    if (payload.mcp.generation < 1) throw new OAuthError('invalid_grant');
    const config = this.scope.service.authorization.configForResource(payload.mcp.resource);
    const refreshExpiresIn = payload.mcp.refreshEnabled
      ? Math.floor((payload.mcp.refreshExpiresAt - Date.now()) / 1000)
      : config.refreshTokenTtl;
    if (refreshExpiresIn < 1) throw new OAuthError('invalid_grant');
    return {
      accessClient: 'mcpAccess',
      refreshClient: 'mcpRefresh',
      accessExpiresIn: config.tokenTtl,
      refreshExpiresIn,
    };
  }

  async create(data: IPayloadData, _ttl?: number, input?: unknown): Promise<IMcpTokenPayload> {
    this.ensureAutocommit();
    const payload = this.oauthPayload(data);
    const binding = this.input(payload, input, true);
    if (payload.mcp.generation > 0) return await this.rotate(payload, binding);
    const row = await this.row(payload);
    await this.scope.service.authorization.loadMcpPassport(
      row.userId,
      row.resource,
      row.authId,
      'invalid_grant',
      400,
    );
    const now = Date.now();
    if (
      row.state !== 'codeReady' ||
      Number(row.codeExpiresAt) <= now ||
      payload.mcp.generation !== 0 ||
      !equalDigest(payload.token, row.codeDigest)
    ) {
      throw new OAuthError('invalid_grant');
    }
    const config = getMcpAuthConfig(this.app);
    const refreshExpiresAt = row.refreshEnabled ? now + config.refreshTokenTtl * 1000 : 0;
    const next = this.next(payload, 1, refreshExpiresAt);
    const tokenExpiresAt = now + config.tokenTtl * 1000;
    const activate = async () =>
      await this.scope.model.authorization
        .builderSelect()
        .where(this.scope.service.authorization.bindings(row))
        .where({
          state: 'codeReady',
          codeDigest: row.codeDigest,
          userId: row.userId!,
          authId: row.authId!,
          refreshEnabled: row.refreshEnabled,
        })
        .where('codeExpiresAt', '>', now)
        .update({
          state: 'tokenActive',
          codeDigest: '',
          tokenVersion: 1,
          tokenDigest: sha256(next.token),
          tokenExpiresAt,
          refreshGeneration: 1,
          refreshExpiresAt,
          expiresAt: Math.max(tokenExpiresAt, refreshExpiresAt),
        });
    const count = isMcpCustomScope(row.scope)
      ? await this.scope.service.customScope.withDefinitions(
          row.userId!,
          row.resource,
          [row.scope],
          async () => {
            await this.scope.service.authorization.validateBindings(row, config);
            return await activate();
          },
        )
      : await activate();
    if (count !== 1) throw new OAuthError('invalid_grant');
    return next;
  }

  async retrieve(data: IPayloadData): Promise<IPayloadData | undefined> {
    const payload = this.payload(data);
    return (await this.verify(data, {
      operation: 'check',
      clientName: 'mcpAccess',
      input: { resource: payload.mcp.resource },
    }))
      ? data
      : undefined;
  }

  async verify(data: IPayloadData, options?: IAuthTokenVerifyOptions): Promise<boolean> {
    const payload = this.payload(data);
    const refresh = options?.operation === 'refresh';
    if (refresh && payload.mcp.kind === 'personal') return false;
    if (options?.clientName !== (refresh ? 'mcpRefresh' : 'mcpAccess')) return false;
    this.input(payload, options.input, refresh);
    const row = await this.row(payload, refresh);
    const now = Date.now();
    if (
      row.state !== 'tokenActive' ||
      row.tokenVersion !== 1 ||
      payload.mcp.generation < 1 ||
      !/^[\w-]{43}$/.test(payload.token)
    ) {
      return false;
    }
    await this.scope.service.authorization.loadMcpPassport(
      row.userId,
      row.resource,
      row.authId,
      'invalid_grant',
      400,
    );
    if (refresh) {
      return (
        Boolean(row.refreshEnabled) &&
        Number(row.refreshExpiresAt) > now &&
        payload.mcp.generation <= row.refreshGeneration &&
        (payload.mcp.generation < row.refreshGeneration ||
          equalDigest(sha256(payload.token), row.tokenDigest))
      );
    }
    return (
      Number(row.tokenExpiresAt) > now &&
      payload.mcp.generation === row.refreshGeneration &&
      equalDigest(sha256(payload.token), row.tokenDigest)
    );
  }

  async refresh(): Promise<void> {
    // MCP uses reissue/create for atomic rotation, never an in-place TTL extension.
    throw new OAuthError('invalid_grant');
  }

  private async rotate(
    payload: IMcpOAuthTokenPayload,
    input: IMcpAuthTokenInput,
  ): Promise<IMcpTokenPayload> {
    this.input(payload, input, true);
    const row = await this.row(payload, true);
    const now = Date.now();
    if (row.state !== 'tokenActive' || !row.refreshEnabled || Number(row.refreshExpiresAt) <= now) {
      throw new OAuthError('invalid_grant');
    }
    if (payload.mcp.generation < row.refreshGeneration) {
      await this.revokeFamily(row);
      throw new OAuthError('invalid_grant');
    }
    if (
      payload.mcp.generation !== row.refreshGeneration ||
      !equalDigest(sha256(payload.token), row.tokenDigest)
    ) {
      throw new OAuthError('invalid_grant');
    }
    const passport = await this.scope.service.authorization.loadMcpPassport(
      row.userId,
      row.resource,
      row.authId,
      'invalid_grant',
      400,
    );
    const nextScope = input.scope ?? row.scope;
    if (!isMcpScope(nextScope) || !isMcpScope(row.scope)) throw new OAuthError('invalid_scope');
    let scopeTools: IMcpToolIdentity[] = isMcpCustomScope(row.scope)
      ? normalizeToolIdentities(row.scopeTools)
      : [];
    let scopeReadOnly = Boolean(row.scopeReadOnly) || row.scope === 'mcp:read';
    const link = async (update: () => Promise<number>) => {
      await this.scope.service.authorization.validateBindings(row, getMcpAuthConfig(this.app));
      // Existing custom inheritance needs no visibility re-consent; new selections do.
      if (nextScope !== row.scope) {
        await this.bean.passport.setCurrent(passport);
        const catalog = await this.scope.service.customScope.catalog(row.resource);
        if (
          !(await this.scope.service.authorization.scopeContains(
            row.userId!,
            row.resource,
            row.scope as TypeMcpScope,
            nextScope,
            catalog,
          ))
        ) {
          throw new OAuthError('invalid_scope');
        }
        const client = await this.scope.service.authorization.validateBindings(
          row,
          getMcpAuthConfig(this.app),
        );
        if (
          !(await this.scope.service.authorization.scopeContains(
            row.userId!,
            row.resource,
            client.scope,
            nextScope,
            catalog,
          ))
        ) {
          throw new OAuthError('invalid_scope');
        }
        scopeTools = isMcpCustomScope(nextScope)
          ? normalizeToolIdentities(
              (await this.scope.service.customScope.resolve(row.userId!, row.resource, nextScope))
                .tools,
            )
          : [];
        scopeReadOnly ||= client.scope === 'mcp:read';
        const available = new Map(
          catalog.map(tool => [JSON.stringify([tool.name, tool.controller, tool.action]), tool]),
        );
        if (
          scopeTools.some(tool => {
            const current = available.get(
              JSON.stringify([tool.name, tool.controller, tool.action]),
            );
            return !current || (scopeReadOnly && !current.readOnly);
          })
        ) {
          throw new OAuthError('invalid_scope');
        }
      }
      return await update();
    };
    const config = getMcpAuthConfig(this.app);
    const refreshExpiresAt = now + config.refreshTokenTtl * 1000;
    const next = this.next(payload, row.refreshGeneration + 1, refreshExpiresAt);
    next.mcp.scope = nextScope;
    const tokenExpiresAt = now + config.tokenTtl * 1000;
    const update = async () =>
      await this.scope.model.authorization
        .builderSelect<
          Omit<EntityAuthorization, 'scopeTools' | 'scopeReadOnly'> & {
            scopeTools: string;
            scopeReadOnly: number;
          }
        >()
        .where(this.scope.service.authorization.bindings(row))
        .where({
          state: 'tokenActive',
          tokenVersion: 1,
          tokenDigest: row.tokenDigest,
          refreshEnabled: true,
          refreshGeneration: row.refreshGeneration,
          refreshExpiresAt: row.refreshExpiresAt,
          userId: row.userId!,
          authId: row.authId!,
        })
        .where('refreshExpiresAt', '>', now)
        .update({
          tokenDigest: sha256(next.token),
          refreshGeneration: next.mcp.generation,
          refreshExpiresAt,
          tokenExpiresAt,
          scope: nextScope,
          scopeTools: JSON.stringify(scopeTools),
          scopeReadOnly: Number(scopeReadOnly),
          expiresAt: Math.max(tokenExpiresAt, refreshExpiresAt),
        });
    const count =
      isMcpCustomScope(nextScope) || isMcpCustomScope(row.scope)
        ? await this.scope.service.customScope.withDefinitions(
            row.userId!,
            row.resource,
            [nextScope, row.scope as TypeMcpScope],
            () => link(update),
          )
        : await link(update);
    if (count !== 1) {
      // Recheck request binding before a concurrent loser can revoke the winning family.
      this.input(payload, input, true);
      const current = await this.row(payload, true);
      if (current.state === 'tokenActive' && current.refreshGeneration > payload.mcp.generation) {
        await this.revokeFamily(current);
      }
      throw new OAuthError('invalid_grant');
    }
    return next;
  }

  async remove(data: IPayloadData): Promise<void> {
    this.ensureAutocommit();
    if ((data as IMcpLegacyTokenPayload)?.mcp?.version === 0) {
      await this.removeLegacy(data as IMcpLegacyTokenPayload);
      return;
    }
    const payload = this.payload(data);
    const row = await this.row(payload, true);
    if (payload.mcp.kind === 'personal') {
      await this.scope.service.authorization.loadPassport(
        payload.userId,
        payload.authId,
        'invalid_grant',
        400,
      );
      if (
        row.state !== 'tokenActive' ||
        Number(row.tokenExpiresAt) <= Date.now() ||
        !equalDigest(sha256(payload.token), row.tokenDigest)
      ) {
        throw new OAuthError('invalid_grant');
      }
    }
    await this.revokeFamily(row);
  }

  private async removeLegacy(payload: IMcpLegacyTokenPayload): Promise<void> {
    const mcp = payload.mcp;
    if (
      typeof mcp.grantId !== 'string' ||
      !/^[1-9]\d*$/.test(mcp.grantId) ||
      typeof mcp.clientId !== 'string' ||
      typeof mcp.issuer !== 'string' ||
      typeof mcp.resource !== 'string' ||
      mcp.instanceName !== this.ctx.instanceName ||
      !isMcpScope(mcp.scope) ||
      !['string', 'number', 'bigint'].includes(typeof payload.userId) ||
      !['string', 'number', 'bigint'].includes(typeof payload.authId) ||
      typeof payload.token !== 'string' ||
      !/^[a-f0-9]{64}$/.test(payload.token)
    ) {
      throw new OAuthError('invalid_grant');
    }
    this.scope.service.authorization.configForResource(mcp.resource);
    await this.scope.model.authorization
      .builderSelect()
      .where({
        id: mcp.grantId,
        issuanceKind: 'oauth',
        oauthClientId: mcp.clientId,
        issuer: mcp.issuer,
        resource: mcp.resource,
        scope: mcp.scope,
        userId: payload.userId,
        authId: payload.authId,
        tokenDigest: payload.token,
        state: 'tokenActive',
        tokenVersion: 0,
      })
      .update({ state: 'revoked', tokenDigest: '', expiresAt: Date.now() });
  }

  async removeAll(user: IUser): Promise<void> {
    this.ensureAutocommit();
    await this.scope.model.authorization
      .builderSelect()
      .where({ userId: user.id, state: 'tokenActive', tokenVersion: 1 })
      .update({ state: 'revoked', tokenDigest: '', expiresAt: Date.now() });
  }

  payload(data: IPayloadData): IMcpTokenPayload {
    const payload = data as IMcpTokenPayload;
    const mcp = payload?.mcp;
    if (
      !mcp ||
      mcp.version !== 1 ||
      typeof mcp.grantId !== 'string' ||
      !/^[1-9]\d*$/.test(mcp.grantId) ||
      (mcp.kind !== undefined && mcp.kind !== 'oauth' && mcp.kind !== 'personal') ||
      (mcp.kind === 'personal'
        ? Object.prototype.hasOwnProperty.call(mcp, 'clientId') ||
          mcp.generation !== 1 ||
          mcp.refreshEnabled !== false ||
          mcp.refreshExpiresAt !== 0 ||
          !Number.isSafeInteger(mcp.tokenExpiresAt) ||
          mcp.tokenExpiresAt <= 0
        : typeof mcp.clientId !== 'string' || !mcp.clientId) ||
      typeof mcp.issuer !== 'string' ||
      typeof mcp.resource !== 'string' ||
      mcp.instanceName !== this.ctx.instanceName ||
      !isMcpScope(mcp.scope) ||
      !Number.isSafeInteger(mcp.generation) ||
      mcp.generation < 0 ||
      typeof mcp.refreshEnabled !== 'boolean' ||
      !Number.isSafeInteger(mcp.refreshExpiresAt) ||
      mcp.refreshExpiresAt < 0 ||
      !['string', 'number', 'bigint'].includes(typeof payload.userId) ||
      !['string', 'number', 'bigint'].includes(typeof payload.authId) ||
      typeof payload.token !== 'string' ||
      !/^[\w-]{43}$|^[a-f0-9]{64}$/.test(payload.token)
    ) {
      throw new OAuthError('invalid_grant');
    }
    return payload;
  }

  private oauthPayload(data: IPayloadData): IMcpOAuthTokenPayload {
    const payload = this.payload(data);
    if (payload.mcp.kind === 'personal') throw new OAuthError('invalid_grant');
    return payload as IMcpOAuthTokenPayload;
  }

  private input(
    payload: IMcpTokenPayload,
    value: unknown,
    requireClient: boolean,
  ): IMcpAuthTokenInput {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new OAuthError('invalid_grant');
    }
    const input = value as IMcpAuthTokenInput;
    if (
      typeof input.resource !== 'string' ||
      input.resource !== payload.mcp.resource ||
      (requireClient && (typeof input.clientId !== 'string' || !input.clientId)) ||
      (input.clientId !== undefined && input.clientId !== payload.mcp.clientId)
    ) {
      throw new OAuthError('invalid_grant');
    }
    if (input.scope !== undefined && !isMcpScope(input.scope)) {
      throw new OAuthError('invalid_scope');
    }
    this.scope.service.authorization.configForResource(input.resource);
    return { resource: input.resource, clientId: input.clientId, scope: input.scope };
  }

  private async row(payload: IMcpTokenPayload, historical = false): Promise<EntityAuthorization> {
    const mcp = payload.mcp;
    const row = await this.scope.model.authorization.get(
      { id: mcp.grantId },
      { cache: { enable: false } },
    );
    if (
      !row ||
      row.issuanceKind !== (mcp.kind ?? 'oauth') ||
      (mcp.kind === 'personal'
        ? row.clientId !== null ||
          row.oauthClientId !== null ||
          Number(row.tokenExpiresAt) !== mcp.tokenExpiresAt
        : row.oauthClientId !== mcp.clientId) ||
      row.issuer !== mcp.issuer ||
      row.resource !== mcp.resource ||
      String(row.userId) !== String(payload.userId) ||
      String(row.authId) !== String(payload.authId) ||
      Boolean(row.refreshEnabled) !== mcp.refreshEnabled ||
      (mcp.generation > 0 &&
        !(historical && mcp.generation < row.refreshGeneration) &&
        Number(row.refreshExpiresAt) !== mcp.refreshExpiresAt) ||
      !(historical && mcp.generation < row.refreshGeneration
        ? isMcpScope(row.scope)
        : row.scope === mcp.scope)
    ) {
      throw new OAuthError('invalid_grant');
    }
    await this.scope.service.authorization.validateGrantBindings(
      row,
      this.scope.service.authorization.configForResource(mcp.resource),
    );
    return row;
  }

  private next(
    payload: IMcpOAuthTokenPayload,
    generation: number,
    refreshExpiresAt: number,
  ): IMcpOAuthTokenPayload {
    return {
      ...payload,
      token: randomBytes(32).toString('base64url'),
      mcp: { ...payload.mcp, generation, refreshExpiresAt },
    };
  }

  private async revokeFamily(row: EntityAuthorization): Promise<void> {
    await this.scope.model.authorization
      .builderSelect()
      .where({
        id: row.id,
        issuanceKind: row.issuanceKind,
        clientId: row.clientId,
        oauthClientId: row.oauthClientId,
        resource: row.resource,
        issuer: row.issuer,
        userId: row.userId!,
        authId: row.authId!,
        state: 'tokenActive',
        tokenVersion: 1,
      })
      .update({ state: 'revoked', tokenDigest: '', expiresAt: Date.now() });
  }

  private ensureAutocommit(): void {
    if (this.scope.model.authorization.db.inTransaction) throw new OAuthError('server_error', 503);
  }
}

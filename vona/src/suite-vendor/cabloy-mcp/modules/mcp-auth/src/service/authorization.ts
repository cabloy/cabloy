import type { TableIdentity } from 'table-identity';
import type { BeanSsrSiteBase, IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';
import type { IPassport } from 'vona-module-a-user';

import { createHash, randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { roleSiteIdAll } from 'vona-module-a-openapiutils';

import type { DtoAuthorizationSummary } from '../dto/authorizationSummary.ts';
import type { DtoMcpScopeOption } from '../dto/mcpTool.ts';
import type { EntityAuthorization } from '../entity/authorization.tsx';
import type {
  IMcpLegacyTokenPayload,
  IMcpTokenPayload,
  TypeMcpRefreshEvent,
} from '../lib/authToken.ts';
import type {
  IMcpAuthConfig,
  IMcpAuthResource,
  IMcpAuthResolvedClient,
  IMcpResolvedToolAccess,
  IMcpToolCatalogItem,
  TypeMcpScope,
} from '../types/index.ts';

import {
  equalDigest,
  getMcpAuthConfig,
  getMcpIssuer,
  isMcpScope,
  isMcpBuiltinScope,
  isMcpCustomScope,
  isCanonicalMcpCustomScope,
  mcpScopeIncludes,
  parseMcpRequestedScope,
  resolveMcpResourceUrl,
  OAuthError,
  requiredOAuthParameter,
  sha256,
  validateOAuthParameters,
} from '../lib/authorization.ts';
import { mcpRefreshEvidence } from '../lib/authToken.ts';
import { normalizeToolIdentities, sameTools, toolIdentityKey } from './customScope.ts';

const opaquePattern = /^[\w-]{43}$/;

@Service()
export class ServiceAuthorization extends BeanBase {
  async authorize(params: URLSearchParams, resource: IMcpAuthResource): Promise<string> {
    const config = this.configForResource(resource.resource);
    if (this.ctx.instanceName !== resource.instanceName) throw new OAuthError('invalid_target');
    this.ensureAutocommit();
    validateOAuthParameters(params, [
      'response_type',
      'client_id',
      'redirect_uri',
      'resource',
      'scope',
      'state',
      'code_challenge',
      'code_challenge_method',
    ]);
    if (params.get('response_type') !== 'code') throw new OAuthError('unsupported_response_type');
    if (params.get('resource') !== resource.resource) throw new OAuthError('invalid_target');
    const client = await this.resolveClient(params.get('client_id') ?? '', resource.resource);
    const redirectUri = requiredOAuthParameter(params, 'redirect_uri');
    if (!client || !client.redirectUris.includes(redirectUri)) {
      throw new OAuthError('invalid_request');
    }
    const scope = params.has('scope') ? parseMcpRequestedScope(params.get('scope')) : client.scope;
    if (!scope || (isMcpBuiltinScope(scope) && !mcpScopeIncludes(client.scope, scope))) {
      throw new OAuthError('invalid_scope');
    }
    const challenge = requiredOAuthParameter(params, 'code_challenge');
    if (params.get('code_challenge_method') !== 'S256' || !opaquePattern.test(challenge)) {
      throw new OAuthError('invalid_request');
    }
    await this.cleanupExpired();
    const request = randomBytes(32).toString('base64url');
    const deadline = Date.now() + config.pendingTtl * 1000;
    await this.scope.model.authorization.insert({
      issuanceKind: 'oauth',
      name: '',
      requestDigest: sha256(request),
      clientId: client.id,
      oauthClientId: client.clientId,
      issuer: getMcpIssuer(this.app),
      resource: resource.resource,
      redirectUri,
      scope,
      requestedScope: scope,
      scopeTools: [],
      scopeReadOnly: false,
      oauthState: params.get('state') ?? '',
      codeChallenge: challenge,
      state: 'pending',
      pendingExpiresAt: deadline,
      expiresAt: deadline,
      codeDigest: '',
      codeExpiresAt: 0,
      tokenDigest: '',
      tokenExpiresAt: 0,
      tokenVersion: 0,
      refreshEnabled: client.grantTypes.length === 2,
      refreshGeneration: 0,
      refreshExpiresAt: 0,
    });
    return request;
  }

  async summary(request: string): Promise<DtoAuthorizationSummary> {
    const passport = await this.currentPassport();
    const row = await this.pending(request);
    this.checkMcpAccess(passport, row.resource, 'access_denied', 403);
    const config = this.configForResource(row.resource);
    const client = await this.validateBindings(row, config);
    const options = await this.scopeOptions(row, client, passport.user!.id);
    const resource = resolveMcpResourceUrl(this.app, row.resource);
    const sites = this.app
      .scope('a-ssr')
      .service.ssr.getSitesEnabled(resource.instanceName as never, new URL(resource.resource).host);
    const site = sites.find(
      site => (site.beanOptions.options as IDecoratorSsrSiteOptions).siteId === resource.ssrSiteId,
    );
    if (!site) throw new OAuthError('invalid_target');
    const siteInstance = this.bean._getBean<BeanSsrSiteBase>(site.beanOptions.beanFullName as any);
    const scopesUrl = new URL(
      siteInstance.getPagePath('/cabloy/mcp/scopes' as any),
      resource.resource,
    ).href;
    return {
      clientName: client.name,
      resource: row.resource,
      ssrSiteId: resource.ssrSiteId,
      scopesUrl,
      scope: row.requestedScope || row.scope,
      options,
      expiresAt: Number(row.pendingExpiresAt),
    };
  }

  async decide(
    request: string,
    allow: boolean,
    selectedScope?: string,
  ): Promise<{ redirectUrl: string }> {
    this.ensureAutocommit();
    if (typeof allow !== 'boolean') throw new OAuthError('invalid_request');
    const passport = await this.currentPassport();
    const row = await this.pending(request);
    if (allow) this.checkMcpAccess(passport, row.resource, 'access_denied', 403);
    const config = this.configForResource(row.resource);
    const client = await this.validateBindings(row, config);
    const requested = row.requestedScope || row.scope;
    const selected = selectedScope ?? requested;
    if (allow && !isMcpScope(selected)) throw new OAuthError('invalid_scope');
    const now = Date.now();
    const code = allow ? randomBytes(32).toString('base64url') : '';
    const expiresAt = allow ? now + config.codeTtl * 1000 : now;
    const link = async () => {
      const option = allow
        ? (await this.scopeOptions(row, client, passport.user!.id)).find(
            option => option.scope === selected,
          )
        : undefined;
      if (allow && !option?.allowed) throw new OAuthError('invalid_scope');
      const count = await this.scope.model.authorization
        .builderSelect<
          Omit<EntityAuthorization, 'scopeTools' | 'scopeReadOnly'> & {
            scopeTools: string;
            scopeReadOnly: number;
          }
        >()
        .where(this.bindings(row))
        .where({ state: 'pending', requestDigest: sha256(request) })
        .where('pendingExpiresAt', '>', Date.now())
        .update({
          state: allow ? 'codeReady' : 'denied',
          userId: passport.user!.id,
          authId: passport.auth!.id,
          scope: allow ? selected : row.scope,
          scopeTools: JSON.stringify(
            allow && isMcpCustomScope(selected)
              ? option!.tools.map(({ name, controller, action }) => ({ name, controller, action }))
              : [],
          ),
          scopeReadOnly: Number(allow && (requested === 'mcp:read' || client.scope === 'mcp:read')),
          codeDigest: allow ? sha256(code) : '',
          codeExpiresAt: allow ? expiresAt : 0,
          expiresAt,
        });
      this.ensureWinner(count);
    };
    // Commit the definition lock + link before the authorization code can leave this method.
    if (allow && (isMcpCustomScope(selected) || isMcpCustomScope(requested))) {
      await this.scope.service.customScope.withDefinitions(
        passport.user!.id,
        row.resource,
        [selected as TypeMcpScope, requested as TypeMcpScope],
        link,
      );
    } else {
      await link();
    }
    const redirect = new URL(row.redirectUri);
    if (allow) redirect.searchParams.set('code', code);
    else redirect.searchParams.set('error', 'access_denied');
    if (row.oauthState) redirect.searchParams.set('state', row.oauthState);
    redirect.searchParams.set('iss', getMcpIssuer(this.app));
    return { redirectUrl: redirect.href };
  }

  async exchange(
    params: URLSearchParams,
    authorization: string | undefined,
  ): Promise<{
    access_token: string;
    refresh_token?: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: string;
  }> {
    this.ensureAutocommit();
    const refresh = params.get('grant_type') === 'refresh_token';
    if (!refresh && params.get('grant_type') !== 'authorization_code') {
      throw new OAuthError('unsupported_grant_type');
    }
    validateOAuthParameters(
      params,
      refresh
        ? ['grant_type', 'client_id', 'refresh_token', 'resource', 'scope']
        : ['grant_type', 'client_id', 'code', 'redirect_uri', 'resource', 'code_verifier'],
    );
    const resource = requiredOAuthParameter(params, 'resource');
    const config = this.configForResource(resource);
    const client = await this.authenticateClient(config, params, authorization, resource);
    if (refresh) {
      if (client.grantTypes.length !== 2) throw new OAuthError('unauthorized_client');
      const scope = params.has('scope') ? parseMcpRequestedScope(params.get('scope')) : undefined;
      if (
        params.has('scope') &&
        (!scope || (isMcpBuiltinScope(scope) && !mcpScopeIncludes(client.scope, scope)))
      ) {
        throw new OAuthError('invalid_scope');
      }
      try {
        const jwt = await this.bean.passport.refreshAuthToken(
          requiredOAuthParameter(params, 'refresh_token'),
          'mcpRefresh',
          { resource, clientId: client.clientId, scope },
        );
        const payload = this.scope.service.authTokenAdapter.payload(
          this.ctx.state.passportPayloadData!,
        );
        this.recordRefreshEvidence('mcp.oauth.refresh_succeeded');
        return {
          access_token: jwt.accessToken,
          refresh_token: jwt.refreshToken,
          token_type: 'Bearer',
          expires_in: jwt.expiresIn,
          scope: payload.mcp.scope,
        };
      } catch (error) {
        if (error instanceof OAuthError) throw error;
        if (
          error instanceof Error &&
          (error.code === 401 ||
            error.code === 403 ||
            ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error.name))
        ) {
          throw new OAuthError('invalid_grant');
        }
        throw new OAuthError('server_error', 503);
      }
    }
    const code = requiredOAuthParameter(params, 'code');
    const verifier = requiredOAuthParameter(params, 'code_verifier');
    const redirectUri = requiredOAuthParameter(params, 'redirect_uri');
    if (!opaquePattern.test(code) || !/^[\w.~\x2D]{43,128}$/.test(verifier)) {
      throw new OAuthError('invalid_grant');
    }
    if (!client.resources.includes(resource) || !client.redirectUris.includes(redirectUri)) {
      throw new OAuthError('invalid_grant');
    }
    const codeDigest = sha256(code);
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    const row = await this.scope.model.authorization
      .builderSelect()
      .where({
        issuanceKind: 'oauth',
        codeDigest,
        clientId: client.id,
        oauthClientId: client.clientId,
        resource,
        redirectUri,
        codeChallenge: challenge,
        state: 'codeReady',
      })
      .where('codeExpiresAt', '>', Date.now())
      .first();
    if (!row) throw new OAuthError('invalid_grant');
    await this.validateBindings(row, config);
    const passport = await this.loadMcpPassport(
      row.userId,
      row.resource,
      row.authId,
      'invalid_grant',
      400,
    );
    const payload: IMcpTokenPayload = {
      userId: row.userId!,
      authId: row.authId!,
      token: codeDigest,
      mcp: {
        version: 1,
        kind: 'oauth',
        grantId: String(row.id),
        clientId: row.oauthClientId!,
        issuer: row.issuer,
        resource,
        instanceName: this.ctx.instanceName!,
        scope: row.scope as TypeMcpScope,
        generation: 0,
        refreshEnabled: Boolean(row.refreshEnabled),
        refreshExpiresAt: 0,
      },
    };
    const jwt = await this.bean.passport.createAuthToken(passport, payload, 'mcpAccess', {
      resource,
      clientId: client.clientId,
    });
    return {
      access_token: jwt.accessToken,
      ...(row.refreshEnabled ? { refresh_token: jwt.refreshToken } : {}),
      token_type: 'Bearer',
      expires_in: jwt.expiresIn,
      scope: row.scope,
    };
  }

  async lookup(token: string, resource: string): Promise<IPassport> {
    return (await this.lookupContext(token, resource)).passport;
  }

  async lookupContext(
    token: string,
    resource: string,
  ): Promise<{ passport: IPassport; scope: TypeMcpScope }> {
    const config = this.configForResource(resource);
    if (!opaquePattern.test(token)) {
      try {
        const checked = await this.bean.passport.checkAuthToken(token, 'mcpAccess', {
          input: { resource },
        });
        if (!checked) throw new OAuthError('invalid_token', 401);
        const payload = this.scope.service.authTokenAdapter.payload(checked.payloadData);
        return { passport: checked.passport, scope: payload.mcp.scope };
      } catch {
        throw new OAuthError('invalid_token', 401);
      }
    }
    const row = await this.scope.model.authorization
      .builderSelect()
      .where({
        issuanceKind: 'oauth',
        tokenDigest: sha256(token),
        resource,
        state: 'tokenActive',
        tokenVersion: 0,
      })
      .where('tokenExpiresAt', '>', Date.now())
      .first();
    if (!row) throw new OAuthError('invalid_token', 401);
    if (!isMcpScope(row.scope)) throw new OAuthError('insufficient_scope', 403);
    await this.validateBindings(row, config, 'invalid_token', 401);
    const passport = await this.loadMcpPassport(
      row.userId,
      row.resource,
      row.authId,
      'invalid_token',
      401,
    );
    const payload: IMcpLegacyTokenPayload = {
      userId: row.userId!,
      authId: row.authId!,
      token: row.tokenDigest,
      mcp: {
        version: 0,
        grantId: String(row.id),
        clientId: row.oauthClientId!,
        issuer: row.issuer,
        resource: row.resource,
        instanceName: this.ctx.instanceName!,
        scope: row.scope,
      },
    };
    await this.bean.passport.setCurrent(passport);
    this.ctx.state.passportPayloadData = payload;
    this.ctx.state.passportAuthTokenClient = 'mcpAccess';
    return { passport, scope: row.scope };
  }

  /** Best-effort diagnostics from already admitted state, never an auth decision. */
  recordRefreshEvidence(event: TypeMcpRefreshEvent): void {
    try {
      if (this.ctx.state.passportAuthTokenClient !== 'mcpAccess') return;
      const payload = this.ctx.state.passportPayloadData as
        | IMcpTokenPayload
        | IMcpLegacyTokenPayload
        | undefined;
      if (!payload) return;
      const evidence = mcpRefreshEvidence(event, payload);
      if (evidence) this.$logger.debug(evidence.event, evidence);
    } catch {
      // Observation must not change issuance or admission, or log unsafe errors.
    }
  }

  async revoke(token: string): Promise<void> {
    this.ensureAutocommit();
    if (!opaquePattern.test(token)) {
      for (const client of ['mcpAccess', 'mcpRefresh'] as const) {
        let data;
        try {
          data = await this.bean.jwt.get(client).verify(token);
        } catch {
          continue;
        }
        if (data) {
          const payload = this.scope.service.authTokenAdapter.payload(data);
          if (payload.mcp.kind === 'personal') return;
          await this.scope.service.authTokenAdapter.remove(data);
        }
        return;
      }
      return;
    }
    const row = await this.scope.model.authorization
      .builderSelect()
      .where({ issuanceKind: 'oauth', tokenDigest: sha256(token), state: 'tokenActive' })
      .first();
    if (!row) return;
    this.configForResource(row.resource);
    await this.scope.model.authorization
      .builderSelect()
      .where(this.bindings(row))
      .where({ issuanceKind: 'oauth', tokenDigest: sha256(token), state: 'tokenActive' })
      .update({ state: 'revoked', tokenDigest: '', expiresAt: Date.now() });
  }

  /** Bounded physical cleanup in the current instance, never a cross-tenant sweep. */
  async cleanupExpired(): Promise<void> {
    this.ensureAutocommit();
    const now = Date.now();
    const rows = await this.scope.model.authorization
      .builderSelect()
      .where({ issuanceKind: 'oauth' })
      .where('expiresAt', '<=', now)
      .orderBy('id')
      .limit(100)
      .select('id');
    if (rows.length) {
      await this.scope.model.authorization
        .builderSelect()
        .whereIn(
          'id',
          rows.map(row => row.id),
        )
        .where({ issuanceKind: 'oauth' })
        .where('expiresAt', '<=', now)
        .delete();
    }
  }

  configForResource(resource: string): IMcpAuthConfig {
    const config = getMcpAuthConfig(this.app);
    const binding = resolveMcpResourceUrl(this.app, resource);
    if (
      resource !== binding.resource ||
      this.ctx.instanceName !== binding.instanceName ||
      !this.ctx.instance
    ) {
      throw new OAuthError('invalid_target');
    }
    return config;
  }

  async validateBindings(
    row: EntityAuthorization,
    _config: IMcpAuthConfig,
    error = 'invalid_grant',
    status = 400,
  ): Promise<IMcpAuthResolvedClient> {
    if (
      row.issuanceKind !== 'oauth' ||
      typeof row.oauthClientId !== 'string' ||
      row.clientId === null
    ) {
      throw new OAuthError(error, status);
    }
    const client = await this.resolveClient(row.oauthClientId, row.resource);
    if (
      row.issuer !== getMcpIssuer(this.app) ||
      !client ||
      String(client.id) !== String(row.clientId) ||
      !client.redirectUris.includes(row.redirectUri) ||
      !isMcpScope(row.scope) ||
      (isMcpBuiltinScope(row.scope) && !mcpScopeIncludes(client.scope, row.scope)) ||
      (row.refreshEnabled && client.grantTypes.length !== 2)
    ) {
      throw new OAuthError(error, status);
    }
    if (row.state !== 'pending' && isMcpCustomScope(row.scope)) {
      try {
        if (
          row.userId === undefined ||
          !sameTools(
            (await this.scope.service.customScope.resolve(row.userId, row.resource, row.scope))
              .tools,
            row.scopeTools,
          ) ||
          (client.scope === 'mcp:read' && !row.scopeReadOnly)
        ) {
          throw new OAuthError(error, status);
        }
      } catch {
        throw new OAuthError(error, status);
      }
    }
    return client;
  }

  /** Shared admission; only OAuth grants depend on a registered client and redirect. */
  async validateGrantBindings(
    row: EntityAuthorization,
    config: IMcpAuthConfig,
    error = 'invalid_grant',
    status = 400,
  ): Promise<IMcpAuthResolvedClient | undefined> {
    if (row.issuanceKind === 'oauth')
      return await this.validateBindings(row, config, error, status);
    if (
      row.issuanceKind !== 'personal' ||
      row.clientId !== null ||
      row.oauthClientId !== null ||
      row.issuer !== getMcpIssuer(this.app) ||
      !isMcpScope(row.scope) ||
      row.userId === undefined ||
      row.authId === undefined ||
      row.tokenVersion !== 1 ||
      row.refreshGeneration !== 1 ||
      Boolean(row.refreshEnabled) ||
      Number(row.refreshExpiresAt) !== 0 ||
      !Number.isSafeInteger(Number(row.tokenExpiresAt)) ||
      Number(row.tokenExpiresAt) <= 0
    ) {
      throw new OAuthError(error, status);
    }
    if (isMcpCustomScope(row.scope)) {
      try {
        const definition = await this.scope.service.customScope.resolve(
          row.userId,
          row.resource,
          row.scope,
        );
        if (!sameTools(definition.tools, row.scopeTools)) throw new OAuthError(error, status);
      } catch {
        throw new OAuthError(error, status);
      }
    }
    return undefined;
  }

  /** Runtime custom authority is a live owned definition AND the admitted grant's exact snapshot. */
  async resolveToolAccess(
    userId: TableIdentity,
    resource: string,
    scope: TypeMcpScope,
  ): Promise<IMcpResolvedToolAccess> {
    this.configForResource(resource);
    if (!isMcpScope(scope)) throw new OAuthError('invalid_scope');
    if (isMcpBuiltinScope(scope))
      return { scope, tools: undefined, readOnly: scope === 'mcp:read' };
    const definition = await this.scope.service.customScope.resolve(userId, resource, scope);
    let tools = normalizeToolIdentities(definition.tools);
    let readOnly = false;
    if (this.ctx.state.passportAuthTokenClient === 'mcpAccess') {
      const payload = this.ctx.state.passportPayloadData as
        | IMcpTokenPayload
        | IMcpLegacyTokenPayload
        | undefined;
      if (
        !payload ||
        payload.mcp.resource !== resource ||
        payload.mcp.scope !== scope ||
        String(payload.userId) !== String(userId)
      ) {
        throw new OAuthError('invalid_scope');
      }
      const row = await this.scope.model.authorization
        .builderSelect()
        .where({
          id: payload.mcp.grantId,
          userId,
          scope,
          state: 'tokenActive',
          issuanceKind:
            payload.mcp.version === 1 && payload.mcp.kind === 'personal' ? 'personal' : 'oauth',
          oauthClientId: payload.mcp.clientId ?? null,
          authId: payload.authId,
          issuer: payload.mcp.issuer,
          resource: payload.mcp.resource,
        })
        .where('tokenExpiresAt', '>', Date.now())
        .first();
      if (
        !row ||
        !sameTools(row.scopeTools, tools) ||
        (payload.mcp.version === 1 &&
          (row.tokenVersion !== 1 ||
            row.refreshGeneration !== payload.mcp.generation ||
            (payload.mcp.kind === 'personal' &&
              Number(row.tokenExpiresAt) !== payload.mcp.tokenExpiresAt) ||
            !equalDigest(row.tokenDigest, sha256(payload.token))))
      ) {
        throw new OAuthError('invalid_scope');
      }
      await this.validateGrantBindings(row, this.configForResource(row.resource), 'invalid_scope');
      tools = normalizeToolIdentities(row.scopeTools);
      readOnly = Boolean(row.scopeReadOnly);
    }
    return { scope, tools, readOnly };
  }

  async scopeContains(
    userId: TableIdentity,
    resource: string,
    ceiling: TypeMcpScope,
    selected: TypeMcpScope,
    catalog: IMcpToolCatalogItem[],
  ): Promise<boolean> {
    if (ceiling === 'mcp:all') return true;
    if (isMcpBuiltinScope(selected)) return ceiling === selected;
    const tools = normalizeToolIdentities(
      (await this.scope.service.customScope.resolve(userId, resource, selected)).tools,
    );
    if (ceiling === 'mcp:read') {
      const byIdentity = new Map(catalog.map(tool => [toolIdentityKey(tool), tool]));
      return tools.every(tool => byIdentity.get(toolIdentityKey(tool))?.readOnly === true);
    }
    const allowed = new Set(
      normalizeToolIdentities(
        (await this.scope.service.customScope.resolve(userId, resource, ceiling)).tools,
      ).map(toolIdentityKey),
    );
    return tools.every(tool => allowed.has(toolIdentityKey(tool)));
  }

  private async scopeOptions(
    row: EntityAuthorization,
    client: IMcpAuthResolvedClient,
    userId: TableIdentity,
  ): Promise<DtoMcpScopeOption[]> {
    const requested = row.requestedScope || row.scope;
    if (!isMcpScope(requested)) throw new OAuthError('invalid_scope');
    if (isMcpCustomScope(requested))
      await this.scope.service.customScope.resolve(userId, row.resource, requested);
    const catalog = await this.scope.service.customScope.catalog(row.resource);
    const byIdentity = new Map(catalog.map(tool => [toolIdentityKey(tool), tool]));
    const mine = await this.scope.service.customScope.mine(userId, row.resource);
    const candidates = [
      { scope: 'mcp:all' as TypeMcpScope, name: 'mcp:all', description: '', tools: catalog },
      {
        scope: 'mcp:read' as TypeMcpScope,
        name: 'mcp:read',
        description: '',
        tools: catalog.filter(tool => tool.readOnly),
      },
      ...mine.list.filter(isCanonicalMcpCustomScope),
    ];
    const options: DtoMcpScopeOption[] = [];
    for (const candidate of candidates) {
      const tools = candidate.tools.map(tool => {
        const current = byIdentity.get(toolIdentityKey(tool));
        return {
          name: tool.name,
          controller: tool.controller,
          action: tool.action,
          controllerSummary: current?.controllerSummary ?? '',
          summary: current?.summary ?? '',
          description: current?.description ?? '',
          readOnly: current?.readOnly ?? false,
          available: Boolean(current),
        };
      });
      let reason: DtoMcpScopeOption['reason'];
      if (tools.some(tool => !tool.available)) {
        reason = 'tools_unavailable';
      } else if (
        !(await this.scopeContains(
          userId,
          row.resource,
          requested as TypeMcpScope,
          candidate.scope as TypeMcpScope,
          catalog,
        ))
      ) {
        reason = 'outside_requested_scope';
      } else if (
        !(await this.scopeContains(
          userId,
          row.resource,
          client.scope,
          candidate.scope as TypeMcpScope,
          catalog,
        ))
      ) {
        reason = 'outside_client_scope';
      }
      options.push({
        scope: candidate.scope,
        name: candidate.name,
        description: candidate.description,
        tools,
        allowed: reason === undefined,
        ...(reason ? { reason } : {}),
      });
    }
    return options;
  }

  bindings(row: EntityAuthorization) {
    return {
      id: row.id,
      issuanceKind: 'oauth' as const,
      issuer: row.issuer,
      clientId: row.clientId,
      oauthClientId: row.oauthClientId,
      resource: row.resource,
      redirectUri: row.redirectUri,
      scope: row.scope,
      codeChallenge: row.codeChallenge,
      requestDigest: row.requestDigest,
      oauthState: row.oauthState,
    };
  }

  private async pending(request: string): Promise<EntityAuthorization> {
    if (!opaquePattern.test(request)) throw new OAuthError('invalid_request');
    const row = await this.scope.model.authorization
      .builderSelect()
      .where({ issuanceKind: 'oauth', requestDigest: sha256(request), state: 'pending' })
      .where('pendingExpiresAt', '>', Date.now())
      .first();
    if (!row) throw new OAuthError('invalid_request');
    return row;
  }

  private async currentPassport(): Promise<IPassport> {
    if (
      !this.bean.passport.isAuthenticated ||
      !this.bean.passport.isActivated ||
      !this.bean.passport.isAccountActive
    ) {
      throw new OAuthError('access_denied', 401);
    }
    return await this.loadPassport(
      this.bean.passport.currentUser?.id,
      this.bean.passport.currentAuth?.id,
      'access_denied',
      401,
    );
  }

  async loadMcpPassport(
    userId: TableIdentity | undefined,
    resource: string,
    authId: TableIdentity | undefined,
    error: string,
    status: number,
  ): Promise<IPassport> {
    const passport = await this.loadPassport(userId, authId, error, status);
    this.checkMcpAccess(passport, resource, error, status);
    return passport;
  }

  private checkMcpAccess(
    passport: IPassport,
    resource: string,
    error: string,
    status: number,
  ): void {
    this.configForResource(resource);
    const { ssrSiteId } = resolveMcpResourceUrl(this.app, resource);
    // Direct memberships form independent unions for MCP access and target-site admission.
    if (
      !passport.roles?.some(role => role.mcpAccess === true) ||
      !passport.roles.some(
        role =>
          Array.isArray(role.siteIds) &&
          (role.siteIds.includes(ssrSiteId) || role.siteIds.includes(roleSiteIdAll)),
      )
    ) {
      this.$logger.debug('mcp.access.denied');
      throw new OAuthError(error, status);
    }
  }

  // Identity-only loading also serves credential revocation after MCP access is removed.
  async loadPassport(
    userId: TableIdentity | undefined,
    authId: TableIdentity | undefined,
    error: string,
    status: number,
  ): Promise<IPassport> {
    if (userId === undefined || authId === undefined) throw new OAuthError(error, status);
    // Bypass authority caches: account status, auth ownership and memberships are current.
    const users = this.$scope.homeUser.model;
    const user = await users.user.get({ id: userId }, { cache: { enable: false } });
    if (!user || !user.activated || user.accountStatus === 'disabled') {
      throw new OAuthError(error, status);
    }
    const authIdString = String(authId);
    let auth: IPassport['auth'];
    if (authIdString.startsWith('-')) {
      // Preserve only the framework's existing nonproduction system identities.
      const id = Number(authIdString);
      if (
        !Number.isSafeInteger(id) ||
        !((id <= -10000 && !this.app.meta.isProd) || (id === -1 && this.app.meta.isDev))
      ) {
        throw new OAuthError(error, status);
      }
      auth = { id: authId };
    } else {
      auth = await this.$scope.auth.model.auth.get(
        { id: authId, userId },
        {
          cache: { enable: false },
          include: { authProvider: true },
        },
      );
      if (!auth || auth.authProviderId === undefined) throw new OAuthError(error, status);
      const provider = await this.$scope.auth.model.authProvider.get(
        { id: auth.authProviderId },
        {
          cache: { enable: false },
        },
      );
      if (
        !provider ||
        provider.disabled ||
        !this.bean.onion.authProvider.getOnionSliceEnabled(true, provider.providerName)
      ) {
        throw new OAuthError(error, status);
      }
    }
    const memberships = await users.roleUser.builderSelect().where({ userId }).select('roleId');
    const roles = memberships.length
      ? await users.role.select(
          { where: { id: memberships.map(item => item.roleId) } },
          { cache: { enable: false } },
        )
      : [];
    return { user, auth, roles };
  }

  private async authenticateClient(
    _config: IMcpAuthConfig,
    params: URLSearchParams,
    authorization: string | undefined,
    resource: string,
  ): Promise<IMcpAuthResolvedClient> {
    let clientId = params.get('client_id');
    let secret: string | undefined;
    if (authorization !== undefined) {
      if (clientId || !/^Basic [A-Z0-9+/]+={0,2}$/i.test(authorization)) {
        throw new OAuthError('invalid_client', 401);
      }
      const encoded = authorization.slice(6);
      const bytes = Buffer.from(encoded, 'base64');
      if (bytes.toString('base64') !== encoded) throw new OAuthError('invalid_client', 401);
      const value = bytes.toString('utf8');
      const colon = value.indexOf(':');
      if (colon < 1) throw new OAuthError('invalid_client', 401);
      try {
        clientId = decodeURIComponent(value.slice(0, colon).replace(/\+/g, ' '));
        secret = decodeURIComponent(value.slice(colon + 1).replace(/\+/g, ' '));
      } catch {
        throw new OAuthError('invalid_client', 401);
      }
    }
    const client = await this.resolveClient(clientId ?? '', resource);
    if (
      !client ||
      (client.authentication === 'none' && authorization !== undefined) ||
      (client.authentication === 'client_secret_basic' &&
        (secret === undefined ||
          !client.secretSha256 ||
          !equalDigest(sha256(secret), client.secretSha256)))
    ) {
      throw new OAuthError('invalid_client', 401);
    }
    return client;
  }

  private async resolveClient(
    clientId: string,
    resource: string,
  ): Promise<IMcpAuthResolvedClient | undefined> {
    return await this.scope.service.registration.resolve(clientId, resource);
  }

  private ensureAutocommit(): void {
    if (this.scope.model.authorization.db.inTransaction) throw new OAuthError('server_error', 503);
  }

  private ensureWinner(count: unknown): void {
    if (typeof count !== 'number' || count !== 1) throw new OAuthError('invalid_grant');
  }
}

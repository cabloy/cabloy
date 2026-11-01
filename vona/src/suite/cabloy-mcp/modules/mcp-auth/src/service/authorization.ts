import type { TableIdentity } from 'table-identity';
import type { IPassport } from 'vona-module-a-user';

import { createHash, randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoAuthorizationSummary } from '../dto/authorizationSummary.ts';
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
  TypeMcpScope,
} from '../types/index.ts';

import {
  equalDigest,
  getMcpAuthConfig,
  getMcpIssuer,
  isMcpScope,
  mcpScopeIncludes,
  parseMcpScope,
  resolveMcpResource,
  OAuthError,
  requiredOAuthParameter,
  sha256,
  validateOAuthParameters,
} from '../lib/authorization.ts';
import { mcpRefreshEvidence } from '../lib/authToken.ts';

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
    const scope = params.has('scope') ? parseMcpScope(params.get('scope')) : client.scope;
    if (!scope || !mcpScopeIncludes(client.scope, scope)) throw new OAuthError('invalid_scope');
    const challenge = requiredOAuthParameter(params, 'code_challenge');
    if (params.get('code_challenge_method') !== 'S256' || !opaquePattern.test(challenge)) {
      throw new OAuthError('invalid_request');
    }
    await this.cleanupExpired();
    const request = randomBytes(32).toString('base64url');
    const deadline = Date.now() + config.pendingTtl * 1000;
    await this.scope.model.authorization.insert({
      requestDigest: sha256(request),
      clientId: client.clientId,
      issuer: getMcpIssuer(this.app),
      resource: resource.resource,
      redirectUri,
      scope,
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
    await this.currentPassport();
    const row = await this.pending(request);
    const config = this.configForResource(row.resource);
    const client = await this.validateBindings(row, config);
    return {
      clientName: client.name,
      resource: row.resource,
      scope: row.scope,
      expiresAt: Number(row.pendingExpiresAt),
    };
  }

  async decide(request: string, allow: boolean): Promise<{ redirectUrl: string }> {
    this.ensureAutocommit();
    if (typeof allow !== 'boolean') throw new OAuthError('invalid_request');
    const passport = await this.currentPassport();
    const row = await this.pending(request);
    const config = this.configForResource(row.resource);
    await this.validateBindings(row, config);
    const now = Date.now();
    const code = allow ? randomBytes(32).toString('base64url') : '';
    const expiresAt = allow ? now + config.codeTtl * 1000 : now;
    // A single tenant-scoped full-predicate UPDATE proves the sole decision winner.
    const count = await this.scope.model.authorization
      .builderSelect()
      .where(this.bindings(row))
      .where({ state: 'pending', requestDigest: sha256(request) })
      .where('pendingExpiresAt', '>', now)
      .update({
        state: allow ? 'codeReady' : 'denied',
        userId: passport.user!.id,
        authId: passport.auth!.id,
        codeDigest: allow ? sha256(code) : '',
        codeExpiresAt: allow ? expiresAt : 0,
        expiresAt,
      });
    this.ensureWinner(count);
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
      const scope = params.has('scope') ? parseMcpScope(params.get('scope')) : undefined;
      if (params.has('scope') && (!scope || !mcpScopeIncludes(client.scope, scope))) {
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
        codeDigest,
        clientId: client.clientId,
        resource,
        redirectUri,
        codeChallenge: challenge,
        state: 'codeReady',
      })
      .where('codeExpiresAt', '>', Date.now())
      .first();
    if (!row) throw new OAuthError('invalid_grant');
    await this.validateBindings(row, config);
    const passport = await this.loadPassport(row.userId, row.authId, 'invalid_grant', 400);
    const payload: IMcpTokenPayload = {
      userId: row.userId!,
      authId: row.authId!,
      token: codeDigest,
      mcp: {
        version: 1,
        grantId: String(row.id),
        clientId: row.clientId,
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
      .where({ tokenDigest: sha256(token), resource, state: 'tokenActive', tokenVersion: 0 })
      .where('tokenExpiresAt', '>', Date.now())
      .first();
    if (!row) throw new OAuthError('invalid_token', 401);
    if (!isMcpScope(row.scope)) throw new OAuthError('insufficient_scope', 403);
    await this.validateBindings(row, config, 'invalid_token', 401);
    const passport = await this.loadPassport(row.userId, row.authId, 'invalid_token', 401);
    const payload: IMcpLegacyTokenPayload = {
      userId: row.userId!,
      authId: row.authId!,
      token: row.tokenDigest,
      mcp: {
        version: 0,
        grantId: String(row.id),
        clientId: row.clientId,
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
        if (data) await this.scope.service.authTokenAdapter.remove(data);
        return;
      }
      return;
    }
    const row = await this.scope.model.authorization
      .builderSelect()
      .where({ tokenDigest: sha256(token), state: 'tokenActive' })
      .first();
    if (!row) return;
    this.configForResource(row.resource);
    await this.scope.model.authorization
      .builderSelect()
      .where(this.bindings(row))
      .where({ tokenDigest: sha256(token), state: 'tokenActive' })
      .update({ state: 'revoked', tokenDigest: '', expiresAt: Date.now() });
  }

  /** Bounded physical cleanup in the current instance, never a cross-tenant sweep. */
  async cleanupExpired(): Promise<void> {
    this.ensureAutocommit();
    const now = Date.now();
    const rows = await this.scope.model.authorization
      .builderSelect()
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
        .where('expiresAt', '<=', now)
        .delete();
    }
  }

  configForResource(resource: string): IMcpAuthConfig {
    const config = getMcpAuthConfig(this.app);
    const issuer = getMcpIssuer(this.app);
    const binding = resolveMcpResource(this.app, new URL(issuer).host);
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
    const client = await this.resolveClient(row.clientId, row.resource);
    if (
      row.issuer !== getMcpIssuer(this.app) ||
      !client ||
      !client.redirectUris.includes(row.redirectUri) ||
      !isMcpScope(row.scope) ||
      !mcpScopeIncludes(client.scope, row.scope) ||
      (row.refreshEnabled && client.grantTypes.length !== 2)
    ) {
      throw new OAuthError(error, status);
    }
    return client;
  }

  bindings(row: EntityAuthorization) {
    return {
      id: row.id,
      issuer: row.issuer,
      clientId: row.clientId,
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
      .where({ requestDigest: sha256(request), state: 'pending' })
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
      ? await users.role.builderSelect().whereIn(
          'id',
          memberships.map(item => item.roleId),
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

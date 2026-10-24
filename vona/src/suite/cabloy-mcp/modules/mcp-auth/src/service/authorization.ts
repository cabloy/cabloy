import type { TableIdentity } from 'table-identity';
import type { IPassport } from 'vona-module-a-user';

import { createHash, randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoAuthorizationSummary } from '../dto/authorizationSummary.ts';
import type { EntityAuthorization } from '../entity/authorization.tsx';
import type { IMcpAuthConfig, IMcpAuthResource } from '../types/index.ts';

import {
  equalDigest,
  getMcpAuthConfig,
  OAuthError,
  requiredOAuthParameter,
  sha256,
  validateOAuthParameters,
} from '../lib/authorization.ts';

const opaquePattern = /^[\w-]{43}$/;

@Service()
export class ServiceAuthorization extends BeanBase {
  async authorize(params: URLSearchParams, resource: IMcpAuthResource): Promise<string> {
    const config = this.configForResource(resource.resource);
    const registered = config.resources.find(item => item.resource === resource.resource)!;
    if (registered.instanceName !== resource.instanceName) throw new OAuthError('invalid_target');
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
    const client = config.clients.find(item => item.clientId === params.get('client_id'));
    const redirectUri = requiredOAuthParameter(params, 'redirect_uri');
    if (
      !client ||
      !client.resources.includes(resource.resource) ||
      !client.redirectUris.includes(redirectUri)
    ) {
      throw new OAuthError('invalid_request');
    }
    const scope = params.get('scope') ?? 'mcp:read';
    if (scope !== 'mcp:read') throw new OAuthError('invalid_scope');
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
      issuer: config.issuer,
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
    });
    return request;
  }

  async summary(request: string): Promise<DtoAuthorizationSummary> {
    await this.currentPassport();
    const row = await this.pending(request);
    const config = this.configForResource(row.resource);
    const client = this.validateBindings(row, config);
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
    this.validateBindings(row, config);
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
    redirect.searchParams.set('iss', config.issuer);
    return { redirectUrl: redirect.href };
  }

  async exchange(
    params: URLSearchParams,
    authorization: string | undefined,
  ): Promise<{
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
    scope: string;
  }> {
    this.ensureAutocommit();
    validateOAuthParameters(params, [
      'grant_type',
      'client_id',
      'code',
      'redirect_uri',
      'resource',
      'code_verifier',
    ]);
    if (params.get('grant_type') !== 'authorization_code')
      throw new OAuthError('unsupported_grant_type');
    const resource = requiredOAuthParameter(params, 'resource');
    const config = this.configForResource(resource);
    const client = this.authenticateClient(config, params, authorization);
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
    this.validateBindings(row, config);
    await this.loadPassport(row.userId, row.authId, 'invalid_grant', 400);
    const token = randomBytes(32).toString('base64url');
    const now = Date.now();
    const expiresAt = now + config.tokenTtl * 1000;
    // Code consumption and token activation commit together, with no issuance retry.
    const count = await this.scope.model.authorization
      .builderSelect()
      .where(this.bindings(row))
      .where({
        state: 'codeReady',
        codeDigest,
        userId: row.userId!,
        authId: row.authId!,
        codeChallenge: challenge,
      })
      .where('codeExpiresAt', '>', now)
      .update({
        state: 'tokenActive',
        codeDigest: '',
        tokenDigest: sha256(token),
        tokenExpiresAt: expiresAt,
        expiresAt,
      });
    this.ensureWinner(count);
    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: config.tokenTtl,
      scope: row.scope,
    };
  }

  async lookup(token: string, resource: string): Promise<IPassport> {
    const config = this.configForResource(resource);
    if (!opaquePattern.test(token)) throw new OAuthError('invalid_token', 401);
    const row = await this.scope.model.authorization
      .builderSelect()
      .where({ tokenDigest: sha256(token), resource, state: 'tokenActive' })
      .where('tokenExpiresAt', '>', Date.now())
      .first();
    if (!row) throw new OAuthError('invalid_token', 401);
    if (row.scope !== 'mcp:read') throw new OAuthError('insufficient_scope', 403);
    this.validateBindings(row, config, 'invalid_token', 401);
    return await this.loadPassport(row.userId, row.authId, 'invalid_token', 401);
  }

  async revoke(token: string): Promise<void> {
    this.ensureAutocommit();
    if (!opaquePattern.test(token)) return;
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

  private configForResource(resource: string): IMcpAuthConfig {
    const config = getMcpAuthConfig(this.app);
    const registration = config.resources.find(item => item.resource === resource);
    if (
      !registration ||
      this.ctx.instanceName !== registration.instanceName ||
      !this.ctx.instance
    ) {
      throw new OAuthError('invalid_target');
    }
    return config;
  }

  private validateBindings(
    row: EntityAuthorization,
    config: IMcpAuthConfig,
    error = 'invalid_grant',
    status = 400,
  ) {
    const client = config.clients.find(item => item.clientId === row.clientId);
    if (
      row.issuer !== config.issuer ||
      !client ||
      !client.resources.includes(row.resource) ||
      !client.redirectUris.includes(row.redirectUri) ||
      row.scope !== 'mcp:read'
    ) {
      throw new OAuthError(error, status);
    }
    return client;
  }

  private bindings(row: EntityAuthorization) {
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

  private async loadPassport(
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

  private authenticateClient(
    config: IMcpAuthConfig,
    params: URLSearchParams,
    authorization: string | undefined,
  ) {
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
    const client = config.clients.find(item => item.clientId === clientId);
    if (
      !client ||
      (client.authentication === 'none' && authorization !== undefined) ||
      (client.authentication === 'client_secret_basic' &&
        (secret === undefined || !equalDigest(sha256(secret), client.secretSha256!)))
    ) {
      throw new OAuthError('invalid_client', 401);
    }
    return client;
  }

  private ensureAutocommit(): void {
    if (this.scope.model.authorization.db.inTransaction) throw new OAuthError('server_error', 503);
  }

  private ensureWinner(count: unknown): void {
    if (typeof count !== 'number' || count !== 1) throw new OAuthError('invalid_grant');
  }
}

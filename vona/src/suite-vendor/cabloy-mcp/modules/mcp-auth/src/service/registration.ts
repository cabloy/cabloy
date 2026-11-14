import { randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  IMcpAuthConfig,
  IMcpAuthRegistrationRequest,
  IMcpAuthRegistrationResponse,
  IMcpAuthIssuer,
  IMcpAuthResolvedClient,
  TypeMcpClientAuthentication,
} from '../types/index.ts';

import {
  getMcpAuthConfig,
  getMcpIssuer,
  isMcpBuiltinScope,
  parseMcpScope,
  resolveMcpInstance,
  resolveMcpResourceUrl,
  resolveMcpGrantTypes,
  OAuthError,
  sha256,
  validateConfiguredRedirectUri,
} from '../lib/authorization.ts';

const clientNamePattern = /^\S(?:[\s\S]{0,254}\S)?$/;

@Service()
export class ServiceRegistration extends BeanBase {
  async register(
    request: IMcpAuthRegistrationRequest,
    target: IMcpAuthIssuer,
  ): Promise<IMcpAuthRegistrationResponse> {
    const config = getMcpAuthConfig(this.app);
    const binding = resolveMcpInstance(this.app, new URL(getMcpIssuer(this.app)).host);
    if (
      target.issuer !== binding.issuer ||
      target.instanceName !== binding.instanceName ||
      this.ctx.instanceName !== binding.instanceName ||
      !this.ctx.instance
    ) {
      throw new OAuthError('invalid_target');
    }
    const parsed = this.validateRequest(request, config);
    const issuedAt = Math.floor(Date.now() / 1000);
    for (let attempt = 0; attempt < 3; attempt++) {
      const clientId = randomBytes(32).toString('base64url');
      const existing = await this.scope.model.client.get({ oauthClientId: clientId });
      if (existing) continue;
      try {
        await this.scope.model.client.insert({
          oauthClientId: clientId,
          name: parsed.clientName,
          redirectUris: parsed.redirectUris,
          grantTypes: parsed.grantTypes,
          authentication: parsed.authentication,
          issuer: binding.issuer,
          scope: parsed.scope,
          state: 'active',
          clientIdIssuedAt: issuedAt,
          ...(parsed.secretSha256 ? { secretSha256: parsed.secretSha256 } : {}),
        });
      } catch (error) {
        if (attempt < 2) continue;
        throw error;
      }
      return {
        client_id: clientId,
        client_id_issued_at: issuedAt,
        client_name: parsed.clientName,
        redirect_uris: parsed.redirectUris,
        token_endpoint_auth_method: parsed.authentication,
        grant_types: parsed.grantTypes,
        response_types: ['code'],
        scope: parsed.scope,
        ...(parsed.secret
          ? { client_secret: parsed.secret, client_secret_expires_at: 0 as const }
          : {}),
      };
    }
    throw new OAuthError('temporarily_unavailable', 503);
  }

  async resolve(clientId: string, resource: string): Promise<IMcpAuthResolvedClient | undefined> {
    const target = resolveMcpResourceUrl(this.app, resource);
    if (this.ctx.instanceName !== target.instanceName) return undefined;
    const client = await this.scope.model.client.get({ oauthClientId: clientId });
    if (
      !client ||
      client.state !== 'active' ||
      client.issuer !== getMcpIssuer(this.app) ||
      !isMcpBuiltinScope(client.scope)
    ) {
      return undefined;
    }
    const grantTypes = resolveMcpGrantTypes(client.grantTypes);
    if (!grantTypes) return undefined;
    return {
      id: client.id,
      clientId: client.oauthClientId,
      name: client.name,
      redirectUris: client.redirectUris,
      grantTypes,
      authentication: client.authentication,
      ...(client.secretSha256 ? { secretSha256: client.secretSha256 } : {}),
      resources: [target.resource],
      scope: client.scope,
      state: client.state,
      clientIdIssuedAt: Number(client.clientIdIssuedAt),
    };
  }

  async disable(clientId: string): Promise<void> {
    await this.scope.model.client
      .builderSelect()
      .where({ oauthClientId: clientId, state: 'active' })
      .update({ state: 'revoked' });
  }

  private validateRequest(request: IMcpAuthRegistrationRequest, config: IMcpAuthConfig) {
    if (!request || typeof request !== 'object') throw new OAuthError('invalid_client_metadata');
    // Ignore unrecognized metadata; only validated fields enter persistence and the response.
    // Request-only compatibility hint; it does not change registered metadata or redirect policy.
    if (request.application_type !== undefined && request.application_type !== 'native') {
      throw new OAuthError('invalid_client_metadata');
    }
    if (typeof request.client_name !== 'string' || !clientNamePattern.test(request.client_name)) {
      throw new OAuthError('invalid_client_metadata');
    }
    if (
      !Array.isArray(request.redirect_uris) ||
      request.redirect_uris.length === 0 ||
      request.redirect_uris.length > config.registration!.maxRedirectUris ||
      new Set(request.redirect_uris).size !== request.redirect_uris.length
    ) {
      throw new OAuthError('invalid_redirect_uri');
    }
    for (const redirectUri of request.redirect_uris) {
      if (typeof redirectUri !== 'string') throw new OAuthError('invalid_redirect_uri');
      try {
        validateConfiguredRedirectUri(redirectUri, config.allowLoopbackHttp);
      } catch (error) {
        if (error instanceof OAuthError && error.oauthError === 'invalid_redirect_uri') throw error;
        throw new OAuthError('invalid_redirect_uri');
      }
    }
    const grantTypes = resolveMcpGrantTypes(request.grant_types);
    if (request.grant_types === null || !grantTypes) {
      throw new OAuthError('invalid_client_metadata');
    }
    if (
      request.response_types !== undefined &&
      (!Array.isArray(request.response_types) ||
        request.response_types.length !== 1 ||
        request.response_types[0] !== 'code')
    ) {
      throw new OAuthError('invalid_client_metadata');
    }
    const scope = request.scope === undefined ? 'mcp:all' : parseMcpScope(request.scope);
    if (!scope) throw new OAuthError('invalid_client_metadata');
    const authentication: TypeMcpClientAuthentication =
      request.token_endpoint_auth_method ?? 'none';
    if (authentication !== 'none' && authentication !== 'client_secret_basic') {
      throw new OAuthError('invalid_client_metadata');
    }
    const secret =
      authentication === 'client_secret_basic' ? randomBytes(32).toString('base64url') : undefined;
    return {
      clientName: request.client_name,
      scope,
      redirectUris: request.redirect_uris,
      grantTypes,
      authentication,
      ...(secret ? { secret, secretSha256: sha256(secret) } : {}),
    };
  }
}

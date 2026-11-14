import type { TableIdentity } from 'table-identity';
import type { TypeQueryInput } from 'vona-module-a-orm';

import { randomBytes } from 'node:crypto';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { $compileQuery } from 'vona-module-a-orm';

import type { DtoAccessTokenCreate } from '../dto/accessTokenCreate.tsx';
import type { DtoAccessTokenCreateRes } from '../dto/accessTokenCreateRes.tsx';
import type { DtoAccessTokenMineRes } from '../dto/accessTokenMineRes.tsx';
import type { IMcpPersonalTokenPayload } from '../lib/authToken.ts';
import type { IMcpToolIdentity } from '../types/index.ts';

import { accessTokenColumns } from '../dto/accessToken.tsx';
import { accessTokenMineQuery } from '../dto/accessTokenMineReq.tsx';
import {
  getMcpIssuer,
  isMcpCustomScope,
  isMcpScope,
  OAuthError,
  sha256,
} from '../lib/authorization.ts';
import { normalizeToolIdentities, toolIdentityKey } from './customScope.ts';

@Service()
export class ServiceAccessToken extends BeanBase {
  async mine(
    userId: TableIdentity,
    resource: string,
    query: TypeQueryInput<typeof accessTokenMineQuery>,
  ): Promise<DtoAccessTokenMineRes> {
    const result = await this.scope.model.authorization.selectAndCount({
      ...$compileQuery(this.scope.model.authorization, accessTokenMineQuery, query, {
        scopeWhere: { userId, resource, issuanceKind: 'personal' },
      }),
      columns: [...accessTokenColumns, 'state'],
    });
    const now = Date.now();
    return {
      ...result,
      list: result.list.map(row => ({
        id: row.id,
        name: row.name,
        scope: row.scope,
        createdAt: row.createdAt,
        tokenExpiresAt: Number(row.tokenExpiresAt),
        status:
          row.state === 'revoked'
            ? 'revoked'
            : Number(row.tokenExpiresAt) <= now
              ? 'expired'
              : 'active',
      })),
    };
  }

  async createMine(
    userId: TableIdentity,
    resource: string,
    authId: TableIdentity | undefined,
    data: DtoAccessTokenCreate,
  ): Promise<DtoAccessTokenCreateRes> {
    if (this.scope.model.authorization.db.inTransaction) throw new OAuthError('server_error', 503);
    if (
      !data ||
      typeof data.name !== 'string' ||
      !data.name.trim() ||
      data.name.trim().length > 100 ||
      Object.keys(data).some(key => !['name', 'scope', 'expiresIn'].includes(key))
    ) {
      throw new OAuthError('invalid_request');
    }
    const scope = data.scope === undefined ? 'mcp:read' : data.scope;
    if (!isMcpScope(scope)) throw new OAuthError('invalid_scope');
    const config = this.scope.service.authorization.configForResource(resource);
    const expiresIn = data.expiresIn === undefined ? config.personalTokenTtl : data.expiresIn;
    if (
      !Number.isSafeInteger(expiresIn) ||
      expiresIn <= 0 ||
      !Number.isSafeInteger(Date.now() + expiresIn * 1000)
    ) {
      throw new OAuthError('invalid_request');
    }
    const passport = await this.scope.service.authorization.loadMcpPassport(
      userId,
      resource,
      authId,
      'access_denied',
      403,
    );
    return await this.scope.service.customScope.withDefinitions(
      userId,
      resource,
      [scope],
      async () => {
        let scopeTools: IMcpToolIdentity[] = [];
        if (isMcpCustomScope(scope)) {
          scopeTools = normalizeToolIdentities(
            (await this.scope.service.customScope.resolve(userId, resource, scope)).tools,
          );
          // A separate ordinary context uses fresh authority without changing browser Passport provenance.
          const app = this.app;
          const catalog = await this.bean.executor.newCtxIsolate(
            async () => {
              await app.bean.passport.setCurrent(passport);
              return await app.scope('mcp-auth').service.customScope.catalog(resource);
            },
            { instanceName: this.ctx.instanceName, innerAccess: false },
          );
          const available = new Set(catalog.map(toolIdentityKey));
          if (scopeTools.some(tool => !available.has(toolIdentityKey(tool))))
            throw new OAuthError('invalid_scope');
        }
        const tokenExpiresAt = (Math.floor(Date.now() / 1000) + expiresIn) * 1000;
        if (
          !Number.isSafeInteger(tokenExpiresAt) ||
          !Number.isFinite(new Date(tokenExpiresAt).getTime())
        ) {
          throw new OAuthError('invalid_request');
        }
        const nonce = randomBytes(32).toString('base64url');
        const row = await this.scope.model.authorization.insert({
          issuanceKind: 'personal',
          name: data.name.trim(),
          clientId: null,
          oauthClientId: null,
          issuer: getMcpIssuer(this.app),
          resource,
          userId,
          authId: passport.auth!.id,
          scope,
          requestedScope: scope,
          scopeTools,
          scopeReadOnly: scope === 'mcp:read',
          state: 'tokenActive',
          tokenDigest: sha256(nonce),
          tokenVersion: 1,
          tokenExpiresAt,
          expiresAt: tokenExpiresAt,
          refreshEnabled: false,
          refreshGeneration: 1,
          refreshExpiresAt: 0,
          requestDigest: '',
          redirectUri: '',
          oauthState: '',
          codeChallenge: '',
          pendingExpiresAt: 0,
          codeDigest: '',
          codeExpiresAt: 0,
        });
        const payload: IMcpPersonalTokenPayload = {
          userId,
          authId: passport.auth!.id,
          token: nonce,
          mcp: {
            version: 1,
            kind: 'personal',
            grantId: String(row.id),
            issuer: row.issuer,
            resource,
            instanceName: this.ctx.instanceName!,
            scope,
            generation: 1,
            refreshEnabled: false,
            refreshExpiresAt: 0,
            tokenExpiresAt,
          },
        };
        let accessToken: string;
        try {
          // Preserve the same second-aligned deadline even if persistence took time.
          const remainingSeconds = tokenExpiresAt / 1000 - Math.floor(Date.now() / 1000);
          if (remainingSeconds <= 0) throw new OAuthError('invalid_request');
          accessToken = await this.bean.jwt
            .get('mcpAccess')
            .sign(payload, { expiresIn: remainingSeconds });
        } catch (error) {
          await this.scope.model.authorization.delete({
            id: row.id,
            userId,
            resource,
            issuanceKind: 'personal',
          });
          throw error;
        }
        this.$logger.debug('mcp.personal_token.created');
        return { id: row.id, accessToken, resource, scope, tokenExpiresAt };
      },
    );
  }

  async deleteMine(userId: TableIdentity, resource: string, id: TableIdentity): Promise<void> {
    await this.scope.model.authorization.delete({ id, userId, resource, issuanceKind: 'personal' });
    this.$logger.debug('mcp.personal_token.deleted');
  }
}

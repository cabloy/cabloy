import type { TableIdentity } from 'table-identity';
import type { TypeQueryInput } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { $compileQuery } from 'vona-module-a-orm';

import type { DtoAuthorizationGrantMineRes } from '../dto/authorizationGrantMineRes.tsx';

import { authorizationGrantColumns } from '../dto/authorizationGrant.tsx';
import { authorizationGrantMineQuery } from '../dto/authorizationGrantMineReq.tsx';

@Service()
export class ServiceAuthorizationGrant extends BeanBase {
  async mine(
    userId: TableIdentity,
    resource: string,
    query: TypeQueryInput<typeof authorizationGrantMineQuery>,
  ): Promise<DtoAuthorizationGrantMineRes> {
    const result = await this.scope.model.authorization.selectAndCount({
      ...$compileQuery(this.scope.model.authorization, authorizationGrantMineQuery, query, {
        scopeWhere: { userId, resource, issuanceKind: 'oauth' },
      }),
      columns: [...authorizationGrantColumns, 'clientId', 'oauthClientId', 'issuer'],
      include: { client: true },
    });
    return {
      ...result,
      list: result.list.map(row => ({
        id: row.id,
        clientId: row.oauthClientId ?? '',
        resource: row.resource,
        scope: row.scope,
        requestedScope: row.requestedScope || row.scope,
        state: row.state,
        createdAt: row.createdAt,
        tokenExpiresAt: row.tokenExpiresAt,
        refreshEnabled: row.refreshEnabled,
        refreshExpiresAt: row.refreshExpiresAt,
        expiresAt: row.expiresAt,
        clientName:
          (row.client?.oauthClientId === row.oauthClientId && row.client.issuer === row.issuer
            ? row.client.name
            : undefined) ||
          row.oauthClientId ||
          '',
      })),
    };
  }

  async revokeMine(userId: TableIdentity, resource: string, id: TableIdentity): Promise<void> {
    await this.scope.model.authorization
      .builderSelect()
      .where({ id, userId, resource, issuanceKind: 'oauth' })
      .whereIn('state', ['codeReady', 'tokenActive'])
      .update({ state: 'revoked', codeDigest: '', tokenDigest: '', expiresAt: Date.now() });
  }

  async deleteMine(userId: TableIdentity, resource: string, id: TableIdentity): Promise<void> {
    await this.scope.model.authorization.delete({ id, userId, resource, issuanceKind: 'oauth' });
  }
}

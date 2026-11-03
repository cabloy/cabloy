import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoAuthorizationGrantMineReq } from '../dto/authorizationGrantMineReq.tsx';
import type { DtoAuthorizationGrantMineRes } from '../dto/authorizationGrantMineRes.tsx';

import { authorizationGrantColumns } from '../dto/authorizationGrant.tsx';

@Service()
export class ServiceAuthorizationGrant extends BeanBase {
  async mine(
    userId: TableIdentity,
    query: DtoAuthorizationGrantMineReq,
  ): Promise<DtoAuthorizationGrantMineRes> {
    const result = await this.scope.model.authorization.selectAndCount({
      columns: [...authorizationGrantColumns, 'clientId', 'oauthClientId'],
      include: { client: true },
      where: { userId },
      orders: [['id', 'desc']],
      limit: query.pageSize,
      offset: (query.pageNo - 1) * query.pageSize,
    });
    return {
      ...result,
      list: result.list.map(row => ({
        id: row.id,
        clientId: row.oauthClientId,
        resource: row.resource,
        scope: row.scope,
        state: row.state,
        createdAt: row.createdAt,
        tokenExpiresAt: row.tokenExpiresAt,
        refreshEnabled: row.refreshEnabled,
        refreshExpiresAt: row.refreshExpiresAt,
        expiresAt: row.expiresAt,
        clientName:
          (row.client?.oauthClientId === row.oauthClientId && row.client.resource === row.resource
            ? row.client.name
            : undefined) || row.oauthClientId,
      })),
    };
  }

  async revokeMine(userId: TableIdentity, id: TableIdentity): Promise<void> {
    await this.scope.model.authorization
      .builderSelect()
      .where({ id, userId })
      .whereIn('state', ['codeReady', 'tokenActive'])
      .update({ state: 'revoked', codeDigest: '', tokenDigest: '', expiresAt: Date.now() });
  }

  async deleteMine(userId: TableIdentity, id: TableIdentity): Promise<void> {
    await this.scope.model.authorization.delete({ id, userId });
  }
}

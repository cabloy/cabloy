import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;
    const entity = this.scope.entity.authorization;
    await this.bean.model.createTable(entity.$table, table => {
      table.basicFields();
      table.string(entity.requestDigest, 64).notNullable();
      table.string(entity.clientId, 255).notNullable();
      table.string(entity.issuer, 2048).notNullable();
      table.string(entity.resource, 2048).notNullable();
      table.string(entity.redirectUri, 2048).notNullable();
      table.string(entity.scope, 255).notNullable();
      table.string(entity.oauthState, 2048).notNullable();
      table.string(entity.codeChallenge, 43).notNullable();
      table.string(entity.state, 32).notNullable();
      table.bigInteger(entity.pendingExpiresAt).notNullable();
      table.bigInteger(entity.expiresAt).notNullable();
      table.string(entity.codeDigest, 64).notNullable();
      table.bigInteger(entity.codeExpiresAt).notNullable();
      table.string(entity.tokenDigest, 64).notNullable();
      table.bigInteger(entity.tokenExpiresAt).notNullable();
      table.tableIdentity(entity.userId);
      table.tableIdentity(entity.authId);
      table.index(['iid', entity.requestDigest]);
      table.index(['iid', entity.codeDigest]);
      table.index(['iid', entity.tokenDigest]);
      table.index(['iid', entity.expiresAt]);
    });
  }
}

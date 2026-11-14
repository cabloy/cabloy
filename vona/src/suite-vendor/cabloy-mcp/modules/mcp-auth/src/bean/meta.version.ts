import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;
    const authorization = this.scope.entity.authorization;
    await this.bean.model.createTable(authorization.$table, table => {
      table.basicFields();
      // Approved unreleased schema: fold personal grants into fileVersion=1.
      table.string(authorization.issuanceKind, 16).notNullable().defaultTo('oauth');
      table.string(authorization.name, 100).notNullable().defaultTo('');
      table.string(authorization.requestDigest, 64).notNullable();
      table.tableIdentity(authorization.clientId).nullable();
      table.string(authorization.oauthClientId, 255).nullable();
      table.string(authorization.issuer, 2048).notNullable();
      table.string(authorization.resource, 2048).notNullable();
      table.string(authorization.redirectUri, 2048).notNullable();
      table.string(authorization.scope, 255).notNullable();
      table.string(authorization.requestedScope, 255).notNullable().defaultTo('');
      table.json(authorization.scopeTools).notNullable();
      table.boolean(authorization.scopeReadOnly).notNullable().defaultTo(false);
      table.string(authorization.oauthState, 2048).notNullable();
      table.string(authorization.codeChallenge, 43).notNullable();
      table.string(authorization.state, 32).notNullable();
      table.bigInteger(authorization.pendingExpiresAt).notNullable();
      table.bigInteger(authorization.expiresAt).notNullable();
      table.string(authorization.codeDigest, 64).notNullable();
      table.bigInteger(authorization.codeExpiresAt).notNullable();
      table.string(authorization.tokenDigest, 64).notNullable();
      table.bigInteger(authorization.tokenExpiresAt).notNullable();
      table.integer(authorization.tokenVersion).notNullable().defaultTo(0);
      table.boolean(authorization.refreshEnabled).notNullable().defaultTo(false);
      table.integer(authorization.refreshGeneration).notNullable().defaultTo(0);
      table.bigInteger(authorization.refreshExpiresAt).notNullable().defaultTo(0);
      table.tableIdentity(authorization.userId);
      table.tableIdentity(authorization.authId);
    });
    const client = this.scope.entity.client;
    await this.bean.model.createTable(client.$table, table => {
      table.basicFields();
      table.string(client.oauthClientId, 255).notNullable();
      table.string(client.name, 255).notNullable();
      table.json(client.redirectUris).notNullable();
      table.json(client.grantTypes).notNullable();
      table.string(client.authentication, 32).notNullable();
      table.string(client.secretSha256, 64).nullable();
      table.string(client.issuer, 2048).notNullable();
      table.string(client.scope, 255).notNullable();
      table.string(client.state, 32).notNullable();
      table.bigInteger(client.clientIdIssuedAt).notNullable();
    });
    // Approved unreleased schema: keep fileVersion=1 and create on a fresh managed database.
    const customScope = this.scope.entity.customScope;
    await this.bean.model.createTable(customScope.$table, table => {
      table.basicFields();
      table.tableIdentity(customScope.userId).notNullable();
      table.string(customScope.resource, 2048).notNullable();
      table.string(customScope.scope, 255).notNullable();
      table.string(customScope.name, 100).notNullable();
      table.string(customScope.description, 1000).notNullable();
      table.json(customScope.tools).notNullable();
    });
  }
}

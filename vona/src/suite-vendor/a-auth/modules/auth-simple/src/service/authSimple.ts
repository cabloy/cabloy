import type { TableIdentity } from 'table-identity';

import * as passwordHash from 'password-hash-salt';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

@Service()
export class ServiceAuthSimple extends BeanBase {
  async create(password: string) {
    if (!password) this.app.throw(403);
    // hash
    const hash = await this.calcPasswordHash(password);
    // auth simple
    return await this.scope.model.authSimple.insert({ hash });
  }

  async getByUserId(userId: TableIdentity) {
    const authProvider = await this._getSimpleAuthProvider();
    const auth = await this.$scope.auth.model.auth.get({
      userId,
      authProviderId: authProvider.id,
    });
    if (!auth) return;
    const authSimple = await this.scope.model.authSimple.get({ id: auth.profileId });
    if (!authSimple) {
      throw new Error(`auth-simple profile missing for user: ${userId}`);
    }
    return authSimple;
  }

  async hasByUserId(userId: TableIdentity): Promise<boolean> {
    return !!(await this.getByUserId(userId));
  }

  async verifyPassword(
    userId: TableIdentity,
    password: string,
  ): Promise<TableIdentity | undefined> {
    // check
    if (!password) return;
    // authSimple
    const authSimple = await this.getByUserId(userId);
    if (!authSimple) return;
    // verify
    const res = await this.verifyPasswordHash(password, authSimple.hash);
    if (!res) return;
    // ok
    return authSimple.id;
  }

  async replacePassword(userId: TableIdentity, password: string): Promise<boolean> {
    if (!password) return false;
    const authSimple = await this.getByUserId(userId);
    if (!authSimple) return false;
    await this.scope.model.authSimple.updateById(authSimple.id, {
      hash: await this.calcPasswordHash(password),
    });
    return true;
  }

  @Core.transaction()
  async createForUser(userId: TableIdentity, password: string) {
    if (!password) this.app.throw(403);
    return await this.scope.redlock.lock(`authSimple.createForUser.${userId}`, async () => {
      const authProvider = await this._getSimpleAuthProvider();
      const auth = await this.$scope.auth.model.auth.get({
        userId,
        authProviderId: authProvider.id,
      });
      if (auth) return;
      const authSimple = await this.create(password);
      await this.$scope.auth.model.auth.insert({
        userId,
        authProviderId: authProvider.id,
        profileId: authSimple.id.toString(),
        profile: JSON.stringify({ id: authSimple.id.toString() }),
      });
      return authSimple;
    });
  }

  private async _getSimpleAuthProvider() {
    return await this.bean.authProvider.get({
      providerName: 'auth-simple:simple',
      clientName: 'default',
    });
  }

  async verifyPasswordHash(password: string, hash: string) {
    return await passwordHash.verify(password, hash);
  }

  async calcPasswordHash(password: string) {
    const configPasswordHash = this.scope.config.passwordHash;
    return await passwordHash.hash(password, configPasswordHash);
  }
}

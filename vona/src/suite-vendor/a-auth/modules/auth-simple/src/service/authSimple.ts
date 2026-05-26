import type { TableIdentity } from 'table-identity';

import * as passwordHash from 'password-hash-salt';
import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

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
    const auth = await this.$scope.auth.model.auth.get({ userId });
    if (!auth) return;
    return await this.scope.model.authSimple.get({ id: auth.profileId });
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

  async verifyPasswordHash(password: string, hash: string) {
    return await passwordHash.verify(password, hash);
  }

  async calcPasswordHash(password: string) {
    const configPasswordHash = this.scope.config.passwordHash;
    return await passwordHash.hash(password, configPasswordHash);
  }
}

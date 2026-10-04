import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

const fixtureUserNamePrefix = 'e2e-fixture-';

export interface IControllerOptionsPassportTest extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPassportTest>({
  path: 'passportTest',
  meta: { mode: ['dev', 'test'] },
})
@Api.exclude()
export class ControllerPassportTest extends BeanBase {
  @Web.post('activateCurrent')
  @Passport.activated(false)
  async activateCurrent() {
    await this.bean.user.activate(this.bean.passport.currentUser!);
  }

  @Web.delete('removeCurrentFixture')
  @Passport.activated('noCheck')
  @Core.transaction()
  async removeCurrentFixture() {
    const user = this.bean.passport.currentUser!;
    if (!user.name.startsWith(fixtureUserNamePrefix)) this.app.throw(403);

    const auths = await this.$scope.auth.model.auth.select({ where: { userId: user.id } });
    const authProvider = await this.bean.authProvider.get({
      providerName: 'auth-simple:simple',
      clientName: 'default',
    });
    const authSimpleIds = authProvider
      ? auths.filter(auth => auth.authProviderId === authProvider.id).map(auth => auth.profileId)
      : [];
    if (auths.length) await this.$scope.auth.model.auth.deleteBulk(auths.map(auth => auth.id));
    if (authSimpleIds.length) {
      await this.$scope.authSimple.model.authSimple.deleteBulk(authSimpleIds);
    }
    await this.scope.model.roleUser.delete({ userId: user.id });
    await this.bean.user.removeById(user.id);
    this.ctx.db.commit(async () => {
      await Promise.all([
        this._removeCurrentToken(
          this.scope.cacheRedis.activation,
          this.scope.cacheRedis.activationCurrent,
          user.id,
        ),
        this._removeCurrentToken(
          this.scope.cacheRedis.passwordSet,
          this.scope.cacheRedis.passwordSetCurrent,
          user.id,
        ),
        this._removeCurrentToken(
          this.scope.cacheRedis.passwordReset,
          this.scope.cacheRedis.passwordResetCurrent,
          user.id,
        ),
        this.bean.passport.kickOut(user),
      ]);
    });
  }

  private async _removeCurrentToken(
    tokenCache: { del(key: string): Promise<unknown> },
    currentCache: {
      get(key: TableIdentity): Promise<string | undefined>;
      del(key: TableIdentity): Promise<unknown>;
    },
    userId: TableIdentity,
  ) {
    const digest = await currentCache.get(userId);
    if (digest) await tokenCache.del(digest);
    await currentCache.del(userId);
  }
}

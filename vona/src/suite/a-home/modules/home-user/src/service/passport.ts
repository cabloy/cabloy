import type { IJwtToken } from 'vona-module-a-jwt';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoPassport } from '../dto/passport.ts';
import type { DtoPassportJwt } from '../dto/passportJwt.ts';

@Service()
export class ServicePassport extends BeanBase {
  async combineDtoPassportJwt(jwt?: IJwtToken): Promise<DtoPassportJwt> {
    if (!jwt) this.app.throw(401);
    const passport = await this.combineDtoPassport();
    if (!passport) this.app.throw(401);
    return { passport, jwt };
  }

  async combineDtoPassport(): Promise<DtoPassport | undefined> {
    const passport = this.bean.passport.current;
    const user = passport?.user;
    if (!passport?.auth || !user) return;
    // Load the shared DTO projection, never the stored auth profile or provider options.
    const auth = await this.bean.auth.findOne({ id: passport.auth.id });
    if (!auth) return;
    const roles = await this.scope.model.role.mget(
      (passport.roles ?? []).map(role => role.id),
      {
        columns: [
          'id',
          'createdAt',
          'updatedAt',
          'deleted',
          'iid',
          'name',
          'title',
          'titleLocales',
          'siteIds',
          'mcpAccess',
          'builtin',
        ],
      },
    );
    return {
      instanceId: this.ctx.instance?.id ?? null,
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
        mobile: user.mobile,
        activated: user.activated,
        accountStatus: user.accountStatus ?? 'active',
        locale: user.locale,
        tz: user.tz,
        anonymous: user.anonymous,
      },
      auth,
      roles,
    };
  }
}

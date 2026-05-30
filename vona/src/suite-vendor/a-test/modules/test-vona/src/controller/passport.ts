import type { IJwtToken } from 'vona-module-a-jwt';
import type { IUser, IUserNameRecord } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import assert from 'node:assert';
import { BeanBase } from 'vona';
import { DtoJwtToken } from 'vona-module-a-jwt';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsPassport extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPassport>({ path: 'passport', meta: { mode: 'test' } })
@Api.exclude()
export class ControllerPassport extends BeanBase {
  @Web.get('echo/:name')
  @Passport.public()
  echo(@Arg.param('name') name: string, @Arg.user() user: IUser) {
    assert.equal(name, 'admin');
    assert.equal(user.name, 'admin');
    return { name, user };
  }

  @Web.post('login')
  @Api.body(v.object(DtoJwtToken))
  @Passport.public()
  async login(@Arg.body('name') name: string): Promise<IJwtToken> {
    const jwt = await this.bean.passport.signinMock(name as keyof IUserNameRecord);
    return jwt;
  }

  @Web.get('isAuthenticated')
  isAuthenticated(): boolean {
    return this.bean.passport.isAuthenticated;
  }

  @Web.post('refresh')
  @Api.body(v.object(DtoJwtToken))
  @Passport.public()
  async refresh(@Arg.body('refreshToken') refreshToken: string): Promise<IJwtToken> {
    return await this.bean.passport.refreshAuthToken(refreshToken);
  }

  @Web.post('logout')
  async logout() {
    return await this.bean.passport.signout();
  }
}

import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoAuthorizationGrantMineReq } from '../dto/authorizationGrantMineReq.tsx';
import { DtoAuthorizationGrantMineRes } from '../dto/authorizationGrantMineRes.tsx';

export interface IControllerOptionsAuthorizationGrant extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsAuthorizationGrant>('authorizationGrant')
@Passport.public(false)
export class ControllerAuthorizationGrant extends BeanBase {
  @Web.get('mine')
  @Api.body(DtoAuthorizationGrantMineRes)
  async mine(
    @Arg.user() user: IUser,
    @Arg.query(v.object(DtoAuthorizationGrantMineReq, { strict: true }))
    query: DtoAuthorizationGrantMineReq,
  ): Promise<DtoAuthorizationGrantMineRes> {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.scope.service.authorizationGrant.mine(user.id, query);
  }

  @Web.post('revokeMine/:id')
  async revokeMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<void> {
    this.ctx.set('Cache-Control', 'no-store');
    await this.scope.service.authorizationGrant.revokeMine(user.id, id);
  }

  @Web.delete('deleteMine/:id')
  async deleteMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<void> {
    this.ctx.set('Cache-Control', 'no-store');
    await this.scope.service.authorizationGrant.deleteMine(user.id, id);
  }
}

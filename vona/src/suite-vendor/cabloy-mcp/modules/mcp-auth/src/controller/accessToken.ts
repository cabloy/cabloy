import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoAccessTokenCreate } from '../dto/accessTokenCreate.tsx';
import { DtoAccessTokenCreateRes } from '../dto/accessTokenCreateRes.tsx';
import { DtoAccessTokenMineReq } from '../dto/accessTokenMineReq.tsx';
import { DtoAccessTokenMineRes } from '../dto/accessTokenMineRes.tsx';

export interface IControllerOptionsAccessToken extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsAccessToken>('accessToken')
@Passport.public(false)
export class ControllerAccessToken extends BeanBase {
  @Web.get('mine')
  @Api.body(DtoAccessTokenMineRes)
  async mine(
    @Arg.user() user: IUser,
    @Arg.query(v.object(DtoAccessTokenMineReq, { strict: true })) query: DtoAccessTokenMineReq,
  ): Promise<DtoAccessTokenMineRes> {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.scope.service.accessToken.mine(user.id, query);
  }

  @Web.post('createMine')
  @Api.body(DtoAccessTokenCreateRes)
  async createMine(
    @Arg.user() user: IUser,
    @Arg.body(v.object(DtoAccessTokenCreate, { strict: true })) data: DtoAccessTokenCreate,
  ): Promise<DtoAccessTokenCreateRes> {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.scope.service.accessToken.createMine(
      user.id,
      this.bean.passport.currentAuth?.id,
      data,
    );
  }

  @Web.delete('deleteMine/:id')
  async deleteMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<void> {
    this.ctx.set('Cache-Control', 'no-store');
    await this.scope.service.accessToken.deleteMine(user.id, id);
  }
}

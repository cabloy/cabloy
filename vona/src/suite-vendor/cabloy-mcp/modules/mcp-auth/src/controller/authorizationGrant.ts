import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, ArgValid, Controller, Web } from 'vona-module-a-web';

import { DtoAuthorizationGrantMineReq } from '../dto/authorizationGrantMineReq.tsx';
import { DtoAuthorizationGrantMineRes } from '../dto/authorizationGrantMineRes.tsx';
import { DtoMcpSiteQuery } from '../dto/mcpSiteQuery.ts';
import { getMcpIssuer, resolveMcpResource } from '../lib/authorization.ts';

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
    return await this.scope.service.authorizationGrant.mine(user.id, this.resource(query), {
      pageNo: query.pageNo,
      pageSize: query.pageSize,
    });
  }

  @Web.post('revokeMine/:id')
  async revokeMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @ArgValid({
      // Whole query arguments include route params; keep only the actual query contract strict.
      extractValue: async ctx => {
        const query = { ...ctx.request.query };
        delete query.id;
        return query;
      },
    })
    @Arg.query(v.object(DtoMcpSiteQuery, { strict: true }))
    query: DtoMcpSiteQuery,
  ): Promise<void> {
    this.ctx.set('Cache-Control', 'no-store');
    await this.scope.service.authorizationGrant.revokeMine(user.id, this.resource(query), id);
  }

  @Web.delete('deleteMine/:id')
  async deleteMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @ArgValid({
      // Whole query arguments include route params; keep only the actual query contract strict.
      extractValue: async ctx => {
        const query = { ...ctx.request.query };
        delete query.id;
        return query;
      },
    })
    @Arg.query(v.object(DtoMcpSiteQuery, { strict: true }))
    query: DtoMcpSiteQuery,
  ): Promise<void> {
    this.ctx.set('Cache-Control', 'no-store');
    await this.scope.service.authorizationGrant.deleteMine(user.id, this.resource(query), id);
  }

  private resource(query: DtoMcpSiteQuery): string {
    const { resource } = resolveMcpResource(
      this.app,
      new URL(getMcpIssuer(this.app)).host,
      query.ssrSiteId,
    );
    this.scope.service.authorization.configForResource(resource);
    return resource;
  }
}

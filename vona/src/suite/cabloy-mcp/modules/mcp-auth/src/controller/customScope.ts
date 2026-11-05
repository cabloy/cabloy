import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';
import { DtoCustomScopeCreate } from '../dto/customScopeCreate.tsx';
import { DtoCustomScopeMineRes, DtoCustomScopeView } from '../dto/customScopeView.tsx';
import { DtoMcpTool } from '../dto/mcpTool.ts';

export interface IControllerOptionsCustomScope extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCustomScope>('customScope', {
  summary: $locale('CustomScopeController'),
})
@Passport.public(false)
export class ControllerCustomScope extends BeanBase {
  @Web.get('mine', { summary: $locale('CustomScopeSelect') })
  @Api.body(DtoCustomScopeMineRes)
  async mine(@Arg.user() user: IUser): Promise<DtoCustomScopeMineRes> {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.scope.service.customScope.mine(user.id);
  }

  @Web.get('catalog', { summary: $locale('CustomScopeCatalog') })
  @Api.body(v.array(v.object(DtoMcpTool)))
  async catalog(): Promise<DtoMcpTool[]> {
    this.ctx.set('Cache-Control', 'no-store');
    return await this.scope.service.customScope.catalog();
  }

  @Web.post('createMine', { summary: $locale('CustomScopeCreate') })
  @Api.body(DtoCustomScopeView)
  async createMine(
    @Arg.user() user: IUser,
    @Arg.body(v.object(DtoCustomScopeCreate, { strict: true })) data: DtoCustomScopeCreate,
  ): Promise<DtoCustomScopeView> {
    this.ctx.set('Cache-Control', 'no-store');
    return this.scope.service.customScope.toView(
      await this.scope.service.customScope.createMine(user.id, data),
    );
  }

  @Web.post('updateMine/:id', { summary: $locale('CustomScopeUpdate') })
  @Api.body(DtoCustomScopeView)
  async updateMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body(v.object(DtoCustomScopeCreate, { strict: true })) data: DtoCustomScopeCreate,
  ): Promise<DtoCustomScopeView> {
    this.ctx.set('Cache-Control', 'no-store');
    return this.scope.service.customScope.toView(
      await this.scope.service.customScope.updateMine(user.id, id, data),
    );
  }

  @Web.delete('deleteMine/:id', { summary: $locale('CustomScopeDelete') })
  async deleteMine(
    @Arg.user() user: IUser,
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<void> {
    this.ctx.set('Cache-Control', 'no-store');
    await this.scope.service.customScope.deleteMine(user.id, id);
  }
}

import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelCategory } from '../model/category.ts';

import { DtoCategoryCreate } from '../dto/categoryCreate.tsx';
import { DtoCategorySelectReq } from '../dto/categorySelectReq.tsx';
import { DtoCategorySelectRes } from '../dto/categorySelectRes.tsx';
import { DtoCategoryUpdate } from '../dto/categoryUpdate.tsx';
import { DtoCategoryView } from '../dto/categoryView.tsx';

export interface IControllerOptionsCategory extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCategory>('category')
@Resource()
export class ControllerCategory extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() category: DtoCategoryCreate): Promise<TableIdentity> {
    return (await this.scope.service.category.create(category)).id;
  }

  @Web.get()
  @Api.body(DtoCategorySelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoCategorySelectReq) params: IQueryParams<ModelCategory>,
  ): Promise<DtoCategorySelectRes> {
    return await this.scope.service.category.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoCategoryView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoCategoryView | undefined> {
    return await this.scope.service.category.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() category: DtoCategoryUpdate,
  ): Promise<void> {
    await this.scope.service.category.update(id, category);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.category.delete(id);
  }
}

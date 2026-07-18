import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelProduct } from '../model/product.ts';

import { DtoProductCreate } from '../dto/productCreate.tsx';
import { DtoProductSelectReq } from '../dto/productSelectReq.tsx';
import { DtoProductSelectRes } from '../dto/productSelectRes.tsx';
import { DtoProductUpdate } from '../dto/productUpdate.tsx';
import { DtoProductView } from '../dto/productView.tsx';

export interface IControllerOptionsProduct extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsProduct>('product')
@Resource()
export class ControllerProduct extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() product: DtoProductCreate): Promise<TableIdentity> {
    return (await this.scope.service.product.create(product)).id;
  }

  @Web.get()
  @Api.body(DtoProductSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoProductSelectReq) params: IQueryParams<ModelProduct>,
  ): Promise<DtoProductSelectRes> {
    return await this.scope.service.product.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoProductView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoProductView | undefined> {
    return await this.scope.service.product.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() product: DtoProductUpdate,
  ): Promise<void> {
    await this.scope.service.product.update(id, product);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.product.delete(id);
  }
}

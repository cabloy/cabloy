import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelSku } from '../model/sku.ts';

import { DtoSkuCreate } from '../dto/skuCreate.tsx';
import { DtoSkuSelectReq } from '../dto/skuSelectReq.tsx';
import { DtoSkuSelectRes } from '../dto/skuSelectRes.tsx';
import { DtoSkuUpdate } from '../dto/skuUpdate.tsx';
import { DtoSkuView } from '../dto/skuView.tsx';

export interface IControllerOptionsSku extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsSku>('sku')
@Resource()
export class ControllerSku extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.systemAdmin()
  async create(@Arg.body() sku: DtoSkuCreate): Promise<TableIdentity> {
    return (await this.scope.service.sku.create(sku)).id;
  }

  @Web.get()
  @Api.body(DtoSkuSelectRes)
  @Passport.systemAdmin()
  async select(
    @Arg.filter(DtoSkuSelectReq) params: IQueryParams<ModelSku>,
  ): Promise<DtoSkuSelectRes> {
    return await this.scope.service.sku.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoSkuView))
  @Passport.systemAdmin()
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoSkuView | undefined> {
    return await this.scope.service.sku.view(id);
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() sku: DtoSkuUpdate,
  ): Promise<void> {
    await this.scope.service.sku.update(id, sku);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.systemAdmin()
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<void> {
    await this.scope.service.sku.delete(id);
  }
}

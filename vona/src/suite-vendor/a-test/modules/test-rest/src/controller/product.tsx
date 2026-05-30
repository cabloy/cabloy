import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

// import React from 'react';
import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Ssr } from 'vona-module-a-ssr';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { ModelProduct } from '../model/product.ts';

// import { PPDevuiRestpage, PPDevuiRestpageEntry } from 'zova-rest-cabloy-basic-admin';
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
  @Passport.roleName({ name: 'admin' })
  async create(@Arg.body() product: DtoProductCreate): Promise<TableIdentity> {
    return (await this.scope.service.product.create(product)).id;
  }

  @Web.get()
  @Api.body(DtoProductSelectRes)
  @Ssr.redirect('basic-siteadmin:admin', '/rest/resource/:resource', {
    params: { resource: 'test-rest:product' },
  })
  async select(
    @Arg.filter(DtoProductSelectReq) params: IQueryParams<ModelProduct>,
  ): Promise<DtoProductSelectRes> {
    return await this.scope.service.product.select(params);
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoProductView))
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoProductView | undefined> {
    return await this.scope.service.product.view(id);
  }

  @Web.patch(':id')
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() product: DtoProductUpdate,
  ) {
    return await this.scope.service.product.update(id, product);
  }

  @Web.delete(':id')
  async delete(@Arg.param('id', v.tableIdentity()) id: TableIdentity) {
    return await this.scope.service.product.delete(id);
  }
}

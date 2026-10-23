import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCategoryPublicSelectReq } from '../dto/categoryPublicSelectReq.tsx';
import { DtoCategoryPublicSelectRes } from '../dto/categoryPublicSelectRes.tsx';
import { DtoProductPublicDetail } from '../dto/productPublicDetail.tsx';
import { DtoProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';

export interface IControllerOptionsCatalog extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCatalog>({ path: '/mcp/test/catalog' })
export class ControllerCatalog extends BeanBase {
  @Web.get('categories')
  @Api.body(DtoCategoryPublicSelectRes)
  @Passport.public()
  async categories(
    @Arg.query(v.object(DtoCategoryPublicSelectReq)) query: DtoCategoryPublicSelectReq,
  ): Promise<DtoCategoryPublicSelectRes> {
    return this.scope.service.catalog.categories(query);
  }

  @Web.get('products')
  @Api.body(DtoProductPublicSelectRes)
  @Passport.public()
  async products(
    @Arg.query(v.object(DtoProductPublicSelectReq)) query: DtoProductPublicSelectReq,
  ): Promise<DtoProductPublicSelectRes> {
    return this.scope.service.catalog.selectPublic(query);
  }

  @Web.get('products/:id')
  @Api.body(v.optional(), v.object(DtoProductPublicDetail))
  @Passport.public()
  async detail(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoProductPublicDetail | undefined> {
    return this.scope.service.catalog.findPublicById(id);
  }
}

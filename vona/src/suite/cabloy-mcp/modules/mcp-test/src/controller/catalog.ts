import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Mcp, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCategoryPublicSelectReq } from '../dto/categoryPublicSelectReq.tsx';
import { DtoCategoryPublicSelectRes } from '../dto/categoryPublicSelectRes.tsx';
import { DtoProductPublicDetail } from '../dto/productPublicDetail.tsx';
import { DtoProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';

export interface IControllerOptionsCatalog extends IDecoratorControllerOptions {}

@Mcp.tool()
@Controller<IControllerOptionsCatalog>({ path: '/mcp/test/catalog' })
export class ControllerCatalog extends BeanBase {
  @Mcp.tool({
    name: 'commerce_categories_list',
    description:
      'List published categories in the synthetic MCP test directory, including categories without available products.',
  })
  @Web.get('categories')
  @Api.body(DtoCategoryPublicSelectRes)
  @Passport.public()
  async categories(
    @Arg.query(v.object(DtoCategoryPublicSelectReq)) query: DtoCategoryPublicSelectReq,
  ): Promise<DtoCategoryPublicSelectRes> {
    return this.scope.service.catalog.categories(query);
  }

  @Mcp.tool({
    name: 'commerce_products_search',
    description: 'Search published, available products using the synthetic MCP test catalog.',
  })
  @Web.get('products')
  @Api.body(DtoProductPublicSelectRes)
  @Passport.public()
  async products(
    @Arg.query(v.object(DtoProductPublicSelectReq)) query: DtoProductPublicSelectReq,
  ): Promise<DtoProductPublicSelectRes> {
    return this.scope.service.catalog.selectPublic(query);
  }

  @Mcp.tool({
    name: 'commerce_product_detail',
    description: 'View one published, available product using the synthetic MCP test catalog.',
  })
  @Web.get('products/:id')
  @Api.body(v.optional(), v.object(DtoProductPublicDetail))
  @Passport.public()
  async detail(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
  ): Promise<DtoProductPublicDetail | undefined> {
    return this.scope.service.catalog.findPublicById(id);
  }

  @Mcp.tool({ name: 'commerce_categories_list' })
  @Mcp.exclude()
  @Web.get('excluded')
  @Api.body(DtoCategoryPublicSelectRes)
  @Passport.public()
  async excluded(): Promise<DtoCategoryPublicSelectRes> {
    throw new Error('excluded MCP fixture must never execute');
  }
}

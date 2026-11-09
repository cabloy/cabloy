import type { TableIdentity } from 'table-identity';
import type { TypeQueryInput } from 'vona-module-a-orm';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { $compileQuery } from 'vona-module-a-orm';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoOrderCreate } from '../dto/orderCreate.ts';
import { orderQuery, DtoOrderQuery } from '../dto/orderQuery.ts';
import { orderQueryPage, DtoOrderQueryPage } from '../dto/orderQueryPage.ts';
import { DtoOrderSelectRes } from '../dto/orderSelectRes.ts';
import { DtoOrderSelectResItem } from '../dto/orderSelectResItem.ts';
import { DtoOrderUpdate } from '../dto/orderUpdate.ts';

export interface IControllerOptionsOrder extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsOrder>('order')
export class ControllerOrder extends BeanBase {
  @Web.post('create')
  @Api.body(v.tableIdentity())
  async create(@Arg.body() data: DtoOrderCreate): Promise<TableIdentity> {
    return (await this.scope.model.order.insert(data)).id;
  }

  @Web.post('update/:id')
  async update(@Arg.param('id') id: TableIdentity, @Arg.body() data: DtoOrderUpdate) {
    return await this.scope.model.order.updateById(id, data);
  }

  @Web.get('findAll')
  @Api.body(v.array(DtoOrderSelectResItem))
  async findAll(
    @Arg.filter(DtoOrderQuery) params: TypeQueryInput<typeof orderQuery>,
  ): Promise<DtoOrderSelectResItem[]> {
    return this.scope.model.order.select({
      ...$compileQuery(this.scope.model.order, orderQuery, params),
      include: {
        products: true,
      },
    });
  }

  @Web.get('findMany')
  @Api.body(DtoOrderSelectRes)
  async findMany(@Arg.filter(DtoOrderQueryPage) params: TypeQueryInput<typeof orderQueryPage>) {
    return this.scope.model.order.selectAndCount({
      ...$compileQuery(this.scope.model.order, orderQueryPage, params),
      include: {
        products: true,
      },
    });
  }
}

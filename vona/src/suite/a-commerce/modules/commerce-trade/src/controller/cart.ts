import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCartAddItem } from '../dto/cartAddItem.tsx';
import { DtoCartUpdateItem } from '../dto/cartUpdateItem.tsx';
import { DtoCartView } from '../dto/cartView.tsx';

export interface IControllerOptionsCart extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCart>('cart')
export class ControllerCart extends BeanBase {
  @Web.get()
  @Api.body(DtoCartView)
  async current(): Promise<DtoCartView> {
    return await this.scope.service.cart.current();
  }

  @Web.post('items')
  @Api.body(DtoCartView)
  async addItem(@Arg.body() command: DtoCartAddItem): Promise<DtoCartView> {
    return await this.scope.service.cart.addItem(command);
  }

  @Web.patch('items/:id')
  @Api.body(DtoCartView)
  async updateItem(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoCartUpdateItem,
  ): Promise<DtoCartView> {
    return await this.scope.service.cart.updateItem(id, command);
  }

  @Web.delete('items/:id')
  @Api.body(DtoCartView)
  async deleteItem(@Arg.param('id', v.tableIdentity()) id: TableIdentity): Promise<DtoCartView> {
    return await this.scope.service.cart.deleteItem(id);
  }

  @Web.delete('items')
  @Api.body(DtoCartView)
  async clear(): Promise<DtoCartView> {
    return await this.scope.service.cart.clear();
  }
}

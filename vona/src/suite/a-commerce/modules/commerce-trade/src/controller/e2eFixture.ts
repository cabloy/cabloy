import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

export interface IControllerOptionsE2eFixture extends IDecoratorControllerOptions {}

// Not part of the application contract: this exists solely for owned, local E2E data.
@Controller<IControllerOptionsE2eFixture>({
  path: 'e2eFixture',
  meta: { mode: ['dev', 'test'] },
})
@Api.exclude()
export class ControllerE2eFixture extends BeanBase {
  @Web.post('catalogue')
  async createCatalogue() {
    return await this.scope.service.e2eFixture.createCatalogue();
  }

  @Web.post('order/:orderId/payment/:attemptId/dispatch')
  async dispatchPayment(
    @Arg.param('orderId', v.tableIdentity()) orderId: TableIdentity,
    @Arg.param('attemptId', v.tableIdentity()) attemptId: TableIdentity,
  ) {
    return await this.scope.service.e2eFixture.dispatchPayment(orderId, attemptId);
  }

  @Web.post('order/:orderId/refund/:attemptId/dispatch')
  async dispatchRefund(
    @Arg.param('orderId', v.tableIdentity()) orderId: TableIdentity,
    @Arg.param('attemptId', v.tableIdentity()) attemptId: TableIdentity,
  ) {
    return await this.scope.service.e2eFixture.dispatchRefund(orderId, attemptId);
  }

  @Web.delete('order/:orderId')
  async removeOrder(@Arg.param('orderId', v.tableIdentity()) orderId: TableIdentity) {
    await this.scope.service.e2eFixture.removeOrder(orderId);
  }

  @Web.delete('customer')
  async removeCustomer() {
    await this.scope.service.e2eFixture.removeCustomer();
  }

  @Web.delete('catalogue/:categoryId')
  async removeCatalogue(@Arg.param('categoryId', v.tableIdentity()) categoryId: TableIdentity) {
    await this.scope.service.e2eFixture.removeCatalogue(categoryId);
  }
}

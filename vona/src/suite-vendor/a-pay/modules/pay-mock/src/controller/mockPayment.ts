import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoMockPaymentComplete } from '../dto/mockPaymentComplete.tsx';
import { DtoMockPaymentReceipt } from '../dto/mockPaymentReceipt.tsx';

export interface IControllerOptionsMockPayment extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsMockPayment>('mock/payment-session', {
  meta: { mode: ['dev', 'test'] },
})
export class ControllerMockPayment extends BeanBase {
  @Web.post(':id/complete')
  @Api.body(DtoMockPaymentReceipt)
  async complete(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() command: DtoMockPaymentComplete,
  ): Promise<DtoMockPaymentReceipt> {
    return await this.scope.service.payMock.completePaymentSession(id, command.outcome);
  }
}

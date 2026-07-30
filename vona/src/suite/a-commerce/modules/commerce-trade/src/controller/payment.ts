import type { TableIdentity } from 'table-identity';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, v } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoPaymentOutcomeCreate } from '../dto/paymentOutcomeCreate.tsx';
import { DtoPaymentOutcomeResult } from '../dto/paymentOutcomeResult.tsx';

export interface IControllerOptionsPayment extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsPayment>('payment')
export class ControllerPayment extends BeanBase {
  @Web.post(':attemptId/outcome')
  @Api.body(DtoPaymentOutcomeResult)
  async outcome(
    @Arg.param('attemptId', v.tableIdentity()) attemptId: TableIdentity,
    @Arg.body() command: DtoPaymentOutcomeCreate,
  ): Promise<DtoPaymentOutcomeResult> {
    if (this.app.meta.env.META_MODE === 'prod') {
      this.app.throw(404, 'payment outcome endpoint is disabled');
    }
    return await this.scope.service.order.applyPaymentOutcome(attemptId, command);
  }
}

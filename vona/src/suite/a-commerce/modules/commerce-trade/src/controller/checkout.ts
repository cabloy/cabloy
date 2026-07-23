import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCheckoutCreate } from '../dto/checkoutCreate.tsx';
import { DtoCheckoutResult } from '../dto/checkoutResult.tsx';

export interface IControllerOptionsCheckout extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCheckout>('checkout')
export class ControllerCheckout extends BeanBase {
  @Web.post()
  @Api.body(DtoCheckoutResult)
  async create(@Arg.body() command: DtoCheckoutCreate): Promise<DtoCheckoutResult> {
    return await this.scope.service.order.checkout(command);
  }
}

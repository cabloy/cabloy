import type { IUser } from 'vona-module-a-user';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoCheckoutCreate } from '../dto/checkoutCreate.tsx';
import { DtoCheckoutPaymentMethods } from '../dto/checkoutPaymentMethods.tsx';
import { DtoCheckoutResult } from '../dto/checkoutResult.tsx';

export interface IControllerOptionsCheckout extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsCheckout>('checkout')
export class ControllerCheckout extends BeanBase {
  @Web.get('payment-methods')
  @Api.body(DtoCheckoutPaymentMethods)
  async paymentMethods(@Arg.user() user: IUser): Promise<DtoCheckoutPaymentMethods> {
    const candidates =
      await this.$scope.commercePayment.service.commercePayScene.availableProviderCandidates(
        user.id,
      );
    const items = candidates.map(candidate => ({
      key: candidate.key,
      label: candidate.key === 'paypal' ? 'PayPal' : 'Mock payment',
      interaction: candidate.key === 'paypal' ? ('redirect' as const) : ('embedded' as const),
    }));
    const defaultKey = items.find(item => item.key === 'mock')?.key ?? items[0]!.key;
    return { items, defaultKey };
  }

  @Web.post()
  @Api.body(DtoCheckoutResult)
  async create(@Arg.body() command: DtoCheckoutCreate): Promise<DtoCheckoutResult> {
    return await this.scope.service.order.checkout(command);
  }
}

import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type {
  TypeEventEmailConfirmCallbackData,
  TypeEventEmailConfirmCallbackResult,
} from 'vona-module-a-mailconfirm';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventEmailConfirmCallbackData;
type TypeEventResult = TypeEventEmailConfirmCallbackResult;

@EventListener({ match: 'a-mailconfirm:emailConfirmCallback' })
export class EventListenerEmailConfirmCallback
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    _next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    // check cache
    if (!data) {
      return this.scope.locale.ConfirmationEmailExpired();
    }
    // activate
    const user = await this.bean.user.findOneById(data.userId);
    await this.bean.user.activate(user!);
    // ok
    return this.scope.locale.ConfirmationEmailSucceeded();
  }
}

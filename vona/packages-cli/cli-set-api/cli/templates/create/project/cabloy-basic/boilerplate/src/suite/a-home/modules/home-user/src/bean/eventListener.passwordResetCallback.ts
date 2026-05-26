import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type {
  TypeEventPasswordResetCallbackData,
  TypeEventPasswordResetCallbackResult,
} from 'vona-module-a-mailconfirm';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventPasswordResetCallbackData;
type TypeEventResult = TypeEventPasswordResetCallbackResult;

@EventListener({ match: 'a-mailconfirm:passwordResetCallback' })
export class EventListenerPasswordResetCallback
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    _next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    // check cache
    if (!data) {
      return this.scope.locale.PasswordResetEmailExpired();
    }
    // maybe mock captcha token2 to do secendary verify
    // todo: redirect to frontend
    throw new Error('Not Implemented');
  }
}

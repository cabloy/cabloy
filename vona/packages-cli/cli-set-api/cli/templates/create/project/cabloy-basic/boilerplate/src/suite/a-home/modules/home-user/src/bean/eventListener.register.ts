import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type { IUser, TypeEventRegisterData, TypeEventRegisterResult } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventRegisterData;
type TypeEventResult = TypeEventRegisterResult;

@EventListener({ match: 'a-user:register' })
export class EventListenerRegister
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    // next: registered
    const user = (await next()) as IUser;
    // mail: activate
    if (!data.autoActivate && user.email) {
      await this.bean.mailConfirm.emailConfirm(user);
    }
    return user;
  }
}

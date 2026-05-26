import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type { IUser, TypeEventActivateData, TypeEventActivateResult } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventActivateData;
type TypeEventResult = TypeEventActivateResult;

@EventListener({ match: 'a-user:activate' })
export class EventListenerActivate
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    const user = data as IUser;
    if (user.name === 'admin' && !this.scope.config.disableRoleAdmin) {
      // role: admin
      const roleAdmin = await this.scope.model.role.get({ name: 'admin' });
      await this.bean.role.addUserId(roleAdmin!.id, user.id);
    }
    // next
    return next();
  }
}

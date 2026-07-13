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
    const roleRegisteredUser = await this.scope.model.role.get({ name: 'registeredUser' });
    await this.bean.role.addUserId(roleRegisteredUser!.id, user.id);
    if (user.name === 'admin' && !this.scope.config.disableBootstrapSystemAdmin) {
      const roleSystemAdmin = await this.scope.model.role.get({ name: 'systemAdmin' });
      await this.bean.role.addUserId(roleSystemAdmin!.id, user.id);
    }
    // next
    return next();
  }
}

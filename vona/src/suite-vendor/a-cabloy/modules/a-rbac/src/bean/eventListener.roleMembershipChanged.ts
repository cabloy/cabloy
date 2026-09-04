import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type {
  TypeEventRoleMembershipChangedData,
  TypeEventRoleMembershipChangedResult,
} from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventRoleMembershipChangedData;
type TypeEventResult = TypeEventRoleMembershipChangedResult;

@EventListener({ match: 'a-user:roleMembershipChanged' })
export class EventListenerRoleMembershipChanged
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    await this.scope.event.policyInvalidated.emit({ kind: 'role' });
    return await next(data);
  }
}

import type { IEventExecute, NextEventSync } from 'vona-module-a-event';
import type { TypeEventClientNameRealData, TypeEventClientNameRealResult } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventClientNameRealData;
type TypeEventResult = TypeEventClientNameRealResult;

@EventListener({ match: 'a-orm:clientNameReal' })
export class EventListenerClientNameReal
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  execute(
    data: TypeEventData,
    next: NextEventSync<TypeEventData, TypeEventResult>,
  ): TypeEventResult {
    // reads/writes
    if (
      this.scope.service.datasharding.getClientReads().includes(data) ||
      this.scope.service.datasharding.getClientWrites().includes(data)
    ) {
      return this.$scope.orm.service.database.getDefaultClientName();
    }
    // next
    return next();
  }
}

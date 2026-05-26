import type { IEventExecute, NextEvent } from 'vona-module-a-event';
import type { TypeEventHmrReloadData, TypeEventHmrReloadResult } from 'vona-module-a-hmr';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

type TypeEventData = TypeEventHmrReloadData;
type TypeEventResult = TypeEventHmrReloadResult;

@EventListener({ match: 'a-hmr:hmrReload' })
export class EventListenerHmrReload
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    await next();
    if (data.beanOptions?.scene === 'meta' && data.beanOptions.name === 'election') {
      this.app.bean.worker.reload();
    }
  }
}

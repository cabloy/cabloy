import type { IEventExecute, NextEvent } from 'vona-module-a-event';

import { BeanBase } from 'vona';
import { EventListener } from 'vona-module-a-event';

import type { TypeEventHelloEchoData, TypeEventHelloEchoResult } from './event.helloEcho.ts';

type TypeEventData = TypeEventHelloEchoData;
type TypeEventResult = TypeEventHelloEchoResult;

@EventListener({ match: 'test-vona:helloEcho' })
export class EventListenerHelloEcho
  extends BeanBase
  implements IEventExecute<TypeEventData, TypeEventResult>
{
  async execute(
    data: TypeEventData,
    next: NextEvent<TypeEventData, TypeEventResult>,
  ): Promise<TypeEventResult> {
    // next
    const result = await next();
    return `${data.text} ${result}`;
  }
}

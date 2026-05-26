import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { ISendEventOptions } from '../types/socketEvent.ts';

export interface TypeBroadcastSendJobData {
  id: string;
  eventName: PropertyKey;
  data?: unknown;
  options?: ISendEventOptions;
}

@Broadcast()
export class BroadcastSend
  extends BeanBroadcastBase<TypeBroadcastSendJobData>
  implements IBroadcastExecute<TypeBroadcastSendJobData>
{
  async execute(data: TypeBroadcastSendJobData, isEmitter?: boolean) {
    const { id, eventName, data: eventData, options } = data;
    if (!isEmitter) {
      this.scope.service.socketEvent.sendWorker(id, eventName, eventData, options);
    }
  }
}

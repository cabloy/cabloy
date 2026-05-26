import type { IBroadcastExecute } from 'vona-module-a-broadcast';

import { BeanBroadcastBase, Broadcast } from 'vona-module-a-broadcast';

import type { ISendEventOptions } from '../types/socketEvent.ts';
import type { ISocketNamespaceRecord } from '../types/socketNamespace.ts';

export interface TypeBroadcastBroadcastJobData {
  namespace: keyof ISocketNamespaceRecord;
  eventName: PropertyKey;
  data?: unknown;
  options?: ISendEventOptions;
}

@Broadcast()
export class BroadcastBroadcast
  extends BeanBroadcastBase<TypeBroadcastBroadcastJobData>
  implements IBroadcastExecute<TypeBroadcastBroadcastJobData>
{
  async execute(data: TypeBroadcastBroadcastJobData, isEmitter?: boolean) {
    const { namespace, eventName, data: eventData, options } = data;
    if (!isEmitter) {
      this.scope.service.socketEvent.broadcastWorker(namespace, eventName, eventData, options);
    }
  }
}

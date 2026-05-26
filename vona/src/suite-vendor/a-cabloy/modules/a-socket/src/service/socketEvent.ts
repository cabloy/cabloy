import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ISendEventOptions } from '../types/socketEvent.ts';
import type { ISocketNamespaceRecord } from '../types/socketNamespace.ts';

@Service()
export class ServiceSocketEvent extends BeanBase {
  send(id: string, eventName: PropertyKey, data?: unknown, options?: ISendEventOptions) {
    this.sendWorker(id, eventName, data, options);
    this.scope.broadcast.send.emit({ id, eventName, data, options });
  }

  sendWorker(id: string, eventName: PropertyKey, data?: unknown, options?: ISendEventOptions) {
    this.bean.socket.clients[id]?.sendEvent(eventName, data, options);
  }

  broadcast(
    namespace: keyof ISocketNamespaceRecord,
    eventName: PropertyKey,
    data?: unknown,
    options?: ISendEventOptions,
  ) {
    this.broadcastWorker(namespace, eventName, data, options);
    this.scope.broadcast.broadcast.emit({ namespace, eventName, data, options });
  }

  broadcastWorker(
    namespace: keyof ISocketNamespaceRecord,
    eventName: PropertyKey,
    data?: unknown,
    options?: ISendEventOptions,
  ) {
    const ids = this.bean.socket.clientsNamespace[namespace];
    if (!ids) return;
    for (const id of ids) {
      this.bean.socket.clients[id]?.sendEvent(eventName, data, options);
    }
  }
}

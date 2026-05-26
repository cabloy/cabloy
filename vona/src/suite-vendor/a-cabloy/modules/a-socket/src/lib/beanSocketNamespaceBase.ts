import { BeanBase, cast } from 'vona';

import type { ISendEventOptions } from '../types/socketEvent.ts';
import type { IDecoratorSocketNamespaceOptions } from '../types/socketNamespace.ts';

export class BeanSocketNamespaceBase<EVENTS extends {}> extends BeanBase {
  send<K extends keyof EVENTS>(
    id: string,
    eventName: K,
    data?: EVENTS[K],
    options?: ISendEventOptions,
  ) {
    this.$scope.socket.service.socketEvent.send(id, eventName, data, options);
  }

  broadcast<K extends keyof EVENTS>(eventName: K, data?: EVENTS[K], options?: ISendEventOptions) {
    const namespace = cast<IDecoratorSocketNamespaceOptions>(this.$onionOptions).namespace;
    this.$scope.socket.service.socketEvent.broadcast(namespace, eventName, data, options);
  }
}

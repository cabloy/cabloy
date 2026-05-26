import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IEventRecord, TypeEventOff } from '../types/event.ts';

import { ServiceEventListener } from '../service/eventListener.ts';

@Bean()
export class BeanEvent extends BeanBase {
  on<K extends keyof IEventRecord>(eventName: K, fn: IEventRecord[K]): TypeEventOff {
    const beanEventListener = this.bean._getBeanSelector(ServiceEventListener, eventName);
    return beanEventListener.on(fn);
  }
}

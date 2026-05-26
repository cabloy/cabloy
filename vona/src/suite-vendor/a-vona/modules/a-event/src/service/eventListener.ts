import type { Next, VonaApplication } from 'vona';
import type { IOnionSlice } from 'vona-module-a-onion';

import { BeanBase, compose } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IEventRecord, TypeEventOff } from '../types/event.ts';
import type { IEventExecute, IEventListenerRecord } from '../types/eventListener.ts';

@Service()
export class ServiceEventListener extends BeanBase {
  private _eventName: keyof IEventRecord;
  private _eventHandlers: Function[] = [];
  private _composer: Function | undefined;

  protected __init__(eventName: keyof IEventRecord) {
    this._eventName = eventName;
  }

  protected async __dispose__() {
    this._composer = undefined;
  }

  get composer() {
    if (!this._composer) {
      const eventListeners = this.bean.onion.eventListener.getOnionsEnabledWrapped(item => {
        return _wrapOnion(this.app, item);
      }, this._eventName);
      const eventHandlers = [...eventListeners, ...this._eventHandlers];
      this._composer = compose(eventHandlers);
    }
    return this._composer;
  }

  on(fn: Function): TypeEventOff {
    const eventHandlers = this._eventHandlers;
    eventHandlers.push(fn);
    this._composer = undefined;
    return () => {
      const index = eventHandlers.findIndex(item => item === fn);
      if (index > -1) {
        eventHandlers.splice(index, 1);
        this._composer = undefined;
      }
    };
  }
}

function _wrapOnion<T extends keyof IEventListenerRecord>(
  app: VonaApplication,
  item: IOnionSlice<IEventListenerRecord, T>,
) {
  const fn = (data: unknown, next: Next) => {
    // execute
    const beanFullName = item.beanOptions.beanFullName;
    const beanInstance = app.bean._getBean<IEventExecute>(beanFullName as any);
    if (!beanInstance) {
      throw new Error(`event listener bean not found: ${beanFullName}`);
    }
    return beanInstance.execute(data, next);
  };
  fn._name = item.name;
  return fn;
}

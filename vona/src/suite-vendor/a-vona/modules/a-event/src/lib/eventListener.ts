import { createBeanDecorator } from 'vona';

import type { IDecoratorEventListenerOptions } from '../types/eventListener.ts';

export function EventListener(options: IDecoratorEventListenerOptions): ClassDecorator {
  return createBeanDecorator('eventListener', options);
}

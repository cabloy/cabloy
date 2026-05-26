import { createBeanDecorator } from 'vona';

import type { IDecoratorEventOptions } from '../types/event.ts';

export function Event(options?: IDecoratorEventOptions): ClassDecorator {
  return createBeanDecorator('event', options);
}

import { createBeanDecorator } from 'vona';

import type { IDecoratorQueueOptions } from '../types/queue.ts';

export function Queue(options?: IDecoratorQueueOptions): ClassDecorator {
  return createBeanDecorator('queue', options);
}

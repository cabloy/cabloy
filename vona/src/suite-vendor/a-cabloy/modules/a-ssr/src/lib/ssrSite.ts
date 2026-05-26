import type { PowerPartial } from 'vona';

import { createBeanDecorator } from 'vona';

import type { IDecoratorSsrSiteOptions } from '../types/ssrSite.ts';

export function SsrSite<T extends IDecoratorSsrSiteOptions>(
  options?: PowerPartial<T>,
): ClassDecorator {
  return createBeanDecorator('ssrSite', options);
}

import { appResource, createBeanDecorator } from 'vona';

import type { IDecoratorSsrMenuOptions } from '../types/ssrMenu.ts';

import { validateSsrMenuSite } from './ssrMenuSite.ts';

export function SsrMenu<T extends IDecoratorSsrMenuOptions<any>>(options: T): ClassDecorator {
  validateSsrMenuSite(options?.site, 'SsrMenu');
  return createBeanDecorator('ssrMenu', options, false, target => {
    const beanOptions = appResource.getBean(target)!;
    validateSsrMenuSite((beanOptions.options as T).site, beanOptions.beanFullName);
  });
}

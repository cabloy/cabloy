import { appResource, createBeanDecorator } from 'vona';

import type { IDecoratorSsrMenuGroupOptions } from '../types/ssrMenuGroup.ts';

import { validateSsrMenuSite } from './ssrMenuSite.ts';

export function SsrMenuGroup<T extends IDecoratorSsrMenuGroupOptions<any>>(
  options: T,
): ClassDecorator {
  validateSsrMenuSite(options?.site, 'SsrMenuGroup');
  return createBeanDecorator('ssrMenuGroup', options, false, target => {
    const beanOptions = appResource.getBean(target)!;
    validateSsrMenuSite((beanOptions.options as T).site, beanOptions.beanFullName);
  });
}

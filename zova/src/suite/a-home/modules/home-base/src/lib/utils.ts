import type { BeanBase, BeanContainer } from 'zova';

import { __ThisModule__ } from '../.metadata/this.js';

export function definePropertyScopeBase(bean: BeanContainer, beanInstance: BeanBase): void {
  // $scopeBase
  bean.defineProperty(beanInstance, '$scopeBase', {
    enumerable: false,
    configurable: true,
    get() {
      return bean.scope(__ThisModule__);
    },
  });
}

export function closeNearestDetails(
  event: { currentTarget?: EventTarget | null } | Event | undefined,
): void {
  const currentTarget = event && 'currentTarget' in event ? event.currentTarget : null;
  if (!(currentTarget instanceof Element)) return;

  const details = currentTarget.closest('details') as HTMLDetailsElement | null;
  if (!details) return;

  details.open = false;
}

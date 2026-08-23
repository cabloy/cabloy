import type { ContextRoute } from 'vona-module-a-web';

import { beanFullNameFromOnionName, BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { getCacheControllerRoutes } from 'vona-module-a-web';

import type { IRbacActionDescriptor } from '../types/rbac.ts';
import type { IGuardOptionsRbac } from './guard.rbac.ts';

import { rbacActionKey } from '../lib/rbac.ts';

const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');

@Bean()
export class BeanRbacCatalog extends BeanBase {
  private _catalog: Map<string, IRbacActionDescriptor> | undefined;

  getAction(route: ContextRoute): IRbacActionDescriptor | undefined {
    return this.getCatalog().get(rbacActionKey(route.controllerBeanFullName, route.action));
  }

  getCatalog(): ReadonlyMap<string, IRbacActionDescriptor> {
    if (!this._catalog) this._catalog = this.createCatalog();
    return this._catalog;
  }

  clear(): void {
    this._catalog = undefined;
  }

  private createCatalog(): Map<string, IRbacActionDescriptor> {
    const catalog = new Map<string, IRbacActionDescriptor>();
    const routesByController = getCacheControllerRoutes(this.app);
    for (const routes of Object.values(routesByController)) {
      for (const route of routes) {
        const options = route.route.meta?.[BeanFullNameGuardRbac] as IGuardOptionsRbac | undefined;
        if (!options) continue;
        const actionKey = rbacActionKey(route.controllerBeanFullName, route.action);
        catalog.set(actionKey, {
          actionKey,
          controllerBeanFullName: route.controllerBeanFullName,
          action: route.action,
          route,
          options: Object.freeze({ ...options }),
        });
      }
    }
    this.resolveActionInherit(catalog, routesByController);
    return catalog;
  }

  private resolveActionInherit(
    catalog: ReadonlyMap<string, IRbacActionDescriptor>,
    routesByController: Record<string, ContextRoute[]>,
  ): void {
    for (const descriptor of catalog.values()) {
      if (!descriptor.options.actionInherit) continue;
      const routes = routesByController[descriptor.controllerBeanFullName] ?? [];
      const routesByAction = new Map(routes.map(route => [route.action, route]));
      descriptor.actionInheritKey = this.resolveActionInheritKey(
        descriptor,
        catalog,
        routesByAction,
      );
    }
  }

  private resolveActionInheritKey(
    descriptor: IRbacActionDescriptor,
    catalog: ReadonlyMap<string, IRbacActionDescriptor>,
    routesByAction: ReadonlyMap<string, ContextRoute>,
  ): string {
    const seen = new Set<string>([descriptor.actionKey]);
    let current = descriptor;
    while (current.options.actionInherit) {
      const action = current.options.actionInherit;
      if (action === current.action) {
        throw new Error(`RBAC actionInherit cannot reference itself: ${current.actionKey}`);
      }
      const route = routesByAction.get(action);
      if (!route) {
        throw new Error(`RBAC actionInherit target not found: ${current.actionKey} -> ${action}`);
      }
      const targetKey = rbacActionKey(current.controllerBeanFullName, action);
      if (seen.has(targetKey)) {
        throw new Error(`RBAC actionInherit cycle: ${descriptor.actionKey}`);
      }
      seen.add(targetKey);
      const target = catalog.get(targetKey);
      if (!target) return targetKey;
      current = target;
    }
    return current.actionKey;
  }
}

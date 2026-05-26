import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type {
  IOpenapiPermissionModeActionActions,
  IOpenapiPermissions,
  IResourceRecord,
} from 'vona-module-a-openapi';
import type {
  ContextRoute,
  ContextRouteBase,
  ContextRouteMetadata,
  IRecordResourceNameToRoutePathItem,
} from 'vona-module-a-web';

import { catchError } from '@cabloy/utils';
import { appMetadata, appResource, BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { Caching } from 'vona-module-a-caching';
import { SymbolUseOnionOptionsRouteReal } from 'vona-module-a-onion';
import { composeGuards, recordResourceNameToRoutePath } from 'vona-module-a-web';

@Bean()
export class BeanPermission extends BeanBase {
  public async clearAllCaches() {
    const cacheOpenapiSchema = this.bean.summer.cache(
      beanFullNameFromOnionName('a-permission:permission', 'summerCache'),
    );
    await cacheOpenapiSchema.clear();
  }

  protected retrievePermissionsCacheKey(info: ICachingActionKeyInfo) {
    const resource = info.args[0];
    const userId = this.ctx.passport.user?.id;
    return `${resource}_${userId}`;
  }

  @Caching.get({ cacheName: 'a-permission:permission', cacheKeyFn: 'retrievePermissionsCacheKey' })
  async retrievePermissions(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    return await this.scope.event.retrievePermissions.emit({ resource }, async () => {
      return await this.getPermissionsDefault(resource);
    });
  }

  async getPermissionsDefault(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    const routePathInfo: IRecordResourceNameToRoutePathItem =
      recordResourceNameToRoutePath[resource];
    if (!routePathInfo) throw new Error(`not found routePath of resource: ${resource}`);
    // controller options
    const controller = routePathInfo.controller;
    // controller options
    const beanOptions = appResource.getBean(controller);
    if (!beanOptions) throw new Error('invalid controller');
    const controllerBeanFullName = beanOptions.beanFullName;
    // descs
    const descs = Object.getOwnPropertyDescriptors(controller.prototype);
    const actionsIgnore = this.scope.config.permission.actionsIgnore;
    const actionKeys = Object.keys(descs).filter(
      actionKey => !['constructor'].includes(actionKey) && !actionsIgnore.includes(actionKey),
    );
    // actions
    const permissionsActions: IOpenapiPermissionModeActionActions = {};
    for (const actionKey of actionKeys) {
      const desc = descs[actionKey];
      if (!desc.value || typeof desc.value !== 'function') continue;
      const routeReal: ContextRouteMetadata = appMetadata.getMetadata(
        SymbolUseOnionOptionsRouteReal,
        controller.prototype,
        actionKey,
      )!;
      const route: Partial<ContextRoute> = {
        controller,
        controllerBeanFullName,
        action: actionKey,
        route: routeReal,
      };
      permissionsActions[actionKey] = await this._getPermissionOfAction(route);
    }
    return { actions: permissionsActions };
  }

  private async _getPermissionOfAction(route: Partial<ContextRoute>) {
    const routePrev = this.ctx.route;
    this.ctx.route = route as ContextRoute;
    const composer = composeGuards(this.app, route as ContextRouteBase);
    const [_, error] = await catchError(() => {
      return composer(this.ctx);
    });
    this.ctx.route = routePrev;
    return !error;
  }
}

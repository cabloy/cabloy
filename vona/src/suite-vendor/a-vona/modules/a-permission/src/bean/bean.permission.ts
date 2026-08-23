import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type {
  IOpenapiPermissionAction,
  IOpenapiPermissionModeActionActions,
  IOpenapiPermissions,
  IResourceRecord,
} from 'vona-module-a-openapi';
import type { IGuardOptionsPassport } from 'vona-module-a-user';
import type { ContextRoute, IRecordResourceNameToRoutePathItem } from 'vona-module-a-web';

import { appResource, BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { Caching } from 'vona-module-a-caching';
import { clearRbacDecision, setRbacDecision, SymbolRbacDecision } from 'vona-module-a-rbac';
import {
  composeGuards,
  getCacheControllerRoutes,
  recordResourceNameToRoutePath,
} from 'vona-module-a-web';

const BeanFullNameGuardPassport = beanFullNameFromOnionName('a-user:passport', 'guard');
const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');
const GuardOptionsPassportDefault: IGuardOptionsPassport = {
  public: false,
  activated: true,
  checkAuthToken: true,
};

type TGuardMeta = Record<string, unknown>;

@Bean()
export class BeanPermission extends BeanBase {
  public async clearAllCaches(): Promise<void> {
    const cachePermissionUser = this.bean.summer.cache(
      beanFullNameFromOnionName('a-permission:permissionUser', 'summerCache'),
    );
    const cachePermissionActionByRoles = this.bean.summer.cache(
      beanFullNameFromOnionName('a-permission:permissionActionByRoles', 'summerCache'),
    );
    const cachePermissionActionByUser = this.bean.summer.cache(
      beanFullNameFromOnionName('a-permission:permissionActionByUser', 'summerCache'),
    );
    await cachePermissionUser.clear();
    await cachePermissionActionByRoles.clear();
    await cachePermissionActionByUser.clear();
  }

  protected retrievePermissionsCacheKey(info: ICachingActionKeyInfo): string {
    const resource = info.args[0];
    const userId = this.ctx.passport.user?.id;
    const instanceName = this.ctx.instanceName ?? 'default';
    return `user:${resource}:instance:${instanceName}:user:${userId ?? 'anonymous'}`;
  }

  protected retrievePermissionActionByRolesCacheKey(info: ICachingActionKeyInfo): string {
    const [resource, actionKey] = info.args as [keyof IResourceRecord, string];
    const roleIdsKey = this._extractCurrentRoleIdsSorted().join(',') || 'none';
    const instanceName = this.ctx.instanceName ?? 'default';
    return `action:${resource}:${actionKey}:instance:${instanceName}:roles:${roleIdsKey}`;
  }

  protected retrievePermissionActionByUserCacheKey(info: ICachingActionKeyInfo): string {
    const [resource, actionKey] = info.args as [keyof IResourceRecord, string];
    const userId = this.ctx.passport.user?.id;
    const roleIdsKey = this._extractCurrentRoleIdsSorted().join(',') || 'none';
    const instanceName = this.ctx.instanceName ?? 'default';
    return `action:${resource}:${actionKey}:instance:${instanceName}:user:${userId ?? 'anonymous'}:roles:${roleIdsKey}`;
  }

  @Caching.get({
    cacheName: 'a-permission:permissionUser',
    cacheKeyFn: 'retrievePermissionsCacheKey',
  })
  async retrievePermissions(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    return await this.scope.event.retrievePermissions.emit({ resource }, async () => {
      return await this.retrievePermissionsDefault(resource);
    });
  }

  protected async retrievePermissionsDefault(
    resource: keyof IResourceRecord,
  ): Promise<IOpenapiPermissions> {
    return await this.getPermissionsDefault(resource);
  }

  async getPermissionsDefault(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    const actionsIgnore = this.scope.config.permission.actionsIgnore;
    const actionRoutes = this._getControllerRoutes(resource).filter(
      route => !actionsIgnore.includes(route.action),
    );
    const permissionsActions: IOpenapiPermissionModeActionActions = {};
    for (const route of actionRoutes) {
      permissionsActions[route.action] = await this.retrievePermissionAction(
        resource,
        route.action,
      );
    }
    return { actions: permissionsActions };
  }

  /**
   * Returns only the final boolean permission result for server-side callers that
   * do not need the browser-safe RBAC matcher projection.
   */
  public async checkPermissionAction(
    resource: keyof IResourceRecord,
    actionKey: string,
  ): Promise<boolean> {
    const permission = await this.retrievePermissionAction(resource, actionKey);
    return typeof permission === 'boolean' ? permission : permission.allowed;
  }

  public async retrievePermissionAction(
    resource: keyof IResourceRecord,
    actionKey: string,
  ): Promise<IOpenapiPermissionAction> {
    const route = this._getControllerActionRoute(resource, actionKey);
    if (!route?.route?.meta) return false;
    if (!this._matchPassportMeta(route.route.meta)) return false;
    return await this.scope.event.retrievePermissionAction.emit(
      { resource, actionKey },
      async () => {
        const isRbac = Boolean(route.route.meta?.[BeanFullNameGuardRbac]);
        return isRbac
          ? await this.retrievePermissionActionByUser(resource, actionKey)
          : await this.retrievePermissionActionByRoles(resource, actionKey);
      },
    );
  }

  @Caching.get({
    cacheName: 'a-permission:permissionActionByRoles',
    cacheKeyFn: 'retrievePermissionActionByRolesCacheKey',
  })
  protected async retrievePermissionActionByRoles(
    resource: keyof IResourceRecord,
    actionKey: string,
  ): Promise<IOpenapiPermissionAction> {
    const route = this._getControllerActionRoute(resource, actionKey);
    if (!route?.route?.meta) return false;
    return await this._evaluatePermissionAction(route);
  }

  @Caching.get({
    cacheName: 'a-permission:permissionActionByUser',
    cacheKeyFn: 'retrievePermissionActionByUserCacheKey',
  })
  protected async retrievePermissionActionByUser(
    resource: keyof IResourceRecord,
    actionKey: string,
  ): Promise<IOpenapiPermissionAction> {
    const route = this._getControllerActionRoute(resource, actionKey);
    if (!route?.route?.meta) return false;
    return await this._evaluatePermissionAction(route);
  }

  private _getRoutePathInfo(resource: keyof IResourceRecord): IRecordResourceNameToRoutePathItem {
    const routePathInfo = recordResourceNameToRoutePath[resource];
    if (!routePathInfo) throw new Error(`not found routePath of resource: ${resource}`);
    return routePathInfo;
  }

  private _getControllerRoutes(resource: keyof IResourceRecord): ContextRoute[] {
    const routePathInfo = this._getRoutePathInfo(resource);
    const controller = routePathInfo.controller;
    const beanOptions = appResource.getBean(controller);
    if (!beanOptions) throw new Error('invalid controller');
    return getCacheControllerRoutes(this.app)[beanOptions.beanFullName] ?? [];
  }

  private _getControllerActionRoute(
    resource: keyof IResourceRecord,
    actionKey: string,
  ): ContextRoute | undefined {
    return this._getControllerRoutes(resource).find(route => route.action === actionKey);
  }

  private _extractCurrentRoleIdsSorted(): string[] {
    const roleIds = this.bean.passport.currentRoles?.map(item => String(item.id)) ?? [];
    return Array.from(new Set(roleIds)).sort();
  }

  private _matchPassportMeta(meta: TGuardMeta): boolean {
    const passportOptions = this._getPassportOptions(meta);
    return this._matchPassportOptions(passportOptions);
  }

  private _getPassportOptions(meta: TGuardMeta): IGuardOptionsPassport {
    return {
      ...GuardOptionsPassportDefault,
      ...(meta[BeanFullNameGuardPassport] as Partial<IGuardOptionsPassport> | undefined),
    };
  }

  private _matchPassportOptions(
    options: Pick<IGuardOptionsPassport, 'public' | 'activated'>,
  ): boolean {
    const isAuthenticated = this.bean.passport.isAuthenticated;
    if (!options.public && !isAuthenticated) return false;
    if (!isAuthenticated) return true;
    if (!this.bean.passport.isAccountActive) return false;
    if (options.activated === true && !this.bean.passport.isActivated) return false;
    if (options.activated === false && this.bean.passport.isActivated) return false;
    return true;
  }

  private async _evaluatePermissionAction(route: ContextRoute): Promise<IOpenapiPermissionAction> {
    const ctx = this.ctx as any;
    const routePrevious = ctx.route;
    const innerAccessPrevious = ctx.innerAccess;
    const rbacDecisionHadOwnProperty = Object.hasOwn(ctx, SymbolRbacDecision);
    const rbacDecisionPrevious = ctx[SymbolRbacDecision];
    try {
      ctx.route = route;
      ctx.innerAccess = false;
      clearRbacDecision(ctx);
      const result = await composeGuards(this.app, route)(this.ctx);
      if (result === false) return false;
      if (!route.route.meta?.[BeanFullNameGuardRbac]) return true;
      const rbacScopeCurrent = await this.bean.rbacScope.current();
      return rbacScopeCurrent.permissionProjection();
    } catch (err: any) {
      if ([401, 403].includes(err?.code)) return false;
      throw err;
    } finally {
      if (rbacDecisionHadOwnProperty) {
        setRbacDecision(ctx, rbacDecisionPrevious);
      } else {
        clearRbacDecision(ctx);
      }
      ctx.route = routePrevious;
      ctx.innerAccess = innerAccessPrevious;
    }
  }
}

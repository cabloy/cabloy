import type { Constructable } from 'vona';
import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type {
  IOpenapiPermissionAction,
  IOpenapiPermissionModeActionActions,
  IOpenapiPermissions,
  IResourceRecord,
} from 'vona-module-a-openapi';
import type { ICompileQueryOptions, TypeModelWhere, TypeQueryPredicate } from 'vona-module-a-orm';
import type { IRbacActionDescriptor, IRbacPolicyDecision } from 'vona-module-a-rbac';
import type { IGuardOptionsPassport } from 'vona-module-a-user';
import type { ContextRoute, IRecordResourceNameToRoutePathItem } from 'vona-module-a-web';

import { appResource, BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { Caching } from 'vona-module-a-caching';
import { getQueryRelationNames } from 'vona-module-a-orm';
import { clearRbacDecision, getRbacDecision, SymbolRbacDecision } from 'vona-module-a-rbac';
import {
  composeGuards,
  getCacheControllerRoutes,
  recordResourceNameToRoutePath,
} from 'vona-module-a-web';

const BeanFullNameGuardPassport = beanFullNameFromOnionName('a-user:passport', 'guard');
const BeanFullNameGuardRbac = beanFullNameFromOnionName('a-rbac:rbac', 'guard');
const BeanFullNameGuardRoleName = beanFullNameFromOnionName('a-user:roleName', 'guard');
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
    return `user:${resource}:user:${userId ?? 'anonymous'}`;
  }

  protected retrievePermissionActionByRolesCacheKey(info: ICachingActionKeyInfo): string {
    const [resource, actionKey] = info.args as [keyof IResourceRecord, string];
    const roleIdsKey = this._extractCurrentRoleIdsSorted().join(',') || 'none';
    return `action:${resource}:${actionKey}:roles:${roleIdsKey}`;
  }

  protected retrievePermissionActionByUserCacheKey(info: ICachingActionKeyInfo): string {
    const [resource, actionKey] = info.args as [keyof IResourceRecord, string];
    const userId = this.ctx.passport.user?.id;
    const roleIdsKey = this._extractCurrentRoleIdsSorted().join(',') || 'none';
    return `action:${resource}:${actionKey}:user:${userId ?? 'anonymous'}:roles:${roleIdsKey}`;
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

  /**
   * Checks current guards without permission events, result caches or matcher projection.
   * A true result does not authorize individual records or prepare data scope/owner values.
   * The target action's RBAC decision is not retained; scoped operations must authorize separately.
   */
  public async checkPermissionActionGuards(
    resource: keyof IResourceRecord,
    actionKey: string,
  ): Promise<boolean> {
    if (!Object.hasOwn(recordResourceNameToRoutePath, resource)) return false;
    const routePathInfo = recordResourceNameToRoutePath[resource];
    if (!routePathInfo || !appResource.getBean(routePathInfo.controller)) return false;
    const route = this._getControllerActionRoute(resource, actionKey);
    if (!route?.route?.meta || !this._matchPassportMeta(route.route.meta)) return false;
    return await this._evaluatePermissionAction(route, true);
  }

  /**
   * Checks a registered Controller Action's guards without permission events, result caches or
   * matcher projection. The Controller identity is resolved through the registered bean metadata.
   */
  public async checkPermissionControllerActionGuards(
    controller: Constructable | string,
    actionKey: string,
  ): Promise<boolean> {
    const route = this._getRegisteredControllerActionRoute(controller, actionKey);
    if (!route?.route?.meta || !this._matchPassportMeta(route.route.meta)) return false;
    return await this._evaluatePermissionAction(route, true);
  }

  /** Prepare trusted scopes for referenced relations using explicit server-owned action bindings. */
  public async authorizeQueryRelations(
    predicate: TypeQueryPredicate | undefined,
    bindings: Readonly<
      Record<string, { readonly controller: Constructable | string; readonly action: string }>
    >,
  ): Promise<ICompileQueryOptions['relationScopes']> {
    const names = getQueryRelationNames(predicate);
    if (!names.length) return undefined;
    const targets = names.map(name => {
      const binding = Object.hasOwn(bindings, name) ? bindings[name] : undefined;
      if (
        !binding ||
        !(
          typeof binding.controller === 'function' ||
          (typeof binding.controller === 'string' && binding.controller.trim().length > 0)
        ) ||
        typeof binding.action !== 'string' ||
        !binding.action.trim()
      ) {
        throw new TypeError(`Query relation ${name} requires an explicit action binding`);
      }
      return { name, binding };
    });
    const scopes: [string, TypeModelWhere<any> | undefined][] = [];
    for (const { name, binding } of targets) {
      scopes.push([
        name,
        await this.authorizeControllerActionQueryScope(binding.controller, binding.action),
      ]);
    }
    this.$logger.debug('permission.query relation scopes authorized');
    return Object.fromEntries(scopes);
  }

  /** Authorize a related query without running its controller or retaining its decision. */
  public async authorizeControllerActionQueryScope(
    controller: Constructable | string,
    actionKey: string,
  ): Promise<TypeModelWhere<any> | undefined> {
    const route = this._getRegisteredControllerActionRoute(controller, actionKey);
    if (!route?.route?.meta) this.app.throw(403);
    return await this.bean.executor.newCtx(
      async () => {
        const permission = this.app.bean.permission;
        if (!permission._matchPassportMeta(route.route.meta)) this.app.throw(403);
        const result = await permission._evaluatePermissionAction(route, 'queryScope');
        return result.where;
      },
      { innerAccess: false },
    );
  }

  private _getRegisteredControllerActionRoute(
    controller: Constructable | string,
    actionKey: string,
  ): ContextRoute | undefined {
    const beanOptions = appResource.getBean(controller as any);
    if (!beanOptions) return undefined;
    const routesByController = getCacheControllerRoutes(this.app);
    if (!Object.hasOwn(routesByController, beanOptions.beanFullName)) return undefined;
    const routes = routesByController[beanOptions.beanFullName];
    if (!Array.isArray(routes)) return undefined;
    return routes.find(
      candidate =>
        candidate.controllerBeanFullName === beanOptions.beanFullName &&
        candidate.action === actionKey,
    );
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

  private _matchesActionDecision(
    action: IRbacActionDescriptor | undefined,
    decision: IRbacPolicyDecision | undefined,
  ): decision is IRbacPolicyDecision {
    return Boolean(
      action &&
      Object.hasOwn(this.ctx, SymbolRbacDecision) &&
      decision?.allowed === true &&
      decision.actionKey === action.actionKey &&
      decision.action?.actionKey === action.actionKey &&
      decision.action.actionInheritKey === action.actionInheritKey &&
      decision.action.controllerBeanFullName === action.controllerBeanFullName &&
      decision.action.action === action.action,
    );
  }

  private _assertQueryScopeGuard(route: ContextRoute): 'rbac' | 'systemAdmin' {
    const meta = route.route.meta!;
    const rbac = Boolean(meta[BeanFullNameGuardRbac]);
    const role = Boolean(meta[BeanFullNameGuardRoleName]);
    // This query-scope handoff supports one explicit authorization boundary.
    if (rbac === role) this.app.throw(403);
    const onionName = rbac ? 'a-rbac:rbac' : 'a-user:roleName';
    const options = this.bean.onion.guard.getOnionOptionsDynamic(onionName);
    const selector = typeof route.routePathRaw === 'string' ? route.routePathRaw : undefined;
    if (
      !this.bean.onion.checkOnionOptionsEnabled(options, selector) ||
      options.rejectWhenDismatched === false
    ) {
      this.app.throw(403);
    }
    if (!rbac) {
      if (!('name' in options) || options.name !== 'systemAdmin') this.app.throw(403);
      return 'systemAdmin';
    }
    const action = this.bean.rbacCatalog.getAction(route);
    if (!action) this.app.throw(403);
    const effective = options as IRbacActionDescriptor['options'];
    // Scope access consumes the catalog descriptor; reject conflicting runtime overrides.
    if (
      Boolean(effective.dataScope) !== Boolean(action.options.dataScope) ||
      (effective.dataScopeField ?? 'departmentId') !==
        (action.options.dataScopeField ?? 'departmentId') ||
      (effective.dataScopeMineField ?? 'userIdOwner') !==
        (action.options.dataScopeMineField ?? 'userIdOwner') ||
      effective.actionInherit !== action.options.actionInherit
    ) {
      this.app.throw(403);
    }
    return 'rbac';
  }

  private async _evaluatePermissionAction(
    route: ContextRoute,
    guardsOnly: 'queryScope',
  ): Promise<{ where: TypeModelWhere<any> | undefined }>;
  private async _evaluatePermissionAction(route: ContextRoute, guardsOnly: true): Promise<boolean>;
  private async _evaluatePermissionAction(route: ContextRoute): Promise<IOpenapiPermissionAction>;
  private async _evaluatePermissionAction(
    route: ContextRoute,
    guardsOnly: boolean | 'queryScope' = false,
  ): Promise<IOpenapiPermissionAction | { where: TypeModelWhere<any> | undefined }> {
    const ctx = this.ctx as any;
    const routeDescriptorPrevious = Object.getOwnPropertyDescriptor(ctx, 'route');
    const innerAccessDescriptorPrevious = Object.getOwnPropertyDescriptor(ctx, 'innerAccess');
    const innerAccessPrevious = ctx.innerAccess;
    const rbacDecisionDescriptorPrevious = Object.getOwnPropertyDescriptor(ctx, SymbolRbacDecision);
    try {
      ctx.route = route;
      ctx.innerAccess = false;
      clearRbacDecision(ctx);
      const queryScopeGuard =
        guardsOnly === 'queryScope' ? this._assertQueryScopeGuard(route) : undefined;
      const result = await composeGuards(this.app, route)(this.ctx);
      if (guardsOnly === 'queryScope') {
        if (result === false) this.app.throw(403);
        if (queryScopeGuard === 'systemAdmin') {
          // An earlier matching guard must not bypass the required role check.
          if (!this.bean.passport.checkRoleName('systemAdmin')) this.app.throw(403);
          return { where: undefined };
        }
        const action = this.bean.rbacCatalog.getAction(route);
        const decision = getRbacDecision(this.ctx);
        if (!this._matchesActionDecision(action, decision)) this.app.throw(403);
        return {
          where: action!.options.dataScope
            ? (await this.bean.rbacScope.current(action!.actionKey)).where()
            : undefined,
        };
      }
      if (result === false) return false;
      if (!route.route.meta?.[BeanFullNameGuardRbac]) return true;
      if (guardsOnly) {
        return this._matchesActionDecision(
          this.bean.rbacCatalog.getAction(route),
          getRbacDecision(this.ctx),
        );
      }
      const rbacScopeCurrent = await this.bean.rbacScope.current();
      return rbacScopeCurrent.permissionProjection();
    } catch (err: any) {
      if ([401, 403].includes(err?.code)) {
        if (guardsOnly === 'queryScope') this.app.throw(403);
        return false;
      }
      throw err;
    } finally {
      if (rbacDecisionDescriptorPrevious) {
        Object.defineProperty(ctx, SymbolRbacDecision, rbacDecisionDescriptorPrevious);
      } else {
        clearRbacDecision(ctx);
      }
      if (routeDescriptorPrevious) {
        Object.defineProperty(ctx, 'route', routeDescriptorPrevious);
      } else {
        delete ctx.route;
      }
      // Vona's inherited innerAccess accessor owns its value in a context symbol.
      ctx.innerAccess = innerAccessPrevious;
      if (innerAccessDescriptorPrevious) {
        Object.defineProperty(ctx, 'innerAccess', innerAccessDescriptorPrevious);
      } else {
        delete ctx.innerAccess;
      }
    }
  }
}

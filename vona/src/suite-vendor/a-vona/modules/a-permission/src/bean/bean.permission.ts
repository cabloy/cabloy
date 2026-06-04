import type { ICachingActionKeyInfo } from 'vona-module-a-caching';
import type {
  IOpenapiPermissionModeActionActions,
  IOpenapiPermissions,
  IResourceRecord,
} from 'vona-module-a-openapi';
import type { IGuardOptionsPassport, IGuardOptionsRoleName } from 'vona-module-a-user';
import type { ContextRouteMetadata, IRecordResourceNameToRoutePathItem } from 'vona-module-a-web';

import { appMetadata, appResource, BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { Caching } from 'vona-module-a-caching';
import { SymbolUseOnionOptionsRouteReal } from 'vona-module-a-onion';
import { recordResourceNameToRoutePath } from 'vona-module-a-web';

const BeanFullNameGuardPassport = beanFullNameFromOnionName('a-user:passport', 'guard');
const BeanFullNameGuardRoleName = beanFullNameFromOnionName('a-user:roleName', 'guard');
const BeanFullNameGuardUserName = beanFullNameFromOnionName('a-user:userName', 'guard');
const BeanFullNamesGuardSupported = new Set<string>([
  BeanFullNameGuardPassport,
  BeanFullNameGuardRoleName,
  BeanFullNameGuardUserName,
]);
const GuardOptionsPassportDefault: IGuardOptionsPassport = {
  public: false,
  activated: true,
  checkAuthToken: true,
};

type TGuardMeta = Record<string, unknown>;

@Bean()
export class BeanPermission extends BeanBase {
  public async clearAllCaches(): Promise<void> {
    const cachePermission = this.bean.summer.cache(
      beanFullNameFromOnionName('a-permission:permission', 'summerCache'),
    );
    await cachePermission.clear();
  }

  protected retrievePermissionsCacheKey(info: ICachingActionKeyInfo): string {
    const resource = info.args[0];
    const userId = this.ctx.passport.user?.id;
    return `user:${resource}_${userId}`;
  }

  protected retrievePermissionsDefaultCacheKey(info: ICachingActionKeyInfo): string {
    return `default:${this._buildPermissionProfileKey(info.args[0])}`;
  }

  @Caching.get({ cacheName: 'a-permission:permission', cacheKeyFn: 'retrievePermissionsCacheKey' })
  async retrievePermissions(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    return await this.scope.event.retrievePermissions.emit({ resource }, async () => {
      return await this.retrievePermissionsDefault(resource);
    });
  }

  @Caching.get({
    cacheName: 'a-permission:permission',
    cacheKeyFn: 'retrievePermissionsDefaultCacheKey',
  })
  protected async retrievePermissionsDefault(
    resource: keyof IResourceRecord,
  ): Promise<IOpenapiPermissions> {
    return await this.getPermissionsDefault(resource);
  }

  async getPermissionsDefault(resource: keyof IResourceRecord): Promise<IOpenapiPermissions> {
    const routePathInfo: IRecordResourceNameToRoutePathItem =
      recordResourceNameToRoutePath[resource];
    if (!routePathInfo) throw new Error(`not found routePath of resource: ${resource}`);
    const controller = routePathInfo.controller;
    if (!appResource.getBean(controller)) throw new Error('invalid controller');
    const descs = Object.getOwnPropertyDescriptors(controller.prototype);
    const actionsIgnore = this.scope.config.permission.actionsIgnore;
    const actionKeys = Object.keys(descs).filter(
      actionKey => actionKey !== 'constructor' && !actionsIgnore.includes(actionKey),
    );
    const permissionsActions: IOpenapiPermissionModeActionActions = {};
    for (const actionKey of actionKeys) {
      const desc = descs[actionKey];
      if (!desc.value || typeof desc.value !== 'function') continue;
      const routeReal: ContextRouteMetadata | undefined = appMetadata.getMetadata(
        SymbolUseOnionOptionsRouteReal,
        controller.prototype,
        actionKey,
      );
      permissionsActions[actionKey] = this._getPermissionOfActionByMetadata(routeReal);
    }
    return { actions: permissionsActions };
  }

  private _buildPermissionProfileKey(resource: keyof IResourceRecord): string {
    if (!this.bean.passport.isAuthenticated) return `${resource}__anon`;
    const activated = this.bean.passport.isActivated ? 1 : 0;
    const roleNames = this._extractCurrentRoleNames();
    return `${resource}__auth__act:${activated}__roles:${roleNames.join(',')}`;
  }

  private _extractCurrentRoleNames(): string[] {
    const roleNames = this.bean.passport.currentRoles?.map(item => item.name) ?? [];
    return Array.from(new Set(roleNames)).sort();
  }

  private _getPermissionOfActionByMetadata(routeReal: ContextRouteMetadata | undefined): boolean {
    if (!routeReal?.meta) return false;
    return this._evaluatePassportGuardsStatically(routeReal.meta);
  }

  private _evaluatePassportGuardsStatically(meta: TGuardMeta): boolean {
    if (this._hasUnknownGuard(meta)) return false;
    if (this._hasDynamicUserNameGuard(meta)) return false;
    const passportOptions = this._getPassportOptions(meta);
    if (!this._matchPassportOptions(passportOptions)) return false;
    const roleNameOptions = meta[BeanFullNameGuardRoleName] as
      | Partial<IGuardOptionsRoleName>
      | undefined;
    if (!this._matchRoleNameOptions(roleNameOptions)) return false;
    return true;
  }

  private _hasUnknownGuard(meta: TGuardMeta): boolean {
    return Object.keys(meta).some(
      key => key.includes('.guard.') && !BeanFullNamesGuardSupported.has(key),
    );
  }

  private _hasDynamicUserNameGuard(meta: TGuardMeta): boolean {
    return BeanFullNameGuardUserName in meta;
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
    if (options.activated === true && !this.bean.passport.isActivated) return false;
    if (options.activated === false && this.bean.passport.isActivated) return false;
    return true;
  }

  private _matchRoleNameOptions(options: Partial<IGuardOptionsRoleName> | undefined): boolean {
    if (!options) return true;
    if (!options.name) return false;
    if (options.passWhenMatched === false) return false;
    if (options.rejectWhenDismatched === false) return false;
    const roleNamesCurrent = this._extractCurrentRoleNames();
    const roleNamesRequired = Array.isArray(options.name) ? options.name : [options.name];
    return roleNamesCurrent.some(roleName => roleNamesRequired.includes(roleName as any));
  }
}

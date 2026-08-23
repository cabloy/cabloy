import type { IRoleIdRecord, IRoleNameRecord } from 'vona-module-a-user';

export interface IResourceTableActionRecord {
  create: never;
  view: never;
  update: never;
  delete: never;
}

export interface IOpenapiPermissionActionMatcherRule {
  field: string;
  values: string[];
}

export type IOpenapiPermissionActionMatcher =
  | { mode: 'all' }
  | { mode: 'any'; rules: IOpenapiPermissionActionMatcherRule[] };

/**
 * A server-derived RBAC UX projection. It never grants backend authority.
 *
 * `matcher` contains only normalized row fields and accepted values. It excludes
 * routes, guard options, grant topology, and raw policy expressions.
 */
export interface IOpenapiPermissionActionRbac {
  key: string;
  allowed: boolean;
  matcher: IOpenapiPermissionActionMatcher;
}

export type IOpenapiPermissionAction = boolean | IOpenapiPermissionActionRbac;

export type IOpenapiPermissionModeActionActions = {
  [K in keyof IResourceTableActionRecord]?: IOpenapiPermissionAction; // IResourceTableActionRecord[K];
};

export interface IOpenapiPermissions {
  roleIds?: (keyof IRoleIdRecord)[];
  roleNames?: (keyof IRoleNameRecord)[];
  actions?: IOpenapiPermissionModeActionActions;
}

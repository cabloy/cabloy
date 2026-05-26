import type { IRoleIdRecord, IRoleNameRecord } from 'vona-module-a-user';

export interface IResourceTableActionRecord {
  create: never;
  view: never;
  update: never;
  delete: never;
}

export type IOpenapiPermissionModeActionActions = {
  [K in keyof IResourceTableActionRecord]?: boolean; // IResourceTableActionRecord[K];
};

export interface IOpenapiPermissions {
  roleIds?: (keyof IRoleIdRecord)[];
  roleNames?: (keyof IRoleNameRecord)[];
  actions?: IOpenapiPermissionModeActionActions;
}

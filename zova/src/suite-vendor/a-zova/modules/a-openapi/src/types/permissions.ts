import type { TableIdentity } from 'table-identity';

import type { TypeFormScene } from './formMeta.js';
import type { IResourceFormActionRowNameRecord } from './resource/formActionRow.js';
import type { IResourceTableActionRecord } from './resource/tableAction.js';
import type { IResourceTableActionBulkNameRecord } from './resource/tableActionBulk.js';
import type { IResourceTableActionRowNameRecord } from './resource/tableActionRow.js';

export type IOpenapiPermissionModeActionActions = {
  [K in keyof IResourceTableActionRecord]?: boolean; // IResourceTableActionRecord[K];
};

export interface IOpenapiPermissions {
  roleIds?: TableIdentity[];
  roleNames?: string[];
  actions?: IOpenapiPermissionModeActionActions;
}

export type TypeOpenapiPermissions = IOpenapiPermissions | boolean;

export interface IPermissionHintGeneral {
  actionInherit?: string;
  public?: boolean;
  formScene?: TypeFormScene | TypeFormScene[];
}

export interface IPermissionHintTableActionRow {
  actionInherit?: keyof (IResourceFormActionRowNameRecord & IResourceTableActionRowNameRecord);
  public?: boolean;
  formScene?: TypeFormScene | TypeFormScene[];
}

export interface IPermissionHintTableActionBulk {
  actionInherit?: keyof IResourceTableActionBulkNameRecord;
  public?: boolean;
}

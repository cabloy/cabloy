import { TableIdentity } from 'table-identity';
import { types } from 'typestyle';
import { TypeRenderComponentJsx } from 'zova-jsx';

import type { IPermissionHintTableActionRow } from '../permissions.js';

export type IResourceFormActionRowNameRecord = {
  [KEY in keyof IResourceFormActionRowRecord as KEY extends `${string}:action${infer Name}`
    ? Uncapitalize<Name>
    : KEY]: IResourceFormActionRowRecord[KEY];
};

export interface IResourceFormActionRowRecord {}

export interface IResourceFormActionRowOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
  resource?: string;
  id?: TableIdentity;
  permission?: IPermissionHintTableActionRow;
}

export interface IResourceRenderFormActionRowOptionsAction {
  name?: keyof IResourceFormActionRowNameRecord; // not omit operationsRow
  render?: keyof IResourceFormActionRowRecord | TypeRenderComponentJsx;
  options?: IResourceFormActionRowOptionsBase;
}

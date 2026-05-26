import { TableIdentity } from 'table-identity';
import { types } from 'typestyle';
import { TypeRenderComponentJsx } from 'zova-jsx';

import type { IPermissionHintTableActionRow } from '../permissions.js';

export type IResourceTableActionRowNameRecord = {
  [KEY in keyof IResourceTableActionRowRecord as KEY extends `${string}:action${infer Name}`
    ? Uncapitalize<Name>
    : KEY]: IResourceTableActionRowRecord[KEY];
};

export interface IResourceTableActionRowRecord {}

export interface IResourceTableActionRowOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
  resource?: string;
  id?: TableIdentity;
  permission?: IPermissionHintTableActionRow;
}

export interface IResourceRenderTableActionRowOptionsAction {
  name?: keyof IResourceTableActionRowNameRecord; // not omit operationsRow
  render?: keyof IResourceTableActionRowRecord | TypeRenderComponentJsx;
  options?: IResourceTableActionRowOptionsBase;
}

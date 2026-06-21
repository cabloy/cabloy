import { types } from 'typestyle';
import { TypeRenderComponentJsx } from 'zova-jsx';

import type { IPermissionHintDetailsActionBulk } from '../permissions.js';

export type IResourceDetailsActionBulkNameRecord = {
  [KEY in keyof IResourceDetailsActionBulkRecord as KEY extends `${string}:action${infer Name}`
    ? Uncapitalize<Name>
    : KEY]: IResourceDetailsActionBulkRecord[KEY];
};

export interface IResourceDetailsActionBulkRecord {}

export interface IResourceDetailsActionBulkOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
  permission?: IPermissionHintDetailsActionBulk;
}

export interface IResourceRenderDetailsActionBulkOptionsAction {
  name?: keyof IResourceDetailsActionBulkNameRecord; // not omit operationsBulk
  render?: keyof IResourceDetailsActionBulkRecord | TypeRenderComponentJsx;
  options?: IResourceDetailsActionBulkOptionsBase;
}

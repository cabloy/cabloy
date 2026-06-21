import { types } from 'typestyle';
import { TypeRenderComponentJsx } from 'zova-jsx';

import type { IPermissionHintDetailsActionRow } from '../permissions.js';

export type IResourceDetailsActionRowNameRecord = {
  [KEY in keyof IResourceDetailsActionRowRecord as KEY extends `${string}:action${infer Name}`
    ? Uncapitalize<Name>
    : KEY]: IResourceDetailsActionRowRecord[KEY];
};

export interface IResourceDetailsActionRowRecord {}

export interface IResourceDetailsActionRowOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
  permission?: IPermissionHintDetailsActionRow;
}

export interface IResourceRenderDetailsActionRowOptionsAction {
  name?: keyof IResourceDetailsActionRowNameRecord; // not omit operationsRow
  render?: keyof IResourceDetailsActionRowRecord | TypeRenderComponentJsx;
  options?: IResourceDetailsActionRowOptionsBase;
}

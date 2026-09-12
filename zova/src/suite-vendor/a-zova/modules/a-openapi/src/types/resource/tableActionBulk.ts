import type { TableIdentity } from 'table-identity';

import { types } from 'typestyle';
import { TypeRenderComponentJsx } from 'zova-jsx';

import type { IPermissionHintTableActionBulk } from '../permissions.js';

export type IResourceTableActionBulkNameRecord = {
  [KEY in keyof IResourceTableActionBulkRecord as KEY extends `${string}:action${infer Name}`
    ? Uncapitalize<Name>
    : KEY]: IResourceTableActionBulkRecord[KEY];
};

export interface IResourceTableActionBulkRecord {}

export interface IResourceTableSelectionPayload<TData extends {} = Record<string, unknown>> {
  ids: readonly TableIdentity[];
  rows: readonly TData[];
  count: number;
}

/** Declarative bulk-action metadata authored by a resource schema. */
export interface IResourceTableActionBulkOptionsBase {
  class?: any;
  style?: types.NestedCSSProperties;
  resource?: string;
  permission?: IPermissionHintTableActionBulk;
  requiresSelection?: boolean;
  selectedMaxIds?: number;
  disabled?: boolean;
}

/** Runtime bulk-action props supplied by the owning toolbar for the current render. */
export interface IResourceTableActionBulkPropsBase extends IResourceTableActionBulkOptionsBase {
  dynamicSelection?: IResourceTableSelectionPayload;
  dynamicDisabled?: boolean;
  dynamicDisabledReason?: string;
}

export interface IResourceRenderTableActionBulkOptionsAction {
  name?: keyof IResourceTableActionBulkNameRecord; // not omit operationsBulk
  render?: keyof IResourceTableActionBulkRecord | TypeRenderComponentJsx;
  options?: IResourceTableActionBulkOptionsBase;
}

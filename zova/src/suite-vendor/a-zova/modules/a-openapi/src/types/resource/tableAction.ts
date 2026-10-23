import {
  IResourceTableActionBulkNameRecord,
  IResourceTableActionBulkRecord,
} from './tableActionBulk.ts';
import {
  IResourceTableActionRowNameRecord,
  IResourceTableActionRowRecord,
} from './tableActionRow.ts';

export type IResourceTableActionNameRecord = IResourceTableActionRowNameRecord &
  IResourceTableActionBulkNameRecord;

export type IResourceTableActionRecord = IResourceTableActionBulkRecord &
  IResourceTableActionRowRecord;

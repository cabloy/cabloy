import {
  IResourceTableActionBulkNameRecord,
  IResourceTableActionBulkRecord,
} from './tableActionBulk.js';
import {
  IResourceTableActionRowNameRecord,
  IResourceTableActionRowRecord,
} from './tableActionRow.js';

export type IResourceTableActionNameRecord = IResourceTableActionRowNameRecord &
  IResourceTableActionBulkNameRecord;

export type IResourceTableActionRecord = IResourceTableActionBulkRecord &
  IResourceTableActionRowRecord;

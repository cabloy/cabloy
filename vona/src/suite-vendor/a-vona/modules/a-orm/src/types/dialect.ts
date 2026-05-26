import type { ITableColumns } from './columns.ts';

export interface IFetchDatabasesResultItem {
  name: string;
}

export interface IFetchIndexesResultItem {
  indexName: string;
}

export type TypeDatabaseDialectTableColumnsFn = () => Promise<ITableColumns>;

export interface IDatabaseDialectCapabilities {
  like: boolean;
  ilike: boolean;
  level: boolean;
}

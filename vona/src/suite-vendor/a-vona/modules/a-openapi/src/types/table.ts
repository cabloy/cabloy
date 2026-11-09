import type { IQueryOrder, TypeQueryPredicate } from 'vona-module-a-orm';

export interface ITablePaged {
  pageNo: number;
  pageSize?: number;
}

export interface ITableQuery {
  where?: TypeQueryPredicate;
  orders?: IQueryOrder[];
  pageNo?: number;
  pageSize?: number;
}

export interface ITableRes<Entity = any> extends ITableResPaged {
  list: Entity[];
}

export interface ITableResPaged {
  total: string;
  pageCount: number;
  pageSize: number;
  pageNo: number;
}

export interface ITablePaged {
  pageNo: number;
  pageSize?: number;
}

export interface ITableQuery {
  columns?: string[] | undefined;
  where?:
    | {
        [key: string]: unknown;
      }
    | undefined;
  orders?: string | string[][] | undefined;
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

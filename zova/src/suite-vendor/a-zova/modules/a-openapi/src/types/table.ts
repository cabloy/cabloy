export interface ITablePaged {
  pageNo: number;
  pageSize?: number;
}

export type TypeQueryOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'notIn'
  | 'eqI'
  | 'contains'
  | 'containsI'
  | 'startsWith'
  | 'startsWithI'
  | 'endsWith'
  | 'endsWithI'
  | 'isNull'
  | 'isNotNull';

export type TypeQueryScalar = string | number | boolean;
export type TypeQueryPredicate<Field extends string = string> =
  | {
      field: Field;
      op: Exclude<TypeQueryOperator, 'isNull' | 'isNotNull'>;
      value: TypeQueryScalar | TypeQueryScalar[];
    }
  | { field: Field; op: 'isNull' | 'isNotNull'; value?: never }
  | { and: TypeQueryPredicate<Field>[] }
  | { or: TypeQueryPredicate<Field>[] }
  | { not: TypeQueryPredicate<Field> };

export interface IQueryOrder<Field extends string = string> {
  field: Field;
  direction: 'asc' | 'desc';
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

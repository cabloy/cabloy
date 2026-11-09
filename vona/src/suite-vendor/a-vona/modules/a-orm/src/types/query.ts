import type { Constructable } from 'vona';
import type z from 'zod';

import type { BeanModelMeta } from '../lib/bean.model/bean.model_meta.ts';
import type {
  IAnalysisPolicy,
  TypeAnalysisModelLike,
  TypeAnalysisSelectionAggrs,
} from './analysis.ts';
import type { TypeModelOfModelLike, TypeSymbolKeyEntity } from './relations.ts';

export const SymbolQueryPolicy = Symbol.for('vona.query.policy');
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
  | { field: Field; op: 'isNull' | 'isNotNull' }
  | { and: TypeQueryPredicate<Field>[] }
  | { or: TypeQueryPredicate<Field>[] }
  | { not: TypeQueryPredicate<Field> };
export interface IQueryOrder<Field extends string = string> {
  field: Field;
  direction: 'asc' | 'desc';
}
export interface IQueryLimits {
  maxBytes: number;
  maxNodes: number;
  maxValueDepth: number;
  maxPredicateDepth: number;
  maxListItems: number;
  maxOrders: number;
  maxStringLength: number;
  maxPageSize: number;
}
export interface IQueryFieldConfig {
  readonly operators: readonly TypeQueryOperator[];
  readonly schema?: z.ZodType;
  readonly type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'identity'
    | 'timestamp'
    | 'date'
    | 'decimal'
    | 'enum';
}
export interface IQueryBinding {
  readonly modelLike: TypeAnalysisModelLike;
  readonly field: string;
  readonly localKey: string;
  readonly foreignKey: 'id';
  readonly joinType?: 'leftJoin' | 'innerJoin';
}
export interface IQueryConvenience {
  readonly field: string;
  readonly op?: TypeQueryOperator;
}
export interface IQueryConfig<
  Fields extends Record<string, IQueryFieldConfig> = Record<string, IQueryFieldConfig>,
> {
  readonly name?: string;
  readonly pagination?: false;
  readonly fields: Fields;
  readonly orderable: readonly string[];
  readonly bindings?: Readonly<Record<string, IQueryBinding>>;
  readonly conveniences?: Readonly<Record<string, IQueryConvenience>>;
  readonly defaults?: {
    readonly orders?: readonly IQueryOrder[];
    readonly pageNo?: number;
    readonly pageSize?: number;
  };
  readonly projection?: { readonly mode: 'fixed' };
  readonly limits?: Partial<IQueryLimits>;
}
export interface IQueryField extends IQueryFieldConfig {
  readonly schema: z.ZodType;
  readonly nullable: boolean;
  readonly type: NonNullable<IQueryFieldConfig['type']>;
}
export interface IQueryPolicy {
  readonly name: string;
  readonly pagination: boolean;
  readonly modelLike: TypeAnalysisModelLike;
  readonly modelClass: Constructable<BeanModelMeta>;
  readonly entityClass: Constructable;
  readonly fields: Readonly<Record<string, IQueryField>>;
  readonly orderable: readonly string[];
  readonly bindings: Readonly<Record<string, IQueryBinding>>;
  readonly conveniences: Readonly<Record<string, IQueryConvenience>>;
  readonly defaults: {
    readonly orders: readonly IQueryOrder[];
    readonly pageNo: number;
    readonly pageSize: number;
  };
  readonly projection: { readonly mode: 'fixed' };
  readonly limits: Readonly<IQueryLimits>;
}
export type TypeQueryPolicy<
  M extends TypeAnalysisModelLike,
  F extends Record<string, IQueryFieldConfig>,
> = Omit<IQueryPolicy, 'modelLike' | 'fields'> & {
  readonly modelLike: M;
  readonly fields: { readonly [K in keyof F]: IQueryField & F[K] };
};
export type TypeQueryEntity<P extends IQueryPolicy> = TypeModelOfModelLike<
  P['modelLike']
>[TypeSymbolKeyEntity];
type QueryValue<T> =
  NonNullable<T> extends Date
    ? string
    : NonNullable<T> extends TypeQueryScalar
      ? NonNullable<T>
      : TypeQueryScalar;
type QueryLeaf<P extends IQueryPolicy> = {
  [K in keyof P['fields'] & string]: {
    [O in P['fields'][K]['operators'][number]]: O extends 'isNull' | 'isNotNull'
      ? { field: K; op: O }
      : {
          field: K;
          op: O;
          value: O extends 'in' | 'notIn'
            ? QueryValue<
                K extends keyof TypeQueryEntity<P> ? TypeQueryEntity<P>[K] : TypeQueryScalar
              >[]
            : QueryValue<
                K extends keyof TypeQueryEntity<P> ? TypeQueryEntity<P>[K] : TypeQueryScalar
              >;
        };
  }[P['fields'][K]['operators'][number]];
}[keyof P['fields'] & string];
export type TypeQueryWhere<P extends IQueryPolicy> =
  | QueryLeaf<P>
  | { and: TypeQueryWhere<P>[] }
  | { or: TypeQueryWhere<P>[] }
  | { not: TypeQueryWhere<P> };
export type TypeQueryInput<P extends IQueryPolicy = IQueryPolicy> = {
  where?: TypeQueryWhere<P>;
  orders?: IQueryOrder[];
  pageNo?: number;
  pageSize?: number;
};
export type TypeQueryGroupInput<P extends IQueryPolicy, A extends IAnalysisPolicy> = Pick<
  TypeQueryInput<P>,
  'where'
> & { groups?: readonly A['groups'][number][]; aggrs?: TypeAnalysisSelectionAggrs<A['aggrs']> };
export type TypeQueryAggregateInput<P extends IQueryPolicy, A extends IAnalysisPolicy> = Pick<
  TypeQueryInput<P>,
  'where'
> & { aggrs?: TypeAnalysisSelectionAggrs<A['aggrs']> };

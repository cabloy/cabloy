import type {
  BeanModel,
  IModelSelectGroupParams,
  TypeModelGroupRelationResult,
} from 'vona-module-a-orm';

import type { ModelUserStatsGroup } from '../model/userStatsGroup.ts';

type Assert<T extends true> = T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
type Row = { id: number; name: string; age: number };

type GroupRow = TypeModelGroupRelationResult<
  Row,
  { groups: ('name' | 'age')[]; aggrs: { count: '*' } }
>;
export type MultipleGroupColumns = Assert<
  Same<Pick<GroupRow, 'name' | 'age'>, Pick<Row, 'name' | 'age'>>
>;
export type GroupColumnUnion = Assert<
  Same<TypeModelGroupRelationResult<Row, { groups: 'name' | 'age' }>, Pick<Row, 'name' | 'age'>>
>;
export type GroupAggregateAlias = Assert<Same<GroupRow['count_all'], string | undefined>>;
export type ExplicitGroupProjection = Assert<
  Same<
    TypeModelGroupRelationResult<Row, { groups: 'name'; columns: 'name' | 'age' }>,
    Pick<Row, 'name' | 'age'>
  >
>;
export type WildcardGroupProjection = Assert<
  Same<TypeModelGroupRelationResult<Row, { groups: 'name'; columns: '*' }>, Row>
>;
export type NumericHaving = Assert<
  { groups: 'name'; having: { count_all: { _gt_: 0 } } } extends IModelSelectGroupParams<Row>
    ? true
    : false
>;
export type InvalidHavingColumn = Assert<
  Same<
    'missing' extends keyof NonNullable<IModelSelectGroupParams<Row>['having']> ? true : false,
    false
  >
>;

type GroupedUser = Awaited<ReturnType<ModelUserStatsGroup['select']>>[number];
export type GroupedRelationColumn = Assert<Same<GroupedUser['posts'][number]['title'], string>>;

type RawSelect = NonNullable<Parameters<BeanModel<Row>['select']>[1]>;
type RawCount = NonNullable<Parameters<BeanModel<Row>['count']>[1]>;
export type RawOrderColumn = Assert<Same<NonNullable<RawSelect['orders']>[number][0], keyof Row>>;
export type RawWhereColumns = Assert<
  Same<keyof NonNullable<RawSelect['where']> & keyof Row, keyof Row>
>;
export type RawCountColumn = Assert<Same<RawCount['column'], keyof Row | '*' | undefined>>;

import type {
  BeanModel,
  IModelSelectGroupParams,
  TypeDtoAggrResult,
  TypeDtoGroupResult,
  TypeModelAggrRelationResult,
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
type Aggrs = { count: ['*', 'age']; sum: 'age'; avg: 'age'; min: 'age'; max: 'age' };
type Aggregate = TypeModelAggrRelationResult<{ aggrs: Aggrs }>;
export type AggregateCount = Assert<Same<Aggregate['count_all'], string | undefined>>;
export type AggregateCountColumn = Assert<Same<Aggregate['count_age'], string | undefined>>;
export type AggregateSum = Assert<Same<Aggregate['sum_age'], string | null | undefined>>;
export type AggregateAverage = Assert<Same<Aggregate['avg_age'], string | null | undefined>>;
export type AggregateMinimum = Assert<Same<Aggregate['min_age'], string | null | undefined>>;
export type AggregateMaximum = Assert<Same<Aggregate['max_age'], string | null | undefined>>;
export type AggregateDto = Assert<Same<TypeDtoAggrResult<Aggrs>, Aggregate>>;
export type GroupDto = Assert<
  Same<
    TypeDtoGroupResult<Row, Aggrs, 'age', undefined>,
    TypeModelGroupRelationResult<Row, { groups: 'age'; aggrs: Aggrs }>
  >
>;
export type CountReturn = Assert<
  Same<Awaited<ReturnType<BeanModel<Row>['count']>>, string | undefined>
>;
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
export type NumericNullableAggregateHaving = Assert<
  {
    groups: 'age';
    having: { avg_age: { _gt_: 3.5 }; sum_age: { _isNot_: null } };
  } extends IModelSelectGroupParams<Row>
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

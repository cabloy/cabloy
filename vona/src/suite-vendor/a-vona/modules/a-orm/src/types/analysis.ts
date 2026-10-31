import type { Constructable } from 'vona';

import type { BeanModelMeta } from '../lib/bean.model/bean.model_meta.ts';
import type { TypeModelWhere } from './modelWhere.ts';
import type { IModelClassRecord } from './onion/model.ts';
import type { TypeModelOfModelLike, TypeSymbolKeyEntity } from './relations.ts';

export type TypeAnalysisMode = 'group' | 'aggregate';
export type TypeAnalysisFunction = 'count' | 'sum' | 'avg' | 'min' | 'max';
export type TypeAnalysisModelLike =
  | Constructable<BeanModelMeta>
  | (() => Constructable<BeanModelMeta>)
  | keyof IModelClassRecord;
export type TypeAnalysisEntity<ModelLike extends TypeAnalysisModelLike> =
  TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity];
export type TypeAnalysisField<Entity> = Extract<keyof Entity, string>;
export type TypeAnalysisNumericField<Entity> = Exclude<
  {
    [K in keyof Entity]-?: NonNullable<Entity[K]> extends number ? K : never;
  }[keyof Entity],
  'id' | 'iid'
> &
  string;

export type TypeAnalysisAggrs = Partial<Record<TypeAnalysisFunction, readonly string[]>>;
export type TypeAnalysisAllowedAggrs<Entity> = {
  readonly count?: readonly ('*' | TypeAnalysisField<Entity>)[];
} & {
  readonly [
    K in Exclude<TypeAnalysisFunction, 'count'>
  ]?: readonly TypeAnalysisNumericField<Entity>[];
};
export type TypeAnalysisSelectionAggrs<Aggrs extends TypeAnalysisAggrs> = {
  readonly [K in keyof Aggrs]?: NonNullable<Aggrs[K]> extends readonly string[]
    ? readonly NonNullable<Aggrs[K]>[number][]
    : never;
};
export interface IAnalysisLimits {
  readonly maxGroups: number;
  readonly maxMetrics: number;
  readonly maxGroupRows: number;
}
export interface IAnalysisSelection {
  readonly groups?: readonly string[];
  readonly aggrs: TypeAnalysisAggrs;
}

/** Structural server-owned policy surface; model references must not be serialized. */
export interface IAnalysisPolicy {
  readonly modelLike: TypeAnalysisModelLike;
  readonly modelClass: Constructable<BeanModelMeta>;
  readonly groups: readonly string[];
  readonly aggrs: TypeAnalysisAggrs;
  readonly defaults: {
    readonly group?: IAnalysisSelection & { readonly groups: readonly string[] };
    readonly aggregate?: { readonly aggrs: TypeAnalysisAggrs };
  };
  readonly limits: IAnalysisLimits;
}
export type TypeAnalysisPolicy<
  ModelLike extends TypeAnalysisModelLike,
  Groups extends readonly string[],
  Aggrs extends TypeAnalysisAggrs,
> = Omit<IAnalysisPolicy, 'modelLike' | 'groups' | 'aggrs'> & {
  readonly modelLike: ModelLike;
  readonly groups: Groups;
  readonly aggrs: Aggrs;
};
export interface IAnalysisConfig<
  Groups extends readonly string[],
  Aggrs extends TypeAnalysisAggrs,
> {
  readonly groups: Groups;
  readonly aggrs: Aggrs;
  readonly defaults: {
    readonly group?: {
      readonly groups: readonly NoInfer<Groups[number]>[];
      readonly aggrs: TypeAnalysisSelectionAggrs<NoInfer<Aggrs>>;
    };
    readonly aggregate?: { readonly aggrs: TypeAnalysisSelectionAggrs<NoInfer<Aggrs>> };
  };
  readonly limits?: Partial<IAnalysisLimits>;
}

interface IAnalysisParams<Policy extends IAnalysisPolicy> {
  where?: TypeModelWhere<TypeAnalysisEntity<Policy['modelLike']>>;
  aggrs?: TypeAnalysisSelectionAggrs<Policy['aggrs']>;
  // Existing list controls remain accepted but never drive analysis execution.
  columns?: unknown;
  orders?: unknown;
  limit?: number;
  offset?: number;
  pageNo?: number;
  pageSize?: number;
  joins?: never;
  having?: never;
  distinct?: never;
  include?: never;
  with?: never;
}
export type TypeAnalysisGroupParams<Policy extends IAnalysisPolicy> = IAnalysisParams<Policy> & {
  groups?: readonly Policy['groups'][number][];
};
export type TypeAnalysisAggregateParams<Policy extends IAnalysisPolicy> =
  IAnalysisParams<Policy> & {
    groups?: never;
  };

type TypeAnalysisAlias<Column extends string> = Column extends '*' ? 'all' : Column;
export type TypeAnalysisAggregateResult<Policy extends IAnalysisPolicy> = {
  -readonly [
    Fn in keyof Policy['aggrs'] &
      TypeAnalysisFunction as Policy['aggrs'][Fn] extends readonly string[]
      ? `${Fn}_${TypeAnalysisAlias<Policy['aggrs'][Fn][number]>}`
      : never
  ]?: Fn extends 'count' ? string : string | null;
};
export type TypeAnalysisGroupResult<Policy extends IAnalysisPolicy> = Partial<
  Pick<
    TypeAnalysisEntity<Policy['modelLike']>,
    Extract<Policy['groups'][number], keyof TypeAnalysisEntity<Policy['modelLike']>>
  >
> &
  TypeAnalysisAggregateResult<Policy>;

export interface IAnalysisCapabilities {
  readonly mode: TypeAnalysisMode;
  readonly groups: readonly string[];
  readonly aggrs: TypeAnalysisAggrs;
  readonly defaults: IAnalysisSelection;
  readonly limits: IAnalysisLimits;
}

export interface IResolvedAnalysis {
  groups?: string[];
  aggrs: Partial<Record<TypeAnalysisFunction, string[]>>;
}

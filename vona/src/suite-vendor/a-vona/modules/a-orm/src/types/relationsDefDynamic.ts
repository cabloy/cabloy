import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type {
  IModelRelationIncludeWrapper,
  IModelSelectParamsJoin,
  IModelSelectParamsOrder,
} from './model.ts';
import type { TypeModelSelectAggrParamsAggrs } from './modelAggr.ts';
import type {
  TypeModelColumn,
  TypeModelColumnsPatch,
  TypeModelColumnsStrict,
  TypeModelWhere,
} from './modelWhere.ts';
import type { IModelClassRecord } from './onion/model.ts';
import type {
  TypeModelClassLike,
  TypeModelOfModelLike,
  TypeModelsClassLikeGeneral,
  TypeSymbolKeyEntity,
} from './relations.ts';
import type {
  TypeEntityTableColumnNamesOfGeneral,
  TypeEntityTableColumnsOfGeneral,
} from './relationsColumns.ts';
import type { IModelRelationOptionsMetaWrapper } from './relationsDef.ts';
import type { TypeModelSelectGroupParamsColumnNames } from './relationsGroup.ts';
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

// export type TypeModelRelationDynamic<MODELSelf extends BeanModelMeta | undefined, MODELTarget extends BeanModelMeta> =
//   IModelRelationHasOneDynamic<MODELTarget> |
//   IModelRelationBelongsToDynamic<MODELSelf, MODELTarget> |
//   IModelRelationHasManyDynamic<MODELTarget>;

// use optional ? for app config
export interface IModelRelationHasOneDynamic<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  KEY extends keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  OPTIONS extends IModelRelationOptionsOneDynamic<TypeModelOfModelLike<MODEL>> | undefined =
    undefined,
> {
  type?: 'hasOne';
  model?: TypeModelClassLike<MODEL>;
  key?: KEY;
  options?: OPTIONS;
}

export interface IModelRelationBelongsToDynamic<
  MODELSelf extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends IModelRelationOptionsOneDynamic<TypeModelOfModelLike<MODEL>> | undefined =
    undefined,
> {
  type?: 'belongsTo';
  model?: TypeModelClassLike<MODEL>;
  key?: keyof TypeModelOfModelLike<MODELSelf>[TypeSymbolKeyEntity];
  options?: OPTIONS;
}

export interface IModelRelationHasManyDynamic<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  KEY extends keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  OPTIONS extends
    | IModelRelationOptionsManyDynamic<TypeModelOfModelLike<MODEL>, ModelJoins, Group>
    | undefined = undefined,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
> {
  type?: 'hasMany';
  model?: TypeModelClassLike<MODEL>;
  key?: KEY;
  options?: OPTIONS;
}

export interface IModelRelationBelongsToManyDynamic<
  MODELMiddle extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  OPTIONS extends
    | IModelRelationOptionsManyDynamic<TypeModelOfModelLike<MODEL>, ModelJoins, Group>
    | undefined = undefined,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
> {
  type?: 'belongsToMany';
  modelMiddle?: TypeModelClassLike<MODELMiddle>;
  model?: TypeModelClassLike<MODEL>;
  keyFrom?: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity];
  keyTo?: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity];
  options?: OPTIONS;
}

export interface IModelRelationOptionsOneDynamic<MODEL extends BeanModelMeta>
  extends IModelRelationOptionsMetaWrapper, IModelRelationIncludeWrapper<MODEL> {
  columns?: TypeModelColumnsPatch<
    MODEL[TypeSymbolKeyEntity],
    TypeModelColumn<MODEL[TypeSymbolKeyEntity]>
  >;
}

export interface IModelRelationOptionsManyDynamic<
  MODEL extends BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
>
  extends
    IModelRelationOptionsMetaWrapper,
    IModelRelationIncludeWrapper<MODEL>,
    Omit<
      IModelRelationOptionsManyDynamic_Raw<
        MODEL,
        false,
        TypeModelColumn<MODEL[TypeSymbolKeyEntity]>,
        ModelJoins,
        Group
      >,
      'autoload'
    > {}

export type IModelRelationOptionsManyDynamic_Raw<
  MODEL extends BeanModelMeta,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<MODEL[TypeSymbolKeyEntity]> = TypeModelColumn<
    MODEL[TypeSymbolKeyEntity]
  >,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
> = IBuildModelRelationOptionsManyDynamic<
  MODEL[TypeSymbolKeyEntity],
  AUTOLOAD,
  COLUMNS,
  TypeEntityTableNamesOfGeneral<ModelJoins, MODEL>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, MODEL>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, MODEL>,
  Group
>;

export interface IBuildModelRelationOptionsManyDynamic<
  TRecord,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<TRecord> = TypeModelColumn<TRecord>,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
  Group extends boolean | undefined = undefined,
> extends IBuildModelSelectGeneralParamsBasicDynamic<
  TRecord,
  COLUMNS,
  TableNames,
  ColumnNames,
  Columns,
  Group
> {
  autoload?: AUTOLOAD;
}

export interface IBuildModelSelectGeneralParamsBasicDynamic<
  TRecord,
  COLUMNS extends TypeModelColumn<TRecord> = TypeModelColumn<TRecord>,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
  Group extends boolean | undefined = undefined,
> {
  distinct?: boolean | keyof TRecord | (keyof TRecord)[];
  columns?: TypeModelColumnsPatch<TRecord, COLUMNS>;
  aggrs?: TypeModelSelectAggrParamsAggrs<TRecord>;
  groups?: TypeModelColumnsStrict<TRecord>;
  where?: TypeModelWhere<TRecord, Columns>;
  joins?: IModelSelectParamsJoin<TRecord, TableNames, ColumnNames>[];
  orders?: Group extends true
    ? IModelSelectParamsOrder<TypeModelSelectGroupParamsColumnNames<TRecord>>[]
    : IModelSelectParamsOrder<ColumnNames>[];
  limit?: number;
  offset?: number;
}

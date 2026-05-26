import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { ServiceDb } from '../service/db_.ts';
import type { IDatabaseClientRecord } from './database.ts';
import type { TypeModelSelectAggrParamsAggrs } from './modelAggr.ts';
import type { IBuildModelSelectGeneralParamsBasic } from './modelGeneral.ts';
import type {
  TypeModelColumn,
  TypeModelColumnsPatch,
  TypeModelColumnsStrict,
} from './modelWhere.ts';
import type { IModelClassRecord, TypeModelOptionsTable } from './onion/model.ts';
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
import type { TypeEntityTableNamesOfGeneral } from './relationsTables.ts';

export type TypeModelRelationType = 'hasOne' | 'belongsTo' | 'hasMany' | 'belongsToMany';
// export interface TypeModelRelations {
//   [key: string]: TypeModelRelation<any, any>;
// }

// export type TypeModelRelation<MODELSelf extends BeanModelMeta | undefined, MODELTarget extends BeanModelMeta> =
//   IModelRelationHasOne<MODELTarget> |
//   IModelRelationBelongsTo<MODELSelf, MODELTarget> |
//   IModelRelationHasMany<MODELTarget>;

// use optional ? for app config
export interface IModelRelationHasOne<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  KEY extends keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity] | undefined =
    keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]> | undefined =
    TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
> {
  type?: 'hasOne';
  model?: TypeModelClassLike<MODEL>;
  key?: KEY;
  options?: IModelRelationOptionsOne<TypeModelOfModelLike<MODEL>, AUTOLOAD, COLUMNS>;
}

export interface IModelRelationBelongsTo<
  MODELSelf extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]> | undefined =
    TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
> {
  type?: 'belongsTo';
  model?: TypeModelClassLike<MODEL>;
  key?: keyof TypeModelOfModelLike<MODELSelf>[TypeSymbolKeyEntity];
  options?: IModelRelationOptionsOne<TypeModelOfModelLike<MODEL>, AUTOLOAD, COLUMNS>;
}

export interface IModelRelationHasMany<
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  KEY extends keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity] | undefined =
    keyof TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity],
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]> | undefined =
    TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Aggrs extends
    | TypeModelSelectAggrParamsAggrs<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>
    | undefined = undefined,
  Groups extends
    | TypeModelColumnsStrict<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>
    | undefined = undefined,
> {
  type?: 'hasMany';
  model?: TypeModelClassLike<MODEL>;
  key?: KEY;
  options?: IModelRelationOptionsMany<
    TypeModelOfModelLike<MODEL>,
    AUTOLOAD,
    COLUMNS,
    ModelJoins,
    Aggrs,
    Groups
  >;
}

export interface IModelRelationBelongsToMany<
  MODELMiddle extends BeanModelMeta | keyof IModelClassRecord,
  MODEL extends BeanModelMeta | keyof IModelClassRecord,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]> | undefined =
    TypeModelColumn<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Aggrs extends
    | TypeModelSelectAggrParamsAggrs<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>
    | undefined = undefined,
  Groups extends
    | TypeModelColumnsStrict<TypeModelOfModelLike<MODEL>[TypeSymbolKeyEntity]>
    | undefined = undefined,
> {
  type?: 'belongsToMany';
  modelMiddle?: TypeModelClassLike<MODELMiddle>;
  model?: TypeModelClassLike<MODEL>;
  keyFrom?: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity];
  keyTo?: keyof TypeModelOfModelLike<MODELMiddle>[TypeSymbolKeyEntity];
  options?: IModelRelationOptionsMany<
    TypeModelOfModelLike<MODEL>,
    AUTOLOAD,
    COLUMNS,
    ModelJoins,
    Aggrs,
    Groups
  >;
}

export interface IModelRelationOptionsOne<
  MODEL extends BeanModelMeta,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<MODEL[TypeSymbolKeyEntity]> | undefined = TypeModelColumn<
    MODEL[TypeSymbolKeyEntity]
  >,
> extends IModelRelationOptionsMetaWrapper {
  autoload?: AUTOLOAD;
  columns?: TypeModelColumnsPatch<MODEL[TypeSymbolKeyEntity], COLUMNS>;
}

export interface IModelRelationOptionsMany<
  MODEL extends BeanModelMeta,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<MODEL[TypeSymbolKeyEntity]> | undefined = TypeModelColumn<
    MODEL[TypeSymbolKeyEntity]
  >,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Aggrs extends TypeModelSelectAggrParamsAggrs<MODEL[TypeSymbolKeyEntity]> | undefined = undefined,
  Groups extends TypeModelColumnsStrict<MODEL[TypeSymbolKeyEntity]> | undefined = undefined,
>
  extends
    IModelRelationOptionsMetaWrapper,
    IModelRelationOptionsMany_Raw<MODEL, AUTOLOAD, COLUMNS, ModelJoins, Aggrs, Groups> {}

export type IModelRelationOptionsMany_Raw<
  MODEL extends BeanModelMeta,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<MODEL[TypeSymbolKeyEntity]> | undefined = TypeModelColumn<
    MODEL[TypeSymbolKeyEntity]
  >,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Aggrs extends TypeModelSelectAggrParamsAggrs<MODEL[TypeSymbolKeyEntity]> | undefined = undefined,
  Groups extends TypeModelColumnsStrict<MODEL[TypeSymbolKeyEntity]> | undefined = undefined,
> = IBuildModelRelationOptionsMany<
  MODEL[TypeSymbolKeyEntity],
  AUTOLOAD,
  COLUMNS,
  TypeEntityTableNamesOfGeneral<ModelJoins, MODEL>,
  TypeEntityTableColumnNamesOfGeneral<ModelJoins, MODEL>,
  TypeEntityTableColumnsOfGeneral<ModelJoins, MODEL>,
  Aggrs,
  Groups
>;

export interface IBuildModelRelationOptionsMany<
  TRecord,
  AUTOLOAD extends boolean = false,
  COLUMNS extends TypeModelColumn<TRecord> | undefined = TypeModelColumn<TRecord>,
  TableNames = undefined,
  ColumnNames = keyof TRecord,
  Columns extends {} | undefined = undefined,
  Aggrs extends TypeModelSelectAggrParamsAggrs<TRecord> | undefined = undefined,
  Groups extends TypeModelColumnsStrict<TRecord> | undefined = undefined,
> extends IBuildModelSelectGeneralParamsBasic<
  TRecord,
  COLUMNS,
  TableNames,
  ColumnNames,
  Columns,
  Aggrs,
  Groups
> {
  autoload?: AUTOLOAD;
}

export interface IModelRelationOptionsMetaBasic {
  client?: TypeModelRelationOptionsMetaClient;
  table?: TypeModelOptionsTable;
}

export interface IModelRelationOptionsMeta extends IModelRelationOptionsMetaBasic {
  middle?: IModelRelationOptionsMetaBasic;
}

export interface IModelRelationOptionsMetaWrapper {
  meta?: IModelRelationOptionsMeta;
}

export type TypeModelRelationOptionsMetaClient =
  | '_auto_'
  | '_initial_'
  | '_inherit_'
  | keyof IDatabaseClientRecord
  | ServiceDb;

export type IRelationItem = [string, any, any, any, boolean];

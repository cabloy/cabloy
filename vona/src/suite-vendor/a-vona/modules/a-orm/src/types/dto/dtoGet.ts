import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { IModelRelationIncludeWrapper } from '../model.ts';
import type { TypeModelColumns } from '../modelWhere.ts';
import type { IModelClassRecord } from '../onion/model.ts';
import type {
  TypeModelOfModelLike,
  TypeModelRelationResult,
  TypeSymbolKeyEntity,
} from '../relations.ts';

export type IDtoGetParams<ModelLike extends BeanModelMeta | keyof IModelClassRecord> =
  IBuildDtoGetParams<
    TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity],
    TypeModelOfModelLike<ModelLike>
  >;

export interface IBuildDtoGetParams<TRecord, Model extends BeanModelMeta>
  extends IModelRelationIncludeWrapper<Model>, IBuildDtoGetParamsBasic<TRecord> {}

export interface IBuildDtoGetParamsBasic<TRecord> {
  columns?: TypeModelColumns<TRecord>;
}

export type TypeDtoGetResult<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  TOptionsRelation,
> = TypeModelRelationResult<
  TypeModelOfModelLike<ModelLike>[TypeSymbolKeyEntity],
  TypeModelOfModelLike<ModelLike>,
  TOptionsRelation
>;

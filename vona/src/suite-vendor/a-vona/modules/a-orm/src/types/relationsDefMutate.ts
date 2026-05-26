import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { IModelRelationIncludeWrapper } from './model.ts';
import type { IModelRelationOptionsMetaWrapper } from './relationsDef.ts';

export interface IModelRelationOptionsOneMutate<MODEL extends BeanModelMeta>
  extends IModelRelationOptionsMetaWrapper, IModelRelationIncludeWrapper<MODEL> {}

export interface IModelRelationOptionsManyMutate<MODEL extends BeanModelMeta>
  extends IModelRelationOptionsMetaWrapper, IModelRelationIncludeWrapper<MODEL> {}

export interface IModelRelationOptionsBelongsToManyMutate<
  _MODEL extends BeanModelMeta,
> extends IModelRelationOptionsMetaWrapper {}

import type { BeanModelMeta } from '../bean/bean.model/bean.model_meta.ts';
import type { TypeModelsClassLikeGeneral } from '../types/relations.ts';
import type {
  IModelRelationOptionsManyDynamic,
  IModelRelationOptionsOneDynamic,
} from '../types/relationsDefDynamic.ts';

export interface IModelRelationOptionsManyStatic<
  MODEL extends BeanModelMeta,
  ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined,
  Group extends boolean | undefined = undefined,
> extends Omit<IModelRelationOptionsManyDynamic<MODEL, ModelJoins, Group>, 'include' | 'with'> {
  autoload?: boolean;
}

export interface IModelRelationOptionsOneStatic<MODEL extends BeanModelMeta> extends Omit<
  IModelRelationOptionsOneDynamic<MODEL>,
  'include' | 'with'
> {
  autoload?: boolean;
}

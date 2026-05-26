import type { BeanModelMeta } from '../../bean/bean.model/bean.model_meta.ts';
import type { IModelClassRecord } from '../onion/model.ts';
import type { TypeDtoGetResult } from './dtoGet.ts';

export interface TypeDtoSelectAndCountResult<
  ModelLike extends BeanModelMeta | keyof IModelClassRecord,
  TOptionsRelation,
> {
  list: TypeDtoGetResult<ModelLike, TOptionsRelation>[];
  total: string;
  pageCount: number;
  pageSize: number;
  pageNo: number;
}

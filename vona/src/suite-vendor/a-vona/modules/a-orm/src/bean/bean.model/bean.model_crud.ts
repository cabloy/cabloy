import type { TableIdentity } from 'table-identity';

import type {
  IModelCountParams,
  IModelGetOptionsGeneral,
  IModelMethodOptionsGeneral,
  IModelSelectParams,
  IModelUpdateOptionsGeneral,
  TypeModelWhere,
} from '../../types/index.ts';

import { BeanModelCrudInner } from './bean.model_crud_inner.ts';

export class BeanModelCrud<TRecord extends {} = {}> extends BeanModelCrudInner<TRecord> {
  async mget(
    ids: TableIdentity[],
    options?: IModelGetOptionsGeneral<TRecord>,
  ): Promise<Partial<TRecord>[]> {
    return await this._mget(undefined, ids, options);
  }

  async select(
    params?: IModelSelectParams<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<Partial<TRecord>[]> {
    return await this._select(undefined, params, options);
  }

  async get(
    where: TypeModelWhere<TRecord>,
    options?: IModelGetOptionsGeneral<TRecord>,
  ): Promise<Partial<TRecord> | undefined> {
    return await this._get(undefined, where, options);
  }

  async count(
    params?: IModelCountParams<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<string | undefined> {
    return await this._count(undefined, params, options);
  }

  async insert(data?: Partial<TRecord>, options?: IModelMethodOptionsGeneral): Promise<TRecord> {
    return (await this._insertBulk(undefined, data, options)) as Promise<TRecord>;
  }

  async insertBulk(
    data: Partial<TRecord>[],
    options?: IModelMethodOptionsGeneral,
  ): Promise<TRecord[]> {
    return (await this._insertBulk(undefined, data, options)) as Promise<TRecord[]>;
  }

  async update(
    data: Partial<TRecord>,
    options?: IModelUpdateOptionsGeneral<TRecord>,
  ): Promise<Partial<TRecord>> {
    return await this._update(undefined, data, options);
  }

  async delete(
    where?: TypeModelWhere<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<void> {
    return await this._delete(undefined, where, options);
  }
}

import type { TableIdentity } from 'table-identity';

import type {
  IModelCountParams,
  IModelGetOptionsGeneral,
  IModelMethodOptionsGeneral,
  IModelSelectParams,
  IModelUpdateOptionsGeneral,
  ITableRecord,
  TypeModelWhere,
} from '../../types/index.ts';

import { BeanModelCrudInner } from './bean.model_crud_inner.ts';

export class BeanModelCrudTable<TRecord extends {}> extends BeanModelCrudInner<TRecord> {
  async mget(
    table: keyof ITableRecord,
    ids: TableIdentity[],
    options?: Omit<IModelGetOptionsGeneral<TRecord>, 'include' | 'with'>,
  ): Promise<TRecord[]> {
    return await this._mget(table, ids, options);
  }

  async select(
    table: keyof ITableRecord,
    params?: Omit<IModelSelectParams<TRecord>, 'include' | 'with'>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<TRecord[]> {
    return await this._select(table, params, options);
  }

  async get(
    table: keyof ITableRecord,
    where: TypeModelWhere<TRecord>,
    options?: Omit<IModelGetOptionsGeneral<TRecord>, 'include' | 'with'>,
  ): Promise<TRecord | undefined> {
    return await this._get(table, where, options);
  }

  async count(
    table: keyof ITableRecord,
    params?: IModelCountParams<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<string | undefined> {
    return await this._count(table, params, options);
  }

  async insert(
    table: keyof ITableRecord,
    data?: Partial<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<TRecord> {
    return (await this._insertBulk(table, data, options)) as Promise<TRecord>;
  }

  async insertBulk(
    table: keyof ITableRecord,
    data: Partial<TRecord>[],
    options?: IModelMethodOptionsGeneral,
  ): Promise<TRecord[]> {
    return (await this._insertBulk(table, data, options)) as Promise<TRecord[]>;
  }

  async update(
    table: keyof ITableRecord,
    data: Partial<TRecord>,
    options?: IModelUpdateOptionsGeneral<TRecord>,
  ): Promise<Partial<TRecord>> {
    return await this._update(table, data, options);
  }

  async delete(
    table: keyof ITableRecord,
    where?: TypeModelWhere<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<void> {
    return await this._delete(table, where, options);
  }
}

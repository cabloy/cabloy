import type { Knex } from 'knex';
import type { TableIdentity } from 'table-identity';

import { isNil } from '@cabloy/utils';
import { cast } from 'vona';

import type {
  IModelCountParams,
  IModelGetOptionsGeneral,
  IModelIncrementParams,
  IModelMethodOptionsGeneral,
  IModelSelectGeneralParams,
  IModelSelectParams,
  IModelUpdateOptionsGeneral,
  ITableRecord,
  TypeModelWhere,
} from '../../types/index.ts';

import { BeanModelView } from './bean.model_view.ts';

export class BeanModelCrudInner<TRecord extends {}> extends BeanModelView<TRecord> {
  protected async _mget(
    table?: keyof ITableRecord,
    ids?: TableIdentity[],
    options?: IModelGetOptionsGeneral<TRecord>,
  ): Promise<TRecord[]> {
    const items = await this._mget_original(table, ids, options);
    return items.filter(item => !isNil(item));
  }

  // with undefined
  protected async _mget_original(
    table?: keyof ITableRecord,
    ids?: TableIdentity[],
    options?: IModelGetOptionsGeneral<TRecord>,
  ): Promise<(TRecord | undefined)[]> {
    // table
    table = table || this.getTable(undefined);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // ids maybe empty
    if (!ids || ids.length === 0) return [];
    // params
    const params: IModelSelectParams<TRecord> = {
      where: {
        id: ids,
      } as any,
    };
    if (options?.columns) {
      params.columns = options?.columns as any;
    }
    // select
    const options2 = options?.columns
      ? Object.assign({}, options, { columns: undefined })
      : options;
    const items = await this._select(table, params, options2);
    // sort
    const result: (TRecord | undefined)[] = [];
    for (const id of ids) {
      // item maybe undefined
      const item = items.find(item => cast(item).id === id);
      result.push(item);
    }
    return result;
  }

  protected async _select<T extends IModelSelectParams<TRecord>>(
    table?: keyof ITableRecord,
    params?: T,
    options?: IModelMethodOptionsGeneral,
    builder?: Knex.QueryBuilder<TRecord, TRecord[]>,
  ): Promise<TRecord[]> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // builder
    builder = builder ?? this._select_buildParams(table, params as any, options);
    // datas
    const datas = await builder;
    // debug
    this.$loggerChild('model').debug(() => {
      let tip = String(datas.length);
      const id = cast(datas[0])?.id;
      if (!isNil(id)) {
        tip = `${tip}/${id}`;
      }
      return `model.select: ${tip}, ${builder.toQuery()}`;
    });
    return (await this.dialect.select(builder, datas, () => this.columns(table))) as TRecord[];
  }

  protected _select_buildParams<T extends IModelSelectGeneralParams<TRecord>>(
    table: keyof ITableRecord,
    params?: T,
    options?: IModelMethodOptionsGeneral,
  ) {
    // builder
    const builder = this.builder<TRecord, TRecord>(table);
    // groups
    const groups = this.buildGroups(builder, params?.groups);
    // columns
    this.buildColumns(builder, params?.columns, groups);
    // distinct
    this.buildDistinct(builder, params?.distinct);
    // aggregate
    this.buildAggrs(builder, params?.aggrs);
    // joins
    this.buildJoins(builder, params?.joins);
    // where
    this.prepareWhere(builder, table, params?.where, options);
    // having
    this.prepareHaving(builder, params?.having as any);
    // orders
    this.buildOrders(builder, params?.orders);
    // limit
    this.buildLimit(builder, params?.limit);
    // offset
    this.buildOffset(builder, params?.offset);
    // ok
    return builder;
  }

  protected async _get(
    table: keyof ITableRecord | undefined,
    where: TypeModelWhere<TRecord>,
    options?: IModelGetOptionsGeneral<TRecord>,
  ): Promise<TRecord | undefined> {
    // table
    table = table || this.getTable(where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // params
    const params: IModelSelectParams<TRecord> = { where, limit: 1 };
    if (options?.columns) {
      params.columns = options?.columns as any;
    }
    // select
    const items = await this._select(table, params, options);
    const item = items[0];
    if (!item) return undefined;
    return item as unknown as TRecord;
  }

  protected async _count(
    table?: keyof ITableRecord,
    params?: IModelCountParams<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<string | undefined> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // params
    params = params || {};
    // builder
    const builder = this.builder<TRecord>(table);
    // count
    this.buildCount(builder, params.column, params.distinct);
    // joins
    this.buildJoins(builder, params.joins);
    // where
    this.prepareWhere(builder, table, params.where, options);
    // ready
    this.$loggerChild('model').debug(() => `model.count: ${builder.toQuery()}`);
    const res = await builder;
    return this.extractFirstNumber(res);
  }

  protected async _increment(
    table?: keyof ITableRecord,
    params?: IModelIncrementParams<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<number> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // params
    params = params || ({} as unknown as IModelIncrementParams<TRecord>);
    // builder
    const builder = this.builder<TRecord>(table);
    // count
    this.buildIncrement(builder, params.columns);
    // joins
    this.buildJoins(builder, params.joins);
    // where
    this.prepareWhere(builder, table, params.where, options);
    // ready
    const res = await builder;
    // debug
    this.$loggerChild('model').debug(() => `model.increment: ${res}, ${builder.toQuery()}`);
    return res as unknown as number;
  }

  protected async _insertBulk(
    table?: keyof ITableRecord,
    data?: Partial<TRecord> | Partial<TRecord>[],
    options?: IModelMethodOptionsGeneral,
  ): Promise<TRecord | TRecord[]> {
    // data
    data = data || ({} as any);
    const datasTemp = Array.isArray(data) ? data : [data];
    // table
    table = table || this.getTable(datasTemp[0]);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // options
    const datas: any[] = [];
    const datasOriginal: any[] = [];
    for (const dataTemp of datasTemp) {
      // first
      const dataTemp2 = this._prepareInsertDataByOptions(table, dataTemp, options);
      // then
      const [dataNew, dataNewOriginal] = await this.prepareData(table, dataTemp2);
      if (
        isNil(cast(dataNewOriginal).id) &&
        Object.prototype.hasOwnProperty.call(dataNewOriginal, 'id')
      ) {
        delete cast(dataNewOriginal).id;
      }
      datas.push(dataNew);
      datasOriginal.push(dataNewOriginal);
    }
    // builder
    const builder = this.builder<TRecord>(table);
    // dialect insert
    const [ids, builder2] = await this.dialect.insert(builder, datas);
    // debug
    this.$loggerChild('model').debug(() => {
      let tip = String(ids.length);
      const id = ids[0];
      if (!isNil(id)) {
        tip = `${tip}/${id}`;
      }
      const query = this._ellipsis‌Logger(builder2.toQuery());
      return `model.insert: ${tip}, ${query}`;
    });
    // combine
    const result: any[] = [];
    const dataDefault = await this.defaultData(table);
    for (let index = 0; index < ids.length; index++) {
      const dataWithId: any = {};
      if (ids[index] !== undefined) dataWithId.id = ids[index];
      // datasOriginal[index] maybe has id
      result.push(Object.assign({}, dataDefault, dataWithId, datasOriginal[index]));
    }
    // ok
    return Array.isArray(data) ? result : result[0];
  }

  protected async _update(
    table: keyof ITableRecord | undefined,
    data: Partial<TRecord>,
    options?: IModelUpdateOptionsGeneral<TRecord>,
  ): Promise<Partial<TRecord>> {
    // table
    table = table || this.getTable(data);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // data
    [data] = await this.prepareData(table, data);
    // where
    const where = Object.assign({}, options?.where);
    // id
    const columnId = `${table}.id`;
    for (const key of ['id', columnId]) {
      if (!isNil(data[key])) {
        cast(where).id = data[key];
        delete data[key];
      }
    }
    // disableUpdateTime
    if (!this._checkDisableUpdateTimeByOptions(options)) {
      cast(data).updatedAt = new Date();
    }
    // builder
    const builder = this.builder<TRecord>(table);
    // update
    builder.update(data as any);
    // where
    this.prepareWhere(builder, table, where, options);
    // ready
    const resCount = await builder;
    // debug
    this.$loggerChild('model').debug(() => {
      const query = this._ellipsis‌Logger(builder.toQuery());
      return `model.update: ${resCount}, ${query}`;
    });
    // ok
    return data;
  }

  protected async _delete(
    table?: keyof ITableRecord,
    where?: TypeModelWhere<TRecord>,
    options?: IModelMethodOptionsGeneral,
  ): Promise<void> {
    // table
    table = table || this.getTable(where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // disableDeleted
    if (!this._checkDisableDeletedByOptions(options)) {
      // need not set options2: disableDeleted: true, deleted: undefined
      const options2 = Object.assign({}, options, { where });
      await this._update(table, { deleted: true } as any, options2);
      return;
    }
    // builder
    const builder = this.builder<TRecord>(table);
    // delete
    builder.delete();
    // where
    this.prepareWhere(builder, table, where, options);
    // ready
    const resCount = await builder;
    // debug
    this.$loggerChild('model').debug(() => `model.delete: ${resCount}, ${builder.toQuery()}`);
  }
}

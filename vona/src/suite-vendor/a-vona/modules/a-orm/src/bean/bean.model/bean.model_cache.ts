import type { TableIdentity } from 'table-identity';

import { isNil } from '@cabloy/utils';
import { parseFirstWord, toLowerCaseFirstChar } from '@cabloy/word-utils';
import BigNumber from 'bignumber.js';
import { cast, deepExtend, disposeInstance } from 'vona';

import type { ServiceDb } from '../../service/db_.ts';
import type {
  IDatabaseClientRecord,
  IModelDeleteOptions,
  IModelGetOptions,
  IModelIncrementParams,
  IModelInsertOptions,
  IModelMethodOptions,
  IModelMethodOptionsGeneral,
  IModelMutateOptions,
  IModelRecord,
  IModelSelectAggrParams,
  IModelSelectCountParams,
  IModelSelectGroupParams,
  IModelSelectParams,
  IModelUpdateOptions,
  ITableRecord,
  TypeModelAggrRelationResult,
  TypeModelClassLikeGeneral,
  TypeModelColumn,
  TypeModelColumns,
  TypeModelGroupRelationResult,
  TypeModelIncrementParamsColumns,
  TypeModelsClassLikeGeneral,
  TypeModelWhere,
} from '../../types/index.ts';
import type { TypeQueueDoubleDeleteJobData } from '../queue.doubleDelete.ts';

import { getTargetColumnName } from '../../common/utils.ts';
import { getCacheModelsClear } from '../../lib/const.ts';
import { ServiceCacheEntity } from '../../service/cacheEntity_.ts';
import { ServiceCacheQuery } from '../../service/cacheQuery_.ts';
import { ServiceRelations } from '../../service/relations_.ts';
import { BeanModelCrud } from './bean.model_crud.ts';

export class BeanModelCache<TRecord extends {} = {}> extends BeanModelCrud<TRecord> {
  public cacheQuery: ServiceCacheQuery;
  public cacheEntity: ServiceCacheEntity;
  protected relations: ServiceRelations;

  protected __init__(
    clientName?: keyof IDatabaseClientRecord | ServiceDb,
    table?: keyof ITableRecord,
  ) {
    super.__init__(clientName, table);
    this.cacheQuery = this.bean._newBean(ServiceCacheQuery, this);
    this.cacheEntity = this.bean._newBean(ServiceCacheEntity, this);
    this.relations = this.bean._newBean(ServiceRelations, this);
  }

  protected async __dispose__() {
    await disposeInstance(this.cacheQuery);
    await disposeInstance(this.cacheEntity);
  }

  async insert<T extends IModelInsertOptions<TRecord>>(
    data?: Partial<TRecord>,
    options?: T,
  ): Promise<TRecord> {
    if (!data) data = {};
    const items = await this.insertBulk([data], options);
    return items[0];
  }

  async insertBulk<T extends IModelInsertOptions<TRecord>>(
    items: Partial<TRecord>[],
    options?: T,
  ): Promise<TRecord[]> {
    const itemsResult = await this.__insertBulk_raw(undefined, items, options);
    const itemsNew = items.map((item, index) => {
      return Object.assign({}, item, { id: cast(itemsResult[index]).id });
    });
    return await this.relations.handleRelationsMutate(
      itemsResult,
      itemsNew as any,
      options as any,
      options,
    );
  }

  async __insertBulk_raw(
    table: keyof ITableRecord | undefined,
    items: Partial<TRecord>[],
    options?: IModelMutateOptions<TRecord>,
  ): Promise<TRecord[]> {
    if (items.length === 0) return [];
    // table
    table = table || this.getTable(items[0]);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // insert
    const res = (await this._insertBulk(table, items, options)) as TRecord[];
    // delete cache
    const ids = res.map(item => cast(item).id);
    await this.cacheEntityDel(ids, table);
    return res;
  }

  async mutate<T extends IModelMutateOptions<TRecord>>(
    data?: Partial<TRecord>,
    options?: T,
  ): Promise<Partial<TRecord>> {
    if (!data) data = {};
    const items = await this.mutateBulk([data], options);
    return items[0];
  }

  async mutateBulk<T extends IModelMutateOptions<TRecord>>(
    items: Partial<TRecord>[],
    options?: T,
  ): Promise<Partial<TRecord>[]> {
    return await this.__mutateBulk_raw(undefined, items, options);
  }

  async __mutateBulk_raw(
    table: keyof ITableRecord | undefined,
    items: Partial<TRecord>[],
    options?: IModelMutateOptions<TRecord>,
  ): Promise<TRecord[]> {
    // table
    table = table || this.getTable(items[0]);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check
    const indexesInsert: number[] = [];
    const indexesUpdate: number[] = [];
    const indexesDelete: number[] = [];
    const itemsInsert: Partial<TRecord>[] = [];
    const itemsUpdate: Partial<TRecord>[] = [];
    const itemsDelete: Partial<TRecord>[] = [];
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (cast(item).deleted) {
        if (!isNil(cast(item).id)) {
          itemsDelete.push(item);
          indexesDelete.push(index);
        } else {
          // donothing, rather than throw error
        }
      } else if (!isNil(cast(item).id)) {
        itemsUpdate.push(item);
        indexesUpdate.push(index);
      } else {
        itemsInsert.push(item);
        indexesInsert.push(index);
      }
    }
    // insert/update
    const itemsInsertNew = await this.__insertBulk_raw(table, itemsInsert, options);
    await this.__updateBulk_raw(table, itemsUpdate, options);
    const itemsMutate = itemsInsert
      .map((item, index) => {
        return Object.assign({}, item, { id: cast(itemsInsertNew[index]).id });
      })
      .concat(itemsUpdate as any);
    let itemsMutateResult = itemsInsertNew.concat(itemsUpdate as any);
    const indexesMutate = indexesInsert.concat(indexesUpdate);
    itemsMutateResult = await this.relations.handleRelationsMutate(
      itemsMutateResult,
      itemsMutate as any,
      options as any,
      options,
    );
    let result: TRecord[] = [];
    for (let index = 0; index < indexesMutate.length; index++) {
      result[indexesMutate[index]] = itemsMutateResult[index] as any;
    }
    result = result.filter(item => !!item); // fitler deleted items
    // delete
    const idsDelete = itemsDelete.map(item => cast(item).id);
    await this.__deleteBulk_raw_with_relations(table, idsDelete, options);
    // ok
    return result;
  }

  async mget<T extends IModelGetOptions<TRecord>>(
    ids: TableIdentity[],
    options?: T,
  ): Promise<Partial<TRecord>[]> {
    if (ids.length === 0) return [];
    const relations = this.relations.handleRelationsCollection(options as any);
    const [options2, refKeys] = this.relations.prepareColumnsByRelations(relations, options);
    let items = await this.__mget_raw(undefined, ids, options2);
    if (items.length === 0) return items;
    items = await this.relations.handleRelationsMany(relations, items, options as any, options);
    if (refKeys) {
      for (const item of items) {
        for (const refKey of refKeys) {
          delete item![refKey];
        }
      }
    }
    return items;
  }

  private async __mget_raw(
    table: keyof ITableRecord | undefined,
    ids: TableIdentity[],
    options?: IModelGetOptions<TRecord>,
  ): Promise<TRecord[]> {
    // table
    table = table || this.getTable(undefined);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check if cache
    if (this._checkDisableCacheEntityByOptions(options)) {
      return (await super._mget(table, ids, options)) as TRecord[];
    }
    // cache
    const cache = this.cacheEntity.getInstance(table);
    let items = await cache.mget(ids, {
      mget: async ids => {
        return await super._mget_original(table, ids, { disableDeleted: true });
      },
      db: this.db,
    });
    // filter disableDeleted
    items = items.filter(item => {
      if (!item) return false;
      if (!this._checkIfEntityValidByDeleted(item, options)) return false;
      return true;
    });
    return this.__filterMGetColumns(items, options?.columns);
  }

  async count<
    T extends IModelSelectCountParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(
    params?: T,
    options?: IModelMethodOptions,
    _modelJoins?: ModelJoins,
  ): Promise<string | undefined> {
    const column = params?.column ?? '*';
    const params2 = Object.assign({}, params, { aggrs: { count: column }, column: undefined });
    const item = await this.aggregate(params2, options);
    return this.extractFirstValue(item);
  }

  async increment<
    T extends IModelIncrementParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(params: T, options?: IModelMethodOptions, _modelJoins?: ModelJoins): Promise<number> {
    return await this.__increment_raw(undefined, params, options);
  }

  async decrement<
    T extends IModelIncrementParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(params: T, options?: IModelMethodOptions, _modelJoins?: ModelJoins): Promise<number> {
    const columns = {} as TypeModelIncrementParamsColumns<TRecord>;
    for (const key in params.columns) {
      columns[key] = -params.columns[key]!;
    }
    const params2 = Object.assign({}, params, { columns });
    return await this.__increment_raw(undefined, params2, options);
  }

  private async __increment_raw(
    table: keyof ITableRecord | undefined,
    params?: IModelIncrementParams<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<number> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check if cache
    if (this._checkDisableCacheEntityByOptions(options)) {
      return await super._increment(table, params, options);
    }
    const where = params?.where;
    const items = await this.__select_raw(table, { where, columns: ['id'] as any }, options);
    if (items.length === 0) {
      // donothing
      return 0;
    }
    let id;
    if (items.length === 1) {
      id = cast(items[0]).id;
    } else {
      id = items.map(item => cast(item).id);
    }
    // update by id/ids
    params = Object.assign({}, params, { where: { id } });
    const res = await this._increment(table, params, options);
    // delete cache
    await this.cacheEntityDel(id, table);
    return res;
  }

  async aggregate<
    T extends IModelSelectAggrParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(
    params?: T,
    options?: IModelMethodOptions,
    _modelJoins?: ModelJoins,
  ): Promise<TypeModelAggrRelationResult<T>> {
    const items = await this.__aggregate_raw(undefined, params, options);
    return items[0] as any;
  }

  private async __aggregate_raw(
    table: keyof ITableRecord | undefined,
    params?: IModelSelectParams<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<TRecord[]> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    const items = await this.__select_cache(table, params, options);
    return items;
  }

  async group<
    T extends IModelSelectGroupParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(
    params?: T,
    options?: IModelMethodOptions,
    _modelJoins?: ModelJoins,
  ): Promise<TypeModelGroupRelationResult<TRecord, T>[]> {
    return (await this.__group_raw(undefined, params, options)) as any;
  }

  private async __group_raw(
    table: keyof ITableRecord | undefined,
    params?: IModelSelectGroupParams<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<TRecord[]> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    const items = await this.__select_cache(table, params as any, options);
    return items;
  }

  async selectAndCount<
    T extends IModelSelectParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<any> {
    // pageNo/pageSize
    const pageSize = params?.limit ?? this.scopeOrm.config.rest.query.pageSize.default;
    const pageNo = Math.floor((params?.offset ?? 0) / pageSize) + 1;
    // count
    const paramsCount = Object.assign({}, params, {
      columns: undefined,
      orders: undefined,
      limit: undefined,
      offset: undefined,
    });
    let count = await this.count(paramsCount, options, modelJoins);
    if (!count) count = '0';
    // list
    let list;
    if (count === '0') {
      list = [];
    } else {
      list = await this.select(params, options, modelJoins);
    }
    // pageNo/pageSize/pageCount
    const pageCount = Math.ceil(BigNumber(count).div(pageSize).toNumber());
    // ok
    return { list, total: count, pageCount, pageSize, pageNo };
  }

  async select<
    T extends IModelSelectParams<TRecord>,
    ModelJoins extends TypeModelsClassLikeGeneral | undefined,
  >(params?: T, options?: IModelMethodOptions, _modelJoins?: ModelJoins): Promise<any[]> {
    const relations = this.relations.handleRelationsCollection(params as any);
    const [params2, refKeys] = this.relations.prepareColumnsByRelations(relations, params);
    let items = await this.__select_raw(undefined, params2, options);
    if (items.length === 0) return items;
    items = await this.relations.handleRelationsMany(relations, items, params as any, options);
    if (refKeys) {
      for (const item of items) {
        for (const refKey of refKeys) {
          delete item![refKey];
        }
      }
    }
    return items;
  }

  private async __select_raw(
    table: keyof ITableRecord | undefined,
    params?: IModelSelectParams<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<TRecord[]> {
    // table
    table = table || this.getTable(params?.where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check if cache
    if (this._checkDisableCacheEntityByOptions(options)) {
      return await this.__select_cache(table, params, options);
    }
    // 1: select id
    const columnId = `${table}.id`;
    const params2: IModelSelectParams<TRecord> = Object.assign({}, params, { columns: [columnId] });
    const items = await this.__select_cache(table, params2, options);
    if (items.length === 0) {
      // donothing
      return [] as TRecord[];
    }
    // 1: special check
    if (params?.columns) {
      const columnsTarget = Array.isArray(params?.columns) ? params?.columns : [params?.columns];
      if (this.__checkIfOnlyKey(columnsTarget as any, table)) {
        // just return
        return items;
      }
    }
    // 2: mget
    const ids = items.map(item => cast(item).id);
    const options3 = params?.columns
      ? Object.assign({}, options, { columns: params?.columns })
      : options;
    return await this.__mget_raw(table, ids, options3);
  }

  private async __select_cache(
    table: keyof ITableRecord,
    params?: IModelSelectParams<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<TRecord[]> {
    // check if cache
    if (this._checkDisableCacheQueryByOptions(options)) {
      return await super._select(table, params, options);
    }
    // builder
    const builder = this._select_buildParams(table, params as any, options);
    const sql = builder.toQuery();
    const key = { sql };
    // cache
    const cache = this.cacheQuery.getInstance(table);
    const items = await cache.get(key, {
      ...options?.cache,
      get: async () => {
        return await super._select(table, params, options, builder);
      },
      db: this.db,
    });
    return items;
  }

  async get<T extends IModelGetOptions<TRecord>>(
    where: TypeModelWhere<TRecord>,
    options?: T,
  ): Promise<Partial<TRecord> | undefined> {
    const relations = this.relations.handleRelationsCollection(options);
    const [options2, refKeys] = this.relations.prepareColumnsByRelations(relations, options);
    let item: TRecord | undefined = await this.__get_raw(undefined, where, options2);
    if (!item) return item;
    item = await this.relations.handleRelationsOne(relations, item, options as any, options);
    if (refKeys) {
      for (const refKey of refKeys) {
        delete item![refKey];
      }
    }
    return item;
  }

  private async __get_raw(
    table: keyof ITableRecord | undefined,
    where: TypeModelWhere<TRecord>,
    options?: IModelGetOptions<TRecord>,
  ): Promise<TRecord | undefined> {
    // table
    table = table || this.getTable(where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check if cache
    if (this._checkDisableCacheEntityByOptions(options)) {
      return await super._get(table, where, options);
    }
    const id = this.__checkCacheKeyValid(where, table);
    if (isNil(id)) {
      // not key
      if (this._checkDisableCacheQueryByOptions(options)) {
        return await super._get(table, where, options);
      }
      // by cache query
      // params
      const params: IModelSelectParams<TRecord> = { where };
      if (options?.columns) {
        params.columns = options?.columns as any;
      }
      // select
      const options2 = deepExtend({}, options, { columns: undefined });
      const items = await this.__select_raw(table, params, options2);
      return items[0];
    }
    // key
    return this.__filterGetColumns(
      await this.__get_key(id, table, where, options),
      options?.columns,
    );
  }

  async update<T extends IModelUpdateOptions<TRecord>>(
    data: Partial<TRecord>,
    options?: T,
  ): Promise<Partial<TRecord>> {
    const ids = await this.__update_raw(undefined, data, options);
    if (!ids || ids.length !== 1) return data;
    // only support =1
    const dataNew = [Object.assign({}, data, { id: ids[0] })];
    const items = await this.relations.handleRelationsMutate(
      dataNew,
      dataNew,
      options as any,
      options,
    );
    return items[0];
  }

  async updateBulk<T extends IModelUpdateOptions<TRecord>>(
    items: Partial<TRecord>[],
    options?: T,
  ): Promise<Partial<TRecord>[]> {
    await this.__updateBulk_raw(undefined, items, options);
    return await this.relations.handleRelationsMutate(items, items, options as any, options);
  }

  async __updateBulk_raw<T extends IModelUpdateOptions<TRecord>>(
    table: keyof ITableRecord | undefined,
    items: Partial<TRecord>[],
    options?: T,
  ): Promise<void> {
    if (items.length === 0) return;
    for (const item of items) {
      await this.__update_raw(table, item, options);
    }
  }

  async __update_raw(
    table: keyof ITableRecord | undefined,
    data: Partial<TRecord>,
    options?: IModelUpdateOptions<TRecord>,
  ): Promise<TableIdentity[] | void> {
    // table
    table = table || this.getTable(data);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check if cache
    if (this._checkDisableCacheEntityByOptions(options)) {
      await super._update(table, data, options);
      return;
    }
    // check where and get id
    let id = this.__checkCacheKeyValid(data, table, true);
    if (!options?.where) {
      if (isNil(id)) {
        throw new Error('id should be specified for update method');
      }
      if (Array.isArray(id) && id.length === 0) return;
      const id2 = this.__checkCacheKeyValid(data, table, false);
      if (!isNil(id2)) {
        // donothing
        return;
      }
    } else {
      const id2 = this.__checkCacheKeyValid(options?.where, table, false);
      if (id2) {
        id = id2;
      } else {
        const where = !isNil(id) ? Object.assign({}, options?.where, { id }) : options?.where;
        const options2 = deepExtend({}, options, { where: undefined });
        const items = await this.__select_raw(table, { where, columns: ['id'] as any }, options2);
        if (items.length === 0) {
          // donothing
          return;
        }
        if (items.length === 1) {
          id = cast(items[0]).id;
        } else {
          id = items.map(item => cast(item).id);
        }
        // update by id/ids
        options = Object.assign({}, options, { where: { id } });
      }
    }
    await super._update(table, data, options);
    // delete cache
    await this.cacheEntityDel(id, table);
    // id
    return Array.isArray(id) ? id : [id];
  }

  async delete<T extends IModelDeleteOptions<TRecord>>(
    where?: TypeModelWhere<TRecord>,
    options?: T,
  ): Promise<void> {
    const ids = await this.__delete_raw(undefined, where, options);
    if (!isNil(ids)) {
      await this.relations.handleRelationsDelete(ids as [], options as any, options);
    }
  }

  async deleteBulk<T extends IModelDeleteOptions<TRecord>>(
    ids: TableIdentity[],
    options?: T,
  ): Promise<void> {
    return await this.__deleteBulk_raw_with_relations(undefined, ids, options);
  }

  async __deleteBulk_raw_with_relations<T extends IModelDeleteOptions<TRecord>>(
    table: keyof ITableRecord | undefined,
    ids: TableIdentity[],
    options?: T,
  ): Promise<void> {
    if (ids.length === 0) return;
    await this.__delete_raw(table, { id: ids } as any, options);
    await this.relations.handleRelationsDelete(ids, options as any, options);
  }

  async __delete_raw(
    table: keyof ITableRecord | undefined,
    where?: TypeModelWhere<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<TableIdentity[] | void> {
    // table
    table = table || this.getTable(where);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // check if cache
    if (this._checkDisableCacheEntityByOptions(options)) {
      return await super._delete(table, where, options);
    }
    // id
    let id = this.__checkCacheKeyValid(where, table);
    if (isNil(id)) {
      // check where and get id
      const items = await this.__select_raw(table, { where, columns: ['id'] as any }, options);
      if (items.length === 0) {
        // donothing
        return;
      }
      if (items.length === 1) {
        id = cast(items[0]).id;
      } else {
        id = items.map(item => cast(item).id);
      }
    }
    if (Array.isArray(id) && id.length === 0) return;
    // delete by id/ids
    await super._delete(table, { id } as any, options);
    // delete cache
    await this.cacheEntityDel(id, table);
    // id
    return Array.isArray(id) ? id : [id];
  }

  private async __get_key(
    id: any,
    table: keyof ITableRecord,
    where: TypeModelWhere<TRecord>,
    options?: IModelMethodOptions,
  ): Promise<TRecord | undefined> {
    // cache
    const cache = this.cacheEntity.getInstance(table);
    const item: TRecord | undefined = await cache.get(id, {
      get: async () => {
        // where: maybe contain aux key
        return await super._get(table, where, { disableDeleted: true });
      },
      db: this.db,
    });
    if (!item || !this._checkIfEntityValidByDeleted(item, options)) return undefined;
    return item;
  }

  private __filterMGetColumns(items: any[], columns?: TypeModelColumns<TRecord>) {
    if (items.length === 0 || !columns) return items;
    return items.map(item => {
      return this.__filterGetColumns(item, columns);
    });
  }

  private __filterGetColumns(data, columns?: TypeModelColumns<TRecord>) {
    if (!data || !columns) return data;
    if (!Array.isArray(columns)) columns = cast(columns).split(',');
    const data2 = {};
    for (let column of cast(columns)) {
      column = getTargetColumnName(column);
      if (column === '*') return data;
      if (data[column] !== undefined) {
        data2[column] = data[column];
      }
    }
    return data2;
  }

  public async cacheEntityDel(id: TableIdentity | TableIdentity[], table?: keyof ITableRecord) {
    await this.cacheEntityDelInner(id, table);
    this.db.commit(
      async () => {
        await this.cacheEntityDelInner(id, table);
      },
      { ignoreIfNotInTransaction: true },
    );
    this._shardingCacheDoubleDelete({
      beanFullName: this.$beanFullName,
      clientName: this.db.clientName,
      table,
      method: 'cacheEntityDelInner',
      args: [id, table],
    });
  }

  public async cacheEntityDelInner(
    id: TableIdentity | TableIdentity[],
    table?: keyof ITableRecord,
  ) {
    await this.cacheEntity.del(id, table);
    await this.cacheQueryClearInner(table);
  }

  public async cacheEntityClear(table?: keyof ITableRecord) {
    await this.cacheEntityClearInner(table);
    this.db.commit(
      async () => {
        await this.cacheEntityClearInner(table);
      },
      { ignoreIfNotInTransaction: true },
    );
    this._shardingCacheDoubleDelete({
      beanFullName: this.$beanFullName,
      clientName: this.db.clientName,
      table,
      method: 'cacheEntityClearInner',
      args: [table],
    });
  }

  public async cacheEntityClearInner(table?: keyof ITableRecord) {
    await this.cacheEntity.clear(table);
    await this.cacheQueryClearInner(table);
  }

  public async cacheQueryClear(table?: keyof ITableRecord) {
    await this.cacheQueryClearInner(table);
    this.db.commit(
      async () => {
        await this.cacheQueryClearInner(table);
      },
      { ignoreIfNotInTransaction: true },
    );
    this._shardingCacheDoubleDelete({
      beanFullName: this.$beanFullName,
      clientName: this.db.clientName,
      table,
      method: 'cacheQueryClearInner',
      args: [table],
    });
  }

  public async cacheQueryClearInner(table?: keyof ITableRecord) {
    await this.cacheQuery.clear(table);
    await this._cacheQueryClearModelsClear();
  }

  private _shardingCacheDoubleDelete(jobData: TypeQueueDoubleDeleteJobData) {
    const doubleDelete = this.scopeOrm.config.sharding.cache.doubleDelete;
    if (!doubleDelete) return;
    this.db.commit(() => {
      this.scopeOrm.queue.doubleDelete.push(jobData);
    });
  }

  private async _cacheQueryClearModelsClear() {
    const modelsClear = this._getModelsClear();
    if (!modelsClear || modelsClear.length === 0) return;
    for (const modelClear of modelsClear) {
      const modelTarget = this.newInstanceTarget(modelClear as any) as typeof this;
      const modelsClearedByFn = modelTarget.options.cache?.modelsClearedByFn;
      if (modelsClearedByFn) {
        await modelsClearedByFn(this.ctx, modelTarget, this);
      } else {
        await modelTarget.cacheQueryClearInner();
      }
    }
  }

  private _getModelsClear(modelName?: keyof IModelRecord): TypeModelClassLikeGeneral[] {
    const modelsClearAll = getCacheModelsClear(this.app);
    return modelsClearAll[modelName ?? this.$onionName];
  }

  protected _checkDisableCacheQueryByOptions(options?: IModelMethodOptionsGeneral) {
    if (options?.disableCacheQuery === true || options?.disableCacheQuery === false) {
      return options?.disableCacheQuery;
    }
    return !(options?.cache?.enable ?? this.cacheQuery.enabled);
  }

  protected _checkDisableCacheEntityByOptions(options?: IModelMethodOptionsGeneral) {
    if (options?.disableCacheEntity === true || options?.disableCacheEntity === false) {
      return options?.disableCacheEntity;
    }
    return !(options?.cache?.enable ?? this.cacheEntity.enabled);
  }

  private __checkIfOnlyKey(
    keys: (string | TypeModelColumn<TRecord>)[],
    table: keyof ITableRecord,
    noCheckLength?: boolean,
  ): string | false {
    const columnId = `${table}.id`;
    if (!noCheckLength) {
      const keysAux = this.cacheEntity.keysAux;
      if (keysAux) {
        const keysAux2 = Array.isArray(keysAux) ? keysAux : [keysAux];
        keys = keys.filter(item => !keysAux2.includes(String(item)));
      }
      if (keys.length !== 1) return false;
      if (keys[0] === 'id') return 'id';
      if (keys[0] === columnId) return columnId;
      return false;
    } else {
      if (keys.includes('id')) return 'id';
      if (keys.includes(columnId)) return columnId;
      return false;
    }
  }

  private __checkCacheKeyValid(
    where: {} | undefined,
    table: keyof ITableRecord,
    noCheckLength?: boolean,
  ) {
    if (!where) return undefined;
    const columnId = this.__checkIfOnlyKey(Object.keys(where), table, noCheckLength);
    if (!columnId) return undefined;
    return ['number', 'string', 'bigint', 'array'].includes(typeof where[columnId])
      ? where[columnId]
      : undefined;
  }

  protected __get__(prop: string) {
    if (prop.startsWith('getBy')) {
      const [fieldName, op] = __parseMagicField(prop.substring('getBy'.length));
      if (!fieldName) throw new Error(`invalid magic method: ${prop}`);
      return (fieldValue?: any, options?: any) => {
        const where = __combineMagicWhere(fieldName, op!, fieldValue);
        return this.get(where as any, options);
      };
    } else if (prop.startsWith('selectBy')) {
      const [fieldName, op] = __parseMagicField(prop.substring('selectBy'.length));
      if (!fieldName) throw new Error(`invalid magic method: ${prop}`);
      return (fieldValue?: any, params?: any, options?: any, modelJoins?: any) => {
        const where = __combineMagicWhere(fieldName, op!, fieldValue);
        const params2 = params ? deepExtend({}, params, { where }) : { where };
        return this.select(params2, options, modelJoins);
      };
    } else if (prop.startsWith('updateBy')) {
      const [fieldName, op] = __parseMagicField(prop.substring('updateBy'.length));
      if (!fieldName) throw new Error(`invalid magic method: ${prop}`);
      return (fieldValue: any, data: any, options?: any) => {
        const where = __combineMagicWhere(fieldName, op!, fieldValue);
        if (fieldName === 'id') {
          data = Object.assign({}, data, where);
        } else {
          options = deepExtend({}, options, { where });
        }
        return this.update(data, options);
      };
    } else if (prop.startsWith('deleteBy')) {
      const [fieldName, op] = __parseMagicField(prop.substring('deleteBy'.length));
      if (!fieldName) throw new Error(`invalid magic method: ${prop}`);
      return (fieldValue: any, options?: any) => {
        const where = __combineMagicWhere(fieldName, op!, fieldValue);
        return this.delete(where as any, options);
      };
    }
  }
}

function __combineMagicWhere(fieldName: string, op: string, fieldValue?: any) {
  return {
    [fieldName]:
      fieldValue === undefined
        ? undefined
        : op === 'eq'
          ? fieldValue
          : {
              [`_${op}_`]: fieldValue,
            },
  };
}

function __parseMagicField(str: string) {
  const fieldName = parseFirstWord(str, true);
  if (!fieldName) return [fieldName, undefined];
  const op = toLowerCaseFirstChar(str.substring(fieldName.length)) || 'eq';
  return [fieldName, op];
}

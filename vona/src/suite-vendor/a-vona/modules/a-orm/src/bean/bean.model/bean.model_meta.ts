import { isNil } from '@cabloy/utils';
import { appResource, BeanBase, cast } from 'vona';
import { $tableNameFromEntity } from 'vona-module-a-ormutils';

import type { ServiceDb } from '../../service/db_.ts';
import type {
  IDatabaseClientRecord,
  IDecoratorModelOptions,
  IModelClassRecord,
  IModelMethodOptionsGeneral,
  IModelUpdateOptionsGeneral,
  ITableRecord,
  TypeEntityMeta,
  TypeModelClassLike,
  TypeModelOptionsTable,
  TypeModelRelationOptionsMetaClient,
} from '../../types/index.ts';
import type { BeanModel } from '../bean.model.ts';

import { getTableOrTableAlias, prepareClassModel } from '../../common/utils.ts';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from '../../types/index.ts';

const SymbolModelDb = Symbol('SymbolModelDb');
const SymbolModelTable = Symbol('SymbolModelTable');

export class BeanModelMeta<TRecord extends {} = {}> extends BeanBase {
  public [SymbolKeyEntity]: TRecord;
  public [SymbolKeyEntityMeta]: TypeEntityMeta<TRecord>;
  public [SymbolKeyModelOptions]: IDecoratorModelOptions;

  private [SymbolModelDb]?: ServiceDb;
  private [SymbolModelTable]?: TypeModelOptionsTable;

  protected __init__(
    clientName?: keyof IDatabaseClientRecord | ServiceDb,
    table?: TypeModelOptionsTable,
  ) {
    // clientName
    if (!isNil(clientName)) {
      if (typeof clientName === 'string') {
        this[SymbolModelDb] = this.bean.database.getDb(clientName);
      } else {
        this[SymbolModelDb] = clientName;
      }
    }
    // table
    this[SymbolModelTable] = table;
  }

  protected get self() {
    return cast<BeanModel>(this);
  }

  protected get connection() {
    return this.db.connection;
  }

  protected get dialect() {
    return this.db.dialect;
  }

  public get scopeOrm() {
    return this.$scope.orm;
  }

  public get modelViewRecord() {
    return this.$scope.version.model.viewRecord;
  }

  public get db() {
    return this[SymbolModelDb] ?? this._getDb();
  }

  private _getDb() {
    let clientName = this.options.client;
    // use current
    if (!clientName) return this.bean.database.current;
    // custom clientName
    if (typeof clientName === 'function') {
      clientName = clientName(this.ctx, this);
    }
    // db
    return this.bean.database.getDb(clientName);
  }

  getTable(where: object | undefined): keyof ITableRecord {
    return this._getTable(where);
  }

  private _getTable(where: object | undefined) {
    const table = this[SymbolModelTable] ?? this.options.table;
    if (table && typeof table === 'string') return table;
    const defaultTable = this.options.entity && $tableNameFromEntity(this.options.entity);
    if (table && typeof table === 'function') {
      return table(this.ctx, where, defaultTable!, this) as any;
    }
    if (defaultTable) return defaultTable;
    throw new Error(`not found table of ${this.$beanFullName}`);
  }

  get options(): IDecoratorModelOptions {
    return (this.$beanOptions.options || {}) as IDecoratorModelOptions;
  }

  get disableInstance() {
    return this.options.disableInstance ?? this.scopeOrm.config.model.disableInstance;
  }

  get disableDeleted() {
    return this.options.disableDeleted ?? this.scopeOrm.config.model.disableDeleted;
  }

  get disableCreateTime() {
    return this.options.disableCreateTime ?? this.scopeOrm.config.model.disableCreateTime;
  }

  get disableUpdateTime() {
    return this.options.disableUpdateTime ?? this.scopeOrm.config.model.disableUpdateTime;
  }

  protected _prepareDisableInstanceByOptions(
    table: keyof ITableRecord,
    data: any,
    options?: IModelMethodOptionsGeneral,
    useRaw?: boolean,
  ) {
    const columnNameInstance = useRaw ? 'iid' : `${getTableOrTableAlias(table)}.iid`;
    if (this._checkDisableInstanceByOptions(options)) {
      delete data.iid;
      delete data[columnNameInstance];
    } else {
      delete data.iid;
      if (!this.ctx.instance) {
        throw new Error('ctx.instance not exists');
      }
      data[columnNameInstance] = this.ctx.instance.id;
    }
    return data;
  }

  protected _prepareDisableDeletedByOptions(
    table: keyof ITableRecord,
    data: any,
    options?: IModelMethodOptionsGeneral,
    useRaw?: boolean,
  ) {
    const columnNameDeleted = useRaw ? 'deleted' : `${getTableOrTableAlias(table)}.deleted`;
    const deleted = this._prepareDisableDeletedByOptionsSimple(options);
    if (!isNil(deleted)) {
      delete data.deleted; // force
      data[columnNameDeleted] = deleted;
    }
    return data;
  }

  protected _prepareDisableDeletedByOptionsSimple(
    options?: IModelMethodOptionsGeneral,
  ): boolean | undefined {
    if (!isNil(options?.deleted)) {
      if (!this.disableDeleted) {
        return options?.deleted;
      }
    } else {
      if (this._checkDisableDeletedByOptions(options)) {
        // do nothing
      } else {
        return false;
      }
    }
    return undefined;
  }

  protected _checkIfEntityValidByDeleted(entity: any, options?: IModelMethodOptionsGeneral) {
    const deleted = this._prepareDisableDeletedByOptionsSimple(options);
    return isNil(deleted) || Boolean(entity.deleted) === Boolean(deleted);
  }

  protected _checkDisableInstanceByOptions(_options?: IModelMethodOptionsGeneral) {
    return this.disableInstance;
  }

  protected _checkDisableDeletedByOptions(options?: IModelMethodOptionsGeneral) {
    if (this.disableDeleted) return true;
    return options?.disableDeleted ?? this.disableDeleted;
  }

  protected _checkDisableCreateTimeByOptions(options?: IModelUpdateOptionsGeneral<TRecord>) {
    return options?.disableCreateTime ?? this.disableCreateTime;
  }

  protected _checkDisableUpdateTimeByOptions(options?: IModelUpdateOptionsGeneral<TRecord>) {
    return options?.disableUpdateTime ?? this.disableUpdateTime;
  }

  public newInstance(
    client?: keyof IDatabaseClientRecord | ServiceDb,
    table?: TypeModelOptionsTable,
  ): this {
    return this.app.bean._newBean(this.$beanFullName as any, client ?? this.db, table);
  }

  public newInstanceTarget<MODEL extends BeanModelMeta | keyof IModelClassRecord>(
    modelClassTarget: TypeModelClassLike<MODEL>,
    client?: TypeModelRelationOptionsMetaClient,
    table?: TypeModelOptionsTable,
  ): BeanModelMeta {
    const modelClass2 = prepareClassModel(modelClassTarget);
    const beanOptions = appResource.getBean(modelClass2);
    const beanFullName = beanOptions!.beanFullName;
    const options = beanOptions?.options as IDecoratorModelOptions | undefined;
    // client
    if (isNil(client) || client === '_auto_') {
      client = options?.client ? '_initial_' : '_inherit_';
    }
    if (client === '_initial_') {
      return this.app.bean._newBean(beanFullName as any, undefined, table);
    } else if (client === '_inherit_') {
      client = this.db;
    }
    return this.app.bean._newBean(beanFullName as any, client ?? this.db, table);
  }
}

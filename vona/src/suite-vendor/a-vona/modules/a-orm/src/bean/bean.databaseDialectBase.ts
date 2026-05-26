import type { Knex } from 'knex';
import type { TableIdentity } from 'table-identity';

import { isNil, safeBoolean } from '@cabloy/utils';
import { BeanBase, Virtual } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { ITableColumn } from '../types/columns.ts';
import type { ConfigDatabaseClient } from '../types/config.ts';
import type {
  IDatabaseDialectCapabilities,
  IFetchDatabasesResultItem,
  IFetchIndexesResultItem,
  TypeDatabaseDialectTableColumnsFn,
} from '../types/dialect.ts';

@Bean()
@Virtual()
export class BeanDatabaseDialectBase extends BeanBase {
  protected _capabilities?: IDatabaseDialectCapabilities;
  protected _configBase?: Partial<ConfigDatabaseClient>;

  get capabilities() {
    if (!this._capabilities) throw new Error('Should provide dialect capabilities');
    return this._capabilities;
  }

  get configBase() {
    return this._configBase;
  }

  async fetchDatabases(
    _schemaBuilder: Knex.SchemaBuilder,
    _databasePrefix: string,
  ): Promise<IFetchDatabasesResultItem[]> {
    throw new Error('Not Implemented');
  }

  async createDatabase(_schemaBuilder: Knex.SchemaBuilder, _databaseName: string): Promise<string> {
    throw new Error('Not Implemented');
  }

  async dropDatabase(_schemaBuilder: Knex.SchemaBuilder, _databaseName: string): Promise<void> {
    throw new Error('Not Implemented');
  }

  async fetchIndexes(
    _schemaBuilder: Knex.SchemaBuilder,
    _tableName: string,
  ): Promise<IFetchIndexesResultItem[]> {
    throw new Error('Not Implemented');
  }

  async insert(
    _builder: Knex.QueryBuilder,
    _datas: any[],
  ): Promise<[TableIdentity[], Knex.QueryBuilder]> {
    throw new Error('Not Implemented');
  }

  async select(
    _builder: Knex.QueryBuilder,
    datas: any[],
    _fn: TypeDatabaseDialectTableColumnsFn,
  ): Promise<any[]> {
    return datas;
  }

  query(_result) {
    throw new Error('Not Implemented');
  }

  async viewDependents(_builder: Knex.QueryBuilder, _viewName: string): Promise<string[]> {
    throw new Error('Not Implemented');
  }

  coerceColumn(column: Knex.ColumnInfo): ITableColumn {
    // result
    const result = { type: column.type } as ITableColumn;
    // coerce
    result.default = this._coerceColumnValue(column.type, column.defaultValue);
    // ok
    return result;
  }

  protected async selectAsSqlite3(
    _builder: Knex.QueryBuilder,
    datas: any[],
    fn: TypeDatabaseDialectTableColumnsFn,
  ): Promise<any[]> {
    const columns = await fn();
    // data
    for (const data of datas) {
      for (const columnName in columns) {
        const column = columns[columnName];
        if (Object.prototype.hasOwnProperty.call(data, columnName)) {
          const value = data[columnName];
          if (column.type === 'json' && !isNil(value) && typeof value === 'string') {
            data[columnName] = JSON.parse(value);
          } else if (column.type === 'datetime' && !isNil(value)) {
            data[columnName] = new Date(value);
          }
        }
      }
    }
    return datas;
  }

  protected async insertAsMysql(
    builder: Knex.QueryBuilder,
    datas: any[],
  ): Promise<[TableIdentity[], Knex.QueryBuilder]> {
    if (datas.length === 0) return [[], builder];
    if (isNil(datas[0].id)) {
      let builderFirst: Knex.QueryBuilder | undefined = undefined;
      const ids: TableIdentity[] = [];
      for (const data of datas) {
        const builder2 = builder.clone();
        builder2.insert(data);
        const items = await builder2;
        ids.push(items[0]);
        if (!builderFirst) builderFirst = builder2;
      }
      return [ids, builderFirst ?? builder];
    } else {
      builder.insert(datas);
      await builder;
      return [datas.map(item => item.id), builder];
    }
  }

  protected async insertAsPg(
    builder: Knex.QueryBuilder,
    datas: any[],
  ): Promise<[TableIdentity[], Knex.QueryBuilder]> {
    if (datas.length === 0) return [[], builder];
    if (isNil(datas[0].id)) {
      builder.insert(datas).returning('id');
      const items = await builder;
      return [items.map(item => item.id), builder];
    } else {
      builder.insert(datas);
      await builder;
      return [datas.map(item => item.id), builder];
    }
  }

  protected _coerceColumnValue(type: string, value) {
    // null
    if (isNil(value)) return undefined;
    // type
    if (['bit', 'bool', 'boolean'].includes(type)) return safeBoolean(value);
    if (['int'].includes(type)) return this._safeNumber(value);
    if (this._columnTypePrefixes(type, ['timestamp']) && value === 'CURRENT_TIMESTAMP')
      return undefined; // new Date();
    if (this._columnTypePrefixes(type, ['float', 'double'])) return this._safeNumber(value);
    if (
      this._columnTypePrefixes(type, [
        'tinyint',
        'smallint',
        'mediumint',
        'bigint',
        'numeric',
        'integer',
      ])
    ) {
      return this._safeNumber(value);
    }
    // pg: NULL::character varying
    if (value.indexOf('NULL::') === 0) return undefined;
    // others
    return value;
  }

  // pg: nextval
  protected _safeNumber(value) {
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }

  protected _columnTypePrefixes(type: string, prefixes: string[]) {
    return prefixes.some(prefix => type.includes(prefix));
  }
}

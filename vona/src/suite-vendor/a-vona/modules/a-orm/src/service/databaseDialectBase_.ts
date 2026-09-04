import type { Knex } from 'knex';
import type { TableIdentity } from 'table-identity';

import { isNil, safeBoolean } from '@cabloy/utils';
import { BeanBase, Virtual } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ITableColumn } from '../types/columns.ts';
import type { ConfigDatabaseClient } from '../types/config.ts';
import type {
  IDatabaseDialectCapabilities,
  IFetchDatabasesResultItem,
  IFetchIndexesResultItem,
  TypeDatabaseDialectTableColumnsFn,
} from '../types/dialect.ts';

const BOOLEAN_COLUMN_TYPES = ['bit', 'bool', 'boolean'];
const INTEGER_COLUMN_TYPES = ['tinyint', 'smallint', 'mediumint', 'int', 'integer'];
const FLOAT_COLUMN_TYPES = ['float', 'double'];
const GENERATED_DEFAULT_PATTERN =
  /^(?:current_timestamp\b(?:\s*\(\s*\d*\s*\))?|current_date\b|current_time\b(?:\s*\(\s*\d*\s*\))?|now\s*\(\s*\)|nextval\s*\()/i;
const NUMBER_LITERAL_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const QUOTED_LITERAL_PATTERN = /^'((?:''|[^'])*)'$/;

type ColumnDefaultLiteral =
  | { kind: 'string'; value: string }
  | { kind: 'boolean'; value: boolean }
  | { kind: 'number'; value: string };

@Service()
@Virtual()
export class ServiceDatabaseDialectBase extends BeanBase {
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

  async fetchColumns(
    connection: Knex,
    tableName: string,
  ): Promise<Record<string, Knex.ColumnInfo>> {
    return await connection(tableName).columnInfo();
  }

  query(_result) {
    throw new Error('Not Implemented');
  }

  async viewDependents(_builder: Knex.QueryBuilder, _viewName: string): Promise<string[]> {
    throw new Error('Not Implemented');
  }

  coerceColumn(column: Knex.ColumnInfo): ITableColumn {
    const result = { type: column.type } as ITableColumn;
    const columnType = (column as Knex.ColumnInfo & { columnType?: string }).columnType;
    if (columnType) result.columnType = columnType;
    result.default = this._coerceColumnValue(result, column.defaultValue);
    return result;
  }

  protected _isMysqlBooleanColumn(column: Pick<ITableColumn, 'columnType'>) {
    return column.columnType?.trim().toLowerCase() === 'tinyint(1)';
  }

  protected async selectAsMysql(
    _builder: Knex.QueryBuilder,
    datas: any[],
    fn: TypeDatabaseDialectTableColumnsFn,
  ): Promise<any[]> {
    const columns = await fn();
    for (const data of datas) {
      for (const columnName in columns) {
        const column = columns[columnName];
        if (
          Object.prototype.hasOwnProperty.call(data, columnName) &&
          this._isMysqlBooleanColumn(column)
        ) {
          const value = data[columnName];
          if (!isNil(value)) data[columnName] = safeBoolean(value);
        }
      }
    }
    return datas;
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
          if (BOOLEAN_COLUMN_TYPES.includes(column.type) && !isNil(value)) {
            data[columnName] = safeBoolean(value);
          } else if (column.type === 'json' && !isNil(value) && typeof value === 'string') {
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
    if (!isNil(datas[0].id)) {
      builder.insert(datas);
      await builder;
      return [datas.map(item => item.id), builder];
    }

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
  }

  protected async insertAsPg(
    builder: Knex.QueryBuilder,
    datas: any[],
  ): Promise<[TableIdentity[], Knex.QueryBuilder]> {
    if (datas.length === 0) return [[], builder];
    if (!isNil(datas[0].id)) {
      builder.insert(datas);
      await builder;
      return [datas.map(item => item.id), builder];
    }

    builder.insert(datas).returning('id');
    const items = await builder;
    return [items.map(item => item.id), builder];
  }

  protected _coerceColumnValue(column: Pick<ITableColumn, 'type' | 'columnType'>, value: unknown) {
    if (isNil(value)) return undefined;
    if (typeof value !== 'string') {
      return this._isBooleanColumn(column) ? safeBoolean(value as any) : value;
    }

    const literal = this._coerceColumnLiteral(value);
    if (literal === undefined) return undefined;
    if (this._isBooleanColumn(column)) return safeBoolean(literal.value);
    if (literal.kind === 'boolean') return literal.value;

    const type = this._columnTypeName(column.type);
    if (literal.kind === 'string') return literal.value;
    if (INTEGER_COLUMN_TYPES.includes(type)) return this._safeInteger(literal.value);
    if (FLOAT_COLUMN_TYPES.includes(type)) return this._safeNumber(literal.value);
    return literal.value;
  }

  protected _isBooleanColumn(column: Pick<ITableColumn, 'type' | 'columnType'>) {
    return (
      this._isMysqlBooleanColumn(column) ||
      BOOLEAN_COLUMN_TYPES.includes(this._columnTypeName(column.type))
    );
  }

  protected _columnTypeName(type: string) {
    return type.trim().toLowerCase().match(/^\w+/)?.[0] ?? '';
  }

  protected _coerceColumnLiteral(value: string): ColumnDefaultLiteral | undefined {
    const literal = this._unwrapColumnDefault(value);
    if (literal === '') return undefined;
    const literalLower = literal.toLowerCase();
    if (literalLower === 'null' || GENERATED_DEFAULT_PATTERN.test(literal)) return undefined;
    const quoted = literal.match(QUOTED_LITERAL_PATTERN);
    if (quoted) return { kind: 'string', value: quoted[1].replaceAll("''", "'") };
    if (literalLower === 'true' || literalLower === 't') return { kind: 'boolean', value: true };
    if (literalLower === 'false' || literalLower === 'f') return { kind: 'boolean', value: false };
    if (NUMBER_LITERAL_PATTERN.test(literal)) return { kind: 'number', value: literal };
    if (this._isExpressionColumnDefault(literal)) return undefined;
    return { kind: 'string', value: literal };
  }

  protected _unwrapColumnDefault(value: string) {
    let literal = value.trim();
    while (literal.startsWith('(') && literal.endsWith(')')) {
      const inner = literal.slice(1, -1).trim();
      if (!inner || !this._isColumnDefaultBalanced(inner)) break;
      literal = inner;
    }
    const castIndex = literal.indexOf('::');
    if (castIndex > 0 && this._isScalarColumnDefault(literal.slice(0, castIndex).trim())) {
      literal = literal.slice(0, castIndex).trim();
    }
    return literal;
  }

  protected _isScalarColumnDefault(value: string) {
    return (
      value.toLowerCase() === 'null' ||
      QUOTED_LITERAL_PATTERN.test(value) ||
      value.toLowerCase() === 'true' ||
      value.toLowerCase() === 'false' ||
      NUMBER_LITERAL_PATTERN.test(value)
    );
  }

  protected _isColumnDefaultBalanced(value: string) {
    let depth = 0;
    let quoted = false;
    for (let index = 0; index < value.length; index++) {
      const char = value[index];
      if (char === "'") {
        if (quoted && value[index + 1] === "'") {
          index++;
        } else {
          quoted = !quoted;
        }
      } else if (!quoted && char === '(') {
        depth++;
      } else if (!quoted && char === ')') {
        if (depth === 0) return false;
        depth--;
      }
    }
    return !quoted && depth === 0;
  }

  protected _isExpressionColumnDefault(value: string) {
    return /[()*/+\-\s]/.test(value);
  }

  protected _safeInteger(value: string) {
    const num = Number(value);
    return Number.isSafeInteger(num) ? num : value;
  }

  protected _safeNumber(value: string) {
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  }
}

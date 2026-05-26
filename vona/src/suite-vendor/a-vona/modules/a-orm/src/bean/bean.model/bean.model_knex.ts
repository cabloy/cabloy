import type { Knex } from 'knex';

import type { IModelMethodOptionsGeneral, ITableRecord } from '../../types/index.ts';

import { BeanModelUtils } from './bean.model_utils.ts';

export class BeanModelKnex<TRecord extends {}> extends BeanModelUtils<TRecord> {
  get schema(): Knex.SchemaBuilder {
    return this.connection.schema;
  }

  builder<TRecord2 extends {} = TRecord, TResult2 = TRecord2>(
    table?: Knex.TableDescriptor,
  ): Knex.QueryBuilder<TRecord2, TResult2[]> {
    // table
    table = table || this.getTable(undefined);
    if (table) {
      return this.connection(table);
    }
    return this.connection.queryBuilder<TRecord2, TResult2[]>();
  }

  builderSelect<TRecord2 extends {} = TRecord, TResult2 = TRecord2>(
    options?: IModelMethodOptionsGeneral,
  ): Knex.QueryBuilder<TRecord2, TResult2[]>;
  builderSelect<TRecord2 extends {} = TRecord, TResult2 = TRecord2>(
    table: keyof ITableRecord,
    options?: IModelMethodOptionsGeneral,
  ): Knex.QueryBuilder<TRecord2, TResult2[]>;
  builderSelect<TRecord2 extends {} = TRecord, TResult2 = TRecord2>(
    table?,
    options?,
  ): Knex.QueryBuilder<TRecord2, TResult2[]> {
    if (typeof table !== 'string') {
      options = table;
      table = undefined;
    }
    // table
    table = table || this.getTable(undefined);
    if (!table) return this.scopeOrm.error.ShouldSpecifyTable.throw();
    // builder
    const builder = this.builder<TRecord2, TResult2>(table);
    // where
    this.prepareWhere(builder, table, {}, options);
    // ready
    return builder;
  }

  async query(value: Knex.Value): Promise<TRecord[]>;
  async query(sql: string, binding: Knex.RawBinding): Promise<TRecord[]>;
  async query(
    sql: string,
    bindings: readonly Knex.RawBinding[] | Knex.ValueDict,
  ): Promise<TRecord[]>;
  async query(sql, bindings?): Promise<TRecord[]> {
    const raw = this.connection.raw(sql, bindings);
    const result = await raw;
    // dialect
    return this.dialect.query(result) as unknown as TRecord[];
  }

  async queryOne(value: Knex.Value): Promise<TRecord | undefined>;
  async queryOne(sql: string, binding: Knex.RawBinding): Promise<TRecord | undefined>;
  async queryOne(
    sql: string,
    bindings: readonly Knex.RawBinding[] | Knex.ValueDict,
  ): Promise<TRecord | undefined>;
  async queryOne(sql, bindings?): Promise<TRecord | undefined> {
    const res = await this.query(sql, bindings);
    if (!res[0]) return undefined;
    return res[0];
  }
}

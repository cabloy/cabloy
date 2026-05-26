import type { Knex } from 'knex';
import type { TableIdentity } from 'table-identity';
import type {
  ConfigDatabaseClient,
  IDatabaseDialectCapabilities,
  IDecoratorDatabaseDialectOptions,
  IFetchDatabasesResultItem,
  IFetchIndexesResultItem,
} from 'vona-module-a-orm';

import { BeanDatabaseDialectBase, DatabaseDialect } from 'vona-module-a-orm';

export interface IDatabaseDialectOptionsPg extends IDecoratorDatabaseDialectOptions {}

@DatabaseDialect<IDatabaseDialectOptionsPg>()
export class DatabaseDialectPg extends BeanDatabaseDialectBase {
  protected _capabilities: IDatabaseDialectCapabilities = {
    like: true,
    ilike: true,
    level: true,
  };

  protected _configBase?: Partial<ConfigDatabaseClient> = undefined;

  async fetchDatabases(
    schemaBuilder: Knex.SchemaBuilder,
    databasePrefix: string,
  ): Promise<IFetchDatabasesResultItem[]> {
    const res: any = await schemaBuilder.raw(
      `select datname from pg_database where datname like '${databasePrefix}%'`,
    );
    let dbs = res.rows;
    dbs = dbs.map(db => {
      return { name: db.datname };
    });
    return dbs;
  }

  async createDatabase(schemaBuilder: Knex.SchemaBuilder, databaseName: string): Promise<string> {
    await schemaBuilder.raw(`CREATE DATABASE "${databaseName}" encoding=UTF8`);
    return databaseName;
  }

  async dropDatabase(schemaBuilder: Knex.SchemaBuilder, databaseName: string): Promise<void> {
    await schemaBuilder.raw(`DROP DATABASE "${databaseName}"`);
  }

  async fetchIndexes(
    schemaBuilder: Knex.SchemaBuilder,
    tableName: string,
  ): Promise<IFetchIndexesResultItem[]> {
    const res: any = await schemaBuilder.raw(
      `select indexname,indexdef from pg_indexes where tablename='${tableName}'`,
    );
    let items = res.rows;
    items = items.map(item => {
      return {
        indexName: item.indexname,
      };
    });
    return items;
  }

  async insert(
    builder: Knex.QueryBuilder,
    datas: any[],
  ): Promise<[TableIdentity[], Knex.QueryBuilder]> {
    return await this.insertAsPg(builder, datas);
  }

  query(result) {
    return result.rows;
  }

  async viewDependents(builder: Knex.QueryBuilder, viewName: string): Promise<string[]> {
    const sqlViews = `
      select
          ref_nsp.nspname ref_schema, ref_cl.relname ref_name,
          rwr_cl.relkind dep_type,
          rwr_nsp.nspname dep_schema,
          rwr_cl.relname dep_name
        from pg_depend dep
          join pg_class ref_cl on dep.refobjid = ref_cl.oid
          join pg_namespace ref_nsp on ref_cl.relnamespace = ref_nsp.oid
          join pg_rewrite rwr on dep.objid = rwr.oid
          join pg_class rwr_cl on rwr.ev_class = rwr_cl.oid
          join pg_namespace rwr_nsp on rwr_cl.relnamespace = rwr_nsp.oid
        where
          dep.deptype = 'n'
          and dep.classid = 'pg_rewrite'::regclass
    `;
    let items = await builder
      .distinct('dep_name')
      .fromRaw(`(${sqlViews}) as depend_view`)
      .where({ ref_name: viewName });
    items = items.map(item => item.dep_name);
    items = items.filter((item: string) => item.toLowerCase() !== viewName.toLowerCase());
    return items;
  }
}

import type { Knex } from 'knex';
import type { TableIdentity } from 'table-identity';
import type {
  ConfigDatabaseClient,
  IDatabaseDialectCapabilities,
  IDecoratorDatabaseDialectOptions,
  IFetchDatabasesResultItem,
  IFetchIndexesResultItem,
  TypeDatabaseDialectTableColumnsFn,
} from 'vona-module-a-orm';

import { ensureDir, remove } from 'fs-extra';
import { globby } from 'globby';
import path from 'node:path';
import { BeanDatabaseDialectBase, DatabaseDialect } from 'vona-module-a-orm';

export interface IDatabaseDialectOptionsBetterSqlite3 extends IDecoratorDatabaseDialectOptions {}

@DatabaseDialect<IDatabaseDialectOptionsBetterSqlite3>()
export class DatabaseDialectBetterSqlite3 extends BeanDatabaseDialectBase {
  protected _capabilities: IDatabaseDialectCapabilities = {
    like: true,
    ilike: false,
    level: false,
  };

  protected _configBase?: Partial<ConfigDatabaseClient> = {
    useNullAsDefault: true,
    pool: {
      afterCreate(conn, done) {
        sqlite3_afterCreate(conn).then(done).catch(done);
      },
    },
  };

  async fetchDatabases(
    _schemaBuilder: Knex.SchemaBuilder,
    databasePrefix: string,
  ): Promise<IFetchDatabasesResultItem[]> {
    const dbDir = this._getDbDir();
    const files = await globby(`${databasePrefix}*.db`, {
      cwd: dbDir,
      onlyFiles: true,
    });
    return files.map(item => {
      return { name: path.join(dbDir, item) };
    });
  }

  async createDatabase(_schemaBuilder: Knex.SchemaBuilder, databaseName: string): Promise<string> {
    const dbDir = this._getDbDir();
    await ensureDir(dbDir);
    return path.join(dbDir, `${databaseName}.db`);
  }

  async dropDatabase(_schemaBuilder: Knex.SchemaBuilder, databaseName: string): Promise<void> {
    await remove(databaseName);
    for (const part of ['shm', 'wal', 'journal']) {
      await remove(`${databaseName}-${part}`);
    }
  }

  async fetchIndexes(
    schemaBuilder: Knex.SchemaBuilder,
    tableName: string,
  ): Promise<IFetchIndexesResultItem[]> {
    let items: any = await schemaBuilder.raw(`PRAGMA index_list(${tableName})`);
    items = items.map(item => {
      return {
        indexName: item.name,
      };
    });
    return items;
  }

  async insert(
    builder: Knex.QueryBuilder,
    datas: any[],
  ): Promise<[TableIdentity[], Knex.QueryBuilder]> {
    return await this.insertAsMysql(builder, datas);
  }

  async select(
    builder: Knex.QueryBuilder,
    datas: any[],
    fn: TypeDatabaseDialectTableColumnsFn,
  ): Promise<any[]> {
    return await this.selectAsSqlite3(builder, datas, fn);
  }

  query(result) {
    return result;
  }

  private _getDbDir() {
    return path.join(this.app.projectPath, '.app/sqlite3');
  }
}

async function sqlite3_afterCreate(conn) {
  const pragma: { journal_mode: string }[] = conn.pragma('journal_mode');
  if (pragma[0]?.journal_mode?.toLocaleLowerCase() !== 'wal') {
    conn.pragma('journal_mode = wal');
  }
}

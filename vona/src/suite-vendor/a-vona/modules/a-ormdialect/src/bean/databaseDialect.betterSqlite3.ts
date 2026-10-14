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
import { lstat } from 'node:fs/promises';
import path from 'node:path';
import { assertTestRunOwner, resolveVonaLocalPaths, resolveTestRunId } from 'vona';
import { ServiceDatabaseDialectBase, DatabaseDialect } from 'vona-module-a-orm';

export interface IDatabaseDialectOptionsBetterSqlite3 extends IDecoratorDatabaseDialectOptions {}

@DatabaseDialect<IDatabaseDialectOptionsBetterSqlite3>()
export class DatabaseDialectBetterSqlite3 extends ServiceDatabaseDialectBase {
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
    const isolated = resolveTestRunId(
      this.app.meta.env.META_MODE,
      this.app.meta.env.VONA_TEST_RUN_ID,
    );
    if (isolated) {
      const paths = resolveVonaLocalPaths(this.app.projectPath, 'test', isolated);
      assertTestRunOwner(paths.dataRoot, isolated);
      const basename = path.basename(databaseName);
      if (
        path.resolve(databaseName) !== path.join(paths.sqliteRoot, basename) ||
        !/^vona-test-[\w-]+-\d{8}-\d{6}\.db$/.test(basename)
      ) {
        throw new Error(
          `Isolated test cannot remove SQLite database outside its owned root: ${databaseName}`,
        );
      }
      await assertNotSymlink(paths.sqliteRoot);
      for (const file of [
        databaseName,
        ...['shm', 'wal', 'journal'].map(part => `${databaseName}-${part}`),
      ]) {
        await assertNotSymlink(file);
      }
    }
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
    return resolveVonaLocalPaths(
      this.app.projectPath,
      this.app.meta.env.META_MODE,
      this.app.meta.env.VONA_TEST_RUN_ID,
    ).sqliteRoot;
  }
}

async function assertNotSymlink(file: string) {
  try {
    if ((await lstat(file)).isSymbolicLink()) {
      throw new Error(`Isolated test SQLite path is a symlink: ${file}`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

async function sqlite3_afterCreate(conn) {
  conn.pragma('busy_timeout = 5000');
  const pragma: { journal_mode: string }[] = conn.pragma('journal_mode');
  if (pragma[0]?.journal_mode?.toLocaleLowerCase() !== 'wal') {
    conn.pragma('journal_mode = wal');
  }
}

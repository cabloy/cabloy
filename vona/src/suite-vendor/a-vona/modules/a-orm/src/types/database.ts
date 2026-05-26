import type { FunctionAny } from 'vona';

import type { BeanModel } from '../bean/bean.model.ts';
import type { ServiceDb } from '../service/db_.ts';
import type { ConfigDatabase } from './config.ts';

export interface IDbInfo {
  level: number;
  clientName: keyof IDatabaseClientRecord;
}

export interface IDatabaseClientRecord {
  default: never;
  sqlite3: never;
  pg: never;
  mysql: never;
}

export interface IDatabaseClientDialectRecord {
  'better-sqlite3': never;
  'pg': never;
  'mysql': never;
  'mysql2': never;
}

export interface IDatabaseSwitchOptions {
  clientName?: keyof IDatabaseClientRecord;
}

declare module 'vona' {
  export interface IBeanRecordGlobal {
    model: BeanModel;
  }

  export interface VonaConfig {
    database: ConfigDatabase;
  }

  export interface VonaContext {
    get db(): ServiceDb;
    commit(cb: FunctionAny): void;
    commitsDone(): Promise<void>;
  }

  export interface VonaConfigEnv {
    // default
    DATABASE_DEFAULT_CLIENT: string | undefined;
    // sqlite3
    DATABASE_CLIENT_SQLITE3_FILENAME: string | undefined;
    DATABASE_CLIENT_SQLITE3_NATIVEBINDING: string | 'true' | 'false' | undefined;
    // pg
    DATABASE_CLIENT_PG_HOST: string | undefined;
    DATABASE_CLIENT_PG_PORT: string | undefined;
    DATABASE_CLIENT_PG_USER: string | undefined;
    DATABASE_CLIENT_PG_PASSWORD: string | undefined;
    DATABASE_CLIENT_PG_DATABASE: string | undefined;
    // mysql
    DATABASE_CLIENT_MYSQL_HOST: string | undefined;
    DATABASE_CLIENT_MYSQL_PORT: string | undefined;
    DATABASE_CLIENT_MYSQL_USER: string | undefined;
    DATABASE_CLIENT_MYSQL_PASSWORD: string | undefined;
    DATABASE_CLIENT_MYSQL_DATABASE: string | undefined;
  }
}

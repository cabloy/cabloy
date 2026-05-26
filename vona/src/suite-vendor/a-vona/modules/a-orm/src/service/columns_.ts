import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { ITableColumns, ITableColumnsDefault } from '../types/columns.ts';
import type { ServiceDb } from './db_.ts';

import { ServiceColumnsCache } from './columnsCache_.ts';

@Service()
export class ServiceColumns extends BeanBase {
  private _db: ServiceDb;
  private _serviceColumnsCache: ServiceColumnsCache;

  protected __init__(db: ServiceDb) {
    this._db = db;
  }

  private get db() {
    return this._db;
  }

  private get serviceColumnsCache() {
    if (!this._serviceColumnsCache) {
      const clientNameReal = this.scope.service.database.prepareClientNameReal(this.db.clientName);
      this._serviceColumnsCache = this.bean._getBeanSelector(ServiceColumnsCache, clientNameReal);
    }
    return this._serviceColumnsCache;
  }

  async columns(tableName?: string): Promise<ITableColumns> {
    if (!tableName) return {};
    let columns = this.serviceColumnsCache.getColumnsCache(tableName);
    if (!columns) {
      const dialect = this.db.dialect;
      const connection = this.db.connection;
      const map = await connection(tableName).columnInfo();
      columns = {};
      for (const name in map) {
        columns[name] = dialect.coerceColumn(map[name]);
      }
      this.serviceColumnsCache.setColumnsCache(tableName, columns);
    }
    return columns;
  }

  async defaultData(tableName?: string): Promise<ITableColumnsDefault> {
    if (!tableName) return {};
    let data = this.serviceColumnsCache.getColumnsDefaultCache(tableName);
    if (!data) {
      data = {};
      // columns
      const columns = await this.columns(tableName);
      for (const columnName in columns) {
        data[columnName] = columns[columnName].default;
      }
      this.serviceColumnsCache.setColumnsDefaultCache(tableName, data);
    }
    return data;
  }

  columnsClear(tableName?: string) {
    return this.scope.service.database.columnsClear(this.db.clientName, tableName);
  }
}

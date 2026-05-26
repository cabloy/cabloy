import type { FunctionAsync } from 'vona';
import type { IDatabaseClientRecord } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IDatashardingSwitchOptions } from '../types/datasharding.ts';

@Bean()
export class BeanDatasharding extends BeanBase {
  async switchDatasource<RESULT>(
    fn: FunctionAsync<RESULT>,
    options?: IDatashardingSwitchOptions,
  ): Promise<RESULT> {
    // config
    const configClient = this.scope.config.client;
    if (configClient.reads.length === 0 && configClient.writes.length === 0) return await fn();
    // check
    const clientName = await this._checkDatasourceType(options);
    if (!clientName) return await fn();
    // switch
    return await this.bean.database.switchDb(fn, clientName);
  }

  private async _checkDatasourceType(
    options?: IDatashardingSwitchOptions,
  ): Promise<keyof IDatabaseClientRecord | undefined> {
    let datasourceType = options?.datasourceType ?? 'auto';
    if (datasourceType === 'auto') {
      // 1. innerAccess/inTransaction
      if (this.ctx.innerAccess || this.bean.database.current.inTransaction) return;
      // 2. ctx.method
      const isMethodsForWrite = this.scope.config.check.methodsForWrite.includes(this.ctx.method);
      datasourceType = isMethodsForWrite ? 'write' : 'read';
    }
    // write
    if (datasourceType === 'write') {
      if (this.bean.database.current.inTransaction) return;
      return await this._checkDatasourceType_write(options);
    }
    // read
    if (datasourceType === 'read') {
      return await this._checkDatasourceType_read(options);
    }
  }

  private async _checkDatasourceType_write(options?: IDatashardingSwitchOptions) {
    let clientName = await this._getSummerCacheDatasourceWrite(true, options);
    if (clientName) return clientName;
    clientName = this.scope.service.datasharding.getRandomWrite();
    await this._setSummerCacheDatasourceWrite(clientName, options);
    return clientName;
  }

  private async _checkDatasourceType_read(options?: IDatashardingSwitchOptions) {
    let clientName = await this._getSummerCacheDatasourceWrite(false, options);
    if (clientName) return clientName;
    clientName = this.scope.service.datasharding.getRandomRead();
    return clientName;
  }

  private async _getSummerCacheDatasourceWrite(
    updateAgeOnGet: boolean,
    options?: IDatashardingSwitchOptions,
  ) {
    if (!options?.cacheDatasourceWrite) return;
    if (!this.bean.passport.isAuthenticated) return;
    return await this.scope.summerCache.datasourceWrite.get(this.bean.passport.currentUser?.id, {
      updateAgeOnGet,
    });
  }

  private async _setSummerCacheDatasourceWrite(
    clientName: keyof IDatabaseClientRecord,
    options?: IDatashardingSwitchOptions,
  ) {
    if (!options?.cacheDatasourceWrite) return;
    if (!this.bean.passport.isAuthenticated) return;
    return await this.scope.summerCache.datasourceWrite.set(
      clientName,
      this.bean.passport.currentUser?.id,
    );
  }
}

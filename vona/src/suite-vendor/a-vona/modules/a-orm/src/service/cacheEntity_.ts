import type { TableIdentity } from 'table-identity';

import { Service } from 'vona-module-a-bean';

import type { BeanModelCache } from '../bean/bean.model/bean.model_cache.ts';
import type { ITableRecord } from '../types/onion/table.ts';

import { ModelCacheBase } from '../lib/modelCacheBase.ts';

@Service()
export class ServiceCacheEntity extends ModelCacheBase {
  protected __init__(model: BeanModelCache) {
    super.__init__(model, 'entity');
  }

  public async clear(table?: keyof ITableRecord) {
    if (!this.enabled) return;
    table = table || this._model.getTable(undefined);
    const cache = this.getInstance(table);
    await cache.clear();
  }

  public async del(id: TableIdentity | TableIdentity[], table?: keyof ITableRecord) {
    if (!this.enabled) return;
    table = table || this._model.getTable(undefined);
    const cache = this.getInstance(table);
    if (Array.isArray(id)) {
      await cache.mdel(id);
    } else {
      await cache.del(id);
    }
  }

  public get keysAux() {
    return this._model.options.cache?.keysAux;
  }
}

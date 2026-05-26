import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { appResource, BeanBase, cast, deepExtend } from 'vona';
import { Meta } from 'vona-module-a-meta';

import type {
  IMetaIndexExecute,
  IMetaOptionsIndex,
  MetaOptionsIndexModuleIndexes,
} from '../types/indexes.ts';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(_options: IMetaVersionUpdateOptions) {
    if (!this.scope.config.indexesCheck) return;
    for (const module of this.app.meta.modulesArray) {
      const beanFullName = `${module.info.relativeName}.meta.index`;
      const beanOptions = appResource.getBean(beanFullName);
      const indexOptions = cast<IMetaOptionsIndex>(beanOptions?.options);
      const moduleIndexesFromMeta = indexOptions?.indexes;
      const moduleIndexesFromConfig = this.scope.config.indexes[module.info.relativeName];
      // config>meta
      const moduleIndexes: MetaOptionsIndexModuleIndexes = deepExtend(
        {},
        moduleIndexesFromMeta,
        moduleIndexesFromConfig,
      );
      // execute
      if (beanOptions) {
        const beanIndex = this.bean._getBean<IMetaIndexExecute>(beanFullName as any);
        if (beanIndex.execute) {
          const res = await beanIndex.execute(indexOptions);
          if (res) continue;
        }
      }
      // loop
      for (const tableName in moduleIndexes) {
        await this._createIndexesOnTable(tableName, moduleIndexes[tableName]);
      }
    }
  }

  private async _createIndexesOnTable(tableName: string, indexes: string | string[] | undefined) {
    if (!indexes) return;
    const dialectName = this.bean.database.current.dialectName;
    const indexPrefix = `idx_${tableName}_`;
    try {
      const _indexArray = Array.isArray(indexes) ? indexes : indexes.split(',');
      const list = await this.bean.model.schema.fetchIndexes(tableName);
      const map: Record<string, boolean> = {};
      for (const item of list) {
        const indexName = item.indexName;
        const columnName = indexName.substring(indexPrefix.length);
        map[columnName] = true;
      }
      for (const _index of _indexArray) {
        const _arr = _index.split(':');
        const fieldNames = _arr[0];
        const fieldNameArray = fieldNames.split('+');
        const fieldNameFirst = fieldNameArray[0];
        const indexType = _arr[1] || undefined;
        if (indexType === 'fulltext' && ['pg'].includes(dialectName)) {
          continue;
        }
        if (!map[fieldNameFirst]) {
          const indexName = `${indexPrefix}${fieldNameFirst}`;
          await this.bean.model.schema.alterTable(tableName, table => {
            table.index(fieldNameArray, indexName, indexType);
          });
          // too long
          // const sql = `create ${indexType} index idx_${tableName}_${fieldNameArray.join('_')} ON ${tableName} (${fieldNameArray.join(',')})`;
        }
      }
    } catch (e: any) {
      // just log the error message
      this.$logger.error(e.message);
      if (e.sql) this.$logger.error(e.sql);
    }
  }
}

import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // aDatasource
      const entity = this.scope.entity.datasource;
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFieldsSimple();
        table.string(entity.name, 255);
        table.text(entity.description);
        table.json(entity.config);
      });
    }
  }
}

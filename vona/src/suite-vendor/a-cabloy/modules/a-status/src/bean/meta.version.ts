import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // aStatus
      const entity = this.scope.entity.status;
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFieldsSimple();
        table.string(entity.module, 255);
        table.string(entity.name, 255);
        table.json(entity.value);
      });
    }
  }
}
